// src/components/sections/HeroSection.tsx
"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Autoplay from 'embla-carousel-autoplay';
import { CarouselContent, CarouselItem, CarouselLanding } from '@/components/ui/carousel-landing';
import { CardAntigo, CardContent } from '@/components/ui/card-antigo';
import { Button } from '@/components/ui/button';
import { FaWhatsapp, FaGamepad, FaStar } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

const carouselData = [
    {
        image: "/carousel/compressed/Martelo de força.png",
        title: "Martelo de Força",
        subtitle: "Desafie seus limites!",
        highlight: "Mais Popular",
        color: "from-red-600 to-orange-600"
    },
    {
        image: "/carousel/compressed/Boxing Machine.png",
        title: "Boxing Machine",
        subtitle: "Teste a força do seu soco!",
        highlight: "Novidade",
        color: "from-blue-600 to-purple-600"
    },
    {
        image: "/carousel/compressed/Braland.png",
        title: "Braland VR",
        subtitle: "Realidade Virtual Imersiva",
        highlight: "Parceiro",
        color: "from-purple-600 to-pink-600"
    },
    {
        image: "/carousel/compressed/Karaokê Matrix Mesa.png",
        title: "Karaokê Matrix",
        subtitle: "30.000 músicas para cantar!",
        highlight: "Sucesso",
        color: "from-green-600 to-teal-600"
    }
];

export default function StartCarouselClaude() {
    const autoplayRef = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animação de entrada suave
            gsap.fromTo('.hero-content',
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out' }
            );

            // Animação dos elementos flutuantes - reduzida em mobile
            const mm = gsap.matchMedia();

            mm.add("(min-width: 768px)", () => {
                gsap.to('.floating-element', {
                    y: -20,
                    duration: 3,
                    repeat: -1,
                    yoyo: true,
                    ease: 'power1.inOut',
                    stagger: 0.3
                });
            });

            mm.add("(max-width: 767px)", () => {
                gsap.to('.floating-element', {
                    y: -10,
                    duration: 4,
                    repeat: -1,
                    yoyo: true,
                    ease: 'power1.inOut',
                    stagger: 0.5
                });
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full dark:bg-violet-950/50 bg-violet-100 overflow-hidden pb-10">
            {/* Background gradiente animado com fade no bottom */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
                {/* Gradiente de fade no final da seção */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-20" />
            </div>

            {/* Elementos decorativos flutuantes - menores em mobile */}
            <div className="absolute inset-0 overflow-hidden max-w-screen-3xl px-5 mx-auto">
                <div className="floating-element absolute top-10 -left-20 w-40 h-40 md:top-20 md:left-10 md:w-72 md:h-72 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="floating-element absolute bottom-10 -right-20 w-40 h-40 md:bottom-20 md:right-10 md:w-96 md:h-96 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="floating-element absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[500px] md:h-[500px] bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-3xl" />
            </div>

            <div className="hero-content relative z-10 container mx-auto max-w-screen-3xl px-5 py-8 md:py-20">
                {/* Layout Mobile-First */}
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

                    {/* Carousel Mobile (aparece primeiro em mobile) */}
                    <div className="relative w-full lg:hidden">
                        <CarouselLanding
                            slidesCount={carouselData.length}
                            plugins={[autoplayRef.current]}
                            className="w-full"
                            opts={{ align: "center", loop: true }}
                        >
                            <CarouselContent>
                                {carouselData.map((item, index) => (
                                    <CarouselItem key={index}>
                                        <CardAntigo className="border-0 !p-0 overflow-hidden group bg-transparent">
                                            <CardContent className="relative p-0 rounded-2xl overflow-hidden ">
                                                <div className="relative aspect-[16/9]  !p-0 overflow-hidden">
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />

                                                    {/* Overlay Gradient */}
                                                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

                                                    {/* Badge */}
                                                    <div className="absolute top-4 right-4">
                                                        <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                                                            {item.highlight}
                                                        </span>
                                                    </div>

                                                    {/* Content Overlay */}
                                                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                                        <h3 className="text-2xl font-bold text-white mb-1">{item.title}</h3>
                                                        <p className="text-white/80">{item.subtitle}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </CardAntigo>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </CarouselLanding>

                        {/* Decoração do carousel - sutil em mobile */}
                        <div className="absolute -z-10 inset-0 scale-110">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-2xl" />
                        </div>
                    </div>

                    {/* Conteúdo Textual */}
                    <div className="text-center lg:text-left space-y-4 md:space-y-6">
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium">
                            <HiSparkles className="w-3 h-3 md:w-4 md:h-4" />
                            <span>Líder em Entretenimento</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                            Transforme seu
                            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Evento em Diversão
                            </span>
                        </h1>

                        <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0">
                            Aluguel de jogos e equipamentos de última geração.
                            Fliperamas, VR, Karaokê e muito mais!
                        </p>

                        {/* Estatísticas - Layout responsivo */}
                        <div className="grid grid-cols-3 gap-2 md:gap-4 py-4 md:py-6">
                            <div className="text-center lg:text-left">
                                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">500+</div>
                                <div className="text-xs md:text-sm text-muted-foreground">Eventos desde 1997</div>
                            </div>
                            <div className="text-center lg:text-left">
                                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">98%</div>
                                <div className="text-xs md:text-sm text-muted-foreground">Satisfação</div>
                            </div>
                            <div className="text-center lg:text-left">
                                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">24h</div>
                                <div className="text-xs md:text-sm text-muted-foreground">Suporte</div>
                            </div>
                        </div>

                        {/* CTAs - Stack em mobile */}
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
                            <Button asChild size="default" variant="cta" className="group w-full sm:w-auto">
                                <Link href="https://wa.me/+551142377766" target="_blank">
                                    <FaWhatsapp className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                                    Orçamento Grátis
                                </Link>
                            </Button>
                            <Button asChild variant="ctaOutline" size="default" className="w-full sm:w-auto !px-5">
                                <Link href="/catalogo">
                                    <FaGamepad className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                                    Ver Catálogo
                                </Link>
                            </Button>
                        </div>

                        {/* Social Proof - Simplificado em mobile*/}
                        {/*<div className="flex items-center gap-3 md:gap-4 justify-center lg:justify-start pt-2 md:pt-4">*/}
                        {/*    <div className="flex -space-x-2">*/}
                        {/*        {[1, 2, 3, 4].map((i) => (*/}
                        {/*            <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-muted border-2 border-background" />*/}
                        {/*        ))}*/}
                        {/*    </div>*/}
                        {/*    <div className="text-xs md:text-sm">*/}
                        {/*        <div className="flex items-center gap-0.5 md:gap-1">*/}
                        {/*            {[...Array(5)].map((_, i) => (*/}
                        {/*                <FaStar key={i} className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-current" />*/}
                        {/*            ))}*/}
                        {/*        </div>*/}
                        {/*        <p className="text-muted-foreground">+120 avaliações</p>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>

                    {/* Carousel Desktop (hidden em mobile) */}
                    <div className="relative hidden lg:block">
                        <CarouselLanding
                            slidesCount={carouselData.length}
                            plugins={[autoplayRef.current]}
                            className="w-full mx-auto"
                            opts={{ align: "start", loop: true }}
                        >
                            <CarouselContent>
                                {carouselData.map((item, index) => (
                                    <CarouselItem key={index}>
                                        <CardAntigo className="border-0 !p-0 overflow-hidden group bg-transparent">
                                            <CardContent className="relative p-0 rounded-2xl overflow-hidden select-none">
                                                <div className="relative aspect-[16/9] !p-0 overflow-hidden">
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />

                                                    {/* Overlay Gradient */}
                                                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

                                                    {/* Badge */}
                                                    <div className="absolute top-4 right-4">
                                                        <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                                                            {item.highlight}
                                                        </span>
                                                    </div>

                                                    {/* Content Overlay */}
                                                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                                        <h3 className="text-2xl font-bold text-white mb-1">{item.title}</h3>
                                                        <p className="text-white/80">{item.subtitle}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </CardAntigo>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </CarouselLanding>

                        {/* Decoração do carousel */}
                        <div className="absolute -z-10 inset-0 scale-110">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Gradiente suave de transição no topo da próxima seção */}
            <div className="absolute -bottom-1 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-background pointer-events-none z-20" />
        </section>
    );
}