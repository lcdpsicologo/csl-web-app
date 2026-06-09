import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

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

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

const SYSTEM_PROMPT = `Eres un asistente experto en orientación escolar y convivencia, integrado en la plataforma Tiza Education del Colegio San Lucas de Lo Espejo.

Recibís correos, mensajes o relatos sobre estudiantes y los transformás en registros estructurados que se cargarán al sistema. Sos preciso, prudente y conservador: si no estás seguro, dejá el campo vacío o marcá baja confianza. Nunca inventes nombres ni hechos.

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
  if (!GEMINI_KEY) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY no está configurada. Agregá la variable en Vercel (Settings → Environment Variables). Obtené una key gratis en https://aistudio.google.com/app/apikey" },
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
  const students = Array.isArray(body.students) ? body.students.slice(0, 1800) : [];
  const today = body.today || new Date().toISOString().slice(0, 10);

  if (!emailText) return NextResponse.json({ error: "Falta el texto del correo" }, { status: 400 });
  if (students.length === 0) return NextResponse.json({ error: "Falta la nómina de estudiantes" }, { status: 400 });

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

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_KEY}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      let errMsg = errText;
      try {
        const parsed = JSON.parse(errText);
        errMsg = parsed?.error?.message || errText;
      } catch {
        // keep raw
      }
      if (res.status === 429) {
        return NextResponse.json(
          {
            error: `Cuota de Gemini excedida en el modelo "${MODEL}". Probá: (1) esperar unos minutos, (2) cambiar el modelo a uno con free tier más amplio agregando GEMINI_MODEL=gemini-2.5-flash-lite en Vercel, o (3) verificar que la "Generative Language API" esté habilitada en https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com para el proyecto de tu API key. Detalle: ${errMsg}`,
          },
          { status: 429 },
        );
      }
      return NextResponse.json(
        { error: `Gemini devolvió ${res.status}: ${errMsg}` },
        { status: 502 },
      );
    }

    const data = await res.json();
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
      model: MODEL,
      provider: "google-gemini",
    });
  } catch (error) {
    console.error("Triage failed", error);
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: `Error llamando a Gemini: ${message}` }, { status: 500 });
  }
}
