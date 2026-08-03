// Extrae la planificación clase por clase desde el Excel maestro
// ("Columna vertebral") y genera src/lib/orientation-class-plans.ts.
//
// Uso:  node scripts/build-orientation-plans.js FDC-planificacion-original.xlsx
//
// El módulo generado es SOLO DE SERVIDOR: pesa ~1.5 MB y lo consume la ruta
// /api/orientation/plan bajo demanda, para no inflar el bundle del navegador.

const path = require("path");
const fs = require("fs");
const XLSX = require(path.join(__dirname, "..", "node_modules", "xlsx"));

const SOURCE = process.argv[2] || "FDC-planificacion-original.xlsx";
const OUT = path.join(__dirname, "..", "src", "lib", "orientation-class-plans.ts");

const clean = (value) => String(value ?? "").replace(/\r\n/g, "\n").trim();

const wb = XLSX.readFile(SOURCE);
const sheet = wb.Sheets["Columna vertebral"];
if (!sheet) {
  console.error('No se encontró la hoja "Columna vertebral" en', SOURCE);
  process.exit(1);
}

const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: false });
const headers = rows[2].map((h) => clean(h));
const col = (name) => headers.findIndex((h) => h === name);

const IDX = {
  course: col("Curso"),
  order: col("Orden programa"),
  block: col("Bloque"),
  strength: col("Fortaleza"),
  number: col("N°"),
  title: col("Taller pendiente"),
  priority: col("Prioridad"),
  comesFrom: col("Viene de"),
  bridge: col("Puente pedagógico"),
  preparesFor: col("Prepara para"),
  microObjective: col("Microobjetivo"),
  focusStrategies: col("Estrategias Focus integradas"),
  stepByStep: col("Planificación completa paso a paso"),
  script: col("Guion base para presentación"),
  materials: col("Materiales, páginas y recursos"),
  pptPrep: col("Preparación específica para PPT/material"),
};

const missing = Object.entries(IDX).filter(([, i]) => i < 0);
if (missing.length) {
  console.error("Columnas no encontradas:", missing.map(([k]) => k).join(", "));
  process.exit(1);
}

const plans = rows
  .slice(3)
  .filter((r) => r && clean(r[IDX.course]))
  .map((r) => ({
    course: clean(r[IDX.course]),
    order: Number(clean(r[IDX.order])) || 0,
    block: clean(r[IDX.block]),
    strength: clean(r[IDX.strength]),
    number: clean(r[IDX.number]),
    title: clean(r[IDX.title]),
    priority: clean(r[IDX.priority]),
    comesFrom: clean(r[IDX.comesFrom]),
    bridge: clean(r[IDX.bridge]),
    preparesFor: clean(r[IDX.preparesFor]),
    microObjective: clean(r[IDX.microObjective]),
    focusStrategies: clean(r[IDX.focusStrategies]),
    stepByStep: clean(r[IDX.stepByStep]),
    script: clean(r[IDX.script]),
    materials: clean(r[IDX.materials]),
    pptPrep: clean(r[IDX.pptPrep]),
  }));

const courses = [...new Set(plans.map((p) => p.course))];

const banner = `// GENERADO AUTOMÁTICAMENTE por scripts/build-orientation-plans.js
// Fuente: ${path.basename(SOURCE)} — hoja "Columna vertebral"
// ${plans.length} clases planificadas en ${courses.length} cursos.
// NO EDITAR A MANO: vuelve a correr el script si cambia el Excel.
//
// SOLO SERVIDOR: lo consume /api/orientation/plan. No importar desde page.tsx
// (pesa ~1.5 MB y se iría entero al bundle del navegador).
`;

const body = `${banner}
export type OrientationClassPlan = {
  /** Curso oficial, ej. "Pre Kinder A" */
  course: string;
  /** Orden dentro del programa anual del curso */
  order: number;
  /** Bloque temático, ej. "Bloque 1: Clima seguro y respeto" */
  block: string;
  /** Fortaleza SOY+ trabajada, ej. "Soy respetuoso" */
  strength: string;
  /** N° de sesión dentro de la fortaleza */
  number: string;
  /** Nombre del taller / clase */
  title: string;
  priority: string;
  /** Clase anterior de la que viene */
  comesFrom: string;
  /** Puente pedagógico con la clase anterior */
  bridge: string;
  /** Clase siguiente para la que prepara */
  preparesFor: string;
  microObjective: string;
  focusStrategies: string;
  /** Planificación completa paso a paso (45 min) */
  stepByStep: string;
  /** Guion diapositiva por diapositiva para armar el Canva */
  script: string;
  materials: string;
  pptPrep: string;
};

export const ORIENTATION_PLAN_SUMMARY = {
  plans: ${plans.length},
  courses: ${courses.length},
  source: ${JSON.stringify(path.basename(SOURCE))},
} as const;

const norm = (value: string) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

export const ORIENTATION_CLASS_PLANS: OrientationClassPlan[] = ${JSON.stringify(plans, null, 0)};

/** Índice curso|título para búsqueda exacta en O(1). */
const byKey = new Map<string, OrientationClassPlan>();
for (const plan of ORIENTATION_CLASS_PLANS) {
  byKey.set(\`\${norm(plan.course)}|\${norm(plan.title)}\`, plan);
}

/**
 * Busca la planificación de una clase. Intenta coincidencia exacta de
 * curso+título; si no la halla, cae a coincidencia parcial dentro del curso
 * (los temas de la bitácora a veces traen prefijos o texto extra).
 */
export const findClassPlan = (course: string, topic: string): OrientationClassPlan | null => {
  const c = norm(course);
  const t = norm(topic);
  if (!c || !t) return null;

  const exact = byKey.get(\`\${c}|\${t}\`);
  if (exact) return exact;

  const sameCourse = ORIENTATION_CLASS_PLANS.filter((plan) => norm(plan.course) === c);
  if (!sameCourse.length) return null;

  // Contención en cualquier dirección, quedándose con el título más largo
  // (el más específico) cuando varios calzan.
  let best: OrientationClassPlan | null = null;
  for (const plan of sameCourse) {
    const title = norm(plan.title);
    if (!title) continue;
    if (t.includes(title) || title.includes(t)) {
      if (!best || title.length > norm(best.title).length) best = plan;
    }
  }
  return best;
};

/** Todas las clases planificadas de un curso, en orden del programa. */
export const plansForCourse = (course: string): OrientationClassPlan[] => {
  const c = norm(course);
  return ORIENTATION_CLASS_PLANS.filter((plan) => norm(plan.course) === c).sort((a, b) => a.order - b.order);
};
`;

fs.writeFileSync(OUT, body, "utf8");
const kb = (fs.statSync(OUT).size / 1024).toFixed(0);
console.log(`OK  ${plans.length} planificaciones · ${courses.length} cursos · ${kb} KB`);
console.log(`    -> ${path.relative(path.join(__dirname, ".."), OUT)}`);
console.log(`    cursos: ${courses.join(", ")}`);
