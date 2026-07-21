"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Archive,
  BookOpenText,
  CalendarDays,
  Check,
  ChevronDown,
  Clock,
  ExternalLink,
  FileText,
  Filter,
  FolderOpen,
  GraduationCap,
  History,
  RefreshCcw,
  Search,
  Sparkles,
  StickyNote,
  X,
} from "lucide-react";
import { mondayOfWeek, ORIENTATION_WEEKLY_SLOTS, slotDateISO, toISODate } from "@/lib/orientation-weekly-schedule";

// Vista pública de solo lectura para profesores.
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
  return new Date(year, month - 1, day).toLocaleDateString("es-CL", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDay = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}/.test(value)) return { weekday: "Fecha", day: "—", month: "" };
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return {
    weekday: date.toLocaleDateString("es-CL", { weekday: "short" }).replace(".", ""),
    day: String(day),
    month: date.toLocaleDateString("es-CL", { month: "short" }).replace(".", ""),
  };
};

const statusTone = (status: string) => {
  const value = normalize(status);
  if (/realizad/.test(value)) return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (/reprogramad/.test(value)) return "bg-amber-50 text-amber-700 ring-amber-200";
  if (/suspendid|cancelad/.test(value)) return "bg-rose-50 text-rose-700 ring-rose-200";
  if (/planificad|pendiente/.test(value)) return "bg-blue-50 text-blue-700 ring-blue-200";
  return "bg-slate-100 text-slate-600 ring-slate-200";
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

function MaterialLinks({ item }: { item: Pick<PublicClassRecord, "canvaLink" | "teacherLink" | "planificacionLink" | "driveLink"> }) {
  const disabledStyle = "inline-flex cursor-help items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1.5 text-[11px] font-semibold text-slate-400";
  return (
    <div className="flex flex-wrap gap-1.5">
      {item.canvaLink ? (
        <a href={item.canvaLink} target="_blank" rel="noreferrer" title={item.canvaLink} className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 px-2.5 py-1.5 text-[11px] font-bold text-cyan-700 ring-1 ring-cyan-200 transition hover:bg-cyan-100">
          <FileText className="h-3.5 w-3.5" /> Canva <ExternalLink className="h-3 w-3" />
        </a>
      ) : <span title="Sin link de Canva guardado" className={disabledStyle}><FileText className="h-3.5 w-3.5" /> Canva</span>}

      {item.planificacionLink ? (
        <a href={item.planificacionLink} target="_blank" rel="noreferrer" title={item.planificacionLink} className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1.5 text-[11px] font-bold text-indigo-700 ring-1 ring-indigo-200 transition hover:bg-indigo-100">
          <BookOpenText className="h-3.5 w-3.5" /> Planificación <ExternalLink className="h-3 w-3" />
        </a>
      ) : <span title="Sin link de planificación guardado" className={disabledStyle}><BookOpenText className="h-3.5 w-3.5" /> Planificación</span>}

      {item.driveLink ? (
        <a href={item.driveLink} target="_blank" rel="noreferrer" title={item.driveLink} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100">
          <FolderOpen className="h-3.5 w-3.5" /> Carpeta <ExternalLink className="h-3 w-3" />
        </a>
      ) : <span title="Sin link de carpeta guardado" className={disabledStyle}><FolderOpen className="h-3.5 w-3.5" /> Carpeta</span>}

      {item.teacherLink && item.teacherLink !== item.canvaLink ? (
        <a href={item.teacherLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1.5 text-[11px] font-bold text-blue-700 ring-1 ring-blue-200 transition hover:bg-blue-100">
          <ExternalLink className="h-3.5 w-3.5" /> Link para la clase
        </a>
      ) : null}
    </div>
  );
}

function FilterMenu({
  label,
  allLabel,
  options,
  value,
  onChange,
}: {
  label: string;
  allLabel: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const menuRef = useRef<HTMLDetailsElement>(null);
  const selectedLabel = value === "all" ? allLabel : value;

  return (
    <details
      ref={menuRef}
      name="teacher-class-filter"
      className="group relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          menuRef.current?.removeAttribute("open");
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          menuRef.current?.removeAttribute("open");
          menuRef.current?.querySelector("summary")?.focus();
        }
      }}
    >
      <summary className="flex h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 outline-none transition hover:border-slate-300 hover:bg-white focus-visible:border-cyan-500 focus-visible:ring-4 focus-visible:ring-cyan-50 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0">
          <span className="block text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">{label}</span>
          <span className="block truncate text-sm font-bold text-slate-800">{selectedLabel}</span>
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div role="listbox" aria-label={label} className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xl shadow-slate-950/15">
        {[{ value: "all", label: allLabel }, ...options.map((option) => ({ value: option, label: option }))].map((option) => {
          const isSelected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={() => {
                onChange(option.value);
                menuRef.current?.removeAttribute("open");
              }}
              className={`flex min-h-10 w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${isSelected ? "bg-cyan-50 font-black text-cyan-900" : "font-semibold text-slate-700 hover:bg-slate-50"}`}
            >
              <span>{option.label}</span>
              {isSelected ? <Check className="h-4 w-4 shrink-0 text-cyan-700" /> : null}
            </button>
          );
        })}
      </div>
    </details>
  );
}

function WeekClassRow({
  date,
  start,
  end,
  item,
  isToday,
}: {
  date: string;
  start: string;
  end: string;
  item: PublicClassRecord;
  isToday: boolean;
}) {
  const day = formatDay(date);
  return (
    <article className={`group grid gap-3 px-4 py-4 transition hover:bg-slate-50/80 sm:grid-cols-[64px_minmax(0,1fr)_auto] sm:items-center sm:px-5 ${isToday ? "bg-cyan-50/55" : "bg-white"}`}>
      <div className="flex items-center gap-3 sm:block">
        <div className={`grid w-14 shrink-0 place-items-center rounded-xl px-2 py-2 text-center ${isToday ? "bg-cyan-950 text-white" : "bg-slate-100 text-slate-700"}`}>
          <span className="text-[10px] font-black uppercase tracking-wider">{day.weekday}</span>
          <span className="text-2xl font-black leading-none">{day.day}</span>
          <span className="text-[10px] font-bold uppercase">{day.month}</span>
        </div>
        {isToday ? <span className="text-[10px] font-black uppercase tracking-wider text-cyan-700 sm:mt-1 sm:block sm:text-center">Hoy</span> : null}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-black text-blue-700">{item.course || "Sin curso"}</span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${statusTone(item.status || "Planificada")}`}>{item.status || "Planificada"}</span>
        </div>
        <p className="mt-1.5 text-sm font-bold leading-snug text-slate-950 sm:text-base">{item.topic || item.action || "Sin tema definido"}</p>
        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-slate-500">
          <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-cyan-700" /> {start && end ? `${start}–${end}` : "Horario por confirmar"}</span>
          <span className="inline-flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5 text-cyan-700" /> {item.owner || "Orientador por confirmar"}</span>
        </div>
        {item.notes ? <p className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-amber-800"><StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span className="line-clamp-1">{item.notes}</span></p> : null}
      </div>
      <div className="sm:max-w-72 sm:justify-self-end"><MaterialLinks item={item} /></div>
    </article>
  );
}

function TodayClass({ item, start, end }: { item: PublicClassRecord; start: string; end: string }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-cyan-200">{item.course || "Sin curso"}</p>
          <p className="mt-1.5 text-sm font-bold leading-snug text-white">{item.topic || item.action || "Sin tema definido"}</p>
        </div>
        <span className="shrink-0 rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold text-white/80">{item.status || "Planificada"}</span>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs font-bold text-cyan-100"><Clock className="h-3.5 w-3.5" /> {start && end ? `${start}–${end}` : "Horario por confirmar"}</p>
      <div className="mt-3 border-t border-white/10 pt-3 [&_a]:bg-white/10 [&_a]:text-white [&_a]:ring-white/15 [&_span]:bg-white/5 [&_span]:text-white/35"><MaterialLinks item={item} /></div>
    </article>
  );
}

function HistoryRow({ item }: { item: PublicClassRecord }) {
  return (
    <article className="grid gap-3 border-b border-slate-100 bg-white px-4 py-4 transition last:border-b-0 hover:bg-slate-50/80 lg:grid-cols-[150px_130px_118px_minmax(230px,1fr)_minmax(300px,auto)] lg:items-center">
      <p className="text-sm font-semibold capitalize text-slate-700">{formatDate(item.date)}</p>
      <span className="w-fit rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100">{item.course || "Sin curso"}</span>
      <span className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${statusTone(item.status || "Planificada")}`}>{item.status || "Planificada"}</span>
      <div className="min-w-0">
        <p className="text-sm font-bold leading-snug text-slate-950">{item.topic || item.action || "Sin tema definido"}</p>
        <p className="mt-1 text-xs text-slate-500">{item.action || item.week || "Orientación"} · {item.owner || "Orientador por confirmar"}</p>
      </div>
      <MaterialLinks item={item} />
    </article>
  );
}

const requestPublicClasses = async () => {
  const response = await fetch("/api/public/clases", { cache: "no-store" });
  if (!response.ok) throw new Error("load failed");
  const payload = await response.json();
  return Array.isArray(payload.classes) ? payload.classes as PublicClassRecord[] : [];
};

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState<PublicClassRecord[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [historyLimit, setHistoryLimit] = useState(24);

  const loadClasses = () => {
    setStatus("loading");
    requestPublicClasses()
      .then((records) => {
        setClasses(records);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(() => {
    let active = true;
    requestPublicClasses()
      .then((records) => {
        if (!active) return;
        setClasses(records);
        setStatus("ready");
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => { active = false; };
  }, []);

  const courses = useMemo(
    () => Array.from(new Set(classes.map((item) => item.course).filter(Boolean))).sort((a, b) => courseSortKey(a).localeCompare(courseSortKey(b))),
    [classes],
  );
  const statuses = useMemo(
    () => Array.from(new Set(classes.map((item) => item.status).filter(Boolean))).sort(),
    [classes],
  );
  const todayISO = toISODate(new Date());
  const weekRange = useMemo(() => {
    const monday = mondayOfWeek(new Date());
    const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);
    return { monday, start: toISODate(monday), end: toISODate(sunday) };
  }, []);

  const normalizedSearch = normalize(search);
  const recordMatchesFilters = (item: PublicClassRecord) => {
    if (filterCourse !== "all" && item.course !== filterCourse) return false;
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    if (!normalizedSearch) return true;
    return normalize(`${item.course} ${item.action} ${item.topic} ${item.week} ${item.owner} ${item.notes}`).includes(normalizedSearch);
  };

  const weekSchedule = useMemo(() => classes
    .filter((item) => {
      const date = item.date.slice(0, 10);
      return date >= weekRange.start && date <= weekRange.end;
    })
    .map((item) => {
      const date = item.date.slice(0, 10);
      const slot = ORIENTATION_WEEKLY_SLOTS.find((candidate) =>
        normalize(candidate.course) === normalize(item.course) && slotDateISO(candidate, weekRange.monday) === date
      );
      return { item, date, slot };
    })
    .sort((a, b) => (
      a.date.localeCompare(b.date)
      || (a.slot?.start || "").localeCompare(b.slot?.start || "")
      || courseSortKey(a.item.course).localeCompare(courseSortKey(b.item.course))
    )), [classes, weekRange.end, weekRange.monday, weekRange.start]);

  const filteredWeekSchedule = weekSchedule.filter(({ item }) => recordMatchesFilters(item));
  const todaySchedule = filteredWeekSchedule.filter(({ date }) => date === todayISO);

  const historicalClasses = useMemo(() => classes
    .filter((item) => item.date.slice(0, 10) < weekRange.start)
    .sort((a, b) => b.date.localeCompare(a.date) || courseSortKey(a.course).localeCompare(courseSortKey(b.course))),
  [classes, weekRange.start]);
  const filteredHistory = historicalClasses.filter(recordMatchesFilters);
  const visibleHistory = filteredHistory.slice(0, historyLimit);
  const historyDone = filteredHistory.filter((item) => /realizad/i.test(item.status)).length;
  const hasFilters = filterCourse !== "all" || filterStatus !== "all" || Boolean(search.trim());

  const clearFilters = () => {
    setFilterCourse("all");
    setFilterStatus("all");
    setSearch("");
    setHistoryLimit(24);
  };

  return (
    <main className="min-h-screen bg-[#f4f7fa] pb-16 text-slate-950">
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-700 to-slate-950 text-white shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-black tracking-tight text-slate-950">Clases de Orientación · SOY+</p>
              <p className="text-[11px] font-medium text-slate-500">Colegio San Lucas · Vista para profesores</p>
            </div>
          </div>
          <button onClick={loadClasses} disabled={status === "loading"} className="inline-flex min-h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60">
            <RefreshCcw className={`h-3.5 w-3.5 ${status === "loading" ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Actualizar</span>
          </button>
        </div>
      </header>

      <section className="relative isolate min-h-[330px] overflow-hidden bg-slate-950">
        <Image src="/teacher-view/semana-docente.webp" alt="Escena referencial de una profesora preparando una clase de orientación" fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/88 to-slate-950/5" />
        <div className="relative mx-auto flex min-h-[330px] max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-100 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Tu semana, en un solo lugar
            </div>
            <h1 className="mt-5 max-w-xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">Prepara la clase que viene. Revisa lo que ya construiste.</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-200 sm:text-base">Encuentra de inmediato tu curso, los materiales de esta semana y el historial completo de orientación.</p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold">
              <span className="rounded-full bg-white px-3 py-2 text-slate-950">Semana del {formatDate(weekRange.start)}</span>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-white backdrop-blur">Solo lectura</span>
            </div>
          </div>
        </div>
        <span className="absolute bottom-2 right-3 rounded-full bg-slate-950/55 px-2 py-1 text-[9px] font-semibold text-white/75 backdrop-blur">Imagen referencial generada con IA</span>
      </section>

      <div className="relative z-10 mx-auto -mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-900/8 sm:p-4" aria-label="Filtros de clases">
          <div className="mb-3 flex items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-50 text-cyan-700"><Filter className="h-4 w-4" /></span>
              <div>
                <h2 className="text-sm font-black text-slate-950">Encuentra tu curso</h2>
                <p className="text-[11px] text-slate-500">Los filtros se aplican a esta semana y al histórico.</p>
              </div>
            </div>
            {hasFilters ? <button onClick={clearFilters} className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[11px] font-bold text-slate-500 hover:bg-slate-100"><X className="h-3.5 w-3.5" /> Limpiar</button> : null}
          </div>
          <div className="grid gap-2 md:grid-cols-[minmax(240px,1.15fr)_minmax(190px,.8fr)_minmax(280px,1.4fr)]">
            <FilterMenu label="Curso" allLabel="Todos los cursos" options={courses} value={filterCourse} onChange={(value) => { setFilterCourse(value); setHistoryLimit(24); }} />
            <FilterMenu label="Estado" allLabel="Todos los estados" options={statuses} value={filterStatus} onChange={(value) => { setFilterStatus(value); setHistoryLimit(24); }} />
            <label className="relative">
              <span className="sr-only">Buscar por tema, fortaleza u orientador</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(event) => { setSearch(event.target.value); setHistoryLimit(24); }} placeholder="Buscar por tema, fortaleza u orientador…" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-50" />
            </label>
          </div>
        </section>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        {status === "loading" ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(310px,.75fr)]">
            <div className="h-[560px] animate-pulse rounded-3xl border border-slate-200 bg-white" />
            <div className="h-[420px] animate-pulse rounded-3xl bg-slate-900" />
          </div>
        ) : null}

        {status === "error" ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-sm font-semibold text-rose-700">No se pudieron cargar las clases. Intenta actualizar la página.</div>
        ) : null}

        {status === "ready" ? (
          <>
            <section className="grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(310px,.75fr)] lg:items-start" aria-labelledby="current-week-title">
              <div>
                <div className="mb-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-cyan-700">Semana actual</p>
                  <h2 id="current-week-title" className="mt-1 text-2xl font-black tracking-tight text-slate-950">Tus clases del {formatDate(weekRange.start)} al {formatDate(weekRange.end)}</h2>
                  <p className="mt-1 text-sm text-slate-500">{filterCourse === "all" ? "Una vista simple de toda la semana. Filtra arriba para encontrar tu curso." : `Agenda semanal de ${filterCourse}.`}</p>
                </div>

                {filteredWeekSchedule.length ? (
                  <div className="divide-y divide-slate-100 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    {filteredWeekSchedule.map(({ slot, date, item }) => <WeekClassRow key={item.id} date={date} start={slot?.start || ""} end={slot?.end || ""} item={item} isToday={date === todayISO} />)}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center">
                    <CalendarDays className="mx-auto h-9 w-9 text-slate-300" />
                    <p className="mt-3 text-sm font-bold text-slate-700">No hay clases de esta semana que coincidan con los filtros.</p>
                    {hasFilters ? <button onClick={clearFilters} className="mt-3 rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white">Ver todos los cursos</button> : null}
                  </div>
                )}
              </div>

              <aside className="order-first overflow-hidden rounded-3xl bg-slate-950 p-5 text-white shadow-xl shadow-slate-950/10 lg:sticky lg:top-6 lg:order-none" aria-labelledby="today-title">
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">Agenda inmediata</p>
                    <h2 id="today-title" className="mt-1 text-xl font-black tracking-tight">Clases de orientación de hoy</h2>
                    <p className="mt-1 text-xs capitalize text-slate-400">{formatDate(todayISO)}</p>
                  </div>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan-400/10 text-cyan-200"><CalendarDays className="h-5 w-5" /></span>
                </div>
                <div className="mt-4 space-y-3">
                  {todaySchedule.length ? todaySchedule.map(({ item, slot }) => (
                    <TodayClass key={item.id} item={item} start={slot?.start || ""} end={slot?.end || ""} />
                  )) : (
                    <div className="rounded-2xl border border-dashed border-white/15 px-4 py-8 text-center">
                      <Clock className="mx-auto h-7 w-7 text-slate-600" />
                      <p className="mt-3 text-sm font-bold text-slate-300">No hay clases para hoy con estos filtros.</p>
                      {hasFilters ? <button onClick={clearFilters} className="mt-3 text-xs font-black text-cyan-300 hover:text-cyan-200">Limpiar filtros</button> : null}
                    </div>
                  )}
                </div>
              </aside>
            </section>

            <section className="mt-10" aria-labelledby="history-title">
              <div className="relative min-h-48 overflow-hidden rounded-2xl bg-slate-950">
                <Image src="/teacher-view/historico-clases.webp" alt="Escena referencial de materiales de clases organizados en un archivo" fill sizes="(max-width: 1024px) 100vw, 1200px" className="object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/92 to-slate-950/20" />
                <div className="relative flex min-h-48 max-w-2xl flex-col justify-center px-5 py-7 text-white sm:px-8">
                  <div className="flex items-center gap-2 text-cyan-200"><History className="h-4 w-4" /><p className="text-[11px] font-black uppercase tracking-[0.18em]">Histórico</p></div>
                  <h2 id="history-title" className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">El recorrido de tus clases, siempre disponible</h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-200">Revisa sesiones anteriores, recupera materiales y encuentra rápidamente una actividad ya realizada.</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold"><span className="rounded-full bg-white px-3 py-1.5 text-slate-950">{filteredHistory.length} registros</span><span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur">{historyDone} realizados</span></div>
                </div>
                <span className="absolute bottom-2 right-3 rounded-full bg-slate-950/55 px-2 py-1 text-[9px] font-semibold text-white/75 backdrop-blur">Imagen referencial generada con IA</span>
              </div>

              <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="hidden border-b border-slate-200 bg-slate-50 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400 lg:grid lg:grid-cols-[150px_130px_118px_minmax(230px,1fr)_minmax(300px,auto)] lg:gap-3">
                  <span>Fecha</span><span>Curso</span><span>Estado</span><span>Clase</span><span>Material</span>
                </div>
                {visibleHistory.length ? visibleHistory.map((item) => <HistoryRow key={item.id} item={item} />) : (
                  <div className="p-10 text-center"><Archive className="mx-auto h-9 w-9 text-slate-300" /><p className="mt-3 text-sm font-bold text-slate-600">No hay clases históricas que coincidan con estos filtros.</p></div>
                )}
              </div>

              {visibleHistory.length < filteredHistory.length ? (
                <div className="mt-4 text-center"><button onClick={() => setHistoryLimit((current) => current + 24)} className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-xs font-black text-slate-700 shadow-sm transition hover:border-cyan-400 hover:text-cyan-800">Mostrar 24 clases más</button></div>
              ) : null}
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
