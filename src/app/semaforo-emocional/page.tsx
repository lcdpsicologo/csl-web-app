import { notFound } from "next/navigation";
import { PromptCardGame } from "@/components/PromptCardGame";
import { getPromptGame } from "@/lib/promptGames";

export default function SemaforoEmocionalPage() {
  const game = getPromptGame("semaforo-emocional");
  if (!game) notFound();
  return <PromptCardGame game={game} />;
}
