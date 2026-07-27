// Columna vertebral FDC 2026: secuencia oficial de talleres pendientes por curso
// y lógica de continuidad para la bitácora de orientación.
//
// - La clase "sugerida" de un curso es la primera de la secuencia que aún no
//   tiene un registro Realizada que la respalde (ni la cubre el avance base).
// - Si la última clase Realizada del curso no pertenece a la secuencia (una
//   intervención formativa o tema emergente), se levanta una alerta para
//   retomar la columna vertebral con la clase que corresponde.
//
// Datos generados desde el Excel oficial con scripts/import-columna-vertebral.py.

import { COLUMNA_VERTEBRAL, type ColumnaClass } from "@/lib/columna-vertebral-data";

export type { ColumnaClass } from "@/lib/columna-vertebral-data";

// Avance confirmado al 24-07-2026: el Excel de origen quedó congelado antes de
// la semana del 20 al 24 de julio, así que este piso registra la última clase
// de la secuencia realizada esa semana en cada curso (0 = aún no parte).
export const COLUMNA_BASELINE_DATE = "2026-07-24";
const COLUMNA_BASELINE_DONE: Record<string, number> = {
  prekindera: 1, // Yo soy respetuoso
  prekinderb: 1,
  prekinderc: 1,
  kindera: 1, // La regla de oro
  kinderb: 1,
  kinderc: 1,
  "1basicoa": 1, // ¿Para qué sirven las reglas?
  "1basicob": 1,
  "2basicoa": 1, // ¿Cómo se sentirá?
  "2basicob": 1,
  "3basicoa": 2, // Queremos una sana convivencia + Bromas que no son bromas
  "3basicob": 2,
  "4basicoa": 0, // En intervención sexualidad + RICE; parte con En tus zapatos (SENDA N°1)
  "4basicob": 0,
};

export const columnaCourseKey = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");

export const columnaForCourse = (course: string): ColumnaClass[] | null =>
  COLUMNA_VERTEBRAL[columnaCourseKey(course)] || null;

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// Coincidencia por igualdad exacta o por contención (con largo mínimo para no
// emparejar textos genéricos como "Sesión 1").
export const matchColumnaClass = (course: string, text: string | undefined): ColumnaClass | null => {
  const classes = columnaForCourse(course);
  const normalized = normalizeText(text || "");
  if (!classes || !normalized) return null;
  for (const item of classes) {
    const title = normalizeText(item.title);
    if (normalized === title) return item;
    if (title.length >= 8 && normalized.includes(title)) return item;
    if (normalized.length >= 8 && title.includes(normalized)) return item;
  }
  return null;
};

export type ColumnaRecordLike = {
  course?: string;
  topic?: string;
  notes?: string;
  observations?: string;
  status?: string;
  date?: string;
  updatedAt?: string;
};

const matchColumnaRecord = (course: string, record: ColumnaRecordLike): ColumnaClass | null =>
  matchColumnaClass(course, record.topic) ||
  matchColumnaClass(course, record.notes) ||
  matchColumnaClass(course, record.observations);

export type ColumnaProgress = {
  classes: ColumnaClass[];
  done: Set<number>;
  next: ColumnaClass | null;
  // Última clase Realizada (posterior al avance base) que quedó fuera de la
  // secuencia oficial: pide retomar la columna vertebral con `next`.
  offPlan: { title: string; date: string } | null;
};

export const columnaProgress = (
  course: string,
  records: ColumnaRecordLike[],
  options?: { reserveUpcoming?: boolean; reserveFromDate?: string },
): ColumnaProgress | null => {
  const classes = columnaForCourse(course);
  if (!classes) return null;
  const key = columnaCourseKey(course);
  const courseRecords = records.filter((record) => columnaCourseKey(record.course || "") === key);

  const done = new Set<number>();
  const baseline = COLUMNA_BASELINE_DONE[key] || 0;
  classes.forEach((item) => {
    if (item.order <= baseline) done.add(item.order);
  });
  const realized = courseRecords.filter((record) => /realizad/i.test(record.status || ""));
  realized.forEach((record) => {
    const match = matchColumnaRecord(course, record);
    if (match) done.add(match.order);
  });

  // Para el creador semanal: las clases ya agendadas (Planificada/Pendiente)
  // también reservan su lugar, así dos semanas seguidas no repiten sugerencia.
  const reserved = new Set(done);
  if (options?.reserveUpcoming) {
    courseRecords
      .filter((record) => /planificad|pendiente/i.test(record.status || ""))
      .filter((record) => !options.reserveFromDate || String(record.date || "").slice(0, 10) >= options.reserveFromDate)
      .forEach((record) => {
        const match = matchColumnaRecord(course, record);
        if (match) reserved.add(match.order);
      });
  }
  const next = classes.find((item) => !reserved.has(item.order)) || null;

  const recent = realized
    .filter((record) => String(record.date || "").slice(0, 10) > COLUMNA_BASELINE_DATE)
    .filter((record) => (record.topic || record.notes || record.observations || "").trim())
    .sort((a, b) => String(a.date || a.updatedAt || "").localeCompare(String(b.date || b.updatedAt || "")));
  const last = recent[recent.length - 1];
  const offPlan = last && next && !matchColumnaRecord(course, last)
    ? {
        title: (last.topic || last.notes || last.observations || "Actividad formativa").trim(),
        date: String(last.date || "").slice(0, 10),
      }
    : null;

  return { classes, done, next, offPlan };
};
