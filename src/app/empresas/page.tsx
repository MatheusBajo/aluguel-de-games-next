// src/app/empresas/page.tsx
//
// /empresas — máquina B2B (spec §5). Persona: RH/compras em desktop corporativo
// com WhatsApp Web BLOQUEADO. Gates da página: e-mail visível (gated em CORP_EMAIL,
// 2 estados desenhados), linha 151-250 pessoas no dimensionamento, "NF de locação"
// explicada, form com destino REAL (Web3Forms). GATE §5.4: seguro NÃO é mencionado
// até o dono confirmar. "Desde 1993" = argumento anti-risco. Zero SLA de tempo sem
// assinatura, zero número fabricado.
import Link from "next/link";
import type { Metadata } from "next";
import { Mail } from "lucide-react";

import { WhatsAppCta, WhatsAppCtaMeta } from "@/components/cta/WhatsAppCta";
import { AnswerCapsule } from "@/components/content/AnswerCapsule";
import { FaqNative } from "@/components/content/FaqNative";
import ContactFormB2B from "@/components/forms/ContactFormB2B";
import JsonLd from "@/components/seo/JsonLd";
import {
    breadcrumbSchema,
    serviceSchema,
    CNPJ,
    CORP_EMAIL,
    type FaqEntry,
} from "@/lib/schema";

export const metadata: Metadata = {
    title: "Aluguel de games para eventos corporativos em SP",
    description:
        "Locação de fliperamas, videokês, VR e games para SIPAT, confraternização e ativação de marca em São Paulo. Nota fiscal de locação, contrato e equipe no local. Desde 1993 — já atendemos Bradesco, Spotify e Arnold Classic.",
    alternates: { canonical: "https://www.alugueldegames.com.br/empresas" },
    openGraph: {
        title: "Aluguel de games para eventos corporativos em SP",
        description:
            "SIPAT, confraternização e ativação de marca. NF de locação, contrato e equipe no local. Desde 1993.",
        url: "https://www.alugueldegames.com.br/empresas",
        siteName: "Aluguel de Games",
        locale: "pt_BR",
        type: "website",
        images: [{ url: "/carousel/compressed/Braland.webp", width: 1200, height: 630, alt: "Evento corporativo Bradesco - Braland" }],
    },
};

// Guia de dimensionamento (spec §5.3). Mix = recomendação editorial honesta.
// Números logísticos finos (m², tomadas, técnicos) são [CONFIRMAR COM DONO] →
// NÃO renderizam como fato: a gente fecha o dimensionamento no orçamento.
const PORTES: {
    porte: string;
    itens: string;
    mix: string;
    destaque?: boolean;
}[] = [
    {
        porte: "Até 50 pessoas",
        itens: "2 a 3 atrações",
        mix: "Fliperama + console em TV grande + uma mesa (pebolim ou air game).",
    },
    {
        porte: "51 a 150 pessoas",
        itens: "4 a 6 atrações",
        mix: "O trio acima + máquina de pegar bichinho (garra) ou máquina de dança.",
    },
    {
        porte: "151 a 250 pessoas",
        itens: "6 a 8 atrações",
        mix: "Mix ampliado + videokê ou realidade virtual, com operação assistida.",
        destaque: true,
    },
    {
        porte: "251 a 400+ pessoas",
        itens: "8+ atrações",
        mix: "Estações múltiplas e equipe dedicada, no padrão de grandes ativações (ex.: Arnold Classic).",
    },
];

const FAQ_B2B: FaqEntry[] = [
    {
        question: "Vocês emitem nota fiscal?",
        answer:
            "Sim. Locação de equipamento é diferente de prestação de serviço: pela lei (LC 116/2003) e pela Súmula Vinculante 31 do STF, aluguel de bem móvel não gera nota fiscal de serviço (NFS-e) comum. A gente emite fatura/nota de locação + contrato, que é a documentação fiscal correta pra esse tipo de contratação. Seu financeiro recebe tudo que precisa pra lançar a despesa — se tiver requisito específico, manda que a gente adequa.",
    },
    {
        question: "Como funciona o pagamento? Tem boleto e faturamento?",
        answer:
            "A gente se adapta à política da sua empresa: boleto, faturamento e PIX são as formas mais comuns. Prazo e forma de pagamento a gente combina conforme o porte do evento e os requisitos do seu financeiro. Manda como a sua empresa costuma pagar fornecedor que a gente confirma.",
    },
    {
        question: "Fazem cadastro / homologação de fornecedor?",
        answer:
            "Fazemos. Já passamos pelo processo de cadastro de fornecedor de grandes empresas. Envia o formulário e a lista de documentos/certidões que a gente providencia. O kit de aprovação desta página já traz nossos dados básicos pra adiantar.",
    },
    {
        question: "Um funcionário de vocês opera a máquina no evento?",
        answer:
            "A equipe entrega, monta e testa tudo antes do evento. Operação assistida no local (alguém acompanhando durante o evento) a gente inclui conforme o porte e o tipo de atração — combina no orçamento. Os equipamentos são simples: seus convidados jogam sozinhos.",
    },
    {
        question: "Montam fora do horário comercial?",
        answer:
            "Montamos. Evento de empresa quase sempre pede montagem antes do expediente, à noite ou no fim de semana. Manda a janela de montagem do seu local que a gente se programa pra deixar tudo pronto na hora.",
    },
    {
        question: "Dá pra fazer em shopping, expo ou espaço com regras próprias?",
        answer:
            "Dá. A gente já montou em expo center, shopping e área aberta. Se o local tem regras de acesso, horário de carga e descarga ou exigência de documentação, avisa na hora do orçamento que a gente se adequa às normas do espaço.",
    },
];

// Cases reais — NOMES verificáveis + escopo qualitativo honesto (sem número
// fabricado; "6 máquinas · 2 dias" fica pra quando o dono confirmar — §5.5).
const CASES = [
    {
        nome: "Bradesco",
        sub: "Braland",
        tipo: "img" as const,
        src: "/carousel/compressed/Braland.webp",
        alt: "Evento corporativo Bradesco - Braland",
        escopo: "Ativação corporativa de grande porte para colaboradores e convidados do banco.",
        border: "border-cyan-500/40",
    },
    {
        nome: "Arnold Classic",
        sub: "Expo Center · SP",
        tipo: "video" as const,
        src: "/demonstra/20250405_165640.mp4",
        alt: "Arnold Classic no Expo Center",
        escopo: "Ativação no maior evento fitness do Brasil, com grande público circulando.",
        border: "border-pink-500/40",
    },
    {
        nome: "Spotify",
        sub: "Evento de marca",
        tipo: "text" as const,
        escopo: "Games no evento da marca. Um dos nomes que já jogaram com a gente.",
        border: "border-green-500/40",
    },
];

export default function EmpresasPage() {
    const anos = new Date().getFullYear() - 1993;
    const mailtoHref = CORP_EMAIL
        ? `mailto:${CORP_EMAIL}?subject=${encodeURIComponent("Cotação evento corporativo")}`
        : null;

    return (
        <main className="relative overflow-hidden">
            {/* /empresas roda com glow reduzido (enxerto V1B): grid discreto, sem blobs */}
            <div className="pointer-events-none absolute inset-0 grid-tron opacity-20" aria-hidden />

            {/* ============= HERO B2B ============= */}
            <section className="relative mx-auto max-w-6xl px-4 pt-14 pb-12 md:pt-20 md:pb-16">
                <nav className="mb-6 font-mono text-xs text-muted-foreground" aria-label="Trilha">
                    <Link href="/" className="hover:text-foreground">Início</Link>
                    <span className="mx-1.5" aria-hidden>/</span>
                    <span className="text-foreground">Empresas</span>
                </nav>

                <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_1fr]">
                    <div>
                        {/* Badge (gated): com CNPJ mostra o número; sem, mostra o fato honesto */}
                        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 px-3 py-1 font-mono text-xs text-cyan-300">
                            <span aria-hidden>★</span>
                            {CNPJ ? `CNPJ ${CNPJ}` : "Empresa desde 1993 · emitimos nota"}
                        </p>

                        <h1 className="font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl md:text-6xl">
                            Aluguel de games para eventos corporativos em SP
                        </h1>

                        <p className="mt-5 font-body text-lg leading-relaxed text-muted-foreground md:text-xl">
                            SIPAT, confraternização e ativação de marca. Nota fiscal de locação,
                            contrato e equipe no local. Desde 1993.
                        </p>

                        {/* CTA triplo: WhatsApp + kit + e-mail (gated) */}
                        <div className="mt-8 flex flex-col gap-3">
                            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                                <WhatsAppCta surface="empresas" variant="primary">
                                    Falar com consultor no WhatsApp
                                </WhatsAppCta>
                                <Link
                                    href="/empresas/kit-aprovacao"
                                    className="inline-flex items-center justify-center gap-2 rounded-md h-11 px-6 text-base font-semibold border-2 border-cyan-500/50 bg-cyan-500/10 text-foreground hover:border-cyan-400 hover:bg-cyan-500/20 transition-all"
                                >
                                    Ver kit de aprovação (PDF)
                                </Link>
                                {mailtoHref ? (
                                    <a
                                        href={mailtoHref}
                                        className="inline-flex items-center justify-center gap-2 rounded-md h-11 px-6 text-base font-semibold border-2 border-border hover:border-purple-500/60 hover:bg-purple-500/10 transition-all"
                                    >
                                        <Mail className="h-5 w-5" aria-hidden />
                                        {CORP_EMAIL}
                                    </a>
                                ) : null}
                            </div>
                            <WhatsAppCtaMeta surface="empresas" align="left" />
                            {/* E-mail: 2 estados. Sem CORP_EMAIL, aponta pro form (destino real). */}
                            {!mailtoHref && (
                                <p className="font-body text-xs text-muted-foreground">
                                    Prefere e-mail? Use o{" "}
                                    <a href="#cotacao" className="font-semibold text-cyan-400 hover:text-cyan-300 underline-offset-4 hover:underline">
                                        formulário de cotação
                                    </a>{" "}
                                    — vai direto pro nosso e-mail, sem precisar de WhatsApp.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Case lateral Bradesco (foto real) */}
                    <aside className="relative">
                        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30">
                            <img
                                src="/carousel/compressed/Braland.webp"
                                alt="Evento corporativo Bradesco - Braland"
                                className="aspect-[4/5] w-full object-cover"
                                width={640}
                                height={800}
                                loading="eager"
                            />
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 p-6">
                                <p className="font-mono text-xs uppercase tracking-widest text-cyan-300">★ Case</p>
                                <p className="mt-1 font-display text-2xl font-bold text-white">Bradesco · Braland</p>
                                <p className="mt-1 font-body text-sm text-white/70">Ativação corporativa de grande porte</p>
                            </div>
                            <span className="pointer-events-none absolute top-3 left-3 h-6 w-6 border-t-2 border-l-2 border-cyan-400" aria-hidden />
                            <span className="pointer-events-none absolute top-3 right-3 h-6 w-6 border-t-2 border-r-2 border-cyan-400" aria-hidden />
                        </div>
                    </aside>
                </div>
            </section>

            {/* ============= ANSWER CAPSULE B2B ============= */}
            <section className="relative mx-auto max-w-6xl px-4 pb-4">
                <AnswerCapsule label="Resumo pra quem decide">
                    Locação de fliperamas, videokês, simuladores e games para eventos
                    corporativos em São Paulo: SIPAT, confraternização, lançamento e ativação de
                    marca. Fatura de locação, contrato e equipe no local. Desde 1993 — Bradesco,
                    Spotify e Arnold Classic já jogaram com a gente. Fale com um consultor,
                    baixe o kit de aprovação pra apresentar aí dentro ou mande a cotação pelo
                    formulário.
                </AnswerCapsule>
            </section>

            {/* ============= DIMENSIONAMENTO POR PORTE ============= */}
            <section className="relative mx-auto max-w-6xl px-4 py-14 md:py-20">
                <h2 className="font-display text-2xl font-extrabold tracking-tight md:text-4xl">
                    Quantos equipamentos pro seu público?
                </h2>
                <p className="mt-3 max-w-2xl font-body text-base leading-relaxed text-muted-foreground md:text-lg">
                    Um ponto de partida por porte de evento. O dimensionamento fino (espaço,
                    tomadas, equipe) a gente fecha com você no orçamento, conforme o local.
                </p>

                <div className="mt-8 overflow-x-auto rounded-2xl border border-border/60 bg-card/40">
                    <table className="w-full border-collapse text-left">
                        <caption className="sr-only">
                            Guia de dimensionamento de equipamentos por porte de evento corporativo
                        </caption>
                        <thead>
                            <tr className="border-b border-border/60">
                                <th scope="col" className="px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">Porte</th>
                                <th scope="col" className="px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">Atrações</th>
                                <th scope="col" className="px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">Mix que costuma funcionar</th>
                                <th scope="col" className="px-5 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {PORTES.map((p) => (
                                <tr
                                    key={p.porte}
                                    className={
                                        "border-b border-border/40 align-top last:border-b-0 " +
                                        (p.destaque ? "bg-cyan-500/5" : "")
                                    }
                                >
                                    <th scope="row" className="whitespace-nowrap px-5 py-4 font-display text-sm font-bold text-foreground md:text-base">
                                        {p.porte}
                                        {p.destaque && (
                                            <span className="ml-2 rounded-full border border-cyan-500/40 px-2 py-0.5 align-middle font-mono text-[10px] uppercase text-cyan-300">
                                                comum
                                            </span>
                                        )}
                                    </th>
                                    <td className="whitespace-nowrap px-5 py-4 font-mono text-sm tabular-nums text-muted-foreground">
                                        {p.itens}
                                    </td>
                                    <td className="px-5 py-4 font-body text-sm leading-relaxed text-muted-foreground md:text-base">
                                        {p.mix}
                                    </td>
                                    <td className="whitespace-nowrap px-5 py-4">
                                        <WhatsAppCta surface="empresas" variant="inline">
                                            Montar
                                        </WhatsAppCta>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* ============= CASES REAIS ============= */}
            <section className="relative mx-auto max-w-6xl px-4 py-14 md:py-20">
                <h2 className="font-display text-2xl font-extrabold tracking-tight md:text-4xl">
                    Quem já jogou com a gente
                </h2>
                <p className="mt-3 max-w-2xl font-body text-base leading-relaxed text-muted-foreground md:text-lg">
                    De gigantes do mercado financeiro a grandes eventos fitness — nomes reais,
                    sem número inventado.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {CASES.map((c) => (
                        <article
                            key={c.nome}
                            className={"group relative overflow-hidden rounded-2xl border-2 bg-black aspect-[9/16] " + c.border}
                        >
                            {c.tipo === "img" && (
                                <img
                                    src={c.src}
                                    alt={c.alt}
                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                />
                            )}
                            {c.tipo === "video" && (
                                <video
                                    src={c.src}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    preload="metadata"
                                    aria-label={c.alt}
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                            )}
                            {c.tipo === "text" && (
                                <div className="absolute inset-0 bg-gradient-to-br from-green-950/60 via-black to-black" />
                            )}
                            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                                <h3 className="font-display text-2xl font-extrabold leading-tight text-white md:text-3xl">
                                    {c.nome}
                                </h3>
                                <p className="mt-1 font-display text-sm italic text-white/70">{c.sub}</p>
                                <p className="mt-2 font-body text-xs leading-snug text-white/75 md:text-sm">
                                    {c.escopo}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>

                <p className="mt-6 font-body text-sm text-muted-foreground">
                    {anos} anos atendendo de eventos pequenos a grandes ativações corporativas.
                    Logo de cliente no site só com autorização formal — por isso citamos os nomes
                    em texto e mostramos as fotos que são nossas de verdade.
                </p>
            </section>

            {/* ============= AGENDA HONESTA ============= */}
            <section className="relative mx-auto max-w-6xl px-4 py-6">
                <div className="rounded-2xl border border-yellow-400/25 bg-card/40 p-6 md:p-8">
                    <p className="label-arcade text-yellow-400 mb-2">▸ Agenda</p>
                    <p className="font-body text-base leading-relaxed text-foreground md:text-lg">
                        Fim de ano (novembro e dezembro) lota com semanas de antecedência — é a
                        temporada de confraternização. Fora da alta, a gente costuma dar conta
                        até de pedidos da mesma semana. De qualquer forma, quanto antes você
                        garante a data, melhor pro seu planejamento.
                    </p>
                </div>
            </section>

            {/* ============= PROCESSO B2B ============= */}
            <section className="relative mx-auto max-w-6xl px-4 py-14 md:py-20">
                <h2 className="font-display text-2xl font-extrabold tracking-tight md:text-4xl">
                    Como contratar
                </h2>
                <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
                    {[
                        ["Briefing", "Você passa data, local, público e objetivo pelo WhatsApp, e-mail ou formulário."],
                        ["Proposta", "Enviamos o mix de equipamentos e o investimento fechado, sem taxa escondida."],
                        ["Contrato + NF", "Assinatura do contrato de locação e emissão da nota fiscal de locação."],
                        ["Execução", "Equipe entrega, monta, testa e dá suporte durante o evento."],
                        // [CONFIRMAR COM DONO: ele já manda fotos/registro pós-evento?]
                        ["Fechamento", "Retirada e, se você precisa prestar contas pro gestor, a gente combina o registro do evento."],
                    ].map(([titulo, texto], i) => (
                        <div
                            key={titulo}
                            className="relative rounded-2xl border border-border/60 bg-card/40 p-5 transition-colors hover:border-cyan-500/50"
                        >
                            <p className="font-mono text-2xl font-bold text-cyan-400 tabular-nums">
                                {String(i + 1).padStart(2, "0")}
                            </p>
                            <h3 className="mt-2 font-display text-base font-bold">{titulo}</h3>
                            <p className="mt-1 font-body text-sm leading-relaxed text-muted-foreground">{texto}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ============= FAQ B2B ============= */}
            <section className="relative mx-auto max-w-4xl px-4 py-14 md:py-20">
                <h2 className="mb-6 font-display text-2xl font-extrabold tracking-tight md:text-4xl">
                    Perguntas de RH, compras e financeiro
                </h2>
                <FaqNative faqs={FAQ_B2B} />
            </section>

            {/* ============= FORM B2B (destino real) ============= */}
            <section id="cotacao" className="relative mx-auto max-w-4xl px-4 py-14 md:py-20 scroll-mt-20">
                <div className="mb-8">
                    <h2 className="font-display text-2xl font-extrabold tracking-tight md:text-4xl">
                        Peça a cotação corporativa
                    </h2>
                    <p className="mt-3 font-body text-base leading-relaxed text-muted-foreground md:text-lg">
                        Preenche que vai direto pro nosso e-mail — sem depender de WhatsApp. A
                        gente responde em horário comercial com a proposta.
                    </p>
                </div>

                <div className="relative rounded-3xl border-2 border-cyan-500/30 bg-card/40 p-6 md:p-10">
                    <ContactFormB2B />
                </div>
            </section>

            {/* ============= CTA FINAL ============= */}
            <section className="relative mx-auto max-w-6xl px-4 pb-24 md:pb-32">
                <div className="rounded-3xl border border-purple-500/30 bg-card/40 p-8 text-center md:p-12">
                    <h2 className="mx-auto max-w-xl font-display text-2xl font-extrabold tracking-tight md:text-4xl">
                        Bora tirar o evento do papel?
                    </h2>
                    <div className="mt-6 flex flex-col items-center gap-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
                            <WhatsAppCta surface="empresas" variant="primary">
                                Falar com consultor no WhatsApp
                            </WhatsAppCta>
                            <Link
                                href="/empresas/kit-aprovacao"
                                className="inline-flex items-center justify-center gap-2 rounded-md h-11 px-6 text-base font-semibold border-2 border-border hover:border-cyan-500/60 hover:bg-cyan-500/10 transition-all"
                            >
                                Ver kit de aprovação
                            </Link>
                            {mailtoHref ? (
                                <a
                                    href={mailtoHref}
                                    className="inline-flex items-center justify-center gap-2 rounded-md h-11 px-6 text-base font-semibold border-2 border-border hover:border-purple-500/60 hover:bg-purple-500/10 transition-all"
                                >
                                    <Mail className="h-5 w-5" aria-hidden />
                                    {CORP_EMAIL}
                                </a>
                            ) : null}
                        </div>
                        <WhatsAppCtaMeta surface="empresas" />
                    </div>
                </div>
            </section>

            {/* Schema: Service + FAQPage (via FaqNative) + BreadcrumbList */}
            <JsonLd
                data={[
                    serviceSchema({
                        name: "Aluguel de games para eventos corporativos",
                        description:
                            "Locação de fliperamas, videokês, realidade virtual e games para SIPAT, confraternização e ativação de marca em São Paulo. Nota fiscal de locação, contrato e equipe no local. Desde 1993.",
                        url: "https://www.alugueldegames.com.br/empresas",
                        serviceType: "Locação de equipamentos para eventos corporativos",
                    }),
                    breadcrumbSchema([
                        { name: "Início", url: "/" },
                        { name: "Empresas", url: "/empresas" },
                    ]),
                ]}
            />
        </main>
    );
}
