const fs = require("node:fs");
const path = require("node:path");
const { createClient } = require("@supabase/supabase-js");
const { ORIENTATION_FIRST_CYCLE_CLASSES } = require("../src/lib/orientation-first-cycle.ts");

const loadEnv = () => {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  fs.readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .forEach((line) => {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)\s*$/);
      if (!match) return;
      const [, key, rawValue] = match;
      if (process.env[key]) return;
      process.env[key] = rawValue.replace(/^["']|["']$/g, "");
    });
};

const normalizeSupabaseUrl = (url) => url.replace(/\/(rest|auth)\/v1\/?$/, "").replace(/\/$/, "");
const normalize = (value) => String(value || "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

const meaningfulNotes = (record) => {
  const notes = String(record.notes || "");
  return normalize(notes).includes("fecha ajustada por feriado") ? "" : notes;
};

const identity = (record) => normalize([
  record.date,
  record.week,
  record.course,
  record.axis || record.characterStrength,
  record.topic || meaningfulNotes(record) || record.notes || record.planificacion,
].filter(Boolean).join("|"));

const looseIdentity = (record) => normalize([
  record.date,
  record.week,
  record.course,
  record.axis || record.characterStrength,
].filter(Boolean).join("|"));

const courseWeek = (record) => normalize([record.course, record.week].filter(Boolean).join("|"));

const hasContent = (record) => Boolean(String(
  record.canvaLink || record.evidence || record.planificacion || record.folderLink || record.teacherLink || meaningfulNotes(record) || "",
).trim());

const isGeneratedPlaceholder = (record) =>
  normalize(record.source || "").includes("plan anual orientacion 2026") && !hasContent(record);

const sanitizeData = (record) => Object.fromEntries(
  Object.entries(record).filter(([key, value]) => !["id", "createdAt", "updatedAt"].includes(key) && value !== undefined),
);

async function main() {
  loadEnv();
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!rawUrl || !serviceRole) throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL/SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.");

  const supabase = createClient(normalizeSupabaseUrl(rawUrl), serviceRole, {
    auth: { persistSession: false },
  });

  const { data: institution, error: institutionError } = await supabase
    .from("institutions")
    .select("id")
    .eq("slug", "colegio-san-lucas")
    .maybeSingle();
  if (institutionError) throw institutionError;
  if (!institution?.id) throw new Error("No existe la institución colegio-san-lucas.");

  const { data: rows, error: rowsError } = await supabase
    .from("app_records")
    .select("record_id, data, created_at, updated_at")
    .eq("institution_id", institution.id)
    .eq("entity", "orientation");
  if (rowsError) throw rowsError;

  const seedByIdentity = new Map(ORIENTATION_FIRST_CYCLE_CLASSES.map((record) => [identity(record), record]));
  const seedByLooseIdentity = new Map(ORIENTATION_FIRST_CYCLE_CLASSES.map((record) => [looseIdentity(record), record]));
  const seedCourseWeeks = new Set(ORIENTATION_FIRST_CYCLE_CLASSES.map(courseWeek));
  const upserts = [];
  const deletes = [];
  const seen = new Set();
  let updated = 0;

  for (const row of rows || []) {
    const current = {
      id: row.record_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      ...(row.data || {}),
    };
    if (isGeneratedPlaceholder(current) && seedCourseWeeks.has(courseWeek(current))) {
      deletes.push(row.record_id);
      continue;
    }
    const seed = seedByIdentity.get(identity(current)) || seedByLooseIdentity.get(looseIdentity(current));
    if (!seed) continue;
    seen.add(identity(seed));
    const merged = {
      ...current,
      ...seed,
      id: current.id,
      createdAt: current.createdAt || seed.createdAt,
      updatedAt: new Date().toISOString(),
    };
    if (JSON.stringify(current) === JSON.stringify(merged)) continue;
    updated += 1;
    upserts.push({
      institution_id: institution.id,
      entity: "orientation",
      record_id: merged.id,
      data: sanitizeData(merged),
      created_at: merged.createdAt,
      updated_at: merged.updatedAt,
    });
  }

  const existingIdentities = new Set([
    ...seen,
    ...(rows || []).map((row) => identity({ id: row.record_id, ...(row.data || {}) })),
  ]);
  const missing = ORIENTATION_FIRST_CYCLE_CLASSES.filter((record) => !existingIdentities.has(identity(record)));

  missing.forEach((record) => {
    upserts.push({
      institution_id: institution.id,
      entity: "orientation",
      record_id: record.id,
      data: sanitizeData(record),
      created_at: record.createdAt,
      updated_at: record.updatedAt,
    });
  });

  for (let i = 0; i < upserts.length; i += 200) {
    const batch = upserts.slice(i, i + 200);
    const { error } = await supabase
      .from("app_records")
      .upsert(batch, { onConflict: "institution_id,entity,record_id" });
    if (error) throw error;
  }

  for (let i = 0; i < deletes.length; i += 200) {
    const ids = deletes.slice(i, i + 200);
    const { error } = await supabase
      .from("app_records")
      .delete()
      .eq("institution_id", institution.id)
      .eq("entity", "orientation")
      .in("record_id", ids);
    if (error) throw error;
  }

  console.log(JSON.stringify({
    sourceRecords: ORIENTATION_FIRST_CYCLE_CLASSES.length,
    currentRecords: rows?.length || 0,
    updated,
    inserted: missing.length,
    removedPlaceholders: deletes.length,
    upserted: upserts.length,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
