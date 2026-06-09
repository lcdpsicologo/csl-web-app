import { NextResponse } from "next/server";
import { eventsForDay } from "@/lib/ical-parser";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { url?: string; date?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }
  const url = (body.url || "").trim();
  if (!url) return NextResponse.json({ error: "Falta la URL iCal" }, { status: 400 });
  if (!/^(https?|webcal):\/\//i.test(url)) {
    return NextResponse.json({ error: "URL inválida (debe empezar con https:// o webcal://)" }, { status: 400 });
  }

  const reference = body.date ? new Date(body.date) : new Date();
  if (Number.isNaN(reference.getTime())) {
    return NextResponse.json({ error: "Fecha inválida" }, { status: 400 });
  }

  let icsText: string;
  try {
    const fetchUrl = url.replace(/^webcal:/i, "https:");
    const res = await fetch(fetchUrl, {
      headers: { accept: "text/calendar, text/plain;q=0.9, */*;q=0.5" },
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `No se pudo descargar el calendario (HTTP ${res.status}). Verifica que la URL sea correcta y pública.` },
        { status: 502 },
      );
    }
    icsText = await res.text();
  } catch (err) {
    return NextResponse.json(
      { error: `Error al descargar el calendario: ${err instanceof Error ? err.message : String(err)}` },
      { status: 502 },
    );
  }

  if (!icsText.includes("BEGIN:VCALENDAR")) {
    return NextResponse.json(
      { error: "La respuesta no parece un archivo iCal válido (no contiene BEGIN:VCALENDAR)." },
      { status: 502 },
    );
  }

  try {
    const events = eventsForDay(icsText, reference).map((ev) => ({
      summary: ev.summary,
      description: ev.description,
      location: ev.location,
      start: ev.start.toISOString(),
      end: ev.end.toISOString(),
      allDay: ev.allDay,
      url: ev.url,
    }));
    return NextResponse.json({
      ok: true,
      count: events.length,
      events,
      fetchedAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Error parseando iCal: ${err instanceof Error ? err.message : String(err)}` },
      { status: 502 },
    );
  }
}
