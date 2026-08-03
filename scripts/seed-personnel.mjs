import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

// Persiste la nómina de funcionarios en la base. Hasta ahora vivía solo como
// semilla dentro de la app, por lo que cada equipo la tenía por separado y los
// cambios no se compartían. Los identificadores son los mismos que usa la
// semilla, de modo que la carga es idempotente y no duplica.
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

// Extrae la nómina desde el código de la app para no mantener dos listas.
const loadSeededPersonnel = async () => {
  const source = await readFile(path.join(projectDirectory, "src", "app", "page.tsx"), "utf8");
  const declaration = source.indexOf("officialPersonnelEntries");
  const arrayStart = source.indexOf("[", source.indexOf("=", declaration));
  let depth = 0;
  let arrayEnd = arrayStart;
  for (let index = arrayStart; index < source.length; index += 1) {
    if (source[index] === "[") depth += 1;
    if (source[index] === "]") {
      depth -= 1;
      if (depth === 0) { arrayEnd = index + 1; break; }
    }
  }
  const entries = JSON.parse(source.slice(arrayStart, arrayEnd).replace(/,(\s*[\]}])/g, "$1"));
  const seededAt = source.match(/officialPersonnelSeededAt\s*=\s*"([^"]+)"/)?.[1] || new Date().toISOString();
  const sourceLabel = source.match(/officialPersonnelSource\s*=\s*"([^"]+)"/)?.[1] || "";
  return entries.map(([fullName, role, area, cycle], index) => ({
    id: `personnel-${index + 1}-${normalize(fullName).replace(/\s+/g, "-")}-${normalize(area).replace(/\s+/g, "-")}`,
    createdAt: seededAt,
    updatedAt: seededAt,
    fullName, role, area, cycle,
    course: "", email: "", phone: "",
    status: "Activo",
    source: sourceLabel,
    notes: "",
  }));
};

const main = async () => {
  await loadEnvironment();
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "")
    .replace(/\/(rest|auth)\/v1\/?$/, "").replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Faltan credenciales de Supabase en .env.local");
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const { data: institution, error: institutionError } = await supabase
    .from("institutions").select("id").eq("slug", "colegio-san-lucas").single();
  if (institutionError) throw institutionError;

  const personnel = await loadSeededPersonnel();
  const { data: existing, error: existingError } = await supabase
    .from("app_records").select("record_id")
    .eq("institution_id", institution.id).eq("entity", "personnel");
  if (existingError) throw existingError;

  console.log(JSON.stringify({
    modo: applyChanges ? "aplicar" : "simulacion",
    funcionariosEnLaSemilla: personnel.length,
    yaEnLaBase: (existing || []).length,
    muestra: personnel.slice(0, 3).map((person) => `${person.fullName} — ${person.role}`),
  }, null, 2));

  if (!applyChanges) return;

  const rows = personnel.map(({ id, createdAt, updatedAt, ...data }) => ({
    institution_id: institution.id,
    entity: "personnel",
    record_id: id,
    data,
    created_at: createdAt,
    updated_at: updatedAt,
  }));

  for (let index = 0; index < rows.length; index += 100) {
    const { error } = await supabase.from("app_records")
      .upsert(rows.slice(index, index + 100), { onConflict: "institution_id,entity,record_id" });
    if (error) throw error;
  }

  const { error: auditError } = await supabase.from("audit_logs").insert({
    institution_id: institution.id,
    action: "personnel_seeded",
    entity: "personnel",
    metadata: { funcionarios: rows.length },
  });
  if (auditError) console.error(`No se pudo registrar la auditoría: ${auditError.message}`);
  console.error(`Nómina persistida: ${rows.length} funcionarios.`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
