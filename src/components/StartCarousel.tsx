/* src/components/StartCarousel.tsx */
"use client";
import { CarouselContent, CarouselItem, CarouselLanding } from "@/components/ui/carousel-landing";
import { CarouselOverlayGradient } from "@/components/ui/CarouselOverlayGradient";
import { CardAntigo, CardContent } from "@/components/ui/card-antigo";
import { useLayoutEffect, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import AnimatedCarouselText from "@/components/AnimatedCarouselText";
import Link from "next/link";
import {Button} from "@/components/ui/button";

// Registra plugins do GSAP apenas uma vez
gsap.registerPlugin(ScrollTrigger, SplitText);

// Agora imagem e texto estão juntos — é só adicionar, remover ou editar aqui
const carouselItems = [
    {
        image: "/carousel/compressed/Martelo de força.webp",
        text: "Martelo de Força - Desafie seus limites!",
    },
    {
        image: "/carousel/compressed/Boxing Machine.webp",
        text: "Boxing Machine - Teste seu soco!",
    },
    {
        image: "/carousel/compressed/PinballDaniloGentili.webp",
        text: "Aniversário do Danilo Gentili - Pinball 007 exclusivo!",
    },
    {
        image: "/carousel/compressed/da066c60-0c96-46ee-b01d-8f34deab7c6c.webp",
        text: "Pinballs e Fliperamas!",
    },
    {
        image: "/carousel/compressed/Pebolim e dois fliperamas.webp",
        text: "Pebolim e Fliperamas!",
    },
    {
        image: "/carousel/compressed/Braland.webp",
        text: "Braland - Evento do Bradesco!",
    },
    {
        image: "/carousel/compressed/c71c0260-95d7-4e66-9ca6-0bda25008d18.webp",
        text: "Mesa de Sinuca e Air Game Quântico",
    },
    {
        image: "/carousel/compressed/Karaokê Matrix Mesa.webp",
        text: "Karaokê Matrix Mesa - Solte a voz!",
    },
    {
        image: "/carousel/compressed/Karaokê Matrix Slim.webp",
        text: "Karaokê Matrix Slim - Compacto e poderoso!",
    },
    {
        image: "/carousel/compressed/Karaokê Matrix 30000.webp",
        text: "Karaokê Matrix 30.000 - Opções intermináveis!",
    },
];

function StartCarousel() {
    // Plugin de autoplay configurado
    const autoplayRef = useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true })
    );

    // Animação de entrada do bloco do carrossel
    useLayoutEffect(() => {
        gsap.to(".div-carousel", { y: 0, opacity: 1, duration: 3 });
        return () => gsap.killTweensOf(".div-carousel");
    }, []);

    return (
        <div className="relative flex flex-col gap-20 py-5 w-full">
            {/* o FinisherHeader vai injetar o <canvas> aqui */}

            <div className="div-carousel relative z-10 max-w-[1400px] mx-auto w-full px-5 select-none">
                <CarouselLanding
                    slidesCount={carouselItems.length}
                    plugins={[autoplayRef.current]}
                    className="relative mx-auto w-full max-w-[1280px]"
                    opts={{ align: "start", loop: true }}
                >
                    {/* Gradiente de sobreposição para todas as imagens */}
                    <CarouselOverlayGradient images={carouselItems.map((i) => i.image)} />

                    <CarouselContent>
                        {carouselItems.map(({ image }, index) => (
                            <CarouselItem key={index}>
                                <CardAntigo className="rounded-2xl overflow-hidden border-none p-0">
                                    <CardContent className="relative flex items-center justify-center p-0 overflow-hidden w-full aspect-video max-h-[720px]">
                                        <img
                                            src={image}
                                            alt={`Imagem Carousel ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                                    </CardContent>
                                </CardAntigo>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Link className="md:translate-y-15 translate-y-30 z-10" href="/catalogo">
                            <Button
                                className="relative rounded-full uppercase z-10 gradient-border shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:shadow-[0_0_40px_rgba(147,51,234,0.6)] hover:scale-[1.05] transition-all duration-300"
                                variant="catalog">
                                🏅 Nosso Catalogo
                            </Button>
                        </Link>
                    </div>

                    {/* Textos animados extraídos direto do array */}
                    <AnimatedCarouselText texts={carouselItems.map((i) => i.text)}/>
                </CarouselLanding>
            </div>
        </div>
    );
}

export default StartCarousel;
