/* src/components/StartCarousel.tsx */
"use client";
import {CarouselContent, CarouselItem, CarouselLanding} from "@/components/ui/carousel-landing.tsx";
import {CarouselOverlayGradient} from "@/components/ui/CarouselOverlayGradient.tsx";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {useLayoutEffect, useRef} from "react";
import Autoplay from "embla-carousel-autoplay";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {SplitText} from "gsap/SplitText";
import AnimatedCarouselText from "@/components/AnimatedCarouselText";


gsap.registerPlugin(ScrollTrigger, SplitText);

const carouselImages = [
    "/carousel/compressed/Martelo de força.png",
    "/carousel/compressed/Boxing Machine.png",
    "/carousel/compressed/Braland.png",
    "/carousel/compressed/Karaokê Matrix Mesa.png",
    "/carousel/compressed/Karaokê Matrix Slim.png",
    "/carousel/compressed/Karaokê Matrix 30000.png",
];

const carouselTexts = [
    "Martelo de Força - Desafie seus limites!",
    "Boxing Machine - Teste seu soco!",
    "Braland - Diversão garantida!",
    "Karaokê Matrix Mesa - Solte a voz!",
    "Karaokê Matrix Slim - Compacto e poderoso!",
    "Karaokê Matrix 30.000 - Opções intermináveis!",
];



function StartCarousel() {
    const autoplayRef = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

    // anima o carousel
    useLayoutEffect(() => {
        gsap.to(".div-carousel", { y: 0, opacity: 1, duration: 3 });
        return () => gsap.killTweensOf(".div-carousel");
    }, []);


    return (
        <div className="relative flex flex-col gap-20 py-5 w-full">
            {/* o FinisherHeader vai injetar o <canvas> aqui */}

            <div className="div-carousel relative z-10 max-w-[1400px] mx-auto w-full px-5 select-none">
                <CarouselLanding
                    slidesCount={carouselImages.length}
                    plugins={[autoplayRef.current]}
                    className="relative mx-auto w-full max-w-[1280px]"
                    opts={{align: "start", loop: true}}
                >
                    <CarouselOverlayGradient images={carouselImages}/>
                    <CarouselContent className="">
                        {carouselImages.map((image, index) => (
                            <CarouselItem key={index}>
                                <Card className="rounded-2xl overflow-hidden border-none p-0">
                                    <CardContent
                                        className="relative flex items-center justify-center p-0 overflow-hidden w-full aspect-video max-h-[720px]">
                                        <img
                                            src={image}
                                            alt={`Imagem Carousel ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <div
                                            className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"/>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <AnimatedCarouselText texts={carouselTexts}/>
                </CarouselLanding>
            </div>
        </div>
    );
}

export default StartCarousel;
