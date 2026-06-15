import {
  CircleDot,
  Compass,
  Gauge,
  Grid3X3,
  HeartHandshake,
  LucideIcon,
  MessageCircle,
  Smile,
  Sparkles,
  Shuffle,
  Star,
  TrafficCone,
  UsersRound,
  Wind,
} from "lucide-react";
import { promptGames } from "@/lib/promptGames";

export type GameStatus = "listo" | "proximamente";

export type GameInfo = {
  title: string;
  href: string;
  summary: string;
  audience: string;
  status: GameStatus;
  icon: LucideIcon;
};

export const games: GameInfo[] = [
  {
    title: "Revoltijo Vincular de las Emociones",
    href: "/revoltijo-emociones",
    summary: "Tarjetas breves para conversar, moverse, imaginar y regularse por color emocional.",
    audience: "Prebásica a enseñanza media",
    status: "listo",
    icon: Shuffle,
  },
  ...promptGames.map((game, index): GameInfo => ({
    title: game.title,
    href: `/juegos/${game.slug}`,
    summary: game.summary,
    audience: "Por nivel escolar",
    status: "listo",
    icon: [Gauge, HeartHandshake, Wind, UsersRound, Star, MessageCircle, Compass, Sparkles, Smile, CircleDot][index % 10],
  })),
  {
    title: "Bingo de Fortalezas",
    href: "/bingo-fortalezas",
    summary: "Reconocimiento oral de fortalezas personales y grupales.",
    audience: "Grupos curso",
    status: "proximamente",
    icon: Grid3X3,
  },
  {
    title: "Ruleta de Preguntas",
    href: "/ruleta-preguntas",
    summary: "Preguntas al azar para abrir diálogo y escucha respetuosa.",
    audience: "Consejo de curso y orientación",
    status: "proximamente",
    icon: CircleDot,
  },
  {
    title: "Semáforo Emocional",
    href: "/semaforo-emocional",
    summary: "Chequeo rápido de estado emocional y acciones de regulación.",
    audience: "Inicio o cierre de actividad",
    status: "proximamente",
    icon: TrafficCone,
  },
];

export const appHighlights = [
  { label: "Uso rápido", value: "Enlace o QR", icon: Gauge },
  { label: "Formato", value: "Canva + pantalla", icon: CircleDot },
  { label: "Base", value: "Socioemocional", icon: Shuffle },
];
