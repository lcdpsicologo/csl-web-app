"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Dices, HeartHandshake, Send, Shuffle, Sparkles } from "lucide-react";
import { familyConversationGuide } from "@/lib/maletin";
import { GameShareModal } from "@/components/GameShareModal";
import { MaletinBrand, StrengthsMark } from "@/components/MaletinBrand";

const activities = [
  {
    title: "Revoltijo de las emociones",
    description: "Tarjetas por color y nivel para reconocer señales, expresarse y practicar regulación.",
    href: "/revoltijo-emociones",
    image: "/maletin/revoltijo.webp",
    icon: Shuffle,
    meta: "5 niveles · 4 colores",
  },
  {
    title: "La escalera de las emociones",
    description: "Tablero colaborativo con dado, fichas, escaleras, serpientes y 32 conversaciones.",
    href: "/escalera-emociones",
    image: "/maletin/escalera.webp",
    icon: Dices,
    meta: "2–4 participantes · 20–35 min",
  },
];

export function MaletinViajeroHub() {
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#f5f2e9] text-slate-950">
      <header className="absolute inset-x-0 top-0 z-30 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/?view=games" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-bold backdrop-blur hover:bg-white/20"><ArrowLeft className="h-4 w-4" /> Juegos Vinculares</Link>
          <button onClick={() => setShareOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-[#f5b82e] px-4 py-2 text-xs font-black text-[#062b67] shadow-lg hover:bg-[#ffd365]"><Send className="h-4 w-4" /> Enviar maletín</button>
        </div>
      </header>

      <section className="relative isolate overflow-hidden bg-[#062b67] text-white">
        <Image src="/maletin/familia-hero.webp" alt="Familia conversando con actividades del Maletín Viajero" fill priority sizes="100vw" className="-z-20 object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#041d47] via-[#062b67]/90 to-[#062b67]/15" />
        <div className="mx-auto flex min-h-[680px] max-w-7xl items-end px-4 pb-16 pt-28 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3"><MaletinBrand /><StrengthsMark compact /></div>
            <span className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-bold backdrop-blur"><Sparkles className="h-3.5 w-3.5 text-[#ffd365]" /> Experiencias para conversar, jugar y conectar</span>
            <h1 className="mt-4 text-5xl font-black tracking-[-0.055em] sm:text-7xl">Las emociones<br /><span className="text-[#ffd365]">viajan con nosotros.</span></h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">Una colección interactiva para llevar la conversación socioemocional del colegio a la casa —y de la casa al colegio— con actividades claras, cuidadosas y listas para usar.</p>
            <div className="mt-8 flex flex-wrap gap-3"><a href="#actividades" className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-black text-[#062b67] shadow-xl hover:-translate-y-0.5">Explorar actividades <ArrowRight className="h-4 w-4" /></a><a href="#guia" className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-5 py-3.5 text-sm font-black text-white backdrop-blur hover:bg-white/20"><BookOpen className="h-4 w-4" /> Guía para familias</a></div>
          </div>
        </div>
      </section>

      <section id="actividades" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#087f8c]">Actividades del maletín</p><h2 className="mt-2 text-4xl font-black tracking-[-0.04em]">Elige cómo quieren conectar hoy</h2></div><p className="max-w-md text-sm leading-6 text-slate-600">No hay respuestas correctas. La meta es escuchar, poner palabras y descubrir recursos juntos.</p></div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <Link key={activity.href} href={activity.href} className="group relative isolate min-h-[470px] overflow-hidden rounded-[32px] bg-[#062b67] text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
                <Image src={activity.image} alt={activity.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="-z-20 object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#03183a] via-[#062b67]/65 to-transparent" />
                <div className="flex min-h-[470px] flex-col justify-end p-6 sm:p-8"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#f5b82e] text-[#062b67] shadow-lg"><Icon className="h-7 w-7" /></div><p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-[#ffd365]">{activity.meta}</p><h3 className="mt-2 text-3xl font-black tracking-tight">{activity.title}</h3><p className="mt-3 max-w-lg text-sm leading-6 text-blue-100">{activity.description}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-black">Abrir experiencia <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></div>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="guia" className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div><span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-black text-rose-700"><HeartHandshake className="h-4 w-4" /> Cartilla para apoderados/as</span><h2 className="mt-5 text-4xl font-black tracking-[-0.04em]">¿Cómo conversar más sobre lo que sienten nuestros hijos e hijas?</h2><p className="mt-4 text-base leading-7 text-slate-600">Una conversación emocional segura empieza antes de la pregunta: en la disposición del adulto a escuchar sin apurar, juzgar ni adivinar.</p><div className="mt-6 rounded-3xl bg-[#062b67] p-6 text-blue-50"><p className="font-black text-white">Pregunta guía</p><p className="mt-2 text-lg leading-7">“¿Qué podrías estar sintiendo y qué podrías estar necesitando?”</p></div></div>
          <div className="grid gap-4 sm:grid-cols-2">{familyConversationGuide.map((item, index) => <article key={item.title} className="rounded-[24px] border border-slate-200 bg-[#fbfaf6] p-5"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#e4f4f1] text-sm font-black text-[#087f8c]">{index + 1}</span><h3 className="mt-4 text-lg font-black">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p></article>)}</div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="grid gap-6 rounded-[32px] bg-gradient-to-br from-[#062b67] to-[#087f8c] p-7 text-white shadow-xl md:grid-cols-[1fr_auto] md:items-center sm:p-10"><div><CheckCircle2 className="h-8 w-8 text-[#ffd365]" /><h2 className="mt-4 text-3xl font-black tracking-tight">Listo para viajar a otra familia o curso</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">Envía el acceso por WhatsApp, correo o enlace. El destinatario puede abrirlo sin ingresar datos personales.</p></div><button onClick={() => setShareOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#f5b82e] px-6 py-4 text-sm font-black text-[#062b67] shadow-lg"><Send className="h-5 w-5" /> Compartir colección</button></div><p className="mt-6 text-center text-xs leading-5 text-slate-500">Adaptación digital institucional basada en el material aportado de Fundación Educacional Arauco y Focus, RPI 2023-A-3014.</p></section>

      <GameShareModal open={shareOpen} onClose={() => setShareOpen(false)} title="Maletín Viajero — Colegio San Lucas" path="/maletin-viajero" description="Colección de actividades para conversar, jugar y fortalecer vínculos en familia o en el colegio." />
    </main>
  );
}
