// src/components/forms/B2BContactForm.tsx
//
// Form corporativo (SPEC-FINAL-V2 §5 gate e / brief 1.2).
// - Destino REAL via Web3Forms (mesmo padrão de ContactForm.tsx — entrega por
//   e-mail em static export; zero backend).
// - Telefone OBRIGATÓRIO (gate 1.2); e-mail corporativo obrigatório (o RH usa
//   e-mail). Empresa + porte pra qualificar o lead.
// - Pós-envio o dado NÃO evapora: além do e-mail que já saiu, oferece wa.me
//   pré-preenchido como OPÇÃO (não substitui o envio).
// - GA4: form_submit_b2b{porte}.
"use client";

import { useState } from "react";
import { FaPaperPlane, FaWhatsapp } from "react-icons/fa";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WHATSAPP_CONFIG } from "@/config/whatsapp.config";
import { trackFormSubmitB2B } from "@/lib/gtm-utils";

const WEB3FORMS_ACCESS_KEY = "6d317f61-9318-4774-942e-ccca86001983";

const tiposEvento = [
    "SIPAT / SST",
    "Confraternização de fim de ano",
    "Lançamento de produto",
    "Team building / integração",
    "Inauguração / ativação de marca",
    "Outro",
];

const portes = [
    "Até 50 pessoas",
    "50 a 150 pessoas",
    "151 a 250 pessoas",
    "250 a 400 pessoas",
    "400+ pessoas",
];

const inputClass =
    "w-full rounded-lg border-2 border-white/10 bg-background/80 px-4 py-3 font-body text-base text-foreground placeholder:text-muted-foreground/50 shadow-inner shadow-black/30 focus:border-blue-400 focus:bg-background focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all";

const labelClass = "flex items-center gap-2 label-arcade text-cyan-400 mb-2.5";

type FormState = "idle" | "sending" | "success" | "error";

export default function B2BContactForm() {
    const [state, setState] = useState<FormState>("idle");
    const [message, setMessage] = useState<string>("");
    const [waHref, setWaHref] = useState<string>(WHATSAPP_CONFIG.link);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        setState("sending");

        const formData = new FormData(form);
        formData.append("access_key", WEB3FORMS_ACCESS_KEY);

        const empresa = (formData.get("empresa") as string) || "";
        const tipo = (formData.get("tipoEvento") as string) || "Evento corporativo";
        const porte = (formData.get("porte") as string) || "";
        const data = (formData.get("dataEvento") as string) || "";
        const cidade = (formData.get("cidade") as string) || "";

        formData.append("subject", `Site B2B — ${empresa || "Empresa"} — ${tipo}`);
        formData.append("from_name", "Site Aluguel de Games (Empresas)");

        // Prefill de WhatsApp com o que a pessoa preencheu (opção pós-envio).
        const waMsg =
            `Olá! Sou da empresa ${empresa || "___"} e quero um orçamento pra evento corporativo.\n` +
            `Tipo: ${tipo}\n` +
            `Pessoas: ${porte || "___"}\n` +
            `Data: ${data || "___"}\n` +
            `Cidade: ${cidade || "___"}`;
        setWaHref(`${WHATSAPP_CONFIG.link}?text=${encodeURIComponent(waMsg)}`);

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData,
            });
            const result = await response.json();
            if (result.success) {
                setState("success");
                setMessage("Recebido! A gente responde no seu e-mail em horário comercial.");
                trackFormSubmitB2B(porte || undefined);
                form.reset();
            } else {
                setState("error");
                setMessage(result.message || "Algo deu errado. Tenta de novo em alguns segundos.");
            }
        } catch {
            setState("error");
            setMessage("Falha de conexão. Verifica a internet e tenta de novo.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot anti-spam */}
            <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

            <div className="grid gap-5 md:grid-cols-2">
                <div>
                    <label htmlFor="empresa" className={labelClass}>
                        <span className="h-1 w-4 bg-cyan-400" /> <span>Empresa</span> <span className="text-pink-400">*</span>
                    </label>
                    <input id="empresa" name="empresa" type="text" required autoComplete="organization" placeholder="Nome da empresa" className={inputClass} />
                </div>
                <div>
                    <label htmlFor="responsavel" className={labelClass}>
                        <span className="h-1 w-4 bg-cyan-400" /> <span>Responsável</span> <span className="text-pink-400">*</span>
                    </label>
                    <input id="responsavel" name="responsavel" type="text" required autoComplete="name" placeholder="Quem está pedindo" className={inputClass} />
                </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                <div>
                    <label htmlFor="email" className={labelClass}>
                        <span className="h-1 w-4 bg-cyan-400" /> <span>E-mail corporativo</span> <span className="text-pink-400">*</span>
                    </label>
                    <input id="email" name="email" type="email" required autoComplete="email" placeholder="voce@empresa.com.br" className={inputClass} />
                </div>
                <div>
                    <label htmlFor="telefone" className={labelClass}>
                        <span className="h-1 w-4 bg-cyan-400" /> <span>Telefone / WhatsApp</span> <span className="text-pink-400">*</span>
                    </label>
                    <input id="telefone" name="telefone" type="tel" required autoComplete="tel" placeholder="(11) 9 9999-9999" className={inputClass} />
                </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                <div>
                    <label htmlFor="tipoEvento" className={labelClass.replace("text-cyan-400", "text-purple-400")}>
                        <span className="h-1 w-4 bg-purple-400" /> <span>Tipo de evento</span>
                    </label>
                    <select id="tipoEvento" name="tipoEvento" defaultValue="" className={inputClass + " cursor-pointer"}>
                        <option value="" disabled>Escolha uma opção</option>
                        {tiposEvento.map((t) => (<option key={t} value={t}>{t}</option>))}
                    </select>
                </div>
                <div>
                    <label htmlFor="porte" className={labelClass.replace("text-cyan-400", "text-purple-400")}>
                        <span className="h-1 w-4 bg-purple-400" /> <span>Nº de participantes</span>
                    </label>
                    <select id="porte" name="porte" defaultValue="" className={inputClass + " cursor-pointer"}>
                        <option value="" disabled>Escolha uma faixa</option>
                        {portes.map((p) => (<option key={p} value={p}>{p}</option>))}
                    </select>
                </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                <div>
                    <label htmlFor="dataEvento" className={labelClass.replace("text-cyan-400", "text-purple-400")}>
                        <span className="h-1 w-4 bg-purple-400" /> <span>Data prevista</span>
                    </label>
                    <input id="dataEvento" name="dataEvento" type="date" className={inputClass + " cursor-pointer"} />
                </div>
                <div>
                    <label htmlFor="cidade" className={labelClass.replace("text-cyan-400", "text-purple-400")}>
                        <span className="h-1 w-4 bg-purple-400" /> <span>Cidade do evento</span>
                    </label>
                    <input id="cidade" name="cidade" type="text" placeholder="Ex: São Paulo / Alphaville" className={inputClass} />
                </div>
            </div>

            <div>
                <label htmlFor="mensagem" className={labelClass.replace("text-cyan-400", "text-purple-400")}>
                    <span className="h-1 w-4 bg-purple-400" /> <span>Detalhes (opcional)</span>
                </label>
                <textarea id="mensagem" name="mensagem" rows={4} placeholder="Local, horário, se precisa de NF/fatura, prazo de faturamento, homologação de fornecedor..." className={inputClass + " resize-none"} />
            </div>

            <div className="flex items-center gap-4 pt-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
                <span className="label-arcade text-muted-foreground/60">▸ enviar</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button
                    type="submit"
                    size="lg"
                    disabled={state === "sending" || state === "success"}
                    className="group relative w-full sm:w-auto overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 font-semibold text-base px-10 py-6 shadow-lg shadow-blue-500/30 border-2 border-blue-400/40 disabled:opacity-70"
                >
                    <FaPaperPlane className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    <span>{state === "sending" ? "Enviando..." : state === "success" ? "Enviado ✓" : "Enviar pedido"}</span>
                </Button>
                <div className="text-center sm:text-left">
                    <p className="label-arcade text-cyan-400/80">★ Direto no e-mail do comercial</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">A gente responde em horário comercial.</p>
                </div>
            </div>

            {state === "success" && (
                <div role="status" className="rounded-xl border-2 border-green-500/50 bg-green-500/10 p-4 text-sm">
                    <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400 mt-0.5" />
                        <div>
                            <p className="font-semibold text-green-400">Pedido enviado!</p>
                            <p className="text-green-300/80 mt-0.5">{message}</p>
                        </div>
                    </div>
                    <a
                        href={waHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-green-600 to-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:from-green-700 hover:to-green-800 transition-colors"
                    >
                        <FaWhatsapp className="h-4 w-4" /> Quer agilizar? Continuar no WhatsApp
                    </a>
                </div>
            )}

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
