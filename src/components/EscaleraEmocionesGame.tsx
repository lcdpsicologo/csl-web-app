"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, BookOpen, Check, ChevronRight, Dices, RotateCcw, Send, Sparkles, Users, Wind } from "lucide-react";
import { escaleraPrompts, ladderMoves, slideMoves, type EscaleraPrompt } from "@/lib/maletin";
import { GameShareModal } from "@/components/GameShareModal";
import { MaletinBrand, StrengthsMark } from "@/components/MaletinBrand";

type Player = { id: number; name: string; position: number; color: string };

const playerColors = ["bg-[#f5a623]", "bg-[#e75b52]", "bg-[#25a18e]", "bg-[#3b82c4]"];
const categoryStyle: Record<EscaleraPrompt["category"], string> = {
  Reconocer: "bg-sky-100 text-sky-800",
  Expresar: "bg-amber-100 text-amber-800",
  Regular: "bg-emerald-100 text-emerald-800",
  Vincular: "bg-rose-100 text-rose-800",
};

const boardNumbers = Array.from({ length: 10 }, (_, row) => {
  const base = 100 - row * 10;
  const values = Array.from({ length: 10 }, (_, index) => base - index);
  return row % 2 === 0 ? values : values.reverse();
}).flat();

export function EscaleraEmocionesGame() {
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: "Jugador 1", position: 0, color: playerColors[0] },
    { id: 2, name: "Jugador 2", position: 0, color: playerColors[1] },
  ]);
  const [turn, setTurn] = useState(0);
  const [dice, setDice] = useState<number | null>(null);
  const [prompt, setPrompt] = useState<EscaleraPrompt | null>(null);
  const [moveNotice, setMoveNotice] = useState("");
  const [winner, setWinner] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const currentPlayer = players[turn];
  const roll = () => {
    if (prompt || winner) return;
    const value = Math.floor(Math.random() * 6) + 1;
    const active = players[turn];
    let target = active.position + value;
    if (target > 100) target = active.position;
    let notice = target === active.position ? "Necesitas un número exacto para llegar a 100." : `Avanzaste ${value} casillas.`;
    if (ladderMoves[target]) {
      notice = `¡Escalera! Subes de ${target} a ${ladderMoves[target]}.`;
      target = ladderMoves[target];
    } else if (slideMoves[target]) {
      notice = `La serpiente te invita a volver de ${target} a ${slideMoves[target]} y probar otra estrategia.`;
      target = slideMoves[target];
    }

    setDice(value);
    setPlayers((current) => current.map((player, index) => index === turn ? { ...player, position: target } : player));
    setMoveNotice(notice);
    if (target === 100) setWinner(active.name);
    setPrompt(escaleraPrompts[Math.floor(Math.random() * escaleraPrompts.length)]);
  };

  const completeTurn = () => {
    setPrompt(null);
    setMoveNotice("");
    setDice(null);
    if (!winner) setTurn((current) => (current + 1) % players.length);
  };

  const reset = () => {
    setPlayers((current) => current.map((player) => ({ ...player, position: 0 })));
    setTurn(0);
    setDice(null);
    setPrompt(null);
    setMoveNotice("");
    setWinner(null);
  };

  const addPlayer = () => {
    if (players.length >= 4) return;
    const id = Math.max(...players.map((player) => player.id)) + 1;
    setPlayers((current) => [...current, { id, name: `Jugador ${id}`, position: 0, color: playerColors[current.length] }]);
  };

  return (
    <main className="min-h-screen bg-[#f4f1e8] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#062b67]/95 text-white shadow-lg backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/maletin-viajero" aria-label="Volver al Maletín Viajero" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 hover:bg-white/20"><ArrowLeft className="h-5 w-5" /></Link>
            <MaletinBrand compact />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowGuide((value) => !value)} className="hidden items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold hover:bg-white/20 sm:inline-flex"><BookOpen className="h-4 w-4" /> Cómo jugar</button>
            <button onClick={() => setShareOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-[#f5b82e] px-3 py-2 text-xs font-black text-[#062b67] shadow-sm hover:bg-[#ffd365]"><Send className="h-4 w-4" /> Compartir</button>
          </div>
        </div>
      </header>

      <section className="relative isolate overflow-hidden bg-[#062b67] text-white">
        <Image src="/maletin/escalera.webp" alt="Familia jugando La escalera de las emociones" fill priority sizes="100vw" className="z-0 object-cover object-center opacity-70" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#041f4e] via-[#062b67]/85 to-[#062b67]/10" />
        <div className="relative z-20 mx-auto grid min-h-[360px] max-w-[1500px] items-end gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_380px] lg:py-14">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-bold backdrop-blur"><Sparkles className="h-3.5 w-3.5 text-[#ffd365]" /> Dinámica del manual Maletín Viajero</span>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-6xl">La escalera de las emociones</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">Avancen, conversen y descubran cómo cada emoción trae información. Aquí no se gana por responder “bien”, sino por escucharse de verdad.</p>
          </div>
          <div className="justify-self-start lg:justify-self-end"><StrengthsMark /></div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1500px] gap-5 px-4 py-6 sm:px-6 xl:grid-cols-[300px_minmax(680px,1fr)_360px]">
        <aside className="space-y-4">
          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Participantes</p><h2 className="mt-1 text-lg font-black">Equipo de juego</h2></div><Users className="h-5 w-5 text-[#087f8c]" /></div>
            <div className="mt-4 space-y-2">
              {players.map((player, index) => (
                <label key={player.id} className={`flex items-center gap-2 rounded-2xl border p-2.5 transition ${turn === index ? "border-[#087f8c] bg-teal-50 ring-2 ring-teal-100" : "border-slate-200"}`}>
                  <span className={`h-4 w-4 shrink-0 rounded-full ${player.color}`} />
                  <input value={player.name} onChange={(event) => setPlayers((current) => current.map((item) => item.id === player.id ? { ...item, name: event.target.value } : item))} className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none" aria-label={`Nombre del jugador ${index + 1}`} />
                  <span className="text-xs font-black text-slate-400">{player.position}</span>
                </label>
              ))}
            </div>
            {players.length < 4 ? <button onClick={addPlayer} className="mt-3 w-full rounded-xl border border-dashed border-slate-300 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">+ Añadir participante</button> : null}
          </section>

          <section className="rounded-[24px] bg-[#062b67] p-5 text-white shadow-lg">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-200">Turno actual</p>
            <div className="mt-3 flex items-center gap-3"><span className={`h-6 w-6 rounded-full ring-4 ring-white/20 ${currentPlayer.color}`} /><p className="text-xl font-black">{currentPlayer.name}</p></div>
            <button onClick={roll} disabled={Boolean(prompt || winner)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f5b82e] px-4 py-3.5 font-black text-[#062b67] shadow-md transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"><Dices className="h-5 w-5" /> {dice ? `Salió ${dice}` : "Lanzar dado"}</button>
            <button onClick={reset} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold text-blue-100 hover:bg-white/10"><RotateCcw className="h-3.5 w-3.5" /> Reiniciar partida</button>
          </section>
        </aside>

        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-3 shadow-xl sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3 px-1"><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Tablero interactivo</p><p className="mt-1 text-sm font-bold text-slate-700">Llega exactamente a la casilla 100</p></div><div className="flex gap-2 text-[10px] font-black"><span className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-800">↗ Escalera</span><span className="rounded-full bg-rose-100 px-2.5 py-1 text-rose-800">↘ Serpiente</span></div></div>
          <div className="overflow-x-auto pb-2">
            <div className="grid min-w-[660px] grid-cols-10 overflow-hidden rounded-2xl border-4 border-[#062b67] bg-[#062b67] gap-0.5">
              {boardNumbers.map((number) => {
                const occupants = players.filter((player) => player.position === number);
                const ladder = ladderMoves[number];
                const slide = slideMoves[number];
                return (
                  <div key={number} className={`relative aspect-square p-1.5 ${number % 2 === 0 ? "bg-[#d9f1ec]" : "bg-[#fff9e9]"}`}>
                    <span className="text-xs font-black text-[#062b67] sm:text-sm">{number}</span>
                    {ladder ? <span className="absolute right-1 top-1 text-[9px] font-black text-emerald-700">↗{ladder}</span> : null}
                    {slide ? <span className="absolute right-1 top-1 text-[9px] font-black text-rose-700">↘{slide}</span> : null}
                    <div className="absolute inset-x-1 bottom-1 flex flex-wrap gap-0.5">{occupants.map((player) => <span key={player.id} title={player.name} className={`h-3.5 w-3.5 rounded-full border-2 border-white shadow ${player.color}`} />)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <aside>
          <section className="sticky top-20 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl">
            <div className="bg-gradient-to-br from-[#087f8c] to-[#25a18e] p-5 text-white"><p className="text-[10px] font-black uppercase tracking-[0.16em] text-teal-100">Tarjeta emocional</p><h2 className="mt-1 text-xl font-black">Conversemos</h2></div>
            {winner ? (
              <div className="p-6 text-center"><Sparkles className="mx-auto h-12 w-12 text-[#f5a623]" /><h3 className="mt-4 text-2xl font-black">¡Llegaron juntos!</h3><p className="mt-2 text-sm leading-6 text-slate-600">{winner} llegó a 100. Cierren nombrando algo que descubrieron de otra persona.</p><button onClick={reset} className="mt-5 rounded-xl bg-[#062b67] px-4 py-3 text-sm font-bold text-white">Jugar otra vez</button></div>
            ) : prompt ? (
              <div className="p-5">
                <div className="flex flex-wrap gap-2"><span className={`rounded-full px-3 py-1 text-xs font-black ${categoryStyle[prompt.category]}`}>{prompt.category}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{prompt.strength}</span></div>
                <p className="mt-5 text-2xl font-black leading-tight tracking-tight text-slate-950">{prompt.prompt}</p>
                <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900"><strong>Clave:</strong> den tiempo para pensar. Se puede pasar el turno sin explicar una experiencia privada.</div>
                <p className="mt-4 text-sm font-bold text-[#087f8c]">{moveNotice}</p>
                <button onClick={completeTurn} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#062b67] px-4 py-3.5 text-sm font-black text-white hover:bg-[#08448d]"><Check className="h-4 w-4" /> Conversación completada <ChevronRight className="h-4 w-4" /></button>
              </div>
            ) : (
              <div className="p-6 text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal-50 text-[#087f8c]"><Wind className="h-8 w-8" /></div><h3 className="mt-4 text-xl font-black">Respiren y lancen</h3><p className="mt-2 text-sm leading-6 text-slate-600">Cada lanzamiento abre una pregunta. Todas las emociones y respuestas son válidas.</p></div>
            )}
          </section>
        </aside>
      </div>

      {showGuide ? <div className="fixed inset-0 z-50 bg-slate-950/50 p-4 backdrop-blur-sm" onMouseDown={() => setShowGuide(false)}><section onMouseDown={(event) => event.stopPropagation()} className="ml-auto h-full w-full max-w-md overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl"><button onClick={() => setShowGuide(false)} className="text-sm font-bold text-slate-500">← Volver al juego</button><h2 className="mt-6 text-3xl font-black tracking-tight">Cómo facilitar</h2><ol className="mt-6 space-y-4 text-sm leading-6 text-slate-700"><li><strong>1. Preparen:</strong> 2 a 4 participantes. Pueden editar sus nombres.</li><li><strong>2. Avancen:</strong> lancen el dado por turnos. Las escaleras ayudan a subir y las serpientes invitan a intentar de nuevo.</li><li><strong>3. Conversen:</strong> respondan la tarjeta antes de continuar. Nadie está obligado a revelar algo privado.</li><li><strong>4. Acompañen:</strong> escuchen sin corregir la emoción ni apresurar una solución.</li><li><strong>5. Cierren:</strong> al llegar a 100, nombren algo que aprendieron de otra persona.</li></ol><div className="mt-6 rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-blue-900">Basado en el material aportado de Fundación Educacional Arauco y Focus, RPI 2023-A-3014.</div></section></div> : null}

      <GameShareModal open={shareOpen} onClose={() => setShareOpen(false)} title="La escalera de las emociones" path="/escalera-emociones" description="Juego del Maletín Viajero para reconocer, expresar y regular emociones conversando en familia o en el colegio." />
    </main>
  );
}
