// src/components/forms/ContactFormB2B.tsx
//
// Form B2B da /empresas (spec §5.9). Destino REAL: Web3Forms (mesmo padrão do
// ContactForm.tsx — funciona em static export e ENTREGA por e-mail). O dado
// NÃO evapora se a aba do wa.me morrer: a pessoa preenche, a gente recebe por
// e-mail, e SÓ DEPOIS aparece o botão opcional "continuar no WhatsApp".
// GA4: form_submit_b2b. Persona: RH/compras em desktop com WhatsApp Web bloqueado.
"use client";

import { useState } from "react";
import { FaPaperPlane, FaWhatsapp } from "react-icons/fa";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/config/whatsapp.config";
import { trackFormSubmitB2b, trackWhatsAppClick } from "@/lib/gtm-utils";

const WEB3FORMS_ACCESS_KEY = "6d317f61-9318-4774-942e-ccca86001983";

const inputClass =
    "w-full rounded-lg border-2 border-white/10 bg-background/80 px-4 py-3 font-body text-base text-foreground placeholder:text-muted-foreground/50 shadow-inner shadow-black/30 focus:border-cyan-400 focus:bg-background focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition-all";

const labelClass = "flex items-center gap-2 label-arcade text-cyan-400 mb-2.5";

const tiposEvento = [
    "SIPAT",
    "Confraternização / fim de ano",
    "Lançamento / ativação de marca",
    "Team building",
    "Treinamento / workshop",
    "Inauguração",
    "Outro",
];

type FormState = "idle" | "sending" | "success" | "error";

export default function ContactFormB2B() {
    const [state, setState] = useState<FormState>("idle");
    const [message, setMessage] = useState<string>("");
    const [waHref, setWaHref] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        setState("sending");

        const formData = new FormData(form);
        formData.append("access_key", WEB3FORMS_ACCESS_KEY);

        const empresa = (formData.get("empresa") as string) || "";
        const tipo = (formData.get("tipoEvento") as string) || "Evento corporativo";
        const pessoas = (formData.get("pessoas") as string) || "";
        const data = (formData.get("dataEvento") as string) || "";

        formData.append(
            "subject",
            `Site — Cotação corporativa${empresa ? ` — ${empresa}` : ""} (${tipo})`
        );
        formData.append("from_name", "Site Aluguel de Games — Empresas");

        // Prefill do WhatsApp opcional pós-envio (o dado já foi entregue por e-mail).
        const linhas = [
            `Olá! Sou da empresa ${empresa || "___"} e acabei de enviar uma cotação pelo site.`,
            `Tipo: ${tipo}`,
            pessoas ? `Pessoas: ${pessoas}` : "Pessoas: ___",
            data ? `Data: ${data}` : "Data: ___",
        ];
        const href = buildWhatsAppUrl("empresas", { message: linhas.join("\n") });

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData,
            });
            const result = await response.json();

            if (result.success) {
                trackFormSubmitB2b({ tipo, pessoas });
                setWaHref(href);
                setState("success");
                setMessage(
                    "Recebido! Sua cotação chegou no nosso e-mail. A gente responde em horário comercial."
                );
                form.reset();
            } else {
                setState("error");
                setMessage(
                    result.message || "Algo deu errado. Tenta de novo em alguns segundos."
                );
            }
        } catch {
            setState("error");
            setMessage("Falha de conexão. Verifica a internet e tenta de novo.");
        }
    };

    // Estado de sucesso: confirmação + botão OPCIONAL de WhatsApp (dado já entregue).
    if (state === "success") {
        return (
            <div
                role="status"
                className="rounded-2xl border-2 border-green-500/50 bg-green-500/10 p-6 md:p-8 text-center"
            >
                <CheckCircle2 className="mx-auto h-10 w-10 text-green-400" />
                <p className="mt-4 font-display text-xl font-bold text-green-400">
                    Cotação enviada!
                </p>
                <p className="mt-2 font-body text-sm text-green-200/90 leading-relaxed">
                    {message}
                </p>
                <p className="mt-4 font-body text-sm text-muted-foreground">
                    Quer adiantar pelo WhatsApp também? (opcional — sua cotação já chegou por
                    e-mail de qualquer jeito)
                </p>
                <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick("empresas", { placement: "pos-form-b2b" })}
                    className="mt-4 inline-flex items-center justify-center gap-2 rounded-md h-11 px-8 text-base font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg shadow-green-500/30 transition-all"
                >
                    <FaWhatsapp className="h-5 w-5" aria-hidden />
                    Continuar no WhatsApp
                </a>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot anti-spam */}
            <input
                type="checkbox"
                name="botcheck"
                className="hidden"
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
            />

            <div className="grid gap-5 md:grid-cols-2">
                <div>
                    <label htmlFor="empresa" className={labelClass}>
                        <span className="h-1 w-4 bg-cyan-400" />
                        <span>Empresa</span>
                        <span className="text-pink-400">*</span>
                    </label>
                    <input
                        id="empresa"
                        name="empresa"
                        type="text"
                        required
                        autoComplete="organization"
                        placeholder="Razão social ou nome fantasia"
                        className={inputClass}
                    />
                </div>
                <div>
                    <label htmlFor="telefone" className={labelClass}>
                        <span className="h-1 w-4 bg-cyan-400" />
                        <span>Telefone / WhatsApp</span>
                        <span className="text-pink-400">*</span>
                    </label>
                    <input
                        id="telefone"
                        name="telefone"
                        type="tel"
                        required
                        autoComplete="tel"
                        placeholder="(11) 9 9999-9999"
                        className={inputClass}
                    />
                </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                <div>
                    <label htmlFor="email" className={labelClass}>
                        <span className="h-1 w-4 bg-cyan-400" />
                        <span>E-mail corporativo</span>
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="voce@empresa.com.br"
                        className={inputClass}
                    />
                </div>
                <div>
                    <label htmlFor="tipoEvento" className={labelClass}>
                        <span className="h-1 w-4 bg-cyan-400" />
                        <span>Tipo de evento</span>
                    </label>
                    <select
                        id="tipoEvento"
                        name="tipoEvento"
                        defaultValue=""
                        className={inputClass + " cursor-pointer"}
                    >
                        <option value="" disabled>
                            Escolha uma opção
                        </option>
                        {tiposEvento.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                <div>
                    <label htmlFor="dataEvento" className={labelClass}>
                        <span className="h-1 w-4 bg-cyan-400" />
                        <span>Data do evento</span>
                    </label>
                    <input
                        id="dataEvento"
                        name="dataEvento"
                        type="date"
                        className={inputClass + " cursor-pointer"}
                    />
                </div>
                <div>
                    <label htmlFor="pessoas" className={labelClass}>
                        <span className="h-1 w-4 bg-cyan-400" />
                        <span>Nº de pessoas</span>
                    </label>
                    <input
                        id="pessoas"
                        name="pessoas"
                        type="text"
                        inputMode="numeric"
                        placeholder="Ex: 150"
                        className={inputClass}
                    />
                </div>
            </div>

            <div>
                <label htmlFor="mensagem" className={labelClass}>
                    <span className="h-1 w-4 bg-cyan-400" />
                    <span>Detalhes (local, objetivo, o que precisa)</span>
                </label>
                <textarea
                    id="mensagem"
                    name="mensagem"
                    rows={4}
                    placeholder="Ex: confraternização de fim de ano no salão da empresa em Alphaville, precisamos de nota fiscal e cadastro de fornecedor."
                    className={inputClass + " resize-none"}
                />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button
                    type="submit"
                    size="lg"
                    disabled={state === "sending"}
                    className="group relative w-full sm:w-auto overflow-hidden bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 font-semibold text-base px-10 py-6 shadow-lg shadow-cyan-500/30 border-2 border-cyan-400/40 disabled:opacity-70"
                >
                    <FaPaperPlane className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    <span>{state === "sending" ? "Enviando..." : "Enviar cotação"}</span>
                </Button>

                <div className="text-center sm:text-left">
                    <p className="label-arcade text-cyan-400/80">★ Vai direto pro nosso e-mail</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Resposta em horário comercial. Sem WhatsApp obrigatório.
                    </p>
                </div>
            </div>

            {state === "error" && (
                <div role="alert" className="flex items-start gap-3 rounded-xl border-2 border-red-500/50 bg-red-500/10 p-4 text-sm">
                    <XCircle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
                    <div>
                        <p className="font-semibold text-red-400">Ops — não conseguimos enviar.</p>
                        <p className="text-red-300/80 mt-0.5">{message}</p>
                    </div>
                </div>
            )}
        </form>
    );
}
