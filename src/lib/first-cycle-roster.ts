export type OfficialRosterStudent = {
  fullName: string;
  course: string;
  rut: string;
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string;
  notes: string;
};

export const FIRST_CYCLE_COURSES = [
  "Prekínder A",
  "Prekínder B",
  "Prekínder C",
  "Kínder A",
  "Kínder B",
  "Kínder C",
  "1° Básico A",
  "1° Básico B",
  "2° Básico A",
  "2° Básico B",
  "3° Básico A",
  "3° Básico B",
  "4° Básico A",
  "4° Básico B",
];

export const cleanRutValue = (value: string) => String(value || "").replace(/[^0-9kK]/g, "").toUpperCase();

const normalizeText = (value: string) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const titleCaseName = (value: string) =>
  String(value || "")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part ? `${part[0].toUpperCase()}${part.slice(1)}` : part)
    .join(" ")
    .trim();

export const normalizeRosterCourseName = (value: string) => {
  const raw = String(value || "").trim();
  const normalized = normalizeText(raw).replace(/\s+/g, " ");
  const compact = normalized.replace(/\s+/g, "");

  if (/^pre\s*kinder\s*a$|^prekinder\s*a$/.test(normalized)) return "Prekínder A";
  if (/^pre\s*kinder\s*b$|^prekinder\s*b$/.test(normalized)) return "Prekínder B";
  if (/^pre\s*kinder\s*c$|^prekinder\s*c$/.test(normalized)) return "Prekínder C";
  if (/^(kinder|k)\s*a$|^ka$/.test(normalized) || compact === "kindera") return "Kínder A";
  if (/^(kinder|k)\s*b$|^kb$/.test(normalized) || compact === "kinderb") return "Kínder B";
  if (/^(kinder|k)\s*c$|^kc$/.test(normalized) || compact === "kinderc") return "Kínder C";

  const basic = normalized.match(/^([1-4])\s*(?:°|º|ª|a|b)?\s*(?:basico|basica)?\s*([ab])?$/i);
  if (basic) {
    const level = basic[1];
    const section = (basic[2] || (/[ªa]$/i.test(raw.trim()) ? "A" : /b$/i.test(raw.trim()) ? "B" : "")).toUpperCase();
    if (section === "A" || section === "B") return `${level}° Básico ${section}`;
  }

  const inText = normalized.match(/\b([1-4])\s*(?:°|º|ª)?\s*(?:basico|basica)\s*([ab])\b/i);
  if (inText) return `${inText[1]}° Básico ${inText[2].toUpperCase()}`;

  return raw;
};

export const isFirstCycleCourse = (course: string) => {
  const normalized = normalizeText(normalizeRosterCourseName(course));
  return FIRST_CYCLE_COURSES.some((official) => normalizeText(official) === normalized);
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

const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

const looksLikeCourse = (value: string) => {
  const text = normalizeText(value);
  return /\b(pre\s*kinder|prekinder|kinder|k[abc]|[1-4]\s*[°ºª]?\s*[ab]?\s*(basico|basica)?)\b/.test(text);
};

const looksLikeStudentName = (value: string) => {
  const text = String(value || "").trim();
  if (!text || /@/.test(text)) return false;
  const normalized = normalizeText(text);
  if (
    /^(nombre|estudiante|alumno|alumna|curso|rut|run|correo|email|apoderado|telefono|fono|observacion|n°|no|numero)$/i.test(normalized) ||
    /retirad|cambiad|baja|egresad/.test(normalized) ||
    looksLikeCourse(text)
  ) return false;
  const words = text.split(/\s+/).filter((word) => /[a-záéíóúñ]/i.test(word));
  return words.length >= 2;
};

const pickNameCell = (cells: string[]) => {
  const candidates = cells
    .map((cell) => cell.replace(emailPattern, " ").replace(/\s+/g, " ").trim())
    .filter(looksLikeStudentName);
  return candidates.sort((a, b) => b.split(/\s+/).length - a.split(/\s+/).length)[0] || "";
};

export function parseFirstCycleRosterHtml(html: string) {
  const students: OfficialRosterStudent[] = [];
  const skipped: string[] = [];
  const seen = new Set<string>();
  let currentCourse = "";
  let tableIndex = 0;

  const tokenPattern = /<p[^>]*>[\s\S]*?<\/p>|<table[^>]*>[\s\S]*?<\/table>/gi;
  const tokens = String(html || "").match(tokenPattern) || [];

  tokens.forEach((token) => {
    if (/^<p/i.test(token)) {
      const text = htmlText(token);
      if (text && looksLikeCourse(text)) currentCourse = normalizeRosterCourseName(text);
      return;
    }

    if (!/^<table/i.test(token)) return;
    const tableCourse = isFirstCycleCourse(currentCourse) ? currentCourse : FIRST_CYCLE_COURSES[tableIndex] || "";
    tableIndex += 1;

    const rows = token.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
    let headerMap: Record<string, number> = {};
    rows.forEach((row) => {
      const cells = (row.match(/<t[dh][^>]*>[\s\S]*?<\/t[dh]>/gi) || []).map(htmlText).filter(Boolean);
      const line = cells.join(" ");
      if (!line) return;
      const headerHits = cells
        .map((cell, index) => ({ cell: normalizeText(cell), index }))
        .filter(({ cell }) => /^(n°|nº|no|numero|alumno|alumna|estudiante|nombre|rut|run|apoderado|correo|email)$/.test(cell));
      if (headerHits.length >= 2) {
        headerMap = {};
        headerHits.forEach(({ cell, index }) => {
          if (/alumno|alumna|estudiante|nombre/.test(cell)) headerMap.fullName = index;
          if (/rut|run/.test(cell)) headerMap.rut = index;
          if (/apoderado/.test(cell)) headerMap.guardianName = index;
          if (/correo|email/.test(cell)) headerMap.guardianEmail = index;
        });
        return;
      }
      if (/retirad[oa]|cambiad[oa]|baja|egresad[oa]/i.test(line)) {
        skipped.push(line.slice(0, 120));
        return;
      }
      const fullName = titleCaseName(
        looksLikeStudentName(cells[headerMap.fullName] || "") ? cells[headerMap.fullName] : pickNameCell(cells)
      );
      if (!fullName || !tableCourse) return;

      const course = normalizeRosterCourseName(cells.find((cell) => isFirstCycleCourse(cell)) || tableCourse);
      if (!isFirstCycleCourse(course)) return;
      const rut = cleanRutValue(
        cells[headerMap.rut] ||
        cells.find((cell) => /\b\d{1,2}\.?\d{3}\.?\d{3}-?[0-9kK]\b/.test(cell) || /^\d{7,9}[0-9kK]$/.test(cleanRutValue(cell))) ||
        ""
      );
      const guardianEmail =
        (cells[headerMap.guardianEmail] || "").match(emailPattern)?.[0] ||
        cells.map((cell) => cell.match(emailPattern)?.[0] || "").find(Boolean) ||
        "";
      const guardianName = looksLikeStudentName(cells[headerMap.guardianName] || "") ? titleCaseName(cells[headerMap.guardianName]) : "";
      const key = `${normalizeText(fullName)}|${normalizeText(course)}`;
      if (seen.has(key) || (rut && seen.has(`rut:${rut}`))) return;
      seen.add(key);
      if (rut) seen.add(`rut:${rut}`);

      students.push({
        fullName,
        course,
        rut,
        guardianName,
        guardianEmail,
        guardianPhone: "",
        notes: "",
      });
    });
  });

  const byCourse = FIRST_CYCLE_COURSES.reduce<Record<string, number>>((acc, course) => {
    acc[course] = students.filter((student) => normalizeText(student.course) === normalizeText(course)).length;
    return acc;
  }, {});

  return { students, byCourse, skipped };
}
