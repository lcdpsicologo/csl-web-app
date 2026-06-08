"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { createClient, type User } from "@supabase/supabase-js";
import {
  ArrowDownToLine,
  BarChart3,
  BookOpen,
  Building2,
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

type ViewId = "dashboard" | "import" | "team" | "settings" | EntityId;

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
    .toUpperCase() || "··";

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
      { key: "notes", label: "Notas", type: "textarea", aliases: ["notas", "observaciones", "comentarios", "antecedentes"] },
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
      { key: "evidence", label: "Evidencia / enlace", aliases: ["evidencia", "link", "enlace", "url"] },
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
  { id: "import", label: "Importar con IA", icon: Wand2 },
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
  { id: "settings", label: "Configuración", icon: Settings },
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
    teal: "bg-slate-50 text-slate-600 ring-slate-200",
    blue: "bg-slate-50 text-slate-600 ring-slate-200",
    amber: "bg-slate-50 text-slate-600 ring-slate-200",
    violet: "bg-slate-50 text-slate-600 ring-slate-200",
    rose: "bg-slate-50 text-slate-600 ring-slate-200",
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-600">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{detail}</p>
        </div>
        <div className={`grid h-10 w-10 place-items-center rounded-md ring-1 ${accents[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </section>
  );
}

function Sidebar({ activeView, onNavigate }: { activeView: ViewId; onNavigate: (view: ViewId) => void }) {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-[272px] flex-col border-r border-slate-200 bg-white text-slate-700 lg:flex">
      <div className="flex h-full flex-col">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex h-12 items-center">
            <Image src="/tiza-education-logo.svg" alt="Tiza Education" width={214} height={52} priority />
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {viewNav.map((item) => {
            const Icon = item.icon;
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex h-10 w-full items-center gap-3 rounded-md px-3 text-left text-sm font-medium transition ${
                  active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="m-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-md bg-white ring-1 ring-slate-200">
              <Building2 className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Institución activa</p>
              <p className="text-xs text-slate-500">Configurable en ajustes</p>
            </div>
          </div>
        </div>
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
            <entity.icon className="h-6 w-6 text-slate-600" />
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{entity.label}</h1>
          </div>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">{entity.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex min-w-[260px] flex-1 items-center gap-3 rounded-md border border-slate-300 bg-white px-4 py-2.5 xl:w-80 xl:flex-none">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Buscar en ${entity.label.toLowerCase()}...`}
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
            />
            {query ? (
              <button onClick={() => setQuery("")} className="text-slate-400 hover:text-slate-700">
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
          <button onClick={onImport} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 font-bold text-slate-700">
            <Upload className="h-5 w-5" /> Importar
          </button>
          <button onClick={onExport} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 font-bold text-slate-700">
            <ArrowDownToLine className="h-5 w-5" /> Exportar
          </button>
          <button onClick={onAdd} className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
            <Plus className="h-4 w-4" /> Agregar
          </button>
        </div>
      </div>

      {records.length === 0 ? (
        <EmptyState entity={entity} onAdd={onAdd} onImport={onImport} />
      ) : (
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-4 text-sm font-semibold text-slate-600">
            Mostrando {filtered.length} de {records.length} registros
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  {entity.fields.slice(0, 6).map((field) => (
                    <th key={field.key} className="px-5 py-4 font-semibold">{field.label}</th>
                  ))}
                  <th className="px-5 py-4 font-semibold">Actualizado</th>
                  <th className="px-5 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((record) => (
                  <tr key={record.id} className="hover:bg-blue-50/40">
                    {entity.fields.slice(0, 6).map((field) => (
                      <td key={field.key} className="max-w-[260px] truncate px-5 py-4">
                        {record[field.key] || <span className="text-slate-300">Sin dato</span>}
                      </td>
                    ))}
                    <td className="px-5 py-4 text-xs text-slate-500">{new Date(record.updatedAt).toLocaleString("es-CL")}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => onDelete(record.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50">
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
  onOpenStudent: (studentId: string) => void;
}) {
  const savedByName = new Map(store.courses.map((course) => [normalize(course.name || ""), course]));
  const courses = officialCourses.map((course) => ({ ...course, record: savedByName.get(normalize(course.name)) || makeCourseRecord(course) }));
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.name || "");
  const [cycleTab, setCycleTab] = useState<"all" | CourseDef["cycle"]>("all");
  const [draggedStudentId, setDraggedStudentId] = useState("");
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const [teamForm, setTeamForm] = useState({ name: "", role: "Profesor/a jefe", email: "", notes: "" });
  const [showTeamForm, setShowTeamForm] = useState(false);

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
      notes: teamForm.notes.trim(),
    };
    onUpdateCourse(current.name, {
      classroomTeam: JSON.stringify([...classroomTeam, member]),
      headTeacher: member.role === "Profesor/a jefe" ? member.name : current.record.headTeacher || "",
    });
    setTeamForm({ name: "", role: "Profesor/a jefe", email: "", notes: "" });
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

  return (
    <div className="tz-fade">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Cursos</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Cada curso tiene su propio tablero: equipo de aula, simulación de sala, casos, orientación y documentos.
          </p>
        </div>
        <button
          onClick={onSeedCourses}
          disabled={missingOfficialCourses === 0}
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300"
        >
          <Save className="h-4 w-4" />
          {missingOfficialCourses === 0 ? "Cursos oficiales guardados" : `Guardar ${missingOfficialCourses} cursos oficiales`}
        </button>
      </div>

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
          <section className="tz-slide-up overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className={`bg-gradient-to-br ${avatarTone(current.name)} px-6 py-5 text-white`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/80">
                    <span className="rounded-full bg-white/20 px-2.5 py-0.5">{current.cycle}</span>
                    <span>·</span>
                    <span>{current.orientationOwner}</span>
                  </div>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight">{current.name}</h2>
                  <p className="mt-1 text-sm text-white/90">Convivencia: <strong>{current.convivenciaCoordinator}</strong> · {current.convivenciaEmail}</p>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
                  {[
                    ["Estudiantes", students.length],
                    ["Casos", cases.length],
                    ["Orientación", orientation.length],
                    ["Bitácoras", logs.length],
                  ].map(([label, count]) => (
                    <div key={String(label)} className="rounded-lg bg-white/15 px-3 py-2 backdrop-blur">
                      <div className="text-xl font-bold">{count}</div>
                      <div className="opacity-80">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="tz-slide-up rounded-2xl border border-slate-200 bg-white p-5">
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
              <div className="tz-slide-up mb-4 grid gap-2 rounded-xl border border-blue-200 bg-blue-50/60 p-4 lg:grid-cols-[1fr_220px_1fr_1fr_auto]">
                <input value={teamForm.name} onChange={(event) => setTeamForm((form) => ({ ...form, name: event.target.value }))} placeholder="Nombre completo" className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500" />
                <select value={teamForm.role} onChange={(event) => setTeamForm((form) => ({ ...form, role: event.target.value }))} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500">
                  {classroomRoles.map((role) => <option key={role}>{role}</option>)}
                </select>
                <input value={teamForm.email} onChange={(event) => setTeamForm((form) => ({ ...form, email: event.target.value }))} placeholder="Correo" className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500" />
                <input value={teamForm.notes} onChange={(event) => setTeamForm((form) => ({ ...form, notes: event.target.value }))} placeholder="Notas u horario" className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500" />
                <button onClick={addClassroomTeamMember} disabled={!teamForm.name.trim()} className="inline-flex items-center justify-center gap-1.5 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300">
                  <Save className="h-4 w-4" /> Guardar
                </button>
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
                          value={member.role}
                          onChange={(event) => updateClassroomTeamMember(member.id, { role: event.target.value })}
                          className="mt-1 w-full rounded border border-transparent bg-transparent text-xs text-slate-600 outline-none transition hover:border-slate-200 focus:border-blue-500"
                        >
                          {classroomRoles.map((role) => <option key={role}>{role}</option>)}
                        </select>
                        <input
                          value={member.email}
                          onChange={(event) => updateClassroomTeamMember(member.id, { email: event.target.value })}
                          placeholder="Correo"
                          className="mt-1 w-full border-b border-transparent bg-transparent text-xs text-slate-500 outline-none transition hover:border-slate-200 focus:border-blue-500"
                        />
                        {member.notes !== undefined ? (
                          <input
                            value={member.notes || ""}
                            onChange={(event) => updateClassroomTeamMember(member.id, { notes: event.target.value })}
                            placeholder="Notas"
                            className="mt-1 w-full border-b border-transparent bg-transparent text-xs text-slate-500 outline-none transition hover:border-slate-200 focus:border-blue-500"
                          />
                        ) : null}
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
            <section className="tz-slide-up rounded-2xl border border-slate-200 bg-white p-5">
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
                              {student.healthAlerts ? <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[9px] font-semibold text-rose-700">Salud</span> : null}
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

            <section className="tz-slide-up rounded-2xl border border-slate-200 bg-white p-5">
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
  onAddClass,
}: {
  store: DataStore;
  onAddClass: () => void;
}) {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Orientación por ciclo</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Clases y seguimiento por orientador responsable, usando la distribución real de cursos del colegio.
          </p>
        </div>
        <button onClick={onAddClass} className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
          <Plus className="h-4 w-4" /> Agregar clase
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {orientationOwners.map((owner) => {
          const classes = store.orientation.filter((record) =>
            normalize(record.orientationOwner || "") === normalize(owner.name) || owner.courses.some((course) => normalize(record.course || "") === normalize(course))
          );
          return (
            <section key={owner.email} className="rounded-lg border border-slate-200 bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">{owner.name}</h2>
                  <p className="mt-1 text-sm text-slate-600">{owner.role}</p>
                  <p className="mt-2 text-sm text-slate-600">
                    Coord. convivencia: <strong className="text-slate-950">{owner.convivenciaCoordinator}</strong>
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{owner.cycle}</span>
              </div>
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase text-slate-500">Cursos a cargo</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {owner.courses.map((course) => <span key={course} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{course}</span>)}
                </div>
              </div>
              <div className="mt-5 border-t border-slate-100 pt-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-950">Clases registradas</h3>
                  <span className="text-sm font-semibold text-slate-600">{classes.length}</span>
                </div>
                <div className="space-y-3">
                  {classes.length === 0 ? (
                    <p className="rounded-md bg-slate-50 p-3 text-sm text-slate-600">Aún no hay clases ingresadas para este ciclo.</p>
                  ) : classes.slice(0, 6).map((record) => (
                    <article key={record.id} className="rounded-md border border-slate-200 p-3 text-sm">
                      <strong className="block text-slate-950">{record.topic || "Clase sin tema"}</strong>
                      <span className="text-slate-600">{record.course} · {record.status || "Sin estado"}</span>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>
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
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-semibold text-slate-950">{title}</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{records.length}</span>
      </div>
      {records.length === 0 ? (
        <p className="rounded-md bg-slate-50 p-3 text-sm text-slate-600">{emptyText}</p>
      ) : (
        <div className="space-y-3">
          {records.map((record) => (
            <article key={record.id} className="rounded-md border border-slate-200 p-3 text-sm">
              <strong className="block text-slate-950">{record.title || record.reason || record.topic || record.type || record.student || record.relatedTo || "Registro"}</strong>
              <p className="mt-1 text-slate-600">{record.description || record.agreements || record.notes || record.status || "Sin detalle adicional."}</p>
              <p className="mt-2 text-xs text-slate-500">{record.date || record.dueDate || new Date(record.updatedAt).toLocaleDateString("es-CL")}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

type QuickAddKind = "cases" | "interviews" | "logs" | "documents" | "protocols";

function StudentDetailDialog({
  student,
  store,
  onClose,
  onUpdateStudent,
  onAddRecord,
  onNavigate,
}: {
  student: DataRecord;
  store: DataStore;
  onClose: () => void;
  onUpdateStudent: (studentId: string, updates: Record<string, string>) => void;
  onAddRecord: (entity: EntityId, record: DataRecord) => void;
  onNavigate?: (view: ViewId) => void;
}) {
  const [activeTab, setActiveTab] = useState<"resumen" | "familia" | "casos" | "entrevistas" | "bitacoras" | "documentos">("resumen");
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
        className="tz-pop m-auto flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="relative overflow-hidden">
          <div className={`bg-gradient-to-br ${avatarTone(student.id)} px-6 pt-6 pb-20 text-white`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/80">
                <BookOpen className="h-3.5 w-3.5" />
                {student.course || "Sin curso"}
              </div>
              <button onClick={onClose} className="rounded-md p-1.5 text-white/90 hover:bg-white/15">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="-mt-14 px-6">
            <div className="flex flex-wrap items-end gap-5">
              <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white text-2xl font-bold text-slate-900 ring-4 ring-white shadow-lg">
                {student.profilePhoto ? (
                  <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${student.profilePhoto})` }} />
                ) : (
                  <span className={`grid h-full w-full place-items-center bg-gradient-to-br ${avatarTone(student.id)} text-white`}>{initialsOf(student.fullName)}</span>
                )}
              </div>
              <div className="min-w-0 flex-1 pb-2">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{student.fullName || "Estudiante"}</h2>
                <p className="mt-1 text-sm text-slate-600">{student.rut || "Sin RUT/ID"}{student.guardian ? ` · Apoderado/a: ${student.guardian}` : ""}</p>
                <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                  {student.phone ? <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">📞 {student.phone}</span> : null}
                  {student.email ? <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">{student.email}</span> : null}
                  {student.healthAlerts ? <span className="rounded-full bg-rose-50 px-2.5 py-1 font-semibold text-rose-700">Alerta de salud</span> : null}
                </div>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
                <Upload className="h-4 w-4" /> Foto
                <input type="file" accept="image/*" className="hidden" onChange={(event) => handlePhoto(event.target.files?.[0])} />
              </label>
            </div>
          </div>
        </header>

        <nav className="border-b border-slate-200 px-4 pt-3">
          <div className="flex flex-wrap gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative inline-flex items-center gap-2 rounded-t-md px-3 py-2 text-sm font-semibold transition ${active ? "bg-white text-slate-950" : "text-slate-500 hover:text-slate-900"}`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {tab.badge ? <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${active ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>{tab.badge}</span> : null}
                  {active ? <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-blue-600" /> : null}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="tz-fade flex-1 overflow-y-auto bg-slate-50 px-6 py-5">
          {activeTab === "resumen" ? (
            <div className="grid gap-5 xl:grid-cols-2">
              <section className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Información clínica y pedagógica</h3>
                <div className="mt-4 grid gap-4">
                  {[
                    ["relevantInfo", "Antecedentes relevantes"],
                    ["strengths", "Fortalezas y recursos"],
                    ["supportNeeds", "Necesidades de apoyo"],
                    ["healthAlerts", "Alertas de salud / cuidados"],
                    ["notes", "Observaciones generales"],
                  ].map(([key, label]) => (
                    <label key={key} className="block">
                      <span className="text-xs font-semibold text-slate-700">{label}</span>
                      <textarea
                        value={student[key] || ""}
                        onChange={(event) => updateInfo(key, event.target.value)}
                        className="mt-1.5 min-h-20 w-full resize-y rounded-md border border-slate-200 bg-white p-2.5 text-sm leading-6 outline-none focus:border-blue-500"
                      />
                    </label>
                  ))}
                </div>
              </section>
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
              <div className="grid gap-4 xl:grid-cols-2">
                <LinkedRecordList title={`Casos individuales (${cases.length})`} records={cases} emptyText="No hay casos individuales vinculados." />
                <LinkedRecordList title={`Situaciones del curso (${courseCases.length})`} records={courseCases} emptyText="No hay situaciones del curso." />
              </div>
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

        <footer className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-6 py-3 text-xs text-slate-500">
          <span>Actualizado {new Date(student.updatedAt).toLocaleString("es-CL")}</span>
          <div className="flex gap-2">
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
  onOpenStudent: (studentId: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [cycleFilter, setCycleFilter] = useState<"all" | CourseDef["cycle"]>("all");
  const [openCourses, setOpenCourses] = useState<Record<string, boolean>>({});

  const searchable = normalize(search);
  const cycleByCourse = new Map(officialCourses.map((course) => [normalize(course.name), course.cycle]));

  const filteredStudents = store.students.filter((student) => {
    if (!searchable) return true;
    return [student.fullName, student.rut, student.guardian, student.email, student.phone]
      .map((value) => normalize(String(value || "")))
      .some((value) => value.includes(searchable));
  });

  const grouped = new Map<string, DataRecord[]>();
  filteredStudents.forEach((student) => {
    const courseKey = (student.course || "Sin curso").trim() || "Sin curso";
    if (!grouped.has(courseKey)) grouped.set(courseKey, []);
    grouped.get(courseKey)!.push(student);
  });

  const officialOrder = [...officialCourses.map((course) => course.name), "Sin curso"];
  const courseList = officialOrder
    .filter((name) => grouped.has(name))
    .concat(Array.from(grouped.keys()).filter((name) => !officialOrder.includes(name)))
    .map((name) => {
      const cycle = cycleByCourse.get(normalize(name)) || (name === "Sin curso" ? undefined : "III Ciclo");
      return { name, students: grouped.get(name) || [], cycle };
    })
    .filter((group) => cycleFilter === "all" || group.cycle === cycleFilter);

  const totalShown = courseList.reduce((sum, group) => sum + group.students.length, 0);
  const toggleCourse = (name: string) => setOpenCourses((current) => ({ ...current, [name]: !(current[name] ?? true) }));

  return (
    <div className="tz-fade">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Estudiantes</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Listado ordenado por curso. Haz clic en cualquier estudiante para abrir su ficha con casos, entrevistas y documentos.
          </p>
        </div>
        <button onClick={onAdd} className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
          <Plus className="h-4 w-4" /> Agregar estudiante
        </button>
      </div>

      <div className="mb-5 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 lg:flex-row lg:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nombre, RUT, apoderado, correo..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
          />
          {search ? (
            <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-700">
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
          <span className="font-semibold text-slate-950">{totalShown}</span>
          <span className="ml-1 text-slate-500">de {store.students.length} estudiantes</span>
        </div>
      </div>

      {store.students.length === 0 ? (
        <EmptyState entity={entityConfigs.students} onAdd={onAdd} onImport={() => undefined} />
      ) : courseList.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <Search className="mx-auto h-8 w-8 text-slate-400" />
          <p className="mt-3 text-sm text-slate-600">No hay estudiantes que coincidan con tu búsqueda.</p>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
          {courseList.map((group) => {
            const isOpen = openCourses[group.name] ?? true;
            return (
              <section key={group.name} className="tz-card overflow-hidden rounded-xl border border-slate-200 bg-white">
                <button onClick={() => toggleCourse(group.name)} className="flex w-full items-center justify-between gap-3 bg-gradient-to-br from-slate-50 to-white px-5 py-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className={`grid h-10 w-10 place-items-center rounded-md bg-gradient-to-br ${avatarTone(group.name)} text-sm font-bold text-white shadow-sm`}>
                      {group.name.split(" ").slice(0, 2).map((part) => part[0] || "").join("").toUpperCase().slice(0, 2) || "··"}
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-slate-950">{group.name}</h2>
                      <p className="text-xs text-slate-500">{group.cycle || "Sin ciclo"} · {group.students.length} estudiante{group.students.length === 1 ? "" : "s"}</p>
                    </div>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? "" : "-rotate-90"}`} />
                </button>
                {isOpen ? (
                  <div className="tz-fade divide-y divide-slate-100">
                    {group.students.map((student) => {
                      const caseCount = store.cases.filter((record) => studentMatches(record, student)).length;
                      return (
                        <button
                          key={student.id}
                          onClick={() => onOpenStudent(student.id)}
                          className="group flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-blue-50/60"
                        >
                          <div className={`grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br ${avatarTone(student.id)} text-xs font-bold text-white`}>
                            {student.profilePhoto ? (
                              <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${student.profilePhoto})` }} />
                            ) : (
                              initialsOf(student.fullName)
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-slate-950 group-hover:text-blue-700">{student.fullName || "Sin nombre"}</span>
                            <span className="block truncate text-xs text-slate-500">{student.rut || "Sin RUT"}{student.guardian ? ` · ${student.guardian}` : ""}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {student.healthAlerts ? <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700">Salud</span> : null}
                            {caseCount ? <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">{caseCount} caso{caseCount === 1 ? "" : "s"}</span> : null}
                            <ChevronDown className="-rotate-90 h-4 w-4 text-slate-300 group-hover:text-blue-500" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>
      )}
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

  return (
    <div className="fixed inset-0 z-50 grid bg-slate-950/40 p-4 backdrop-blur-sm">
      <form onSubmit={save} className="m-auto max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-2xl">
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

function Dashboard({ store, onNavigate }: { store: DataStore; onNavigate: (view: ViewId) => void }) {
  const total = Object.values(store).reduce((sum, records) => sum + records.length, 0);
  const activeEntities = Object.values(store).filter((records) => records.length > 0).length;
  const readiness = Math.round((activeEntities / Object.keys(entityConfigs).length) * 100);
  const latest = Object.entries(store)
    .flatMap(([entity, records]) => records.map((record) => ({ entity: entity as EntityId, record })))
    .sort((a, b) => b.record.updatedAt.localeCompare(a.record.updatedAt))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="grid gap-6 xl:grid-cols-[1fr_340px] xl:items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Operativo, sin datos ficticios
            </div>
          <h1 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-slate-950">Inicio institucional</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Base lista para empezar a ingresar información real. Los datos se guardan localmente en este navegador hasta conectar Supabase/Auth.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
          <button onClick={() => onNavigate("import")} className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
            <Wand2 className="h-4 w-4" /> Importar planilla
          </button>
          <button onClick={() => onNavigate("students")} className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <Plus className="h-4 w-4" /> Ingresar datos
          </button>
        </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600">Preparacion de datos</p>
                <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">{readiness}%</p>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-md bg-white text-slate-600 ring-1 ring-slate-200">
                <BarChart3 className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-slate-900" style={{ width: `${readiness}%` }} />
            </div>
            <div className="mt-4 grid gap-2 text-sm text-slate-600">
              <div className="flex justify-between gap-4"><span>Registros reales</span><strong className="text-slate-950">{total}</strong></div>
              <div className="flex justify-between gap-4"><span>Modulos con datos</span><strong className="text-slate-950">{activeEntities}/{Object.keys(entityConfigs).length}</strong></div>
              <div className="flex justify-between gap-4"><span>Persistencia</span><strong className="text-slate-950">Local</strong></div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Estudiantes" value={store.students.length} detail="Registros reales" icon={UserRound} />
        <StatCard label="Cursos" value={store.courses.length} detail="Cursos creados" icon={BookOpen} />
        <StatCard label="Casos" value={store.cases.length} detail="Casos ingresados" icon={FileText} />
        <StatCard label="Bitácoras" value={store.logs.length} detail="Intervenciones" icon={ClipboardList} />
        <StatCard label="Documentos" value={store.documents.length} detail="Índice documental" icon={FolderOpen} />
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
            <button onClick={() => onNavigate("import")} className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Importar planilla</button>
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
        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Persistencia actual</h2>
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900"><Lock className="mr-2 inline h-4 w-4" /> Guardado local</p>
            <p className="mt-2">Los datos quedan en este navegador. Para uso multiusuario real, el siguiente paso es conectar Supabase con RLS y autenticación.</p>
          </div>
          <button onClick={onClear} className="mt-5 inline-flex items-center gap-2 rounded-lg border border-red-200 px-5 py-3 font-bold text-red-600 hover:bg-red-50">
            <Trash2 className="h-5 w-5" /> Borrar datos locales
          </button>
        </section>
      </div>
    </div>
  );
}

function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-5 py-4 font-semibold text-slate-950 shadow-xl">
      <Check className="mr-2 inline h-5 w-5 text-slate-700" />
      {message}
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
  const [activeView, setActiveView] = useState<ViewId>("dashboard");
  const [detailStudentId, setDetailStudentId] = useState("");
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

  const seedOfficialCourses = () => {
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
    setToast("Cursos oficiales y duplas por ciclo actualizadas");
  };

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
    if (activeView === "dashboard") return <Dashboard store={store} onNavigate={setActiveView} />;
    if (activeView === "students") {
      return <StudentsWorkspaceView store={store} onAdd={() => setDialogEntity("students")} onOpenStudent={(studentId) => setDetailStudentId(studentId)} />;
    }
    if (activeView === "courses") {
      return (
        <CourseWorkspaceView
          store={store}
          onSeedCourses={seedOfficialCourses}
          onUpdateCourse={updateCourseRecord}
          onNavigate={setActiveView}
          onOpenStudent={(studentId) => setDetailStudentId(studentId)}
        />
      );
    }
    if (activeView === "orientation") {
      return <OrientationCycleView store={store} onAddClass={() => setDialogEntity("orientation")} />;
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
        onImport={() => setActiveView("import")}
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
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <main className="lg:pl-[272px]">
        <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-8">
          <div className="mb-5 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm">
            <div>
              <p className="font-semibold text-slate-900">Sesion activa</p>
              <p className="text-slate-500">{authUser.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                remoteStatus === "synced"
                  ? "bg-green-50 text-green-700"
                  : remoteStatus === "error"
                    ? "bg-orange-50 text-orange-700"
                    : "bg-slate-100 text-slate-600"
              }`}>
                {syncLabel}
              </span>
              <button
                onClick={signOut}
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" /> Salir
              </button>
            </div>
          </div>
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
            onClose={() => setDetailStudentId("")}
            onUpdateStudent={updateStudentRecord}
            onAddRecord={(entity, record) => addRecord(entity, record)}
            onNavigate={setActiveView}
          />
        );
      })() : null}
      {toast ? <Toast message={toast} /> : null}
    </div>
  );
}
