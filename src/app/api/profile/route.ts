import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

const MAX_PROFILE_REQUEST_BYTES = 2 * 1024 * 1024;
const CONFIGURATION_KEYS = new Set([
  "orientationActions",
  "orientationSchedule",
  "courseSchedule",
  "staffSchedule",
]);

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

const requestTooLarge = (request: Request) => {
  const contentLength = Number(request.headers.get("content-length") || 0);
  return Number.isFinite(contentLength) && contentLength > MAX_PROFILE_REQUEST_BYTES;
};

const readProfileJson = async (request: Request) => {
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_PROFILE_REQUEST_BYTES) {
    throw new Error("PAYLOAD_TOO_LARGE");
  }
  return JSON.parse(text) as Record<string, unknown>;
};

const parseConfiguration = (value: unknown): Record<string, unknown> => {
  if (typeof value !== "string" || !value.trim()) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
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

  if (requestTooLarge(request)) {
    return NextResponse.json({ error: "La configuración supera el límite seguro de 2 MB" }, { status: 413 });
  }

  let body: { profile?: Record<string, string> };
  try {
    body = await readProfileJson(request) as { profile?: Record<string, string> };
  } catch (error) {
    if (error instanceof Error && error.message === "PAYLOAD_TOO_LARGE") {
      return NextResponse.json({ error: "La configuración supera el límite seguro de 2 MB" }, { status: 413 });
    }
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

export async function PATCH(request: Request) {
  const admin = getAdminClient();
  const authClient = getAuthClient();
  if (!admin || !authClient) {
    return NextResponse.json({ error: "Supabase no está configurado" }, { status: 503 });
  }
  const auth = await authenticate(request, authClient);
  if ("error" in auth) return auth.error;
  if (requestTooLarge(request)) {
    return NextResponse.json({ error: "La configuración supera el límite seguro de 2 MB" }, { status: 413 });
  }

  let body: {
    changes?: Record<string, unknown>;
    configurationChanges?: Record<string, unknown>;
  };
  try {
    body = await readProfileJson(request);
  } catch (error) {
    if (error instanceof Error && error.message === "PAYLOAD_TOO_LARGE") {
      return NextResponse.json({ error: "La configuración supera el límite seguro de 2 MB" }, { status: 413 });
    }
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const rawChanges = body.changes && typeof body.changes === "object" ? body.changes : {};
  const changes = Object.fromEntries(
    Object.entries(rawChanges)
      .filter(([key, value]) => key !== "appConfiguration" && typeof value === "string" && key.length <= 80)
      .map(([key, value]) => [key, String(value).slice(0, 20_000)]),
  );
  const configurationChanges = Object.fromEntries(
    Object.entries(body.configurationChanges || {})
      .filter(([key]) => CONFIGURATION_KEYS.has(key)),
  );
  if (Object.keys(changes).length === 0 && Object.keys(configurationChanges).length === 0) {
    return NextResponse.json({ error: "No hay cambios válidos para guardar" }, { status: 400 });
  }

  try {
    const current = await admin.auth.admin.getUserById(auth.user.id);
    if (current.error) throw current.error;
    const existing = (current.data.user?.user_metadata as Record<string, unknown> | null | undefined) || {};
    const existingProfile = existing.tizaProfile && typeof existing.tizaProfile === "object"
      ? existing.tizaProfile as Record<string, unknown>
      : {};
    const currentConfiguration = parseConfiguration(existingProfile.appConfiguration);
    const nextProfile = {
      ...existingProfile,
      ...changes,
      ...(Object.keys(configurationChanges).length
        ? { appConfiguration: JSON.stringify({ ...currentConfiguration, ...configurationChanges }) }
        : {}),
    };
    const { error } = await admin.auth.admin.updateUserById(auth.user.id, {
      user_metadata: { ...existing, tizaProfile: nextProfile },
    });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al guardar perfil" },
      { status: 500 },
    );
  }
}
