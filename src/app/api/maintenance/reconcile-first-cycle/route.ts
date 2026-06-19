import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import mammoth from "mammoth";
import {
  FIRST_CYCLE_COURSES,
  cleanRutValue,
  isFirstCycleCourse,
  parseFirstCycleRosterHtml,
} from "@/lib/first-cycle-roster";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const MAINTENANCE_KEY = "tiza-first-cycle-2026-06-19-3f519b37";

type StudentRow = {
  record_id: string;
  data: Record<string, string>;
};

const normalizeSupabaseUrl = (url: string) => url.replace(/\/(rest|auth)\/v1\/?$/, "").replace(/\/$/, "");

const normalize = (value: string) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const stableId = (entry: { fullName: string; course: string; rut: string }) => {
  const rut = cleanRutValue(entry.rut || "");
  const nameKey = normalize(entry.fullName || "").replace(/\s+/g, "-");
  const courseKey = normalize(entry.course || "").replace(/\s+/g, "-");
  return `first-cycle-${rut || `${nameKey}-${courseKey}`}`;
};

const getAdminClient = () => {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!rawUrl || !key) return null;
  return createClient(normalizeSupabaseUrl(rawUrl), key, { auth: { persistSession: false } });
};

async function fetchAllStudents(supabase: SupabaseClient, institutionId: string) {
  const rows: StudentRow[] = [];
  const pageSize = 1000;
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("app_records")
      .select("record_id,data")
      .eq("institution_id", institutionId)
      .eq("entity", "students")
      .range(from, from + pageSize - 1);
    if (error) throw error;
    rows.push(...(((data || []) as unknown) as StudentRow[]));
    if (!data || data.length < pageSize) break;
  }
  return rows;
}

export async function POST(request: Request) {
  if (request.headers.get("x-maintenance-key") !== MAINTENANCE_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase service credentials are not configured" }, { status: 503 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing .docx file" }, { status: 400 });
  }

  const html = await mammoth.convertToHtml({ buffer: Buffer.from(await file.arrayBuffer()) });
  const parsed = parseFirstCycleRosterHtml(html.value || "");
  if (parsed.students.length !== 442) {
    return NextResponse.json({ error: `Expected 442 students, got ${parsed.students.length}` }, { status: 422 });
  }

  let { data: institution, error: institutionError } = await supabase
    .from("institutions")
    .select("id")
    .eq("slug", "colegio-san-lucas")
    .maybeSingle();
  if (institutionError) throw institutionError;
  if (!institution?.id) {
    const created = await supabase
      .from("institutions")
      .insert({ name: "Colegio San Lucas", slug: "colegio-san-lucas" })
      .select("id")
      .single();
    if (created.error) throw created.error;
    institution = created.data;
  }
  const institutionId = String(institution.id);

  const existing = await fetchAllStudents(supabase, institutionId);
  const firstCycleExisting = existing.filter((row) => isFirstCycleCourse(row.data?.course || ""));
  const byRut = new Map<string, StudentRow>();
  const byNameCourse = new Map<string, StudentRow>();
  const byName = new Map<string, StudentRow | null>();

  firstCycleExisting.forEach((row) => {
    const data = row.data || {};
    const rut = cleanRutValue(data.rut || "");
    if (rut && !byRut.has(rut)) byRut.set(rut, row);
    const nameKey = normalize(data.fullName || "");
    const courseKey = normalize(data.course || "");
    if (nameKey && courseKey && !byNameCourse.has(`${nameKey}|${courseKey}`)) {
      byNameCourse.set(`${nameKey}|${courseKey}`, row);
    }
    if (nameKey) byName.set(nameKey, byName.has(nameKey) ? null : row);
  });

  const usedIds = new Set<string>();
  const rows = parsed.students.map((entry) => {
    const fullName = String(entry.fullName || "").trim();
    const course = String(entry.course || "").trim();
    const rut = cleanRutValue(entry.rut || "");
    const nameKey = normalize(fullName);
    const courseKey = normalize(course);
    const existingRow =
      (rut && byRut.get(rut)) ||
      byNameCourse.get(`${nameKey}|${courseKey}`) ||
      byName.get(nameKey) ||
      undefined;
    const recordId = existingRow?.record_id || stableId({ fullName, course, rut });
    usedIds.add(recordId);
    const existingData = existingRow?.data || {};
    return {
      institution_id: institutionId,
      entity: "students",
      record_id: recordId,
      data: {
        ...existingData,
        fullName,
        course,
        rut,
        guardian: String(entry.guardianName || existingData.guardian || ""),
        email: String(entry.guardianEmail || existingData.email || ""),
        phone: String(entry.guardianPhone || existingData.phone || ""),
        source: "Nomina oficial Primer Ciclo",
      },
    };
  });

  for (let i = 0; i < rows.length; i += 500) {
    const { error } = await supabase
      .from("app_records")
      .upsert(rows.slice(i, i + 500), { onConflict: "institution_id,entity,record_id" });
    if (error) throw error;
  }

  const staleIds = firstCycleExisting.map((row) => row.record_id).filter((id) => !usedIds.has(id));
  for (let i = 0; i < staleIds.length; i += 500) {
    const chunk = staleIds.slice(i, i + 500);
    const { error } = await supabase
      .from("app_records")
      .delete()
      .eq("institution_id", institutionId)
      .eq("entity", "students")
      .in("record_id", chunk);
    if (error) throw error;
  }

  const after = await fetchAllStudents(supabase, institutionId);
  const afterFirstCycle = after.filter((row) => isFirstCycleCourse(row.data?.course || ""));
  const byCourse = Object.fromEntries(
    FIRST_CYCLE_COURSES.map((course) => [
      course,
      afterFirstCycle.filter((row) => normalize(row.data?.course || "") === normalize(course)).length,
    ])
  );

  return NextResponse.json({
    ok: true,
    parsed: parsed.students.length,
    beforeFirstCycle: firstCycleExisting.length,
    afterFirstCycle: afterFirstCycle.length,
    deletedStale: staleIds.length,
    byCourse,
  });
}
