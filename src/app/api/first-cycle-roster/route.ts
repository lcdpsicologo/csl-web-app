import { NextResponse } from "next/server";
import mammoth from "mammoth";
import { authenticateRequest, getAuthClient } from "@/lib/gemini";
import { parseFirstCycleRosterHtml } from "@/lib/first-cycle-roster";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export async function POST(request: Request) {
  const authClient = getAuthClient();
  if (!authClient) {
    return NextResponse.json({ error: "Supabase Auth no esta configurado." }, { status: 503 });
  }

  const auth = await authenticateRequest(request, authClient);
  if ("error" in auth) return auth.error;

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Adjunta un archivo Word .docx con la nomina oficial." }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "El archivo supera el maximo permitido de 4 MB." }, { status: 413 });
  }
  if (!file.name.toLowerCase().endsWith(".docx")) {
    return NextResponse.json({ error: "Por ahora esta correccion usa el Word oficial en formato .docx." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const html = await mammoth.convertToHtml({ buffer });
    const parsed = parseFirstCycleRosterHtml(html.value || "");
    if (parsed.students.length < 50) {
      return NextResponse.json(
        { error: "No pude leer suficientes estudiantes desde el Word. Revisa que sea la nomina oficial con tablas por curso." },
        { status: 422 }
      );
    }
    return NextResponse.json({ ok: true, ...parsed });
  } catch (error) {
    console.error("first-cycle roster parse failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo procesar la nomina." },
      { status: 500 }
    );
  }
}
