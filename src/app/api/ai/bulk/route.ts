import { NextResponse } from "next/server";
import { callGemini, getAuthClient, authenticateRequest, getGeminiKey } from "@/lib/gemini";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `Eres un asistente experto en importar datos a la plataforma Tiza Education del Colegio San Lucas de Lo Espejo.

Recibes una tabla pegada (CSV, TSV, o texto tabular copiado desde Google Sheets/Excel) y un objetivo del usuario. Tu trabajo es interpretarla y devolver registros estructurados listos para crear en el sistema.

Sé prudente y conservador: si una fila no se entiende, marcarla como "skip" con motivo. Nunca inventes datos. Respeta los nombres de columnas que el usuario describe.

Los registros deben seguir el esquema de la entidad indicada. Devuelve EXCLUSIVAMENTE un objeto JSON válido con esta forma:
{
  "summary": "1-2 oraciones sobre qué encontraste",
  "entity": "students | courses | cases | logs | interviews | protocols | orientation | workshops | documents",
  "headersDetected": ["lista de headers/columnas que identificaste"],
  "records": [
    {
      "fields": {"campoApp": "valor", ...},
      "sourceRow": "índice de la fila (1-based, excluyendo header)",
      "confidence": 0.0-1.0,
      "notes": "string opcional"
    }
  ],
  "skipped": [
    {"sourceRow": "índice", "reason": "por qué se saltó"}
  ],
  "warnings": "string corto con cualquier ambigüedad"
}`;

const ENTITY_SCHEMAS = {
  workshops: { fields: ["date", "title", "audience", "responsible", "status", "notes"], statuses: ["Planificado", "Realizado", "Pendiente"] },
  orientation: { fields: ["date", "course", "orientationOwner", "topic", "axis", "status", "canvaLink", "planificacion", "notes"], statuses: ["Planificada", "Realizada", "Pendiente", "Reprogramada"] },
  logs: { fields: ["date", "student", "type", "professional", "description", "agreements"], types: ["Seguimiento", "Entrevista", "Observación", "Crisis", "Coordinación", "Otro"] },
  interviews: { fields: ["date", "participant", "student", "reason", "status", "agreements"], statuses: ["Agendada", "Realizada", "Reprogramada", "Cerrada"] },
  cases: { fields: ["student", "course", "title", "category", "priority", "status", "responsible", "description"] },
  documents: { fields: ["title", "folder", "confidentiality", "relatedTo", "url", "notes"] },
  protocols: { fields: ["title", "student", "status", "dueDate", "responsible", "notes"] },
  students: { fields: ["fullName", "course", "rut", "guardian", "phone", "email", "relevantInfo", "strengths", "supportNeeds", "healthAlerts", "notes", "observations", "tags"] },
  courses: { fields: ["name", "cycle", "orientationOwner", "orientationEmail", "convivenciaCoordinator", "convivenciaEmail", "headTeacher", "capacity", "notes"] },
};

export async function POST(request: Request) {
  try {
    return await handle(request);
  } catch (error) {
    console.error("AI bulk route crashed", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: `Error interno: ${message}` }, { status: 500 });
  }
}

async function handle(request: Request) {
  const apiKey = getGeminiKey();
  if (!apiKey) return NextResponse.json({ error: "GEMINI_API_KEY no está configurada" }, { status: 503 });
  const authClient = getAuthClient();
  if (!authClient) return NextResponse.json({ error: "Supabase no está configurado" }, { status: 503 });
  const auth = await authenticateRequest(request, authClient);
  if ("error" in auth) return auth.error;

  let body: { tableText?: string; entity?: keyof typeof ENTITY_SCHEMAS; instruction?: string; today?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const tableText = (body.tableText || "").trim();
  const entity = body.entity;
  const instruction = (body.instruction || "").trim();
  const today = body.today || new Date().toISOString().slice(0, 10);

  if (!tableText) return NextResponse.json({ error: "Falta el texto de la tabla" }, { status: 400 });
  if (!entity || !ENTITY_SCHEMAS[entity]) {
    return NextResponse.json({ error: "Entidad inválida" }, { status: 400 });
  }

  // Truncate huge tables to avoid token explosion (Gemini free tier).
  const tablePreview = tableText.length > 15000 ? tableText.slice(0, 15000) + "\n[... tabla truncada ...]" : tableText;

  const schema = ENTITY_SCHEMAS[entity];
  const schemaDesc = `Campos válidos para "${entity}": ${schema.fields.join(", ")}.`
    + ("statuses" in schema ? `\nEstados válidos: ${schema.statuses.join(", ")}.` : "")
    + ("types" in schema ? `\nTipos válidos: ${schema.types.join(", ")}.` : "");

  const userPrompt = `Fecha de hoy: ${today}

ENTIDAD OBJETIVO: ${entity}
${schemaDesc}

INSTRUCCIÓN DEL USUARIO:
"""
${instruction || "(sin instrucción específica — interpreta la tabla como mejor calce con la entidad)"}
"""

TABLA PEGADA (CSV/TSV/Sheets):
"""
${tablePreview}
"""

Interpreta la tabla, mapea las columnas a los campos válidos de la entidad, y devuelve el JSON solicitado con los registros listos para crear.`;

  const result = await callGemini({ systemPrompt: SYSTEM_PROMPT, userPrompt, apiKey, maxOutputTokens: 8000 });
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
