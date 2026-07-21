"use client";

import { useEffect } from "react";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[app-error-boundary] La interfaz encontro un error recuperable", {
      name: error.name,
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-slate-100">
      <section className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-8 text-center shadow-2xl shadow-black/30">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/15 text-2xl text-amber-300">
          !
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">Tiza encontro un problema temporal</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Tus datos permanecen guardados. Puedes intentar recuperar esta pantalla sin cerrar tu sesion.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
          >
            Reintentar
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
          >
            Recargar aplicacion
          </button>
        </div>
      </section>
    </main>
  );
}
