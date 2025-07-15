// src/app/catalogo/CatalogList.server.tsx
import { getCatalog } from "@/lib/catalog.server";
import { CatalogSection } from "@/components/catalogo/CatalogSection";

interface Props {
    /** ordem manual das categorias nível‑1 */
    order?: string[];
    /** itens por categoria (desktop) */
    limitPerCat?: number;
    /** itens por categoria (mobile) */
    limitPerCatMobile?: number;
    /** quantas categorias renderizar na página */
    maxCats?: number;
}

export default async function CatalogList({
                                              order,
                                              limitPerCat = 12,
                                              limitPerCatMobile = 6,
                                              maxCats,
                                          }: Props) {
    /* 1 ─ carrega todo o catálogo */
    const items = await getCatalog();

    /* 2 ─ agrupa por categoria de nível‑1 */
    const lvl1: Record<string, typeof items> = {};
    for (const it of items) {
        const [cat] = it.key.split("/");
        (lvl1[cat] ||= []).push(it);
    }

    /* 3 ─ define a ordem + aplica o corte de categorias */
    let lvl1Keys = order
        ? [...order, ...Object.keys(lvl1).filter((k) => !order.includes(k))]
        : Object.keys(lvl1);

    // mantém só categorias existentes
    lvl1Keys = lvl1Keys.filter((k) => lvl1[k]?.length);

    // corta pela quantidade desejada
    if (typeof maxCats === "number") {
        lvl1Keys = lvl1Keys.slice(0, maxCats);
    }

    return (
        <section className="mx-auto w-full max-w-[1600px] flex flex-col gap-12 px-4 md:px-6 py-6 md:py-8">
            {lvl1Keys.map((cat) => {
                const lvl1Items = lvl1[cat];
                if (!lvl1Items) return null;

                /* 4 ─ agrupa subcategorias (nível‑2) */
                const lvl2: Record<string, typeof lvl1Items> = {};
                const soloItems: typeof lvl1Items = [];

                for (const it of lvl1Items) {
                    const [, sub = "Outros"] = it.key.split("/");
                    (lvl2[sub] ||= []).push(it);
                }

                const multiItemSubs: Record<string, typeof lvl1Items> = {};
                Object.entries(lvl2).forEach(([sub, subItems]) => {
                    if (subItems.length === 1) soloItems.push(subItems[0]);
                    else multiItemSubs[sub] = subItems;
                });

                return (
                    <div key={cat} className="relative">
                        {/* Container da categoria principal */}
                        <div className="relative overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-800/50">
                            {/* Header compacto */}
                            <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-purple-900/50 to-gray-900 p-6 md:p-8">
                                {/* Pattern overlay */}
                                <div className="absolute inset-0 opacity-10">
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            backgroundImage:
                                                "linear-gradient(45deg, transparent 48%, rgba(139, 92, 246, 0.1) 50%, transparent 52%)",
                                            backgroundSize: "20px 20px",
                                        }}
                                    />
                                </div>

                                <div className="relative">
                                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                                        {cat}
                                    </h2>
                                    <p className="mt-1 text-gray-400 text-sm">
                                        {lvl1Items.length} produtos disponíveis
                                    </p>
                                </div>
                            </div>

                            {/* Conteúdo */}
                            <div className="p-4 md:p-6 space-y-8">
                                {/* Subcategorias com vários itens */}
                                {Object.entries(multiItemSubs).map(([sub, subItems], i) => (
                                    <div
                                        key={sub}
                                        className="animate-in fade-in slide-in-from-bottom duration-500"
                                        style={{ animationDelay: `${i * 50}ms` }}
                                    >
                                        <CatalogSection
                                            categoria={sub}
                                            items={subItems}
                                            headingLevel="h3"
                                            initialLimit={limitPerCat}
                                            initialLimitMobile={limitPerCatMobile}
                                            hideHeader={false}
                                        />
                                    </div>
                                ))}

                                {/* Itens solo */}
                                {soloItems.length > 0 && (
                                    <div className="animate-in fade-in slide-in-from-bottom duration-500 pt-4 border-t border-gray-800/50">
                                        <CatalogSection
                                            categoria="Outros"
                                            items={soloItems}
                                            headingLevel="h3"
                                            initialLimit={soloItems.length}
                                            initialLimitMobile={soloItems.length}
                                            hideHeader={soloItems.length === 1}
                                            isSoloSection
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </section>
    );
}
