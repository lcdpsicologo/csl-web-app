"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, ChevronRight, Crown, Expand, Footprints, HelpCircle, Minimize, RotateCcw, Send, Sparkles, Trophy, Users, Volume2, VolumeX, X } from "lucide-react";
import { escaleraPrompts, ladderMoves, slideMoves, type EscaleraPrompt } from "@/lib/maletin";
import { GameShareModal } from "@/components/GameShareModal";
import { MaletinBrand, StrengthsMark } from "@/components/MaletinBrand";

type Player = { id: number; name: string; position: number; color: string };
type MoveKind = "normal" | "ladder" | "slide";
type SoundKind = "dice" | "land" | "ladder" | "slide" | "complete" | "win";
type MoveDetail = { from: number; rolledTo: number; to: number; kind: MoveKind; dice: number; player: string };

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

function playGameSound(kind: SoundKind) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const patterns: Record<SoundKind, Array<[number, number, number, OscillatorType]>> = {
    dice: [[220, 0, .06, "square"], [310, .08, .06, "square"], [250, .16, .07, "square"], [410, .25, .09, "triangle"]],
    land: [[440, 0, .11, "sine"], [620, .08, .16, "sine"]],
    ladder: [[380, 0, .12, "sine"], [520, .1, .12, "sine"], [690, .2, .2, "sine"]],
    slide: [[520, 0, .14, "triangle"], [390, .12, .14, "triangle"], [260, .24, .2, "triangle"]],
    complete: [[520, 0, .1, "sine"], [660, .08, .16, "sine"]],
    win: [[392, 0, .14, "sine"], [523, .12, .14, "sine"], [659, .24, .14, "sine"], [784, .36, .32, "sine"]],
  };
  patterns[kind].forEach(([frequency, delay, duration, type]) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, context.currentTime + delay);
    gain.gain.setValueAtTime(.001, context.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(kind === "dice" ? .055 : .11, context.currentTime + delay + .015);
    gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + delay + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(context.currentTime + delay);
    oscillator.stop(context.currentTime + delay + duration + .02);
  });
  window.setTimeout(() => void context.close(), 900);
}

function DiceCube({ value, rolling }: { value: number; rolling: boolean }) {
  return (
    <span className="dice-scene" aria-hidden="true">
      <span className={`game-die ${rolling ? "is-rolling" : ""}`} data-value={value}>
        {[1, 2, 3, 4, 5, 6].map((face) => <span key={face} className={`die-face die-face-${face}`}>{face}</span>)}
      </span>
    </span>
  );
}

function boardPoint(number: number) {
  const rowFromBottom = Math.floor((number - 1) / 10);
  const offset = (number - 1) % 10;
  const column = rowFromBottom % 2 === 0 ? offset : 9 - offset;
  return { x: column * 10 + 5, y: (9 - rowFromBottom) * 10 + 5 };
}

function snakePath(from: { x: number; y: number }, end: { x: number; y: number }, index: number) {
  const dx = end.x - from.x;
  const dy = end.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  const nx = -dy / length;
  const ny = dx / length;
  const bend = 5.5 + index % 3;
  const point = (t: number, direction: number) => ({ x: from.x + dx * t + nx * bend * direction, y: from.y + dy * t + ny * bend * direction });
  const controlOne = point(.16, 1);
  const third = point(.33, 0);
  const controlTwo = point(.5, -1);
  const twoThirds = point(.66, 0);
  const controlThree = point(.84, 1);
  return `M ${from.x} ${from.y} Q ${controlOne.x} ${controlOne.y} ${third.x} ${third.y} Q ${controlTwo.x} ${controlTwo.y} ${twoThirds.x} ${twoThirds.y} Q ${controlThree.x} ${controlThree.y} ${end.x} ${end.y}`;
}

function BoardConnections() {
  return (
    <svg className="board-connections" viewBox="0 0 100 100" aria-label="Serpientes y escaleras del tablero" role="img">
      <defs>
        <filter id="connection-shadow"><feDropShadow dx="0" dy=".8" stdDeviation=".7" floodOpacity=".35" /></filter>
        <linearGradient id="ladder-color" x1="0" y1="1" x2="0" y2="0"><stop stopColor="#059669" /><stop offset="1" stopColor="#34d399" /></linearGradient>
        <linearGradient id="snake-color" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#e11d48" /><stop offset="1" stopColor="#fb7185" /></linearGradient>
      </defs>
      {Object.entries(ladderMoves).map(([fromValue, to]) => {
        const from = boardPoint(Number(fromValue));
        const end = boardPoint(to);
        const dx = end.x - from.x;
        const dy = end.y - from.y;
        const length = Math.hypot(dx, dy) || 1;
        const px = -dy / length * 1.05;
        const py = dx / length * 1.05;
        return <g key={`ladder-${fromValue}`} className="board-ladder" filter="url(#connection-shadow)"><line x1={from.x + px} y1={from.y + py} x2={end.x + px} y2={end.y + py} /><line x1={from.x - px} y1={from.y - py} x2={end.x - px} y2={end.y - py} />{[.18, .34, .5, .66, .82].map((t) => <line key={t} x1={from.x + dx * t + px} y1={from.y + dy * t + py} x2={from.x + dx * t - px} y2={from.y + dy * t - py} className="ladder-rung" />)}</g>;
      })}
      {Object.entries(slideMoves).map(([fromValue, to], index) => {
        const from = boardPoint(Number(fromValue));
        const end = boardPoint(to);
        return <g key={`snake-${fromValue}`} className="board-snake" filter="url(#connection-shadow)"><path d={snakePath(from, end, index)} /><circle cx={from.x} cy={from.y} r="2.15" className="snake-head" /><circle cx={from.x - .7} cy={from.y - .45} r=".28" className="snake-eye" /><circle cx={from.x + .7} cy={from.y - .45} r=".28" className="snake-eye" /><path d={`M ${from.x} ${from.y + 1.1} l -1.15 1.35 m 1.15 -1.35 l 1.15 1.35`} className="snake-mouth" /></g>;
      })}
    </svg>
  );
}

export function EscaleraEmocionesGame() {
  const gameRoot = useRef<HTMLElement>(null);
  const rollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: "Jugador 1", position: 0, color: playerColors[0] },
    { id: 2, name: "Jugador 2", position: 0, color: playerColors[1] },
  ]);
  const [turn, setTurn] = useState(0);
  const [dice, setDice] = useState(1);
  const [prompt, setPrompt] = useState<EscaleraPrompt | null>(null);
  const [moveNotice, setMoveNotice] = useState("");
  const [winner, setWinner] = useState<string | null>(null);
  const [rolling, setRolling] = useState(false);
  const [lastLanding, setLastLanding] = useState<number | null>(null);
  const [moveKind, setMoveKind] = useState<MoveKind>("normal");
  const [lastMove, setLastMove] = useState<MoveDetail | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showPlayers, setShowPlayers] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    const onFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreen);
      if (rollTimer.current) clearTimeout(rollTimer.current);
    };
  }, []);

  const currentPlayer = players[turn];
  const phase = winner ? "Partida completada" : prompt ? "Conversen la tarjeta" : rolling ? "El dado está girando" : `Turno de ${currentPlayer.name}`;

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else if (isFullscreen) setIsFullscreen(false);
    else if (document.fullscreenEnabled && gameRoot.current?.requestFullscreen) {
      try { await gameRoot.current.requestFullscreen(); }
      catch { setIsFullscreen(true); }
    } else setIsFullscreen(true);
  };

  const roll = () => {
    if (prompt || winner || rolling) return;
    const value = Math.floor(Math.random() * 6) + 1;
    setDice(value);
    setRolling(true);
    setLastLanding(null);
    if (soundEnabled) playGameSound("dice");
    rollTimer.current = setTimeout(() => {
      const active = players[turn];
      const from = active.position;
      let target = from + value;
      if (target > 100) target = active.position;
      const rolledTo = target;
      let kind: MoveKind = "normal";
      let notice = target === active.position ? "Necesitas el número exacto para llegar a 100." : `${active.name} avanzó ${value} casillas.`;
      if (ladderMoves[target]) {
        notice = `¡Escalera! ${active.name} sube de ${target} a ${ladderMoves[target]}.`;
        target = ladderMoves[target];
        kind = "ladder";
      } else if (slideMoves[target]) {
        notice = `Serpiente: ${active.name} vuelve de ${target} a ${slideMoves[target]} y puede intentarlo nuevamente.`;
        target = slideMoves[target];
        kind = "slide";
      }
      setPlayers((current) => current.map((player, index) => index === turn ? { ...player, position: target } : player));
      setMoveNotice(notice);
      setMoveKind(kind);
      setLastMove({ from, rolledTo, to: target, kind, dice: value, player: active.name });
      setLastLanding(target);
      setRolling(false);
      if (soundEnabled) playGameSound(kind === "normal" ? "land" : kind);
      if (target === 100) {
        setWinner(active.name);
        if (soundEnabled) window.setTimeout(() => playGameSound("win"), 380);
      } else {
        setPrompt(escaleraPrompts[Math.floor(Math.random() * escaleraPrompts.length)]);
      }
    }, 760);
  };

  const finishConversation = (passed = false) => {
    if (soundEnabled && !passed) playGameSound("complete");
    setPrompt(null);
    setMoveNotice("");
    setLastLanding(null);
    setTurn((current) => (current + 1) % players.length);
  };

  const reset = () => {
    if (rollTimer.current) clearTimeout(rollTimer.current);
    setPlayers((current) => current.map((player) => ({ ...player, position: 0 })));
    setTurn(0);
    setDice(1);
    setPrompt(null);
    setMoveNotice("");
    setWinner(null);
    setRolling(false);
    setLastLanding(null);
    setLastMove(null);
  };

  const addPlayer = () => {
    if (players.length >= 4) return;
    const id = Math.max(...players.map((player) => player.id)) + 1;
    setPlayers((current) => [...current, { id, name: `Jugador ${id}`, position: 0, color: playerColors[current.length] }]);
  };

  return (
    <main ref={gameRoot} className={`escalera-game-root h-dvh overflow-hidden bg-[#eee9dc] text-slate-950 ${isFullscreen ? "is-immersive" : ""}`}>
      <header className="escalera-game-header relative z-40 flex h-16 items-center justify-between gap-3 border-b border-white/10 bg-[#062b67] px-3 text-white shadow-lg sm:px-5">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Link href="/maletin-viajero" aria-label="Volver al Maletín Viajero" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 hover:bg-white/20"><ArrowLeft className="h-5 w-5" /></Link>
          <MaletinBrand compact />
          <div className="hidden h-8 w-px bg-white/15 lg:block" />
          <div className="hidden lg:block"><p className="text-sm font-black">La escalera de las emociones</p><p className="text-[10px] font-bold uppercase tracking-[.14em] text-blue-200">{phase}</p></div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="mr-2 hidden xl:block"><StrengthsMark compact /></div>
          <button onClick={() => setSoundEnabled((value) => !value)} aria-pressed={soundEnabled} aria-label={soundEnabled ? "Desactivar sonidos" : "Activar sonidos"} className="game-header-button"><span className="hidden sm:inline">Sonido</span>{soundEnabled ? <Volume2 /> : <VolumeX />}</button>
          <button onClick={() => setShowGuide(true)} aria-label="Cómo jugar" className="game-header-button"><span className="hidden sm:inline">Cómo jugar</span><HelpCircle /></button>
          <button onClick={() => setShowPlayers(true)} aria-label="Cambiar nombres de jugadores" className="game-header-button"><span className="hidden md:inline">Nombres</span><Users /></button>
          <button onClick={toggleFullscreen} aria-label={isFullscreen ? "Salir de pantalla completa" : "Ver en pantalla completa"} className="game-header-button game-header-primary"><span className="hidden md:inline">{isFullscreen ? "Salir" : "Pantalla completa"}</span>{isFullscreen ? <Minimize /> : <Expand />}</button>
          <button onClick={() => setShareOpen(true)} aria-label="Compartir juego" className="game-header-button"><Send /></button>
        </div>
      </header>

      <section className="escalera-arena">
        <aside className="escalera-hud">
          <div className="hud-phase">
            <span className={`game-token h-8 w-8 rounded-full ${currentPlayer.color}`} />
            <div><p className="text-[9px] font-black uppercase tracking-[.16em] text-blue-200">Ahora</p><p className="truncate text-base font-black">{phase}</p></div>
          </div>

          <div className="hud-dice"><DiceCube value={dice} rolling={rolling} /></div>
          <button onClick={roll} disabled={Boolean(prompt || winner || rolling)} className="game-primary-button hud-roll-button">
            <Footprints className="h-5 w-5" /> {rolling ? "Lanzando…" : prompt ? "Conversa primero" : "Lanzar dado"}
          </button>

          <div className="player-manager">
            <div className="mb-2 flex items-center justify-between"><p className="text-[9px] font-black uppercase tracking-[.16em] text-blue-200">Participantes</p><button onClick={() => setShowPlayers(true)} className="text-[10px] font-bold text-white/70 hover:text-white">Editar</button></div>
            <div className="space-y-1.5">
              {players.map((player, index) => <label key={player.id} className={`flex items-center gap-2 rounded-xl px-2.5 py-2 ${index === turn ? "bg-white/14 ring-1 ring-white/20" : "bg-white/5"}`}><span className={`game-token h-4 w-4 rounded-full ${player.color}`} /><span className="sr-only">Nombre del jugador {index + 1}</span><input value={player.name} onChange={(event) => setPlayers((current) => current.map((item) => item.id === player.id ? { ...item, name: event.target.value } : item))} className="min-w-0 flex-1 bg-transparent text-xs font-bold text-white outline-none placeholder:text-blue-200" /><span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-black tabular-nums text-blue-100">{player.position}</span></label>)}
            </div>
          </div>

          <div className="hud-actions">
            <button onClick={() => setShowPlayers(true)}><Users /> Jugadores</button>
            <button onClick={reset}><RotateCcw /> Reiniciar</button>
          </div>
        </aside>

        <section className="escalera-board-stage">
          <div className="board-status-bar">
            <div className="min-w-0">{lastMove ? <><p className="text-[9px] font-black uppercase tracking-[.16em] text-[#087f8c]">Último movimiento · dado {lastMove.dice}</p><p className="truncate text-xs font-black text-slate-800"><span className="text-slate-500">{lastMove.player}:</span> {lastMove.from} <strong className="mx-1 text-[#087f8c]">→</strong> {lastMove.rolledTo}{lastMove.kind === "ladder" ? ` · escalera hasta ${lastMove.to}` : lastMove.kind === "slide" ? ` · serpiente hasta ${lastMove.to}` : ` · llegó a ${lastMove.to}`}</p></> : <><p className="text-[9px] font-black uppercase tracking-[.16em] text-slate-400">Objetivo</p><p className="text-xs font-black text-slate-700">Lleguen exactamente a 100</p></>}</div>
            <div className="flex shrink-0 items-center gap-1.5"><div className="hidden items-center gap-1.5 text-[9px] font-black sm:flex"><span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-800">Escaleras verdes</span><span className="rounded-full bg-rose-100 px-2 py-1 text-rose-800">Serpientes rosadas</span></div><button onClick={toggleFullscreen} className="board-expand-button">{isFullscreen ? <Minimize /> : <Expand />}<span>{isFullscreen ? "Reducir" : "Ampliar tablero"}</span></button></div>
          </div>
          <div className="board-fit-area">
            <div className="emotion-board escalera-fit-board relative grid grid-cols-10 rounded-[22px] border-[5px] border-[#062b67] bg-[#062b67] gap-0.5 p-1 sm:gap-1 sm:p-1.5">
              <BoardConnections />
              {boardNumbers.map((number) => {
                const occupants = players.filter((player) => player.position === number);
                const ladder = ladderMoves[number];
                const slide = slideMoves[number];
                return (
                  <div key={number} className={`board-cell relative aspect-square rounded-[4px] p-0.5 sm:rounded-md sm:p-1 ${number % 2 === 0 ? "board-cell-teal" : "board-cell-cream"} ${lastLanding === number ? `is-landing is-${moveKind}` : ""} ${ladder ? "has-ladder" : ""} ${slide ? "has-slide" : ""}`}>
                    <span className="board-number relative z-30 text-[8px] font-black text-[#062b67] sm:text-[10px] lg:text-xs">{number}</span>
                    {ladder ? <span className="board-jump text-emerald-700">↗{ladder}</span> : null}
                    {slide ? <span className="board-jump text-rose-700">↘{slide}</span> : null}
                    {lastMove?.to === number ? <span className="destination-pulse" aria-label={`Destino: casilla ${number}`}>{number}</span> : null}
                    <div className="absolute inset-x-0.5 bottom-0.5 z-40 flex flex-wrap gap-px">{occupants.map((player) => <span key={player.id} title={`${player.name}, casilla ${number}`} className={`game-token token-arrive h-2.5 w-2.5 rounded-full sm:h-3.5 sm:w-3.5 ${player.color}`} />)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </section>

      {prompt ? (
        <div className="game-dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="emotion-question">
          <section key={prompt.id} className="emotion-question-dialog question-card-enter">
            <div className="emotion-dialog-accent" />
            <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[.18em] text-[#087f8c]">Paso 2 · Conversar</p><h2 id="emotion-question" className="mt-1 text-xl font-black">Tarjeta emocional</h2></div><span className={`rounded-full px-3 py-1 text-xs font-black ${categoryStyle[prompt.category]}`}>{prompt.category}</span></div>
            <p className="mt-5 text-2xl font-black leading-tight tracking-tight sm:text-4xl">{prompt.prompt}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900"><strong>Fortaleza:</strong> {prompt.strength}</div><div className={`rounded-2xl p-4 text-sm font-bold leading-6 ${moveKind === "ladder" ? "bg-emerald-50 text-emerald-800" : moveKind === "slide" ? "bg-rose-50 text-rose-800" : "bg-blue-50 text-blue-800"}`}>{moveNotice}</div></div>
            <p className="mt-4 text-xs leading-5 text-slate-500">Escuchen sin corregir. Cualquier persona puede pasar sin explicar algo privado.</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto]"><button onClick={() => finishConversation(false)} className="game-primary-button flex items-center justify-center gap-2 rounded-2xl bg-[#062b67] px-5 py-3.5 text-sm font-black text-white"><Check className="h-4 w-4" /> Ya conversamos <ChevronRight className="h-4 w-4" /></button><button onClick={() => finishConversation(true)} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50">Pasar por ahora</button></div>
          </section>
        </div>
      ) : null}

      {winner ? <div className="game-dialog-backdrop" role="dialog" aria-modal="true"><section className="winner-dialog winner-burst"><Trophy className="mx-auto h-16 w-16 text-[#ffd365]" /><Crown className="mx-auto -mt-2 h-8 w-8 text-[#ef513e]" /><p className="mt-4 text-xs font-black uppercase tracking-[.2em] text-teal-200">Partida completada</p><h2 className="mt-2 text-4xl font-black">¡Llegaron juntos!</h2><p className="mt-3 text-blue-100">{winner} llegó a 100. Cierren contando algo que descubrieron de otra persona.</p><button onClick={reset} className="game-primary-button mt-6 rounded-2xl bg-[#f5b82e] px-6 py-3.5 font-black text-[#062b67]">Jugar otra partida</button></section></div> : null}

      {showIntro ? <div className="game-dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="start-title"><section className="game-intro-dialog"><div className="flex items-start justify-between"><div><p className="text-xs font-black uppercase tracking-[.18em] text-[#087f8c]">Una partida, tres pasos</p><h2 id="start-title" className="mt-2 text-3xl font-black tracking-tight">Jugar es muy simple</h2></div><Sparkles className="h-9 w-9 text-[#f5a623]" /></div><div className="mt-6 grid gap-3 sm:grid-cols-3">{[["1", "Lanza", "La ficha avanza automáticamente."], ["2", "Conversa", "Respondan o pasen sin presión."], ["3", "Continúa", "El turno cambia al terminar."]].map(([step, title, text]) => <div key={step} className="intro-step"><span>{step}</span><h3>{title}</h3><p>{text}</p></div>)}</div><div className="mt-5 rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-blue-900"><strong>Meta:</strong> llegar exactamente a 100. Las escaleras hacen subir y las serpientes invitan a volver a intentar.</div><button onClick={() => setShowIntro(false)} className="game-primary-button mt-5 w-full rounded-2xl bg-[#062b67] px-6 py-4 font-black text-white">Preparar jugadores y comenzar</button></section></div> : null}

      {showPlayers ? <div className="game-dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="players-title"><section className="players-dialog"><div className="flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-[.18em] text-[#087f8c]">Antes de lanzar</p><h2 id="players-title" className="mt-1 text-2xl font-black">Participantes</h2></div><button onClick={() => setShowPlayers(false)} aria-label="Cerrar jugadores" className="grid h-10 w-10 place-items-center rounded-full bg-slate-100"><X className="h-5 w-5" /></button></div><div className="mt-5 space-y-2">{players.map((player, index) => <label key={player.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3"><span className={`game-token h-6 w-6 rounded-full ${player.color}`} /><span className="sr-only">Nombre del participante {index + 1}</span><input value={player.name} onChange={(event) => setPlayers((current) => current.map((item) => item.id === player.id ? { ...item, name: event.target.value } : item))} className="min-w-0 flex-1 bg-transparent font-bold outline-none" /><span className="text-xs font-black text-slate-400">Casilla {player.position}</span></label>)}</div>{players.length < 4 ? <button onClick={addPlayer} className="mt-3 w-full rounded-2xl border border-dashed border-slate-300 py-3 text-sm font-bold text-slate-600">+ Añadir participante</button> : null}<button onClick={() => setShowPlayers(false)} className="game-primary-button mt-5 w-full rounded-2xl bg-[#062b67] py-3.5 font-black text-white">Listos para jugar</button></section></div> : null}

      {showGuide ? <div className="game-dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="guide-title"><section className="players-dialog"><div className="flex items-center justify-between"><h2 id="guide-title" className="text-2xl font-black">Cómo acompañar</h2><button onClick={() => setShowGuide(false)} aria-label="Cerrar guía" className="grid h-10 w-10 place-items-center rounded-full bg-slate-100"><X className="h-5 w-5" /></button></div><ol className="mt-5 space-y-3 text-sm leading-6 text-slate-700"><li><strong>1. Lanza:</strong> el sistema mueve la ficha y aplica escaleras o serpientes.</li><li><strong>2. Lee:</strong> una persona lee la tarjeta en voz alta.</li><li><strong>3. Escucha:</strong> no hay respuestas correctas. Se puede pasar.</li><li><strong>4. Continúa:</strong> confirma la conversación para entregar el turno.</li></ol><div className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">Validen primero la emoción. Las soluciones pueden venir después.</div></section></div> : null}

      <GameShareModal open={shareOpen} onClose={() => setShareOpen(false)} title="La escalera de las emociones" path="/escalera-emociones" description="Juego del Maletín Viajero para reconocer, expresar y regular emociones conversando en familia o en el colegio." />
    </main>
  );
}
