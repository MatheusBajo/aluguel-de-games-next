import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { WhatsAppCta, WhatsAppCtaMeta } from "@/components/cta/WhatsAppCta";
import { Counter } from "@/components/ui/Counter";

// /sobre (spec §6): fatos datáveis 1993→hoje + frase citável VERBATIM (idêntica à
// da home §9.3) + contador de anos (único número sem confirmação do dono). ENXUTO:
// história = tempero, não prato. ZERO missão/visão/valores (proibido §11).

export const metadata: Metadata = {
    title: "Sobre a Aluguel de Games — desde 1993 em São Paulo",
    description:
        "A história da Aluguel de Games: desde 1993 alugando fliperamas, videokês, realidade virtual e games para festas e eventos em Osasco e Grande São Paulo. Eventos para Bradesco, Spotify, Arnold Classic e Danilo Gentili.",
    alternates: { canonical: "https://www.alugueldegames.com.br/sobre" },
    openGraph: {
        title: "Sobre a Aluguel de Games — desde 1993",
        description:
            "Alugando games para festas e eventos em São Paulo desde 1993 — antes do primeiro PlayStation existir.",
        url: "https://www.alugueldegames.com.br/sobre",
        siteName: "Aluguel de Games",
        locale: "pt_BR",
        type: "website",
    },
};

const linhaDoTempo = [
    {
        ano: "1993",
        titulo: "Onde tudo começou",
        texto:
            "Nasce a Aluguel de Games, levando fliperama pra festas e eventos numa época em que a máquina ainda era a estrela das esquinas — antes do primeiro PlayStation existir.",
    },
    {
        ano: "Anos 2000",
        titulo: "O catálogo cresce",
        texto:
            "Videokês, máquinas de dança, simuladores e equipamentos para festa infantil entram no portfólio. A diversão ganha novos formatos.",
    },
    {
        ano: "Anos 2010",
        titulo: "Consoles em evento de empresa",
        texto:
            "PlayStation, Xbox e Nintendo Wii viram presença comum em confraternização de empresa. Nasce a operação corporativa, com nota fiscal e contrato.",
    },
    {
        ano: "Anos 2020",
        titulo: "Realidade Virtual e grandes ativações",
        texto:
            "Entram VR e simuladores imersivos. A gente atende de festa de aniversário a ativações de grande porte — Bradesco, Spotify, Arnold Classic e Danilo Gentili entre os eventos realizados.",
    },
    {
        ano: "Hoje",
        titulo: "Osasco e toda a Grande SP",
        texto:
            "A gente segue fazendo a mesma coisa de 1993, agora com um catálogo de dezenas de atrações e equipe experiente pra qualquer tipo de evento.",
    },
];

export default function SobrePage() {
    const anos = new Date().getFullYear() - 1993;

    return (
        <main className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 grid-tron opacity-40" aria-hidden />
            <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" aria-hidden />

            {/* ============= HERO ============= */}
            <section className="relative mx-auto max-w-5xl px-4 pt-16 pb-16 md:pt-24 md:pb-20">
                <nav className="mb-6 font-mono text-xs text-muted-foreground" aria-label="Trilha">
                    <Link href="/" className="hover:text-foreground">Início</Link>
                    <span className="mx-1.5" aria-hidden>/</span>
                    <span className="text-foreground">Sobre</span>
                </nav>

                <h1 className="font-display font-extrabold leading-[0.95] tracking-tight text-4xl sm:text-5xl md:text-6xl">
                    Desde <span className="text-neon">1993</span>, alugando games pra festa.
                </h1>

                <div className="mt-8 grid gap-10 md:grid-cols-[2fr_1fr] md:gap-16 md:items-end">
                    <p className="font-body text-lg leading-relaxed text-muted-foreground md:text-xl">
                        Quando um fliperama ainda era a estrela das esquinas, a gente decidiu
                        levá-lo pra festas e eventos. <strong className="text-foreground font-semibold">{anos} anos depois</strong>, é a mesma
                        coisa: fazer festa boa com jogo de verdade — agora também com videokê, VR,
                        consoles e dezenas de atrações no catálogo, em Osasco e toda a Grande São
                        Paulo.
                    </p>
                    <div className="md:border-l md:border-purple-500/30 md:pl-8">
                        <Counter
                            to={anos}
                            suffix="+"
                            duration={2.2}
                            className="numeral-huge-filled !text-7xl md:!text-8xl block"
                        />
                        <p className="label-arcade text-muted-foreground mt-2">Anos no mercado</p>
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-5xl px-4">
                <div className="divider-neon" />
            </div>

            {/* ============= LINHA DO TEMPO (fatos datáveis) ============= */}
            <section className="relative mx-auto max-w-5xl px-4 py-16 md:py-24">
                <h2 className="mb-12 font-display font-extrabold text-3xl md:text-5xl tracking-tight leading-[0.95]">
                    A trajetória, em datas.
                </h2>

                <ol>
                    {linhaDoTempo.map((item) => (
                        <li
                            key={item.ano}
                            className="group grid gap-2 border-t border-border/50 py-8 md:grid-cols-[180px_1fr] md:gap-12 md:py-10 transition-colors hover:border-purple-500/50"
                        >
                            <p className="font-display text-2xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                {item.ano}
                            </p>
                            <div className="md:pt-1">
                                <h3 className="font-display text-xl md:text-2xl font-bold mb-2">
                                    {item.titulo}
                                </h3>
                                <p className="font-body text-base text-muted-foreground max-w-2xl leading-relaxed">
                                    {item.texto}
                                </p>
                            </div>
                        </li>
                    ))}
                    <li className="border-t border-border/50" />
                </ol>
            </section>

            {/* ============= FRASE CITÁVEL (verbatim = home §9.3) ============= */}
            <section className="relative mx-auto max-w-5xl px-4 py-12">
                <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-card/40 p-8 md:p-12">
                    <p className="label-arcade text-cyan-400 mb-4">▸ Em uma frase</p>
                    <p className="font-body text-lg md:text-2xl leading-relaxed text-foreground">
                        A Aluguel de Games loca fliperamas, videokês e games para festas em Osasco
                        e Grande São Paulo desde 1993 — antes do primeiro PlayStation existir — com
                        eventos realizados para Bradesco, Spotify, Arnold Classic e Danilo Gentili.
                    </p>
                </div>
            </section>

            {/* ============= CTA ============= */}
            <section className="relative mx-auto max-w-5xl px-4 pb-24 md:pb-32 pt-8">
                <div className="text-center">
                    <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight leading-[0.95] mb-6">
                        Vai ter festa? Bora jogar junto.
                    </h2>
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <WhatsAppCta surface="home" variant="primary">
                                Pedir orçamento no WhatsApp
                            </WhatsAppCta>
                            <Button asChild size="lg" variant="outline">
                                <Link href="/catalogo">Explorar catálogo</Link>
                            </Button>
                        </div>
                        <WhatsAppCtaMeta surface="home" />
                    </div>
                </div>
            </section>
        </main>
    );
}
