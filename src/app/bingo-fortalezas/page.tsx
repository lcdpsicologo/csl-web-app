import { notFound } from "next/navigation";
import { PromptCardGame } from "@/components/PromptCardGame";
import { getPromptGame } from "@/lib/promptGames";

export default function BingoFortalezasPage() {
  const game = getPromptGame("bingo-fortalezas");
  if (!game) notFound();
  return <PromptCardGame game={game} />;
}
