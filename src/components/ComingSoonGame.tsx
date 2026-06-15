import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

type ComingSoonGameProps = {
  title: string;
  summary: string;
};

export function ComingSoonGame({ title, summary }: ComingSoonGameProps) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto grid min-h-screen max-w-4xl place-items-center px-4 py-10">
        <section className="w-full rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
          <div className="mt-8 grid h-14 w-14 place-items-center rounded-md bg-amber-50 text-amber-700 ring-1 ring-amber-200">
            <Sparkles className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">{summary}</p>
          <p className="mt-6 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
            Ruta lista para completar el próximo juego.
          </p>
        </section>
      </div>
    </main>
  );
}
