import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

const normalizeSupabaseUrl = (url: string) =>
  url.replace(/\/(rest|auth)\/v1\/?$/, "").replace(/\/$/, "");

const getAdminClient = () => {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!rawUrl || !key) return null;
  return createClient(normalizeSupabaseUrl(rawUrl), key, { auth: { persistSession: false } });
};

const getAuthClient = () => {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!rawUrl || !key) return null;
  return createClient(normalizeSupabaseUrl(rawUrl), key, { auth: { persistSession: false } });
};

const authenticate = async (request: Request, supabase: SupabaseClient) => {
  const header = request.headers.get("authorization") || "";
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return { error: NextResponse.json({ error: "Missing bearer token" }, { status: 401 }) } as const;
  }
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return { error: NextResponse.json({ error: "Invalid session" }, { status: 401 }) } as const;
  }
  return { user: data.user } as const;
};

export async function GET(request: Request) {
  const admin = getAdminClient();
  const authClient = getAuthClient();
  if (!admin || !authClient) {
    return NextResponse.json({ error: "Supabase no está configurado" }, { status: 503 });
  }
  const auth = await authenticate(request, authClient);
  if ("error" in auth) return auth.error;
  try {
    const { data, error } = await admin.auth.admin.getUserById(auth.user.id);
    if (error) throw error;
    const profile = (data.user?.user_metadata as { tizaProfile?: Record<string, string> } | null | undefined)?.tizaProfile || {};
    return NextResponse.json({ ok: true, profile });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al leer perfil" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const admin = getAdminClient();
  const authClient = getAuthClient();
  if (!admin || !authClient) {
    return NextResponse.json({ error: "Supabase no está configurado" }, { status: 503 });
  }
  const auth = await authenticate(request, authClient);
  if ("error" in auth) return auth.error;

  let body: { profile?: Record<string, string> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }
  const profile = body.profile || {};
  if (typeof profile !== "object") {
    return NextResponse.json({ error: "Profile debe ser un objeto" }, { status: 400 });
  }

  try {
    const current = await admin.auth.admin.getUserById(auth.user.id);
    const existing = (current.data.user?.user_metadata as Record<string, unknown> | null | undefined) || {};
    const nextMeta = { ...existing, tizaProfile: profile };
    const { error } = await admin.auth.admin.updateUserById(auth.user.id, { user_metadata: nextMeta });
    if (error) throw error;
    return NextResponse.json({ ok: true, profile });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al guardar perfil" },
      { status: 500 },
    );
  }
}
