// src/components/catalogo/ProductGallery.tsx
//
// Galeria do produto (SPEC-FINAL-V2 §4.2): scroll-snap CSS NATIVA (swipe no
// toque, sem depender de JS de arrasto), controles SEMPRE VISÍVEIS no mobile
// (não hover-gated — a crítica do opus-4.8 era "no touch os controles somem"),
// dots de posição, tap na foto = fullscreen (lightbox com zoom via <img>).
// 1ª imagem `priority`, dimensões fixas (aspect-square) contra CLS.
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight, FiMaximize2, FiX } from "react-icons/fi";
import { getImagePath } from "@/lib/image-utils";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
    images: string[];
    title: string;
    itemKey: string;
}

export function ProductGallery({ images, title, itemKey }: ProductGalleryProps) {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(0);
    const [lightbox, setLightbox] = useState<number | null>(null);

    const hasImages = images.length > 0;
    const multi = images.length > 1;

    // Índice ativo derivado da posição de scroll do trilho snap.
    const onScroll = useCallback(() => {
        const el = scrollerRef.current;
        if (!el) return;
        const i = Math.round(el.scrollLeft / el.clientWidth);
        setActive((prev) => (prev === i ? prev : i));
    }, []);

    const goTo = useCallback((i: number, smooth = true) => {
        const el = scrollerRef.current;
        if (!el) return;
        const clamped = (i + images.length) % images.length;
        el.scrollTo({ left: clamped * el.clientWidth, behavior: smooth ? "smooth" : "auto" });
        setActive(clamped);
    }, [images.length]);

    // Teclado no lightbox (setas + esc).
    useEffect(() => {
        if (lightbox === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setLightbox(null);
            else if (e.key === "ArrowRight") setLightbox((p) => (p === null ? p : (p + 1) % images.length));
            else if (e.key === "ArrowLeft") setLightbox((p) => (p === null ? p : (p - 1 + images.length) % images.length));
        };
        window.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [lightbox, images.length]);

    if (!hasImages) {
        return (
            <div className="flex aspect-square w-full items-center justify-center rounded-3xl border border-border/60 bg-muted/20">
                <p className="text-muted-foreground">Sem imagens disponíveis</p>
            </div>
        );
    }

    return (
        <div className="min-w-0 max-w-full select-none">
            {/* Trilho principal: scroll-snap nativo (swipe no touch) */}
            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-muted/20">
                <div
                    ref={scrollerRef}
                    onScroll={onScroll}
                    className="flex snap-x snap-mandatory overflow-x-auto scrollbar-hide"
                    style={{ scrollbarWidth: "none" }}
                >
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => setLightbox(idx)}
                            aria-label={`Ampliar ${title} — imagem ${idx + 1}`}
                            className="relative aspect-square w-full min-w-full shrink-0 cursor-zoom-in snap-start"
                        >
                            <Image
                                src={getImagePath(itemKey, img)}
                                alt={`${title} — imagem ${idx + 1}`}
                                fill
                                className="object-contain"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                priority={idx === 0}
                            />
                        </button>
                    ))}
                </div>

                {/* Setas — SEMPRE visíveis (mobile inclusive), não hover-gated */}
                {multi && (
                    <>
                        <button
                            type="button"
                            onClick={() => goTo(active - 1)}
                            aria-label="Imagem anterior"
                            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-background md:left-3"
                        >
                            <FiChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => goTo(active + 1)}
                            aria-label="Próxima imagem"
                            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-background md:right-3"
                        >
                            <FiChevronRight className="h-5 w-5" />
                        </button>
                    </>
                )}

                {/* Fullscreen — sempre visível */}
                <button
                    type="button"
                    onClick={() => setLightbox(active)}
                    aria-label="Ver em tela cheia"
                    className="absolute right-2 top-2 z-10 rounded-full bg-background/80 p-2 text-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-background md:right-3 md:top-3"
                >
                    <FiMaximize2 className="h-4 w-4" />
                </button>

                {multi && (
                    <div className="absolute bottom-2 left-2 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium tabular-nums backdrop-blur-sm md:bottom-3 md:left-3">
                        {active + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Dots de posição */}
            {multi && (
                <div className="mt-3 flex justify-center gap-1.5">
                    {images.map((_, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => goTo(idx)}
                            aria-label={`Ir para imagem ${idx + 1}`}
                            aria-current={active === idx}
                            className={cn(
                                "h-2 rounded-full transition-all",
                                active === idx ? "w-5 bg-purple-500" : "w-2 bg-muted-foreground/40 hover:bg-muted-foreground/70"
                            )}
                        />
                    ))}
                </div>
            )}

            {/* Miniaturas — scroll horizontal, tap troca a foto principal */}
            {multi && (
                <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: "none" }}>
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => goTo(idx)}
                            aria-label={`Miniatura ${idx + 1}`}
                            className={cn(
                                "relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all md:h-16 md:w-16",
                                active === idx ? "border-purple-500" : "border-transparent opacity-70 hover:opacity-100"
                            )}
                        >
                            <Image
                                src={getImagePath(itemKey, img)}
                                alt={`${title} — miniatura ${idx + 1}`}
                                fill
                                className="object-cover"
                                sizes="64px"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Lightbox fullscreen */}
            {lightbox !== null && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
                    onClick={() => setLightbox(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${title} em tela cheia`}
                >
                    <button
                        type="button"
                        onClick={() => setLightbox(null)}
                        aria-label="Fechar"
                        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2.5 text-white backdrop-blur-sm hover:bg-white/20"
                    >
                        <FiX className="h-6 w-6" />
                    </button>
                    {multi && (
                        <>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setLightbox((p) => (p === null ? p : (p - 1 + images.length) % images.length)); }}
                                aria-label="Imagem anterior"
                                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white backdrop-blur-sm hover:bg-white/20"
                            >
                                <FiChevronLeft className="h-6 w-6" />
                            </button>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setLightbox((p) => (p === null ? p : (p + 1) % images.length)); }}
                                aria-label="Próxima imagem"
                                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white backdrop-blur-sm hover:bg-white/20"
                            >
                                <FiChevronRight className="h-6 w-6" />
                            </button>
                        </>
                    )}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={getImagePath(itemKey, images[lightbox])}
                        alt={`${title} — imagem ${lightbox + 1}`}
                        className="max-h-[90vh] max-w-[92vw] object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                    {multi && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium tabular-nums text-white backdrop-blur-sm">
                            {lightbox + 1} / {images.length}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
