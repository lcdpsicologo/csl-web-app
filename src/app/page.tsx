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

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

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
      { key: "notes", label: "Notas", type: "textarea", aliases: ["notas", "observaciones", "comentarios", "antecedentes"] },
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
      { key: "headTeacher", label: "Profesor/a jefe", aliases: ["profesor jefe", "profesora jefe", "docente", "tutor"] },
      { key: "cycle", label: "Ciclo", aliases: ["ciclo", "nivel", "etapa"] },
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
      acc[field.key] = field.type === "date" ? new Date().toISOString().slice(0, 10) : "";
      return acc;
    }, {})
  );

  const canSave = entity.fields.filter((field) => field.required).every((field) => form[field.key]?.trim());

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/30 p-4 backdrop-blur-sm">
      <section className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-100 p-6">
          <div>
            <h2 className="text-2xl font-semibold">Agregar {entity.singular}</h2>
            <p className="mt-1 text-sm text-slate-600">Este registro se guardará en el almacenamiento local del navegador.</p>
          </div>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full text-slate-500 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-2">
          {entity.fields.map((field) => (
            <label key={field.key} className={field.type === "textarea" ? "md:col-span-2" : ""}>
              <span className="text-sm font-bold text-slate-700">
                {field.label} {field.required ? <span className="text-red-500">*</span> : null}
              </span>
              {field.type === "textarea" ? (
                <textarea
                  value={form[field.key]}
                  onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
                  className="mt-2 h-28 w-full resize-none rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-teal-600"
                />
              ) : field.type === "select" ? (
                <select
                  value={form[field.key]}
                  onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-teal-600"
                >
                  <option value="">Seleccionar</option>
                  {field.options?.map((option) => <option key={option}>{option}</option>)}
                </select>
              ) : (
                <input
                  type={field.type || "text"}
                  value={form[field.key]}
                  onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
                  className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-teal-600"
                />
              )}
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-100 p-6">
          <button onClick={onClose} className="rounded-lg border border-slate-200 px-5 py-3 font-bold">Cancelar</button>
          <button
            disabled={!canSave}
            onClick={() => onSave({ id: uid(), createdAt: nowIso(), updatedAt: nowIso(), ...form })}
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <Save className="h-5 w-5" /> Guardar
          </button>
        </div>
      </section>
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
      setAuthLoading(false);
    });

    const { data: listener } = supabaseAuth.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
      setAuthLoading(false);
      setRemoteLoaded(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authUser || !supabaseAuth) {
      return;
    }

    let cancelled = false;
    const loadRemoteStore = async () => {
      setRemoteStatus("loading");
      const { data } = await supabaseAuth.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        setRemoteStatus("error");
        setRemoteLoaded(true);
        return;
      }

      try {
        const response = await fetch("/api/records", {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("No se pudieron cargar los datos remotos.");
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
  }, [authUser]);

  useEffect(() => {
    if (!authUser || !supabaseAuth) {
      return;
    }

    let cancelled = false;
    const loadTeam = async () => {
      const { data } = await supabaseAuth.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return;

      try {
        const response = await fetch("/api/team", {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("No se pudo cargar el equipo.");
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
  }, [authUser]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }, [store]);

  useEffect(() => {
    if (!authUser || !supabaseAuth || !remoteLoaded) return;

    const timer = window.setTimeout(async () => {
      setRemoteStatus("saving");
      const { data } = await supabaseAuth.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        setRemoteStatus("error");
        return;
      }

      try {
        const response = await fetch("/api/records", {
          method: "PUT",
          headers: {
            authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({ store }),
        });
        if (!response.ok) throw new Error("No se pudieron guardar los datos remotos.");
        setRemoteStatus("synced");
      } catch (error) {
        console.error(error);
        setRemoteStatus("error");
      }
    }, 700);

    return () => window.clearTimeout(timer);
  }, [store, authUser, remoteLoaded]);

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
    setRemoteStatus("local");
    setRemoteLoaded(false);
    setTeam([]);
    setToast("Sesion cerrada");
  };

  const seedTeam = async () => {
    if (!supabaseAuth) return;
    setTeamSeeding(true);
    setTeamSeedNotice("");
    try {
      const { data } = await supabaseAuth.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("No hay sesión activa.");

      const response = await fetch("/api/team/seed", {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "No se pudo crear el equipo.");

      const teamResponse = await fetch("/api/team", {
        headers: {
          authorization: `Bearer ${token}`,
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
      {toast ? <Toast message={toast} /> : null}
    </div>
  );
}
