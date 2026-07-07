// Horario semanal de clases de orientación (Gustavo Caro, I Ciclo, 2026).
// Fuente: calendario "ORIENTACIÓN PREKINDER / 4° BÁSICO 2026".

export type OrientationWeeklySlot = {
  day: 1 | 2 | 3 | 4 | 5; // 1 = lunes … 5 = viernes
  dayName: "Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes";
  start: string;
  end: string;
  course: string;
  owner: string;
};

const GUSTAVO = "Gustavo Caro";

export const ORIENTATION_WEEKLY_SLOTS: OrientationWeeklySlot[] = [
  // Lunes
  { day: 1, dayName: "Lunes", start: "10:45", end: "11:30", course: "Kínder B", owner: GUSTAVO },
  { day: 1, dayName: "Lunes", start: "11:45", end: "12:30", course: "1° Básico A", owner: GUSTAVO },
  { day: 1, dayName: "Lunes", start: "12:30", end: "13:15", course: "3° Básico A", owner: GUSTAVO },
  { day: 1, dayName: "Lunes", start: "14:00", end: "14:45", course: "4° Básico A", owner: GUSTAVO },
  // Martes
  { day: 2, dayName: "Martes", start: "11:45", end: "12:30", course: "2° Básico B", owner: GUSTAVO },
  { day: 2, dayName: "Martes", start: "12:15", end: "13:15", course: "Prekínder B", owner: GUSTAVO },
  { day: 2, dayName: "Martes", start: "14:00", end: "14:45", course: "4° Básico B", owner: GUSTAVO },
  // Miércoles
  { day: 3, dayName: "Miércoles", start: "12:15", end: "13:15", course: "Prekínder C", owner: GUSTAVO },
  { day: 3, dayName: "Miércoles", start: "14:00", end: "14:45", course: "1° Básico B", owner: GUSTAVO },
  // Jueves
  { day: 4, dayName: "Jueves", start: "12:15", end: "13:15", course: "Kínder A", owner: GUSTAVO },
  { day: 4, dayName: "Jueves", start: "14:00", end: "14:45", course: "3° Básico B", owner: GUSTAVO },
  // Viernes
  { day: 5, dayName: "Viernes", start: "08:55", end: "09:40", course: "Prekínder A", owner: GUSTAVO },
  { day: 5, dayName: "Viernes", start: "10:00", end: "10:45", course: "2° Básico A", owner: GUSTAVO },
  { day: 5, dayName: "Viernes", start: "11:45", end: "12:30", course: "Kínder C", owner: GUSTAVO },
];

const pad = (value: number) => String(value).padStart(2, "0");

export const toISODate = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

// Lunes de la semana a la que pertenece la fecha dada.
export const mondayOfWeek = (date: Date) => {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const weekday = result.getDay(); // 0 = domingo
  const offset = weekday === 0 ? -6 : 1 - weekday;
  result.setDate(result.getDate() + offset);
  return result;
};

export const slotDateISO = (slot: OrientationWeeklySlot, monday: Date) => {
  const date = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate());
  date.setDate(date.getDate() + (slot.day - 1));
  return toISODate(date);
};

export type ScheduledOrientationClass = { slot: OrientationWeeklySlot; date: string };

// Clases agendadas entre hoy y `days` días hacia adelante, en orden cronológico.
export const upcomingOrientationClasses = (from: Date, days: number): ScheduledOrientationClass[] => {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const result: ScheduledOrientationClass[] = [];
  for (let offset = 0; offset < days; offset += 1) {
    const day = new Date(start.getFullYear(), start.getMonth(), start.getDate() + offset);
    const weekday = day.getDay();
    ORIENTATION_WEEKLY_SLOTS.filter((slot) => slot.day === weekday).forEach((slot) => {
      result.push({ slot, date: toISODate(day) });
    });
  }
  return result.sort((a, b) => `${a.date} ${a.slot.start}`.localeCompare(`${b.date} ${b.slot.start}`));
};
