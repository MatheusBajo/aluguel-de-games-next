// src/components/home/CategoryGrid.tsx
//
// D2 — "O que dá pra alugar?" (spec §3). Grid 2×4 (mobile 2 col) de cards de
// categoria: foto real (primeiro produto da categoria) + nome + 1 fato REAL do
// metadata (contagem de itens do catálogo). Link → categoria-LP (URL aninhada
// atual, sem migração). Server component — HTML cru, sem JS.
import Link from "next/link";

export interface CategoryCard {
    label: string;
    href: string;
    /** contagem REAL de produtos na categoria (metadata) */
    count: number;
    /** caminho da foto do 1º produto (já pronto pra usar em src) */
    image: string | null;
    emoji: string;
}

export function CategoryGrid({ categories }: { categories: CategoryCard[] }) {
    return (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {categories.map((cat) => (
                <li key={cat.href}>
                    <Link
                        href={cat.href}
                        className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/60 bg-card/40 transition-all hover:border-purple-500/50 hover:bg-card/70"
                    >
                        <div className="relative aspect-[4/3] overflow-hidden bg-background">
                            {cat.image ? (
                                <img
                                    src={cat.image}
                                    alt={`Aluguel de ${cat.label} para festas e eventos`}
                                    loading="lazy"
                                    decoding="async"
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-3xl opacity-60">
                                    {cat.emoji}
                                </div>
                            )}
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
                                aria-hidden
                            />
                            <span className="absolute left-2 top-2 text-lg" aria-hidden>
                                {cat.emoji}
                            </span>
                        </div>

                        <div className="flex flex-1 flex-col gap-1 p-3">
                            <h3 className="font-display text-sm font-bold leading-tight text-foreground transition-colors group-hover:text-cyan-400 md:text-base">
                                {cat.label}
                            </h3>
                            <p className="font-mono text-xs text-muted-foreground tabular-nums">
                                {cat.count} {cat.count === 1 ? "modelo" : "modelos"}
                                <span className="ml-1.5 text-purple-400 transition-transform group-hover:translate-x-0.5 inline-block">
                                    →
                                </span>
                            </p>
                        </div>
                    </Link>
                </li>
            ))}
        </ul>
    );
}

export default CategoryGrid;
