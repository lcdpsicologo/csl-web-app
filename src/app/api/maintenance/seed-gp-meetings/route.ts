import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SEED_GP_MEETINGS, type GpSeedRecord } from "@/lib/seed-gp-meetings";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

// Ruta temporal para cargar las reuniones GP (Formativo, Académico e
// Interdisciplinario) desde las planillas por profesor jefe. Idempotente por
// id; se elimina tras ejecutarla.
const MAINTENANCE_KEY = "seed-gp-2026-07-24";

const normalizeSupabaseUrl = (url: string) => url.replace(/\/(rest|auth)\/v1\/?$/, "").replace(/\/$/, "");

const sanitize = (record: GpSeedRecord) =>
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

  try {
    const supabase = createClient(normalizeSupabaseUrl(rawUrl), serviceRole, { auth: { persistSession: false } });
    const { data: institution, error: institutionError } = await supabase
      .from("institutions")
      .select("id")
      .eq("slug", "colegio-san-lucas")
      .maybeSingle();
    if (institutionError) throw institutionError;
    if (!institution?.id) return NextResponse.json({ error: "Institution not found" }, { status: 404 });

    const rows = SEED_GP_MEETINGS.map((record) => ({
      institution_id: institution.id,
      entity: "meetings",
      record_id: record.id,
      data: sanitize(record),
      created_at: record.createdAt,
      updated_at: record.updatedAt,
    }));

    for (let i = 0; i < rows.length; i += 50) {
      const { error } = await supabase
        .from("app_records")
        .upsert(rows.slice(i, i + 50), { onConflict: "institution_id,entity,record_id" });
      if (error) throw error;
    }

    const byType: Record<string, number> = {};
    SEED_GP_MEETINGS.forEach((record) => { byType[record.meetingType] = (byType[record.meetingType] || 0) + 1; });

    return NextResponse.json({ ok: true, upserted: rows.length, byType });
  } catch (error) {
    console.error("Seed GP meetings failed", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : String(error),
      details: (error as { details?: string; hint?: string })?.details || null,
    }, { status: 500 });
  }
}
