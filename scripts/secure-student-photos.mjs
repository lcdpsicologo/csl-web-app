import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

// Protege las fotos de estudiantes (datos de menores):
//   1. El bucket pasa a privado, de modo que no haya acceso anónimo.
//   2. Cada foto se renombra con un token aleatorio: los nombres anteriores
//      incluían el identificador de la ficha (derivado del RUT), por lo que las
//      URLs eran adivinables.
//   3. En la ficha queda un enlace firmado de larga duración, que solo funciona
//      para quien lo recibe desde la aplicación.
const projectDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const applyChanges = process.argv.includes("--apply");
const PHOTO_BUCKET = "student-photos";
const SIGNED_URL_TTL = 60 * 60 * 24 * 365; // 1 año

const loadEnvironment = async () => {
  const source = await readFile(path.join(projectDirectory, ".env.local"), "utf8");
  for (const line of source.split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=]+)=(.*)$/);
    if (!match || process.env[match[1].trim()]) continue;
    process.env[match[1].trim()] = match[2].trim().replace(/^(['"])(.*)\1$/, "$2");
  }
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

  const rows = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from("app_records")
      .select("record_id,data,created_at")
      .eq("institution_id", institution.id)
      .eq("entity", "students")
      .range(from, from + 999);
    if (error) throw error;
    rows.push(...(data || []));
    if ((data || []).length < 1000) break;
  }

  const withPhoto = rows.filter((row) => typeof row.data?.profilePhoto === "string" && row.data.profilePhoto.includes(PHOTO_BUCKET));
  const exposed = withPhoto.filter((row) => row.data.profilePhoto.includes("/object/public/"));

  console.log(JSON.stringify({
    modo: applyChanges ? "aplicar" : "simulacion",
    fichasConFoto: withPhoto.length,
    conUrlPublicaAdivinable: exposed.length,
  }, null, 2));

  if (!applyChanges) return;

  // El bucket deja de ser público: se corta cualquier acceso anónimo previo.
  const { error: bucketError } = await supabase.storage.updateBucket(PHOTO_BUCKET, {
    public: false,
    fileSizeLimit: 2 * 1024 * 1024,
    allowedMimeTypes: ["image/webp", "image/jpeg", "image/png"],
  });
  if (bucketError) throw bucketError;
  console.error("Bucket marcado como privado.");

  let migrated = 0;
  for (const row of withPhoto) {
    const currentUrl = row.data.profilePhoto;
    const currentPath = decodeURIComponent(currentUrl.split(`/${PHOTO_BUCKET}/`)[1] || "").split("?")[0];
    if (!currentPath) continue;

    // Nombre nuevo sin relación con el estudiante.
    const securePath = `${randomBytes(16).toString("hex")}.webp`;
    const { error: moveError } = await supabase.storage.from(PHOTO_BUCKET).move(currentPath, securePath);
    if (moveError && !/not found/i.test(moveError.message)) throw moveError;

    const { data: signed, error: signError } = await supabase.storage
      .from(PHOTO_BUCKET).createSignedUrl(securePath, SIGNED_URL_TTL);
    if (signError) throw signError;

    const { error: updateError } = await supabase.from("app_records")
      .update({ data: { ...row.data, profilePhoto: signed.signedUrl }, updated_at: new Date().toISOString() })
      .eq("institution_id", institution.id).eq("entity", "students").eq("record_id", row.record_id);
    if (updateError) throw updateError;

    migrated += 1;
    if (migrated % 50 === 0 || migrated === withPhoto.length) console.error(`Protegidas ${migrated}/${withPhoto.length} fotos`);
  }

  const { error: auditError } = await supabase.from("audit_logs").insert({
    institution_id: institution.id,
    action: "student_photos_secured",
    entity: "students",
    metadata: { fotos: migrated, bucket: PHOTO_BUCKET, acceso: "privado con enlace firmado" },
  });
  if (auditError) console.error(`No se pudo registrar la auditoría: ${auditError.message}`);
  console.error(`Listo: ${migrated} fotos con nombre aleatorio y enlace firmado.`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
