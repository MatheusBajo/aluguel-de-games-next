/* -----------------------------------------------------------
 * components/CarouselModal.tsx
 * ----------------------------------------------------------- */
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { FaHeart, FaShare, FaWhatsapp, FaShoppingCart } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import FlyingEmojis from "@/components/hooks/FlyingEmojis";
import { Badge } from "@/components/ui/badge";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { StarRating } from "@/components/util/StarRating.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import {ArrowLeft, ArrowRight} from "lucide-react";
import {EmblaCarouselType} from "embla-carousel";

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
    const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const toggleLike = (itemId: string) => {
        setLikedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };
    const onSelect = (api: EmblaCarouselType, setIdx: (n: number) => void) =>
        () => {
            const idx = api.selectedScrollSnap()
            setIdx(idx) // só muda quando necessário
        }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="p-0 overflow-hidden bg-transparent border-0">
                {/* -- Acessibilidade hidden -- */}
                <VisuallyHidden>
                    <DialogTitle>Galeria de Imagens</DialogTitle>
                    <DialogDescription>
                        Navegue pelas imagens do carrossel utilizando os controles.
                    </DialogDescription>
                </VisuallyHidden>

                {/* -- Carrossel -- */}
                <div className="h-[80vh] w-full rounded-md overflow-hidden aspect-[9/16]">
                    <Carousel
                        opts={{
                            loop: true,
                            align: "center",
                            containScroll: "trimSnaps",
                            startIndex: initialIndex      // já abre no slide certo
                        }}
                        setApi={(api) => {
                            if (!api) return
                            api.on("select", onSelect(api, setCurrentIndex))
                        }}

                        className="h-full w-full"
                    >
                        <CarouselContent className="h-full w-full">
                            {items.map((item, index) => (
                                <CarouselItem
                                    key={item.id}
                                    /* substitua a classe do item */
                                    className="relative h-full flex-shrink-0
           flex-[0_0_calc(100%-16px)]
           sm:flex-[0_0_calc(80%-16px)]
           md:flex-[0_0_calc(60%-16px)]
           lg:flex-[0_0_calc(50%-16px)]
           aspect-[9/16] px-2"

                                >
                                    <div className="relative h-full w-full rounded-2xl overflow-hidden bg-black/20">
                                        {/* Imagem principal */}
                                        <img
                                            src={item.imgSrc}                // fallback minúsculo
                                            sizes="(max-width:768px) 90vw, 60vw"
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Gradiente overlay melhorado */}
                                        <div
                                            className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 pointer-events-none"/>
                                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/40 pointer-events-none" />


                                        {/* Top bar com ações */}
                                        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-30">
                                            {/* Ranking badge */}
                                            <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2">
                                                <HiSparkles className="text-yellow-400" />
                                                <span className="text-white font-bold">#{index + 1}</span>
                                            </div>

                                            {/* Ações */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => toggleLike(item.id)}
                                                    className={`p-3 rounded-full transition-all duration-300 ${
                                                        likedItems.has(item.id)
                                                            ? 'bg-red-500 text-white scale-110'
                                                            : 'bg-white/10 text-white hover:bg-white/20'
                                                    }`}
                                                >
                                                    <FaHeart className={`text-lg ${likedItems.has(item.id) ? 'animate-pulse' : ''}`} />
                                                </button>
                                                <button className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
                                                    <FaShare className="text-lg" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Confetti */}
                                        {item.confeti && currentIndex === index && (
                                            <div className="absolute bottom-6 left-4 z-40">
                                                <FlyingEmojis
                                                    className="text-4xl sm:text-5xl"
                                                    maxDistancePercent={0.4}
                                                    offsetX={0}
                                                    offsetY={0}
                                                />
                                            </div>
                                        )}


                                        {/* Conteúdo inferior */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                                            <div className="space-y-2">
                                                {/* Badges */}
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge className="bg-green-500/20 backdrop-blur-sm text-green-100 border-green-500/30">
                                                        🥇 Mais Alugado
                                                    </Badge>
                                                    <Badge className="bg-blue-500/20 backdrop-blur-sm text-blue-100 border-blue-500/30">
                                                        ⚡ Disponível
                                                    </Badge>
                                                    {item.rate && item.rate >= 4.5 && (
                                                        <Badge className="bg-yellow-500/20 backdrop-blur-sm text-yellow-100 border-yellow-500/30">
                                                            ⭐ Top Rated
                                                        </Badge>
                                                    )}
                                                </div>

                                                {/* Título e descrição */}
                                                <div className="space-y-2">
                                                    <h3 className="text-white font-bold text-3xl sm:text-4xl leading-tight line-clamp-2">
                                                        {item.title}
                                                    </h3>

                                                    {item.desc && (
                                                        <p className="text-white/80 text-sm sm:text-base line-clamp-2">
                                                            {item.desc}
                                                        </p>
                                                    )}

                                                    {/* Rating */}
                                                    {item.rate !== undefined && (
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center gap-1">
                                                                <StarRating value={item.rate} />
                                                            </div>
                                                            <span className="text-white/90 font-medium">
                                                                {item.rate} de 5.0
                                                            </span>
                                                            <span className="text-white/60 text-sm">
                                                                (128 avaliações)
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* CTAs */}
                                                <div className="flex gap-3 pt-2">
                                                    <Button
                                                        size="lg"
                                                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 shadow-lg shadow-green-500/30 flex items-center gap-2"
                                                    >
                                                        <FaWhatsapp className="text-xl" />
                                                        <span>Fazer Orçamento</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious
                            aria-label="Slide anterior"
                            className="z-50 pointer-events-auto"
                        >
                            <ArrowLeft size={22} />
                        </CarouselPrevious>

                        <CarouselNext
                            aria-label="Próximo slide"
                            className="z-50 pointer-events-auto"
                        >
                            <ArrowRight size={22} />
                        </CarouselNext>

                    </Carousel>

                    {/* Indicadores de página */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
                        {items.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1 rounded-full transition-all duration-300 ${
                                    idx === currentIndex
                                        ? 'w-8 bg-white'
                                        : 'w-2 bg-white/40'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default CarouselModal;