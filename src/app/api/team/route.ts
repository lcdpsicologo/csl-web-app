import { NextResponse } from "next/server";
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

type ProfileRow = {
  id: string;
  institution_id: string | null;
  full_name: string | null;
  role: string | null;
};

const normalizeSupabaseUrl = (url: string) => url.replace(/\/(rest|auth)\/v1\/?$/, "").replace(/\/$/, "");

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

const getAuthClient = () => {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
  const authClient = getAuthClient();
  if (!supabase || !authClient) {
    return NextResponse.json({ error: "Supabase service credentials are not configured" }, { status: 503 });
  }

  const auth = await authenticate(request, authClient);
  if (auth.error) return auth.error;

  try {
    const institutionId = await ensureInstitution(supabase, auth.user);
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, institution_id, full_name, role")
      .eq("institution_id", institutionId)
      .order("role", { ascending: true });

    if (profileError) throw profileError;

    const { data: usersPage, error: usersError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (usersError) throw usersError;

    const usersById = new Map(usersPage.users.map((user) => [user.id, user]));
    const team = (profiles as ProfileRow[] | null || []).map((profile) => {
      const user = usersById.get(profile.id);
      return {
        id: profile.id,
        name: profile.full_name || user?.email || "Sin nombre",
        role: profile.role || "Sin cargo asignado",
        email: user?.email || "",
      };
    });

    return NextResponse.json({ team });
  } catch (error) {
    console.error("Team load failed", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unable to load team",
    }, { status: 500 });
  }
}
