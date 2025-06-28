// src/app/catalogo/CatalogList.server.tsx
import { getCatalog } from "@/lib/catalog.server";
import { CatalogSection } from "@/components/catalogo/CatalogSection";

interface Props {
    order?: string[];
    limitPerCat?: number;
}

export default async function CatalogList({ order, limitPerCat = 6 }: Props) {
    const itens = await getCatalog();
    const grupos = itens.reduce<Record<string, typeof itens>>((acc, it) => {
        const cat = it.key.split("/")[0];
        (acc[cat] ||= []).push(it);
        return acc;
    }, {});

    const categorias = order
        ? [...order, ...Object.keys(grupos).filter((c) => !order.includes(c))]
        : Object.keys(grupos);

    return (
        <section className="mx-auto flex flex-col w-full max-w-[1400px] gap-20 py-5">
            <div className="space-y-10">
                {categorias.map((cat) => {
                    const items = grupos[cat];
                    if (!items?.length) return null;

                    return (
                        <CatalogSection
                            key={cat}
                            categoria={cat}
                            items={items}
                            initialLimit={limitPerCat}
                        />
                    );
                })}
            </div>
        </section>
    );
}