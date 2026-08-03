import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { accessErrorResponse, resolveAccess } from "@/lib/authz";
import {
  CONTACT_STUDENT_FIELDS,
  SENSITIVE_STUDENT_FIELDS,
  canRead,
  canWrite,
  permissionsFor,
  redactRecord,
} from "@/lib/access-control";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const MAX_DELTA_BYTES = 750 * 1024;
const MAX_RECORDS_PER_DELTA = 100;
const MAX_IDS_PER_DELTA = 250;

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
  | "documents"
  | "meetings";

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
  "meetings",
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
  meetings: [],
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

const readLimitedJson = async (request: Request) => {
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_DELTA_BYTES) {
    throw new Error("PAYLOAD_TOO_LARGE");
  }
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_DELTA_BYTES) {
    throw new Error("PAYLOAD_TOO_LARGE");
  }
  return {
    body: JSON.parse(text) as Record<string, unknown>,
    receivedBytes: new TextEncoder().encode(text).byteLength,
  };
};

/**
 * Evita que una escritura borre lo que quien la hace no tenía permiso de ver.
 *
 * Quien recibe la ficha censurada la devuelve sin esos campos; sin esta
 * fusión, guardar un cambio menor borraría alertas de salud o antecedentes.
 * Los campos ocultos se recuperan del registro ya almacenado.
 */
const mergePreservingHidden = async (
  supabase: SupabaseClient,
  institutionId: string,
  entity: EntityId,
  rows: Array<{ record_id: string; data: Record<string, unknown> }>,
  permissions: ReturnType<typeof permissionsFor>,
) => {
  const hidden = [
    ...(permissions.sensitiveStudentData ? [] : SENSITIVE_STUDENT_FIELDS),
    ...(permissions.contactStudentData ? [] : CONTACT_STUDENT_FIELDS),
  ];
  if (entity !== "students" || !hidden.length || !rows.length) return rows;

  const { data: existing, error } = await supabase
    .from("app_records")
    .select("record_id, data")
    .eq("institution_id", institutionId)
    .eq("entity", entity)
    .in("record_id", rows.map((row) => row.record_id));
  if (error) throw error;

  const stored = new Map(
    ((existing || []) as Array<{ record_id: string; data: Record<string, unknown> }>)
      .map((row) => [row.record_id, row.data || {}]),
  );

  return rows.map((row) => {
    const previous = stored.get(row.record_id);
    if (!previous) return row;
    const restored = { ...row.data };
    for (const field of hidden) {
      if (field in previous) restored[field] = previous[field];
    }
    return { ...row, data: restored };
  });
};

export async function GET(request: Request) {
  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase service credentials are not configured" }, { status: 503 });
  }

  const auth = await authenticate(request, supabase);
  if (auth.error) return auth.error;

  try {
    const { institutionId, permissions } = await resolveAccess(supabase, auth.user);
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
        // El filtro va en el servidor: lo que el cargo no puede ver, no viaja.
        if (!canRead(permissions, row.entity)) return;
        store[row.entity].push({
          id: row.record_id,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          ...redactRecord(row.entity, row.data, permissions),
        });
      });
      if (batch.length < pageSize) break;
      from += pageSize;
    }

    return NextResponse.json({ store, persistent: true, permissions });
  } catch (error) {
    const denied = accessErrorResponse(error);
    if (denied) return denied;
    console.error("Records load failed", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unable to load records",
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  // Las copias completas fueron la causa principal del tráfico entrante. Solo se
  // conserva esta ruta para una recuperación manual y explícita.
  if (request.headers.get("x-tiza-snapshot-mode") !== "manual-recovery") {
    return NextResponse.json({
      error: "Las copias completas están deshabilitadas; actualiza la aplicación para usar sincronización incremental.",
    }, { status: 409 });
  }
  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase service credentials are not configured" }, { status: 503 });
  }

  const auth = await authenticate(request, supabase);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const incomingStore = { ...emptyStore(), ...(body.store || {}) } as DataStore;
    const pruneMissing = body.pruneMissing === true;
    const { institutionId, permissions } = await resolveAccess(supabase, auth.user);
    // Una restauración completa reescribe todo el colegio: sólo la puede hacer
    // quien tiene permiso de escritura sobre todas las entidades.
    const sinPermiso = ENTITY_IDS.filter((entity) => !canWrite(permissions, entity));
    if (sinPermiso.length) {
      return NextResponse.json({
        error: "Tu cargo no puede restaurar una copia completa de los datos.",
        forbidden: true,
      }, { status: 403 });
    }
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

    // Los snapshots completos pueden venir desde una pestaña atrasada. Por
    // defecto solo agregan/actualizan; borrar queda reservado a DELETE/PATCH.
    if (pruneMissing) {
      for (const entity of ENTITY_IDS) {
        const nextIds = new Set((incomingStore[entity] || []).map((record, index) => stableRecordId(entity, record, index)));
        const existingIds: string[] = [];
        const pageSize = 1000;
        let from = 0;
        while (true) {
          const { data: existingRows, error: existingError } = await supabase
            .from("app_records")
            .select("record_id")
            .eq("institution_id", institutionId)
            .eq("entity", entity)
            .range(from, from + pageSize - 1);
          if (existingError) throw existingError;
          const batch = ((existingRows || []) as Array<{ record_id: string }>).map((row) => row.record_id);
          existingIds.push(...batch);
          if (batch.length < pageSize) break;
          from += pageSize;
        }

        const staleIds = existingIds.filter((recordId) => !nextIds.has(recordId));
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
        pruneMissing,
      },
    });
    if (auditError) {
      console.warn("Records audit log insert failed", auditError);
    }

    return NextResponse.json({ ok: true, persistent: true });
  } catch (error) {
    const denied = accessErrorResponse(error);
    if (denied) return denied;
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
    const { body, receivedBytes } = await readLimitedJson(request);
    const entity = body.entity as EntityId;
    const records = Array.isArray(body.records)
      ? (body.records as unknown[]).filter((record): record is DataRecord =>
          Boolean(record && typeof record === "object" && typeof (record as DataRecord).id === "string"))
      : [];
    const recordIds = Array.isArray(body.recordIds)
      ? body.recordIds.map((value: unknown) => String(value || "").trim()).filter(Boolean)
      : [];
    if (records.length > MAX_RECORDS_PER_DELTA || recordIds.length > MAX_IDS_PER_DELTA) {
      return NextResponse.json({ error: "El lote incremental supera el límite permitido" }, { status: 413 });
    }
    if (!ENTITY_IDS.includes(entity) || (records.length === 0 && recordIds.length === 0)) {
      return NextResponse.json({ error: "Entity and record changes are required" }, { status: 400 });
    }

    const { institutionId, permissions } = await resolveAccess(supabase, auth.user);
    if (!canWrite(permissions, entity)) {
      return NextResponse.json({ error: `Tu cargo no puede modificar ${entity}.`, forbidden: true }, { status: 403 });
    }
    const rows = await mergePreservingHidden(
      supabase,
      institutionId,
      entity,
      records.map((record, index) => ({
        institution_id: institutionId,
        entity,
        record_id: stableRecordId(entity, record, index),
        data: sanitizeData(record),
        created_by: auth.user.id,
        updated_by: auth.user.id,
      })),
      permissions,
    );

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

    if (receivedBytes > 500 * 1024) {
      console.warn("Large incremental records payload", { entity, receivedBytes, saved: rows.length, deleted: recordIds.length });
    }
    return NextResponse.json({ ok: true, persistent: true, saved: rows.length, deleted: recordIds.length, receivedBytes });
  } catch (error) {
    const denied = accessErrorResponse(error);
    if (denied) return denied;
    if (error instanceof Error && error.message === "PAYLOAD_TOO_LARGE") {
      return NextResponse.json({ error: "La solicitud incremental supera 750 KB" }, { status: 413 });
    }
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

    const { institutionId, permissions } = await resolveAccess(supabase, auth.user);
    if (!canWrite(permissions, entity)) {
      return NextResponse.json({ error: `Tu cargo no puede eliminar ${entity}.`, forbidden: true }, { status: 403 });
    }
    const { error: deleteError } = await supabase
      .from("app_records")
      .delete()
      .eq("institution_id", institutionId)
      .eq("entity", entity)
      .in("record_id", recordIds);
    if (deleteError) throw deleteError;

    return NextResponse.json({ ok: true, persistent: true, deleted: recordIds.length });
  } catch (error) {
    const denied = accessErrorResponse(error);
    if (denied) return denied;
    console.error("Incremental records delete failed", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unable to delete records",
    }, { status: 500 });
  }
}
