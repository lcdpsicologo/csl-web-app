import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, "..");
const photosDirectory = path.resolve(projectDirectory, "..", "Fotos de estudiantes");
const applyChanges = process.argv.includes("--apply");
const verifyLocal = process.argv.includes("--verify-local");

const COURSE_FOLDERS = {
  "PK°A": "Prekínder A",
  "PK°B": "Prekínder B",
  "PK°C": "Prekínder C",
  "K°A": "Kínder A",
  "K°B": "Kínder B",
  "K°C": "Kínder C",
  "1°A": "1° Básico A",
  "1°B": "1° Básico B",
  "2°A": "2° Básico A",
  "2°B": "2° Básico B",
  "3°A": "3° Básico A",
  "3°B": "3° Básico B",
  "4°A": "4° Básico A",
  "4°B": "4° Básico B",
};

const normalize = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

const normalizeCourse = (value) => {
  const text = normalize(value).replace(/\bbasico\b/g, "").trim();
  const compact = text.replace(/\s+/g, "");
  if (/^(pre\s*kinder|pk)[abc]$/.test(compact)) return compact.endsWith("a") ? "Prekínder A" : compact.endsWith("b") ? "Prekínder B" : "Prekínder C";
  if (/^(kinder|k)[abc]$/.test(compact)) return compact.endsWith("a") ? "Kínder A" : compact.endsWith("b") ? "Kínder B" : "Kínder C";
  const basic = compact.match(/^([1-4])([ab])$/);
  return basic ? `${basic[1]}° Básico ${basic[2].toUpperCase()}` : String(value || "").trim();
};

const editDistanceAtMostOne = (left, right) => {
  if (left === right) return true;
  if (Math.abs(left.length - right.length) > 1) return false;
  if (left.length === right.length) {
    let differences = 0;
    for (let index = 0; index < left.length; index += 1) {
      if (left[index] !== right[index] && ++differences > 1) return false;
    }
    return true;
  }
  const [shorter, longer] = left.length < right.length ? [left, right] : [right, left];
  let shortIndex = 0;
  let longIndex = 0;
  let skipped = false;
  while (shortIndex < shorter.length && longIndex < longer.length) {
    if (shorter[shortIndex] === longer[longIndex]) {
      shortIndex += 1;
      longIndex += 1;
    } else if (skipped) {
      return false;
    } else {
      skipped = true;
      longIndex += 1;
    }
  }
  return true;
};

const tokenScore = (photoToken, studentTokens) => {
  if (studentTokens.includes(photoToken)) return 4;
  for (let start = 0; start < studentTokens.length; start += 1) {
    let combined = "";
    for (let end = start; end < Math.min(studentTokens.length, start + 4); end += 1) {
      combined += studentTokens[end];
      if (combined === photoToken) return 4;
    }
  }
  if (photoToken.length >= 5 && studentTokens.some((token) => token.length >= 5 && editDistanceAtMostOne(photoToken, token))) return 2;
  return 0;
};

const matchScore = (photoName, studentName) => {
  const photoTokens = normalize(photoName).split(" ").filter(Boolean);
  const studentTokens = normalize(studentName).split(" ").filter(Boolean);
  if (photoTokens.length < 2 || studentTokens.length < 2) return 0;
  const scores = photoTokens.map((token) => tokenScore(token, studentTokens));
  if (scores.some((score) => score === 0)) return 0;
  const likelyPrimaryGivenName = studentTokens.length >= 3 ? studentTokens[2] : studentTokens[0];
  const firstNameBonus = editDistanceAtMostOne(photoTokens[0], likelyPrimaryGivenName)
    ? 6
    : editDistanceAtMostOne(photoTokens[0], studentTokens[0])
      ? 4
      : 0;
  const primarySurnameBonus = studentTokens.length >= 3 && editDistanceAtMostOne(photoTokens[1], studentTokens[0]) ? 6 : 0;
  const exactNameBonus = normalize(photoName) === normalize(studentName) ? 10 : 0;
  return scores.reduce((sum, score) => sum + score, 0) + firstNameBonus + primarySurnameBonus + exactNameBonus;
};

const loadEnvironment = async () => {
  const source = await readFile(path.join(projectDirectory, ".env.local"), "utf8");
  for (const line of source.split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=]+)=(.*)$/);
    if (!match || process.env[match[1].trim()]) continue;
    process.env[match[1].trim()] = match[2].trim().replace(/^(['"])(.*)\1$/, "$2");
  }
};

const imageFilesIn = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && /\.(jpe?g|png|webp)$/i.test(entry.name))
    .map((entry) => path.join(directory, entry.name));
};

const digest = async (filePath) => createHash("sha256").update(await readFile(filePath)).digest("hex");

const loadPhotos = async () => {
  const firstBFiles = await imageFilesIn(path.join(photosDirectory, "1°B"));
  const copiedFirstBHashes = new Set(await Promise.all(firstBFiles.map(digest)));
  const photos = [];
  const skipped = [];

  for (const [folder, course] of Object.entries(COURSE_FOLDERS)) {
    for (const filePath of await imageFilesIn(path.join(photosDirectory, folder))) {
      const fileName = path.basename(filePath);
      const shortName = fileName.replace(/^\d+\s*-\s*/, "").replace(/\.[^.]+$/, "").trim();
      if (normalize(shortName) === "gustavo caro") {
        skipped.push({ course, shortName, reason: "imagen genérica repetida" });
        continue;
      }
      if (folder === "2°A" && copiedFirstBHashes.has(await digest(filePath))) {
        skipped.push({ course, shortName, reason: "copia accidental de 1° B" });
        continue;
      }
      photos.push({ course, shortName, filePath });
    }
  }
  return { photos, skipped };
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

const uniqueBest = (candidates) => {
  const sorted = candidates.filter((candidate) => candidate.score > 0).sort((left, right) => right.score - left.score);
  if (!sorted.length || (sorted[1] && sorted[0].score === sorted[1].score)) return null;
  return sorted[0];
};

const buildMatches = (photos, rows) => {
  const students = rows.map((row) => ({ ...row, course: normalizeCourse(row.data?.course), name: String(row.data?.fullName || "").trim() }));
  const photosByCourse = Map.groupBy(photos, (photo) => photo.course);
  const studentsByCourse = Map.groupBy(students, (student) => student.course);
  const matches = [];
  const ambiguousStudents = [];

  for (const [course, courseStudents] of studentsByCourse) {
    const coursePhotos = photosByCourse.get(course) || [];
    for (const student of courseStudents) {
      const bestPhoto = uniqueBest(coursePhotos.map((photo) => ({ photo, score: matchScore(photo.shortName, student.name) })));
      if (!bestPhoto) continue;
      const bestStudent = uniqueBest(courseStudents.map((candidate) => ({ student: candidate, score: matchScore(bestPhoto.photo.shortName, candidate.name) })));
      if (bestStudent?.student.record_id === student.record_id) matches.push({ student, photo: bestPhoto.photo, score: bestPhoto.score });
      else ambiguousStudents.push({ course, student: student.name, photo: bestPhoto.photo.shortName });
    }
  }

  return { students, matches, ambiguousStudents };
};

const photoDataUrl = async (filePath) => {
  const buffer = await sharp(filePath)
    .rotate()
    .resize(384, 384, { fit: "cover", position: "attention", withoutEnlargement: false })
    .webp({ quality: 82, effort: 5, smartSubsample: true })
    .toBuffer();
  return `data:image/webp;base64,${buffer.toString("base64")}`;
};

const verifyBundledMatching = async () => {
  const source = await readFile(path.join(projectDirectory, "src", "lib", "pie-roster.ts"), "utf8");
  const declaration = source.indexOf("export const PIE_ROSTER");
  const assignment = source.indexOf("=", declaration);
  const arrayStart = source.indexOf("[", assignment);
  const nextDeclaration = source.indexOf("export const PIE_PROFESSIONALS", arrayStart);
  const arraySource = source.slice(arrayStart, nextDeclaration).trim().replace(/;\s*$/, "");
  const roster = JSON.parse(arraySource);
  const rows = roster.map((student, index) => ({
    institution_id: "local",
    entity: "students",
    record_id: student.rut || `local-${index}`,
    data: { fullName: student.name, course: student.course },
    created_at: "",
    updated_at: "",
  }));
  const { photos } = await loadPhotos();
  const { students, matches, ambiguousStudents } = buildMatches(photos, rows);
  const targetCourses = new Set(Object.values(COURSE_FOLDERS));
  const targetStudents = students.filter((student) => targetCourses.has(student.course));
  const matchedIds = new Set(matches.map((match) => match.student.record_id));
  console.log(JSON.stringify({
    pieStudentsInPhotoCourses: targetStudents.length,
    matched: matches.length,
    unmatched: targetStudents.filter((student) => !matchedIds.has(student.record_id)).map((student) => ({ course: student.course, name: student.name })),
    ambiguousStudents,
  }, null, 2));
};

const main = async () => {
  if (verifyLocal) {
    await verifyBundledMatching();
    return;
  }
  await loadEnvironment();
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) throw new Error("Faltan las credenciales de Supabase en .env.local");

  const supabase = createClient(supabaseUrl.replace(/\/$/, ""), serviceKey, { auth: { persistSession: false } });
  const { data: institution, error: institutionError } = await supabase.from("institutions").select("id,name").eq("slug", "colegio-san-lucas").single();
  if (institutionError) throw institutionError;

  const [{ photos, skipped }, rows] = await Promise.all([loadPhotos(), loadStudents(supabase, institution.id)]);
  const { students, matches, ambiguousStudents } = buildMatches(photos, rows);
  const matchedPhotoPaths = new Set(matches.map((match) => match.photo.filePath));
  const matchedStudentIds = new Set(matches.map((match) => match.student.record_id));
  const targetCourses = new Set(Object.values(COURSE_FOLDERS));
  const targetStudents = students.filter((student) => targetCourses.has(student.course));
  const unmatchedPhotos = photos.filter((photo) => !matchedPhotoPaths.has(photo.filePath));
  const unmatchedStudents = targetStudents.filter((student) => !matchedStudentIds.has(student.record_id));
  const alreadyWithPhoto = matches.filter((match) => Boolean(match.student.data?.profilePhoto));
  const pending = matches.filter((match) => !match.student.data?.profilePhoto);

  const courseSummary = Object.values(COURSE_FOLDERS).map((course) => ({
    course,
    photos: photos.filter((photo) => photo.course === course).length,
    students: targetStudents.filter((student) => student.course === course).length,
    matches: matches.filter((match) => match.student.course === course).length,
  }));

  console.log(JSON.stringify({
    mode: applyChanges ? "apply" : "dry-run",
    institution: institution.name,
    courseSummary,
    totals: {
      sourcePhotos: photos.length,
      ignoredSourceFiles: skipped.length,
      targetStudents: targetStudents.length,
      safeMatches: matches.length,
      alreadyWithPhoto: alreadyWithPhoto.length,
      photosToAttach: pending.length,
      unmatchedPhotos: unmatchedPhotos.length,
      unmatchedStudents: unmatchedStudents.length,
      ambiguousStudents: ambiguousStudents.length,
    },
    ignored: skipped,
    unmatchedPhotos: unmatchedPhotos.map(({ course, shortName }) => ({ course, name: shortName })),
    unmatchedStudents: unmatchedStudents.map((student) => ({ course: student.course, name: student.name })),
    ambiguousStudents,
  }, null, 2));

  if (!applyChanges || pending.length === 0) return;

  const prepared = [];
  for (let index = 0; index < pending.length; index += 1) {
    const match = pending[index];
    prepared.push({
      institution_id: institution.id,
      entity: "students",
      record_id: match.student.record_id,
      data: { ...match.student.data, profilePhoto: await photoDataUrl(match.photo.filePath) },
      created_at: match.student.created_at,
      updated_at: new Date().toISOString(),
    });
    if ((index + 1) % 25 === 0 || index + 1 === pending.length) console.error(`Preparadas ${index + 1}/${pending.length} fotos`);
  }

  const batchSize = 25;
  for (let start = 0; start < prepared.length; start += batchSize) {
    const batch = prepared.slice(start, start + batchSize);
    const { error } = await supabase.from("app_records").upsert(batch, { onConflict: "institution_id,entity,record_id" });
    if (error) throw error;
    console.error(`Guardadas ${Math.min(start + batchSize, prepared.length)}/${prepared.length} fichas`);
  }

  const { error: auditError } = await supabase.from("audit_logs").insert({
    institution_id: institution.id,
    action: "student_photos_bulk_attached",
    entity: "students",
    metadata: {
      attached: prepared.length,
      alreadyWithPhoto: alreadyWithPhoto.length,
      sourcePhotos: photos.length,
      unmatchedPhotos: unmatchedPhotos.length,
      unmatchedStudents: unmatchedStudents.length,
    },
  });
  if (auditError) console.error(`No se pudo guardar la auditoría: ${auditError.message}`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
