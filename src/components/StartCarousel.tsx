/* src/components/StartCarousel.tsx */
"use client";
import { CarouselContent, CarouselItem, CarouselLanding } from "@/components/ui/carousel-landing";
import { CarouselOverlayGradient } from "@/components/ui/CarouselOverlayGradient";
import { CardAntigo, CardContent } from "@/components/ui/card-antigo";
import { useEffect, useLayoutEffect, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import AnimatedCarouselText from "@/components/AnimatedCarouselText";
import { AnimatedHeadline } from "@/components/ui/AnimatedHeadline";
import { Counter } from "@/components/ui/Counter";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaWhatsapp } from "react-icons/fa";
import { WHATSAPP_CONFIG } from "@/config/whatsapp.config";

const carouselItems = [
    { image: "/carousel/compressed/Martelo de força.webp", text: "Martelo de Força — Desafie seus limites" },
    { image: "/carousel/compressed/Boxing Machine.webp", text: "Boxing Machine — Teste seu soco" },
    { image: "/carousel/compressed/PinballDaniloGentili.webp", text: "Aniversário do Danilo Gentili — Pinball 007" },
    { image: "/carousel/compressed/da066c60-0c96-46ee-b01d-8f34deab7c6c.webp", text: "Pinballs e Fliperamas" },
    { image: "/carousel/compressed/Pebolim e dois fliperamas.webp", text: "Pebolim + Fliperamas" },
    { image: "/carousel/compressed/Braland.webp", text: "Braland — Evento do Bradesco" },
    { image: "/carousel/compressed/c71c0260-95d7-4e66-9ca6-0bda25008d18.webp", text: "Sinuca + Air Game Quântico" },
    { image: "/carousel/compressed/Karaokê Matrix Mesa.webp", text: "Karaokê Matrix Mesa — Solte a voz" },
    { image: "/carousel/compressed/Karaokê Matrix Slim.webp", text: "Karaokê Matrix Slim — Compacto e poderoso" },
    { image: "/carousel/compressed/Karaokê Matrix 30000.webp", text: "Karaokê Matrix 30.000 — Opções intermináveis" },
];

function StartCarousel() {
    const autoplayRef = useRef(Autoplay({ delay: 3500, stopOnInteraction: true }));

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger, SplitText);
    }, []);

    useLayoutEffect(() => {
        gsap.to(".div-carousel", { y: 0, opacity: 1, duration: 1.4, ease: "power3.out" });
        return () => gsap.killTweensOf(".div-carousel");
    }, []);

    return (
        <section className="relative w-full overflow-hidden pt-8 pb-12 md:pt-12 md:pb-16">
            {/* Decorações */}
            <div className="pointer-events-none absolute inset-0 grid-tron opacity-30" aria-hidden />
            <div className="pointer-events-none absolute -top-20 right-10 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute -bottom-20 left-10 h-72 w-72 rounded-full bg-pink-500/15 blur-3xl" aria-hidden />
            {/* Fade pro fundo no rodapé da seção — evita corte duro com a próxima section */}
            <div className="section-fade-bottom" aria-hidden />

            <div className="relative mx-auto w-full max-w-[1400px] px-4 md:px-5">

                {/* ============= HERO HEADLINE ============= */}
                <header className="mb-6 md:mb-10 text-center md:text-left max-w-3xl md:mx-auto">
                    <p className="rise-in label-arcade text-cyan-400 mb-4 inline-flex items-center gap-2">
                        <span className="badge-live text-cyan-400">★</span>
                        <span>Desde 1993 · Grande SP</span>
                    </p>

                    <AnimatedHeadline
                        delay={0.15}
                        className="font-display font-extrabold leading-[0.92] tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
                    >
                        Aluguel de games{" "}
                        <span className="text-muted-foreground/70 font-normal italic">pra sua festa</span><br />
                        <span className="gradient-slide italic">ser inesquecível.</span>
                    </AnimatedHeadline>

                    <p className="rise-in mt-5 font-body text-base md:text-lg text-muted-foreground max-w-2xl mx-auto md:mx-0" style={{ animationDelay: '900ms' }}>
                        Da nostalgia do fliperama à imersão da realidade virtual.
                        Entrega, montagem e suporte disponível em toda a Grande SP.
                    </p>
                </header>

                {/* ============= CARROSSEL ============= */}
                <div className="div-carousel relative z-10 select-none opacity-0 translate-y-[-30px]">
                    <CarouselLanding
                        slidesCount={carouselItems.length}
                        plugins={[autoplayRef.current]}
                        className="relative mx-auto w-full max-w-[1280px]"
                        opts={{ align: "start", loop: true }}
                    >
                        <CarouselOverlayGradient images={carouselItems.map((i) => i.image)} />

                        <CarouselContent>
                            {carouselItems.map(({ image }, index) => (
                                <CarouselItem key={index}>
                                    <CardAntigo className="rounded-2xl overflow-hidden border-none p-0">
                                        <CardContent className="relative flex items-center justify-center p-0 overflow-hidden w-full aspect-video max-h-[640px]">
                                            <img
                                                src={image}
                                                alt={`Imagem Carousel ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Gradient overlay mais forte na base pra texto ficar legível */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                                        </CardContent>
                                    </CardAntigo>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        {/* Texto animado das letras (mantido — gosta da animação) */}
                        <AnimatedCarouselText texts={carouselItems.map((i) => i.text)} />

                        {/* Corner brackets decorativos */}
                        <span className="pointer-events-none absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-cyan-400/70 z-20" />
                        <span className="pointer-events-none absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-cyan-400/70 z-20" />
                        <span className="pointer-events-none absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-cyan-400/70 z-20" />
                        <span className="pointer-events-none absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-cyan-400/70 z-20" />
                    </CarouselLanding>
                </div>

                {/* ============= CTAs (responsive, sempre dentro da tela) ============= */}
                <div className="rise-in mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3" style={{ animationDelay: '380ms' }}>
                    <Button
                        asChild
                        size="lg"
                        className="hero-cta-primary w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 font-semibold text-base px-8 shadow-lg shadow-green-500/30"
                    >
                        <Link href={WHATSAPP_CONFIG.link} target="_blank" rel="noopener noreferrer">
                            <FaWhatsapp className="mr-2 h-5 w-5" />
                            Pedir orçamento
                        </Link>
                    </Button>

                    <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="hero-cta-secondary w-full sm:w-auto font-semibold text-base px-8 border-2 hover:border-purple-500/60 hover:bg-purple-500/10"
                    >
                        <Link href="/catalogo">
                            <span className="mr-2">🎮</span>
                            Ver catálogo
                        </Link>
                    </Button>
                </div>

                {/* Stats abaixo dos CTAs com counter animado */}
                <div className="rise-in mt-10 md:mt-12 flex flex-wrap items-baseline justify-center gap-x-8 gap-y-4 text-base md:text-xl text-muted-foreground" style={{ animationDelay: '900ms' }}>
                    <span className="flex items-baseline gap-2">
                        <Counter to={33} suffix="+" duration={2.2} className="font-display font-extrabold text-2xl md:text-4xl text-foreground tabular-nums" />
                        <span className="font-medium">anos</span>
                    </span>
                    <span className="text-muted-foreground/30 text-2xl">·</span>
                    <span className="flex items-baseline gap-2">
                        <Counter to={500} suffix="+" duration={2.5} className="font-display font-extrabold text-2xl md:text-4xl text-foreground tabular-nums" />
                        <span className="font-medium">eventos</span>
                    </span>
                    <span className="text-muted-foreground/30 text-2xl">·</span>
                    <span className="flex items-baseline gap-2">
                        <Counter to={60} suffix="+" duration={2.2} className="font-display font-extrabold text-2xl md:text-4xl text-foreground tabular-nums" />
                        <span className="font-medium">equipamentos</span>
                    </span>
                </div>

                {/* ============= TRUST BAR ============= */}
                <div className="rise-in mt-12 md:mt-16 border-t border-b border-border/40 py-5" style={{ animationDelay: '1100ms' }}>
                    <div className="flex flex-wrap items-center justify-center gap-x-8 md:gap-x-12 gap-y-3 text-xs md:text-sm">
                        <span className="label-arcade text-muted-foreground/60">▸ atendemos</span>
                        <span className="font-mono font-bold text-foreground/80">Grandes empresas</span>
                        <span className="text-muted-foreground/30">·</span>
                        <span className="font-mono font-bold text-foreground/80">Personalidades públicas</span>
                        <span className="text-muted-foreground/30">·</span>
                        <span className="font-mono font-bold text-foreground/80">Festas particulares</span>
                        <span className="text-muted-foreground/30">·</span>
                        <span className="font-mono font-bold text-foreground/80">Eventos corporativos</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default StartCarousel;
