import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { PIE_PROFESSIONALS, PIE_ROSTER } from "@/lib/pie-roster";
import { accessErrorResponse, resolveAccess } from "@/lib/authz";

export const dynamic = "force-dynamic";

// La nómina PIE trae nombre, RUT, fecha de nacimiento y diagnóstico de 313
// menores. Vivía importada desde el componente de cliente, así que Next la
// empaquetaba en un chunk estático servido sin autenticación: cualquiera en
// internet podía descargarla. Ahora sólo existe en el servidor y se entrega
// exclusivamente a quien su cargo lo permite.
//
// Marco legal: Ley 21.719 — diagnóstico y necesidades de apoyo de un menor son
// datos sensibles.

const normalizeSupabaseUrl = (url: string) => url.replace(/\/(rest|auth)\/v1\/?$/, "").replace(/\/$/, "");

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

export async function GET(request: Request) {
  const admin = getAdminClient();
  const authClient = getAuthClient();
  if (!admin || !authClient) {
    return NextResponse.json({ error: "Supabase no está configurado" }, { status: 503 });
  }

  const header = request.headers.get("authorization") || "";
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return NextResponse.json({ error: "Missing bearer token" }, { status: 401 });
  }
  const { data: userData, error: userError } = await authClient.auth.getUser(token);
  if (userError || !userData.user) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  try {
    const { permissions } = await resolveAccess(admin, userData.user);
    // Diagnósticos: sólo quien puede ver datos sensibles del estudiante.
    if (!permissions.sensitiveStudentData || !permissions.read.includes("students")) {
      return NextResponse.json({ error: "Tu cargo no puede consultar la nómina PIE.", forbidden: true }, { status: 403 });
    }
    return NextResponse.json(
      { roster: PIE_ROSTER, professionals: PIE_PROFESSIONALS },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const denied = accessErrorResponse(error);
    if (denied) return denied;
    console.error("PIE roster load failed", error);
    return NextResponse.json({ error: "No se pudo cargar la nómina PIE" }, { status: 500 });
  }
}
