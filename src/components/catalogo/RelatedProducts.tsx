// src/components/catalogo/RelatedProducts.tsx
//
// Relacionados por OCASIÃO compartilhada (SPEC-FINAL-V2 §4.10) — nunca "quem
// alugou também" (não temos esse dado; seria fabricação). SERVER component.
// Ordena por nº de ocasiões em comum e, em empate, prioriza a mesma categoria.
// Enriquece cada card com a linha de spec real (specLineFor) — honesto.
import { getCatalog, type CatalogItem } from "@/lib/catalog.server";
import { occasionsForItem } from "@/lib/occasions";
import { specLineFor } from "@/lib/product-specs";
import { CatalogCard } from "./CatalogCard";

interface RelatedProductsProps {
    item: CatalogItem;
}

export async function RelatedProducts({ item }: RelatedProductsProps) {
    const all = await getCatalog();
    const myOccasions = new Set(occasionsForItem(item));
    const myTop = item.key.split("/")[0];

    const scored = all
        .filter((it) => it.key !== item.key)
        .map((it) => {
            const shared = occasionsForItem(it).filter((o) => myOccasions.has(o)).length;
            const sameCat = it.key.split("/")[0] === myTop ? 1 : 0;
            return { it, shared, sameCat };
        })
        .filter((s) => s.shared > 0 || s.sameCat === 1)
        .sort((a, b) => b.shared - a.shared || b.sameCat - a.sameCat)
        .slice(0, 6);

    if (scored.length === 0) return null;

    return (
        <section aria-label="Itens que combinam" className="border-t border-border/50 pt-10">
            <h2 className="mb-6 font-display text-xl font-bold tracking-tight md:text-2xl">
                Combina com a sua festa
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
                {scored.map(({ it }, idx) => (
                    <CatalogCard
                        key={it.key}
                        item={{ ...it, specLine: specLineFor(it) ?? undefined }}
                        index={idx}
                    />
                ))}
            </div>
        </section>
    );
}
