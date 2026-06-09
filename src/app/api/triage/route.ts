import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

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

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

const SYSTEM_PROMPT = `Eres un asistente experto en orientación escolar y convivencia, integrado en la plataforma Tiza Education del Colegio San Lucas de Lo Espejo.

Recibís correos, mensajes o relatos sobre estudiantes y los transformás en registros estructurados que se cargarán al sistema. Sos preciso, prudente y conservador: si no estás seguro, dejá el campo vacío o marcá baja confianza. Nunca inventes nombres ni hechos.

Categorías válidas para "cases": Convivencia, Socioemocional, Académico, Asistencia, Familiar, PIE/NEE, Otro.
Prioridades válidas: Baja, Media, Alta, Crítica.
Estados válidos para casos: Abierto.
Tipos de registro válidos para "logs": Seguimiento, Entrevista, Observación, Crisis, Coordinación, Otro.

Cada registro debe asociarse a un studentId de la nómina que te entrego. Si detectás varios estudiantes, generá un registro por cada uno (los detalles pueden ser similares).

Devolvé EXCLUSIVAMENTE un objeto JSON válido, sin texto adicional, con esta forma exacta:
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

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY no está configurada en el servidor. Agregá la variable en Vercel/`.env.local`." },
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
    const client = new Anthropic();
    const completion = await client.messages.create({
      model: MODEL,
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = completion.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return NextResponse.json({ error: "La IA no devolvió un JSON válido", raw: text }, { status: 502 });
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(match[0]);
    } catch (err) {
      return NextResponse.json(
        { error: "JSON malformado de la IA", raw: text, parseError: String(err) },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      result: parsed,
      usage: {
        input_tokens: completion.usage?.input_tokens,
        output_tokens: completion.usage?.output_tokens,
      },
      model: MODEL,
    });
  } catch (error) {
    console.error("Triage failed", error);
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: `Error llamando a Claude: ${message}` }, { status: 500 });
  }
}
