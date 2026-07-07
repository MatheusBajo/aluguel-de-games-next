// src/components/home/TrustStrip.tsx
//
// Trust strip verificável (SPEC-FINAL-V2 §3.2).
// - ESTÁTICA, quebra em até 2 linhas. NUNCA marquee/scroll (rejeição explícita
//   da spec: esconde Spotify/Gentili fora da tela).
// - Prova = fatos assináveis: desde 1993 + clientes reais nomeados.
// - Slots sem dado NÃO renderizam (regra do fallback §1.3):
//     · "milhares de eventos [CONFIRMAR: nº]"  → sem número, omitido
//     · "★ {nota} no Google [CONFIRMAR]"        → sem GBP confirmado, omitido
//   Quando o dono confirmar (business.config), plugar aqui.
import { BUSINESS, anosDeMercado } from '@/config/business.config';

const CLIENTES = ['Bradesco', 'Spotify', 'Arnold Classic', 'Danilo Gentili'];

export default function TrustStrip() {
    return (
        <section
            aria-label="Prova social"
            className="w-full border-t border-b border-border/40 py-4"
        >
            <div className="mx-auto max-w-5xl px-4">
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center text-xs md:text-sm text-zinc-400">
                    <span className="label-arcade text-muted-foreground/60">
                        ▸ desde 1993
                    </span>
                    <span className="text-muted-foreground/30" aria-hidden>·</span>
                    <span>{anosDeMercado()} anos de estrada</span>
                    <span className="text-muted-foreground/30" aria-hidden>·</span>
                    <span className="text-zinc-500">já jogaram com a gente:</span>
                    {CLIENTES.map((c, i) => (
                        <span key={c} className="flex items-center gap-4">
                            {i > 0 && <span className="text-muted-foreground/30" aria-hidden>·</span>}
                            <span className="font-mono font-bold text-foreground/85">{c}</span>
                        </span>
                    ))}
                    {/* Nota do Google entra aqui quando BUSINESS.gbpUrl for confirmado. */}
                    {BUSINESS.gbpUrl && (
                        <a
                            href={BUSINESS.gbpUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 font-semibold text-amber-400 hover:underline"
                        >
                            <span aria-hidden>★</span> avaliações no Google
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}
