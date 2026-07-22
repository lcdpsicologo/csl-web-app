// Shared helper for calling Google Gemini with retry + model fallback chain.
// Gemini free tier is unreliable for any single model — retry on 503/429/timeout
// and fall back through several free models before giving up.

export const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const FALLBACK_CHAIN = [
  DEFAULT_GEMINI_MODEL,
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
];

export type GeminiResult =
  | { ok: true; data: unknown; raw: string; usedModel: string; usage?: unknown }
  | { ok: false; status: number; message: string };

const SAFETY = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
];

export async function callGemini({
  systemPrompt,
  userPrompt,
  inlineParts = [],
  apiKey,
  maxOutputTokens = 4096,
  perAttemptTimeoutMs = 25_000,
}: {
  systemPrompt: string;
  userPrompt: string;
  inlineParts?: Array<{ inline_data: { mime_type: string; data: string } }>;
  apiKey: string;
  maxOutputTokens?: number;
  perAttemptTimeoutMs?: number;
}): Promise<GeminiResult> {
  const chain = FALLBACK_CHAIN.filter((m, i, arr) => arr.indexOf(m) === i);

  const body = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: "user", parts: [{ text: userPrompt }, ...inlineParts] }],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
      maxOutputTokens,
      thinkingConfig: { thinkingBudget: 0 },
    },
    safetySettings: SAFETY,
  };

  let lastStatus = 0;
  let lastMsg = "";

  for (const candidate of chain) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      if (attempt > 0) {
        await new Promise((r) => setTimeout(r, 800 * 2 ** (attempt - 1)));
      }
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${candidate}:generateContent?key=${apiKey}`;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), perAttemptTimeoutMs);
      let res: Response;
      try {
        res = await fetch(url, {
          method: "POST",
          signal: controller.signal,
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        });
      } catch (err) {
        clearTimeout(timer);
        if (err instanceof Error && err.name === "AbortError") {
          lastStatus = 504;
          lastMsg = `Timeout en ${candidate}`;
          continue;
        }
        lastStatus = 500;
        lastMsg = err instanceof Error ? err.message : String(err);
        continue;
      }
      clearTimeout(timer);

      if (res.status === 503 || res.status === 429 || res.status === 500) {
        const txt = await res.text().catch(() => "");
        lastStatus = res.status;
        lastMsg = txt.slice(0, 240);
        continue;
      }

      if (!res.ok) {
        const errText = await res.text();
        let msg = errText;
        try {
          const parsedErr = JSON.parse(errText);
          msg = parsedErr?.error?.message || errText;
        } catch {
          // keep raw
        }
        return { ok: false, status: res.status, message: `${candidate}: ${msg}` };
      }

      const json = (await res.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
        usageMetadata?: unknown;
      };
      const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (!text) {
        lastStatus = 502;
        lastMsg = `Sin contenido en ${candidate}`;
        continue;
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch {
        const m = text.match(/\{[\s\S]*\}/);
        if (!m) {
          lastStatus = 502;
          lastMsg = `JSON inválido en ${candidate}`;
          continue;
        }
        try {
          parsed = JSON.parse(m[0]);
        } catch {
          lastStatus = 502;
          lastMsg = `JSON inválido en ${candidate}`;
          continue;
        }
      }

      return {
        ok: true,
        data: parsed,
        raw: text,
        usedModel: candidate,
        usage: json?.usageMetadata,
      };
    }
  }

  return {
    ok: false,
    status: 503,
    message: `Todos los modelos de Gemini gratis fallaron. Último: ${lastStatus} ${lastMsg}`,
  };
}

// Shared auth helper for AI routes.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const normalizeSupabaseUrl = (url: string) =>
  url.replace(/\/(rest|auth)\/v1\/?$/, "").replace(/\/$/, "");

export const getAuthClient = () => {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!rawUrl || !key) return null;
  return createClient(normalizeSupabaseUrl(rawUrl), key, {
    auth: { persistSession: false },
  });
};

export const authenticateRequest = async (request: Request, supabase: SupabaseClient) => {
  const header = request.headers.get("authorization") || "";
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return { error: NextResponse.json({ error: "Missing bearer token" }, { status: 401 }) } as const;
  }
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return { error: NextResponse.json({ error: "Invalid session" }, { status: 401 }) } as const;
  }
  return { user: data.user } as const;
};

export const getGeminiKey = () => process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
