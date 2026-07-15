import Image from "next/image";

export function MaletinBrand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className={`${compact ? "h-9 w-9" : "h-12 w-12"} grid shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/60 bg-white shadow-sm`}>
        <Image src="/maletin/logo-san-lucas.png" alt="Colegio San Lucas" width={compact ? 32 : 42} height={compact ? 32 : 42} />
      </span>
      <span className="min-w-0">
        <span className={`${compact ? "text-xs" : "text-sm"} block truncate font-black tracking-tight`}>Maletín Viajero</span>
        <span className="block truncate text-[10px] font-semibold uppercase tracking-[0.14em] opacity-70">Colegio San Lucas</span>
      </span>
    </div>
  );
}

export function StrengthsMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-white/40 bg-white/90 p-1.5 pr-3 text-slate-800 shadow-sm backdrop-blur">
      <span className={`${compact ? "h-8 w-11" : "h-10 w-14"} relative shrink-0 overflow-hidden rounded-xl`}>
        <Image src="/maletin/fortalezas-caracter.jpg" alt="Fortalezas del carácter" fill sizes="56px" className="object-cover object-left" />
      </span>
      <span className="text-[10px] font-extrabold leading-tight">Fortalezas<br />del carácter</span>
    </div>
  );
}
