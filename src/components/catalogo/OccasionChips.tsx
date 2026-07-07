// src/components/catalogo/OccasionChips.tsx
// Chips "vai bem em" (spec §4.6): ocasião → LP do público (/festas, /empresas).
import Link from "next/link";
import { OCCASION_CHIPS } from "@/lib/catalog-content";
import { cn } from "@/lib/utils";

export function OccasionChips({
    title = "Vai bem em",
    className,
}: {
    title?: string;
    className?: string;
}) {
    return (
        <section className={cn("", className)}>
            <p className="label-arcade text-pink-400 mb-3">▸ {title}</p>
            <div className="flex flex-wrap gap-2.5">
                {OCCASION_CHIPS.map((chip) => (
                    <Link
                        key={chip.href}
                        href={chip.href}
                        className="inline-flex items-center rounded-full border border-border/60 bg-card/40 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-cyan-400/60 hover:text-cyan-300"
                    >
                        {chip.label}
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default OccasionChips;
