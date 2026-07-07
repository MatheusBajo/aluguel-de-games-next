// src/components/home/HomeHero.tsx
//
// Hero compacto (SPEC-FINAL-V2 §3.1). SERVER component — H1 e sub no HTML cru.
// Ordem do 1º viewport (390×844): badge → H1 → sub → CTA dual + linha tel.
// O carrossel (~40-52vh) e a trust strip entram no scroll seguinte (a promessa
// "tudo em ≤70vh" foi abandonada — crítica procedente do dono).
//
// LCP: o H1 é o maior elemento e NUNCA nasce opacity:0 (rejeição explícita da
// spec). A antiga animação letter-by-letter (GSAP, gate opacity:0) foi trocada
// pelo shine CSS do span `.gradient-slide` — o texto pinta imediato.
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WhatsAppCta, PhoneSupportLine } from "@/components/cta/WhatsAppCta";
import { anosDeMercado } from "@/config/business.config";
import HeroCarousel from "@/components/home/HeroCarousel";

export default function HomeHero() {
    const anos = anosDeMercado();

    return (
        <section className="relative w-full overflow-hidden pt-6 pb-10 md:pt-10 md:pb-14">
            {/* Decorações (categoria/HUD, não ação) */}
            <div className="pointer-events-none absolute inset-0 grid-tron opacity-30" aria-hidden />
            <div className="pointer-events-none absolute -top-20 right-10 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute -bottom-20 left-10 h-72 w-72 rounded-full bg-pink-500/15 blur-3xl" aria-hidden />
            <div className="section-fade-bottom" aria-hidden />

            <div className="relative mx-auto w-full max-w-[1120px] px-4 md:px-5">
                {/* ===== 1º VIEWPORT: badge + H1 + sub + CTA + tel ===== */}
                <header className="mx-auto max-w-3xl text-center md:text-left">
                    <p className="label-arcade text-cyan-400 mb-4 inline-flex items-center gap-2">
                        <span aria-hidden>★</span>
                        <span>Desde 1993 · Osasco e Grande SP</span>
                    </p>

                    <h1 className="font-display font-extrabold leading-[0.95] tracking-tight text-[2rem] sm:text-5xl md:text-6xl">
                        Aluguel de fliperama, videokê e games{" "}
                        <span className="font-normal italic text-muted-foreground/70">pra sua festa.</span>{" "}
                        <span className="gradient-slide italic">Desde 1993.</span>
                    </h1>

                    <p className="mt-5 font-body text-base md:text-lg text-muted-foreground max-w-2xl mx-auto md:mx-0">
                        Entrega, montagem e suporte inclusos na Grande São Paulo.
                    </p>

                    {/* CTA dual + linha de telefone / fora-do-horário */}
                    <div className="mt-7 flex flex-col items-center gap-3 md:items-start">
                        <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
                            <WhatsAppCta
                                surface="home"
                                location="hero"
                                label="Pedir orçamento no WhatsApp"
                                className="hero-cta-primary w-full sm:w-auto"
                            />
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="hero-cta-secondary w-full sm:w-auto font-semibold text-base px-8 border-2 hover:border-purple-500/60 hover:bg-purple-500/10"
                            >
                                <Link href="#catalogo-por-ocasiao">
                                    <span className="mr-2" aria-hidden>🎮</span>
                                    Ver catálogo
                                </Link>
                            </Button>
                        </div>
                        <PhoneSupportLine surface="home" location="hero" className="text-center md:text-left" />
                    </div>
                </header>

                {/* ===== CARROSSEL (abaixo do CTA, ~40-52vh) ===== */}
                <div className="mt-9 md:mt-12">
                    <HeroCarousel />
                </div>

                {/* Único counter permitido: anos de mercado (derivado de 1993). */}
                <p className="mt-8 flex items-baseline justify-center gap-2 text-base md:text-lg text-muted-foreground">
                    <span className="font-display font-extrabold text-2xl md:text-3xl text-foreground tabular-nums">
                        {anos}
                    </span>
                    <span className="font-medium">anos alugando games pra festas e eventos</span>
                </p>
            </div>
        </section>
    );
}
