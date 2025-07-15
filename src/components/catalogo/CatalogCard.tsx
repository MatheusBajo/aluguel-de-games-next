// src/components/catalogo/CatalogCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { FiImage, FiStar } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useState } from "react";
import { getImagePath } from "@/lib/image-utils";
import { generateProductUrl } from "@/lib/slug-utils";
import { cn } from "@/lib/utils";

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
    const categorias = item.key.split("/");
    const categoria = categorias[0];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02, duration: 0.3 }}
            className="h-full"
        >
            <Link
                href={generateProductUrl(item.key)}
                className="group relative flex h-full flex-col overflow-hidden rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-purple-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20"
            >
                {/* Hover individual do card */}
                <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Image Container compacto */}
                    <div className="relative aspect-square overflow-hidden bg-gray-900">
                        {item.imagens?.[0] && !imageError ? (
                            <>
                                <Image
                                    src={getImagePath(item.key, item.imagens[0])}
                                    alt={item.titulo}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                                    unoptimized
                                    onError={() => setImageError(true)}
                                />
                                {/* Gradient overlay sutil */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </>
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-900">
                                <FiImage className="h-12 w-12 text-gray-700" />
                            </div>
                        )}

                        {/* Badge categoria */}
                        <div className="absolute top-2 left-2">
                            <Badge
                                variant="secondary"
                                className="bg-black/60 text-white border-0 text-xs backdrop-blur-sm"
                            >
                                {categoria}
                            </Badge>
                        </div>
                    </div>
                </motion.div>

                {/* Content compacto */}
                <div className="flex-1 p-3 space-y-2">
                    {/* Título */}
                    <h3 className="text-sm font-medium text-gray-200 line-clamp-2 group-hover:text-purple-400 transition-colors">
                        {item.titulo}
                    </h3>

                    {/* Rating compacto */}
                    <div className="flex items-center gap-1">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <FiStar
                                    key={i}
                                    className={cn(
                                        "h-2.5 w-2.5",
                                        i < 4
                                            ? "fill-yellow-500 text-yellow-500"
                                            : "text-gray-600"
                                    )}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-gray-500">4.8</span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}