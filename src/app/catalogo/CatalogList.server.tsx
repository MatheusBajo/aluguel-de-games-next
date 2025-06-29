// src/app/catalogo/CatalogList.server.tsx
import { getCatalog } from "@/lib/catalog.server";
import { CatalogSection } from "@/components/catalogo/CatalogSection";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FiArrowRight } from "react-icons/fi";

interface Props {
    order?: string[];
    limitPerCat?: number;
    limitPerCatMobile?: number;
    isLandingPage?: boolean;
}

export default async function CatalogList({
                                              order,
                                              limitPerCat = 6,
                                              limitPerCatMobile = 3,
                                              isLandingPage = false
                                          }: Props) {
    const itens = await getCatalog();
    const grupos = itens.reduce<Record<string, typeof itens>>((acc, it) => {
        const cat = it.key.split("/")[0];
        (acc[cat] ||= []).push(it);
        return acc;
    }, {});

    const categorias = order
        ? [...order, ...Object.keys(grupos).filter((c) => !order.includes(c))]
        : Object.keys(grupos);

    // Para landing page, pode limitar categorias se desejar
    const displayCategories = isLandingPage ? categorias : categorias;

    return (
        <section className="mx-auto flex flex-col w-full max-w-[1400px] gap-8 md:gap-12 lg:gap-16 px-4 md:px-6 py-5">
            <div className="space-y-8 md:space-y-12 lg:space-y-16">
                {displayCategories.map((cat) => {
                    const items = grupos[cat];
                    if (!items?.length) return null;

                    return (
                        <CatalogSection
                            key={cat}
                            categoria={cat}
                            items={items}
                            initialLimit={limitPerCat}
                            initialLimitMobile={limitPerCatMobile}
                            isLandingPage={isLandingPage}
                        />
                    );
                })}
            </div>

            {/* Botão Ver Catálogo Completo - apenas na landing */}
            {isLandingPage && (
                <div className="text-center mt-8 md:mt-12">
                    <Button asChild size="lg" className="group">
                        <Link href="/catalogo">
                            Ver Catálogo Completo
                            <FiArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </div>
            )}
        </section>
    );
}