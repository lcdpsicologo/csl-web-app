import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import mammoth from "mammoth";
import { getAuthClient, authenticateRequest, getGeminiKey, DEFAULT_GEMINI_MODEL } from "@/lib/gemini";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const MAX_TEXT_PER_FILE = 30_000;

type ExtractedFile = {
  name: string;
  type: string;
  text?: string;
  inlinePart?: { inline_data: { mime_type: string; data: string } };
};

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 8192;
  for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  return Buffer.from(binary, "binary").toString("base64");
};

const extractFile = async (file: File): Promise<ExtractedFile> => {
  const name = file.name || "archivo";
  const type = (file.type || "").toLowerCase();
  const lower = name.toLowerCase();
  const buf = await file.arrayBuffer();
  if (lower.endsWith(".xlsx") || lower.endsWith(".xls") || lower.endsWith(".xlsm") || type.includes("spreadsheetml") || type.includes("excel")) {
    const wb = XLSX.read(buf, { type: "array" });
    const parts: string[] = [];
    wb.SheetNames.forEach((sheetName) => {
      const csv = XLSX.utils.sheet_to_csv(wb.Sheets[sheetName], { blankrows: false });
      if (csv.trim()) parts.push(`=== Hoja: ${sheetName} ===\n${csv}`);
    });
    return { name, type, text: parts.join("\n\n").slice(0, MAX_TEXT_PER_FILE) };
  }
  if (lower.endsWith(".csv") || lower.endsWith(".tsv") || lower.endsWith(".txt") || type.startsWith("text/")) {
    return { name, type, text: new TextDecoder("utf-8").decode(buf).slice(0, MAX_TEXT_PER_FILE) };
  }
  if (lower.endsWith(".docx") || type.includes("wordprocessingml") || type.includes("msword")) {
    try {
      const result = await mammoth.extractRawText({ buffer: Buffer.from(buf) });
      return { name, type, text: (result.value || "").slice(0, MAX_TEXT_PER_FILE) };
    } catch (err) {
      return { name, type, text: `[Error Word: ${err instanceof Error ? err.message : String(err)}]` };
    }
  }
  if (lower.endsWith(".pdf") || type === "application/pdf") {
    return { name, type, inlinePart: { inline_data: { mime_type: "application/pdf", data: arrayBufferToBase64(buf) } } };
  }
  if (type.startsWith("image/") || /\.(png|jpe?g|gif|webp|heic|heif)$/i.test(lower)) {
    return { name, type, inlinePart: { inline_data: { mime_type: type.startsWith("image/") ? type : "image/png", data: arrayBufferToBase64(buf) } } };
  }
  try {
    return { name, type, text: new TextDecoder("utf-8").decode(buf).slice(0, MAX_TEXT_PER_FILE) };
  } catch {
    return { name, type, text: "[Tipo no soportado]" };
  }
};

const SYSTEM_PROMPT = `Eres un asistente del orientador en Tiza Education del Colegio San Lucas de Lo Espejo. El usuario te escribe en lenguaje natural y puede pegar correos, mensajes del equipo de aula, tablas, o adjuntar archivos (PDF, Word, Excel, imágenes). Tu trabajo es:

1. Identificar el INTENT (qué quiere lograr).
2. Devolver UN único JSON estructurado con todo lo necesario para actuar.

Intents posibles:
- "student_triage": el contenido se trata de uno o varios estudiantes específicos. Genera casos / entrevistas / bitácoras / protocolos vinculados.
- "course_update": el contenido es del equipo de aula o convivencia de UN curso. Genera: integrantes nuevos del equipo, notas ERC, casos del curso.
- "bulk_import": el contenido es una tabla/lista de muchos registros (talleres, asistencia, etc.). Genera registros de una entidad.
- "file_analysis": archivos adjuntos donde no es claro cuál intent aplica; intenta extraer lo más útil.
- "answer": el usuario solo pregunta o pide información, no quiere crear nada. Responde en el campo "answer".

Categorías para casos: Convivencia, Socioemocional, Académico, Asistencia, Familiar, PIE/NEE, Otro.
Prioridades: Baja, Media, Alta, Crítica.
Estados de casos: Abierto.
Tipos de bitácora: Seguimiento, Entrevista, Observación, Crisis, Coordinación, Otro.
Roles equipo de aula: Profesor/a jefe, Profesor/a de asignatura, Asistente de aula, Educadora diferencial, Educadora de párvulos, Técnico en párvulos, Inspector/a, Psicóloga, Trabajadora social, Coordinadora de convivencia, Orientador/a, Otro apoyo.

Sé prudente y conservador. Si no estás seguro, deja vacío o marca baja confianza. Nunca inventes nombres ni hechos.

Devuelve EXCLUSIVAMENTE un objeto JSON válido con esta forma:
{
  "intent": "student_triage" | "course_update" | "bulk_import" | "file_analysis" | "answer",
  "summary": "resumen ejecutivo en 1-3 oraciones",
  "answer": "respuesta libre (sólo si intent=answer)",
  "involvedStudents": [{"studentId": "string", "studentName": "string", "confidence": 0.0-1.0, "evidence": "fragmento literal"}],
  "studentRecords": [
    {
      "entity": "cases" | "interviews" | "logs" | "protocols",
      "studentId": "string",
      "title": "string",
      "category": "string",
      "priority": "string",
      "status": "string",
      "type": "string",
      "date": "YYYY-MM-DD",
      "description": "string"
    }
  ],
  "courseTarget": "string o vacío",
  "teamAdditions": [{"name": "string", "role": "string", "email": "string"}],
  "ercAppend": "string a agregar a notas ERC del curso",
  "courseCases": [{"title": "string", "category": "string", "priority": "string", "description": "string"}],
  "bulkEntity": "students | courses | cases | logs | interviews | protocols | orientation | workshops | documents",
  "bulkRecords": [{"entity": "string", "fields": {"campoApp": "valor"}, "studentId": "string opcional", "confidence": 0.0-1.0}],
  "notes": "advertencias o ambigüedades"
}

Campos que no aplican al intent detectado deben quedar como array vacío o string vacío.`;

export async function POST(request: Request) {
  try {
    return await handle(request);
  } catch (error) {
    console.error("AI chat crashed", error);
    return NextResponse.json({ error: `Error interno: ${error instanceof Error ? error.message : String(error)}` }, { status: 500 });
  }
}

async function handle(request: Request) {
  const apiKey = getGeminiKey();
  if (!apiKey) return NextResponse.json({ error: "GEMINI_API_KEY no está configurada" }, { status: 503 });
  const authClient = getAuthClient();
  if (!authClient) return NextResponse.json({ error: "Supabase no está configurado" }, { status: 503 });
  const auth = await authenticateRequest(request, authClient);
  if ("error" in auth) return auth.error;

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json({ error: "Content-Type debe ser multipart/form-data" }, { status: 400 });
  }

  let formData: FormData;
  try { formData = await request.formData(); } catch {
    return NextResponse.json({ error: "Form data inválido" }, { status: 400 });
  }

  const message = String(formData.get("message") || "").trim();
  const today = String(formData.get("today") || new Date().toISOString().slice(0, 10));
  const rosterRaw = String(formData.get("roster") || "[]");
  const coursesRaw = String(formData.get("courses") || "[]");
  let roster: Array<{ id: string; name: string; course?: string; rut?: string }> = [];
  let courses: Array<{ name: string; cycle?: string }> = [];
  try { roster = JSON.parse(rosterRaw); } catch { roster = []; }
  try { courses = JSON.parse(coursesRaw); } catch { courses = []; }

  const rawFiles = formData.getAll("files");
  const files = rawFiles.filter((f): f is File => f instanceof File && f.size > 0);
  if (!message && files.length === 0) {
    return NextResponse.json({ error: "Escribe un mensaje o adjunta un archivo" }, { status: 400 });
  }

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  if (totalSize > 12 * 1024 * 1024) {
    return NextResponse.json({ error: `Archivos demasiado grandes (${(totalSize / 1024 / 1024).toFixed(1)} MB). Máximo 12 MB.` }, { status: 413 });
  }

  const extracted: ExtractedFile[] = [];
  for (const file of files) extracted.push(await extractFile(file));

  const rosterTrimmed = roster.slice(0, 500);
  const rosterTable = rosterTrimmed.map((s) => `${s.id}|${s.name}|${s.course || ""}|${s.rut || ""}`).join("\n");
  const coursesList = courses.slice(0, 80).map((c) => `${c.name}${c.cycle ? ` (${c.cycle})` : ""}`).join("\n");

  const parts: Array<{ text?: string } | { inline_data: { mime_type: string; data: string } }> = [];
  const textBlocks: string[] = [];
  textBlocks.push(`Fecha de hoy: ${today}`);
  if (coursesList) textBlocks.push(`\nCURSOS DEL COLEGIO:\n${coursesList}`);
  if (rosterTable) textBlocks.push(`\nNÓMINA (id|nombre|curso|rut, primeros ${rosterTrimmed.length}):\n${rosterTable}`);
  if (message) textBlocks.push(`\nMENSAJE DEL USUARIO:\n"""\n${message}\n"""`);
  extracted.forEach((ex, idx) => {
    if (ex.text) textBlocks.push(`\n=== ARCHIVO ${idx + 1}: ${ex.name} ===\n${ex.text}`);
    else if (ex.inlinePart) textBlocks.push(`\n=== ARCHIVO ${idx + 1}: ${ex.name} (adjunto binario inline) ===`);
  });
  textBlocks.push(`\nDevuelve el JSON solicitado detectando el intent correcto.`);
  parts.push({ text: textBlocks.join("\n") });
  extracted.forEach((ex) => { if (ex.inlinePart) parts.push(ex.inlinePart); });

  const body = {
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [{ role: "user", parts }],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
      maxOutputTokens: 8000,
      thinkingConfig: { thinkingBudget: 0 },
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
    ],
  };

  const fallbackChain = [DEFAULT_GEMINI_MODEL, "gemini-2.5-flash-lite", "gemini-2.0-flash"].filter((m, i, arr) => arr.indexOf(m) === i);
  let parsed: unknown = null;
  let usedModel = DEFAULT_GEMINI_MODEL;
  let lastStatus = 0;
  let lastMsg = "";

  outer: for (const candidate of fallbackChain) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      if (attempt > 0) await new Promise((r) => setTimeout(r, 800));
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${candidate}:generateContent?key=${apiKey}`;
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 50_000);
      let res: Response;
      try {
        res = await fetch(url, {
          method: "POST",
          signal: ctrl.signal,
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        });
      } catch (err) {
        clearTimeout(timer);
        lastStatus = err instanceof Error && err.name === "AbortError" ? 504 : 500;
        lastMsg = err instanceof Error ? err.message : String(err);
        continue;
      }
      clearTimeout(timer);
      if (res.status === 503 || res.status === 429 || res.status === 500) {
        lastStatus = res.status;
        lastMsg = (await res.text().catch(() => "")).slice(0, 240);
        continue;
      }
      if (!res.ok) {
        const txt = await res.text();
        return NextResponse.json({ error: `Gemini devolvió ${res.status}: ${txt.slice(0, 300)}` }, { status: 502 });
      }
      const json = (await res.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
      const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (!text) { lastStatus = 502; lastMsg = "Sin contenido"; continue; }
      try { parsed = JSON.parse(text); } catch {
        const m = text.match(/\{[\s\S]*\}/);
        if (!m) { lastStatus = 502; lastMsg = "JSON inválido"; continue; }
        try { parsed = JSON.parse(m[0]); } catch { lastStatus = 502; lastMsg = "JSON inválido"; continue; }
      }
      usedModel = candidate;
      break outer;
    }
  }

  if (!parsed) {
    return NextResponse.json({ error: `Gemini no respondió. Último: ${lastStatus} ${lastMsg}` }, { status: 503 });
  }
  return NextResponse.json({
    ok: true,
    result: parsed,
    model: usedModel,
    filesProcessed: extracted.map((e) => ({ name: e.name, kind: e.inlinePart ? "binary" : "text" })),
  });
}
