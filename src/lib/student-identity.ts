export const cleanRutValue = (value: string) =>
  String(value || "").replace(/[^0-9kK]/g, "").toUpperCase();

// Conserva ceros de relleno de la fuente institucional. Ejemplo:
// 0275938998 -> 027.593.899-8.
export const formatRutValue = (value: string) => {
  const clean = cleanRutValue(value);
  if (clean.length < 2) return clean;
  const body = clean.slice(0, -1);
  const verifier = clean.slice(-1);
  const groups: string[] = [];
  for (let end = body.length; end > 0; end -= 3) {
    groups.unshift(body.slice(Math.max(0, end - 3), end));
  }
  return `${groups.join(".")}-${verifier}`;
};

export const titleCaseStudentName = (value: string) =>
  String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((part) => part ? `${part[0].toUpperCase()}${part.slice(1).toLowerCase()}` : part)
    .join(" ");

// La nomina de Primer Ciclo llega como "Apellido1 Apellido2 Nombres".
// Esta funcion solo debe usarse con fuentes que declaren ese orden.
export const moveTwoSurnamesToEnd = (value: string) => {
  const parts = titleCaseStudentName(value).split(" ").filter(Boolean);
  if (parts.length < 3) return parts.join(" ");
  const lower = parts.map((part) => part.toLowerCase());
  let surnameTokenCount = 2;
  if (lower[0] === "de" && ["la", "las", "los"].includes(lower[1]) && parts.length >= 5) {
    surnameTokenCount = 4;
  } else if (lower[0]?.includes("-de") && ["la", "las", "los"].includes(lower[1]) && parts.length >= 5) {
    surnameTokenCount = 4;
  } else if (lower[1] === "de" && ["la", "las", "los"].includes(lower[2]) && parts.length >= 6) {
    surnameTokenCount = 5;
  } else if (["san", "santa"].includes(lower[0]) && parts.length >= 4) {
    surnameTokenCount = 3;
  }
  return [...parts.slice(surnameTokenCount), ...parts.slice(0, surnameTokenCount)].join(" ");
};
