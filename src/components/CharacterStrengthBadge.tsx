import {
  BadgeCheck,
  ClipboardCheck,
  Hammer,
  Heart,
  Scale,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

type StrengthDefinition = {
  label: string;
  aliases: string[];
  icon: LucideIcon;
  iconClass: string;
  surfaceClass: string;
};

const normalizeStrength = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

export const characterStrengths: StrengthDefinition[] = [
  {
    label: "Soy amable",
    aliases: ["amable", "amabilidad"],
    icon: Heart,
    iconClass: "bg-rose-500 text-white",
    surfaceClass: "border-rose-200 bg-rose-50 text-rose-900",
  },
  {
    label: "Soy correcto",
    aliases: ["correcto", "correccion"],
    icon: Scale,
    iconClass: "bg-blue-600 text-white",
    surfaceClass: "border-blue-200 bg-blue-50 text-blue-900",
  },
  {
    label: "Tengo propósito",
    aliases: ["tengo proposito", "proposito"],
    icon: Target,
    iconClass: "bg-violet-600 text-white",
    surfaceClass: "border-violet-200 bg-violet-50 text-violet-900",
  },
  {
    label: "Soy responsable",
    aliases: ["responsable", "responsabilidad"],
    icon: ClipboardCheck,
    iconClass: "bg-emerald-600 text-white",
    surfaceClass: "border-emerald-200 bg-emerald-50 text-emerald-900",
  },
  {
    label: "Tengo afán de superación",
    aliases: ["tengo afan de superacion", "afan de superacion", "superacion"],
    icon: TrendingUp,
    iconClass: "bg-orange-500 text-white",
    surfaceClass: "border-orange-200 bg-orange-50 text-orange-950",
  },
  {
    label: "Soy entusiasta",
    aliases: ["entusiasta", "entusiasmo"],
    icon: Sun,
    iconClass: "bg-amber-400 text-amber-950",
    surfaceClass: "border-amber-200 bg-amber-50 text-amber-950",
  },
  {
    label: "Soy constructivo",
    aliases: ["constructivo"],
    icon: Hammer,
    iconClass: "bg-cyan-600 text-white",
    surfaceClass: "border-cyan-200 bg-cyan-50 text-cyan-950",
  },
  {
    label: "Hago las cosas bien",
    aliases: ["hago las cosas bien", "cosas bien"],
    icon: BadgeCheck,
    iconClass: "bg-indigo-600 text-white",
    surfaceClass: "border-indigo-200 bg-indigo-50 text-indigo-950",
  },
  {
    label: "Soy respetuoso",
    aliases: ["respetuoso", "respeto"],
    icon: ShieldCheck,
    iconClass: "bg-slate-900 text-white",
    surfaceClass: "border-slate-200 bg-slate-50 text-slate-950",
  },
];

export function getCharacterStrengthDefinition(strength: string): StrengthDefinition {
  const normalized = normalizeStrength(strength);
  return characterStrengths.find((definition) =>
    definition.aliases.some((alias) => normalized.includes(normalizeStrength(alias))),
  ) || {
    label: strength || "Fortaleza del carácter",
    aliases: [],
    icon: Sparkles,
    iconClass: "bg-slate-700 text-white",
    surfaceClass: "border-slate-200 bg-slate-50 text-slate-900",
  };
}

export function CharacterStrengthBadge({
  strength,
  compact = false,
  className = "",
}: {
  strength: string;
  compact?: boolean;
  className?: string;
}) {
  const definition = getCharacterStrengthDefinition(strength);
  const Icon = definition.icon;

  return (
    <span
      title={definition.label}
      className={`inline-flex min-w-0 items-center border font-semibold ${definition.surfaceClass} ${
        compact ? "gap-1.5 rounded-md py-1 pl-1 pr-2 text-[11px]" : "gap-2 rounded-lg py-1.5 pl-1.5 pr-3 text-sm"
      } ${className}`}
    >
      <span className={`grid shrink-0 place-items-center rounded-md ${definition.iconClass} ${compact ? "h-6 w-6" : "h-8 w-8"}`}>
        <Icon className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} aria-hidden="true" />
      </span>
      <span className="truncate">{definition.label}</span>
    </span>
  );
}

export function CharacterStrengthLogoStrip({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`} aria-label="Fortalezas del carácter">
      {characterStrengths.map((definition) => {
        const Icon = definition.icon;
        return (
          <span
            key={definition.label}
            title={definition.label}
            className={`grid h-7 w-7 shrink-0 place-items-center rounded-md shadow-sm ${definition.iconClass}`}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        );
      })}
    </div>
  );
}
