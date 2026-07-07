"use client";

import { useEffect, useRef, useState } from "react";

interface CounterProps {
    /** Valor final numérico que será animado */
    to: number;
    /** Sufixo após o número (ex: "+", "%", "k") */
    suffix?: string;
    /** Prefixo antes do número (ex: "R$") */
    prefix?: string;
    /** Duração da animação em segundos */
    duration?: number;
    /** className aplicado ao span */
    className?: string;
    /** Delay (em segundos) antes de começar */
    delay?: number;
    /** Casas decimais — útil para porcentagens decimais. Default 0 */
    decimals?: number;
}

/**
 * Counter animado com IntersectionObserver + GSAP (carregado dinâmico).
 * Dispara só quando entra na viewport e respeita prefers-reduced-motion.
 *
 * SSR-safe: renderiza valor final estaticamente no servidor (compatível com hydration),
 * depois reseta pra 0 no cliente quando JS hidrata e anima até o valor.
 */
export function Counter({
    to,
    suffix = "",
    prefix = "",
    duration = 2,
    className,
    delay = 0,
    decimals = 0,
}: CounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const [hasMounted, setHasMounted] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);

    // Marca que JS hidratou — só agora podemos resetar pra 0 e animar
    useEffect(() => {
        setHasMounted(true);
    }, []);

    // Quando montou, reseta pra 0 e prepara observer
    useEffect(() => {
        const el = ref.current;
        if (!el || !hasMounted || hasAnimated) return;

        // Respeita prefers-reduced-motion
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (mediaQuery.matches) {
            el.textContent = `${prefix}${to.toFixed(decimals)}${suffix}`;
            setHasAnimated(true);
            return;
        }

        // Reseta pra 0 já que vamos animar
        el.textContent = `${prefix}0${suffix}`;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(async (entry) => {
                    if (entry.isIntersecting && !hasAnimated) {
                        setHasAnimated(true);

                        const { gsap } = await import("gsap");

                        const obj = { val: 0 };
                        gsap.to(obj, {
                            val: to,
                            duration,
                            delay,
                            ease: "power2.out",
                            onUpdate: () => {
                                if (el) {
                                    el.textContent = `${prefix}${obj.val.toFixed(decimals)}${suffix}`;
                                }
                            },
                        });

                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.3 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [to, suffix, prefix, duration, delay, decimals, hasMounted, hasAnimated]);

    // SSR e initial client render: mostra valor final estaticamente (sem hydration mismatch).
    // Após mount, JS reseta pra 0 e anima.
    return (
        <span ref={ref} className={className} suppressHydrationWarning>
            {prefix}{to.toFixed(decimals)}{suffix}
        </span>
    );
}
