import { NextResponse } from "next/server";
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

const ELIGIBLE_COURSES = new Set([
  "Prekínder A",
  "Prekínder B",
  "Prekínder C",
  "Kínder A",
  "Kínder B",
  "Kínder C",
  "1° Básico A",
  "1° Básico B",
]);

type StudentRecord = {
  id: string;
  fullName: string;
  course: string;
  profilePhoto?: string;
};

const normalizeSupabaseUrl = (url: string) =>
  url.replace(/\/(rest|auth)\/v1\/?$/, "").replace(/\/$/, "");

const getAdminClient = () => {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!rawUrl || !key) return null;
  return createClient(normalizeSupabaseUrl(rawUrl), key, { auth: { persistSession: false } });
};

const getAuthClient = () => {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!rawUrl || !key) return null;
  return createClient(normalizeSupabaseUrl(rawUrl), key, { auth: { persistSession: false } });
};

const authenticate = async (request: Request, supabase: SupabaseClient) => {
  const [scheme, token] = (request.headers.get("authorization") || "").split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return { error: NextResponse.json({ error: "Debes iniciar sesión" }, { status: 401 }) } as const;
  }
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return { error: NextResponse.json({ error: "La sesión ya no es válida" }, { status: 401 }) } as const;
  }
  return { user: data.user } as const;
};

const ensureInstitution = async (supabase: SupabaseClient, user: User) => {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("institution_id")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError) throw profileError;
  if (profile?.institution_id) return profile.institution_id as string;

  const { data: institution, error: institutionError } = await supabase
    .from("institutions")
    .select("id")
    .eq("slug", "colegio-san-lucas")
    .single();
  if (institutionError) throw institutionError;

  const { error: upsertError } = await supabase.from("profiles").upsert({
    id: user.id,
    institution_id: institution.id,
    full_name: user.email || "",
    role: "orientacion",
  }, { onConflict: "id" });
  if (upsertError) throw upsertError;
  return institution.id as string;
};

const mondayIso = (value = new Date()) => {
  const date = new Date(value);
  const day = date.getDay();
  date.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
  return date.toISOString().slice(0, 10);
};

const apiError = (error: unknown) => {
  const raw = error instanceof Error
    ? error.message
    : String((error as { message?: string } | null)?.message || error || "Error desconocido");
  const message = raw.includes("attendance_cart_") || raw.includes("schema cache")
    ? "El módulo del carrito todavía no está habilitado en la base de datos. Aplica la migración incluida en el proyecto."
    : raw.includes("TICKETS_INSUFICIENTES")
      ? "El estudiante no tiene tickets suficientes para este premio."
      : raw.includes("PREMIO_AGOTADO")
        ? "El premio está agotado."
        : raw.includes("PREMIO_NO_DISPONIBLE")
          ? "El premio ya no está disponible."
          : raw;
  return NextResponse.json({ error: message }, { status: 500 });
};

const loadStudent = async (admin: SupabaseClient, institutionId: string, studentId: string) => {
  const { data, error } = await admin
    .from("app_records")
    .select("record_id, data")
    .eq("institution_id", institutionId)
    .eq("entity", "students")
    .eq("record_id", studentId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const fields = (data.data || {}) as Record<string, unknown>;
  const student = {
    id: data.record_id,
    fullName: String(fields.fullName || "").trim(),
    course: String(fields.course || "").trim(),
    profilePhoto: String(fields.profilePhoto || ""),
  };
  return ELIGIBLE_COURSES.has(student.course) ? student : null;
};

export async function GET(request: Request) {
  const admin = getAdminClient();
  const authClient = getAuthClient();
  if (!admin || !authClient) {
    return NextResponse.json({ error: "Supabase no está configurado" }, { status: 503 });
  }
  const auth = await authenticate(request, authClient);
  if ("error" in auth) return auth.error;

  try {
    const institutionId = await ensureInstitution(admin, auth.user);
    const [studentsResult, rewardsResult, ticketsResult, inventoryResult, redemptionsResult, profilesResult] = await Promise.all([
      admin.from("app_records").select("record_id, data").eq("institution_id", institutionId).eq("entity", "students"),
      admin.from("attendance_cart_rewards").select("id, name, description, ticket_cost, minimum_stock, active, created_at").eq("institution_id", institutionId).order("ticket_cost").order("name"),
      admin.from("attendance_cart_ticket_ledger").select("id, student_record_id, student_name, course, delta, kind, week_start, note, created_by, created_at").eq("institution_id", institutionId).order("created_at", { ascending: false }).limit(2000),
      admin.from("attendance_cart_inventory_ledger").select("id, reward_id, delta, kind, note, created_by, created_at").eq("institution_id", institutionId).order("created_at", { ascending: false }).limit(2000),
      admin.from("attendance_cart_redemptions").select("id, student_record_id, student_name, course, reward_id, reward_name, tickets_spent, note, created_by, created_at").eq("institution_id", institutionId).order("created_at", { ascending: false }).limit(1000),
      admin.from("profiles").select("id, full_name").eq("institution_id", institutionId),
    ]);

    for (const result of [studentsResult, rewardsResult, ticketsResult, inventoryResult, redemptionsResult, profilesResult]) {
      if (result.error) throw result.error;
    }

    const students = (studentsResult.data || []).flatMap((row) => {
      const fields = (row.data || {}) as Record<string, unknown>;
      const student: StudentRecord = {
        id: row.record_id,
        fullName: String(fields.fullName || "").trim(),
        course: String(fields.course || "").trim(),
        profilePhoto: String(fields.profilePhoto || ""),
      };
      return student.fullName && ELIGIBLE_COURSES.has(student.course) ? [student] : [];
    }).sort((a, b) => a.course.localeCompare(b.course, "es") || a.fullName.localeCompare(b.fullName, "es"));

    const balances = (ticketsResult.data || []).reduce<Record<string, number>>((acc, row) => {
      acc[row.student_record_id] = (acc[row.student_record_id] || 0) + Number(row.delta || 0);
      return acc;
    }, {});
    const stock = (inventoryResult.data || []).reduce<Record<string, number>>((acc, row) => {
      acc[row.reward_id] = (acc[row.reward_id] || 0) + Number(row.delta || 0);
      return acc;
    }, {});
    const actorNames = Object.fromEntries((profilesResult.data || []).map((row) => [row.id, row.full_name || "Colega"]));
    const weeklyAwardedIds = (ticketsResult.data || [])
      .filter((row) => row.kind === "award" && row.week_start === mondayIso())
      .map((row) => row.student_record_id);

    return NextResponse.json({
      students,
      rewards: (rewardsResult.data || []).map((reward) => ({ ...reward, stock: stock[reward.id] || 0 })),
      balances,
      weeklyAwardedIds,
      redemptions: (redemptionsResult.data || []).map((row) => ({
        ...row,
        actor_name: actorNames[row.created_by || ""] || "Colega",
      })),
      inventoryMovements: (inventoryResult.data || []).slice(0, 100).map((row) => ({
        ...row,
        actor_name: actorNames[row.created_by || ""] || "Colega",
      })),
      currentWeekStart: mondayIso(),
      user: { email: auth.user.email || "", id: auth.user.id },
    });
  } catch (error) {
    console.error("Attendance cart load failed", error);
    return apiError(error);
  }
}

export async function POST(request: Request) {
  const admin = getAdminClient();
  const authClient = getAuthClient();
  if (!admin || !authClient) {
    return NextResponse.json({ error: "Supabase no está configurado" }, { status: 503 });
  }
  const auth = await authenticate(request, authClient);
  if ("error" in auth) return auth.error;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  try {
    const institutionId = await ensureInstitution(admin, auth.user);
    const action = String(body.action || "");

    if (action === "award_ticket") {
      const studentId = String(body.studentId || "");
      const student = await loadStudent(admin, institutionId, studentId);
      if (!student) return NextResponse.json({ error: "Estudiante no válido para esta dinámica" }, { status: 400 });
      const weekStart = /^\d{4}-\d{2}-\d{2}$/.test(String(body.weekStart || ""))
        ? String(body.weekStart)
        : mondayIso();
      const { error } = await admin.from("attendance_cart_ticket_ledger").insert({
        institution_id: institutionId,
        student_record_id: student.id,
        student_name: student.fullName,
        course: student.course,
        delta: 1,
        kind: "award",
        week_start: weekStart,
        note: String(body.note || "").slice(0, 500),
        created_by: auth.user.id,
      });
      if (error?.code === "23505") {
        return NextResponse.json({ error: "Este estudiante ya recibió su ticket esta semana" }, { status: 409 });
      }
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }

    if (action === "undo_award_ticket") {
      const studentId = String(body.studentId || "");
      const weekStart = /^\d{4}-\d{2}-\d{2}$/.test(String(body.weekStart || ""))
        ? String(body.weekStart)
        : mondayIso();
      const student = await loadStudent(admin, institutionId, studentId);
      if (!student) return NextResponse.json({ error: "Estudiante no válido para esta dinámica" }, { status: 400 });

      const [{ data: award, error: awardError }, { data: ledger, error: ledgerError }] = await Promise.all([
        admin.from("attendance_cart_ticket_ledger")
          .select("id")
          .eq("institution_id", institutionId)
          .eq("student_record_id", studentId)
          .eq("week_start", weekStart)
          .eq("kind", "award")
          .maybeSingle(),
        admin.from("attendance_cart_ticket_ledger")
          .select("delta")
          .eq("institution_id", institutionId)
          .eq("student_record_id", studentId),
      ]);
      if (awardError) throw awardError;
      if (ledgerError) throw ledgerError;
      if (!award) return NextResponse.json({ error: "Este ticket ya no está registrado" }, { status: 404 });

      const balance = (ledger || []).reduce((sum, row) => sum + Number(row.delta || 0), 0);
      if (balance < 1) {
        return NextResponse.json({ error: "No se puede deshacer porque ese ticket ya fue utilizado en un canje" }, { status: 409 });
      }

      const { error: deleteError } = await admin.from("attendance_cart_ticket_ledger")
        .delete()
        .eq("id", award.id)
        .eq("institution_id", institutionId);
      if (deleteError) throw deleteError;
      return NextResponse.json({ ok: true });
    }

    if (action === "redeem_reward") {
      const student = await loadStudent(admin, institutionId, String(body.studentId || ""));
      if (!student) return NextResponse.json({ error: "Estudiante no válido para esta dinámica" }, { status: 400 });
      const { data, error } = await admin.rpc("redeem_attendance_cart_reward", {
        p_institution_id: institutionId,
        p_actor_id: auth.user.id,
        p_student_record_id: student.id,
        p_student_name: student.fullName,
        p_course: student.course,
        p_reward_id: String(body.rewardId || ""),
        p_note: String(body.note || "").slice(0, 500),
      });
      if (error) throw error;
      return NextResponse.json({ ok: true, redemptionId: data });
    }

    if (action === "create_reward") {
      const name = String(body.name || "").trim().slice(0, 100);
      const ticketCost = Number(body.ticketCost);
      const initialStock = Math.max(0, Math.floor(Number(body.initialStock) || 0));
      const minimumStock = Math.max(0, Math.floor(Number(body.minimumStock) || 0));
      if (!name || ![1, 4, 8].includes(ticketCost)) {
        return NextResponse.json({ error: "Completa el nombre y selecciona un tier válido" }, { status: 400 });
      }
      const { data: reward, error: rewardError } = await admin.from("attendance_cart_rewards").insert({
        institution_id: institutionId,
        name,
        description: String(body.description || "").trim().slice(0, 300),
        ticket_cost: ticketCost,
        minimum_stock: minimumStock,
        created_by: auth.user.id,
      }).select("id").single();
      if (rewardError) throw rewardError;
      if (initialStock > 0) {
        const { error } = await admin.from("attendance_cart_inventory_ledger").insert({
          institution_id: institutionId,
          reward_id: reward.id,
          delta: initialStock,
          kind: "initial",
          note: "Stock inicial",
          created_by: auth.user.id,
        });
        if (error) throw error;
      }
      return NextResponse.json({ ok: true, rewardId: reward.id });
    }

    if (action === "create_rewards_batch") {
      const rawItems = Array.isArray(body.items) ? body.items.slice(0, 20) : [];
      const items = rawItems.flatMap((raw) => {
        const item = raw as Record<string, unknown>;
        const name = String(item.name || "").trim().slice(0, 100);
        const ticketCost = Number(item.ticketCost);
        const quantity = Math.floor(Number(item.quantity));
        if (!name || ![1, 4, 8].includes(ticketCost) || !Number.isFinite(quantity) || quantity < 1 || quantity > 999) return [];
        return [{
          name,
          description: String(item.description || "").trim().slice(0, 300),
          ticketCost,
          quantity,
          minimumStock: Math.min(999, Math.max(0, Math.floor(Number(item.minimumStock) || 0))),
          existingRewardId: String(item.existingRewardId || ""),
        }];
      });
      if (!items.length || items.length !== rawItems.length) {
        return NextResponse.json({ error: "Revisa los premios detectados y sus cantidades" }, { status: 400 });
      }

      const requestedIds = [...new Set(items.map((item) => item.existingRewardId).filter(Boolean))];
      const { data: existingRewards, error: existingError } = requestedIds.length
        ? await admin.from("attendance_cart_rewards").select("id").eq("institution_id", institutionId).in("id", requestedIds)
        : { data: [], error: null };
      if (existingError) throw existingError;
      const allowedIds = new Set((existingRewards || []).map((reward) => reward.id));
      if (requestedIds.some((id) => !allowedIds.has(id))) {
        return NextResponse.json({ error: "Uno de los premios existentes ya no está disponible" }, { status: 409 });
      }

      let created = 0;
      let replenished = 0;
      for (const item of items) {
        let rewardId = item.existingRewardId;
        if (!rewardId) {
          const { data: reward, error: rewardError } = await admin.from("attendance_cart_rewards").insert({
            institution_id: institutionId,
            name: item.name,
            description: item.description,
            ticket_cost: item.ticketCost,
            minimum_stock: item.minimumStock,
            created_by: auth.user.id,
          }).select("id").single();
          if (rewardError) throw rewardError;
          rewardId = reward.id;
          created += 1;
        } else {
          replenished += 1;
        }
        const { error: inventoryError } = await admin.from("attendance_cart_inventory_ledger").insert({
          institution_id: institutionId,
          reward_id: rewardId,
          delta: item.quantity,
          kind: item.existingRewardId ? "purchase" : "initial",
          note: "Ingreso registrado desde foto con IA",
          created_by: auth.user.id,
        });
        if (inventoryError) throw inventoryError;
      }
      return NextResponse.json({ ok: true, created, replenished, total: items.length });
    }

    if (action === "adjust_inventory") {
      const rewardId = String(body.rewardId || "");
      const delta = Math.trunc(Number(body.delta));
      const kind = String(body.kind || "adjustment");
      if (!rewardId || !Number.isFinite(delta) || delta === 0 || !["purchase", "loss", "adjustment"].includes(kind)) {
        return NextResponse.json({ error: "Movimiento de inventario inválido" }, { status: 400 });
      }
      const { data: reward, error: rewardError } = await admin.from("attendance_cart_rewards")
        .select("id")
        .eq("id", rewardId)
        .eq("institution_id", institutionId)
        .maybeSingle();
      if (rewardError) throw rewardError;
      if (!reward) return NextResponse.json({ error: "Premio no encontrado" }, { status: 404 });
      const { error } = await admin.from("attendance_cart_inventory_ledger").insert({
        institution_id: institutionId,
        reward_id: rewardId,
        delta,
        kind,
        note: String(body.note || "").trim().slice(0, 500),
        created_by: auth.user.id,
      });
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Acción no reconocida" }, { status: 400 });
  } catch (error) {
    console.error("Attendance cart mutation failed", error);
    return apiError(error);
  }
}
