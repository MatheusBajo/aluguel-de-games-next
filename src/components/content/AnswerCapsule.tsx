// src/components/content/AnswerCapsule.tsx
//
// Cápsula de resposta (spec §9.1): PRIMEIRO texto corrido de cada template,
// 40-80 palavras, existe no HTML cru (server component). É o alvo de featured
// snippet / citação de IA. Nada de mono/terminal aqui — é texto pra pessoa ler.

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AnswerCapsule({
    children,
    className,
    label = "Resposta rápida",
}: {
    children: ReactNode;
    className?: string;
    /** Rótulo editorial pequeno acima do texto. Passe `null` pra ocultar. */
    label?: string | null;
}) {
    return (
        <div
            className={cn(
                "relative rounded-2xl border border-purple-500/20 bg-card/60 p-5 md:p-6",
                className
            )}
        >
            {/* corner brackets sutis (assinatura mantida, 1 textura) */}
            <span className="pointer-events-none absolute top-2 left-2 h-4 w-4 border-t-2 border-l-2 border-cyan-400/50" aria-hidden />
            <span className="pointer-events-none absolute bottom-2 right-2 h-4 w-4 border-b-2 border-r-2 border-cyan-400/50" aria-hidden />

            {label && (
                <p className="label-arcade text-cyan-400 mb-2">▸ {label}</p>
            )}
            <p className="font-body text-base md:text-lg leading-relaxed text-foreground">
                {children}
            </p>
        </div>
    );
}

export default AnswerCapsule;
