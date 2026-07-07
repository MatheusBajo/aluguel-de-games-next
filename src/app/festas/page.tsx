// src/app/festas/page.tsx
//
// /festas — espelho B2C (spec §6), a LP de quem paga o Ads (NUNCA primeiro corte).
// Uma página com seções-âncora (#infantil, #adulto) — a spec §2 modela /festas
// como página única com âncoras, não sub-páginas (evita doorway/§11). Cada seção:
// mix sugerido + produtos linkados + foto REAL (legenda honesta, nunca foto
// genérica rotulada com nome de cliente) + a ocasião coberta. FAQ própria + FAQPage.
import type { Metadata } from "next";
import Link from "next/link";

import { AnswerCapsule } from "@/components/content/AnswerCapsule";
import { FaqNative } from "@/components/content/FaqNative";
import { WhatsAppCta, WhatsAppCtaMeta } from "@/components/cta/WhatsAppCta";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, type FaqEntry } from "@/lib/schema";

export const metadata: Metadata = {
    title: "Aluguel de games para festas: infantil, aniversário e família",
    description:
        "Fliperamas, videokês, realidade virtual, máquina de pegar bichinho e infláveis para festa infantil, aniversário adulto, bodas e festas de família em Osasco e Grande São Paulo. Entrega, montagem e suporte inclusos. Desde 1993.",
    alternates: { canonical: "https://www.alugueldegames.com.br/festas" },
    openGraph: {
        title: "Aluguel de games para festas",
        description:
            "Festa infantil, aniversário adulto e festas de família. Escolha por ocasião e peça orçamento pelo WhatsApp.",
        url: "https://www.alugueldegames.com.br/festas",
        siteName: "Aluguel de Games",
        locale: "pt_BR",
        type: "website",
    },
};

interface Ocasiao {
    id: string;
    emoji: string;
    titulo: string;
    cobre?: string;
    texto: string;
    /** Foto real (legenda honesta) — opcional. */
    foto?: { src: string; alt: string; legenda: string };
    sugestoes: { label: string; href: string }[];
}

const OCASIOES: Ocasiao[] = [
    {
        id: "infantil",
        emoji: "🎂",
        titulo: "Festa infantil",
        cobre: "Aniversário de criança · festa na escola · Dia das Crianças",
        texto:
            "A criançada entra na fila pra jogar e os pais respiram. Fliperama infantil, máquina de pegar bichinho, air game, infláveis e cama elástica seguram a energia do começo ao fim — e ainda rende foto boa pros pais.",
        foto: {
            src: "/carousel/compressed/Simulador Grua Fliperama.webp",
            alt: "Máquina de pegar bichinho (grua) e fliperama montados em evento",
            legenda: "Máquina de pegar bichinho e fliperama: hit garantido da criançada",
        },
        sugestoes: [
            { label: "Máquinas (garra, dança)", href: "/catalogo/jogos-eletronicos/maquinas/" },
            { label: "Fliperamas", href: "/catalogo/jogos-eletronicos/fliperamas/" },
            { label: "Infláveis & Infantil", href: "/catalogo/piscinas-inflaveis-cama-elastica-infantil/" },
            { label: "Air Games", href: "/catalogo/jogos-de-mesa/air-games/" },
        ],
    },
    {
        id: "adulto",
        emoji: "🎉",
        titulo: "Aniversário adulto, bodas e festas de família",
        cobre: "Aniversário · bodas · 50, 60, 70 e 80 anos · 15 anos · reencontro de família",
        texto:
            "Nostalgia de fliperama e pinball com videokê pra soltar a voz: o pessoal joga, canta e não larga. Funciona pra virada de idade, bodas, festa de 15 e aquele reencontro que junta três gerações na mesma sala.",
        foto: {
            src: "/carousel/compressed/PinballDaniloGentili.webp",
            alt: "Pinball montado na festa do Danilo Gentili",
            legenda: "Pinball na festa do Danilo Gentili",
        },
        sugestoes: [
            { label: "Pinballs", href: "/catalogo/jogos-eletronicos/pinballs/" },
            { label: "Videokê & Karaokê", href: "/catalogo/videokes/" },
            { label: "Fliperamas", href: "/catalogo/jogos-eletronicos/fliperamas/" },
            { label: "Realidade Virtual", href: "/catalogo/realidade-virtual/" },
        ],
    },
    {
        id: "empresa",
        emoji: "🏢",
        titulo: "Evento de empresa",
        cobre: "SIPAT · confraternização · ativação de marca",
        texto:
            "SIPAT, confraternização, ativação de marca. Com nota fiscal de locação, contrato e equipe no local — a parte formal a gente resolve. Tem uma página dedicada pra RH e compras, com kit de aprovação e cotação por e-mail.",
        sugestoes: [{ label: "Ver a página Empresas", href: "/empresas" }],
    },
];

const FAQ: FaqEntry[] = [
    {
        question: "Qual a idade mínima pra usar os equipamentos numa festa infantil?",
        answer:
            "Tem opção pra cada idade: fliperama infantil, air game infantil, máquina de pegar bichinho e infláveis são pensados pros pequenos. Conta a idade da criançada no WhatsApp que a gente sugere o mix certo pra faixa etária.",
    },
    {
        question: "Cabe num apartamento ou salão de festas?",
        answer:
            "Cabe — a gente ajusta o mix ao espaço que você tem. Manda o tamanho aproximado do salão (ou avisa que é apartamento) e se tem elevador ou escada, que a gente indica o que passa na porta e monta certinho no local.",
    },
    {
        question: "Quantos equipamentos pra quantos convidados?",
        answer:
            "Depende do público e do espaço, mas a regra é simples: quanto mais gente, mais atrações pra não formar fila chata. Manda o número de convidados que a gente sugere um mix equilibrado — e combo de itens sai melhor que alugar avulso.",
    },
    {
        question: "E se a festa for ao ar livre e chover?",
        answer:
            "Equipamento eletrônico precisa de cobertura (tenda, salão ou área coberta). Se a sua festa é ao ar livre, comenta no orçamento que a gente combina a proteção e o plano de reagendamento antes de fechar.",
    },
    {
        question: "Com quanta antecedência preciso reservar?",
        answer:
            "Quanto antes, melhor: fim de semana e o fim do ano enchem primeiro. Mas, mesmo em cima da hora, manda a data que a gente vê o que dá pra encaixar.",
    },
];

export default function FestasPage() {
    return (
        <main className="mx-auto w-full max-w-4xl px-4 py-16 md:px-6 md:py-20">
            <nav className="mb-6 font-mono text-xs text-muted-foreground" aria-label="Trilha">
                <Link href="/" className="hover:text-foreground">Início</Link>
                <span className="mx-1.5" aria-hidden>/</span>
                <span className="text-foreground">Festas</span>
            </nav>

            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
                Aluguel de games para a sua festa
            </h1>

            <div className="mt-6">
                <AnswerCapsule label="Escolha por ocasião">
                    Seja festa infantil, aniversário adulto ou festa de família, a Aluguel de
                    Games monta o mix certo de fliperamas, videokês, realidade virtual, máquinas
                    e infláveis pra sua ocasião, em Osasco e toda a Grande São Paulo. A gente
                    entrega montado e testado, com contrato e nota fiscal. Desde 1993. Orçamento
                    pelo WhatsApp (11) 96526-1000.
                </AnswerCapsule>
            </div>

            {/* Índice rápido por ocasião */}
            <div className="mt-6 flex flex-wrap gap-2">
                {OCASIOES.map((oc) => (
                    <a
                        key={oc.id}
                        href={`#${oc.id}`}
                        className="rounded-full border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-cyan-400/50 hover:text-cyan-400"
                    >
                        {oc.emoji} {oc.titulo}
                    </a>
                ))}
            </div>

            <div className="mt-10 flex flex-col gap-8">
                {OCASIOES.map((oc) => (
                    <section
                        key={oc.id}
                        id={oc.id}
                        className="scroll-mt-24 overflow-hidden rounded-2xl border border-border/60 bg-card/40"
                    >
                        {oc.foto && (
                            <figure className="relative">
                                <img
                                    src={oc.foto.src}
                                    alt={oc.foto.alt}
                                    className="aspect-[16/9] w-full object-cover"
                                    width={896}
                                    height={504}
                                    loading="lazy"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 to-transparent" />
                                <figcaption className="absolute inset-x-0 bottom-0 p-4 font-body text-sm text-white/90">
                                    {oc.foto.legenda}
                                </figcaption>
                            </figure>
                        )}

                        <div className="p-6 md:p-8">
                            <h2 className="flex items-center gap-3 font-display text-2xl font-extrabold tracking-tight md:text-3xl">
                                <span aria-hidden>{oc.emoji}</span>
                                {oc.titulo}
                            </h2>
                            {oc.cobre && (
                                <p className="mt-2 font-mono text-xs uppercase tracking-wider text-cyan-400">
                                    {oc.cobre}
                                </p>
                            )}
                            <p className="mt-3 font-body text-base leading-relaxed text-muted-foreground md:text-lg">
                                {oc.texto}
                            </p>
                            <div className="mt-5 flex flex-wrap items-center gap-2">
                                <span className="label-arcade text-muted-foreground">▸ combina bem:</span>
                                {oc.sugestoes.map((s) => (
                                    <Link
                                        key={s.href}
                                        href={s.href}
                                        className="rounded-full border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-cyan-400/50 hover:text-cyan-400"
                                    >
                                        {s.label} →
                                    </Link>
                                ))}
                            </div>
                            <div className="mt-5">
                                <WhatsAppCta surface="festas" variant="outline">
                                    Pedir orçamento pra essa ocasião
                                </WhatsAppCta>
                            </div>
                        </div>
                    </section>
                ))}
            </div>

            <section className="mt-14">
                <h2 className="mb-6 font-display text-2xl font-extrabold tracking-tight md:text-3xl">
                    Perguntas frequentes
                </h2>
                <FaqNative faqs={FAQ} />
            </section>

            <section className="mt-14 rounded-3xl border border-purple-500/30 bg-card/40 p-8 text-center md:p-12">
                <h2 className="mx-auto max-w-xl font-display text-2xl font-extrabold tracking-tight md:text-4xl">
                    Bora montar a sua festa?
                </h2>
                <div className="mt-6 flex flex-col items-center gap-4">
                    <WhatsAppCta surface="festas" variant="primary">
                        Pedir orçamento no WhatsApp
                    </WhatsAppCta>
                    <WhatsAppCtaMeta surface="festas" />
                </div>
            </section>

            <JsonLd
                data={breadcrumbSchema([
                    { name: "Início", url: "/" },
                    { name: "Festas", url: "/festas" },
                ])}
            />
        </main>
    );
}
