// Puerta de autorización compartida por las rutas de servidor.
//
// Todas usan la llave de servicio de Supabase, que ignora el RLS, así que la
// autorización real ocurre aquí. Una sola implementación para que ninguna ruta
// quede con un criterio distinto.

import { NextResponse } from "next/server";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { type Permissions, permissionsFor, profileForRole } from "./access-control";

export class AccessDenied extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AccessDenied";
  }
}

export type Access = {
  institutionId: string;
  permissions: Permissions;
  fullName: string;
};

/**
 * Resuelve institución y permisos del usuario autenticado.
 *
 * Sólo entra quien ya tiene perfil o quien figura en la nómina oficial de
 * funcionarios; su cargo define lo que puede ver. Cualquier otro caso se
 * deniega: antes bastaba con autenticarse para quedar inscrito con acceso
 * completo al colegio.
 */
export const resolveAccess = async (supabase: SupabaseClient, user: User): Promise<Access> => {
  const { data: institution, error: institutionError } = await supabase
    .from("institutions")
    .select("id")
    .eq("slug", "colegio-san-lucas")
    .maybeSingle();
  if (institutionError) throw institutionError;
  const institutionId = institution?.id as string | undefined;
  if (!institutionId) throw new AccessDenied("La institución no está configurada.");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("institution_id, role, full_name")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError) throw profileError;

  if (profile?.institution_id) {
    const permissions = permissionsFor(profileForRole(String(profile.role || "")));
    if (permissions.profile === "sin-acceso") {
      throw new AccessDenied("Tu cargo todavía no tiene permisos asignados en Tiza. Solicítalo a Dirección.");
    }
    return {
      institutionId: profile.institution_id as string,
      permissions,
      fullName: String(profile.full_name || ""),
    };
  }

  // Sin perfil: sólo se acepta si el correo está en la nómina de funcionarios.
  const email = (user.email || "").trim().toLowerCase();
  if (!email) throw new AccessDenied("Tu cuenta no está autorizada en el colegio.");

  const { data: staffRows, error: staffError } = await supabase
    .from("app_records")
    .select("data")
    .eq("institution_id", institutionId)
    .eq("entity", "personnel");
  if (staffError) throw staffError;

  const match = ((staffRows || []) as Array<{ data: Record<string, unknown> }>).find(
    (row) => String(row.data?.email || "").trim().toLowerCase() === email,
  );
  if (!match) throw new AccessDenied("Tu cuenta no está en la nómina de funcionarios del colegio.");

  const permissions = permissionsFor(profileForRole(String(match.data?.role || "")));
  if (permissions.profile === "sin-acceso") {
    throw new AccessDenied("Tu cargo todavía no tiene permisos asignados en Tiza. Solicítalo a Dirección.");
  }

  const fullName = String(match.data?.name || match.data?.fullName || user.email || "");
  const { error: upsertProfileError } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      institution_id: institutionId,
      full_name: fullName,
      role: String(match.data?.role || ""),
    }, { onConflict: "id" });
  if (upsertProfileError) throw upsertProfileError;

  return { institutionId, permissions, fullName };
};

/** Traduce el fallo de autorización en la respuesta HTTP adecuada. */
export const accessErrorResponse = (error: unknown) =>
  error instanceof AccessDenied
    ? NextResponse.json({ error: error.message, forbidden: true }, { status: 403 })
    : null;
