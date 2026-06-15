import { LevelId } from "@/lib/revoltijoCards";

export type PromptGameCard = {
  id: string;
  level: LevelId;
  type: string;
  prompt: string;
  support: string;
  strength: string;
};

export type PromptGame = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  accent: "cyan" | "emerald" | "amber" | "rose" | "violet" | "slate";
  cards: PromptGameCard[];
};

type GameBlueprint = Omit<PromptGame, "cards"> & {
  focus: string;
  strength: string;
};

const levels: Array<{ id: LevelId; type: string; prompt: (focus: string) => string; support: string }> = [
  {
    id: "prebasica",
    type: "Gesto",
    prompt: (focus) => `Muestra con tu cara o tus manos como se ve ${focus} en el colegio.`,
    support: "El cuerpo tambien ayuda a expresar y entender.",
  },
  {
    id: "primero-segundo",
    type: "Pregunta",
    prompt: (focus) => `Cuenta una situacion pequena donde puedas practicar ${focus}.`,
    support: "Las acciones pequenas construyen habitos grandes.",
  },
  {
    id: "tercero-cuarto",
    type: "Conversacion",
    prompt: (focus) => `Que puede hacer el curso para cuidar mejor ${focus} esta semana?`,
    support: "Cuando el grupo propone, el acuerdo se vuelve mas real.",
  },
  {
    id: "segundo-ciclo",
    type: "Reflexion",
    prompt: (focus) => `Que dificultad aparece cuando intentamos vivir ${focus}, y como podemos enfrentarla?`,
    support: "Mirar la dificultad permite elegir una respuesta mas justa.",
  },
  {
    id: "tercer-ciclo",
    type: "Dialogo",
    prompt: (focus) => `Que decision concreta mostraria madurez al trabajar ${focus} en la vida diaria?`,
    support: "La madurez se nota en decisiones sostenidas, no solo en ideas.",
  },
];

const buildCards = (game: GameBlueprint): PromptGameCard[] =>
  levels.map((level, index) => ({
    id: `${game.slug}-${index + 1}`,
    level: level.id,
    type: level.type,
    prompt: level.prompt(game.focus),
    support: level.support,
    strength: game.strength,
  }));

const blueprints: GameBlueprint[] = [
  {
    slug: "bingo-fortalezas",
    title: "Bingo de Fortalezas",
    category: "Fortalezas del caracter",
    summary: "Reconocimiento oral de fortalezas personales y grupales.",
    accent: "amber",
    focus: "las fortalezas personales",
    strength: "Tengo afan de superacion",
  },
  {
    slug: "ruleta-preguntas",
    title: "Ruleta de Preguntas",
    category: "Dialogo y participacion",
    summary: "Preguntas al azar para abrir dialogo, escucha y participacion segura.",
    accent: "violet",
    focus: "la escucha y la participacion",
    strength: "Soy respetuoso",
  },
  {
    slug: "semaforo-emocional",
    title: "Semaforo Emocional",
    category: "Regulacion emocional",
    summary: "Chequeo rapido de estado emocional y eleccion de acciones de regulacion.",
    accent: "cyan",
    focus: "el estado emocional",
    strength: "Hago las cosas bien",
  },
  {
    slug: "termometro-del-curso",
    title: "Termometro del Curso",
    category: "Clima de curso",
    summary: "Chequeo rapido de clima emocional, energia y convivencia del grupo.",
    accent: "cyan",
    focus: "el clima del curso",
    strength: "Soy constructivo",
  },
  {
    slug: "mision-amabilidad",
    title: "Mision Amabilidad",
    category: "Convivencia y buen trato",
    summary: "Retos breves para practicar cuidado, inclusion y buen trato sin materiales.",
    accent: "emerald",
    focus: "la amabilidad",
    strength: "Soy amable",
  },
  {
    slug: "respira-y-responde",
    title: "Respira y Responde",
    category: "Regulacion emocional",
    summary: "Cartas de pausa, respiracion y respuesta respetuosa ante tension.",
    accent: "slate",
    focus: "la pausa antes de responder",
    strength: "Soy respetuoso",
  },
  {
    slug: "circulo-confianza",
    title: "Circulo de Confianza",
    category: "Pertenencia y vinculo",
    summary: "Preguntas para fortalecer seguridad, pertenencia y apoyo entre pares.",
    accent: "violet",
    focus: "la confianza",
    strength: "Soy constructivo",
  },
  {
    slug: "cazadores-fortalezas",
    title: "Cazadores de Fortalezas",
    category: "Fortalezas del caracter",
    summary: "Juego oral para reconocer fortalezas propias y de companeros.",
    accent: "amber",
    focus: "las fortalezas de otros",
    strength: "Soy amable",
  },
  {
    slug: "puente-empatia",
    title: "Puente de Empatia",
    category: "Convivencia y buen trato",
    summary: "Cartas para imaginar perspectivas, escuchar y responder con respeto.",
    accent: "rose",
    focus: "la empatia",
    strength: "Soy respetuoso",
  },
  {
    slug: "desafio-proposito",
    title: "Desafio Proposito",
    category: "Proyecto de vida",
    summary: "Preguntas breves para conectar decisiones, metas y sentido personal.",
    accent: "emerald",
    focus: "el proposito personal",
    strength: "Tengo proposito",
  },
  {
    slug: "minuto-gratitud",
    title: "Minuto de Gratitud",
    category: "Bienestar y autocuidado",
    summary: "Juego rapido para cerrar o iniciar clases mirando lo bueno del dia.",
    accent: "amber",
    focus: "la gratitud",
    strength: "Soy entusiasta",
  },
  {
    slug: "movimiento-regulador",
    title: "Movimiento Regulador",
    category: "Bienestar y autocuidado",
    summary: "Retos corporales simples para activar, bajar tension y volver al presente.",
    accent: "cyan",
    focus: "la regulacion corporal",
    strength: "Hago las cosas bien",
  },
  {
    slug: "decisiones-con-respeto",
    title: "Decisiones con Respeto",
    category: "Convivencia y buen trato",
    summary: "Situaciones orales para elegir respuestas cuidadosas ante conflictos cotidianos.",
    accent: "slate",
    focus: "las decisiones respetuosas",
    strength: "Soy respetuoso",
  },
  {
    slug: "convivencia-digital",
    title: "Convivencia Digital",
    category: "Ciudadania digital",
    summary: "Preguntas para trabajar redes sociales, grupos de chat y cuidado online.",
    accent: "violet",
    focus: "el respeto digital",
    strength: "Hago las cosas bien",
  },
  {
    slug: "mapa-de-redes",
    title: "Mapa de Redes de Apoyo",
    category: "Pertenencia y vinculo",
    summary: "Juego para reconocer personas, lugares y acciones de apoyo.",
    accent: "emerald",
    focus: "las redes de apoyo",
    strength: "Tengo proposito",
  },
  {
    slug: "acuerdos-de-curso",
    title: "Acuerdos de Curso",
    category: "Clima de curso",
    summary: "Cartas para construir normas vivas, claras y cuidadosas.",
    accent: "slate",
    focus: "los acuerdos de convivencia",
    strength: "Soy constructivo",
  },
  {
    slug: "manejo-del-error",
    title: "Manejo del Error",
    category: "Autoconocimiento y aprendizaje",
    summary: "Preguntas para transformar errores en aprendizaje y reparacion.",
    accent: "rose",
    focus: "el error como aprendizaje",
    strength: "Tengo afan de superacion",
  },
  {
    slug: "proyecto-de-vida",
    title: "Proyecto de Vida",
    category: "Proyecto de vida",
    summary: "Desafios para conversar sobre metas, valores, decisiones y futuro.",
    accent: "emerald",
    focus: "las metas de futuro",
    strength: "Tengo proposito",
  },
  {
    slug: "resolucion-conflictos",
    title: "Resolucion de Conflictos",
    category: "Convivencia y buen trato",
    summary: "Situaciones para practicar reparacion, limites y acuerdos.",
    accent: "rose",
    focus: "la resolucion de conflictos",
    strength: "Soy constructivo",
  },
  {
    slug: "autoestima-en-accion",
    title: "Autoestima en Accion",
    category: "Autoconocimiento y aprendizaje",
    summary: "Cartas para reconocer valor personal, avances y voz propia.",
    accent: "amber",
    focus: "la autoestima",
    strength: "Tengo afan de superacion",
  },
  {
    slug: "cuidado-del-cuerpo",
    title: "Cuidado del Cuerpo",
    category: "Bienestar y autocuidado",
    summary: "Preguntas y movimientos para hablar de descanso, energia y autocuidado.",
    accent: "cyan",
    focus: "el cuidado del cuerpo",
    strength: "Hago las cosas bien",
  },
  {
    slug: "pertenencia-e-inclusion",
    title: "Pertenencia e Inclusion",
    category: "Pertenencia y vinculo",
    summary: "Retos para que cada estudiante se sienta visto, invitado y cuidado.",
    accent: "violet",
    focus: "la pertenencia",
    strength: "Soy amable",
  },
];

export const promptGames: PromptGame[] = blueprints.map((game) => ({
  ...game,
  cards: buildCards(game),
}));

export const getPromptGame = (slug: string) => promptGames.find((game) => game.slug === slug);
