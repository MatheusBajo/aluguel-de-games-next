/* src/components/sections/como-funciona/ComoFunciona.tsx */
"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";
import { WhatsAppCta, WhatsAppCtaMeta } from "@/components/cta/WhatsAppCta";

const steps = [
    {
        emoji: "🎮",
        icon: "game",
        number: "01",
        title: "Escolha seus Equipamentos",
        text: (
            <>
                Navegue pelo nosso <strong>catálogo completo</strong> e escolha os jogos e equipamentos perfeitos para seu evento. Monte o combo ideal!
            </>
        ),
        color: "from-blue-500 to-blue-700",
        bgColor: "bg-blue-500/10"
    },
    {
        emoji: "💬",
        icon: "chat",
        number: "02",
        title: "Orçamento Rápido",
        text: (
            <>
                Solicite seu orçamento via <strong>WhatsApp</strong> e receba uma proposta detalhada – simples e sem burocracia!
            </>
        ),
        color: "from-purple-500 to-purple-700",
        bgColor: "bg-purple-500/10"
    },
    {
        emoji: "🚚",
        icon: "truck",
        number: "03",
        title: "Entrega e Instalação",
        text: (
            <>
                Nossa equipe <strong>entrega, monta e testa</strong> todos os equipamentos antes do evento começar. <strong>Tudo pronto para diversão!</strong>
            </>
        ),
        color: "from-orange-500 to-orange-700",
        bgColor: "bg-orange-500/10"
    },
    {
        emoji: "🎉",
        icon: "party",
        number: "04",
        title: "Aproveite com Tranquilidade",
        text: (
            <>
                Curta seu evento! Ficamos <strong>disponíveis por telefone</strong> caso algum equipamento precise de ajuste.
            </>
        ),
        color: "from-green-500 to-green-700",
        bgColor: "bg-green-500/10"
    },
];

export default function ComoFunciona() {
    const scope = useRef<HTMLDivElement | null>(null);

    // Registra plugins do GSAP (só no browser, após hidratação)
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger, SplitText);
    }, []);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            /* DESKTOP (≥768px) */
            mm.add("(min-width:768px)", () => {
                const cards = gsap.utils.toArray<HTMLElement>(".step");
                gsap.set(cards, { autoAlpha: 0, y: 30 });

                const tlIn = gsap.timeline({ paused: true });

                cards.forEach((card, index) => {
                    const split = new SplitText(card.querySelector("h3")!, {
                        // cada palavra fica num wrapper; dentro dele ainda existem as chars
                        type: "words,chars",
                        wordsClass: "split-word",
                        charsClass: "split-char",
                    });
                    const chars = split.chars;

                    tlIn
                        .to(card, {
                            autoAlpha: 1,
                            y: 0,
                            duration: 0.4,
                            ease: "power3.out",
                        }, index * 0.15)
                        .from(
                            chars,
                            {
                                y: 18,
                                autoAlpha: 0,
                                ease: "power3.out",
                                stagger: 0.02,
                                duration: 0.35,
                            },
                            "<+0.05",
                        );
                });

                ScrollTrigger.create({
                    trigger: ".steps-grid",
                    start: "top 80%",
                    end: "bottom 20%",
                    onEnter: () => tlIn.restart(),
                    onEnterBack: () => tlIn.restart(),
                });
            });

            /* MOBILE (<768px) */
            mm.add("(max-width:767px)", () => {
                gsap.utils.toArray<HTMLElement>(".step").forEach((card) => {
                    gsap.set(card, { autoAlpha: 0, y: 30 });

                    const tl = gsap
                        .timeline({ paused: true })
                        .to(card, {
                            autoAlpha: 1,
                            y: 0,
                            duration: 0.4,
                            ease: "power3.out",
                        });

                    ScrollTrigger.create({
                        trigger: card,
                        start: "top 85%",
                        end: "bottom 15%",
                        onEnter: () => tl.play(),
                        onLeaveBack: () => {
                            tl.pause(0);
                            gsap.to(card, {
                                autoAlpha: 0,
                                y: -30,
                                duration: 0.3,
                                ease: "power2.in",
                            });
                        },
                    });
                });
            });
        }, scope);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={scope}
            className="relative overflow-hidden py-12 md:py-20 !max-w-full"
        >
            {/* Background decorativo com gradientes suaves */}
            <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
                {/* Gradiente suave no topo */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
                {/* Gradiente suave no bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
            </div>

            {/* Elementos decorativos */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 -left-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-6">
                {/* Header da seção */}
                <motion.div
                    className="text-center mb-12 md:mb-16"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="mb-4 text-3xl md:text-4xl lg:text-5xl font-bold">
                        Como{' '}
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Funciona
                        </span>
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
                        Processo simples e transparente do início ao fim.
                        Veja como é fácil ter entretenimento de qualidade no seu evento!
                    </p>
                </motion.div>

                {/* Grid de passos - Design melhorado */}
                <div className="steps-grid grid gap-6 md:gap-8 lg:gap-10 md:grid-cols-2 lg:grid-cols-4">
                    {steps.map(({ emoji, number, title, text, color, bgColor }, i) => (
                        <div
                            key={i}
                            className="step group relative"
                        >
                            {/* Card principal */}
                            <div className="relative h-full">
                                {/* Background com blur */}
                                <div className={`absolute inset-0 ${bgColor} rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500`} />

                                {/* Card content */}
                                <div className="relative h-full bg-card/80 backdrop-blur-sm rounded-3xl border border-border/50 p-6 md:p-8 transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-xl">
                                    {/* Número grande como watermark */}
                                    <div className="absolute top-4 right-4 text-6xl font-bold text-muted/10 select-none">
                                        {number}
                                    </div>

                                    {/* Conteúdo */}
                                    <div className="relative flex flex-col items-center text-center gap-4">
                                        {/* Ícone com gradiente */}
                                        <div className="relative">
                                            <div className={`absolute inset-0 bg-gradient-to-br ${color} rounded-2xl blur-lg opacity-60`} />
                                            <div className={`relative flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${color} shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                                <span className="select-none text-3xl md:text-4xl">
                                                    {emoji}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Título */}
                                        <h3 className="text-lg md:text-xl font-bold leading-tight mt-2">
                                            {title}
                                        </h3>

                                        {/* Descrição */}
                                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                                            {text}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Linha conectora melhorada (apenas desktop) */}
                            {i < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 left-[calc(100%)] right-[-2rem] z-0 px-1">
                                    <svg className="w-full h-2" viewBox="0 0 100 8" preserveAspectRatio="none">
                                        <path
                                            d="M0,4 L100,4"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeDasharray="10"
                                            className="text-muted-foreground/30"
                                            fill="none"
                                        />
                                    </svg>
                                    {/* Seta no final */}
                                    <div className="px-0.5 absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-muted-foreground/30" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Benefícios adicionais - Design melhorado */}
                <motion.div
                    className="mt-12 md:mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    {[
                        { text: "Orçamento sem compromisso", icon: "💰" },
                        { text: "Entrega pra toda Grande SP", icon: "🚚" },
                        { text: "Garantia de funcionamento", icon: "✅" }
                    ].map((benefit, i) => (
                        <motion.div
                            key={i}
                            className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-muted/30 to-muted/50 p-4 border border-border/50 transition-all duration-300"
                        >
                            <div className="flex-shrink-0 text-2xl">{benefit.icon}</div>
                            <span className="text-sm md:text-base font-medium">{benefit.text}</span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA melhorado */}
                <motion.div
                    className="relative mt-12 md:mt-20 flex flex-col items-center gap-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <div className="text-center">
                        <h3 className="text-xl md:text-2xl font-bold mb-2">
                            Pronto para começar?
                        </h3>
                        <p className="text-muted-foreground">
                            Entre em contato agora e receba seu orçamento personalizado!
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                        <WhatsAppCta surface="home" variant="primary">
                            Pedir orçamento no WhatsApp
                        </WhatsAppCta>
                        <WhatsAppCtaMeta surface="home" />
                    </div>
                </motion.div>
            </div>

            {/* Gradiente de transição suave no final */}
            <div className="absolute -bottom-1 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-background pointer-events-none z-20" />
        </section>
    );
}