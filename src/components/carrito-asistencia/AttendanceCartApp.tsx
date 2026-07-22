"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";
import {
  ArrowRight,
  ArrowLeft,
  BadgeCheck,
  Box,
  CalendarCheck,
  Check,
  ChevronRight,
  ClipboardList,
  Download,
  Gift,
  History,
  LogOut,
  Minus,
  PackagePlus,
  PartyPopper,
  Plus,
  RefreshCw,
  Search,
  ShoppingCart,
  Star,
  Ticket,
  Trophy,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import styles from "./AttendanceCartApp.module.css";

type TabId = "resumen" | "entrega" | "canjes" | "catastro" | "inventario";

type Student = {
  id: string;
  fullName: string;
  course: string;
  profilePhoto?: string;
};

type Reward = {
  id: string;
  name: string;
  description: string;
  ticket_cost: 1 | 4 | 8;
  minimum_stock: number;
  active: boolean;
  stock: number;
};

type Redemption = {
  id: string;
  student_record_id: string;
  student_name: string;
  course: string;
  reward_id: string;
  reward_name: string;
  tickets_spent: number;
  note: string;
  actor_name: string;
  created_at: string;
};

type InventoryMovement = {
  id: string;
  reward_id: string;
  delta: number;
  kind: string;
  note: string;
  actor_name: string;
  created_at: string;
};

type CartData = {
  students: Student[];
  rewards: Reward[];
  balances: Record<string, number>;
  weeklyAwardedIds: string[];
  redemptions: Redemption[];
  inventoryMovements: InventoryMovement[];
  currentWeekStart: string;
  user: { email: string; id: string };
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const TABS: Array<{ id: TabId; label: string; shortLabel: string; icon: typeof Star }> = [
  { id: "resumen", label: "Resumen", shortLabel: "Inicio", icon: Star },
  { id: "entrega", label: "Entregar tickets", shortLabel: "Tickets", icon: Ticket },
  { id: "canjes", label: "Cobrar premios", shortLabel: "Canjes", icon: Gift },
  { id: "catastro", label: "Catastro", shortLabel: "Catastro", icon: ClipboardList },
  { id: "inventario", label: "Inventario", shortLabel: "Stock", icon: Box },
];

const COURSES = [
  "Prekínder A", "Prekínder B", "Prekínder C",
  "Kínder A", "Kínder B", "Kínder C",
  "1° Básico A", "1° Básico B",
];

const tierTone = (cost: number) => cost === 1
  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
  : cost === 4
    ? "border-sky-200 bg-sky-50 text-sky-800"
    : "border-violet-200 bg-violet-50 text-violet-800";

const formatDateTime = (value: string) => new Intl.DateTimeFormat("es-CL", {
  dateStyle: "medium",
  timeStyle: "short",
}).format(new Date(value));

const displayWeek = (weekStart: string) => {
  if (!weekStart) return "esta semana";
  const start = new Date(`${weekStart}T12:00:00`);
  const end = new Date(start);
  end.setDate(end.getDate() + 4);
  return `${start.toLocaleDateString("es-CL", { day: "numeric", month: "short" })}–${end.toLocaleDateString("es-CL", { day: "numeric", month: "short" })}`;
};

function Initials({ student, size = "md" }: { student: Student; size?: "sm" | "md" }) {
  const initials = student.fullName.split(/\s+/).slice(0, 2).map((part) => part[0]).join("");
  return (
    <span className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-900 to-blue-700 font-black text-white ring-2 ring-amber-300 ${size === "sm" ? "h-9 w-9 text-xs" : "h-12 w-12 text-sm"}`}>
      {initials}
    </span>
  );
}

function LoginPanel({ supabase, onSession }: { supabase: SupabaseClient; onSession: (session: Session) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (signInError || !data.session) {
      setError(signInError?.message || "No se pudo iniciar sesión");
      return;
    }
    onSession(data.session);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fff8c8_0%,#fffdf4_46%,#eaf3ff_100%)] px-4 py-8 sm:py-12">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[32px] border border-amber-200 bg-white shadow-2xl shadow-blue-950/15 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative min-h-[320px] bg-amber-300 lg:min-h-[620px]">
          <Image src="/carrito-asistencia/flyer-asistencia.png" alt="Flyer del Carrito de la Asistencia" fill priority className="object-cover object-top" sizes="(max-width: 1024px) 100vw, 60vw" />
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-10">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-950 text-amber-300 shadow-lg"><Ticket className="h-7 w-7" /></span>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-amber-600">Tiza Education</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-blue-950">Panel del carrito</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">Ingresa con tu cuenta institucional para entregar tickets, registrar canjes y llevar el inventario.</p>
          <form onSubmit={signIn} className="mt-7 space-y-4">
            <label className="block text-sm font-bold text-slate-700">Correo institucional
              <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required autoComplete="email" className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-600" placeholder="nombre@colegiosanlucas.com" />
            </label>
            <label className="block text-sm font-bold text-slate-700">Contraseña
              <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required autoComplete="current-password" className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-600" />
            </label>
            {error ? <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{error}</p> : null}
            <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-950 px-4 py-3 font-black text-white shadow-lg hover:bg-blue-900 disabled:opacity-60">
              {busy ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ChevronRight className="h-4 w-4" />}
              {busy ? "Ingresando…" : "Ingresar al carrito"}
            </button>
          </form>
          <Link href="/" prefetch={false} className="mt-5 inline-flex items-center justify-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-900"><ArrowLeft className="h-4 w-4" />Volver a Tiza Education</Link>
        </div>
      </div>
    </main>
  );
}

export function AttendanceCartApp() {
  const [supabase] = useState(() => SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: true } })
    : null);
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(!supabase);
  const [data, setData] = useState<CartData | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("resumen");
  const [loading, setLoading] = useState(Boolean(supabase));
  const [error, setError] = useState(supabase ? "" : "Supabase no está configurado en esta instalación.");
  const [toast, setToast] = useState("");

  const loadData = useCallback(async (activeSession: Session) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/carrito-asistencia", {
        headers: { authorization: `Bearer ${activeSession.access_token}` },
        cache: "no-store",
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "No se pudo cargar el carrito");
      setData(payload as CartData);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No se pudo cargar el carrito");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getSession().then(({ data: authData }) => {
      setSession(authData.session);
      setAuthReady(true);
      if (authData.session) void loadData(authData.session);
      else setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) void loadData(nextSession);
      else setData(null);
    });
    return () => listener.subscription.unsubscribe();
  }, [loadData, supabase]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const mutate = async (body: Record<string, unknown>, successMessage: string) => {
    if (!session) return false;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/carrito-asistencia", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify(body),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "No se pudo guardar");
      await loadData(session);
      setToast(successMessage);
      return true;
    } catch (mutationError) {
      setError(mutationError instanceof Error ? mutationError.message : "No se pudo guardar");
      setLoading(false);
      return false;
    }
  };

  if (!authReady) return <div className="grid min-h-screen place-items-center bg-amber-50"><RefreshCw className="h-8 w-8 animate-spin text-blue-950" /></div>;
  if (!supabase) return <div className="grid min-h-screen place-items-center bg-amber-50 p-6 text-center font-bold text-rose-700">{error}</div>;
  if (!session) return <LoginPanel supabase={supabase} onSession={setSession} />;

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <div className={`${styles.page} pb-24 text-slate-900 lg:pb-10`}>
      <header className={`${styles.topBar} sticky top-0 z-40`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" prefetch={false} aria-label="Volver a Tiza Education" className="grid h-10 w-10 place-items-center rounded-xl border border-amber-200 bg-white text-blue-950 shadow-sm transition hover:-translate-x-0.5 hover:bg-amber-50"><ArrowLeft className="h-5 w-5" /></Link>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-600">Colegio San Lucas</p>
              <h1 className="text-base font-black text-blue-950 sm:text-lg">Carrito de la Asistencia</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => session && loadData(session)} title="Actualizar" className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-blue-900"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /></button>
            <button onClick={signOut} title="Cerrar sesión" className="grid h-10 w-10 place-items-center rounded-xl bg-blue-950 text-white hover:bg-blue-900"><LogOut className="h-4 w-4" /></button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6">
        {activeTab === "resumen" ? (
          <section className={styles.hero}>
            <span className={`${styles.confetti} ${styles.confettiTop}`} aria-hidden="true" />
            <div className={styles.heroCopy}>
              <span className={styles.heroBadge}><PartyPopper className="h-4 w-4" /> Cada día cuenta</span>
              <h2 className={styles.heroTitle}>El carrito de la <strong>asistencia</strong></h2>
              <p className={styles.heroSubtitle}>Premiamos la constancia de Prekínder, Kínder y Primero Básico. Entrega tickets, registra cada canje y mantén los premios siempre listos.</p>
              <div className={styles.heroActions}>
                <button onClick={() => setActiveTab("entrega")} className={styles.heroPrimary}><Ticket className="h-4 w-4" /> Entregar tickets <ArrowRight className="h-4 w-4" /></button>
                <button onClick={() => setActiveTab("canjes")} className={styles.heroSecondary}><Gift className="h-4 w-4" /> Cobrar premio</button>
              </div>
              <div className={styles.tierRibbon} aria-label="Niveles de premios">
                {[1, 4, 8].map((tier) => <span key={tier} className={styles.tierPill}><Star className="h-3.5 w-3.5 fill-current" /> {tier} {tier === 1 ? "ticket" : "tickets"}</span>)}
              </div>
            </div>
            <div className={styles.heroArt}>
              <div className={styles.posterFrame}>
                <Image src="/carrito-asistencia/plot-carrito.png" alt="Afiche del Carrito de la Asistencia" fill priority className="object-cover object-center" sizes="(max-width: 899px) 100vw, 48vw" />
              </div>
              <div className={styles.floatingTicket}><Ticket className="h-5 w-5" /> ¡Tú sumas!</div>
            </div>
          </section>
        ) : null}

        <nav className={`${styles.desktopNav} hidden lg:grid`}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`${styles.navButton} ${activeTab === tab.id ? styles.navButtonActive : ""}`}><Icon className="h-4 w-4" />{tab.label}</button>;
          })}
        </nav>

        {error ? <div role="alert" className="mb-5 flex items-start justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800"><span>{error}</span><button onClick={() => setError("")} aria-label="Cerrar"><X className="h-4 w-4" /></button></div> : null}

        {!data && loading ? <LoadingCards /> : null}
        {data && activeTab === "resumen" ? <Overview data={data} onNavigate={setActiveTab} /> : null}
        {data && activeTab === "entrega" ? <AwardTickets data={data} onAward={(studentId, note) => mutate({ action: "award_ticket", studentId, note, weekStart: data.currentWeekStart }, "Golden Ticket entregado correctamente")} busy={loading} /> : null}
        {data && activeTab === "canjes" ? <RedeemRewards data={data} onRedeem={(studentId, rewardId, note) => mutate({ action: "redeem_reward", studentId, rewardId, note }, "Premio cobrado y stock actualizado")} busy={loading} /> : null}
        {data && activeTab === "catastro" ? <Registry data={data} /> : null}
        {data && activeTab === "inventario" ? <Inventory data={data} busy={loading} onCreate={(values) => mutate({ action: "create_reward", ...values }, "Premio agregado al inventario")} onAdjust={(values) => mutate({ action: "adjust_inventory", ...values }, "Inventario actualizado")} /> : null}
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-amber-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_rgba(8,36,95,0.14)] backdrop-blur-xl lg:hidden">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex min-h-16 flex-col items-center justify-center gap-1 px-1 text-[10px] font-black ${activeTab === tab.id ? "text-blue-950" : "text-slate-400"}`}><span className={`grid h-8 w-11 place-items-center rounded-full ${activeTab === tab.id ? "bg-amber-300" : ""}`}><Icon className="h-[18px] w-[18px]" /></span>{tab.shortLabel}</button>;
        })}
      </nav>

      {toast ? <div className="fixed bottom-24 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-blue-950 px-5 py-3 text-sm font-black text-white shadow-2xl lg:bottom-8"><Check className="h-4 w-4 text-amber-300" />{toast}</div> : null}
    </div>
  );
}

function LoadingCards() {
  return <div className={styles.loadingStage}><div className={styles.loadingTicket}><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-950 text-amber-300"><Ticket className="h-6 w-6" /></span><span className="relative z-10"><strong className="block text-lg font-black">Preparando el carrito</strong><span className="mt-1 block text-xs font-bold text-blue-900/70">Sincronizando nóminas e inventario…</span></span></div></div>;
}

function Overview({ data, onNavigate }: { data: CartData; onNavigate: (tab: TabId) => void }) {
  const lowStock = data.rewards.filter((reward) => reward.stock <= reward.minimum_stock);
  const totalStock = data.rewards.reduce((sum, reward) => sum + reward.stock, 0);
  const today = new Date().toISOString().slice(0, 10);
  const todayRedemptions = data.redemptions.filter((row) => row.created_at.slice(0, 10) === today).length;
  const awardedSet = new Set(data.weeklyAwardedIds);
  const weeklyProgress = data.students.length ? Math.round((data.weeklyAwardedIds.length / data.students.length) * 100) : 0;
  const stats: Array<{ label: string; value: number; icon: LucideIcon; tone: string }> = [
    { label: "Tickets esta semana", value: data.weeklyAwardedIds.length, icon: Ticket, tone: "bg-amber-300 text-blue-950" },
    { label: "Canjes de hoy", value: todayRedemptions, icon: Gift, tone: "bg-pink-500 text-white" },
    { label: "Premios disponibles", value: totalStock, icon: Box, tone: "bg-emerald-500 text-white" },
    { label: "Por comprar", value: lowStock.length, icon: ShoppingCart, tone: lowStock.length ? "bg-rose-500 text-white" : "bg-blue-950 text-white" },
  ];
  return (
    <div className="space-y-5">
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tone }) => <article key={label} className={styles.statCard}><div className="relative z-10 flex items-start justify-between"><span className={`grid h-11 w-11 place-items-center rounded-2xl shadow-sm ${tone}`}><Icon className="h-5 w-5" /></span><span className="text-[10px] font-black uppercase tracking-wider text-slate-400">En vivo</span></div><p className="relative z-10 mt-4 text-4xl font-black tracking-tight text-blue-950">{value}</p><p className="relative z-10 mt-1 text-xs font-bold text-slate-500">{label}</p></article>)}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
        <div className={styles.journeyCard}>
          <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-amber-600">Ruta de esta semana</p><h2 className="mt-1 text-2xl font-black tracking-tight text-blue-950">La asistencia avanza curso a curso</h2><p className="mt-2 text-sm text-slate-500">Semana del {displayWeek(data.currentWeekStart)}</p></div><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-950 text-amber-300 shadow-lg"><CalendarCheck className="h-6 w-6" /></span></div>
          <div className="mt-6 flex items-end justify-between"><span className="text-sm font-bold text-slate-600">Tickets entregados</span><strong className="text-3xl font-black text-blue-950">{weeklyProgress}%</strong></div>
          <div className={`${styles.progressTrack} mt-3`}><div className={styles.progressFill} style={{ width: `${Math.min(weeklyProgress, 100)}%` }} /></div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">{COURSES.map((course) => { const roster = data.students.filter((student) => student.course === course); const delivered = roster.filter((student) => awardedSet.has(student.id)).length; return <div key={course} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white/80 px-3 py-2.5"><span className="text-xs font-bold text-slate-700">{course}</span><span className={`rounded-full px-2 py-1 text-[10px] font-black ${roster.length && delivered === roster.length ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"}`}>{delivered}/{roster.length}</span></div>; })}</div>
          <button onClick={() => onNavigate("entrega")} className="mt-5 inline-flex items-center gap-2 text-sm font-black text-blue-950">Continuar entrega <ArrowRight className="h-4 w-4" /></button>
        </div>
        <div className="space-y-5">
          <div className={styles.goldenFeature}>
            <div className="relative aspect-[3.1/1] min-h-[145px]">
            <Image src="/carrito-asistencia/golden-ticket.png" alt="Golden Ticket del Carrito de la Asistencia" fill className="object-cover object-top" sizes="(max-width: 1024px) 100vw, 65vw" />
          </div>
          <div className="relative z-10 grid gap-3 p-4 sm:grid-cols-2">
            <button onClick={() => onNavigate("entrega")} className="flex items-center justify-between rounded-2xl bg-blue-950 p-4 text-left text-white shadow-lg"><span><span className="text-xs font-bold text-amber-300">Viernes · {displayWeek(data.currentWeekStart)}</span><strong className="mt-1 block text-lg">Entregar Golden Tickets</strong></span><Ticket className="h-7 w-7 text-amber-300" /></button>
            <button onClick={() => onNavigate("canjes")} className="flex items-center justify-between rounded-2xl bg-amber-300 p-4 text-left text-blue-950 shadow-lg"><span><span className="text-xs font-bold text-blue-800">Premios de 1, 4 y 8 tickets</span><strong className="mt-1 block text-lg">Registrar un cobro</strong></span><Gift className="h-7 w-7" /></button>
          </div>
          </div>
        <div className={`${styles.panel} p-5`}>
          <div className="flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-wider text-amber-600">Lista de compra</p><h2 className="mt-1 text-xl font-black text-blue-950">Stock bajo</h2></div><ShoppingCart className="h-6 w-6 text-rose-500" /></div>
          <div className="mt-4 space-y-2">
            {lowStock.length ? lowStock.map((reward) => <button key={reward.id} onClick={() => onNavigate("inventario")} className="flex w-full items-center justify-between rounded-xl border border-rose-100 bg-rose-50 px-3 py-3 text-left"><span><strong className="block text-sm text-slate-900">{reward.name}</strong><span className="text-xs text-rose-700">Mínimo: {reward.minimum_stock}</span></span><span className="rounded-full bg-white px-2.5 py-1 text-sm font-black text-rose-700">{reward.stock}</span></button>) : <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50 p-5 text-center"><BadgeCheck className="mx-auto h-7 w-7 text-emerald-600" /><p className="mt-2 text-sm font-bold text-emerald-800">Todo el inventario está bien abastecido.</p></div>}
          </div>
        </div>
        </div>
      </section>
      <section><div className="mb-3 flex items-end justify-between"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-amber-600">Tres metas, tres celebraciones</p><h2 className="mt-1 text-xl font-black text-blue-950">Niveles de premios</h2></div><button onClick={() => onNavigate("canjes")} className="text-xs font-black text-blue-900">Ver premios →</button></div><div className="grid gap-3 md:grid-cols-3">{[{ cost: 1, title: "Primera alegría", copy: "Un premio inmediato para celebrar la semana completa.", tone: "bg-gradient-to-br from-emerald-100 to-teal-50 text-emerald-950" }, { cost: 4, title: "Constancia que crece", copy: "Cuatro semanas de compromiso merecen algo especial.", tone: "bg-gradient-to-br from-sky-100 to-blue-50 text-blue-950" }, { cost: 8, title: "Gran celebración", copy: "La meta mayor para quienes sostienen su asistencia.", tone: "bg-gradient-to-br from-violet-100 to-fuchsia-50 text-violet-950" }].map((tier) => <article key={tier.cost} className={`${styles.tierCard} ${tier.tone}`}><div className="flex items-start justify-between"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-xl font-black shadow-sm">{tier.cost}</span><Trophy className="h-6 w-6 opacity-60" /></div><h3 className="mt-4 font-black">{tier.title}</h3><p className="mt-1 text-xs font-semibold leading-5 opacity-70">{tier.copy}</p></article>)}</div></section>
    </div>
  );
}

function AwardTickets({ data, onAward, busy }: { data: CartData; onAward: (studentId: string, note: string) => Promise<boolean>; busy: boolean }) {
  const [course, setCourse] = useState(COURSES[0]);
  const [query, setQuery] = useState("");
  const [note, setNote] = useState("");
  const awarded = useMemo(() => new Set(data.weeklyAwardedIds), [data.weeklyAwardedIds]);
  const students = data.students.filter((student) => student.course === course && student.fullName.toLowerCase().includes(query.toLowerCase()));
  const courseRoster = data.students.filter((student) => student.course === course);
  const courseDelivered = courseRoster.filter((student) => awarded.has(student.id)).length;
  return (
    <section className={`${styles.panel} overflow-hidden`}>
      <div className={`${styles.sectionBanner} px-5 py-7 sm:px-7`}><div className="flex items-start justify-between gap-5"><div><span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-amber-300"><Ticket className="h-3.5 w-3.5" /> Semana {displayWeek(data.currentWeekStart)}</span><h2 className="mt-3 text-3xl font-black tracking-tight">Entrega de Golden Tickets</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">Selecciona a quienes completaron su asistencia semanal. Cada estudiante puede recibir un solo ticket por semana.</p></div><div className="hidden text-right sm:block"><strong className="block text-4xl font-black text-amber-300">{courseDelivered}/{courseRoster.length}</strong><span className="text-xs font-bold text-blue-100">en {course}</span></div></div></div>
      <div className="grid gap-3 border-b border-amber-100 bg-amber-50 p-4 sm:grid-cols-[1fr_1fr_1.2fr]">
        <select value={course} onChange={(event) => setCourse(event.target.value)} className="rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm font-bold outline-none">{COURSES.map((item) => <option key={item}>{item}</option>)}</select>
        <label className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar estudiante" className="w-full rounded-xl border border-amber-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none" /></label>
        <input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Observación general (opcional)" className="rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm outline-none" />
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
        {students.map((student) => {
          const hasTicket = awarded.has(student.id);
          return <article key={student.id} className={styles.studentCard}><div className="flex items-center gap-3"><Initials student={student} /><div className="min-w-0 flex-1"><p className="truncate font-bold text-slate-900">{student.fullName}</p><p className="text-xs text-slate-500">{student.course}</p></div><span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-black text-blue-900">{data.balances[student.id] || 0} GT</span></div>{hasTicket ? <span className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-100 px-3 py-2.5 text-xs font-black text-emerald-700"><Check className="h-4 w-4" />Ticket entregado</span> : <button disabled={busy} onClick={() => onAward(student.id, note)} className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-300 to-yellow-400 px-3 py-2.5 text-xs font-black text-blue-950 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50"><Ticket className="h-4 w-4" />Entregar Golden Ticket</button>}</article>;
        })}
        {!students.length ? <div className="col-span-full rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50 p-10 text-center"><Search className="mx-auto h-7 w-7 text-amber-500" /><p className="mt-3 text-sm font-semibold text-slate-600">No hay estudiantes en este curso o búsqueda.</p></div> : null}
      </div>
    </section>
  );
}

function RedeemRewards({ data, onRedeem, busy }: { data: CartData; onRedeem: (studentId: string, rewardId: string, note: string) => Promise<boolean>; busy: boolean }) {
  const [query, setQuery] = useState("");
  const [studentId, setStudentId] = useState("");
  const [note, setNote] = useState("");
  const matches = query.length > 1 ? data.students.filter((student) => `${student.fullName} ${student.course}`.toLowerCase().includes(query.toLowerCase())).slice(0, 8) : [];
  const student = data.students.find((item) => item.id === studentId);
  const balance = student ? data.balances[student.id] || 0 : 0;
  return (
    <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
      <section className={`${styles.panel} p-5 sm:p-6`}><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-pink-500 text-white shadow-lg shadow-pink-200"><UserRound className="h-6 w-6" /></span><span className="rounded-full bg-pink-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-pink-600">Paso 1</span></div><h2 className="mt-4 text-2xl font-black text-blue-950">¿Quién cobra?</h2><p className="mt-1 text-sm text-slate-500">Busca por nombre o curso.</p>
        <label className="relative mt-5 block"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => { setQuery(event.target.value); if (!event.target.value) setStudentId(""); }} placeholder="Escribe al menos 2 letras" className="w-full rounded-xl border border-slate-200 py-3 pl-9 pr-3 outline-none focus:border-blue-600" /></label>
        {matches.length && !student ? <div className="mt-2 overflow-hidden rounded-xl border border-slate-200">{matches.map((item) => <button key={item.id} onClick={() => { setStudentId(item.id); setQuery(item.fullName); }} className="flex w-full items-center gap-3 border-b border-slate-100 px-3 py-2.5 text-left last:border-0 hover:bg-amber-50"><Initials student={item} size="sm" /><span><strong className="block text-sm">{item.fullName}</strong><span className="text-xs text-slate-500">{item.course}</span></span></button>)}</div> : null}
        {student ? <div className="mt-5 rounded-2xl border-2 border-amber-300 bg-amber-50 p-4"><div className="flex items-center gap-3"><Initials student={student} /><div><strong className="block text-slate-900">{student.fullName}</strong><span className="text-xs text-slate-500">{student.course}</span></div></div><div className="mt-4 flex items-center justify-between rounded-xl bg-blue-950 px-4 py-3 text-white"><span className="text-sm font-bold">Saldo disponible</span><span className="flex items-center gap-1 text-xl font-black text-amber-300"><Ticket className="h-5 w-5" />{balance}</span></div><button onClick={() => { setStudentId(""); setQuery(""); }} className="mt-3 text-xs font-bold text-slate-500">Elegir otro estudiante</button></div> : null}
        <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Observación del canje (opcional)" rows={3} className="mt-4 w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-600" />
      </section>
      <section className={`${styles.panel} p-5 sm:p-6`}><div className="flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-wider text-pink-500">Paso 2 · Catálogo</p><h2 className="mt-1 text-2xl font-black text-blue-950">Elige su premio</h2></div><span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-300 text-blue-950 shadow-lg shadow-amber-100"><Gift className="h-6 w-6" /></span></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {data.rewards.filter((reward) => reward.active).map((reward) => {
            const enabled = Boolean(student && balance >= reward.ticket_cost && reward.stock > 0);
            return <article key={reward.id} className={`rounded-2xl border-2 p-4 ${enabled ? "border-amber-300 bg-amber-50" : "border-slate-100 bg-slate-50 opacity-70"}`}><div className="flex items-start justify-between gap-3"><span className={`rounded-full border px-2.5 py-1 text-xs font-black ${tierTone(reward.ticket_cost)}`}>Tier {reward.ticket_cost}</span><span className={`text-xs font-black ${reward.stock > 0 ? "text-emerald-700" : "text-rose-600"}`}>{reward.stock > 0 ? `${reward.stock} disponibles` : "Agotado"}</span></div><h3 className="mt-3 font-black text-blue-950">{reward.name}</h3>{reward.description ? <p className="mt-1 text-xs leading-5 text-slate-500">{reward.description}</p> : null}<button disabled={!enabled || busy} onClick={() => student && onRedeem(student.id, reward.id, note)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-950 px-3 py-2.5 text-sm font-black text-white shadow disabled:bg-slate-300 disabled:shadow-none"><Trophy className="h-4 w-4" />{!student ? "Selecciona estudiante" : balance < reward.ticket_cost ? `Faltan ${reward.ticket_cost - balance} tickets` : reward.stock < 1 ? "Sin stock" : "Confirmar cobro"}</button></article>;
          })}
          {!data.rewards.length ? <p className="col-span-full rounded-2xl border border-dashed border-amber-200 bg-amber-50 p-8 text-center text-sm font-semibold text-slate-600">Primero agrega premios desde Inventario.</p> : null}
        </div>
      </section>
    </div>
  );
}

function Registry({ data }: { data: CartData }) {
  const [course, setCourse] = useState("Todos");
  const [query, setQuery] = useState("");
  const rows = data.redemptions.filter((row) => (course === "Todos" || row.course === course) && `${row.student_name} ${row.reward_name}`.toLowerCase().includes(query.toLowerCase()));
  const exportCsv = () => {
    const values = [["Fecha", "Estudiante", "Curso", "Premio", "Tickets", "Responsable", "Observación"], ...rows.map((row) => [formatDateTime(row.created_at), row.student_name, row.course, row.reward_name, row.tickets_spent, row.actor_name, row.note])];
    const csv = values.map((line) => line.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(";")).join("\n");
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `catastro-carrito-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };
  return <section className={`${styles.panel} overflow-hidden`}><div className={`${styles.sectionBanner} flex flex-col gap-4 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-7`}><div><span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-amber-300"><ClipboardList className="h-3.5 w-3.5" /> Historial auditable</span><h2 className="mt-3 text-3xl font-black tracking-tight">Catastro de cobros</h2><p className="mt-1 text-sm text-blue-100">{rows.length} canjes encontrados · datos listos para compartir</p></div><button onClick={exportCsv} className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 py-3 text-sm font-black text-blue-950 shadow-lg"><Download className="h-4 w-4" />Exportar catastro</button></div><div className="grid gap-3 border-b border-slate-100 bg-amber-50 p-4 sm:grid-cols-2"><select value={course} onChange={(event) => setCourse(event.target.value)} className="rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm font-bold"><option>Todos</option>{COURSES.map((item) => <option key={item}>{item}</option>)}</select><label className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar estudiante o premio" className="w-full rounded-xl border border-amber-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none" /></label></div><div className="divide-y divide-slate-100">{rows.map((row) => <article key={row.id} className="grid gap-3 px-4 py-4 transition hover:bg-amber-50/50 sm:grid-cols-[1.2fr_1fr_0.8fr] sm:items-center sm:px-6"><div><strong className="block text-sm text-slate-900">{row.student_name}</strong><span className="text-xs text-slate-500">{row.course} · {formatDateTime(row.created_at)}</span></div><div><strong className="block text-sm text-blue-950">{row.reward_name}</strong><span className="text-xs text-slate-500">{row.tickets_spent} tickets utilizados</span></div><div className="sm:text-right"><span className="text-xs font-bold text-slate-700">{row.actor_name}</span>{row.note ? <p className="mt-1 text-xs text-slate-400">{row.note}</p> : null}</div></article>)}{!rows.length ? <div className="p-12 text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-blue-900"><History className="h-8 w-8" /></span><p className="mt-4 font-black text-blue-950">El primer canje aparecerá aquí</p><p className="mt-1 text-sm font-semibold text-slate-500">Podrás ver quién cobró, qué premio eligió y cuándo.</p></div> : null}</div></section>;
}

function Inventory({ data, busy, onCreate, onAdjust }: { data: CartData; busy: boolean; onCreate: (values: Record<string, unknown>) => Promise<boolean>; onAdjust: (values: Record<string, unknown>) => Promise<boolean> }) {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", ticketCost: 1, initialStock: 0, minimumStock: 3 });
  const [adjusting, setAdjusting] = useState<Reward | null>(null);
  const [adjustment, setAdjustment] = useState({ delta: 1, kind: "purchase", note: "" });
  const lowStock = data.rewards.filter((reward) => reward.stock <= reward.minimum_stock);
  const create = async (event: FormEvent) => { event.preventDefault(); if (await onCreate(form)) { setForm({ name: "", description: "", ticketCost: 1, initialStock: 0, minimumStock: 3 }); setShowCreate(false); } };
  const adjust = async (event: FormEvent) => { event.preventDefault(); if (!adjusting) return; const signedDelta = adjustment.kind === "loss" ? -Math.abs(adjustment.delta) : adjustment.delta; if (await onAdjust({ rewardId: adjusting.id, ...adjustment, delta: signedDelta })) setAdjusting(null); };
  return <div className="space-y-5"><section className={`${styles.panel} overflow-hidden`}><div className={`${styles.sectionBanner} flex flex-col gap-4 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-7`}><div><span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-amber-300"><Box className="h-3.5 w-3.5" /> Control del carrito</span><h2 className="mt-3 text-3xl font-black tracking-tight">Inventario de premios</h2><p className="mt-1 text-sm text-blue-100">{lowStock.length ? `${lowStock.length} productos necesitan reposición` : "Todo listo para la próxima vuelta del carrito"}</p></div><button onClick={() => setShowCreate((value) => !value)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 py-3 text-sm font-black text-blue-950 shadow-lg"><PackagePlus className="h-4 w-4" />Agregar premio</button></div><div className="p-5 sm:p-6">
        {showCreate ? <form onSubmit={create} className="mt-5 grid gap-3 rounded-2xl border-2 border-amber-200 bg-amber-50 p-4 sm:grid-cols-2"><label className="text-xs font-black text-slate-600">Nombre del premio<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required className="mt-1.5 w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm outline-none" placeholder="Ej. Set de stickers" /></label><label className="text-xs font-black text-slate-600">Descripción<input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-1.5 w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm outline-none" placeholder="Opcional" /></label><label className="text-xs font-black text-slate-600">Tier<select value={form.ticketCost} onChange={(event) => setForm({ ...form, ticketCost: Number(event.target.value) })} className="mt-1.5 w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm"><option value={1}>1 ticket</option><option value={4}>4 tickets</option><option value={8}>8 tickets</option></select></label><div className="grid grid-cols-2 gap-3"><label className="text-xs font-black text-slate-600">Stock inicial<input value={form.initialStock} onChange={(event) => setForm({ ...form, initialStock: Number(event.target.value) })} type="number" min="0" className="mt-1.5 w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm" /></label><label className="text-xs font-black text-slate-600">Alerta bajo<input value={form.minimumStock} onChange={(event) => setForm({ ...form, minimumStock: Number(event.target.value) })} type="number" min="0" className="mt-1.5 w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm" /></label></div><div className="flex gap-2 sm:col-span-2"><button disabled={busy} className="flex-1 rounded-xl bg-blue-950 px-4 py-3 text-sm font-black text-white disabled:opacity-50">Guardar premio</button><button type="button" onClick={() => setShowCreate(false)} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-600">Cancelar</button></div></form> : null}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{data.rewards.map((reward) => { const low = reward.stock <= reward.minimum_stock; return <article key={reward.id} className={`rounded-2xl border-2 p-4 shadow-sm ${low ? "border-rose-200 bg-rose-50" : "border-emerald-100 bg-emerald-50"}`}><div className="flex items-start justify-between gap-2"><span className={`rounded-full border px-2.5 py-1 text-xs font-black ${tierTone(reward.ticket_cost)}`}>{reward.ticket_cost} {reward.ticket_cost === 1 ? "ticket" : "tickets"}</span><span className={`rounded-full px-2.5 py-1 text-xs font-black ${low ? "bg-rose-600 text-white" : "bg-emerald-600 text-white"}`}>{low ? "Comprar" : "Disponible"}</span></div><h3 className="mt-4 font-black text-blue-950">{reward.name}</h3><div className="mt-3 flex items-end justify-between"><div><span className="text-4xl font-black text-slate-950">{reward.stock}</span><span className="ml-1 text-xs font-bold text-slate-500">unidades</span><p className="text-[11px] text-slate-500">Alerta al llegar a {reward.minimum_stock}</p></div><button onClick={() => { setAdjusting(reward); setAdjustment({ delta: 1, kind: "purchase", note: "" }); }} className="grid h-11 w-11 place-items-center rounded-xl bg-white text-blue-950 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5"><Plus className="h-5 w-5" /></button></div></article>; })}{!data.rewards.length ? <div className="col-span-full rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50 p-10 text-center"><PackagePlus className="mx-auto h-8 w-8 text-amber-500" /><p className="mt-3 font-black text-blue-950">El carrito todavía está vacío</p><p className="mt-1 text-sm font-semibold text-slate-500">Agrega el primer premio para comenzar.</p></div> : null}</div>
      </div></section>
      <section className={`${styles.panel} overflow-hidden`}><div className="border-b border-slate-100 px-5 py-4"><h3 className="font-black text-blue-950">Últimos movimientos</h3><p className="mt-1 text-xs text-slate-500">Compras, entregas y ajustes quedan registrados aquí.</p></div><div className="divide-y divide-slate-100">{data.inventoryMovements.slice(0, 20).map((row) => { const reward = data.rewards.find((item) => item.id === row.reward_id); return <div key={row.id} className="flex items-center gap-3 px-5 py-3"><span className={`grid h-9 w-9 place-items-center rounded-full ${row.delta > 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{row.delta > 0 ? <Plus className="h-4 w-4" /> : <Minus className="h-4 w-4" />}</span><div className="flex-1"><strong className="block text-sm">{reward?.name || "Premio"}</strong><span className="text-xs text-slate-500">{formatDateTime(row.created_at)} · {row.actor_name}{row.note ? ` · ${row.note}` : ""}</span></div><span className={`font-black ${row.delta > 0 ? "text-emerald-700" : "text-rose-700"}`}>{row.delta > 0 ? "+" : ""}{row.delta}</span></div>; })}{!data.inventoryMovements.length ? <p className="p-8 text-center text-sm text-slate-500">Sin movimientos todavía.</p> : null}</div></section>
      {adjusting ? <div className="fixed inset-0 z-[80] grid place-items-end bg-slate-950/45 p-3 backdrop-blur-sm sm:place-items-center" onClick={() => setAdjusting(null)}><form onSubmit={adjust} onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-xs font-black uppercase tracking-wider text-amber-600">Actualizar stock</p><h3 className="mt-1 text-xl font-black text-blue-950">{adjusting.name}</h3><p className="text-sm text-slate-500">Stock actual: {adjusting.stock}</p></div><button type="button" onClick={() => setAdjusting(null)} className="grid h-9 w-9 place-items-center rounded-full bg-slate-100"><X className="h-4 w-4" /></button></div><div className="mt-5 grid grid-cols-2 gap-3"><label className="text-xs font-black text-slate-600">Movimiento<select value={adjustment.kind} onChange={(event) => setAdjustment({ ...adjustment, kind: event.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"><option value="purchase">Compra / reposición</option><option value="loss">Pérdida o daño</option><option value="adjustment">Ajuste manual</option></select></label><label className="text-xs font-black text-slate-600">Cantidad<input value={adjustment.delta} onChange={(event) => setAdjustment({ ...adjustment, delta: Math.max(1, Number(event.target.value)) })} type="number" min="1" required className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" /></label></div><label className="mt-3 block text-xs font-black text-slate-600">Nota<input value={adjustment.note} onChange={(event) => setAdjustment({ ...adjustment, note: event.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" placeholder="Ej. Compra del 22 de julio" /></label><button disabled={busy} className="mt-5 w-full rounded-xl bg-blue-950 px-4 py-3 font-black text-white disabled:opacity-50">Guardar movimiento</button></form></div> : null}
    </div>;
}
