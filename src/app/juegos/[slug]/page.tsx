import { notFound } from "next/navigation";
import { PromptCardGame } from "@/components/PromptCardGame";
import { getPromptGame, promptGames } from "@/lib/promptGames";

export function generateStaticParams() {
  return promptGames.map((game) => ({ slug: game.slug }));
}

export default async function JuegoVincularPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = getPromptGame(slug);

  if (!game) notFound();

  return <PromptCardGame game={game} />;
}
