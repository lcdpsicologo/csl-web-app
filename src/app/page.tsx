"use client";

import Image from "next/image";
import React, { useEffect, useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { createClient, type User } from "@supabase/supabase-js";
import { ORIENTATION_FIRST_CYCLE_CLASSES, ORIENTATION_FIRST_CYCLE_CONFIG } from "@/lib/orientation-first-cycle";
import { PIE_PROFESSIONALS, PIE_ROSTER } from "@/lib/pie-roster";
import { COURSE_SCHEDULE, SCHOOL_SCHEDULE_SUMMARY, STAFF_DIRECTORY, STAFF_SCHEDULE } from "@/lib/school-schedule";
import { games } from "@/lib/games";
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
  Puzzle,
  Tag,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Database,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Gamepad2,
  GraduationCap,
  Home,
  Lock,
  LogOut,
  Mail,
  MessageSquareText,
  Plus,
  QrCode,
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

type ViewId = "dashboard" | "today" | "triage" | "reports" | "import" | "team" | "games" | "settings" | "pie" | EntityId;

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
  x?: number;
  y?: number;
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

const formatDateTime = (value: string | undefined) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("es-CL", { dateStyle: "medium", timeStyle: "short" });
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
        x: typeof member.x === "number" ? member.x : undefined,
        y: typeof member.y === "number" ? member.y : undefined,
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
      { key: "orientationEmail", label: "Correo orientador/a", aliases: ["correo orientador", "email orientador", "correo responsable"] },
      { key: "topic", label: "Tema / clase", required: true, aliases: ["tema", "clase", "sesion", "actividad"] },
      { key: "axis", label: "Eje", aliases: ["eje", "unidad", "area"] },
      { key: "week", label: "Semana", aliases: ["semana", "sem", "periodo"] },
      { key: "status", label: "Estado", type: "select", options: ["Planificada", "Realizada", "Pendiente", "Reprogramada"], aliases: ["estado", "status"] },
      { key: "canvaLink", label: "Enlace Canva", aliases: ["canva", "link canva", "presentacion", "diapositivas"] },
      { key: "evidence", label: "Evidencia / enlace", aliases: ["evidencia", "link", "enlace", "url"] },
      { key: "planificacion", label: "Planificación", type: "textarea", aliases: ["planificacion", "plan", "objetivos", "actividades"] },
      { key: "folderLink", label: "Carpeta", aliases: ["carpeta", "drive", "folder"] },
      { key: "notes", label: "Observaciones", type: "textarea", aliases: ["observaciones", "notas", "descripcion"] },
      { key: "source", label: "Fuente", aliases: ["fuente", "archivo origen"] },
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

// Ícono propio de Tiza-IA: una tiza inclinada dejando un trazo punteado.
// Sigue el estilo de lucide (stroke currentColor, 2px) para integrarse al menú.
const TizaIaIcon = ((props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* cuerpo de la tiza */}
    <path d="M13.2 4.8a2.6 2.6 0 0 1 3.7 0l2.3 2.3a2.6 2.6 0 0 1 0 3.7l-3.4 3.4-6-6 3.4-3.4z" />
    {/* punta */}
    <path d="m9.8 8.2 6 6" />
    {/* trazo punteado que deja la tiza */}
    <path d="M8.5 12.5 3.5 17.5" strokeDasharray="0.6 3.4" />
    <circle cx="4" cy="20.5" r="0.2" />
    <circle cx="7" cy="19" r="0.2" />
  </svg>
)) as unknown as LucideIcon;

const viewNav: Array<{ id: ViewId; label: string; icon: LucideIcon }> = [
  { id: "dashboard", label: "Inicio", icon: Home },
  { id: "today", label: "Hoy", icon: CalendarDays },
  { id: "triage", label: "Tiza-IA", icon: TizaIaIcon },
  { id: "reports", label: "Reportes", icon: PieChart },
  { id: "games", label: "Juegos Vinculares", icon: Gamepad2 },
  { id: "students", label: "Estudiantes", icon: UserRound },
  { id: "pie", label: "PIE", icon: Puzzle },
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

type ViewNavItem = (typeof viewNav)[number];

const NAV_ORDER_KEY = "tiza-view-nav-order-v1";
const defaultNavOrder = viewNav.map((item) => item.id);

const orderViewNav = (order: ViewId[]): ViewNavItem[] => {
  const validIds = new Set(viewNav.map((item) => item.id));
  const cleanOrder = order.filter((id) => validIds.has(id));
  const missing = defaultNavOrder.filter((id) => !cleanOrder.includes(id));
  const lookup = new Map(viewNav.map((item) => [item.id, item]));
  return [...cleanOrder, ...missing].map((id) => lookup.get(id)).filter((item): item is ViewNavItem => Boolean(item));
};

const loadNavOrder = (): ViewId[] => {
  if (typeof window === "undefined") return defaultNavOrder;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(NAV_ORDER_KEY) || "[]");
    return Array.isArray(parsed) ? orderViewNav(parsed as ViewId[]).map((item) => item.id) : defaultNavOrder;
  } catch {
    return defaultNavOrder;
  }
};

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

function downloadExcel(fileName: string, sheetName: string, headers: string[], rows: string[][]) {
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const workbook = XLSX.utils.book_new();
  worksheet["!cols"] = headers.map((header, index) => {
    const max = Math.max(header.length, ...rows.slice(0, 300).map((row) => String(row[index] || "").length));
    return { wch: Math.min(64, Math.max(12, max + 2)) };
  });
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31) || "Datos");
  const array = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([array], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}

const recordsToExcel = (fileName: string, sheetName: string, records: DataRecord[], fields: FieldDef[]) => {
  const headers = fields.map((field) => field.label);
  const rows = records.map((record) => fields.map((field) => record[field.key] || ""));
  downloadExcel(fileName, sheetName, headers, rows);
};

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

function Sidebar({
  activeView,
  onNavigate,
  schoolName,
  navItems,
  onMoveNavItem,
  onResetNavOrder,
}: {
  activeView: ViewId;
  onNavigate: (view: ViewId) => void;
  schoolName: string;
  navItems: ViewNavItem[];
  onMoveNavItem: (view: ViewId, direction: -1 | 1) => void;
  onResetNavOrder: () => void;
}) {
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
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const active = activeView === item.id;
            return (
              <div
                key={item.id}
                className={`group relative flex h-10 w-full items-center overflow-hidden rounded-lg ${
                  active ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                {active ? <span className="absolute inset-y-2 left-0 w-1 rounded-full bg-blue-500" /> : null}
                <button
                  onClick={() => onNavigate(item.id)}
                  className="tz-nav-item flex h-full min-w-0 flex-1 items-center gap-3 px-3 text-left text-sm font-medium"
                >
                  <Icon className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-slate-500"}`} />
                  <span className="truncate">{item.label}</span>
                </button>
                <div className={`mr-1 flex shrink-0 items-center gap-0.5 transition ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"}`}>
                  <button
                    type="button"
                    onClick={() => onMoveNavItem(item.id, -1)}
                    disabled={index === 0}
                    title="Subir"
                    aria-label={`Subir ${item.label}`}
                    className={`grid h-7 w-7 place-items-center rounded-md transition ${
                      active ? "text-white/80 hover:bg-white/10" : "text-slate-500 hover:bg-white"
                    } disabled:cursor-not-allowed disabled:opacity-30`}
                  >
                    <ChevronDown className="h-3.5 w-3.5 rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onMoveNavItem(item.id, 1)}
                    disabled={index === navItems.length - 1}
                    title="Bajar"
                    aria-label={`Bajar ${item.label}`}
                    className={`grid h-7 w-7 place-items-center rounded-md transition ${
                      active ? "text-white/80 hover:bg-white/10" : "text-slate-500 hover:bg-white"
                    } disabled:cursor-not-allowed disabled:opacity-30`}
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
          <button
            type="button"
            onClick={onResetNavOrder}
            className="mt-3 w-full rounded-lg border border-dashed border-slate-200 px-3 py-2 text-left text-xs font-semibold text-slate-500 transition hover:border-slate-300 hover:bg-white hover:text-slate-700"
          >
            Restablecer orden
          </button>
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

// Mobile navigation: bottom tab bar with the 4 most-used views plus a "Menú"
// button that opens a full drawer. Only rendered below the lg breakpoint.
const MOBILE_PRIMARY: ViewId[] = ["dashboard", "today", "games", "students"];

function MobileNav({
  activeView,
  onNavigate,
  schoolName,
  navItems,
}: {
  activeView: ViewId;
  onNavigate: (view: ViewId) => void;
  schoolName: string;
  navItems: ViewNavItem[];
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const primary = navItems.filter((item) => MOBILE_PRIMARY.includes(item.id));

  const go = (view: ViewId) => {
    onNavigate(view);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <div className="grid grid-cols-5">
          {primary.map((item) => {
            const Icon = item.icon;
            const active = activeView === item.id && !drawerOpen;
            return (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className={`flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold transition ${
                  active ? "text-cyan-700" : "text-slate-500"
                }`}
              >
                <span className={`grid h-7 w-12 place-items-center rounded-full transition ${active ? "bg-cyan-50" : ""}`}>
                  <Icon className="h-5 w-5" />
                </span>
                {item.label}
              </button>
            );
          })}
          <button
            onClick={() => setDrawerOpen((value) => !value)}
            className={`flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold transition ${drawerOpen ? "text-cyan-700" : "text-slate-500"}`}
          >
            <span className={`grid h-7 w-12 place-items-center rounded-full transition ${drawerOpen ? "bg-cyan-50" : ""}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5">
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </span>
            Menú
          </button>
        </div>
      </nav>

      {/* Drawer with the full menu */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setDrawerOpen(false)}>
          <div className="tz-backdrop absolute inset-0 bg-slate-950/40" />
          <div
            className="tz-slide-up absolute inset-x-3 bottom-[calc(64px+env(safe-area-inset-bottom))] max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-2 flex items-center gap-3 border-b border-slate-100 px-2 pb-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-lg bg-white ring-1 ring-slate-200">
                <Image src="/logo-san-lucas.png" alt={schoolName} width={32} height={32} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Trabajando en</p>
                <p className="truncate text-sm font-semibold text-slate-900">{schoolName}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => go(item.id)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-[11px] font-semibold transition ${
                      active ? "bg-slate-900 text-white shadow" : "bg-slate-50 text-slate-700 active:bg-slate-100"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </button>
                );
              })}
              <button
                onClick={() => go("settings")}
                className={`flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-[11px] font-semibold transition ${
                  activeView === "settings" ? "bg-slate-900 text-white shadow" : "bg-slate-50 text-slate-700 active:bg-slate-100"
                }`}
              >
                <Settings className="h-5 w-5" />
                Ajustes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
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
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3 text-sm">
            <span className="font-semibold text-slate-700">
              Mostrando <span className="tabular-nums">{filtered.length}</span> de <span className="tabular-nums">{records.length}</span> registros
            </span>
            {query ? <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">filtro: “{query}”</span> : null}
          </div>
          <div className="divide-y divide-slate-100">
            {filtered.map((record) => {
              const primary = entity.fields[0];
              const secondary = entity.fields.slice(1, 4);
              const extra = entity.fields.slice(4, 6);
              return (
                <article key={record.id} className="grid gap-3 px-4 py-3 transition hover:bg-blue-50/40 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto] lg:items-center">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950">{record[primary.key] || entity.singular}</p>
                    <p className="mt-0.5 truncate text-xs text-slate-500">Actualizado {new Date(record.updatedAt).toLocaleString("es-CL")}</p>
                  </div>
                  <div className="grid gap-1 sm:grid-cols-2">
                    {[...secondary, ...extra].map((field) => (
                      <p key={field.key} className="min-w-0 truncate text-xs text-slate-600">
                        <span className="font-bold text-slate-400">{field.label}: </span>
                        <span>{record[field.key] || "—"}</span>
                      </p>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <button onClick={() => onDelete(record.id)} title="Eliminar" className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50">
                      <Trash2 className="h-3.5 w-3.5" /> Eliminar
                    </button>
                  </div>
                </article>
              );
            })}
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
            className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-semibold transition ${cycleTab === key ? "bg-slate-900 text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mb-5 tz-contained-x rounded-xl border border-slate-200 bg-white px-3 py-3">
        <div className="flex min-w-max gap-1.5">
          {visibleCourses.map((course) => (
            <button
              key={course.name}
              onClick={() => setSelectedCourse(course.name)}
              className={`whitespace-nowrap shrink-0 rounded-md px-3 py-2 text-sm font-semibold transition ${selectedCourse === course.name ? "bg-slate-900 text-white shadow" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
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
  onGenerateAnnualPlan,
  onOpenStudent,
  calendarEvents,
}: {
  store: DataStore;
  onAddOrientationRecord: (record: DataRecord) => void;
  onUpdateOrientationRecord: (recordId: string, updates: Record<string, string>) => void;
  onDeleteOrientationRecord: (recordId: string) => void;
  onGenerateAnnualPlan: () => void;
  onOpenStudent: (studentId: string) => void;
  calendarEvents: CalendarEvent[];
}) {
  const [selectedOwner, setSelectedOwner] = useState(orientationOwners[0].name);
  const [innerTab, setInnerTab] = useState<"clases" | "nomina" | "cursos">("clases");
  const [filterCourse, setFilterCourse] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("all");
  const [expandedClassId, setExpandedClassId] = useState<string>("");
  const [calendarMonth, setCalendarMonth] = useState<string>(() => new Date().toISOString().slice(0, 7));
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
    if (filterDate !== "all" && (record.date || "") !== filterDate) return false;
    return true;
  }).sort((a, b) => String(b.date || b.updatedAt).localeCompare(String(a.date || a.updatedAt)));

  const classesByWeek = useMemo(() => {
    const groups = new Map<string, DataRecord[]>();
    filteredClasses.forEach((record) => {
      const week = record.week || "Sin semana";
      if (!groups.has(week)) groups.set(week, []);
      groups.get(week)!.push(record);
    });
    return Array.from(groups.entries()).map(([week, records]) => ({ week, records }));
  }, [filteredClasses]);

  const calendarDays = useMemo(() => {
    const [year, month] = calendarMonth.split("-").map(Number);
    const first = new Date(year, month - 1, 1);
    const last = new Date(year, month, 0);
    const startOffset = (first.getDay() + 6) % 7;
    const cells: Array<{ date: string; inMonth: boolean; count: number; done: number; pending: number }> = [];
    for (let i = 0; i < startOffset; i += 1) {
      const d = new Date(year, month - 1, 1 - startOffset + i);
      const date = d.toISOString().slice(0, 10);
      const dayClasses = ownerClasses.filter((r) => r.date === date);
      cells.push({ date, inMonth: false, count: dayClasses.length, done: dayClasses.filter((r) => /realizad/i.test(r.status || "")).length, pending: dayClasses.filter((r) => !/realizad/i.test(r.status || "")).length });
    }
    for (let day = 1; day <= last.getDate(); day += 1) {
      const d = new Date(year, month - 1, day);
      const date = d.toISOString().slice(0, 10);
      const dayClasses = ownerClasses.filter((r) => r.date === date);
      cells.push({ date, inMonth: true, count: dayClasses.length, done: dayClasses.filter((r) => /realizad/i.test(r.status || "")).length, pending: dayClasses.filter((r) => !/realizad/i.test(r.status || "")).length });
    }
    while (cells.length % 7 !== 0) {
      const d = new Date(year, month - 1, last.getDate() + (cells.length % 7));
      const date = d.toISOString().slice(0, 10);
      const dayClasses = ownerClasses.filter((r) => r.date === date);
      cells.push({ date, inMonth: false, count: dayClasses.length, done: dayClasses.filter((r) => /realizad/i.test(r.status || "")).length, pending: dayClasses.filter((r) => !/realizad/i.test(r.status || "")).length });
    }
    return cells;
  }, [calendarMonth, ownerClasses]);

  const ownerStudents = store.students.filter((student) => owner.courses.includes(student.course || ""));
  const studentsByCourse = owner.courses.map((course) => ({
    course,
    students: ownerStudents
      .filter((student) => student.course === course)
      .sort((a, b) => (a.fullName || "").localeCompare(b.fullName || "", "es")),
  }));

  const classCounts = {
    realizadas: ownerClasses.filter((r) => /realizad/i.test(r.status || "")).length,
    planificadas: ownerClasses.filter((r) => /planificad/i.test(r.status || "")).length,
    pendientes: ownerClasses.filter((r) => /pendiente/i.test(r.status || "") || !r.status).length,
    reprogramadas: ownerClasses.filter((r) => /reprogramad/i.test(r.status || "")).length,
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
    const headers = ["Fecha", "Semana", "Curso", "Orientador/a", "Correo", "Tema", "Eje / Acción", "Estado", "Enlace Canva", "Planificación", "Carpeta", "Observaciones", "Fuente"];
    const rows = filteredClasses.map((record) => [
      record.date || "",
      record.week || "",
      record.course || "",
      record.orientationOwner || "",
      record.orientationEmail || "",
      record.topic || "",
      record.axis || "",
      record.status || "",
      record.canvaLink || record.evidence || "",
      record.planificacion || "",
      record.folderLink || "",
      record.notes || "",
      record.source || "",
    ]);
    downloadExcel(`orientacion-${normalize(owner.name).replace(/\s+/g, "-")}.xlsx`, "Orientación", headers, rows);
  };

  const statusTone = (status: string) =>
    /realizad/i.test(status) ? "bg-emerald-100 text-emerald-700 ring-emerald-200"
      : /planificad/i.test(status) ? "bg-blue-100 text-blue-700 ring-blue-200"
      : /reprogramad/i.test(status) ? "bg-amber-100 text-amber-700 ring-amber-200"
      : "bg-slate-100 text-slate-600 ring-slate-200";
  const quickStatuses = ["Realizada", "Pendiente", "Reprogramada", "Planificada"];
  const setClassStatus = (record: DataRecord, status: string) => {
    if (record.source === "calendar") return;
    onUpdateOrientationRecord(record.id, { status });
  };

  return (
    <div className="tz-fade">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Orientación</h1>
          <p className="mt-1 max-w-3xl text-sm text-slate-600">
            Clases, planificación, recursos y nóminas por ciclo.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportOwnerClasses} className="tz-press inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <ArrowDownToLine className="h-4 w-4" /> Exportar Excel
          </button>
          <button onClick={onGenerateAnnualPlan} className="tz-press inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100">
            <CalendarDays className="h-4 w-4" /> Completar año
          </button>
          <button onClick={openNewClass} className="tz-press inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800">
            <Plus className="h-4 w-4" /> Nueva clase
          </button>
        </div>
      </div>

      <div className="mb-4 grid gap-2 md:grid-cols-3">
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
              className={`tz-card relative rounded-xl border p-3 text-left ${
                active ? "border-blue-600 bg-blue-50 text-blue-950 shadow-sm" : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg text-sm font-bold shadow-sm ${
                  active ? "bg-blue-600 text-white" : `bg-gradient-to-br ${avatarTone(item.name)} text-white`
                }`}>
                  {initialsOf(item.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{item.cycle}</p>
                  <h3 className="truncate text-sm font-semibold text-slate-950">{item.name}</h3>
                  <p className="mt-0.5 truncate text-[11px] text-slate-500">{item.role}</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-1.5 text-center text-[11px] font-semibold text-slate-700">
                <div className="rounded-lg bg-white px-2 py-1 ring-1 ring-slate-200">
                  <strong className="block text-base">{item.courses.length}</strong>
                  <span className="text-slate-500">cursos</span>
                </div>
                <div className="rounded-lg bg-white px-2 py-1 ring-1 ring-slate-200">
                  <strong className="block text-base">{itemClasses.length}</strong>
                  <span className="text-slate-500">clases</span>
                </div>
                <div className="rounded-lg bg-white px-2 py-1 ring-1 ring-slate-200">
                  <strong className="block text-base">{store.students.filter((s) => item.courses.includes(s.course || "")).length}</strong>
                  <span className="text-slate-500">estudiantes</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-white px-4 py-3 sm:px-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{owner.role}</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-950">{owner.name}</h2>
              <p className="mt-1 truncate text-sm text-slate-600">{owner.email} · Coord. convivencia: <strong>{owner.convivenciaCoordinator}</strong></p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-semibold sm:grid-cols-4">
              {[
                ["Realizadas", classCounts.realizadas],
                ["Planificadas", classCounts.planificadas],
                ["Pendientes", classCounts.pendientes],
                ["Reprogramadas", classCounts.reprogramadas],
              ].map(([label, count]) => (
                <div key={String(label)} className="rounded-lg bg-slate-50 px-3 py-2 text-slate-700 ring-1 ring-slate-200">
                  <div className="text-xl font-bold leading-none">{count}</div>
                  <div className="mt-1 text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <nav className="flex gap-1 border-b border-slate-200 bg-white px-2 sm:px-6 tz-contained-x">
          {([
            ["clases", "Clases", ClipboardList],
            ["nomina", "Nómina", UsersRound],
            ["cursos", "Cursos a cargo", BookOpen],
          ] as Array<[typeof innerTab, string, LucideIcon]>).map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setInnerTab(id)}
              className={`relative inline-flex shrink-0 whitespace-nowrap items-center gap-2 px-3 py-3 text-sm font-semibold transition ${innerTab === id ? "text-blue-700" : "text-slate-500 hover:text-slate-900"}`}
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
                {filterDate !== "all" ? (
                  <button onClick={() => setFilterDate("all")} className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100">
                    {filterDate} · limpiar
                  </button>
                ) : null}
                <span className="ml-auto text-xs font-semibold text-slate-500">{filteredClasses.length} clase{filteredClasses.length === 1 ? "" : "s"}</span>
              </div>

              <div className="mb-4 grid gap-3 xl:grid-cols-[320px_minmax(0,1fr)]">
                <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        const [year, month] = calendarMonth.split("-").map(Number);
                        setCalendarMonth(new Date(year, month - 2, 1).toISOString().slice(0, 7));
                      }}
                      className="rounded-md border border-slate-200 px-2 py-1 text-xs font-bold text-slate-600 hover:bg-slate-50"
                    >
                      ←
                    </button>
                    <h3 className="text-sm font-bold capitalize text-slate-900">
                      {new Date(`${calendarMonth}-02T00:00:00`).toLocaleDateString("es-CL", { month: "long", year: "numeric" })}
                    </h3>
                    <button
                      onClick={() => {
                        const [year, month] = calendarMonth.split("-").map(Number);
                        setCalendarMonth(new Date(year, month, 1).toISOString().slice(0, 7));
                      }}
                      className="rounded-md border border-slate-200 px-2 py-1 text-xs font-bold text-slate-600 hover:bg-slate-50"
                    >
                      →
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase text-slate-400">
                    {["L", "M", "X", "J", "V", "S", "D"].map((day) => <span key={day}>{day}</span>)}
                  </div>
                  <div className="mt-1 grid grid-cols-7 gap-1">
                    {calendarDays.map((day) => {
                      const active = filterDate === day.date;
                      return (
                        <button
                          key={day.date}
                          onClick={() => day.count > 0 ? setFilterDate(active ? "all" : day.date) : undefined}
                          disabled={day.count === 0}
                          className={`aspect-square rounded-md border text-[11px] font-bold transition ${
                            active ? "border-blue-600 bg-blue-600 text-white"
                              : day.count > 0 ? "border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100"
                                : day.inMonth ? "border-slate-100 bg-white text-slate-400" : "border-slate-50 bg-slate-50 text-slate-300"
                          }`}
                          title={day.count ? `${day.count} clases (${day.done} realizadas, ${day.pending} pendientes)` : day.date}
                        >
                          <span>{Number(day.date.slice(8, 10))}</span>
                          {day.count > 0 ? <span className="mx-auto mt-0.5 block h-1 w-1 rounded-full bg-current" /> : null}
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900">Semanas del plan</h3>
                    <span className="text-xs font-semibold text-slate-500">{classesByWeek.length} semanas visibles</span>
                  </div>
                  <div className="tz-thin-scroll flex max-h-40 flex-wrap gap-1.5 overflow-y-auto pr-1">
                    {classesByWeek.map((group) => (
                      <button
                        key={group.week}
                        onClick={() => {
                          const firstDate = group.records.map((r) => r.date).filter(Boolean).sort()[0];
                          if (firstDate) {
                            setFilterDate(firstDate);
                            setCalendarMonth(firstDate.slice(0, 7));
                          }
                        }}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-left text-xs hover:border-blue-200 hover:bg-blue-50"
                      >
                        <span className="block max-w-[190px] truncate font-bold text-slate-800">{group.week}</span>
                        <span className="text-slate-500">{group.records.length} clases</span>
                      </button>
                    ))}
                  </div>
                </section>
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
                    <label className="block">
                      <span className="text-xs font-semibold text-slate-700">Semana</span>
                      <input value={newClassForm.week || ""} onChange={(event) => setNewClassForm((form) => ({ ...form, week: event.target.value }))} placeholder="02/03 al 06/03 (Semana 1)" className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-500" />
                    </label>
                    <label className="block sm:col-span-2 lg:col-span-3">
                      <span className="text-xs font-semibold text-slate-700">Enlace Canva</span>
                      <input value={newClassForm.canvaLink || ""} onChange={(event) => setNewClassForm((form) => ({ ...form, canvaLink: event.target.value }))} placeholder="https://www.canva.com/design/..." className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-500" />
                    </label>
                    <label className="block sm:col-span-2 lg:col-span-3">
                      <span className="text-xs font-semibold text-slate-700">Carpeta / Drive</span>
                      <input value={newClassForm.folderLink || ""} onChange={(event) => setNewClassForm((form) => ({ ...form, folderLink: event.target.value }))} placeholder="https://drive.google.com/..." className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-500" />
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
                <div className="tz-thin-scroll max-h-[68vh] space-y-2 overflow-y-auto pr-1">
                  {filteredClasses.map((record) => {
                    const expanded = expandedClassId === record.id;
                    const canvaUrl = record.canvaLink || record.evidence || "";
                    return (
                      <article key={record.id} className={`rounded-xl border bg-white transition ${expanded ? "border-blue-300 shadow-md" : "border-slate-200 shadow-sm"}`}>
                        <div className="grid gap-3 px-3 py-3 sm:grid-cols-[92px_minmax(0,1fr)_auto] sm:items-center">
                          <div className="flex items-center gap-2 sm:block">
                            <div className="rounded-lg bg-slate-100 px-2 py-1 text-center text-[11px] font-black text-slate-700 sm:w-full">
                              {record.date || "Sin fecha"}
                            </div>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 sm:mt-1 sm:block sm:text-center ${statusTone(record.status || "")}`}>
                              {record.status || "Pendiente"}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <div className="flex min-w-0 flex-wrap items-center gap-2">
                              <p className="min-w-0 max-w-full truncate text-sm font-semibold text-slate-950">{record.topic || "Clase sin tema"}</p>
                              {record.source === "calendar" ? <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-blue-700 ring-1 ring-blue-100">Calendario</span> : null}
                            </div>
                            <p className="mt-0.5 truncate text-xs text-slate-500">{record.course || "Sin curso"} · {record.axis || "Sin eje"}{record.week ? ` · ${record.week}` : ""}</p>
                            {record.notes ? <p className="mt-1 line-clamp-1 text-xs text-slate-600">{record.notes}</p> : null}
                            {record.source !== "calendar" ? (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {quickStatuses.map((status) => {
                                  const active = normalize(record.status || "") === normalize(status);
                                  return (
                                    <button
                                      key={status}
                                      onClick={() => setClassStatus(record, status)}
                                      className={`rounded-md px-2 py-1 text-[10px] font-bold ring-1 transition ${
                                        active ? statusTone(status) : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"
                                      }`}
                                    >
                                      {status}
                                    </button>
                                  );
                                })}
                              </div>
                            ) : null}
                          </div>
                          <div className="flex flex-wrap justify-end gap-1.5">
                            {canvaUrl ? (
                              <a href={canvaUrl} target="_blank" rel="noopener noreferrer" className="rounded-md border border-violet-200 bg-violet-50 px-2 py-1 text-[11px] font-bold text-violet-700 hover:bg-violet-100">Canva</a>
                            ) : null}
                            <button onClick={() => setExpandedClassId(expanded ? "" : record.id)} className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50">
                              {expanded ? "Cerrar" : "Editar"}
                            </button>
                            <button
                              onClick={() => onAddOrientationRecord({
                                ...record,
                                id: uid(),
                                createdAt: nowIso(),
                                updatedAt: nowIso(),
                                status: "Planificada",
                                topic: `${record.topic || "Clase"} (copia)`,
                              })}
                              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50"
                            >
                              Duplicar
                            </button>
                            <button onClick={() => { if (window.confirm("¿Eliminar esta clase?")) onDeleteOrientationRecord(record.id); }} className="rounded-md border border-red-200 bg-white px-2 py-1 text-[11px] font-bold text-red-600 hover:bg-red-50">
                              Eliminar
                            </button>
                          </div>
                        </div>

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
                              <label className="block">
                                <span className="text-xs font-semibold text-slate-700">Semana</span>
                                <input value={record.week || ""} onChange={(event) => onUpdateOrientationRecord(record.id, { week: event.target.value })} className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-500" />
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
                                <span className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                                  Carpeta / Drive
                                  {record.folderLink ? (
                                    <a href={record.folderLink} target="_blank" rel="noopener noreferrer" className="ml-auto text-[10px] font-semibold text-blue-600 hover:underline">Abrir ↗</a>
                                  ) : null}
                                </span>
                                <input value={record.folderLink || ""} onChange={(event) => onUpdateOrientationRecord(record.id, { folderLink: event.target.value })} placeholder="https://drive.google.com/..." className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-500" />
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
                              <div className="hidden gap-2">
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
                          {(student.tags || "").toUpperCase().split(",").map((t) => t.trim()).includes("PIE") ? (
                            <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700 ring-1 ring-emerald-200" title="Estudiante PIE">PIE</span>
                          ) : null}
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
  onUpdateStudent,
}: {
  student: DataRecord;
  members: GenogramMember[];
  selectedMemberId: string;
  onSelectMember: (memberId: string) => void;
  onUpdateStudent: (studentId: string, updates: Record<string, string>) => void;
}) {
  const [dragging, setDragging] = useState<{ id: string; offsetX: number; offsetY: number; isStudent: boolean } | null>(null);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number } | null>(null);
  const [localStudentPos, setLocalStudentPos] = useState<{ x: number; y: number } | null>(null);
  const [localMemberPositions, setLocalMemberPositions] = useState<Record<string, { x: number; y: number }>>({});

  // Reset local overrides when active student changes
  useEffect(() => {
    setLocalStudentPos(null);
    setLocalMemberPositions({});
  }, [student.id]);

  const getStudentPos = () => {
    if (localStudentPos) return localStudentPos;
    const sx = student.genogramStudentX ? parseFloat(student.genogramStudentX) : 360;
    const sy = student.genogramStudentY ? parseFloat(student.genogramStudentY) : 320;
    return { x: sx, y: sy };
  };

  const primary = members.filter((member) => ["Madre", "Padre", "Cuidador/a principal", "Apoderado/a", "Tutor/a legal"].includes(member.relation));
  const siblings = members.filter((member) => member.relation === "Hermano/a");
  const support = members.filter((member) => !primary.includes(member) && !siblings.includes(member));

  const getMemberPos = (member: GenogramMember, index: number, relationGroup: string) => {
    if (localMemberPositions[member.id]) {
      return localMemberPositions[member.id];
    }
    if (member.x !== undefined && member.y !== undefined) {
      return { x: member.x, y: member.y };
    }
    if (relationGroup === "primary") {
      return { x: 40 + index * 250, y: 60 };
    } else if (relationGroup === "sibling") {
      return { x: 60 + index * 220, y: 450 };
    } else {
      return { x: 730, y: 140 + index * 110 };
    }
  };

  const handleDragStart = (
    event: React.MouseEvent<SVGElement> | React.TouchEvent<SVGElement>,
    id: string,
    currentX: number,
    currentY: number,
    isStudent: boolean
  ) => {
    event.preventDefault();
    const clientX = "touches" in event ? event.touches[0].clientX : event.clientX;
    const clientY = "touches" in event ? event.touches[0].clientY : event.clientY;

    const svg = event.currentTarget.ownerSVGElement || (event.currentTarget as any);
    if (!svg) return;

    try {
      const pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      const svgPoint = pt.matrixTransform(svg.getScreenCTM()!.inverse());

      setDragStartPos({ x: clientX, y: clientY });
      setDragging({
        id,
        offsetX: svgPoint.x - currentX,
        offsetY: svgPoint.y - currentY,
        isStudent,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (event: MouseEvent | TouchEvent) => {
      const clientX = "touches" in event ? event.touches[0].clientX : event.clientX;
      const clientY = "touches" in event ? event.touches[0].clientY : event.clientY;

      const svg = document.getElementById("genogram-svg") as SVGSVGElement | null;
      if (!svg) return;

      try {
        const pt = svg.createSVGPoint();
        pt.x = clientX;
        pt.y = clientY;
        const svgPoint = pt.matrixTransform(svg.getScreenCTM()!.inverse());

        const targetX = Math.round(svgPoint.x - dragging.offsetX);
        const targetY = Math.round(svgPoint.y - dragging.offsetY);

        // Keep inside reasonable bounds
        const boundedX = Math.max(-50, Math.min(1000, targetX));
        const boundedY = Math.max(-50, Math.min(600, targetY));

        if (dragging.isStudent) {
          setLocalStudentPos({ x: boundedX, y: boundedY });
        } else {
          setLocalMemberPositions((curr) => ({
            ...curr,
            [dragging.id]: { x: boundedX, y: boundedY },
          }));
        }
      } catch (err) {
        console.error(err);
      }
    };

    const handleUp = (event: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if (event.type === "touchend") {
        const touchEvent = event as TouchEvent;
        if (touchEvent.changedTouches && touchEvent.changedTouches.length > 0) {
          clientX = touchEvent.changedTouches[0].clientX;
          clientY = touchEvent.changedTouches[0].clientY;
        }
      } else {
        const mouseEvent = event as MouseEvent;
        clientX = mouseEvent.clientX;
        clientY = mouseEvent.clientY;
      }

      let moved = false;
      if (dragStartPos) {
        const dist = Math.hypot(clientX - dragStartPos.x, clientY - dragStartPos.y);
        if (dist > 5) {
          moved = true;
        }
      }

      if (!moved) {
        if (!dragging.isStudent) {
          onSelectMember(dragging.id);
        }
      } else {
        if (dragging.isStudent) {
          if (localStudentPos) {
            onUpdateStudent(student.id, {
              genogramStudentX: String(localStudentPos.x),
              genogramStudentY: String(localStudentPos.y),
            });
          }
        } else {
          const pos = localMemberPositions[dragging.id];
          if (pos) {
            const nextMembers = members.map((m) =>
              m.id === dragging.id ? { ...m, x: pos.x, y: pos.y } : m
            );
            onUpdateStudent(student.id, { genogram: JSON.stringify(nextMembers) });
          }
        }
      }

      setDragging(null);
      setDragStartPos(null);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchend", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchend", handleUp);
    };
  }, [dragging, dragStartPos, localStudentPos, localMemberPositions, members, student.id, onUpdateStudent, onSelectMember]);

  const handleReset = () => {
    if (window.confirm("¿Restablecer la distribución de todas las tarjetas a su posición por defecto?")) {
      setLocalStudentPos({ x: 360, y: 320 });
      setLocalMemberPositions({});

      const cleanedMembers = members.map((m) => {
        const { x, y, ...rest } = m;
        return rest;
      });

      onUpdateStudent(student.id, {
        genogramStudentX: "",
        genogramStudentY: "",
        genogram: JSON.stringify(cleanedMembers),
      });
    }
  };

  const studentPos = getStudentPos();
  const convergenceY = studentPos.y - 50;

  const memberCard = (member: GenogramMember, x: number, y: number, width: number, height: number, relationGroup: string, tone = "white") => {
    const isSelected = selectedMemberId === member.id;
    return (
      <g
        key={member.id}
        onMouseDown={(e) => {
          if (e.button !== 0) return;
          handleDragStart(e, member.id, x, y, false);
        }}
        onTouchStart={(e) => handleDragStart(e, member.id, x, y, false)}
        className="cursor-move select-none"
      >
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx="12"
          className={`${tone === "blue" ? "fill-blue-50 stroke-blue-200" : "fill-white stroke-slate-300"} ${isSelected ? "stroke-blue-500" : ""}`}
          strokeWidth={isSelected ? 3 : 1}
          filter="url(#genogramShadow)"
        />
        <foreignObject x={x + 10} y={y + 8} width={width - 20} height={height - 16} className="pointer-events-none">
          <div className="flex h-full flex-col justify-center text-center leading-tight">
            <div className="line-clamp-2 text-[16px] font-bold text-slate-950" title={member.name}>
              {member.name}
            </div>
            <div className="mt-1.5 truncate text-[13px] font-semibold text-slate-500">
              {member.relation}
            </div>
            {member.role ? (
              <div className="mt-1 truncate text-[12px] text-slate-400">
                {member.role}
              </div>
            ) : null}
          </div>
        </foreignObject>
      </g>
    );
  };

  const hasCustomPositions = student.genogramStudentX || student.genogramStudentY || members.some((m) => m.x !== undefined || m.y !== undefined);

  return (
    <div className="tz-contained-x rounded-lg border border-slate-200 bg-slate-50 p-4">
      <svg
        id="genogram-svg"
        viewBox="0 0 960 560"
        className="min-h-[440px] w-full min-w-[820px]"
        role="img"
        aria-label={`Genograma de ${student.fullName || "estudiante"}`}
      >
        <defs>
          <filter id="genogramShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#0f172a" floodOpacity="0.10" />
          </filter>
        </defs>

        <line
          x1={studentPos.x + 130}
          y1={convergenceY}
          x2={studentPos.x + 130}
          y2={studentPos.y}
          className="stroke-slate-300"
          strokeWidth="2"
        />

        {primary.slice(0, 4).map((member, index) => {
          const mPos = getMemberPos(member, index, "primary");
          const cardWidth = 210;
          const cardHeight = 110;
          return (
            <g key={member.id}>
              <line
                x1={mPos.x + cardWidth / 2}
                y1={mPos.y + cardHeight}
                x2={studentPos.x + 130}
                y2={convergenceY}
                className="stroke-slate-300"
                strokeWidth="2"
              />
              {memberCard(member, mPos.x, mPos.y, cardWidth, cardHeight, "primary")}
            </g>
          );
        })}

        {siblings.slice(0, 4).map((member, index) => {
          const mPos = getMemberPos(member, index, "sibling");
          const cardWidth = 190;
          const cardHeight = 100;
          return (
            <g key={member.id}>
              <line
                x1={studentPos.x + 130}
                y1={studentPos.y + 96}
                x2={mPos.x + cardWidth / 2}
                y2={mPos.y}
                className="stroke-slate-300"
                strokeWidth="2"
              />
              {memberCard(member, mPos.x, mPos.y, cardWidth, cardHeight, "sibling")}
            </g>
          );
        })}

        {support.slice(0, 4).map((member, index) => {
          const mPos = getMemberPos(member, index, "support");
          const cardWidth = 210;
          const cardHeight = 100;

          const isLeftOfStudent = mPos.x + cardWidth / 2 < studentPos.x + 130;
          const startX = isLeftOfStudent ? studentPos.x : studentPos.x + 260;
          const startY = studentPos.y + 48;
          const endX = isLeftOfStudent ? mPos.x + cardWidth : mPos.x;
          const endY = mPos.y + cardHeight / 2;

          return (
            <g key={member.id}>
              <line
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                className="stroke-blue-300"
                strokeDasharray="6 6"
                strokeWidth="2"
              />
              {memberCard(member, mPos.x, mPos.y, cardWidth, cardHeight, "support", "blue")}
            </g>
          );
        })}

        <g
          onMouseDown={(e) => {
            if (e.button !== 0) return;
            handleDragStart(e, student.id, studentPos.x, studentPos.y, true);
          }}
          onTouchStart={(e) => handleDragStart(e, student.id, studentPos.x, studentPos.y, true)}
          className="cursor-move select-none"
        >
          <rect
            x={studentPos.x}
            y={studentPos.y}
            width="280"
            height="110"
            rx="14"
            className="fill-slate-900"
            filter="url(#genogramShadow)"
          />
          <foreignObject x={studentPos.x + 10} y={studentPos.y + 8} width="260" height="94" className="pointer-events-none">
            <div className="flex h-full flex-col justify-center text-center leading-tight text-white">
              <div className="line-clamp-2 text-[18px] font-bold" title={student.fullName || "Estudiante"}>
                {student.fullName || "Estudiante"}
              </div>
              <div className="mt-1.5 truncate text-[14px] text-slate-300">
                {student.course || "Sin curso"}
              </div>
            </div>
          </foreignObject>
        </g>

        {members.length === 0 ? (
          <text x="480" y="120" textAnchor="middle" className="fill-slate-500 text-[14px]">
            Agrega familiares o redes para construir el genograma.
          </text>
        ) : null}
      </svg>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-slate-500">
          Haz clic en cualquier nombre del genograma para editar sus datos. Arrastra las tarjetas para organizar el genograma.
        </p>
        {hasCustomPositions ? (
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 rounded bg-slate-200 hover:bg-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 transition"
          >
            Restablecer posiciones
          </button>
        ) : null}
      </div>
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
  const addedAtLabel = formatDateTime(caseRecord.createdAt || caseRecord.updatedAt);

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
          {addedAtLabel ? (
            <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <CalendarDays className="h-3 w-3" /> Añadido {addedAtLabel}
            </p>
          ) : null}
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
          <div className={`bg-gradient-to-br ${avatarTone(student.id)} px-6 pt-4 pb-10 text-white sm:px-8 sm:pb-12`}>
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
          <div className="border-b border-slate-200 bg-white px-6 pt-3 pb-3 sm:px-8 sm:pt-4 sm:pb-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <label className="group relative -mt-8 inline-block h-16 w-16 shrink-0 cursor-pointer sm:-mt-10 sm:h-20 sm:w-20">
                <span className="block h-full w-full overflow-hidden rounded-2xl bg-white ring-4 ring-white shadow-lg">
                  {student.profilePhoto ? (
                    <span className="block h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${student.profilePhoto})` }} />
                  ) : (
                    <span className={`grid h-full w-full place-items-center bg-gradient-to-br ${avatarTone(student.id)} text-xl sm:text-2xl font-bold text-white`}>
                      {initialsOf(student.fullName) || <UserRound className="h-8 w-8 opacity-80 sm:h-10 sm:w-10" />}
                    </span>
                  )}
                </span>
                <span className="absolute -bottom-1 -right-1 grid h-6 w-6 sm:h-8 sm:w-8 place-items-center rounded-full bg-slate-900 text-white ring-2 ring-white shadow-md transition group-hover:scale-110">
                  <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </span>
                <span className="pointer-events-none absolute inset-0 grid place-items-center rounded-2xl bg-slate-950/50 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-white opacity-0 transition group-hover:opacity-100">
                  Cambiar foto
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={(event) => handlePhoto(event.target.files?.[0])} />
              </label>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold leading-tight tracking-tight text-slate-950 sm:text-2xl">{student.fullName || "Estudiante"}</h2>
                <p className="mt-0.5 text-xs sm:text-sm text-slate-600">{student.rut || "Sin RUT/ID"}{student.guardian ? ` · Apoderado/a: ${student.guardian}` : ""}</p>
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
          <div className="flex gap-1 tz-contained-x">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative inline-flex shrink-0 whitespace-nowrap items-center gap-2 px-3 py-3 text-sm font-semibold transition ${active ? "text-blue-700" : "text-slate-500 hover:text-slate-900"}`}
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
                <GenogramChart
                  student={student}
                  members={genogram}
                  selectedMemberId={editingMemberId}
                  onSelectMember={editGenogramMember}
                  onUpdateStudent={onUpdateStudent}
                />
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
  const [showPieOnly, setShowPieOnly] = useState(false);
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

  const matchesSearch = (s: DataRecord) => {
    const isPie = (s.tags || "").toUpperCase().split(",").map((t) => t.trim()).includes("PIE");
    if (showPieOnly && !isPie) return false;
    return (
      !searchable ||
      [s.fullName, s.rut, s.guardian, s.email, s.phone, s.tags, s.course]
        .map((v) => normalize(String(v || "")))
        .some((v) => v.includes(searchable))
    );
  };

  // When searching or filtering by PIE, prefer courses with matches and auto-select the first.
  const filteredCourses = (searchable || showPieOnly)
    ? courseList.map((g) => ({ ...g, students: g.students.filter(matchesSearch) })).filter((g) => g.students.length > 0)
    : courseList;

  useEffect(() => {
    if (filteredCourses.length === 0) return;
    if (!filteredCourses.some((g) => g.name === selectedCourseName)) {
      setSelectedCourseName(filteredCourses[0].name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, cycleFilter, showPieOnly]);

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
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-semibold transition ${cycleFilter === key ? "bg-slate-900 text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => setShowPieOnly(!showPieOnly)}
            className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-semibold transition flex items-center gap-1.5 ${
              showPieOnly
                ? "bg-emerald-600 text-white shadow"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${showPieOnly ? "bg-white" : "bg-emerald-400"}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${showPieOnly ? "bg-white" : "bg-emerald-500"}`}></span>
            </span>
            PIE ({store.students.filter(s => (s.tags || "").toUpperCase().split(",").map(t => t.trim()).includes("PIE")).length})
          </button>
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
          {/* Mobile course selector (the side list is hidden below lg) */}
          <div className="lg:hidden">
            <select
              value={selectedCourseName}
              onChange={(event) => setSelectedCourseName(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-blue-500"
            >
              {filteredCourses.map((group) => (
                <option key={group.name} value={group.name}>
                  {group.name} · {group.students.length} est.
                </option>
              ))}
            </select>
          </div>

          {/* Master pane: course list */}
          <aside className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white lg:block">
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
                              {tags.slice(0, 3).map((tag) => {
                                const isPie = tag.toUpperCase() === "PIE";
                                return (
                                  <span
                                    key={tag}
                                    className={`hidden rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 sm:inline ${
                                      isPie
                                        ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                                        : "bg-blue-50 text-blue-700 ring-blue-200"
                                    }`}
                                  >
                                    {isPie ? "🧩 PIE" : tag}
                                  </span>
                                );
                              })}
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

// ==========================================
// VISTA: PROGRAMA DE INTEGRACIÓN ESCOLAR (PIE)
// ==========================================

// Catálogo MINEDUC de diagnósticos / NEE (Decreto 170).
const MINEDUC_NEE_PERMANENTE = [
  "Discapacidad Intelectual",
  "Discapacidad Intelectual Leve (DIL)",
  "Discapacidad Visual",
  "Discapacidad Auditiva",
  "Discapacidad Múltiple (DM)",
  "Sordoceguera",
  "Disfasia Severa",
  "Trastorno del Espectro Autista (TEA)",
];
const MINEDUC_NEE_TRANSITORIA = [
  "Dificultades Específicas del Aprendizaje (DEA)",
  "Trastorno Específico del Lenguaje (TEL)",
  "Trastorno por Déficit Atencional (TDA/TDAH)",
  "Funcionamiento Intelectual Limítrofe (FIL)",
];

// Expansión de códigos abreviados usados en la nómina oficial.
const PIE_DIAG_LABELS: Record<string, string> = {
  TEA: "Trastorno del Espectro Autista (TEA)",
  DEA: "Dificultad Específica del Aprendizaje (DEA)",
  "DEA-C": "DEA Combinada",
  "DEA -C": "DEA Combinada",
  TDA: "Trastorno por Déficit Atencional (TDA)",
  TDAH: "Trastorno por Déficit Atencional e Hiperactividad (TDAH)",
  TEL: "Trastorno Específico del Lenguaje (TEL)",
  TL: "Trastorno del Lenguaje (TL)",
  FIL: "Funcionamiento Intelectual Limítrofe (FIL)",
  DIL: "Discapacidad Intelectual Leve (DIL)",
  DM: "Discapacidad Intelectual / Múltiple (DM)",
  "DA-HS": "Dificultad de Aprendizaje (DA-HS)",
  GARC: "GARC",
};

const pieDiagLabel = (code: string) => {
  const key = (code || "").trim().toUpperCase();
  return PIE_DIAG_LABELS[key] || code || "";
};

type PieData = {
  active: boolean;
  diag: string;
  diagnoses: string[];
  tipoNEE: string; // Permanente | Transitoria | ""
  situacion: string;
  situaciones: string[];
  cupo: string; // Cupo | Sobrecupo | Pendiente | ""
  sourceSheets: string[];
  classifications: string[];
  entryYear: string;
  birthDate: string;
  diagDate: string;
  evaluator: string;
  evaluators: string[];
  specialty: string;
  specialties: string[];
  professional: string; // profesional diferencial PIE asignado
  professionals: string[];
  assignedStaff: string[]; // cualquier funcionario que trabaje con el estudiante
  platformStatus: string;
  scannerStatus: string;
  loadedDocument: string;
  pendingDocument: string;
  deadline: string;
  approvedPreviousYears: string;
  appealResult: string;
  finalResult: string;
  siblings: string;
  records: Array<Record<string, string>>;
  altaDate: string;
  bajaDate: string;
  notes: string;
};

const emptyPieData = (): PieData => ({
  active: false, diag: "", diagnoses: [], tipoNEE: "", situacion: "", situaciones: [], cupo: "", sourceSheets: [], classifications: [], entryYear: "",
  birthDate: "", diagDate: "", evaluator: "", evaluators: [], specialty: "", specialties: [], professional: "", professionals: [],
  assignedStaff: [], platformStatus: "", scannerStatus: "", loadedDocument: "", pendingDocument: "", deadline: "",
  approvedPreviousYears: "", appealResult: "", finalResult: "", siblings: "", records: [], altaDate: "", bajaDate: "", notes: "",
});

const parsePieData = (student: DataRecord): PieData => {
  if (student.pieData) {
    try {
      const parsed = JSON.parse(student.pieData);
      if (parsed && typeof parsed === "object") {
        const base = { ...emptyPieData(), ...parsed };
        return {
          ...base,
          diagnoses: Array.isArray(parsed.diagnoses) ? parsed.diagnoses : parsed.diag ? [parsed.diag] : [],
          situaciones: Array.isArray(parsed.situaciones) ? parsed.situaciones : parsed.situacion ? [parsed.situacion] : [],
          sourceSheets: Array.isArray(parsed.sourceSheets) ? parsed.sourceSheets : [],
          classifications: Array.isArray(parsed.classifications) ? parsed.classifications : [],
          evaluators: Array.isArray(parsed.evaluators) ? parsed.evaluators : parsed.evaluator ? [parsed.evaluator] : [],
          specialties: Array.isArray(parsed.specialties) ? parsed.specialties : parsed.specialty ? [parsed.specialty] : [],
          professionals: Array.isArray(parsed.professionals) ? parsed.professionals : parsed.professional ? [parsed.professional] : [],
          assignedStaff: Array.isArray(parsed.assignedStaff) ? parsed.assignedStaff : [],
          records: Array.isArray(parsed.records) ? parsed.records : [],
        };
      }
    } catch {
      // fall through to legacy parsing
    }
  }
  // Legacy: derive from the supportNeeds text blob + tags.
  const hasPieTag = (student.tags || "").split(",").some((t) => t.trim().toUpperCase() === "PIE");
  if (!hasPieTag) return emptyPieData();
  const sn = student.supportNeeds || "";
  const diagMatch = sn.match(/Diagnóstico:\s*([^().\n\r]+?)(?:\s*\(|\s*\.|\s*Profesional|$)/i);
  const sitMatch = sn.match(/Diagnóstico:.*?\(([^)]+)\)/i);
  const profMatch = sn.match(/Profesional asignado:\s*([^.\n\r]+?)(?:\.|$)/i);
  const sit = sitMatch ? sitMatch[1].trim() : "";
  return {
    ...emptyPieData(),
    active: true,
    diag: diagMatch ? diagMatch[1].trim() : "",
    situacion: sit,
    tipoNEE: /NEEP/i.test(sit) ? "Permanente" : /NEET/i.test(sit) ? "Transitoria" : "",
    professional: profMatch ? profMatch[1].trim() : "",
  };
};

const isPieStudent = (student: DataRecord) => {
  if ((student.tags || "").split(",").some((t) => t.trim().toUpperCase() === "PIE")) return true;
  return parsePieData(student).active;
};

const getPieDiagnosis = (student: DataRecord) => {
  const pd = parsePieData(student);
  if (pd.diag) return pd.diag;
  const sn = student.supportNeeds || "";
  const diagMatch = sn.match(/Diagnóstico:\s*([^().\n\r]+?)(?:\s*\(|\s*\.|\s*Profesional|$)/i);
  if (diagMatch && diagMatch[1].trim()) {
    return diagMatch[1].trim();
  }
  const snUpper = sn.toUpperCase();
  if (snUpper.includes("TEA")) return "TEA";
  if (snUpper.includes("TEL MIXTO")) return "TEL Mixto";
  if (snUpper.includes("TEL EXPRESIVO")) return "TEL Exp.";
  if (snUpper.includes("TEL")) return "TEL";
  if (snUpper.includes("FIL")) return "FIL";
  if (snUpper.includes("DIL")) return "DIL";
  if (/\bTDAH\b/.test(snUpper)) return "TDAH";
  if (/\bTDA\b/.test(snUpper)) return "TDA";
  if (snUpper.includes("DEA")) return "DEA";
  if (snUpper.includes("SDA")) return "SDA";
  return "S/D";
};

const getPieDiagnoses = (student: DataRecord) => {
  const pd = parsePieData(student);
  const values = [...(pd.diagnoses || []), pd.diag].map((diag) => diag.trim()).filter(Boolean);
  return Array.from(new Set(values));
};

const getPieSituation = (student: DataRecord) => {
  const pd = parsePieData(student);
  if (pd.situacion) return pd.situacion;
  if (pd.tipoNEE) return pd.tipoNEE;
  const sn = student.supportNeeds || "";
  const match = sn.match(/Diagnóstico:.*?\(([^)]+)\)/i);
  if (match && match[1].trim()) {
    return match[1].trim();
  }
  const snUpper = sn.toUpperCase();
  if (snUpper.includes("PERMANENTE")) return "Permanente";
  if (snUpper.includes("TRANSITORIO")) return "Transitorio";
  return "No especificado";
};

const getPieProfessional = (student: DataRecord) => {
  const pd = parsePieData(student);
  if (pd.professional) return pd.professional;
  const sn = student.supportNeeds || "";
  const match = sn.match(/Profesional asignado:\s*([^.\n\r]+?)(?:\.|$)/i);
  if (match && match[1].trim()) {
    return match[1].trim();
  }
  if (sn.includes("Profesional:")) {
    const pMatch = sn.match(/Profesional:\s*([^.\n\r]+?)(?:\.|$)/i);
    if (pMatch && pMatch[1].trim()) return pMatch[1].trim();
  }
  return "Sin asignar";
};

const getPieCupoStatus = (student: DataRecord) => parsePieData(student).cupo || "Cupo";

const todayIso = () => new Date().toISOString().slice(0, 10);

const appendPieNote = (current: string, note: string) => {
  const stamp = new Date().toLocaleDateString("es-CL");
  return [current, `[${stamp}] ${note}`].filter(Boolean).join("\n");
};

function PieWorkspaceView({
  store,
  onOpenStudent,
  onNavigate,
  onSeedPie,
  onUpdateStudent,
}: {
  store: DataStore;
  onOpenStudent: (studentId: string, focusField?: string) => void;
  onNavigate: (view: ViewId) => void;
  onSeedPie: () => void;
  onUpdateStudent: (studentId: string, updates: Record<string, string>) => void;
}) {
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedDiag, setSelectedDiag] = useState<string>("all");
  const [selectedSituation, setSelectedSituation] = useState<string>("all");
  const [selectedProfessional, setSelectedProfessional] = useState<string>("all");
  const [selectedCupo, setSelectedCupo] = useState<string>("all");

  const cycleByCourse = useMemo(() => {
    return new Map(officialCourses.map((c) => [normalize(c.name), c.cycle]));
  }, []);

  const pieStudents = useMemo(() => {
    return store.students.filter((s) => isPieStudent(s) && !parsePieData(s).bajaDate);
  }, [store.students]);

  // Statistics
  const totalPieCount = pieStudents.length;
  const permanenteCount = useMemo(() => pieStudents.filter(s => getPieSituation(s).toUpperCase().includes("PERMANENTE")).length, [pieStudents]);
  const transitorioCount = useMemo(() => pieStudents.filter(s => getPieSituation(s).toUpperCase().includes("TRANSITORIO")).length, [pieStudents]);
  const specialistCount = useMemo(() => {
    const set = new Set<string>();
    PIE_PROFESSIONALS.forEach((prof) => set.add(prof.name));
    pieStudents.forEach((s) => {
      const prof = getPieProfessional(s);
      if (prof && prof !== "Sin asignar") set.add(prof);
    });
    return set.size;
  }, [pieStudents]);
  const cupoCount = useMemo(() => pieStudents.filter(s => getPieCupoStatus(s) === "Cupo").length, [pieStudents]);
  const sobrecupoCount = useMemo(() => pieStudents.filter(s => getPieCupoStatus(s) === "Sobrecupo").length, [pieStudents]);
  const pendienteCount = useMemo(() => pieStudents.filter(s => getPieCupoStatus(s) === "Pendiente").length, [pieStudents]);

  // Top Diagnostics Counts
  const diagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    pieStudents.forEach((s) => {
      const diag = getPieDiagnosis(s).trim().toUpperCase() || "S/D";
      counts[diag] = (counts[diag] || 0) + 1;
    });
    return counts;
  }, [pieStudents]);
  const diagColor = (diag: string) => ({
    TEA: "bg-emerald-50 text-emerald-700 border-emerald-200",
    FIL: "bg-violet-50 text-violet-700 border-violet-200",
    DIL: "bg-purple-50 text-purple-700 border-purple-200",
    TEL: "bg-blue-50 text-blue-700 border-blue-200",
    TL: "bg-blue-50 text-blue-700 border-blue-200",
    TDA: "bg-amber-50 text-amber-700 border-amber-200",
    TDAH: "bg-orange-50 text-orange-700 border-orange-200",
    DEA: "bg-indigo-50 text-indigo-700 border-indigo-200",
    "DEA-C": "bg-indigo-50 text-indigo-700 border-indigo-200",
    "DEA -C": "bg-indigo-50 text-indigo-700 border-indigo-200",
    GARC: "bg-rose-50 text-rose-700 border-rose-200",
    DM: "bg-cyan-50 text-cyan-700 border-cyan-200",
  }[diag] || "bg-slate-50 text-slate-700 border-slate-200");

  const professionals = useMemo(() => {
    const set = new Set<string>();
    PIE_PROFESSIONALS.forEach((prof) => set.add(prof.name));
    pieStudents.forEach((s) => {
      const prof = getPieProfessional(s);
      if (prof && prof !== "Sin asignar") set.add(prof);
      parsePieData(s).professionals.forEach((name) => name && set.add(name));
    });
    return Array.from(set).sort();
  }, [pieStudents]);

  const pieCatalogStaff = useMemo(() => {
    const set = new Set<string>();
    PIE_PROFESSIONALS.forEach((prof) => set.add(prof.name));
    store.students.forEach((student) => {
      const pd = parsePieData(student);
      [pd.professional, ...pd.professionals, ...pd.evaluators, ...pd.assignedStaff].forEach((name) => {
        if (name) set.add(name);
      });
    });
    return Array.from(set).sort();
  }, [store.students]);

  const updatePieData = (student: DataRecord, updates: Partial<PieData>, toastNote?: string) => {
    const current = parsePieData(student);
    const nextData = { ...current, ...updates };
    const tags = (student.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean);
    if (nextData.active && !tags.some((tag) => tag.toUpperCase() === "PIE")) tags.push("PIE");
    onUpdateStudent(student.id, {
      tags: tags.join(", "),
      pieData: JSON.stringify(nextData),
      supportNeeds: `Programa de Integración Escolar (PIE). Diagnóstico: ${getPieDiagnoses({ ...student, pieData: JSON.stringify(nextData) }).map(pieDiagLabel).join(", ") || "S/D"} (${nextData.situacion || nextData.tipoNEE || "Sin situación"}). Profesional asignado: ${nextData.professional || "Sin asignar"}.`,
    });
    if (toastNote) {
      // updateStudentRecord already raises a generic toast; this keeps the action auditable in notes.
      console.info(toastNote);
    }
  };

  const transferToPie = (student: DataRecord) => {
    if (!window.confirm(`¿Estás seguro de que deseas transferir/ingresar a ${student.fullName || "este estudiante"} al programa PIE?`)) return;
    const current = parsePieData(student);
    updatePieData(student, {
      active: true,
      cupo: current.cupo || "Transferencia",
      altaDate: current.altaDate || todayIso(),
      bajaDate: "",
      notes: appendPieNote(current.notes, "Transferido/ingresado a seguimiento PIE desde el software."),
    });
  };

  const dischargeFromPie = (student: DataRecord) => {
    if (!window.confirm(`¿Estás seguro de que deseas dar de ALTA o EGRESO a ${student.fullName || "este estudiante"} del programa PIE?`)) return;
    const current = parsePieData(student);
    updatePieData(student, {
      active: false,
      bajaDate: todayIso(),
      notes: appendPieNote(current.notes, "Alta/Egreso PIE registrada desde el software."),
    });
  };

  const assignStaff = (student: DataRecord, staffName: string) => {
    const current = parsePieData(student);
    const value = staffName.trim();
    if (!value) return;
    const assignedStaff = Array.from(new Set([...(current.assignedStaff || []), value]));
    updatePieData(student, {
      assignedStaff,
      notes: appendPieNote(current.notes, `Funcionario/profesional asignado: ${value}.`),
    });
  };

  // Students matching non-course filters
  const studentsMatchingNonCourseFilters = useMemo(() => {
    return pieStudents.filter((s) => {
      // Search filter
      const searchNormalized = normalize(search);
      if (searchNormalized) {
        const diag = getPieDiagnosis(s);
        const prof = getPieProfessional(s);
        const match = [s.fullName, s.rut, s.course, diag, prof]
          .map((v) => normalize(String(v || "")))
          .some((v) => v.includes(searchNormalized));
        if (!match) return false;
      }

      // Diagnostic filter
      if (selectedDiag !== "all") {
        const diag = getPieDiagnosis(s).toUpperCase();
        if (diag !== selectedDiag) {
          return false;
        }
      }

      // Situation filter
      if (selectedSituation !== "all") {
        const sit = getPieSituation(s).toUpperCase();
        if (selectedSituation === "PERMANENTE" && !sit.includes("PERMANENTE")) return false;
        if (selectedSituation === "TRANSITORIO" && !sit.includes("TRANSITORIO")) return false;
      }

      // Professional filter
      if (selectedProfessional !== "all") {
        const prof = getPieProfessional(s);
        const pd = parsePieData(s);
        if (prof !== selectedProfessional && !pd.professionals.includes(selectedProfessional) && !pd.assignedStaff.includes(selectedProfessional)) return false;
      }

      if (selectedCupo !== "all" && getPieCupoStatus(s) !== selectedCupo) {
        return false;
      }

      return true;
    });
  }, [pieStudents, search, selectedDiag, selectedSituation, selectedProfessional, selectedCupo]);

  // Group by Course
  const officialOrder = useMemo(() => [...officialCourses.map((c) => c.name), "Sin curso"], []);

  const sidebarCourseList = useMemo(() => {
    const groupedFiltered = new Map<string, DataRecord[]>();
    studentsMatchingNonCourseFilters.forEach((student) => {
      const courseKey = (student.course || "Sin curso").trim() || "Sin curso";
      if (!groupedFiltered.has(courseKey)) groupedFiltered.set(courseKey, []);
      groupedFiltered.get(courseKey)!.push(student);
    });

    return officialOrder
      .filter((name) => groupedFiltered.has(name))
      .concat(Array.from(groupedFiltered.keys()).filter((name) => !officialOrder.includes(name) && groupedFiltered.has(name)))
      .map((name) => {
        const cycle = cycleByCourse.get(normalize(name)) || (name === "Sin curso" ? undefined : "III Ciclo");
        const students = groupedFiltered.get(name) || [];
        return { name, students, cycle };
      });
  }, [studentsMatchingNonCourseFilters, officialOrder, cycleByCourse]);

  // Reset selectedCourse if not found in list
  useEffect(() => {
    if (selectedCourse !== "all" && !sidebarCourseList.some((c) => c.name === selectedCourse)) {
      setSelectedCourse("all");
    }
  }, [selectedCourse, sidebarCourseList]);

  const displayedStudents = useMemo(() => {
    return (selectedCourse === "all"
      ? studentsMatchingNonCourseFilters
      : studentsMatchingNonCourseFilters.filter((s) => s.course === selectedCourse)
    ).slice().sort((a, b) => (a.fullName || "").localeCompare(b.fullName || "", "es"));
  }, [selectedCourse, studentsMatchingNonCourseFilters]);

  // Card click triggers
  const handleStatClick = (type: "all" | "permanente" | "transitorio") => {
    if (type === "all") {
      setSelectedDiag("all");
      setSelectedSituation("all");
      setSelectedProfessional("all");
      setSelectedCupo("all");
      setSelectedCourse("all");
    } else if (type === "permanente") {
      setSelectedSituation("PERMANENTE");
    } else if (type === "transitorio") {
      setSelectedSituation("TRANSITORIO");
    }
  };

  const diagnosticsConfig = [
    { key: "all", label: "Todos", color: "bg-slate-900 text-white" },
    ...Object.entries(diagCounts)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"))
      .map(([key]) => ({ key, label: key, color: diagColor(key) })),
  ];

  return (
    <div className="tz-fade">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-100 text-emerald-700 shadow-sm">
              <Puzzle className="h-5 w-5" />
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">Programa de Integración Escolar (PIE)</h1>
          </div>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Panel unificado para el seguimiento de estudiantes integrados, diagnósticos clínicos y profesionales de apoyo asignados.
          </p>
        </div>
        <button
          onClick={onSeedPie}
          className="tz-press inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
        >
          <Puzzle className="h-4 w-4" />
          {totalPieCount === 0 ? "Cargar nómina oficial PIE 2026" : "Sincronizar nómina PIE 2026"}
        </button>
      </div>

      {totalPieCount === 0 ? (
        <div className="mb-6 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/50 p-8 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
            <Puzzle className="h-6 w-6" />
          </span>
          <h2 className="mt-3 text-lg font-semibold text-slate-900">Aún no hay estudiantes PIE cargados</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-600">
            La Nómina Oficial PIE 2026 (313 estudiantes) ya viene incluida. Pulsa el botón para cargarla; se integrará con los estudiantes existentes (por RUT) y se sincronizará automáticamente.
          </p>
          <button
            onClick={onSeedPie}
            className="tz-press mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700"
          >
            <Puzzle className="h-4 w-4" /> Cargar 313 estudiantes PIE
          </button>
        </div>
      ) : null}

      {/* Statistics Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total PIE Card */}
        <button
          onClick={() => handleStatClick("all")}
          className="tz-press border border-slate-200 hover:border-slate-300 bg-white p-5 rounded-2xl flex items-center gap-4 text-left shadow-sm hover:shadow-md transition"
        >
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
            <Puzzle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 tabular-nums">{totalPieCount}</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Estudiantes PIE</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Click para limpiar filtros</p>
          </div>
        </button>

        {/* NEEP Card */}
        <button
          onClick={() => handleStatClick("permanente")}
          className={`tz-press border p-5 rounded-2xl flex items-center gap-4 text-left shadow-sm hover:shadow-md transition ${
            selectedSituation === "PERMANENTE"
              ? "border-purple-500 bg-purple-50/20"
              : "border-slate-200 hover:border-slate-300 bg-white"
          }`}
        >
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-purple-50 text-purple-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 tabular-nums">{permanenteCount}</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">NEE Permanentes</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Apoyos continuos (NEEP)</p>
          </div>
        </button>

        {/* NEET Card */}
        <button
          onClick={() => handleStatClick("transitorio")}
          className={`tz-press border p-5 rounded-2xl flex items-center gap-4 text-left shadow-sm hover:shadow-md transition ${
            selectedSituation === "TRANSITORIO"
              ? "border-amber-500 bg-amber-50/20"
              : "border-slate-200 hover:border-slate-300 bg-white"
          }`}
        >
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-amber-50 text-amber-600">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 tabular-nums">{transitorioCount}</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">NEE Transitorias</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Apoyos temporales (NEET)</p>
          </div>
        </button>

        {/* Specialists Card */}
        <div className="border border-slate-200 bg-white p-5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600">
            <UsersRound className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 tabular-nums">{specialistCount}</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Especialistas PIE</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Docentes y terapeutas activos</p>
          </div>
        </div>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-3">
        {[
          { key: "Cupo", label: "Cupos PIE", value: cupoCount, tone: "bg-emerald-50 text-emerald-700 border-emerald-200" },
          { key: "Sobrecupo", label: "Sobrecupos", value: sobrecupoCount, tone: "bg-blue-50 text-blue-700 border-blue-200" },
          { key: "Pendiente", label: "Pendientes SC", value: pendienteCount, tone: "bg-orange-50 text-orange-700 border-orange-200" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setSelectedCupo(selectedCupo === item.key ? "all" : item.key)}
            className={`rounded-xl border px-4 py-3 text-left transition hover:shadow-sm ${
              selectedCupo === item.key ? "border-slate-900 bg-slate-900 text-white" : item.tone
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">{item.label}</p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums">{item.value}</p>
          </button>
        ))}
      </div>

      {/* Diagnostic Chips Row */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Filtrar por Diagnóstico</p>
        <div className="flex flex-wrap gap-2">
          {diagnosticsConfig.map((diag) => {
            const count = diag.key === "all" ? totalPieCount : diagCounts[diag.key] || 0;
            const isActive = selectedDiag === diag.key;
            return (
              <button
                key={diag.key}
                onClick={() => setSelectedDiag(diag.key)}
                className={`whitespace-nowrap tz-press rounded-full px-3.5 py-1.5 text-xs font-semibold border transition flex items-center gap-2 ${
                  isActive
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : `${diag.color} hover:bg-slate-100`
                }`}
              >
                <span>{diag.label}</span>
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  isActive ? "bg-white/20 text-white" : "bg-black/5 text-slate-600"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="mb-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 lg:flex-row lg:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por estudiante, RUT, curso, profesional, diagnóstico…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
          />
          {search ? (
            <button onClick={() => setSearch("")} className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Situation Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Situación:</span>
            <select
              value={selectedSituation}
              onChange={(e) => setSelectedSituation(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 outline-none hover:border-slate-300"
            >
              <option value="all">Todas</option>
              <option value="PERMANENTE">Permanente (NEEP)</option>
              <option value="TRANSITORIO">Transitorio (NEET)</option>
            </select>
          </div>

          {/* Specialist Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Especialista:</span>
            <select
              value={selectedProfessional}
              onChange={(e) => setSelectedProfessional(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 outline-none hover:border-slate-300 max-w-[200px]"
            >
              <option value="all">Todos</option>
              {professionals.map((prof) => (
                <option key={prof} value={prof}>{prof}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Cupo:</span>
            <select
              value={selectedCupo}
              onChange={(e) => setSelectedCupo(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 outline-none hover:border-slate-300"
            >
              <option value="all">Todos</option>
              <option value="Cupo">Cupo</option>
              <option value="Sobrecupo">Sobrecupo</option>
              <option value="Pendiente">Pendiente</option>
            </select>
          </div>

          {/* Reset All Filters button if any filter is active */}
          {(search || selectedDiag !== "all" || selectedSituation !== "all" || selectedProfessional !== "all" || selectedCupo !== "all" || selectedCourse !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedDiag("all");
                setSelectedSituation("all");
                setSelectedProfessional("all");
                setSelectedCupo("all");
                setSelectedCourse("all");
              }}
              className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 transition"
            >
              Limpiar Filtros
            </button>
          )}
        </div>

        <div className="rounded-md bg-slate-50 px-3 py-1.5 text-sm lg:ml-auto">
          <span className="font-semibold tabular-nums text-slate-950">{displayedStudents.length}</span>
          <span className="ml-1 text-slate-500">de {totalPieCount} estudiantes</span>
        </div>
      </div>

      {totalPieCount === 0 ? (
        <div className="tz-fade rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <Puzzle className="mx-auto h-12 w-12 text-emerald-500 animate-pulse" />
          <h2 className="mt-4 text-lg font-bold text-slate-950">Programa de Integración Escolar (PIE) vacío</h2>
          <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
            Aún no has importado la nómina PIE oficial o etiquetado estudiantes con la etiqueta "PIE".
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => onNavigate("import")}
              className="tz-press inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-slate-800"
            >
              <Upload className="h-4 w-4" /> Importar Nómina Oficial
            </button>
            <button
              onClick={() => onNavigate("students")}
              className="tz-press inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Ir a Estudiantes
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
          {/* Mobile course selector (the side list is hidden below lg) */}
          <div className="lg:hidden">
            <select
              value={selectedCourse}
              onChange={(event) => setSelectedCourse(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-emerald-500"
            >
              <option value="all">Todos los cursos · {studentsMatchingNonCourseFilters.length}</option>
              {sidebarCourseList.map((group) => (
                <option key={group.name} value={group.name}>
                  {group.name} · {group.students.length}
                </option>
              ))}
            </select>
          </div>

          {/* Master Course List */}
          <aside className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:flex flex-col h-[calc(100vh-320px)]">
            <div className="border-b border-slate-100 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50 flex items-center justify-between">
              <span>Filtrar por Curso</span>
              <span className="rounded-full bg-slate-200 px-2 py-0.5 font-bold tabular-nums text-slate-700">
                {sidebarCourseList.length}
              </span>
            </div>
            <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
              {/* Option "Todos los cursos" */}
              <button
                onClick={() => setSelectedCourse("all")}
                className={`group flex w-full items-center gap-3 border-l-4 px-4 py-3 text-left transition ${
                  selectedCourse === "all"
                    ? "border-emerald-600 bg-emerald-50/40"
                    : "border-transparent hover:bg-slate-50"
                }`}
              >
                <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                  selectedCourse === "all" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"
                } text-[11px] font-bold shadow-sm`}>
                  ⚡️
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-semibold ${selectedCourse === "all" ? "text-emerald-900" : "text-slate-900"}`}>Todos los cursos</p>
                  <p className="truncate text-[10px] text-slate-400">Total general de integrados</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums ${
                  selectedCourse === "all" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700"
                }`}>
                  {studentsMatchingNonCourseFilters.length}
                </span>
              </button>

              {sidebarCourseList.map((group) => {
                const active = group.name === selectedCourse;
                return (
                  <button
                    key={group.name}
                    onClick={() => setSelectedCourse(group.name)}
                    className={`group flex w-full items-center gap-3 border-l-4 px-4 py-3 text-left transition ${
                      active ? "border-emerald-600 bg-emerald-50/40" : "border-transparent hover:bg-slate-50"
                    }`}
                  >
                    <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${avatarTone(group.name)} text-[11px] font-bold text-white shadow-sm`}>
                      {group.name.split(" ").slice(0, 2).map((p) => p[0] || "").join("").toUpperCase().slice(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-sm font-semibold ${active ? "text-emerald-900" : "text-slate-900"}`}>{group.name}</p>
                      <p className="truncate text-[10px] text-slate-400">{group.cycle || "Sin ciclo"}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums ${active ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700"}`}>
                      {group.students.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Students list */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col h-[calc(100vh-320px)]">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 bg-slate-50">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {selectedCourse === "all" ? "Todos los estudiantes PIE" : selectedCourse}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {displayedStudents.length} estudiante{displayedStudents.length === 1 ? "" : "s"} integrado{displayedStudents.length === 1 ? "" : "s"}
                </p>
              </div>
            </header>

            {displayedStudents.length === 0 ? (
              <div className="p-12 text-center flex-1 flex flex-col justify-center">
                <Search className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-3 text-sm text-slate-500">Ningún estudiante integrado coincide con los filtros aplicados.</p>
              </div>
            ) : (
              <div className="overflow-auto flex-1">
                <table className="w-full min-w-max text-left text-sm border-collapse font-sans">
                  <thead className="text-xs font-semibold text-slate-500 border-b border-slate-100">
                    <tr>
                      <th className="sticky top-0 bg-slate-50 z-10 px-5 py-3 font-semibold whitespace-nowrap">Estudiante</th>
                      {selectedCourse === "all" && <th className="sticky top-0 bg-slate-50 z-10 px-5 py-3 font-semibold whitespace-nowrap">Curso</th>}
                      <th className="sticky top-0 bg-slate-50 z-10 px-5 py-3 font-semibold whitespace-nowrap">RUT</th>
                      <th className="sticky top-0 bg-slate-50 z-10 px-5 py-3 font-semibold whitespace-nowrap">Diagnóstico</th>
                      <th className="sticky top-0 bg-slate-50 z-10 px-5 py-3 font-semibold whitespace-nowrap">Situación</th>
                      <th className="sticky top-0 bg-slate-50 z-10 px-5 py-3 font-semibold whitespace-nowrap">Cupo</th>
                      <th className="sticky top-0 bg-slate-50 z-10 px-5 py-3 font-semibold whitespace-nowrap">Documentación</th>
                      <th className="sticky top-0 bg-slate-50 z-10 px-5 py-3 font-semibold whitespace-nowrap">Especialista PIE</th>
                      <th className="sticky top-0 bg-slate-50 z-10 px-5 py-3 font-semibold whitespace-nowrap">Funcionarios</th>
                      <th className="sticky top-0 bg-slate-50 z-10 px-5 py-3 font-semibold whitespace-nowrap">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayedStudents.map((student) => {
                      const pd = parsePieData(student);
                      const diag = getPieDiagnosis(student);
                      const diagList = getPieDiagnoses(student);
                      const sit = getPieSituation(student);
                      const prof = getPieProfessional(student);
                      const cupo = getPieCupoStatus(student);
                      const docSummary = [
                        pd.platformStatus && `Plataforma: ${pd.platformStatus}`,
                        pd.scannerStatus && `Scanner: ${pd.scannerStatus}`,
                        pd.loadedDocument && `Doc.: ${pd.loadedDocument}`,
                        pd.pendingDocument && `Pendiente: ${pd.pendingDocument}`,
                        pd.deadline && `Plazo: ${pd.deadline}`,
                      ].filter(Boolean);

                      const diagColor = {
                        TEA: "bg-emerald-50 text-emerald-700 ring-emerald-200/60 border-emerald-200/40",
                        FIL: "bg-violet-50 text-violet-700 ring-violet-200/60 border-violet-200/40",
                        DIL: "bg-purple-50 text-purple-700 ring-purple-200/60 border-purple-200/40",
                        TEL: "bg-blue-50 text-blue-700 ring-blue-200/60 border-blue-200/40",
                        TL: "bg-blue-50 text-blue-700 ring-blue-200/60 border-blue-200/40",
                        TDA: "bg-amber-50 text-amber-700 ring-amber-200/60 border-amber-200/40",
                        TDAH: "bg-orange-50 text-orange-700 ring-orange-200/60 border-orange-200/40",
                        DEA: "bg-indigo-50 text-indigo-700 ring-indigo-200/60 border-indigo-200/40",
                        GARC: "bg-rose-50 text-rose-700 ring-rose-200/60 border-rose-200/40",
                        DM: "bg-cyan-50 text-cyan-700 ring-cyan-200/60 border-cyan-200/40",
                      }[diag.toUpperCase()] || "bg-slate-50 text-slate-700 ring-slate-200/60 border-slate-200/40";

                      const sitColor = sit.toUpperCase().includes("PERMANENTE")
                        ? "bg-purple-500/10 text-purple-700 ring-purple-500/25"
                        : sit.toUpperCase().includes("TRANSITORIO")
                          ? "bg-amber-500/10 text-amber-700 ring-amber-500/25"
                          : "bg-slate-500/10 text-slate-600 ring-slate-500/20";

                      return (
                        <tr
                          key={student.id}
                          onClick={() => onOpenStudent(student.id)}
                          className="hover:bg-slate-50/50 cursor-pointer transition"
                        >
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className={`grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br ${avatarTone(student.id)} text-[10px] font-bold text-white shadow-sm`}>
                                {student.profilePhoto ? (
                                  <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${student.profilePhoto})` }} />
                                ) : (
                                  initialsOf(student.fullName)
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900 group-hover:text-emerald-700 truncate max-w-[200px]">{student.fullName || "Sin nombre"}</p>
                              </div>
                            </div>
                          </td>
                          {selectedCourse === "all" && (
                            <td className="px-5 py-3.5 text-slate-600 font-medium whitespace-nowrap">
                              {student.course}
                            </td>
                          )}
                          <td className="px-5 py-3.5 text-xs text-slate-500 font-mono whitespace-nowrap font-semibold">
                            {student.rut || "—"}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="flex max-w-[240px] flex-wrap gap-1.5">
                              {(diagList.length ? diagList : [diag]).map((item) => (
                                <span key={item} className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ring-1 ${diagColor}`}>
                                  {item}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ring-1 ${sitColor}`}>
                              {sit || "Sin especificar"}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ring-1 ${
                              cupo === "Pendiente"
                                ? "bg-orange-50 text-orange-700 ring-orange-200"
                                : cupo === "Sobrecupo"
                                  ? "bg-blue-50 text-blue-700 ring-blue-200"
                                  : "bg-emerald-50 text-emerald-700 ring-emerald-200"
                            }`}>
                              {cupo}
                            </span>
                            {pd.sourceSheets.length ? (
                              <p className="mt-1 text-[10px] font-medium text-slate-400">{pd.sourceSheets.join(" + ")}</p>
                            ) : null}
                          </td>
                          <td className="px-5 py-3.5 text-xs text-slate-600 whitespace-nowrap">
                            <div className="max-w-[260px] space-y-1">
                              {docSummary.length ? docSummary.slice(0, 3).map((item) => (
                                <p key={item} className="truncate">{item}</p>
                              )) : <span className="text-slate-300">Sin observación</span>}
                              {pd.records.length > 1 ? (
                                <p className="font-semibold text-slate-400">{pd.records.length} registros de origen</p>
                              ) : null}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-slate-700 font-medium whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                              <span className="truncate max-w-[150px]">{prof || "Sin asignar"}</span>
                            </div>
                            {pd.evaluator ? <p className="mt-1 truncate text-[10px] text-slate-400">Eval.: {pd.evaluator}</p> : null}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="space-y-2">
                              <select
                                onClick={(event) => event.stopPropagation()}
                                onChange={(event) => {
                                  event.stopPropagation();
                                  assignStaff(student, event.target.value);
                                  event.currentTarget.value = "";
                                }}
                                defaultValue=""
                                className="w-44 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700"
                              >
                                <option value="">Asignar funcionario</option>
                                {pieCatalogStaff.map((name) => <option key={name} value={name}>{name}</option>)}
                              </select>
                              {pd.assignedStaff.length ? (
                                <div className="flex max-w-[220px] flex-wrap gap-1">
                                  {pd.assignedStaff.map((name) => (
                                    <span key={name} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">{name}</span>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="flex flex-col gap-1.5">
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  transferToPie(student);
                                }}
                                className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
                              >
                                Transferir a PIE
                              </button>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  dischargeFromPie(student);
                                }}
                                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                              >
                                Alta/Egreso PIE
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
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
            <span className="mt-3 font-semibold text-slate-950">Subir CSV / TSV / Excel</span>
            <span className="mt-1 text-sm text-slate-600">CSV, TSV o archivos Excel (.xlsx, .xlsm)</span>
            <input
              type="file"
              accept=".csv,.tsv,.txt,.xlsx,.xlsm"
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
          <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <p className="font-semibold">¡Soporte Excel Activo! 🧩</p>
            <p className="mt-1">Ahora puedes subir archivos Excel (.xlsx, .xlsm) directamente. Si subes la nómina oficial PIE, el sistema iniciará una sincronización inteligente de diagnósticos y profesionales.</p>
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

function PieImportConfirmationView({
  data,
  store,
  onCancel,
  onConfirm,
}: {
  data: any[];
  store: DataStore;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const cleanRut = (r: string) => String(r || "").replace(/[^0-9kK]/g, "").toUpperCase();

  const matchSummary = useMemo(() => {
    let matched = 0;
    let created = 0;
    data.forEach((excelStudent) => {
      const existing = store.students.find((s) => {
        const eRut = cleanRut(s.rut);
        const xRut = cleanRut(excelStudent.rut);
        if (eRut && xRut && eRut === xRut) return true;
        return normalize(s.fullName) === normalize(excelStudent.name);
      });
      if (existing) matched++;
      else created++;
    });
    return { matched, created };
  }, [data, store.students]);

  return (
    <div className="tz-fade">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700">🧩</span>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Sincronización de Nómina PIE</h1>
          </div>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Se ha detectado la Nómina Oficial de Estudiantes del Programa de Integración Escolar (PIE) 2026.
            Comprueba la información y confirma para sincronizar la base de datos de estudiantes del colegio.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 transition animate-pulse"
          >
            Confirmar e Importar
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Resumen</h3>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-2xl font-bold text-slate-900 tabular-nums">{data.length}</p>
                <p className="text-xs text-slate-500 mt-0.5">Estudiantes detectados</p>
              </div>
              <div className="border-t border-slate-100 pt-3">
                <p className="text-2xl font-bold text-blue-700 tabular-nums">{matchSummary.matched}</p>
                <p className="text-xs text-slate-500 mt-0.5 font-semibold">Existen (se actualizarán)</p>
              </div>
              <div className="border-t border-slate-100 pt-3">
                <p className="text-2xl font-bold text-emerald-700 tabular-nums">{matchSummary.created}</p>
                <p className="text-xs text-slate-500 mt-0.5 font-semibold">Nuevos (se crearán)</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 text-xs text-emerald-950 leading-relaxed">
            <h4 className="font-semibold text-emerald-800">¿Qué pasará al confirmar?</h4>
            <ul className="mt-2 list-disc list-inside space-y-1 text-emerald-900">
              <li>Se asignará la etiqueta <strong className="text-emerald-950">PIE</strong> a los estudiantes correspondientes.</li>
              <li>Se registrará su diagnóstico oficial y profesional PIE asignado en su ficha.</li>
              <li>Aparecerán automáticamente en los filtros PIE de los listados de cursos.</li>
            </ul>
          </div>
        </aside>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-base font-semibold text-slate-950 mb-3">Estudiantes a importar</h3>
          <div className="max-h-[60vh] overflow-y-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="font-semibold text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="sticky top-0 bg-slate-50 z-10 px-4 py-3">#</th>
                  <th className="sticky top-0 bg-slate-50 z-10 px-4 py-3">Nombre completo</th>
                  <th className="sticky top-0 bg-slate-50 z-10 px-4 py-3">RUT</th>
                  <th className="sticky top-0 bg-slate-50 z-10 px-4 py-3">Curso</th>
                  <th className="sticky top-0 bg-slate-50 z-10 px-4 py-3">Diagnóstico / SIT.</th>
                  <th className="sticky top-0 bg-slate-50 z-10 px-4 py-3">Especialista PIE</th>
                  <th className="sticky top-0 bg-slate-50 z-10 px-4 py-3">Origen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((student, idx) => {
                  const existing = store.students.some((s) => {
                    const eRut = cleanRut(s.rut);
                    const xRut = cleanRut(student.rut);
                    if (eRut && xRut && eRut === xRut) return true;
                    return normalize(s.fullName) === normalize(student.name);
                  });
                  return (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-2 text-slate-400 font-semibold">{idx + 1}</td>
                      <td className="px-4 py-2 font-medium text-slate-900">
                        {student.name}
                        {existing ? (
                          <span className="ml-1.5 rounded bg-blue-50 px-1 py-0.5 text-[9px] font-semibold text-blue-600 ring-1 ring-blue-100">
                            Existe
                          </span>
                        ) : (
                          <span className="ml-1.5 rounded bg-emerald-50 px-1 py-0.5 text-[9px] font-semibold text-emerald-600 ring-1 ring-emerald-100">
                            Nuevo
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-slate-600">{student.rut}</td>
                      <td className="px-4 py-2 text-slate-800 font-semibold">{student.course}</td>
                      <td className="px-4 py-2">
                        <span className="font-semibold text-slate-900">{student.diag}</span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">{student.situacionTecnica}</span>
                      </td>
                      <td className="px-4 py-2 text-slate-600">{student.professional || "—"}</td>
                      <td className="px-4 py-2">
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-600">
                          {student.sourceSheet}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
    allDay: boolean;
    title: string;
    location: string;
    description: string;
    typeLabel: string;
    color: string;
    icon: LucideIcon;
    href?: ViewId;
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
      allDay: ev.allDay,
      title: isOrientation ? match.displayTitle : (ev.summary || "(sin título)"),
      location: ev.location || "",
      description: ev.description || "",
      typeLabel: isOrientation ? "Orientación" : "Calendario",
      color: isOrientation ? "from-violet-500 to-purple-600" : "from-blue-500 to-sky-600",
      icon: isOrientation ? ClipboardList : CalendarDays,
      href: isOrientation ? "orientation" : undefined,
    });
  });

  store.interviews
    .filter((r) => (r.date || "").slice(0, 10) === todayStr)
    .forEach((r) => {
      items.push({
        key: `interview-${r.id}`,
        start: new Date(`${todayStr}T08:00:00`),
        allDay: true,
        title: `Entrevista · ${r.participant || r.student || "?"}`,
        location: "",
        description: r.reason || "",
        typeLabel: "Entrevista",
        color: "from-emerald-500 to-teal-600",
        icon: MessageSquareText,
        href: "interviews",
      });
    });

  store.orientation
    .filter((r) => (r.date || "").slice(0, 10) === todayStr)
    .forEach((r) => {
      const dup = calendarEvents.some((ev) => {
        const match = matchOrientationEvent(ev.summary);
        return match.isOrientation && normalize(match.course) === normalize(r.course || "");
      });
      if (dup) return;
      items.push({
        key: `app-orient-${r.id}`,
        start: new Date(`${todayStr}T08:00:00`),
        allDay: true,
        title: `${r.topic || "Clase de orientación"} · ${r.course || ""}`,
        location: "",
        description: r.planificacion || r.notes || "",
        typeLabel: "Orientación",
        color: "from-violet-500 to-purple-600",
        icon: ClipboardList,
        href: "orientation",
      });
    });

  const allDayItems = items.filter((it) => it.allDay).sort((a, b) => a.title.localeCompare(b.title));
  const timedItems = items.filter((it) => !it.allDay).sort((a, b) => a.start.getTime() - b.start.getTime());
  const nowMs = today.getTime();
  const nextUp = timedItems.find((it) => (it.end ? it.end.getTime() : it.start.getTime()) >= nowMs);
  const agendaRows = [...timedItems, ...allDayItems].slice(0, 8);
  const agendaTimeLabel = (item: AgendaItem) => {
    if (item.allDay) return "Todo el día";
    const start = item.start.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
    const end = item.end ? item.end.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }) : "";
    return end ? `${start}-${end}` : start;
  };

  const dateLong = today.toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" });
  const in7 = new Date(today.getTime() + 7 * 86400000).toISOString().slice(0, 10);
  const protocolsDue = store.protocols.filter((r) => r.dueDate && r.dueDate >= todayStr && r.dueDate <= in7 && r.status !== "Cerrado");
  const criticalCases = store.cases.filter((r) => /abierto|seguimiento|activad/i.test(r.status || "") && /crítica|alta/i.test(r.priority || ""));
  const schoolDay = today.toLocaleDateString("es-CL", { weekday: "long" }).toLowerCase();
  const nowMinutes = today.getHours() * 60 + today.getMinutes();
  const toMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };
  const currentStaffSlots = STAFF_SCHEDULE
    .filter((slot) => slot.day === schoolDay && toMinutes(slot.startTime) <= nowMinutes && nowMinutes < toMinutes(slot.endTime))
    .sort((a, b) => a.staffName.localeCompare(b.staffName, "es"))
    .slice(0, 6);
  const currentCourseSlots = COURSE_SCHEDULE
    .filter((slot) => slot.day === schoolDay && toMinutes(slot.startTime) <= nowMinutes && nowMinutes < toMinutes(slot.endTime))
    .sort((a, b) => a.course.localeCompare(b.course, "es"))
    .slice(0, 6);
  const miniStats: Array<[string, number, LucideIcon, ViewId, string]> = [
    ["Agenda", items.length, CalendarDays, "today", "bg-blue-50 text-blue-700"],
    ["Protocolos", protocolsDue.length, ShieldCheck, "protocols", "bg-amber-50 text-amber-700"],
    ["Críticos", criticalCases.length, AlertTriangle, "cases", "bg-rose-50 text-rose-700"],
    ["Ahora", currentStaffSlots.length + currentCourseSlots.length, MapPin, "today", "bg-emerald-50 text-emerald-700"],
  ];

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-blue-50/40 to-white px-3 py-2.5">
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-sm">
            <CalendarDays className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-950">Mi día · resumen operativo</h2>
            <p className="text-[11px] capitalize text-slate-500">{dateLong}</p>
          </div>
          {calendarLoading ? <span className="h-3 w-3 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" /> : null}
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">{items.length} {items.length === 1 ? "actividad" : "actividades"}</span>
          {calendarIcalUrl ? (
            <button onClick={onReloadCalendar} className="tz-press rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50">Recargar</button>
          ) : null}
        </div>
      </header>

      <div className="space-y-3 p-3">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {miniStats.map(([label, value, Icon, view, tone]) => (
            <button key={label} onClick={() => onNavigate(view)} className={`tz-press flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left ${tone} ring-1 ring-inset ring-black/5 hover:-translate-y-0.5`}>
              <span className="flex min-w-0 items-center gap-2">
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate text-[11px] font-bold uppercase tracking-wide">{label}</span>
              </span>
              <span className="text-base font-black tabular-nums">{value}</span>
            </button>
          ))}
        </div>

        <div className="grid gap-3 xl:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-2.5">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500"><MapPin className="h-3.5 w-3.5 text-emerald-600" /> Ahora en el colegio</p>
              <span className="text-[10px] text-slate-400">{SCHOOL_SCHEDULE_SUMMARY.teacherEntries} bloques</span>
            </div>
            {currentStaffSlots.length === 0 ? (
              <p className="rounded-md bg-slate-50 p-2 text-xs text-slate-500">Sin bloques activos de funcionarios en este momento.</p>
            ) : (
              <ul className="tz-thin-scroll tz-stagger-list max-h-32 space-y-1 overflow-y-auto pr-1">
                {currentStaffSlots.map((slot, index) => (
                  <li key={`${slot.staffName}-${slot.startTime}-${index}`} className="flex items-center justify-between gap-2 rounded-md border border-slate-100 px-2 py-1.5 text-xs transition hover:bg-emerald-50/50">
                    <span className="min-w-0">
                      <strong className="block truncate text-slate-900">{slot.staffName}</strong>
                      <span className="block truncate text-slate-500">{slot.activity}{slot.courseHint ? ` · ${slot.courseHint}` : ""}</span>
                    </span>
                    <span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">{slot.startTime}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-2.5">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500"><BookOpen className="h-3.5 w-3.5 text-blue-600" /> Cursos ahora</p>
              <span className="text-[10px] text-slate-400">{SCHOOL_SCHEDULE_SUMMARY.courseEntries} bloques</span>
            </div>
            {currentCourseSlots.length === 0 ? (
              <p className="rounded-md bg-slate-50 p-2 text-xs text-slate-500">Sin cursos activos en este momento.</p>
            ) : (
              <ul className="tz-thin-scroll tz-stagger-list max-h-32 space-y-1 overflow-y-auto pr-1">
                {currentCourseSlots.map((slot, index) => (
                  <li key={`${slot.course}-${slot.startTime}-${index}`} className="flex items-center justify-between gap-2 rounded-md border border-slate-100 px-2 py-1.5 text-xs transition hover:bg-blue-50/50">
                    <span className="min-w-0">
                      <strong className="block truncate text-slate-900">{slot.course}</strong>
                      <span className="block truncate text-slate-500">{slot.activity}</span>
                    </span>
                    <span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">{slot.startTime}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {!calendarIcalUrl && items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-blue-200 bg-blue-50/40 p-3 text-center">
            <CalendarDays className="mx-auto h-5 w-5 text-blue-600" />
            <p className="mt-1 text-sm font-semibold text-slate-900">Conecta tu Google Calendar</p>
            <p className="mt-1 text-xs text-slate-600">Verás tus clases, reuniones, entrevistas y compromisos del día integrados aquí.</p>
            <button onClick={() => onNavigate("today")} className="tz-press mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700">
              Conectar ahora
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-lg bg-slate-50 p-3 text-center">
            <p className="text-sm font-semibold text-slate-700">Sin actividades para hoy</p>
            <p className="mt-1 text-xs text-slate-500">Disfruta un día despejado, o revisa lo pendiente en Hoy.</p>
            <button onClick={() => onNavigate("today")} className="tz-press mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
              Ver resumen del día
            </button>
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-3 py-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Agenda de hoy</p>
              <button onClick={() => onNavigate("today")} className="text-[11px] font-bold text-blue-700 hover:underline">Abrir detalle</button>
            </div>
            <ul className="tz-thin-scroll max-h-64 divide-y divide-slate-100 overflow-y-auto">
              {agendaRows.map((item) => {
                const Icon = item.icon;
                const isPast = !item.allDay && (item.end ? item.end.getTime() : item.start.getTime()) < nowMs;
                const isNext = item.key === nextUp?.key;
                return (
                  <li key={item.key}>
                    <button
                      onClick={() => item.href ? onNavigate(item.href) : onNavigate("today")}
                      className={`grid w-full grid-cols-[76px_minmax(0,1fr)_auto] items-center gap-2 px-3 py-2 text-left transition hover:bg-blue-50/50 ${isPast && !isNext ? "opacity-60" : ""}`}
                    >
                      <span className={`rounded-md px-2 py-1 text-center text-[11px] font-black tabular-nums ${isNext ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                        {agendaTimeLabel(item)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-slate-950">{item.title}</span>
                        <span className="block truncate text-xs text-slate-500">{item.typeLabel}{item.location ? ` · ${item.location}` : ""}</span>
                      </span>
                      <span className={`grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br ${item.color} text-white`}>
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  </li>
                );
              })}
              {items.length > agendaRows.length ? (
                <li>
                  <button onClick={() => onNavigate("today")} className="w-full px-3 py-2 text-center text-xs font-bold text-blue-700 hover:bg-blue-50">
                    Ver {items.length - agendaRows.length} actividades más
                  </button>
                </li>
              ) : null}
            </ul>
          </div>
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
              <button onClick={() => onNavigate("triage")} className="tz-press inline-flex items-center gap-2 rounded-xl border border-cyan-200 bg-white px-4 py-2.5 text-sm font-semibold text-cyan-800 shadow-sm hover:bg-cyan-50">
                <TizaIaIcon className="h-4 w-4" /> Tiza-IA
              </button>
              <button onClick={() => onNavigate("games")} className="tz-press inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-800 shadow-sm hover:bg-emerald-50">
                <Gamepad2 className="h-4 w-4" /> Juegos Vinculares
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

      <section className="tz-card rounded-2xl border border-emerald-100 bg-gradient-to-br from-white via-emerald-50 to-cyan-50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-600 text-white shadow-md">
              <Gamepad2 className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-slate-950">Juegos Vinculares San Lucas</h2>
              <p className="mt-1 text-sm text-slate-600">Actividades socioemocionales listas para abrir en clase o compartir por QR.</p>
            </div>
          </div>
          <button onClick={() => onNavigate("games")} className="tz-press rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">
            Ver juegos
          </button>
        </div>
      </section>

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
            <button onClick={() => onNavigate("triage")} className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Preguntar a Tiza-IA</button>
          </div>
        </section>
      ) : (
        <section className="mt-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-950">Últimos registros</h2>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">{latest.length}</span>
          </div>
          <div className="tz-thin-scroll mt-2 max-h-56 divide-y divide-slate-100 overflow-y-auto pr-1">
            {latest.map(({ entity, record }) => {
              const config = entityConfigs[entity];
              const titleField = config.fields.find((field) => field.required)?.key || config.fields[0].key;
              return (
                <button key={`${entity}-${record.id}`} onClick={() => onNavigate(entity)} className="flex w-full items-center justify-between gap-3 py-2 text-left transition hover:bg-slate-50">
                  <span>
                    <span className="block text-sm font-bold text-slate-950">{record[titleField] || config.singular}</span>
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

function GamesView() {
  const gamesByCategory = games.reduce<Record<string, typeof games>>((acc, game) => {
    acc[game.category] = [...(acc[game.category] || []), game];
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
          <Gamepad2 className="h-3.5 w-3.5" />
          Juegos socioemocionales
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">Juegos Vinculares San Lucas</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Biblioteca de juegos interactivos para abrir desde Tiza Education o compartir en Canva mediante enlace o QR. Hay {games.filter((game) => game.status === "listo").length} juegos listos para usar.
        </p>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-md bg-slate-900 text-white">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-950">Enlaces para Canva o QR</h2>
              <p className="text-sm text-slate-600">Cada tarjeta abre una ruta independiente del juego.</p>
            </div>
          </div>
          <span className="rounded-md bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">{games.length} rutas disponibles</span>
        </div>
      </section>

      <div className="mt-6 space-y-7">
        {Object.entries(gamesByCategory).map(([category, categoryGames]) => (
          <section key={category}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-950">{category}</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{categoryGames.length}</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {categoryGames.map((game) => {
                const Icon = game.icon;
                return (
                  <a
                    key={game.href}
                    href={game.href}
                    className="group flex min-h-[250px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-md bg-slate-900 text-white">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">Listo</span>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold leading-tight tracking-tight text-slate-950">{game.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{game.summary}</p>
                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{game.audience}</span>
                      <ExternalLink className="h-4 w-4 text-slate-400 transition group-hover:text-slate-900" />
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        ))}
      </div>
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
    <section className="tz-card rounded-xl border border-slate-200 bg-white/95 p-2.5 shadow-sm">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <h2 className="flex min-w-0 items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-slate-100 text-slate-600">
            <Icon className="h-3.5 w-3.5" />
          </span>
          <span className="truncate">{title}</span>
          <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white">{count}</span>
        </h2>
        {view ? <button onClick={() => onNavigate(view)} className="shrink-0 text-[11px] font-bold text-blue-600 hover:underline">Ver todo</button> : null}
      </div>
      {children}
    </section>
  );

  const agendaLoad = interviewsToday.length + classesToday.length + calendarEvents.length;
  const operationalAlerts = protocolsDue.length + criticalCases.length + unplannedClasses.length + healthStudents.length;
  const dayProgress = Math.min(100, Math.max(8, Math.round(((today.getHours() * 60 + today.getMinutes()) / (18 * 60)) * 100)));
  const schoolDay = today.toLocaleDateString("es-CL", { weekday: "long" }).toLowerCase();
  const nowMinutes = today.getHours() * 60 + today.getMinutes();
  const toMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };
  const currentStaffSlots = STAFF_SCHEDULE
    .filter((slot) => slot.day === schoolDay && toMinutes(slot.startTime) <= nowMinutes && nowMinutes < toMinutes(slot.endTime))
    .sort((a, b) => a.staffName.localeCompare(b.staffName, "es"))
    .slice(0, 12);
  const currentCourseSlots = COURSE_SCHEDULE
    .filter((slot) => slot.day === schoolDay && toMinutes(slot.startTime) <= nowMinutes && nowMinutes < toMinutes(slot.endTime))
    .sort((a, b) => a.course.localeCompare(b.course, "es"))
    .slice(0, 10);
  const scheduleStatus = currentStaffSlots.length + currentCourseSlots.length;
  const quickStats: Array<[string, number, LucideIcon, ViewId, string]> = [
    ["Entrevistas", interviewsToday.length, MessageSquareText, "interviews", "bg-sky-50 text-sky-700 ring-sky-200"],
    ["Clases", classesToday.length, ClipboardList, "orientation", "bg-violet-50 text-violet-700 ring-violet-200"],
    ["Protocolos", protocolsDue.length, ShieldCheck, "protocols", "bg-amber-50 text-amber-700 ring-amber-200"],
    ["Críticos", criticalCases.length, AlertTriangle, "cases", "bg-rose-50 text-rose-700 ring-rose-200"],
  ];

  return (
    <div className="tz-fade space-y-3">
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-3 p-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="min-w-0">
            <div className="mb-1.5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">
              <CalendarDays className="h-3.5 w-3.5" />
              {today.toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" })}
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">Mi día</h1>
            <p className="mt-0.5 max-w-2xl text-xs text-slate-600">
              {agendaLoad} en agenda · {operationalAlerts} alertas · {scheduleStatus} bloques activos del horario.
            </p>
            <div className="mt-2 h-1.5 max-w-xl overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-500 transition-all duration-700" style={{ width: `${dayProgress}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:w-[440px]">
            {quickStats.map(([label, count, Icon, view, tone]) => (
              <button
                key={label}
                onClick={() => onNavigate(view)}
                className={`tz-press rounded-lg border border-white bg-white/80 px-2.5 py-2 text-left shadow-sm ring-1 ${tone} transition hover:-translate-y-0.5 hover:shadow-md`}
              >
                <div className="mb-0.5 flex items-center justify-between gap-2">
                  <Icon className="h-3.5 w-3.5" />
                  <span className="text-lg font-black tabular-nums">{count}</span>
                </div>
                <p className="truncate text-[11px] font-bold uppercase tracking-wide">{label}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-3 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="tz-card rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h2 className="flex min-w-0 items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-blue-50 text-blue-700"><MapPin className="h-3.5 w-3.5" /></span>
              <span className="truncate">Ahora en el colegio</span>
              <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white">{currentStaffSlots.length}</span>
            </h2>
            <span className="text-[10px] font-semibold text-slate-500">{SCHOOL_SCHEDULE_SUMMARY.teacherEntries} bloques sincronizados</span>
          </div>
          {currentStaffSlots.length === 0 ? (
            <p className="rounded-lg bg-slate-50 p-2 text-xs text-slate-500">No hay bloques docentes activos para esta hora.</p>
          ) : (
            <ul className="tz-thin-scroll tz-stagger-list max-h-52 space-y-1.5 overflow-y-auto pr-1">
              {currentStaffSlots.map((slot, index) => {
                const staff = STAFF_DIRECTORY.find((member) => member.name === slot.staffName);
                return (
                  <li key={`${slot.staffName}-${slot.day}-${slot.startTime}-${index}`} className="rounded-lg border border-slate-200 bg-white p-2 text-xs transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/40">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <strong className="block truncate text-slate-950">{slot.staffName}</strong>
                        <span className="block truncate text-slate-600">{slot.activity}{slot.courseHint ? ` · ${slot.courseHint}` : ""}</span>
                      </div>
                      <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">{slot.startTime}-{slot.endTime}</span>
                    </div>
                    {staff?.email ? <span className="mt-0.5 block truncate text-[10px] text-slate-500">{staff.email}</span> : null}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="tz-card rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h2 className="flex min-w-0 items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-emerald-50 text-emerald-700"><BookOpen className="h-3.5 w-3.5" /></span>
              <span className="truncate">Cursos ahora</span>
              <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white">{currentCourseSlots.length}</span>
            </h2>
            <span className="text-[10px] font-semibold text-slate-500">{SCHOOL_SCHEDULE_SUMMARY.courseEntries} bloques</span>
          </div>
          {currentCourseSlots.length === 0 ? (
            <p className="rounded-lg bg-slate-50 p-2 text-xs text-slate-500">No hay cursos activos para esta hora.</p>
          ) : (
            <ul className="tz-thin-scroll tz-stagger-list max-h-52 space-y-1.5 overflow-y-auto pr-1">
              {currentCourseSlots.map((slot, index) => (
                <li key={`${slot.course}-${slot.day}-${slot.startTime}-${index}`} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white p-2 text-xs transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/40">
                  <div className="min-w-0">
                    <strong className="block truncate text-slate-950">{slot.course}</strong>
                    <span className="block truncate text-slate-600">{slot.activity}</span>
                  </div>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">{slot.startTime}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {calendarIcalUrl ? (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-gradient-to-r from-blue-50 via-sky-50 to-white px-3 py-2">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
              <CalendarDays className="h-4 w-4" /> Google Calendar — hoy
              {calendarLoading ? <span className="h-3 w-3 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" /> : null}
              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">{calendarEvents.length}</span>
            </h2>
            <div className="flex items-center gap-2">
              {calendarFetchedAt ? <span className="text-[10px] text-slate-500">Actualizado {new Date(calendarFetchedAt).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}</span> : null}
              <button onClick={loadCalendar} className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50">Recargar</button>
            </div>
          </div>
          <div className="p-2.5">
            {calendarError ? (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-xs text-rose-700"><strong>Error:</strong> {calendarError}</div>
            ) : calendarEvents.length === 0 ? (
              <p className="rounded-lg bg-slate-50 p-2 text-xs text-slate-500">No hay eventos en tu calendario para hoy.</p>
            ) : (
              <ul className="tz-thin-scroll max-h-72 divide-y divide-slate-100 overflow-y-auto rounded-lg border border-slate-100">
                {calendarEvents.map((ev, i) => (
                  <li key={i} className="grid grid-cols-[82px_minmax(0,1fr)_auto] items-center gap-3 bg-white px-3 py-2.5 transition hover:bg-blue-50/40">
                    <span className="rounded-md bg-blue-50 px-2 py-1 text-center text-[11px] font-black tabular-nums text-blue-700">
                      {ev.allDay ? "Todo el día" : new Date(ev.start).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-slate-950">{ev.summary || "Evento sin título"}</h3>
                      <p className="truncate text-xs text-slate-500">{formatEventTime(ev)}{ev.location ? ` · ${ev.location}` : ""}</p>
                      {ev.description ? <p className="mt-0.5 truncate text-xs text-slate-600">{ev.description}</p> : null}
                    </div>
                    {ev.url ? <a href={ev.url} target="_blank" rel="noopener noreferrer" className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-blue-700 hover:bg-blue-50">Abrir</a> : null}
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
            <p className="rounded-lg bg-slate-50 p-2 text-xs text-slate-500">Sin entrevistas agendadas para hoy.</p>
          ) : (
            <ul className="tz-thin-scroll tz-stagger-list max-h-56 space-y-1.5 overflow-y-auto pr-1">
              {interviewsToday.map((r) => (
                <li key={r.id} className="rounded-lg border border-slate-200 p-2 text-xs transition hover:bg-slate-50">
                  <strong className="block text-slate-950">{r.reason || "Entrevista"}</strong>
                  <span className="text-slate-600">{r.participant || "—"} · {r.student || ""}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Clases de orientación de hoy" icon={ClipboardList} count={classesToday.length} view="orientation">
          {classesToday.length === 0 ? (
            <p className="rounded-lg bg-slate-50 p-2 text-xs text-slate-500">Sin clases programadas para hoy.</p>
          ) : (
            <ul className="tz-thin-scroll tz-stagger-list max-h-56 space-y-1.5 overflow-y-auto pr-1">
              {classesToday.map((r) => (
                <li key={r.id} className="rounded-lg border border-slate-200 p-2 text-xs transition hover:bg-slate-50">
                  <strong className="block text-slate-950">{r.topic}</strong>
                  <span className="text-slate-600">{r.course} · {r.orientationOwner}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Protocolos a vencer (7 días)" icon={ShieldCheck} count={protocolsDue.length} view="protocols">
          {protocolsDue.length === 0 ? (
            <p className="rounded-lg bg-slate-50 p-2 text-xs text-slate-500">No hay protocolos próximos a vencer.</p>
          ) : (
            <ul className="tz-thin-scroll tz-stagger-list max-h-56 space-y-1.5 overflow-y-auto pr-1">
              {protocolsDue.map((r) => (
                <li key={r.id} className="rounded-lg border border-amber-200 bg-amber-50/40 p-2 text-xs transition hover:bg-amber-50">
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
            <p className="rounded-lg bg-slate-50 p-2 text-xs text-slate-500">Todas las clases próximas tienen planificación.</p>
          ) : (
            <ul className="tz-thin-scroll tz-stagger-list max-h-56 space-y-1.5 overflow-y-auto pr-1">
              {unplannedClasses.slice(0, 6).map((r) => (
                <li key={r.id} className="rounded-lg border border-slate-200 p-2 text-xs transition hover:bg-slate-50">
                  <strong className="block text-slate-950">{r.topic || "Clase sin tema"}</strong>
                  <span className="text-slate-600">{r.course} · {r.date}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Estudiantes con alertas de salud" icon={AlertTriangle} count={healthStudents.length} view="students">
          {healthStudents.length === 0 ? (
            <p className="rounded-lg bg-slate-50 p-2 text-xs text-slate-500">Sin alertas activas.</p>
          ) : (
            <ul className="tz-thin-scroll tz-stagger-list max-h-56 space-y-1.5 overflow-y-auto pr-1">
              {healthStudents.map((s) => (
                <li key={s.id}>
                  <button onClick={() => onOpenStudent(s.id)} className="flex w-full items-center gap-2 rounded-lg border border-rose-200 bg-rose-50/40 p-2 text-left text-xs transition hover:-translate-y-0.5 hover:bg-rose-50">
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
            <p className="rounded-lg bg-slate-50 p-2 text-xs text-slate-500">Sin casos críticos abiertos.</p>
          ) : (
            <ul className="tz-thin-scroll tz-stagger-list max-h-56 space-y-1.5 overflow-y-auto pr-1">
              {criticalCases.slice(0, 6).map((r) => (
                <li key={r.id} className="rounded-lg border border-slate-200 p-2 text-xs transition hover:bg-slate-50">
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

function TizaIaMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      className={`relative grid shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-cyan-700 via-cyan-800 to-slate-900 shadow-md ${className}`}
      style={{ width: size, height: size }}
      aria-label="Tiza-IA"
    >
      <svg viewBox="0 0 40 40" width={size * 0.78} height={size * 0.78} fill="none" aria-hidden>
        {/* trazo de tiza punteado */}
        <path d="M7 29 Q 15 14 28 9" stroke="rgba(255,255,255,0.85)" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="1 5" />
        {/* destello al final del trazo */}
        <path d="M31 6 l1 2.4 2.4 1 -2.4 1 -1 2.4 -1-2.4 -2.4-1 2.4-1 z" fill="#A7F3D0" />
        {/* tiza */}
        <g transform="rotate(38 24 16)">
          <rect x="20.5" y="8" width="7" height="16" rx="2.2" fill="#fff" />
          <rect x="20.5" y="8" width="7" height="4.5" rx="2.2" fill="#A7F3D0" />
        </g>
        {/* polvillo de tiza */}
        <circle cx="9" cy="32.5" r="1.1" fill="rgba(255,255,255,0.8)" />
        <circle cx="13.5" cy="34.5" r="0.8" fill="rgba(255,255,255,0.55)" />
        <circle cx="6" cy="35.5" r="0.7" fill="rgba(255,255,255,0.4)" />
      </svg>
      <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
    </div>
  );
}

function TizaIaWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={className}>
      Tiza<span className="text-cyan-700">-IA</span>
    </span>
  );
}

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
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <TizaIaMark size={48} />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              <TizaIaWordmark />
            </h1>
            <p className="mt-1 max-w-3xl text-sm text-slate-600">
              La inteligencia artificial de Tiza Education. Pregunta lo que quieras, pega correos o tablas,
              o adjunta archivos — responde con datos reales del colegio y propone registros listos para confirmar.
            </p>
          </div>
        </div>
      </div>

      <AIChatMode store={store} accessToken={accessToken} onAddRecord={onAddRecord} onOpenStudent={onOpenStudent} onUpdateCourse={onUpdateCourse} />
    </div>
  );
}

function FloatingTizaIA({
  open,
  store,
  accessToken,
  onOpenChange,
  onAddRecord,
  onOpenStudent,
  onUpdateCourse,
}: {
  open: boolean;
  store: DataStore;
  accessToken: string;
  onOpenChange: (open: boolean) => void;
  onAddRecord: (entity: EntityId, record: DataRecord) => void;
  onOpenStudent: (studentId: string) => void;
  onUpdateCourse: (courseName: string, updates: Record<string, string>) => void;
}) {
  return (
    <>
      <div className={`fixed bottom-24 right-4 z-[65] flex flex-col items-end gap-2 transition lg:bottom-6 lg:right-6 ${open ? "pointer-events-none opacity-0" : "opacity-100"}`}>
        <span className="hidden rounded-full border border-slate-200 bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700 shadow-lg backdrop-blur sm:inline-flex">
          Tiza-IA
        </span>
        <button
          type="button"
          onClick={() => onOpenChange(true)}
          className="tz-press grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-cyan-700 via-slate-900 to-slate-950 text-white shadow-2xl shadow-slate-950/25 ring-1 ring-white/20 transition hover:-translate-y-0.5"
          title="Abrir Tiza-IA"
          aria-label="Abrir Tiza-IA"
        >
          <TizaIaMark size={40} />
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[80]">
          <button
            type="button"
            aria-label="Cerrar Tiza-IA"
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-[2px]"
            onClick={() => onOpenChange(false)}
          />
          <section className="absolute inset-x-2 bottom-[calc(76px+env(safe-area-inset-bottom))] top-10 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:inset-x-4 lg:inset-y-5 lg:left-auto lg:right-5 lg:w-[min(920px,calc(100vw-330px))]">
            <header className="relative shrink-0 overflow-hidden border-b border-slate-200 bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900 px-4 py-3 text-white">
              <div className="pointer-events-none absolute inset-3 rounded-xl border border-dashed border-white/10" />
              <div className="relative flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <TizaIaMark size={40} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    <TizaIaWordmark />
                  </p>
                  <p className="truncate text-xs text-cyan-100/85">Pega screenshots, arrastra archivos o sube planillas para importar con revisión.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="tz-press grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/15 bg-white/10 text-white hover:bg-white/20"
                title="Cerrar"
                aria-label="Cerrar Tiza-IA"
              >
                <X className="h-4 w-4" />
              </button>
              </div>
            </header>
            <div className="min-h-0 flex-1 overflow-hidden bg-slate-50 p-2 sm:p-3">
              <AIChatMode
                store={store}
                accessToken={accessToken}
                onAddRecord={onAddRecord}
                onOpenStudent={onOpenStudent}
                onUpdateCourse={onUpdateCourse}
                compact
              />
            </div>
          </section>
        </div>
      ) : null}
    </>
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

type ChatConversation = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  turns: ChatTurn[];
};

const AI_CHAT_CONVERSATIONS_KEY = "tiza-ia-conversations-v1";
const AI_MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const formatFileSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(bytes >= 1024 * 1024 ? 1 : 2)} MB`;

const makeChatConversation = (): ChatConversation => {
  const now = nowIso();
  return { id: uid(), title: "Nueva conversación", createdAt: now, updatedAt: now, turns: [] };
};

const chatTitleFromMessage = (message: string, files: string[]) => {
  const clean = message.replace(/\s+/g, " ").trim();
  if (clean) return clean.length > 42 ? `${clean.slice(0, 42)}...` : clean;
  if (files.length) return files.length === 1 ? `Archivo: ${files[0]}` : `${files.length} archivos adjuntos`;
  return "Nueva conversación";
};

const loadChatConversations = (): ChatConversation[] => {
  if (typeof window === "undefined") return [makeChatConversation()];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(AI_CHAT_CONVERSATIONS_KEY) || "[]");
    if (!Array.isArray(parsed)) return [makeChatConversation()];
    const conversations = parsed
      .filter((item) => item && typeof item.id === "string")
      .map((item) => ({
        id: item.id,
        title: typeof item.title === "string" && item.title.trim() ? item.title : "Conversación",
        createdAt: typeof item.createdAt === "string" ? item.createdAt : nowIso(),
        updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : nowIso(),
        turns: Array.isArray(item.turns) ? item.turns : [],
      }));
    return conversations.length ? conversations : [makeChatConversation()];
  } catch {
    return [makeChatConversation()];
  }
};

function AIChatMode({
  store,
  accessToken,
  onAddRecord,
  onOpenStudent,
  onUpdateCourse,
  compact = false,
}: {
  store: DataStore;
  accessToken: string;
  onAddRecord: (entity: EntityId, record: DataRecord) => void;
  onOpenStudent: (studentId: string) => void;
  onUpdateCourse: (courseName: string, updates: Record<string, string>) => void;
  compact?: boolean;
}) {
  const [draft, setDraft] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [pasteNotice, setPasteNotice] = useState("");
  const [conversations, setConversations] = useState<ChatConversation[]>(loadChatConversations);
  const [activeConversationId, setActiveConversationId] = useState(() => conversations[0]?.id || "");
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const recordChunksRef = React.useRef<Blob[]>([]);
  const recordTimerRef = React.useRef<number | null>(null);
  const activeConversation = conversations.find((conversation) => conversation.id === activeConversationId) || conversations[0];
  const turns = activeConversation?.turns || [];

  const setTurns = (updater: (current: ChatTurn[]) => ChatTurn[]) => {
    setConversations((current) => {
      const targetId = activeConversationId || current[0]?.id;
      return current.map((conversation) => {
        if (conversation.id !== targetId) return conversation;
        const nextTurns = updater(conversation.turns || []);
        return { ...conversation, turns: nextTurns, updatedAt: nowIso() };
      });
    });
  };

  const startNewConversation = () => {
    const conversation = makeChatConversation();
    setConversations((current) => [conversation, ...current]);
    setActiveConversationId(conversation.id);
    setDraft("");
    setFiles([]);
  };

  const deleteConversation = (conversationId: string) => {
    const remaining = conversations.filter((conversation) => conversation.id !== conversationId);
    const next = remaining.length ? remaining : [makeChatConversation()];
    setConversations(next);
    if (conversationId === activeConversationId) setActiveConversationId(next[0].id);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [turns]);

  useEffect(() => {
    try {
      window.localStorage.setItem(AI_CHAT_CONVERSATIONS_KEY, JSON.stringify(conversations.slice(0, 40)));
    } catch {
      // ignore local persistence errors
    }
  }, [conversations]);

  useEffect(() => {
    if (!pasteNotice) return;
    const timer = window.setTimeout(() => setPasteNotice(""), 2600);
    return () => window.clearTimeout(timer);
  }, [pasteNotice]);

  const addFiles = (incoming: FileList | File[]) => {
    const incomingFiles = Array.from(incoming).filter((file) => file.size > 0);
    const oversized = incomingFiles.filter((file) => file.size > AI_MAX_UPLOAD_BYTES);
    if (oversized.length) {
      const names = oversized.slice(0, 2).map((file) => `${file.name} (${formatFileSize(file.size)})`).join(", ");
      setPasteNotice(`${names} supera el máximo de 4 MB. Divide el archivo, quita imágenes pesadas o exporta una versión liviana antes de subirlo.`);
    }
    const accepted = incomingFiles.filter((file) => file.size <= AI_MAX_UPLOAD_BYTES);
    if (!accepted.length) return;
    setFiles((current) => {
      const total = current.reduce((sum, file) => sum + file.size, 0);
      const nextFiles: File[] = [];
      let nextTotal = total;
      accepted.forEach((file) => {
        if (nextTotal + file.size <= AI_MAX_UPLOAD_BYTES) {
          nextFiles.push(file);
          nextTotal += file.size;
        }
      });
      if (nextFiles.length < accepted.length) {
        setPasteNotice(`El envío completo no puede superar 4 MB. Se adjuntaron ${nextFiles.length} archivo${nextFiles.length === 1 ? "" : "s"}.`);
      }
      const next = [...current, ...nextFiles].slice(0, 10);
      if (current.length + nextFiles.length > 10) setPasteNotice("Se adjuntaron los primeros 10 archivos.");
      return next;
    });
  };
  const removeFile = (i: number) => setFiles((c) => c.filter((_, idx) => idx !== i));

  const fileExtensionFromMime = (mime: string) => {
    if (mime.includes("jpeg")) return "jpg";
    if (mime.includes("png")) return "png";
    if (mime.includes("webp")) return "webp";
    if (mime.includes("gif")) return "gif";
    if (mime.includes("pdf")) return "pdf";
    return "archivo";
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = Array.from(event.clipboardData.items || []);
    const pastedFiles = items
      .filter((item) => item.kind === "file")
      .map((item, index) => {
        const file = item.getAsFile();
        if (!file) return null;
        const hasName = file.name && file.name.trim();
        const ext = fileExtensionFromMime(file.type || "image/png");
        const stamp = new Date().toISOString().replace(/[:.]/g, "-");
        const name = hasName ? file.name : `screenshot-${stamp}-${index + 1}.${ext}`;
        return new File([file], name, { type: file.type || "application/octet-stream", lastModified: Date.now() });
      })
      .filter((file): file is File => Boolean(file));
    if (!pastedFiles.length) return;
    addFiles(pastedFiles);
    setPasteNotice(pastedFiles.length === 1 ? `${pastedFiles[0].name} adjuntado desde el portapapeles.` : `${pastedFiles.length} archivos adjuntados desde el portapapeles.`);
    event.preventDefault();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : (MediaRecorder.isTypeSupported("audio/mp4") ? "audio/mp4" : "");
      const recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      recordChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) recordChunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blobType = recorder.mimeType || "audio/webm";
        const blob = new Blob(recordChunksRef.current, { type: blobType });
        if (blob.size > 1000) {
          const ext = blobType.includes("mp4") ? "m4a" : "webm";
          const stamp = new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).replace(/:/g, "");
          const audioFile = new File([blob], `audio-${stamp}.${ext}`, { type: blobType });
          setFiles((current) => [...current, audioFile].slice(0, 6));
        }
        recordChunksRef.current = [];
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      setRecordSeconds(0);
      recordTimerRef.current = window.setInterval(() => setRecordSeconds((s) => s + 1), 1000);
    } catch (err) {
      console.warn("Mic access failed", err);
      window.alert("No se pudo acceder al micrófono. Revisa los permisos del navegador.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    setRecording(false);
    if (recordTimerRef.current) {
      window.clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
  };

  useEffect(() => () => {
    // Cleanup if the component unmounts mid-recording.
    mediaRecorderRef.current?.stop();
    if (recordTimerRef.current) window.clearInterval(recordTimerRef.current);
  }, []);

  const send = async () => {
    if (!draft.trim() && files.length === 0) return;
    const turnId = uid();
    const userFiles = files.map((f) => f.name);
    const userMessage = draft.trim();
    const submittingFiles = files;
    const submittingSize = submittingFiles.reduce((sum, file) => sum + file.size, 0);
    if (submittingSize > AI_MAX_UPLOAD_BYTES) {
      setPasteNotice(`El envío pesa ${formatFileSize(submittingSize)}. Máximo 4 MB por consulta.`);
      return;
    }
    setConversations((current) => current.map((conversation) => {
      if (conversation.id !== activeConversationId) return conversation;
      const hadTurns = (conversation.turns || []).length > 0;
      return {
        ...conversation,
        title: hadTurns ? conversation.title : chatTitleFromMessage(userMessage, userFiles),
        updatedAt: nowIso(),
        turns: [...(conversation.turns || []), { id: turnId, userMessage, userFiles, loading: true, accepted: {} }],
      };
    }));
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
      const responseText = await res.text();
      let data: { ok?: boolean; error?: unknown; result?: ChatResult } = {};
      try { data = responseText ? JSON.parse(responseText) : {}; } catch {
        if (res.status === 504) {
          throw new Error("Tiza-IA tardó demasiado en responder. El archivo puede ser simple, pero el modelo no alcanzó a procesarlo a tiempo. Intenta reenviarlo; ahora se usarán modelos rápidos primero.");
        }
        throw new Error(`La respuesta del servidor no fue válida (${res.status}). ${responseText.slice(0, 180)}`);
      }
      if (!res.ok || !data.ok) {
        const errField = data.error;
        const msg = typeof errField === "string"
          ? errField
          : (errField && typeof errField === "object" ? ((errField as { message?: string }).message || JSON.stringify(errField)) : (
            res.status === 504 ? "Tiza-IA tardó demasiado en responder. Intenta reenviar el archivo; ahora se priorizan modelos rápidos." : `Error ${res.status}`
          ));
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
      const rawMessage = err instanceof Error ? err.message : String(err);
      const message = rawMessage === "Failed to fetch"
        ? "No se pudo completar la conexión con Tiza-IA. Puede ser un corte temporal de la función o del modelo. Intenta reenviar el archivo; si se repite, pega el texto principal en el chat."
        : rawMessage;
      setTurns((current) => current.map((t) => t.id === turnId ? { ...t, loading: false, error: message } : t));
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
    <div
      onDragEnter={handleDrag}
      className={`tz-ai-chat relative flex overflow-hidden rounded-2xl border border-slate-200 bg-white ${
        compact ? "h-full min-h-0" : "h-[calc(100dvh-330px)] min-h-[420px] lg:h-[calc(100vh-260px)] lg:min-h-[480px]"
      }`}
    >
      {/* Drag overlay */}
      {isDragActive && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-2xl bg-cyan-950/40 p-6 text-white backdrop-blur-[2px] transition-all duration-300"
        >
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-cyan-400 bg-slate-900/95 p-8 text-center shadow-2xl max-w-sm mx-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-cyan-950 text-cyan-400 shadow-inner mb-4 animate-bounce">
              <Upload className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Adjuntar archivos a Tiza-IA</h3>
            <p className="mt-2 text-xs text-cyan-200/80 leading-relaxed">
              Suelta tus archivos (.pdf, .doc, .xlsx, imágenes o audios) para cargarlos en el chat.
            </p>
          </div>
        </div>
      )}
      <aside className="hidden w-72 shrink-0 flex-col border-r border-slate-200 bg-slate-50/80 lg:flex">
        <div className="border-b border-slate-200 p-3">
          <button
            onClick={startNewConversation}
            className="tz-press inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" /> Nueva conversación
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {[...conversations].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).map((conversation) => {
            const active = conversation.id === activeConversationId;
            const lastTurn = conversation.turns[conversation.turns.length - 1];
            return (
              <div key={conversation.id} className="group relative">
                <button
                  onClick={() => setActiveConversationId(conversation.id)}
                  className={`mb-1 w-full rounded-lg px-3 py-2.5 pr-9 text-left transition ${active ? "bg-white text-slate-950 shadow-sm ring-1 ring-slate-200" : "text-slate-600 hover:bg-white hover:text-slate-950"}`}
                >
                  <span className="block truncate text-sm font-semibold">{conversation.title}</span>
                  <span className="mt-0.5 block truncate text-[11px] text-slate-400">
                    {lastTurn?.userMessage || (lastTurn?.userFiles?.length ? lastTurn.userFiles.join(", ") : "Sin mensajes")}
                  </span>
                </button>
                <button
                  onClick={() => deleteConversation(conversation.id)}
                  title="Eliminar conversación"
                  className="absolute right-2 top-2.5 grid h-7 w-7 place-items-center rounded-md text-slate-300 opacity-0 transition hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50/80 p-2 lg:hidden">
          <select
            value={activeConversationId}
            onChange={(event) => setActiveConversationId(event.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-cyan-700"
          >
            {[...conversations].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).map((conversation) => (
              <option key={conversation.id} value={conversation.id}>{conversation.title}</option>
            ))}
          </select>
          <button
            onClick={startNewConversation}
            title="Nueva conversación"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-900 text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        {turns.length === 0 ? (
          <div className="mx-auto max-w-2xl">
            {/* Pizarra de bienvenida */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-900 via-cyan-950 to-slate-950 p-6 text-center shadow-lg sm:p-8">
              {/* marco de pizarra dibujado con tiza */}
              <div className="pointer-events-none absolute inset-3 rounded-xl border-2 border-dashed border-white/15" />
              {/* polvillo decorativo */}
              <div className="pointer-events-none absolute bottom-3 left-6 h-1.5 w-1.5 rounded-full bg-white/30" />
              <div className="pointer-events-none absolute bottom-5 left-10 h-1 w-1 rounded-full bg-white/20" />
              <div className="pointer-events-none absolute right-8 top-6 h-1 w-1 rounded-full bg-white/20" />

              <TizaIaMark size={64} className="mx-auto ring-2 ring-white/20" />
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                ¡Hola! Soy <span className="text-emerald-200">Tiza-IA</span>
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-cyan-100/90">
                La tiza inteligente del Colegio San Lucas. Conozco los datos del colegio
                y te ayudo a registrar, buscar y entender lo que pasa con tus estudiantes.
              </p>
            </div>

            <p className="mt-5 mb-2 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">Prueba con algo así</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                "Pega el correo de la profesora jefe de 4°B sobre el conflicto en el recreo",
                "Sube el PDF del informe psicopedagógico de María Pérez",
                "Pega la planilla de talleres realizados este mes",
                "¿Cuántos casos abiertos de convivencia hay en III° Medio?",
              ].map((s) => (
                <button key={s} onClick={() => setDraft(s)} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-left text-sm text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50">
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
                  <div className="max-w-[85%] rounded-2xl rounded-tr-md border border-cyan-200 bg-cyan-50 px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm">
                    {turn.userMessage ? <p className="whitespace-pre-wrap">{turn.userMessage}</p> : <p className="italic opacity-90">(sin texto)</p>}
                    {turn.userFiles.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {turn.userFiles.map((n, i) => <span key={i} className="rounded-md border border-cyan-200 bg-white/80 px-2 py-0.5 text-[11px] font-semibold text-cyan-800">📎 {n}</span>)}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-start justify-start gap-2.5">
                  <TizaIaMark size={30} className="mt-0.5" />
                  <div className="max-w-[88%] rounded-2xl rounded-tl-md border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
                    {turn.loading ? (
                      <div className="flex items-center gap-2 text-slate-500">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-700 border-t-transparent" />
                        Tiza-IA está escribiendo…
                      </div>
                    ) : turn.error ? (
                      <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-rose-800">
                        <p><strong>Error:</strong> {turn.error}</p>
                      </div>
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
          <div className="mb-2 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-slate-500">
            {["Excel", "CSV", "PDF", "Word", "TXT/JSON", "imagenes", "screenshots", "audio"].map((label) => (
              <span key={label} className="rounded-full border border-slate-200 bg-white px-2 py-1">{label}</span>
            ))}
          </div>
          {pasteNotice ? (
            <div className="mb-2 rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs font-semibold text-cyan-800">
              {pasteNotice}
            </div>
          ) : null}
          {files.length > 0 ? (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {files.map((f, i) => (
                <span key={i} className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs">
                  📎 {f.name} <button onClick={() => removeFile(i)} className="text-slate-400 hover:text-rose-600"><X className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
          ) : null}
          <div className={`flex items-end gap-2 rounded-2xl border bg-white p-2 shadow-sm transition focus-within:border-cyan-700 ${recording ? "border-rose-400 ring-2 ring-rose-200" : "border-slate-300"}`}>
            <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.xlsm,.csv,.tsv,.txt,.md,.markdown,.json,.html,.htm,image/*,audio/*" className="hidden" onChange={(e) => e.target.files && addFiles(e.target.files)} />
            <button onClick={() => fileInputRef.current?.click()} title="Adjuntar" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-slate-100">
              <Upload className="h-4 w-4" />
            </button>
            <button
              onClick={recording ? stopRecording : startRecording}
              title={recording ? "Detener grabación" : "Grabar mensaje de voz"}
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg transition ${recording ? "bg-rose-600 text-white tz-pulse" : "text-slate-500 hover:bg-slate-100"}`}
            >
              {recording ? (
                <span className="block h-3 w-3 rounded-sm bg-white" />
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                  <line x1="12" x2="12" y1="18" y2="22" />
                </svg>
              )}
            </button>
            {recording ? (
              <span className="self-center text-xs font-semibold text-rose-600 tabular-nums">
                ● {Math.floor(recordSeconds / 60)}:{String(recordSeconds % 60).padStart(2, "0")}
              </span>
            ) : null}
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onPaste={handlePaste}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder={recording ? "Grabando audio… detén la grabación para adjuntarlo." : "Escribe, pega un correo o usa Ctrl+V para adjuntar un screenshot."}
              rows={2}
              className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-slate-400"
            />
            <button onClick={send} disabled={(!draft.trim() && files.length === 0) || recording} className="tz-press inline-flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-br from-cyan-700 to-cyan-900 px-3 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-50">
              <TizaIaIcon className="h-4 w-4" /> Enviar
            </button>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-400">Enter para enviar · Shift+Enter para salto de línea · Ctrl+V adjunta screenshots copiados · Arrastra archivos sobre el chat.</p>
        </div>
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
  const [viewHistory, setViewHistory] = useState<ViewId[]>(() => {
    if (typeof window === "undefined") return ["dashboard"];
    const view = new URLSearchParams(window.location.search).get("view");
    return view === "games" ? ["games"] : ["dashboard"];
  });
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
  const [floatingAiOpen, setFloatingAiOpen] = useState(false);
  const [navOrder, setNavOrder] = useState<ViewId[]>(loadNavOrder);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarFetchedAt, setCalendarFetchedAt] = useState<string>("");
  const orderedNavItems = useMemo(() => orderViewNav(navOrder), [navOrder]);

  const moveNavItem = (view: ViewId, direction: -1 | 1) => {
    setNavOrder((current) => {
      const next = orderViewNav(current).map((item) => item.id);
      const index = next.indexOf(view);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= next.length) return next;
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next;
    });
  };

  const resetNavOrder = () => setNavOrder(defaultNavOrder);

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
  const [pieImportData, setPieImportData] = useState<any[] | null>(null);
  const [toast, setToast] = useState("");
  const [remoteLoaded, setRemoteLoaded] = useState(!isSupabaseAuthConfigured);
  const [remoteStatus, setRemoteStatus] = useState<"local" | "loading" | "synced" | "saving" | "error">(
    isSupabaseAuthConfigured ? "loading" : "local",
  );
  const [remoteError, setRemoteError] = useState("");
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [teamSeeding, setTeamSeeding] = useState(false);
  const [teamSeedNotice, setTeamSeedNotice] = useState("");
  const [profileState, setProfileState] = useState<Record<string, string>>(() => {
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
  const profile = profileState;
  const accessTokenRef = React.useRef("");
  const [profileSyncStatus, setProfileSyncStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const storeRef = React.useRef(store);
  // Wrap setProfile so every update is persisted server-side to the user's
  // Supabase metadata (global per user → travels across devices).
  const setProfile = (next: Record<string, string>) => {
    setProfileState(next);
    if (!accessTokenRef.current) return; // not authenticated yet; localStorage caches it
    setProfileSyncStatus("saving");
    fetch("/api/profile", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${accessTokenRef.current}`,
      },
      body: JSON.stringify({ profile: next }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) throw new Error(data?.error || `Error ${res.status}`);
        setProfileSyncStatus("saved");
        window.setTimeout(() => setProfileSyncStatus((s) => (s === "saved" ? "idle" : s)), 2000);
      })
      .catch((err) => {
        console.warn("Profile sync to Supabase failed", err);
        setProfileSyncStatus("error");
        setToast(`No se pudo sincronizar el perfil: ${err instanceof Error ? err.message : String(err)}`);
      });
  };

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

  // Keep accessTokenRef synced with the latest token so the profile sync helper
  // can use it without depending on stale closures.
  useEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);

  // Restore profile (including calendarIcalUrl) from server-stored
  // user_metadata so settings travel across browsers and devices. Pulls
  // fresh on every login.
  const profileRestoredRef = React.useRef(false);
  useEffect(() => {
    if (!authUser || !accessToken || profileRestoredRef.current) return;
    profileRestoredRef.current = true;
    (async () => {
      try {
        const res = await fetch("/api/profile", {
          headers: { authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.ok && data.profile && Object.keys(data.profile).length > 0) {
          setProfileState((current) => ({ ...current, ...data.profile }));
        }
      } catch (err) {
        console.warn("Profile load from Supabase failed", err);
      }
    })();
  }, [authUser, accessToken]);

  useEffect(() => {
    if (!authUser || !accessToken) {
      return;
    }

    let cancelled = false;
    const loadRemoteStore = async () => {
      setRemoteStatus("loading");
      setRemoteError("");
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
          setRemoteError(error instanceof Error ? error.message : "No se pudo sincronizar con Supabase.");
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
    storeRef.current = store;
  }, [store]);

  useEffect(() => {
    window.localStorage.setItem(NAV_ORDER_KEY, JSON.stringify(navOrder));
  }, [navOrder]);

  const saveStoreSnapshot = React.useCallback(async (nextStore: DataStore, successStatus: "synced" | "saving" = "synced") => {
    if (!authUser || !accessToken || !remoteLoaded) return;
    setRemoteStatus("saving");
    setRemoteError("");
    try {
      const response = await fetch("/api/records", {
        method: "PUT",
        headers: {
          authorization: `Bearer ${accessToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ store: nextStore }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "No se pudieron guardar los datos remotos.");
      }
      setRemoteStatus(successStatus);
    } catch (error) {
      console.warn("Remote records save failed; local backup remains active", error);
      setRemoteStatus("error");
      setRemoteError(error instanceof Error ? error.message : "No se pudieron guardar los datos remotos.");
    }
  }, [authUser, accessToken, remoteLoaded]);

  useEffect(() => {
    if (!authUser || !accessToken || !remoteLoaded) return;

    const timer = window.setTimeout(async () => {
      await saveStoreSnapshot(store);
    }, 700);

    return () => window.clearTimeout(timer);
  }, [store, authUser, accessToken, remoteLoaded, saveStoreSnapshot]);

  useEffect(() => {
    if (remoteStatus !== "error" || !authUser || !accessToken || !remoteLoaded) return;
    const timer = window.setTimeout(async () => {
      await saveStoreSnapshot(storeRef.current);
    }, 6000);
    return () => window.clearTimeout(timer);
  }, [remoteStatus, authUser, accessToken, remoteLoaded, saveStoreSnapshot]);

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
    const nextStore = { ...storeRef.current, [entity]: [record, ...storeRef.current[entity]] };
    storeRef.current = nextStore;
    setStore(nextStore);
    void saveStoreSnapshot(nextStore);
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

  // Auto-load the Official PIE 2026 roster once, after the remote store loads,
  // if there are no PIE-tagged students yet. A localStorage flag makes this a
  // one-time action so the user can later remove entries without them coming
  // back on the next visit.
  const autoSeededPieRef = React.useRef(false);
  useEffect(() => {
    if (!remoteLoaded || autoSeededPieRef.current) return;
    autoSeededPieRef.current = true;
    try {
      if (window.localStorage.getItem("tiza-pie-seeded-v1")) return;
    } catch {
      // ignore
    }
    const hasPie = store.students.some((s) =>
      (s.tags || "").split(",").some((t) => t.trim().toUpperCase() === "PIE"),
    );
    if (!hasPie) {
      seedPieRoster(true);
    }
    try {
      window.localStorage.setItem("tiza-pie-seeded-v1", "1");
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remoteLoaded]);

  const syncOrientationFirstCycle = (silent = false) => {
    let created = 0;
    setStore((current) => {
      const existing = new Set(current.orientation.map((record) =>
        normalize([record.date, record.course, record.topic, record.axis, record.source].filter(Boolean).join("|")),
      ));
      const missing = ORIENTATION_FIRST_CYCLE_CLASSES
        .filter((record) => {
          const key = normalize([record.date, record.course, record.topic, record.axis, record.source].filter(Boolean).join("|"));
          return !existing.has(key);
        })
        .map((record) => ({ ...record }));
      created = missing.length;
      if (missing.length === 0) return current;
      return { ...current, orientation: [...missing, ...current.orientation] };
    });
    if (!silent) setToast(`Clases de orientación sincronizadas: ${created} nuevas.`);
  };

  const syncOrientationAnnualPlan = (silent = false) => {
    const firstCycleOwner = orientationOwners[0];
    const firstCycleCourses = firstCycleOwner.courses;
    const todayIso = new Date().toISOString().slice(0, 10);
    const nationalHolidays2026 = new Set([
      "2026-01-01",
      "2026-04-03",
      "2026-04-04",
      "2026-05-01",
      "2026-05-21",
      "2026-06-20",
      "2026-06-29",
      "2026-07-16",
      "2026-08-15",
      "2026-09-18",
      "2026-09-19",
      "2026-10-12",
      "2026-10-31",
      "2026-11-01",
      "2026-12-08",
      "2026-12-25",
    ]);
    const schoolBreaks2026 = [
      { start: "2026-06-22", end: "2026-07-03", label: "Vacaciones de invierno" },
      { start: "2026-09-14", end: "2026-09-18", label: "Receso Fiestas Patrias" },
    ];
    const parseWeekRange = (week: string) => {
      const match = week.match(/(\d{2})\/(\d{2})\s+al\s+(\d{2})\/(\d{2})/);
      if (!match) return null;
      const [, startDay, startMonth, endDay, endMonth] = match;
      return {
        start: `2026-${startMonth}-${startDay}`,
        end: `2026-${endMonth}-${endDay}`,
      };
    };
    const dateFromIso = (iso: string) => {
      const [year, month, day] = iso.split("-").map(Number);
      return new Date(year, month - 1, day);
    };
    const toIso = (date: Date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    };
    const addDays = (iso: string, days: number) => {
      const date = dateFromIso(iso);
      date.setDate(date.getDate() + days);
      return toIso(date);
    };
    const breakForDate = (iso: string) => schoolBreaks2026.find((range) => iso >= range.start && iso <= range.end);
    const isBlocked = (iso: string) => {
      const day = dateFromIso(iso).getDay();
      return day === 0 || day === 6 || nationalHolidays2026.has(iso) || Boolean(breakForDate(iso));
    };
    const preferredWeekdayByCourse = new Map<string, number>();
    firstCycleCourses.forEach((course) => {
      const counts = new Map<number, number>();
      ORIENTATION_FIRST_CYCLE_CLASSES
        .filter((record) => normalize(record.course) === normalize(course) && record.date)
        .forEach((record) => {
          const weekday = dateFromIso(record.date).getDay();
          if (weekday >= 1 && weekday <= 5) counts.set(weekday, (counts.get(weekday) || 0) + 1);
        });
      const preferred = Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || 1;
      preferredWeekdayByCourse.set(course, preferred);
    });
    const pickDateInWeek = (range: { start: string; end: string }, preferredWeekday: number) => {
      const days: string[] = [];
      for (let iso = range.start; iso <= range.end; iso = addDays(iso, 1)) days.push(iso);
      const ordered = [
        ...days.filter((iso) => dateFromIso(iso).getDay() === preferredWeekday),
        ...days.filter((iso) => dateFromIso(iso).getDay() !== preferredWeekday),
      ];
      return ordered.find((iso) => !isBlocked(iso)) || "";
    };

    let created = 0;
    setStore((current) => {
      const existingCourseWeeks = new Set(current.orientation.map((record) =>
        normalize([record.course, record.week].filter(Boolean).join("|")),
      ));
      const additions: DataRecord[] = [];

      ORIENTATION_FIRST_CYCLE_CONFIG.forEach((config) => {
        const range = parseWeekRange(config.week);
        if (!range || range.end < todayIso) return;
        if (breakForDate(range.start) && breakForDate(range.end)) return;

        firstCycleCourses.forEach((course) => {
          const key = normalize([course, config.week].join("|"));
          if (existingCourseWeeks.has(key)) return;
          const date = pickDateInWeek(range, preferredWeekdayByCourse.get(course) || 1);
          if (!date) return;
          const shifted = dateFromIso(date).getDay() !== (preferredWeekdayByCourse.get(course) || 1);
          additions.push({
            id: `orientation-plan-2026-${normalize(`${course}-${config.week}`).replace(/\s+/g, "-")}`,
            createdAt: nowIso(),
            updatedAt: nowIso(),
            date,
            week: config.week,
            course,
            orientationOwner: firstCycleOwner.name,
            orientationEmail: firstCycleOwner.email,
            topic: config.session || "Clase por definir",
            axis: config.action || "Por definir",
            status: "Planificada",
            canvaLink: "",
            evidence: "",
            planificacion: "",
            folderLink: "",
            notes: shifted ? "Fecha ajustada por feriado o receso escolar configurable." : "",
            source: "Plan anual orientación 2026",
            sourceSheet: "Plan generado desde semanas del Excel",
          });
          existingCourseWeeks.add(key);
        });
      });

      created = additions.length;
      if (additions.length === 0) return current;
      return { ...current, orientation: [...additions, ...current.orientation] };
    });
    if (!silent) setToast(`Plan anual de orientación completado: ${created} clases nuevas.`);
  };

  const autoSeededOrientationRef = React.useRef(false);
  useEffect(() => {
    if (!remoteLoaded || autoSeededOrientationRef.current) return;
    autoSeededOrientationRef.current = true;
    syncOrientationFirstCycle(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remoteLoaded]);

  const autoSeededOrientationPlanRef = React.useRef(false);
  useEffect(() => {
    if (!remoteLoaded || autoSeededOrientationPlanRef.current) return;
    autoSeededOrientationPlanRef.current = true;
    try {
      if (window.localStorage.getItem("tiza-orientation-annual-plan-v1")) return;
    } catch {
      // ignore
    }
    syncOrientationAnnualPlan(true);
    try {
      window.localStorage.setItem("tiza-orientation-annual-plan-v1", "1");
    } catch {
      // ignore
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

  const importPieExcel = (workbook: XLSX.WorkBook) => {
    try {
      const sheetsToParse = [
        { name: "Cupos PIE", label: "Cupos" },
        { name: "Sobrecupos ", label: "Sobrecupos" },
        { name: "PENDIENTES- SC", label: "Pendientes" }
      ];

      const students: any[] = [];

      sheetsToParse.forEach(({ name: sheetName, label }) => {
        const sheet = workbook.Sheets[sheetName];
        if (!sheet) return;
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
        if (!rows || rows.length === 0) return;

        // Normalization map for course codes
        const normalizeCourseName = (courseCode: string): string => {
          const code = (courseCode || "").trim().toUpperCase();
          if (!code) return "Sin curso";
          
          if (code.startsWith("1PK")) {
            const sec = code.slice(3);
            return `Prekínder ${sec}`;
          }
          if (code.startsWith("1K")) {
            const sec = code.slice(2);
            return `Kínder ${sec}`;
          }
          const basMatch = code.match(/^(\d)EB([A-Z])$/);
          if (basMatch) {
            const grade = basMatch[1];
            const sec = basMatch[2];
            return `${grade}° Básico ${sec}`;
          }
          if (code === "IEMA") return "I° Medio A";
          if (code === "IEMB") return "I° Medio B";
          if (code === "IIEMA") return "II° Medio A";
          if (code === "IIEMB") return "II° Medio B";
          if (code === "IIIEMA") return "III° Medio A";
          if (code === "IIITPB" || code === "IIITP") return "III° Medio B";
          if (code === "IVEMA") return "IV° Medio A";
          if (code === "IVTPB" || code === "IVTP") return "IV° Medio B";
          
          return courseCode;
        };

        rows.forEach((row, idx) => {
          if (idx === 0 || !row || row.length < 8) return;
          const sName = row[6];
          const sRut = row[4];
          const sCourse = row[2];
          const sDiag = row[9];
          const sSit = row[10];
          const sProf = row[8];

          if (typeof sName === "string" && sName.trim() && sName !== "NOMBRE" && sName !== "NOMBRE ") {
            students.push({
              name: sName.trim(),
              rut: typeof sRut === "string" ? sRut.trim() : String(sRut || ""),
              course: normalizeCourseName(typeof sCourse === "string" ? sCourse : String(sCourse || "")),
              diag: typeof sDiag === "string" ? sDiag.trim() : String(sDiag || ""),
              situacionTecnica: typeof sSit === "string" ? sSit.trim() : String(sSit || ""),
              professional: typeof sProf === "string" ? sProf.trim() : String(sProf || ""),
              sourceSheet: label
            });
          }
        });
      });

      if (students.length === 0) {
        setToast("No se encontraron estudiantes válidos en las hojas PIE");
        return;
      }

      setPieImportData(students);
      setActiveView("import");
      setToast("Nómina PIE oficial detectada");
    } catch (err) {
      console.error(err);
      setToast("Error al procesar la nómina PIE");
    }
  };

  const seedPieRoster = (silent = false) => {
    const cleanRut = (r: string) => String(r || "").replace(/[^0-9kK]/g, "").toUpperCase();
    let updated = 0;
    let created = 0;
    setStore((current) => {
      const next = [...current.students];
      PIE_ROSTER.forEach((entry) => {
        const pieData = JSON.stringify({
          active: true,
          diag: entry.diag,
          diagnoses: entry.diagnoses,
          tipoNEE: entry.tipoNEE,
          situacion: entry.situacion,
          situaciones: entry.situaciones,
          cupo: entry.cupo,
          sourceSheets: entry.sourceSheets,
          classifications: entry.classifications,
          entryYear: entry.entryYear,
          birthDate: entry.birthDate,
          diagDate: entry.diagDate,
          evaluator: entry.evaluator,
          evaluators: entry.evaluators,
          specialty: entry.specialty,
          specialties: entry.specialties,
          professional: entry.professional,
          professionals: entry.professionals,
          assignedStaff: Array.from(new Set([entry.professional, ...entry.professionals].filter(Boolean))),
          platformStatus: entry.platformStatus,
          scannerStatus: entry.scannerStatus,
          loadedDocument: entry.loadedDocument,
          pendingDocument: entry.pendingDocument,
          deadline: entry.deadline,
          approvedPreviousYears: entry.approvedPreviousYears,
          appealResult: entry.appealResult,
          finalResult: entry.finalResult,
          siblings: entry.siblings,
          records: entry.records,
          altaDate: "",
          bajaDate: "",
          notes: "",
        });
        const supportText = `Programa de Integración Escolar (PIE). Diagnóstico(s): ${(entry.diagnoses.length ? entry.diagnoses : [entry.diag]).map(pieDiagLabel).join(", ")} (${entry.situacion}). Estado: ${entry.cupo}. Profesional asignado: ${entry.professional}.`;
        const idx = next.findIndex((s) => {
          const a = cleanRut(s.rut);
          const b = cleanRut(entry.rut);
          if (a && b && a === b) return true;
          return normalize(s.fullName || "") === normalize(entry.name);
        });
        if (idx >= 0) {
          const existing = next[idx];
          const tags = (existing.tags || "").split(",").map((t) => t.trim()).filter(Boolean);
          if (!tags.some((t) => t.toUpperCase() === "PIE")) tags.push("PIE");
          next[idx] = {
            ...existing,
            course: existing.course || entry.course,
            rut: existing.rut || entry.rut,
            tags: tags.join(", "),
            pieData,
            supportNeeds: existing.supportNeeds && !existing.supportNeeds.includes("Integración Escolar") ? existing.supportNeeds : supportText,
            updatedAt: nowIso(),
          };
          updated += 1;
        } else {
          next.push({
            id: uid(),
            createdAt: nowIso(),
            updatedAt: nowIso(),
            fullName: entry.name,
            course: entry.course,
            rut: entry.rut,
            tags: "PIE",
            pieData,
            relevantInfo: `Estudiante cargado desde la Nómina Oficial PIE 2026 (${entry.cupo}; hojas: ${entry.sourceSheets.join(", ")}).`,
            supportNeeds: supportText,
            strengths: "",
            healthAlerts: "",
            notes: "",
            observations: "",
            genogram: "[]",
          });
          created += 1;
        }
      });
      return { ...current, students: next };
    });
    if (!silent) setToast(`Nómina PIE cargada: ${created} nuevos, ${updated} actualizados.`);
  };

  const confirmPieImport = () => {
    if (!pieImportData) return;
    const cleanRut = (r: string) => String(r || "").replace(/[^0-9kK]/g, "").toUpperCase();

    let updatedCount = 0;
    let createdCount = 0;

    const currentStudents = [...store.students];

    pieImportData.forEach((excelStudent) => {
      // Find matching student
      let existingIndex = currentStudents.findIndex((s) => {
        const eRut = cleanRut(s.rut);
        const xRut = cleanRut(excelStudent.rut);
        if (eRut && xRut && eRut === xRut) return true;
        return normalize(s.fullName) === normalize(excelStudent.name);
      });

      const pieDiagText = `Programa de Integración Escolar (PIE). Diagnóstico: ${excelStudent.diag} (${excelStudent.situacionTecnica}). Profesional asignado: ${excelStudent.professional}.`;

      if (existingIndex >= 0) {
        // Update existing student
        const existing = currentStudents[existingIndex];
        const tagsList = (existing.tags || "").split(",").map((t) => t.trim()).filter(Boolean);
        if (!tagsList.includes("PIE")) {
          tagsList.push("PIE");
        }
        currentStudents[existingIndex] = {
          ...existing,
          tags: tagsList.join(", "),
          supportNeeds: pieDiagText,
          updatedAt: nowIso()
        };
        updatedCount++;
      } else {
        // Create new student
        const newStudent: DataRecord = {
          id: uid(),
          createdAt: nowIso(),
          updatedAt: nowIso(),
          fullName: excelStudent.name,
          course: excelStudent.course,
          rut: excelStudent.rut,
          tags: "PIE",
          relevantInfo: `Estudiante cargado desde la Nómina Oficial PIE 2026 (${excelStudent.sourceSheet}).`,
          supportNeeds: pieDiagText,
          strengths: "",
          healthAlerts: "",
          notes: "",
          observations: "",
          genogram: "[]"
        };
        currentStudents.push(newStudent);
        createdCount++;
      }
    });

    setStore((current) => ({ ...current, students: currentStudents }));
    setPieImportData(null);
    setToast(`Nómina PIE sincronizada: ${updatedCount} actualizados, ${createdCount} creados.`);
  };

  const importOrientationExcel = (workbook: XLSX.WorkBook, fileName: string) => {
    const sheetName = workbook.SheetNames.find((name) => normalize(name).includes("1 ciclo")) || workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
      setToast("No se encontró una hoja de orientación válida.");
      return;
    }
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: "" }) as string[][];
    const headerIndex = rows.findIndex((row) => row.map((cell) => normalize(String(cell || ""))).includes("curso"));
    if (headerIndex < 0) {
      setToast("No se encontraron encabezados de orientación.");
      return;
    }
    const headers = rows[headerIndex].map((cell) => String(cell || "").trim());
    const col = (label: string) => headers.findIndex((header) => normalize(header) === normalize(label));
    const idx = {
      date: col("SEM"),
      week: col("FECHA"),
      course: col("CURSO"),
      axis: col("ACCIÓN / FORTALEZA"),
      topic: col("TEMA / COMENTARIO"),
      status: col("ESTADO"),
      notes: col("OBSERVACIONES"),
      canva: col("Canva"),
      plan: col("Planificación"),
      folder: col("Carpeta"),
    };
    const normalizeCourseName = (value: string) => String(value || "")
      .replace(/Pre Kinder/g, "Prekínder")
      .replace(/Kinder/g, "Kínder")
      .trim();
    const imported = rows.slice(headerIndex + 1).map((row): DataRecord | null => {
      const cell = (i: number) => i >= 0 ? String(row[i] || "").trim() : "";
      const date = cell(idx.date);
      const course = normalizeCourseName(cell(idx.course));
      const axis = cell(idx.axis);
      const topic = cell(idx.topic) || axis || "Clase de orientación";
      const canva = cell(idx.canva);
      if (![date, course, axis, topic, cell(idx.notes), canva, cell(idx.plan), cell(idx.folder)].some(Boolean)) return null;
      return {
        id: `orientacion-import-${uid()}`,
        createdAt: nowIso(),
        updatedAt: nowIso(),
        date,
        week: cell(idx.week),
        course,
        orientationOwner: "Gustavo Caro",
        orientationEmail: "g.caro.m@colegiosanlucas.com",
        topic,
        axis,
        status: cell(idx.status) || "Pendiente",
        canvaLink: canva,
        evidence: canva,
        planificacion: cell(idx.plan),
        folderLink: cell(idx.folder),
        notes: cell(idx.notes),
        source: fileName,
        sourceSheet: sheetName,
      };
    }).filter((record): record is DataRecord => record !== null);

    if (imported.length === 0) {
      setToast("No se encontraron clases de orientación válidas.");
      return;
    }

    setStore((current) => {
      const existing = new Set(current.orientation.map((record) =>
        normalize([record.date, record.course, record.topic, record.axis, record.source].filter(Boolean).join("|")),
      ));
      const missing = imported.filter((record) => {
        const key = normalize([record.date, record.course, record.topic, record.axis, record.source].filter(Boolean).join("|"));
        return !existing.has(key);
      });
      return { ...current, orientation: [...missing, ...current.orientation] };
    });
    setActiveView("orientation");
    setToast(`Clases de orientación importadas desde Excel: ${imported.length}.`);
  };

  const importFile = (file: File) => {
    const isExcel = file.name.toLowerCase().endsWith(".xlsx") || file.name.toLowerCase().endsWith(".xlsm");
    
    if (isExcel) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const buffer = e.target?.result as ArrayBuffer;
          const workbook = XLSX.read(new Uint8Array(buffer), { type: "array" });
          if (workbook.SheetNames.includes("Cupos PIE")) {
            importPieExcel(workbook);
          } else if (workbook.SheetNames.some((name) => normalize(name).includes("1 ciclo")) && file.name.toLowerCase().includes("orientacion")) {
            importOrientationExcel(workbook, file.name);
          } else {
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const csv = XLSX.utils.sheet_to_csv(worksheet);
            importText(csv, file.name);
          }
        } catch (err) {
          console.error(err);
          setToast("Error al leer el archivo Excel");
        }
      };
      reader.readAsArrayBuffer(file);
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
    recordsToExcel(`${config.id}.xlsx`, config.label, store[entity], config.fields);
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
    if (activeView === "games") return <GamesView />;
    if (activeView === "students") {
      return <StudentsWorkspaceView store={store} onAdd={() => setDialogEntity("students")} onOpenStudent={openStudent} />;
    }
    if (activeView === "pie") {
      return <PieWorkspaceView store={store} onOpenStudent={openStudent} onNavigate={setActiveView} onSeedPie={seedPieRoster} onUpdateStudent={updateStudentRecord} />;
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
          onGenerateAnnualPlan={() => syncOrientationAnnualPlan(false)}
          onOpenStudent={openStudent}
          calendarEvents={calendarEvents}
        />
      );
    }
    if (activeView === "import") {
      if (pieImportData) {
        return (
          <PieImportConfirmationView
            data={pieImportData}
            store={store}
            onCancel={() => setPieImportData(null)}
            onConfirm={confirmPieImport}
          />
        );
      }
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
    local: "Modo local",
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
    <div className="tz-mobile-shell min-h-screen bg-slate-50 text-slate-950">
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        schoolName={profile.organization || "Colegio San Lucas"}
        navItems={orderedNavItems}
        onMoveNavItem={moveNavItem}
        onResetNavOrder={resetNavOrder}
      />
      <main className="tz-app-root min-w-0 lg:pl-[272px]">
        <div className="tz-glass sticky top-0 z-30 border-b border-slate-200/80 px-4 py-3 sm:px-8">
          <div className="mx-auto flex w-full max-w-[1440px] min-w-0 items-center gap-2">
            <div className="hidden shrink-0 items-center gap-1 sm:flex">
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
              className="tz-press group flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-left text-sm text-slate-500 shadow-sm hover:border-slate-300 hover:bg-white"
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
              }`} title={remoteError || syncLabel}>
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
        <div className="mx-auto w-full max-w-[1440px] min-w-0 px-4 py-6 pb-28 sm:px-8 lg:pb-6">
          {renderView()}
        </div>
      </main>
      <MobileNav activeView={activeView} onNavigate={setActiveView} schoolName={profile.organization || "Colegio San Lucas"} navItems={orderedNavItems} />
      <FloatingTizaIA
        open={floatingAiOpen}
        onOpenChange={setFloatingAiOpen}
        store={store}
        accessToken={accessToken}
        onAddRecord={addRecord}
        onOpenStudent={openStudent}
        onUpdateCourse={updateCourseRecord}
      />
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
