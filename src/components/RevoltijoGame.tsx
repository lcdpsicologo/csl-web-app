"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, Check, CircleHelp, HeartHandshake, RotateCcw, Send, Shuffle, Sparkles, Trophy, Volume2, VolumeX, Wind, Zap } from "lucide-react";
import { colorMeanings, colorStyles, type EmotionColor, levelOptions, type LevelId, type RevoltijoCard, revoltijoCards } from "@/lib/revoltijoCards";
import { GameShareModal } from "@/components/GameShareModal";
import { MaletinBrand, StrengthsMark } from "@/components/MaletinBrand";

const colorOrder: EmotionColor[] = ["Rojo", "Azul", "Amarillo", "Verde"];
const colorHex: Record<EmotionColor, string> = { Rojo: "#e75b52", Azul: "#3b82c4", Amarillo: "#f5b82e", Verde: "#25a18e" };
const emptyColorProgress: Record<EmotionColor, number> = { Rojo: 0, Azul: 0, Amarillo: 0, Verde: 0 };
const gameLengths = [{ value: 8, label: "Breve", detail: "2 por color" }, { value: 12, label: "Completa", detail: "3 por color" }, { value: 16, label: "Extendida", detail: "4 por color" }] as const;
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
  const [gameLength, setGameLength] = useState<8 | 12 | 16>(12);
  const [completedByColor, setCompletedByColor] = useState<Record<EmotionColor, number>>(emptyColorProgress);
  const [usedCardIds, setUsedCardIds] = useState<string[]>([]);
  const [audience, setAudience] = useState<"familia" | "curso">("familia");
  const [shareOpen, setShareOpen] = useState(false);
  const [shuffling, setShuffling] = useState(false);
  const shuffleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (shuffleTimer.current) clearTimeout(shuffleTimer.current); }, []);

  const cardsForSelection = useMemo(() => revoltijoCards.filter((card) => card.level === level && card.color === selectedColor), [level, selectedColor]);
  const activeStyle = colorStyles[currentCard?.color ?? selectedColor];
  const challengesPerColor = gameLength / colorOrder.length;
  const completedColors = colorOrder.filter((color) => completedByColor[color] >= challengesPerColor);
  const totalCompleted = colorOrder.reduce((total, color) => total + completedByColor[color], 0);
  const routeFromCurrent = [...colorOrder.slice(colorOrder.indexOf(selectedColor) + 1), ...colorOrder.slice(0, colorOrder.indexOf(selectedColor) + 1)];
  const nextRouteColor = routeFromCurrent.find((color) => !completedColors.includes(color) && color !== selectedColor) ?? currentCard?.nextColor ?? "Rojo";

  const drawCard = () => {
    if (shuffling) return;
    const outgoingCard = currentCard;
    if (outgoingCard) setPreviousCard(outgoingCard);
    setShuffling(true);
    setCurrentCard(null);
    if (soundEnabled) playTone();
    shuffleTimer.current = setTimeout(() => {
      const unseen = cardsForSelection.filter((card) => !usedCardIds.includes(card.id) && card.id !== outgoingCard?.id);
      const alternatives = cardsForSelection.filter((card) => card.id !== outgoingCard?.id);
      const source = unseen.length ? unseen : alternatives.length ? alternatives : cardsForSelection;
      const nextCard = source[Math.floor(Math.random() * source.length)];
      setCurrentCard(nextCard);
      setUsedCardIds((current) => unseen.length ? [...current, nextCard.id] : [nextCard.id]);
      setShuffling(false);
    }, 1150);
  };

  const completeCard = () => {
    const nextColorCount = Math.min(challengesPerColor, completedByColor[selectedColor] + 1);
    const nextProgress = { ...completedByColor, [selectedColor]: nextColorCount };
    const nextTotal = colorOrder.reduce((total, color) => total + nextProgress[color], 0);
    setCompletedByColor(nextProgress);
    setCurrentCard(null);
    if (nextTotal >= gameLength || nextColorCount < challengesPerColor) return;
    const targetColor = routeFromCurrent.find((color) => nextProgress[color] < challengesPerColor) ?? nextRouteColor;
    setSelectedColor(targetColor);
    setUsedCardIds([]);
  };

  const reset = () => {
    setCurrentCard(null);
    setPreviousCard(null);
    setCompletedByColor(emptyColorProgress);
    setUsedCardIds([]);
    setSelectedColor("Rojo");
    setShuffling(false);
    if (shuffleTimer.current) clearTimeout(shuffleTimer.current);
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
          <section className="game-panel-3d rounded-[26px] border border-white/80 bg-white p-5 shadow-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Preparar experiencia</p>
            <label className="mt-4 block text-sm font-black text-slate-700">Nivel<select value={level} onChange={(event) => { setLevel(event.target.value as LevelId); reset(); }} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold outline-none focus:border-[#087f8c]">{levelOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label>
            <p className="mt-5 text-sm font-black text-slate-700">Duración de la partida</p>
            <div className="mt-2 grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">{gameLengths.map((option) => <button key={option.value} onClick={() => { setGameLength(option.value); reset(); }} className={`rounded-lg px-1 py-2 text-center ${gameLength === option.value ? "bg-white text-[#073b78] shadow-sm" : "text-slate-500"}`}><span className="block text-[11px] font-black">{option.label}</span><span className="block text-[8px] font-bold opacity-70">{option.detail}</span></button>)}</div>
            <p className="mt-5 text-sm font-black text-slate-700">¿Dónde lo realizarán?</p>
            <div className="mt-2 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1.5">{(["familia", "curso"] as const).map((value) => <button key={value} onClick={() => setAudience(value)} className={`rounded-lg px-2 py-2 text-xs font-black ${audience === value ? "bg-white text-[#073b78] shadow-sm" : "text-slate-500"}`}>{value === "familia" ? "En familia" : "En el curso"}</button>)}</div>
          </section>

          <section className="game-panel-3d rounded-[26px] border border-white/80 bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Ruta emocional</p><p className="mt-1 text-sm font-bold text-slate-700">{totalCompleted} de {gameLength} desafíos completados</p></div><button onClick={reset} title="Reiniciar" className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"><RotateCcw className="h-4 w-4" /></button></div>
            <div className="mt-4 space-y-2">{colorOrder.map((color) => { const selected = selectedColor === color; const complete = completedColors.includes(color); return <button key={color} onClick={() => { if (!shuffling) { setSelectedColor(color); setCurrentCard(null); setUsedCardIds([]); } }} className={`emotion-route-button flex w-full items-center gap-3 rounded-2xl border p-3 text-left ${selected ? "is-active border-slate-900 bg-slate-950 text-white shadow-lg" : "border-slate-200 bg-white hover:bg-slate-50"}`} style={{ "--emotion-color": colorHex[color] } as CSSProperties}><span className="emotion-orb grid h-10 w-10 shrink-0 place-items-center rounded-full text-white" style={{ backgroundColor: colorHex[color] }}>{complete ? <Check className="h-4 w-4" /> : color.slice(0, 1)}</span><span className="min-w-0 flex-1"><span className="block text-sm font-black">{color}</span><span className={`block truncate text-[10px] font-medium ${selected ? "text-slate-300" : "text-slate-500"}`}>{colorMeanings[color]}</span><span className="mt-1 block h-1 overflow-hidden rounded-full bg-slate-200/30"><i className="block h-full rounded-full bg-white/80 transition-all" style={{ width: `${completedByColor[color] / challengesPerColor * 100}%` }} /></span></span><span className={`text-[10px] font-black ${selected ? "text-white" : "text-slate-400"}`}>{completedByColor[color]}/{challengesPerColor}</span>{complete ? <Sparkles className="h-4 w-4 text-amber-300" /> : null}</button>; })}</div>
          </section>

          {previousCard ? <section className="rounded-[24px] border border-slate-200 bg-white p-4 text-sm shadow-sm"><p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Tarjeta anterior</p><p className="mt-2 line-clamp-3 font-semibold leading-5 text-slate-600">{previousCard.prompt}</p></section> : null}
        </aside>

        <section className="revoltijo-stage overflow-hidden rounded-[34px] border border-white/80 bg-white shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-white/85 px-5 py-4 backdrop-blur sm:px-7"><div className="flex items-center gap-3"><span className="emotion-orb h-5 w-5 rounded-full" style={{ backgroundColor: colorHex[selectedColor] }} /><div><p className="text-sm font-black">Explorando {selectedColor.toLowerCase()} · desafío {Math.min(challengesPerColor, completedByColor[selectedColor] + 1)} de {challengesPerColor}</p><p className="text-xs text-slate-500">{colorInstruction[selectedColor]}</p></div></div><div className="flex gap-2"><span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-700"><Zap className="h-3.5 w-3.5" /> {totalCompleted}/{gameLength}</span><span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">Se puede pasar</span></div></div>
          <div className="h-1.5 bg-slate-100"><span className="block h-full rounded-r-full bg-gradient-to-r from-[#ef513e] via-[#f5b82e] to-[#25a18e] transition-all duration-700" style={{ width: `${totalCompleted / gameLength * 100}%` }} /></div>

          <div className="grid min-h-[650px] place-items-center p-5 sm:p-8">
            {totalCompleted >= gameLength ? (
              <div className="winner-burst relative w-full max-w-3xl overflow-hidden rounded-[32px] bg-gradient-to-br from-[#062b67] via-[#08448d] to-[#087f8c] p-8 text-center text-white shadow-2xl sm:p-12"><span className="celebration-particles" aria-hidden="true" /><Trophy className="mx-auto h-16 w-16 text-[#ffd365] drop-shadow-xl" /><p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-teal-200">Ruta completada</p><h2 className="mt-2 text-4xl font-black tracking-tight">¡Exploraron las cuatro emociones!</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-blue-100">Cierren nombrando una estrategia que quieran recordar y una fortaleza que observaron en otra persona.</p><button onClick={reset} className="game-primary-button mt-7 rounded-2xl bg-[#f5b82e] px-6 py-3.5 font-black text-[#062b67]">Jugar una nueva ronda</button></div>
            ) : shuffling ? (
              <div className="card-deck-scene" role="status" aria-live="polite"><div className="card-deck is-shuffling"><span /><span /><span /><span /><span /><div className="deck-front" style={{ "--emotion-color": colorHex[selectedColor] } as CSSProperties}><Shuffle className="h-12 w-12" /><strong>Barajando {selectedColor.toLowerCase()}</strong><small>Preparando desafío {Math.min(challengesPerColor, completedByColor[selectedColor] + 1)}</small></div></div><div className="deck-loading-dots"><i /><i /><i /></div><p className="mt-4 text-sm font-black uppercase tracking-[0.18em] text-slate-500">El mazo está eligiendo una experiencia…</p></div>
            ) : currentCard ? (
              <article key={currentCard.id} className={`revoltijo-card-3d w-full max-w-4xl overflow-hidden rounded-[32px] ring-4 ${activeStyle.ring} ${activeStyle.soft}`}>
                <div className="p-6 sm:p-10">
                  <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap gap-2"><span className="rounded-full bg-white px-3 py-1.5 text-xs font-black shadow-sm">{currentCard.activityType}</span><span className={`rounded-full px-3 py-1.5 text-xs font-black text-white ${activeStyle.bg}`}>{currentCard.color}</span></div><span className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm">{audience === "familia" ? "Conversen por turnos" : "Participación voluntaria"}</span></div>
                  <p className="mt-8 max-w-4xl text-3xl font-black leading-[1.08] tracking-[-0.035em] text-slate-950 sm:text-5xl">{currentCard.prompt}</p>
                  <div className="mt-8 grid gap-3 md:grid-cols-3"><div className="rounded-2xl bg-white p-4 shadow-sm"><CircleHelp className="h-5 w-5 text-[#087f8c]" /><p className="mt-3 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Apoyo didáctico</p><p className="mt-1 text-sm font-semibold leading-6 text-slate-700">{currentCard.support}</p></div><div className="rounded-2xl bg-white p-4 shadow-sm"><BadgeCheck className="h-5 w-5 text-[#f5a623]" /><p className="mt-3 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Fortaleza conectada</p><p className="mt-1 text-sm font-semibold leading-6 text-slate-700">{currentCard.strength}</p></div><div className="rounded-2xl bg-white p-4 shadow-sm"><HeartHandshake className="h-5 w-5 text-rose-500" /><p className="mt-3 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Cuidado del vínculo</p><p className="mt-1 text-sm font-semibold leading-6 text-slate-700">Escuchen sin corregir la emoción ni pedir detalles privados.</p></div></div>
                  <div className="mt-7 flex flex-wrap gap-3"><button onClick={completeCard} className="game-primary-button inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#062b67] px-5 py-4 text-sm font-black text-white shadow-lg"><Check className="h-4 w-4" /> {totalCompleted + 1 >= gameLength ? "Completar partida" : completedByColor[selectedColor] + 1 >= challengesPerColor ? `Completar ${selectedColor.toLowerCase()} y continuar` : `Completar desafío ${completedByColor[selectedColor] + 1} de ${challengesPerColor}`} <ArrowRight className="h-4 w-4" /></button><button onClick={drawCard} className="game-secondary-button inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-4 text-sm font-black text-slate-700"><Shuffle className="h-4 w-4" /> Otra tarjeta</button></div>
                </div>
              </article>
            ) : (
              <div className="w-full max-w-3xl text-center"><div className="emotion-core relative mx-auto grid h-32 w-32 place-items-center rounded-full text-white" style={{ "--emotion-color": colorHex[selectedColor], backgroundColor: colorHex[selectedColor] } as CSSProperties}><Wind className="h-12 w-12" /><span className="absolute inset-3 rounded-full border border-white/50" /><span className="emotion-ring" /></div><h2 className="mt-8 text-3xl font-black tracking-tight">Respiren. Miren. Escuchen.</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">Saquen una tarjeta {selectedColor.toLowerCase()}. Lean despacio, den tiempo para pensar y recuerden que también se puede responder con un gesto o pasar.</p><button onClick={drawCard} className="game-primary-button mt-7 inline-flex items-center gap-2 rounded-2xl bg-[#062b67] px-7 py-4 text-base font-black text-white shadow-xl"><Shuffle className="h-5 w-5" /> Sacar tarjeta</button></div>
            )}
          </div>
        </section>
      </div>

      <GameShareModal open={shareOpen} onClose={() => setShareOpen(false)} title="Revoltijo de las emociones" path="/revoltijo-emociones" description={`Actividad del Maletín Viajero adaptada para ${levelOptions.find((option) => option.id === level)?.label || "el nivel seleccionado"}.`} />
    </main>
  );
}
