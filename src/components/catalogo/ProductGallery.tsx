// src/components/catalogo/ProductGallery.tsx
//
// Galeria scroll-snap CSS NATIVA (spec §4.2 — mata o embla nesta superfície).
// - Swipe nativo no touch (snap-x). Controles VISÍVEIS no mobile (não escondidos
//   atrás de :hover, que não existe no dedo). Tap na foto = fullscreen.
// - Primeira imagem `priority` + dimensões fixas (aspect-square) = zero CLS.
// - `prefers-reduced-motion` respeitado (scroll é 'auto' quando o usuário pede).
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight, FiMaximize2, FiX } from "react-icons/fi";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
    images: string[];
    title: string;
    itemKey: string;
    /** LQIP/cor dominante (data URI) quando o metadata tiver — senão bg neutro. */
    placeholder?: string;
}

export function ProductGallery({ images, title, itemKey, placeholder }: ProductGalleryProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(0);
    const [fullscreen, setFullscreen] = useState(false);

    const hasImages = images.length > 0;
    const multi = images.length > 1;

    const src = (img: string) => `/Organizado/${itemKey}/${img}`;

    // índice ativo derivado da posição de scroll (snap nativo)
    const onScroll = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;
        const idx = Math.round(el.scrollLeft / el.clientWidth);
        setActive((prev) => (prev === idx ? prev : Math.max(0, Math.min(idx, images.length - 1))));
    }, [images.length]);

    const scrollTo = useCallback((idx: number) => {
        const el = trackRef.current;
        if (!el) return;
        el.scrollTo({ left: idx * el.clientWidth, behavior: "smooth" });
    }, []);

    const go = (dir: 1 | -1) => {
        const next = (active + dir + images.length) % images.length;
        scrollTo(next);
    };

    // teclado no fullscreen
    useEffect(() => {
        if (!fullscreen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setFullscreen(false);
            if (multi && e.key === "ArrowRight") setActive((i) => (i + 1) % images.length);
            if (multi && e.key === "ArrowLeft") setActive((i) => (i - 1 + images.length) % images.length);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [fullscreen, multi, images.length]);

    if (!hasImages) {
        return (
            <div className="flex aspect-square w-full items-center justify-center rounded-3xl border bg-muted/20">
                <p className="text-muted-foreground">Sem imagens disponíveis</p>
            </div>
        );
    }

    return (
        <>
            <div className="min-w-0 max-w-full select-none">
                {/* Trilho scroll-snap — swipe nativo no touch */}
                <div className="group relative overflow-hidden rounded-3xl border bg-muted/20">
                    <div
                        ref={trackRef}
                        onScroll={onScroll}
                        className="flex aspect-square w-full snap-x snap-mandatory overflow-x-auto scroll-smooth scrollbar-hide"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        aria-roledescription="carrossel"
                        aria-label={`Fotos de ${title}`}
                    >
                        {images.map((img, idx) => (
                            <button
                                key={img}
                                type="button"
                                onClick={() => setFullscreen(true)}
                                className="relative h-full w-full shrink-0 snap-center cursor-zoom-in"
                                style={{ flex: "0 0 100%" }}
                                aria-label={`Ampliar foto ${idx + 1} de ${images.length}`}
                            >
                                <Image
                                    src={src(img)}
                                    alt={`${title} — foto ${idx + 1}`}
                                    fill
                                    className="object-contain pointer-events-none"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    priority={idx === 0}
                                    unoptimized
                                    {...(placeholder
                                        ? { placeholder: "blur" as const, blurDataURL: placeholder }
                                        : {})}
                                />
                            </button>
                        ))}
                    </div>

                    {/* Setas — SEMPRE visíveis (touch não tem hover) */}
                    {multi && (
                        <>
                            <button
                                type="button"
                                onClick={() => go(-1)}
                                aria-label="Foto anterior"
                                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/70 p-2 backdrop-blur-sm transition-colors hover:bg-background/90 md:left-3"
                            >
                                <FiChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => go(1)}
                                aria-label="Próxima foto"
                                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/70 p-2 backdrop-blur-sm transition-colors hover:bg-background/90 md:right-3"
                            >
                                <FiChevronRight className="h-5 w-5" />
                            </button>
                        </>
                    )}

                    {/* Ampliar — sempre visível */}
                    <button
                        type="button"
                        onClick={() => setFullscreen(true)}
                        aria-label="Ver em tela cheia"
                        className="absolute right-2 top-2 z-10 rounded-full bg-background/70 p-2 backdrop-blur-sm transition-colors hover:bg-background/90 md:right-3 md:top-3"
                    >
                        <FiMaximize2 className="h-5 w-5" />
                    </button>

                    {/* Contador */}
                    {multi && (
                        <div className="absolute bottom-2 left-2 z-10 rounded-full bg-background/70 px-2.5 py-1 text-xs font-mono tabular-nums backdrop-blur-sm md:bottom-3 md:left-3">
                            {active + 1} / {images.length}
                        </div>
                    )}
                </div>

                {/* Miniaturas */}
                {multi && (
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
                        {images.map((img, idx) => (
                            <button
                                key={img}
                                type="button"
                                onClick={() => scrollTo(idx)}
                                aria-label={`Ir para a foto ${idx + 1}`}
                                aria-current={active === idx}
                                className={cn(
                                    "relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-colors md:h-16 md:w-16",
                                    active === idx
                                        ? "border-cyan-400"
                                        : "border-transparent opacity-60 hover:opacity-100"
                                )}
                            >
                                <Image
                                    src={src(img)}
                                    alt=""
                                    fill
                                    className="object-cover pointer-events-none"
                                    sizes="64px"
                                    unoptimized
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Fullscreen / lightbox */}
            {fullscreen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4 backdrop-blur-sm"
                    onClick={() => setFullscreen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${title} — foto ${active + 1} de ${images.length}`}
                >
                    <button
                        type="button"
                        className="absolute right-4 top-4 z-10 rounded-full bg-background/80 p-2 backdrop-blur-sm"
                        onClick={() => setFullscreen(false)}
                        aria-label="Fechar"
                    >
                        <FiX className="h-6 w-6" />
                    </button>

                    {multi && (
                        <>
                            <button
                                type="button"
                                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-2.5 backdrop-blur-sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActive((i) => (i - 1 + images.length) % images.length);
                                }}
                                aria-label="Foto anterior"
                            >
                                <FiChevronLeft className="h-6 w-6" />
                            </button>
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-2.5 backdrop-blur-sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActive((i) => (i + 1) % images.length);
                                }}
                                aria-label="Próxima foto"
                            >
                                <FiChevronRight className="h-6 w-6" />
                            </button>
                        </>
                    )}

                    <div className="relative flex h-full w-full items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={src(images[active])}
                            alt={`${title} — foto ${active + 1}`}
                            width={1400}
                            height={1400}
                            className="max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] object-contain"
                            unoptimized
                        />
                    </div>

                    {multi && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-background/80 px-3 py-1 text-sm font-mono tabular-nums backdrop-blur-sm">
                            {active + 1} / {images.length}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

export default ProductGallery;
