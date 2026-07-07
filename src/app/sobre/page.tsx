import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { WhatsAppCta, PhoneSupportLine } from "@/components/cta/WhatsAppCta";
import { Counter } from "@/components/ui/Counter";

export const metadata: Metadata = {
    title: "Sobre a Aluguel de Games — a mais antiga da Grande SP, desde 1993",
    description:
        "A Aluguel de Games loca fliperamas, videokês, realidade virtual e games para festas e eventos em Osasco e Grande São Paulo desde 1993. Clientes como Bradesco, Spotify, Arnold Classic e Danilo Gentili.",
    alternates: { canonical: "https://www.alugueldegames.com.br/sobre" },
    openGraph: {
        title: "Sobre a Aluguel de Games — Desde 1993",
        description:
            "A mais antiga do segmento na Grande SP. Nossa história, os clientes reais e como a gente trabalha.",
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
            "Nasce a Aluguel de Games, levando entretenimento de qualidade para festas e eventos em São Paulo numa época em que fliperama ainda era a estrela das esquinas.",
    },
    {
        ano: "2000s",
        titulo: "O catálogo cresce",
        texto:
            "Videokês, máquinas de dança, simuladores e equipamentos para festas infantis entram no portfólio. A diversão ganha novos formatos.",
    },
    {
        ano: "2010s",
        titulo: "Era dos consoles",
        texto:
            "PlayStation, Xbox e Nintendo Wii viram presença obrigatória em eventos corporativos. Atendemos confraternizações de empresas que viram parceiras de longa data.",
    },
    {
        ano: "2020s",
        titulo: "Realidade Virtual",
        texto:
            "Investimos em VR, Oculus Quest e simuladores imersivos. A diversão fica ainda mais sensorial — e ainda mais memorável.",
    },
    {
        ano: "Hoje",
        titulo: "Dezenas de atrações",
        texto:
            "Atendemos Osasco e toda a Grande São Paulo com a mesma pegada de 1993, agora com dezenas de atrações no catálogo e equipe experiente em qualquer tipo de evento.",
    },
];

export default function SobrePage() {
    const anos = new Date().getFullYear() - 1993;

    return (
        <main className="relative overflow-hidden">
            {/* Decorações de fundo */}
            <div className="pointer-events-none absolute inset-0 grid-tron opacity-50" aria-hidden />
            <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" aria-hidden />

            {/* ============= HERO EDITORIAL ============= */}
            <section className="relative mx-auto max-w-6xl px-4 pt-16 pb-24 md:pt-24 md:pb-32">
                <p className="rise-in label-arcade text-purple-400 mb-6">
                    <span className="inline-block w-12 h-px bg-purple-400 align-middle mr-3" />
                    Capítulo 01 · A história
                </p>

                <h1 className="rise-in font-display font-extrabold leading-[0.92] tracking-tight text-5xl sm:text-6xl md:text-7xl lg:text-8xl" style={{ animationDelay: '120ms' }}>
                    Desde <span className="text-neon">1993</span>,<br />
                    transformando<br />
                    <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent italic">
                        festas em memórias.
                    </span>
                </h1>

                <div className="rise-in mt-12 grid gap-12 md:grid-cols-[2fr_1fr] md:gap-20" style={{ animationDelay: '240ms' }}>
                    <p className="font-body text-lg md:text-xl leading-relaxed text-muted-foreground max-w-2xl">
                        Quando um fliperama ainda era a estrela das esquinas, decidimos levá-lo para
                        festas e eventos. <strong className="text-foreground font-semibold">{anos} anos depois</strong>, o trabalho segue o mesmo:
                        levar entretenimento de qualidade pra festa e evento na Grande SP — agora também
                        com VR, simuladores, consoles modernos e dezenas de atrações no catálogo.
                    </p>

                    <div className="space-y-4 md:border-l md:border-purple-500/30 md:pl-8">
                        <div>
                            <Counter
                                to={anos}
                                suffix="+"
                                duration={2.2}
                                className="numeral-huge-filled !text-7xl md:!text-8xl block"
                            />
                            <p className="label-arcade text-muted-foreground mt-2">Anos no mercado</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* divisor neon */}
            <div className="mx-auto max-w-6xl px-4">
                <div className="divider-neon" />
            </div>

            {/* ============= LINHA DO TEMPO EDITORIAL ============= */}
            <section className="relative mx-auto max-w-6xl px-4 py-24 md:py-32">
                <div className="mb-16 flex items-end justify-between gap-4 flex-wrap">
                    <div>
                        <p className="label-arcade text-cyan-400 mb-3">Capítulo 02 · A trajetória</p>
                        <h2 className="font-display font-extrabold text-4xl md:text-6xl tracking-tight leading-[0.95]">
                            Cinco capítulos.<br />
                            <span className="text-muted-foreground/70">Uma só história.</span>
                        </h2>
                    </div>
                    <p className="label-arcade text-muted-foreground">
                        ↓ scroll
                    </p>
                </div>

                <ol className="space-y-2 md:space-y-0">
                    {linhaDoTempo.map((item, i) => (
                        <li
                            key={item.ano}
                            className="rise-in group relative grid gap-2 border-t border-border/50 py-8 md:grid-cols-[180px_1fr] md:gap-12 md:py-10 transition-colors hover:border-purple-500/50"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <p className="font-display text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                {item.ano}
                            </p>
                            <div className="md:pt-2">
                                <h3 className="font-display text-xl md:text-2xl font-bold mb-2 transition-colors group-hover:text-purple-300">
                                    {item.titulo}
                                </h3>
                                <p className="font-body text-base text-muted-foreground max-w-2xl leading-relaxed">
                                    {item.texto}
                                </p>
                            </div>
                            {/* Decoração lateral */}
                            <span className="hidden md:block absolute right-0 top-10 label-arcade text-muted-foreground/40 group-hover:text-purple-400/60 transition-colors">
                                {String(i + 1).padStart(2, '0')}/{linhaDoTempo.length}
                            </span>
                        </li>
                    ))}
                    <li className="border-t border-border/50" />
                </ol>
            </section>

            {/* ============= PROVA (frase citável + clientes reais) ============= */}
            <section className="relative mx-auto max-w-6xl px-4 py-24">
                <div className="relative overflow-hidden rounded-3xl border-2 border-purple-500/30 bg-gradient-to-br from-blue-950/40 via-purple-950/40 to-pink-950/40 p-10 md:p-16">
                    <div className="absolute inset-0 dot-grid-dense opacity-30" aria-hidden />
                    <div className="relative">
                        <p className="label-arcade text-cyan-400 mb-3">Prova de campo</p>
                        <blockquote className="font-body text-lg md:text-2xl leading-relaxed text-foreground max-w-3xl">
                            A Aluguel de Games loca fliperamas, videokês e games para festas
                            em Osasco e Grande São Paulo desde 1993 — antes do primeiro
                            PlayStation existir — com eventos realizados para Bradesco,
                            Spotify, Arnold Classic e Danilo Gentili.
                        </blockquote>
                        <div className="mt-10 flex items-baseline gap-3">
                            <Counter
                                to={anos}
                                duration={2.2}
                                className="font-display font-extrabold text-5xl md:text-7xl tracking-tight bg-gradient-to-br from-blue-400 to-pink-400 bg-clip-text text-transparent tabular-nums"
                            />
                            <span className="label-arcade text-muted-foreground">anos de mercado</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============= CTA ============= */}
            <section className="relative mx-auto max-w-6xl px-4 pb-24 md:pb-32">
                <div className="text-center">
                    <p className="label-arcade text-purple-400 mb-4">Capítulo final · sua vez</p>
                    <h2 className="font-display font-extrabold text-4xl md:text-6xl tracking-tight leading-[0.95] mb-6">
                        Faça parte do<br />
                        <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                            próximo capítulo.
                        </span>
                    </h2>
                    <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto mb-8">
                        Transformamos qualquer evento em uma história pra contar depois.
                    </p>
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <WhatsAppCta
                                surface="home"
                                location="sobre_cta"
                                label="Pedir orçamento no WhatsApp"
                            />
                            <Button asChild size="lg" variant="outline">
                                <Link href="/catalogo">Explorar catálogo</Link>
                            </Button>
                        </div>
                        <PhoneSupportLine surface="home" location="sobre_cta" className="text-center" />
                    </div>
                </div>
            </section>
        </main>
    );
}
