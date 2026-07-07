// src/components/home/QuoteWidget.tsx
//
// D4 — "Monte sua festa e mande em 1 mensagem" (spec §3). Chips multi-select de
// itens populares → data (obrigatória) + bairro + convidados (opcionais) →
// CTA verde que abre o WhatsApp com mensagem multi-linha montada.
//
// Progressive enhancement: o CTA é um <a> real cujo href JÁ vem preenchido do
// server com o prefill base — sem JS, ainda abre o WhatsApp com as lacunas
// (spec §3 D4). Com JS, o href é reescrito com as escolhas da pessoa.
// NÃO promete "orçamento em 30s" (crítica da persona mãe) — promete 1 mensagem.
"use client";

import { useMemo, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { buildWhatsAppUrl } from "@/config/whatsapp.config";
import { trackWhatsAppClick, trackEvent } from "@/lib/gtm-utils";

const ITENS = [
    "Fliperama",
    "Videokê / Karaokê",
    "Pinball",
    "Realidade Virtual",
    "Máquina de dança",
    "Máquina do bichinho",
    "PlayStation 5",
    "Air game / Pebolim",
    "Simulador de corrida",
] as const;

function buildMessage(opts: {
    itens: string[];
    data: string;
    bairro: string;
    convidados: string;
}) {
    const itensLinha = opts.itens.length ? opts.itens.join(", ") : "me ajuda a escolher";
    return [
        "Oi! Quero um orçamento pra minha festa 🎉",
        `Itens: ${itensLinha}`,
        `Data: ${opts.data.trim() || "___"}`,
        `Bairro/cidade: ${opts.bairro.trim() || "___"}`,
        `Convidados: ${opts.convidados.trim() || "___"}`,
    ].join("\n");
}

export function QuoteWidget() {
    const [selected, setSelected] = useState<string[]>([]);
    const [data, setData] = useState("");
    const [bairro, setBairro] = useState("");
    const [convidados, setConvidados] = useState("");

    const toggle = (item: string) => {
        setSelected((prev) => {
            const has = prev.includes(item);
            if (!has) trackEvent("orcamento_add", { item });
            return has ? prev.filter((i) => i !== item) : [...prev, item];
        });
    };

    const href = useMemo(
        () => buildWhatsAppUrl("orcamento", { message: buildMessage({ itens: selected, data, bairro, convidados }) }),
        [selected, data, bairro, convidados]
    );

    const handleSend = () => {
        trackWhatsAppClick("orcamento", { itens: selected.length });
        trackEvent("orcamento_send", { itens: selected.length, data: Boolean(data.trim()) });
    };

    return (
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 md:p-8">
            {/* chips */}
            <fieldset>
                <legend className="label-arcade mb-3 text-pink-400">▸ Escolha os itens</legend>
                <div className="flex flex-wrap gap-2">
                    {ITENS.map((item) => {
                        const active = selected.includes(item);
                        return (
                            <button
                                key={item}
                                type="button"
                                onClick={() => toggle(item)}
                                aria-pressed={active}
                                className={
                                    "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors " +
                                    (active
                                        ? "border-cyan-400/70 bg-cyan-400/15 text-cyan-200"
                                        : "border-border bg-transparent text-muted-foreground hover:border-cyan-400/40 hover:text-foreground")
                                }
                            >
                                {active ? "✓ " : ""}
                                {item}
                            </button>
                        );
                    })}
                </div>
            </fieldset>

            {/* campos */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-foreground">
                        Data <span className="text-pink-400">*</span>
                    </span>
                    <input
                        type="date"
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        className="h-11 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-cyan-400/60"
                    />
                </label>
                <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-foreground">Bairro / cidade</span>
                    <input
                        type="text"
                        inputMode="text"
                        placeholder="ex.: Osasco"
                        value={bairro}
                        onChange={(e) => setBairro(e.target.value)}
                        className="h-11 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-cyan-400/60"
                    />
                </label>
                <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-foreground">Convidados</span>
                    <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        placeholder="ex.: 40"
                        value={convidados}
                        onChange={(e) => setConvidados(e.target.value)}
                        className="h-11 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-cyan-400/60"
                    />
                </label>
            </div>

            {/* CTA — <a> real, href preenchido do server (degrada sem JS) */}
            <div className="mt-6 flex flex-col gap-2">
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleSend}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-green-600 to-green-700 px-8 text-base font-semibold text-white shadow-lg shadow-green-500/30 transition-all hover:from-green-700 hover:to-green-800 hover:shadow-green-500/40 sm:w-auto sm:self-start"
                >
                    <FaWhatsapp className="h-5 w-5" aria-hidden />
                    Enviar no WhatsApp
                </a>
                <p className="font-body text-xs text-muted-foreground">
                    Manda mesmo sem preencher tudo — a gente completa no papo.
                </p>
            </div>
        </div>
    );
}

export default QuoteWidget;
