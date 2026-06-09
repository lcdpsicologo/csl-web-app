"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { createClient, type User } from "@supabase/supabase-js";
import {
  ArrowDownToLine,
  BarChart3,
  BookOpen,
  Building2,
  AlertTriangle,
  Bell,
  CalendarDays,
  Camera,
  Copy,
  MapPin,
  PieChart,
  Printer,
  Sparkles,
  Tag,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Database,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  GraduationCap,
  Home,
  Lock,
  LogOut,
  Mail,
  MessageSquareText,
  Plus,
  Save,
  Search,
  Settings,
  ShieldCheck,
  Trash2,
  Upload,
  UserRound,
  UsersRound,
  Wand2,
  X,
  type LucideIcon,
} from "lucide-react";

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

type ViewId = "dashboard" | "today" | "triage" | "reports" | "import" | "team" | "settings" | EntityId;

type DataRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: string;
};

type DataStore = Record<EntityId, DataRecord[]>;

type TeamMember = {
  id: string;
  name: string;
  role: string;
  email: string;
};

type CourseDef = {
  name: string;
  cycle: "I Ciclo" | "II Ciclo" | "III Ciclo";
  orientationOwner: string;
  orientationEmail: string;
  convivenciaCoordinator: string;
  convivenciaEmail: string;
  capacity: number;
};

type ClassroomTeamMember = {
  id: string;
  name: string;
  role: string;
  email: string;
  notes: string;
};

type GenogramMember = {
  id: string;
  name: string;
  relation: string;
  role: string;
  age: string;
  phone?: string;
  email?: string;
  address?: string;
  notes: string;
};

type FieldDef = {
  key: string;
  label: string;
  required?: boolean;
  type?: "date" | "textarea" | "select";
  options?: string[];
  aliases: string[];
};

type EntityConfig = {
  id: EntityId;
  label: string;
  singular: string;
  icon: LucideIcon;
  description: string;
  fields: FieldDef[];
};

type ParsedSheet = {
  fileName: string;
  headers: string[];
  rows: Record<string, string>[];
  delimiter: string;
};

type ImportPlan = {
  entity: EntityId;
  confidence: number;
  mapping: Record<string, string>;
  notes: string[];
};

const STORAGE_KEY = "tiza-education-store-v1";
const PROFILE_KEY = "tiza-education-profile-v1";
const SUPABASE_PUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_PUBLIC_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const isSupabaseAuthConfigured = Boolean(SUPABASE_PUBLIC_URL && SUPABASE_PUBLIC_ANON_KEY);
const supabaseAuth = isSupabaseAuthConfigured
  ? createClient(SUPABASE_PUBLIC_URL, SUPABASE_PUBLIC_ANON_KEY)
  : null;

const nowIso = () => new Date().toISOString();
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const initialsOf = (name: string) =>
  (name || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase();

const avatarTone = (seed: string) => {
  const palette = [
    "from-sky-500 to-blue-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-violet-500 to-purple-600",
    "from-rose-500 to-pink-600",
    "from-cyan-500 to-blue-500",
    "from-lime-500 to-emerald-600",
    "from-fuchsia-500 to-purple-600",
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return palette[hash % palette.length];
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const makeCourseRecord = (course: CourseDef): DataRecord => ({
  id: `course-${normalize(course.name).replace(/\s+/g, "-")}`,
  createdAt: nowIso(),
  updatedAt: nowIso(),
  name: course.name,
  cycle: course.cycle,
  orientationOwner: course.orientationOwner,
  orientationEmail: course.orientationEmail,
  convivenciaCoordinator: course.convivenciaCoordinator,
  convivenciaEmail: course.convivenciaEmail,
  capacity: String(course.capacity),
  headTeacher: "",
  classroomTeam: "[]",
  notes: "",
});

const basicLevels = ["1° Básico", "2° Básico", "3° Básico", "4° Básico", "5° Básico", "6° Básico", "7° Básico", "8° Básico"];
const highSchoolLevels = ["I° Medio", "II° Medio", "III° Medio", "IV° Medio"];

const convivenciaByCycle = {
  "I Ciclo": { name: "Karen Riquelme", email: "k.riquelme@colegiosanlucas.com" },
  "II Ciclo": { name: "Andrea Acuña", email: "a.acuna@colegiosanlucas.com" },
  "III Ciclo": { name: "Rita Concha", email: "r.concha@colegiosanlucas.com" },
} satisfies Record<CourseDef["cycle"], { name: string; email: string }>;

const officialCourses: CourseDef[] = [
  ...["A", "B", "C"].map((section) => ({
    name: `Prekínder ${section}`,
    cycle: "I Ciclo" as const,
    orientationOwner: "Gustavo Caro",
    orientationEmail: "g.caro.m@colegiosanlucas.com",
    convivenciaCoordinator: convivenciaByCycle["I Ciclo"].name,
    convivenciaEmail: convivenciaByCycle["I Ciclo"].email,
    capacity: 32,
  })),
  ...["A", "B", "C"].map((section) => ({
    name: `Kínder ${section}`,
    cycle: "I Ciclo" as const,
    orientationOwner: "Gustavo Caro",
    orientationEmail: "g.caro.m@colegiosanlucas.com",
    convivenciaCoordinator: convivenciaByCycle["I Ciclo"].name,
    convivenciaEmail: convivenciaByCycle["I Ciclo"].email,
    capacity: 32,
  })),
  ...basicLevels.flatMap((level, index) =>
    ["A", "B"].map((section) => ({
      name: `${level} ${section}`,
      cycle: index < 4 ? "I Ciclo" as const : "II Ciclo" as const,
      orientationOwner: index < 4 ? "Gustavo Caro" : "Cindy Pulido",
      orientationEmail: index < 4 ? "g.caro.m@colegiosanlucas.com" : "c.pulido@colegiosanlucas.com",
      convivenciaCoordinator: index < 4 ? convivenciaByCycle["I Ciclo"].name : convivenciaByCycle["II Ciclo"].name,
      convivenciaEmail: index < 4 ? convivenciaByCycle["I Ciclo"].email : convivenciaByCycle["II Ciclo"].email,
      capacity: 36,
    }))
  ),
  ...highSchoolLevels.flatMap((level) =>
    ["A", "B"].map((section) => ({
      name: `${level} ${section}`,
      cycle: "III Ciclo" as const,
      orientationOwner: "Marcela Toro",
      orientationEmail: "m.toro@colegiosanlucas.com",
      convivenciaCoordinator: convivenciaByCycle["III Ciclo"].name,
      convivenciaEmail: convivenciaByCycle["III Ciclo"].email,
      capacity: 36,
    }))
  ),
];

const orientationOwners = [
  {
    name: "Gustavo Caro",
    role: "Orientador I Ciclo",
    email: "g.caro.m@colegiosanlucas.com",
    cycle: "I Ciclo",
    convivenciaCoordinator: convivenciaByCycle["I Ciclo"].name,
    convivenciaEmail: convivenciaByCycle["I Ciclo"].email,
    courses: officialCourses.filter((course) => course.orientationOwner === "Gustavo Caro").map((course) => course.name),
  },
  {
    name: "Cindy Pulido",
    role: "Orientadora de IIº Ciclo",
    email: "c.pulido@colegiosanlucas.com",
    cycle: "II Ciclo",
    convivenciaCoordinator: convivenciaByCycle["II Ciclo"].name,
    convivenciaEmail: convivenciaByCycle["II Ciclo"].email,
    courses: officialCourses.filter((course) => course.orientationOwner === "Cindy Pulido").map((course) => course.name),
  },
  {
    name: "Marcela Toro",
    role: "Orientadora de III° Ciclo",
    email: "m.toro@colegiosanlucas.com",
    cycle: "III Ciclo",
    convivenciaCoordinator: convivenciaByCycle["III Ciclo"].name,
    convivenciaEmail: convivenciaByCycle["III Ciclo"].email,
    courses: officialCourses.filter((course) => course.orientationOwner === "Marcela Toro").map((course) => course.name),
  },
];

const buildDataContext = (store: DataStore): string => {
  const lines: string[] = [];
  lines.push(`Total estudiantes: ${store.students.length}`);
  lines.push(`Cursos guardados: ${store.courses.length}`);

  // Casos
  const casesTotal = store.cases.length;
  const open = store.cases.filter((c) => /abierto|seguimiento|activ/i.test(c.status || "")).length;
  const closed = store.cases.filter((c) => /cerrad/i.test(c.status || "")).length;
  const critical = store.cases.filter((c) => /critic|alta/i.test(c.priority || "")).length;
  lines.push(`Casos: ${casesTotal} (abiertos/seguimiento: ${open}, cerrados: ${closed}, alta/crítica: ${critical})`);

  const byCategory = new Map<string, number>();
  store.cases.forEach((c) => {
    const k = c.category || "Sin categoría";
    byCategory.set(k, (byCategory.get(k) || 0) + 1);
  });
  const catLine = Array.from(byCategory.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => `${k}: ${v}`).join(", ");
  if (catLine) lines.push(`  Por categoría: ${catLine}`);

  const recentCases = [...store.cases].sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || "")).slice(0, 20);
  if (recentCases.length > 0) {
    lines.push(`\nÚLTIMOS ${recentCases.length} CASOS (más recientes primero):`);
    recentCases.forEach((c) => {
      const intCount = (() => { try { return Array.isArray(JSON.parse(c.interventions || "[]")) ? JSON.parse(c.interventions || "[]").length : 0; } catch { return 0; } })();
      lines.push(`- [${c.status || "?"}] ${c.title || "Sin título"} · ${c.student || ""} (${c.course || "?"}) · prioridad ${c.priority || "?"} · ${intCount} intervenciones`);
    });
  }

  // Entrevistas
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = store.interviews.filter((r) => (r.date || "") >= today);
  lines.push(`\nEntrevistas totales: ${store.interviews.length} (próximas/hoy: ${upcoming.length})`);
  upcoming.slice(0, 10).forEach((r) => {
    lines.push(`- ${r.date} · ${r.participant || "?"} con ${r.student || "?"} · ${r.reason || ""}`);
  });

  // Bitácoras
  lines.push(`\nBitácoras totales: ${store.logs.length}`);
  const recentLogs = [...store.logs].sort((a, b) => (b.date || "").localeCompare(a.date || "")).slice(0, 10);
  recentLogs.forEach((l) => {
    lines.push(`- ${l.date || "?"} · ${l.type || "?"} · ${l.student || "?"} · ${(l.description || "").slice(0, 100)}`);
  });

  // Protocolos
  const dueSoon = store.protocols.filter((p) => p.dueDate && p.dueDate >= today && p.dueDate <= new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10) && !/cerrad/i.test(p.status || ""));
  lines.push(`\nProtocolos: ${store.protocols.length} (a vencer en 14 días: ${dueSoon.length})`);
  dueSoon.slice(0, 10).forEach((p) => {
    lines.push(`- ${p.dueDate} · ${p.title} · ${p.student || ""} · ${p.status || ""}`);
  });

  // Orientación
  lines.push(`\nClases de orientación: ${store.orientation.length}`);
  const ownerCounts = new Map<string, number>();
  store.orientation.forEach((o) => {
    const k = o.orientationOwner || "Sin orientador";
    ownerCounts.set(k, (ownerCounts.get(k) || 0) + 1);
  });
  Array.from(ownerCounts.entries()).forEach(([k, v]) => lines.push(`  ${k}: ${v} clases`));

  // Talleres
  lines.push(`\nTalleres totales: ${store.workshops.length}`);
  // Documentos
  lines.push(`Documentos totales: ${store.documents.length}`);

  // Alertas de salud
  const healthAlerts = store.students.filter((s) => (s.healthAlerts || "").trim());
  lines.push(`\nEstudiantes con alerta de salud: ${healthAlerts.length}`);
  healthAlerts.slice(0, 15).forEach((s) => {
    lines.push(`- ${s.fullName} (${s.course}): ${(s.healthAlerts || "").slice(0, 100)}`);
  });

  return lines.join("\n");
};

const courseMatches = (record: DataRecord, courseName: string) =>
  Object.values(record).some((value) => normalize(String(value)) === normalize(courseName) || normalize(String(value)).includes(normalize(courseName)));

const studentMatches = (record: DataRecord, student: DataRecord) => {
  const studentName = normalize(student.fullName || "");
  const studentRut = normalize(student.rut || "");
  const values = Object.values(record).map((value) => normalize(String(value)));
  return values.some((value) => Boolean(studentName && value.includes(studentName)) || Boolean(studentRut && value.includes(studentRut)));
};

const parseSeatAssignments = (value: string | undefined): string[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map((item) => String(item || "")) : [];
  } catch {
    return [];
  }
};

const classroomRoles = [
  "Profesor/a jefe",
  "Profesor/a de asignatura",
  "Asistente de aula",
  "Educadora diferencial",
  "Educadora de párvulos",
  "Técnico en párvulos",
  "Inspector/a",
  "Psicóloga",
  "Trabajadora social",
  "Coordinadora de convivencia",
  "Orientador/a",
  "Otro apoyo",
];

const parseClassroomTeam = (value: string | undefined): ClassroomTeamMember[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((member) => member && typeof member.name === "string" && typeof member.role === "string");
  } catch {
    return [];
  }
};

type CaseIntervention = {
  id: string;
  date: string;
  action: string;
  by: string;
  outcome: string;
};

// Detects whether a calendar event title corresponds to an orientation class
// ("Acompañamiento orientación", "Clase de orientación", or any "orientación"
// mention paired with a course identifier), and returns a normalized display
// title plus the matched course.
const matchOrientationEvent = (summary: string): { isOrientation: boolean; course: string; displayTitle: string } => {
  const text = summary || "";
  const normalized = normalize(text);
  const isOrientation = /orientacion/.test(normalized);
  if (!isOrientation) return { isOrientation: false, course: "", displayTitle: text };
  // Try to match a known official course by name (longest first to win specificity).
  const officialByLength = [...officialCourses].sort((a, b) => b.name.length - a.name.length);
  let course = "";
  for (const c of officialByLength) {
    const normCourse = normalize(c.name);
    if (normCourse && normalized.includes(normCourse)) {
      course = c.name;
      break;
    }
  }
  // Fallback: a token after a +, -, or : that looks like a grade ("4°A", "II° Medio B").
  if (!course) {
    const m = text.match(/[+\-:|]\s*([A-Za-zÁÉÍÓÚáéíóúÑñ0-9°º\s]{1,30})$/);
    if (m) course = m[1].trim();
  }
  const displayTitle = course
    ? `Clase de orientación · ${course}`
    : text.replace(/acompañamiento\s+orientación/i, "Clase de orientación").trim();
  return { isOrientation: true, course, displayTitle };
};

const parseInterventions = (value: string | undefined): CaseIntervention[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((i) => i && typeof i.action === "string")
      .map((i) => ({
        id: i.id || uid(),
        date: i.date || "",
        action: i.action || "",
        by: i.by || "",
        outcome: i.outcome || "",
      }));
  } catch {
    return [];
  }
};

const parseGenogram = (value: string | undefined): GenogramMember[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((member) => member && typeof member.name === "string" && typeof member.relation === "string")
      .map((member) => ({
        id: member.id || uid(),
        name: member.name || "",
        relation: member.relation || "Otro familiar",
        role: member.role || "Red significativa",
        age: member.age || "",
        phone: member.phone || "",
        email: member.email || "",
        address: member.address || "",
        notes: member.notes || "",
      }));
  } catch {
    return [];
  }
};

const genogramRelations = [
  "Madre",
  "Padre",
  "Cuidador/a principal",
  "Apoderado/a",
  "Hermano/a",
  "Abuelo/a",
  "Tío/a",
  "Tutor/a legal",
  "Otro familiar",
  "Red de apoyo",
];

const genogramRoles = [
  "Vive con el estudiante",
  "No vive con el estudiante",
  "Contacto principal",
  "Contacto secundario",
  "Restricción de contacto",
  "Fallecido/a",
  "Red significativa",
];

const entityConfigs: Record<EntityId, EntityConfig> = {
  students: {
    id: "students",
    label: "Estudiantes",
    singular: "estudiante",
    icon: UserRound,
    description: "Ficha base de estudiantes. Desde aquí nacen casos, bitácoras, entrevistas y alertas.",
    fields: [
      { key: "fullName", label: "Nombre completo", required: true, aliases: ["nombre", "estudiante", "alumno", "nombre completo", "full name"] },
      { key: "course", label: "Curso", required: true, aliases: ["curso", "grado", "nivel", "class", "course"] },
      { key: "rut", label: "RUT / ID", aliases: ["rut", "run", "id", "identificador", "matricula"] },
      { key: "guardian", label: "Apoderado/a", aliases: ["apoderado", "apoderada", "tutor", "guardian", "madre", "padre"] },
      { key: "phone", label: "Teléfono", aliases: ["telefono", "celular", "fono", "phone"] },
      { key: "email", label: "Correo", aliases: ["correo", "email", "mail"] },
      { key: "relevantInfo", label: "Informacion relevante", type: "textarea", aliases: ["informacion relevante", "antecedentes relevantes", "contexto"] },
      { key: "strengths", label: "Fortalezas", type: "textarea", aliases: ["fortalezas", "recursos", "habilidades"] },
      { key: "supportNeeds", label: "Necesidades de apoyo", type: "textarea", aliases: ["necesidades", "apoyos", "dificultades"] },
      { key: "healthAlerts", label: "Alertas de salud/cuidados", type: "textarea", aliases: ["salud", "alertas", "cuidados"] },
      { key: "notes", label: "Dirección / Domicilio", type: "textarea", aliases: ["direccion", "domicilio", "dirección", "address", "vive", "vivienda"] },
      { key: "observations", label: "Observaciones generales", type: "textarea", aliases: ["observaciones", "notas", "comentarios", "antecedentes", "obs"] },
      { key: "tags", label: "Etiquetas", aliases: ["etiquetas", "tags", "labels"] },
      { key: "genogram", label: "Genograma", type: "textarea", aliases: ["genograma", "familia", "grupo familiar"] },
    ],
  },
  courses: {
    id: "courses",
    label: "Cursos",
    singular: "curso",
    icon: BookOpen,
    description: "Cursos o grupos de la institución. Útiles para reportes y planificación grupal.",
    fields: [
      { key: "name", label: "Curso", required: true, aliases: ["curso", "nombre curso", "grado", "nivel"] },
      { key: "cycle", label: "Ciclo", aliases: ["ciclo", "nivel", "etapa"] },
      { key: "orientationOwner", label: "Orientador/a", aliases: ["orientador", "orientadora", "responsable orientacion"] },
      { key: "orientationEmail", label: "Correo orientacion", aliases: ["correo orientacion", "email orientador"] },
      { key: "convivenciaCoordinator", label: "Coord. convivencia", aliases: ["coordinadora convivencia", "coordinador convivencia", "convivencia"] },
      { key: "convivenciaEmail", label: "Correo convivencia", aliases: ["correo convivencia", "email convivencia"] },
      { key: "headTeacher", label: "Profesor/a jefe", aliases: ["profesor jefe", "profesora jefe", "docente", "tutor"] },
      { key: "capacity", label: "Capacidad sala", aliases: ["capacidad", "puestos", "cupos"] },
      { key: "notes", label: "Observaciones", type: "textarea", aliases: ["observaciones", "notas", "comentarios"] },
    ],
  },
  cases: {
    id: "cases",
    label: "Casos",
    singular: "caso",
    icon: FileText,
    description: "Casos individuales o grupales con prioridad, estado y trazabilidad.",
    fields: [
      { key: "student", label: "Estudiante / grupo", required: true, aliases: ["estudiante", "alumno", "nombre", "grupo", "curso"] },
      { key: "course", label: "Curso", aliases: ["curso", "grado", "nivel"] },
      { key: "title", label: "Motivo / título", required: true, aliases: ["motivo", "caso", "titulo", "situacion", "problema"] },
      { key: "category", label: "Categoría", type: "select", options: ["Convivencia", "Socioemocional", "Académico", "Asistencia", "Familiar", "PIE/NEE", "Otro"], aliases: ["categoria", "tipo", "area"] },
      { key: "priority", label: "Prioridad", type: "select", options: ["Baja", "Media", "Alta", "Crítica"], aliases: ["prioridad", "urgencia", "riesgo"] },
      { key: "status", label: "Estado", type: "select", options: ["Abierto", "En seguimiento", "Derivado", "Cerrado"], aliases: ["estado", "status"] },
      { key: "responsible", label: "Responsable", aliases: ["responsable", "profesional", "asignado"] },
      { key: "description", label: "Descripción", type: "textarea", aliases: ["descripcion", "observaciones", "detalle", "relato"] },
    ],
  },
  logs: {
    id: "logs",
    label: "Bitácoras",
    singular: "bitácora",
    icon: ClipboardList,
    description: "Registros profesionales breves vinculados a estudiantes, cursos o casos.",
    fields: [
      { key: "date", label: "Fecha", type: "date", required: true, aliases: ["fecha", "dia", "date"] },
      { key: "student", label: "Estudiante / curso", required: true, aliases: ["estudiante", "curso", "grupo", "alumno"] },
      { key: "type", label: "Tipo de registro", type: "select", options: ["Seguimiento", "Entrevista", "Observación", "Crisis", "Coordinación", "Otro"], aliases: ["tipo", "registro", "accion"] },
      { key: "professional", label: "Profesional", aliases: ["profesional", "responsable", "autor"] },
      { key: "description", label: "Descripción", type: "textarea", required: true, aliases: ["descripcion", "observaciones", "detalle", "bitacora"] },
      { key: "agreements", label: "Acuerdos", type: "textarea", aliases: ["acuerdos", "compromisos", "tareas"] },
    ],
  },
  interviews: {
    id: "interviews",
    label: "Entrevistas",
    singular: "entrevista",
    icon: MessageSquareText,
    description: "Entrevistas y actas con participantes, acuerdos y seguimiento.",
    fields: [
      { key: "date", label: "Fecha", type: "date", required: true, aliases: ["fecha", "date"] },
      { key: "participant", label: "Participante principal", required: true, aliases: ["participante", "apoderado", "estudiante", "entrevistado"] },
      { key: "student", label: "Estudiante asociado", aliases: ["estudiante", "alumno"] },
      { key: "reason", label: "Motivo", required: true, aliases: ["motivo", "tema", "razon"] },
      { key: "status", label: "Estado", type: "select", options: ["Agendada", "Realizada", "Reprogramada", "Cerrada"], aliases: ["estado", "status"] },
      { key: "agreements", label: "Acuerdos", type: "textarea", aliases: ["acuerdos", "compromisos"] },
    ],
  },
  protocols: {
    id: "protocols",
    label: "Protocolos",
    singular: "protocolo",
    icon: ShieldCheck,
    description: "Protocolos y derivaciones con responsables, plazos y estado.",
    fields: [
      { key: "title", label: "Protocolo / derivación", required: true, aliases: ["protocolo", "derivacion", "titulo", "tipo"] },
      { key: "student", label: "Estudiante / grupo", aliases: ["estudiante", "alumno", "curso", "grupo"] },
      { key: "status", label: "Estado", type: "select", options: ["Activado", "En análisis", "En seguimiento", "Cerrado"], aliases: ["estado", "status"] },
      { key: "dueDate", label: "Plazo", type: "date", aliases: ["plazo", "fecha limite", "vencimiento"] },
      { key: "responsible", label: "Responsable", aliases: ["responsable", "profesional"] },
      { key: "notes", label: "Notas", type: "textarea", aliases: ["notas", "observaciones", "descripcion"] },
    ],
  },
  orientation: {
    id: "orientation",
    label: "Orientación",
    singular: "clase de orientación",
    icon: UsersRound,
    description: "Plan anual, clases, talleres formativos y seguimiento de implementación.",
    fields: [
      { key: "date", label: "Fecha", type: "date", aliases: ["fecha", "date"] },
      { key: "course", label: "Curso", required: true, aliases: ["curso", "nivel", "grado"] },
      { key: "orientationOwner", label: "Orientador/a", aliases: ["orientador", "orientadora", "responsable"] },
      { key: "topic", label: "Tema / clase", required: true, aliases: ["tema", "clase", "sesion", "actividad"] },
      { key: "axis", label: "Eje", aliases: ["eje", "unidad", "area"] },
      { key: "status", label: "Estado", type: "select", options: ["Planificada", "Realizada", "Pendiente", "Reprogramada"], aliases: ["estado", "status"] },
      { key: "canvaLink", label: "Enlace Canva", aliases: ["canva", "link canva", "presentacion", "diapositivas"] },
      { key: "evidence", label: "Evidencia / enlace", aliases: ["evidencia", "link", "enlace", "url"] },
      { key: "planificacion", label: "Planificación", type: "textarea", aliases: ["planificacion", "plan", "objetivos", "actividades"] },
      { key: "notes", label: "Observaciones", type: "textarea", aliases: ["observaciones", "notas", "descripcion"] },
    ],
  },
  workshops: {
    id: "workshops",
    label: "Talleres",
    singular: "taller",
    icon: GraduationCap,
    description: "Talleres para estudiantes, apoderados, docentes o grupos focales.",
    fields: [
      { key: "date", label: "Fecha", type: "date", aliases: ["fecha"] },
      { key: "title", label: "Nombre del taller", required: true, aliases: ["taller", "nombre", "titulo", "actividad"] },
      { key: "audience", label: "Participantes", aliases: ["participantes", "audiencia", "grupo", "curso"] },
      { key: "responsible", label: "Responsable", aliases: ["responsable", "profesional"] },
      { key: "status", label: "Estado", type: "select", options: ["Planificado", "Realizado", "Pendiente"], aliases: ["estado"] },
      { key: "notes", label: "Observaciones", type: "textarea", aliases: ["observaciones", "notas"] },
    ],
  },
  documents: {
    id: "documents",
    label: "Documentos",
    singular: "documento",
    icon: FolderOpen,
    description: "Índice documental seguro. Puedes registrar enlaces de Drive, archivos y plantillas.",
    fields: [
      { key: "title", label: "Nombre del documento", required: true, aliases: ["documento", "nombre", "titulo", "archivo"] },
      { key: "folder", label: "Carpeta", aliases: ["carpeta", "area", "categoria"] },
      { key: "confidentiality", label: "Confidencialidad", type: "select", options: ["Interno", "Reservado", "Confidencial", "Altamente sensible"], aliases: ["confidencialidad", "privacidad"] },
      { key: "relatedTo", label: "Relacionado con", aliases: ["estudiante", "curso", "caso", "relacionado"] },
      { key: "url", label: "Enlace", aliases: ["url", "link", "enlace", "drive"] },
      { key: "notes", label: "Notas", type: "textarea", aliases: ["notas", "observaciones"] },
    ],
  },
};

const viewNav: Array<{ id: ViewId; label: string; icon: LucideIcon }> = [
  { id: "dashboard", label: "Inicio", icon: Home },
  { id: "today", label: "Hoy", icon: CalendarDays },
  { id: "triage", label: "Asistente IA", icon: Sparkles },
  { id: "reports", label: "Reportes", icon: PieChart },
  { id: "students", label: "Estudiantes", icon: UserRound },
  { id: "courses", label: "Cursos", icon: BookOpen },
  { id: "cases", label: "Casos", icon: FileText },
  { id: "logs", label: "Bitácoras", icon: ClipboardList },
  { id: "interviews", label: "Entrevistas", icon: MessageSquareText },
  { id: "protocols", label: "Protocolos", icon: ShieldCheck },
  { id: "orientation", label: "Orientación", icon: UsersRound },
  { id: "workshops", label: "Talleres", icon: GraduationCap },
  { id: "documents", label: "Documentos", icon: FolderOpen },
  { id: "team", label: "Equipo", icon: UsersRound },
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

const parseCsv = (text: string): { headers: string[]; rows: Record<string, string>[]; delimiter: string } => {
  const delimiter = text.includes("\t") ? "\t" : text.includes(";") ? ";" : ",";
  const lines: string[][] = [];
  let field = "";
  let row: string[] = [];
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"' && quoted && next === '"') {
      field += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === delimiter && !quoted) {
      row.push(field.trim());
      field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(field.trim());
      if (row.some(Boolean)) lines.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  row.push(field.trim());
  if (row.some(Boolean)) lines.push(row);

  const headers = (lines[0] || []).map((header, index) => header || `Columna ${index + 1}`);
  const rows = lines.slice(1).map((values) =>
    headers.reduce<Record<string, string>>((acc, header, index) => {
      acc[header] = values[index] || "";
      return acc;
    }, {})
  );

  return { headers, rows, delimiter };
};

const inferImportPlan = (sheet: ParsedSheet): ImportPlan => {
  const normalizedHeaders = sheet.headers.map(normalize);
  let best: ImportPlan = { entity: "students", confidence: 0, mapping: {}, notes: [] };

  Object.values(entityConfigs).forEach((config) => {
    const mapping: Record<string, string> = {};
    let score = 0;

    config.fields.forEach((field) => {
      const matchIndex = normalizedHeaders.findIndex((header) =>
        field.aliases.some((alias) => header === normalize(alias) || header.includes(normalize(alias)) || normalize(alias).includes(header))
      );
      if (matchIndex >= 0) {
        mapping[field.key] = sheet.headers[matchIndex];
        score += field.required ? 3 : 1;
      }
    });

    const requiredFields = config.fields.filter((field) => field.required);
    const requiredHits = requiredFields.filter((field) => mapping[field.key]).length;
    const requiredPenalty = requiredFields.length - requiredHits;
    const confidence = Math.max(0, Math.round(((score - requiredPenalty * 2) / (config.fields.length + requiredFields.length * 2)) * 100));

    if (confidence > best.confidence) {
      best = {
        entity: config.id,
        confidence,
        mapping,
        notes: [
          `${Object.keys(mapping).length} columnas reconocidas para ${config.label}.`,
          requiredPenalty ? `Faltan ${requiredPenalty} campos requeridos por mapear.` : "Campos requeridos detectados.",
        ],
      };
    }
  });

  return best;
};

const recordsToCsv = (records: DataRecord[], fields: FieldDef[]) => {
  const headers = fields.map((field) => field.label);
  const rows = records.map((record) =>
    fields.map((field) => {
      const value = record[field.key] || "";
      return /[",;\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
    })
  );
  return [headers, ...rows].map((row) => row.join(",")).join("\n");
};

function downloadText(fileName: string, content: string, type = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

function StatCard({ label, value, detail, icon: Icon, accent = "blue" }: { label: string; value: number; detail: string; icon: LucideIcon; accent?: "teal" | "blue" | "amber" | "violet" | "rose" }) {
  const accents = {
    teal: "from-teal-500 to-emerald-500 text-white",
    blue: "from-sky-500 to-blue-600 text-white",
    amber: "from-amber-500 to-orange-500 text-white",
    violet: "from-violet-500 to-purple-600 text-white",
    rose: "from-rose-500 to-pink-600 text-white",
  };
  const tints = {
    teal: "bg-emerald-50/50",
    blue: "bg-sky-50/50",
    amber: "bg-amber-50/50",
    violet: "bg-violet-50/50",
    rose: "bg-rose-50/50",
  };

  return (
    <section className="tz-card relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5">
      <span className={`pointer-events-none absolute -bottom-16 -left-16 h-32 w-32 rounded-full opacity-60 ${tints[accent]}`} />
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 tabular-nums">{value.toLocaleString("es-CL")}</p>
          <p className="mt-1 text-xs text-slate-500">{detail}</p>
        </div>
        <div className={`relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${accents[accent]} shadow-md ring-1 ring-white/40`}>
          <Icon className="h-6 w-6" strokeWidth={2.2} />
        </div>
      </div>
    </section>
  );
}

function Sidebar({ activeView, onNavigate, schoolName }: { activeView: ViewId; onNavigate: (view: ViewId) => void; schoolName: string }) {
  return (
    <aside className="tz-glass fixed inset-y-0 left-0 hidden w-[272px] flex-col border-r border-slate-200/80 text-slate-700 lg:flex">
      <div className="flex h-full flex-col">
        <div className="border-b border-slate-200/80 px-6 pb-4 pt-5">
          <div className="flex h-12 items-center">
            <Image src="/tiza-education-logo.svg" alt="Tiza Education" width={200} height={48} priority />
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white/80 p-2.5">
            <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-white ring-1 ring-slate-200">
              <Image src="/logo-san-lucas.png" alt={schoolName} width={36} height={36} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Trabajando en</p>
              <p className="truncate text-sm font-semibold text-slate-900">{schoolName}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {viewNav.map((item) => {
            const Icon = item.icon;
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`tz-nav-item relative flex h-10 w-full items-center gap-3 overflow-hidden rounded-lg px-3 text-left text-sm font-medium ${
                  active ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                {active ? <span className="absolute inset-y-2 left-0 w-1 rounded-full bg-blue-500" /> : null}
                <Icon className={`h-4 w-4 ${active ? "text-white" : "text-slate-500"}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <button
          onClick={() => onNavigate("settings")}
          className={`tz-press group relative m-3 overflow-hidden rounded-2xl border p-3 text-left transition ${
            activeView === "settings"
              ? "border-slate-900 bg-slate-900 text-white shadow-lg"
              : "border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-slate-300 hover:shadow-md"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl shadow-sm ${
              activeView === "settings" ? "bg-white/15 ring-1 ring-white/30" : "bg-gradient-to-br from-slate-800 to-slate-600 ring-1 ring-slate-900/10"
            }`}>
              <Settings className={`h-5 w-5 ${activeView === "settings" ? "text-white" : "text-white"} transition group-hover:rotate-90`} />
              <span className="absolute -right-2 -top-2 h-3 w-3 rounded-full bg-emerald-400 opacity-80 ring-2 ring-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-[10px] font-semibold uppercase tracking-wider ${activeView === "settings" ? "text-white/70" : "text-slate-500"}`}>Ajustes</p>
              <p className={`truncate text-sm font-semibold ${activeView === "settings" ? "text-white" : "text-slate-900"}`}>{schoolName}</p>
            </div>
            <ChevronDown className={`h-4 w-4 -rotate-90 transition group-hover:translate-x-0.5 ${activeView === "settings" ? "text-white/70" : "text-slate-400"}`} />
          </div>
          <span className="pointer-events-none absolute -bottom-8 -right-8 h-20 w-20 rounded-full bg-slate-100/0 group-hover:bg-slate-100/40 transition" />
        </button>
      </div>
    </aside>
  );
}

function EmptyState({ onAdd, onImport, entity }: { onAdd: () => void; onImport: () => void; entity: EntityConfig }) {
  const Icon = entity.icon;
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-md bg-slate-50 text-slate-500 ring-1 ring-slate-200">
        <Icon className="h-6 w-6" />
      </div>
      <h2 className="mt-5 text-lg font-semibold text-slate-950">Todavía no hay {entity.label.toLowerCase()}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
        Empieza ingresando un registro manualmente o importa una planilla CSV/TSV exportada desde Google Sheets.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button onClick={onAdd} className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
          <Plus className="h-4 w-4" /> Agregar {entity.singular}
        </button>
        <button onClick={onImport} className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          <Upload className="h-4 w-4" /> Importar planilla
        </button>
      </div>
    </div>
  );
}

function EntityView({
  entity,
  records,
  query,
  setQuery,
  onAdd,
  onDelete,
  onExport,
  onImport,
}: {
  entity: EntityConfig;
  records: DataRecord[];
  query: string;
  setQuery: (value: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onExport: () => void;
  onImport: () => void;
}) {
  const searchable = normalize(query);
  const filtered = records.filter((record) =>
    !searchable || Object.values(record).some((value) => normalize(String(value)).includes(searchable))
  );

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-sm">
              <entity.icon className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{entity.label}</h1>
          </div>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">{entity.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex min-w-[260px] flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm xl:w-80 xl:flex-none">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Buscar en ${entity.label.toLowerCase()}...`}
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
            />
            {query ? (
              <button onClick={() => setQuery("")} className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
          <button onClick={onImport} className="tz-press inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <Upload className="h-4 w-4" /> Importar
          </button>
          <button onClick={onExport} className="tz-press inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <ArrowDownToLine className="h-4 w-4" /> Exportar
          </button>
          <button onClick={onAdd} className="tz-press inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800">
            <Plus className="h-4 w-4" /> Agregar
          </button>
        </div>
      </div>

      {records.length === 0 ? (
        <EmptyState entity={entity} onAdd={onAdd} onImport={onImport} />
      ) : (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3 text-sm">
            <span className="font-semibold text-slate-700">
              Mostrando <span className="tabular-nums">{filtered.length}</span> de <span className="tabular-nums">{records.length}</span> registros
            </span>
            {query ? <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">filtro: “{query}”</span> : null}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  {entity.fields.slice(0, 6).map((field) => (
                    <th key={field.key} className="px-5 py-3 font-semibold">{field.label}</th>
                  ))}
                  <th className="px-5 py-3 font-semibold">Actualizado</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((record, index) => (
                  <tr key={record.id} className={`group transition hover:bg-blue-50/50 ${index % 2 === 1 ? "bg-slate-50/30" : ""}`}>
                    {entity.fields.slice(0, 6).map((field, fieldIndex) => (
                      <td key={field.key} className={`max-w-[260px] truncate px-5 py-3 ${fieldIndex === 0 ? "font-semibold text-slate-950" : "text-slate-700"}`}>
                        {record[field.key] || <span className="text-slate-300">—</span>}
                      </td>
                    ))}
                    <td className="px-5 py-3 text-xs text-slate-500">{new Date(record.updatedAt).toLocaleString("es-CL")}</td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => onDelete(record.id)} title="Eliminar" className="rounded-lg p-2 text-slate-400 opacity-0 transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function CourseWorkspaceView({
  store,
  onSeedCourses,
  onUpdateCourse,
  onNavigate,
  onOpenStudent,
}: {
  store: DataStore;
  onSeedCourses: () => void;
  onUpdateCourse: (courseName: string, updates: Record<string, string>) => void;
  onNavigate: (view: ViewId) => void;
  onOpenStudent: (studentId: string, focusField?: string) => void;
}) {
  const savedByName = new Map(store.courses.map((course) => [normalize(course.name || ""), course]));
  const courses = officialCourses.map((course) => ({ ...course, record: savedByName.get(normalize(course.name)) || makeCourseRecord(course) }));
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.name || "");
  const [cycleTab, setCycleTab] = useState<"all" | CourseDef["cycle"]>("all");
  const [draggedStudentId, setDraggedStudentId] = useState("");
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const [teamForm, setTeamForm] = useState({ name: "", role: "Profesor/a jefe", email: "" });
  const [showTeamForm, setShowTeamForm] = useState(false);
  const CUSTOM_ROLES_KEY = "tiza-custom-classroom-roles";
  const [customRoles, setCustomRoles] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(window.localStorage.getItem(CUSTOM_ROLES_KEY) || "[]"); } catch { return []; }
  });
  const [newRoleDraft, setNewRoleDraft] = useState("");
  const [showNewRoleInput, setShowNewRoleInput] = useState(false);
  const allRoles = [...classroomRoles, ...customRoles.filter((r) => !classroomRoles.includes(r))];
  const persistCustomRoles = (next: string[]) => {
    setCustomRoles(next);
    try { window.localStorage.setItem(CUSTOM_ROLES_KEY, JSON.stringify(next)); } catch { /* ignore quota */ }
  };
  const addCustomRole = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    if (allRoles.includes(trimmed)) {
      setTeamForm((f) => ({ ...f, role: trimmed }));
      setShowNewRoleInput(false);
      setNewRoleDraft("");
      return;
    }
    persistCustomRoles([...customRoles, trimmed]);
    setTeamForm((f) => ({ ...f, role: trimmed }));
    setShowNewRoleInput(false);
    setNewRoleDraft("");
  };

  const visibleCourses = cycleTab === "all" ? courses : courses.filter((course) => course.cycle === cycleTab);
  const current = courses.find((course) => course.name === selectedCourse) || courses[0];
  const courseName = current?.name || "";
  const students = store.students.filter((record) => normalize(record.course || "") === normalize(courseName));
  const cases = store.cases.filter((record) => courseMatches(record, courseName));
  const convivencia = cases.filter((record) => normalize(`${record.category || ""} ${record.title || ""}`).includes("convivencia"));
  const logs = store.logs.filter((record) => courseMatches(record, courseName));
  const orientation = store.orientation.filter((record) => courseMatches(record, courseName));
  const documents = store.documents.filter((record) => courseMatches(record, courseName));
  const capacity = Math.max(24, Number(current?.record.capacity || current?.capacity || 32), students.length);
  const studentsById = new Map(students.map((student) => [student.id, student]));
  const savedSeats = parseSeatAssignments(current?.record.seatAssignments).filter((studentId) => studentsById.has(studentId));
  const unsavedStudentIds = students.map((student) => student.id).filter((studentId) => !savedSeats.includes(studentId));
  const seatStudentIds = [...savedSeats, ...unsavedStudentIds];
  const seats = Array.from({ length: capacity }, (_, index) => studentsById.get(seatStudentIds[index] || ""));
  const missingOfficialCourses = officialCourses.filter((course) => !savedByName.has(normalize(course.name))).length;
  const classroomTeam = parseClassroomTeam(current?.record.classroomTeam);
  const caseCountByStudent = new Map<string, number>();
  store.cases.forEach((record) => {
    students.forEach((student) => {
      if (studentMatches(record, student)) caseCountByStudent.set(student.id, (caseCountByStudent.get(student.id) || 0) + 1);
    });
  });

  const updateSeatAssignments = (nextSeats: Array<DataRecord | undefined>) => {
    if (!current) return;
    onUpdateCourse(current.name, { seatAssignments: JSON.stringify(nextSeats.map((student) => student?.id || "")) });
  };

  const moveStudentToSeat = (targetIndex: number) => {
    if (!draggedStudentId) return;
    const fromIndex = seats.findIndex((student) => student?.id === draggedStudentId);
    const dragged = studentsById.get(draggedStudentId);
    if (!dragged) return;
    const nextSeats = [...seats];
    nextSeats[fromIndex] = nextSeats[targetIndex];
    nextSeats[targetIndex] = dragged;
    updateSeatAssignments(nextSeats);
    setDraggedStudentId("");
    setDropTargetIndex(null);
  };

  const addClassroomTeamMember = () => {
    if (!current || !teamForm.name.trim()) return;
    const member: ClassroomTeamMember = {
      id: uid(),
      name: teamForm.name.trim(),
      role: teamForm.role,
      email: teamForm.email.trim(),
      notes: "",
    };
    onUpdateCourse(current.name, {
      classroomTeam: JSON.stringify([...classroomTeam, member]),
      headTeacher: member.role === "Profesor/a jefe" ? member.name : current.record.headTeacher || "",
    });
    setTeamForm({ name: "", role: "Profesor/a jefe", email: "" });
    setShowTeamForm(false);
  };

  const removeClassroomTeamMember = (memberId: string) => {
    if (!current) return;
    const nextTeam = classroomTeam.filter((member) => member.id !== memberId);
    const removed = classroomTeam.find((member) => member.id === memberId);
    onUpdateCourse(current.name, {
      classroomTeam: JSON.stringify(nextTeam),
      headTeacher: current.record.headTeacher === removed?.name ? "" : current.record.headTeacher || "",
    });
  };

  const updateClassroomTeamMember = (memberId: string, patch: Partial<ClassroomTeamMember>) => {
    if (!current) return;
    const nextTeam = classroomTeam.map((member) => (member.id === memberId ? { ...member, ...patch } : member));
    onUpdateCourse(current.name, { classroomTeam: JSON.stringify(nextTeam) });
  };

  const [showPjPanel, setShowPjPanel] = useState(false);
  const pjList = courses
    .map((c) => {
      const team = parseClassroomTeam(c.record.classroomTeam);
      const pj = team.find((m) => normalize(m.role || "").includes("profesor a jefe") || normalize(m.role || "") === "profesor jefe");
      return pj ? { courseName: c.name, cycle: c.cycle, name: pj.name, email: pj.email || "", role: pj.role } : null;
    })
    .filter((x): x is { courseName: string; cycle: CourseDef["cycle"]; name: string; email: string; role: string } => x !== null);
  const pjWithEmail = pjList.filter((p) => p.email && p.email.includes("@"));
  const [copyState, setCopyState] = useState<"" | "all" | string>("");
  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState(key);
      window.setTimeout(() => setCopyState(""), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="tz-fade">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Cursos</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Cada curso tiene su propio tablero: equipo de aula, simulación de sala, casos, orientación y documentos.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowPjPanel((value) => !value)}
            className="tz-press inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <UsersRound className="h-4 w-4" /> {showPjPanel ? "Ocultar PJ" : `Ver Profesores Jefe (${pjList.length})`}
          </button>
          <button
            onClick={onSeedCourses}
            disabled={missingOfficialCourses === 0}
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300"
          >
            <Save className="h-4 w-4" />
            {missingOfficialCourses === 0 ? "Cursos oficiales guardados" : `Guardar ${missingOfficialCourses} cursos oficiales`}
          </button>
        </div>
      </div>

      {showPjPanel ? (
        <section className="tz-slide-up mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-blue-50/40 to-white px-5 py-3">
            <div>
              <h2 className="text-base font-semibold text-slate-950">Profesores Jefe</h2>
              <p className="text-xs text-slate-500">{pjList.length} cursos con PJ asignado · {pjWithEmail.length} con correo</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => copyToClipboard(pjWithEmail.map((p) => p.email).join(", "), "all")}
                disabled={pjWithEmail.length === 0}
                className="tz-press inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-blue-600 to-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-50"
              >
                <Mail className="h-4 w-4" /> {copyState === "all" ? "✓ Copiados" : `Copiar ${pjWithEmail.length} correos`}
              </button>
              <button
                onClick={() => copyToClipboard(pjWithEmail.map((p) => p.email).join(";"), "all-semi")}
                disabled={pjWithEmail.length === 0}
                title="Separados por ; (para Outlook/Gmail clásico)"
                className="tz-press inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                {copyState === "all-semi" ? "✓ Copiados" : "Copiar con ;"}
              </button>
            </div>
          </div>
          {pjList.length === 0 ? (
            <p className="p-6 text-center text-sm text-slate-500">Aún no hay profesores jefe registrados en ningún curso. Agrégalos desde el equipo de aula de cada curso.</p>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-2 font-semibold">Curso</th>
                    <th className="px-5 py-2 font-semibold">Profesor/a Jefe</th>
                    <th className="px-5 py-2 font-semibold">Correo</th>
                    <th className="px-5 py-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pjList.map((p) => (
                    <tr key={p.courseName} className="hover:bg-blue-50/40">
                      <td className="px-5 py-2">
                        <button onClick={() => { setSelectedCourse(p.courseName); setShowPjPanel(false); }} className="text-left font-semibold text-slate-900 hover:text-blue-700">
                          {p.courseName}
                        </button>
                        <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">{p.cycle}</span>
                      </td>
                      <td className="px-5 py-2 text-slate-800">{p.name}</td>
                      <td className="px-5 py-2">
                        {p.email ? <a href={`mailto:${p.email}`} className="text-blue-700 hover:underline">{p.email}</a> : <span className="text-slate-400">—</span>}
                      </td>
                      <td className="px-5 py-2 text-right">
                        {p.email ? (
                          <button onClick={() => copyToClipboard(p.email, p.courseName)} className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50">
                            {copyState === p.courseName ? "✓" : "Copiar"}
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : null}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {([
          ["all", "Todos"],
          ["I Ciclo", "I Ciclo"],
          ["II Ciclo", "II Ciclo"],
          ["III Ciclo", "III Ciclo"],
        ] as Array<["all" | CourseDef["cycle"], string]>).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setCycleTab(key)}
            className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${cycleTab === key ? "bg-slate-900 text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mb-5 overflow-x-auto rounded-xl border border-slate-200 bg-white px-3 py-3">
        <div className="flex min-w-max gap-1.5">
          {visibleCourses.map((course) => (
            <button
              key={course.name}
              onClick={() => setSelectedCourse(course.name)}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition ${selectedCourse === course.name ? "bg-slate-900 text-white shadow" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
            >
              {course.name}
            </button>
          ))}
        </div>
      </div>

      {current ? (
        <div className="space-y-6">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className={`bg-gradient-to-br ${avatarTone(current.name)} px-6 py-5 text-white sm:px-8`}>
              <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/85">
                    <span className="rounded-full bg-white/20 px-2.5 py-0.5">{current.cycle}</span>
                    <span className="opacity-70">·</span>
                    <span className="truncate">{current.orientationOwner}</span>
                  </div>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{current.name}</h2>
                  <p className="mt-1 text-sm text-white/90">Convivencia: <strong>{current.convivenciaCoordinator}</strong> · {current.convivenciaEmail}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center text-xs font-semibold sm:grid-cols-4 lg:w-[420px]">
                  {[
                    ["Estudiantes", students.length],
                    ["Casos", cases.length],
                    ["Orientación", orientation.length],
                    ["Bitácoras", logs.length],
                  ].map(([label, count]) => (
                    <div key={String(label)} className="rounded-lg bg-white/15 px-3 py-2 backdrop-blur">
                      <div className="text-xl font-bold leading-none">{count}</div>
                      <div className="mt-1 opacity-85">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-950">
                  <UsersRound className="h-5 w-5 text-blue-600" />
                  Equipo de aula
                </h3>
                <p className="mt-1 text-sm text-slate-600">Profesor/a jefe, asistentes y apoyos del curso. Edita o agrega miembros directamente desde aquí.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{classroomTeam.length} integrante{classroomTeam.length === 1 ? "" : "s"}</span>
                <button
                  onClick={() => setShowTeamForm((value) => !value)}
                  className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  <Plus className="h-4 w-4" /> Añadir miembro
                </button>
              </div>
            </div>

            {showTeamForm ? (
              <div className="tz-slide-up mb-4 rounded-xl border border-blue-200 bg-blue-50/60 p-4">
                <div className="grid gap-2 lg:grid-cols-[1fr_240px_1fr_auto]">
                  <input value={teamForm.name} onChange={(event) => setTeamForm((form) => ({ ...form, name: event.target.value }))} placeholder="Nombre completo" className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500" />
                  <select
                    value={showNewRoleInput ? "__new__" : teamForm.role}
                    onChange={(event) => {
                      if (event.target.value === "__new__") setShowNewRoleInput(true);
                      else { setShowNewRoleInput(false); setTeamForm((form) => ({ ...form, role: event.target.value })); }
                    }}
                    className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    {allRoles.map((role) => <option key={role} value={role}>{role}</option>)}
                    <option value="__new__">＋ Nuevo cargo personalizado…</option>
                  </select>
                  <input value={teamForm.email} onChange={(event) => setTeamForm((form) => ({ ...form, email: event.target.value }))} placeholder="Correo" className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500" />
                  <button onClick={addClassroomTeamMember} disabled={!teamForm.name.trim() || showNewRoleInput} className="inline-flex items-center justify-center gap-1.5 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300">
                    <Save className="h-4 w-4" /> Guardar
                  </button>
                </div>
                {showNewRoleInput ? (
                  <div className="tz-slide-up mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-blue-300 bg-white p-3">
                    <input
                      autoFocus
                      value={newRoleDraft}
                      onChange={(event) => setNewRoleDraft(event.target.value)}
                      onKeyDown={(event) => { if (event.key === "Enter") addCustomRole(newRoleDraft); }}
                      placeholder="Ej.: Fonoaudióloga, Educadora PIE, Inspectora general…"
                      className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                    <button onClick={() => addCustomRole(newRoleDraft)} disabled={!newRoleDraft.trim()} className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-slate-300">
                      <Plus className="h-4 w-4" /> Crear cargo
                    </button>
                    <button onClick={() => { setShowNewRoleInput(false); setNewRoleDraft(""); }} className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancelar</button>
                    <p className="w-full text-[11px] text-slate-500">Los cargos personalizados se guardan localmente y aparecen disponibles para todos los cursos.</p>
                  </div>
                ) : null}
              </div>
            ) : null}

            {classroomTeam.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                Todavía no hay equipo de aula. Pulsa <strong>Añadir miembro</strong> para empezar.
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {classroomTeam.map((member) => (
                  <article key={member.id} className="tz-card group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start gap-3">
                      <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br ${avatarTone(member.id)} text-sm font-bold text-white shadow-sm`}>
                        {initialsOf(member.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <input
                          value={member.name}
                          onChange={(event) => updateClassroomTeamMember(member.id, { name: event.target.value })}
                          className="w-full border-b border-transparent bg-transparent text-sm font-semibold text-slate-950 outline-none transition hover:border-slate-200 focus:border-blue-500"
                        />
                        <select
                          value={allRoles.includes(member.role) ? member.role : member.role}
                          onChange={(event) => updateClassroomTeamMember(member.id, { role: event.target.value })}
                          className="mt-1 w-full rounded border border-transparent bg-transparent text-xs text-slate-600 outline-none transition hover:border-slate-200 focus:border-blue-500"
                        >
                          {!allRoles.includes(member.role) && member.role ? <option value={member.role}>{member.role}</option> : null}
                          {allRoles.map((role) => <option key={role} value={role}>{role}</option>)}
                        </select>
                        <input
                          value={member.email}
                          onChange={(event) => updateClassroomTeamMember(member.id, { email: event.target.value })}
                          placeholder="Correo"
                          className="mt-1 w-full border-b border-transparent bg-transparent text-xs text-slate-500 outline-none transition hover:border-slate-200 focus:border-blue-500"
                        />
                      </div>
                      <button onClick={() => removeClassroomTeamMember(member.id)} className="rounded-md p-1.5 text-red-500 opacity-0 transition group-hover:opacity-100 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <div className="grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-950">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    Simulación de sala
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">Arrastra para reorganizar puestos. Haz clic en un estudiante para abrir su ficha.</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{capacity} puestos · {students.length} ocupados</span>
              </div>

              <div className="rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4">
                <div className="mx-auto mb-4 max-w-md rounded-md bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-inner">
                  Pizarra
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                  {seats.map((student, index) => {
                    const occupied = Boolean(student);
                    const caseCount = student ? (caseCountByStudent.get(student.id) || 0) : 0;
                    const isTarget = dropTargetIndex === index;
                    return (
                      <button
                        key={`${index}-${student?.id || "empty"}`}
                        type="button"
                        draggable={occupied}
                        onDragStart={() => student && setDraggedStudentId(student.id)}
                        onDragEnd={() => { setDraggedStudentId(""); setDropTargetIndex(null); }}
                        onDragOver={(event) => { event.preventDefault(); setDropTargetIndex(index); }}
                        onDragLeave={() => setDropTargetIndex((current) => (current === index ? null : current))}
                        onDrop={() => moveStudentToSeat(index)}
                        onClick={() => student && onOpenStudent(student.id)}
                        className={`tz-seat group relative min-h-28 rounded-xl border-2 p-3 text-left text-xs ${
                          occupied
                            ? "border-slate-200 bg-white shadow-sm hover:border-blue-400"
                            : "border-dashed border-slate-300 bg-slate-50/60 text-slate-400"
                        } ${draggedStudentId && student?.id === draggedStudentId ? "dragging" : ""} ${isTarget ? "drop-target" : ""}`}
                      >
                        <span className="absolute right-2 top-2 text-[10px] font-semibold text-slate-400">#{index + 1}</span>
                        {occupied && student ? (
                          <>
                            <div className={`mb-2 grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-gradient-to-br ${avatarTone(student.id)} text-[11px] font-bold text-white shadow-sm`}>
                              {student.profilePhoto ? (
                                <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${student.profilePhoto})` }} />
                              ) : (
                                initialsOf(student.fullName)
                              )}
                            </div>
                            <span className="block text-[13px] font-bold leading-tight text-slate-950">{student.fullName}</span>
                            {student.rut ? <span className="mt-0.5 block text-[10px] text-slate-500">{student.rut}</span> : null}
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {caseCount ? <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700">{caseCount} caso{caseCount === 1 ? "" : "s"}</span> : null}
                              {student.healthAlerts ? (
                                <span
                                  role="button"
                                  tabIndex={0}
                                  onClick={(event) => { event.stopPropagation(); onOpenStudent(student.id, "healthAlerts"); }}
                                  onKeyDown={(event) => { if (event.key === "Enter") { event.stopPropagation(); onOpenStudent(student.id, "healthAlerts"); } }}
                                  title="Ver / editar alerta de salud"
                                  className="cursor-pointer rounded-full bg-rose-100 px-1.5 py-0.5 text-[9px] font-semibold text-rose-700 ring-1 ring-rose-200 transition hover:bg-rose-200"
                                >
                                  ⚠ Salud
                                </span>
                              ) : null}
                            </div>
                          </>
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">Libre</span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 text-center text-[11px] text-slate-500">Frente del aula ↑ · Fondo del aula ↓</p>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-950">
                <ShieldCheck className="h-5 w-5 text-rose-600" />
                Convivencia
              </h3>
              <div className="mt-4 space-y-3">
                {convivencia.length === 0 ? (
                  <p className="rounded-md bg-slate-50 p-3 text-sm text-slate-600">No hay casos de convivencia para este curso.</p>
                ) : convivencia.map((record) => (
                  <article key={record.id} className="tz-card rounded-lg border border-slate-200 p-3 text-sm">
                    <strong className="block text-slate-950">{record.title || record.student}</strong>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {record.status ? <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">{record.status}</span> : null}
                      {record.priority ? <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">{record.priority}</span> : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-950">
                  <ClipboardList className="h-5 w-5 text-emerald-600" />
                  Notas de Equipo de Aula (ERC)
                </h3>
                <p className="mt-1 text-sm text-slate-600">Bitácora interna de reuniones del equipo de aula: acuerdos, seguimiento, próximos pasos.</p>
              </div>
            </div>
            <textarea
              value={current.record.ercNotes || ""}
              onChange={(event) => onUpdateCourse(current.name, { ercNotes: event.target.value })}
              placeholder={"Ej.: 12/06 — Reunión con prof. jefe y dupla psicosocial.\nAcuerdos: derivar a Camila P. a psicología externa, reforzar normas de convivencia con el curso.\nResponsable: convivencia.\nPróxima reunión: 26/06."}
              className="min-h-32 w-full resize-y rounded-lg border border-slate-200 bg-slate-50/30 p-3 text-sm leading-6 outline-none focus:border-emerald-500 focus:bg-white"
            />
          </section>

          <div className="grid gap-4 lg:grid-cols-3">
            {([
              ["Estudiantes", students.length, "students" as ViewId, UserRound],
              ["Clases de orientación", orientation.length, "orientation" as ViewId, UsersRound],
              ["Documentos vinculados", documents.length, "documents" as ViewId, FolderOpen],
            ] as Array<[string, number, ViewId, LucideIcon]>).map(([label, count, view, Icon]) => (
              <button key={label} onClick={() => onNavigate(view)} className="tz-card flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 text-left">
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
                  <strong className="mt-2 block text-3xl font-bold text-slate-950">{count}</strong>
                </div>
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-slate-100 text-slate-600">
                  <Icon className="h-5 w-5" />
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function OrientationCycleView({
  store,
  onAddOrientationRecord,
  onUpdateOrientationRecord,
  onDeleteOrientationRecord,
  onOpenStudent,
  calendarEvents,
}: {
  store: DataStore;
  onAddOrientationRecord: (record: DataRecord) => void;
  onUpdateOrientationRecord: (recordId: string, updates: Record<string, string>) => void;
  onDeleteOrientationRecord: (recordId: string) => void;
  onOpenStudent: (studentId: string) => void;
  calendarEvents: CalendarEvent[];
}) {
  const [selectedOwner, setSelectedOwner] = useState(orientationOwners[0].name);
  const [innerTab, setInnerTab] = useState<"clases" | "nomina" | "cursos">("clases");
  const [filterCourse, setFilterCourse] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [expandedClassId, setExpandedClassId] = useState<string>("");
  const [newClassOpen, setNewClassOpen] = useState(false);
  const [newClassForm, setNewClassForm] = useState<Record<string, string>>({});

  const owner = orientationOwners.find((item) => item.name === selectedOwner) || orientationOwners[0];
  const today = new Date().toISOString().slice(0, 10);

  const ownerStoredClasses = store.orientation.filter((record) =>
    normalize(record.orientationOwner || "") === normalize(owner.name) ||
    owner.courses.some((course) => normalize(record.course || "") === normalize(course))
  );

  // Calendar events that look like orientation classes for one of this owner's
  // courses. We treat them as virtual class records (Planificada by default) so
  // they get counted and shown alongside the explicitly created ones.
  const calendarClasses: DataRecord[] = calendarEvents
    .map((ev) => {
      const match = matchOrientationEvent(ev.summary);
      if (!match.isOrientation) return null;
      const course = owner.courses.find((c) => normalize(c) === normalize(match.course)) || match.course;
      if (!course || !owner.courses.includes(course)) return null;
      const date = ev.start.slice(0, 10);
      return {
        id: `cal-${ev.start}-${normalize(ev.summary).slice(0, 30)}`,
        createdAt: ev.start,
        updatedAt: ev.start,
        date,
        course,
        orientationOwner: owner.name,
        topic: match.displayTitle,
        status: date < today ? "Realizada" : "Planificada",
        source: "calendar",
        canvaLink: ev.url || "",
        notes: ev.location || "",
      } as DataRecord;
    })
    .filter((r): r is DataRecord => r !== null);

  // Avoid double-counting if the orientador already has a stored class for the
  // same date+course (stored class wins).
  const calendarClassesFiltered = calendarClasses.filter(
    (cal) => !ownerStoredClasses.some((s) => (s.date || "") === cal.date && normalize(s.course || "") === normalize(cal.course)),
  );
  const ownerClasses: DataRecord[] = [...ownerStoredClasses, ...calendarClassesFiltered];

  const filteredClasses = ownerClasses.filter((record) => {
    if (filterCourse !== "all" && normalize(record.course || "") !== normalize(filterCourse)) return false;
    if (filterStatus !== "all" && (record.status || "") !== filterStatus) return false;
    return true;
  }).sort((a, b) => String(b.date || b.updatedAt).localeCompare(String(a.date || a.updatedAt)));

  const ownerStudents = store.students.filter((student) => owner.courses.includes(student.course || ""));
  const studentsByCourse = owner.courses.map((course) => ({
    course,
    students: ownerStudents
      .filter((student) => student.course === course)
      .sort((a, b) => (a.fullName || "").localeCompare(b.fullName || "", "es")),
  }));

  const classCounts = {
    realizadas: ownerClasses.filter((r) => r.status === "Realizada").length,
    planificadas: ownerClasses.filter((r) => r.status === "Planificada").length,
    pendientes: ownerClasses.filter((r) => r.status === "Pendiente" || !r.status).length,
  };

  const openNewClass = () => {
    setNewClassOpen(true);
    setNewClassForm({
      date: today,
      course: owner.courses[0] || "",
      orientationOwner: owner.name,
      topic: "",
      axis: "",
      status: "Planificada",
      canvaLink: "",
      planificacion: "",
      notes: "",
    });
  };

  const saveNewClass = () => {
    if (!newClassForm.topic?.trim() || !newClassForm.course?.trim()) return;
    onAddOrientationRecord({
      id: uid(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
      ...newClassForm,
    });
    setNewClassOpen(false);
    setNewClassForm({});
  };

  const exportOwnerClasses = () => {
    const headers = ["Fecha", "Curso", "Tema", "Eje", "Estado", "Enlace Canva", "Planificación", "Observaciones"];
    const rows = filteredClasses.map((record) => [
      record.date || "",
      record.course || "",
      record.topic || "",
      record.axis || "",
      record.status || "",
      record.canvaLink || record.evidence || "",
      (record.planificacion || "").replace(/\n/g, " "),
      (record.notes || "").replace(/\n/g, " "),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => (/[",;\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell)).join(","))
      .join("\n");
    downloadText(`orientacion-${normalize(owner.name).replace(/\s+/g, "-")}.csv`, csv, "text/csv;charset=utf-8");
  };

  const statusTone = (status: string) =>
    status === "Realizada" ? "bg-emerald-100 text-emerald-700 ring-emerald-200"
      : status === "Planificada" ? "bg-blue-100 text-blue-700 ring-blue-200"
      : status === "Reprogramada" ? "bg-amber-100 text-amber-700 ring-amber-200"
      : "bg-slate-100 text-slate-600 ring-slate-200";

  return (
    <div className="tz-fade">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Orientación</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Workspace por orientador/a: clases con link Canva y planificación, nómina de estudiantes y cursos a cargo.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportOwnerClasses} className="tz-press inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <ArrowDownToLine className="h-4 w-4" /> Exportar CSV
          </button>
          <button onClick={openNewClass} className="tz-press inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800">
            <Plus className="h-4 w-4" /> Nueva clase
          </button>
        </div>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-3">
        {orientationOwners.map((item) => {
          const active = item.name === selectedOwner;
          const itemClasses = store.orientation.filter((record) =>
            normalize(record.orientationOwner || "") === normalize(item.name) ||
            item.courses.some((course) => normalize(record.course || "") === normalize(course))
          );
          return (
            <button
              key={item.email}
              onClick={() => { setSelectedOwner(item.name); setFilterCourse("all"); setExpandedClassId(""); }}
              className={`tz-card relative overflow-hidden rounded-2xl border p-4 text-left ${
                active ? "border-slate-900 bg-slate-900 text-white shadow-lg" : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-base font-bold shadow-sm ${
                  active ? "bg-white/15 text-white" : `bg-gradient-to-br ${avatarTone(item.name)} text-white`
                }`}>
                  {initialsOf(item.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-[10px] font-semibold uppercase tracking-wider ${active ? "text-white/70" : "text-slate-500"}`}>{item.cycle}</p>
                  <h3 className={`truncate text-sm font-semibold ${active ? "text-white" : "text-slate-950"}`}>{item.name}</h3>
                  <p className={`mt-0.5 truncate text-[11px] ${active ? "text-white/70" : "text-slate-500"}`}>{item.role}</p>
                </div>
              </div>
              <div className={`mt-3 grid grid-cols-3 gap-2 text-center text-[11px] font-semibold ${active ? "text-white/90" : "text-slate-700"}`}>
                <div className={`rounded-lg px-2 py-1 ${active ? "bg-white/15" : "bg-slate-50"}`}>
                  <strong className="block text-base">{item.courses.length}</strong>
                  <span className={active ? "opacity-80" : "text-slate-500"}>cursos</span>
                </div>
                <div className={`rounded-lg px-2 py-1 ${active ? "bg-white/15" : "bg-slate-50"}`}>
                  <strong className="block text-base">{itemClasses.length}</strong>
                  <span className={active ? "opacity-80" : "text-slate-500"}>clases</span>
                </div>
                <div className={`rounded-lg px-2 py-1 ${active ? "bg-white/15" : "bg-slate-50"}`}>
                  <strong className="block text-base">{store.students.filter((s) => item.courses.includes(s.course || "")).length}</strong>
                  <span className={active ? "opacity-80" : "text-slate-500"}>estudiantes</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className={`bg-gradient-to-br ${avatarTone(owner.name)} px-6 py-5 text-white sm:px-8`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/85">{owner.role}</p>
              <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">{owner.name}</h2>
              <p className="mt-1 text-sm text-white/90">{owner.email} · Coord. convivencia: <strong>{owner.convivenciaCoordinator}</strong></p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
              {[
                ["Realizadas", classCounts.realizadas],
                ["Planificadas", classCounts.planificadas],
                ["Pendientes", classCounts.pendientes],
              ].map(([label, count]) => (
                <div key={String(label)} className="rounded-lg bg-white/15 px-3 py-2 backdrop-blur">
                  <div className="text-xl font-bold leading-none">{count}</div>
                  <div className="mt-1 opacity-85">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <nav className="flex gap-1 border-b border-slate-200 bg-white px-2 sm:px-6">
          {([
            ["clases", "Clases", ClipboardList],
            ["nomina", "Nómina", UsersRound],
            ["cursos", "Cursos a cargo", BookOpen],
          ] as Array<[typeof innerTab, string, LucideIcon]>).map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setInnerTab(id)}
              className={`relative inline-flex items-center gap-2 px-3 py-3 text-sm font-semibold transition ${innerTab === id ? "text-blue-700" : "text-slate-500 hover:text-slate-900"}`}
            >
              <Icon className="h-4 w-4" />
              {label}
              <span className={`absolute inset-x-3 bottom-0 h-0.5 rounded-full transition-all ${innerTab === id ? "bg-blue-600" : "bg-transparent"}`} />
            </button>
          ))}
        </nav>

        <div className="p-5 sm:p-6">
          {innerTab === "clases" ? (
            <>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <select value={filterCourse} onChange={(event) => setFilterCourse(event.target.value)} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500">
                  <option value="all">Todos los cursos</option>
                  {owner.courses.map((course) => <option key={course} value={course}>{course}</option>)}
                </select>
                <select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500">
                  <option value="all">Todos los estados</option>
                  {["Planificada", "Realizada", "Pendiente", "Reprogramada"].map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
                <span className="ml-auto text-xs font-semibold text-slate-500">{filteredClasses.length} clase{filteredClasses.length === 1 ? "" : "s"}</span>
              </div>

              {newClassOpen ? (
                <div className="tz-slide-up mb-4 rounded-xl border border-blue-200 bg-blue-50/60 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-semibold text-slate-950">Nueva clase de orientación</h4>
                    <button onClick={() => { setNewClassOpen(false); setNewClassForm({}); }} className="rounded-md p-1.5 text-slate-500 hover:bg-white">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <label className="block">
                      <span className="text-xs font-semibold text-slate-700">Fecha</span>
                      <input type="date" value={newClassForm.date || ""} onChange={(event) => setNewClassForm((form) => ({ ...form, date: event.target.value }))} className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-500" />
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold text-slate-700">Curso *</span>
                      <select value={newClassForm.course || ""} onChange={(event) => setNewClassForm((form) => ({ ...form, course: event.target.value }))} className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-500">
                        <option value="">Seleccionar</option>
                        {owner.courses.map((course) => <option key={course} value={course}>{course}</option>)}
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold text-slate-700">Estado</span>
                      <select value={newClassForm.status || ""} onChange={(event) => setNewClassForm((form) => ({ ...form, status: event.target.value }))} className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-500">
                        {["Planificada", "Realizada", "Pendiente", "Reprogramada"].map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="text-xs font-semibold text-slate-700">Tema / nombre de la clase *</span>
                      <input value={newClassForm.topic || ""} onChange={(event) => setNewClassForm((form) => ({ ...form, topic: event.target.value }))} placeholder="Ej.: Autoconcepto y autoestima" className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-500" />
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold text-slate-700">Eje</span>
                      <input value={newClassForm.axis || ""} onChange={(event) => setNewClassForm((form) => ({ ...form, axis: event.target.value }))} placeholder="Ej.: Crecimiento personal" className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-500" />
                    </label>
                    <label className="block sm:col-span-2 lg:col-span-3">
                      <span className="text-xs font-semibold text-slate-700">Enlace Canva</span>
                      <input value={newClassForm.canvaLink || ""} onChange={(event) => setNewClassForm((form) => ({ ...form, canvaLink: event.target.value }))} placeholder="https://www.canva.com/design/..." className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-500" />
                    </label>
                    <label className="block sm:col-span-2 lg:col-span-3">
                      <span className="text-xs font-semibold text-slate-700">Planificación</span>
                      <textarea value={newClassForm.planificacion || ""} onChange={(event) => setNewClassForm((form) => ({ ...form, planificacion: event.target.value }))} placeholder="Objetivos, actividades, recursos, evaluación..." className="mt-1 min-h-24 w-full resize-y rounded-md border border-slate-200 bg-white p-2.5 text-sm outline-none focus:border-blue-500" />
                    </label>
                  </div>
                  <div className="mt-3 flex justify-end gap-2">
                    <button onClick={() => { setNewClassOpen(false); setNewClassForm({}); }} className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancelar</button>
                    <button onClick={saveNewClass} disabled={!newClassForm.topic?.trim() || !newClassForm.course?.trim()} className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300">
                      <Save className="h-4 w-4" /> Guardar clase
                    </button>
                  </div>
                </div>
              ) : null}

              {filteredClasses.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                  <ClipboardList className="mx-auto h-8 w-8 text-slate-400" />
                  <p className="mt-3 text-sm text-slate-600">No hay clases registradas con esos filtros.</p>
                  <button onClick={openNewClass} className="mt-4 inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                    <Plus className="h-4 w-4" /> Crear la primera clase
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredClasses.map((record) => {
                    const expanded = expandedClassId === record.id;
                    const canvaUrl = record.canvaLink || record.evidence || "";
                    return (
                      <article key={record.id} className={`tz-card rounded-xl border bg-white transition ${expanded ? "border-blue-300 shadow-md" : "border-slate-200"}`}>
                        <button
                          onClick={() => setExpandedClassId(expanded ? "" : record.id)}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left"
                        >
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                            {record.date ? new Date(record.date).getDate() : "—"}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-950">{record.topic || "Clase sin tema"}</p>
                            <p className="truncate text-xs text-slate-500">{record.course || "Sin curso"} · {record.axis || "Sin eje"}</p>
                          </div>
                          <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ring-1 ${statusTone(record.status || "")}`}>
                            {record.status || "Pendiente"}
                          </span>
                          {canvaUrl ? (
                            <span
                              role="button"
                              tabIndex={0}
                              onClick={(event) => { event.stopPropagation(); window.open(canvaUrl, "_blank", "noopener,noreferrer"); }}
                              className="hidden cursor-pointer items-center gap-1 rounded-md bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-700 ring-1 ring-violet-200 hover:bg-violet-100 sm:inline-flex"
                            >
                              Canva ↗
                            </span>
                          ) : null}
                          <ChevronDown className={`h-4 w-4 text-slate-400 transition ${expanded ? "rotate-180" : ""}`} />
                        </button>

                        {expanded ? (
                          <div className="border-t border-slate-100 p-4">
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                              <label className="block">
                                <span className="text-xs font-semibold text-slate-700">Fecha</span>
                                <input type="date" value={record.date || ""} onChange={(event) => onUpdateOrientationRecord(record.id, { date: event.target.value })} className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-500" />
                              </label>
                              <label className="block">
                                <span className="text-xs font-semibold text-slate-700">Curso</span>
                                <select value={record.course || ""} onChange={(event) => onUpdateOrientationRecord(record.id, { course: event.target.value })} className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-500">
                                  {owner.courses.map((course) => <option key={course} value={course}>{course}</option>)}
                                </select>
                              </label>
                              <label className="block">
                                <span className="text-xs font-semibold text-slate-700">Estado</span>
                                <select value={record.status || ""} onChange={(event) => onUpdateOrientationRecord(record.id, { status: event.target.value })} className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-500">
                                  {["Planificada", "Realizada", "Pendiente", "Reprogramada"].map((status) => <option key={status} value={status}>{status}</option>)}
                                </select>
                              </label>
                              <label className="block sm:col-span-2">
                                <span className="text-xs font-semibold text-slate-700">Tema / nombre de la clase</span>
                                <input value={record.topic || ""} onChange={(event) => onUpdateOrientationRecord(record.id, { topic: event.target.value })} className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-500" />
                              </label>
                              <label className="block">
                                <span className="text-xs font-semibold text-slate-700">Eje</span>
                                <input value={record.axis || ""} onChange={(event) => onUpdateOrientationRecord(record.id, { axis: event.target.value })} className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-500" />
                              </label>
                              <label className="block sm:col-span-2 lg:col-span-3">
                                <span className="flex items-center gap-2 text-xs font-semibold text-violet-700">
                                  Enlace Canva
                                  {canvaUrl ? (
                                    <a href={canvaUrl} target="_blank" rel="noopener noreferrer" className="ml-auto text-[10px] font-semibold text-violet-600 hover:underline">Abrir ↗</a>
                                  ) : null}
                                </span>
                                <input value={record.canvaLink || record.evidence || ""} onChange={(event) => onUpdateOrientationRecord(record.id, { canvaLink: event.target.value })} placeholder="https://www.canva.com/design/..." className="mt-1 w-full rounded-md border border-violet-200 bg-violet-50/40 px-2.5 py-2 text-sm outline-none focus:border-violet-500" />
                              </label>
                              <label className="block sm:col-span-2 lg:col-span-3">
                                <span className="text-xs font-semibold text-slate-700">Planificación</span>
                                <textarea value={record.planificacion || ""} onChange={(event) => onUpdateOrientationRecord(record.id, { planificacion: event.target.value })} placeholder="Objetivos de aprendizaje, actividades, recursos, evaluación..." className="mt-1 min-h-28 w-full resize-y rounded-md border border-slate-200 bg-white p-2.5 text-sm leading-6 outline-none focus:border-blue-500" />
                              </label>
                              <label className="block sm:col-span-2 lg:col-span-3">
                                <span className="text-xs font-semibold text-slate-700">Observaciones</span>
                                <textarea value={record.notes || ""} onChange={(event) => onUpdateOrientationRecord(record.id, { notes: event.target.value })} className="mt-1 min-h-20 w-full resize-y rounded-md border border-slate-200 bg-white p-2.5 text-sm outline-none focus:border-blue-500" />
                              </label>
                            </div>
                            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                              <p className="text-[11px] text-slate-400">Actualizado {new Date(record.updatedAt).toLocaleString("es-CL")}</p>
                              <div className="flex gap-2">
                                {canvaUrl ? (
                                  <a href={canvaUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-md border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 hover:bg-violet-100">
                                    Abrir en Canva ↗
                                  </a>
                                ) : null}
                                <button
                                  onClick={() => onAddOrientationRecord({
                                    ...record,
                                    id: uid(),
                                    createdAt: nowIso(),
                                    updatedAt: nowIso(),
                                    status: "Planificada",
                                    topic: `${record.topic || "Clase"} (copia)`,
                                  })}
                                  className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                  <Copy className="h-3.5 w-3.5" /> Duplicar
                                </button>
                                <button onClick={() => { if (window.confirm("¿Eliminar esta clase?")) onDeleteOrientationRecord(record.id); }} className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">
                                  <Trash2 className="h-3.5 w-3.5" /> Eliminar
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              )}
            </>
          ) : null}

          {innerTab === "nomina" ? (
            <div className="space-y-5">
              {studentsByCourse.every((group) => group.students.length === 0) ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-500">
                  No hay estudiantes en los cursos de {owner.name.split(" ")[0]} todavía.
                </div>
              ) : studentsByCourse.map((group) => group.students.length === 0 ? null : (
                <section key={group.course} className="overflow-hidden rounded-xl border border-slate-200">
                  <header className="flex items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white px-4 py-3">
                    <h3 className="text-sm font-semibold text-slate-950">{group.course}</h3>
                    <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[11px] font-semibold text-white tabular-nums">{group.students.length}</span>
                  </header>
                  <ol className="divide-y divide-slate-100">
                    {group.students.map((student, index) => (
                      <li key={student.id}>
                        <button
                          onClick={() => onOpenStudent(student.id)}
                          className="group flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-blue-50/50"
                        >
                          <span className="w-6 shrink-0 text-right text-[11px] font-semibold text-slate-400 tabular-nums">{index + 1}</span>
                          <div className={`grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br ${avatarTone(student.id)} text-[10px] font-bold text-white`}>
                            {student.profilePhoto ? (
                              <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${student.profilePhoto})` }} />
                            ) : (
                              initialsOf(student.fullName)
                            )}
                          </div>
                          <span className="flex-1 truncate text-sm font-semibold text-slate-900 group-hover:text-blue-700">{student.fullName || "Sin nombre"}</span>
                          <span className="hidden text-[11px] text-slate-500 sm:inline">{student.rut || ""}</span>
                          {student.healthAlerts ? <span className="rounded-full bg-rose-50 px-1.5 py-0.5 text-[9px] font-semibold text-rose-700" title={student.healthAlerts}>⚠</span> : null}
                          <ChevronDown className="-rotate-90 h-3.5 w-3.5 text-slate-300 group-hover:text-blue-500" />
                        </button>
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>
          ) : null}

          {innerTab === "cursos" ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {owner.courses.map((course) => {
                const count = store.students.filter((s) => s.course === course).length;
                const classes = ownerClasses.filter((rec) => rec.course === course).length;
                return (
                  <article key={course} className="tz-card rounded-xl border border-slate-200 bg-white p-4">
                    <div className={`mb-3 grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br ${avatarTone(course)} text-xs font-bold text-white shadow-sm`}>
                      {course.split(" ").slice(0, 2).map((part) => part[0] || "").join("").toUpperCase()}
                    </div>
                    <h4 className="text-sm font-semibold text-slate-950">{course}</h4>
                    <p className="mt-1 text-xs text-slate-500">{count} estudiantes · {classes} clases</p>
                  </article>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function GenogramChart({
  student,
  members,
  selectedMemberId,
  onSelectMember,
}: {
  student: DataRecord;
  members: GenogramMember[];
  selectedMemberId: string;
  onSelectMember: (memberId: string) => void;
}) {
  const primary = members.filter((member) => ["Madre", "Padre", "Cuidador/a principal", "Apoderado/a", "Tutor/a legal"].includes(member.relation));
  const siblings = members.filter((member) => member.relation === "Hermano/a");
  const support = members.filter((member) => !primary.includes(member) && !siblings.includes(member));
  const memberCard = (member: GenogramMember, x: number, y: number, width: number, height: number, tone = "white") => (
    <g key={member.id} onClick={() => onSelectMember(member.id)} className="cursor-pointer">
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="12"
        className={`${tone === "blue" ? "fill-blue-50 stroke-blue-200" : "fill-white stroke-slate-300"} ${selectedMemberId === member.id ? "stroke-blue-500" : ""}`}
        strokeWidth={selectedMemberId === member.id ? 3 : 1}
        filter="url(#genogramShadow)"
      />
      <text x={x + width / 2} y={y + 29} textAnchor="middle" className="fill-slate-950 text-[12px] font-semibold">{member.name}</text>
      <text x={x + width / 2} y={y + 50} textAnchor="middle" className="fill-slate-500 text-[10px]">{member.relation}</text>
      <text x={x + width / 2} y={y + 68} textAnchor="middle" className="fill-slate-500 text-[10px]">{member.role}</text>
    </g>
  );

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4">
      <svg viewBox="0 0 960 560" className="min-h-[440px] w-full min-w-[820px]" role="img" aria-label={`Genograma de ${student.fullName || "estudiante"}`}>
        <defs>
          <filter id="genogramShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#0f172a" floodOpacity="0.10" />
          </filter>
        </defs>
        <line x1="480" y1="270" x2="480" y2="330" className="stroke-slate-300" strokeWidth="2" />
        <rect x="360" y="320" width="240" height="88" rx="14" className="fill-slate-900" filter="url(#genogramShadow)" />
        <text x="480" y="354" textAnchor="middle" className="fill-white text-[15px] font-bold">{student.fullName || "Estudiante"}</text>
        <text x="480" y="378" textAnchor="middle" className="fill-slate-300 text-[12px]">{student.course || "Sin curso"}</text>

        {primary.slice(0, 4).map((member, index) => {
          const x = 80 + index * 220;
          return (
            <g key={member.id}>
              <line x1={x + 85} y1="185" x2="480" y2="270" className="stroke-slate-300" strokeWidth="2" />
              {memberCard(member, x, 95, 170, 92)}
            </g>
          );
        })}

        {siblings.slice(0, 4).map((member, index) => {
          const x = 90 + index * 180;
          return (
            <g key={member.id}>
              <line x1="480" y1="395" x2={x + 70} y2="455" className="stroke-slate-300" strokeWidth="2" />
              {memberCard(member, x, 430, 140, 74)}
            </g>
          );
        })}

        {support.slice(0, 4).map((member, index) => {
          const y = 190 + index * 78;
          return (
            <g key={member.id}>
              <line x1="600" y1="360" x2="745" y2={y + 34} className="stroke-blue-300" strokeDasharray="6 6" strokeWidth="2" />
              {memberCard(member, 720, y, 170, 68, "blue")}
            </g>
          );
        })}

        {members.length === 0 ? (
          <text x="480" y="120" textAnchor="middle" className="fill-slate-500 text-[14px]">Agrega familiares o redes para construir el genograma.</text>
        ) : null}
      </svg>
      <p className="mt-3 text-xs text-slate-500">Haz clic en cualquier nombre del genograma para editar datos de contacto y vinculo.</p>
    </div>
  );
}

function LinkedRecordList({ title, records, emptyText }: { title: string; records: DataRecord[]; emptyText: string }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">{title}</h3>
        <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[11px] font-semibold text-white tabular-nums">{records.length}</span>
      </div>
      {records.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500">{emptyText}</p>
      ) : (
        <div className="space-y-2">
          {records.map((record) => {
            const status = record.status || record.priority || "";
            const statusTone = /critic|alta|abierto|activ/i.test(status)
              ? "bg-amber-50 text-amber-700 ring-amber-200"
              : /cerrad|realizad|complet/i.test(status)
                ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                : "bg-slate-100 text-slate-600 ring-slate-200";
            return (
              <article key={record.id} className="tz-card group rounded-lg border border-slate-200 bg-white p-3 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <strong className="block flex-1 text-slate-950">{record.title || record.reason || record.topic || record.type || record.student || record.relatedTo || "Registro"}</strong>
                  {status ? <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${statusTone}`}>{status}</span> : null}
                </div>
                {(record.description || record.agreements || record.observations || record.notes) ? (
                  <p className="mt-1.5 line-clamp-2 text-slate-600">{record.description || record.agreements || record.observations || record.notes}</p>
                ) : null}
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {record.date || record.dueDate || new Date(record.updatedAt).toLocaleDateString("es-CL")}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

type QuickAddKind = "cases" | "interviews" | "logs" | "documents" | "protocols";

function CaseWithInterventions({
  caseRecord,
  onUpdateCase,
  currentUserName,
}: {
  caseRecord: DataRecord;
  onUpdateCase: (caseId: string, updates: Record<string, string>) => void;
  currentUserName: string;
}) {
  const interventions = parseInterventions(caseRecord.interventions);
  const [expanded, setExpanded] = useState(false);
  const [adding, setAdding] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({ date: today, action: "", by: currentUserName, outcome: "" });

  const latest = interventions.length > 0 ? interventions[interventions.length - 1] : null;
  const status = caseRecord.status || "";
  const priority = caseRecord.priority || "";

  const statusTone = /cerrad/i.test(status)
    ? "bg-emerald-100 text-emerald-700 ring-emerald-200"
    : /seguimiento/i.test(status)
      ? "bg-blue-100 text-blue-700 ring-blue-200"
      : /derivad/i.test(status)
        ? "bg-violet-100 text-violet-700 ring-violet-200"
        : /abierto|activ/i.test(status)
          ? "bg-amber-100 text-amber-700 ring-amber-200"
          : "bg-slate-100 text-slate-600 ring-slate-200";

  const priorityTone = /critic/i.test(priority)
    ? "bg-rose-100 text-rose-700 ring-rose-200"
    : /alta/i.test(priority)
      ? "bg-amber-100 text-amber-700 ring-amber-200"
      : /media/i.test(priority)
        ? "bg-blue-100 text-blue-700 ring-blue-200"
        : /baja/i.test(priority)
          ? "bg-slate-100 text-slate-600 ring-slate-200"
          : "";

  const saveIntervention = () => {
    if (!form.action.trim()) return;
    const next: CaseIntervention[] = [
      ...interventions,
      { id: uid(), date: form.date || today, action: form.action.trim(), by: form.by.trim(), outcome: form.outcome.trim() },
    ];
    onUpdateCase(caseRecord.id, { interventions: JSON.stringify(next) });
    setForm({ date: today, action: "", by: currentUserName, outcome: "" });
    setAdding(false);
    setExpanded(true);
  };

  const removeIntervention = (id: string) => {
    const next = interventions.filter((i) => i.id !== id);
    onUpdateCase(caseRecord.id, { interventions: JSON.stringify(next) });
  };

  return (
    <article className="tz-card rounded-xl border border-slate-200 bg-white p-4">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {status ? <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${statusTone}`}>{status}</span> : null}
            {priority ? <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${priorityTone}`}>{priority}</span> : null}
            {caseRecord.category ? <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">{caseRecord.category}</span> : null}
          </div>
          <h4 className="mt-1 text-sm font-semibold text-slate-950">{caseRecord.title || "Caso"}</h4>
          {caseRecord.description ? <p className="mt-1 line-clamp-2 text-xs text-slate-600">{caseRecord.description}</p> : null}
        </div>
        <select
          value={status}
          onChange={(event) => onUpdateCase(caseRecord.id, { status: event.target.value })}
          className="shrink-0 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs outline-none focus:border-blue-500"
        >
          <option value="">Sin estado</option>
          <option>Abierto</option>
          <option>En seguimiento</option>
          <option>Derivado</option>
          <option>Cerrado</option>
        </select>
      </header>

      <div className="mt-3 rounded-lg bg-slate-50 p-2.5 text-xs">
        {latest ? (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Última intervención · {latest.date}{latest.by ? ` · ${latest.by}` : ""}</p>
            <p className="mt-0.5 text-slate-800">{latest.action}</p>
            {latest.outcome ? <p className="mt-0.5 italic text-slate-600">→ {latest.outcome}</p> : null}
          </div>
        ) : (
          <p className="text-center text-slate-500">Sin intervenciones registradas aún.</p>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={() => setExpanded((v) => !v)}
          disabled={interventions.length === 0}
          className="text-[11px] font-semibold text-blue-600 hover:underline disabled:cursor-default disabled:text-slate-400 disabled:no-underline"
        >
          {interventions.length === 0
            ? "Sin historial"
            : expanded
              ? "Ocultar historial"
              : `Ver ${interventions.length} intervención${interventions.length === 1 ? "" : "es"}`}
        </button>
        <button
          onClick={() => { setAdding(true); setExpanded(true); }}
          className="tz-press inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-slate-800"
        >
          <Plus className="h-3 w-3" /> Agregar intervención
        </button>
      </div>

      {expanded ? (
        <div className="tz-slide-up mt-3 space-y-2 border-t border-slate-100 pt-3">
          {adding ? (
            <div className="rounded-lg border border-blue-200 bg-blue-50/40 p-3">
              <div className="grid gap-2 sm:grid-cols-[120px_1fr_140px]">
                <input type="date" value={form.date} onChange={(event) => setForm((f) => ({ ...f, date: event.target.value }))} className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-blue-500" />
                <input value={form.action} onChange={(event) => setForm((f) => ({ ...f, action: event.target.value }))} placeholder="Acción / intervención (ej.: Entrevista con apoderada, derivación a psicología…)" className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-blue-500" />
                <input value={form.by} onChange={(event) => setForm((f) => ({ ...f, by: event.target.value }))} placeholder="Responsable" className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-blue-500" />
              </div>
              <input value={form.outcome} onChange={(event) => setForm((f) => ({ ...f, outcome: event.target.value }))} placeholder="Resultado o acuerdos (opcional)" className="mt-2 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-blue-500" />
              <div className="mt-2 flex justify-end gap-2">
                <button onClick={() => { setAdding(false); setForm({ date: today, action: "", by: currentUserName, outcome: "" }); }} className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50">Cancelar</button>
                <button onClick={saveIntervention} disabled={!form.action.trim()} className="rounded-md bg-blue-600 px-2 py-1 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50">Guardar</button>
              </div>
            </div>
          ) : null}
          {interventions.length > 0 ? (
            <ol className="space-y-1.5">
              {[...interventions].reverse().map((iv) => (
                <li key={iv.id} className="group flex gap-3 rounded-lg border border-slate-200 px-3 py-2 text-xs">
                  <div className="grid h-10 w-12 shrink-0 place-items-center rounded-md bg-slate-100 text-center text-[10px] font-bold text-slate-700">
                    {iv.date ? new Date(iv.date).toLocaleDateString("es-CL", { day: "2-digit", month: "short" }) : "—"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900">{iv.action}</p>
                    {iv.outcome ? <p className="text-slate-600">→ {iv.outcome}</p> : null}
                    {iv.by ? <p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-400">por {iv.by}</p> : null}
                  </div>
                  <button onClick={() => removeIntervention(iv.id)} className="rounded p-1 text-slate-300 opacity-0 transition group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-600">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function StudentDetailDialog({
  student,
  store,
  onClose,
  onUpdateStudent,
  onUpdateCase,
  onAddRecord,
  onNavigate,
  focusField,
  currentUserName,
}: {
  student: DataRecord;
  store: DataStore;
  onClose: () => void;
  onUpdateStudent: (studentId: string, updates: Record<string, string>) => void;
  onUpdateCase: (caseId: string, updates: Record<string, string>) => void;
  onAddRecord: (entity: EntityId, record: DataRecord) => void;
  onNavigate?: (view: ViewId) => void;
  focusField?: string;
  currentUserName?: string;
}) {
  const [activeTab, setActiveTab] = useState<"resumen" | "familia" | "casos" | "entrevistas" | "bitacoras" | "documentos">("resumen");
  const [highlightField, setHighlightField] = useState<string>("");
  const fieldRefs = React.useRef<Record<string, HTMLTextAreaElement | HTMLInputElement | null>>({});

  useEffect(() => {
    if (!focusField) return;
    setActiveTab("resumen");
    setHighlightField(focusField);
    const timer = window.setTimeout(() => {
      const el = fieldRefs.current[focusField];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus({ preventScroll: true });
      }
    }, 240);
    const stopHighlight = window.setTimeout(() => setHighlightField(""), 2400);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(stopHighlight);
    };
  }, [focusField]);
  const [editingMemberId, setEditingMemberId] = useState("");
  const emptyGenogramForm = { name: "", relation: "Madre", role: "Vive con el estudiante", age: "", phone: "", email: "", address: "", notes: "" };
  const [genogramForm, setGenogramForm] = useState(emptyGenogramForm);
  const [quickAddOpen, setQuickAddOpen] = useState<QuickAddKind | "">("");
  const [quickAddForm, setQuickAddForm] = useState<Record<string, string>>({});

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const genogram = parseGenogram(student.genogram);
  const cases = store.cases.filter((record) => studentMatches(record, student));
  const courseCases = store.cases.filter((record) => !studentMatches(record, student) && courseMatches(record, student.course || ""));
  const logs = store.logs.filter((record) => studentMatches(record, student));
  const interviews = store.interviews.filter((record) => studentMatches(record, student));
  const protocols = store.protocols.filter((record) => studentMatches(record, student));
  const documents = store.documents.filter((record) => studentMatches(record, student) || normalize(record.relatedTo || "").includes(normalize(student.fullName || "")));
  const timeline = [...cases, ...logs, ...interviews, ...protocols, ...documents].sort((a, b) => String(b.date || b.updatedAt).localeCompare(String(a.date || a.updatedAt)));
  const editingMember = genogram.find((member) => member.id === editingMemberId);

  const updateInfo = (key: string, value: string) => onUpdateStudent(student.id, { [key]: value });

  const editGenogramMember = (memberId: string) => {
    const member = genogram.find((item) => item.id === memberId);
    if (!member) return;
    setEditingMemberId(memberId);
    setGenogramForm({
      name: member.name || "",
      relation: member.relation || "Madre",
      role: member.role || "Vive con el estudiante",
      age: member.age || "",
      phone: member.phone || "",
      email: member.email || "",
      address: member.address || "",
      notes: member.notes || "",
    });
  };

  const saveGenogramMember = () => {
    if (!genogramForm.name.trim()) return;
    const member: GenogramMember = {
      id: editingMemberId || uid(),
      name: genogramForm.name.trim(),
      relation: genogramForm.relation,
      role: genogramForm.role,
      age: genogramForm.age.trim(),
      phone: genogramForm.phone.trim(),
      email: genogramForm.email.trim(),
      address: genogramForm.address.trim(),
      notes: genogramForm.notes.trim(),
    };
    const nextGenogram = editingMemberId ? genogram.map((item) => (item.id === editingMemberId ? member : item)) : [...genogram, member];
    onUpdateStudent(student.id, { genogram: JSON.stringify(nextGenogram) });
    setEditingMemberId("");
    setGenogramForm(emptyGenogramForm);
  };

  const removeGenogramMember = (memberId: string) => {
    onUpdateStudent(student.id, { genogram: JSON.stringify(genogram.filter((member) => member.id !== memberId)) });
    if (editingMemberId === memberId) {
      setEditingMemberId("");
      setGenogramForm(emptyGenogramForm);
    }
  };

  const handlePhoto = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onUpdateStudent(student.id, { profilePhoto: String(reader.result || "") });
    reader.readAsDataURL(file);
  };

  const openQuickAdd = (kind: QuickAddKind) => {
    setQuickAddOpen(kind);
    const today = new Date().toISOString().slice(0, 10);
    const baseLink = { student: student.fullName || "", course: student.course || "" };
    if (kind === "cases") setQuickAddForm({ ...baseLink, title: "", category: "Socioemocional", priority: "Media", status: "Abierto", description: "" });
    if (kind === "interviews") setQuickAddForm({ date: today, participant: "", student: baseLink.student, reason: "", status: "Agendada", agreements: "" });
    if (kind === "logs") setQuickAddForm({ date: today, ...baseLink, type: "Seguimiento", description: "", agreements: "" });
    if (kind === "documents") setQuickAddForm({ title: "", folder: "", confidentiality: "Interno", relatedTo: baseLink.student, url: "", notes: "" });
    if (kind === "protocols") setQuickAddForm({ title: "", student: baseLink.student, status: "Activado", dueDate: today, responsible: "", notes: "" });
  };

  const submitQuickAdd = () => {
    if (!quickAddOpen) return;
    const entity = entityConfigs[quickAddOpen];
    const missing = entity.fields.filter((field) => field.required && !quickAddForm[field.key]?.trim());
    if (missing.length) return;
    const record: DataRecord = { id: uid(), createdAt: nowIso(), updatedAt: nowIso(), ...quickAddForm };
    onAddRecord(quickAddOpen, record);
    setQuickAddOpen("");
    setQuickAddForm({});
  };

  const tabs: Array<{ id: typeof activeTab; label: string; badge?: number; icon: LucideIcon }> = [
    { id: "resumen", label: "Resumen", icon: UserRound },
    { id: "familia", label: "Familia", icon: UsersRound, badge: genogram.length || undefined },
    { id: "casos", label: "Casos", icon: FileText, badge: cases.length || undefined },
    { id: "entrevistas", label: "Entrevistas", icon: MessageSquareText, badge: interviews.length || undefined },
    { id: "bitacoras", label: "Bitácoras", icon: ClipboardList, badge: logs.length || undefined },
    { id: "documentos", label: "Documentos", icon: FolderOpen, badge: (documents.length || 0) + (protocols.length || 0) || undefined },
  ];

  const renderQuickAddForm = () => {
    if (!quickAddOpen) return null;
    const fields: Array<{ key: string; label: string; type?: "textarea" | "date" | "select"; options?: string[]; full?: boolean; required?: boolean }> = (() => {
      if (quickAddOpen === "cases") return [
        { key: "title", label: "Motivo / título", required: true },
        { key: "category", label: "Categoría", type: "select", options: ["Convivencia", "Socioemocional", "Académico", "Asistencia", "Familiar", "PIE/NEE", "Otro"] },
        { key: "priority", label: "Prioridad", type: "select", options: ["Baja", "Media", "Alta", "Crítica"] },
        { key: "status", label: "Estado", type: "select", options: ["Abierto", "En seguimiento", "Derivado", "Cerrado"] },
        { key: "description", label: "Descripción", type: "textarea", full: true },
      ];
      if (quickAddOpen === "interviews") return [
        { key: "date", label: "Fecha", type: "date", required: true },
        { key: "participant", label: "Participante", required: true },
        { key: "reason", label: "Motivo", required: true, full: true },
        { key: "status", label: "Estado", type: "select", options: ["Agendada", "Realizada", "Reprogramada", "Cerrada"] },
        { key: "agreements", label: "Acuerdos", type: "textarea", full: true },
      ];
      if (quickAddOpen === "logs") return [
        { key: "date", label: "Fecha", type: "date", required: true },
        { key: "type", label: "Tipo", type: "select", options: ["Seguimiento", "Entrevista", "Observación", "Crisis", "Coordinación", "Otro"] },
        { key: "description", label: "Descripción", type: "textarea", required: true, full: true },
        { key: "agreements", label: "Acuerdos", type: "textarea", full: true },
      ];
      if (quickAddOpen === "documents") return [
        { key: "title", label: "Nombre del documento", required: true },
        { key: "folder", label: "Carpeta" },
        { key: "confidentiality", label: "Confidencialidad", type: "select", options: ["Interno", "Reservado", "Confidencial", "Altamente sensible"] },
        { key: "url", label: "Enlace", full: true },
        { key: "notes", label: "Notas", type: "textarea", full: true },
      ];
      if (quickAddOpen === "protocols") return [
        { key: "title", label: "Protocolo / derivación", required: true },
        { key: "status", label: "Estado", type: "select", options: ["Activado", "En análisis", "En seguimiento", "Cerrado"] },
        { key: "dueDate", label: "Plazo", type: "date" },
        { key: "responsible", label: "Responsable" },
        { key: "notes", label: "Notas", type: "textarea", full: true },
      ];
      return [];
    })();
    const titles: Record<QuickAddKind, string> = {
      cases: "Nuevo caso",
      interviews: "Nueva entrevista",
      logs: "Nueva bitácora",
      documents: "Nuevo documento",
      protocols: "Nuevo protocolo",
    };
    return (
      <div className="tz-slide-up rounded-xl border border-blue-200 bg-blue-50/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="font-semibold text-slate-950">{titles[quickAddOpen]} — {student.fullName}</h4>
          <button onClick={() => { setQuickAddOpen(""); setQuickAddForm({}); }} className="rounded-md p-1.5 text-slate-500 hover:bg-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {fields.map((field) => (
            <label key={field.key} className={field.full ? "block sm:col-span-2" : "block"}>
              <span className="text-xs font-semibold text-slate-700">{field.label}{field.required ? " *" : ""}</span>
              {field.type === "textarea" ? (
                <textarea
                  value={quickAddForm[field.key] || ""}
                  onChange={(event) => setQuickAddForm((form) => ({ ...form, [field.key]: event.target.value }))}
                  className="mt-1.5 min-h-24 w-full resize-y rounded-md border border-slate-200 bg-white p-2.5 text-sm outline-none focus:border-blue-500"
                />
              ) : field.type === "select" ? (
                <select
                  value={quickAddForm[field.key] || ""}
                  onChange={(event) => setQuickAddForm((form) => ({ ...form, [field.key]: event.target.value }))}
                  className="mt-1.5 w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-500"
                >
                  <option value="">Seleccionar</option>
                  {field.options?.map((option) => <option key={option}>{option}</option>)}
                </select>
              ) : (
                <input
                  type={field.type === "date" ? "date" : "text"}
                  value={quickAddForm[field.key] || ""}
                  onChange={(event) => setQuickAddForm((form) => ({ ...form, [field.key]: event.target.value }))}
                  className="mt-1.5 w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-500"
                />
              )}
            </label>
          ))}
        </div>
        <div className="mt-3 flex justify-end gap-2">
          <button onClick={() => { setQuickAddOpen(""); setQuickAddForm({}); }} className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancelar</button>
          <button onClick={submitQuickAdd} className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-800">
            <Save className="h-4 w-4" /> Guardar
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="tz-backdrop fixed inset-0 z-50 grid bg-slate-950/45 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="tz-pop tz-print-root m-auto flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="relative">
          <div className={`bg-gradient-to-br ${avatarTone(student.id)} px-6 pt-5 pb-6 text-white sm:px-8`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/85">
                <BookOpen className="h-3.5 w-3.5" />
                {student.course || "Sin curso"}
              </div>
              <button onClick={onClose} aria-label="Cerrar" className="rounded-md p-1.5 text-white/90 hover:bg-white/20">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="border-b border-slate-200 bg-white px-6 pt-5 pb-5 sm:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <label className="group relative -mt-16 inline-block h-24 w-24 shrink-0 cursor-pointer sm:-mt-20">
                <span className="block h-full w-full overflow-hidden rounded-2xl bg-white ring-4 ring-white shadow-lg">
                  {student.profilePhoto ? (
                    <span className="block h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${student.profilePhoto})` }} />
                  ) : (
                    <span className={`grid h-full w-full place-items-center bg-gradient-to-br ${avatarTone(student.id)} text-2xl font-bold text-white`}>
                      {initialsOf(student.fullName) || <UserRound className="h-10 w-10 opacity-80" />}
                    </span>
                  )}
                </span>
                <span className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full bg-slate-900 text-white ring-2 ring-white shadow-md transition group-hover:scale-110">
                  <Camera className="h-4 w-4" />
                </span>
                <span className="pointer-events-none absolute inset-0 grid place-items-center rounded-2xl bg-slate-950/50 text-[11px] font-semibold uppercase tracking-wider text-white opacity-0 transition group-hover:opacity-100">
                  Cambiar foto
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={(event) => handlePhoto(event.target.files?.[0])} />
              </label>
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-3xl">{student.fullName || "Estudiante"}</h2>
                <p className="mt-1 text-sm text-slate-600">{student.rut || "Sin RUT/ID"}{student.guardian ? ` · Apoderado/a: ${student.guardian}` : ""}</p>
                <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                  {student.phone ? <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">{student.phone}</span> : null}
                  {student.email ? <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">{student.email}</span> : null}
                  {student.healthAlerts ? (
                    <button
                      onClick={() => {
                        setActiveTab("resumen");
                        setHighlightField("healthAlerts");
                        window.setTimeout(() => {
                          const el = fieldRefs.current.healthAlerts;
                          el?.scrollIntoView({ behavior: "smooth", block: "center" });
                          el?.focus({ preventScroll: true });
                        }, 60);
                        window.setTimeout(() => setHighlightField(""), 2400);
                      }}
                      className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 font-semibold text-rose-700 ring-1 ring-rose-200 transition hover:bg-rose-100"
                    >
                      <ShieldCheck className="h-3 w-3" /> Alerta de salud
                    </button>
                  ) : null}
                  {cases.length ? <span className="rounded-full bg-amber-50 px-2.5 py-1 font-semibold text-amber-700">{cases.length} caso{cases.length === 1 ? "" : "s"}</span> : null}
                  {(student.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean).map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-700 ring-1 ring-blue-200">
                      <Tag className="h-3 w-3" />{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        <nav className="border-b border-slate-200 bg-white px-2 sm:px-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative inline-flex shrink-0 items-center gap-2 px-3 py-3 text-sm font-semibold transition ${active ? "text-blue-700" : "text-slate-500 hover:text-slate-900"}`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {tab.badge ? <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${active ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>{tab.badge}</span> : null}
                  <span className={`absolute inset-x-3 bottom-0 h-0.5 rounded-full transition-all ${active ? "bg-blue-600" : "bg-transparent"}`} />
                </button>
              );
            })}
          </div>
        </nav>

        <div className="flex-1 overflow-y-auto bg-slate-50 px-6 py-5">
          {activeTab === "resumen" ? (
            <div className="grid gap-5 xl:grid-cols-2">
              <div className="space-y-5">
                <section className="rounded-xl border border-slate-200 bg-white p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Datos básicos</h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {[
                      ["fullName", "Nombre completo", "sm:col-span-2"],
                      ["course", "Curso"],
                      ["rut", "RUT / ID"],
                      ["guardian", "Apoderado/a"],
                      ["phone", "Teléfono"],
                      ["email", "Correo", "sm:col-span-2"],
                      ["tags", "Etiquetas (separadas por coma: PIE, beca, repitente)", "sm:col-span-2"],
                    ].map(([key, label, span]) => (
                      <label key={key} className={`block ${span || ""}`}>
                        <span className="text-xs font-semibold text-slate-700">{label}</span>
                        <input
                          value={student[key] || ""}
                          onChange={(event) => updateInfo(key, event.target.value)}
                          className="mt-1.5 w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-500"
                        />
                      </label>
                    ))}
                  </div>
                </section>
                <section className="rounded-xl border border-slate-200 bg-white p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Información clínica y pedagógica</h3>
                  <div className="mt-4 grid gap-4">
                    {([
                      ["relevantInfo", "Antecedentes relevantes", null],
                      ["strengths", "Fortalezas y recursos", null],
                      ["supportNeeds", "Necesidades de apoyo", null],
                      ["healthAlerts", "Alertas de salud / cuidados", "health"],
                      ["notes", "Dirección / Domicilio", "address"],
                      ["observations", "Observaciones generales", null],
                    ] as const).map(([key, label, kind]) => {
                      const highlighted = highlightField === key;
                      const isHealth = kind === "health";
                      const isAddress = kind === "address";
                      return (
                        <label key={key} className="block">
                          <span className={`flex items-center gap-2 text-xs font-semibold ${isHealth ? "text-rose-700" : isAddress ? "text-emerald-700" : "text-slate-700"}`}>
                            {isHealth ? <ShieldCheck className="h-3.5 w-3.5" /> : null}
                            {isAddress ? <MapPin className="h-3.5 w-3.5" /> : null}
                            {label}
                            {isHealth && student[key] ? (
                              <button
                                type="button"
                                onClick={() => updateInfo(key, "")}
                                className="ml-auto text-[10px] font-semibold text-rose-500 hover:text-rose-700"
                              >
                                Limpiar
                              </button>
                            ) : null}
                          </span>
                          <textarea
                            ref={(el) => { fieldRefs.current[key] = el; }}
                            value={student[key] || ""}
                            onChange={(event) => updateInfo(key, event.target.value)}
                            placeholder={
                              isHealth
                                ? "Ej.: Alergias, medicamentos, condiciones crónicas, restricciones de actividad…"
                                : isAddress
                                  ? "Ej.: Av. Ejemplo 1234, depto 5B, Comuna…"
                                  : undefined
                            }
                            className={`mt-1.5 min-h-20 w-full resize-y rounded-md border bg-white p-2.5 text-sm leading-6 outline-none transition focus:border-blue-500 ${
                              isHealth
                                ? "border-rose-200 bg-rose-50/40"
                                : isAddress
                                  ? "border-emerald-200 bg-emerald-50/40"
                                  : "border-slate-200"
                            } ${highlighted ? "ring-4 ring-blue-300/60 border-blue-500" : ""}`}
                          />
                        </label>
                      );
                    })}
                  </div>
                </section>
              </div>
              <div className="space-y-5">
                <section className="rounded-xl border border-slate-200 bg-white p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Acciones rápidas</h3>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {([
                      ["cases", "Caso", FileText],
                      ["interviews", "Entrevista", MessageSquareText],
                      ["logs", "Bitácora", ClipboardList],
                      ["documents", "Documento", FolderOpen],
                      ["protocols", "Protocolo", ShieldCheck],
                    ] as Array<[QuickAddKind, string, LucideIcon]>).map(([kind, label, Icon]) => (
                      <button
                        key={kind}
                        onClick={() => openQuickAdd(kind)}
                        className="group flex flex-col items-start gap-2 rounded-lg border border-slate-200 bg-white p-3 text-left hover:border-blue-400 hover:bg-blue-50"
                      >
                        <Icon className="h-4 w-4 text-slate-500 group-hover:text-blue-600" />
                        <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-700">+ {label}</span>
                      </button>
                    ))}
                  </div>
                  {quickAddOpen ? <div className="mt-4">{renderQuickAddForm()}</div> : null}
                </section>
                <LinkedRecordList title="Últimos registros vinculados" records={timeline.slice(0, 6)} emptyText="Todavía no hay registros vinculados a este estudiante." />
              </div>
            </div>
          ) : null}

          {activeTab === "familia" ? (
            <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
              <section className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Genograma</h3>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{genogram.length} vínculos</span>
                </div>
                <GenogramChart student={student} members={genogram} selectedMemberId={editingMemberId} onSelectMember={editGenogramMember} />
              </section>
              <section className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">{editingMember ? "Editar vínculo" : "Agregar vínculo"}</h3>
                <div className="mt-3 grid gap-2">
                  <input value={genogramForm.name} onChange={(event) => setGenogramForm((form) => ({ ...form, name: event.target.value }))} placeholder="Nombre familiar/red" className="rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-500" />
                  <div className="grid gap-2 sm:grid-cols-2">
                    <select value={genogramForm.relation} onChange={(event) => setGenogramForm((form) => ({ ...form, relation: event.target.value }))} className="rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-500">
                      {genogramRelations.map((relation) => <option key={relation}>{relation}</option>)}
                    </select>
                    <select value={genogramForm.role} onChange={(event) => setGenogramForm((form) => ({ ...form, role: event.target.value }))} className="rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-500">
                      {genogramRoles.map((role) => <option key={role}>{role}</option>)}
                    </select>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input value={genogramForm.age} onChange={(event) => setGenogramForm((form) => ({ ...form, age: event.target.value }))} placeholder="Edad" className="rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-500" />
                    <input value={genogramForm.phone} onChange={(event) => setGenogramForm((form) => ({ ...form, phone: event.target.value }))} placeholder="Teléfono" className="rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-500" />
                  </div>
                  <input value={genogramForm.email} onChange={(event) => setGenogramForm((form) => ({ ...form, email: event.target.value }))} placeholder="Correo" className="rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-500" />
                  <input value={genogramForm.address} onChange={(event) => setGenogramForm((form) => ({ ...form, address: event.target.value }))} placeholder="Dirección" className="rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-500" />
                  <textarea value={genogramForm.notes} onChange={(event) => setGenogramForm((form) => ({ ...form, notes: event.target.value }))} placeholder="Notas breves" className="min-h-20 rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-500" />
                  <div className="flex flex-wrap gap-2">
                    <button onClick={saveGenogramMember} disabled={!genogramForm.name.trim()} className="inline-flex items-center justify-center gap-1.5 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300">
                      <Save className="h-4 w-4" /> {editingMember ? "Guardar" : "Añadir"}
                    </button>
                    {editingMember ? (
                      <button onClick={() => { setEditingMemberId(""); setGenogramForm(emptyGenogramForm); }} className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancelar</button>
                    ) : null}
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {genogram.map((member) => (
                    <div key={member.id} className="flex items-start justify-between gap-3 rounded-md border border-slate-200 px-3 py-2 text-sm hover:border-blue-300 hover:bg-blue-50/50">
                      <button onClick={() => editGenogramMember(member.id)} className="min-w-0 text-left">
                        <strong className="block text-slate-950">{member.name}</strong>
                        <span className="text-slate-600">{member.relation} · {member.role}</span>
                        {member.phone || member.email ? <span className="mt-0.5 block text-xs text-slate-500">{[member.phone, member.email].filter(Boolean).join(" · ")}</span> : null}
                      </button>
                      <button onClick={() => removeGenogramMember(member.id)} className="rounded-md p-1.5 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : null}

          {activeTab === "casos" ? (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => openQuickAdd("cases")} className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                  <Plus className="h-4 w-4" /> Nuevo caso
                </button>
              </div>
              {quickAddOpen === "cases" ? renderQuickAddForm() : null}
              <section className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Casos individuales</h3>
                  <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[11px] font-semibold text-white tabular-nums">{cases.length}</span>
                </div>
                {cases.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500">No hay casos individuales vinculados.</p>
                ) : (
                  <div className="space-y-3">
                    {cases.map((caseRecord) => (
                      <CaseWithInterventions
                        key={caseRecord.id}
                        caseRecord={caseRecord}
                        onUpdateCase={onUpdateCase}
                        currentUserName={currentUserName || ""}
                      />
                    ))}
                  </div>
                )}
              </section>
              {courseCases.length > 0 ? (
                <LinkedRecordList title={`Situaciones del curso (${courseCases.length})`} records={courseCases} emptyText="No hay situaciones del curso." />
              ) : null}
            </div>
          ) : null}

          {activeTab === "entrevistas" ? (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => openQuickAdd("interviews")} className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                  <Plus className="h-4 w-4" /> Nueva entrevista
                </button>
              </div>
              {quickAddOpen === "interviews" ? renderQuickAddForm() : null}
              <LinkedRecordList title={`Entrevistas y reuniones (${interviews.length})`} records={interviews} emptyText="No hay entrevistas vinculadas." />
            </div>
          ) : null}

          {activeTab === "bitacoras" ? (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => openQuickAdd("logs")} className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                  <Plus className="h-4 w-4" /> Nueva bitácora
                </button>
              </div>
              {quickAddOpen === "logs" ? renderQuickAddForm() : null}
              <LinkedRecordList title={`Bitácoras (${logs.length})`} records={logs} emptyText="No hay bitácoras vinculadas." />
            </div>
          ) : null}

          {activeTab === "documentos" ? (
            <div className="space-y-4">
              <div className="flex justify-end gap-2">
                <button onClick={() => openQuickAdd("protocols")} className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  <Plus className="h-4 w-4" /> Protocolo
                </button>
                <button onClick={() => openQuickAdd("documents")} className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                  <Plus className="h-4 w-4" /> Documento
                </button>
              </div>
              {quickAddOpen === "documents" || quickAddOpen === "protocols" ? renderQuickAddForm() : null}
              <div className="grid gap-4 xl:grid-cols-2">
                <LinkedRecordList title={`Documentos (${documents.length})`} records={documents} emptyText="No hay documentos vinculados." />
                <LinkedRecordList title={`Protocolos (${protocols.length})`} records={protocols} emptyText="No hay protocolos vinculados." />
              </div>
            </div>
          ) : null}
        </div>

        <footer className="no-print flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-6 py-3 text-xs text-slate-500">
          <span>Actualizado {new Date(student.updatedAt).toLocaleString("es-CL")}</span>
          <div className="flex gap-2">
            <button onClick={() => window.print()} title="Imprimir ficha" className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50">
              <Printer className="h-3.5 w-3.5" /> Imprimir
            </button>
            {onNavigate ? (
              <button onClick={() => { onNavigate("students"); onClose(); }} className="rounded-md border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50">
                Ver en sección Estudiantes
              </button>
            ) : null}
            <button onClick={onClose} className="rounded-md bg-slate-900 px-3 py-1.5 font-semibold text-white hover:bg-slate-800">Cerrar</button>
          </div>
        </footer>
      </div>
    </div>
  );
}

function StudentsWorkspaceView({
  store,
  onAdd,
  onOpenStudent,
}: {
  store: DataStore;
  onAdd: () => void;
  onOpenStudent: (studentId: string, focusField?: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [cycleFilter, setCycleFilter] = useState<"all" | CourseDef["cycle"]>("all");
  const [selectedCourseName, setSelectedCourseName] = useState<string>(() => officialCourses[0]?.name || "");

  const searchable = normalize(search);
  const cycleByCourse = new Map(officialCourses.map((c) => [normalize(c.name), c.cycle]));

  // Group students by course (use the course string as-is to preserve "Sin curso").
  const grouped = new Map<string, DataRecord[]>();
  store.students.forEach((student) => {
    const courseKey = (student.course || "Sin curso").trim() || "Sin curso";
    if (!grouped.has(courseKey)) grouped.set(courseKey, []);
    grouped.get(courseKey)!.push(student);
  });

  const officialOrder = [...officialCourses.map((c) => c.name), "Sin curso"];
  const courseList = officialOrder
    .filter((name) => grouped.has(name))
    .concat(Array.from(grouped.keys()).filter((name) => !officialOrder.includes(name)))
    .map((name) => {
      const cycle = cycleByCourse.get(normalize(name)) || (name === "Sin curso" ? undefined : "III Ciclo");
      const students = grouped.get(name) || [];
      return { name, students, cycle };
    })
    .filter((group) => cycleFilter === "all" || group.cycle === cycleFilter);

  const matchesSearch = (s: DataRecord) =>
    !searchable ||
    [s.fullName, s.rut, s.guardian, s.email, s.phone, s.tags, s.course]
      .map((v) => normalize(String(v || "")))
      .some((v) => v.includes(searchable));

  // When searching, prefer courses with matches and auto-select the first.
  const filteredCourses = searchable
    ? courseList.map((g) => ({ ...g, students: g.students.filter(matchesSearch) })).filter((g) => g.students.length > 0)
    : courseList;

  useEffect(() => {
    if (filteredCourses.length === 0) return;
    if (!filteredCourses.some((g) => g.name === selectedCourseName)) {
      setSelectedCourseName(filteredCourses[0].name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, cycleFilter]);

  const currentGroup = filteredCourses.find((g) => g.name === selectedCourseName) || filteredCourses[0];
  const currentStudents = (currentGroup?.students || []).slice().sort((a, b) => (a.fullName || "").localeCompare(b.fullName || "", "es"));

  const totalShown = filteredCourses.reduce((s, g) => s + g.students.length, 0);

  return (
    <div className="tz-fade">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Estudiantes</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Cursos a la izquierda, estudiantes del curso seleccionado a la derecha. Clic en cualquier estudiante para abrir su ficha.
          </p>
        </div>
        <button onClick={onAdd} className="tz-press inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-slate-800">
          <Plus className="h-4 w-4" /> Agregar estudiante
        </button>
      </div>

      <div className="mb-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 lg:flex-row lg:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nombre, RUT, apoderado, correo, etiqueta…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
          />
          {search ? (
            <button onClick={() => setSearch("")} className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {([
            ["all", "Todos"],
            ["I Ciclo", "I Ciclo"],
            ["II Ciclo", "II Ciclo"],
            ["III Ciclo", "III Ciclo"],
          ] as Array<["all" | CourseDef["cycle"], string]>).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setCycleFilter(key)}
              className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${cycleFilter === key ? "bg-slate-900 text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="rounded-md bg-slate-50 px-3 py-1.5 text-sm">
          <span className="font-semibold tabular-nums text-slate-950">{totalShown.toLocaleString("es-CL")}</span>
          <span className="ml-1 text-slate-500">de {store.students.length.toLocaleString("es-CL")} estudiantes</span>
        </div>
      </div>

      {store.students.length === 0 ? (
        <EmptyState entity={entityConfigs.students} onAdd={onAdd} onImport={() => undefined} />
      ) : filteredCourses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <Search className="mx-auto h-8 w-8 text-slate-400" />
          <p className="mt-3 text-sm text-slate-600">No hay estudiantes que coincidan con tu búsqueda.</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
          {/* Master pane: course list */}
          <aside className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {filteredCourses.length} curso{filteredCourses.length === 1 ? "" : "s"}
            </div>
            <div className="max-h-[calc(100vh-260px)] overflow-y-auto">
              {filteredCourses.map((group) => {
                const active = group.name === selectedCourseName;
                return (
                  <button
                    key={group.name}
                    onClick={() => setSelectedCourseName(group.name)}
                    className={`group flex w-full items-center gap-3 border-l-2 px-4 py-2.5 text-left transition ${
                      active ? "border-blue-600 bg-blue-50" : "border-transparent hover:bg-slate-50"
                    }`}
                  >
                    <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${avatarTone(group.name)} text-[11px] font-bold text-white shadow-sm`}>
                      {group.name.split(" ").slice(0, 2).map((p) => p[0] || "").join("").toUpperCase().slice(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-sm font-semibold ${active ? "text-blue-900" : "text-slate-900"}`}>{group.name}</p>
                      <p className="truncate text-[11px] text-slate-500">{group.cycle || "Sin ciclo"}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums ${active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"}`}>
                      {group.students.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Detail pane: students of selected course */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {currentGroup ? (
              <>
                <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">{currentGroup.name}</h2>
                    <p className="text-xs text-slate-500">{currentGroup.cycle || "Sin ciclo"} · {currentStudents.length} estudiante{currentStudents.length === 1 ? "" : "s"}{searchable ? " que coinciden" : ""}</p>
                  </div>
                </header>
                {currentStudents.length === 0 ? (
                  <p className="p-10 text-center text-sm text-slate-500">No hay estudiantes en este curso{searchable ? " que coincidan con la búsqueda" : ""}.</p>
                ) : (
                  <ol className="max-h-[calc(100vh-280px)] divide-y divide-slate-100 overflow-y-auto">
                    {currentStudents.map((student, idx) => {
                      const caseCount = store.cases.filter((record) => studentMatches(record, student)).length;
                      const tags = (student.tags || "").split(",").map((t) => t.trim()).filter(Boolean);
                      return (
                        <li key={student.id}>
                          <button
                            onClick={() => onOpenStudent(student.id)}
                            className="group flex w-full items-center gap-3 px-5 py-2.5 text-left transition hover:bg-blue-50/40"
                          >
                            <span className="w-7 shrink-0 text-right text-[11px] font-semibold tabular-nums text-slate-400">{idx + 1}</span>
                            <div className={`grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br ${avatarTone(student.id)} text-[11px] font-bold text-white`}>
                              {student.profilePhoto ? (
                                <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${student.profilePhoto})` }} />
                              ) : (
                                initialsOf(student.fullName)
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-slate-950 group-hover:text-blue-700">{student.fullName || "Sin nombre"}</p>
                              <p className="truncate text-[11px] text-slate-500">
                                {student.rut ? <span>{student.rut}</span> : null}
                                {student.guardian ? <span> · Apoderado/a: {student.guardian}</span> : null}
                                {student.phone ? <span> · {student.phone}</span> : null}
                              </p>
                            </div>
                            <div className="flex shrink-0 items-center gap-1.5">
                              {tags.slice(0, 2).map((tag) => (
                                <span key={tag} className="hidden rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 ring-1 ring-blue-200 sm:inline">{tag}</span>
                              ))}
                              {student.healthAlerts ? (
                                <span
                                  role="button"
                                  tabIndex={0}
                                  onClick={(event) => { event.stopPropagation(); onOpenStudent(student.id, "healthAlerts"); }}
                                  onKeyDown={(event) => { if (event.key === "Enter") { event.stopPropagation(); onOpenStudent(student.id, "healthAlerts"); } }}
                                  title={student.healthAlerts}
                                  className="cursor-pointer rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700 ring-1 ring-rose-200 transition hover:bg-rose-100"
                                >
                                  ⚠ Salud
                                </span>
                              ) : null}
                              {caseCount ? (
                                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-200">{caseCount} caso{caseCount === 1 ? "" : "s"}</span>
                              ) : null}
                              <ChevronDown className="-rotate-90 h-4 w-4 text-slate-300 group-hover:text-blue-500" />
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </>
            ) : (
              <div className="p-10 text-center text-sm text-slate-500">Selecciona un curso a la izquierda.</div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

type CommandResult = {
  entity: EntityId;
  record: DataRecord;
  title: string;
  subtitle: string;
  score: number;
};

function CommandPalette({
  store,
  onClose,
  onOpenStudent,
  onNavigate,
}: {
  store: DataStore;
  onClose: () => void;
  onOpenStudent: (studentId: string, focusField?: string) => void;
  onNavigate: (view: ViewId) => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(timer);
  }, []);

  const normalized = normalize(query);
  const results: CommandResult[] = [];
  if (normalized) {
    (Object.keys(entityConfigs) as EntityId[]).forEach((entityId) => {
      const config = entityConfigs[entityId];
      const titleField = config.fields.find((field) => field.required)?.key || config.fields[0].key;
      const sample = store[entityId];
      sample.forEach((record) => {
        const haystack = Object.values(record).map((value) => normalize(String(value))).join(" ");
        const idx = haystack.indexOf(normalized);
        if (idx < 0) return;
        const titleRaw = String(record[titleField] || record[config.fields[0].key] || config.singular);
        const subtitleParts: string[] = [];
        config.fields.slice(0, 4).forEach((field) => {
          if (field.key === titleField) return;
          const val = String(record[field.key] || "").trim();
          if (val) subtitleParts.push(val);
        });
        results.push({
          entity: entityId,
          record,
          title: titleRaw,
          subtitle: `${config.label} · ${subtitleParts.slice(0, 3).join(" · ") || "Registro"}`,
          score: -idx,
        });
      });
    });
    results.sort((a, b) => b.score - a.score);
  }
  const limited = results.slice(0, 40);
  const grouped = new Map<EntityId, CommandResult[]>();
  limited.forEach((result) => {
    if (!grouped.has(result.entity)) grouped.set(result.entity, []);
    grouped.get(result.entity)!.push(result);
  });

  const flat = Array.from(grouped.entries()).flatMap(([, items]) => items);
  const activeResult = flat[selectedIndex];

  const RECENTS_KEY = "tiza-search-recent-v1";
  type RecentEntry = { entity: EntityId; id: string; title: string; subtitle: string; ts: number };
  const [recents, setRecents] = useState<RecentEntry[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(RECENTS_KEY);
      return raw ? (JSON.parse(raw) as RecentEntry[]) : [];
    } catch {
      return [];
    }
  });

  // Reconcile recents against the live store so renamed / deleted records don't appear.
  const liveRecents = recents
    .map((r) => {
      const list = store[r.entity];
      const found = list?.find((rec) => rec.id === r.id);
      if (!found) return null;
      const config = entityConfigs[r.entity];
      const titleField = config.fields.find((f) => f.required)?.key || config.fields[0].key;
      return { ...r, title: String(found[titleField] || r.title) };
    })
    .filter((r): r is RecentEntry => r !== null)
    .slice(0, 8);

  const pushRecent = (result: CommandResult) => {
    const entry: RecentEntry = {
      entity: result.entity,
      id: result.record.id,
      title: result.title,
      subtitle: result.subtitle,
      ts: Date.now(),
    };
    const next = [entry, ...recents.filter((r) => !(r.entity === entry.entity && r.id === entry.id))].slice(0, 10);
    setRecents(next);
    try {
      window.localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
    } catch {
      // ignore quota errors
    }
  };

  const clearRecents = () => {
    setRecents([]);
    try {
      window.localStorage.removeItem(RECENTS_KEY);
    } catch {
      // ignore
    }
  };

  const openRecent = (entry: RecentEntry) => {
    if (entry.entity === "students") onOpenStudent(entry.id);
    else onNavigate(entry.entity);
    onClose();
  };

  const choose = (result: CommandResult | undefined) => {
    if (!result) return;
    pushRecent(result);
    if (result.entity === "students") {
      onOpenStudent(result.record.id);
    } else {
      onNavigate(result.entity);
    }
    onClose();
  };

  const handleKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((index) => (flat.length === 0 ? 0 : Math.min(flat.length - 1, index + 1)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((index) => Math.max(0, index - 1));
    } else if (event.key === "Home") {
      event.preventDefault();
      setSelectedIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setSelectedIndex(Math.max(0, flat.length - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      choose(activeResult);
    }
  };

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-cmd-idx="${selectedIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  useEffect(() => {
    setSelectedIndex(0);
    listRef.current?.scrollTo({ top: 0 });
  }, [query]);

  const quickShortcuts: Array<{ id: ViewId; label: string; icon: LucideIcon }> = [
    { id: "students", label: "Ir a Estudiantes", icon: UserRound },
    { id: "courses", label: "Ir a Cursos", icon: BookOpen },
    { id: "cases", label: "Ir a Casos", icon: FileText },
    { id: "interviews", label: "Ir a Entrevistas", icon: MessageSquareText },
  ];

  return (
    <div className="tz-backdrop fixed inset-0 z-[70] grid items-start justify-center bg-slate-950/40 px-4 pt-24" onClick={onClose}>
      <div
        className="tz-pop-fast w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white tz-ring"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKey}
            placeholder="Buscar estudiantes, casos, entrevistas, documentos…"
            className="w-full bg-transparent text-base outline-none placeholder:text-slate-400"
          />
          <span className="hidden sm:inline tz-kbd">ESC</span>
        </div>

        <div ref={listRef} className="max-h-[60vh] overflow-y-auto">
          {!normalized ? (
            <div className="p-4">
              {liveRecents.length > 0 ? (
                <>
                  <div className="flex items-center justify-between px-2 pb-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Búsquedas recientes</p>
                    <button onClick={clearRecents} className="text-[11px] font-semibold text-slate-400 hover:text-slate-700">Limpiar</button>
                  </div>
                  <div className="grid gap-1">
                    {liveRecents.map((entry) => {
                      const config = entityConfigs[entry.entity];
                      const Icon = config.icon;
                      return (
                        <button
                          key={`${entry.entity}-${entry.id}`}
                          onClick={() => openRecent(entry)}
                          className="group flex items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-slate-50"
                        >
                          <div className={`grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-md text-sm font-bold text-white shadow-sm bg-gradient-to-br ${avatarTone(entry.id)}`}>
                            {entry.entity === "students" ? initialsOf(entry.title) : <Icon className="h-4 w-4" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-950">{entry.title}</p>
                            <p className="truncate text-xs text-slate-500">{entry.subtitle}</p>
                          </div>
                          <span className="text-[10px] text-slate-400">{config.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="my-3 h-px bg-slate-100" />
                </>
              ) : null}
              <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Accesos rápidos</p>
              <div className="grid gap-1">
                {quickShortcuts.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { onNavigate(item.id); onClose(); }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      <div className="grid h-8 w-8 place-items-center rounded-md bg-slate-100 text-slate-600">
                        <Icon className="h-4 w-4" />
                      </div>
                      {item.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 px-2 text-xs text-slate-500">
                Empieza a escribir para buscar en todos los registros (nombres, cursos, RUT, motivos, etiquetas...).
              </p>
            </div>
          ) : flat.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">
              <Search className="mx-auto mb-3 h-6 w-6 text-slate-300" />
              No encontramos resultados para “{query}”.
            </div>
          ) : (
            <div className="py-2">
              {Array.from(grouped.entries()).map(([entityId, items]) => {
                const config = entityConfigs[entityId];
                const Icon = config.icon;
                return (
                  <div key={entityId} className="px-2 pb-2">
                    <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{config.label}</p>
                    {items.map((result) => {
                      const flatIndex = flat.indexOf(result);
                      const active = flatIndex === selectedIndex;
                      return (
                        <button
                          key={`${result.entity}-${result.record.id}`}
                          data-cmd-idx={flatIndex}
                          onMouseEnter={() => setSelectedIndex(flatIndex)}
                          onClick={() => choose(result)}
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition ${active ? "bg-blue-50 ring-1 ring-blue-200" : "hover:bg-slate-50"}`}
                        >
                          <div className={`grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-md text-sm font-bold text-white shadow-sm bg-gradient-to-br ${avatarTone(result.record.id)}`}>
                            {result.entity === "students" ? initialsOf(result.title) : <Icon className="h-4 w-4" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-950">{result.title}</p>
                            <p className="truncate text-xs text-slate-500">{result.subtitle}</p>
                          </div>
                          {active ? <span className="tz-kbd">↵</span> : null}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <footer className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-4 py-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><span className="tz-kbd">↑</span><span className="tz-kbd">↓</span> navegar</span>
            <span className="flex items-center gap-1"><span className="tz-kbd">↵</span> abrir</span>
          </div>
          <span className="flex items-center gap-1">{normalized ? `${flat.length} resultados` : <><span className="tz-kbd">⌘</span><span className="tz-kbd">K</span></>}</span>
        </footer>
      </div>
    </div>
  );
}

function RecordDialog({
  entity,
  onClose,
  onSave,
}: {
  entity: EntityConfig;
  onClose: () => void;
  onSave: (record: DataRecord) => void;
}) {
  const [form, setForm] = useState<Record<string, string>>(() =>
    entity.fields.reduce<Record<string, string>>((acc, field) => {
      acc[field.key] = "";
      return acc;
    }, {})
  );

  const save = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const missing = entity.fields.filter((field) => field.required && !form[field.key]?.trim());
    if (missing.length) return;
    onSave({ id: uid(), createdAt: nowIso(), updatedAt: nowIso(), ...form });
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="tz-backdrop fixed inset-0 z-50 grid bg-slate-950/45 p-4" onClick={onClose}>
      <form
        onSubmit={save}
        onClick={(event) => event.stopPropagation()}
        className="tz-pop-fast m-auto max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white tz-ring"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Agregar {entity.singular}</h2>
            <p className="mt-1 text-sm text-slate-600">{entity.description}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-2">
          {entity.fields.map((field) => (
            <label key={field.key} className={field.type === "textarea" ? "block md:col-span-2" : "block"}>
              <span className="text-sm font-semibold text-slate-700">
                {field.label}{field.required ? " *" : ""}
              </span>
              {field.type === "textarea" ? (
                <textarea
                  value={form[field.key] || ""}
                  onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
                  className="mt-2 min-h-32 w-full resize-y rounded-md border border-slate-200 p-3 text-sm leading-6 outline-none focus:border-slate-900"
                />
              ) : field.type === "select" ? (
                <select
                  value={form[field.key] || ""}
                  onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
                  className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
                >
                  <option value="">Seleccionar</option>
                  {field.options?.map((option) => <option key={option}>{option}</option>)}
                </select>
              ) : (
                <input
                  type={field.type === "date" ? "date" : "text"}
                  value={form[field.key] || ""}
                  onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
                  className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
                />
              )}
            </label>
          ))}
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 p-6">
          <button type="button" onClick={onClose} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Cancelar
          </button>
          <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            <Save className="h-4 w-4" /> Guardar
          </button>
        </div>
      </form>
    </div>
  );
}

function ImportView({
  parsed,
  plan,
  setPlan,
  onFile,
  onText,
  onConfirm,
}: {
  parsed: ParsedSheet | null;
  plan: ImportPlan | null;
  setPlan: (plan: ImportPlan) => void;
  onFile: (file: File) => void;
  onText: (text: string) => void;
  onConfirm: () => void;
}) {
  const [paste, setPaste] = useState("");
  const entity = plan ? entityConfigs[plan.entity] : null;

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <Wand2 className="h-7 w-7 text-slate-600" />
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Importar con IA local</h1>
        </div>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Sube un CSV/TSV exportado desde Google Sheets o pega una tabla. El asistente interpreta encabezados,
          sugiere el módulo correcto y mapea columnas. No se inventan datos: solo se carga lo que venga en tu archivo.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">1. Cargar archivo o pegar datos</h2>
          <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center hover:bg-slate-100">
            <FileSpreadsheet className="h-10 w-10 text-slate-500" />
            <span className="mt-3 font-semibold text-slate-950">Subir CSV / TSV</span>
            <span className="mt-1 text-sm text-slate-600">Google Sheets: Archivo → Descargar → CSV o TSV</span>
            <input
              type="file"
              accept=".csv,.tsv,.txt,.xlsx"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onFile(file);
              }}
            />
          </label>
          <div className="mt-6">
            <label className="text-sm font-bold text-slate-700">O pega aquí datos copiados desde Sheets</label>
            <textarea
              value={paste}
              onChange={(event) => setPaste(event.target.value)}
              className="mt-2 h-44 w-full resize-none rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-teal-600"
              placeholder={"Nombre\tCurso\tRUT\nMaría...\t2° Medio A\t..."}
            />
            <button
              onClick={() => onText(paste)}
              disabled={!paste.trim()}
              className="mt-3 rounded-md bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300"
            >
              Interpretar tabla pegada
            </button>
          </div>
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold">Sobre archivos .xlsx</p>
            <p className="mt-1">Por ahora esta versión interpreta CSV/TSV en el navegador. Para Google Sheets, descarga como CSV/TSV. Si me envías tus archivos, puedo ajustar el importador a tus columnas reales.</p>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">2. Revisión antes de importar</h2>
          {!parsed || !plan || !entity ? (
            <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
              Carga o pega una planilla para ver la interpretación.
            </div>
          ) : (
            <div className="mt-5 space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-500">Archivo</p>
                  <p className="mt-1 truncate font-semibold">{parsed.fileName}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-500">Filas detectadas</p>
                  <p className="mt-1 text-2xl font-semibold">{parsed.rows.length}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-500">Confianza</p>
                  <p className="mt-1 text-2xl font-semibold">{plan.confidence}%</p>
                </div>
              </div>

              <label className="block">
                <span className="text-sm font-bold text-slate-700">Importar como</span>
                <select
                  value={plan.entity}
                  onChange={(event) => {
                    const entityId = event.target.value as EntityId;
                    setPlan({ ...plan, entity: entityId, mapping: inferImportPlan(parsed).entity === entityId ? inferImportPlan(parsed).mapping : {} });
                  }}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-teal-600"
                >
                  {Object.values(entityConfigs).map((config) => <option key={config.id} value={config.id}>{config.label}</option>)}
                </select>
              </label>

              <div>
                <h3 className="mb-3 font-semibold">Mapeo de columnas</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {entity.fields.map((field) => (
                    <label key={field.key} className="block rounded-lg border border-slate-100 p-3">
                      <span className="text-xs font-bold text-slate-600">
                        {field.label} {field.required ? <span className="text-red-500">*</span> : null}
                      </span>
                      <select
                        value={plan.mapping[field.key] || ""}
                        onChange={(event) => setPlan({ ...plan, mapping: { ...plan.mapping, [field.key]: event.target.value } })}
                        className="mt-2 w-full rounded-lg border border-slate-200 bg-white p-2 text-sm outline-none focus:border-teal-600"
                      >
                        <option value="">No importar</option>
                        {parsed.headers.map((header) => <option key={header} value={header}>{header}</option>)}
                      </select>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold">Vista previa</h3>
                <div className="max-h-60 overflow-auto rounded-lg border border-slate-200">
                  <table className="w-full min-w-[640px] text-left text-xs">
                    <thead className="bg-slate-50">
                      <tr>{parsed.headers.map((header) => <th key={header} className="px-3 py-2">{header}</th>)}</tr>
                    </thead>
                    <tbody>
                      {parsed.rows.slice(0, 5).map((row, index) => (
                        <tr key={index} className="border-t border-slate-100">
                          {parsed.headers.map((header) => <td key={header} className="px-3 py-2">{row[header]}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <button onClick={onConfirm} className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800">
                <Check className="h-5 w-5" /> Confirmar importación
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function DashboardAgenda({
  store,
  calendarEvents,
  calendarLoading,
  calendarIcalUrl,
  onReloadCalendar,
  onNavigate,
}: {
  store: DataStore;
  calendarEvents: CalendarEvent[];
  calendarLoading: boolean;
  calendarIcalUrl?: string;
  onReloadCalendar: () => void;
  onNavigate: (view: ViewId) => void;
}) {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  // Combine calendar events + app entries (interviews, classes) into a unified timeline.
  type AgendaItem = {
    key: string;
    start: Date;
    end?: Date;
    title: string;
    location: string;
    description: string;
    type: "calendar" | "orientation_class" | "interview" | "app_orientation";
    color: string;
    icon: LucideIcon;
    href?: ViewId;
    courseHint?: string;
  };

  const items: AgendaItem[] = [];

  calendarEvents.forEach((ev, i) => {
    const start = new Date(ev.start);
    const match = matchOrientationEvent(ev.summary);
    const isOrientation = match.isOrientation;
    items.push({
      key: `cal-${i}-${ev.start}`,
      start,
      end: new Date(ev.end),
      title: isOrientation ? match.displayTitle : (ev.summary || "(sin título)"),
      location: ev.location || "",
      description: ev.description || "",
      type: isOrientation ? "orientation_class" : "calendar",
      color: isOrientation ? "from-violet-500 to-purple-600" : "from-blue-500 to-sky-600",
      icon: isOrientation ? ClipboardList : CalendarDays,
      href: isOrientation ? "orientation" : undefined,
      courseHint: match.course,
    });
  });

  store.interviews
    .filter((r) => (r.date || "").slice(0, 10) === todayStr)
    .forEach((r) => {
      const t = new Date();
      items.push({
        key: `interview-${r.id}`,
        start: t,
        title: `Entrevista · ${r.participant || r.student || "?"}`,
        location: "",
        description: r.reason || "",
        type: "interview",
        color: "from-emerald-500 to-teal-600",
        icon: MessageSquareText,
        href: "interviews",
      });
    });

  store.orientation
    .filter((r) => (r.date || "").slice(0, 10) === todayStr)
    .forEach((r) => {
      // Skip if a matching calendar event already covers it (same course).
      const dup = calendarEvents.some((ev) => {
        const match = matchOrientationEvent(ev.summary);
        return match.isOrientation && normalize(match.course) === normalize(r.course || "");
      });
      if (dup) return;
      items.push({
        key: `app-orient-${r.id}`,
        start: new Date(),
        title: `${r.topic || "Clase de orientación"} · ${r.course || ""}`,
        location: "",
        description: r.planificacion || r.notes || "",
        type: "app_orientation",
        color: "from-violet-500 to-purple-600",
        icon: ClipboardList,
        href: "orientation",
        courseHint: r.course,
      });
    });

  items.sort((a, b) => a.start.getTime() - b.start.getTime());

  const dateLong = today.toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" });

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-blue-50/40 to-white px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-sm">
            <CalendarDays className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-950">Mi día</h2>
            <p className="text-[11px] text-slate-500 capitalize">{dateLong}</p>
          </div>
          {calendarLoading ? <span className="h-3 w-3 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" /> : null}
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">{items.length} {items.length === 1 ? "actividad" : "actividades"}</span>
          {calendarIcalUrl ? (
            <button onClick={onReloadCalendar} className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50">Recargar</button>
          ) : null}
        </div>
      </header>

      <div className="p-4">
        {!calendarIcalUrl && items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-blue-200 bg-blue-50/40 p-5 text-center">
            <CalendarDays className="mx-auto h-7 w-7 text-blue-600" />
            <p className="mt-2 text-sm font-semibold text-slate-900">Conecta tu Google Calendar</p>
            <p className="mt-1 text-xs text-slate-600">Verás tus clases, reuniones, entrevistas y compromisos del día integrados aquí.</p>
            <button onClick={() => onNavigate("today")} className="tz-press mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700">
              Conectar ahora
            </button>
          </div>
        ) : items.length === 0 ? (
          <p className="rounded-lg bg-slate-50 p-4 text-center text-sm text-slate-500">No hay actividades para hoy.</p>
        ) : (
          <ol className="relative space-y-2 border-l-2 border-dashed border-slate-200 pl-5">
            {items.map((item) => {
              const Icon = item.icon;
              const timeLabel = item.start.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
              const endLabel = item.end ? item.end.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }) : "";
              return (
                <li
                  key={item.key}
                  className={`group relative rounded-xl border border-slate-200 bg-white p-3 ${item.href ? "cursor-pointer hover:border-blue-300 hover:bg-blue-50/30" : ""}`}
                  onClick={() => item.href && onNavigate(item.href)}
                >
                  <span className={`absolute -left-[1.65rem] top-3 grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br ${item.color} text-white shadow ring-4 ring-white`}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-950">{item.title}</h3>
                    <span className="text-[11px] font-semibold text-slate-500 tabular-nums">
                      {item.type === "interview" || item.type === "app_orientation" ? "Hoy" : (endLabel ? `${timeLabel} – ${endLabel}` : timeLabel)}
                    </span>
                  </div>
                  {item.location ? <p className="mt-0.5 text-xs text-slate-600">📍 {item.location}</p> : null}
                  {item.description ? <p className="mt-1 line-clamp-2 text-xs text-slate-600">{item.description}</p> : null}
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}

function Dashboard({ store, onNavigate, schoolName, userEmail, team, calendarEvents, calendarLoading, calendarIcalUrl, onReloadCalendar }: { store: DataStore; onNavigate: (view: ViewId) => void; schoolName: string; userEmail: string; team: TeamMember[]; calendarEvents: CalendarEvent[]; calendarLoading: boolean; calendarIcalUrl?: string; onReloadCalendar: () => void }) {
  const total = Object.values(store).reduce((sum, records) => sum + records.length, 0);
  const latest = Object.entries(store)
    .flatMap(([entity, records]) => records.map((record) => ({ entity: entity as EntityId, record })))
    .sort((a, b) => b.record.updatedAt.localeCompare(a.record.updatedAt))
    .slice(0, 6);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";
  const emailLower = (userEmail || "").toLowerCase().trim();
  const teamMatch = team.find((m) => (m.email || "").toLowerCase().trim() === emailLower);
  // Persist the matched name so subsequent loads show it instantly without the team having to come back.
  const cacheKey = emailLower ? `tiza-display-name:${emailLower}` : "";
  const [cachedName, setCachedName] = useState<string>(() => {
    if (typeof window === "undefined" || !cacheKey) return "";
    return window.localStorage.getItem(cacheKey) || "";
  });
  useEffect(() => {
    if (!cacheKey || !teamMatch?.name) return;
    const first = teamMatch.name.split(/\s+/)[0] || teamMatch.name;
    if (first && first !== cachedName) {
      window.localStorage.setItem(cacheKey, first);
      setCachedName(first);
    }
  }, [teamMatch, cacheKey, cachedName]);

  const displayName = teamMatch?.name
    ? (teamMatch.name.split(/\s+/)[0] || teamMatch.name)
    : cachedName;
  const dateLabel = now.toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="space-y-6">
      <section className="tz-slide-up relative overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-violet-200/40 via-blue-200/30 to-transparent blur-2xl" />
        <div className="pointer-events-none absolute -left-32 -bottom-32 h-72 w-72 rounded-full bg-gradient-to-tr from-emerald-100/40 via-cyan-100/40 to-transparent blur-3xl" />

        <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="min-w-0">
            <div className="mb-5 flex items-center gap-4 sm:gap-5">
              <div className="flex h-14 items-center">
                <Image src="/tiza-education-logo.svg" alt="Tiza Education" width={170} height={42} priority />
              </div>
              <span className="text-2xl font-light text-slate-300">×</span>
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-white ring-1 ring-slate-200 shadow-sm">
                  <Image src="/logo-san-lucas.png" alt={schoolName} width={40} height={40} />
                </div>
                <p className="hidden text-sm font-semibold text-slate-800 sm:block">{schoolName}</p>
              </div>
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{dateLabel}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {greeting}{displayName ? (
                <>
                  , <span key={displayName} className="tz-name-in">{displayName}</span>
                </>
              ) : null}.
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
              Tu espacio de trabajo en orientación y convivencia. Hoy hay <strong className="text-slate-900">{store.students.length.toLocaleString("es-CL")}</strong> estudiantes activos en <strong className="text-slate-900">{Math.max(officialCourses.length, store.courses.length)}</strong> cursos.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <button onClick={() => onNavigate("today")} className="tz-press inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-slate-800">
                <CalendarDays className="h-4 w-4" /> Ver mi día
              </button>
              <button onClick={() => onNavigate("triage")} className="tz-press inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-semibold text-violet-700 shadow-sm hover:bg-violet-50">
                <Sparkles className="h-4 w-4" /> Asistente IA
              </button>
              <button onClick={() => onNavigate("students")} className="tz-press inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
                <UserRound className="h-4 w-4" /> Estudiantes
              </button>
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-3 sm:max-w-md lg:w-auto lg:grid-cols-1 lg:gap-2">
            {([
              ["Casos abiertos", store.cases.filter((c) => !/cerrad/i.test(c.status || "")).length, "from-amber-500 to-orange-500", "cases" as ViewId, FileText],
              ["Entrevistas próximas", store.interviews.filter((r) => r.date && r.date >= now.toISOString().slice(0, 10)).length, "from-sky-500 to-blue-600", "interviews" as ViewId, MessageSquareText],
              ["Protocolos activos", store.protocols.filter((r) => !/cerrad/i.test(r.status || "")).length, "from-rose-500 to-pink-600", "protocols" as ViewId, ShieldCheck],
              ["Bitácoras totales", store.logs.length, "from-violet-500 to-purple-600", "logs" as ViewId, ClipboardList],
            ] as Array<[string, number, string, ViewId, LucideIcon]>).map(([label, value, tone, view, Icon]) => (
              <button
                key={label}
                onClick={() => onNavigate(view)}
                className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-left shadow-sm backdrop-blur transition hover:border-slate-300 hover:shadow-md lg:w-56"
              >
                <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${tone} text-white shadow-sm`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
                  <p className="text-xl font-semibold tabular-nums text-slate-950">{value.toLocaleString("es-CL")}</p>
                </div>
                <ChevronDown className="-rotate-90 h-4 w-4 text-slate-300 transition group-hover:text-slate-500" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <DashboardAgenda
        store={store}
        calendarEvents={calendarEvents}
        calendarLoading={calendarLoading}
        calendarIcalUrl={calendarIcalUrl}
        onReloadCalendar={onReloadCalendar}
        onNavigate={onNavigate}
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Estudiantes" value={store.students.length} detail="Registros reales" icon={UserRound} accent="blue" />
        <StatCard
          label="Cursos"
          value={Math.max(officialCourses.length, store.courses.length)}
          detail={`${store.courses.length} guardados · ${officialCourses.length} oficiales`}
          icon={BookOpen}
          accent="teal"
        />
        <StatCard label="Casos" value={store.cases.length} detail="Casos ingresados" icon={FileText} accent="amber" />
        <StatCard label="Bitácoras" value={store.logs.length} detail="Intervenciones" icon={ClipboardList} accent="violet" />
        <StatCard label="Documentos" value={store.documents.length} detail="Índice documental" icon={FolderOpen} accent="rose" />
      </div>

      {total === 0 ? (
        <section className="mt-6 rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
          <Database className="mx-auto h-10 w-10 text-slate-500" />
          <h2 className="mt-4 text-xl font-semibold text-slate-950">Sistema listo para datos reales</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
            La plataforma está vacía a propósito. Puedes empezar con formularios o importando tu Google Sheet como CSV/TSV.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={() => onNavigate("students")} className="rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">Crear primer estudiante</button>
            <button onClick={() => onNavigate("triage")} className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Asistente IA</button>
          </div>
        </section>
      ) : (
        <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Últimos registros</h2>
          <div className="mt-4 divide-y divide-slate-100">
            {latest.map(({ entity, record }) => {
              const config = entityConfigs[entity];
              const titleField = config.fields.find((field) => field.required)?.key || config.fields[0].key;
              return (
                <button key={`${entity}-${record.id}`} onClick={() => onNavigate(entity)} className="flex w-full items-center justify-between py-3 text-left">
                  <span>
                    <span className="block font-bold text-slate-950">{record[titleField] || config.singular}</span>
                    <span className="block text-xs text-slate-500">{config.label} · {new Date(record.updatedAt).toLocaleString("es-CL")}</span>
                  </span>
                  <ChevronDown className="-rotate-90 h-4 w-4 text-slate-400" />
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function TeamView({
  team,
  canSeed,
  seeding,
  seedNotice,
  onSeed,
}: {
  team: TeamMember[];
  canSeed: boolean;
  seeding: boolean;
  seedNotice: string;
  onSeed: () => void;
}) {
  const leadership = team.filter((member) => normalize(member.role).includes("directora"));
  const coordination = team.filter((member) => normalize(member.role).includes("coordinador") || normalize(member.role).includes("coordinadora"));
  const professionals = team.filter((member) => !leadership.some((leader) => leader.id === member.id) && !coordination.some((coordinator) => coordinator.id === member.id));
  const groups = [
    { label: "Dirección", members: leadership },
    { label: "Coordinaciones", members: coordination },
    { label: "Equipo profesional", members: professionals },
  ].filter((group) => group.members.length > 0);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Equipo de Formación y Convivencia</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Perfiles institucionales activos para asignación de casos, bitácoras, orientación y seguimiento.
          </p>
          {seedNotice ? <p className="mt-3 rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-800">{seedNotice}</p> : null}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {canSeed ? (
            <button
              onClick={onSeed}
              disabled={seeding}
              className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300"
            >
              <UsersRound className="h-4 w-4" />
              {seeding ? "Actualizando..." : "Crear/actualizar equipo"}
            </button>
          ) : null}
          <div className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm">
            <span className="font-semibold text-slate-950">{team.length}</span>
            <span className="ml-1 text-slate-600">integrantes</span>
          </div>
        </div>
      </div>

      {team.length === 0 ? (
        <section className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
          <UsersRound className="mx-auto h-10 w-10 text-slate-500" />
          <h2 className="mt-4 text-xl font-semibold text-slate-950">Aún no hay equipo cargado</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
            Cuando se creen los usuarios en Supabase, aparecerán aquí automáticamente.
          </p>
        </section>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <section key={group.label} className="rounded-lg border border-slate-200 bg-white p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-950">{group.label}</h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{group.members.length}</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {group.members.map((member) => (
                  <article key={member.id} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex items-start gap-3">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-slate-900 text-sm font-semibold text-white">
                        {member.name.split(" ").slice(0, 2).map((part) => part[0]).join("")}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-slate-950">{member.name}</h3>
                        <p className="mt-1 text-sm text-slate-600">{member.role}</p>
                        <a href={`mailto:${member.email}`} className="mt-3 inline-flex max-w-full items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-950">
                          <Mail className="h-4 w-4 shrink-0" />
                          <span className="truncate">{member.email}</span>
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsView({
  profile,
  setProfile,
  onClear,
}: {
  profile: Record<string, string>;
  setProfile: (profile: Record<string, string>) => void;
  onClear: () => void;
}) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Configuración</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">Configura la institución y revisa el estado de persistencia.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Institución</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              ["organization", "Nombre institución"],
              ["role", "Rol activo"],
              ["year", "Año escolar"],
              ["professional", "Profesional"],
            ].map(([key, label]) => (
              <label key={key}>
                <span className="text-sm font-bold text-slate-700">{label}</span>
                <input
                  value={profile[key] || ""}
                  onChange={(event) => setProfile({ ...profile, [key]: event.target.value })}
                  className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-teal-600"
                />
              </label>
            ))}
          </div>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-6 xl:col-span-2">
          <h2 className="flex items-center gap-2 text-lg font-semibold"><CalendarDays className="h-5 w-5 text-blue-600" /> Google Calendar</h2>
          <p className="mt-1 text-sm text-slate-600">
            Conecta tu calendario para ver las actividades de hoy en la vista <strong>Hoy</strong>. Usa la <strong>URL secreta en formato iCal</strong> (no requiere OAuth, funciona también con Outlook y Apple Calendar).
          </p>
          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-700">URL iCal</span>
            <input
              value={profile.calendarIcalUrl || ""}
              onChange={(event) => setProfile({ ...profile, calendarIcalUrl: event.target.value })}
              placeholder="https://calendar.google.com/calendar/ical/.../basic.ics"
              className="mt-2 w-full rounded-lg border border-slate-200 p-3 font-mono text-xs outline-none focus:border-blue-500"
            />
          </label>
          <details className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
            <summary className="cursor-pointer font-semibold text-slate-700">Cómo obtener la URL iCal de Google Calendar</summary>
            <ol className="mt-2 list-decimal space-y-1 pl-4">
              <li>Abre <a className="text-blue-600 hover:underline" href="https://calendar.google.com/" target="_blank" rel="noopener noreferrer">Google Calendar</a> en una pestaña.</li>
              <li>En el panel izquierdo, pasa el cursor sobre tu calendario → click en los 3 puntos → <strong>"Configuración y uso compartido"</strong>.</li>
              <li>Baja hasta <strong>"Integrar el calendario"</strong>.</li>
              <li>Copia la <strong>"Dirección secreta en formato iCal"</strong> (la URL que termina en <code>.ics</code>).</li>
              <li>Pégala aquí arriba y guarda.</li>
            </ol>
            <p className="mt-2 text-rose-700"><strong>⚠ Importante</strong>: esta URL da acceso de lectura completo a tu calendario. No la compartas.</p>
          </details>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Mantención</h2>
          <p className="mt-2 text-sm text-slate-600">Si necesitas vaciar el caché local de tu navegador (no afecta los datos en Supabase, solo este equipo).</p>
          <button onClick={onClear} className="mt-5 inline-flex items-center gap-2 rounded-lg border border-red-200 px-5 py-3 font-bold text-red-600 hover:bg-red-50">
            <Trash2 className="h-5 w-5" /> Borrar caché local
          </button>
        </section>
      </div>
    </div>
  );
}

function Toast({ message }: { message: string }) {
  return (
    <div className="tz-slide-up fixed bottom-6 left-1/2 z-[60] -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/95 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-xl tz-ring backdrop-blur">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-100 text-emerald-700">
          <Check className="h-4 w-4" />
        </span>
        {message}
      </div>
    </div>
  );
}

function LoginScreen({ onSignIn }: { onSignIn: (email: string, password: string) => Promise<void> }) {
  const [school, setSchool] = useState("Colegio San Lucas de Lo Espejo");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onSignIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesion.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-slate-50 px-4 py-8 text-slate-950">
      <section className="m-auto grid w-full max-w-5xl overflow-hidden rounded-lg border border-slate-200 bg-white md:grid-cols-[1fr_420px]">
        <div className="flex min-h-[560px] flex-col justify-between border-b border-slate-200 p-8 md:border-b-0 md:border-r">
          <div>
            <Image src="/tiza-education-logo.svg" alt="Tiza Education" width={240} height={58} priority />
            <div className="mt-16 max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Plataforma institucional</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">Gestion escolar con acceso seguro.</h1>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Ingresa para administrar estudiantes, casos, bitacoras, orientacion y documentos desde un entorno privado.
              </p>
            </div>
          </div>
          <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">Datos reales</div>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">Acceso controlado</div>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">Supabase Auth</div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <div className="grid h-11 w-11 place-items-center rounded-md bg-slate-900 text-white">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight">Iniciar sesion</h2>
            <p className="mt-2 text-sm text-slate-600">Usa las credenciales autorizadas por la institucion.</p>
          </div>

          {!isSupabaseAuthConfigured ? (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              Para activar el login, configura `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en `.env.local` y en Vercel.
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Colegio</span>
                <select
                  value={school}
                  onChange={(event) => setSchool(event.target.value)}
                  className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-900"
                >
                  <option value="Colegio San Lucas de Lo Espejo">Colegio San Lucas de Lo Espejo</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Correo</span>
                <div className="mt-2 flex items-center gap-3 rounded-md border border-slate-300 px-3 py-2.5 focus-within:border-slate-900">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="usuario@institucion.cl"
                  />
                </div>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Contrasena</span>
                <div className="mt-2 flex items-center gap-3 rounded-md border border-slate-300 px-3 py-2.5 focus-within:border-slate-900">
                  <Lock className="h-4 w-4 text-slate-400" />
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type="password"
                    autoComplete="current-password"
                    required
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="Tu contrasena"
                  />
                </div>
              </label>
              {error ? <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-md bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300"
              >
                {submitting ? "Verificando..." : "Entrar"}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

function CalendarConnectCard({ onConnect }: { onConnect: (url: string) => void }) {
  const [url, setUrl] = useState("");
  const [open, setOpen] = useState(false);
  return (
    <section className="relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-sky-50 to-white p-5">
      <span className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-200/30 blur-2xl" />
      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 max-w-xl">
          <h2 className="flex items-center gap-2 text-base font-semibold text-blue-900">
            <CalendarDays className="h-5 w-5" /> Conecta Google Calendar
          </h2>
          <p className="mt-1 text-sm text-slate-700">Ve aquí mismo tus eventos del día, sin salir de la vista <strong>Hoy</strong>.</p>
        </div>
        {!open ? (
          <button onClick={() => setOpen(true)} className="tz-press inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-blue-600 to-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-95">
            <CalendarDays className="h-4 w-4" /> Conectar en 30 segundos
          </button>
        ) : null}
      </div>
      {open ? (
        <div className="tz-slide-up relative mt-4 space-y-3">
          <ol className="list-decimal pl-5 text-xs text-slate-700 space-y-1">
            <li>Abre <a className="font-semibold text-blue-700 hover:underline" href="https://calendar.google.com/" target="_blank" rel="noopener noreferrer">Google Calendar ↗</a></li>
            <li>Hover sobre tu calendario → 3 puntos → <strong>Configuración y uso compartido</strong></li>
            <li>Baja a <strong>Integrar el calendario</strong> y copia la <strong>Dirección secreta en formato iCal</strong></li>
            <li>Pégala aquí abajo y guarda.</li>
          </ol>
          <div className="flex flex-wrap gap-2">
            <input
              autoFocus
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://calendar.google.com/calendar/ical/.../basic.ics"
              className="flex-1 rounded-lg border border-blue-200 bg-white px-3 py-2 font-mono text-xs outline-none focus:border-blue-500"
            />
            <button onClick={() => { if (url.trim()) onConnect(url.trim()); }} disabled={!url.trim()} className="tz-press inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50">
              <Check className="h-4 w-4" /> Conectar
            </button>
            <button onClick={() => { setOpen(false); setUrl(""); }} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancelar</button>
          </div>
          <p className="text-[11px] text-rose-700">⚠ Esta URL da acceso de lectura completo a tu calendario. No la compartas.</p>
        </div>
      ) : null}
    </section>
  );
}

type CalendarEvent = {
  summary: string;
  description: string;
  location: string;
  start: string;
  end: string;
  allDay: boolean;
  url?: string;
};

function TodayView({
  store,
  onOpenStudent,
  onNavigate,
  calendarIcalUrl,
  onConnectCalendar,
}: {
  store: DataStore;
  onOpenStudent: (studentId: string) => void;
  onNavigate: (view: ViewId) => void;
  calendarIcalUrl?: string;
  onConnectCalendar: (url: string) => void;
}) {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const in7 = new Date(today.getTime() + 7 * 86400000).toISOString().slice(0, 10);
  const interviewsToday = store.interviews.filter((r) => (r.date || "").slice(0, 10) === todayStr);
  const classesToday = store.orientation.filter((r) => (r.date || "").slice(0, 10) === todayStr);
  const protocolsDue = store.protocols
    .filter((r) => r.dueDate && r.dueDate >= todayStr && r.dueDate <= in7 && r.status !== "Cerrado")
    .sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""));
  const openCases = store.cases.filter((r) => /abierto|seguimiento|activad/i.test(r.status || ""));
  const criticalCases = openCases.filter((r) => /crítica|alta/i.test(r.priority || ""));
  const healthStudents = store.students.filter((s) => (s.healthAlerts || "").trim()).slice(0, 8);
  const unplannedClasses = store.orientation.filter((r) => !(r.planificacion || "").trim() && r.date && r.date >= todayStr && r.date <= in7);

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarError, setCalendarError] = useState("");
  const [calendarFetchedAt, setCalendarFetchedAt] = useState<string>("");
  const loadCalendar = React.useCallback(async () => {
    if (!calendarIcalUrl) return;
    setCalendarLoading(true);
    setCalendarError("");
    try {
      const res = await fetch("/api/calendar/today", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: calendarIcalUrl, date: new Date().toISOString() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        const errField = data.error;
        const msg = typeof errField === "string" ? errField : `Error ${res.status}`;
        throw new Error(msg);
      }
      setCalendarEvents(data.events || []);
      setCalendarFetchedAt(data.fetchedAt || new Date().toISOString());
    } catch (err) {
      setCalendarError(err instanceof Error ? err.message : String(err));
    } finally {
      setCalendarLoading(false);
    }
  }, [calendarIcalUrl]);
  useEffect(() => {
    if (calendarIcalUrl) loadCalendar();
  }, [calendarIcalUrl, loadCalendar]);

  const formatEventTime = (ev: CalendarEvent) => {
    if (ev.allDay) return "Todo el día";
    const s = new Date(ev.start);
    const e = new Date(ev.end);
    const fmt = (d: Date) => d.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
    return `${fmt(s)} – ${fmt(e)}`;
  };

  const Section = ({ title, icon: Icon, count, children, view }: { title: string; icon: LucideIcon; count: number; children: React.ReactNode; view?: ViewId }) => (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
          <Icon className="h-4 w-4 text-slate-600" /> {title}
          <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white">{count}</span>
        </h2>
        {view ? <button onClick={() => onNavigate(view)} className="text-xs font-semibold text-blue-600 hover:underline">Ver todo →</button> : null}
      </div>
      {children}
    </section>
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Hoy</h1>
          <p className="mt-1 text-sm text-slate-600">{today.toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Entrevistas hoy", interviewsToday.length, MessageSquareText, "interviews" as ViewId, "from-sky-500 to-blue-600"],
          ["Clases hoy", classesToday.length, ClipboardList, "orientation" as ViewId, "from-violet-500 to-purple-600"],
          ["Protocolos a 7 días", protocolsDue.length, ShieldCheck, "protocols" as ViewId, "from-amber-500 to-orange-500"],
          ["Casos críticos abiertos", criticalCases.length, AlertTriangle, "cases" as ViewId, "from-rose-500 to-pink-600"],
        ].map(([label, count, Icon, view, tone]) => (
          <button key={String(label)} onClick={() => onNavigate(view as ViewId)} className="tz-card rounded-2xl border border-slate-200 bg-white p-4 text-left">
            <div className={`mb-2 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${tone} text-white shadow-sm`}>
              {React.createElement(Icon as LucideIcon, { className: "h-5 w-5" })}
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label as string}</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums text-slate-950">{count as number}</p>
          </button>
        ))}
      </div>

      {calendarIcalUrl ? (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-blue-50 via-sky-50 to-white px-5 py-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-blue-700">
              <CalendarDays className="h-4 w-4" /> Google Calendar — hoy
              {calendarLoading ? <span className="h-3 w-3 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" /> : null}
              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">{calendarEvents.length}</span>
            </h2>
            <div className="flex items-center gap-2">
              {calendarFetchedAt ? <span className="text-[10px] text-slate-500">Actualizado {new Date(calendarFetchedAt).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}</span> : null}
              <button onClick={loadCalendar} className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50">Recargar</button>
            </div>
          </div>
          <div className="p-4">
            {calendarError ? (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"><strong>Error:</strong> {calendarError}</div>
            ) : calendarEvents.length === 0 ? (
              <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">No hay eventos en tu calendario para hoy.</p>
            ) : (
              <ul className="space-y-2">
                {calendarEvents.map((ev, i) => (
                  <li key={i} className="tz-card flex gap-3 rounded-xl border border-slate-200 p-3">
                    <div className="grid h-12 w-14 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-blue-500 to-sky-600 text-center text-[10px] font-bold leading-tight text-white shadow-sm">
                      <div>
                        <div className="text-sm">{ev.allDay ? "—" : new Date(ev.start).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}</div>
                        <div className="text-[9px] opacity-80">{ev.allDay ? "Todo el día" : new Date(ev.end).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}</div>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-slate-950">{ev.summary}</h3>
                      <p className="text-xs text-slate-500">{formatEventTime(ev)}{ev.location ? ` · ${ev.location}` : ""}</p>
                      {ev.description ? <p className="mt-1 line-clamp-2 text-xs text-slate-600">{ev.description}</p> : null}
                      {ev.url ? <a href={ev.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-[11px] font-semibold text-blue-600 hover:underline">Abrir ↗</a> : null}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ) : (
        <CalendarConnectCard onConnect={onConnectCalendar} />
      )}

      <div className="grid gap-4 xl:grid-cols-2">
        <Section title="Entrevistas de hoy" icon={MessageSquareText} count={interviewsToday.length} view="interviews">
          {interviewsToday.length === 0 ? (
            <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">Sin entrevistas agendadas para hoy.</p>
          ) : (
            <ul className="space-y-2">
              {interviewsToday.map((r) => (
                <li key={r.id} className="rounded-lg border border-slate-200 p-3 text-sm">
                  <strong className="block text-slate-950">{r.reason || "Entrevista"}</strong>
                  <span className="text-slate-600">{r.participant || "—"} · {r.student || ""}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Clases de orientación de hoy" icon={ClipboardList} count={classesToday.length} view="orientation">
          {classesToday.length === 0 ? (
            <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">Sin clases programadas para hoy.</p>
          ) : (
            <ul className="space-y-2">
              {classesToday.map((r) => (
                <li key={r.id} className="rounded-lg border border-slate-200 p-3 text-sm">
                  <strong className="block text-slate-950">{r.topic}</strong>
                  <span className="text-slate-600">{r.course} · {r.orientationOwner}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Protocolos a vencer (7 días)" icon={ShieldCheck} count={protocolsDue.length} view="protocols">
          {protocolsDue.length === 0 ? (
            <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">No hay protocolos próximos a vencer.</p>
          ) : (
            <ul className="space-y-2">
              {protocolsDue.map((r) => (
                <li key={r.id} className="rounded-lg border border-amber-200 bg-amber-50/40 p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-950">{r.title}</strong>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">{r.dueDate}</span>
                  </div>
                  <span className="text-slate-600">{r.student || "—"} · {r.status || ""}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Clases sin planificación" icon={Bell} count={unplannedClasses.length} view="orientation">
          {unplannedClasses.length === 0 ? (
            <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">Todas las clases próximas tienen planificación.</p>
          ) : (
            <ul className="space-y-2">
              {unplannedClasses.slice(0, 6).map((r) => (
                <li key={r.id} className="rounded-lg border border-slate-200 p-3 text-sm">
                  <strong className="block text-slate-950">{r.topic || "Clase sin tema"}</strong>
                  <span className="text-slate-600">{r.course} · {r.date}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Estudiantes con alertas de salud" icon={AlertTriangle} count={healthStudents.length} view="students">
          {healthStudents.length === 0 ? (
            <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">Sin alertas activas.</p>
          ) : (
            <ul className="space-y-2">
              {healthStudents.map((s) => (
                <li key={s.id}>
                  <button onClick={() => onOpenStudent(s.id)} className="flex w-full items-center gap-3 rounded-lg border border-rose-200 bg-rose-50/40 p-3 text-left text-sm hover:bg-rose-50">
                    <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br ${avatarTone(s.id)} text-[10px] font-bold text-white`}>{initialsOf(s.fullName)}</div>
                    <div className="min-w-0 flex-1">
                      <strong className="block truncate text-slate-950">{s.fullName}</strong>
                      <span className="block truncate text-xs text-slate-600">{s.course}</span>
                    </div>
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-700">⚠</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Casos críticos abiertos" icon={AlertTriangle} count={criticalCases.length} view="cases">
          {criticalCases.length === 0 ? (
            <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">Sin casos críticos abiertos.</p>
          ) : (
            <ul className="space-y-2">
              {criticalCases.slice(0, 6).map((r) => (
                <li key={r.id} className="rounded-lg border border-slate-200 p-3 text-sm">
                  <strong className="block text-slate-950">{r.title}</strong>
                  <span className="text-slate-600">{r.student || ""} · {r.priority} · {r.status}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </div>
  );
}

type TriageRecord = {
  entity: "cases" | "interviews" | "logs" | "protocols";
  studentId?: string;
  title?: string;
  category?: string;
  priority?: string;
  status?: string;
  type?: string;
  date?: string;
  description?: string;
};

type TriageResponse = {
  summary?: string;
  involved?: Array<{ studentId?: string; studentName?: string; confidence?: number; evidence?: string }>;
  records?: TriageRecord[];
  notes?: string;
};

type CourseAiResponse = {
  summary?: string;
  teamAdditions?: Array<{ name?: string; role?: string; email?: string; notes?: string }>;
  ercAppend?: string;
  courseCases?: Array<{ title?: string; category?: string; priority?: string; description?: string }>;
  notes?: string;
};

type BulkAiResponse = {
  summary?: string;
  entity?: string;
  headersDetected?: string[];
  records?: Array<{ fields?: Record<string, string>; sourceRow?: number | string; confidence?: number; notes?: string }>;
  skipped?: Array<{ sourceRow?: number | string; reason?: string }>;
  warnings?: string;
};

type AiMode = "chat" | "student" | "course" | "bulk" | "files";

const callAiEndpoint = async (
  url: string,
  body: Record<string, unknown>,
  accessToken: string,
): Promise<{ ok: boolean; result?: unknown; error?: string }> => {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(body),
    });
    let data: { ok?: boolean; error?: unknown; result?: unknown } = {};
    try {
      data = await res.json();
    } catch {
      const txt = await res.text().catch(() => "");
      return { ok: false, error: `Respuesta no válida del servidor (${res.status}). ${txt.slice(0, 200)}` };
    }
    if (!res.ok || !data.ok) {
      const errField = data.error;
      let msg: string;
      if (typeof errField === "string") msg = errField;
      else if (errField && typeof errField === "object") {
        const obj = errField as { message?: string; code?: string };
        msg = obj.message || obj.code || JSON.stringify(errField);
      } else msg = `Error ${res.status}`;
      return { ok: false, error: msg };
    }
    return { ok: true, result: data.result };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
};

function AIAssistantView({
  store,
  accessToken,
  onAddRecord,
  onOpenStudent,
  onUpdateCourse,
}: {
  store: DataStore;
  accessToken: string;
  onAddRecord: (entity: EntityId, record: DataRecord) => void;
  onOpenStudent: (studentId: string) => void;
  onUpdateCourse: (courseName: string, updates: Record<string, string>) => void;
}) {
  const [mode, setMode] = useState<AiMode>("chat");

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight text-slate-950">
            <Sparkles className="h-7 w-7 text-violet-600" />
            Asistente IA
          </h1>
          <p className="mt-1 max-w-3xl text-sm text-slate-600">
            Tres modos: triaje de correos sobre <strong>estudiantes</strong>, actualizaciones de <strong>cursos</strong> a partir de mensajes del equipo de aula, e <strong>importación masiva</strong> desde planillas de Google Sheets / Excel.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1.5">
        {([
          ["chat", "Chat", Sparkles],
          ["student", "Estudiante", UserRound],
          ["course", "Curso", BookOpen],
          ["bulk", "Planilla", FileSpreadsheet],
          ["files", "Archivos", FolderOpen],
        ] as Array<[AiMode, string, LucideIcon]>).map(([key, label, Icon]) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className={`tz-press flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              mode === key ? "bg-slate-900 text-white shadow" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      {mode === "chat" ? (
        <AIChatMode store={store} accessToken={accessToken} onAddRecord={onAddRecord} onOpenStudent={onOpenStudent} onUpdateCourse={onUpdateCourse} />
      ) : null}
      {mode === "student" ? (
        <AIStudentTriage store={store} accessToken={accessToken} onAddRecord={onAddRecord} onOpenStudent={onOpenStudent} />
      ) : null}
      {mode === "course" ? (
        <AICourseUpdate store={store} accessToken={accessToken} onUpdateCourse={onUpdateCourse} onAddRecord={onAddRecord} />
      ) : null}
      {mode === "bulk" ? (
        <AIBulkImport store={store} accessToken={accessToken} onAddRecord={onAddRecord} />
      ) : null}
      {mode === "files" ? (
        <AIFilesImport store={store} accessToken={accessToken} onAddRecord={onAddRecord} onOpenStudent={onOpenStudent} />
      ) : null}
    </div>
  );
}

type ChatResult = {
  intent?: "student_triage" | "course_update" | "bulk_import" | "file_analysis" | "answer";
  summary?: string;
  answer?: string;
  involvedStudents?: Array<{ studentId?: string; studentName?: string; confidence?: number; evidence?: string }>;
  studentRecords?: Array<{ entity: "cases" | "interviews" | "logs" | "protocols"; studentId?: string; title?: string; category?: string; priority?: string; status?: string; type?: string; date?: string; description?: string }>;
  courseTarget?: string;
  teamAdditions?: Array<{ name?: string; role?: string; email?: string }>;
  ercAppend?: string;
  courseCases?: Array<{ title?: string; category?: string; priority?: string; description?: string }>;
  bulkEntity?: string;
  bulkRecords?: Array<{ entity?: string; fields?: Record<string, string>; studentId?: string; confidence?: number }>;
  notes?: string;
};

type ChatTurn = {
  id: string;
  userMessage: string;
  userFiles: string[];
  loading: boolean;
  error?: string;
  result?: ChatResult;
  accepted?: Record<string, boolean>;
};

function AIChatMode({
  store,
  accessToken,
  onAddRecord,
  onOpenStudent,
  onUpdateCourse,
}: {
  store: DataStore;
  accessToken: string;
  onAddRecord: (entity: EntityId, record: DataRecord) => void;
  onOpenStudent: (studentId: string) => void;
  onUpdateCourse: (courseName: string, updates: Record<string, string>) => void;
}) {
  const [draft, setDraft] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [turns]);

  const addFiles = (incoming: FileList | File[]) => {
    setFiles((current) => [...current, ...Array.from(incoming)].slice(0, 6));
  };
  const removeFile = (i: number) => setFiles((c) => c.filter((_, idx) => idx !== i));

  const send = async () => {
    if (!draft.trim() && files.length === 0) return;
    const turnId = uid();
    const userFiles = files.map((f) => f.name);
    const userMessage = draft.trim();
    setTurns((current) => [...current, { id: turnId, userMessage, userFiles, loading: true, accepted: {} }]);
    const submittingFiles = files;
    setDraft("");
    setFiles([]);

    try {
      const fd = new FormData();
      fd.append("message", userMessage);
      fd.append("today", new Date().toISOString().slice(0, 10));
      const roster = store.students.slice(0, 500).map((s) => ({ id: s.id, name: s.fullName || "", course: s.course || "", rut: s.rut || "" }));
      fd.append("roster", JSON.stringify(roster));
      const coursesSeed = officialCourses.map((c) => ({ name: c.name, cycle: c.cycle }));
      fd.append("courses", JSON.stringify(coursesSeed));
      fd.append("dataContext", buildDataContext(store));
      submittingFiles.forEach((f) => fd.append("files", f, f.name));
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { authorization: `Bearer ${accessToken}` },
        body: fd,
      });
      let data: { ok?: boolean; error?: unknown; result?: ChatResult } = {};
      try { data = await res.json(); } catch {
        const t = await res.text().catch(() => "");
        throw new Error(`Respuesta inválida (${res.status}) ${t.slice(0, 200)}`);
      }
      if (!res.ok || !data.ok) {
        const errField = data.error;
        const msg = typeof errField === "string" ? errField : (errField && typeof errField === "object" ? ((errField as { message?: string }).message || JSON.stringify(errField)) : `Error ${res.status}`);
        throw new Error(msg);
      }
      const result = (data.result || {}) as ChatResult;
      const accepted: Record<string, boolean> = {};
      (result.studentRecords || []).forEach((_, i) => { accepted[`sr-${i}`] = true; });
      (result.teamAdditions || []).forEach((_, i) => { accepted[`ta-${i}`] = true; });
      (result.courseCases || []).forEach((_, i) => { accepted[`cc-${i}`] = true; });
      (result.bulkRecords || []).forEach((_, i) => { accepted[`br-${i}`] = true; });
      if ((result.ercAppend || "").trim()) accepted["erc"] = true;
      setTurns((current) => current.map((t) => t.id === turnId ? { ...t, loading: false, result, accepted } : t));
    } catch (err) {
      setTurns((current) => current.map((t) => t.id === turnId ? { ...t, loading: false, error: err instanceof Error ? err.message : String(err) } : t));
    }
  };

  const toggleAccept = (turnId: string, key: string) => {
    setTurns((current) => current.map((t) => t.id === turnId ? { ...t, accepted: { ...(t.accepted || {}), [key]: !(t.accepted?.[key]) } } : t));
  };

  const applyTurn = (turn: ChatTurn) => {
    if (!turn.result) return;
    const r = turn.result;
    const acc = turn.accepted || {};
    let count = 0;

    (r.studentRecords || []).forEach((rec, i) => {
      if (!acc[`sr-${i}`]) return;
      const student = store.students.find((s) => s.id === rec.studentId);
      if (!student) return;
      onAddRecord(rec.entity, {
        id: uid(), createdAt: nowIso(), updatedAt: nowIso(),
        student: student.fullName || "", course: student.course || "",
        date: rec.date || new Date().toISOString().slice(0, 10),
        title: rec.title || "Registro IA",
        category: rec.category || "", priority: rec.priority || "",
        status: rec.status || (rec.entity === "cases" ? "Abierto" : ""),
        type: rec.type || "", description: rec.description || "",
        participant: rec.entity === "interviews" ? (rec.title || student.fullName || "") : "",
        reason: rec.entity === "interviews" ? (rec.title || "") : "",
      });
      count += 1;
    });

    const courseName = (r.courseTarget || "").trim();
    if (courseName) {
      const saved = store.courses.find((c) => normalize(c.name || "") === normalize(courseName));
      const team = parseClassroomTeam(saved?.classroomTeam);
      const newMembers = (r.teamAdditions || []).filter((_, i) => acc[`ta-${i}`]);
      if (newMembers.length > 0) {
        const nextTeam: ClassroomTeamMember[] = [
          ...team,
          ...newMembers.map((m) => ({ id: uid(), name: m.name || "Sin nombre", role: m.role || "Otro apoyo", email: m.email || "", notes: "" })),
        ];
        onUpdateCourse(courseName, { classroomTeam: JSON.stringify(nextTeam) });
        count += newMembers.length;
      }
      if (acc["erc"] && (r.ercAppend || "").trim()) {
        const prev = saved?.ercNotes || "";
        const next = `${prev}${prev.trim() ? "\n\n" : ""}${r.ercAppend}`.trim();
        onUpdateCourse(courseName, { ercNotes: next });
        count += 1;
      }
      (r.courseCases || []).forEach((c, i) => {
        if (!acc[`cc-${i}`]) return;
        onAddRecord("cases", {
          id: uid(), createdAt: nowIso(), updatedAt: nowIso(),
          student: courseName, course: courseName,
          title: c.title || "Caso del curso",
          category: c.category || "", priority: c.priority || "",
          status: "Abierto", description: c.description || "",
        });
        count += 1;
      });
    }

    const bulkEntity = (r.bulkEntity || "") as EntityId;
    (r.bulkRecords || []).forEach((rec, i) => {
      if (!acc[`br-${i}`]) return;
      const entityId = (rec.entity || bulkEntity) as EntityId;
      if (!entityId) return;
      const fields = rec.fields || {};
      const student = rec.studentId ? store.students.find((s) => s.id === rec.studentId) : null;
      const record: DataRecord = { id: uid(), createdAt: nowIso(), updatedAt: nowIso(), ...fields };
      if (student) {
        if (!record.student) record.student = student.fullName || "";
        if (!record.course) record.course = student.course || "";
      }
      onAddRecord(entityId, record);
      count += 1;
    });

    if (count > 0) {
      setTurns((current) => current.map((t) => t.id === turn.id ? { ...t, accepted: undefined, result: { ...r, summary: `✓ ${count} registro${count === 1 ? "" : "s"} creado${count === 1 ? "" : "s"} desde esta consulta.`, studentRecords: [], teamAdditions: [], courseCases: [], bulkRecords: [], ercAppend: "" } } : t));
    }
  };

  const intentLabel: Record<string, { label: string; tone: string }> = {
    student_triage: { label: "Sobre estudiante(s)", tone: "bg-blue-100 text-blue-700" },
    course_update: { label: "Actualización de curso", tone: "bg-emerald-100 text-emerald-700" },
    bulk_import: { label: "Importación masiva", tone: "bg-amber-100 text-amber-700" },
    file_analysis: { label: "Análisis de archivo", tone: "bg-violet-100 text-violet-700" },
    answer: { label: "Respuesta", tone: "bg-slate-100 text-slate-700" },
  };

  return (
    <div className="flex h-[calc(100vh-260px)] min-h-[480px] flex-col rounded-2xl border border-slate-200 bg-white">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        {turns.length === 0 ? (
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-md">
              <Sparkles className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">¿En qué te ayudo hoy?</h2>
            <p className="mt-2 text-sm text-slate-600">Pega un correo, escribe lo que necesitas, o adjunta archivos. Yo detecto si se trata de un estudiante, un curso, o varios registros.</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {[
                "Pega el correo de la profesora jefe de 4°B sobre el conflicto en el recreo",
                "Sube el PDF del informe psicopedagógico de María Pérez",
                "Pega la planilla de talleres realizados este mes",
                "Cuántos casos abiertos de convivencia hay en III° Medio",
              ].map((s) => (
                <button key={s} onClick={() => setDraft(s)} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-left text-sm text-slate-700 hover:bg-blue-50 hover:border-blue-200">
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-5">
            {turns.map((turn) => (
              <div key={turn.id} className="space-y-3">
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-blue-600 px-4 py-2.5 text-sm text-white shadow-sm">
                    {turn.userMessage ? <p className="whitespace-pre-wrap">{turn.userMessage}</p> : <p className="italic opacity-90">(sin texto)</p>}
                    {turn.userFiles.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {turn.userFiles.map((n, i) => <span key={i} className="rounded-md bg-white/15 px-2 py-0.5 text-[11px]">📎 {n}</span>)}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="max-w-[92%] rounded-2xl rounded-tl-md border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
                    {turn.loading ? (
                      <div className="flex items-center gap-2 text-slate-500">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                        Analizando…
                      </div>
                    ) : turn.error ? (
                      <p className="text-rose-700"><strong>Error:</strong> {turn.error}</p>
                    ) : turn.result ? (
                      <ChatResultRenderer
                        turn={turn}
                        result={turn.result}
                        store={store}
                        intentLabel={intentLabel}
                        onToggle={(key) => toggleAccept(turn.id, key)}
                        onApply={() => applyTurn(turn)}
                        onOpenStudent={onOpenStudent}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 bg-slate-50/40 p-3 sm:p-4">
        <div className="mx-auto max-w-3xl">
          {files.length > 0 ? (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {files.map((f, i) => (
                <span key={i} className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs">
                  📎 {f.name} <button onClick={() => removeFile(i)} className="text-slate-400 hover:text-rose-600"><X className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
          ) : null}
          <div className="flex items-end gap-2 rounded-2xl border border-slate-300 bg-white p-2 shadow-sm focus-within:border-violet-500">
            <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.xlsm,.csv,.tsv,.txt,image/*" className="hidden" onChange={(e) => e.target.files && addFiles(e.target.files)} />
            <button onClick={() => fileInputRef.current?.click()} title="Adjuntar" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-slate-100">
              <Upload className="h-4 w-4" />
            </button>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send(); } }}
              placeholder="Pega un correo, escribe algo, o adjunta un archivo. ⌘+Enter para enviar."
              rows={2}
              className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-slate-400"
            />
            <button onClick={send} disabled={!draft.trim() && files.length === 0} className="tz-press inline-flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 px-3 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-50">
              <Sparkles className="h-4 w-4" /> Enviar
            </button>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-400">⌘ + Enter para enviar · La IA detecta automáticamente qué hacer.</p>
        </div>
      </div>
    </div>
  );
}

function ChatResultRenderer({
  turn,
  result,
  store,
  intentLabel,
  onToggle,
  onApply,
  onOpenStudent,
}: {
  turn: ChatTurn;
  result: ChatResult;
  store: DataStore;
  intentLabel: Record<string, { label: string; tone: string }>;
  onToggle: (key: string) => void;
  onApply: () => void;
  onOpenStudent: (id: string) => void;
}) {
  const accepted = turn.accepted || {};
  const intent = result.intent || "answer";
  const meta = intentLabel[intent] || intentLabel.answer;
  const hasProposals = (result.studentRecords?.length || 0)
    + (result.teamAdditions?.length || 0)
    + (result.courseCases?.length || 0)
    + (result.bulkRecords?.length || 0)
    + ((result.ercAppend || "").trim() ? 1 : 0);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${meta.tone}`}>{meta.label}</span>
        {result.courseTarget ? <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">{result.courseTarget}</span> : null}
      </div>
      {result.summary ? <p className="text-slate-800">{result.summary}</p> : null}
      {result.answer ? <p className="whitespace-pre-wrap text-slate-700">{result.answer}</p> : null}
      {result.notes ? <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800"><strong>⚠</strong> {result.notes}</p> : null}

      {(result.involvedStudents || []).length > 0 ? (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Estudiantes detectados</p>
          <div className="flex flex-wrap gap-1.5">
            {(result.involvedStudents || []).map((inv, i) => {
              const student = store.students.find((s) => s.id === inv.studentId);
              const conf = Math.round((inv.confidence || 0) * 100);
              return (
                <button key={i} onClick={() => inv.studentId && onOpenStudent(inv.studentId)} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs hover:bg-slate-50">
                  <span>{student ? student.fullName : inv.studentName || "?"}</span>
                  <span className={`rounded-full px-1 text-[10px] ${conf >= 80 ? "bg-emerald-100 text-emerald-700" : conf >= 50 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>{conf}%</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {(result.studentRecords || []).length > 0 ? (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Registros propuestos</p>
          <div className="space-y-1.5">
            {(result.studentRecords || []).map((rec, i) => {
              const student = store.students.find((s) => s.id === rec.studentId);
              const config = entityConfigs[rec.entity as EntityId];
              return (
                <label key={i} className="flex gap-2 rounded-lg border border-slate-200 p-2 text-xs hover:bg-slate-50">
                  <input type="checkbox" checked={!!accepted[`sr-${i}`]} onChange={() => onToggle(`sr-${i}`)} className="mt-0.5 h-4 w-4" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-violet-700">{config?.label || rec.entity}</span>
                      {rec.priority ? <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">{rec.priority}</span> : null}
                      {student ? <span className="text-[10px] text-slate-500">→ {student.fullName}</span> : null}
                    </div>
                    <p className="mt-0.5 font-semibold text-slate-900">{rec.title}</p>
                    {rec.description ? <p className="text-slate-600 line-clamp-2">{rec.description}</p> : null}
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      ) : null}

      {(result.teamAdditions || []).length > 0 ? (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Nuevos integrantes del equipo de aula</p>
          <div className="space-y-1.5">
            {(result.teamAdditions || []).map((m, i) => (
              <label key={i} className="flex gap-2 rounded-lg border border-slate-200 p-2 text-xs hover:bg-slate-50">
                <input type="checkbox" checked={!!accepted[`ta-${i}`]} onChange={() => onToggle(`ta-${i}`)} className="mt-0.5 h-4 w-4" />
                <div className="flex-1">
                  <p><strong className="text-slate-900">{m.name}</strong> <span className="text-slate-500">— {m.role}</span></p>
                  {m.email ? <p className="text-[10px] text-slate-500">{m.email}</p> : null}
                </div>
              </label>
            ))}
          </div>
        </div>
      ) : null}

      {(result.ercAppend || "").trim() ? (
        <label className="flex gap-2 rounded-lg border border-emerald-200 bg-emerald-50/40 p-2 text-xs">
          <input type="checkbox" checked={!!accepted["erc"]} onChange={() => onToggle("erc")} className="mt-0.5 h-4 w-4" />
          <div className="flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">Agregar a notas ERC</p>
            <p className="mt-0.5 whitespace-pre-wrap text-slate-800">{result.ercAppend}</p>
          </div>
        </label>
      ) : null}

      {(result.courseCases || []).length > 0 ? (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Casos del curso</p>
          <div className="space-y-1.5">
            {(result.courseCases || []).map((c, i) => (
              <label key={i} className="flex gap-2 rounded-lg border border-slate-200 p-2 text-xs hover:bg-slate-50">
                <input type="checkbox" checked={!!accepted[`cc-${i}`]} onChange={() => onToggle(`cc-${i}`)} className="mt-0.5 h-4 w-4" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap gap-1.5">
                    {c.priority ? <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">{c.priority}</span> : null}
                    {c.category ? <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700">{c.category}</span> : null}
                  </div>
                  <p className="mt-0.5 font-semibold text-slate-900">{c.title}</p>
                  {c.description ? <p className="text-slate-600 line-clamp-2">{c.description}</p> : null}
                </div>
              </label>
            ))}
          </div>
        </div>
      ) : null}

      {(result.bulkRecords || []).length > 0 ? (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Registros para crear ({result.bulkEntity || "?"})</p>
          <div className="space-y-1.5">
            {(result.bulkRecords || []).slice(0, 20).map((rec, i) => {
              const conf = Math.round((rec.confidence ?? 0.8) * 100);
              return (
                <label key={i} className="flex gap-2 rounded-lg border border-slate-200 p-2 text-xs hover:bg-slate-50">
                  <input type="checkbox" checked={!!accepted[`br-${i}`]} onChange={() => onToggle(`br-${i}`)} className="mt-0.5 h-4 w-4" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${conf >= 80 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{conf}%</span>
                    </div>
                    <div className="mt-0.5 grid gap-x-3 sm:grid-cols-2">
                      {Object.entries(rec.fields || {}).slice(0, 4).map(([k, v]) => (
                        <div key={k}><strong className="text-slate-700">{k}:</strong> <span className="text-slate-600">{String(v).slice(0, 60)}</span></div>
                      ))}
                    </div>
                  </div>
                </label>
              );
            })}
            {(result.bulkRecords || []).length > 20 ? <p className="text-center text-[11px] text-slate-500">… y {(result.bulkRecords || []).length - 20} más</p> : null}
          </div>
        </div>
      ) : null}

      {hasProposals > 0 ? (
        <div className="flex justify-end pt-1">
          <button onClick={onApply} className="tz-press inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800">
            <Check className="h-3.5 w-3.5" /> Aplicar seleccionados
          </button>
        </div>
      ) : null}
    </div>
  );
}

function AIStudentTriage({
  store,
  accessToken,
  onAddRecord,
  onOpenStudent,
}: {
  store: DataStore;
  accessToken: string;
  onAddRecord: (entity: EntityId, record: DataRecord) => void;
  onOpenStudent: (studentId: string) => void;
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TriageResponse | null>(null);
  const [accepted, setAccepted] = useState<Record<number, boolean>>({});

  const analyze = async () => {
    if (!text.trim()) return;
    setError("");
    setResult(null);
    setAccepted({});
    setLoading(true);
    const students = store.students.map((s) => ({
      id: s.id,
      name: s.fullName || "",
      course: s.course || "",
      rut: s.rut || "",
      guardian: s.guardian || "",
    }));
    const r = await callAiEndpoint("/api/triage", { emailText: text, students, today: new Date().toISOString().slice(0, 10) }, accessToken);
    if (!r.ok) setError(r.error || "Error inesperado");
    else {
      const res = r.result as TriageResponse;
      setResult(res);
      const initial: Record<number, boolean> = {};
      (res.records || []).forEach((_, idx) => { initial[idx] = true; });
      setAccepted(initial);
    }
    setLoading(false);
  };

  const createSelected = () => {
    if (!result?.records) return;
    let created = 0;
    result.records.forEach((rec, idx) => {
      if (!accepted[idx]) return;
      const student = store.students.find((s) => s.id === rec.studentId);
      if (!student) return;
      const record: DataRecord = {
        id: uid(),
        createdAt: nowIso(),
        updatedAt: nowIso(),
        student: student.fullName || "",
        course: student.course || "",
        date: rec.date || new Date().toISOString().slice(0, 10),
        title: rec.title || "Registro IA",
        category: rec.category || "",
        priority: rec.priority || "",
        status: rec.status || (rec.entity === "cases" ? "Abierto" : ""),
        type: rec.type || "",
        description: rec.description || "",
        participant: rec.entity === "interviews" ? (rec.title || student.fullName || "") : "",
        reason: rec.entity === "interviews" ? (rec.title || "") : "",
      };
      onAddRecord(rec.entity, record);
      created += 1;
    });
    if (created > 0) {
      setResult(null);
      setText("");
      setAccepted({});
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Texto del correo o mensaje</span>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Ej.: 'Hola Gustavo, te escribo porque María Pérez de 4°A presentó una crisis de ansiedad en la clase de matemáticas...'"
            className="mt-2 min-h-44 w-full resize-y rounded-lg border border-slate-200 bg-slate-50/30 p-3 text-sm leading-6 outline-none focus:border-violet-500 focus:bg-white"
          />
        </label>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500">{store.students.length} estudiantes disponibles · Google Gemini gratis</p>
          <button
            onClick={analyze}
            disabled={loading || !text.trim() || store.students.length === 0}
            className="tz-press inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-95 disabled:opacity-50"
          >
            {loading ? (<><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />Analizando…</>) : (<><Sparkles className="h-4 w-4" /> Analizar con IA</>)}
          </button>
        </div>
        {error ? <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"><strong>Error:</strong> {error}</div> : null}
      </section>

      {result ? (
        <section className="overflow-hidden rounded-2xl border border-violet-200 bg-white">
          <div className="bg-gradient-to-r from-violet-50 via-blue-50 to-white px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-violet-700">Resumen de la IA</h2>
            <p className="mt-1 text-sm leading-6 text-slate-800">{result.summary || "—"}</p>
            {result.notes ? <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800"><strong>⚠ Atención:</strong> {result.notes}</p> : null}
          </div>
          <div className="border-t border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Estudiantes detectados</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {(result.involved || []).map((inv, idx) => {
                const student = store.students.find((s) => s.id === inv.studentId);
                const conf = Math.round((inv.confidence || 0) * 100);
                return (
                  <button key={idx} onClick={() => inv.studentId && onOpenStudent(inv.studentId)} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 hover:bg-slate-50" title={inv.evidence || ""}>
                    <span className={`grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br ${avatarTone(inv.studentId || "")} text-[10px] text-white`}>{student ? initialsOf(student.fullName) : "?"}</span>
                    <span>{student ? student.fullName : inv.studentName || "Sin coincidencia"}</span>
                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${conf >= 80 ? "bg-emerald-100 text-emerald-700" : conf >= 50 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>{conf}%</span>
                  </button>
                );
              })}
              {(result.involved || []).length === 0 ? <span className="text-sm text-slate-500">Sin coincidencias.</span> : null}
            </div>
          </div>
          <div className="border-t border-slate-100 px-5 py-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Registros propuestos ({(result.records || []).length})</h3>
              <button onClick={createSelected} disabled={!Object.values(accepted).some(Boolean)} className="tz-press inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50">
                <Check className="h-4 w-4" /> Crear seleccionados
              </button>
            </div>
            <div className="space-y-2">
              {(result.records || []).map((rec, idx) => {
                const student = store.students.find((s) => s.id === rec.studentId);
                const entityLabel = entityConfigs[rec.entity as EntityId]?.label || rec.entity;
                return (
                  <article key={idx} className="flex gap-3 rounded-xl border border-slate-200 p-3">
                    <input type="checkbox" checked={accepted[idx] || false} onChange={(event) => setAccepted((c) => ({ ...c, [idx]: event.target.checked }))} className="mt-1.5 h-4 w-4" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-violet-700">{entityLabel}</span>
                        {rec.priority ? <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">{rec.priority}</span> : null}
                        {rec.category ? <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">{rec.category}</span> : null}
                        {rec.date ? <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[10px] text-slate-600">{rec.date}</span> : null}
                      </div>
                      <h4 className="mt-1 text-sm font-semibold text-slate-950">{rec.title || "Sin título"}</h4>
                      <p className="mt-0.5 text-xs text-slate-500">→ {student ? `${student.fullName} (${student.course})` : "Sin estudiante asignado"}</p>
                      {rec.description ? <p className="mt-1.5 line-clamp-3 text-sm text-slate-700">{rec.description}</p> : null}
                    </div>
                  </article>
                );
              })}
              {(result.records || []).length === 0 ? <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">La IA no propuso registros.</p> : null}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function AICourseUpdate({
  store,
  accessToken,
  onUpdateCourse,
  onAddRecord,
}: {
  store: DataStore;
  accessToken: string;
  onUpdateCourse: (courseName: string, updates: Record<string, string>) => void;
  onAddRecord: (entity: EntityId, record: DataRecord) => void;
}) {
  const courseNames = officialCourses.map((c) => c.name);
  const [courseName, setCourseName] = useState(courseNames[0] || "");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CourseAiResponse | null>(null);
  const [acceptTeam, setAcceptTeam] = useState<Record<number, boolean>>({});
  const [acceptCases, setAcceptCases] = useState<Record<number, boolean>>({});
  const [acceptErc, setAcceptErc] = useState(true);

  const savedByName = new Map(store.courses.map((c) => [normalize(c.name || ""), c]));
  const courseRecord = savedByName.get(normalize(courseName));
  const classroomTeam = parseClassroomTeam(courseRecord?.classroomTeam);
  const studentNames = store.students.filter((s) => normalize(s.course || "") === normalize(courseName)).map((s) => s.fullName || "").filter(Boolean);

  const analyze = async () => {
    if (!text.trim() || !courseName) return;
    setError("");
    setResult(null);
    setAcceptTeam({});
    setAcceptCases({});
    setAcceptErc(true);
    setLoading(true);
    const official = officialCourses.find((c) => c.name === courseName);
    const courseContext = {
      name: courseName,
      cycle: official?.cycle,
      orientationOwner: official?.orientationOwner,
      convivenciaCoordinator: official?.convivenciaCoordinator,
      classroomTeam: classroomTeam.map((m) => ({ id: m.id, name: m.name, role: m.role, email: m.email, notes: m.notes })),
      ercNotes: courseRecord?.ercNotes || "",
      studentNames,
    };
    const r = await callAiEndpoint("/api/ai/course", { text, course: courseContext, today: new Date().toISOString().slice(0, 10) }, accessToken);
    if (!r.ok) setError(r.error || "Error inesperado");
    else {
      const res = r.result as CourseAiResponse;
      setResult(res);
      const ti: Record<number, boolean> = {};
      (res.teamAdditions || []).forEach((_, i) => { ti[i] = true; });
      const ci: Record<number, boolean> = {};
      (res.courseCases || []).forEach((_, i) => { ci[i] = true; });
      setAcceptTeam(ti);
      setAcceptCases(ci);
    }
    setLoading(false);
  };

  const applySelected = () => {
    if (!result) return;
    const teamToAdd = (result.teamAdditions || []).filter((_, i) => acceptTeam[i]);
    if (teamToAdd.length) {
      const newTeam: ClassroomTeamMember[] = [
        ...classroomTeam,
        ...teamToAdd.map((m) => ({
          id: uid(),
          name: m.name || "Sin nombre",
          role: m.role || "Otro apoyo",
          email: m.email || "",
          notes: m.notes || "",
        })),
      ];
      onUpdateCourse(courseName, { classroomTeam: JSON.stringify(newTeam) });
    }
    if (acceptErc && (result.ercAppend || "").trim()) {
      const next = `${courseRecord?.ercNotes || ""}${(courseRecord?.ercNotes || "").trim() ? "\n\n" : ""}${result.ercAppend}`.trim();
      onUpdateCourse(courseName, { ercNotes: next });
    }
    (result.courseCases || []).forEach((c, i) => {
      if (!acceptCases[i]) return;
      const rec: DataRecord = {
        id: uid(),
        createdAt: nowIso(),
        updatedAt: nowIso(),
        student: courseName,
        course: courseName,
        title: c.title || "Caso del curso",
        category: c.category || "",
        priority: c.priority || "",
        status: "Abierto",
        description: c.description || "",
      };
      onAddRecord("cases", rec);
    });
    setResult(null);
    setText("");
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="grid gap-3 md:grid-cols-[260px_1fr]">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Curso</span>
            <select value={courseName} onChange={(event) => setCourseName(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-500">
              {courseNames.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              <p><strong>{classroomTeam.length}</strong> en equipo de aula · <strong>{studentNames.length}</strong> estudiantes</p>
              {(courseRecord?.ercNotes || "").trim() ? <p className="mt-1 line-clamp-3">Notas ERC: {courseRecord?.ercNotes}</p> : null}
            </div>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Correo o mensaje sobre el curso</span>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Ej.: 'Hola, soy Carolina, profe jefe de 3°B. Te aviso que esta semana se sumó al equipo Camila Soto, educadora diferencial (c.soto@colegio.cl). Además, hubo conflicto entre 4 estudiantes durante el recreo, necesitamos abordarlo en convivencia. Próxima reunión ERC el viernes 14.'"
              className="mt-2 min-h-44 w-full resize-y rounded-lg border border-slate-200 bg-slate-50/30 p-3 text-sm leading-6 outline-none focus:border-violet-500 focus:bg-white"
            />
          </label>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500">La IA puede sumar miembros al equipo de aula, agregar notas ERC o crear casos del curso.</p>
          <button onClick={analyze} disabled={loading || !text.trim()} className="tz-press inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-95 disabled:opacity-50">
            {loading ? (<><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />Analizando…</>) : (<><Sparkles className="h-4 w-4" /> Analizar con IA</>)}
          </button>
        </div>
        {error ? <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"><strong>Error:</strong> {error}</div> : null}
      </section>

      {result ? (
        <section className="space-y-4 overflow-hidden rounded-2xl border border-violet-200 bg-white p-5">
          <div className="rounded-lg bg-gradient-to-r from-violet-50 to-blue-50 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-violet-700">Resumen</h3>
            <p className="mt-1 text-sm leading-6 text-slate-800">{result.summary || "—"}</p>
            {result.notes ? <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800"><strong>⚠</strong> {result.notes}</p> : null}
          </div>

          {(result.teamAdditions || []).length > 0 ? (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Nuevos integrantes propuestos</h3>
              <div className="mt-2 space-y-2">
                {(result.teamAdditions || []).map((m, i) => (
                  <label key={i} className="flex gap-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-50">
                    <input type="checkbox" checked={acceptTeam[i] || false} onChange={(e) => setAcceptTeam((c) => ({ ...c, [i]: e.target.checked }))} className="mt-1 h-4 w-4" />
                    <div className="flex-1">
                      <strong className="text-sm text-slate-950">{m.name || "Sin nombre"}</strong>
                      <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">{m.role}</span>
                      {m.email ? <p className="text-xs text-slate-500">{m.email}</p> : null}
                      {m.notes ? <p className="text-xs text-slate-600">{m.notes}</p> : null}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          {(result.ercAppend || "").trim() ? (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Agregar a notas ERC</h3>
              <label className="mt-2 flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50/40 p-3">
                <input type="checkbox" checked={acceptErc} onChange={(e) => setAcceptErc(e.target.checked)} className="mt-1 h-4 w-4" />
                <p className="whitespace-pre-wrap text-sm text-slate-800">{result.ercAppend}</p>
              </label>
            </div>
          ) : null}

          {(result.courseCases || []).length > 0 ? (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Casos del curso propuestos</h3>
              <div className="mt-2 space-y-2">
                {(result.courseCases || []).map((c, i) => (
                  <label key={i} className="flex gap-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-50">
                    <input type="checkbox" checked={acceptCases[i] || false} onChange={(e) => setAcceptCases((cur) => ({ ...cur, [i]: e.target.checked }))} className="mt-1 h-4 w-4" />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <strong className="text-sm text-slate-950">{c.title}</strong>
                        {c.priority ? <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">{c.priority}</span> : null}
                        {c.category ? <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">{c.category}</span> : null}
                      </div>
                      {c.description ? <p className="mt-1 text-sm text-slate-700">{c.description}</p> : null}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex justify-end">
            <button onClick={applySelected} className="tz-press inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">
              <Check className="h-4 w-4" /> Aplicar cambios seleccionados
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function AIBulkImport({
  store,
  accessToken,
  onAddRecord,
}: {
  store: DataStore;
  accessToken: string;
  onAddRecord: (entity: EntityId, record: DataRecord) => void;
}) {
  const [entity, setEntity] = useState<EntityId>("workshops");
  const [tableText, setTableText] = useState("");
  const [instruction, setInstruction] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<BulkAiResponse | null>(null);
  const [accepted, setAccepted] = useState<Record<number, boolean>>({});

  const analyze = async () => {
    if (!tableText.trim()) return;
    setError("");
    setResult(null);
    setAccepted({});
    setLoading(true);
    const r = await callAiEndpoint("/api/ai/bulk", { tableText, entity, instruction, today: new Date().toISOString().slice(0, 10) }, accessToken);
    if (!r.ok) setError(r.error || "Error inesperado");
    else {
      const res = r.result as BulkAiResponse;
      setResult(res);
      const initial: Record<number, boolean> = {};
      (res.records || []).forEach((_, i) => { initial[i] = true; });
      setAccepted(initial);
    }
    setLoading(false);
  };

  const createSelected = () => {
    if (!result?.records) return;
    let count = 0;
    result.records.forEach((rec, i) => {
      if (!accepted[i]) return;
      const fields = rec.fields || {};
      const record: DataRecord = { id: uid(), createdAt: nowIso(), updatedAt: nowIso(), ...fields };
      onAddRecord(entity, record);
      count += 1;
    });
    if (count > 0) {
      setResult(null);
      setTableText("");
      setInstruction("");
      setAccepted({});
    }
  };

  const entityOptions: Array<[EntityId, string]> = [
    ["workshops", "Talleres"],
    ["orientation", "Clases de orientación"],
    ["logs", "Bitácoras"],
    ["interviews", "Entrevistas"],
    ["cases", "Casos"],
    ["documents", "Documentos"],
    ["protocols", "Protocolos"],
    ["students", "Estudiantes"],
    ["courses", "Cursos"],
  ];

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Importar como</span>
            <select value={entity} onChange={(e) => setEntity(e.target.value as EntityId)} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-500">
              {entityOptions.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Instrucción opcional (en lenguaje natural)</span>
            <input value={instruction} onChange={(e) => setInstruction(e.target.value)} placeholder="Ej.: 'Estos son los talleres de junio, marca como Realizado los que tienen fecha pasada'" className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-500" />
          </label>
        </div>
        <label className="mt-3 block">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tabla pegada desde Google Sheets / Excel / CSV</span>
          <textarea
            value={tableText}
            onChange={(e) => setTableText(e.target.value)}
            placeholder={"Selecciona en Sheets/Excel desde la fila de headers e incluye los datos, copia con Cmd+C y pega aquí.\n\nFecha\tTaller\tParticipantes\tEstado\n2026-06-04\tEducación emocional\t3°A\tRealizado\n..."}
            className="mt-2 min-h-44 w-full resize-y rounded-lg border border-slate-200 bg-slate-50/30 p-3 font-mono text-xs leading-5 outline-none focus:border-violet-500 focus:bg-white"
          />
        </label>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500">La IA mapea columnas a los campos válidos. Tú confirmas qué se crea.</p>
          <button onClick={analyze} disabled={loading || !tableText.trim()} className="tz-press inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-95 disabled:opacity-50">
            {loading ? (<><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />Analizando…</>) : (<><Sparkles className="h-4 w-4" /> Analizar con IA</>)}
          </button>
        </div>
        {error ? <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"><strong>Error:</strong> {error}</div> : null}
      </section>

      {result ? (
        <section className="overflow-hidden rounded-2xl border border-violet-200 bg-white">
          <div className="bg-gradient-to-r from-violet-50 via-blue-50 to-white px-5 py-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-violet-700">Resumen</h3>
            <p className="mt-1 text-sm leading-6 text-slate-800">{result.summary || "—"}</p>
            {(result.headersDetected || []).length > 0 ? (
              <p className="mt-2 text-xs text-slate-600">Columnas detectadas: {(result.headersDetected || []).map((h) => <code key={h} className="mx-0.5 rounded bg-slate-100 px-1.5 py-0.5 text-[11px]">{h}</code>)}</p>
            ) : null}
            {result.warnings ? <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800"><strong>⚠</strong> {result.warnings}</p> : null}
          </div>
          <div className="border-t border-slate-100 px-5 py-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Registros listos para crear ({(result.records || []).length})</h3>
              <button onClick={createSelected} disabled={!Object.values(accepted).some(Boolean)} className="tz-press inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50">
                <Check className="h-4 w-4" /> Crear seleccionados
              </button>
            </div>
            <div className="space-y-2">
              {(result.records || []).map((rec, i) => {
                const conf = Math.round((rec.confidence ?? 0.8) * 100);
                return (
                  <label key={i} className="flex gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50">
                    <input type="checkbox" checked={accepted[i] || false} onChange={(e) => setAccepted((c) => ({ ...c, [i]: e.target.checked }))} className="mt-1 h-4 w-4" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {rec.sourceRow !== undefined ? <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">fila {rec.sourceRow}</span> : null}
                        <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${conf >= 80 ? "bg-emerald-100 text-emerald-700" : conf >= 50 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>{conf}%</span>
                        {rec.notes ? <span className="text-[10px] text-slate-500">— {rec.notes}</span> : null}
                      </div>
                      <div className="mt-1 grid gap-x-3 gap-y-0.5 text-xs sm:grid-cols-2">
                        {Object.entries(rec.fields || {}).map(([k, v]) => (
                          <div key={k}><strong className="text-slate-700">{k}:</strong> <span className="text-slate-600">{String(v).slice(0, 80)}</span></div>
                        ))}
                      </div>
                    </div>
                  </label>
                );
              })}
              {(result.records || []).length === 0 ? <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">La IA no extrajo registros.</p> : null}
            </div>
            {(result.skipped || []).length > 0 ? (
              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                <strong>Filas omitidas ({(result.skipped || []).length})</strong>
                <ul className="mt-1 list-disc pl-4">
                  {(result.skipped || []).map((s, i) => <li key={i}>Fila {s.sourceRow}: {s.reason}</li>)}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}

type FilesAiResult = {
  summary?: string;
  entity?: string;
  records?: Array<{
    fields?: Record<string, string>;
    studentId?: string;
    studentName?: string;
    sourceFile?: string;
    sourceRow?: number | string;
    confidence?: number;
    notes?: string;
  }>;
  skipped?: Array<{ sourceFile?: string; sourceRow?: number | string; reason?: string }>;
  warnings?: string;
};

function AIFilesImport({
  store,
  accessToken,
  onAddRecord,
  onOpenStudent,
}: {
  store: DataStore;
  accessToken: string;
  onAddRecord: (entity: EntityId, record: DataRecord) => void;
  onOpenStudent: (studentId: string) => void;
}) {
  const [entity, setEntity] = useState<EntityId>("documents");
  const [files, setFiles] = useState<File[]>([]);
  const [targetStudentId, setTargetStudentId] = useState<string>("");
  const [instruction, setInstruction] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<FilesAiResult | null>(null);
  const [accepted, setAccepted] = useState<Record<number, boolean>>({});
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const entityOptions: Array<[EntityId, string]> = [
    ["documents", "Documentos"],
    ["workshops", "Talleres"],
    ["orientation", "Clases de orientación"],
    ["logs", "Bitácoras"],
    ["interviews", "Entrevistas"],
    ["cases", "Casos"],
    ["protocols", "Protocolos"],
    ["students", "Estudiantes"],
    ["courses", "Cursos"],
  ];

  const addFiles = (incoming: FileList | File[]) => {
    const arr = Array.from(incoming);
    setFiles((current) => [...current, ...arr].slice(0, 8));
  };

  const removeFile = (index: number) => {
    setFiles((current) => current.filter((_, i) => i !== index));
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    if (event.dataTransfer.files?.length) addFiles(event.dataTransfer.files);
  };

  const totalMB = files.reduce((s, f) => s + f.size, 0) / 1024 / 1024;

  const analyze = async () => {
    if (files.length === 0) return;
    setError("");
    setResult(null);
    setAccepted({});
    setLoading(true);
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append("files", f, f.name));
      fd.append("entity", entity);
      if (instruction.trim()) fd.append("instruction", instruction.trim());
      if (targetStudentId) fd.append("targetStudentId", targetStudentId);
      fd.append("today", new Date().toISOString().slice(0, 10));
      const roster = store.students.slice(0, 500).map((s) => ({ id: s.id, name: s.fullName || "", course: s.course || "", rut: s.rut || "" }));
      fd.append("roster", JSON.stringify(roster));
      const res = await fetch("/api/ai/files", {
        method: "POST",
        headers: { authorization: `Bearer ${accessToken}` },
        body: fd,
      });
      let data: { ok?: boolean; error?: unknown; result?: FilesAiResult } = {};
      try {
        data = await res.json();
      } catch {
        const txt = await res.text().catch(() => "");
        throw new Error(`Respuesta no válida (${res.status}). ${txt.slice(0, 200)}`);
      }
      if (!res.ok || !data.ok) {
        const errField = data.error;
        let msg: string;
        if (typeof errField === "string") msg = errField;
        else if (errField && typeof errField === "object") {
          const obj = errField as { message?: string; code?: string };
          msg = obj.message || obj.code || JSON.stringify(errField);
        } else msg = `Error ${res.status}`;
        throw new Error(msg);
      }
      setResult(data.result || null);
      const initial: Record<number, boolean> = {};
      (data.result?.records || []).forEach((_, i) => { initial[i] = true; });
      setAccepted(initial);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const createSelected = () => {
    if (!result?.records) return;
    let count = 0;
    result.records.forEach((rec, i) => {
      if (!accepted[i]) return;
      const fields = rec.fields || {};
      const student = rec.studentId ? store.students.find((s) => s.id === rec.studentId) : null;
      const record: DataRecord = {
        id: uid(),
        createdAt: nowIso(),
        updatedAt: nowIso(),
        ...fields,
      };
      // Auto-link student name/course if available.
      if (student && !record.student) record.student = student.fullName || "";
      if (student && !record.course) record.course = student.course || "";
      onAddRecord(entity, record);
      count += 1;
    });
    if (count > 0) {
      setResult(null);
      setFiles([]);
      setInstruction("");
      setAccepted({});
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Importar como</span>
            <select value={entity} onChange={(e) => setEntity(e.target.value as EntityId)} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-500">
              {entityOptions.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Estudiante objetivo (opcional)</span>
            <select value={targetStudentId} onChange={(e) => setTargetStudentId(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-500">
              <option value="">— Ninguno (la IA detecta —</option>
              {store.students.slice(0, 500).map((s) => <option key={s.id} value={s.id}>{s.fullName} · {s.course}</option>)}
            </select>
            <p className="mt-1 text-[11px] text-slate-500">Si todos los archivos refieren al mismo estudiante, selecciónalo acá.</p>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Instrucción opcional</span>
            <input value={instruction} onChange={(e) => setInstruction(e.target.value)} placeholder="Ej.: 'Este PDF es el informe psicopedagógico de María, súbelo como documento de la ficha de María Pérez'" className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-500" />
          </label>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`mt-4 rounded-2xl border-2 border-dashed p-6 text-center transition ${dragOver ? "border-violet-500 bg-violet-50" : "border-slate-300 bg-slate-50/40"}`}
        >
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-md">
            <Upload className="h-5 w-5" />
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-900">Arrastra archivos aquí o haz click para seleccionar</p>
          <p className="mt-1 text-xs text-slate-500">PDF · Word (.docx) · Excel (.xlsx) · CSV · TSV · TXT · Imágenes — máx. 12 MB total</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,.xlsm,.csv,.tsv,.txt,image/*"
            className="hidden"
            onChange={(e) => e.target.files && addFiles(e.target.files)}
          />
          <button onClick={() => fileInputRef.current?.click()} className="tz-press mt-3 inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <Plus className="h-4 w-4" /> Seleccionar archivos
          </button>
        </div>

        {files.length > 0 ? (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{files.length} archivo{files.length === 1 ? "" : "s"} · {totalMB.toFixed(1)} MB total</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {files.map((f, i) => (
                <div key={`${f.name}-${i}`} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-slate-100 text-slate-600">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900">{f.name}</p>
                    <p className="text-[11px] text-slate-500">{(f.size / 1024).toFixed(0)} KB · {f.type || "tipo desconocido"}</p>
                  </div>
                  <button onClick={() => removeFile(i)} className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500">La IA extrae texto/tablas, parsea PDFs e imágenes nativamente, y propone qué crear.</p>
          <button onClick={analyze} disabled={loading || files.length === 0} className="tz-press inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-95 disabled:opacity-50">
            {loading ? (<><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />Analizando…</>) : (<><Sparkles className="h-4 w-4" /> Analizar archivos</>)}
          </button>
        </div>
        {error ? <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"><strong>Error:</strong> {error}</div> : null}
      </section>

      {result ? (
        <section className="overflow-hidden rounded-2xl border border-violet-200 bg-white">
          <div className="bg-gradient-to-r from-violet-50 via-blue-50 to-white px-5 py-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-violet-700">Resumen</h3>
            <p className="mt-1 text-sm leading-6 text-slate-800">{result.summary || "—"}</p>
            {result.warnings ? <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800"><strong>⚠</strong> {result.warnings}</p> : null}
          </div>
          <div className="border-t border-slate-100 px-5 py-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Registros listos para crear ({(result.records || []).length})</h3>
              <button onClick={createSelected} disabled={!Object.values(accepted).some(Boolean)} className="tz-press inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50">
                <Check className="h-4 w-4" /> Crear seleccionados
              </button>
            </div>
            <div className="space-y-2">
              {(result.records || []).map((rec, i) => {
                const conf = Math.round((rec.confidence ?? 0.8) * 100);
                const student = rec.studentId ? store.students.find((s) => s.id === rec.studentId) : null;
                return (
                  <label key={i} className="flex gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50">
                    <input type="checkbox" checked={accepted[i] || false} onChange={(e) => setAccepted((c) => ({ ...c, [i]: e.target.checked }))} className="mt-1 h-4 w-4" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {rec.sourceFile ? <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">{rec.sourceFile}{rec.sourceRow !== undefined ? ` · fila ${rec.sourceRow}` : ""}</span> : null}
                        <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${conf >= 80 ? "bg-emerald-100 text-emerald-700" : conf >= 50 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>{conf}%</span>
                        {student ? (
                          <button type="button" onClick={(e) => { e.preventDefault(); onOpenStudent(student.id); }} className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 hover:bg-blue-100">→ {student.fullName}</button>
                        ) : rec.studentName ? <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700">sin match: {rec.studentName}</span> : null}
                        {rec.notes ? <span className="text-[10px] text-slate-500">— {rec.notes}</span> : null}
                      </div>
                      <div className="mt-1 grid gap-x-3 gap-y-0.5 text-xs sm:grid-cols-2">
                        {Object.entries(rec.fields || {}).map(([k, v]) => (
                          <div key={k}><strong className="text-slate-700">{k}:</strong> <span className="text-slate-600">{String(v).slice(0, 80)}</span></div>
                        ))}
                      </div>
                    </div>
                  </label>
                );
              })}
              {(result.records || []).length === 0 ? <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">La IA no extrajo registros.</p> : null}
            </div>
            {(result.skipped || []).length > 0 ? (
              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                <strong>Omitidos ({(result.skipped || []).length})</strong>
                <ul className="mt-1 list-disc pl-4">
                  {(result.skipped || []).map((s, i) => <li key={i}>{s.sourceFile}{s.sourceRow !== undefined ? ` fila ${s.sourceRow}` : ""}: {s.reason}</li>)}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function ReportsView({ store }: { store: DataStore }) {
  const casesByCategory = new Map<string, number>();
  store.cases.forEach((c) => {
    const k = c.category || "Sin categoría";
    casesByCategory.set(k, (casesByCategory.get(k) || 0) + 1);
  });
  const casesByPriority = new Map<string, number>();
  store.cases.forEach((c) => {
    const k = c.priority || "Sin prioridad";
    casesByPriority.set(k, (casesByPriority.get(k) || 0) + 1);
  });
  const casesByCourse = new Map<string, number>();
  store.cases.forEach((c) => {
    const k = c.course || "Sin curso";
    casesByCourse.set(k, (casesByCourse.get(k) || 0) + 1);
  });
  const interviewsByMonth = new Map<string, number>();
  store.interviews.forEach((r) => {
    const k = (r.date || "").slice(0, 7) || "sin fecha";
    interviewsByMonth.set(k, (interviewsByMonth.get(k) || 0) + 1);
  });

  const Bar = ({ data, color = "bg-blue-500" }: { data: Map<string, number>; color?: string }) => {
    const entries = Array.from(data.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const max = Math.max(1, ...entries.map(([, v]) => v));
    return (
      <div className="space-y-1.5">
        {entries.length === 0 ? <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">Sin datos.</p> : entries.map(([label, value]) => (
          <div key={label} className="text-sm">
            <div className="flex items-baseline justify-between gap-2">
              <span className="truncate text-slate-700">{label}</span>
              <span className="tabular-nums font-semibold text-slate-900">{value}</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full ${color}`} style={{ width: `${(value / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight text-slate-950">
          <PieChart className="h-7 w-7 text-slate-700" />
          Reportes
        </h1>
        <p className="mt-1 text-sm text-slate-600">Indicadores rápidos para tomar decisiones.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="tz-card rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Casos por categoría</h2>
          <div className="mt-4"><Bar data={casesByCategory} color="bg-blue-500" /></div>
        </section>
        <section className="tz-card rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Casos por prioridad</h2>
          <div className="mt-4"><Bar data={casesByPriority} color="bg-rose-500" /></div>
        </section>
        <section className="tz-card rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Top 10 cursos con más casos</h2>
          <div className="mt-4"><Bar data={casesByCourse} color="bg-amber-500" /></div>
        </section>
        <section className="tz-card rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Entrevistas por mes</h2>
          <div className="mt-4"><Bar data={interviewsByMonth} color="bg-emerald-500" /></div>
        </section>
      </div>
    </div>
  );
}

export default function TizaEducationApp() {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState("");
  const [authLoading, setAuthLoading] = useState(isSupabaseAuthConfigured);
  const [store, setStore] = useState<DataStore>(() => {
    if (typeof window === "undefined") return emptyStore();
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    try {
      return { ...emptyStore(), ...JSON.parse(raw) };
    } catch {
      return emptyStore();
    }
  });
  const [viewHistory, setViewHistory] = useState<ViewId[]>(["dashboard"]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const activeView = viewHistory[historyIndex];
  const navigate = (next: ViewId) => {
    if (next === activeView) return;
    setViewHistory((current) => {
      const truncated = current.slice(0, historyIndex + 1);
      return [...truncated, next].slice(-30); // cap at 30
    });
    setHistoryIndex((idx) => Math.min(idx + 1, 29));
  };
  const setActiveView = navigate;
  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < viewHistory.length - 1;
  const goBack = () => {
    if (canGoBack) setHistoryIndex((idx) => idx - 1);
  };
  const goForward = () => {
    if (canGoForward) setHistoryIndex((idx) => idx + 1);
  };
  const [detailStudentId, setDetailStudentId] = useState("");
  const [detailFocusField, setDetailFocusField] = useState("");
  const [commandOpen, setCommandOpen] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarFetchedAt, setCalendarFetchedAt] = useState<string>("");

  const openStudent = (studentId: string, focusField?: string) => {
    setDetailStudentId(studentId);
    setDetailFocusField(focusField || "");
  };

  const closeStudent = () => {
    setDetailStudentId("");
    setDetailFocusField("");
  };
  const [query, setQuery] = useState("");
  const [dialogEntity, setDialogEntity] = useState<EntityId | null>(null);
  const [parsed, setParsed] = useState<ParsedSheet | null>(null);
  const [plan, setPlan] = useState<ImportPlan | null>(null);
  const [toast, setToast] = useState("");
  const [remoteLoaded, setRemoteLoaded] = useState(!isSupabaseAuthConfigured);
  const [remoteStatus, setRemoteStatus] = useState<"local" | "loading" | "synced" | "saving" | "error">("local");
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [teamSeeding, setTeamSeeding] = useState(false);
  const [teamSeedNotice, setTeamSeedNotice] = useState("");
  const [profile, setProfile] = useState<Record<string, string>>(() => {
    const defaults = {
      organization: "Colegio San Lucas",
      role: "Orientación / Convivencia",
      year: "2026",
      professional: "",
    };
    if (typeof window === "undefined") return defaults;
    const savedProfile = window.localStorage.getItem(PROFILE_KEY);
    if (!savedProfile) return defaults;
    try {
      return { ...defaults, ...JSON.parse(savedProfile) };
    } catch {
      return defaults;
    }
  });

  useEffect(() => {
    if (!supabaseAuth) {
      return;
    }

    let mounted = true;
    supabaseAuth.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setAuthUser(data.session?.user ?? null);
      setAccessToken(data.session?.access_token ?? "");
      setAuthLoading(false);
    });

    const { data: listener } = supabaseAuth.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
      setAccessToken(session?.access_token ?? "");
      setAuthLoading(false);
      setRemoteLoaded(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authUser || !accessToken) {
      return;
    }

    let cancelled = false;
    const loadRemoteStore = async () => {
      setRemoteStatus("loading");
      try {
        const response = await fetch("/api/records", {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.error || "No se pudieron cargar los datos remotos.");
        }
        const payload = await response.json();
        if (cancelled) return;
        setStore({ ...emptyStore(), ...(payload.store || {}) });
        setRemoteLoaded(true);
        setRemoteStatus("synced");
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setRemoteLoaded(true);
          setRemoteStatus("error");
          setToast("No se pudo sincronizar Supabase. Usando respaldo local.");
        }
      }
    };

    loadRemoteStore();
    return () => {
      cancelled = true;
    };
  }, [authUser, accessToken]);

  useEffect(() => {
    if (!authUser || !accessToken) {
      return;
    }

    let cancelled = false;
    const loadTeam = async () => {
      try {
        const response = await fetch("/api/team", {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.error || "No se pudo cargar el equipo.");
        }
        const payload = await response.json();
        if (!cancelled) setTeam(payload.team || []);
      } catch (error) {
        console.error(error);
        if (!cancelled) setToast("No se pudo cargar el equipo institucional.");
      }
    };

    loadTeam();
    return () => {
      cancelled = true;
    };
  }, [authUser, accessToken]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }, [store]);

  useEffect(() => {
    if (!authUser || !accessToken || !remoteLoaded) return;

    const timer = window.setTimeout(async () => {
      setRemoteStatus("saving");
      try {
        const response = await fetch("/api/records", {
          method: "PUT",
          headers: {
            authorization: `Bearer ${accessToken}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({ store }),
        });
        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.error || "No se pudieron guardar los datos remotos.");
        }
        setRemoteStatus("synced");
      } catch (error) {
        console.error(error);
        setRemoteStatus("error");
      }
    }, 700);

    return () => window.clearTimeout(timer);
  }, [store, authUser, accessToken, remoteLoaded]);

  useEffect(() => {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const reloadCalendar = React.useCallback(async () => {
    const url = profile.calendarIcalUrl;
    if (!url) { setCalendarEvents([]); return; }
    setCalendarLoading(true);
    try {
      const res = await fetch("/api/calendar/today", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url, date: new Date().toISOString() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setCalendarEvents(data.events || []);
        setCalendarFetchedAt(data.fetchedAt || new Date().toISOString());
      } else {
        setCalendarEvents([]);
      }
    } catch {
      setCalendarEvents([]);
    } finally {
      setCalendarLoading(false);
    }
  }, [profile.calendarIcalUrl]);

  useEffect(() => {
    reloadCalendar();
  }, [reloadCalendar]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((value) => !value);
      } else if ((event.metaKey || event.ctrlKey) && event.key === "[") {
        event.preventDefault();
        goBack();
      } else if ((event.metaKey || event.ctrlKey) && event.key === "]") {
        event.preventDefault();
        goForward();
      } else if (event.key === "/" && !commandOpen) {
        const target = event.target as HTMLElement | null;
        if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
        event.preventDefault();
        setCommandOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [commandOpen, canGoBack, canGoForward]);

  const addRecord = (entity: EntityId, record: DataRecord) => {
    setStore((current) => ({ ...current, [entity]: [record, ...current[entity]] }));
    setDialogEntity(null);
    setToast(`${entityConfigs[entity].singular} guardado`);
  };

  const signIn = async (email: string, password: string) => {
    if (!supabaseAuth) throw new Error("Supabase Auth no esta configurado.");
    const { error } = await supabaseAuth.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  };

  const signOut = async () => {
    if (!supabaseAuth) return;
    await supabaseAuth.auth.signOut();
    setAccessToken("");
    setRemoteStatus("local");
    setRemoteLoaded(false);
    setTeam([]);
    setToast("Sesion cerrada");
  };

  const seedTeam = async () => {
    if (!accessToken) return;
    setTeamSeeding(true);
    setTeamSeedNotice("");
    try {
      const response = await fetch("/api/team/seed", {
        method: "POST",
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "No se pudo crear el equipo.");

      const teamResponse = await fetch("/api/team", {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      const teamPayload = await teamResponse.json();
      if (teamResponse.ok) setTeam(teamPayload.team || []);

      const created = (payload.results || []).filter((item: { action: string }) => item.action === "created").length;
      const updated = (payload.results || []).filter((item: { action: string }) => item.action === "updated").length;
      setTeamSeedNotice(`${created} usuarios creados y ${updated} perfiles actualizados. Contraseña temporal para usuarios nuevos: ${payload.temporaryPassword}`);
      setToast("Equipo institucional actualizado");
    } catch (error) {
      console.error(error);
      setToast(error instanceof Error ? error.message : "No se pudo crear el equipo.");
    } finally {
      setTeamSeeding(false);
    }
  };

  const deleteRecord = (entity: EntityId, id: string) => {
    setStore((current) => ({ ...current, [entity]: current[entity].filter((record) => record.id !== id) }));
    setToast("Registro eliminado");
  };

  const seedOfficialCourses = (silent = false) => {
    setStore((current) => {
      const officialByName = new Map(officialCourses.map((course) => [normalize(course.name), course]));
      const existing = new Set(current.courses.map((course) => normalize(course.name || "")));
      const updatedCourses = current.courses.map((record) => {
        const official = officialByName.get(normalize(record.name || ""));
        if (!official) return record;
        return {
          ...record,
          cycle: official.cycle,
          orientationOwner: official.orientationOwner,
          orientationEmail: official.orientationEmail,
          convivenciaCoordinator: official.convivenciaCoordinator,
          convivenciaEmail: official.convivenciaEmail,
          capacity: record.capacity || String(official.capacity),
          updatedAt: nowIso(),
        };
      });
      const missing = officialCourses
        .filter((course) => !existing.has(normalize(course.name)))
        .map(makeCourseRecord);

      return { ...current, courses: [...updatedCourses, ...missing] };
    });
    if (!silent) setToast("Cursos oficiales y duplas por ciclo actualizadas");
  };

  const autoSeededRef = React.useRef(false);
  useEffect(() => {
    if (!remoteLoaded || autoSeededRef.current) return;
    const existing = new Set(store.courses.map((course) => normalize(course.name || "")));
    const missing = officialCourses.some((course) => !existing.has(normalize(course.name)));
    if (missing) {
      autoSeededRef.current = true;
      seedOfficialCourses(true);
    } else {
      autoSeededRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remoteLoaded]);

  const updateCourseRecord = (courseName: string, updates: Record<string, string>) => {
    setStore((current) => {
      const official = officialCourses.find((course) => normalize(course.name) === normalize(courseName));
      const baseRecord = official ? makeCourseRecord(official) : {
        id: `course-${normalize(courseName).replace(/\s+/g, "-")}`,
        createdAt: nowIso(),
        updatedAt: nowIso(),
        name: courseName,
      };
      const exists = current.courses.some((course) => normalize(course.name || "") === normalize(courseName));
      const nextRecord = (record: DataRecord) => ({ ...record, ...updates, updatedAt: nowIso() });

      return {
        ...current,
        courses: exists
          ? current.courses.map((course) => normalize(course.name || "") === normalize(courseName) ? nextRecord(course) : course)
          : [nextRecord(baseRecord), ...current.courses],
      };
    });
    setToast("Equipo de aula actualizado");
  };

  const updateStudentRecord = (studentId: string, updates: Record<string, string>) => {
    setStore((current) => ({
      ...current,
      students: current.students.map((student) =>
        student.id === studentId ? { ...student, ...updates, updatedAt: nowIso() } : student
      ),
    }));
    setToast("Ficha del estudiante actualizada");
  };

  const updateCaseRecord = (recordId: string, updates: Record<string, string>) => {
    setStore((current) => ({
      ...current,
      cases: current.cases.map((record) =>
        record.id === recordId ? { ...record, ...updates, updatedAt: nowIso() } : record,
      ),
    }));
  };

  const updateOrientationRecord = (recordId: string, updates: Record<string, string>) => {
    setStore((current) => ({
      ...current,
      orientation: current.orientation.map((record) =>
        record.id === recordId ? { ...record, ...updates, updatedAt: nowIso() } : record
      ),
    }));
  };

  const addOrientationRecord = (record: DataRecord) => {
    setStore((current) => ({ ...current, orientation: [record, ...current.orientation] }));
    setToast("Clase de orientación guardada");
  };

  const deleteOrientationRecord = (recordId: string) => {
    setStore((current) => ({
      ...current,
      orientation: current.orientation.filter((record) => record.id !== recordId),
    }));
    setToast("Clase eliminada");
  };

  const importText = (text: string, fileName = "tabla pegada") => {
    const parsedCsv = parseCsv(text);
    const sheet = { fileName, ...parsedCsv };
    const inferred = inferImportPlan(sheet);
    setParsed(sheet);
    setPlan(inferred);
    setActiveView("import");
    setToast("Planilla interpretada");
  };

  const importFile = (file: File) => {
    if (file.name.toLowerCase().endsWith(".xlsx")) {
      setToast("Exporta tu Google Sheet como CSV/TSV por ahora");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => importText(String(reader.result || ""), file.name);
    reader.readAsText(file, "utf-8");
  };

  const confirmImport = () => {
    if (!parsed || !plan) return;
    const config = entityConfigs[plan.entity];
    const requiredMissing = config.fields.filter((field) => field.required && !plan.mapping[field.key]);
    if (requiredMissing.length) {
      setToast(`Falta mapear: ${requiredMissing.map((field) => field.label).join(", ")}`);
      return;
    }
    const imported = parsed.rows
      .map((row): DataRecord => {
        const record = config.fields.reduce<Record<string, string>>((acc, field) => {
          const header = plan.mapping[field.key];
          acc[field.key] = header ? row[header] || "" : "";
          return acc;
        }, {});
        return { id: uid(), createdAt: nowIso(), updatedAt: nowIso(), ...record };
      })
      .filter((record) => config.fields.some((field) => record[field.key]?.trim()));

    setStore((current) => ({ ...current, [plan.entity]: [...imported, ...current[plan.entity]] }));
    setToast(`${imported.length} registros importados en ${config.label}`);
    setParsed(null);
    setPlan(null);
    setActiveView(plan.entity);
  };

  const exportEntity = (entity: EntityId) => {
    const config = entityConfigs[entity];
    downloadText(`${config.id}.csv`, recordsToCsv(store[entity], config.fields), "text/csv;charset=utf-8");
    setToast(`${config.label} exportado`);
  };

  const clearLocal = () => {
    if (!window.confirm("¿Borrar todos los datos locales de Tiza Education en este navegador?")) return;
    setStore(emptyStore());
    setToast("Datos locales borrados");
  };

  const renderView = () => {
    if (activeView === "dashboard") return <Dashboard store={store} onNavigate={setActiveView} schoolName={profile.organization || "Colegio San Lucas"} userEmail={authUser?.email || ""} team={team} calendarEvents={calendarEvents} calendarLoading={calendarLoading} calendarIcalUrl={profile.calendarIcalUrl} onReloadCalendar={reloadCalendar} />;
    if (activeView === "today") return <TodayView store={store} onOpenStudent={openStudent} onNavigate={setActiveView} calendarIcalUrl={profile.calendarIcalUrl} onConnectCalendar={(url) => { setProfile({ ...profile, calendarIcalUrl: url }); setToast("Google Calendar conectado"); }} />;
    if (activeView === "triage") return <AIAssistantView store={store} accessToken={accessToken} onAddRecord={addRecord} onOpenStudent={openStudent} onUpdateCourse={updateCourseRecord} />;
    if (activeView === "reports") return <ReportsView store={store} />;
    if (activeView === "students") {
      return <StudentsWorkspaceView store={store} onAdd={() => setDialogEntity("students")} onOpenStudent={openStudent} />;
    }
    if (activeView === "courses") {
      return (
        <CourseWorkspaceView
          store={store}
          onSeedCourses={seedOfficialCourses}
          onUpdateCourse={updateCourseRecord}
          onNavigate={setActiveView}
          onOpenStudent={openStudent}
        />
      );
    }
    if (activeView === "orientation") {
      return (
        <OrientationCycleView
          store={store}
          onAddOrientationRecord={addOrientationRecord}
          onUpdateOrientationRecord={updateOrientationRecord}
          onDeleteOrientationRecord={deleteOrientationRecord}
          onOpenStudent={openStudent}
          calendarEvents={calendarEvents}
        />
      );
    }
    if (activeView === "import") {
      return (
        <ImportView
          parsed={parsed}
          plan={plan}
          setPlan={setPlan}
          onFile={importFile}
          onText={(text) => importText(text)}
          onConfirm={confirmImport}
        />
      );
    }
    if (activeView === "settings") return <SettingsView profile={profile} setProfile={setProfile} onClear={clearLocal} />;
    if (activeView === "team") {
      return (
        <TeamView
          team={team}
          canSeed={authUser?.email?.toLowerCase() === "g.caro.m@colegiosanlucas.com"}
          seeding={teamSeeding}
          seedNotice={teamSeedNotice}
          onSeed={seedTeam}
        />
      );
    }

    const entity = entityConfigs[activeView];
    return (
      <EntityView
        entity={entity}
        records={store[activeView]}
        query={query}
        setQuery={setQuery}
        onAdd={() => setDialogEntity(activeView)}
        onDelete={(id) => deleteRecord(activeView, id)}
        onExport={() => exportEntity(activeView)}
        onImport={() => setActiveView("triage")}
      />
    );
  };

  const syncLabel = {
    local: "Guardado local",
    loading: "Cargando Supabase",
    synced: "Sincronizado",
    saving: "Guardando",
    error: "Sincronizacion pendiente",
  }[remoteStatus];

  if (authLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 text-slate-700">
        <div className="rounded-lg border border-slate-200 bg-white px-6 py-5 text-sm font-semibold shadow-sm">
          Verificando sesion...
        </div>
      </main>
    );
  }

  if (!authUser) {
    return <LoginScreen onSignIn={signIn} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Sidebar activeView={activeView} onNavigate={setActiveView} schoolName={profile.organization || "Colegio San Lucas"} />
      <main className="lg:pl-[272px]">
        <div className="tz-glass sticky top-0 z-30 border-b border-slate-200/80 px-4 py-3 sm:px-8">
          <div className="mx-auto flex max-w-[1440px] items-center gap-2">
            <div className="flex shrink-0 items-center gap-1">
              <button
                onClick={goBack}
                disabled={!canGoBack}
                title="Atrás (⌘[)"
                aria-label="Atrás"
                className="tz-press grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white/80 text-slate-700 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronDown className="h-4 w-4 rotate-90" />
              </button>
              <button
                onClick={goForward}
                disabled={!canGoForward}
                title="Adelante (⌘])"
                aria-label="Adelante"
                className="tz-press grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white/80 text-slate-700 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronDown className="h-4 w-4 -rotate-90" />
              </button>
            </div>
            <button
              onClick={() => setCommandOpen(true)}
              className="tz-press group flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-left text-sm text-slate-500 shadow-sm hover:border-slate-300 hover:bg-white"
            >
              <Search className="h-4 w-4 text-slate-400 transition group-hover:text-slate-600" />
              <span className="flex-1 truncate">Buscar estudiantes, casos, entrevistas, documentos…</span>
              <span className="hidden items-center gap-1 sm:flex">
                <span className="tz-kbd">⌘</span><span className="tz-kbd">K</span>
              </span>
            </button>
            <div className="hidden flex-col items-end text-right md:flex">
              <p className="text-xs font-semibold text-slate-900">{authUser.email}</p>
              <span className={`mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                remoteStatus === "synced"
                  ? "bg-green-50 text-green-700"
                  : remoteStatus === "error"
                    ? "bg-orange-50 text-orange-700"
                    : "bg-slate-100 text-slate-600"
              }`}>
                {syncLabel}
              </span>
            </div>
            <button
              onClick={signOut}
              className="tz-press inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-white"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
        <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-8">
          {renderView()}
        </div>
      </main>
      {dialogEntity ? (
        <RecordDialog entity={entityConfigs[dialogEntity]} onClose={() => setDialogEntity(null)} onSave={(record) => addRecord(dialogEntity, record)} />
      ) : null}
      {detailStudentId ? (() => {
        const detailStudent = store.students.find((s) => s.id === detailStudentId);
        if (!detailStudent) return null;
        return (
          <StudentDetailDialog
            student={detailStudent}
            store={store}
            onClose={closeStudent}
            onUpdateStudent={updateStudentRecord}
            onUpdateCase={updateCaseRecord}
            onAddRecord={(entity, record) => addRecord(entity, record)}
            onNavigate={setActiveView}
            focusField={detailFocusField}
            currentUserName={(team.find((m) => (m.email || "").toLowerCase() === (authUser?.email || "").toLowerCase())?.name) || ""}
          />
        );
      })() : null}
      {commandOpen ? (
        <CommandPalette
          store={store}
          onClose={() => setCommandOpen(false)}
          onOpenStudent={openStudent}
          onNavigate={setActiveView}
        />
      ) : null}
      {toast ? <Toast message={toast} /> : null}
    </div>
  );
}
