import { NextResponse } from "next/server";
import { getAuthClient, authenticateRequest } from "@/lib/gemini";
import { findClassPlan, plansForCourse, ORIENTATION_PLAN_SUMMARY } from "@/lib/orientation-class-plans";

export const maxDuration = 15;
export const dynamic = "force-dynamic";

// Sirve la planificación de UNA clase bajo demanda. El módulo de datos pesa
// ~1.5 MB y vive solo en el servidor: así el navegador descarga ~4 KB al abrir
// el modal en lugar de cargarlo entero en cada visita.

export async function GET(request: Request) {
  const authClient = getAuthClient();
  if (!authClient) {
    return NextResponse.json({ error: "Supabase no está configurado" }, { status: 503 });
  }
  const auth = await authenticateRequest(request, authClient);
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(request.url);
  const course = (searchParams.get("course") || "").trim();
  const topic = (searchParams.get("topic") || "").trim();

  if (!course) {
    return NextResponse.json({ error: "Falta el curso" }, { status: 400 });
  }

  // Sin tema: devuelve el índice del curso (para elegir de una lista).
  if (!topic) {
    const plans = plansForCourse(course).map((plan) => ({
      order: plan.order,
      block: plan.block,
      strength: plan.strength,
      number: plan.number,
      title: plan.title,
      microObjective: plan.microObjective,
    }));
    return NextResponse.json({ ok: true, course, plans, summary: ORIENTATION_PLAN_SUMMARY });
  }

  const plan = findClassPlan(course, topic);
  if (!plan) {
    return NextResponse.json({
      ok: true,
      plan: null,
      // Ayuda a elegir manualmente cuando el tema de la bitácora no calza.
      suggestions: plansForCourse(course).slice(0, 40).map((item) => ({
        order: item.order,
        title: item.title,
        strength: item.strength,
      })),
    });
  }

  return NextResponse.json({ ok: true, plan });
}
