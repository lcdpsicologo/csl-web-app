export type EscaleraPrompt = {
  id: string;
  prompt: string;
  category: "Reconocer" | "Expresar" | "Regular" | "Vincular";
  strength: string;
};

const prompt = (
  id: string,
  text: string,
  category: EscaleraPrompt["category"],
  strength: string,
): EscaleraPrompt => ({ id, prompt: text, category, strength });

// Consignas transcritas y normalizadas desde el manual para familias.
export const escaleraPrompts: EscaleraPrompt[] = [
  prompt("miedo-ocasiones", "Nombra dos ocasiones en que hayas sentido miedo.", "Reconocer", "Soy correcto"),
  prompt("calma-molestia", "¿Cómo te calmas cuando estás muy molesto o molesta?", "Regular", "Hago las cosas bien"),
  prompt("actividad-calma", "Nombra una actividad que te haga sentir tranquilo o tranquila.", "Regular", "Tengo propósito"),
  prompt("cuando-no-resulta", "Cuando algo no te resulta, ¿cómo te sientes y qué sientes en tu cuerpo?", "Reconocer", "Tengo afán de superación"),
  prompt("parecidas-alegria", "Nombra dos emociones que se parezcan a la alegría.", "Reconocer", "Soy entusiasta"),
  prompt("cuando-enojado", "Cuando estás enojado o enojada, ¿qué haces?", "Regular", "Hago las cosas bien"),
  prompt("trato-triste", "¿Cómo te gusta que te traten cuando estás triste?", "Vincular", "Soy respetuoso"),
  prompt("confianza", "Nombra a una persona que te hace sentir confianza y explica por qué.", "Vincular", "Soy respetuoso"),
  prompt("cara-orgullo", "Pon cara de orgullo y pide al resto que adivine qué emoción es.", "Expresar", "Soy entusiasta"),
  prompt("admiracion", "Nombra a una persona que te hace sentir admiración.", "Vincular", "Soy amable"),
  prompt("cuerpo-alegria", "¿Qué sientes en tu cuerpo cuando estás alegre?", "Reconocer", "Soy entusiasta"),
  prompt("situacion-divertida", "Nombra una situación que te divierta.", "Expresar", "Soy entusiasta"),
  prompt("cuerpo-frustracion", "¿Qué sientes en tu cuerpo cuando estás frustrado o frustrada?", "Reconocer", "Tengo afán de superación"),
  prompt("envidia", "Nombra una situación en la que hayas sentido envidia.", "Reconocer", "Soy correcto"),
  prompt("cuerpo-tranquilidad", "¿Qué sientes en tu cuerpo cuando estás tranquilo o tranquila?", "Reconocer", "Tengo propósito"),
  prompt("verguenza", "Nombra algo que te da mucha vergüenza hacer.", "Expresar", "Tengo afán de superación"),
  prompt("cuerpo-estres", "¿Qué sientes en tu cuerpo cuando estás estresado o estresada?", "Reconocer", "Hago las cosas bien"),
  prompt("calma-estres", "¿Cómo te calmas cuando estás muy estresado o estresada?", "Regular", "Hago las cosas bien"),
  prompt("aburrimiento", "Nombra una situación que te haga sentir aburrimiento.", "Reconocer", "Tengo propósito"),
  prompt("que-haces-aburrido", "¿Qué haces cuando te sientes aburrido o aburrida?", "Regular", "Tengo propósito"),
  prompt("tristeza-otro", "Nombra una situación que haya hecho sentir tristeza a alguien que conoces.", "Vincular", "Soy amable"),
  prompt("acompanar-tristeza", "¿Qué sueles hacer cuando alguien está triste?", "Vincular", "Soy amable"),
  prompt("enojo-otro", "Nombra una situación que haya hecho sentir enojo a alguien que conoces.", "Vincular", "Soy respetuoso"),
  prompt("acompanar-enojo", "¿Qué sueles hacer cuando alguien está enojado o enojada?", "Vincular", "Soy respetuoso"),
  prompt("orgullo-dos", "Nombra dos cosas que te hagan sentir orgullo.", "Expresar", "Tengo afán de superación"),
  prompt("mostrar-orgullo", "¿Qué sueles hacer cuando sientes orgullo?", "Expresar", "Soy entusiasta"),
  prompt("motivacion-dos", "Nombra dos cosas que te hagan sentir motivación.", "Expresar", "Tengo propósito"),
  prompt("mostrar-motivacion", "¿Cómo demuestras que estás motivado o motivada?", "Expresar", "Tengo propósito"),
  prompt("demostrar-carino", "¿Cómo demuestras cariño y amor hacia otras personas?", "Vincular", "Soy amable"),
  prompt("calma-otro", "Nombra dos situaciones que hagan sentir calma y relajo a alguien que conoces.", "Vincular", "Soy constructivo"),
  prompt("orgullo-propio", "¿Qué cosas de ti te hacen sentir orgulloso u orgullosa?", "Expresar", "Tengo afán de superación"),
  prompt("afortunado", "Nombra una situación en la que te hayas sentido muy afortunado o afortunada.", "Expresar", "Soy entusiasta"),
];

export const familyConversationGuide = [
  {
    title: "Primero conecta",
    text: "Antes de buscar una solución, pregúntate qué puede estar sintiendo y necesitando tu hijo o hija.",
  },
  {
    title: "Pregunta, no supongas",
    text: "Ayúdale a identificar la emoción con preguntas abiertas sobre su cuerpo, el momento y situaciones parecidas.",
  },
  {
    title: "Valida todas las emociones",
    text: "Sentir enojo, miedo o tristeza es válido. El límite está en cómo expresamos la emoción sin pasar a llevar a otros.",
  },
  {
    title: "Escucha sin juzgar",
    text: "Evita frases como “no deberías sentirte así”. Acoge, valida y luego acompaña a buscar soluciones.",
  },
];

export const ladderMoves: Record<number, number> = {
  5: 58,
  14: 49,
  53: 72,
  64: 83,
};

export const slideMoves: Record<number, number> = {
  38: 20,
  51: 11,
  75: 54,
  91: 73,
  97: 61,
};
