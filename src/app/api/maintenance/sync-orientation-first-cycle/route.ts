import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ORIENTATION_FIRST_CYCLE_CLASSES } from "@/lib/orientation-first-cycle";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const MAINTENANCE_KEY = "sync-first-cycle-2026-07-08";

const normalizeSupabaseUrl = (url: string) => url.replace(/\/(rest|auth)\/v1\/?$/, "").replace(/\/$/, "");
const normalize = (value: unknown) => String(value || "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

type OrientationRecord = {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  date?: string;
  week?: string;
  course?: string;
  axis?: string;
  characterStrength?: string;
  topic?: string;
  notes?: string;
  planificacion?: string;
  canvaLink?: string;
  evidence?: string;
  folderLink?: string;
  teacherLink?: string;
  source?: string;
  [key: string]: unknown;
};

const meaningfulNotes = (record: OrientationRecord) => {
  const notes = String(record.notes || "");
  return normalize(notes).includes("fecha ajustada por feriado") ? "" : notes;
};

const identity = (record: OrientationRecord) => normalize([
  record.date,
  record.week,
  record.course,
  record.axis || record.characterStrength,
  record.topic || meaningfulNotes(record) || record.notes || record.planificacion,
].filter(Boolean).join("|"));

const looseIdentity = (record: OrientationRecord) => normalize([
  record.date,
  record.week,
  record.course,
  record.axis || record.characterStrength,
].filter(Boolean).join("|"));

const courseWeek = (record: OrientationRecord) => normalize([record.course, record.week].filter(Boolean).join("|"));
const hasContent = (record: OrientationRecord) => Boolean(String(
  record.canvaLink || record.evidence || record.planificacion || record.folderLink || record.teacherLink || meaningfulNotes(record) || "",
).trim());
const isGeneratedPlaceholder = (record: OrientationRecord) =>
  normalize(record.source).includes("plan anual orientacion 2026") && !hasContent(record);

const sanitizeData = (record: OrientationRecord) =>
  Object.fromEntries(Object.entries(record).filter(([key, value]) => !["id", "createdAt", "updatedAt"].includes(key) && value !== undefined));

export async function POST(request: Request) {
  if (request.headers.get("x-maintenance-key") !== MAINTENANCE_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!rawUrl || !serviceRole) {
    return NextResponse.json({ error: "Supabase service credentials are not configured" }, { status: 503 });
  }

  const supabase = createClient(normalizeSupabaseUrl(rawUrl), serviceRole, { auth: { persistSession: false } });
  const { data: institution, error: institutionError } = await supabase
    .from("institutions")
    .select("id")
    .eq("slug", "colegio-san-lucas")
    .maybeSingle();
  if (institutionError) throw institutionError;
  if (!institution?.id) return NextResponse.json({ error: "Institution not found" }, { status: 404 });

  const { data: rows, error: rowsError } = await supabase
    .from("app_records")
    .select("record_id, data, created_at, updated_at")
    .eq("institution_id", institution.id)
    .eq("entity", "orientation");
  if (rowsError) throw rowsError;

  const seedByIdentity = new Map(ORIENTATION_FIRST_CYCLE_CLASSES.map((record) => [identity(record), record]));
  const seedByLooseIdentity = new Map(ORIENTATION_FIRST_CYCLE_CLASSES.map((record) => [looseIdentity(record), record]));
  const seedCourseWeeks = new Set(ORIENTATION_FIRST_CYCLE_CLASSES.map(courseWeek));
  const existingIdentities = new Set<string>();
  const upserts: Array<Record<string, unknown>> = [];
  const deletes: string[] = [];
  let updated = 0;

  for (const row of rows || []) {
    const current: OrientationRecord = { id: row.record_id, createdAt: row.created_at, updatedAt: row.updated_at, ...((row.data || {}) as Record<string, unknown>) };
    if (isGeneratedPlaceholder(current) && seedCourseWeeks.has(courseWeek(current))) {
      deletes.push(row.record_id);
      continue;
    }
    const seed = seedByIdentity.get(identity(current)) || seedByLooseIdentity.get(looseIdentity(current));
    if (!seed) {
      existingIdentities.add(identity(current));
      continue;
    }
    existingIdentities.add(identity(seed));
    const merged: OrientationRecord = {
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
    const { error } = await supabase
      .from("app_records")
      .upsert(upserts.slice(i, i + 200), { onConflict: "institution_id,entity,record_id" });
    if (error) throw error;
  }

  for (let i = 0; i < deletes.length; i += 200) {
    const { error } = await supabase
      .from("app_records")
      .delete()
      .eq("institution_id", institution.id)
      .eq("entity", "orientation")
      .in("record_id", deletes.slice(i, i + 200));
    if (error) throw error;
  }

  return NextResponse.json({
    sourceRecords: ORIENTATION_FIRST_CYCLE_CLASSES.length,
    currentRecords: rows?.length || 0,
    updated,
    inserted: missing.length,
    removedPlaceholders: deletes.length,
    upserted: upserts.length,
  });
}
