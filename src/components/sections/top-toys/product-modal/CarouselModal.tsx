/* -----------------------------------------------------------
 * components/sections/top-toys/product-modal/CarouselModal.tsx
 * Modal redesign — arcade editorial
 * ----------------------------------------------------------- */
"use client";

import { DialogAntigo, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog-antigo";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { FaWhatsapp } from "react-icons/fa";
import { TrendingUp } from "lucide-react";
import FlyingEmojis from "@/components/hooks/FlyingEmojis";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { EmblaCarouselType } from "embla-carousel";
import { WHATSAPP_CONFIG } from "@/config/whatsapp.config";
import { getRentalCount, formatRentalCount } from "@/lib/sales-utils";

export interface CarouselModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    items: Array<{
        id: string;
        title: string;
        desc?: string;
        imgSrc: string;
        rate?: number;
        confeti?: boolean;
    }>;
    initialIndex: number;
}

export function CarouselModal({
    open,
    onOpenChange,
    items,
    initialIndex,
}: CarouselModalProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const onSelect = (api: EmblaCarouselType, setIdx: (n: number) => void) => () => {
        const idx = api.selectedScrollSnap();
        setIdx(idx);
    };

    const buildWhatsAppLink = (productName: string) => {
        const message = WHATSAPP_CONFIG.message.product(productName);
        return `${WHATSAPP_CONFIG.link}?text=${encodeURIComponent(message)}`;
    };

    return (
        <DialogAntigo open={open} onOpenChange={onOpenChange}>
            <DialogContent className="p-0 overflow-visible bg-transparent border-0 max-w-[100vw] !w-screen !h-screen">
                <VisuallyHidden>
                    <DialogTitle>Detalhes do equipamento</DialogTitle>
                    <DialogDescription>
                        Navegue entre os equipamentos do top 10. Use as setas ou deslize.
                    </DialogDescription>
                </VisuallyHidden>

                {/* Backdrop dramático: gradient roxo + blur extremo cobre o overlay default do Radix */}
                <div className="modal-backdrop-dramatic" aria-hidden />

                {/* Spotlight rotativo atrás do card central */}
                <div className="modal-rays" aria-hidden />

                <div className="relative h-[88vh] w-full overflow-visible flex items-center justify-center">
                    <Carousel
                        opts={{
                            loop: true,
                            align: "center",
                            containScroll: "trimSnaps",
                            startIndex: initialIndex,
                        }}
                        setApi={(api) => {
                            if (!api) return;
                            api.on("select", onSelect(api, setCurrentIndex));
                        }}
                        className="h-full w-full flex items-center"
                    >
                        <CarouselContent className="h-full w-full items-center">
                            {items.map((item, index) => {
                                const rank = index + 1;
                                const rentals = getRentalCount(item.id, rank);
                                const formattedRentals = formatRentalCount(rentals);
                                const isActive = index === currentIndex;

                                return (
                                    <CarouselItem
                                        key={item.id}
                                        /* Aspect 9:16, altura travada, largura = height * 9/16. */
                                        className={`relative h-[80vh] aspect-[9/16] flex-shrink-0 basis-auto px-2 modal-slide ${
                                            isActive ? "modal-slide-active" : "modal-slide-inactive"
                                        }`}
                                    >
                                        <article className={`relative h-full w-full rounded-3xl overflow-hidden bg-black border-2 transition-all duration-500 ${
                                            isActive
                                                ? "border-purple-400/70 shadow-[0_0_60px_rgba(168,85,247,0.5)]"
                                                : "border-border/30"
                                        }`}>
                                            {/* Imagem principal */}
                                            <img
                                                src={item.imgSrc}
                                                alt={item.title}
                                                sizes="(max-width:768px) 90vw, 60vw"
                                                loading="lazy"
                                                decoding="async"
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />

                                            {/* Gradient overlay base — escurece da metade pra baixo */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none" />
                                            {/* Vinheta escura no topo pra contraste do badge */}
                                            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />

                                            {/* Corner brackets ciano (HUD arcade) */}
                                            <span className="pointer-events-none absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-cyan-400 z-30" />
                                            <span className="pointer-events-none absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-cyan-400 z-30" />
                                            <span className="pointer-events-none absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-cyan-400 z-30" />
                                            <span className="pointer-events-none absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-cyan-400 z-30" />

                                            {/* ============= TOP HUD ============= */}
                                            <div className="absolute top-0 left-0 right-0 p-5 flex justify-between items-start z-30">
                                                {/* Rank gigante */}
                                                <div className="flex items-baseline gap-2">
                                                    <span className="font-mono label-arcade text-cyan-300/90">RANK</span>
                                                    <span className="font-display font-extrabold text-5xl md:text-6xl leading-none bg-gradient-to-br from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                                                        #{String(rank).padStart(2, "0")}
                                                    </span>
                                                </div>

                                                {/* Counter posição */}
                                                <span className="font-mono label-arcade text-white/70 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded border border-white/10">
                                                    {currentIndex + 1}/{items.length}
                                                </span>
                                            </div>

                                            {/* Confetti se for top */}
                                            {item.confeti && currentIndex === index && (
                                                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                                                    <FlyingEmojis className="text-4xl sm:text-5xl" maxDistancePercent={0.4} offsetX={0} offsetY={0} />
                                                </div>
                                            )}

                                            {/* ============= BOTTOM CONTENT ============= */}
                                            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7 z-20 space-y-4">
                                                {/* Tag livre + locações */}
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="badge-live text-green-400 bg-green-500/10 border border-green-500/30 px-3 py-1.5 rounded-sm">
                                                        Disponível
                                                    </span>
                                                    <span className="inline-flex items-center gap-2 bg-green-500/15 ring-1 ring-green-500/30 text-green-400 px-3 py-1.5 rounded-sm font-mono text-xs font-bold">
                                                        <TrendingUp className="h-3.5 w-3.5" strokeWidth={2.5} />
                                                        <span className="tabular-nums">{formattedRentals}</span>
                                                        <span className="opacity-80">locações</span>
                                                    </span>
                                                </div>

                                                {/* Título grande */}
                                                <h3 className="font-display font-extrabold text-white text-3xl md:text-5xl leading-[1.05] tracking-tight">
                                                    {item.title}
                                                </h3>

                                                {/* Descrição */}
                                                {item.desc && (
                                                    <p className="font-body text-white/75 text-sm md:text-base leading-relaxed line-clamp-3 max-w-xl">
                                                        {item.desc}
                                                    </p>
                                                )}

                                                {/* Divider neon */}
                                                <div className="h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent" />

                                                {/* CTAs */}
                                                <div className="flex flex-col sm:flex-row gap-3">
                                                    <Button
                                                        size="lg"
                                                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-2 border-green-400/50 shadow-lg shadow-green-500/30 font-semibold uppercase tracking-wider text-sm flex items-center gap-2"
                                                        onClick={() => window.open(buildWhatsAppLink(item.title), "_blank")}
                                                    >
                                                        <FaWhatsapp className="h-5 w-5" />
                                                        <span>Pedir orçamento</span>
                                                    </Button>
                                                </div>

                                                {/* Footer info */}
                                                <p className="font-mono label-arcade text-white/40 text-center pt-1">
                                                    ↳ Entrega · Montagem · Suporte disponível
                                                </p>
                                            </div>
                                        </article>
                                    </CarouselItem>
                                );
                            })}
                        </CarouselContent>

                        {/* Botões de navegação melhorados */}
                        <CarouselPrevious
                            aria-label="Slide anterior"
                            className="z-50 pointer-events-auto !h-12 !w-12 !bg-black/60 !backdrop-blur-md !border-2 !border-cyan-400/50 !text-cyan-300 hover:!bg-cyan-500/20 hover:!border-cyan-400"
                        >
                            <ArrowLeft size={22} />
                        </CarouselPrevious>

                        <CarouselNext
                            aria-label="Próximo slide"
                            className="z-50 pointer-events-auto !h-12 !w-12 !bg-black/60 !backdrop-blur-md !border-2 !border-cyan-400/50 !text-cyan-300 hover:!bg-cyan-500/20 hover:!border-cyan-400"
                        >
                            <ArrowRight size={22} />
                        </CarouselNext>
                    </Carousel>

                    {/* Indicadores estilo barra HUD */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-30 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
                        {items.map((_, idx) => (
                            <span
                                key={idx}
                                className={`h-1 rounded-full transition-all duration-300 ${
                                    idx === currentIndex
                                        ? "w-8 bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                                        : "w-1.5 bg-white/30"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </DialogContent>
        </DialogAntigo>
    );
}

export default CarouselModal;
