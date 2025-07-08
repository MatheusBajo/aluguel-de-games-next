// src/components/catalogo/CatalogCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {FiArrowRight, FiImage, FiStar} from "react-icons/fi";
import {Badge} from "@/components/ui/badge";
import {motion} from "framer-motion";
import {useState} from "react";
import {getImagePath} from "@/lib/image-utils";
import {generateProductUrl} from "@/lib/slug-utils";

interface CatalogCardProps {
    item: {
        key: string;
        titulo: string;
        descricao?: string;
        imagens?: string[];
        categoria?: string;
    };
    index?: number;
}

export function CatalogCard({ item, index = 0 }: CatalogCardProps) {
    const [imageError, setImageError] = useState(false);
    const categoria = item.key.split("/")[0];

    // Extrair primeira linha da descrição markdown
    const shortDescription = item.descricao
        ?.split("\n")[0]
        ?.replace(/[*_#]/g, "")
        ?.trim()
        ?.slice(0, 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5 }}
            className="h-full"
        >
            <Link
                href={generateProductUrl(item.key)}
                className="group relative flex h-full flex-col overflow-hidden rounded-xl sm:rounded-2xl border border-primary/20 bg-card/30 backdrop-blur-sm transition-all duration-300 hover:rotate-1 hover:scale-103 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 dark:bg-card/20"
            >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 -z-10 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-800/100 via-blue-950/10 to-purple-950/20" />
                </div>

                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted/50 to-muted/30">
                    {item.imagens?.[0] && !imageError ? (
                        <Image
                            src={getImagePath(item.key, item.imagens[0])}
                            alt={item.titulo}
                            fill
                            className="object-cover transition-all duration-500 group-hover:scale-110"
                            unoptimized
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <FiImage className="h-12 w-12 text-muted-foreground/50" />
                        </div>
                    )}

                    {/* Categoria Badge */}
                    <Badge
                        variant="secondary"
                        className="absolute left-2 top-2 bg-background/80 backdrop-blur-sm"
                    >
                        {categoria}
                    </Badge>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
                    <h3 className="line-clamp-2 text-base sm:text-lg font-semibold transition-colors group-hover:text-primary">
                        {item.titulo}
                    </h3>

                    {shortDescription && (
                        <p className="line-clamp-2 text-xs sm:text-sm text-muted-foreground">
                            {shortDescription}
                        </p>
                    )}

                    {/* Rating */}
                    <div className="mt-auto flex items-center gap-1 text-xs">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <FiStar
                                    key={i}
                                    className={`h-3 w-3 ${
                                        i < 4 ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-muted-foreground">(4.8)</span>
                    </div>

                    {/* CTA */}
                    <div className="mt-2 flex items-center gap-2 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        Ver detalhes
                        <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}