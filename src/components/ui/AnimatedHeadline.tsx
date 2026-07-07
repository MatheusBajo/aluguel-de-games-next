"use client";

import { useEffect, useRef } from "react";

interface AnimatedHeadlineProps {
    children: React.ReactNode;
    className?: string;
    /** Delay (em segundos) antes da animação de entrada */
    delay?: number;
}

/**
 * Headline animado com GSAP SplitText:
 * - Quebra o texto em LINHAS (não words/chars).
 * - Cada linha tem overflow:hidden, e o conteúdo da linha sobe inteiro.
 * - Preserva spans internos (gradients, italics) intactos.
 *
 * IMPORTANTE: Use spans com `.gradient-slide` dentro do children para destaques —
 * eles são preservados como blocos únicos e o gradient cobre a frase toda.
 *
 * GSAP é importado dinâmico (code split) — só baixa quando precisa.
 */
export function AnimatedHeadline({ children, className, delay = 0 }: AnimatedHeadlineProps) {
    const ref = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Respeita prefers-reduced-motion: deixa visível e pula a animação
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduced) {
            el.style.opacity = "1";
            return;
        }

        let cleanup: (() => void) | undefined;

        (async () => {
            const { gsap } = await import("gsap");
            const { SplitText } = await import("gsap/SplitText");

            gsap.registerPlugin(SplitText);

            // Aguarda fonts pra evitar split em texto sem fonte certa
            if (document.fonts && (document.fonts as any).ready) {
                await (document.fonts as any).ready;
            }

            // Split apenas por LINHAS — preserva spans internos (gradients, italics) intactos.
            // Cada linha vira: <div class="split-line-mask"><div class="split-line">conteúdo</div></div>
            const split = new SplitText(el, {
                type: "lines",
                linesClass: "split-line",
                mask: "lines", // adiciona wrapper com overflow hidden automaticamente
            });

            gsap.set(el, { opacity: 1 });

            // Cada linha sobe da máscara
            const tween = gsap.from(split.lines, {
                yPercent: 110,
                duration: 0.9,
                ease: "power3.out",
                stagger: 0.1,
                delay,
            });

            cleanup = () => {
                tween.kill();
                split.revert();
            };
        })();

        return () => cleanup?.();
    }, [delay]);

    return (
        <h1 ref={ref} className={className} style={{ opacity: 0 }}>
            {children}
        </h1>
    );
}
