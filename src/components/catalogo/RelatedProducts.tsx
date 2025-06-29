// src/components/catalogo/RelatedProducts.tsx
import { getCatalog } from "@/lib/catalog.server";
import { CatalogCard } from "./CatalogCard";

interface RelatedProductsProps {
    categoria: string;
    currentKey: string;
}

export async function RelatedProducts({ categoria, currentKey }: RelatedProductsProps) {
    const allItems = await getCatalog();
    const relatedItems = allItems
        .filter((item) => item.key.startsWith(categoria) && item.key !== currentKey)
        .slice(0, 4);

    if (relatedItems.length === 0) return null;

    return (
        <section className="border-t px-4 py-16">
            <h2 className="mb-8 text-2xl font-bold">Produtos Relacionados</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedItems.map((item, idx) => (
                    <CatalogCard key={item.key} item={item} index={idx} />
                ))}
            </div>
        </section>
    );
}