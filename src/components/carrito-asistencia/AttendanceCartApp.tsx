"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";
import {
  ArrowRight,
  ArrowLeft,
  BadgeCheck,
  Box,
  CalendarCheck,
  Camera,
  Check,
  ChevronRight,
  ClipboardList,
  Download,
  Eye,
  EyeOff,
  Gift,
  History,
  LogOut,
  LoaderCircle,
  Minus,
  PackagePlus,
  PartyPopper,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  ShoppingCart,
  Star,
  Ticket,
  Trophy,
  Undo2,
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

type ScannedInventoryItem = {
  clientId: string;
  selected: boolean;
  name: string;
  description: string;
  quantity: number;
  ticketCost: 1 | 4 | 8;
  minimumStock: number;
  existingRewardId: string;
  confidence: number;
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
  reversed: boolean;
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
const SHARED_CART_EMAIL = "carrito.asistencia@tiza.education";

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

const TIER_CONFIG = [
  { cost: 1 as const, label: "1 ticket", title: "Premios inmediatos", description: "Detalles pequeños para celebrar una semana completa." },
  { cost: 4 as const, label: "4 tickets", title: "Premios de constancia", description: "Recompensas para cuatro semanas de compromiso." },
  { cost: 8 as const, label: "8 tickets", title: "Grandes premios", description: "La celebración mayor del recorrido de asistencia." },
] as const;

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

const prepareInventoryPhoto = async (file: File) => {
  if (!file.type.startsWith("image/")) throw new Error("Selecciona una imagen válida");
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
    if (blob) return new File([blob], "inventario.jpg", { type: "image/jpeg" });
  } catch {
    // Some older browsers cannot decode every phone format. Use the original below.
  }
  if (file.size > 8 * 1024 * 1024) throw new Error("La foto es demasiado pesada. Intenta tomarla nuevamente.");
  return file;
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
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email: SHARED_CART_EMAIL, password });
    setBusy(false);
    if (signInError || !data.session) {
      setError(signInError ? "La clave no es correcta. Inténtalo nuevamente." : "No se pudo iniciar sesión");
      return;
    }
    onSession(data.session);
  };

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#f6f9ff] px-3 py-4 sm:px-6 sm:py-8">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-amber-300/30 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-sky-300/25 blur-3xl" />
      <div className="relative grid w-full max-w-4xl overflow-hidden rounded-[30px] border border-white bg-white shadow-[0_28px_90px_rgba(8,36,95,0.18)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-[205px] overflow-hidden bg-amber-300 sm:min-h-[260px] lg:min-h-[560px]">
          <Image src="/carrito-asistencia/plot-carrito.png" alt="Carrito de la Asistencia del Colegio San Lucas" fill priority className="object-cover object-center" sizes="(max-width: 1024px) 100vw, 52vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/5 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] backdrop-blur-md"><Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" /> Cada día cuenta</span>
            <h2 className="mt-3 max-w-sm text-2xl font-black leading-tight sm:text-3xl">Premiamos la asistencia y la constancia</h2>
            <p className="mt-2 hidden max-w-sm text-xs leading-5 text-blue-100 sm:block">Prekínder, Kínder y Primero Básico · Colegio San Lucas</p>
          </div>
        </div>
        <div className="flex flex-col justify-center p-5 sm:p-8 lg:p-10">
          <div className="flex items-center justify-between gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-950 text-amber-300 shadow-lg shadow-blue-950/20"><Ticket className="h-6 w-6" /></span><span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-700"><ShieldCheck className="h-3.5 w-3.5" /> Acceso del equipo</span></div>
          <p className="mt-5 text-[10px] font-black uppercase tracking-[0.22em] text-amber-600">Carrito de la Asistencia</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-blue-950 sm:text-4xl">¡Bienvenida!</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">Ingresa la clave compartida para registrar tickets, canjes e inventario.</p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px] font-black text-blue-950"><span className="rounded-xl bg-amber-50 px-2 py-2">Tickets</span><span className="rounded-xl bg-pink-50 px-2 py-2">Canjes</span><span className="rounded-xl bg-sky-50 px-2 py-2">Stock</span></div>
          <form onSubmit={signIn} className="mt-6 space-y-4">
            <div><label htmlFor="cart-password" className="block text-xs font-black uppercase tracking-wide text-slate-600">Clave del carrito</label><div className="relative mt-1.5"><input id="cart-password" value={password} onChange={(event) => setPassword(event.target.value)} type={showPassword ? "text" : "password"} required autoFocus autoComplete="current-password" className="min-h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-12 text-base font-bold text-blue-950 outline-none transition focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-100" placeholder="Ingresa la clave compartida" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-1.5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-xl text-slate-400 hover:bg-white hover:text-blue-950" aria-label={showPassword ? "Ocultar clave" : "Mostrar clave"}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
            {error ? <p role="alert" className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2.5 text-xs font-bold text-rose-700">{error}</p> : null}
            <button disabled={busy} className="flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-blue-950 px-4 font-black text-white shadow-lg shadow-blue-950/20 transition hover:-translate-y-0.5 hover:bg-blue-900 disabled:translate-y-0 disabled:opacity-60">
              {busy ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ChevronRight className="h-4 w-4 text-amber-300" />}
              {busy ? "Ingresando…" : "Entrar al carrito"}
            </button>
          </form>
          <p className="mt-4 text-center text-[10px] font-semibold text-slate-400">Uso exclusivo del equipo del Colegio San Lucas</p>
          <Link href="/" prefetch={false} className="mt-4 inline-flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-900"><ArrowLeft className="h-4 w-4" />Volver a Tiza Education</Link>
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

  const loadData = useCallback(async (activeSession: Session, silent = false) => {
    if (!silent) setLoading(true);
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
      if (!silent) setLoading(false);
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

  const mutate = async (body: Record<string, unknown>, successMessage: string, optimisticUpdate?: (current: CartData) => CartData) => {
    if (!session) return false;
    const previousData = data;
    if (optimisticUpdate && data) setData(optimisticUpdate(data));
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
      setToast(successMessage);
      if (optimisticUpdate) {
        setLoading(false);
        void loadData(session, true);
      } else {
        await loadData(session);
      }
      return true;
    } catch (mutationError) {
      if (optimisticUpdate && previousData) setData(previousData);
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

  const navigate = (tab: TabId) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={`${styles.page} pb-24 text-slate-900 lg:pb-10`}>
      <header className={`${styles.topBar} sticky top-0 z-40`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Link href="/" prefetch={false} aria-label="Volver a Tiza Education" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-amber-200 bg-white text-blue-950 shadow-sm transition hover:-translate-x-0.5 hover:bg-amber-50"><ArrowLeft className="h-5 w-5" /></Link>
            <div className="min-w-0">
              <p className="truncate text-[9px] font-black uppercase tracking-[0.18em] text-amber-600 min-[380px]:text-[10px] min-[380px]:tracking-[0.24em]">Colegio San Lucas</p>
              <h1 className="truncate text-sm font-black text-blue-950 min-[380px]:text-base sm:text-lg">Carrito de la Asistencia</h1>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button onClick={() => session && loadData(session)} title="Actualizar" className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-blue-900"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /></button>
            <button onClick={signOut} title="Cerrar sesión" className="grid h-10 w-10 place-items-center rounded-xl bg-blue-950 text-white hover:bg-blue-900"><LogOut className="h-4 w-4" /></button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6">
        {data && activeTab === "resumen" ? <OverviewMetrics data={data} /> : null}
        {data && activeTab === "resumen" ? <MobileQuickActions onNavigate={navigate} /> : null}
        {activeTab === "resumen" ? (
          <section className={styles.hero}>
            <span className={`${styles.confetti} ${styles.confettiTop}`} aria-hidden="true" />
            <div className={styles.heroCopy}>
              <span className={styles.heroBadge}><PartyPopper className="h-4 w-4" /> Cada día cuenta</span>
              <h2 className={styles.heroTitle}>El carrito de la <strong>asistencia</strong></h2>
              <p className={styles.heroSubtitle}>Premiamos la constancia de Prekínder, Kínder y Primero Básico. Entrega tickets, registra cada canje y mantén los premios siempre listos.</p>
              <div className={styles.heroActions}>
                <button onClick={() => navigate("entrega")} className={styles.heroPrimary}><Ticket className="h-4 w-4" /> Entregar tickets <ArrowRight className="h-4 w-4" /></button>
                <button onClick={() => navigate("canjes")} className={styles.heroSecondary}><Gift className="h-4 w-4" /> Cobrar premio</button>
              </div>
              <div className={styles.tierRibbon} aria-label="Niveles de premios">
                {[1, 4, 8].map((tier) => <span key={tier} className={styles.tierPill}><Star className="h-3.5 w-3.5 fill-current" /> {tier} {tier === 1 ? "ticket" : "tickets"}</span>)}
              </div>
            </div>
            <div className={styles.heroArt}>
              <div className={styles.posterFrame}>
                <Image src="/carrito-asistencia/plot-carrito.png" alt="Afiche del Carrito de la Asistencia" fill priority className="object-cover object-center" sizes="(max-width: 899px) 100vw, 48vw" />
              </div>
            </div>
          </section>
        ) : null}

        <nav className={styles.desktopNav}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return <button key={tab.id} onClick={() => navigate(tab.id)} className={`${styles.navButton} ${activeTab === tab.id ? styles.navButtonActive : ""}`}><Icon className="h-4 w-4" />{tab.label}</button>;
          })}
        </nav>

        {error ? <div role="alert" className="mb-5 flex items-start justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800"><span>{error}</span><button onClick={() => setError("")} aria-label="Cerrar"><X className="h-4 w-4" /></button></div> : null}

        {!data && loading ? <LoadingCards /> : null}
        {data && activeTab === "resumen" ? <Overview data={data} onNavigate={navigate} /> : null}
        {data && activeTab === "entrega" ? <AwardTickets data={data} onAward={(studentId, note) => mutate({ action: "award_ticket", studentId, note, weekStart: data.currentWeekStart }, "Golden Ticket entregado correctamente", (current) => ({ ...current, weeklyAwardedIds: current.weeklyAwardedIds.includes(studentId) ? current.weeklyAwardedIds : [...current.weeklyAwardedIds, studentId], balances: { ...current.balances, [studentId]: (current.balances[studentId] || 0) + 1 } }))} onUndo={(studentId) => mutate({ action: "undo_award_ticket", studentId, weekStart: data.currentWeekStart }, "Entrega anulada correctamente", (current) => ({ ...current, weeklyAwardedIds: current.weeklyAwardedIds.filter((id) => id !== studentId), balances: { ...current.balances, [studentId]: Math.max(0, (current.balances[studentId] || 0) - 1) } }))} busy={loading} /> : null}
        {data && activeTab === "canjes" ? <RedeemRewards data={data} onRedeem={(studentId, rewardId, note) => mutate({ action: "redeem_reward", studentId, rewardId, note }, "Premio cobrado y stock actualizado")} busy={loading} /> : null}
        {data && activeTab === "catastro" ? <Registry data={data} busy={loading} onUndo={(redemption) => mutate({ action: "undo_redemption", redemptionId: redemption.id }, "Canje anulado: tickets y premio restituidos", (current) => ({ ...current, balances: { ...current.balances, [redemption.student_record_id]: (current.balances[redemption.student_record_id] || 0) + redemption.tickets_spent }, rewards: current.rewards.map((reward) => reward.id === redemption.reward_id ? { ...reward, stock: reward.stock + 1 } : reward), redemptions: current.redemptions.map((row) => row.id === redemption.id ? { ...row, reversed: true } : row) }))} /> : null}
        {data && activeTab === "inventario" ? <Inventory data={data} accessToken={session.access_token} busy={loading} onCreate={(values) => mutate({ action: "create_reward", ...values }, "Premio agregado al inventario")} onAdjust={(values) => mutate({ action: "adjust_inventory", ...values }, "Inventario actualizado")} onApplyScan={(items) => mutate({ action: "create_rewards_batch", items }, "Inventario actualizado desde la foto")} /> : null}
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-amber-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_rgba(8,36,95,0.14)] backdrop-blur-xl lg:hidden">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return <button key={tab.id} onClick={() => navigate(tab.id)} className={`flex min-h-[68px] flex-col items-center justify-center gap-1 px-1 text-[10px] font-black leading-tight whitespace-nowrap ${activeTab === tab.id ? "text-blue-950" : "text-slate-400"}`}><span className={`grid h-8 w-11 place-items-center rounded-full ${activeTab === tab.id ? "bg-amber-300" : ""}`}><Icon className="h-[18px] w-[18px]" /></span>{tab.shortLabel}</button>;
        })}
      </nav>

      {toast ? <div className="fixed bottom-24 left-1/2 z-[70] flex max-w-[calc(100vw-24px)] -translate-x-1/2 items-center gap-2 rounded-2xl bg-blue-950 px-5 py-3 text-center text-sm font-black text-white shadow-2xl lg:bottom-8 lg:whitespace-nowrap"><Check className="h-4 w-4 shrink-0 text-amber-300" />{toast}</div> : null}
    </div>
  );
}

function LoadingCards() {
  return <div className={styles.loadingStage}><div className={styles.loadingTicket}><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-950 text-amber-300"><Ticket className="h-6 w-6" /></span><span className="relative z-10"><strong className="block text-lg font-black">Preparando el carrito</strong><span className="mt-1 block text-xs font-bold text-blue-900/70">Sincronizando nóminas e inventario…</span></span></div></div>;
}

function OverviewMetrics({ data }: { data: CartData }) {
  const totalStock = data.rewards.reduce((sum, reward) => sum + reward.stock, 0);
  const lowStock = data.rewards.filter((reward) => reward.stock <= reward.minimum_stock).length;
  const today = new Date().toISOString().slice(0, 10);
  const stats: Array<{ label: string; value: number; icon: LucideIcon }> = [
    { label: "Tickets esta semana", value: data.weeklyAwardedIds.length, icon: Ticket },
    { label: "Canjes de hoy", value: data.redemptions.filter((row) => !row.reversed && row.created_at.slice(0, 10) === today).length, icon: Gift },
    { label: "Premios disponibles", value: totalStock, icon: Box },
    { label: "Por comprar", value: lowStock, icon: ShoppingCart },
  ];
  return <section className={styles.metricStrip} aria-label="Resumen del carrito">{stats.map(({ label, value, icon: Icon }) => <article key={label} className={styles.metricItem}><span className={styles.metricIcon}><Icon className="h-4 w-4" /></span><span><strong>{value}</strong><small>{label}</small></span></article>)}</section>;
}

function MobileQuickActions({ onNavigate }: { onNavigate: (tab: TabId) => void }) {
  const actions: Array<{ tab: TabId; label: string; icon: LucideIcon }> = [
    { tab: "entrega", label: "Registrar ticket", icon: Ticket },
    { tab: "canjes", label: "Canjear premio", icon: Gift },
    { tab: "inventario", label: "Ver inventario", icon: Box },
  ];
  return <section className={styles.mobileQuickActions} aria-label="Acciones rápidas">{actions.map(({ tab, label, icon: Icon }) => <button key={tab} onClick={() => onNavigate(tab)}><Icon className="h-5 w-5" /><span>{label}</span><ChevronRight className="ml-auto h-4 w-4 opacity-45" /></button>)}</section>;
}

function Overview({ data, onNavigate }: { data: CartData; onNavigate: (tab: TabId) => void }) {
  const lowStock = data.rewards.filter((reward) => reward.stock <= reward.minimum_stock);
  const awardedSet = new Set(data.weeklyAwardedIds);
  const weeklyProgress = data.students.length ? Math.round((data.weeklyAwardedIds.length / data.students.length) * 100) : 0;
  return (
    <div className="space-y-5">
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
    </div>
  );
}

function AwardTickets({ data, onAward, onUndo, busy }: { data: CartData; onAward: (studentId: string, note: string) => Promise<boolean>; onUndo: (studentId: string) => Promise<boolean>; busy: boolean }) {
  const [course, setCourse] = useState(COURSES[0]);
  const [query, setQuery] = useState("");
  const [note, setNote] = useState("");
  const awarded = useMemo(() => new Set(data.weeklyAwardedIds), [data.weeklyAwardedIds]);
  const students = data.students.filter((student) => student.course === course && student.fullName.toLowerCase().includes(query.toLowerCase()));
  const courseRoster = data.students.filter((student) => student.course === course);
  const courseDelivered = courseRoster.filter((student) => awarded.has(student.id)).length;
  return (
    <section className={`${styles.panel} overflow-hidden`}>
      <div className={`${styles.sectionBanner} px-4 py-5 sm:px-7 sm:py-7`}><div className="flex items-start justify-between gap-5"><div><span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-amber-300"><Ticket className="h-3.5 w-3.5" /> Semana {displayWeek(data.currentWeekStart)}</span><h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">Entrega de Golden Tickets</h2><p className="mt-2 max-w-2xl text-xs leading-5 text-blue-100 sm:text-sm sm:leading-6">Selecciona a quienes completaron su asistencia semanal. Cada estudiante puede recibir un solo ticket por semana.</p></div><div className="hidden text-right sm:block"><strong className="block text-4xl font-black text-amber-300">{courseDelivered}/{courseRoster.length}</strong><span className="text-xs font-bold text-blue-100">en {course}</span></div></div></div>
      <div className={`${styles.mobileTools} grid grid-cols-2 gap-2 border-b border-amber-100 p-3 sm:grid-cols-[1fr_1fr_1.2fr] sm:gap-3 sm:p-4`}>
        <select value={course} onChange={(event) => setCourse(event.target.value)} className="rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm font-bold outline-none">{COURSES.map((item) => <option key={item}>{item}</option>)}</select>
        <label className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar estudiante" className="w-full rounded-xl border border-amber-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none" /></label>
        <input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Observación general (opcional)" className="col-span-2 rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm outline-none sm:col-span-1" />
      </div>
      <div className="divide-y divide-slate-100 px-4 sm:px-6">
        {students.map((student) => {
          const hasTicket = awarded.has(student.id);
          return <article key={student.id} className="flex min-h-[68px] items-center gap-3 py-3"><Initials student={student} size="sm" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-900">{student.fullName}</p><p className="text-[11px] text-slate-500">{data.balances[student.id] || 0} tickets acumulados</p></div>{hasTicket ? <div className="flex shrink-0 items-center gap-1.5"><span className="hidden items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[11px] font-black text-emerald-700 sm:inline-flex"><Check className="h-3.5 w-3.5" />Entregado</span><button disabled={busy} onClick={() => window.confirm(`¿Deshacer el ticket entregado a ${student.fullName}?`) && onUndo(student.id)} className="inline-flex min-h-11 items-center gap-1 rounded-xl px-3 text-[11px] font-black text-rose-600 transition hover:bg-rose-50 disabled:opacity-50" aria-label={`Deshacer ticket de ${student.fullName}`}><Undo2 className="h-3.5 w-3.5" />Deshacer</button></div> : <button disabled={busy} onClick={() => onAward(student.id, note)} className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl bg-amber-300 px-3 text-[11px] font-black text-blue-950 shadow-sm transition hover:bg-amber-400 disabled:opacity-50"><Ticket className="h-3.5 w-3.5" />Entregar</button>}</article>;
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
  const [selectedTier, setSelectedTier] = useState<1 | 4 | 8>(1);
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
      <section className={`${styles.panel} p-4 sm:p-6`}><div className="flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-wider text-pink-500">Paso 2 · Catálogo</p><h2 className="mt-1 text-2xl font-black text-blue-950">Elige su premio</h2></div><span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-300 text-blue-950 shadow-lg shadow-amber-100"><Gift className="h-6 w-6" /></span></div>
        <div className={styles.mobileTierTabs}>{TIER_CONFIG.map((tier) => <button key={tier.cost} onClick={() => setSelectedTier(tier.cost)} className={selectedTier === tier.cost ? styles.mobileTierTabActive : ""}>{tier.label}</button>)}</div>
        <div className="mt-5 space-y-4">
          {TIER_CONFIG.map((tier) => {
            const rewards = data.rewards.filter((reward) => reward.active && reward.ticket_cost === tier.cost);
            return <section key={tier.cost} className={`${styles.mobileTierSection} ${selectedTier === tier.cost ? styles.mobileTierSectionActive : ""} rounded-2xl border p-3 ${tier.cost === 1 ? "border-emerald-200 bg-emerald-50/60" : tier.cost === 4 ? "border-sky-200 bg-sky-50/60" : "border-violet-200 bg-violet-50/60"}`}><div className="flex items-center justify-between px-1 pb-3"><div><h3 className="text-sm font-black text-blue-950">{tier.title}</h3><p className="text-[11px] font-semibold text-slate-500">Categoría de {tier.label}</p></div><span className={`grid h-9 w-9 place-items-center rounded-xl border bg-white text-sm font-black ${tierTone(tier.cost)}`}>{tier.cost}</span></div><div className="grid gap-2 sm:grid-cols-2">{rewards.map((reward) => { const enabled = Boolean(student && balance >= reward.ticket_cost && reward.stock > 0); return <article key={reward.id} className={`rounded-xl border bg-white p-3 ${enabled ? "border-amber-300 shadow-sm" : "border-slate-100 opacity-70"}`}><div className="flex items-start justify-between gap-3"><h4 className="text-sm font-black text-blue-950">{reward.name}</h4><span className={`shrink-0 text-[10px] font-black ${reward.stock > 0 ? "text-emerald-700" : "text-rose-600"}`}>{reward.stock > 0 ? `${reward.stock} disp.` : "Agotado"}</span></div>{reward.description ? <p className="mt-1 text-[11px] leading-4 text-slate-500">{reward.description}</p> : null}<button disabled={!enabled || busy} onClick={() => student && onRedeem(student.id, reward.id, note)} className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-950 px-3 text-xs font-black text-white disabled:bg-slate-300"><Trophy className="h-3.5 w-3.5" />{!student ? "Selecciona estudiante" : balance < reward.ticket_cost ? `Faltan ${reward.ticket_cost - balance}` : reward.stock < 1 ? "Sin stock" : "Confirmar cobro"}</button></article>; })}{!rewards.length ? <p className="col-span-full rounded-xl border border-dashed border-slate-200 bg-white/70 p-4 text-center text-xs font-semibold text-slate-500">Aún no hay premios en esta categoría.</p> : null}</div></section>;
          })}
        </div>
      </section>
    </div>
  );
}

function Registry({ data, busy, onUndo }: { data: CartData; busy: boolean; onUndo: (redemption: Redemption) => Promise<boolean> }) {
  const [course, setCourse] = useState("Todos");
  const [query, setQuery] = useState("");
  const rows = data.redemptions.filter((row) => (course === "Todos" || row.course === course) && `${row.student_name} ${row.reward_name}`.toLowerCase().includes(query.toLowerCase()));
  const activeRows = rows.filter((row) => !row.reversed);
  const exportCsv = () => {
    const values = [["Fecha", "Estudiante", "Curso", "Premio", "Tickets", "Estado", "Responsable", "Observación"], ...rows.map((row) => [formatDateTime(row.created_at), row.student_name, row.course, row.reward_name, row.tickets_spent, row.reversed ? "Anulado" : "Vigente", row.actor_name, row.note])];
    const csv = values.map((line) => line.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(";")).join("\n");
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `catastro-carrito-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };
  const undo = (row: Redemption) => {
    const confirmed = window.confirm(`¿Anular el canje de ${row.student_name}?\n\nSe devolverán ${row.tickets_spent} tickets a su saldo y 1 unidad de “${row.reward_name}” al inventario. Confirma que el premio físico fue devuelto.`);
    if (confirmed) void onUndo(row);
  };
  return <section className={`${styles.panel} overflow-hidden`}>
    <div className={`${styles.sectionBanner} flex flex-col gap-4 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-7`}><div><span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-amber-300"><ClipboardList className="h-3.5 w-3.5" /> Historial auditable</span><h2 className="mt-3 text-3xl font-black tracking-tight">Catastro de canjes</h2><p className="mt-1 text-sm text-blue-100">{activeRows.length} vigentes · {rows.length - activeRows.length} anulados</p></div><button onClick={exportCsv} className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 py-3 text-sm font-black text-blue-950 shadow-lg"><Download className="h-4 w-4" />Exportar catastro</button></div>
    <div className="grid gap-3 border-b border-slate-100 bg-amber-50 p-4 sm:grid-cols-2"><select value={course} onChange={(event) => setCourse(event.target.value)} className="rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm font-bold"><option>Todos</option>{COURSES.map((item) => <option key={item}>{item}</option>)}</select><label className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar estudiante o premio" className="w-full rounded-xl border border-amber-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none" /></label></div>
    <div className="divide-y divide-slate-100">{rows.map((row) => <article key={row.id} className={`grid gap-3 px-4 py-4 transition sm:grid-cols-[1.1fr_0.9fr_1fr] sm:items-center sm:px-6 ${row.reversed ? "bg-slate-50 opacity-70" : "hover:bg-amber-50/50"}`}><div><div className="flex items-center gap-2"><strong className="block text-sm text-slate-900">{row.student_name}</strong><span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${row.reversed ? "bg-slate-200 text-slate-600" : "bg-emerald-100 text-emerald-700"}`}>{row.reversed ? "Anulado" : "Vigente"}</span></div><span className="text-xs text-slate-500">{row.course} · {formatDateTime(row.created_at)}</span></div><div><strong className={`block text-sm text-blue-950 ${row.reversed ? "line-through" : ""}`}>{row.reward_name}</strong><span className="text-xs text-slate-500">{row.tickets_spent} {row.tickets_spent === 1 ? "ticket utilizado" : "tickets utilizados"}</span></div><div className="flex items-center justify-between gap-3 sm:justify-end"><span className="text-xs font-bold text-slate-600">{row.actor_name}</span>{row.reversed ? <span className="inline-flex min-h-9 items-center gap-1 text-[10px] font-black text-slate-500"><Undo2 className="h-3.5 w-3.5" />Saldo y stock restituidos</span> : <button disabled={busy} onClick={() => undo(row)} className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 text-[11px] font-black text-rose-700 hover:bg-rose-100 disabled:opacity-50"><Undo2 className="h-3.5 w-3.5" />Deshacer canje</button>}</div>{row.note ? <p className="text-xs text-slate-400 sm:col-span-3">Observación: {row.note}</p> : null}</article>)}{!rows.length ? <div className="p-12 text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-blue-900"><History className="h-8 w-8" /></span><p className="mt-4 font-black text-blue-950">El primer canje aparecerá aquí</p><p className="mt-1 text-sm font-semibold text-slate-500">Podrás ver quién cobró, qué premio eligió y cuándo.</p></div> : null}</div>
  </section>;
}

function Inventory({ data, accessToken, busy, onCreate, onAdjust, onApplyScan }: { data: CartData; accessToken: string; busy: boolean; onCreate: (values: Record<string, unknown>) => Promise<boolean>; onAdjust: (values: Record<string, unknown>) => Promise<boolean>; onApplyScan: (items: ScannedInventoryItem[]) => Promise<boolean> }) {
  const [showCreate, setShowCreate] = useState(false);
  const [addCategory, setAddCategory] = useState<1 | 4 | 8 | null>(null);
  const [scanCategory, setScanCategory] = useState<1 | 4 | 8>(1);
  const [form, setForm] = useState({ name: "", description: "", ticketCost: 1, initialStock: 0, minimumStock: 3 });
  const [selectedTier, setSelectedTier] = useState<1 | 4 | 8>(1);
  const [adjusting, setAdjusting] = useState<Reward | null>(null);
  const [adjustment, setAdjustment] = useState({ delta: 1, kind: "purchase", note: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scanOpen, setScanOpen] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanSaving, setScanSaving] = useState(false);
  const [scanError, setScanError] = useState("");
  const [scanNotes, setScanNotes] = useState("");
  const [scanItems, setScanItems] = useState<ScannedInventoryItem[]>([]);
  const [scanPreview, setScanPreview] = useState("");
  const lowStock = data.rewards.filter((reward) => reward.stock <= reward.minimum_stock);
  const create = async (event: FormEvent) => { event.preventDefault(); if (await onCreate(form)) { setForm({ name: "", description: "", ticketCost: 1, initialStock: 0, minimumStock: 3 }); setShowCreate(false); } };
  const adjust = async (event: FormEvent) => { event.preventDefault(); if (!adjusting) return; const signedDelta = adjustment.kind === "loss" ? -Math.abs(adjustment.delta) : adjustment.delta; if (await onAdjust({ rewardId: adjusting.id, ...adjustment, delta: signedDelta })) setAdjusting(null); };
  const openCreate = (ticketCost: 1 | 4 | 8) => {
    setSelectedTier(ticketCost);
    setForm((current) => ({ ...current, ticketCost }));
    setShowCreate(true);
    window.requestAnimationFrame(() => document.getElementById("nuevo-premio")?.scrollIntoView({ behavior: "smooth", block: "center" }));
  };
  useEffect(() => () => { if (scanPreview) URL.revokeObjectURL(scanPreview); }, [scanPreview]);
  const updateScanItem = (clientId: string, patch: Partial<ScannedInventoryItem>) => setScanItems((current) => current.map((item) => item.clientId === clientId ? { ...item, ...patch } : item));
  const analyzePhoto = async (file?: File) => {
    if (!file) return;
    setScanOpen(true);
    setScanLoading(true);
    setScanError("");
    setScanNotes("");
    setScanItems([]);
    try {
      const prepared = await prepareInventoryPhoto(file);
      setScanPreview((current) => { if (current) URL.revokeObjectURL(current); return URL.createObjectURL(prepared); });
      const formData = new FormData();
      formData.append("image", prepared);
      formData.append("category", String(scanCategory));
      formData.append("existingRewards", JSON.stringify(data.rewards.filter((reward) => reward.ticket_cost === scanCategory).map((reward) => ({ id: reward.id, name: reward.name, ticketCost: reward.ticket_cost }))));
      const response = await fetch("/api/carrito-asistencia/analyze-image", { method: "POST", headers: { authorization: `Bearer ${accessToken}` }, body: formData });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "No se pudo analizar la foto");
      const proposals = Array.isArray(payload.items) ? payload.items : [];
      setScanItems(proposals.map((item: Omit<ScannedInventoryItem, "clientId" | "selected">, index: number) => ({ ...item, ticketCost: scanCategory, selected: true, clientId: `${Date.now()}-${index}` })));
      setScanNotes(String(payload.notes || ""));
    } catch (photoError) {
      setScanError(photoError instanceof Error ? photoError.message : "No se pudo analizar la foto");
    } finally {
      setScanLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  const saveScan = async () => {
    const selected = scanItems.filter((item) => item.selected && item.name.trim() && item.quantity > 0);
    if (!selected.length) { setScanError("Selecciona al menos un objeto para guardar."); return; }
    setScanSaving(true);
    setScanError("");
    if (await onApplyScan(selected)) setScanOpen(false);
    setScanSaving(false);
  };
  const choosePhoto = (category: 1 | 4 | 8) => {
    setScanCategory(category);
    setAddCategory(null);
    window.requestAnimationFrame(() => fileInputRef.current?.click());
  };
  return <div className="space-y-5"><section className={`${styles.panel} overflow-hidden`}><input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="sr-only" onChange={(event) => void analyzePhoto(event.target.files?.[0])} /><div className={`${styles.sectionBanner} px-4 py-5 sm:px-7 sm:py-7`}><div><span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-amber-300"><Box className="h-3.5 w-3.5" /> Control del carrito</span><h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">Inventario de premios</h2><p className="mt-1 text-xs text-blue-100 sm:text-sm">{lowStock.length ? `${lowStock.length} productos necesitan reposición` : "Todo listo para la próxima vuelta del carrito"}</p></div></div><div className="p-3 sm:p-6">
        <div className={styles.mobileTierTabs}>{TIER_CONFIG.map((tier) => <button key={tier.cost} onClick={() => setSelectedTier(tier.cost)} className={selectedTier === tier.cost ? styles.mobileTierTabActive : ""}>{tier.label}</button>)}</div>
        {showCreate ? <form id="nuevo-premio" onSubmit={create} className="mt-4 grid gap-3 rounded-2xl border-2 border-amber-200 bg-amber-50 p-4 sm:grid-cols-2"><div className="sm:col-span-2 flex items-center justify-between rounded-xl bg-blue-950 px-4 py-3 text-white"><span className="text-xs font-bold">Categoría seleccionada</span><strong className="text-sm text-amber-300">{form.ticketCost} {form.ticketCost === 1 ? "ticket" : "tickets"}</strong></div><label className="text-xs font-black text-slate-600">Nombre del premio<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required className="mt-1.5 min-h-12 w-full rounded-xl border border-amber-200 bg-white px-3 text-sm outline-none" placeholder="Ej. Set de stickers" /></label><label className="text-xs font-black text-slate-600">Descripción<input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-1.5 min-h-12 w-full rounded-xl border border-amber-200 bg-white px-3 text-sm outline-none" placeholder="Opcional" /></label><div className="grid grid-cols-2 gap-3 sm:col-span-2"><label className="text-xs font-black text-slate-600">Stock inicial<input value={form.initialStock} onChange={(event) => setForm({ ...form, initialStock: Number(event.target.value) })} type="number" min="0" className="mt-1.5 min-h-12 w-full rounded-xl border border-amber-200 bg-white px-3 text-sm" /></label><label className="text-xs font-black text-slate-600">Alerta bajo<input value={form.minimumStock} onChange={(event) => setForm({ ...form, minimumStock: Number(event.target.value) })} type="number" min="0" className="mt-1.5 min-h-12 w-full rounded-xl border border-amber-200 bg-white px-3 text-sm" /></label></div><div className="flex gap-2 sm:col-span-2"><button disabled={busy} className="min-h-12 flex-1 rounded-xl bg-blue-950 px-4 text-sm font-black text-white disabled:opacity-50">Guardar premio</button><button type="button" onClick={() => setShowCreate(false)} className="min-h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-600">Cancelar</button></div></form> : null}
        <div className="mt-4 space-y-5">{TIER_CONFIG.map((tier) => { const rewards = data.rewards.filter((reward) => reward.ticket_cost === tier.cost); return <section key={tier.cost} className={`${styles.mobileTierSection} ${selectedTier === tier.cost ? styles.mobileTierSectionActive : ""} overflow-hidden rounded-2xl border-2 ${tier.cost === 1 ? "border-emerald-200 bg-emerald-50/50" : tier.cost === 4 ? "border-sky-200 bg-sky-50/50" : "border-violet-200 bg-violet-50/50"}`}><div className="flex flex-col gap-3 border-b border-white bg-white/75 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><span className={`grid h-11 w-11 place-items-center rounded-xl border bg-white text-lg font-black ${tierTone(tier.cost)}`}>{tier.cost}</span><div><h3 className="font-black text-blue-950">{tier.title}</h3><p className="text-xs text-slate-500">Categoría de {tier.label} · {tier.description}</p></div></div><button onClick={() => { setSelectedTier(tier.cost); setAddCategory(tier.cost); }} className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-blue-950 px-3 text-xs font-black text-white"><PackagePlus className="h-3.5 w-3.5" />Añadir stock de premios</button></div><div className="grid gap-3 p-3 sm:grid-cols-2 lg:grid-cols-3">{rewards.map((reward) => { const low = reward.stock <= reward.minimum_stock; return <article key={reward.id} className={`rounded-xl border bg-white p-3 shadow-sm ${low ? "border-rose-200" : "border-slate-100"}`}><div className="flex items-start justify-between gap-2"><h4 className="text-sm font-black text-blue-950">{reward.name}</h4><span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-black ${low ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>{low ? "Comprar" : "Disponible"}</span></div>{reward.description ? <p className="mt-1 text-[11px] text-slate-500">{reward.description}</p> : null}<div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><span className="text-2xl font-black text-slate-950">{reward.stock}</span><span className="ml-1 text-[11px] font-bold text-slate-500">unidades</span><p className="text-[10px] text-slate-400">Alerta en {reward.minimum_stock}</p></div><button onClick={() => { setAdjusting(reward); setAdjustment({ delta: 1, kind: "purchase", note: "" }); }} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-50 px-3 text-xs font-black text-blue-950 ring-1 ring-blue-100 sm:h-9 sm:min-h-0 sm:w-9 sm:px-0" aria-label={`Actualizar stock de ${reward.name}`}><Plus className="h-4 w-4" /><span className="sm:hidden">Actualizar stock</span></button></div></article>; })}{!rewards.length ? <div className="col-span-full rounded-xl border border-dashed border-slate-200 bg-white/70 p-6 text-center"><Gift className="mx-auto h-6 w-6 text-slate-300" /><p className="mt-2 text-xs font-semibold text-slate-500">No hay premios registrados en esta categoría.</p></div> : null}</div></section>; })}</div>
      </div></section>
      <section className={`${styles.panel} overflow-hidden`}><div className="border-b border-slate-100 px-5 py-4"><h3 className="font-black text-blue-950">Últimos movimientos</h3><p className="mt-1 text-xs text-slate-500">Compras, entregas y ajustes quedan registrados aquí.</p></div><div className="divide-y divide-slate-100">{data.inventoryMovements.slice(0, 20).map((row) => { const reward = data.rewards.find((item) => item.id === row.reward_id); return <div key={row.id} className="flex items-center gap-3 px-5 py-3"><span className={`grid h-9 w-9 place-items-center rounded-full ${row.delta > 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{row.delta > 0 ? <Plus className="h-4 w-4" /> : <Minus className="h-4 w-4" />}</span><div className="flex-1"><strong className="block text-sm">{reward?.name || "Premio"}</strong><span className="text-xs text-slate-500">{formatDateTime(row.created_at)} · {row.actor_name}{row.note ? ` · ${row.note}` : ""}</span></div><span className={`font-black ${row.delta > 0 ? "text-emerald-700" : "text-rose-700"}`}>{row.delta > 0 ? "+" : ""}{row.delta}</span></div>; })}{!data.inventoryMovements.length ? <p className="p-8 text-center text-sm text-slate-500">Sin movimientos todavía.</p> : null}</div></section>
      {addCategory ? <div className="fixed inset-0 z-[85] grid place-items-end bg-slate-950/50 p-3 backdrop-blur-sm sm:place-items-center" onClick={() => setAddCategory(null)}><section role="dialog" aria-modal="true" aria-labelledby="add-stock-title" onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-xs font-black uppercase tracking-wider text-amber-600">Categoría de {addCategory} {addCategory === 1 ? "ticket" : "tickets"}</p><h3 id="add-stock-title" className="mt-1 text-xl font-black text-blue-950">¿Cómo quieres añadir el stock?</h3></div><button onClick={() => setAddCategory(null)} className="grid h-9 w-9 place-items-center rounded-full bg-slate-100"><X className="h-4 w-4" /></button></div><div className="mt-5 grid gap-3"><button onClick={() => choosePhoto(addCategory)} className="flex min-h-20 items-center gap-4 rounded-2xl bg-blue-950 p-4 text-left text-white shadow-lg"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-300 text-blue-950"><Camera className="h-5 w-5" /></span><span><strong className="block text-sm">Sacar una foto con IA</strong><small className="mt-1 block text-blue-100">Identifica nombres y cuenta las unidades visibles.</small></span><ChevronRight className="ml-auto h-5 w-5 shrink-0 text-amber-300" /></button><button onClick={() => { openCreate(addCategory); setAddCategory(null); }} className="flex min-h-20 items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-blue-950"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white shadow-sm"><PackagePlus className="h-5 w-5" /></span><span><strong className="block text-sm">Ingresar manualmente</strong><small className="mt-1 block text-slate-500">Escribe el premio y la cantidad.</small></span><ChevronRight className="ml-auto h-5 w-5 shrink-0 text-slate-400" /></button></div></section></div> : null}
      {scanOpen ? <div className="fixed inset-0 z-[90] grid place-items-end bg-slate-950/55 p-0 backdrop-blur-sm sm:place-items-center sm:p-4" onClick={() => !scanSaving && setScanOpen(false)}><section role="dialog" aria-modal="true" aria-labelledby="scan-title" onClick={(event) => event.stopPropagation()} className="flex max-h-[94dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-[28px] bg-slate-50 shadow-2xl sm:max-h-[90vh] sm:rounded-[28px]"><header className="flex items-start justify-between gap-3 border-b border-slate-200 bg-white px-4 py-4 sm:px-6"><div className="flex items-center gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-amber-300 to-amber-400 text-blue-950 shadow-sm"><Sparkles className="h-5 w-5" /></span><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-600">Categoría de {scanCategory} {scanCategory === 1 ? "ticket" : "tickets"} · Inventario con IA</p><h3 id="scan-title" className="text-lg font-black text-blue-950 sm:text-xl">Revisa lo detectado</h3><p className="text-xs text-slate-500">Nada se guarda hasta que confirmes.</p></div></div><button disabled={scanSaving} onClick={() => setScanOpen(false)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600"><X className="h-4 w-4" /></button></header><div className="overflow-y-auto overscroll-contain p-3 sm:p-6"><div className="grid gap-4 md:grid-cols-[220px_1fr]"><div><div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-200">{scanPreview ? <Image src={scanPreview} alt="Foto del inventario por analizar" fill unoptimized className="object-cover" /> : <Camera className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 text-slate-400" />}{scanLoading ? <div className="absolute inset-0 grid place-items-center bg-blue-950/70 text-center text-white"><span><LoaderCircle className="mx-auto h-7 w-7 animate-spin text-amber-300" /><strong className="mt-2 block text-sm">Contando premios…</strong><small className="mt-1 block text-blue-100">Puede tardar unos segundos</small></span></div> : null}</div><button disabled={scanLoading || scanSaving} onClick={() => fileInputRef.current?.click()} className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-blue-950 disabled:opacity-50"><Camera className="h-4 w-4" />Tomar otra foto</button>{scanNotes ? <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900"><strong className="block">Observación de la IA</strong>{scanNotes}</p> : null}</div><div className="min-w-0">{scanError ? <p role="alert" className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700">{scanError}</p> : null}{!scanLoading && !scanItems.length && !scanError ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center"><Box className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-3 text-sm font-black text-blue-950">No se reconocieron premios</p><p className="mt-1 text-xs text-slate-500">Prueba con mejor luz y todos los objetos visibles.</p></div> : null}<div className="space-y-3">{scanItems.map((item, index) => { const matchedReward = data.rewards.find((reward) => reward.id === item.existingRewardId); return <article key={item.clientId} className={`rounded-2xl border bg-white p-3 transition ${item.selected ? "border-amber-300 shadow-sm" : "border-slate-200 opacity-60"}`}><div className="flex items-start gap-3"><label className="mt-1 grid h-6 w-6 shrink-0 place-items-center"><input type="checkbox" checked={item.selected} onChange={(event) => updateScanItem(item.clientId, { selected: event.target.checked })} className="h-5 w-5 accent-blue-950" aria-label={`Incluir objeto ${index + 1}`} /></label><div className="min-w-0 flex-1"><div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><span className={`w-fit rounded-full px-2 py-1 text-[10px] font-black ${matchedReward ? "bg-emerald-100 text-emerald-800" : "bg-blue-50 text-blue-800"}`}>{matchedReward ? `Reposición: ${matchedReward.name}` : "Premio nuevo"}</span><span className="text-[10px] font-bold text-slate-400">Confianza IA: {Math.round(item.confidence * 100)}%</span></div><div className="mt-3 grid gap-3 sm:grid-cols-[1fr_90px]"><label className="text-[10px] font-black uppercase tracking-wide text-slate-500">Nombre<input value={item.name} onChange={(event) => updateScanItem(item.clientId, { name: event.target.value })} disabled={!item.selected} className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-600" /></label><label className="text-[10px] font-black uppercase tracking-wide text-slate-500">Cantidad<input value={item.quantity} onChange={(event) => updateScanItem(item.clientId, { quantity: Math.max(1, Number(event.target.value)) })} disabled={!item.selected} type="number" min="1" max="999" className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-black outline-none focus:border-blue-600" /></label></div><div className="mt-3 grid gap-3 sm:grid-cols-[1fr_155px]"><label className="text-[10px] font-black uppercase tracking-wide text-slate-500">Descripción<input value={item.description} onChange={(event) => updateScanItem(item.clientId, { description: event.target.value })} disabled={!item.selected} className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-600" placeholder="Opcional" /></label><label className="text-[10px] font-black uppercase tracking-wide text-slate-500">Guardar como<select value={item.existingRewardId} onChange={(event) => { const reward = data.rewards.find((entry) => entry.id === event.target.value); updateScanItem(item.clientId, { existingRewardId: event.target.value, ...(reward ? { name: reward.name, ticketCost: reward.ticket_cost } : {}) }); }} disabled={!item.selected} className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-2 text-xs font-bold"><option value="">Premio nuevo</option>{data.rewards.filter((reward) => reward.ticket_cost === scanCategory).map((reward) => <option key={reward.id} value={reward.id}>Reponer {reward.name}</option>)}</select></label></div>{!matchedReward ? <label className="mt-3 block text-[10px] font-black uppercase tracking-wide text-slate-500">Avisar cuando queden<input value={item.minimumStock} onChange={(event) => updateScanItem(item.clientId, { minimumStock: Math.max(0, Number(event.target.value)) })} disabled={!item.selected} type="number" min="0" className="ml-2 h-9 w-20 rounded-lg border border-slate-200 px-2 text-sm" /></label> : null}</div></div></article>; })}</div></div></div></div><footer className="border-t border-slate-200 bg-white px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom))] sm:flex sm:items-center sm:justify-between sm:px-6 sm:pb-3"><p className="mb-2 text-center text-xs font-semibold text-slate-500 sm:mb-0 sm:text-left">{scanItems.filter((item) => item.selected).length} grupos seleccionados · categoría {scanCategory} {scanCategory === 1 ? "ticket" : "tickets"}</p><button disabled={scanLoading || scanSaving || !scanItems.some((item) => item.selected)} onClick={() => void saveScan()} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-950 px-5 text-sm font-black text-white shadow-lg disabled:opacity-40 sm:w-auto">{scanSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-amber-300" />}{scanSaving ? "Guardando…" : "Añadir al inventario"}</button></footer></section></div> : null}
      {adjusting ? <div className="fixed inset-0 z-[80] grid place-items-end bg-slate-950/45 p-3 backdrop-blur-sm sm:place-items-center" onClick={() => setAdjusting(null)}><form onSubmit={adjust} onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-xs font-black uppercase tracking-wider text-amber-600">Actualizar stock</p><h3 className="mt-1 text-xl font-black text-blue-950">{adjusting.name}</h3><p className="text-sm text-slate-500">Stock actual: {adjusting.stock}</p></div><button type="button" onClick={() => setAdjusting(null)} className="grid h-9 w-9 place-items-center rounded-full bg-slate-100"><X className="h-4 w-4" /></button></div><div className="mt-5 grid grid-cols-2 gap-3"><label className="text-xs font-black text-slate-600">Movimiento<select value={adjustment.kind} onChange={(event) => setAdjustment({ ...adjustment, kind: event.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"><option value="purchase">Compra / reposición</option><option value="loss">Pérdida o daño</option><option value="adjustment">Ajuste manual</option></select></label><label className="text-xs font-black text-slate-600">Cantidad<input value={adjustment.delta} onChange={(event) => setAdjustment({ ...adjustment, delta: Math.max(1, Number(event.target.value)) })} type="number" min="1" required className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" /></label></div><label className="mt-3 block text-xs font-black text-slate-600">Nota<input value={adjustment.note} onChange={(event) => setAdjustment({ ...adjustment, note: event.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" placeholder="Ej. Compra del 22 de julio" /></label><button disabled={busy} className="mt-5 w-full rounded-xl bg-blue-950 px-4 py-3 font-black text-white disabled:opacity-50">Guardar movimiento</button></form></div> : null}
    </div>;
}
