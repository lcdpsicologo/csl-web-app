import { NextResponse } from "next/server";

const STORAGE_KEY = "csl:orientation-records";

const INITIAL_ORIENTATION_RECORDS = [
  {
    id: 1,
    sem: "18/05 al 22/05 (Semana 12)",
    date: "2026-05-19",
    cycle: "1° Ciclo",
    course: "Pre Kinder B",
    action: "Hago las cosas bien",
    topic: "Sesión 4",
    status: "Realizado",
    observations: "La araña hacendosa",
    evidenceLink: "https://canva.link/x83vxwd4h45p6gb",
    planningLink: "https://drive.google.com/",
  },
  {
    id: 2,
    sem: "18/05 al 22/05 (Semana 12)",
    date: "2026-05-20",
    cycle: "1° Ciclo",
    course: "Pre Kinder C",
    action: "Hago las cosas bien",
    topic: "Sesión 4",
    status: "Realizado",
    observations: "La araña hacendosa",
    evidenceLink: "https://canva.link/x83vxwd4h45p6gb",
    planningLink: "https://drive.google.com/",
  },
  {
    id: 3,
    sem: "18/05 al 22/05 (Semana 12)",
    date: "2026-05-21",
    cycle: "1° Ciclo",
    course: "Kinder A",
    action: "Hago las cosas bien",
    topic: "Sesión 3",
    status: "Pendiente",
    observations: "El desorden de Franklin",
    evidenceLink: "https://canva.link/i4asqi5qao0qr9t",
    planningLink: "",
  },
  {
    id: 4,
    sem: "18/05 al 22/05 (Semana 12)",
    date: "2026-05-22",
    cycle: "1° Ciclo",
    course: "Kinder C",
    action: "Intervención Formativa",
    topic: "Sesión 1",
    status: "Realizado",
    observations: "Kinder C juega con cuidado y buen trato",
    evidenceLink: "https://canva.link/la4qtzcfajo6rcc",
    planningLink: "https://drive.google.com/",
  },
  {
    id: 5,
    sem: "18/05 al 22/05 (Semana 12)",
    date: "2026-05-18",
    cycle: "1° Ciclo",
    course: "1° Básico A",
    action: "Intervención Formativa",
    topic: "Sesión 1",
    status: "Realizado",
    observations: "Devolución de prueba DIA socioemocional",
    evidenceLink: "https://canva.link/y860v75hqwkhdd4p",
    planningLink: "https://drive.google.com/",
  },
  {
    id: 6,
    sem: "18/05 al 22/05 (Semana 12)",
    date: "2026-05-22",
    cycle: "1° Ciclo",
    course: "2° Básico A",
    action: "Intervención Formativa",
    topic: "Sesión 1",
    status: "Pendiente",
    observations: "Devolución de prueba DIA socioemocional",
    evidenceLink: "https://canva.link/e75srmdmto1vsms",
    planningLink: "",
  },
  {
    id: 7,
    sem: "18/05 al 22/05 (Semana 12)",
    date: "2026-05-18",
    cycle: "1° Ciclo",
    course: "4° Básico A",
    action: "Intervención Formativa",
    topic: "Sesión 1",
    status: "Realizado",
    observations: "Devolución de prueba DIA socioemocional. Durante la clase acompaña Subdirectora Valeska, Profesora Catalina y Orientador.",
    evidenceLink: "https://canva.link/irg9u9ntpra8vyp",
    planningLink: "https://drive.google.com/",
  },
];

const getKvConfig = () => {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;
  return { token, url: url.replace(/\/$/, "") };
};

const kvRequest = async (command: string[]) => {
  const config = getKvConfig();
  if (!config) return null;

  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`KV request failed with status ${response.status}`);
  }

  return response.json() as Promise<{ result: unknown }>;
};

export async function GET() {
  try {
    const kvResponse = await kvRequest(["GET", STORAGE_KEY]);
    const storedRecords = kvResponse?.result;

    return NextResponse.json({
      records: storedRecords ? JSON.parse(String(storedRecords)) : INITIAL_ORIENTATION_RECORDS,
      persistent: Boolean(getKvConfig()),
    });
  } catch {
    return NextResponse.json({
      records: INITIAL_ORIENTATION_RECORDS,
      persistent: false,
    });
  }
}

export async function PUT(request: Request) {
  const body = await request.json();
  const records = Array.isArray(body.records) ? body.records : null;

  if (!records) {
    return NextResponse.json({ error: "records must be an array" }, { status: 400 });
  }

  try {
    await kvRequest(["SET", STORAGE_KEY, JSON.stringify(records)]);
    return NextResponse.json({ ok: true, persistent: Boolean(getKvConfig()) });
  } catch {
    return NextResponse.json({ ok: false, persistent: false }, { status: 503 });
  }
}
