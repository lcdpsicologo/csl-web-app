import { notFound } from "next/navigation";
import { PromptCardGame } from "@/components/PromptCardGame";
import { getPromptGame } from "@/lib/promptGames";

export default function RuletaPreguntasPage() {
  const game = getPromptGame("ruleta-preguntas");
  if (!game) notFound();
  return <PromptCardGame game={game} />;
}
