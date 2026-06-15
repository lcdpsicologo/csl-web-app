"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  HelpCircle,
  Shuffle,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  colorMeanings,
  colorStyles,
  EmotionColor,
  levelOptions,
  LevelId,
  RevoltijoCard,
  revoltijoCards,
} from "@/lib/revoltijoCards";

const colorOrder: EmotionColor[] = ["Rojo", "Azul", "Amarillo", "Verde"];

function playTone() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(620, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(880, context.currentTime + 0.11);
  gain.gain.setValueAtTime(0.001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + 0.02);
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

export function RevoltijoGame() {
  const [level, setLevel] = useState<LevelId>("prebasica");
  const [selectedColor, setSelectedColor] = useState<EmotionColor>("Rojo");
  const [currentCard, setCurrentCard] = useState<RevoltijoCard | null>(null);
  const [previousCard, setPreviousCard] = useState<RevoltijoCard | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [drawCount, setDrawCount] = useState(0);

  const cardsForSelection = useMemo(
    () => revoltijoCards.filter((card) => card.level === level && card.color === selectedColor),
    [level, selectedColor],
  );

  const drawCard = () => {
    if (currentCard) setPreviousCard(currentCard);

    const pool = cardsForSelection.filter((card) => card.id !== currentCard?.id);
    const source = pool.length ? pool : cardsForSelection;
    const next = source[Math.floor(Math.random() * source.length)];

    setCurrentCard(next);
    setDrawCount((count) => count + 1);
    if (soundEnabled) playTone();
  };

  const goToNextColor = () => {
    const targetColor = currentCard?.nextColor ?? colorOrder[(colorOrder.indexOf(selectedColor) + 1) % colorOrder.length];
    setSelectedColor(targetColor);
    setCurrentCard(null);
  };

  const activeStyle = colorStyles[currentCard?.color ?? selectedColor];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link href="/?view=games" className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
            <ArrowLeft className="h-4 w-4" />
            Juegos Vinculares
          </Link>
          <div className="flex items-center gap-2 rounded-md border border-dashed border-slate-300 bg-white px-3 py-2">
            <span className="h-7 w-7 rounded bg-gradient-to-br from-emerald-400 via-amber-300 to-sky-500" aria-hidden="true" />
            <span className="text-xs font-semibold text-slate-600">Fortalezas del carácter</span>
          </div>
        </div>

        <section className="grid flex-1 gap-5 lg:grid-cols-[360px_1fr]">
          <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:self-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Juego activo</p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight">Revoltijo Vincular de las Emociones</h1>
            </div>

            <div className="mt-5">
              <label htmlFor="level" className="text-sm font-bold text-slate-700">
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
            </div>

            <div className="mt-5">
              <p className="text-sm font-bold text-slate-700">Color de salida</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {colorOrder.map((color) => {
                  const style = colorStyles[color];
                  const active = selectedColor === color;
                  return (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                        setCurrentCard(null);
                      }}
                      className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-bold transition ${
                        active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className={`h-3 w-3 rounded-full ${style.bg}`} />
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 grid gap-2">
              {colorOrder.map((color) => {
                const style = colorStyles[color];
                return (
                  <div key={color} className={`rounded-md px-3 py-2 text-xs font-semibold ${style.soft} ${style.text}`}>
                    {color}: {colorMeanings[color]}
                  </div>
                );
              })}
            </div>

            <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Tarjeta anterior</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">
                {previousCard ? `${previousCard.color}: ${previousCard.prompt}` : "Aún no hay tarjeta anterior."}
              </p>
            </div>
          </aside>

          <section className="flex min-h-[620px] flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Una tarjeta a la vez</p>
                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {levelOptions.find((option) => option.id === level)?.label} · {drawCount} sorteos
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={drawCard}
                  className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
                >
                  <Shuffle className="h-4 w-4" />
                  Sacar tarjeta
                </button>
                <button
                  onClick={goToNextColor}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  <ArrowRight className="h-4 w-4" />
                  Siguiente color
                </button>
                <button
                  onClick={() => setSoundEnabled((enabled) => !enabled)}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                  aria-pressed={soundEnabled}
                >
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  Sonido {soundEnabled ? "sí" : "no"}
                </button>
              </div>
            </div>

            <div className="grid flex-1 place-items-center py-6">
              {currentCard ? (
                <article className={`w-full max-w-3xl rounded-lg border border-slate-200 p-5 ring-4 ${activeStyle.ring} ${activeStyle.soft} sm:p-8`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className={`inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-bold ${activeStyle.text} ring-1 ${activeStyle.ring}`}>
                      <span className={`h-3 w-3 rounded-full ${activeStyle.bg}`} />
                      {currentCard.color}
                    </span>
                    <span className="rounded-md bg-white px-3 py-2 text-sm font-bold text-slate-700 ring-1 ring-slate-200">
                      {currentCard.activityType}
                    </span>
                  </div>

                  <p className="mt-8 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">
                    {currentCard.prompt}
                  </p>

                  <div className="mt-8 grid gap-3 md:grid-cols-3">
                    <div className="rounded-md bg-white p-4 ring-1 ring-slate-200">
                      <HelpCircle className="h-5 w-5 text-slate-500" />
                      <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Apoyo breve</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">{currentCard.support}</p>
                    </div>
                    <div className="rounded-md bg-white p-4 ring-1 ring-slate-200">
                      <BadgeCheck className="h-5 w-5 text-slate-500" />
                      <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Fortaleza</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">{currentCard.strength}</p>
                    </div>
                    <div className="rounded-md bg-white p-4 ring-1 ring-slate-200">
                      <Sparkles className="h-5 w-5 text-slate-500" />
                      <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Color siguiente</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">{currentCard.nextColor}</p>
                    </div>
                  </div>
                </article>
              ) : (
                <div className={`w-full max-w-3xl rounded-lg border border-dashed border-slate-300 p-8 text-center ${activeStyle.soft}`}>
                  <div className={`mx-auto grid h-16 w-16 place-items-center rounded-md ${activeStyle.bg} text-white`}>
                    <Shuffle className="h-8 w-8" />
                  </div>
                  <h2 className="mt-5 text-2xl font-bold tracking-tight">Listo para sacar una tarjeta {selectedColor.toLowerCase()}</h2>
                  <p className="mx-auto mt-2 max-w-lg text-sm font-medium leading-6 text-slate-600">
                    El juego mostrará solo una tarjeta por turno, con reto, apoyo breve, fortaleza y color siguiente.
                  </p>
                </div>
              )}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
