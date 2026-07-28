import type { MetadataRoute } from "next";

// La plataforma maneja datos de estudiantes: no debe aparecer en buscadores.
// La vista de clases para profesores es de acceso por enlace, no pública para
// indexación.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
  };
}
