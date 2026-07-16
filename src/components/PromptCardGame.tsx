"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, HelpCircle, Shuffle, Volume2, VolumeX } from "lucide-react";
import { BrandHeader } from "@/components/BrandHeader";
import { CharacterStrengthBadge } from "@/components/CharacterStrengthBadge";
import { levelOptions, LevelId } from "@/lib/revoltijoCards";
import { PromptGame, PromptGameCard } from "@/lib/promptGames";

const accentStyles: Record<PromptGame["accent"], { panel: string; badge: string; button: string; ring: string }> = {
  cyan: { panel: "bg-cyan-50", badge: "bg-cyan-100 text-cyan-800", button: "bg-cyan-700 hover:bg-cyan-800", ring: "ring-cyan-200" },
  emerald: { panel: "bg-emerald-50", badge: "bg-emerald-100 text-emerald-800", button: "bg-emerald-700 hover:bg-emerald-800", ring: "ring-emerald-200" },
  amber: { panel: "bg-amber-50", badge: "bg-amber-100 text-amber-800", button: "bg-amber-600 hover:bg-amber-700", ring: "ring-amber-200" },
  rose: { panel: "bg-rose-50", badge: "bg-rose-100 text-rose-800", button: "bg-rose-700 hover:bg-rose-800", ring: "ring-rose-200" },
  violet: { panel: "bg-violet-50", badge: "bg-violet-100 text-violet-800", button: "bg-violet-700 hover:bg-violet-800", ring: "ring-violet-200" },
  slate: { panel: "bg-slate-50", badge: "bg-slate-100 text-slate-800", button: "bg-slate-900 hover:bg-slate-800", ring: "ring-slate-200" },
};

function playTone() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(520, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(780, context.currentTime + 0.12);
  gain.gain.setValueAtTime(0.001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.16, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.22);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.24);
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export function PromptCardGame({ game }: { game: PromptGame }) {
  const [level, setLevel] = useState<LevelId>("prebasica");
  const [currentCard, setCurrentCard] = useState<PromptGameCard | null>(null);
  const [previousCard, setPreviousCard] = useState<PromptGameCard | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [drawCount, setDrawCount] = useState(0);

  const cardsForLevel = useMemo(() => game.cards.filter((card) => card.level === level), [game.cards, level]);
  const style = accentStyles[game.accent];

  const drawCard = () => {
    if (currentCard) setPreviousCard(currentCard);
    const pool = cardsForLevel.filter((card) => card.id !== currentCard?.id);
    const source = pool.length ? pool : cardsForLevel;
    const next = source[Math.floor(Math.random() * source.length)];
    setCurrentCard(next);
    setDrawCount((count) => count + 1);
    if (soundEnabled) playTone();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <BrandHeader />
      <main className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link href="/?view=games" className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
            <ArrowLeft className="h-4 w-4" />
            Juegos Vinculares
          </Link>
          <span className={`rounded-md px-3 py-2 text-xs font-bold ${style.badge}`}>{drawCount} sorteos</span>
        </div>

        <section className="grid flex-1 gap-5 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:self-start">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Juego vincular</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight">{game.title}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">{game.summary}</p>
            <CharacterStrengthBadge strength={game.strength} className="mt-4 max-w-full" />

            <label htmlFor="level" className="mt-5 block text-sm font-bold text-slate-700">
              Nivel
            </label>
            <select
              id="level"
              value={level}
              onChange={(event) => {
                setLevel(event.target.value as LevelId);
                setCurrentCard(null);
                setPreviousCard(null);
              }}
              className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-slate-950"
            >
              {levelOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Tarjeta anterior</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">
                {previousCard ? `${previousCard.type}: ${previousCard.prompt}` : "Aun no hay tarjeta anterior."}
              </p>
            </div>
          </aside>

          <section className="flex min-h-[600px] flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-600">Una tarjeta a la vez</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={drawCard} className={`inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-bold text-white ${style.button}`}>
                  <Shuffle className="h-4 w-4" />
                  Sacar tarjeta
                </button>
                <button
                  onClick={() => setSoundEnabled((enabled) => !enabled)}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                  aria-pressed={soundEnabled}
                >
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  Sonido {soundEnabled ? "si" : "no"}
                </button>
              </div>
            </div>

            <div className="grid flex-1 place-items-center py-6">
              {currentCard ? (
                <article key={currentCard.id} className={`tz-pop w-full max-w-3xl rounded-lg border border-slate-200 p-5 ring-4 ${style.ring} ${style.panel} sm:p-8`}>
                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded-md px-3 py-2 text-sm font-bold ${style.badge}`}>{currentCard.type}</span>
                    <CharacterStrengthBadge strength={currentCard.strength} compact />
                  </div>
                  <p className="mt-8 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">{currentCard.prompt}</p>
                  <div className="mt-8 grid gap-3 md:grid-cols-2">
                    <div className="rounded-md bg-white p-4 ring-1 ring-slate-200">
                      <HelpCircle className="h-5 w-5 text-slate-500" />
                      <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Apoyo breve</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">{currentCard.support}</p>
                    </div>
                    <div className="rounded-md bg-white p-4 ring-1 ring-slate-200">
                      <BadgeCheck className="h-5 w-5 text-slate-500" />
                      <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Fortaleza</p>
                      <CharacterStrengthBadge strength={currentCard.strength} className="mt-2 max-w-full" />
                    </div>
                  </div>
                </article>
              ) : (
                <div className={`w-full max-w-3xl rounded-lg border border-dashed border-slate-300 p-8 text-center ${style.panel}`}>
                  <div className={`mx-auto grid h-16 w-16 place-items-center rounded-md text-white ${style.button}`}>
                    <Shuffle className="h-8 w-8" />
                  </div>
                  <h2 className="mt-5 text-2xl font-bold tracking-tight">Listo para sacar una tarjeta</h2>
                  <p className="mx-auto mt-2 max-w-lg text-sm font-medium leading-6 text-slate-600">
                    Elige un nivel y muestra solo una consigna por turno.
                  </p>
                </div>
              )}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
