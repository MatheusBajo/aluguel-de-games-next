/* components/AnimatedCarouselText.tsx */
"use client";
import {
    useLayoutEffect,
    useRef,
    useState,
    useEffect,
    useCallback,   // <- adicione aqui
} from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useCarousel } from "@/components/ui/carousel-landing";

gsap.registerPlugin(SplitText);

export default function AnimatedCarouselText({ texts }: { texts: string[] }) {
    const { api } = useCarousel();
    const containerRef = useRef<HTMLHeadingElement>(null);

    const [currentIndex, setCurrentIndex] = useState(0);

    // refs para controlar animações
    const splitRef = useRef<SplitText | null>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);


    /** Faz a transição completa (sai e entra) */
    /** Faz a transição (interrompe, anima saída, troca texto) */
    const transitionTo = useCallback((newIndex: number) => {
        if (newIndex === currentIndex) return;
        const el = containerRef.current;
        if (!el) return;

        // mata qualquer animação em andamento
        tlRef.current?.kill();

        // garante SplitText para animar a saída
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
                /* 1. Reverte o DOM */
                splitRef.current?.revert();
                splitRef.current = null;

                /* 2. Mantém o contêiner invisível até a entrada começar */
                gsap.set(el, { opacity: 0 });

                /* 3. Libera para o próximo índice */
                setCurrentIndex(newIndex);
                tlRef.current = null;
            },
        });
    }, [currentIndex]);


    /** Ouve o carrossel */
    useEffect(() => {
        if (!api) return;

        setCurrentIndex(api.selectedScrollSnap());

        const onSelect = () => transitionTo(api.selectedScrollSnap());
        api.on("select", onSelect);
        return () => api.off("select", onSelect);
    }, [api, currentIndex, transitionTo]);

    useLayoutEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        /* ← ADICIONE ISTO */
        gsap.set(el, { opacity: 1 });

        // monta o novo texto
        el.textContent = texts[currentIndex] ?? texts[0];
        splitRef.current = new SplitText(el, { type: "chars" });

        // anima entrada
        tlRef.current = gsap.from(splitRef.current.chars, {
            y: 30,
            opacity: 0,
            ease: "power3.out",
            duration: 0.6,
            stagger: 0.02,
        });

        return () => {
            // limpeza
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
