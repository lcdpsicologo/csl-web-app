// Materiales de orientación publicados por semana (I Ciclo).
//
// Cada entrada define, para un grupo de cursos, el taller de la semana con su
// presentación de Canva y su carpeta de Drive. La app los aplica sobre las
// clases ya agendadas de esa semana desde "Materiales de la semana".
//
// Para agregar una semana nueva: copia el último bloque, cambia `week` y los
// enlaces. No requiere tocar código de la interfaz.

export type WeekMaterialAssignment = {
  /** Cursos a los que aplica exactamente este material. */
  courses: string[];
  /** Nombre del taller / actividad de la semana. */
  topic: string;
  /** Fortaleza del carácter trabajada. */
  strength: string;
  /** Etiqueta de sesión o semana del programa, si la hay. */
  session?: string;
  /** Presentación de la clase (Canva). */
  canvaLink: string;
  /** Carpeta de planificación y materiales (Drive). */
  folderLink: string;
  /** Recurso adicional obligatorio para esos cursos, si existe. */
  extraLink?: string;
  extraLabel?: string;
  /** Nota operativa que queda visible en la clase. */
  notes?: string;
};

export type WeekMaterials = {
  /** Lunes de la semana, AAAA-MM-DD. */
  weekMonday: string;
  /** Etiqueta legible, ej. "04/08 al 08/08". */
  label: string;
  assignments: WeekMaterialAssignment[];
};

export const ORIENTATION_WEEK_MATERIALS: WeekMaterials[] = [
  {
    weekMonday: "2026-08-03",
    label: "03/08 al 07/08",
    assignments: [
      {
        courses: ["Prekínder A", "Prekínder B", "Prekínder C"],
        topic: "El tigre y el ratón",
        strength: "Soy respetuoso",
        canvaLink: "https://canva.link/pixbr68zd1est20",
        folderLink: "https://drive.google.com/drive/folders/1qAmecvFm_dAQx1NcZwdPT6zb6OEpEoF4?hl=es-419",
      },
      {
        courses: ["Kínder A", "Kínder B", "Kínder C"],
        topic: "Expresando mis emociones",
        strength: "Soy respetuoso",
        session: "Semana 3",
        canvaLink: "https://canva.link/dltrqcr9day84jt",
        folderLink: "https://drive.google.com/drive/folders/1iazzNF1gTsknkyUvazyFU55R0oPTkW9y?hl=es-419",
      },
      {
        courses: ["1° Básico A", "1° Básico B"],
        topic: "Consejo de Curso",
        strength: "Consejo de Curso",
        session: "Primera sesión",
        canvaLink: "https://canva.link/fj404e30yse7w7c",
        folderLink: "https://drive.google.com/drive/folders/1uYdwq1PVR8Mk7Z85x2lVhPUzrM7SJiJK?hl=es-419",
        notes: "Presentación común de Consejo de Curso para 1° a 4° básico. La carpeta trae planificación y acta del nivel.",
      },
      {
        courses: ["2° Básico A", "2° Básico B"],
        topic: "Consejo de Curso",
        strength: "Consejo de Curso",
        session: "Primera sesión",
        canvaLink: "https://canva.link/fj404e30yse7w7c",
        folderLink: "https://drive.google.com/drive/folders/1GyPxdvqgxHj9aTaTjwZSngz9W5sn2aG0?hl=es-419",
        notes: "Presentación común de Consejo de Curso para 1° a 4° básico. La carpeta trae planificación y acta del nivel.",
      },
      {
        courses: ["3° Básico A", "3° Básico B"],
        topic: "Consejo de Curso",
        strength: "Consejo de Curso",
        session: "Primera sesión",
        canvaLink: "https://canva.link/fj404e30yse7w7c",
        folderLink: "https://drive.google.com/drive/folders/1_OSdQtpVDigiQ8f-6MxbQfX4EXz4qU5X?hl=es-419",
        notes: "Presentación común de Consejo de Curso para 1° a 4° básico. La carpeta trae planificación y acta del nivel.",
      },
      {
        courses: ["4° Básico A", "4° Básico B"],
        topic: "Consejo de Curso",
        strength: "Consejo de Curso",
        session: "Primera sesión",
        canvaLink: "https://canva.link/fj404e30yse7w7c",
        folderLink: "https://drive.google.com/drive/folders/1iQpj5wG9KDzkDnXreWhpCu1XD2zs-aSt?hl=es-419",
        extraLink: "https://canva.link/11hjjj5g1xawpav",
        extraLabel: "RICE 4° Básico | Así convivimos en San Lucas",
        notes: "Además del Consejo de Curso, presentar el RICE 4° Básico junto a Karen Riquelme (Convivencia Escolar).",
      },
    ],
  },
];

const norm = (value: string) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .trim();

/** Materiales publicados para la semana cuyo lunes es `weekMonday`. */
export const materialsForWeek = (weekMonday: string): WeekMaterials | null =>
  ORIENTATION_WEEK_MATERIALS.find((item) => item.weekMonday === weekMonday) || null;

/** Material que corresponde a un curso dentro de una semana. */
export const materialForCourse = (weekMonday: string, course: string): WeekMaterialAssignment | null => {
  const week = materialsForWeek(weekMonday);
  if (!week) return null;
  const target = norm(course);
  return week.assignments.find((item) => item.courses.some((name) => norm(name) === target)) || null;
};

/** Campos listos para guardar en el registro de la clase. */
export const materialUpdates = (assignment: WeekMaterialAssignment): Record<string, string> => {
  const notes = [assignment.notes, assignment.extraLabel && assignment.extraLink ? `${assignment.extraLabel}: ${assignment.extraLink}` : ""]
    .filter(Boolean)
    .join(" · ");
  return {
    topic: assignment.topic,
    axis: assignment.strength,
    characterStrength: assignment.strength,
    canvaLink: assignment.canvaLink,
    evidence: assignment.canvaLink,
    folderLink: assignment.folderLink,
    planificacion: assignment.folderLink,
    ...(assignment.extraLink ? { teacherLink: assignment.extraLink } : {}),
    ...(notes ? { notes } : {}),
  };
};
