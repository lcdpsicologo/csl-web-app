import { NextResponse } from "next/server";
import { callGemini, getAuthClient, authenticateRequest, getGeminiKey } from "@/lib/gemini";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

type CourseContext = {
  name: string;
  cycle?: string;
  orientationOwner?: string;
  convivenciaCoordinator?: string;
  classroomTeam?: Array<{ id: string; name: string; role: string; email?: string; notes?: string }>;
  ercNotes?: string;
  studentNames?: string[];
};

const SYSTEM_PROMPT = `Eres un asistente experto en gestión escolar para la plataforma Tiza Education del Colegio San Lucas de Lo Espejo.

Recibes un correo, mensaje o relato relacionado con UN curso específico (por ejemplo: enviado por la profesora jefe, por el equipo de aula, por la coordinación de convivencia). Tu trabajo es extraer acciones concretas que actualicen ese curso en el sistema.

Roles válidos para equipo de aula: Profesor/a jefe, Profesor/a de asignatura, Asistente de aula, Educadora diferencial, Educadora de párvulos, Técnico en párvulos, Inspector/a, Psicóloga, Trabajadora social, Coordinadora de convivencia, Orientador/a, Otro apoyo.

Categorías de casos válidas: Convivencia, Socioemocional, Académico, Asistencia, Familiar, PIE/NEE, Otro.
Prioridades de casos válidas: Baja, Media, Alta, Crítica.

Sé prudente y conservador: si no estás seguro, no propongas el cambio. Nunca inventes nombres ni hechos. Si el mensaje menciona estudiantes pero no requiere acción a nivel del curso, ignora esa parte (otro flujo se encarga).

Devuelve EXCLUSIVAMENTE un objeto JSON válido con esta forma:
{
  "summary": "resumen ejecutivo del mensaje en 1-2 oraciones",
  "teamAdditions": [
    {"name": "string", "role": "rol válido", "email": "string opcional", "notes": "string opcional"}
  ],
  "ercAppend": "texto a agregar a las notas ERC del curso (incluye fecha al inicio si la sabes). Si no hay nada nuevo, deja vacío.",
  "courseCases": [
    {"title": "string corto", "category": "string", "priority": "string", "description": "string narrativo basado en el mensaje"}
  ],
  "notes": "advertencias o ambigüedades que el orientador debería revisar"
}`;

export async function POST(request: Request) {
  try {
    return await handle(request);
  } catch (error) {
    console.error("AI course route crashed", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: `Error interno: ${message}` }, { status: 500 });
  }
}

async function handle(request: Request) {
  const apiKey = getGeminiKey();
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY no está configurada en Vercel" },
      { status: 503 },
    );
  }
  const authClient = getAuthClient();
  if (!authClient) return NextResponse.json({ error: "Supabase no está configurado" }, { status: 503 });
  const auth = await authenticateRequest(request, authClient);
  if ("error" in auth) return auth.error;

  let body: { text?: string; course?: CourseContext; today?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const text = (body.text || "").trim();
  const course = body.course;
  const today = body.today || new Date().toISOString().slice(0, 10);

  if (!text) return NextResponse.json({ error: "Falta el texto del mensaje" }, { status: 400 });
  if (!course?.name) return NextResponse.json({ error: "Falta el curso seleccionado" }, { status: 400 });

  const teamSummary = (course.classroomTeam || [])
    .map((m) => `- ${m.name} (${m.role})${m.email ? ` ${m.email}` : ""}`)
    .join("\n") || "(sin equipo cargado)";
  const studentsSummary = (course.studentNames || []).slice(0, 60).join(", ") || "(sin estudiantes cargados)";

  const userPrompt = `Fecha de hoy: ${today}

CURSO: ${course.name} (${course.cycle || "sin ciclo"})
Orientación: ${course.orientationOwner || "—"}
Convivencia: ${course.convivenciaCoordinator || "—"}

EQUIPO DE AULA ACTUAL:
${teamSummary}

NOTAS ERC ACTUALES:
"""
${course.ercNotes || "(vacío)"}
"""

ESTUDIANTES DEL CURSO (primeros 60):
${studentsSummary}

MENSAJE / CORREO A INTERPRETAR:
"""
${text}
"""

Devuelve el JSON solicitado.`;

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
