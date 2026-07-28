import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

// Depura fichas de estudiantes repetidas (mismo nombre y curso). Fusiona los
// datos en la ficha que se conserva para no perder información y elimina la
// sobrante. Sin --apply solo informa.
const projectDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const applyChanges = process.argv.includes("--apply");

const normalize = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const loadEnvironment = async () => {
  const source = await readFile(path.join(projectDirectory, ".env.local"), "utf8");
  for (const line of source.split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=]+)=(.*)$/);
    if (!match || process.env[match[1].trim()]) continue;
    process.env[match[1].trim()] = match[2].trim().replace(/^(['"])(.*)\1$/, "$2");
  }
};

// Cuánta información real trae una ficha, para decidir cuál se conserva.
const richness = (data) =>
  Object.entries(data || {}).filter(([key, value]) =>
    !["fullName", "course"].includes(key) && typeof value === "string" && value.trim()).length;

const main = async () => {
  await loadEnvironment();
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "")
    .replace(/\/(rest|auth)\/v1\/?$/, "").replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Faltan credenciales de Supabase en .env.local");
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const { data: institution, error: institutionError } = await supabase
    .from("institutions").select("id,name").eq("slug", "colegio-san-lucas").single();
  if (institutionError) throw institutionError;

  const rows = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from("app_records")
      .select("record_id,data,created_at,updated_at")
      .eq("institution_id", institution.id)
      .eq("entity", "students")
      .range(from, from + 999);
    if (error) throw error;
    rows.push(...(data || []));
    if ((data || []).length < 1000) break;
  }

  const groups = new Map();
  for (const row of rows) {
    const name = normalize(row.data?.fullName);
    if (!name) continue;
    const groupKey = `${name}|${normalize(row.data?.course)}`;
    if (!groups.has(groupKey)) groups.set(groupKey, []);
    groups.get(groupKey).push(row);
  }

  const duplicates = [...groups.values()].filter((group) => group.length > 1);
  const plan = duplicates.map((group) => {
    // Se conserva la ficha con más datos; a igualdad, la más antigua.
    const ordered = [...group].sort((left, right) =>
      richness(right.data) - richness(left.data) || String(left.created_at).localeCompare(String(right.created_at)));
    const [keep, ...remove] = ordered;
    // Los campos vacíos de la ficha que se conserva se completan con los de las otras.
    const merged = { ...keep.data };
    for (const extra of remove) {
      for (const [field, value] of Object.entries(extra.data || {})) {
        const current = merged[field];
        if (typeof value === "string" && value.trim() && !(typeof current === "string" && current.trim())) {
          merged[field] = value;
        }
      }
    }
    const recovered = Object.keys(merged).filter((field) => merged[field] !== keep.data?.[field]);
    return { keep, remove, merged, recovered, name: keep.data?.fullName, course: keep.data?.course };
  });

  console.log(JSON.stringify({
    modo: applyChanges ? "aplicar" : "simulacion",
    fichasTotales: rows.length,
    nombresDuplicados: plan.length,
    fichasAEliminar: plan.reduce((total, item) => total + item.remove.length, 0),
    detalle: plan.map((item) => ({
      estudiante: item.name,
      curso: item.course,
      conserva: item.keep.record_id,
      elimina: item.remove.map((row) => row.record_id),
      camposRecuperados: item.recovered,
    })),
  }, null, 2));

  if (!applyChanges || !plan.length) return;

  for (const item of plan) {
    if (item.recovered.length) {
      const { error } = await supabase.from("app_records")
        .update({ data: item.merged, updated_at: new Date().toISOString() })
        .eq("institution_id", institution.id).eq("entity", "students").eq("record_id", item.keep.record_id);
      if (error) throw error;
    }
    const { error: deleteError } = await supabase.from("app_records")
      .delete()
      .eq("institution_id", institution.id).eq("entity", "students")
      .in("record_id", item.remove.map((row) => row.record_id));
    if (deleteError) throw deleteError;
  }

  const { error: auditError } = await supabase.from("audit_logs").insert({
    institution_id: institution.id,
    action: "students_deduplicated",
    entity: "students",
    metadata: {
      grupos: plan.length,
      eliminadas: plan.reduce((total, item) => total + item.remove.length, 0),
      estudiantes: plan.map((item) => item.name),
    },
  });
  if (auditError) console.error(`No se pudo registrar la auditoría: ${auditError.message}`);
  console.error(`Depuradas ${plan.length} fichas duplicadas.`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
