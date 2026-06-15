import {
  CircleDot,
  Compass,
  Gauge,
  HeartHandshake,
  LucideIcon,
  MessageCircle,
  Smile,
  Sparkles,
  Shuffle,
  Star,
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
  category: string;
  status: GameStatus;
  icon: LucideIcon;
};

const promptIcons = [Gauge, HeartHandshake, Wind, UsersRound, Star, MessageCircle, Compass, Sparkles, Smile, CircleDot];

export const games: GameInfo[] = [
  {
    title: "Revoltijo Vincular de las Emociones",
    href: "/revoltijo-emociones",
    summary: "Tarjetas breves para conversar, moverse, imaginar y regularse por color emocional.",
    audience: "Prebasica a ensenanza media",
    category: "Regulacion emocional",
    status: "listo",
    icon: Shuffle,
  },
  ...promptGames.map((game, index): GameInfo => ({
    title: game.title,
    href: `/juegos/${game.slug}`,
    summary: game.summary,
    audience: "Por nivel escolar",
    category: game.category,
    status: "listo",
    icon: promptIcons[index % promptIcons.length],
  })),
];

export const appHighlights = [
  { label: "Uso rapido", value: "Enlace o QR", icon: Gauge },
  { label: "Formato", value: "Canva + pantalla", icon: CircleDot },
  { label: "Base", value: "Socioemocional", icon: Shuffle },
];
