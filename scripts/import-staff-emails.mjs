import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import mammoth from "mammoth";

// Completa los correos de la nómina desde los documentos oficiales del colegio.
// Uso: node scripts/import-staff-emails.mjs [--apply] archivo1.docx archivo2.docx
const projectDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const applyChanges = process.argv.includes("--apply");
const inputs = process.argv.slice(2).filter((arg) => arg.toLowerCase().endsWith(".docx"));

const normalize = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
// Palabras propias de cargos, cursos y encabezados: descartan la línea como nombre.
const NOT_A_NAME = /(cargo|nombre|correo|curso|asignatura|profesor|director|subdirector|coordinador|inspector|secretari|psicolog|orientador|asistente|administrador|enfermer|tecnico|técnico|lenguaje|matematic|matemátic|historia|ciencias|ingles|inglés|artes|artistica|artística|musica|música|fisica|física|religion|religión|fundacion|fundación|colegio|nomina|nómina|establecimiento|equipo|contactos|informaciones|biblioteca|generales|salud|comunicacion|comunicación|prekinder|kinder|basico|básico|medio|ciclo|pie|cra)/i;

const looksLikeName = (line) => {
  const text = String(line || "").replace(/\s+/g, " ").trim();
  if (!text || EMAIL.test(text) || NOT_A_NAME.test(text)) return false;
  const words = text.split(" ").filter(Boolean);
  return words.length >= 2 && words.length <= 5 && /^[A-ZÁÉÍÓÚÑ]/.test(text);
};

// El propio correo dice de quién es: "j.jara@" es inicial + apellido. Sirve
// para elegir bien cuando la tabla lista varios nombres seguidos y después sus
// correos, donde el nombre más cercano no es el que corresponde.
const emailMatchesName = (email, name) => {
  const local = normalize(email.split("@")[0]);
  const tokens = normalize(name).split(" ").filter(Boolean);
  if (!local || tokens.length < 2) return false;
  const initial = tokens[0][0];
  return tokens.slice(1).some((surname) =>
    surname.length > 2 && (local === `${initial} ${surname}` || local.startsWith(`${initial} ${surname}`)));
};

const extractPairs = async (file) => {
  const { value } = await mammoth.extractRawText({ path: file });
  const lines = value.split(/\r?\n/).map((line) => line.replace(/\s+/g, " ").trim()).filter(Boolean);
  const pairs = [];
  lines.forEach((line, index) => {
    const email = line.match(EMAIL)?.[0];
    if (!email) return;
    const nearby = [];
    for (let back = 1; back <= 5 && index - back >= 0; back += 1) {
      const candidate = lines[index - back];
      if (looksLikeName(candidate)) nearby.push(candidate);
    }
    if (!nearby.length) return;
    // Primero el nombre que concuerda con el correo; si ninguno concuerda, el
    // más cercano hacia atrás.
    const chosen = nearby.find((candidate) => emailMatchesName(email, candidate)) || nearby[0];
    pairs.push({ name: chosen, email: email.toLowerCase(), source: path.basename(file) });
  });
  return pairs;
};

const loadEnvironment = async () => {
  const source = await readFile(path.join(projectDirectory, ".env.local"), "utf8");
  for (const line of source.split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=]+)=(.*)$/);
    if (!match || process.env[match[1].trim()]) continue;
    process.env[match[1].trim()] = match[2].trim().replace(/^(['"])(.*)\1$/, "$2");
  }
};

const main = async () => {
  if (!inputs.length) throw new Error("Indica al menos un archivo .docx con los correos");
  const collected = (await Promise.all(inputs.map(extractPairs))).flat();

  // Un mismo profesor aparece en varios cursos: se conserva una entrada por persona.
  const byPerson = new Map();
  collected.forEach((pair) => {
    const key = normalize(pair.name);
    if (key && !byPerson.has(key)) byPerson.set(key, pair);
  });

  await loadEnvironment();
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "")
    .replace(/\/(rest|auth)\/v1\/?$/, "").replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Faltan credenciales de Supabase en .env.local");
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const { data: institution, error: institutionError } = await supabase
    .from("institutions").select("id").eq("slug", "colegio-san-lucas").single();
  if (institutionError) throw institutionError;

  const { data: personnel, error: personnelError } = await supabase
    .from("app_records").select("record_id,data")
    .eq("institution_id", institution.id).eq("entity", "personnel");
  if (personnelError) throw personnelError;

  // Calce tolerante: los documentos y la nómina escriben los nombres distinto
  // ("Ana Luisa Huerta" / "Ana Huerta") y hay erratas ("Karhen" / "Kharen").
  const shortKey = (value) => normalize(value).split(" ").slice(0, 2).join(" ");
  const distanceAtMost = (left, right, max) => {
    if (Math.abs(left.length - right.length) > max) return false;
    const previous = Array.from({ length: right.length + 1 }, (_, i) => i);
    for (let i = 1; i <= left.length; i += 1) {
      let diagonal = previous[0];
      previous[0] = i;
      for (let j = 1; j <= right.length; j += 1) {
        const temp = previous[j];
        previous[j] = Math.min(previous[j] + 1, previous[j - 1] + 1, diagonal + (left[i - 1] === right[j - 1] ? 0 : 1));
        diagonal = temp;
      }
    }
    return previous[right.length] <= max;
  };
  const tokensOf = (value) => normalize(value).split(" ").filter(Boolean);

  const candidates = [...byPerson.values()];
  const findMatch = (name) => {
    const exact = normalize(name);
    const direct = candidates.find((pair) => normalize(pair.name) === exact);
    if (direct) return direct;
    const short = candidates.find((pair) => shortKey(pair.name) === shortKey(name));
    if (short) return short;
    const nameTokens = tokensOf(name);
    if (nameTokens.length < 2) return null;
    // Un nombre contenido en el otro: "Ana Huerta" ⊂ "Ana Luisa Huerta".
    const subset = candidates.find((pair) => {
      const other = tokensOf(pair.name);
      if (other.length < 2) return false;
      const [shorter, longer] = nameTokens.length <= other.length ? [nameTokens, other] : [other, nameTokens];
      return shorter.every((token) => longer.includes(token));
    });
    if (subset) return subset;
    // Erratas de tipeo: exige que calce el apellido (no cualquier palabra, o
    // dos personas con el mismo nombre de pila se cruzarían) y que el nombre
    // de pila difiera a lo más en dos letras.
    const surnameOf = (tokens) => tokens[tokens.length - 1];
    return candidates.find((pair) => {
      const other = tokensOf(pair.name);
      if (other.length < 2) return false;
      return distanceAtMost(surnameOf(nameTokens), surnameOf(other), 1)
        && distanceAtMost(nameTokens[0], other[0], 2);
    }) || null;
  };

  const updates = [];
  const alreadySet = [];
  const unmatchedStaff = [];
  const usedEmails = new Set();
  personnel.forEach((row) => {
    const name = row.data?.fullName || "";
    const match = findMatch(name);
    if (!match) { unmatchedStaff.push(name); return; }
    usedEmails.add(match.email);
    if ((row.data?.email || "").trim().toLowerCase() === match.email) { alreadySet.push(name); return; }
    updates.push({ row, name, email: match.email });
  });

  const unusedPairs = candidates.filter((pair) => !usedEmails.has(pair.email));

  console.log(JSON.stringify({
    modo: applyChanges ? "aplicar" : "simulacion",
    correosEncontradosEnLosDocumentos: byPerson.size,
    funcionariosEnLaNomina: personnel.length,
    correosPorAsignar: updates.length,
    yaCorrectos: alreadySet.length,
    funcionariosSinCorreoEnLosDocumentos: unmatchedStaff.length,
    personasEnDocumentosSinFichaEnLaNomina: unusedPairs.length,
    muestraAsignaciones: updates.filter((i) => normalize(i.name) !== normalize(i.email.split("@")[0])).slice(0, 200).map((item) => `${item.name} -> ${item.email}`),
    sinFicha: unusedPairs.slice(0, 15).map((pair) => `${pair.name} (${pair.email})`),
    sinCorreo: unmatchedStaff.slice(0, 15),
  }, null, 2));

  if (!applyChanges || !updates.length) return;

  for (const item of updates) {
    const { error } = await supabase.from("app_records")
      .update({ data: { ...item.row.data, email: item.email }, updated_at: new Date().toISOString() })
      .eq("institution_id", institution.id).eq("entity", "personnel").eq("record_id", item.row.record_id);
    if (error) throw error;
  }

  const { error: auditError } = await supabase.from("audit_logs").insert({
    institution_id: institution.id,
    action: "personnel_emails_imported",
    entity: "personnel",
    metadata: { asignados: updates.length, documentos: inputs.map((file) => path.basename(file)) },
  });
  if (auditError) console.error(`No se pudo registrar la auditoría: ${auditError.message}`);
  console.error(`Correos asignados: ${updates.length}`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
