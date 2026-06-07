import { NextResponse } from "next/server";
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

type EntityId =
  | "students"
  | "courses"
  | "cases"
  | "logs"
  | "interviews"
  | "protocols"
  | "orientation"
  | "workshops"
  | "documents";

type DataRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: string;
};

type DataStore = Record<EntityId, DataRecord[]>;

type AppRecordRow = {
  entity: EntityId;
  record_id: string;
  data: Record<string, string>;
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
  "documents",
];

const emptyStore = (): DataStore => ({
  students: [],
  courses: [],
  cases: [],
  logs: [],
  interviews: [],
  protocols: [],
  orientation: [],
  workshops: [],
  documents: [],
});

const getAdminClient = () => {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      persistSession: false,
    },
  });
};

const getAuthClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return createClient(url, key, {
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
  const authClient = getAuthClient();
  if (!supabase || !authClient) {
    return NextResponse.json({ error: "Supabase service credentials are not configured" }, { status: 503 });
  }

  const auth = await authenticate(request, authClient);
  if (auth.error) return auth.error;

  try {
    const institutionId = await ensureInstitution(supabase, auth.user);
    const { data, error } = await supabase
      .from("app_records")
      .select("entity, record_id, data, created_at, updated_at")
      .eq("institution_id", institutionId)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    const store = emptyStore();
    (data as AppRecordRow[] | null)?.forEach((row) => {
      if (!ENTITY_IDS.includes(row.entity)) return;
      store[row.entity].push({
        id: row.record_id,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        ...row.data,
      });
    });

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
  const authClient = getAuthClient();
  if (!supabase || !authClient) {
    return NextResponse.json({ error: "Supabase service credentials are not configured" }, { status: 503 });
  }

  const auth = await authenticate(request, authClient);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const incomingStore = { ...emptyStore(), ...(body.store || {}) } as DataStore;
    const institutionId = await ensureInstitution(supabase, auth.user);
    const rows = ENTITY_IDS.flatMap((entity) =>
      (incomingStore[entity] || []).map((record) => {
        const data = Object.fromEntries(
          Object.entries(record).filter(([key]) => !["id", "createdAt", "updatedAt"].includes(key))
        );
        return {
          institution_id: institutionId,
          entity,
          record_id: record.id,
          data,
          created_by: auth.user.id,
          updated_by: auth.user.id,
        };
      })
    );

    if (rows.length > 0) {
      const { error: upsertError } = await supabase
        .from("app_records")
        .upsert(rows, { onConflict: "institution_id,entity,record_id" });

      if (upsertError) throw upsertError;
    }

    for (const entity of ENTITY_IDS) {
      const ids = (incomingStore[entity] || []).map((record) => record.id);
      let deleteQuery = supabase
        .from("app_records")
        .delete()
        .eq("institution_id", institutionId)
        .eq("entity", entity);

      if (ids.length > 0) {
        deleteQuery = deleteQuery.not("record_id", "in", `(${ids.map((id) => `"${id}"`).join(",")})`);
      }

      const { error: deleteError } = await deleteQuery;
      if (deleteError) throw deleteError;
    }

    await supabase.from("audit_logs").insert({
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

    return NextResponse.json({ ok: true, persistent: true });
  } catch (error) {
    console.error("Records save failed", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unable to save records",
    }, { status: 500 });
  }
}
