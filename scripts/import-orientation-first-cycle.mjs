import fs from "node:fs";
import crypto from "node:crypto";
import XLSX from "xlsx";

const csvPath = "D:/Descargas/Clases de Orientación FDC - 2026 - 1° Ciclo (PreK-4°B).csv";
const outputPath = "src/lib/orientation-first-cycle.ts";

const clean = (value) =>
  String(value ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const normalizeCourse = (value) =>
  clean(value)
    .replace(/^Pre\s*Kinder/i, "Prekínder")
    .replace(/^Kinder/i, "Kínder");

const isPlaceholderText = (value) => {
  const normalized = clean(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return /^(clase por definir|por definir|sin tema definido|sesion por definir)$/.test(normalized);
};

const pickTopic = (topic, planificacion, notes, axis) =>
  [topic, planificacion, notes, axis].map(clean).find((value) => value && !isPlaceholderText(value)) || "";

const excelDateToIso = (value) => {
  const parsed = XLSX.SSF.parse_date_code(value);
  if (!parsed) return "";
  return `${String(parsed.y).padStart(4, "0")}-${String(parsed.m).padStart(2, "0")}-${String(parsed.d).padStart(2, "0")}`;
};

const dateToIso = (value) => {
  if (typeof value === "number") return excelDateToIso(value);
  const text = clean(value);
  const match = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (match) return `${match[3]}-${match[2].padStart(2, "0")}-${match[1].padStart(2, "0")}`;
  return text;
};

const currentSource = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : "";
const configMatch = currentSource.match(/export const ORIENTATION_FIRST_CYCLE_CONFIG = (\[[\s\S]*?\]) as const;/);
const config = configMatch ? JSON.parse(configMatch[1]) : [];

const csvText = fs.readFileSync(csvPath, "utf8");
const workbook = XLSX.read(csvText, { type: "string", raw: true });
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", raw: true });
const headerIndex = rows.findIndex((row) => row.includes("ID") && row.includes("SEM"));

if (headerIndex === -1) {
  throw new Error("No se encontró la fila de encabezados ID/SEM en el CSV.");
}

const records = rows
  .slice(headerIndex + 1)
  .filter((row) => clean(row[1] || row[2] || row[3]))
  .map((row, index) => {
    const date = dateToIso(row[1]);
    const week = clean(row[2]);
    const course = normalizeCourse(row[3]);
    const axis = clean(row[4]) || "Intervención Formativa";
    const rawTopic = clean(row[5]);
    const status = clean(row[6]) || "Realizado";
    const notes = clean(row[7]);
    const canvaLink = clean(row[8]);
    const planificacion = clean(row[9]);
    const folderLink = clean(row[10]);
    const topic = pickTopic(rawTopic, planificacion, notes, axis);
    const signature = [
      date,
      week,
      course,
      axis,
      rawTopic,
      status,
      notes,
      canvaLink,
      planificacion,
      folderLink,
      index,
    ].join("|");
    const id = `orientacion-primer-ciclo-${crypto.createHash("sha1").update(signature).digest("hex").slice(0, 12)}`;

    return {
      id,
      createdAt: "2026-06-12T00:00:00.000Z",
      updatedAt: "2026-06-12T00:00:00.000Z",
      date,
      week,
      course,
      orientationOwner: "Gustavo Caro",
      orientationEmail: "g.caro.m@colegiosanlucas.com",
      topic,
      axis,
      status,
      canvaLink,
      evidence: canvaLink,
      planificacion,
      folderLink,
      notes,
      source: "Clases de Orientación FDC - 2026 - 1° Ciclo (PreK-4°B).csv",
      sourceSheet: "1° Ciclo (PreK-4°B)",
    };
  });

const output = `export type OrientationSeedRecord = {
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
  source: string;
  sourceSheet: string;
};

export const ORIENTATION_FIRST_CYCLE_SUMMARY = ${JSON.stringify(
  {
    records: records.length,
    configItems: config.length,
    source: "Clases de Orientación FDC - 2026 - 1° Ciclo (PreK-4°B).csv",
  },
  null,
  2,
)} as const;

export const ORIENTATION_FIRST_CYCLE_CONFIG = ${JSON.stringify(config, null, 2)} as const;

export const ORIENTATION_FIRST_CYCLE_CLASSES: OrientationSeedRecord[] = ${JSON.stringify(records, null, 2)};
`;

fs.writeFileSync(outputPath, output, "utf8");

console.log(
  JSON.stringify(
    {
      records: records.length,
      configItems: config.length,
      first: records[0],
      last: records.at(-1),
    },
    null,
    2,
  ),
);
