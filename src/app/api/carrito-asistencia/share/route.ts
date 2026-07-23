import { NextResponse } from "next/server";
import { authenticateRequest, getAuthClient } from "@/lib/gemini";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authClient = getAuthClient();
  if (!authClient) return NextResponse.json({ error: "Supabase no está configurado" }, { status: 503 });

  const auth = await authenticateRequest(request, authClient);
  if ("error" in auth) return auth.error;

  const password = process.env.ATTENDANCE_CART_SHARE_PASSWORD;
  if (!password) {
    return NextResponse.json({ error: "El acceso para compartir no está configurado" }, { status: 503 });
  }

  const url = `${new URL(request.url).origin}/carrito-asistencia`;
  const text = [
    "¡Hola! Te comparto el acceso al Carrito de la Asistencia del Colegio San Lucas.",
    "",
    `Clave: ${password}`,
    "",
    "Uso exclusivo del equipo autorizado.",
  ].join("\n");
  const clipboardText = [
    "¡Hola! Te comparto el acceso al Carrito de la Asistencia del Colegio San Lucas.",
    "",
    `Enlace: ${url}`,
    `Clave: ${password}`,
    "",
    "Uso exclusivo del equipo autorizado.",
  ].join("\n");

  return NextResponse.json({
    title: "Carrito de la Asistencia",
    url,
    text,
    clipboardText,
  });
}
