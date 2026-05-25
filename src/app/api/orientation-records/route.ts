import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type OrientationRecord = {
  id: number;
  sem: string;
  date: string;
  cycle: string;
  course: string;
  action: string;
  topic: string;
  status: string;
  observations: string;
  evidenceLink: string;
  planningLink: string;
};

type OrientationRecordRow = {
  id: number;
  sem: string | null;
  date: string;
  cycle: string;
  course: string;
  action: string;
  topic: string | null;
  status: string;
  observations: string | null;
  evidence_link: string | null;
  planning_link: string | null;
};

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

const getSupabaseClient = () => {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return null;
  return createClient(url, key, {
    auth: {
      persistSession: false,
    },
  });
};

const toClientRecord = (row: OrientationRecordRow): OrientationRecord => ({
  id: row.id,
  sem: row.sem || "",
  date: row.date,
  cycle: row.cycle,
  course: row.course,
  action: row.action,
  topic: row.topic || "",
  status: row.status,
  observations: row.observations || "",
  evidenceLink: row.evidence_link || "",
  planningLink: row.planning_link || "",
});

const toDatabaseRow = (record: OrientationRecord) => ({
  id: record.id,
  sem: record.sem,
  date: record.date,
  cycle: record.cycle,
  course: record.course,
  action: record.action,
  topic: record.topic,
  status: record.status,
  observations: record.observations,
  evidence_link: record.evidenceLink,
  planning_link: record.planningLink,
});

export async function GET() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json({
      records: INITIAL_ORIENTATION_RECORDS,
      persistent: false,
      backend: "local",
    });
  }

  try {
    const { data, error } = await supabase
      .from("orientation_records")
      .select("id, sem, date, cycle, course, action, topic, status, observations, evidence_link, planning_link")
      .order("date", { ascending: false })
      .order("id", { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      records: data?.map(toClientRecord) || INITIAL_ORIENTATION_RECORDS,
      persistent: true,
      backend: "supabase",
    });
  } catch (error) {
    return NextResponse.json({
      records: INITIAL_ORIENTATION_RECORDS,
      persistent: false,
      backend: "local",
      error: error instanceof Error ? error.message : "Unable to load Supabase records",
    }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  const body = await request.json();
  const records = Array.isArray(body.records) ? body.records : null;

  if (!records) {
    return NextResponse.json({ error: "records must be an array" }, { status: 400 });
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, persistent: false, backend: "local" }, { status: 503 });
  }

  try {
    const typedRecords = records as OrientationRecord[];
    const { error } = await supabase
      .from("orientation_records")
      .upsert(typedRecords.map(toDatabaseRow), { onConflict: "id" });

    if (error) throw error;

    const incomingIds = typedRecords.map((record) => record.id);
    const deleteQuery = supabase.from("orientation_records").delete();
    const { error: deleteError } = incomingIds.length > 0
      ? await deleteQuery.not("id", "in", `(${incomingIds.join(",")})`)
      : await deleteQuery.gt("id", 0);

    if (deleteError) throw deleteError;

    return NextResponse.json({ ok: true, persistent: true, backend: "supabase" });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      persistent: false,
      backend: "local",
      error: error instanceof Error ? error.message : "Unable to save Supabase records",
    }, { status: 503 });
  }
}
