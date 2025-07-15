// src/components/catalogo/CatalogSection.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CatalogCard } from "./CatalogCard";
import { Button } from "@/components/ui/button";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { cn } from "@/lib/utils";

interface CatalogSectionProps {
    categoria: string;
    items: {
        key: string;
        titulo: string;
        descricao?: string;
        imagens?: string[];
    }[];
    initialLimit?: number;
    initialLimitMobile?: number;
    headingLevel?: "h3" | "h4";
    hideHeader?: boolean;
    isSoloSection?: boolean;
}

export function CatalogSection({
                                   categoria,
                                   items,
                                   initialLimit = 12,
                                   initialLimitMobile = 6,
                                   headingLevel = "h3",
                                   hideHeader = false,
                                   isSoloSection = false,
                               }: CatalogSectionProps) {
    const [showAll, setShowAll] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const fn = () => setIsMobile(window.innerWidth < 768);
        fn();
        window.addEventListener("resize", fn);
        return () => window.removeEventListener("resize", fn);
    }, []);

    const lim = isMobile ? initialLimitMobile : initialLimit;
    const display = showAll ? items : items.slice(0, lim);

    // Renderização condicional do heading sem usar JSX.IntrinsicElements
    const renderHeading = () => {
        const content = (
            <>
                {categoria}
            </>
        );

        if (headingLevel === "h4") {
            return <h4 className="text-xl md:text-2xl font-bold text-gray-100">{content}</h4>;
        }
        return <h3 className="text-xl md:text-2xl font-bold text-gray-100">{content}</h3>;
    };

    return (
        <motion.section
            id={encodeURIComponent(categoria)}
            className="scroll-mt-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="space-y-4">
                {!hideHeader && (
                    <div className="space-y-2">
                        {/* Título da subcategoria */}
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-1 bg-purple-500 rounded-full" />
                            {renderHeading()}
                            <span className="text-sm text-gray-500">({items.length})</span>
                        </div>

                        {/* Linha divisória */}
                        <div className="h-px bg-gradient-to-r from-gray-800 via-gray-700/50 to-transparent max-w-xs" />
                    </div>
                )}

                {/* Grid de produtos */}
                <div
                    className={cn(
                        "grid gap-3 md:gap-4",
                        isSoloSection && items.length <= 3
                            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-4xl"
                            : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                    )}
                >
                    <AnimatePresence mode="popLayout">
                        {display.map((item, i) => (
                            <motion.div
                                key={item.key}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2, delay: i * 0.02 }}
                            >
                                <CatalogCard item={item} index={i} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {items.length > lim && (
                    <div className="flex justify-center pt-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAll((s) => !s)}
                            className="text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                        >
                            {showAll ? (
                                <>
                                    Mostrar menos
                                    <FiChevronUp className="ml-1 h-4 w-4" />
                                </>
                            ) : (
                                <>
                                    Ver mais {items.length - lim} produtos
                                    <FiChevronDown className="ml-1 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </motion.section>
    );
}