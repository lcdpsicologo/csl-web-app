import { NextResponse } from "next/server";
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

type EntityId =
  | "students"
  | "courses"
  | "cases"
  | "logs"
  | "interviews"
  | "protocols"
  | "orientation"
  | "workshops"
  | "personnel"
  | "documents";

type DataRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
};

type DataStore = Record<EntityId, DataRecord[]>;

type AppRecordRow = {
  entity: EntityId;
  record_id: string;
  data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

const ENTITY_IDS: EntityId[] = [
  "students",
  "courses",
  "cases",
  "logs",
  "interviews",
  "protocols",
  "orientation",
  "workshops",
  "personnel",
  "documents",
];

const normalizeSupabaseUrl = (url: string) => url.replace(/\/(rest|auth)\/v1\/?$/, "").replace(/\/$/, "");

const emptyStore = (): DataStore => ({
  students: [],
  courses: [],
  cases: [],
  logs: [],
  interviews: [],
  protocols: [],
  orientation: [],
  workshops: [],
  personnel: [],
  documents: [],
});

const stableRecordId = (entity: EntityId, record: DataRecord, index: number) => {
  const current = typeof record.id === "string" ? record.id.trim() : "";
  if (current) return current;
  const basis = JSON.stringify(record);
  let hash = 0;
  for (let i = 0; i < basis.length; i += 1) {
    hash = ((hash << 5) - hash + basis.charCodeAt(i)) | 0;
  }
  return `recovered-${entity}-${index}-${Math.abs(hash)}`;
};

const sanitizeData = (record: DataRecord) =>
  Object.fromEntries(
    Object.entries(record)
      .filter(([key, value]) => !["id", "createdAt", "updatedAt"].includes(key) && value !== undefined)
      .map(([key, value]) => [key, value === null ? "" : value]),
  );

const withoutUserColumns = <T extends Record<string, unknown>>(rows: T[]) =>
  rows.map(({ created_by: _createdBy, updated_by: _updatedBy, ...row }) => row);

const shouldRetryWithoutUserColumns = (error: { message?: string; details?: string } | null) => {
  const text = `${error?.message || ""} ${error?.details || ""}`.toLowerCase();
  return text.includes("created_by") || text.includes("updated_by");
};

const getAdminClient = () => {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!rawUrl || !key) return null;

  return createClient(normalizeSupabaseUrl(rawUrl), key, {
    auth: {
      persistSession: false,
    },
  });
};

const getToken = (request: Request) => {
  const header = request.headers.get("authorization") || "";
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
};

const authenticate = async (request: Request, supabase: SupabaseClient) => {
  const token = getToken(request);
  if (!token) {
    return { error: NextResponse.json({ error: "Missing bearer token" }, { status: 401 }) };
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return { error: NextResponse.json({ error: "Invalid session" }, { status: 401 }) };
  }

  return { user: data.user };
};

const ensureInstitution = async (supabase: SupabaseClient, user: User) => {
  const { data: existingProfile, error: profileError } = await supabase
    .from("profiles")
    .select("institution_id")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) throw profileError;
  if (existingProfile?.institution_id) return existingProfile.institution_id as string;

  const { data: institution, error: institutionError } = await supabase
    .from("institutions")
    .select("id")
    .eq("slug", "colegio-san-lucas")
    .maybeSingle();

  if (institutionError) throw institutionError;

  let institutionId = institution?.id as string | undefined;
  if (!institutionId) {
    const { data: createdInstitution, error: createInstitutionError } = await supabase
      .from("institutions")
      .insert({ name: "Colegio San Lucas", slug: "colegio-san-lucas" })
      .select("id")
      .single();

    if (createInstitutionError) throw createInstitutionError;
    institutionId = createdInstitution.id as string;
  }

  const { error: upsertProfileError } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      institution_id: institutionId,
      full_name: user.email || "",
      role: "orientacion",
    }, { onConflict: "id" });

  if (upsertProfileError) throw upsertProfileError;
  return institutionId;
};

export async function GET(request: Request) {
  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase service credentials are not configured" }, { status: 503 });
  }

  const auth = await authenticate(request, supabase);
  if (auth.error) return auth.error;

  try {
    const institutionId = await ensureInstitution(supabase, auth.user);
    const store = emptyStore();
    const pageSize = 1000;
    let from = 0;
    while (true) {
      const { data, error } = await supabase
        .from("app_records")
        .select("entity, record_id, data, created_at, updated_at")
        .eq("institution_id", institutionId)
        .order("updated_at", { ascending: false })
        .range(from, from + pageSize - 1);

      if (error) throw error;
      const batch = (data as AppRecordRow[] | null) || [];
      batch.forEach((row) => {
        if (!ENTITY_IDS.includes(row.entity)) return;
        store[row.entity].push({
          id: row.record_id,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          ...row.data,
        });
      });
      if (batch.length < pageSize) break;
      from += pageSize;
    }

    return NextResponse.json({ store, persistent: true });
  } catch (error) {
    console.error("Records load failed", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unable to load records",
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase service credentials are not configured" }, { status: 503 });
  }

  const auth = await authenticate(request, supabase);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const incomingStore = { ...emptyStore(), ...(body.store || {}) } as DataStore;
    const institutionId = await ensureInstitution(supabase, auth.user);
    const rows = ENTITY_IDS.flatMap((entity) =>
      (incomingStore[entity] || []).map((record, index) => {
        const recordId = stableRecordId(entity, record, index);
        return {
          institution_id: institutionId,
          entity,
          record_id: recordId,
          data: sanitizeData(record),
          created_by: auth.user.id,
          updated_by: auth.user.id,
        };
      })
    );

    const chunkSize = 500;
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      const { error: upsertError } = await supabase
        .from("app_records")
        .upsert(chunk, { onConflict: "institution_id,entity,record_id" });

      if (upsertError) {
        if (shouldRetryWithoutUserColumns(upsertError)) {
          const { error: fallbackError } = await supabase
            .from("app_records")
            .upsert(withoutUserColumns(chunk), { onConflict: "institution_id,entity,record_id" });
          if (fallbackError) throw fallbackError;
        } else {
          throw upsertError;
        }
      }
    }

    for (const entity of ENTITY_IDS) {
      const nextIds = new Set((incomingStore[entity] || []).map((record, index) => stableRecordId(entity, record, index)));
      const { data: existingRows, error: existingError } = await supabase
        .from("app_records")
        .select("record_id")
        .eq("institution_id", institutionId)
        .eq("entity", entity);
      if (existingError) throw existingError;

      const staleIds = ((existingRows || []) as Array<{ record_id: string }>)
        .map((row) => row.record_id)
        .filter((recordId) => !nextIds.has(recordId));
      for (let i = 0; i < staleIds.length; i += chunkSize) {
        const staleChunk = staleIds.slice(i, i + chunkSize);
        const { error: deleteError } = await supabase
          .from("app_records")
          .delete()
          .eq("institution_id", institutionId)
          .eq("entity", entity)
          .in("record_id", staleChunk);
        if (deleteError) throw deleteError;
      }
    }

    const { error: auditError } = await supabase.from("audit_logs").insert({
      institution_id: institutionId,
      actor_id: auth.user.id,
      action: "records_snapshot_saved",
      metadata: {
        totalRecords: rows.length,
        entities: ENTITY_IDS.reduce<Record<string, number>>((acc, entity) => {
          acc[entity] = incomingStore[entity]?.length || 0;
          return acc;
        }, {}),
      },
    });
    if (auditError) {
      console.warn("Records audit log insert failed", auditError);
    }

    return NextResponse.json({ ok: true, persistent: true });
  } catch (error) {
    console.error("Records save failed", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unable to save records",
    }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase service credentials are not configured" }, { status: 503 });
  }

  const auth = await authenticate(request, supabase);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const entity = body.entity as EntityId;
    const records = Array.isArray(body.records) ? body.records as DataRecord[] : [];
    const recordIds = Array.isArray(body.recordIds)
      ? body.recordIds.map((value: unknown) => String(value || "").trim()).filter(Boolean)
      : [];
    if (!ENTITY_IDS.includes(entity) || (records.length === 0 && recordIds.length === 0)) {
      return NextResponse.json({ error: "Entity and record changes are required" }, { status: 400 });
    }

    const institutionId = await ensureInstitution(supabase, auth.user);
    const rows = records.map((record, index) => ({
      institution_id: institutionId,
      entity,
      record_id: stableRecordId(entity, record, index),
      data: sanitizeData(record),
      created_by: auth.user.id,
      updated_by: auth.user.id,
    }));

    if (rows.length) {
      const { error: upsertError } = await supabase
        .from("app_records")
        .upsert(rows, { onConflict: "institution_id,entity,record_id" });
      if (upsertError) {
        if (shouldRetryWithoutUserColumns(upsertError)) {
          const { error: fallbackError } = await supabase
            .from("app_records")
            .upsert(withoutUserColumns(rows), { onConflict: "institution_id,entity,record_id" });
          if (fallbackError) throw fallbackError;
        } else {
          throw upsertError;
        }
      }
    }

    if (recordIds.length) {
      const { error: deleteError } = await supabase
        .from("app_records")
        .delete()
        .eq("institution_id", institutionId)
        .eq("entity", entity)
        .in("record_id", recordIds);
      if (deleteError) throw deleteError;
    }

    return NextResponse.json({ ok: true, persistent: true, saved: rows.length, deleted: recordIds.length });
  } catch (error) {
    console.error("Incremental records save failed", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unable to save records",
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase service credentials are not configured" }, { status: 503 });
  }

  const auth = await authenticate(request, supabase);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const entity = body.entity as EntityId;
    const recordIds = Array.isArray(body.recordIds)
      ? body.recordIds.map((value: unknown) => String(value || "").trim()).filter(Boolean)
      : [];
    if (!ENTITY_IDS.includes(entity) || recordIds.length === 0) {
      return NextResponse.json({ error: "Entity and recordIds are required" }, { status: 400 });
    }

    const institutionId = await ensureInstitution(supabase, auth.user);
    const { error: deleteError } = await supabase
      .from("app_records")
      .delete()
      .eq("institution_id", institutionId)
      .eq("entity", entity)
      .in("record_id", recordIds);
    if (deleteError) throw deleteError;

    return NextResponse.json({ ok: true, persistent: true, deleted: recordIds.length });
  } catch (error) {
    console.error("Incremental records delete failed", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unable to delete records",
    }, { status: 500 });
  }
}
