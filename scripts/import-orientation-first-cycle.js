const fs = require("node:fs");
const path = require("node:path");

const SOURCE_NAME = "Clases de Orientación FDC - 2026 - 1° Ciclo (PreK-4°B).csv";
const SOURCE_SHEET = "1° Ciclo (PreK-4°B)";
const OWNER = "Gustavo Caro";
const OWNER_EMAIL = "g.caro.m@colegiosanlucas.com";
const CREATED_AT = "2026-06-12T00:00:00.000Z";

const inputPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(process.cwd(), "..", "..", "Downloads", SOURCE_NAME);
const outputPath = path.resolve(process.cwd(), "src", "lib", "orientation-first-cycle.ts");

const parseCsv = (text) => {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        cell += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell.replace(/\r$/, ""));
  rows.push(row);
  return rows;
};

const clean = (value) => String(value || "").replace(/\s+/g, " ").trim();

const normalizeCourse = (value) => clean(value)
  .replace(/^Pre\s*Kinder/i, "Prekínder")
  .replace(/^Kinder/i, "Kínder")
  .replace(/Basico/gi, "Básico");

const parseDate = (value) => {
  const match = clean(value).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return "";
  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
};

const normalizeForId = (value) => clean(value)
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

const hash = (value) => {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = ((h << 5) - h + value.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(16).padStart(8, "0");
};

const isCourseValue = (value) => /^(pre\s*kinder|prekínder|kinder|kínder|\d°\s*básico)/i.test(clean(value));

const TODAY = new Date().toISOString().slice(0, 10);

const statusForRow = (row) => {
  const status = clean(row.status);
  if (status && !isCourseValue(status)) return status;
  return row.date && row.date >= TODAY ? "Planificado" : "Realizado";
};

const readRows = () => {
  const text = fs.readFileSync(inputPath, "utf8").replace(/^\uFEFF/, "");
  const table = parseCsv(text);
  const headerIndex = table.findIndex((row) => row.some((cell) => clean(cell) === "CURSO"));
  if (headerIndex === -1) throw new Error("No se encontró la fila de encabezados con CURSO.");
  const headers = table[headerIndex].map(clean);

  return table.slice(headerIndex + 1)
    .map((cells) => Object.fromEntries(headers.map((header, index) => [header || `col${index}`, clean(cells[index])])))
    .map((row) => ({
      rawDate: row.SEM,
      date: parseDate(row.SEM),
      week: row.FECHA,
      course: normalizeCourse(row.CURSO),
      axis: row["ACCIÓN / FORTALEZA"],
      topic: row["TEMA / COMENTARIO"],
      status: row.ESTADO,
      notes: row.OBSERVACIONES,
      canvaLink: row.Canva,
      planificacion: row["Planificación"],
      folderLink: row.Carpeta,
    }))
    .filter((row) => row.date && row.week && row.course);
};

const records = readRows().map((row, index) => {
  const key = [row.date, row.week, row.course, row.axis, row.topic || row.notes, row.canvaLink].join("|");
  const id = `orientacion-primer-ciclo-${hash(key)}${index.toString(36)}`;
  const status = statusForRow(row);
  return {
    id,
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    date: row.date,
    week: row.week,
    course: row.course,
    orientationOwner: OWNER,
    orientationEmail: OWNER_EMAIL,
    topic: row.topic || row.notes || row.axis || "Clase de orientación",
    axis: row.axis || "Intervención Formativa",
    status,
    canvaLink: row.canvaLink,
    evidence: row.canvaLink,
    planificacion: row.planificacion,
    folderLink: row.folderLink,
    notes: row.notes,
    // Las reprogramadas traen el motivo en OBSERVACIONES; solo se incluye la
    // clave en ese caso para no pisar motivos escritos desde la app.
    ...(/reprogramad/i.test(status) && row.notes ? { reprogramReason: row.notes } : {}),
    source: SOURCE_NAME,
    sourceSheet: SOURCE_SHEET,
  };
});

const weekRanges = [
  "02/03 al 06/03 (Semana 1)",
  "09/03 al 13/03 (Semana 2)",
  "16/03 al 20/03 (Semana 3)",
  "23/03 al 27/03 (Semana 4)",
  "30/03 al 03/04 (Semana 5)",
  "06/04 al 10/04 (Semana 6)",
  "13/04 al 17/04 (Semana 7)",
  "20/04 al 24/04 (Semana 8)",
  "27/04 al 01/05 (Semana 9)",
  "04/05 al 08/05 (Semana 10)",
  "11/05 al 15/05 (Semana 11)",
  "18/05 al 22/05 (Semana 12)",
  "25/05 al 29/05 (Semana 13)",
  "01/06 al 05/06 (Semana 14)",
  "08/06 al 12/06 (Semana 15)",
  "15/06 al 19/06 (Semana 16)",
  "22/06 al 26/06 (Semana 17)",
  "29/06 al 03/07 (Semana 18)",
  "06/07 al 10/07 (Semana 19)",
  "13/07 al 17/07 (Semana 20)",
  "20/07 al 24/07 (Semana 21)",
  "27/07 al 31/07 (Semana 22)",
  "03/08 al 07/08 (Semana 23)",
  "10/08 al 14/08 (Semana 24)",
  "17/08 al 21/08 (Semana 25)",
  "24/08 al 28/08 (Semana 26)",
  "31/08 al 04/09 (Semana 27)",
  "07/09 al 11/09 (Semana 28)",
  "14/09 al 18/09 (Semana 29)",
  "21/09 al 25/09 (Semana 30)",
  "28/09 al 02/10 (Semana 31)",
  "05/10 al 09/10 (Semana 32)",
  "12/10 al 16/10 (Semana 33)",
  "19/10 al 23/10 (Semana 34)",
  "26/10 al 30/10 (Semana 35)",
  "02/11 al 06/11 (Semana 36)",
  "09/11 al 13/11 (Semana 37)",
  "16/11 al 20/11 (Semana 38)",
  "23/11 al 27/11 (Semana 39)",
  "30/11 al 04/12 (Semana 40)",
  "07/12 al 11/12 (Semana 41)",
  "14/12 al 18/12 (Semana 42)",
  "21/12 al 25/12 (Semana 43)",
  "28/12 al 31/12 (Semana 44)",
];

const configWeeks = weekRanges.map((week, index) => {
  const previous = [
    ["Soy amable", "Sesión 1"],
    ["Soy correcto", "Sesión 2"],
    ["Tengo propósito", "Sesión 3"],
    ["Soy responsable", "Sesión 4"],
    ["Tengo afán de superación", "Sesión 5"],
    ["Soy entusiasta", "Sesión 6"],
    ["Soy constructivo", "Sesión 7"],
    ["Hago las cosas bien", "Sesión 8"],
    ["Consejo de Curso", "Sesión 9"],
    ["Intervención Formativa", "Sesión 10"],
    ["Intervención estudiantes", ""],
    ["Intervención apoderados", ""],
    ["Día sin clases", ""],
    ["Aplicación Pulso Digital", ""],
  ][index] || ["", ""];
  return {
    action: previous[0],
    session: previous[1],
    week,
  };
});

const file = `export type OrientationSeedRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  date: string;
  week: string;
  course: string;
  orientationOwner: string;
  orientationEmail: string;
  topic: string;
  axis: string;
  status: string;
  canvaLink: string;
  evidence: string;
  planificacion: string;
  folderLink: string;
  notes: string;
  reprogramReason?: string;
  source: string;
  sourceSheet: string;
};

export const ORIENTATION_FIRST_CYCLE_SUMMARY = ${JSON.stringify({
  records: records.length,
  configItems: configWeeks.length,
  source: SOURCE_NAME,
}, null, 2)} as const;

export const ORIENTATION_FIRST_CYCLE_CONFIG = ${JSON.stringify(configWeeks, null, 2)} as const;

export const ORIENTATION_FIRST_CYCLE_CLASSES: OrientationSeedRecord[] = ${JSON.stringify(records, null, 2)};
`;

fs.writeFileSync(outputPath, file, "utf8");
console.log(`Generated ${records.length} records in ${outputPath}`);
