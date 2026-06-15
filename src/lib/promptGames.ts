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
  summary: string;
  accent: "cyan" | "emerald" | "amber" | "rose" | "violet" | "slate";
  cards: PromptGameCard[];
};

const sharedCards = (slug: string, prompts: Array<Omit<PromptGameCard, "id">>): PromptGameCard[] =>
  prompts.map((card, index) => ({ ...card, id: `${slug}-${index + 1}` }));

export const promptGames: PromptGame[] = [
  {
    slug: "termometro-del-curso",
    title: "Termometro del Curso",
    summary: "Chequeo rapido de clima emocional, energia y convivencia del grupo.",
    accent: "cyan",
    cards: sharedCards("termometro", [
      { level: "prebasica", type: "Gesto", prompt: "Muestra con tus manos si tu energia esta pequena, mediana o grande.", support: "El cuerpo puede contar como estamos.", strength: "Soy respetuoso" },
      { level: "primero-segundo", type: "Pregunta", prompt: "Si el curso fuera un clima hoy, cual seria y por que?", support: "Nombrar el clima ayuda a cuidarlo.", strength: "Soy amable" },
      { level: "tercero-cuarto", type: "Conversacion", prompt: "Que necesita el curso para sentirse mas tranquilo durante la clase?", support: "Las necesidades claras se pueden acordar.", strength: "Soy constructivo" },
      { level: "segundo-ciclo", type: "Reflexion", prompt: "Que senal muestra que el grupo esta demasiado acelerado?", support: "Detectar senales evita conflictos.", strength: "Hago las cosas bien" },
      { level: "tercer-ciclo", type: "Dialogo", prompt: "Que practica concreta mejora el clima del curso cuando hay tension?", support: "Las practicas compartidas sostienen convivencia.", strength: "Tengo proposito" },
    ]),
  },
  {
    slug: "mision-amabilidad",
    title: "Mision Amabilidad",
    summary: "Retos breves para practicar cuidado, inclusion y buen trato sin materiales.",
    accent: "emerald",
    cards: sharedCards("amabilidad", [
      { level: "prebasica", type: "Reto oral", prompt: "Di una palabra amable para alguien del grupo.", support: "Las palabras tambien cuidan.", strength: "Soy amable" },
      { level: "primero-segundo", type: "Imaginacion", prompt: "Inventa una forma de invitar a jugar a alguien que esta solo.", support: "Invitar abre puertas.", strength: "Soy amable" },
      { level: "tercero-cuarto", type: "Conversacion", prompt: "Que gesto pequeno puede hacer que alguien se sienta incluido?", support: "La inclusion empieza en acciones simples.", strength: "Soy respetuoso" },
      { level: "segundo-ciclo", type: "Reflexion", prompt: "Como se nota la amabilidad cuando no buscamos aplausos?", support: "El buen trato vale aunque nadie lo mire.", strength: "Tengo proposito" },
      { level: "tercer-ciclo", type: "Dialogo", prompt: "Que limite sano permite ser amable sin dejar de cuidarte?", support: "Amabilidad y autocuidado pueden convivir.", strength: "Hago las cosas bien" },
    ]),
  },
  {
    slug: "respira-y-responde",
    title: "Respira y Responde",
    summary: "Cartas de pausa, respiracion y respuesta respetuosa ante tension.",
    accent: "slate",
    cards: sharedCards("respira", [
      { level: "prebasica", type: "Respiracion", prompt: "Respira como si olieras una flor y soplaras una vela.", support: "Respirar lento baja la velocidad.", strength: "Hago las cosas bien" },
      { level: "primero-segundo", type: "Pausa", prompt: "Cuenta tres dedos antes de responder algo que te molesta.", support: "La pausa ayuda a elegir.", strength: "Soy respetuoso" },
      { level: "tercero-cuarto", type: "Frase", prompt: "Completa: Me molesta cuando..., necesito...", support: "Pedir con claridad evita atacar.", strength: "Soy respetuoso" },
      { level: "segundo-ciclo", type: "Reflexion", prompt: "Que respuesta cuidaria el vinculo aunque estes en desacuerdo?", support: "Responder no es rendirse.", strength: "Soy constructivo" },
      { level: "tercer-ciclo", type: "Dialogo", prompt: "Que cambia cuando respondes desde tus valores y no desde el impulso?", support: "Los valores ordenan la reaccion.", strength: "Tengo proposito" },
    ]),
  },
  {
    slug: "circulo-confianza",
    title: "Circulo de Confianza",
    summary: "Preguntas para fortalecer seguridad, pertenencia y apoyo entre pares.",
    accent: "violet",
    cards: sharedCards("confianza", [
      { level: "prebasica", type: "Pregunta", prompt: "Quien te ayuda a sentirte seguro en el colegio?", support: "Recordar apoyos da calma.", strength: "Soy amable" },
      { level: "primero-segundo", type: "Conversacion", prompt: "Que hace un buen companero cuando alguien se equivoca?", support: "El error se acompana con respeto.", strength: "Soy respetuoso" },
      { level: "tercero-cuarto", type: "Reflexion", prompt: "Que necesita pasar para confiar mas en un grupo?", support: "La confianza crece con acciones repetidas.", strength: "Soy constructivo" },
      { level: "segundo-ciclo", type: "Dialogo", prompt: "Que acuerdo ayudaria a hablar sin miedo a burlas?", support: "Los acuerdos protegen la participacion.", strength: "Hago las cosas bien" },
      { level: "tercer-ciclo", type: "Pregunta", prompt: "Como se repara la confianza cuando se dano un vinculo?", support: "Reparar requiere responsabilidad y tiempo.", strength: "Tengo afan de superacion" },
    ]),
  },
  {
    slug: "cazadores-fortalezas",
    title: "Cazadores de Fortalezas",
    summary: "Juego oral para reconocer fortalezas propias y de companeros.",
    accent: "amber",
    cards: sharedCards("fortalezas", [
      { level: "prebasica", type: "Reconocimiento", prompt: "Nombra algo que haces bien con tu cuerpo, tu voz o tu ayuda.", support: "Todos tienen algo valioso.", strength: "Hago las cosas bien" },
      { level: "primero-segundo", type: "Pregunta", prompt: "Que fortaleza viste hoy en alguien del curso?", support: "Mirar lo bueno lo hace crecer.", strength: "Soy amable" },
      { level: "tercero-cuarto", type: "Reto oral", prompt: "Di una fortaleza tuya y cuando la usas.", support: "Reconocer fortalezas da confianza.", strength: "Tengo afan de superacion" },
      { level: "segundo-ciclo", type: "Dialogo", prompt: "Que fortaleza necesita mas el curso esta semana?", support: "Las fortalezas tambien son colectivas.", strength: "Soy constructivo" },
      { level: "tercer-ciclo", type: "Reflexion", prompt: "Que fortaleza tuya se nota poco, pero te ayuda mucho?", support: "Lo invisible tambien sostiene.", strength: "Tengo proposito" },
    ]),
  },
  {
    slug: "puente-empatia",
    title: "Puente de Empatia",
    summary: "Cartas para imaginar perspectivas, escuchar y responder con respeto.",
    accent: "rose",
    cards: sharedCards("empatia", [
      { level: "prebasica", type: "Imaginacion", prompt: "Como se siente alguien cuando no lo escuchan?", support: "Imaginar ayuda a cuidar.", strength: "Soy respetuoso" },
      { level: "primero-segundo", type: "Pregunta", prompt: "Que puedes preguntar antes de enojarte con alguien?", support: "Preguntar evita suponer.", strength: "Soy amable" },
      { level: "tercero-cuarto", type: "Conversacion", prompt: "Cuenta una forma de mostrar que estas escuchando.", support: "Escuchar tambien se ve.", strength: "Soy respetuoso" },
      { level: "segundo-ciclo", type: "Dialogo", prompt: "Que frase ayuda a validar una emocion sin estar de acuerdo con la conducta?", support: "Validar no es aprobar todo.", strength: "Soy constructivo" },
      { level: "tercer-ciclo", type: "Reflexion", prompt: "Que te cuesta comprender de otros y como podrias acercarte mejor?", support: "La empatia se practica con curiosidad.", strength: "Tengo afan de superacion" },
    ]),
  },
  {
    slug: "desafio-proposito",
    title: "Desafio Proposito",
    summary: "Preguntas breves para conectar decisiones, metas y sentido personal.",
    accent: "emerald",
    cards: sharedCards("proposito", [
      { level: "prebasica", type: "Pregunta", prompt: "Que quieres aprender a hacer mejor?", support: "Querer mejorar ya es un comienzo.", strength: "Tengo afan de superacion" },
      { level: "primero-segundo", type: "Reto oral", prompt: "Di una meta pequena para hoy.", support: "Las metas pequenas son posibles.", strength: "Tengo proposito" },
      { level: "tercero-cuarto", type: "Reflexion", prompt: "Que decision pequena te acercaria a una semana mejor?", support: "Elegir tambien construye camino.", strength: "Hago las cosas bien" },
      { level: "segundo-ciclo", type: "Dialogo", prompt: "Que habito te acerca a la persona que quieres ser?", support: "El proposito se ve en habitos.", strength: "Tengo proposito" },
      { level: "tercer-ciclo", type: "Pregunta", prompt: "Que motivacion propia quieres proteger de la presion externa?", support: "La motivacion interna sostiene procesos.", strength: "Tengo proposito" },
    ]),
  },
  {
    slug: "minuto-gratitud",
    title: "Minuto de Gratitud",
    summary: "Juego rapido para cerrar o iniciar clases mirando lo bueno del dia.",
    accent: "amber",
    cards: sharedCards("gratitud", [
      { level: "prebasica", type: "Gesto", prompt: "Muestra con un gesto algo por lo que das gracias.", support: "Agradecer tambien puede ser corporal.", strength: "Soy amable" },
      { level: "primero-segundo", type: "Pregunta", prompt: "Nombra una cosa buena que paso hoy.", support: "Lo bueno pequeno tambien cuenta.", strength: "Soy entusiasta" },
      { level: "tercero-cuarto", type: "Reconocimiento", prompt: "Agradece una ayuda que viste en el curso.", support: "Reconocer ayuda fortalece el grupo.", strength: "Soy amable" },
      { level: "segundo-ciclo", type: "Reflexion", prompt: "Que cosa dificil te enseno algo util?", support: "La gratitud no niega lo dificil.", strength: "Tengo afan de superacion" },
      { level: "tercer-ciclo", type: "Dialogo", prompt: "Que privilegio cotidiano quieres valorar mas?", support: "Valorar cambia la forma de mirar.", strength: "Tengo proposito" },
    ]),
  },
  {
    slug: "movimiento-regulador",
    title: "Movimiento Regulador",
    summary: "Retos corporales simples para activar, bajar tension y volver al presente.",
    accent: "cyan",
    cards: sharedCards("movimiento", [
      { level: "prebasica", type: "Movimiento", prompt: "Estira brazos como sol y encoge como semilla, tres veces.", support: "Moverse ayuda a ordenar energia.", strength: "Soy entusiasta" },
      { level: "primero-segundo", type: "Pausa activa", prompt: "Camina en el lugar lento, como robot tranquilo.", support: "La lentitud ayuda a regular.", strength: "Hago las cosas bien" },
      { level: "tercero-cuarto", type: "Movimiento", prompt: "Aprieta hombros, suelta y nota la diferencia.", support: "Soltar tension libera atencion.", strength: "Tengo afan de superacion" },
      { level: "segundo-ciclo", type: "Cuerpo", prompt: "Haz una postura de calma y explica que cambia en tu cuerpo.", support: "La postura influye en la emocion.", strength: "Hago las cosas bien" },
      { level: "tercer-ciclo", type: "Regulacion", prompt: "Elige un movimiento discreto que puedas usar antes de una prueba.", support: "Regularse tambien puede ser silencioso.", strength: "Tengo proposito" },
    ]),
  },
  {
    slug: "decisiones-con-respeto",
    title: "Decisiones con Respeto",
    summary: "Situaciones orales para elegir respuestas cuidadosas ante conflictos cotidianos.",
    accent: "slate",
    cards: sharedCards("decisiones", [
      { level: "prebasica", type: "Pregunta", prompt: "Que haces si alguien toma tu turno?", support: "Podemos pedir sin gritar.", strength: "Soy respetuoso" },
      { level: "primero-segundo", type: "Situacion", prompt: "Alguien se burla de un error. Que respuesta ayuda?", support: "Cuidar el error cuida al grupo.", strength: "Soy constructivo" },
      { level: "tercero-cuarto", type: "Dialogo", prompt: "Que frase usas para decir no con respeto?", support: "Decir no tambien puede cuidar.", strength: "Soy respetuoso" },
      { level: "segundo-ciclo", type: "Reflexion", prompt: "Que decision corta un rumor sin dejar a alguien solo?", support: "La convivencia necesita valentia.", strength: "Hago las cosas bien" },
      { level: "tercer-ciclo", type: "Debate breve", prompt: "Como actuar con respeto cuando el grupo presiona para hacer algo injusto?", support: "La autonomia se practica en grupo.", strength: "Tengo proposito" },
    ]),
  },
];

export const getPromptGame = (slug: string) => promptGames.find((game) => game.slug === slug);
