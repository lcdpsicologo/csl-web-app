import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

// Vista pública de solo lectura para profesores: expone únicamente los campos
// necesarios para ver las clases de orientación. No incluye notas internas,
// datos de estudiantes ni ninguna otra entidad.

type PublicClassRecord = {
  id: string;
  date: string;
  week: string;
  weekNumber: string;
  course: string;
  action: string;
  topic: string;
  status: string;
  owner: string;
  canvaLink: string;
  teacherLink: string;
  planificacionLink: string;
  updatedAt: string;
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const normalizeSupabaseUrl = (url: string) => url.replace(/\/(rest|auth)\/v1\/?$/, "").replace(/\/$/, "");

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const isLink = (value: string) => /^https?:\/\//i.test(value);

const isPlaceholderText = (value: string) => {
  const normalized = normalize(value);
  return !normalized ||
    normalized === "clase por definir" ||
    normalized === "por definir" ||
    normalized === "sin tema definido" ||
    normalized === "sesion por definir";
};

export async function GET() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!rawUrl || !key) {
    return NextResponse.json({ error: "Supabase no está configurado" }, { status: 503 });
  }

  const supabase = createClient(normalizeSupabaseUrl(rawUrl), key, { auth: { persistSession: false } });

  try {
    const { data: institution, error: institutionError } = await supabase
      .from("institutions")
      .select("id")
      .eq("slug", "colegio-san-lucas")
      .maybeSingle();
    if (institutionError) throw institutionError;
    if (!institution?.id) return NextResponse.json({ classes: [] });

    const classes: PublicClassRecord[] = [];
    const pageSize = 1000;
    let from = 0;
    while (true) {
      const { data, error } = await supabase
        .from("app_records")
        .select("record_id, data, updated_at")
        .eq("institution_id", institution.id)
        .eq("entity", "orientation")
        .order("updated_at", { ascending: false })
        .range(from, from + pageSize - 1);
      if (error) throw error;

      const batch = (data as Array<{ record_id: string; data: Record<string, unknown>; updated_at: string }> | null) || [];
      batch.forEach((row) => {
        const record = row.data || {};
        const canvaLink = [str(record.canvaLink), str(record.evidence)].find(isLink) || "";
        const teacherLink = str(record.teacherLink);
        const planificacionLink = [str(record.planificacion), str(record.folderLink)].find(isLink) || "";
        const topic = str(record.topic);
        // Omitir filas generadas por el plan anual que aún no tienen contenido real.
        const generated = normalize(str(record.source)).includes("plan anual orientacion 2026");
        const hasContent = Boolean(canvaLink || teacherLink || planificacionLink || (topic && !isPlaceholderText(topic)));
        if (generated && !hasContent) return;

        classes.push({
          id: row.record_id,
          date: str(record.date),
          week: str(record.week),
          weekNumber: str(record.weekNumber),
          course: str(record.course),
          action: str(record.axis) || str(record.characterStrength) || str(record.classType) || "",
          topic,
          status: str(record.status),
          owner: str(record.orientationOwner),
          canvaLink,
          teacherLink: isLink(teacherLink) ? teacherLink : "",
          planificacionLink,
          updatedAt: row.updated_at,
        });
      });
      if (batch.length < pageSize) break;
      from += pageSize;
    }

    classes.sort((a, b) => (b.date || b.updatedAt).localeCompare(a.date || a.updatedAt));
    return NextResponse.json({ classes });
  } catch (error) {
    console.error("Public clases load failed", error);
    return NextResponse.json({ error: "No se pudieron cargar las clases" }, { status: 500 });
  }
}
