type StrengthDefinition = {
  label: string;
  aliases: string[];
  column: number;
  row: number;
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
  { label: "Soy respetuoso", aliases: ["respetuoso", "respeto"], column: 0, row: 0, surfaceClass: "border-red-200 bg-red-50 text-red-950" },
  { label: "Tengo propósito", aliases: ["tengo proposito", "proposito"], column: 1, row: 0, surfaceClass: "border-green-200 bg-green-50 text-green-950" },
  { label: "Soy entusiasta", aliases: ["entusiasta", "entusiasmo"], column: 2, row: 0, surfaceClass: "border-blue-200 bg-blue-50 text-blue-950" },
  { label: "Soy amable", aliases: ["amable", "amabilidad"], column: 0, row: 1, surfaceClass: "border-orange-200 bg-orange-50 text-orange-950" },
  { label: "Soy responsable", aliases: ["responsable", "responsabilidad"], column: 1, row: 1, surfaceClass: "border-lime-200 bg-lime-50 text-lime-950" },
  { label: "Soy constructivo", aliases: ["constructivo"], column: 2, row: 1, surfaceClass: "border-sky-200 bg-sky-50 text-sky-950" },
  { label: "Soy correcto", aliases: ["correcto", "correccion"], column: 0, row: 2, surfaceClass: "border-amber-200 bg-amber-50 text-amber-950" },
  { label: "Tengo afán de superación", aliases: ["tengo afan de superacion", "afan de superacion", "superacion"], column: 1, row: 2, surfaceClass: "border-lime-200 bg-lime-50 text-lime-950" },
  { label: "Hago las cosas bien", aliases: ["hago las cosas bien", "cosas bien"], column: 2, row: 2, surfaceClass: "border-cyan-200 bg-cyan-50 text-cyan-950" },
];

export function getCharacterStrengthDefinition(strength: string): StrengthDefinition {
  const normalized = normalizeStrength(strength);
  return characterStrengths.find((definition) =>
    definition.aliases.some((alias) => normalized.includes(normalizeStrength(alias))),
  ) || {
    label: strength || "Fortaleza del carácter",
    aliases: [],
    column: 1,
    row: 1,
    surfaceClass: "border-slate-200 bg-slate-50 text-slate-900",
  };
}

function OfficialStrengthLogo({ definition, sizeClass }: { definition: StrengthDefinition; sizeClass: string }) {
  const rowPositions = ["5%", "47%", "88%"];
  return (
    <span
      className={`block shrink-0 rounded-md bg-white bg-no-repeat ${sizeClass}`}
      aria-hidden="true"
      style={{
        backgroundImage: "url('/maletin/fortalezas-caracter.jpg')",
        backgroundPosition: `${5 + definition.column * 45}% ${rowPositions[definition.row]}`,
        backgroundSize: "400% auto",
      }}
    />
  );
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
  return (
    <span
      title={definition.label}
      className={`inline-flex min-w-0 items-center border font-semibold ${definition.surfaceClass} ${
        compact ? "gap-1.5 rounded-md py-1 pl-1 pr-2 text-[11px]" : "gap-2 rounded-lg py-1.5 pl-1.5 pr-3 text-sm"
      } ${className}`}
    >
      <OfficialStrengthLogo definition={definition} sizeClass={compact ? "h-7 w-7" : "h-10 w-10"} />
      <span className="truncate">{definition.label}</span>
    </span>
  );
}

export function CharacterStrengthLogoStrip({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`} aria-label="Logos oficiales de las fortalezas del carácter">
      {characterStrengths.map((definition) => (
        <span key={definition.label} title={definition.label}>
          <OfficialStrengthLogo definition={definition} sizeClass="h-8 w-8 ring-1 ring-slate-200" />
        </span>
      ))}
    </div>
  );
}
