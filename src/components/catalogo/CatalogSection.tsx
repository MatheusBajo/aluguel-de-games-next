// src/components/catalogo/CatalogSection.tsx
"use client";

import {useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {CatalogCard} from "./CatalogCard";
import {Button} from "@/components/ui/button";
import {FiArrowRight, FiChevronDown, FiChevronUp} from "react-icons/fi";
import Link from "next/link";

interface CatalogSectionProps {
    categoria: string;
    items: Array<{
        key: string;
        titulo: string;
        descricao?: string;
        imagens?: string[];
    }>;
    initialLimit?: number;
    initialLimitMobile?: number;
    isLandingPage?: boolean;
}

export function CatalogSection({
                                   categoria,
                                   items,
                                   initialLimit = 6,
                                   initialLimitMobile = 3,
                                   isLandingPage = false
                               }: CatalogSectionProps) {
    const [showAll, setShowAll] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detectar se é mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const currentLimit = isMobile ? initialLimitMobile : initialLimit;
    const displayItems = showAll ? items : items.slice(0, currentLimit);
    const hasMore = items.length > currentLimit;

    return (
        <motion.section
            id={encodeURIComponent(categoria)}
            className="scroll-mt-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="relative">
                {/* Background decorativo sutil */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-600/5 rounded-3xl blur-3xl -z-10 opacity-50" />

                <div className="bg-muted/30 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 border border-primary/10">
                    {/* Section Header */}
                    <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                {categoria}
                            </h3>
                            <p className="mt-1 md:mt-2 text-sm md:text-base text-muted-foreground">
                                {items.length} {"equipamentos disponíveis"}
                            </p>
                        </div>

                        {/* Link direto para categoria no catálogo - desktop */}
                        {isLandingPage && !isMobile && (
                            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
                                <Link href={`/catalogo#${encodeURIComponent(categoria)}`}>
                                    Ver todos de {categoria}
                                    <FiArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        )}
                    </div>

                    {/* Items Grid Responsivo */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                        <AnimatePresence mode="popLayout">
                            {displayItems.map((item, idx) => (
                                <motion.div
                                    key={item.key}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{
                                        duration: 0.3,
                                        delay: showAll ? 0 : idx * 0.05
                                    }}
                                >
                                    <CatalogCard item={item} index={idx} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Botões de ação */}
                    {(hasMore || isLandingPage) && (
                        <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            {/* Show More/Less Button - não aparece na landing page */}
                            {hasMore && !isLandingPage && (
                                <Button
                                    variant="outline"
                                    onClick={() => setShowAll(!showAll)}
                                    className="group w-full sm:w-auto"
                                >
                                    {showAll ? (
                                        <>
                                            Mostrar menos
                                            <FiChevronUp className="ml-2 h-4 w-4 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    ) : (
                                        <>
                                            Ver mais {items.length - currentLimit} {items.length - currentLimit === 1 ? 'item' : 'itens'}
                                            <FiChevronDown className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            )}

                            {/* Ver categoria completa - na landing page */}
                            {isLandingPage && hasMore && (
                                <Button
                                    asChild
                                    variant={isMobile ? "default" : "outline"}
                                    className="group w-full sm:w-auto"
                                >
                                    <Link href={`/catalogo#${encodeURIComponent(categoria)}`}>
                                        Ver todos os {items.length} de {categoria}
                                        <FiArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.section>
    );
}