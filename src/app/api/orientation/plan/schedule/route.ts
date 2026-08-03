import { NextResponse } from "next/server";
import { getAuthClient, authenticateRequest } from "@/lib/gemini";
import { plansForCourse, planCourses } from "@/lib/orientation-class-plans";
import { ORIENTATION_WEEKLY_SLOTS, mondayOfWeek, slotDateISO, toISODate } from "@/lib/orientation-weekly-schedule";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

// Propone el calendario de clases de orientación desde una fecha hasta fin de
// año: toma las clases pendientes de cada curso en el orden del programa y las
// reparte en el horario semanal real de cada curso.
//
// NO guarda nada: devuelve la propuesta para que la app la muestre y el
// orientador confirme antes de crear los registros.

const norm = (value: string) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const normCourse = (value: string) => norm(value).replace(/\s+/g, "");

type ProposedClass = {
  course: string;
  date: string;
  dayName: string;
  start: string;
  end: string;
  week: string;
  weekNumber: string;
  order: number;
  title: string;
  strength: string;
  block: string;
  microObjective: string;
};

/** Etiqueta de semana con el mismo formato de la bitácora: "04/08 al 08/08". */
const weekLabel = (monday: Date) => {
  const friday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 4);
  const dd = (date: Date) => `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;
  return `${dd(monday)} al ${dd(friday)}`;
};

export async function POST(request: Request) {
  const authClient = getAuthClient();
  if (!authClient) {
    return NextResponse.json({ error: "Supabase no está configurado" }, { status: 503 });
  }
  const auth = await authenticateRequest(request, authClient);
  if ("error" in auth) return auth.error;

  let body: { from?: string; until?: string; skipHolidays?: string[]; existing?: Array<{ course?: string; topic?: string; date?: string }> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const fromISO = (body.from || "").slice(0, 10);
  const untilISO = (body.until || "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fromISO) || !/^\d{4}-\d{2}-\d{2}$/.test(untilISO)) {
    return NextResponse.json({ error: "Se requieren fechas 'from' y 'until' en formato AAAA-MM-DD" }, { status: 400 });
  }
  if (untilISO < fromISO) {
    return NextResponse.json({ error: "'until' debe ser posterior a 'from'" }, { status: 400 });
  }

  const holidays = new Set((body.skipHolidays || []).map((d) => String(d).slice(0, 10)));

  // Clases que la app ya tiene: no se vuelven a proponer, y sus fechas quedan
  // ocupadas para no pisar lo ya agendado.
  const existing = body.existing || [];
  const doneByCourse = new Map<string, Set<string>>();
  const takenSlots = new Set<string>();
  existing.forEach((item) => {
    const course = normCourse(item.course || "");
    if (!course) return;
    if (item.topic) {
      const set = doneByCourse.get(course) || new Set<string>();
      set.add(norm(item.topic));
      doneByCourse.set(course, set);
    }
    const date = (item.date || "").slice(0, 10);
    if (date) takenSlots.add(`${course}|${date}`);
  });

  // Fechas disponibles por curso, semana a semana, dentro del rango.
  const [fy, fm, fd] = fromISO.split("-").map(Number);
  const start = new Date(fy, fm - 1, fd);
  const datesByCourse = new Map<string, Array<{ date: string; slot: (typeof ORIENTATION_WEEKLY_SLOTS)[number]; week: string }>>();

  let monday = mondayOfWeek(start);
  let weekIndex = 0;
  const MAX_WEEKS = 40; // tope de seguridad
  while (weekIndex < MAX_WEEKS) {
    const label = weekLabel(monday);
    for (const slot of ORIENTATION_WEEKLY_SLOTS) {
      const date = slotDateISO(slot, monday);
      if (date < fromISO || date > untilISO) continue;
      if (holidays.has(date)) continue;
      const course = normCourse(slot.course);
      if (takenSlots.has(`${course}|${date}`)) continue;
      const list = datesByCourse.get(course) || [];
      list.push({ date, slot, week: label });
      datesByCourse.set(course, list);
    }
    monday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 7);
    weekIndex += 1;
    if (toISODate(monday) > untilISO) break;
  }

  // Cruce: clases pendientes de cada curso -> fechas disponibles, en orden.
  const proposals: ProposedClass[] = [];
  const perCourse: Array<{ course: string; scheduled: number; pending: number; unscheduled: number; firstDate: string; lastDate: string }> = [];

  for (const { course: courseName } of planCourses()) {
    const key = normCourse(courseName);
    // El horario manda: usa el nombre tal como lo escribe la app.
    const slotCourse = ORIENTATION_WEEKLY_SLOTS.find((slot) => normCourse(slot.course) === key);
    if (!slotCourse) continue;

    const alreadyDone = doneByCourse.get(key) || new Set<string>();
    const pending = plansForCourse(courseName).filter((plan) => !alreadyDone.has(norm(plan.title)));
    const dates = (datesByCourse.get(key) || []).sort((a, b) => a.date.localeCompare(b.date));

    const count = Math.min(pending.length, dates.length);
    for (let i = 0; i < count; i += 1) {
      const plan = pending[i];
      const target = dates[i];
      proposals.push({
        course: slotCourse.course,
        date: target.date,
        dayName: target.slot.dayName,
        start: target.slot.start,
        end: target.slot.end,
        week: target.week,
        weekNumber: "",
        order: plan.order,
        title: plan.title,
        strength: plan.strength,
        block: plan.block,
        microObjective: plan.microObjective,
      });
    }

    perCourse.push({
      course: slotCourse.course,
      scheduled: count,
      pending: pending.length,
      unscheduled: Math.max(0, pending.length - dates.length),
      firstDate: count ? dates[0].date : "",
      lastDate: count ? dates[count - 1].date : "",
    });
  }

  proposals.sort((a, b) => `${a.date} ${a.start}`.localeCompare(`${b.date} ${b.start}`));

  return NextResponse.json({
    ok: true,
    from: fromISO,
    until: untilISO,
    total: proposals.length,
    perCourse,
    proposals,
  });
}
