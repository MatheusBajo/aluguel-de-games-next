// src/components/catalogo/CatalogCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {FiArrowRight, FiImage, FiStar} from "react-icons/fi";
import {Badge} from "@/components/ui/badge";
import {motion} from "framer-motion";
import {useState} from "react";

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
                href={`/catalogo/${item.key.split('/').map(encodeURIComponent).join('/')}`}
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
                            src={`/Organizado/${item.key}/${item.imagens[0]}`}
                            alt={item.titulo}
                            fill
                            className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:saturate-120"
                            onError={() => setImageError(true)}
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            loading="lazy"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <FiImage className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/50" />
                        </div>
                    )}

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-background/0 to-transparent opacity-100 transition-opacity duration-300 group-hover:opacity-0" />

                    {/* Category Badge */}
                    <div className="absolute left-2 top-2 sm:left-3 sm:top-3">
                        <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-xs sm:text-sm">
                            {categoria}
                        </Badge>
                    </div>

                    {/* Quick View Icon */}
                    <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 translate-y-10 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <div className="rounded-full bg-primary p-1.5 sm:p-2 text-primary-foreground shadow-lg">
                            <FiArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
                    <h3 className="line-clamp-2 text-base sm:text-lg font-semibold transition-colors duration-300 group-hover:text-primary">
                        {item.titulo}
                    </h3>

                    {shortDescription && (
                        <p className="line-clamp-2 text-xs sm:text-sm text-muted-foreground">
                            {shortDescription}
                        </p>
                    )}

                    {/* Footer */}
                    <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <FiStar className="h-3 w-3" />
                            <span className="hidden sm:inline">Popular</span>
                        </div>
                        <span className="text-xs font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            Ver detalhes →
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}