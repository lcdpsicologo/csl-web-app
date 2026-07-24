import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SEED_INTERVIEWS, SEED_MEETINGS, type SeedRecord } from "@/lib/seed-interviews-meetings";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

// Ruta temporal de carga inicial de entrevistas y reuniones (GP) desde los
// documentos del orientador. Idempotente: usa los ids estables de la semilla,
// así reejecutarla no duplica. Se elimina tras usarla.
const MAINTENANCE_KEY = "seed-entrevistas-reuniones-2026-07-24";

const normalizeSupabaseUrl = (url: string) => url.replace(/\/(rest|auth)\/v1\/?$/, "").replace(/\/$/, "");

const sanitize = (record: SeedRecord) =>
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

  const rows = [
    ...SEED_INTERVIEWS.map((record) => ({ entity: "interviews", record_id: record.id, data: sanitize(record), created_at: record.createdAt, updated_at: record.updatedAt })),
    ...SEED_MEETINGS.map((record) => ({ entity: "meetings", record_id: record.id, data: sanitize(record), created_at: record.createdAt, updated_at: record.updatedAt })),
  ].map((row) => ({ institution_id: institution.id, ...row }));

  for (let i = 0; i < rows.length; i += 100) {
    const { error } = await supabase
      .from("app_records")
      .upsert(rows.slice(i, i + 100), { onConflict: "institution_id,entity,record_id" });
    if (error) throw error;
  }

  return NextResponse.json({
    ok: true,
    interviews: SEED_INTERVIEWS.length,
    meetings: SEED_MEETINGS.length,
    upserted: rows.length,
  });
}
