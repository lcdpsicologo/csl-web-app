import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import XLSX from "xlsx";

// Completa la bitácora con el plan del segundo y tercer trimestre: nombre de la
// clase, fortaleza, objetivo, y la referencia a la planificación y carpeta de
// Drive. Así solo queda pegar el enlace de Canva.
//
// Uso: node scripts/import-orientation-plan.mjs [--apply] [ruta-carpeta]
const projectDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const applyChanges = process.argv.includes("--apply");
const planRoot = process.argv.slice(2).find((arg) => !arg.startsWith("--"))
  || path.resolve(projectDirectory, "..", "Colegio San Lucas  Orientación 2026  Segundo y Tercer Trimestre",
    "Colegio San Lucas _ Orientación 2026 _ Segundo y Tercer Trimestre");

const normalize = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

// Los cursos se escriben distinto en el plan y en la bitácora.
const canonicalCourse = (value) => {
  const text = normalize(value);
  const level = text.match(/(\d)\s*(?:°|º)?\s*basico/);
  const letter = (text.match(/\b([abc])\b\s*$/) || [])[1];
  if (/pre\s*kinder|prekinder/.test(text)) return `Prekínder ${(letter || "A").toUpperCase()}`;
  if (/kinder/.test(text)) return `Kínder ${(letter || "A").toUpperCase()}`;
  if (level) return `${level[1]}° Básico ${(letter || "A").toUpperCase()}`;
  return String(value || "").trim();
};

// Día de la semana en que cada curso tiene orientación (horario 2026).
const COURSE_WEEKDAY = {
  "Kínder B": 1, "1° Básico A": 1, "3° Básico A": 1, "4° Básico A": 1,
  "2° Básico B": 2, "Prekínder B": 2, "4° Básico B": 2,
  "Prekínder C": 3, "1° Básico B": 3,
  "Kínder A": 4, "3° Básico B": 4,
  "Prekínder A": 5, "2° Básico A": 5, "Kínder C": 5,
};

// "20/07 al 24/07" -> lunes de ese tramo.
const mondayFromRange = (range, year = 2026) => {
  const match = String(range || "").match(/(\d{1,2})[/-](\d{1,2})/);
  if (!match) return null;
  return new Date(year, Number(match[2]) - 1, Number(match[1]));
};

const isoDate = (date) => {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const dateForClass = (range, course) => {
  const monday = mondayFromRange(range);
  if (!monday) return "";
  const weekday = COURSE_WEEKDAY[course] || 1;
  const date = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + weekday - 1);
  return isoDate(date);
};

// Recorre las carpetas de clases para conocer el nombre de cada planificación.
const buildFolderIndex = async (root) => {
  const index = [];
  const months = await readdir(root, { withFileTypes: true }).catch(() => []);
  for (const month of months.filter((entry) => entry.isDirectory() && /^\d\d\s/.test(entry.name))) {
    const weeks = await readdir(path.join(root, month.name), { withFileTypes: true }).catch(() => []);
    for (const week of weeks.filter((entry) => entry.isDirectory())) {
      const weekPath = path.join(root, month.name, week.name);
      const classes = await readdir(weekPath, { withFileTypes: true }).catch(() => []);
      for (const klass of classes.filter((entry) => entry.isDirectory())) {
        const files = await readdir(path.join(weekPath, klass.name)).catch(() => []);
        const planning = files.find((file) => /\.docx$/i.test(file)) || "";
        index.push({ month: month.name, week: week.name, folder: klass.name, planning });
      }
    }
  }
  return index;
};

const loadEnvironment = async () => {
  const source = await readFile(path.join(projectDirectory, ".env.local"), "utf8");
  for (const line of source.split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=]+)=(.*)$/);
    if (!match || process.env[match[1].trim()]) continue;
    process.env[match[1].trim()] = match[2].trim().replace(/^(['"])(.*)\1$/, "$2");
  }
};

const PLACEHOLDER = /clase por definir|por definir|sin tema definido|sesion \d+$/i;

const main = async () => {
  const workbookPath = path.join(planRoot, "00 Planificación maestra",
    "FDC 2026 _ Planificación Segundo y Tercer Trimestre _ I Ciclo.xlsx");
  const workbook = XLSX.readFile(workbookPath, { cellDates: true });
  const sheet = workbook.Sheets["Plan semanal Ago-Dic"];
  if (!sheet) throw new Error("No se encontró la hoja 'Plan semanal Ago-Dic'");
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", raw: false, blankrows: false })
    .map((row) => row.map((cell) => String(cell || "").replace(/\s+/g, " ").trim()));
  const headerIndex = rows.findIndex((row) => normalize(row[0]) === "semana" && normalize(row[2]) === "curso");
  if (headerIndex < 0) throw new Error("No se encontró la fila de encabezados del plan");

  const planned = rows.slice(headerIndex + 1)
    .filter((row) => row[1] && row[2])
    .map((row) => ({
      week: row[0], range: row[1], course: canonicalCourse(row[2]), kind: row[3],
      strength: row[4], title: row[5], objective: row[6], status: row[7], notes: row[8],
    }))
    .filter((item) => item.course && item.title);

  const folders = await buildFolderIndex(planRoot);
  const folderFor = (item) => {
    const titleKey = normalize(item.title);
    const courseKey = normalize(item.course);
    return folders.find((entry) => {
      const folderKey = normalize(entry.folder);
      return folderKey.includes(titleKey.slice(0, 22)) && folderKey.includes(courseKey.slice(0, 10));
    }) || folders.find((entry) => normalize(entry.folder).includes(titleKey.slice(0, 22))) || null;
  };

  await loadEnvironment();
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "")
    .replace(/\/(rest|auth)\/v1\/?$/, "").replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Faltan credenciales de Supabase en .env.local");
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { data: institution, error: institutionError } = await supabase
    .from("institutions").select("id").eq("slug", "colegio-san-lucas").single();
  if (institutionError) throw institutionError;

  const existing = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from("app_records")
      .select("record_id,data,created_at")
      .eq("institution_id", institution.id).eq("entity", "orientation").range(from, from + 999);
    if (error) throw error;
    existing.push(...(data || []));
    if ((data || []).length < 1000) break;
  }

  const updates = [];
  const inserts = [];
  const usedRecords = new Set();

  planned.forEach((item) => {
    const date = dateForClass(item.range, item.course);
    if (!date) return;
    const folder = folderFor(item);
    // Se completa el registro que ya existe para ese curso y fecha; si no hay,
    // se busca uno sin tema definido dentro del mismo tramo semanal.
    const sameDay = existing.find((row) => !usedRecords.has(row.record_id)
      && (row.data?.date || "").slice(0, 10) === date
      && canonicalCourse(row.data?.course) === item.course);
    const monday = mondayFromRange(item.range);
    const weekEnd = monday ? isoDate(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 4)) : date;
    const sameWeek = sameDay || existing.find((row) => !usedRecords.has(row.record_id)
      && canonicalCourse(row.data?.course) === item.course
      && (row.data?.date || "") >= isoDate(monday) && (row.data?.date || "") <= weekEnd
      && PLACEHOLDER.test(row.data?.topic || ""));

    const patch = {
      date,
      week: `${item.range} (${item.week})`,
      course: item.course,
      topic: item.title,
      axis: item.strength || "Intervención Formativa",
      characterStrength: item.strength || "",
      classType: item.kind || "Clase de orientación",
      notes: item.objective || "",
      planificacion: folder?.planning ? folder.planning.replace(/\.docx$/i, "") : "",
      folderLink: folder?.folder || "",
      orientationOwner: "Gustavo Caro",
      orientationEmail: "g.caro.m@colegiosanlucas.com",
      source: "Plan FDC 2026 · Segundo y Tercer Trimestre",
    };

    if (sameWeek) {
      usedRecords.add(sameWeek.record_id);
      // No se pisa lo ya trabajado: solo se rellenan los campos vacíos o los
      // marcadores "por definir".
      const current = sameWeek.data || {};
      const merged = { ...current };
      let changed = false;
      Object.entries(patch).forEach(([field, value]) => {
        if (!value) return;
        const currentValue = String(current[field] || "").trim();
        const isPlaceholder = field === "topic" ? PLACEHOLDER.test(currentValue) : false;
        if (!currentValue || isPlaceholder) {
          if (currentValue !== value) { merged[field] = value; changed = true; }
        }
      });
      if (changed) updates.push({ row: sameWeek, data: merged, label: `${date} ${item.course} · ${item.title}` });
    } else {
      inserts.push({
        record_id: `plan-fdc-${normalize(`${date} ${item.course} ${item.title}`).replace(/\s+/g, "-").slice(0, 60)}`,
        data: { ...patch, status: "Planificada", canvaLink: "", evidence: "" },
        label: `${date} ${item.course} · ${item.title}`,
      });
    }
  });

  const withFolder = planned.filter((item) => folderFor(item)).length;
  console.log(JSON.stringify({
    modo: applyChanges ? "aplicar" : "simulacion",
    clasesEnElPlan: planned.length,
    carpetasDeClaseEncontradas: folders.length,
    clasesConCarpetaYPlanificacion: withFolder,
    registrosACompletar: updates.length,
    registrosNuevos: inserts.length,
    ejemplosCompletar: updates.slice(0, 6).map((item) => item.label),
    ejemplosNuevos: inserts.slice(0, 6).map((item) => item.label),
  }, null, 2));

  if (!applyChanges) return;

  for (const item of updates) {
    const { error } = await supabase.from("app_records")
      .update({ data: item.data, updated_at: new Date().toISOString() })
      .eq("institution_id", institution.id).eq("entity", "orientation").eq("record_id", item.row.record_id);
    if (error) throw error;
  }
  for (let index = 0; index < inserts.length; index += 100) {
    const chunk = inserts.slice(index, index + 100).map((item) => ({
      institution_id: institution.id,
      entity: "orientation",
      record_id: item.record_id,
      data: item.data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabase.from("app_records")
      .upsert(chunk, { onConflict: "institution_id,entity,record_id" });
    if (error) throw error;
  }

  const { error: auditError } = await supabase.from("audit_logs").insert({
    institution_id: institution.id,
    action: "orientation_plan_imported",
    entity: "orientation",
    metadata: { completados: updates.length, nuevos: inserts.length, origen: "Plan semanal Ago-Dic" },
  });
  if (auditError) console.error(`No se pudo registrar la auditoría: ${auditError.message}`);
  console.error(`Bitácora actualizada: ${updates.length} completados, ${inserts.length} nuevos.`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
