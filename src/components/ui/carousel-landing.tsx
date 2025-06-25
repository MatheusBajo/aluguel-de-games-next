"use client";

import * as React from "react"
import {useState} from "react"
import {ArrowLeft, ArrowRight} from "lucide-react"
import {cn} from "@/lib/utils"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay";


type CarouselApi = ReturnType<typeof useEmblaCarousel>[1]

type CarouselProps = {
    opts?: Parameters<typeof useEmblaCarousel>[0]
    plugins?: Parameters<typeof useEmblaCarousel>[1]
    slidesCount?: number;
}

type CarouselContextProps = {
    carouselRef: ReturnType<typeof useEmblaCarousel>[0]
    api: CarouselApi
    scrollPrev: () => void
    scrollNext: () => void
    canScrollPrev: boolean
    canScrollNext: boolean
    selectedIndex: number
    autoplay: ReturnType<typeof Autoplay> | null; // Novo!
    realIndex: number
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
    const context = React.useContext(CarouselContext)
    if (!context) {
        throw new Error("useCarousel must be used within a <CarouselLanding />")
    }
    return context
}

const CarouselLanding = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CarouselProps>(
    ({ opts, plugins, slidesCount, className, children, ...props }, ref) => {
        const [carouselRef, api] = useEmblaCarousel(opts ?? { loop: true }, plugins ?? []);
        const [realIndex, setRealIndex] = React.useState(0)
        const [canScrollPrev, setCanScrollPrev] = React.useState(false)
        const [canScrollNext, setCanScrollNext] = React.useState(false)
        const [selectedIndex, setSelectedIndex] = React.useState(0)
        const [autoplay, setAutoplay] = useState<ReturnType<typeof Autoplay> | null>(null);

        const totalSlides = slidesCount;

        React.useEffect(() => {
            if (!api) return

            // Lê o índice do Embla e faz o módulo com o total de slides
            const handleSelect = () => {
                const emblaIndex = api.selectedScrollSnap();
                const newIndex = emblaIndex % totalSlides;
                setRealIndex(newIndex);
            };

            api.on("select", handleSelect)
            // Chama uma vez para inicializar
            handleSelect()

            return () => {
                api.off("select", handleSelect)
            }
        }, [api, totalSlides])


        const onSelect = React.useCallback((api: CarouselApi) => {
            if (!api) return
            setCanScrollPrev(api.canScrollPrev())
            setCanScrollNext(api.canScrollNext())
            const currentIndex = api.selectedScrollSnap()
            setSelectedIndex(currentIndex)
        }, [])

        const scrollPrev = React.useCallback(() => {
            api?.scrollPrev()
        }, [api])

        const scrollNext = React.useCallback(() => {
            api?.scrollNext()
        }, [api])

        React.useEffect(() => {
            if (!api) return
            onSelect(api)
            api.on("select", onSelect)
            api.on("reInit", onSelect)
            return () => {
                api.off("select", onSelect)
                api.off("reInit", onSelect)
            }
        }, [api, onSelect, autoplay]) // <-- inclua `autoplay` aqui


        return (
            <CarouselContext.Provider
                value={{
                    carouselRef,
                    api,
                    realIndex,
                    scrollPrev,
                    scrollNext,
                    canScrollPrev,
                    canScrollNext,
                    opts,
                    plugins,
                    selectedIndex,
                    autoplay,
                    slidesCount,
                }}
            >
                <div ref={ref} className="relative">
                    {children}
                    {/* Aqui é onde inserimos as áreas de clique */}
                    <CarouselAreaNavigation/>
                </div>
            </CarouselContext.Provider>
        )
    }
)
CarouselLanding.displayName = "CarouselLanding"

// carousel-landing.tsx  ➜  dentro de <CarouselContent>
const CarouselContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    const { carouselRef } = useCarousel()

    return (
        <div ref={carouselRef} className="overflow-hidden rounded-2xl">
            <div
                ref={ref}
                className={cn(
                    "flex flex-row gap-20 relative",
                    /* calços laterais: largura 0, mas ainda contam p/ o gap */
                    "before:block before:flex-none before:w-0",
                    "after:block  after:flex-none  after:w-0",
                    className
                )}
                {...props}
            />
        </div>
    )
})


CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                role="group"
                aria-roledescription="slide"
                className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}
                {...props}
            />
        )
    }
)
CarouselItem.displayName = "CarouselItem"

/* Componente que cria duas áreas de clique transparentes */
const CarouselAreaNavigation = () => {
    const { scrollPrev, scrollNext, canScrollPrev, canScrollNext, api } = useCarousel();

    const handleInteraction = (action: () => void) => {
        action();

        // Acessa o plugin através da API
        const autoplay = api?.plugins()?.autoplay;
        if (!autoplay) return;

        autoplay.stop();
        setTimeout(() => autoplay.play(), 5000);
    };

    return (
        <>
            {/* Área esquerda - vai para o slide anterior */}
            <div
                className="absolute inset-y-0 left-0 w-1/5 z-10 cursor-pointer flex items-center justify-center"
                style={{
                    background: "rgba(0, 0, 0, 0.0)",
                    opacity: canScrollPrev ? 1 : 0.5,
                    touchAction: "pan-y",
                }}
                onClick={() => handleInteraction(scrollPrev)}
            >
                <ArrowLeft className="pointer-events-none text-white drop-shadow-primary xl:size-8 size-6" />
            </div>

            {/* Área direita - vai para o slide seguinte */}
            <div
                className="absolute inset-y-0 right-0 w-1/5 z-10 cursor-pointer flex items-center justify-center"
                style={{
                    background: "rgba(0, 0, 0, 0.0)",
                    opacity: canScrollNext ? 1 : 0.5,
                    touchAction: "pan-y",
                }}
                onClick={() => handleInteraction(scrollNext)}
            >
                <ArrowRight className="pointer-events-none text-white drop-shadow-primary xl:size-8 size-6" />
            </div>
        </>
    );
};


export { CarouselLanding, CarouselContent, CarouselItem, useCarousel }

