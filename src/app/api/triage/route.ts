import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Vercel: allow up to 60s for the Gemini call (default is 10s on Hobby).
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const tokensOf = (value: string) =>
  normalize(value)
    .split(/\s+/)
    .filter((token) => token.length >= 3);

const prefilterRoster = (students: RosterStudent[], emailText: string, limit = 250): RosterStudent[] => {
  if (students.length <= limit) return students;
  const emailTokens = new Set(tokensOf(emailText));
  if (emailTokens.size === 0) return students.slice(0, limit);
  const scored = students.map((student) => {
    const haystack = tokensOf(`${student.name} ${student.rut || ""} ${student.guardian || ""} ${student.course || ""}`);
    let score = 0;
    for (const token of haystack) {
      if (emailTokens.has(token)) score += 1;
    }
    return { student, score };
  });
  const matched = scored.filter((entry) => entry.score > 0).sort((a, b) => b.score - a.score).map((entry) => entry.student);
  if (matched.length >= 12) return matched.slice(0, limit);
  // Fallback: include matched + some neighbors from same courses, up to limit
  const matchedCourses = new Set(matched.map((s) => normalize(s.course || "")));
  const neighbors = students.filter(
    (s) => !matched.includes(s) && matchedCourses.has(normalize(s.course || "")),
  );
  return [...matched, ...neighbors].slice(0, limit);
};

const normalizeSupabaseUrl = (url: string) =>
  url.replace(/\/(rest|auth)\/v1\/?$/, "").replace(/\/$/, "");

const getAuthClient = () => {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!rawUrl || !key) return null;
  return createClient(normalizeSupabaseUrl(rawUrl), key, {
    auth: { persistSession: false },
  });
};

const getToken = (request: Request) => {
  const header = request.headers.get("authorization") || "";
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
};

const authenticate = async (request: Request, supabase: SupabaseClient) => {
  const token = getToken(request);
  if (!token) return { error: NextResponse.json({ error: "Missing bearer token" }, { status: 401 }) };
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return { error: NextResponse.json({ error: "Invalid session" }, { status: 401 }) };
  return { user: data.user };
};

type RosterStudent = { id: string; name: string; course?: string; rut?: string; guardian?: string };

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

const SYSTEM_PROMPT = `Eres un asistente experto en orientación escolar y convivencia, integrado en la plataforma Tiza Education del Colegio San Lucas de Lo Espejo.

Recibís correos, mensajes o relatos sobre estudiantes y los transformás en registros estructurados que se cargarán al sistema. Sos preciso, prudente y conservador: si no estás seguro, deja el campo vacío o marcá baja confianza. Nunca inventes nombres ni hechos.

Categorías válidas para "cases": Convivencia, Socioemocional, Académico, Asistencia, Familiar, PIE/NEE, Otro.
Prioridades válidas: Baja, Media, Alta, Crítica.
Estados válidos para casos: Abierto.
Tipos de registro válidos para "logs": Seguimiento, Entrevista, Observación, Crisis, Coordinación, Otro.

Cada registro debe asociarse a un studentId de la nómina que te entrego. Si detectás varios estudiantes, generá un registro por cada uno (los detalles pueden ser similares).

Devolvé EXCLUSIVAMENTE un objeto JSON válido, sin texto adicional. La estructura debe ser:
{
  "summary": "resumen ejecutivo del correo en 1-2 oraciones",
  "involved": [{"studentId": "string", "studentName": "string", "confidence": 0.0-1.0, "evidence": "fragmento literal del correo que menciona al estudiante"}],
  "records": [
    {
      "entity": "cases" | "interviews" | "logs" | "protocols",
      "studentId": "string",
      "title": "string corto",
      "category": "string si aplica",
      "priority": "string si aplica",
      "status": "string si aplica",
      "type": "string si es log",
      "date": "YYYY-MM-DD si se infiere",
      "description": "descripción narrativa basada en el correo, sin inventar"
    }
  ],
  "notes": "advertencias o ambigüedades que el orientador debería revisar (string corto)"
}`;

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    summary: { type: "STRING" },
    involved: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          studentId: { type: "STRING" },
          studentName: { type: "STRING" },
          confidence: { type: "NUMBER" },
          evidence: { type: "STRING" },
        },
      },
    },
    records: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          entity: { type: "STRING" },
          studentId: { type: "STRING" },
          title: { type: "STRING" },
          category: { type: "STRING" },
          priority: { type: "STRING" },
          status: { type: "STRING" },
          type: { type: "STRING" },
          date: { type: "STRING" },
          description: { type: "STRING" },
        },
      },
    },
    notes: { type: "STRING" },
  },
};

export async function POST(request: Request) {
  try {
    return await handle(request);
  } catch (error) {
    console.error("Triage route crashed", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Error interno: ${message}` },
      { status: 500 },
    );
  }
}

async function handle(request: Request) {
  if (!GEMINI_KEY) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY no está configurada. Agrega la variable en Vercel (Settings → Environment Variables). Obtené una key gratis en https://aistudio.google.com/app/apikey" },
      { status: 503 },
    );
  }

  const authClient = getAuthClient();
  if (!authClient) {
    return NextResponse.json({ error: "Supabase no está configurado" }, { status: 503 });
  }
  const auth = await authenticate(request, authClient);
  if ("error" in auth && auth.error) return auth.error;

  let body: { emailText?: string; students?: RosterStudent[]; today?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const emailText = (body.emailText || "").trim();
  const fullStudents = Array.isArray(body.students) ? body.students : [];
  const today = body.today || new Date().toISOString().slice(0, 10);

  if (!emailText) return NextResponse.json({ error: "Falta el texto del correo" }, { status: 400 });
  if (fullStudents.length === 0) return NextResponse.json({ error: "Falta la nómina de estudiantes" }, { status: 400 });

  // Pre-filter: keep prompt small by sending only students likely mentioned in the email.
  const students = prefilterRoster(fullStudents, emailText, 250);

  const rosterTable = students
    .map((s) => `${s.id}|${(s.name || "").replace(/\|/g, "/")}|${s.course || ""}|${s.rut || ""}|${s.guardian || ""}`)
    .join("\n");

  const userPrompt = `Fecha de hoy: ${today}

NÓMINA (id|nombre|curso|rut|apoderado):
${rosterTable}

CORREO O MENSAJE A INTERPRETAR:
"""
${emailText}
"""

Analizá el mensaje, identificá los estudiantes mencionados (matchealos con la nómina por nombre o RUT), proponé registros estructurados (cases/interviews/logs/protocols) y devolvé el JSON solicitado.`;

  // Try the configured model, then fall back to other free models if Google is overloaded.
  const fallbackModels = [MODEL, "gemini-2.5-flash-lite", "gemini-2.0-flash", "gemini-2.0-flash-lite"].filter(
    (m, idx, arr) => arr.indexOf(m) === idx,
  );

  const geminiBody = {
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
      maxOutputTokens: 2048,
      thinkingConfig: { thinkingBudget: 0 },
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
    ],
  };

  let lastStatus = 0;
  let lastMsg = "";
  let usedModel = MODEL;
  let data: { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>; usageMetadata?: unknown } | null = null;

  outer: for (const candidate of fallbackModels) {
    // Up to 3 attempts per model with exponential backoff on 503/429.
    for (let attempt = 0; attempt < 3; attempt += 1) {
      if (attempt > 0) {
        await new Promise((resolve) => setTimeout(resolve, 800 * 2 ** (attempt - 1)));
      }
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${candidate}:generateContent?key=${GEMINI_KEY}`;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 25_000);
      let res: Response;
      try {
        res = await fetch(url, {
          method: "POST",
          signal: controller.signal,
          headers: { "content-type": "application/json" },
          body: JSON.stringify(geminiBody),
        });
      } catch (err) {
        clearTimeout(timer);
        if (err instanceof Error && err.name === "AbortError") {
          lastStatus = 504;
          lastMsg = `Timeout en ${candidate}`;
          continue; // retry this model or fall back
        }
        lastStatus = 500;
        lastMsg = err instanceof Error ? err.message : String(err);
        continue;
      }
      clearTimeout(timer);

      if (res.status === 503 || res.status === 429 || res.status === 500) {
        const errText = await res.text().catch(() => "");
        lastStatus = res.status;
        lastMsg = errText.slice(0, 240);
        continue; // retry or fall back
      }

      if (!res.ok) {
        const errText = await res.text();
        let errMsg = errText;
        try {
          const parsedErr = JSON.parse(errText);
          errMsg = parsedErr?.error?.message || errText;
        } catch {
          // keep raw
        }
        return NextResponse.json(
          { error: `Gemini devolvió ${res.status} en modelo ${candidate}: ${errMsg}` },
          { status: 502 },
        );
      }

      data = await res.json();
      usedModel = candidate;
      break outer;
    }
  }

  if (!data) {
    return NextResponse.json(
      {
        error: `Todos los modelos de Gemini gratis están saturados o sin cuota en este momento (último: ${lastStatus} ${lastMsg}). Espera 1-2 minutos y vuelve a intentar.`,
      },
      { status: 503 },
    );
  }

  try {
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    if (!text) {
      return NextResponse.json(
        { error: "Gemini no devolvió contenido", raw: JSON.stringify(data).slice(0, 500) },
        { status: 502 },
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) {
        return NextResponse.json({ error: "JSON malformado de la IA", raw: text }, { status: 502 });
      }
      try {
        parsed = JSON.parse(match[0]);
      } catch (err) {
        return NextResponse.json(
          { error: "JSON malformado de la IA", raw: text, parseError: String(err) },
          { status: 502 },
        );
      }
    }

    return NextResponse.json({
      ok: true,
      result: parsed,
      usage: data?.usageMetadata || null,
      model: usedModel,
      provider: "google-gemini",
    });
  } catch (error) {
    console.error("Triage failed", error);
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: `Error llamando a Gemini: ${message}` }, { status: 500 });
  }
}
