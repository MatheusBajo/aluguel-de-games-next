"use client";
// src/components/home/HeroCarousel.tsx
//
// Carrossel do hero (SPEC-FINAL-V2 §3.1) — MANTIDO da opus-4.8, des-JSificado:
// - Slide 1 renderiza server-side como <img> priority (loading eager +
//   fetchpriority high) sobre um LQIP borrado. Sem JS, fica a foto 1 (o embla
//   só melhora depois; nunca gate de opacity:0 no LCP).
// - Autoplay SÓ pós-hidratação; não liga em prefers-reduced-motion; para em
//   interação/touch (stopOnInteraction). `sizes` correto.
// - Legenda DENTRO do scrim em TODO slide (≥12px, contraste AA), no HTML cru.
import { useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
    CarouselContent,
    CarouselItem,
    CarouselLanding,
} from "@/components/ui/carousel-landing";

interface Slide {
    image: string;
    caption: string;
}

// LQIP (base64, 24px borrado) do slide 1 — placa até a foto real pintar.
const SLIDE1_LQIP =
    "data:image/webp;base64,UklGRnIAAABXRUJQVlA4IGYAAABQBACdASoYAA4APwFsrU8rJiQiMAgBYCAJYgCdABu1u1V2+FmOHLTsPWvAAPKRz2cypIN13Coz/lf5PugTNQ2JeWJ0N2iy0SiA0TEgQScXktezhjDL4JaExdmhM0Ao+n28ZcH4pAA=";

const SLIDES: Slide[] = [
    { image: "/carousel/compressed/Martelo de força.webp", caption: "Martelo de Força" },
    { image: "/carousel/compressed/Boxing Machine.webp", caption: "Boxing Machine" },
    { image: "/carousel/compressed/PinballDaniloGentili.webp", caption: "Aniversário do Danilo Gentili · Pinball 007" },
    { image: "/carousel/compressed/da066c60-0c96-46ee-b01d-8f34deab7c6c.webp", caption: "Pinballs e fliperamas" },
    { image: "/carousel/compressed/Pebolim e dois fliperamas.webp", caption: "Pebolim + fliperamas" },
    { image: "/carousel/compressed/Braland.webp", caption: "Bradesco · Braland" },
    { image: "/carousel/compressed/c71c0260-95d7-4e66-9ca6-0bda25008d18.webp", caption: "Sinuca + air game" },
    { image: "/carousel/compressed/Karaokê Matrix Mesa.webp", caption: "Karaokê Matrix Mesa" },
    { image: "/carousel/compressed/Karaokê Matrix Slim.webp", caption: "Karaokê Matrix Slim" },
    { image: "/carousel/compressed/Karaokê Matrix 30000.webp", caption: "Karaokê Matrix 30.000" },
];

export default function HeroCarousel() {
    // Autoplay só existe após hidratação e fora de reduced-motion.
    const [plugins, setPlugins] = useState<ReturnType<typeof Autoplay>[]>([]);
    const autoplayRef = useRef<ReturnType<typeof Autoplay> | null>(null);

    useEffect(() => {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduced) return;
        autoplayRef.current = Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true });
        setPlugins([autoplayRef.current]);
    }, []);

    return (
        <div className="relative z-10 mx-auto w-full max-w-[1120px] select-none">
            <CarouselLanding
                slidesCount={SLIDES.length}
                plugins={plugins}
                className="relative w-full"
                opts={{ align: "start", loop: true }}
            >
                <CarouselContent>
                    {SLIDES.map((slide, index) => (
                        <CarouselItem key={index}>
                            <div
                                className="hero-lqip relative flex aspect-video max-h-[52vh] w-full items-center justify-center overflow-hidden rounded-2xl bg-zinc-900"
                                style={index === 0 ? { backgroundImage: `url(${SLIDE1_LQIP})` } : undefined}
                            >
                                <img
                                    src={slide.image}
                                    alt={slide.caption}
                                    className="h-full w-full object-cover"
                                    width={1280}
                                    height={720}
                                    sizes="(max-width: 1120px) 100vw, 1120px"
                                    loading={index === 0 ? "eager" : "lazy"}
                                    fetchPriority={index === 0 ? "high" : undefined}
                                    decoding={index === 0 ? "sync" : "async"}
                                />
                                {/* Scrim + legenda (em todo slide, no HTML cru, ≥12px AA) */}
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                                <p className="pointer-events-none absolute bottom-3 left-4 right-4 text-xs md:text-sm font-medium text-white drop-shadow-md">
                                    {slide.caption}
                                </p>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Corner brackets decorativos (categoria/HUD, não ação) */}
                <span className="pointer-events-none absolute top-3 left-3 z-20 h-6 w-6 border-t-2 border-l-2 border-cyan-400/70" />
                <span className="pointer-events-none absolute top-3 right-3 z-20 h-6 w-6 border-t-2 border-r-2 border-cyan-400/70" />
                <span className="pointer-events-none absolute bottom-3 left-3 z-20 h-6 w-6 border-b-2 border-l-2 border-cyan-400/70" />
                <span className="pointer-events-none absolute bottom-3 right-3 z-20 h-6 w-6 border-b-2 border-r-2 border-cyan-400/70" />
            </CarouselLanding>
        </div>
    );
}
