// src/app/quanto-custa/page.tsx
//
// /quanto-custa — o gap nº1 do nicho (7/9 concorrentes escondem preço; spec §6).
// Resposta direta de ~50 palavras (snippet-alvo §9.5) + tabela "o que influencia
// o preço" (HTML cru, machine-readable) + faixas por categoria (VERSÃO B enquanto
// o dono não assinar `PRICE_RANGES`) + FAQ (FAQPage). ZERO número inventado:
// "a partir de R$" só entra com compromisso escrito (regra §1.2).
import type { Metadata } from "next";
import Link from "next/link";

import { AnswerCapsule } from "@/components/content/AnswerCapsule";
import { FaqNative } from "@/components/content/FaqNative";
import { WhatsAppCta, WhatsAppCtaMeta } from "@/components/cta/WhatsAppCta";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, PRICE_RANGES, type FaqEntry } from "@/lib/schema";

export const metadata: Metadata = {
    title: "Quanto custa alugar fliperama, videokê e games para festa?",
    description:
        "Entenda o que influencia o preço do aluguel de fliperamas, videokês e games em SP: equipamento, data, região, acesso no local e número de itens. Entrega, montagem e suporte inclusos, sem taxa escondida. Peça o valor da sua festa no WhatsApp.",
    alternates: { canonical: "https://www.alugueldegames.com.br/quanto-custa" },
    openGraph: {
        title: "Quanto custa alugar games para festa?",
        description:
            "O que pesa no preço, explicado antes de você perguntar. Sem taxa escondida, entrega e montagem inclusas.",
        url: "https://www.alugueldegames.com.br/quanto-custa",
        siteName: "Aluguel de Games",
        locale: "pt_BR",
        type: "website",
    },
};

// Fatores que influenciam o preço (spec §6). Nenhum número fabricado — cada linha
// diz COMO o fator pesa, não QUANTO. O "quanto" fecha no WhatsApp.
const FATORES: { fator: string; efeito: string }[] = [
    {
        fator: "O equipamento",
        efeito:
            "Um fliperama, um videokê e um simulador de realidade virtual não custam a mesma coisa. Você escolhe o que combina com a festa.",
    },
    {
        fator: "Número de itens",
        efeito:
            "Quanto mais itens no mesmo evento, melhor o combo fecha pra você. Alugar em conjunto sai mais em conta que item avulso.",
    },
    {
        fator: "A data",
        efeito:
            "Fim de semana, feriado e o fim do ano (novembro e dezembro) enchem primeiro. Reservar com antecedência ajuda no valor e na disponibilidade.",
    },
    {
        fator: "O período",
        efeito:
            "A diária cobre o tempo do seu evento, com entrega e retirada inclusas. Eventos longos ou que passam de um dia entram no cálculo.",
    },
    {
        fator: "A região",
        efeito:
            "Atendemos Osasco e toda a Grande São Paulo. A distância e o deslocamento até o local entram na conta da logística.",
    },
    {
        fator: "O acesso no local",
        efeito:
            "Escada, andar sem elevador ou espaço apertado pesam na montagem. Por isso pedimos o bairro e como é o local junto com a data.",
    },
];

const FAQ: FaqEntry[] = [
    {
        question: "Quanto custa alugar um fliperama pra festa?",
        answer:
            "Depende de três coisas: o equipamento, a data (fim de semana e dezembro lotam antes) e o bairro da entrega. A diária cobre o período do seu evento, com entrega, montagem, retirada e suporte inclusos — sem taxa escondida. Alugando mais de um item junto, o combo sai melhor. Manda data e bairro no WhatsApp que a gente fecha o valor.",
    },
    {
        question: "Por que não tem uma tabela de preços fixa no site?",
        answer:
            "Porque nenhuma festa é igual à outra: muda o equipamento, a data, a região e o acesso no local. Uma tabela fixa ou obrigaria a gente a cobrar caro de todo mundo pra cobrir o pior caso, ou a esconder taxa depois. A gente prefere calcular o valor real da SUA festa — manda os dados no WhatsApp que sai na hora.",
    },
    {
        question: "Tem taxa de entrega?",
        answer:
            "Entrega, montagem, retirada e suporte já entram no valor do orçamento — a gente não cobra por fora. A distância e o acesso (escada, andar) podem pesar no cálculo, por isso pedimos o bairro junto com a data.",
    },
    {
        question: "Fica mais barato alugar vários itens juntos?",
        answer:
            "Fica. Combo de itens sai melhor que alugar cada coisa avulsa — quanto mais itens no mesmo evento, melhor a conta fecha pra você. Monta o pacote e manda no WhatsApp que a gente calcula.",
    },
    {
        question: "Dá pra ter uma ideia do valor sem passar meus dados?",
        answer:
            "A gente entende, mas o valor honesto depende da data e do bairro — sem eles, qualquer número seria chute. Basta a data e a cidade (não precisa endereço completo pra uma prévia) que a gente já te dá uma ideia real pelo WhatsApp, sem compromisso.",
    },
];

export default function QuantoCustaPage() {
    return (
        <main className="mx-auto w-full max-w-4xl px-4 py-16 md:px-6 md:py-20">
            <nav className="mb-6 font-mono text-xs text-muted-foreground" aria-label="Trilha">
                <Link href="/" className="hover:text-foreground">Início</Link>
                <span className="mx-1.5" aria-hidden>/</span>
                <span className="text-foreground">Quanto custa</span>
            </nav>

            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
                Quanto custa alugar fliperama, videokê e games?
            </h1>

            <div className="mt-6">
                <AnswerCapsule label="Resposta direta">
                    Não existe tabela fixa: o preço do aluguel depende do equipamento, da data,
                    da região da entrega e de quantos itens você aluga junto — combos saem
                    melhor. Entrega, montagem, retirada e suporte já entram no valor, sem taxa
                    escondida. Manda a data e o bairro no WhatsApp (11) 96526-1000 que a gente
                    fecha o valor da sua festa. Desde 1993.
                </AnswerCapsule>
            </div>

            {/* ============= O QUE INFLUENCIA (tabela HTML cru, machine-readable) ============= */}
            <section className="mt-12">
                <h2 className="mb-6 font-display text-2xl font-extrabold tracking-tight md:text-3xl">
                    O que influencia o preço
                </h2>

                <div className="overflow-x-auto rounded-2xl border border-yellow-400/25 bg-card/40">
                    <table className="w-full border-collapse text-left">
                        <caption className="sr-only">
                            Fatores que influenciam o valor do aluguel de games para festas
                        </caption>
                        <thead>
                            <tr className="border-b border-border/60">
                                <th
                                    scope="col"
                                    className="px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-yellow-400"
                                >
                                    Fator
                                </th>
                                <th
                                    scope="col"
                                    className="px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-yellow-400"
                                >
                                    Como pesa no valor
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {FATORES.map((f) => (
                                <tr
                                    key={f.fator}
                                    className="border-b border-border/40 last:border-b-0 align-top"
                                >
                                    <th
                                        scope="row"
                                        className="whitespace-nowrap px-5 py-4 font-display text-sm font-bold text-foreground md:text-base"
                                    >
                                        {f.fator}
                                    </th>
                                    <td className="px-5 py-4 font-body text-sm leading-relaxed text-muted-foreground md:text-base">
                                        {f.efeito}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <p className="mt-4 font-body text-sm leading-relaxed text-muted-foreground">
                    O que está SEMPRE incluso, sem custo à parte: entrega, montagem, teste dos
                    equipamentos, suporte durante a locação e retirada depois. Contrato e nota
                    fiscal também.
                </p>
            </section>

            {/* ============= FAIXAS DE REFERÊNCIA (2 estados desenhados) ============= */}
            <section className="mt-14">
                <h2 className="mb-6 font-display text-2xl font-extrabold tracking-tight md:text-3xl">
                    Faixas de referência
                </h2>

                {PRICE_RANGES && PRICE_RANGES.length > 0 ? (
                    // Estado COM faixas assinadas pelo dono (âncora de magnitude honesta).
                    <div className="overflow-x-auto rounded-2xl border border-yellow-400/25 bg-card/40">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-border/60">
                                    <th scope="col" className="px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-yellow-400">
                                        Categoria
                                    </th>
                                    <th scope="col" className="px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-yellow-400">
                                        A partir de
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {PRICE_RANGES.map((r) => (
                                    <tr key={r.categoria} className="border-b border-border/40 last:border-b-0">
                                        <th scope="row" className="px-5 py-4 font-display text-sm font-bold text-foreground md:text-base">
                                            {r.categoria}
                                        </th>
                                        <td className="px-5 py-4 font-mono text-sm font-semibold tabular-nums text-yellow-400 md:text-base">
                                            {r.faixa}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    // Estado SEM faixas (versão B): "como a gente calcula", zero número inventado.
                    <div className="rounded-2xl border border-border/60 bg-card/40 p-6 md:p-8">
                        <p className="font-body text-base leading-relaxed text-foreground md:text-lg">
                            A gente prefere não jogar um &ldquo;a partir de R$&rdquo; genérico na
                            sua cara: seria um número que quase nunca bate com a sua festa de
                            verdade. Em vez disso, a conta é simples e transparente — a gente
                            soma os itens que você quer, olha a data e a região, aplica o desconto
                            de combo quando tem mais de um item, e te manda o valor fechado, sem
                            taxa surpresa.
                        </p>
                        <p className="mt-4 font-body text-base leading-relaxed text-muted-foreground md:text-lg">
                            <strong className="text-foreground">Combos saem melhor.</strong>{" "}
                            Quanto mais atrações no mesmo evento, melhor a conta fecha pra você.
                            Manda o que você tá pensando que a gente monta o pacote.
                        </p>
                    </div>
                )}
            </section>

            {/* ============= FAQ ============= */}
            <section className="mt-14">
                <h2 className="mb-6 font-display text-2xl font-extrabold tracking-tight md:text-3xl">
                    Perguntas sobre preço
                </h2>
                <FaqNative faqs={FAQ} />
            </section>

            {/* ============= CTA ============= */}
            <section className="mt-14 rounded-3xl border border-purple-500/30 bg-card/40 p-8 text-center md:p-12">
                <h2 className="mx-auto max-w-xl font-display text-2xl font-extrabold tracking-tight md:text-4xl">
                    Manda data e bairro que a gente fecha o valor
                </h2>
                <div className="mt-6 flex flex-col items-center gap-4">
                    <WhatsAppCta surface="orcamento" variant="primary">
                        Pedir o valor da minha festa
                    </WhatsAppCta>
                    <WhatsAppCtaMeta surface="orcamento" />
                </div>
            </section>

            <JsonLd
                data={breadcrumbSchema([
                    { name: "Início", url: "/" },
                    { name: "Quanto custa", url: "/quanto-custa" },
                ])}
            />
        </main>
    );
}
