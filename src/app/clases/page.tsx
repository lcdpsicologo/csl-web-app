"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpenText, CalendarDays, Clock, ExternalLink, FileText, FolderOpen, GraduationCap, History, RefreshCcw, Search, StickyNote } from "lucide-react";
import { mondayOfWeek, toISODate, upcomingOrientationClasses } from "@/lib/orientation-weekly-schedule";

// Vista pública de solo lectura para profesores: muestra las clases de
// orientación por curso sin permitir ninguna edición.

type PublicClassRecord = {
  id: string;
  date: string;
  week: string;
  weekNumber: string;
  course: string;
  action: string;
  topic: string;
  status: string;
  owner: string;
  canvaLink: string;
  teacherLink: string;
  planificacionLink: string;
  driveLink: string;
  notes: string;
  updatedAt: string;
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const formatDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}/.test(value)) return value || "Sin fecha";
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("es-CL", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
};

const statusTone = (status: string) => {
  const value = normalize(status);
  if (/realizad/.test(value)) return "bg-emerald-100 text-emerald-800 ring-emerald-200";
  if (/reprogramad/.test(value)) return "bg-amber-100 text-amber-800 ring-amber-200";
  if (/suspendid|cancelad/.test(value)) return "bg-rose-100 text-rose-800 ring-rose-200";
  if (/planificad|pendiente/.test(value)) return "bg-blue-100 text-blue-800 ring-blue-200";
  return "bg-slate-100 text-slate-700 ring-slate-200";
};

const courseSortKey = (course: string) => {
  const value = normalize(course);
  const numeric = value.match(/^(\d)/);
  const roman = value.match(/^(iv|iii|ii|i)\s*medio/);
  const index = value.startsWith("prekinder") || value.startsWith("pre kinder") ? 1
    : value.startsWith("kinder") ? 2
    : numeric ? 10 + Number(numeric[1])
    : roman ? 21 + ["i", "ii", "iii", "iv"].indexOf(roman[1])
    : 99;
  return `${String(index).padStart(2, "0")}-${value}`;
};

// Botones de material compartidos por las tarjetas de clase y las próximas clases.
// Siempre se muestran los tres; sin link quedan en gris con el aviso en el tooltip.
function MaterialLinks({ item }: { item: Pick<PublicClassRecord, "canvaLink" | "teacherLink" | "planificacionLink" | "driveLink"> }) {
  const disabledStyle = "inline-flex cursor-help items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] font-semibold text-slate-400";
  return (
    <div className="flex flex-wrap gap-2">
      {item.canvaLink ? (
        <a href={item.canvaLink} target="_blank" rel="noreferrer" title={item.canvaLink} className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-50 px-2.5 py-1.5 text-[11px] font-bold text-cyan-700 ring-1 ring-cyan-200 hover:bg-cyan-100">
          <FileText className="h-3.5 w-3.5" /> Canva <ExternalLink className="h-3 w-3" />
        </a>
      ) : (
        <span title="Sin link de Canva guardado" className={disabledStyle}><FileText className="h-3.5 w-3.5" /> Canva</span>
      )}
      {item.planificacionLink ? (
        <a href={item.planificacionLink} target="_blank" rel="noreferrer" title={item.planificacionLink} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-[11px] font-bold text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-100">
          <BookOpenText className="h-3.5 w-3.5" /> Planificación <ExternalLink className="h-3 w-3" />
        </a>
      ) : (
        <span title="Sin link de planificación guardado" className={disabledStyle}><BookOpenText className="h-3.5 w-3.5" /> Planificación</span>
      )}
      {item.driveLink ? (
        <a href={item.driveLink} target="_blank" rel="noreferrer" title={item.driveLink} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100">
          <FolderOpen className="h-3.5 w-3.5" /> Carpeta <ExternalLink className="h-3 w-3" />
        </a>
      ) : (
        <span title="Sin link de carpeta guardado" className={disabledStyle}><FolderOpen className="h-3.5 w-3.5" /> Carpeta</span>
      )}
      {item.teacherLink && item.teacherLink !== item.canvaLink && (
        <a href={item.teacherLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1.5 text-[11px] font-bold text-blue-700 ring-1 ring-blue-200 hover:bg-blue-100">
          <ExternalLink className="h-3.5 w-3.5" /> Link para la clase
        </a>
      )}
    </div>
  );
}

// Fila de clase con el mismo formato del listado de la bitácora interna.
function ClassRow({ item, showCourse = true }: { item: PublicClassRecord; showCourse?: boolean }) {
  return (
    <div className="grid gap-3 border-b border-slate-100 bg-white px-4 py-3 hover:bg-blue-50/30 lg:grid-cols-[112px_128px_122px_minmax(220px,1fr)_minmax(300px,auto)] lg:items-center">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 lg:hidden">Fecha</p>
        <p className="text-sm font-semibold text-slate-900">{formatDate(item.date)}</p>
      </div>

      <div>
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 lg:hidden">Curso</p>
        {showCourse ? (
          <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100">{item.course || "Sin curso"}</span>
        ) : (
          <span className="hidden text-xs text-slate-300 lg:inline">·</span>
        )}
      </div>

      <div>
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 lg:hidden">Estado</p>
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${statusTone(item.status || "Planificada")}`}>{item.status || "Planificada"}</span>
      </div>

      <div className="min-w-0">
        <p className="text-sm font-bold leading-snug text-slate-950">{item.topic || item.action || "Sin tema definido"}</p>
        <p className="mt-0.5 text-xs text-slate-500">
          {item.week || (item.weekNumber ? `Semana ${item.weekNumber}` : "Sin semana definida")}
          {item.action && item.topic ? ` · ${item.action}` : ""}
        </p>
        {item.notes && (
          <p className="mt-0.5 flex items-start gap-1 text-xs leading-snug text-amber-800" title={item.notes}>
            <StickyNote className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" />
            <span className="line-clamp-2">{item.notes}</span>
          </p>
        )}
      </div>

      <div>
        <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-slate-400 lg:hidden">Material</p>
        <MaterialLinks item={item} />
      </div>
    </div>
  );
}

// Encabezado de columnas para pantallas grandes, igual al de la bitácora.
function RowListHeader() {
  return (
    <div className="hidden border-b border-slate-200 bg-slate-100/80 px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-slate-500 lg:grid lg:grid-cols-[112px_128px_122px_minmax(220px,1fr)_minmax(300px,auto)] lg:items-center lg:gap-3">
      <span>Fecha</span>
      <span>Curso</span>
      <span>Estado</span>
      <span>Tema / semana</span>
      <span>Material</span>
    </div>
  );
}

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState<PublicClassRecord[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");

  const loadClasses = () => {
    setStatus("loading");
    fetch("/api/public/clases")
      .then(async (response) => {
        if (!response.ok) throw new Error("load failed");
        const payload = await response.json();
        setClasses(Array.isArray(payload.classes) ? payload.classes : []);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(loadClasses, []);

  const courses = useMemo(
    () => Array.from(new Set(classes.map((item) => item.course).filter(Boolean))).sort((a, b) => courseSortKey(a).localeCompare(courseSortKey(b))),
    [classes],
  );
  const statuses = useMemo(
    () => Array.from(new Set(classes.map((item) => item.status).filter(Boolean))).sort(),
    [classes],
  );

  const filtered = useMemo(() => classes.filter((item) => {
    if (filterCourse !== "all" && item.course !== filterCourse) return false;
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    if (search.trim()) {
      const haystack = normalize(`${item.course} ${item.action} ${item.topic} ${item.week} ${item.owner} ${item.notes}`);
      if (!haystack.includes(normalize(search))) return false;
    }
    return true;
  }), [classes, filterCourse, filterStatus, search]);

  const done = filtered.filter((item) => /realizad/i.test(item.status)).length;

  // Agrupa las clases filtradas: las de la semana en curso, las futuras y el historial.
  const grouped = useMemo(() => {
    const monday = mondayOfWeek(new Date());
    const weekStart = toISODate(monday);
    const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);
    const weekEnd = toISODate(sunday);
    const thisWeek: PublicClassRecord[] = [];
    const future: PublicClassRecord[] = [];
    const past: PublicClassRecord[] = [];
    filtered.forEach((item) => {
      const date = item.date.slice(0, 10);
      if (date >= weekStart && date <= weekEnd) thisWeek.push(item);
      else if (date > weekEnd) future.push(item);
      else past.push(item);
    });
    // La semana actual y las próximas se ordenan por curso para que cada
    // profesor encuentre el suyo de un vistazo; dentro del curso, por fecha.
    const byCourseThenDate = (a: PublicClassRecord, b: PublicClassRecord) =>
      courseSortKey(a.course).localeCompare(courseSortKey(b.course)) || a.date.localeCompare(b.date);
    thisWeek.sort(byCourseThenDate);
    future.sort(byCourseThenDate);

    // El historial se agrupa por curso, con las clases más recientes primero.
    const pastByCourse = new Map<string, PublicClassRecord[]>();
    past.forEach((item) => {
      const key = item.course || "Sin curso";
      const list = pastByCourse.get(key) || [];
      list.push(item);
      pastByCourse.set(key, list);
    });
    const pastGroups = [...pastByCourse.entries()]
      .sort((a, b) => courseSortKey(a[0]).localeCompare(courseSortKey(b[0])))
      .map(([course, items]) => ({ course, items: items.sort((a, b) => b.date.localeCompare(a.date)) }));

    return { thisWeek, future, pastGroups, pastCount: past.length };
  }, [filtered]);

  // Próximas clases según el horario semanal fijo, con su material si ya está registrado.
  const upcoming = useMemo(() => upcomingOrientationClasses(new Date(), 7).map(({ slot, date }) => ({
    slot,
    date,
    record: classes.find((item) => item.date === date && normalize(item.course) === normalize(slot.course)) || null,
  })), [classes]);

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600 text-white shadow-sm">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-950">Clases de Orientación · SOY+</h1>
              <p className="text-xs text-slate-500">Colegio San Lucas · Vista para profesores (solo lectura)</p>
            </div>
          </div>
          <button
            onClick={loadClasses}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            <RefreshCcw className="h-3.5 w-3.5" /> Actualizar
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        {status === "ready" && upcoming.length > 0 && (
          <section className="mb-6">
            <div className="mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Próximas clases (7 días)</h2>
            </div>
            <div className="flex gap-2.5 overflow-x-auto pb-2">
              {upcoming.map(({ slot, date, record }) => (
                <div key={`${date}-${slot.course}`} className="w-64 shrink-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">{slot.course}</p>
                  <p className="mt-0.5 text-xs font-bold text-slate-900">{formatDate(date)}</p>
                  <p className="text-[11px] tabular-nums text-slate-500">{slot.start} – {slot.end} hrs</p>
                  <p className="mt-1.5 truncate text-xs font-semibold text-slate-700" title={record?.topic || record?.action || ""}>
                    {record?.topic || record?.action || "Tema por confirmar"}
                  </p>
                  {record?.notes && (
                    <p className="mt-1.5 flex items-start gap-1 text-[11px] leading-snug text-amber-800" title={record.notes}>
                      <StickyNote className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" />
                      <span className="line-clamp-2">{record.notes}</span>
                    </p>
                  )}
                  {record ? (
                    <div className="mt-2">
                      <MaterialLinks item={record} />
                    </div>
                  ) : (
                    <p className="mt-2 inline-flex rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] font-semibold text-slate-500">Material por confirmar</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="flex flex-wrap items-center gap-2">
          <label className="relative min-w-52 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por tema, fortaleza o curso…"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none focus:border-blue-400"
            />
          </label>
          <select
            value={filterCourse}
            onChange={(event) => setFilterCourse(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-400"
          >
            <option value="all">Todos los cursos</option>
            {courses.map((course) => <option key={course} value={course}>{course}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={(event) => setFilterStatus(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-400"
          >
            <option value="all">Todos los estados</option>
            {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </section>

        <p className="mt-3 text-xs font-semibold text-slate-500">
          {status === "loading" ? "Cargando clases…" : `${filtered.length} clases · ${done} realizadas`}
        </p>

        {status === "error" && (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-sm font-semibold text-rose-700">
            No se pudieron cargar las clases. Intenta actualizar la página.
          </div>
        )}

        {status === "ready" && filtered.length === 0 && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <BookOpenText className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-600">No hay clases con estos filtros.</p>
          </div>
        )}

        {status === "ready" && grouped.thisWeek.length > 0 && (
          <section className="mt-6 overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-emerald-100 bg-emerald-50/60 px-4 py-3">
              <CalendarDays className="h-4 w-4 text-emerald-600" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-800">Semana actual</h2>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">{grouped.thisWeek.length} clases</span>
            </div>
            <RowListHeader />
            {grouped.thisWeek.map((item) => <ClassRow key={item.id} item={item} />)}
          </section>
        )}

        {status === "ready" && grouped.future.length > 0 && (
          <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 bg-blue-50/50 px-4 py-3">
              <Clock className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-blue-800">Próximas semanas</h2>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">{grouped.future.length} clases</span>
            </div>
            <RowListHeader />
            {grouped.future.map((item) => <ClassRow key={item.id} item={item} />)}
          </section>
        )}

        {status === "ready" && grouped.pastCount > 0 && (
          <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
              <History className="h-4 w-4 text-slate-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Históricos por curso</h2>
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">{grouped.pastCount} clases</span>
            </div>
            {grouped.pastGroups.map(({ course, items }) => (
              <div key={course}>
                <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-100/80 px-4 py-2">
                  <GraduationCap className="h-3.5 w-3.5 text-slate-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">{course}</h3>
                  <span className="text-[11px] font-semibold text-slate-400">{items.length} {items.length === 1 ? "clase" : "clases"}</span>
                </div>
                {items.map((item) => <ClassRow key={item.id} item={item} showCourse={false} />)}
              </div>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
