import { NextResponse } from "next/server";
import { authenticateRequest, callGemini, getAuthClient, getGeminiKey } from "@/lib/gemini";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 8 * 1024 * 1024;
const CATEGORIES = new Set([1, 4, 8]);

type ExistingReward = {
  id: string;
  name: string;
  ticketCost: number;
};

type ProposedItem = {
  name?: unknown;
  description?: unknown;
  quantity?: unknown;
  ticketCost?: unknown;
  minimumStock?: unknown;
  existingRewardId?: unknown;
  confidence?: unknown;
};

const cleanInteger = (value: unknown, fallback: number, min: number, max: number) => {
  const number = Math.floor(Number(value));
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
};

export async function POST(request: Request) {
  const authClient = getAuthClient();
  if (!authClient) return NextResponse.json({ error: "Supabase no está configurado" }, { status: 503 });

  const auth = await authenticateRequest(request, authClient);
  if ("error" in auth) return auth.error;

  const apiKey = getGeminiKey();
  if (!apiKey) return NextResponse.json({ error: "El análisis con IA no está configurado" }, { status: 503 });

  try {
    const formData = await request.formData();
    const image = formData.get("image");
    if (!(image instanceof File)) {
      return NextResponse.json({ error: "Debes adjuntar una foto" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(image.type) || image.size > MAX_BYTES) {
      return NextResponse.json({ error: "Usa una imagen JPG, PNG o WebP de hasta 8 MB" }, { status: 400 });
    }

    const category = Number(formData.get("category"));
    if (!CATEGORIES.has(category)) {
      return NextResponse.json({ error: "Selecciona una categoría válida" }, { status: 400 });
    }

    let existingRewards: ExistingReward[] = [];
    try {
      const parsed = JSON.parse(String(formData.get("existingRewards") || "[]"));
      if (Array.isArray(parsed)) {
        existingRewards = parsed.slice(0, 200).flatMap((item) => {
          const reward = item as Partial<ExistingReward>;
          const id = String(reward.id || "").slice(0, 100);
          const name = String(reward.name || "").trim().slice(0, 100);
          const ticketCost = Number(reward.ticketCost);
          return id && name && ticketCost === category ? [{ id, name, ticketCost }] : [];
        });
      }
    } catch {
      existingRewards = [];
    }

    const base64 = Buffer.from(await image.arrayBuffer()).toString("base64");
    const result = await callGemini({
      apiKey,
      maxOutputTokens: 4096,
      perAttemptTimeoutMs: 35_000,
      systemPrompt: `Eres una encargada experta en inventarios escolares. Analiza fotografías de premios para niñas y niños de Prekínder a 1° Básico. Identifica solamente objetos físicos claramente visibles que puedan guardarse como premios, agrupa objetos iguales y cuenta sus unidades visibles. Si una bolsa o caja cerrada no permite ver su contenido, cuéntala como una sola unidad. No inventes objetos ocultos ni cantidades. La categoría ya fue escogida por la persona y no debes evaluarla ni cambiarla. Compara cada grupo con el catálogo de esa categoría y asigna existingRewardId únicamente cuando sea el mismo tipo de premio; ante la duda, déjalo vacío. Responde exclusivamente JSON con esta forma: {"items":[{"name":"nombre breve en español","description":"descripción breve","quantity":1,"minimumStock":3,"existingRewardId":"o vacío","confidence":0.9}],"notes":"observación breve sobre el conteo"}.`,
      userPrompt: `Categoría seleccionada: ${category} ${category === 1 ? "ticket" : "tickets"}.\nCatálogo actual de esta categoría:\n${JSON.stringify(existingRewards)}\n\nAnaliza la foto. Devuelve como máximo 20 grupos. La cantidad debe representar unidades visibles, no una estimación del contenido oculto.`,
      inlineParts: [{ inline_data: { mime_type: image.type, data: base64 } }],
    });

    if (!result.ok) {
      return NextResponse.json({ error: "La IA no pudo analizar la foto. Intenta nuevamente con más luz." }, { status: result.status });
    }

    const payload = (result.data || {}) as { items?: ProposedItem[]; notes?: unknown };
    const validRewardIds = new Set(existingRewards.map((reward) => reward.id));
    const items = Array.isArray(payload.items) ? payload.items.slice(0, 20).flatMap((raw) => {
      const name = String(raw.name || "").trim().slice(0, 100);
      if (!name) return [];
      const existingRewardId = String(raw.existingRewardId || "");
      return [{
        name,
        description: String(raw.description || "").trim().slice(0, 300),
        quantity: cleanInteger(raw.quantity, 1, 1, 999),
        ticketCost: category as 1 | 4 | 8,
        minimumStock: cleanInteger(raw.minimumStock, 3, 0, 999),
        existingRewardId: validRewardIds.has(existingRewardId) ? existingRewardId : "",
        confidence: Math.min(1, Math.max(0, Number(raw.confidence) || 0)),
      }];
    }) : [];

    return NextResponse.json({
      items,
      notes: String(payload.notes || "Revisa las cantidades antes de guardar.").trim().slice(0, 500),
    });
  } catch (error) {
    console.error("Attendance cart image analysis failed", error);
    return NextResponse.json({ error: "No se pudo procesar la foto" }, { status: 500 });
  }
}
