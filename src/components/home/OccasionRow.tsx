// src/components/home/OccasionRow.tsx
//
// Fileira "Netflix" por ocasião (SPEC-FINAL-V2 §3.4). SERVER component:
// scroll-snap CSS puro (`.occasion-scroller`), sem JS — funciona no toque e no
// trackpad, degrada sem quebrar. Heading é LINK da ocasião + CTA da fileira.
// A fileira NUNCA nasce magra: fonte = itemsForOccasion (override do dono OU
// fallback categoria→ocasião de occasions.ts).
import Link from "next/link";
import OccasionCard from "@/components/home/OccasionCard";
import { WhatsAppCta } from "@/components/cta/WhatsAppCta";
import type { OccasionDef } from "@/lib/occasions";
import type { CatalogItem } from "@/lib/catalog.server";

interface Props {
    def: OccasionDef;
    items: CatalogItem[];
    /** teto de itens exibidos na fileira (initialLimit 6 da spec). */
    limit?: number;
}

export default function OccasionRow({ def, items, limit = 12 }: Props) {
    if (!items.length) return null; // slot sem dado não renderiza (§1.3)
    const shown = items.slice(0, limit);

    // "Montar minha festa" (ocasião adulta) usa WhatsApp; as outras, link.
    const ctaIsWhats = def.id === "adulta";

    return (
        <section aria-label={def.label} className="w-full">
            <div className="mb-3 flex items-end justify-between gap-3 px-4">
                <Link href={def.cta.href} className="group">
                    <p className={`label-arcade mb-1 ${def.accent}`}>▸ vitrine</p>
                    <h3 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">
                        {def.label}
                        <span className="ml-2 inline-block text-muted-foreground/40 transition-transform group-hover:translate-x-1">
                            →
                        </span>
                    </h3>
                </Link>
                {ctaIsWhats ? (
                    <WhatsAppCta
                        surface="home"
                        location={`occasion_${def.id}`}
                        variant="compact"
                        label={def.cta.label}
                        className="hidden shrink-0 sm:inline-flex"
                    />
                ) : (
                    <Link
                        href={def.cta.href}
                        className="hidden shrink-0 items-center gap-1 rounded-full border border-border/70 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-purple-500/60 hover:text-foreground sm:inline-flex"
                    >
                        {def.cta.label} <span aria-hidden>→</span>
                    </Link>
                )}
            </div>

            {/* Fileira scroll-snap */}
            <div className="occasion-scroller scrollbar-hide px-4">
                {shown.map((item) => (
                    <OccasionCard key={item.key} item={item} />
                ))}
            </div>

            {/* CTA mobile (a versão desktop mora no header da fileira) */}
            <div className="mt-3 px-4 sm:hidden">
                {ctaIsWhats ? (
                    <WhatsAppCta
                        surface="home"
                        location={`occasion_${def.id}_m`}
                        variant="compact"
                        label={def.cta.label}
                        className="w-full justify-center"
                    />
                ) : (
                    <Link
                        href={def.cta.href}
                        className="flex w-full items-center justify-center gap-1 rounded-full border border-border/70 px-4 py-2 text-sm font-medium text-muted-foreground"
                    >
                        {def.cta.label} <span aria-hidden>→</span>
                    </Link>
                )}
            </div>
        </section>
    );
}
