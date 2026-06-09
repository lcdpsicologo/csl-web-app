import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import mammoth from "mammoth";
import { callGemini, getAuthClient, authenticateRequest, getGeminiKey, DEFAULT_GEMINI_MODEL } from "@/lib/gemini";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

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

const SYSTEM_PROMPT = `Eres un asistente experto en analizar documentos escolares para la plataforma Tiza Education del Colegio San Lucas de Lo Espejo.

Recibes uno o varios archivos (PDF, Word, Excel, CSV, imágenes con texto) y debes extraer registros estructurados listos para crear en el sistema. Cuando un documento menciona estudiantes, intenta matchearlos con la nómina proporcionada usando el nombre o RUT. Si una fila/registro corresponde a un estudiante específico, asigna su studentId.

Sé prudente y conservador. Nunca inventes nombres ni hechos. Si una fila es ambigua, marcarla como skip con motivo.

Devuelve EXCLUSIVAMENTE un objeto JSON válido con esta forma:
{
  "summary": "1-3 oraciones describiendo qué encontraste en los archivos",
  "entity": "students | courses | cases | logs | interviews | protocols | orientation | workshops | documents",
  "records": [
    {
      "fields": {"campoApp": "valor", ...},
      "studentId": "id del estudiante si aplica, vacío si no",
      "studentName": "nombre del estudiante mencionado",
      "sourceFile": "nombre del archivo de origen",
      "sourceRow": "índice o referencia dentro del archivo",
      "confidence": 0.0-1.0,
      "notes": "string opcional"
    }
  ],
  "skipped": [
    {"sourceFile": "string", "sourceRow": "string", "reason": "por qué se saltó"}
  ],
  "warnings": "string corto con cualquier ambigüedad o aviso"
}`;

const MAX_TEXT_PER_FILE = 30_000; // characters

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
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return Buffer.from(binary, "binary").toString("base64");
};

const extractFile = async (file: File): Promise<ExtractedFile> => {
  const name = file.name || "archivo";
  const type = (file.type || "").toLowerCase();
  const lower = name.toLowerCase();
  const buf = await file.arrayBuffer();

  // Excel
  if (lower.endsWith(".xlsx") || lower.endsWith(".xls") || lower.endsWith(".xlsm") || type.includes("spreadsheetml") || type.includes("excel")) {
    const wb = XLSX.read(buf, { type: "array" });
    const parts: string[] = [];
    wb.SheetNames.forEach((sheetName) => {
      const sheet = wb.Sheets[sheetName];
      const csv = XLSX.utils.sheet_to_csv(sheet, { blankrows: false });
      if (csv.trim()) parts.push(`=== Hoja: ${sheetName} ===\n${csv}`);
    });
    const text = parts.join("\n\n").slice(0, MAX_TEXT_PER_FILE);
    return { name, type, text };
  }

  // CSV / TSV / plain text
  if (lower.endsWith(".csv") || lower.endsWith(".tsv") || lower.endsWith(".txt") || type.startsWith("text/")) {
    const text = (new TextDecoder("utf-8").decode(buf)).slice(0, MAX_TEXT_PER_FILE);
    return { name, type, text };
  }

  // Word
  if (lower.endsWith(".docx") || type.includes("wordprocessingml") || type.includes("msword")) {
    try {
      const result = await mammoth.extractRawText({ buffer: Buffer.from(buf) });
      const text = (result.value || "").slice(0, MAX_TEXT_PER_FILE);
      return { name, type, text };
    } catch (err) {
      return { name, type, text: `[Error al leer Word: ${err instanceof Error ? err.message : String(err)}]` };
    }
  }

  // PDF — send to Gemini as inline_data (Gemini handles PDF natively)
  if (lower.endsWith(".pdf") || type === "application/pdf") {
    return {
      name,
      type,
      inlinePart: { inline_data: { mime_type: "application/pdf", data: arrayBufferToBase64(buf) } },
    };
  }

  // Images
  if (type.startsWith("image/") || /\.(png|jpe?g|gif|webp|heic|heif)$/i.test(lower)) {
    const mime = type.startsWith("image/") ? type : "image/png";
    return {
      name,
      type,
      inlinePart: { inline_data: { mime_type: mime, data: arrayBufferToBase64(buf) } },
    };
  }

  // Fallback: try to read as text
  try {
    const text = (new TextDecoder("utf-8").decode(buf)).slice(0, MAX_TEXT_PER_FILE);
    return { name, type, text };
  } catch {
    return { name, type, text: "[Tipo de archivo no soportado]" };
  }
};

export async function POST(request: Request) {
  try {
    return await handle(request);
  } catch (error) {
    console.error("AI files route crashed", error);
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

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json({ error: "Content-Type debe ser multipart/form-data" }, { status: 400 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Form data inválido" }, { status: 400 });
  }

  const entity = String(formData.get("entity") || "");
  const instruction = String(formData.get("instruction") || "").trim();
  const today = String(formData.get("today") || new Date().toISOString().slice(0, 10));
  const targetStudentId = String(formData.get("targetStudentId") || "").trim();
  const rosterRaw = String(formData.get("roster") || "[]");
  let roster: Array<{ id: string; name: string; course?: string; rut?: string }> = [];
  try {
    roster = JSON.parse(rosterRaw);
  } catch {
    roster = [];
  }

  if (!entity || !(entity in ENTITY_SCHEMAS)) {
    return NextResponse.json({ error: "Entidad inválida" }, { status: 400 });
  }

  const rawFiles = formData.getAll("files");
  const files = rawFiles.filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) {
    return NextResponse.json({ error: "No se recibieron archivos" }, { status: 400 });
  }

  // 10MB total cap to keep things sane.
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  if (totalSize > 12 * 1024 * 1024) {
    return NextResponse.json({ error: `Tamaño total demasiado grande (${(totalSize / 1024 / 1024).toFixed(1)} MB). Máximo 12 MB.` }, { status: 413 });
  }

  const extracted: ExtractedFile[] = [];
  for (const file of files) {
    const ex = await extractFile(file);
    extracted.push(ex);
  }

  const schema = ENTITY_SCHEMAS[entity as keyof typeof ENTITY_SCHEMAS];
  const schemaDesc = `Campos válidos para "${entity}": ${schema.fields.join(", ")}.`
    + ("statuses" in schema ? `\nEstados válidos: ${schema.statuses.join(", ")}.` : "")
    + ("types" in schema ? `\nTipos válidos: ${schema.types.join(", ")}.` : "");

  const targetStudent = targetStudentId ? roster.find((r) => r.id === targetStudentId) : null;
  const rosterTrimmed = roster.slice(0, 500);
  const rosterTable = rosterTrimmed.map((s) => `${s.id}|${s.name}|${s.course || ""}|${s.rut || ""}`).join("\n");

  const textParts: string[] = [];
  textParts.push(`Fecha de hoy: ${today}`);
  textParts.push(`\nENTIDAD OBJETIVO: ${entity}`);
  textParts.push(schemaDesc);
  if (targetStudent) {
    textParts.push(`\nESTUDIANTE OBJETIVO (todos los registros deberían quedar asociados a este estudiante salvo evidencia contraria):\n${targetStudent.id} | ${targetStudent.name} | ${targetStudent.course || ""}`);
  }
  if (rosterTable) {
    textParts.push(`\nNÓMINA (id|nombre|curso|rut, primeros ${rosterTrimmed.length}):\n${rosterTable}`);
  }
  if (instruction) textParts.push(`\nINSTRUCCIÓN DEL USUARIO:\n"""\n${instruction}\n"""`);

  // Add extracted text contents inline
  extracted.forEach((ex, idx) => {
    if (ex.text) {
      textParts.push(`\n=== ARCHIVO ${idx + 1}: ${ex.name} ===\n${ex.text}`);
    } else if (ex.inlinePart) {
      textParts.push(`\n=== ARCHIVO ${idx + 1}: ${ex.name} (adjunto binario - ver inline_data) ===`);
    }
  });

  textParts.push(`\nDevuelve el JSON solicitado con los registros listos para crear en la entidad "${entity}".`);

  const userText = textParts.join("\n");

  // Build Gemini parts: text + inline binaries
  const userParts: Array<{ text?: string } | { inline_data: { mime_type: string; data: string } }> = [{ text: userText }];
  extracted.forEach((ex) => {
    if (ex.inlinePart) userParts.push(ex.inlinePart);
  });

  // Call Gemini directly to include multimodal parts (the shared helper only does text).
  const fallbackChain = [DEFAULT_GEMINI_MODEL, "gemini-2.5-flash-lite", "gemini-2.0-flash"].filter((m, i, arr) => arr.indexOf(m) === i);
  const body = {
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [{ role: "user", parts: userParts }],
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

  let lastStatus = 0;
  let lastMsg = "";
  let parsed: unknown = null;
  let usedModel = DEFAULT_GEMINI_MODEL;
  let usage: unknown = null;

  outer: for (const candidate of fallbackChain) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      if (attempt > 0) await new Promise((r) => setTimeout(r, 800));
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${candidate}:generateContent?key=${apiKey}`;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 50_000);
      let res: Response;
      try {
        res = await fetch(url, {
          method: "POST",
          signal: controller.signal,
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
      const json = (await res.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>; usageMetadata?: unknown };
      const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (!text) { lastStatus = 502; lastMsg = "Sin contenido"; continue; }
      try {
        parsed = JSON.parse(text);
      } catch {
        const m = text.match(/\{[\s\S]*\}/);
        if (!m) { lastStatus = 502; lastMsg = "JSON inválido"; continue; }
        try { parsed = JSON.parse(m[0]); } catch { lastStatus = 502; lastMsg = "JSON inválido"; continue; }
      }
      usedModel = candidate;
      usage = json?.usageMetadata;
      break outer;
    }
  }

  if (!parsed) {
    return NextResponse.json({ error: `Gemini no pudo procesar los archivos. Último: ${lastStatus} ${lastMsg}` }, { status: 503 });
  }

  return NextResponse.json({
    ok: true,
    result: parsed,
    model: usedModel,
    usage,
    filesProcessed: extracted.map((e) => ({ name: e.name, kind: e.inlinePart ? "binary" : "text", chars: e.text?.length || 0 })),
  });
}
