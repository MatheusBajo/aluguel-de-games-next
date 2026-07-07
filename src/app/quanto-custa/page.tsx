// src/app/quanto-custa/page.tsx
//
// /quanto-custa — o gap nº1 (7/9 concorrentes escondem preço). Versão LEAN do
// estágio 2 (a home linka pra cá; sem link morto na página mestre). A versão
// completa da spec §6 (tabela "o que influencia" + faixas por categoria quando
// o dono assinar) fica pra fase 5. ZERO número inventado — "a partir de R$" só
// com compromisso escrito do dono.
import type { Metadata } from "next";
import Link from "next/link";

import { AnswerCapsule } from "@/components/content/AnswerCapsule";
import { PriceBlock } from "@/components/home/PriceBlock";
import { FaqNative } from "@/components/content/FaqNative";
import { WhatsAppCta, WhatsAppCtaMeta } from "@/components/cta/WhatsAppCta";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, type FaqEntry } from "@/lib/schema";

export const metadata: Metadata = {
    title: "Quanto custa alugar fliperama, videokê e games para festa?",
    description:
        "Entenda o que influencia o preço do aluguel de fliperamas, videokês e games em SP: equipamento, data, bairro e número de itens. Entrega, montagem e suporte inclusos. Peça o valor da sua festa no WhatsApp.",
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

const FAQ: FaqEntry[] = [
    {
        question: "Quanto custa alugar um fliperama pra festa?",
        answer:
            "Depende de três coisas: o equipamento, a data (fim de semana e dezembro lotam antes) e o bairro da entrega. A diária cobre o período do seu evento, com entrega, montagem, retirada e suporte inclusos — sem taxa escondida. Alugando mais de um item junto, o combo sai melhor. Manda data e bairro no WhatsApp que a gente fecha o valor.",
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
                    do bairro da entrega e de quantos itens você aluga junto — combos saem
                    melhor. Entrega, montagem, retirada e suporte já entram no valor, sem taxa
                    escondida. Manda a data e o bairro no WhatsApp (11) 96526-1000 que a gente
                    fecha o valor da sua festa. Desde 1993.
                </AnswerCapsule>
            </div>

            <section className="mt-12">
                <h2 className="mb-6 font-display text-2xl font-extrabold tracking-tight md:text-3xl">
                    O que influencia o preço
                </h2>
                <PriceBlock />
            </section>

            <section className="mt-14">
                <h2 className="mb-6 font-display text-2xl font-extrabold tracking-tight md:text-3xl">
                    Perguntas sobre preço
                </h2>
                <FaqNative faqs={FAQ} />
            </section>

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
