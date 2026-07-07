// src/components/catalogo/RelatedProducts.tsx
//
// Relacionados por CURADORIA (nunca "quem alugou" — não temos esse dado e seria
// fabricação). Prioriza irmãos do mesmo nível (mesma subcategoria); completa com
// a categoria de nível-1. Passa a spec real (dimensões) pro card quando existe.
import { getCatalog } from "@/lib/catalog.server";
import { resolveSpecs } from "@/lib/catalog-specs";
import { CatalogCard } from "./CatalogCard";

interface RelatedProductsProps {
    categoria: string;
    currentKey: string;
}

export async function RelatedProducts({ categoria, currentKey }: RelatedProductsProps) {
    const allItems = await getCatalog();

    const parentPrefix = currentKey.split("/").slice(0, -1).join("/");
    const others = allItems.filter((it) => it.key !== currentKey);

    // 1º os irmãos diretos (mesmo pai), depois o resto da categoria de nível-1
    const siblings = others.filter((it) => it.key.startsWith(parentPrefix + "/"));
    const sameTop = others.filter(
        (it) => it.key.startsWith(categoria + "/") && !siblings.includes(it)
    );

    const related = [...siblings, ...sameTop].slice(0, 4);
    if (related.length === 0) return null;

    return (
        <section className="border-t border-border/40 pt-12">
            <h2 className="mb-6 font-display text-2xl md:text-3xl font-extrabold tracking-tight">
                Relacionados
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {related.map((item, idx) => {
                    const dims = resolveSpecs(item.specs, item.imagens).dimensoes;
                    return (
                        <CatalogCard key={item.key} item={item} index={idx} specLine={dims} />
                    );
                })}
            </div>
        </section>
    );
}
