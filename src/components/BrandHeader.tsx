import Image from "next/image";
import Link from "next/link";

export function BrandHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-md border border-slate-200 bg-white">
            <Image src="/logo-san-lucas.png" alt="Logo Colegio San Lucas" width={44} height={44} priority />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold text-slate-950">Juegos Vinculares San Lucas</span>
            <span className="block truncate text-xs font-medium text-slate-500">Socioemocional interactivo</span>
          </span>
        </Link>
        <div className="hidden items-center gap-2 rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 py-2 sm:flex">
          <span className="h-7 w-7 rounded bg-gradient-to-br from-emerald-400 via-amber-300 to-sky-500" aria-hidden="true" />
          <span className="text-xs font-semibold text-slate-600">Logo fortalezas</span>
        </div>
      </div>
    </header>
  );
}
