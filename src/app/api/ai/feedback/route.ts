import { NextResponse } from "next/server";
import { getAuthClient, authenticateRequest, getGeminiKey, callGemini } from "@/lib/gemini";
import { CLIMATE_STRATEGIES, THINKING_STRATEGIES } from "@/lib/focus-strategies";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

// Completa la pauta de acompañamiento a partir de un relato hablado (o escrito)
// del orientador: transcribe, marca los indicadores Sí/No que quedaron
// respaldados por el relato y redacta la evidencia y las sugerencias.

const MAX_AUDIO_BYTES = 8 * 1024 * 1024;

const arrayBufferToBase64 = (buf: ArrayBuffer) => Buffer.from(buf).toString("base64");

const audioMimeFor = (file: File) => {
  const type = (file.type || "").toLowerCase();
  if (type.startsWith("audio/")) return type.split(";")[0];
  const name = (file.name || "").toLowerCase();
  if (name.endsWith(".m4a")) return "audio/mp4";
  if (name.endsWith(".mp3")) return "audio/mpeg";
  if (name.endsWith(".wav")) return "audio/wav";
  if (name.endsWith(".ogg")) return "audio/ogg";
  return "audio/webm";
};

const asStringArray = (value: unknown, allowed: string[]) => {
  if (!Array.isArray(value)) return [];
  const allowedSet = new Set(allowed);
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter((item) => allowedSet.has(item))
    .filter((item, index, arr) => arr.indexOf(item) === index);
};

const asMark = (value: unknown) => (value === "si" || value === "no" ? value : "");

const asMarks = (value: unknown, length: number) =>
  Array.from({ length }, (_, index) => asMark(Array.isArray(value) ? value[index] : ""));

const asText = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const SYSTEM_PROMPT = `Eres Tiza-IA, asistente del equipo de Orientación del Colegio San Lucas de Lo Espejo (Chile).

Tu tarea: a partir de un relato del orientador sobre una clase que acaba de observar (normalmente dictado por voz), completar la PAUTA DE ACOMPAÑAMIENTO DE CLASE.

REGLAS FUNDAMENTALES:
1. NO INVENTES. Marca un indicador con "si" sólo si el relato lo respalda de forma explícita o claramente implícita. Marca "no" sólo si el relato indica que no ocurrió. Si el relato no dice nada al respecto, deja "" (vacío) para que la persona lo complete a mano. Es preferible dejar vacío que adivinar.
2. Las estrategias de pensamiento y de clima deben elegirse EXCLUSIVAMENTE del catálogo Focus que se entrega más abajo, copiando el nombre EXACTO tal como aparece. Si el relato describe una estrategia que no está en el catálogo, no la inventes: descríbela en el campo de detalle correspondiente.
3. Reconoce las estrategias aunque el orientador las nombre de forma aproximada o describa la actividad sin nombrarla (por ejemplo "les pidió levantar la mano para hacer silencio" corresponde a "Mano arriba, es silencio"; "hicieron el antes pensaba ahora pienso" corresponde a "Antes pensaba / Ahora pienso").
4. Redacta "generalEvidence" e "improvements" en español de Chile, en tono profesional, cálido y concreto, dirigido a la docente. Mejora la redacción del relato: ordénalo, quita muletillas y repeticiones, y escribe en párrafos claros. Conserva TODOS los hechos mencionados; no agregues hechos nuevos.
5. En "improvements" incluye primero lo destacado de la clase y luego las sugerencias concretas. Si el relato no trae sugerencias, deja el campo con lo destacado solamente.
6. "transcript" debe contener la transcripción literal de lo que dijo la persona (o el texto recibido si no hubo audio).

DEVUELVE SIEMPRE un único JSON válido con exactamente esta estructura:
{
  "transcript": "string",
  "cultureItems": ["si"|"no"|"", ...],
  "strengthItems": ["si"|"no"|"", ...],
  "comprehensionUsed": "si"|"no"|"",
  "comprehensionStrategies": ["Localización"|"Inferencia"|"Reflexión", ...],
  "comprehensionEvidence": "string",
  "thinkingUsed": "si"|"no"|"",
  "thinkingStrategies": ["nombre exacto del catálogo de pensamiento", ...],
  "thinkingDetail": "string",
  "climateUsed": "si"|"no"|"",
  "climateStrategies": ["nombre exacto del catálogo de clima", ...],
  "climateDetail": "string",
  "generalEvidence": "string",
  "improvements": "string"
}

"cultureItems" y "strengthItems" son arreglos con un valor por cada indicador de su sección, EN EL MISMO ORDEN en que se listan más abajo.`;

export async function POST(request: Request) {
  const supabase = getAuthClient();
  if (!supabase) return NextResponse.json({ error: "Supabase no está configurado" }, { status: 503 });
  const auth = await authenticateRequest(request, supabase);
  if ("error" in auth) return auth.error;

  const apiKey = getGeminiKey();
  if (!apiKey) return NextResponse.json({ error: "Falta la clave de Gemini" }, { status: 503 });

  const formData = await request.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "Formato de solicitud inválido" }, { status: 400 });

  const text = String(formData.get("text") || "").trim();
  const audio = formData.get("audio");
  const audioFile = audio instanceof File && audio.size > 0 ? audio : null;
  if (!text && !audioFile) {
    return NextResponse.json({ error: "Envía un audio o un texto con el relato de la clase." }, { status: 400 });
  }
  if (audioFile && audioFile.size > MAX_AUDIO_BYTES) {
    return NextResponse.json({ error: "El audio supera los 8 MB. Graba un relato más corto." }, { status: 413 });
  }

  let cultureItems: string[] = [];
  let strengthItems: string[] = [];
  let context: Record<string, string> = {};
  try {
    const raw = JSON.parse(String(formData.get("context") || "{}")) as Record<string, unknown>;
    cultureItems = Array.isArray(raw.cultureItems) ? raw.cultureItems.map(String) : [];
    strengthItems = Array.isArray(raw.strengthItems) ? raw.strengthItems.map(String) : [];
    context = {
      course: String(raw.course || ""),
      date: String(raw.date || ""),
      topic: String(raw.topic || ""),
      strength: String(raw.strength || ""),
      teacher: String(raw.teacher || ""),
    };
  } catch {
    return NextResponse.json({ error: "Contexto inválido" }, { status: 400 });
  }
  if (!cultureItems.length || !strengthItems.length) {
    return NextResponse.json({ error: "Faltan los indicadores de la pauta" }, { status: 400 });
  }

  const promptBlocks = [
    `Fecha de hoy: ${new Date().toISOString().slice(0, 10)}`,
    `\nCLASE OBSERVADA:\nCurso: ${context.course || "—"}\nFecha: ${context.date || "—"}\nTema: ${context.topic || "—"}\nFortaleza del carácter / acción: ${context.strength || "—"}\nDocente: ${context.teacher || "—"}`,
    `\nSECCIÓN 1 — INTERVENCIÓN FORMATIVA Y CULTURA INSTITUCIONAL (devuelve "cultureItems" con ${cultureItems.length} valores en este orden):\n${cultureItems.map((item, i) => `${i + 1}. ${item}`).join("\n")}`,
    `\nSECCIÓN 2 — TRABAJO DE FORTALEZAS DEL CARÁCTER (devuelve "strengthItems" con ${strengthItems.length} valores en este orden):\n${strengthItems.map((item, i) => `${i + 1}. ${item}`).join("\n")}`,
    `\nCATÁLOGO FOCUS · ESTRATEGIAS DE CLIMA DE AULA (copia el nombre exacto):\n${CLIMATE_STRATEGIES.map((s) => `${s.n}. ${s.name} — ${s.purpose}`).join("\n")}`,
    `\nCATÁLOGO FOCUS · ESTRATEGIAS DE PENSAMIENTO (copia el nombre exacto):\n${THINKING_STRATEGIES.map((s) => `${s.n}. ${s.name} — ${s.purpose}`).join("\n")}`,
  ];
  if (text) promptBlocks.push(`\nRELATO ESCRITO DEL ORIENTADOR:\n"""\n${text.slice(0, 20_000)}\n"""`);
  if (audioFile) promptBlocks.push(`\nSe adjunta un AUDIO con el relato hablado del orientador. Transcríbelo y úsalo como fuente principal.`);
  promptBlocks.push(`\nDevuelve únicamente el JSON solicitado.`);

  const inlineParts = audioFile
    ? [{ inline_data: { mime_type: audioMimeFor(audioFile), data: arrayBufferToBase64(await audioFile.arrayBuffer()) } }]
    : [];

  const result = await callGemini({
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: promptBlocks.join("\n"),
    inlineParts,
    apiKey,
    maxOutputTokens: 4000,
    perAttemptTimeoutMs: 40_000,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: result.status === 400 ? 400 : 503 });
  }

  const data = (result.data || {}) as Record<string, unknown>;
  return NextResponse.json({
    ok: true,
    model: result.usedModel,
    feedback: {
      transcript: asText(data.transcript),
      cultureItems: asMarks(data.cultureItems, cultureItems.length),
      strengthItems: asMarks(data.strengthItems, strengthItems.length),
      comprehensionUsed: asMark(data.comprehensionUsed),
      comprehensionStrategies: asStringArray(data.comprehensionStrategies, ["Localización", "Inferencia", "Reflexión"]),
      comprehensionEvidence: asText(data.comprehensionEvidence),
      thinkingUsed: asMark(data.thinkingUsed),
      thinkingStrategies: asStringArray(data.thinkingStrategies, THINKING_STRATEGIES.map((s) => s.name)),
      thinkingDetail: asText(data.thinkingDetail),
      climateUsed: asMark(data.climateUsed),
      climateStrategies: asStringArray(data.climateStrategies, CLIMATE_STRATEGIES.map((s) => s.name)),
      climateDetail: asText(data.climateDetail),
      generalEvidence: asText(data.generalEvidence),
      improvements: asText(data.improvements),
    },
  });
}
