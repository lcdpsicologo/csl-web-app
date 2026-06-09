import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const AUTHORIZED_SEED_EMAILS = new Set(["g.caro.m@colegiosanlucas.com"]);
const TEMPORARY_PASSWORD = "Tiza2026!";

// Email pattern: firstInitial.firstLastName@colegiosanlucas.com
// Accents and special characters are stripped from the surname.
const stripAccents = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/gi, "n");
const emailFor = (fullName: string, override?: string): string => {
  if (override) return override.toLowerCase();
  const tokens = fullName.trim().split(/\s+/);
  if (tokens.length === 0) return "";
  const first = stripAccents(tokens[0]).toLowerCase();
  // Pick the first real surname after the given name(s). Compound first names
  // like "María José" or "Juan Esteban" share the same first initial, so the
  // surname is whatever comes after them.
  const compoundFirst = new Set(["maria", "jose", "juan", "ana", "luis", "francisco", "felipe", "marcelo", "esteban", "renata", "catalina"]);
  let surnameIdx = 1;
  while (surnameIdx < tokens.length && compoundFirst.has(stripAccents(tokens[surnameIdx]).toLowerCase())) surnameIdx += 1;
  const surname = stripAccents(tokens[surnameIdx] || tokens[1] || tokens[0])
    .toLowerCase()
    .replace(/[^a-z]/g, "");
  return `${first[0]}.${surname}@colegiosanlucas.com`;
};

type SeedRow = readonly [string, string, string?];

const RAW_TEAM: SeedRow[] = [
  // Dirección
  ["María Olga Lagos", "Directora Colegio San Lucas"],
  ["Jennifer Guzmán", "Directora Académica"],
  ["María Renata Aurra", "Directora de Formación y Convivencia Escolar", "r.aurra@colegiosanlucas.com"],
  // Subdirecciones
  ["Valeska Villasmil", "Subdirectora 1º Ciclo"],
  ["Valeria Ibañez", "Subdirectora 2º Ciclo"],
  ["Madelaine Martínez", "Subdirectora 3º Ciclo"],
  ["Daniela Barra", "Subdirectora PIE"],
  // Inspección
  ["Alejandra Ñancucheo", "Inspectora de I° Ciclo"],
  ["Loreto Carter", "Inspectora de II° Ciclo"],
  ["Gabriela Diaz", "Inspectora de III° Ciclo"],
  ["Carla Yurguevic", "Inspectora de Educación Parvularia"],
  ["Celeste Acevedo", "Inspectora de Apoyo I Ciclo"],
  ["Kharen Cerda", "Inspectora de Apoyo II° y III° Ciclo"],
  // Administración
  ["Viviana Concha", "Administración"],
  ["Raul Farias", "Contador"],
  ["Yesenia Vera", "Asistente Contable"],
  ["Karina Carter", "Secretaria Gestión Escolar"],
  ["Diana Madrid", "Secretaria Administrativa y Recepcionista"],
  // Servicios generales
  ["Daniela Vega", "Encargada del CRA"],
  ["Nicolás Pérez", "Encargado de Informática"],
  ["Yaritza Carrasco", "Estafeta y Encargada de Fotocopias"],
  ["Eduardo Loyola", "TENS"],
  // Convivencia / Orientación
  ["Karen Riquelme", "Coordinadora de I° Ciclo Convivencia", "k.riquelme@colegiosanlucas.com"],
  ["Andrea Acuña", "Coordinadora de II° Ciclo Convivencia", "a.acuna@colegiosanlucas.com"],
  ["Rita Concha", "Coordinadora de III° Ciclo Convivencia", "r.concha@colegiosanlucas.com"],
  ["Heimy Godoy", "Psicóloga", "h.godoy@colegiosanlucas.com"],
  ["Alejandra Muñoz", "Coordinadora de Convivencia Escolar"],
  ["Gustavo Caro", "Orientador I Ciclo", "g.caro.m@colegiosanlucas.com"],
  ["Cindy Pulido", "Orientadora de II° Ciclo", "c.pulido@colegiosanlucas.com"],
  ["Marcela Toro", "Orientadora de III° Ciclo", "m.toro@colegiosanlucas.com"],
  ["Geraldine Berrios", "Trabajadora Social", "g.berrios@colegiosanlucas.com"],
  // Pastoral
  ["Manuel Useche", "Coordinador de Pastoral y Desarrollo Comunitario", "m.useche@colegiosanlucas.com"],
  // PIE – Profesionales
  ["Fabiana Acevedo", "Psicóloga PIE"],
  ["Juan Esteban Carrasco", "Psicólogo PIE"],
  ["Tihare Amaya", "Terapeuta Ocupacional PIE"],
  ["Arlette Espina", "Terapeuta Ocupacional PIE"],
  ["Valeria Andrades", "Fonoaudióloga PIE"],
  ["Yocelyn Pérez", "Fonoaudióloga PIE"],
  ["Margarita Alvarado", "Fonoaudióloga PIE"],
  // PIE – Profesoras/es diferenciales
  ["Debbie Lara", "Profesora Diferencial"],
  ["María Soledad Salinas", "Profesora Diferencial"],
  ["Andrea Linco", "Profesora Diferencial"],
  ["Natalia Miranda", "Profesora Diferencial"],
  ["Diego Lagos", "Profesor Diferencial"],
  ["Anais López", "Profesora Diferencial"],
  ["Elena Galarce", "Profesora Diferencial"],
  ["Danae Bulicic", "Profesora Diferencial"],
  ["Daniela Villagra", "Profesora Diferencial"],
  ["Kaira Ruz", "Profesora Diferencial"],
  ["Andrea Galvez", "Profesora Diferencial"],
  ["María José Solari", "Profesora Diferencial"],
  ["Daniela Pérez", "Profesora Diferencial"],
  ["Yanel Parra", "Profesora Diferencial"],
  ["Nicolle Salinas", "Profesora Diferencial"],
  ["Carolina Linco", "Profesora Diferencial"],
  ["Milton Osses", "Profesor Diferencial"],
  ["Ana Zamora", "Profesora Diferencial"],
  ["Daniela Carrillo", "Profesora Diferencial"],
  ["Michael Vera", "Profesor Diferencial"],
  // Primer Ciclo
  ["Alejandra Delgado", "Educadora de Párvulos"],
  ["Ana Huerta", "Educadora de Párvulos"],
  ["Ivonne Espinoza", "Educadora de Párvulos"],
  ["Paulina Rojas", "Educadora de Párvulos"],
  ["Josefa Trujillo", "Educadora de Párvulos"],
  ["Paulina Aguilera", "Profesora Unidocente"],
  ["Pamela Mery", "Técnico de Aula"],
  ["Daniela Guajardo", "Técnico de Aula"],
  ["Estrella Pérez", "Técnico de Aula"],
  ["Yaritza Arraño", "Técnico de Aula"],
  ["Alicia Mella", "Técnico de Aula"],
  ["Nicole Peredo", "Técnico de Aula"],
  ["Claudia Silva", "Técnico de Aula"],
  ["Denisse Lara", "Técnico en Párvulos"],
  ["Jhom Vega", "Profesor de Religión"],
  ["Matías Sánchez", "Profesor de Arte"],
  ["Francisco Cerón", "Profesor de Música"],
  ["Christian Vega", "Profesor de Inglés"],
  // Segundo Ciclo
  ["Camila González", "Profesora Unidocente"],
  ["Nicole Vásquez", "Profesora Unidocente"],
  ["André Vidal", "Profesor Unidocente"],
  ["Viviana Hernández", "Profesora Unidocente"],
  ["Carol Reyes", "Profesora Unidocente"],
  ["Geraldine Parra", "Profesora Unidocente"],
  ["Jaqueline Morales", "Profesora Unidocente"],
  ["Karianny Gómez", "Profesora Unidocente"],
  ["Ilona Leal", "Profesora Unidocente"],
  ["María Catalina Jiménez", "Profesora Volante"],
  ["Matías Coleman", "Profesor Volante"],
  ["Cristina Lazo", "Profesora de Matemática"],
  ["Luís Escanilla", "Profesor de Matemática"],
  ["Giovanna Muñoz", "Profesora de Inglés"],
  ["Evelyn Meza", "Profesora de Lenguaje"],
  ["Nicolás Escobar", "Profesor de Lenguaje"],
  ["Marcelo Vásquez", "Profesor de Religión y Filosofía"],
  ["Pía Velastín", "Profesora de Ciencias"],
  ["José Marcelo Gutiérrez", "Profesor de Educación Física"],
  ["Constanza Añiñir", "Profesora de Historia"],
  ["Héctor Acuña", "Profesor de Historia"],
  ["Camila Aguilera", "Profesora de Arte"],
  ["Mauricio Iturriaga", "Profesor de Música"],
  ["Cristyn Venegas", "Profesora Volante"],
  ["Elizabeth Riquelme", "Profesora de Inglés"],
  ["Pablo Moraga", "Profesor de Educación Física"],
  ["José Sepúlveda", "Profesor de Educación Física"],
  ["Isabel Fuenzalida", "Técnico de Aula"],
  ["Ingrid Quezada", "Técnico de Aula"],
  ["Regina Palma", "Técnico de Aula"],
  // Tercer Ciclo
  ["Álvaro Astudillo", "Profesor de Matemática"],
  ["Joshua Jara", "Profesor de Matemática"],
  ["Diego Céspedes", "Profesor de Matemática y Física"],
  ["Manuel Pinto", "Profesor de Lenguaje"],
  ["Cristopher Díaz", "Profesor de Lenguaje"],
  ["Felipe Rojas Carrasco", "Profesor de Educación Física"],
  ["Sofía Ramos", "Profesora de Química"],
  ["Carla Miranda", "Profesora de Inglés"],
  ["Cindy Gulppi", "Profesora de Historia"],
  ["Carlos Toro", "Jefe de Especialidad TP"],
  ["Nelson Quevedo", "Profesor TP"],
];

const teamSeed = RAW_TEAM.map(([name, role, override]) => [name, role, emailFor(name, override)] as const);

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
  const authClient = getAuthClient();
  if (!supabase || !authClient) {
    return NextResponse.json({ error: "Supabase service credentials are not configured" }, { status: 503 });
  }

  const token = getToken(request);
  if (!token) {
    return NextResponse.json({ error: "Missing bearer token" }, { status: 401 });
  }

  const { data: authData, error: authError } = await authClient.auth.getUser(token);
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
