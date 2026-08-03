// Control de acceso por cargo (Colegio San Lucas).
//
// Toda la data de la app pasa por rutas de servidor que usan la llave de
// servicio de Supabase, así que el RLS no alcanza a filtrar: la autorización
// real se decide aquí y se aplica en el servidor antes de responder.
//
// Marco legal: Ley 19.628 y Ley 21.719 (los datos de salud y de menores son
// datos sensibles). El criterio es de mínimo privilegio: cada persona ve
// únicamente lo que su función exige.

export type AccessProfile =
  | "direccion"
  | "orientacion"
  | "psicosocial"
  | "pie"
  | "convivencia"
  | "salud"
  | "docente"
  | "administracion"
  | "sin-acceso";

export type EntityId =
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

export const ALL_ENTITIES: EntityId[] = [
  "students", "courses", "cases", "logs", "interviews",
  "protocols", "orientation", "workshops", "personnel", "documents", "meetings",
];

// Campos de la ficha del estudiante que sólo pueden ver los perfiles con
// necesidad clínica o de intervención. El resto los recibe vacíos.
export const SENSITIVE_STUDENT_FIELDS = [
  "relevantInfo", "supportNeeds", "healthAlerts", "notes",
  "observations", "genogram", "strengths", "tags",
];

// Datos de contacto de la familia: necesarios para gestión, innecesarios para
// quien sólo hace clases.
export const CONTACT_STUDENT_FIELDS = [
  "rut", "birthDate", "gender", "enrollmentNumber", "guardianRut", "guardianEmail",
  "livesWith", "motherName", "motherRut", "motherPhone",
  "fatherName", "fatherRut", "fatherPhone", "emergencyContact", "emergencyPhone",
  "phone", "email",
];

export type Permissions = {
  profile: AccessProfile;
  /** Entidades que puede leer. */
  read: EntityId[];
  /** Entidades que puede crear, editar o borrar. */
  write: EntityId[];
  /** Puede ver los campos sensibles de la ficha del estudiante. */
  sensitiveStudentData: boolean;
  /** Puede ver RUT, datos de apoderados y contactos de emergencia. */
  contactStudentData: boolean;
  /** Sabe que un estudiante tiene caso abierto, sin ver su contenido. */
  caseAwarenessOnly: boolean;
};

const FULL: EntityId[] = ALL_ENTITIES;

const PERMISSIONS: Record<Exclude<AccessProfile, "sin-acceso">, Omit<Permissions, "profile">> = {
  // Dirección y subdirecciones: responsabilidad institucional sobre todo.
  direccion: {
    read: FULL, write: FULL,
    sensitiveStudentData: true, contactStudentData: true, caseAwarenessOnly: false,
  },
  // Orientación: es su función articular convivencia, PIE y familia.
  orientacion: {
    read: FULL, write: FULL,
    sensitiveStudentData: true, contactStudentData: true, caseAwarenessOnly: false,
  },
  // Psicólogas y Trabajadora Social: intervención directa, cruzan ambas áreas.
  psicosocial: {
    read: FULL,
    write: ["students", "cases", "logs", "interviews", "protocols", "meetings", "documents"],
    sensitiveStudentData: true, contactStudentData: true, caseAwarenessOnly: false,
  },
  // PIE: lo clínico y pedagógico de sus estudiantes, no los casos de convivencia.
  pie: {
    read: ["students", "courses", "logs", "workshops", "personnel", "documents", "meetings"],
    write: ["students", "logs", "meetings", "documents"],
    sensitiveStudentData: true, contactStudentData: true, caseAwarenessOnly: false,
  },
  // Convivencia e Inspectoría: casos y protocolos, sin lo clínico.
  convivencia: {
    read: ["students", "courses", "cases", "logs", "protocols", "workshops", "personnel", "documents", "meetings"],
    write: ["cases", "logs", "protocols", "meetings", "documents"],
    sensitiveStudentData: false, contactStudentData: true, caseAwarenessOnly: false,
  },
  // Enfermería: necesita alertas de salud y contacto de emergencia, nada más.
  salud: {
    read: ["students", "courses", "personnel"],
    write: [],
    sensitiveStudentData: true, contactStudentData: true, caseAwarenessOnly: false,
  },
  // Docentes: su clase y su curso. Sin casos, entrevistas, protocolos ni PIE.
  docente: {
    read: ["students", "courses", "orientation", "workshops", "personnel", "documents"],
    write: ["orientation"],
    sensitiveStudentData: false, contactStudentData: false, caseAwarenessOnly: false,
  },
  // Administración y servicios: ningún dato de estudiantes.
  administracion: {
    read: ["personnel", "documents", "meetings"],
    write: [],
    sensitiveStudentData: false, contactStudentData: false, caseAwarenessOnly: false,
  },
};

const normalize = (value: string) =>
  String(value || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/**
 * Traduce el cargo escrito en la ficha del funcionario al perfil de acceso.
 * El orden importa: las reglas más específicas van primero (por ejemplo
 * "Subdirectora PIE" es dirección, no PIE).
 */
export const profileForRole = (roleText: string): AccessProfile => {
  const role = normalize(roleText);
  if (!role) return "sin-acceso";

  if (/\bdirector|subdirector/.test(role)) return "direccion";
  if (/orientador/.test(role)) return "orientacion";
  if (/trabajadora? social/.test(role)) return "psicosocial";
  // Psicólogas PIE trabajan en el equipo PIE; el resto es psicosocial.
  if (/psicolog/.test(role)) return /\bpie\b/.test(role) ? "pie" : "psicosocial";
  if (/fonoaudiolog|terapeuta ocupacional|diferencial|\bpie\b/.test(role)) return "pie";
  if (/convivencia|inspector/.test(role)) return "convivencia";
  if (/\btens\b|enfermer/.test(role)) return "salud";
  if (/profesor|educadora de parvulos|tecnico de aula|tecnico en parvulos|catequista|unidocente|volante/.test(role)) return "docente";
  if (/contador|contable|administracion|secretaria|recepcionista|cra|informatica|estafeta|fotocopias|portero|jardinero|mantencion|cocina|pastoral|coordinador/.test(role)) {
    // Coordinación de ciclo académico acompaña docentes, no interviene casos.
    return /coordinador/.test(role) ? "docente" : "administracion";
  }
  // Cargo desconocido: se deniega hasta que alguien de dirección lo clasifique.
  return "sin-acceso";
};

export const permissionsFor = (profile: AccessProfile): Permissions => {
  if (profile === "sin-acceso") {
    return {
      profile, read: [], write: [],
      sensitiveStudentData: false, contactStudentData: false, caseAwarenessOnly: false,
    };
  }
  return { profile, ...PERMISSIONS[profile] };
};

export const canRead = (permissions: Permissions, entity: EntityId) => permissions.read.includes(entity);
export const canWrite = (permissions: Permissions, entity: EntityId) => permissions.write.includes(entity);

/**
 * Quita de un registro los campos que el perfil no puede ver. Se aplica en el
 * servidor: el cliente nunca llega a recibir el dato.
 */
export const redactRecord = (
  entity: EntityId,
  data: Record<string, unknown>,
  permissions: Permissions,
): Record<string, unknown> => {
  if (entity !== "students") return data;
  const blocked = [
    ...(permissions.sensitiveStudentData ? [] : SENSITIVE_STUDENT_FIELDS),
    ...(permissions.contactStudentData ? [] : CONTACT_STUDENT_FIELDS),
  ];
  if (!blocked.length) return data;
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (blocked.includes(key)) continue;
    clean[key] = value;
  }
  return clean;
};

export const PROFILE_LABELS: Record<AccessProfile, string> = {
  direccion: "Dirección",
  orientacion: "Orientación",
  psicosocial: "Psicosocial",
  pie: "Equipo PIE",
  convivencia: "Convivencia e Inspectoría",
  salud: "Enfermería",
  docente: "Docente",
  administracion: "Administración",
  "sin-acceso": "Sin acceso",
};
