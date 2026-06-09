import { NextResponse } from "next/server";
import { callGemini, getAuthClient, authenticateRequest, getGeminiKey } from "@/lib/gemini";

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

type RosterStudent = { id: string; name: string; course?: string; rut?: string; guardian?: string };

const prefilterRoster = (students: RosterStudent[], emailText: string, limit = 250): RosterStudent[] => {
  if (students.length <= limit) return students;
  const emailTokens = new Set(tokensOf(emailText));
  if (emailTokens.size === 0) return students.slice(0, limit);
  const scored = students.map((student) => {
    const haystack = tokensOf(`${student.name} ${student.rut || ""} ${student.guardian || ""} ${student.course || ""}`);
    let score = 0;
    for (const token of haystack) if (emailTokens.has(token)) score += 1;
    return { student, score };
  });
  const matched = scored.filter((e) => e.score > 0).sort((a, b) => b.score - a.score).map((e) => e.student);
  if (matched.length >= 12) return matched.slice(0, limit);
  const matchedCourses = new Set(matched.map((s) => normalize(s.course || "")));
  const neighbors = students.filter(
    (s) => !matched.includes(s) && matchedCourses.has(normalize(s.course || "")),
  );
  return [...matched, ...neighbors].slice(0, limit);
};

const SYSTEM_PROMPT = `Eres un asistente experto en orientación escolar y convivencia, integrado en la plataforma Tiza Education del Colegio San Lucas de Lo Espejo.

Recibes correos, mensajes o relatos sobre estudiantes y los transformas en registros estructurados que se cargarán al sistema. Sé preciso, prudente y conservador: si no estás seguro, deja el campo vacío o marca baja confianza. Nunca inventes nombres ni hechos.

Categorías válidas para "cases": Convivencia, Socioemocional, Académico, Asistencia, Familiar, PIE/NEE, Otro.
Prioridades válidas: Baja, Media, Alta, Crítica.
Estados válidos para casos: Abierto.
Tipos de registro válidos para "logs": Seguimiento, Entrevista, Observación, Crisis, Coordinación, Otro.

Cada registro debe asociarse a un studentId de la nómina entregada. Si detectas varios estudiantes, genera un registro por cada uno (los detalles pueden ser similares).

Devuelve EXCLUSIVAMENTE un objeto JSON válido con esta forma:
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
  try {
    return await handle(request);
  } catch (error) {
    console.error("Triage route crashed", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: `Error interno: ${message}` }, { status: 500 });
  }
}

async function handle(request: Request) {
  const apiKey = getGeminiKey();
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY no está configurada. Agrega la variable en Vercel. Obtén una key gratis en https://aistudio.google.com/app/apikey" },
      { status: 503 },
    );
  }

  const authClient = getAuthClient();
  if (!authClient) {
    return NextResponse.json({ error: "Supabase no está configurado" }, { status: 503 });
  }
  const auth = await authenticateRequest(request, authClient);
  if ("error" in auth) return auth.error;

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

Analiza el mensaje, identifica los estudiantes mencionados (matchéalos con la nómina por nombre o RUT), propón registros estructurados (cases/interviews/logs/protocols) y devuelve el JSON solicitado.`;

  const result = await callGemini({ systemPrompt: SYSTEM_PROMPT, userPrompt, apiKey });
  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: result.status });
  }

  return NextResponse.json({
    ok: true,
    result: result.data,
    usage: result.usage,
    model: result.usedModel,
    provider: "google-gemini",
  });
}
