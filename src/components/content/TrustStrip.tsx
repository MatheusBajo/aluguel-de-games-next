// src/components/content/TrustStrip.tsx
//
// Trust strip verificável (spec §1.5 / D1.5). Estática, quebra em 2 linhas,
// NUNCA marquee. Só claims verificáveis:
//   - "Desde 1993" (computável)
//   - clientes reais nomeados (Bradesco · Spotify · Arnold Classic · Danilo Gentili)
//   - ★ nota no Google → SÓ renderiza com GBP_URL confirmado (regra do fallback §1.3)
//   - "milhares de eventos" → SÓ com número/ok do dono (omitido até lá)
import { GBP_URL } from "@/lib/schema";
import { cn } from "@/lib/utils";

const CLIENTES = ["Bradesco", "Spotify", "Arnold Classic", "Danilo Gentili"] as const;

export function TrustStrip({ className }: { className?: string }) {
    const anos = new Date().getFullYear() - 1993;

    return (
        <div
            className={cn(
                "flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs md:text-sm",
                className
            )}
        >
            <span className="font-mono font-bold text-foreground tabular-nums">
                Desde 1993
            </span>
            <span className="hidden text-muted-foreground/40 sm:inline" aria-hidden>·</span>

            <span className="label-arcade text-muted-foreground">
                já jogaram com a gente:
            </span>

            {CLIENTES.map((nome, i) => (
                <span key={nome} className="flex items-center gap-x-5">
                    <span className="font-mono font-semibold text-foreground/80">{nome}</span>
                    {i < CLIENTES.length - 1 && (
                        <span className="text-muted-foreground/40" aria-hidden>·</span>
                    )}
                </span>
            ))}

            {/* ★ nota no Google — os dois estados desenhados; sem GBP confirmado, omite */}
            {GBP_URL && (
                <>
                    <span className="text-muted-foreground/40" aria-hidden>·</span>
                    <a
                        href={GBP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-cyan-400 hover:text-cyan-300"
                    >
                        ★ Avaliações no Google
                    </a>
                </>
            )}
        </div>
    );
}

export default TrustStrip;
