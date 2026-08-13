"use client";

import { useState, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WEB3FORMS_ACCESS_KEY = "6d317f61-9318-4774-942e-ccca86001983";

const tiposEvento = [
    "Festa infantil",
    "Aniversário",
    "Casamento",
    "Formatura",
    "Evento corporativo / SIPAT",
    "Confraternização",
    "Outro",
];

const inputClass =
    "w-full rounded-lg border-2 border-white/10 bg-background/80 px-4 py-3 font-body text-base text-foreground placeholder:text-muted-foreground/50 shadow-inner shadow-black/30 focus:border-purple-400 focus:bg-background focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all";

type FormState = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
    const [state, setState] = useState<FormState>("idle");
    const [message, setMessage] = useState<string>("");
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;

        setState("sending");

        const formData = new FormData(form);
        // Access key do Web3Forms
        formData.append("access_key", WEB3FORMS_ACCESS_KEY);

        // Subject personalizado baseado no tipo de evento
        const tipo = (formData.get("tipoEvento") as string) || "Evento";
        const nome = (formData.get("nome") as string) || "";
        formData.append(
            "subject",
            `Site — Orçamento ${tipo}${nome ? ` — ${nome}` : ""}`
        );
        // Nome do remetente no painel
        formData.append("from_name", "Site Aluguel de Games");

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();

            if (data.success) {
                setState("success");
                setMessage("Recebido! Em breve a gente entra em contato.");
                form.reset();
            } else {
                setState("error");
                setMessage(
                    data.message || "Algo deu errado. Tenta de novo em alguns segundos."
                );
            }
        } catch {
            setState("error");
            setMessage("Falha de conexão. Verifica a internet e tenta de novo.");
        }
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot anti-spam (invisível pro usuário, bots preenchem) */}
            <input
                type="checkbox"
                name="botcheck"
                className="hidden"
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
            />

            {/* Linha 1: Nome + Email */}
            <div className="grid gap-5 md:grid-cols-2">
                <div>
                    <label htmlFor="nome" className="flex items-center gap-2 label-arcade text-cyan-400 mb-2.5">
                        <span className="h-1 w-4 bg-cyan-400" />
                        <span>Nome</span>
                        <span className="text-pink-400">*</span>
                    </label>
                    <input
                        id="nome"
                        name="nome"
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="Como você se chama"
                        className={inputClass}
                    />
                </div>
                <div>
                    <label htmlFor="email" className="flex items-center gap-2 label-arcade text-cyan-400 mb-2.5">
                        <span className="h-1 w-4 bg-cyan-400" />
                        <span>Email</span>
                        <span className="text-pink-400">*</span>
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="voce@email.com"
                        className={inputClass}
                    />
                </div>
            </div>

            {/* Linha 2: Telefone + Tipo de evento */}
            <div className="grid gap-5 md:grid-cols-2">
                <div>
                    <label htmlFor="telefone" className="flex items-center gap-2 label-arcade text-cyan-400 mb-2.5">
                        <span className="h-1 w-4 bg-cyan-400" />
                        <span>Telefone / WhatsApp</span>
                    </label>
                    <input
                        id="telefone"
                        name="telefone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="(11) 9 9999-9999"
                        className={inputClass}
                    />
                </div>
                <div>
                    <label htmlFor="tipoEvento" className="flex items-center gap-2 label-arcade text-purple-400 mb-2.5">
                        <span className="h-1 w-4 bg-purple-400" />
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

            {/* Linha 3: Data + Local */}
            <div className="grid gap-5 md:grid-cols-2">
                <div>
                    <label htmlFor="dataEvento" className="flex items-center gap-2 label-arcade text-purple-400 mb-2.5">
                        <span className="h-1 w-4 bg-purple-400" />
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
                    <label htmlFor="local" className="flex items-center gap-2 label-arcade text-purple-400 mb-2.5">
                        <span className="h-1 w-4 bg-purple-400" />
                        <span>Local / Bairro / Cidade</span>
                    </label>
                    <input
                        id="local"
                        name="local"
                        type="text"
                        placeholder="Ex: Alphaville / Barueri"
                        className={inputClass}
                    />
                </div>
            </div>

            {/* Mensagem */}
            <div>
                <label htmlFor="mensagem" className="flex items-center gap-2 label-arcade text-purple-400 mb-2.5">
                    <span className="h-1 w-4 bg-purple-400" />
                    <span>Detalhes adicionais</span>
                </label>
                <textarea
                    id="mensagem"
                    name="mensagem"
                    rows={4}
                    placeholder="Quantos convidados, equipamentos desejados, qualquer detalhe relevante..."
                    className={inputClass + " resize-none"}
                />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 pt-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-400/40 to-transparent" />
                <span className="label-arcade text-muted-foreground/60">▸ enviar</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-400/40 to-transparent" />
            </div>

            {/* Submit + status */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button
                    type="submit"
                    size="lg"
                    disabled={state === "sending" || state === "success"}
                    className="group relative w-full sm:w-auto overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 font-semibold text-base px-10 py-6 shadow-lg shadow-purple-500/30 border-2 border-purple-400/40 disabled:opacity-70"
                >
                    <FaPaperPlane className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    <span>
                        {state === "sending"
                            ? "Enviando..."
                            : state === "success"
                            ? "Mensagem enviada ✓"
                            : "Enviar mensagem"}
                    </span>
                </Button>

                <div className="text-center sm:text-left">
                    <p className="label-arcade text-cyan-400/80">★ Direto no nosso email</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                        A gente responde em 1 dia útil.
                    </p>
                </div>
            </div>

            {/* Feedback visual */}
            {state === "success" && (
                <div role="status" className="flex items-start gap-3 rounded-xl border-2 border-green-500/50 bg-green-500/10 p-4 text-sm">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400 mt-0.5" />
                    <div>
                        <p className="font-semibold text-green-400">Enviado com sucesso!</p>
                        <p className="text-green-300/80 mt-0.5">{message}</p>
                    </div>
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
