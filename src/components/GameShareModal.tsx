"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Mail, MessageCircle, Send, Share2, X } from "lucide-react";
import { createPortal } from "react-dom";

type GameShareModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  path: string;
  description?: string;
};

export function GameShareModal({ open, onClose, title, path, description = "Actividad socioemocional para realizar en compañía." }: GameShareModalProps) {
  const [audience, setAudience] = useState<"familia" | "docente">("familia");
  const [recipient, setRecipient] = useState("");
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const url = typeof window === "undefined" ? path : new URL(path, window.location.origin).toString();
  const greeting = recipient.trim() ? `Hola ${recipient.trim()},` : "Hola,";
  const audienceLine = audience === "familia"
    ? "les comparto esta actividad para realizar en familia, con calma y sin respuestas correctas o incorrectas."
    : "te comparto esta actividad para facilitarla directamente con tu curso o grupo.";
  const message = `${greeting}\n\n${audienceLine}\n\n${title}\n${description}${note.trim() ? `\n\n${note.trim()}` : ""}\n\nAbrir actividad: ${url}`;

  if (!open || typeof document === "undefined") return null;

  const copy = async () => {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  const nativeShare = async () => {
    if (!navigator.share) return copy();
    await navigator.share({ title, text: message.replace(url, ""), url });
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] grid overflow-y-auto bg-slate-950/65 p-4 py-6 backdrop-blur-sm sm:place-items-center" role="dialog" aria-modal="true" aria-labelledby="share-title" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}>
      <section className="my-auto w-full max-w-xl overflow-hidden rounded-[28px] border border-white/20 bg-white shadow-2xl">
        <div className="bg-gradient-to-br from-[#062b67] via-[#08448d] to-[#087f8c] p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold ring-1 ring-white/20"><Send className="h-3.5 w-3.5" /> Enviar actividad</span>
              <h2 id="share-title" className="mt-3 text-2xl font-black tracking-tight">Compartir con propósito</h2>
              <p className="mt-1 text-sm text-blue-100">Preparamos el mensaje y tú eliges el canal.</p>
            </div>
            <button onClick={onClose} aria-label="Cerrar" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20"><X className="h-5 w-5" /></button>
          </div>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Destinatario</p>
            <div className="mt-2 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5">
              {(["familia", "docente"] as const).map((value) => (
                <button key={value} onClick={() => setAudience(value)} className={`rounded-xl px-3 py-2.5 text-sm font-extrabold transition ${audience === value ? "bg-white text-[#073b78] shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>
                  {value === "familia" ? "Familia / apoderado" : "Docente / profesional"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold text-slate-700">Nombre (opcional)<input value={recipient} onChange={(event) => setRecipient(event.target.value)} placeholder="Ej. familia de Martina" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-medium outline-none focus:border-cyan-600" /></label>
            <label className="text-sm font-bold text-slate-700">Nota personal (opcional)<input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Ej. realizar antes del viernes" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-medium outline-none focus:border-cyan-600" /></label>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Vista previa</p>
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">{message}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer")} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-3 text-sm font-bold text-white hover:bg-emerald-700"><MessageCircle className="h-4 w-4" /> WhatsApp</button>
            <button onClick={() => { window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(message)}`; }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#073b78] px-3 py-3 text-sm font-bold text-white hover:bg-[#062e5f]"><Mail className="h-4 w-4" /> Correo</button>
            <button onClick={copy} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">{copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />} {copied ? "Copiado" : "Copiar"}</button>
            <button onClick={nativeShare} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"><Share2 className="h-4 w-4" /> Más</button>
          </div>
          <p className="text-center text-[11px] leading-5 text-slate-500">Tiza Education no almacena nombres, teléfonos ni correos ingresados en esta ventana.</p>
        </div>
      </section>
    </div>,
    document.body,
  );
}
