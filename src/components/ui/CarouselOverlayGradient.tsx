/* src/components/ui/CarouselOverlayGradient.tsx */
"use client";

import { useEffect, useRef, useState } from "react";
import { useCarousel } from "./carousel-landing";      // OK: mesmo diretório
import { useTheme }   from "@/components/theme-provider";
import ColorThief     from "colorthief";

/* ▸ AJUSTES RÁPIDOS — edite só aqui ↓↓↓ -------------------------------- */
const BLUR_LIGHT   = 60;   // px
const BLUR_DARK    = 80;   // px

const BRIGHT_LIGHT = 1;
const BRIGHT_DARK  = 1.2;

const SAT_LIGHT    = 3;
const SAT_DARK     = 1.3;

const INSET_LIGHT  = 0;    // %  (0 = tamanho exato do slide)
const INSET_DARK   = 0;    // %
const FADE_MS      = 600;  // ms
/* ---------------------------------------------------------------------- */

const rgb2hex = (rgb: number[]) =>
    "#" + rgb.map((c) => c.toString(16).padStart(2, "0")).join("");

const grad = ([a, b]: string[]) =>
    `radial-gradient(circle at 50% 70%, ${a} 0%, ${b} 100%)`;

type Props = { images: string[] };

export function CarouselOverlayGradient({ images }: Props) {
    const { realIndex } = useCarousel();
    const { theme }     = useTheme(); // "light" | "dark"

    /* 1 ▸ pré-gera gradientes ----------------------------------------- */
    const [allGrads, setAllGrads] = useState<string[]>(() =>
        Array(images.length).fill(""),
    );
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let alive = true;
        Promise.all(
            images.map(
                (src) =>
                    new Promise<string>((res) => {
                        const img = new Image();
                        img.crossOrigin = "anonymous";
                        img.src = src;
                        img.onload = () => {
                            try {
                                const p = new ColorThief().getPalette(img, 2);
                                res(grad(p.map(rgb2hex) as [string, string]));
                            } catch {
                                res("");
                            }
                        };
                        img.onerror = () => res("");
                    }),
            ),
        ).then((arr) => {
            if (alive) {
                setAllGrads(arr);
                setReady(true);
            }
        });
        return () => {
            alive = false;
        };
    }, [images]);

    /* 2 ▸ cross-fade --------------------------------------------------- */
    const [current, setCurrent] = useState<string>("");
    const [prev,    setPrev]    = useState<string | null>(null);
    const timer    = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!ready) return;

        const next =
            allGrads[realIndex] ||
            (theme === "dark"
                ? "radial-gradient(circle at 50% 70%, #222 0%, #000 100%)"
                : "radial-gradient(circle at 50% 70%, #ececec 0%, #fff 100%)");

        if (next === current) return;

        setPrev(current);
        setCurrent(next);

        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setPrev(null), FADE_MS);
    }, [realIndex, allGrads, ready, current, theme]);

    /* 3 ▸ estilos base ------------------------------------------------- */
    const inset   = theme === "dark" ? INSET_DARK  : INSET_LIGHT;
    const blur    = theme === "dark" ? BLUR_DARK   : BLUR_LIGHT;
    const sat     = theme === "dark" ? SAT_DARK    : SAT_LIGHT;
    const bright  = theme === "dark" ? BRIGHT_DARK : BRIGHT_LIGHT;

    const base = {
        position: "absolute" as const,
        inset: `${inset}%`,
        pointerEvents: "none" as const,
        userSelect: "none" as const,
    };

    const wrapperFilter = `blur(${blur}px) brightness(${bright}) saturate(${sat})`;

    /* 4 ▸ render ------------------------------------------------------- */
    return (
        <div style={{ ...base, zIndex: 0, filter: wrapperFilter }}>
            {/* gradiente atual */}
            {current && <div style={{ ...base, backgroundImage: current }} />}

            {/* gradiente anterior (fade-out) */}
            {prev && (
                <div
                    style={{
                        ...base,
                        backgroundImage: prev,
                        animation: `fadeOut ${FADE_MS}ms linear forwards`,
                    }}
                />
            )}

            <style>{`
        @keyframes fadeOut { to { opacity: 0; } }
      `}</style>
        </div>
    );
}
