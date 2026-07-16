import {
  CircleDot,
  Compass,
  Dices,
  Gauge,
  HeartHandshake,
  LucideIcon,
  MessageCircle,
  Smile,
  Sparkles,
  Shuffle,
  Star,
  UsersRound,
  Waypoints,
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
  strength: string;
  status: GameStatus;
  icon: LucideIcon;
  image?: string;
  collection?: "Maletín Viajero" | "Biblioteca Vincular";
  featured?: boolean;
};

const promptIcons = [Gauge, HeartHandshake, Wind, UsersRound, Star, MessageCircle, Compass, Sparkles, Smile, CircleDot];

export const games: GameInfo[] = [
  {
    title: "Maletín Viajero",
    href: "/maletin-viajero",
    summary: "Colección para llevar experiencias socioemocionales entre el colegio y las familias.",
    audience: "Familias y equipos educativos",
    category: "Maletín Viajero",
    status: "listo",
    icon: HeartHandshake,
    image: "/maletin/familia-hero.webp",
    collection: "Maletín Viajero",
    featured: true,
  },
  {
    title: "Revoltijo de las emociones",
    href: "/revoltijo-emociones",
    summary: "Tarjetas breves para conversar, moverse, imaginar y regularse por color emocional.",
    audience: "Prebásica a enseñanza media",
    category: "Regulación emocional",
    status: "listo",
    icon: Shuffle,
    image: "/maletin/revoltijo.webp",
    collection: "Maletín Viajero",
    featured: true,
  },
  {
    title: "La escalera de las emociones",
    href: "/escalera-emociones",
    summary: "Tablero interactivo con dado, fichas y 32 conversaciones emocionales del manual.",
    audience: "Familias y cursos",
    category: "Maletín Viajero",
    status: "listo",
    icon: Dices,
    image: "/maletin/escalera.webp",
    collection: "Maletín Viajero",
    featured: true,
  },
  {
    title: "Serpientes y Escaleras en Familia",
    href: "/juegos/serpientes-familia",
    summary: "Tablero cooperativo con movimiento visible y preguntas familiares que permanecen en pantalla.",
    audience: "Familias y comunidad educativa",
    category: "Pertenencia y vinculo",
    strength: "Soy constructivo",
    status: "listo",
    icon: Waypoints,
  },
  ...promptGames.map((game, index): GameInfo => ({
    title: game.title,
    href: `/juegos/${game.slug}`,
    summary: game.summary,
    audience: "Por nivel escolar",
    category: game.category,
    strength: game.strength,
    status: "listo",
    icon: promptIcons[index % promptIcons.length],
    collection: "Biblioteca Vincular",
  })),
];

export const appHighlights = [
  { label: "Uso rapido", value: "Enlace o QR", icon: Gauge },
  { label: "Formato", value: "Canva + pantalla", icon: CircleDot },
  { label: "Base", value: "Socioemocional", icon: Shuffle },
];
