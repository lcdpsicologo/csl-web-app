import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, "..");
const applyChanges = process.argv.includes("--apply");
const showSamples = process.argv.includes("--show-samples");
const markCurrentOrder = process.argv.includes("--mark-current-order");

const normalizeText = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

const cleanRut = (value) => String(value || "").replace(/[^0-9kK]/g, "").toUpperCase();

// Algunas fuentes conservan un cero de relleno al inicio y otras no. Para
// cruzar registros se ignora solo ese relleno; al mostrar/guardar se conserva.
const rutIdentity = (value) => {
  const clean = cleanRut(value);
  if (clean.length < 2) return clean;
  const body = clean.slice(0, -1).replace(/^0+(?=\d)/, "");
  return `${body}${clean.slice(-1)}`;
};

const formatRut = (value) => {
  const clean = cleanRut(value);
  if (clean.length < 2) return clean;
  const body = clean.slice(0, -1);
  const verifier = clean.slice(-1);
  const groups = [];
  for (let end = body.length; end > 0; end -= 3) groups.unshift(body.slice(Math.max(0, end - 3), end));
  return `${groups.join(".")}-${verifier}`;
};

const validRut = (value) => {
  const clean = cleanRut(value);
  if (!/^\d+[0-9K]$/.test(clean)) return false;
  const body = clean.slice(0, -1);
  let sum = 0;
  let multiplier = 2;
  for (let index = body.length - 1; index >= 0; index -= 1) {
    sum += Number(body[index]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const result = 11 - (sum % 11);
  const expected = result === 11 ? "0" : result === 10 ? "K" : String(result);
  return expected === clean.slice(-1);
};

const titleCaseName = (value) =>
  String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((part) => part ? `${part[0].toUpperCase()}${part.slice(1).toLowerCase()}` : part)
    .join(" ");

const moveTwoSurnamesToEnd = (value) => {
  const parts = titleCaseName(value).split(" ").filter(Boolean);
  if (parts.length < 3) return parts.join(" ");
  const lower = parts.map((part) => part.toLowerCase());
  let surnameTokenCount = 2;
  if (lower[0] === "de" && ["la", "las", "los"].includes(lower[1]) && parts.length >= 5) {
    surnameTokenCount = 4;
  } else if (lower[0]?.includes("-de") && ["la", "las", "los"].includes(lower[1]) && parts.length >= 5) {
    surnameTokenCount = 4;
  } else if (lower[1] === "de" && ["la", "las", "los"].includes(lower[2]) && parts.length >= 6) {
    surnameTokenCount = 5;
  } else if (["san", "santa"].includes(lower[0]) && parts.length >= 4) {
    surnameTokenCount = 3;
  }
  return [...parts.slice(surnameTokenCount), ...parts.slice(0, surnameTokenCount)].join(" ");
};

const loadEnvironment = async () => {
  const source = await readFile(path.join(projectDirectory, ".env.local"), "utf8");
  for (const line of source.split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=]+)=(.*)$/);
    if (!match || process.env[match[1].trim()]) continue;
    process.env[match[1].trim()] = match[2].trim().replace(/^(['"])(.*)\1$/, "$2");
  }
};

const loadPieRoster = async () => {
  const source = await readFile(path.join(projectDirectory, "src", "lib", "pie-roster.ts"), "utf8");
  const declaration = source.indexOf("export const PIE_ROSTER");
  const assignment = source.indexOf("=", declaration);
  const arrayStart = source.indexOf("[", assignment);
  const nextDeclaration = source.indexOf("export const PIE_PROFESSIONALS", arrayStart);
  const arraySource = source.slice(arrayStart, nextDeclaration).trim().replace(/;\s*$/, "");
  return JSON.parse(arraySource);
};

const loadStudents = async (supabase, institutionId) => {
  const rows = [];
  const pageSize = 1000;
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("app_records")
      .select("institution_id,entity,record_id,data,created_at,updated_at")
      .eq("institution_id", institutionId)
      .eq("entity", "students")
      .range(from, from + pageSize - 1);
    if (error) throw error;
    rows.push(...(data || []));
    if ((data || []).length < pageSize) break;
  }
  return rows;
};

const main = async () => {
  await loadEnvironment();
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) throw new Error("Faltan las credenciales de Supabase en .env.local");

  const supabase = createClient(supabaseUrl.replace(/\/$/, ""), serviceKey, { auth: { persistSession: false } });
  const { data: institution, error: institutionError } = await supabase
    .from("institutions")
    .select("id,name")
    .eq("slug", "colegio-san-lucas")
    .single();
  if (institutionError) throw institutionError;

  const [pieRoster, rows] = await Promise.all([loadPieRoster(), loadStudents(supabase, institution.id)]);
  const pieByRut = new Map(pieRoster.map((student) => [rutIdentity(student.rut), titleCaseName(student.name)]).filter(([rut]) => rut));
  const sourceCounts = new Map();
  const reasonCounts = new Map();
  const unresolved = [];
  const invalidRuts = [];
  const compoundSurnameCandidates = [];
  const prepared = [];

  for (const row of rows) {
    const data = row.data || {};
    const currentName = titleCaseName(data.fullName || "");
    const currentRut = String(data.rut || "").trim();
    const cleanCurrentRut = cleanRut(currentRut);
    const source = String(data.source || "").trim();
    const normalizedSource = normalizeText(source);
    sourceCounts.set(source || "(sin fuente)", (sourceCounts.get(source || "(sin fuente)") || 0) + 1);

    let nextName = currentName;
    let nameReason = "sin cambio";
    const pieName = cleanCurrentRut ? pieByRut.get(rutIdentity(cleanCurrentRut)) : undefined;
    if (pieName) {
      nextName = pieName;
      nameReason = "canon PIE por RUT";
    } else if (normalizedSource.includes("nomina oficial primer ciclo")) {
      if (data.nameOrder === "given-names-first" || markCurrentOrder) {
        nameReason = "Primer Ciclo ya normalizado";
      } else {
        const nameParts = normalizeText(currentName).split(" ").filter(Boolean);
        if (nameParts.slice(0, 4).some((part) => ["de", "del", "la", "las", "los", "san", "santa"].includes(part))) {
          compoundSurnameCandidates.push({ before: currentName, after: moveTwoSurnamesToEnd(currentName), course: data.course || "" });
        }
        nextName = moveTwoSurnamesToEnd(currentName);
        nameReason = "Primer Ciclo: apellidos al final";
      }
    } else {
      unresolved.push({ name: currentName, course: data.course || "", source: source || "(sin fuente)", words: currentName.split(" ").filter(Boolean).length });
    }
    reasonCounts.set(nameReason, (reasonCounts.get(nameReason) || 0) + 1);

    const nextRut = currentRut ? formatRut(currentRut) : "";
    const nextNameOrder = normalizedSource.includes("nomina oficial primer ciclo") ? "given-names-first" : data.nameOrder;
    if (currentRut && !validRut(currentRut)) invalidRuts.push({ course: data.course || "", formatted: nextRut });
    const nameChanged = normalizeText(nextName) !== normalizeText(data.fullName || "");
    const rutChanged = nextRut !== currentRut;
    const orderChanged = nextNameOrder !== data.nameOrder;
    if (!nameChanged && !rutChanged && !orderChanged) continue;

    prepared.push({
      institution_id: row.institution_id,
      entity: row.entity,
      record_id: row.record_id,
      data: { ...data, fullName: nextName, rut: nextRut, ...(nextNameOrder ? { nameOrder: nextNameOrder } : {}) },
      created_at: row.created_at,
      updated_at: new Date().toISOString(),
      change: { nameChanged, rutChanged, orderChanged, reason: nameReason },
    });
  }

  const summary = {
    mode: applyChanges ? "apply" : "dry-run",
    institution: institution.name,
    totals: {
      students: rows.length,
      withRut: rows.filter((row) => cleanRut(row.data?.rut)).length,
      rowsToUpdate: prepared.length,
      namesToUpdate: prepared.filter((row) => row.change.nameChanged).length,
      rutsToUpdate: prepared.filter((row) => row.change.rutChanged).length,
      orderMarkersToUpdate: prepared.filter((row) => row.change.orderChanged).length,
      invalidRuts: invalidRuts.length,
      unchangedWithoutCanonicalSource: unresolved.length,
      compoundSurnameCandidates: compoundSurnameCandidates.length,
    },
    nameResolution: Object.fromEntries([...reasonCounts.entries()].sort((left, right) => right[1] - left[1])),
    sourceCounts: Object.fromEntries([...sourceCounts.entries()].sort((left, right) => right[1] - left[1])),
    unchangedBySource: Object.fromEntries(
      [...Map.groupBy(unresolved, (item) => item.source).entries()]
        .map(([source, items]) => [source, items.length])
        .sort((left, right) => right[1] - left[1]),
    ),
    unchangedByCourse: Object.fromEntries(
      [...Map.groupBy(unresolved, (item) => item.course || "(sin curso)").entries()]
        .map(([course, items]) => [course, items.length])
        .sort((left, right) => right[1] - left[1]),
    ),
    invalidRutCourses: Object.fromEntries(
      [...Map.groupBy(invalidRuts, (item) => item.course || "(sin curso)").entries()]
        .map(([course, items]) => [course, items.length])
        .sort((left, right) => right[1] - left[1]),
    ),
    unchangedSamples: showSamples
      ? Object.fromEntries(
          [...Map.groupBy(unresolved, (item) => item.course || "(sin curso)").entries()]
            .map(([course, items]) => [course, items.slice(0, 4).map((item) => item.name)])
            .sort((left, right) => String(left[0]).localeCompare(String(right[0]), "es")),
        )
      : undefined,
    compoundSurnameSamples: showSamples ? compoundSurnameCandidates.slice(0, 30) : undefined,
  };
  console.log(JSON.stringify(summary, null, 2));

  if (!applyChanges || prepared.length === 0) return;
  const batchSize = 100;
  for (let start = 0; start < prepared.length; start += batchSize) {
    const batch = prepared.slice(start, start + batchSize).map(({ change: _change, ...row }) => row);
    const { error } = await supabase.from("app_records").upsert(batch, { onConflict: "institution_id,entity,record_id" });
    if (error) throw error;
    console.error(`Actualizados ${Math.min(start + batchSize, prepared.length)}/${prepared.length} estudiantes`);
  }

  const { error: auditError } = await supabase.from("audit_logs").insert({
    institution_id: institution.id,
    action: "student_identities_normalized",
    entity: "students",
    metadata: summary.totals,
  });
  if (auditError) console.error(`No se pudo guardar la auditoria: ${auditError.message}`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
