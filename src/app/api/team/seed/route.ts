import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const AUTHORIZED_SEED_EMAILS = new Set(["g.caro.m@colegiosanlucas.com"]);
const TEMPORARY_PASSWORD = "Tiza2026!";

const teamSeed = [
  ["Renata Aurrea", "Directora de Formación y Convivencia Escolar", "r.aurra@colegiosanlucas.com"],
  ["Karen Riquelme", "Coordinadora de Iº Ciclo", "k.riquelme@colegiosanlucas.com"],
  ["Andrea Acuña", "Coordinadora de II° Ciclo", "a.acuna@colegiosanlucas.com"],
  ["Rita Concha", "Coordinadora de III° Ciclo", "r.concha@colegiosanlucas.com"],
  ["Heimy Godoy", "Psicóloga", "h.godoy@colegiosanlucas.com"],
  ["Gustavo Caro", "Orientador I Ciclo", "g.caro.m@colegiosanlucas.com"],
  ["Cindy Pulido", "Orientadora de IIº Ciclo", "c.pulido@colegiosanlucas.com"],
  ["Marcela Toro", "Orientadora de III° Ciclo", "m.toro@colegiosanlucas.com"],
  ["Geraldine Berrios", "Trabajadora Social", "g.berrios@colegiosanlucas.com"],
  ["Manuel Useche", "Coordinador de Pastoral y Desarrollo Comunitario", "m.useche@colegiosanlucas.com"],
] as const;

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

const getToken = (request: Request) => {
  const header = request.headers.get("authorization") || "";
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
};

const getInstitutionId = async (supabase: SupabaseClient) => {
  const { data: institution, error: institutionError } = await supabase
    .from("institutions")
    .select("id")
    .eq("slug", "colegio-san-lucas")
    .maybeSingle();

  if (institutionError) throw institutionError;
  if (institution?.id) return institution.id as string;

  const { data: createdInstitution, error: createInstitutionError } = await supabase
    .from("institutions")
    .insert({ name: "Colegio San Lucas", slug: "colegio-san-lucas" })
    .select("id")
    .single();

  if (createInstitutionError) throw createInstitutionError;
  return createdInstitution.id as string;
};

export async function POST(request: Request) {
  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase service credentials are not configured" }, { status: 503 });
  }

  const token = getToken(request);
  if (!token) {
    return NextResponse.json({ error: "Missing bearer token" }, { status: 401 });
  }

  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  const requesterEmail = authData.user?.email?.toLowerCase() || "";
  if (authError || !authData.user || !AUTHORIZED_SEED_EMAILS.has(requesterEmail)) {
    return NextResponse.json({ error: "No autorizado para crear equipo institucional" }, { status: 403 });
  }

  try {
    const institutionId = await getInstitutionId(supabase);
    const { data: usersPage, error: usersError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (usersError) throw usersError;

    const usersByEmail = new Map(usersPage.users.map((user) => [user.email?.toLowerCase(), user]));
    const results: Array<{ email: string; name: string; role: string; action: "created" | "updated" }> = [];

    for (const [name, role, email] of teamSeed) {
      const normalizedEmail = email.toLowerCase();
      let user = usersByEmail.get(normalizedEmail);
      let action: "created" | "updated" = "updated";

      if (!user) {
        const { data: createdUser, error: createUserError } = await supabase.auth.admin.createUser({
          email: normalizedEmail,
          password: TEMPORARY_PASSWORD,
          email_confirm: true,
          user_metadata: { full_name: name, role },
        });

        if (createUserError) throw createUserError;
        user = createdUser.user;
        action = "created";
      } else {
        const { error: updateUserError } = await supabase.auth.admin.updateUserById(user.id, {
          email_confirm: true,
          user_metadata: { ...(user.user_metadata || {}), full_name: name, role },
        });

        if (updateUserError) throw updateUserError;
      }

      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        institution_id: institutionId,
        full_name: name,
        role,
      }, { onConflict: "id" });

      if (profileError) throw profileError;
      results.push({ email: normalizedEmail, name, role, action });
    }

    return NextResponse.json({
      ok: true,
      temporaryPassword: TEMPORARY_PASSWORD,
      results,
    });
  } catch (error) {
    console.error("Team seed failed", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unable to seed team",
    }, { status: 500 });
  }
}
