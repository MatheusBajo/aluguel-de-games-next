"use client";
import {
    useLayoutEffect,
    useRef,
    useState,
    useEffect,
    useCallback,
} from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useCarousel } from "@/components/ui/carousel-landing";

gsap.registerPlugin(SplitText);

interface Props {
    texts: string[];
}

/**
 * Cabeçalho animado que sincroniza com o carrossel externo
 */
export default function AnimatedCarouselText({ texts }: Props) {
    const { api } = useCarousel();
    const containerRef = useRef<HTMLHeadingElement>(null);

    const [currentIndex, setCurrentIndex] = useState(0);

    // guardamos instâncias para poder cancelar/limpar
    const splitRef = useRef<SplitText | null>(null);
    const tlRef = useRef<gsap.core.Tween | null>(null);

    /** Troca de texto com animação de saída + entrada */
    const transitionTo = useCallback(
        (newIndex: number) => {
            if (newIndex === currentIndex) return;
            const el = containerRef.current;
            if (!el) return;

            // mata animação em andamento
            tlRef.current?.kill();

            // garante que temos SplitText pronto para animar a saída
            if (!splitRef.current) {
                splitRef.current = new SplitText(el, { type: "chars" });
            }

            // saída
            tlRef.current = gsap.to(splitRef.current.chars, {
                y: -30,
                opacity: 0,
                ease: "power1.in",
                duration: 0.3,
                stagger: { each: 0.01, from: "end" },
                onComplete: () => {
                    // reverte DOM e prepara entrada
                    splitRef.current?.revert();
                    splitRef.current = null;
                    gsap.set(el, { opacity: 0 });
                    setCurrentIndex(newIndex);
                    tlRef.current = null;
                },
            });
        },
        [currentIndex]
    );

    /** Escuta as mudanças do carrossel */
    useEffect(() => {
        if (!api) return undefined; // satisfaz tipo EffectCallback

        setCurrentIndex(api.selectedScrollSnap());

        const onSelect = () => transitionTo(api.selectedScrollSnap());
        api.on("select", onSelect);

        // cleanup — não retornar valor de api.off!
        return () => {
            api.off("select", onSelect);
        };
    }, [api, transitionTo]);

    /** Anima o texto sempre que currentIndex muda */
    useLayoutEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        // garante visibilidade
        gsap.set(el, { opacity: 1 });

        // monta o novo texto
        el.textContent = texts[currentIndex] ?? texts[0];
        splitRef.current = new SplitText(el, { type: "chars" });

        // entrada
        tlRef.current = gsap.from(splitRef.current.chars, {
            y: 30,
            opacity: 0,
            ease: "power3.out",
            duration: 0.6,
            stagger: 0.02,
        });

        return () => {
            tlRef.current?.kill();
            splitRef.current?.revert();
            tlRef.current = null;
            splitRef.current = null;
        };
    }, [currentIndex, texts]);

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <h2
                ref={containerRef}
                className="inline-block text-white lg:text-3xl md:text-xl text-[8pt] font-bold"
            >
                {texts[currentIndex] ?? texts[0]}
            </h2>
        </div>
    );
}
