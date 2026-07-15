"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, Check, CircleHelp, HeartHandshake, RotateCcw, Send, Shuffle, Sparkles, Volume2, VolumeX, Wind } from "lucide-react";
import { colorMeanings, colorStyles, type EmotionColor, levelOptions, type LevelId, type RevoltijoCard, revoltijoCards } from "@/lib/revoltijoCards";
import { GameShareModal } from "@/components/GameShareModal";
import { MaletinBrand, StrengthsMark } from "@/components/MaletinBrand";

const colorOrder: EmotionColor[] = ["Rojo", "Azul", "Amarillo", "Verde"];
const colorHex: Record<EmotionColor, string> = { Rojo: "#e75b52", Azul: "#3b82c4", Amarillo: "#f5b82e", Verde: "#25a18e" };
const colorInstruction: Record<EmotionColor, string> = {
  Rojo: "Reconoce la activación sin juzgarla.",
  Azul: "Da espacio a lo que necesita compañía.",
  Amarillo: "Canaliza la energía con propósito.",
  Verde: "Practica calma, gratitud y regulación.",
};

function playTone() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(520, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(840, context.currentTime + 0.16);
  gain.gain.setValueAtTime(0.001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.14, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.26);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.28);
}

declare global { interface Window { webkitAudioContext?: typeof AudioContext } }

export function RevoltijoGame() {
  const [level, setLevel] = useState<LevelId>("prebasica");
  const [selectedColor, setSelectedColor] = useState<EmotionColor>("Rojo");
  const [currentCard, setCurrentCard] = useState<RevoltijoCard | null>(null);
  const [previousCard, setPreviousCard] = useState<RevoltijoCard | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [drawCount, setDrawCount] = useState(0);
  const [completedColors, setCompletedColors] = useState<EmotionColor[]>([]);
  const [audience, setAudience] = useState<"familia" | "curso">("familia");
  const [shareOpen, setShareOpen] = useState(false);

  const cardsForSelection = useMemo(() => revoltijoCards.filter((card) => card.level === level && card.color === selectedColor), [level, selectedColor]);
  const activeStyle = colorStyles[currentCard?.color ?? selectedColor];

  const drawCard = () => {
    if (currentCard) setPreviousCard(currentCard);
    const pool = cardsForSelection.filter((card) => card.id !== currentCard?.id);
    const source = pool.length ? pool : cardsForSelection;
    setCurrentCard(source[Math.floor(Math.random() * source.length)]);
    setDrawCount((count) => count + 1);
    if (soundEnabled) playTone();
  };

  const completeCard = () => {
    if (!completedColors.includes(selectedColor)) setCompletedColors((current) => [...current, selectedColor]);
    const targetColor = currentCard?.nextColor ?? colorOrder[(colorOrder.indexOf(selectedColor) + 1) % colorOrder.length];
    setSelectedColor(targetColor);
    setCurrentCard(null);
  };

  const reset = () => {
    setCurrentCard(null);
    setPreviousCard(null);
    setDrawCount(0);
    setCompletedColors([]);
    setSelectedColor("Rojo");
  };

  return (
    <main className="min-h-screen bg-[#f4f1e8] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#062b67]/95 text-white shadow-lg backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3"><Link href="/maletin-viajero" aria-label="Volver" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 hover:bg-white/20"><ArrowLeft className="h-5 w-5" /></Link><MaletinBrand compact /></div>
          <div className="flex items-center gap-2"><button onClick={() => setSoundEnabled((value) => !value)} aria-pressed={soundEnabled} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20" title="Activar o desactivar sonido">{soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}</button><button onClick={() => setShareOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-[#f5b82e] px-3 py-2 text-xs font-black text-[#062b67] hover:bg-[#ffd365]"><Send className="h-4 w-4" /> Compartir</button></div>
        </div>
      </header>

      <section className="relative isolate overflow-hidden bg-[#062b67] text-white">
        <Image src="/maletin/revoltijo.webp" alt="Tarjetas visuales de emociones por color" fill priority sizes="100vw" className="z-0 object-cover object-center opacity-70" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#041f4e] via-[#062b67]/84 to-[#062b67]/10" />
        <div className="relative z-20 mx-auto grid min-h-[360px] max-w-[1500px] items-end gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_auto]">
          <div className="max-w-3xl"><span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-bold backdrop-blur"><Sparkles className="h-3.5 w-3.5 text-[#ffd365]" /> Maletín Viajero · Experiencia por niveles</span><h1 className="mt-4 text-4xl font-black tracking-[-0.045em] sm:text-6xl">Revoltijo de las emociones</h1><p className="mt-4 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">Un recorrido visual para reconocer lo que ocurre en el cuerpo, expresarlo con seguridad y descubrir estrategias que cuidan el vínculo.</p></div>
          <StrengthsMark />
        </div>
      </section>

      <div className="mx-auto grid max-w-[1500px] gap-5 px-4 py-6 sm:px-6 xl:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Preparar experiencia</p>
            <label className="mt-4 block text-sm font-black text-slate-700">Nivel<select value={level} onChange={(event) => { setLevel(event.target.value as LevelId); reset(); }} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold outline-none focus:border-[#087f8c]">{levelOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label>
            <p className="mt-5 text-sm font-black text-slate-700">¿Dónde lo realizarán?</p>
            <div className="mt-2 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1.5">{(["familia", "curso"] as const).map((value) => <button key={value} onClick={() => setAudience(value)} className={`rounded-lg px-2 py-2 text-xs font-black ${audience === value ? "bg-white text-[#073b78] shadow-sm" : "text-slate-500"}`}>{value === "familia" ? "En familia" : "En el curso"}</button>)}</div>
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Ruta emocional</p><p className="mt-1 text-sm font-bold text-slate-700">{completedColors.length} de 4 colores explorados</p></div><button onClick={reset} title="Reiniciar" className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"><RotateCcw className="h-4 w-4" /></button></div>
            <div className="mt-4 space-y-2">{colorOrder.map((color) => { const selected = selectedColor === color; const complete = completedColors.includes(color); return <button key={color} onClick={() => { setSelectedColor(color); setCurrentCard(null); }} className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${selected ? "border-slate-900 bg-slate-950 text-white shadow-md" : "border-slate-200 bg-white hover:bg-slate-50"}`}><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white" style={{ backgroundColor: colorHex[color] }}>{complete ? <Check className="h-4 w-4" /> : color.slice(0, 1)}</span><span className="min-w-0"><span className="block text-sm font-black">{color}</span><span className={`block truncate text-[10px] font-medium ${selected ? "text-slate-300" : "text-slate-500"}`}>{colorMeanings[color]}</span></span></button>; })}</div>
          </section>

          {previousCard ? <section className="rounded-[24px] border border-slate-200 bg-white p-4 text-sm shadow-sm"><p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Tarjeta anterior</p><p className="mt-2 line-clamp-3 font-semibold leading-5 text-slate-600">{previousCard.prompt}</p></section> : null}
        </aside>

        <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-7"><div className="flex items-center gap-3"><span className="h-4 w-4 rounded-full shadow-inner" style={{ backgroundColor: colorHex[selectedColor] }} /><div><p className="text-sm font-black">Explorando {selectedColor.toLowerCase()}</p><p className="text-xs text-slate-500">{colorInstruction[selectedColor]}</p></div></div><div className="flex gap-2"><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">{drawCount} tarjetas</span><span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">Se puede pasar</span></div></div>

          <div className="grid min-h-[650px] place-items-center p-5 sm:p-8">
            {currentCard ? (
              <article className={`w-full max-w-4xl overflow-hidden rounded-[30px] ring-4 ${activeStyle.ring} ${activeStyle.soft}`}>
                <div className="p-6 sm:p-10">
                  <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap gap-2"><span className="rounded-full bg-white px-3 py-1.5 text-xs font-black shadow-sm">{currentCard.activityType}</span><span className={`rounded-full px-3 py-1.5 text-xs font-black text-white ${activeStyle.bg}`}>{currentCard.color}</span></div><span className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm">{audience === "familia" ? "Conversen por turnos" : "Participación voluntaria"}</span></div>
                  <p className="mt-8 max-w-4xl text-3xl font-black leading-[1.08] tracking-[-0.035em] text-slate-950 sm:text-5xl">{currentCard.prompt}</p>
                  <div className="mt-8 grid gap-3 md:grid-cols-3"><div className="rounded-2xl bg-white p-4 shadow-sm"><CircleHelp className="h-5 w-5 text-[#087f8c]" /><p className="mt-3 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Apoyo didáctico</p><p className="mt-1 text-sm font-semibold leading-6 text-slate-700">{currentCard.support}</p></div><div className="rounded-2xl bg-white p-4 shadow-sm"><BadgeCheck className="h-5 w-5 text-[#f5a623]" /><p className="mt-3 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Fortaleza conectada</p><p className="mt-1 text-sm font-semibold leading-6 text-slate-700">{currentCard.strength}</p></div><div className="rounded-2xl bg-white p-4 shadow-sm"><HeartHandshake className="h-5 w-5 text-rose-500" /><p className="mt-3 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Cuidado del vínculo</p><p className="mt-1 text-sm font-semibold leading-6 text-slate-700">Escuchen sin corregir la emoción ni pedir detalles privados.</p></div></div>
                  <div className="mt-7 flex flex-wrap gap-3"><button onClick={completeCard} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#062b67] px-5 py-4 text-sm font-black text-white shadow-lg hover:bg-[#08448d]"><Check className="h-4 w-4" /> Listo, ir a {currentCard.nextColor.toLowerCase()} <ArrowRight className="h-4 w-4" /></button><button onClick={drawCard} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-4 text-sm font-black text-slate-700 hover:bg-slate-50"><Shuffle className="h-4 w-4" /> Otra tarjeta</button></div>
                </div>
              </article>
            ) : (
              <div className="w-full max-w-3xl text-center"><div className="relative mx-auto grid h-28 w-28 place-items-center rounded-full text-white shadow-xl" style={{ backgroundColor: colorHex[selectedColor] }}><Wind className="h-11 w-11" /><span className="absolute inset-2 rounded-full border border-white/40" /></div><h2 className="mt-7 text-3xl font-black tracking-tight">Respiren. Miren. Escuchen.</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">Saquen una tarjeta {selectedColor.toLowerCase()}. Lean despacio, den tiempo para pensar y recuerden que también se puede responder con un gesto o pasar.</p><button onClick={drawCard} className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-[#062b67] px-7 py-4 text-base font-black text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-[#08448d]"><Shuffle className="h-5 w-5" /> Sacar tarjeta</button></div>
            )}
          </div>
        </section>
      </div>

      <GameShareModal open={shareOpen} onClose={() => setShareOpen(false)} title="Revoltijo de las emociones" path="/revoltijo-emociones" description={`Actividad del Maletín Viajero adaptada para ${levelOptions.find((option) => option.id === level)?.label || "el nivel seleccionado"}.`} />
    </main>
  );
}
