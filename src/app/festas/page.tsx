// src/app/festas/page.tsx
//
// /festas — espelho B2C (spec §6). Versão LEAN do estágio 2: a home (chips por
// ocasião) linka pra cá, então não pode ser link morto. A versão completa
// (mix por ocasião + 3 produtos linkados + foto real + FAQ por seção, bodas /
// 60-70-80 / 15 anos) fica pra fase 5. NUNCA primeiro corte — é a LP de quem
// paga o Ads. Âncoras #infantil e #adulto batem com os chips da home.
import type { Metadata } from "next";
import Link from "next/link";

import { AnswerCapsule } from "@/components/content/AnswerCapsule";
import { FaqNative } from "@/components/content/FaqNative";
import { WhatsAppCta, WhatsAppCtaMeta } from "@/components/cta/WhatsAppCta";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, type FaqEntry } from "@/lib/schema";

export const metadata: Metadata = {
    title: "Aluguel de games para festas: infantil, aniversário e eventos",
    description:
        "Fliperamas, videokês, realidade virtual e infláveis para festa infantil, aniversário adulto e comemorações em Osasco e Grande São Paulo. Entrega, montagem e suporte inclusos. Desde 1993.",
    alternates: { canonical: "https://www.alugueldegames.com.br/festas" },
    openGraph: {
        title: "Aluguel de games para festas",
        description:
            "Festa infantil, aniversário adulto e comemorações. Escolha por ocasião e peça orçamento pelo WhatsApp.",
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
    texto: string;
    sugestoes: { label: string; href: string }[];
}

const OCASIOES: Ocasiao[] = [
    {
        id: "infantil",
        emoji: "🎂",
        titulo: "Festa infantil",
        texto:
            "A criançada entra na fila pra jogar e os pais respiram. Fliperama infantil, infláveis, cama elástica e air game seguram a energia do começo ao fim.",
        sugestoes: [
            { label: "Fliperamas", href: "/catalogo/jogos-eletronicos/fliperamas/" },
            { label: "Infláveis & Infantil", href: "/catalogo/piscinas-inflaveis-cama-elastica-infantil/" },
            { label: "Jogos de Mesa", href: "/catalogo/jogos-de-mesa/" },
        ],
    },
    {
        id: "adulto",
        emoji: "🎉",
        titulo: "Aniversário adulto e comemorações",
        texto:
            "Aniversário, bodas, reencontro, virada de idade. Nostalgia de fliperama e pinball com videokê pra soltar a voz — o pessoal joga, canta e não larga.",
        sugestoes: [
            { label: "Pinballs", href: "/catalogo/jogos-eletronicos/pinballs/" },
            { label: "Videokê & Karaokê", href: "/catalogo/videokes/" },
            { label: "Realidade Virtual", href: "/catalogo/realidade-virtual/" },
        ],
    },
    {
        id: "empresa",
        emoji: "🏢",
        titulo: "Evento de empresa",
        texto:
            "SIPAT, confraternização, ativação de marca. Com nota fiscal de locação, contrato e equipe no local — a parte formal a gente resolve. Página dedicada pra RH e compras.",
        sugestoes: [{ label: "Ver a página Empresas", href: "/empresas" }],
    },
];

const FAQ: FaqEntry[] = [
    {
        question: "Qual a idade mínima pra usar os equipamentos numa festa infantil?",
        answer:
            "Tem opção pra cada idade: fliperama infantil, air game infantil e infláveis são pensados pros pequenos. Conta a idade da criançada no WhatsApp que a gente sugere o mix certo pra faixa etária.",
    },
    {
        question: "Cabe num apartamento ou salão de festas?",
        answer:
            "Cabe — a gente ajusta o mix ao espaço que você tem. Manda o tamanho aproximado do salão (ou que é apartamento) junto com o orçamento que a gente indica o que passa na porta e no elevador.",
    },
    {
        question: "E se a festa for ao ar livre e chover?",
        answer:
            "Equipamento eletrônico precisa de cobertura (tenda, salão ou área coberta). Se a sua festa é ao ar livre, comenta no orçamento que a gente combina a proteção e o plano de reagendamento antes de fechar.",
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
                    Seja festa infantil, aniversário adulto ou comemoração de família, a Aluguel
                    de Games monta o mix certo de fliperamas, videokês, realidade virtual,
                    infláveis e jogos de mesa pra sua ocasião, em Osasco e toda a Grande São
                    Paulo. A gente entrega montado e testado, com contrato e nota fiscal. Desde
                    1993. Orçamento pelo WhatsApp (11) 96526-1000.
                </AnswerCapsule>
            </div>

            <div className="mt-12 flex flex-col gap-8">
                {OCASIOES.map((oc) => (
                    <section
                        key={oc.id}
                        id={oc.id}
                        className="scroll-mt-24 rounded-2xl border border-border/60 bg-card/40 p-6 md:p-8"
                    >
                        <h2 className="flex items-center gap-3 font-display text-2xl font-extrabold tracking-tight md:text-3xl">
                            <span aria-hidden>{oc.emoji}</span>
                            {oc.titulo}
                        </h2>
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
