"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronsDown,
  ChevronsUp,
  Dices,
  RotateCcw,
  Timer,
  Trophy,
  UsersRound,
} from "lucide-react";
import { BrandHeader } from "@/components/BrandHeader";
import { CharacterStrengthBadge } from "@/components/CharacterStrengthBadge";

type GamePhase = "ready" | "rolling" | "moving" | "jumping" | "settling" | "question" | "finished";

type FamilyQuestion = {
  prompt: string;
  support: string;
  strength: string;
};

const finalTile = 36;
const ladders: Record<number, number> = { 3: 11, 8: 16, 14: 25, 21: 32 };
const snakes: Record<number, number> = { 17: 7, 24: 12, 29: 19, 35: 26 };

const familyQuestions: FamilyQuestion[] = [
  { prompt: "¿Qué gesto pequeño hace que nuestra familia se sienta cuidada?", support: "Cada persona puede dar un ejemplo concreto.", strength: "Soy amable" },
  { prompt: "¿Qué acuerdo familiar nos ayuda a tratarnos con respeto?", support: "Elijan un acuerdo que todos puedan observar.", strength: "Soy respetuoso" },
  { prompt: "¿Qué responsabilidad de la casa podemos cumplir mejor esta semana?", support: "Piensen en una acción y en cuándo se realizará.", strength: "Soy responsable" },
  { prompt: "Nombren algo difícil que hayan logrado como familia.", support: "Reconozcan el esfuerzo y no solo el resultado.", strength: "Tengo afán de superación" },
  { prompt: "¿Qué actividad sencilla nos entusiasma compartir?", support: "Puede ser una comida, paseo, conversación o juego.", strength: "Soy entusiasta" },
  { prompt: "¿Cómo podemos reparar una discusión sin buscar culpables?", support: "Propongan una frase de reparación y un siguiente paso.", strength: "Soy constructivo" },
  { prompt: "¿Qué decisión familiar queremos tomar con un propósito claro?", support: "Completen: ‘Esto es importante para nosotros porque…’.", strength: "Tengo propósito" },
  { prompt: "¿Qué hacemos bien como familia y queremos seguir cuidando?", support: "Den evidencia: cuándo ocurre y cómo se nota.", strength: "Hago las cosas bien" },
  { prompt: "¿Cómo podemos decir que no sin herir a otra persona?", support: "Ensayen una frase clara, breve y respetuosa.", strength: "Soy correcto" },
  { prompt: "¿A quién de la familia queremos agradecer hoy y por qué?", support: "El agradecimiento debe nombrar una acción concreta.", strength: "Soy amable" },
  { prompt: "¿Qué necesita cada persona para sentirse escuchada?", support: "Hablen por turnos, sin interrumpir ni corregir.", strength: "Soy respetuoso" },
  { prompt: "¿Qué meta familiar podemos dividir en pasos pequeños?", support: "Definan solamente el primer paso y quién puede iniciarlo.", strength: "Tengo propósito" },
  { prompt: "¿Qué error reciente nos dejó un aprendizaje útil?", support: "Separen el error del valor de la persona.", strength: "Tengo afán de superación" },
  { prompt: "¿Cómo podemos distribuir mejor una tarea compartida?", support: "Busquen una distribución clara y posible para todos.", strength: "Soy responsable" },
  { prompt: "¿Qué palabra queremos que describa el ambiente de nuestra casa?", support: "Luego nombren una conducta que ayude a construirlo.", strength: "Soy constructivo" },
  { prompt: "¿Qué momento cotidiano merece más atención y menos apuro?", support: "Elijan un momento que puedan cuidar desde hoy.", strength: "Hago las cosas bien" },
  { prompt: "¿Qué cualidad vemos en otra persona de la familia?", support: "Nombren la cualidad junto con una evidencia.", strength: "Soy amable" },
  { prompt: "¿Qué podemos hacer cuando alguien necesita una pausa?", support: "Acuerden una señal y una forma segura de retomar.", strength: "Soy respetuoso" },
];

const boardTiles = Array.from({ length: 6 }, (_, rowIndex) => {
  const row = 5 - rowIndex;
  const first = row * 6 + 1;
  const values = Array.from({ length: 6 }, (_, column) => first + column);
  return row % 2 === 0 ? values : values.reverse();
}).flat();

const delay = (milliseconds: number) => new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));

function phaseMessage(phase: GamePhase, jumpKind: "ladder" | "snake" | null) {
  if (phase === "rolling") return "Lanzando el dado…";
  if (phase === "moving") return "El peón está avanzando casilla por casilla…";
  if (phase === "jumping") return jumpKind === "ladder" ? "Subiendo por la escalera…" : "Bajando por la serpiente…";
  if (phase === "settling") return "El peón llegó. La pregunta aparecerá en un momento.";
  if (phase === "question") return "Conversen con calma. La pregunta no desaparecerá sola.";
  if (phase === "finished") return "Llegaron a la meta. Pueden conversar la última pregunta.";
  return "Lanza el dado para comenzar o continuar la partida.";
}

export function FamilySnakesGame() {
  const [position, setPosition] = useState(1);
  const [dice, setDice] = useState<number | null>(null);
  const [phase, setPhase] = useState<GamePhase>("ready");
  const [turnCount, setTurnCount] = useState(0);
  const [questionDelay, setQuestionDelay] = useState(2500);
  const [currentQuestion, setCurrentQuestion] = useState<FamilyQuestion | null>(null);
  const [lastJumpKind, setLastJumpKind] = useState<"ladder" | "snake" | null>(null);
  const runIdRef = useRef(0);

  useEffect(() => () => {
    runIdRef.current += 1;
  }, []);

  const resetGame = () => {
    runIdRef.current += 1;
    setPosition(1);
    setDice(null);
    setPhase("ready");
    setTurnCount(0);
    setCurrentQuestion(null);
    setLastJumpKind(null);
  };

  const rollDice = async () => {
    if (!["ready"].includes(phase) || position >= finalTile) return;
    const runId = runIdRef.current + 1;
    runIdRef.current = runId;
    const result = Math.floor(Math.random() * 6) + 1;
    setCurrentQuestion(null);
    setLastJumpKind(null);
    setDice(result);
    setTurnCount((count) => count + 1);
    setPhase("rolling");
    await delay(650);
    if (runIdRef.current !== runId) return;

    const target = Math.min(finalTile, position + result);
    setPhase("moving");
    for (let nextPosition = position + 1; nextPosition <= target; nextPosition += 1) {
      setPosition(nextPosition);
      await delay(430);
      if (runIdRef.current !== runId) return;
    }

    const ladderTarget = ladders[target];
    const snakeTarget = snakes[target];
    const jumpTarget = ladderTarget || snakeTarget;
    const jumpKind = ladderTarget ? "ladder" : snakeTarget ? "snake" : null;
    let landingPosition = target;

    if (jumpTarget && jumpKind) {
      setLastJumpKind(jumpKind);
      setPhase("jumping");
      await delay(700);
      if (runIdRef.current !== runId) return;
      landingPosition = jumpTarget;
      setPosition(jumpTarget);
      await delay(1100);
      if (runIdRef.current !== runId) return;
    }

    setPhase("settling");
    await delay(questionDelay);
    if (runIdRef.current !== runId) return;

    const question = familyQuestions[(landingPosition + result + turnCount) % familyQuestions.length];
    setCurrentQuestion(question);
    setPhase(landingPosition >= finalTile ? "finished" : "question");
  };

  const continueGame = () => {
    setCurrentQuestion(null);
    setLastJumpKind(null);
    setPhase(position >= finalTile ? "finished" : "ready");
  };

  const busy = ["rolling", "moving", "jumping", "settling"].includes(phase);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <BrandHeader />
      <main className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link href="/?view=games" className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
            <ArrowLeft className="h-4 w-4" />
            Juegos Vinculares
          </Link>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <UsersRound className="h-4 w-4 text-blue-600" />
            Juego cooperativo para familias
          </div>
        </div>

        <section className="grid gap-5 xl:grid-cols-[minmax(620px,1fr)_390px]">
          <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Juego vincular</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Serpientes y Escaleras en Familia</h1>
                <p className="mt-1 text-sm text-slate-600">Avancen juntos y conversen una pregunta al terminar cada movimiento.</p>
              </div>
              <div className="rounded-md bg-slate-100 px-3 py-2 text-right">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Posición</p>
                <p className="text-lg font-black tabular-nums text-slate-950">{position} / {finalTile}</p>
              </div>
            </div>

            <div className="mx-auto aspect-square w-full max-w-[760px] overflow-hidden rounded-lg border-2 border-slate-900 bg-slate-100 shadow-inner" role="grid" aria-label="Tablero de Serpientes y Escaleras">
              <div className="grid h-full w-full grid-cols-6 grid-rows-6">
                {boardTiles.map((tile) => {
                  const ladderTarget = ladders[tile];
                  const snakeTarget = snakes[tile];
                  const occupied = position === tile;
                  const tileTone = tile === finalTile
                    ? "bg-amber-100"
                    : ladderTarget
                      ? "bg-emerald-50"
                      : snakeTarget
                        ? "bg-rose-50"
                        : tile % 3 === 0
                          ? "bg-blue-50"
                          : "bg-white";
                  return (
                    <div key={tile} role="gridcell" className={`relative flex min-h-0 items-center justify-center border border-slate-200/90 ${tileTone}`}>
                      <span className="absolute left-1.5 top-1 text-[10px] font-bold tabular-nums text-slate-500 sm:left-2 sm:top-1.5 sm:text-xs">{tile}</span>
                      {ladderTarget ? (
                        <span className="flex flex-col items-center text-emerald-700" title={`Escalera hasta ${ladderTarget}`}>
                          <ChevronsUp className="h-4 w-4 sm:h-6 sm:w-6" />
                          <span className="text-[9px] font-bold sm:text-[11px]">a {ladderTarget}</span>
                        </span>
                      ) : null}
                      {snakeTarget ? (
                        <span className="flex flex-col items-center text-rose-700" title={`Serpiente hasta ${snakeTarget}`}>
                          <ChevronsDown className="h-4 w-4 sm:h-6 sm:w-6" />
                          <span className="text-[9px] font-bold sm:text-[11px]">a {snakeTarget}</span>
                        </span>
                      ) : null}
                      {tile === finalTile ? <Trophy className="h-5 w-5 text-amber-600 sm:h-7 sm:w-7" aria-hidden="true" /> : null}
                      {occupied ? (
                        <span key={position} data-testid="family-pawn" className="tz-pawn-hop absolute z-10 grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-slate-950 text-sm font-black text-white shadow-lg sm:h-11 sm:w-11 sm:text-lg" aria-label={`Peón en casilla ${position}`}>
                          T
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-4 xl:sticky xl:top-4 xl:self-start">
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Turno {turnCount + (phase === "ready" ? 1 : 0)}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800" aria-live="polite">{phaseMessage(phase, lastJumpKind)}</p>
                </div>
                <div key={`${dice}-${turnCount}`} className={`grid h-16 w-16 shrink-0 place-items-center rounded-lg border border-blue-200 bg-blue-50 text-3xl font-black tabular-nums text-blue-900 ${phase === "rolling" ? "tz-dice-roll" : ""}`} aria-label={dice ? `Resultado del dado: ${dice}` : "Dado sin lanzar"}>
                  {dice || <Dices className="h-7 w-7" />}
                </div>
              </div>

              <button
                type="button"
                data-testid="family-roll"
                onClick={rollDice}
                disabled={phase !== "ready" || position >= finalTile}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <Dices className="h-5 w-5" />
                {busy ? "Movimiento en curso" : "Lanzar dado"}
              </button>

              <div className="mt-4 border-t border-slate-100 pt-4">
                <label htmlFor="question-delay" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                  <Timer className="h-4 w-4" />
                  Pausa antes de la pregunta
                </label>
                <select
                  id="question-delay"
                  value={questionDelay}
                  onChange={(event) => setQuestionDelay(Number(event.target.value))}
                  disabled={busy}
                  className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500"
                >
                  <option value={1500}>Breve · 1,5 segundos</option>
                  <option value={2500}>Cómoda · 2,5 segundos</option>
                  <option value={4000}>Larga · 4 segundos</option>
                </select>
              </div>
            </section>

            <section className="min-h-[310px] rounded-lg border border-slate-200 bg-white p-5 shadow-sm" aria-live="polite">
              {currentQuestion ? (
                <div data-testid="family-prompt" className="tz-slide-up">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">Pregunta familiar</p>
                    <CharacterStrengthBadge strength={currentQuestion.strength} compact />
                  </div>
                  <p className="mt-5 text-2xl font-black leading-tight tracking-tight text-slate-950">{currentQuestion.prompt}</p>
                  <p className="mt-4 rounded-md border border-blue-100 bg-blue-50 p-3 text-sm font-medium leading-6 text-blue-950">{currentQuestion.support}</p>
                  <button type="button" onClick={continueGame} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50">
                    <Check className="h-4 w-4" />
                    {position >= finalTile ? "Cerrar pregunta final" : "Terminar conversación y continuar"}
                  </button>
                </div>
              ) : (
                <div className="flex min-h-[270px] flex-col items-center justify-center text-center">
                  <div className="grid h-14 w-14 place-items-center rounded-lg bg-slate-100 text-slate-600">
                    {busy ? <ArrowRight className="h-6 w-6" /> : <UsersRound className="h-6 w-6" />}
                  </div>
                  <h2 className="mt-4 text-lg font-bold text-slate-900">{busy ? "Miren el movimiento del peón" : "La conversación aparecerá aquí"}</h2>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-slate-600">La pregunta se mostrará después de terminar toda la animación y permanecerá visible hasta que ustedes continúen.</p>
                </div>
              )}
            </section>

            <button type="button" onClick={resetGame} className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">
              <RotateCcw className="h-4 w-4" />
              Reiniciar partida
            </button>
          </aside>
        </section>
      </main>
    </div>
  );
}
