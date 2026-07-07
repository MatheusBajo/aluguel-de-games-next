// src/app/page.tsx — HOME (LP mestre). Answer-first, hero estático (LCP por
// arquitetura), ordem fixa das dobras (spec §3): o que tem → quanto custa →
// como orçar → como funciona → prova → FAQ → CTA. Server component: todo o
// conteúdo (capsule, preço, FAQ, specs) existe no HTML cru; só o widget de
// orçamento e a sticky bar são ilhas client.
import type { Metadata } from "next";
import Link from "next/link";

import { getCatalog } from "@/lib/catalog.server";
import { segmentsToSlug } from "@/lib/slug-utils";
import { getImagePath } from "@/lib/image-utils";
import type { FaqEntry } from "@/lib/schema";

import { HomeHero } from "@/components/home/HomeHero";
import { AnswerCapsule } from "@/components/content/AnswerCapsule";
import { CategoryGrid, type CategoryCard } from "@/components/home/CategoryGrid";
import { PriceBlock } from "@/components/home/PriceBlock";
import { QuoteWidget } from "@/components/home/QuoteWidget";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ProofSection } from "@/components/home/ProofSection";
import { FaqNative } from "@/components/content/FaqNative";
import { WhatsAppCta, WhatsAppCtaMeta } from "@/components/cta/WhatsAppCta";

export const metadata: Metadata = {
    title: "Aluguel de fliperama, videokê e games para festas | Desde 1993",
    description:
        "Aluguel de fliperamas, videokês, PS5, realidade virtual, máquina de dança e jogos de mesa para festas e eventos em Osasco e Grande São Paulo. Entrega, montagem e suporte inclusos. Desde 1993. Orçamento pelo WhatsApp.",
    alternates: { canonical: "/" },
    openGraph: {
        title: "Aluguel de fliperama, videokê e games para festas",
        description:
            "Desde 1993 alugando fliperamas, videokês, VR, consoles e jogos de mesa para festas e eventos na Grande SP. Entrega e montagem inclusas. Orçamento pelo WhatsApp.",
        url: "https://www.alugueldegames.com.br/",
        siteName: "Aluguel de Games",
        locale: "pt_BR",
        type: "website",
    },
};

/** Categorias da vitrine D2 (URLs aninhadas atuais, sem migração — spec §2). */
const CATEGORIAS: { label: string; href: string; slug: string; emoji: string }[] = [
    { label: "Fliperamas", href: "/catalogo/jogos-eletronicos/fliperamas/", slug: "jogos-eletronicos/fliperamas", emoji: "🕹️" },
    { label: "Videokê & Karaokê", href: "/catalogo/videokes/", slug: "videokes", emoji: "🎤" },
    { label: "Realidade Virtual", href: "/catalogo/realidade-virtual/", slug: "realidade-virtual", emoji: "🥽" },
    { label: "Consoles", href: "/catalogo/jogos-eletronicos/consoles/", slug: "jogos-eletronicos/consoles", emoji: "🎮" },
    { label: "Pinballs", href: "/catalogo/jogos-eletronicos/pinballs/", slug: "jogos-eletronicos/pinballs", emoji: "⚡" },
    { label: "Máquinas", href: "/catalogo/jogos-eletronicos/maquinas/", slug: "jogos-eletronicos/maquinas", emoji: "💪" },
    { label: "Jogos de Mesa", href: "/catalogo/jogos-de-mesa/", slug: "jogos-de-mesa", emoji: "🎱" },
    { label: "Infláveis & Infantil", href: "/catalogo/piscinas-inflaveis-cama-elastica-infantil/", slug: "piscinas-inflaveis-cama-elastica-infantil", emoji: "🎈" },
];

/** FAQ da home — espelhada 1:1 no FAQPage (spec §3 D7). Zero número inventado. */
const HOME_FAQ: FaqEntry[] = [
    {
        question: "Quanto custa alugar?",
        answer:
            "Depende de quatro coisas: o equipamento, a data (fim de semana e dezembro lotam antes), o bairro da entrega e quantos itens você aluga junto — combos saem melhor. Entrega, montagem, retirada e suporte já entram no valor, sem taxa escondida. Manda a data e o bairro no WhatsApp que a gente fecha o valor.",
    },
    {
        question: "E se chover?",
        answer:
            "Equipamento eletrônico precisa de cobertura (salão, tenda ou área coberta). Se a sua festa é ao ar livre, comenta com a gente no orçamento que a gente combina a proteção e o plano de reagendamento antes de fechar.",
    },
    {
        question: "E se o equipamento der problema no meio da festa?",
        answer:
            "A gente resolve: troca o equipamento ou manda técnico no local, sem custo. Todo item sai testado da nossa base e vai com contrato — se algo falhar, o problema é nosso, não seu.",
    },
    {
        question: "Qual o período da diária?",
        answer:
            "A diária cobre o período do seu evento. A gente alinha o horário de entrega, o tempo de uso e a retirada junto com o orçamento, de acordo com a sua festa.",
    },
    {
        question: "Vocês atendem o meu bairro?",
        answer:
            "Atendemos Osasco e toda a Grande São Paulo — incluindo a capital, Barueri, Carapicuíba, Guarulhos, Santo André e São Bernardo do Campo. Manda o bairro no WhatsApp que a gente confirma a entrega.",
    },
    {
        question: "Com quanta antecedência preciso reservar?",
        answer:
            "Quanto antes, melhor: fim de semana, novembro e dezembro lotam com semanas de antecedência. Fora da alta temporada, dá pra atender pedidos de última hora. Confirma a data no WhatsApp pra garantir o equipamento.",
    },
];

export default async function Home() {
    const items = await getCatalog();

    // Contagem REAL + foto do 1º produto com imagem, por categoria (spec D2).
    const categorias: CategoryCard[] = CATEGORIAS.map((cat) => {
        const inCat = items.filter((it) =>
            segmentsToSlug(it.key.split("/")).join("/").startsWith(cat.slug + "/")
        );
        const withImg = inCat.find((it) => it.imagens && it.imagens.length > 0);
        return {
            label: cat.label,
            href: cat.href,
            emoji: cat.emoji,
            count: inCat.length,
            image:
                withImg && withImg.imagens
                    ? getImagePath(withImg.key, withImg.imagens[0])
                    : null,
        };
    });

    return (
        <>
            {/* ============ D1 + D1.5 — Hero estático + trust strip ============ */}
            <HomeHero />

            <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-4 py-16 md:gap-28 md:px-6 md:py-20">
                {/* ============ D2 — Answer capsule + o que dá pra alugar ============ */}
                <section id="o-que-tem" className="scroll-mt-24">
                    <AnswerCapsule label="Aluguel de Games em 1 parágrafo">
                        A Aluguel de Games loca fliperamas, videokês, PS5, realidade virtual,
                        máquina de dança e jogos de mesa para festas e eventos em Osasco e toda
                        a Grande São Paulo. Você escolhe, a gente entrega montado e testado, com
                        contrato e nota fiscal. Orçamento pelo WhatsApp (11) 96526-1000. Desde 1993.
                    </AnswerCapsule>

                    <div className="mt-12">
                        <p className="label-arcade mb-3 text-pink-400">▸ Catálogo</p>
                        <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">
                            O que dá pra alugar?
                        </h2>
                        <p className="mt-3 max-w-2xl font-body text-muted-foreground">
                            Do fliperama clássico à realidade virtual. Toque numa categoria pra
                            ver os modelos, as fotos e pedir orçamento.
                        </p>
                    </div>

                    <div className="mt-8">
                        <CategoryGrid categories={categorias} />
                    </div>

                    {/* chips por ocasião (spec D2) */}
                    <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
                        <span className="label-arcade text-muted-foreground">▸ penso por ocasião:</span>
                        <Link href="/festas" className="rounded-full border border-border px-3 py-1.5 font-medium text-foreground transition-colors hover:border-cyan-400/50 hover:text-cyan-400">
                            🎂 Festa infantil
                        </Link>
                        <Link href="/festas#adulto" className="rounded-full border border-border px-3 py-1.5 font-medium text-foreground transition-colors hover:border-cyan-400/50 hover:text-cyan-400">
                            🎉 Aniversário adulto
                        </Link>
                        <Link href="/empresas" className="rounded-full border border-border px-3 py-1.5 font-medium text-foreground transition-colors hover:border-cyan-400/50 hover:text-cyan-400">
                            🏢 Evento de empresa
                        </Link>
                    </div>
                </section>

                {/* ============ D3 — Quanto custa ============ */}
                <section id="quanto-custa" className="scroll-mt-24">
                    <p className="label-arcade mb-3 text-yellow-400">▸ Transparência</p>
                    <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">
                        Quanto custa alugar?
                    </h2>
                    <p className="mt-3 max-w-2xl font-body text-muted-foreground">
                        A dobra que quase nenhum concorrente tem: o que pesa no preço, explicado
                        antes de você perguntar.
                    </p>
                    <div className="mt-8">
                        <PriceBlock />
                    </div>
                </section>

                {/* ============ D4 — Monte sua festa (widget) ============ */}
                <section id="montar" className="scroll-mt-24">
                    <p className="label-arcade mb-3 text-cyan-400">▸ Orçamento</p>
                    <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">
                        Monte sua festa e mande em 1 mensagem
                    </h2>
                    <p className="mt-3 max-w-2xl font-body text-muted-foreground">
                        Marca os itens, coloca a data e o bairro (ou não) e manda tudo no
                        WhatsApp já organizado. Sem formulário chato.
                    </p>
                    <div className="mt-8">
                        <QuoteWidget />
                    </div>
                </section>

                {/* ============ D5 — Como funciona ============ */}
                <section id="como-funciona" className="scroll-mt-24">
                    <p className="label-arcade mb-3 text-purple-400">▸ Do orçamento à retirada</p>
                    <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">
                        Como funciona
                    </h2>
                    <div className="mt-8">
                        <HowItWorks />
                    </div>
                </section>

                {/* ============ D6 — Prova ============ */}
                <section id="prova" className="scroll-mt-24">
                    <p className="label-arcade mb-3 text-pink-400">▸ Quem já jogou com a gente</p>
                    <ProofSection />
                </section>

                {/* ============ D7 — FAQ ============ */}
                <section id="faq" className="scroll-mt-24">
                    <p className="label-arcade mb-3 text-cyan-400">▸ Perguntas frequentes</p>
                    <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">
                        Ainda com dúvida?
                    </h2>
                    <div className="mt-8">
                        <FaqNative faqs={HOME_FAQ} />
                    </div>
                </section>

                {/* ============ D8 — CTA final ============ */}
                <section id="cta-final" className="scroll-mt-24">
                    <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-950/40 via-background to-background p-8 text-center md:p-14">
                        <div className="pointer-events-none absolute inset-0 dot-grid opacity-20" aria-hidden />
                        <div className="relative">
                            <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
                                Bora deixar a sua festa inesquecível?
                            </h2>
                            <p className="mx-auto mt-4 max-w-xl font-body text-muted-foreground md:text-lg">
                                Manda a data, o local e o que você curte. A gente responde com o
                                valor fechado — sem pressão de venda, sem letra miúda.
                            </p>
                            <div className="mt-8 flex flex-col items-center gap-4">
                                <WhatsAppCta surface="home" variant="primary">
                                    Pedir orçamento no WhatsApp
                                </WhatsAppCta>
                                <WhatsAppCtaMeta surface="home" />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
