// Minimal iCalendar (RFC 5545) parser focused on extracting today's events.
// Handles VEVENT blocks, line unfolding, DTSTART/DTEND, all-day vs timed,
// SUMMARY/DESCRIPTION/LOCATION/URL, and the common subset of RRULE
// (FREQ=DAILY/WEEKLY/MONTHLY/YEARLY with INTERVAL, BYDAY for WEEKLY).

export type ParsedEvent = {
  summary: string;
  description: string;
  location: string;
  start: Date;
  end: Date;
  allDay: boolean;
  url?: string;
};

const unescape = (value: string) =>
  value
    .replace(/\\n/g, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");

const unfoldLines = (text: string): string[] => {
  // Per RFC 5545, lines starting with whitespace continue the previous line.
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  for (const line of lines) {
    if (out.length > 0 && (line.startsWith(" ") || line.startsWith("\t"))) {
      out[out.length - 1] += line.slice(1);
    } else {
      out.push(line);
    }
  }
  return out;
};

const parseLine = (line: string): { name: string; params: Record<string, string>; value: string } | null => {
  const colonIdx = line.indexOf(":");
  if (colonIdx < 0) return null;
  const head = line.slice(0, colonIdx);
  const value = line.slice(colonIdx + 1);
  const parts = head.split(";");
  const name = parts[0].toUpperCase();
  const params: Record<string, string> = {};
  for (let i = 1; i < parts.length; i += 1) {
    const eq = parts[i].indexOf("=");
    if (eq < 0) continue;
    params[parts[i].slice(0, eq).toUpperCase()] = parts[i].slice(eq + 1);
  }
  return { name, params, value };
};

const getSantiagoDate = (Y: number, Mo: number, D: number, H: number, Mi: number, S: number, Ms: number = 0) => {
  const dateUtc = new Date(Date.UTC(Y, Mo, D, H, Mi, S, Ms));
  const locString = dateUtc.toLocaleString("en-US", { timeZone: "America/Santiago" });
  const locDate = new Date(locString);
  const utcDate = new Date(dateUtc.toLocaleString("en-US", { timeZone: "UTC" }));
  const offsetMinutes = (locDate.getTime() - utcDate.getTime()) / (60 * 1000);
  return new Date(dateUtc.getTime() - offsetMinutes * 60 * 1000);
};

const getSantiagoDateParts = (d: Date) => {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Santiago",
    hour12: false,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit"
  });
  const parts = fmt.formatToParts(d);
  const y = parseInt(parts.find(p => p.type === "year")!.value, 10);
  const m = parseInt(parts.find(p => p.type === "month")!.value, 10) - 1;
  const dVal = parseInt(parts.find(p => p.type === "day")!.value, 10);
  const h = parseInt(parts.find(p => p.type === "hour")!.value, 10);
  const mi = parseInt(parts.find(p => p.type === "minute")!.value, 10);
  const s = parseInt(parts.find(p => p.type === "second")!.value, 10);
  return { y, m, d: dVal, h, mi, s };
};

// Parse "20260609T140000Z" or "20260609T140000" or "20260609"
const parseDateValue = (raw: string, params: Record<string, string>): { date: Date; allDay: boolean } | null => {
  const val = raw.trim();
  if (params.VALUE === "DATE" || /^\d{8}$/.test(val)) {
    const y = parseInt(val.slice(0, 4), 10);
    const m = parseInt(val.slice(4, 6), 10) - 1;
    const d = parseInt(val.slice(6, 8), 10);
    // Parse at 00:00:00 in America/Santiago to avoid day shifting on the client
    return { date: getSantiagoDate(y, m, d, 0, 0, 0), allDay: true };
  }
  const m = val.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)$/);
  if (!m) return null;
  const [, yy, mm, dd, hh, mi, ss, z] = m;
  const Y = parseInt(yy, 10);
  const Mo = parseInt(mm, 10) - 1;
  const D = parseInt(dd, 10);
  const H = parseInt(hh, 10);
  const Mi = parseInt(mi, 10);
  const S = parseInt(ss, 10);
  if (z === "Z") return { date: new Date(Date.UTC(Y, Mo, D, H, Mi, S)), allDay: false };
  // Treat as America/Santiago local time when no Z.
  return { date: getSantiagoDate(Y, Mo, D, H, Mi, S), allDay: false };
};

type RawEvent = {
  summary: string;
  description: string;
  location: string;
  url?: string;
  dtstart?: { date: Date; allDay: boolean };
  dtend?: { date: Date; allDay: boolean };
  rrule?: Record<string, string>;
  exdates: Date[];
};

const sameDayLocal = (a: Date, b: Date) => {
  const ap = getSantiagoDateParts(a);
  const bp = getSantiagoDateParts(b);
  return ap.y === bp.y && ap.m === bp.m && ap.d === bp.d;
};

const startOfDay = (d: Date) => {
  const p = getSantiagoDateParts(d);
  return getSantiagoDate(p.y, p.m, p.d, 0, 0, 0);
};

const endOfDay = (d: Date) => {
  const p = getSantiagoDateParts(d);
  return getSantiagoDate(p.y, p.m, p.d, 23, 59, 59, 999);
};

const BYDAY_MAP: Record<string, number> = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };

// Compute concrete occurrences of an RRULE that fall on or near `target`.
// Supports FREQ=DAILY|WEEKLY|MONTHLY|YEARLY with INTERVAL and BYDAY (weekly).
const expandRRule = (ev: RawEvent, target: Date): Date[] => {
  if (!ev.rrule || !ev.dtstart) return [];
  const rule = ev.rrule;
  const freq = rule.FREQ;
  if (!freq) return [];
  const interval = Math.max(1, parseInt(rule.INTERVAL || "1", 10));
  const until = rule.UNTIL ? parseDateValue(rule.UNTIL, {})?.date : undefined;
  const count = rule.COUNT ? parseInt(rule.COUNT, 10) : undefined;
  const start = ev.dtstart.date;

  if (target < start) return [];
  if (until && target > until) return [];

  const matchesByDay = (d: Date) => {
    if (!rule.BYDAY) return true;
    const days = rule.BYDAY.split(",").map((s) => s.replace(/^[+-]?\d+/, "").trim()).filter(Boolean);
    return days.includes(Object.keys(BYDAY_MAP).find((k) => BYDAY_MAP[k] === d.getDay()) || "");
  };

  let n = 0;
  const out: Date[] = [];

  if (freq === "DAILY") {
    const diffDays = Math.floor((startOfDay(target).getTime() - startOfDay(start).getTime()) / 86400000);
    if (diffDays < 0 || diffDays % interval !== 0) return [];
    if (count !== undefined && diffDays / interval >= count) return [];
    const occ = new Date(start);
    occ.setDate(occ.getDate() + diffDays);
    if (!ev.exdates.some((ex) => sameDayLocal(ex, occ))) out.push(occ);
  } else if (freq === "WEEKLY") {
    // Walk weeks from start; for each week check BYDAY (or DOW of start).
    const startSod = startOfDay(start);
    const targetSod = startOfDay(target);
    const weeksDiff = Math.floor((targetSod.getTime() - startSod.getTime()) / (7 * 86400000));
    if (weeksDiff < 0 || weeksDiff % interval !== 0) return [];
    if (count !== undefined && weeksDiff >= count * (rule.BYDAY ? rule.BYDAY.split(",").length : 1)) return [];
    if (matchesByDay(target)) {
      const sp = getSantiagoDateParts(start);
      const tp = getSantiagoDateParts(target);
      const occ = getSantiagoDate(tp.y, tp.m, tp.d, sp.h, sp.mi, sp.s);
      if (!ev.exdates.some((ex) => sameDayLocal(ex, occ))) out.push(occ);
    }
  } else if (freq === "MONTHLY") {
    const monthsDiff = (target.getFullYear() - start.getFullYear()) * 12 + (target.getMonth() - start.getMonth());
    if (monthsDiff < 0 || monthsDiff % interval !== 0) return [];
    if (count !== undefined && monthsDiff / interval >= count) return [];
    if (target.getDate() === start.getDate()) {
      const sp = getSantiagoDateParts(start);
      const tp = getSantiagoDateParts(target);
      const occ = getSantiagoDate(tp.y, tp.m, tp.d, sp.h, sp.mi, sp.s);
      if (!ev.exdates.some((ex) => sameDayLocal(ex, occ))) out.push(occ);
    }
  } else if (freq === "YEARLY") {
    const yearsDiff = target.getFullYear() - start.getFullYear();
    if (yearsDiff < 0 || yearsDiff % interval !== 0) return [];
    if (count !== undefined && yearsDiff / interval >= count) return [];
    if (target.getMonth() === start.getMonth() && target.getDate() === start.getDate()) {
      const sp = getSantiagoDateParts(start);
      const tp = getSantiagoDateParts(target);
      const occ = getSantiagoDate(tp.y, tp.m, tp.d, sp.h, sp.mi, sp.s);
      if (!ev.exdates.some((ex) => sameDayLocal(ex, occ))) out.push(occ);
    }
  }

  n += 1;
  void n;
  return out;
};

export const eventsForDay = (icsText: string, day: Date): ParsedEvent[] => {
  const lines = unfoldLines(icsText);
  const events: RawEvent[] = [];
  let current: RawEvent | null = null;
  let inEvent = false;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      inEvent = true;
      current = { summary: "", description: "", location: "", exdates: [] };
      continue;
    }
    if (line === "END:VEVENT") {
      if (current) events.push(current);
      current = null;
      inEvent = false;
      continue;
    }
    if (!inEvent || !current) continue;
    const p = parseLine(line);
    if (!p) continue;
    switch (p.name) {
      case "SUMMARY": current.summary = unescape(p.value); break;
      case "DESCRIPTION": current.description = unescape(p.value); break;
      case "LOCATION": current.location = unescape(p.value); break;
      case "URL": current.url = p.value; break;
      case "DTSTART": {
        const d = parseDateValue(p.value, p.params);
        if (d) current.dtstart = d;
        break;
      }
      case "DTEND": {
        const d = parseDateValue(p.value, p.params);
        if (d) current.dtend = d;
        break;
      }
      case "RRULE": {
        const map: Record<string, string> = {};
        p.value.split(";").forEach((tok) => {
          const eq = tok.indexOf("=");
          if (eq > 0) map[tok.slice(0, eq).toUpperCase()] = tok.slice(eq + 1);
        });
        current.rrule = map;
        break;
      }
      case "EXDATE": {
        const d = parseDateValue(p.value, p.params);
        if (d) current.exdates.push(d.date);
        break;
      }
      default: break;
    }
  }

  const dayStart = startOfDay(day);
  const dayEnd = endOfDay(day);
  const hits: ParsedEvent[] = [];

  for (const ev of events) {
    if (!ev.dtstart) continue;
    const occurrences: Date[] = [];
    if (ev.rrule) {
      occurrences.push(...expandRRule(ev, day));
    } else {
      const evStart = ev.dtstart.date;
      const evEnd = ev.dtend?.date || new Date(evStart.getTime() + 60 * 60 * 1000);
      // Event overlaps today
      if (evStart <= dayEnd && evEnd >= dayStart) {
        occurrences.push(evStart);
      }
    }

    const duration = ev.dtend ? ev.dtend.date.getTime() - ev.dtstart.date.getTime() : 60 * 60 * 1000;

    for (const occStart of occurrences) {
      const occEnd = new Date(occStart.getTime() + duration);
      hits.push({
        summary: ev.summary || "(sin título)",
        description: ev.description || "",
        location: ev.location || "",
        start: occStart,
        end: occEnd,
        allDay: ev.dtstart.allDay,
        url: ev.url,
      });
    }
  }

  hits.sort((a, b) => a.start.getTime() - b.start.getTime());
  return hits;
};
