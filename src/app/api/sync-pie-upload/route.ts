import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";

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

type DataRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: string;
};

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const cleanRut = (r: string) => String(r || "").replace(/[^0-9kK]/g, "").toUpperCase();

const normalizeCourseName = (courseCode: string) => {
  const code = (courseCode || "").trim().toUpperCase();
  if (!code) return "Sin curso";
  
  if (code.startsWith("1PK")) {
    const sec = code.slice(3);
    return `Prekínder ${sec}`;
  }
  if (code.startsWith("1K")) {
    const sec = code.slice(2);
    return `Kínder ${sec}`;
  }
  const basMatch = code.match(/^(\d)EB([A-Z])$/);
  if (basMatch) {
    const grade = basMatch[1];
    const sec = basMatch[2];
    return `${grade}° Básico ${sec}`;
  }
  if (code === "IEMA") return "I° Medio A";
  if (code === "IEMB") return "I° Medio B";
  if (code === "IIEMA") return "II° Medio A";
  if (code === "IIEMB") return "II° Medio B";
  if (code === "IIIEMA") return "III° Medio A";
  if (code === "IIITPB" || code === "IIITP") return "III° Medio B";
  if (code === "IVEMA") return "IV° Medio A";
  if (code === "IVTPB" || code === "IVTP") return "IV° Medio B";
  
  return courseCode;
};

export async function POST(request: Request) {
  try {
    const passcode = request.headers.get("x-sync-passcode");
    if (passcode !== "tiza-pie-2026") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Missing Supabase URL or Service Role Key on server" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });

    // 1. Ensure Institution
    let { data: inst, error: instErr } = await supabase
      .from("institutions")
      .select("id")
      .eq("slug", "colegio-san-lucas")
      .maybeSingle();

    if (instErr) throw instErr;

    let instId = inst?.id;
    if (!instId) {
      const { data: newInst, error: newInstErr } = await supabase
        .from("institutions")
        .insert({ name: "Colegio San Lucas", slug: "colegio-san-lucas" })
        .select("id")
        .single();
      if (newInstErr) throw newInstErr;
      instId = newInst.id;
    }

    // 2. Fetch User Profile
    const { data: profiles, error: profErr } = await supabase
      .from("profiles")
      .select("id")
      .eq("institution_id", instId)
      .limit(1);

    if (profErr) throw profErr;
    const userId = profiles?.[0]?.id || null;

    // 3. Fetch Existing Students
    const { data: dbRecords, error: dbErr } = await supabase
      .from("app_records")
      .select("record_id, data, created_at, updated_at")
      .eq("institution_id", instId)
      .eq("entity", "students");

    if (dbErr) throw dbErr;

    const existingStudents: DataRecord[] = (dbRecords || []).map((row) => ({
      id: row.record_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      ...row.data,
    }));

    // 4. Read Binary File
    const arrayBuffer = await request.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(buffer, { type: "array" });

    const sheetsToParse = [
      { name: "Cupos PIE", label: "Cupos" },
      { name: "Sobrecupos ", label: "Sobrecupos" },
      { name: "PENDIENTES- SC", label: "Pendientes" }
    ];

    const excelStudents: any[] = [];

    sheetsToParse.forEach(({ name: sheetName, label }) => {
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) return;
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
      if (!rows || rows.length === 0) return;

      rows.forEach((row, idx) => {
        if (idx === 0 || !row || row.length < 8) return;
        const sName = row[6];
        const sRut = row[4];
        const sCourse = row[2];
        const sDiag = row[9];
        const sSit = row[10];
        const sProf = row[8];

        if (typeof sName === "string" && sName.trim() && sName !== "NOMBRE" && sName !== "NOMBRE ") {
          excelStudents.push({
            name: sName.trim(),
            rut: typeof sRut === "string" ? sRut.trim() : String(sRut || ""),
            course: normalizeCourseName(typeof sCourse === "string" ? sCourse : String(sCourse || "")),
            diag: typeof sDiag === "string" ? sDiag.trim() : String(sDiag || ""),
            situacionTecnica: typeof sSit === "string" ? sSit.trim() : String(sSit || ""),
            professional: typeof sProf === "string" ? sProf.trim() : String(sProf || ""),
            sourceSheet: label
          });
        }
      });
    });

    let updatedCount = 0;
    let createdCount = 0;

    const currentStudents = [...existingStudents];
    const upsertRows: any[] = [];

    excelStudents.forEach((excelStudent) => {
      let existingIndex = currentStudents.findIndex((s) => {
        const eRut = cleanRut(s.rut);
        const xRut = cleanRut(excelStudent.rut);
        if (eRut && xRut && eRut === xRut) return true;
        return normalizeText(s.fullName || "") === normalizeText(excelStudent.name);
      });

      const pieDiagText = `Programa de Integración Escolar (PIE). Diagnóstico: ${excelStudent.diag} (${excelStudent.situacionTecnica}). Profesional asignado: ${excelStudent.professional}.`;

      if (existingIndex >= 0) {
        const existing = currentStudents[existingIndex];
        const tagsList = (existing.tags || "").split(",").map((t) => t.trim()).filter(Boolean);
        if (!tagsList.includes("PIE")) {
          tagsList.push("PIE");
        }
        
        const updatedStudent = {
          ...existing,
          tags: tagsList.join(", "),
          supportNeeds: pieDiagText,
          updatedAt: new Date().toISOString()
        };
        
        currentStudents[existingIndex] = updatedStudent;
        
        const data = Object.fromEntries(
          Object.entries(updatedStudent).filter(([key]) => !["id", "createdAt", "updatedAt"].includes(key))
        );
        
        upsertRows.push({
          institution_id: instId,
          entity: "students",
          record_id: updatedStudent.id,
          data,
          updated_by: userId || null,
          created_at: existing.createdAt || new Date().toISOString(),
          updated_at: updatedStudent.updatedAt
        });
        
        updatedCount++;
      } else {
        const newId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const now = new Date().toISOString();
        const newStudent = {
          id: newId,
          createdAt: now,
          updatedAt: now,
          fullName: excelStudent.name,
          course: excelStudent.course,
          rut: excelStudent.rut,
          tags: "PIE",
          relevantInfo: `Estudiante cargado desde la Nómina Oficial PIE 2026 (${excelStudent.sourceSheet}).`,
          supportNeeds: pieDiagText,
          strengths: "",
          healthAlerts: "",
          notes: "",
          observations: "",
          genogram: "[]"
        };
        
        currentStudents.push(newStudent);
        
        const data = Object.fromEntries(
          Object.entries(newStudent).filter(([key]) => !["id", "createdAt", "updatedAt"].includes(key))
        );
        
        upsertRows.push({
          institution_id: instId,
          entity: "students",
          record_id: newStudent.id,
          data,
          created_by: userId || null,
          updated_by: userId || null,
          created_at: now,
          updated_at: now
        });
        
        createdCount++;
      }
    });

    // Upsert to Supabase in chunks of 50
    const chunkSize = 50;
    for (let i = 0; i < upsertRows.length; i += chunkSize) {
      const chunk = upsertRows.slice(i, i + chunkSize);
      const { error: upsertError } = await supabase
        .from("app_records")
        .upsert(chunk, { onConflict: "institution_id,entity,record_id" });

      if (upsertError) throw upsertError;
    }

    return NextResponse.json({
      success: true,
      updated: updatedCount,
      created: createdCount,
      totalParsed: excelStudents.length,
      institutionId: instId
    });
  } catch (error: any) {
    console.error("Sync API error:", error);
    return NextResponse.json({
      error: error?.message || "Sync failed",
      details: error?.details || null,
      hint: error?.hint || null,
      code: error?.code || null,
      errorObject: JSON.stringify(error)
    }, { status: 500 });
  }
}
