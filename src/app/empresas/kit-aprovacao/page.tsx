// src/app/empresas/kit-aprovacao/page.tsx
//
// Kit de aprovação interna (spec §5.4, item NUNCA-CORTA). Página imprimível
// (o RH salva como PDF pelo navegador — sem dep de HTML→PDF no build). URL
// estável /empresas/kit-aprovacao. Conteúdo: quem somos (desde 1993 = anti-risco),
// o que está incluso, como orçamos (versão sem-faixa até o dono assinar),
// cronograma-modelo, dados pra cadastro de fornecedor (gated em CNPJ/CORP_EMAIL).
// GATE §5.4: seguro/responsabilidade NÃO é mencionado até o dono confirmar.
import type { Metadata } from "next";
import Link from "next/link";

import { WhatsAppCta } from "@/components/cta/WhatsAppCta";
import KitPrintButton from "@/components/empresas/KitPrintButton";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, CNPJ, CORP_EMAIL } from "@/lib/schema";
import { WHATSAPP_CONFIG } from "@/config/whatsapp.config";

export const metadata: Metadata = {
    title: "Kit de aprovação — locação de games para eventos corporativos",
    description:
        "Material pronto pra você aprovar internamente a contratação de games para o evento da empresa: quem somos (desde 1993), o que está incluso, como orçamos, cronograma-modelo e dados pra cadastro de fornecedor. Imprimível / PDF.",
    alternates: { canonical: "https://www.alugueldegames.com.br/empresas/kit-aprovacao" },
    robots: { index: true, follow: true },
};

export default function KitAprovacaoPage() {
    const anos = new Date().getFullYear() - 1993;

    return (
        <main className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6 md:py-16">
            {/* Print CSS: some header/footer/sticky globais e a barra de ações na impressão */}
            <style>{`
                @media print {
                    header, footer, [data-print-hide] { display: none !important; }
                    main { padding: 0 !important; max-width: 100% !important; }
                    body { background: #fff !important; }
                    .kit-doc { color: #000 !important; }
                    .kit-doc * { color: #111 !important; border-color: #ccc !important; background: transparent !important; }
                    .kit-section { break-inside: avoid; }
                }
            `}</style>

            {/* Barra de ações (não imprime) */}
            <div data-print-hide className="mb-8">
                <nav className="mb-6 font-mono text-xs text-muted-foreground" aria-label="Trilha">
                    <Link href="/" className="hover:text-foreground">Início</Link>
                    <span className="mx-1.5" aria-hidden>/</span>
                    <Link href="/empresas" className="hover:text-foreground">Empresas</Link>
                    <span className="mx-1.5" aria-hidden>/</span>
                    <span className="text-foreground">Kit de aprovação</span>
                </nav>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <KitPrintButton />
                    <WhatsAppCta surface="kit" variant="outline">
                        Falar com consultor
                    </WhatsAppCta>
                </div>
            </div>

            {/* Documento imprimível */}
            <article className="kit-doc rounded-2xl border border-border/60 bg-card/30 p-6 md:p-10">
                {/* Cabeçalho */}
                <header className="kit-section border-b border-border/60 pb-6">
                    <p className="font-mono text-xs uppercase tracking-widest text-cyan-400">
                        Kit de aprovação interna
                    </p>
                    <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight md:text-3xl">
                        Locação de games para eventos corporativos
                    </h1>
                    <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">
                        Aluguel de Games · Osasco e toda a Grande São Paulo ·{" "}
                        {WHATSAPP_CONFIG.displayNumber}
                        {CORP_EMAIL ? ` · ${CORP_EMAIL}` : ""}
                        {CNPJ ? ` · CNPJ ${CNPJ}` : ""}
                    </p>
                    <p className="mt-1 font-body text-sm text-muted-foreground">
                        Empresa em atividade desde 1993 ({anos} anos). Emitimos nota fiscal e
                        contrato de locação.
                    </p>
                </header>

                {/* Quem somos (desde 1993 = anti-risco) */}
                <section className="kit-section mt-8">
                    <h2 className="font-display text-lg font-bold md:text-xl">Quem somos</h2>
                    <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground md:text-base">
                        A Aluguel de Games loca fliperamas, videokês, simuladores, realidade
                        virtual e games para festas e eventos desde 1993 — antes do primeiro
                        PlayStation existir. Já realizamos eventos para Bradesco, Spotify, Arnold
                        Classic e Danilo Gentili. Estrutura própria, equipe no local e
                        documentação completa pro seu financeiro.
                    </p>
                </section>

                {/* O que está incluso */}
                <section className="kit-section mt-8">
                    <h2 className="font-display text-lg font-bold md:text-xl">
                        O que está incluso em toda locação
                    </h2>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                        {[
                            "Entrega e montagem no local",
                            "Teste de todos os equipamentos antes do evento",
                            "Equipe no local durante a montagem",
                            "Suporte durante a locação (troca ou técnico se der defeito)",
                            "Retirada depois do evento",
                            "Contrato e nota fiscal de locação",
                        ].map((item) => (
                            <li key={item} className="flex gap-2 font-body text-sm text-muted-foreground md:text-base">
                                <span className="text-cyan-400" aria-hidden>▸</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Como orçamos (versão sem-faixa) */}
                <section className="kit-section mt-8">
                    <h2 className="font-display text-lg font-bold md:text-xl">
                        Como calculamos o investimento
                    </h2>
                    <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground md:text-base">
                        O valor fechado depende de quatro fatores: (1) os equipamentos
                        escolhidos, (2) o número de itens (combos saem melhor), (3) a data e a
                        sazonalidade e (4) a região e o acesso no local. Não há taxa escondida —
                        entrega, montagem, suporte e retirada já entram no valor. Enviamos a
                        proposta detalhada com o investimento fechado após entender o evento.
                    </p>
                </section>

                {/* Cronograma-modelo */}
                <section className="kit-section mt-8">
                    <h2 className="font-display text-lg font-bold md:text-xl">Cronograma-modelo</h2>
                    <ol className="mt-3 space-y-2">
                        {[
                            ["Briefing", "Você passa data, local, público e objetivo."],
                            ["Proposta", "Enviamos mix de equipamentos e investimento fechado."],
                            ["Contrato e NF", "Assinatura do contrato de locação e emissão da nota."],
                            ["Montagem", "Equipe entrega, monta e testa antes do evento começar."],
                            ["Evento", "Suporte durante a locação; troca ou técnico se precisar."],
                            ["Retirada", "Desmontagem e retirada após o evento."],
                        ].map(([titulo, texto], i) => (
                            <li key={titulo} className="flex gap-3 font-body text-sm text-muted-foreground md:text-base">
                                <span className="font-mono font-bold text-cyan-400 tabular-nums">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <span>
                                    <strong className="text-foreground">{titulo}.</strong> {texto}
                                </span>
                            </li>
                        ))}
                    </ol>
                </section>

                {/* Cadastro de fornecedor (gated) */}
                <section className="kit-section mt-8">
                    <h2 className="font-display text-lg font-bold md:text-xl">
                        Cadastro de fornecedor
                    </h2>
                    {CNPJ ? (
                        <div className="mt-3 space-y-1 font-body text-sm text-muted-foreground md:text-base">
                            <p><strong className="text-foreground">Razão social:</strong> Aluguel de Games</p>
                            <p><strong className="text-foreground">CNPJ:</strong> {CNPJ}</p>
                            <p><strong className="text-foreground">Endereço:</strong> Osasco · SP</p>
                            <p><strong className="text-foreground">Contato:</strong> {WHATSAPP_CONFIG.displayNumber}{CORP_EMAIL ? ` · ${CORP_EMAIL}` : ""}</p>
                        </div>
                    ) : (
                        <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground md:text-base">
                            Precisa de razão social, CNPJ e dados bancários pra abrir o cadastro
                            de fornecedor no seu sistema? A gente envia todos os dados na hora
                            pelo WhatsApp ou e-mail — é só pedir.
                        </p>
                    )}
                </section>

                {/* Contato */}
                <section className="kit-section mt-8 border-t border-border/60 pt-6">
                    <p className="font-body text-sm leading-relaxed text-muted-foreground md:text-base">
                        Fale com um consultor pelo WhatsApp <strong className="text-foreground">{WHATSAPP_CONFIG.displayNumber}</strong>
                        {CORP_EMAIL ? <> ou pelo e-mail <strong className="text-foreground">{CORP_EMAIL}</strong></> : null}. Atendemos em horário comercial. Site: alugueldegames.com.br
                    </p>
                </section>
            </article>

            {/* CTA final (não imprime) */}
            <div data-print-hide className="mt-10 flex flex-col items-center gap-4 text-center">
                <WhatsAppCta surface="kit" variant="primary">
                    Falar com consultor no WhatsApp
                </WhatsAppCta>
            </div>

            <JsonLd
                data={breadcrumbSchema([
                    { name: "Início", url: "/" },
                    { name: "Empresas", url: "/empresas" },
                    { name: "Kit de aprovação", url: "/empresas/kit-aprovacao" },
                ])}
            />
        </main>
    );
}
