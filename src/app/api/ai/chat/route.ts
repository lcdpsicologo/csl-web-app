import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import mammoth from "mammoth";
import { getAuthClient, authenticateRequest, getGeminiKey, DEFAULT_GEMINI_MODEL } from "@/lib/gemini";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const MAX_TEXT_PER_FILE = 120_000;
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

type ExtractedFile = {
  name: string;
  type: string;
  text?: string;
  inlinePart?: { inline_data: { mime_type: string; data: string } };
};

type RosterStudent = {
  id: string;
  name: string;
  course?: string;
  rut?: string;
};

const normalizeText = (value: string) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const cleanRut = (value: string) => String(value || "").replace(/[^0-9kK]/g, "").toUpperCase();

const titleCaseName = (value: string) =>
  String(value || "")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part ? `${part[0].toUpperCase()}${part.slice(1)}` : part)
    .join(" ")
    .trim();

const normalizeCourseName = (value: string) =>
  String(value || "")
    .replace(/\bprekinder\b/gi, "Prekínder")
    .replace(/\bpre\s*kinder\b/gi, "Prekínder")
    .replace(/\bkinder\b/gi, "Kínder")
    .replace(/\bKA\b/g, "Kínder A")
    .replace(/\bKB\b/g, "Kínder B")
    .replace(/\bKC\b/g, "Kínder C")
    .replace(/(^|\s)1\s*[ªA](?=\s|$)/gi, (_match, prefix) => `${prefix}1° básico A`)
    .replace(/(^|\s)1\s*B(?=\s|$)/gi, (_match, prefix) => `${prefix}1° básico B`)
    .replace(/(^|\s)2\s*[ªA](?=\s|$)/gi, (_match, prefix) => `${prefix}2° básico A`)
    .replace(/(^|\s)2\s*B(?=\s|$)/gi, (_match, prefix) => `${prefix}2° básico B`)
    .replace(/(^|\s)3\s*[ªA](?=\s|$)/gi, (_match, prefix) => `${prefix}3° básico A`)
    .replace(/(^|\s)3\s*B(?=\s|$)/gi, (_match, prefix) => `${prefix}3° básico B`)
    .replace(/(^|\s)4\s*[ªA](?=\s|$)/gi, (_match, prefix) => `${prefix}4° básico A`)
    .replace(/(^|\s)4\s*B(?=\s|$)/gi, (_match, prefix) => `${prefix}4° básico B`)
    .replace(/\bpk\b/gi, "Prekínder")
    .replace(/\bk\b/gi, "Kínder")
    .replace(/\s+/g, " ")
    .trim();

const looksLikeCourse = (value: string) => {
  const text = normalizeText(value);
  return /\b(pre\s*kinder|prekinder|kinder|k[abc]|[1-8]\s*[°ºª]?\s*[ab]?\s*(basico|basica)?|i{1,3}\s*[°º]?\s*medio|iv\s*[°º]?\s*medio)\b/.test(text);
};

const looksLikeName = (value: string) => {
  if (/@/.test(value)) return false;
  const clean = String(value || "").replace(/\d+/g, " ").replace(/[|,;:\t]/g, " ").trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  return parts.length >= 2 && /[a-záéíóúñ]/i.test(clean) && !looksLikeCourse(clean);
};

const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

const nameFromCell = (value: string) => {
  const withoutEmail = String(value || "").replace(emailPattern, " ").replace(/\s+/g, " ").trim();
  return looksLikeName(withoutEmail) ? withoutEmail : "";
};

const splitRow = (line: string) => {
  if (line.includes("\t")) return line.split("\t").map((cell) => cell.trim());
  if (line.includes(";")) return line.split(";").map((cell) => cell.trim());
  if (line.includes(",")) return line.split(",").map((cell) => cell.trim());
  return line.split(/\s{2,}/).map((cell) => cell.trim()).filter(Boolean);
};

const fieldForHeader = (header: string) => {
  const h = normalizeText(header);
  if (/(nombre|estudiante|alumno|alumna|apellidos)/.test(h)) return "fullName";
  if (/(curso|nivel)/.test(h)) return "course";
  if (/(rut|run)/.test(h)) return "rut";
  if (/(apoderado|madre|padre|tutor)/.test(h)) return "guardianName";
  if (/(telefono|celular|fono)/.test(h)) return "guardianPhone";
  if (/(correo|email|mail)/.test(h)) return "guardianEmail";
  if (/(observacion|nota|diagnostico|pie|nee|apoyo)/.test(h)) return "notes";
  return "";
};

const parseRosterFromText = (text: string, existingRoster: RosterStudent[]) => {
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !/^=+\s*hoja/i.test(line));
  const existingRut = new Set(existingRoster.map((student) => cleanRut(student.rut || "")).filter(Boolean));
  const existingNameCourse = new Set(existingRoster.map((student) => `${normalizeText(student.name)}|${normalizeText(student.course || "")}`));
  const parsed: Array<{ fields: Record<string, string>; confidence: number }> = [];
  const skipped: string[] = [];
  let currentCourse = "";
  let headerMap: string[] = [];

  lines.forEach((line) => {
    if (/retirad[oa]|baja|egresad[oa]|cambiad[oa]/i.test(line)) {
      skipped.push(line.slice(0, 120));
      return;
    }
    const cells = splitRow(line).filter(Boolean);
    if (cells.length === 1 && looksLikeCourse(cells[0])) {
      currentCourse = normalizeCourseName(cells[0]);
      return;
    }
    const mapped = cells.map(fieldForHeader);
    if (mapped.filter(Boolean).length >= 2) {
      headerMap = mapped;
      return;
    }

    const fields: Record<string, string> = {};
    if (headerMap.length && cells.length >= 2) {
      cells.forEach((cell, index) => {
        const key = headerMap[index];
        if (key) fields[key] = cell;
      });
    } else {
      const rutCell = cells.find((cell) => /\b\d{1,2}\.?\d{3}\.?\d{3}-?[0-9kK]\b/.test(cell) || /^\d{7,9}[0-9kK]$/.test(cleanRut(cell)));
      const courseCell = cells.find(looksLikeCourse) || currentCourse;
      const nameCell = cells.find((cell) => cell !== rutCell && cell !== courseCell && nameFromCell(cell));
      if (nameCell) fields.fullName = nameFromCell(nameCell);
      if (courseCell) fields.course = courseCell;
      if (rutCell) fields.rut = rutCell;
      const email = cells.map((cell) => cell.match(emailPattern)?.[0] || "").find(Boolean);
      if (email) fields.guardianEmail = email;
      const phone = cells.find((cell) => /(?:\+?56)?\s*9\s*\d{4}\s*\d{4}/.test(cell.replace(/\D/g, "")) || /\b\d{8,9}\b/.test(cell.replace(/\D/g, "")));
      if (phone) fields.guardianPhone = phone;
    }

    fields.fullName = titleCaseName(nameFromCell(fields.fullName || "") || fields.fullName || "");
    if (/@/.test(fields.fullName)) return;
    fields.course = normalizeCourseName(fields.course || currentCourse || "");
    fields.rut = fields.rut || "";
    if (!fields.fullName) return;
    if (!fields.course) fields.notes = "Curso no detectado automáticamente. Revisar antes de guardar.";

    const rut = cleanRut(fields.rut);
    const key = `${normalizeText(fields.fullName)}|${normalizeText(fields.course)}`;
    if ((rut && existingRut.has(rut)) || existingNameCourse.has(key)) {
      skipped.push(`${fields.fullName} ${fields.course}`.trim());
      return;
    }
    if (parsed.some((item) => `${normalizeText(item.fields.fullName)}|${normalizeText(item.fields.course)}` === key || (rut && cleanRut(item.fields.rut || "") === rut))) {
      skipped.push(`${fields.fullName} ${fields.course}`.trim());
      return;
    }
    parsed.push({ fields, confidence: fields.rut ? 0.92 : fields.course ? 0.78 : 0.58 });
  });

  return { parsed, skipped };
};

const shouldDirectImportStudents = (message: string, extracted: ExtractedFile[]) => {
  const m = normalizeText(message);
  const text = extracted.map((file) => file.text || "").join("\n");
  if (!text.trim()) return false;
  const asksImport = /(nomina|listado|planilla|estudiantes|alumnos|curso|anad|agreg|import|base de datos)/.test(m);
  const normalizedFileText = normalizeText(text);
  const looksRoster = /(rut|run|curso|estudiante|alumno|pre\s*kinder|prekinder|kinder|basico|medio)/.test(normalizedFileText);
  return asksImport || looksRoster;
};

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 8192;
  for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  return Buffer.from(binary, "binary").toString("base64");
};

const decodeHtml = (value: string) =>
  String(value || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;/gi, "'")
    .replace(/&#(\d+);/g, (_match, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_match, code) => String.fromCharCode(parseInt(code, 16)));

const htmlText = (value: string) =>
  decodeHtml(String(value || "").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();

const wordHtmlToTabularText = (html: string) => {
  const parts: string[] = [];
  let currentCourse = "";
  const tokenPattern = /<p[^>]*>[\s\S]*?<\/p>|<table[^>]*>[\s\S]*?<\/table>/gi;
  const tokens = String(html || "").match(tokenPattern) || [];

  tokens.forEach((token) => {
    if (/^<p/i.test(token)) {
      const text = htmlText(token);
      if (text && looksLikeCourse(text)) currentCourse = normalizeCourseName(text);
      return;
    }
    if (!/^<table/i.test(token)) return;
    const rows = token.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
    if (!rows.length) return;
    if (currentCourse) parts.push(currentCourse);
    rows.forEach((row) => {
      const cells = row.match(/<t[dh][^>]*>[\s\S]*?<\/t[dh]>/gi) || [];
      const values = cells.map(htmlText);
      if (values.some(Boolean)) parts.push(values.join("\t"));
    });
    parts.push("");
  });

  return parts.join("\n").trim();
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
  if (
    lower.endsWith(".csv") ||
    lower.endsWith(".tsv") ||
    lower.endsWith(".txt") ||
    lower.endsWith(".md") ||
    lower.endsWith(".markdown") ||
    lower.endsWith(".json") ||
    lower.endsWith(".html") ||
    lower.endsWith(".htm") ||
    type.startsWith("text/") ||
    type.includes("json")
  ) {
    return { name, type, text: new TextDecoder("utf-8").decode(buf).slice(0, MAX_TEXT_PER_FILE) };
  }
  if (lower.endsWith(".docx") || type.includes("wordprocessingml") || type.includes("msword")) {
    try {
      const html = await mammoth.convertToHtml({ buffer: Buffer.from(buf) });
      const tabular = wordHtmlToTabularText(html.value || "");
      if (tabular) return { name, type, text: tabular.slice(0, MAX_TEXT_PER_FILE) };
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
  // Audio (voice messages) — Gemini transcribes and interprets natively.
  if (type.startsWith("audio/") || /\.(webm|m4a|mp3|wav|ogg|aac|flac)$/i.test(lower)) {
    const mime = type.startsWith("audio/")
      ? type
      : lower.endsWith(".m4a") ? "audio/mp4"
      : lower.endsWith(".mp3") ? "audio/mpeg"
      : lower.endsWith(".wav") ? "audio/wav"
      : lower.endsWith(".ogg") ? "audio/ogg"
      : "audio/webm";
    return { name, type, inlinePart: { inline_data: { mime_type: mime, data: arrayBufferToBase64(buf) } } };
  }
  try {
    return { name, type, text: new TextDecoder("utf-8").decode(buf).slice(0, MAX_TEXT_PER_FILE) };
  } catch {
    return { name, type, text: "[Tipo no soportado]" };
  }
};

const SYSTEM_PROMPT = `Eres Tiza-IA, la inteligencia artificial de Tiza Education, la plataforma de gestión escolar del Colegio San Lucas de Lo Espejo. Tu nombre viene de la tiza de pizarra: una herramienta simple, cercana y de colegio de toda la vida — esa es tu personalidad. Eres el copiloto del equipo de orientación y convivencia: amistoso, experto y directo.

IDENTIDAD:
- Te llamas Tiza-IA. Si te preguntan quién eres o cómo te llamas, preséntate como Tiza-IA, la IA de Tiza Education.
- Hablas en primera persona, con calidez profesional. Puedes usar guiños ligeros al mundo escolar y a la tiza ("anotado en la pizarra", "lo dejo registrado") con moderación — máximo uno por respuesta y solo cuando suene natural. Nunca fuerces la metáfora.
- Jamás digas que eres Gemini, Google, un "modelo de lenguaje" ni menciones tecnología subyacente. Eres Tiza-IA.

Lo que puedes hacer:
- Responder cualquier pregunta o consulta sobre los datos del colegio: cuántos casos hay, qué estudiantes tienen alertas, qué entrevistas hay esta semana, cómo está el curso X, qué intervenciones se hicieron para Y, comparativas, ranking, búsquedas. Para esto te paso un RESUMEN DE DATOS con conteos, casos recientes, entrevistas recientes y estadísticas. Úsalo libremente para responder con datos reales.
- Si hay un ARCHIVO DE AUDIO adjunto, es un mensaje de voz del usuario: transcríbelo y trátalo exactamente igual que si lo hubiera escrito (responde la pregunta o crea los registros que dicte). No digas "recibí un audio" — actúa directamente sobre su contenido.
- Conversar sobre orientación, convivencia escolar, sugerencias, recomendaciones, redacción de correos a apoderados, planificación de clases de orientación, etc.
- Ayudar a crear registros cuando el usuario pega correos, mensajes, tablas, o adjunta archivos: detectas qué crear y devuelves las propuestas.
- Si el usuario adjunta o pega una nómina/listado/planilla de estudiantes de un curso, interpreta columnas aunque tengan nombres distintos (Nombre, Estudiante, Alumno, Curso, RUT, RUN, Apoderado, Teléfono, Correo, Observaciones). Propón bulk_import hacia "students" con fields compatibles: fullName, course, rut, guardianName, guardianPhone, guardianEmail, relevantInfo, supportNeeds, notes, tags.
- Si el archivo es una captura de pantalla con una tabla o listado, lee visualmente la información y propón una importación revisable. Si algún dato no se ve claro, indícalo en notes en vez de inventarlo.

REGLA CLAVE: si el usuario hace una PREGUNTA o pide información, NO le digas que "tu función es generar registros". Respondele directamente usando el RESUMEN DE DATOS y tu conocimiento del rol de orientador. Solo creas registros si el usuario explícitamente pide guardar/agregar algo o si pegó contenido que claramente debe convertirse en registros (un correo de la profe jefe, una tabla de talleres, etc.).

DEVOLVÉ SIEMPRE un único JSON válido con esta estructura. Todos los campos son obligatorios — usa array vacío [] o string vacío "" cuando no apliquen:

{
  "intent": "answer" | "student_triage" | "course_update" | "bulk_import" | "file_analysis",
  "summary": "string corto: una oración con lo que estás haciendo. Para 'answer', puedes dejarlo vacío.",
  "answer": "RESPUESTA CONVERSACIONAL en lenguaje natural. Usa Markdown ligero (saltos de línea, listas con guión). Cuando intent=answer este es el campo principal y debe estar lleno.",
  "involvedStudents": [{"studentId": "string", "studentName": "string", "confidence": 0-1, "evidence": "string"}],
  "studentRecords": [{"entity": "cases|interviews|logs|protocols", "studentId": "string", "title": "string", "category": "string", "priority": "string", "status": "string", "type": "string", "date": "YYYY-MM-DD", "description": "string"}],
  "courseTarget": "string",
  "teamAdditions": [{"name": "string", "role": "string", "email": "string"}],
  "ercAppend": "string",
  "courseCases": [{"title": "string", "category": "string", "priority": "string", "description": "string"}],
  "bulkEntity": "string",
  "bulkRecords": [{"entity": "string", "fields": {}, "studentId": "string", "confidence": 0-1}],
  "notes": "string corto con advertencias si las hay"
}

Cómo elegir el intent:
- "answer" (DEFAULT cuando hay duda): el usuario pregunta, pide información, conversación general, redacción de correo, recomendación, etc. Llena "answer". Otros campos vacíos.
- "student_triage": el usuario pegó un correo o relato sobre uno o varios estudiantes que claramente describe una situación a registrar. Llena involvedStudents y studentRecords.
- "course_update": mensaje sobre UN curso específico (cambio de equipo de aula, reunión de ERC, situación del curso). Llena courseTarget, teamAdditions, ercAppend, courseCases.
- "bulk_import": el usuario pegó una tabla con muchas filas. Llena bulkEntity y bulkRecords.
- "file_analysis": hay archivos adjuntos sin contexto claro. Extrae lo útil en el campo apropiado.

Reglas de calidad:
- Sé conversacional, claro y útil. Tono profesional pero cercano — eres Tiza-IA, no un formulario.
- Cuando respondas con datos, menciona números concretos del RESUMEN DE DATOS.
- Si te falta info para responder con precisión, dilo honestamente.
- Nunca inventes nombres, RUTs, fechas o hechos.
- En español chileno neutro (sin voseo argentino).

Categorías para casos: Convivencia, Socioemocional, Académico, Asistencia, Familiar, PIE/NEE, Otro.
Prioridades: Baja, Media, Alta, Crítica.
Tipos de bitácora: Seguimiento, Entrevista, Observación, Crisis, Coordinación, Otro.
Roles equipo de aula: Profesor/a jefe, Profesor/a de asignatura, Asistente de aula, Educadora diferencial, Educadora de párvulos, Técnico en párvulos, Inspector/a, Psicóloga, Trabajadora social, Coordinadora de convivencia, Orientador/a, Otro apoyo.`;

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
  const dataContextRaw = String(formData.get("dataContext") || "");
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
  if (totalSize > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: `Archivos demasiado grandes (${(totalSize / 1024 / 1024).toFixed(1)} MB). Máximo 4 MB por envío.` }, { status: 413 });
  }

  const extracted: ExtractedFile[] = [];
  for (const file of files) extracted.push(await extractFile(file));

  if (shouldDirectImportStudents(message, extracted)) {
    const parsed = extracted
      .filter((file) => file.text)
      .map((file) => parseRosterFromText(file.text || "", roster))
      .reduce(
        (acc, item) => ({
          parsed: [...acc.parsed, ...item.parsed],
          skipped: [...acc.skipped, ...item.skipped],
        }),
        { parsed: [] as Array<{ fields: Record<string, string>; confidence: number }>, skipped: [] as string[] },
      );
    const hasParsedRows = parsed.parsed.length > 0;
    return NextResponse.json({
      ok: true,
      result: {
        intent: hasParsedRows ? "bulk_import" : "file_analysis",
        summary: hasParsedRows
          ? `Encontré ${parsed.parsed.length} estudiante${parsed.parsed.length === 1 ? "" : "s"} nuevos para revisar antes de guardar.`
          : "Leí el archivo, pero no detecté filas completas de estudiantes para importar.",
        answer: hasParsedRows
          ? ""
          : "Pude leer el archivo sin llamar a Gemini, para evitar el timeout. No encontré nombres con estructura suficiente para importarlos con seguridad. Conviene reenviarlo como Excel/CSV o pegar aquí algunas filas de ejemplo con nombre y curso.",
        involvedStudents: [],
        studentRecords: [],
        courseTarget: "",
        teamAdditions: [],
        ercAppend: "",
        courseCases: [],
        bulkEntity: hasParsedRows ? "students" : "",
        bulkRecords: parsed.parsed.map((item) => ({
          entity: "students",
          fields: item.fields,
          studentId: "",
          confidence: item.confidence,
        })),
        notes: hasParsedRows
          ? parsed.skipped.length
            ? `Salté ${parsed.skipped.length} fila${parsed.skipped.length === 1 ? "" : "s"} por posible duplicado, retiro/baja o datos insuficientes. Revisa antes de confirmar.`
            : "Importación detectada automáticamente desde el archivo. Revisa antes de confirmar."
          : parsed.skipped.length
            ? `No quedaron filas importables. Además, salté ${parsed.skipped.length} fila${parsed.skipped.length === 1 ? "" : "s"} por posible duplicado, retiro/baja o datos insuficientes.`
            : "No se llamó a Gemini porque esta solicitud parece una importación de nómina y se procesó localmente para evitar esperas largas.",
      },
      model: "direct-roster-parser",
      filesProcessed: extracted.map((e) => ({ name: e.name, kind: e.inlinePart ? "binary" : "text" })),
    });
  }

  const hasFiles = extracted.length > 0;
  const rosterTrimmed = roster.slice(0, hasFiles ? 300 : 500);
  const rosterTable = rosterTrimmed.map((s) => `${s.id}|${s.name}|${s.course || ""}|${s.rut || ""}`).join("\n");
  const coursesList = courses.slice(0, 80).map((c) => `${c.name}${c.cycle ? ` (${c.cycle})` : ""}`).join("\n");

  const parts: Array<{ text?: string } | { inline_data: { mime_type: string; data: string } }> = [];
  const textBlocks: string[] = [];
  textBlocks.push(`Fecha de hoy: ${today}`);
  if (dataContextRaw) textBlocks.push(`\nRESUMEN DE DATOS DEL COLEGIO (úsalo para responder consultas):\n${dataContextRaw.slice(0, hasFiles ? 7000 : 12000)}`);
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

  const fallbackChain = (hasFiles
    ? ["gemini-2.5-flash-lite", "gemini-2.0-flash-lite", "gemini-2.0-flash", DEFAULT_GEMINI_MODEL]
    : [DEFAULT_GEMINI_MODEL, "gemini-2.5-flash-lite", "gemini-2.0-flash-lite", "gemini-2.0-flash"]
  ).filter((m, i, arr) => arr.indexOf(m) === i);
  let parsed: unknown = null;
  let usedModel = DEFAULT_GEMINI_MODEL;
  let lastStatus = 0;
  let lastMsg = "";

  outer: for (const candidate of fallbackChain) {
    for (let attempt = 0; attempt < (hasFiles ? 1 : 2); attempt += 1) {
      if (attempt > 0) await new Promise((r) => setTimeout(r, 800));
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${candidate}:generateContent?key=${apiKey}`;
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), hasFiles ? 16_000 : 25_000);
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
