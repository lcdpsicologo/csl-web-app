import Image from "next/image";
import { Compass, HeartHandshake, Sparkles } from "lucide-react";

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
    <div className={`fdc-lockup group relative flex items-center ${compact ? "gap-2" : "gap-3"}`} aria-label="Fortalezas del carácter: en relación al otro, a mí mismo y al mundo">
      <span className={`${compact ? "h-10 w-10" : "h-14 w-14"} fdc-orbit relative grid shrink-0 place-items-center rounded-full`}>
        <span className="absolute inset-[5px] rounded-full bg-gradient-to-br from-white via-amber-50 to-blue-50 shadow-[inset_0_1px_0_white,0_8px_24px_rgba(3,30,72,.24)]" />
        <Sparkles className={`${compact ? "h-4 w-4" : "h-5 w-5"} relative z-10 text-[#d99b08]`} strokeWidth={2.5} />
        <span className="fdc-satellite fdc-satellite-red"><HeartHandshake /></span>
        <span className="fdc-satellite fdc-satellite-green"><Compass /></span>
        <span className="fdc-satellite fdc-satellite-blue"><Sparkles /></span>
      </span>
      <span className="relative">
        <span className={`${compact ? "text-[8px]" : "text-[10px]"} block font-black uppercase tracking-[0.18em] text-amber-300`}>Formamos el carácter</span>
        <span className={`${compact ? "text-xs" : "text-sm"} mt-0.5 block font-black leading-tight text-white drop-shadow-sm`}>Fortalezas para<br className={compact ? "hidden" : ""} /> convivir y crecer</span>
        {!compact ? <span className="mt-1.5 flex gap-1.5" aria-hidden="true"><i className="h-1 w-7 rounded-full bg-[#ef513e]" /><i className="h-1 w-7 rounded-full bg-[#70b64a]" /><i className="h-1 w-7 rounded-full bg-[#4f91c8]" /></span> : null}
      </span>
    </div>
  );
}
