// src/components/catalogo/CatalogSection.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CatalogCard } from "./CatalogCard";
import { Button } from "@/components/ui/button";
import { FiChevronDown } from "react-icons/fi";
import {cn} from "@/lib/utils";

interface CatalogSectionProps {
    categoria: string;
    items: Array<{
        key: string;
        titulo: string;
        descricao?: string;
        imagens?: string[];
    }>;
    initialLimit?: number;
}

export function CatalogSection({ categoria, items, initialLimit = 6 }: CatalogSectionProps) {
    const [showAll, setShowAll] = useState(false);
    const displayItems = showAll ? items : items.slice(0, initialLimit);
    const hasMore = items.length > initialLimit;

    return (
        <section id={encodeURIComponent(categoria)} className="scroll-mt-20 text-primary/80 bg-muted/20 p-10 rounded-lg">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                {/* Section Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight "># {categoria}</h2>
                        <p className="mt-1 text-muted-foreground">
                            {items.length} {items.length === 1 ? "item" : "itens"} disponíveis
                        </p>
                    </div>

                    {/* Category Actions */}
                    {/*<div className="flex gap-2">*/}
                    {/*    <Button variant="outline" size="sm" className="hidden sm:inline-flex">*/}
                    {/*        Filtrar*/}
                    {/*    </Button>*/}
                    {/*</div>*/}
                </div>

                {/* Items Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {displayItems.map((item, idx) => (
                        <CatalogCard key={item.key} item={item} index={idx} />
                    ))}
                </div>

                {/* Show More Button */}
                {hasMore && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-8 text-center"
                    >
                        <Button
                            variant="outline"
                            onClick={() => setShowAll(!showAll)}
                            className="group"
                        >
                            {showAll ? "Mostrar menos" : `Ver todos os ${items.length} itens`}
                            <FiChevronDown
                                className={cn(
                                    "ml-2 h-4 w-4 transition-transform duration-300",
                                    showAll && "rotate-180"
                                )}
                            />
                        </Button>
                    </motion.div>
                )}
            </motion.div>
        </section>
    );
}