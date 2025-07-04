// src/components/catalogo/ProductGallery.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiMaximize2, FiX } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { getImagePath } from "@/lib/image-utils";

interface ProductGalleryProps {
    images: string[];
    title: string;
    itemKey: string;
}

export function ProductGallery({ images, title, itemKey }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

    const hasImages = images.length > 0;
    const currentImage = hasImages ? images[selectedIndex] : null;

    const nextImage = () => {
        setSelectedIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleImageError = (index: number) => {
        setImageErrors((prev) => ({ ...prev, [index]: true }));
    };

    if (!hasImages) {
        return (
            <div className="mt-20">
                <div className="flex aspect-square w-full items-center justify-center rounded-3xl border bg-muted/20">
                    <p className="text-muted-foreground">Sem imagens disponíveis</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Container com controle rigoroso de width */}
            <div className="mt-20 min-w-0 max-w-full select-none">
                {/* Main Image */}
                <motion.div
                    className="group relative aspect-square w-full overflow-hidden rounded-3xl border bg-muted/20"
                    layoutId="gallery-main"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedIndex}
                            initial={{opacity: 0, scale: 0.95}}
                            animate={{opacity: 1, scale: 1}}
                            exit={{opacity: 0, scale: 0.95}}
                            transition={{duration: 0.15}}
                            className="relative h-full w-full"
                        >
                            {!imageErrors[selectedIndex] ? (
                                <Image
                                    src={getImagePath(itemKey, currentImage!)}
                                    alt={`${title} - Imagem ${selectedIndex + 1}`}
                                    fill
                                    className="object-contain"
                                    draggable={false}
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority={selectedIndex === 0}
                                    unoptimized
                                    onError={() => handleImageError(selectedIndex)}
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <p className="text-muted-foreground">Erro ao carregar imagem</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 opacity-0 transition-all hover:bg-background group-hover:opacity-100"
                                aria-label="Imagem anterior"
                            >
                                <FiChevronLeft className="h-6 w-6" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 opacity-0 transition-all hover:bg-background group-hover:opacity-100"
                                aria-label="Próxima imagem"
                            >
                                <FiChevronRight className="h-6 w-6" />
                            </button>
                        </>
                    )}

                    {/* Fullscreen Button */}
                    <button
                        onClick={() => setIsFullscreen(true)}
                        className="absolute right-4 top-4 rounded-full bg-background/80 p-2 opacity-0 transition-all hover:bg-background group-hover:opacity-100"
                        aria-label="Tela cheia"
                    >
                        <FiMaximize2 className="h-5 w-5" />
                    </button>

                    {/* Image Counter */}
                    {images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-background/80 px-3 py-1 text-sm">
                            {selectedIndex + 1} / {images.length}
                        </div>
                    )}
                </motion.div>

                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                        {images.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedIndex(index)}
                                className={cn(
                                    "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                                    selectedIndex === index
                                        ? "border-primary ring-2 ring-primary/30"
                                        : "border-transparent hover:border-muted-foreground/50"
                                )}
                            >
                                {!imageErrors[index] ? (
                                    <Image
                                        src={getImagePath(itemKey, img)}
                                        alt={`${title} - Miniatura ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="80px"
                                        unoptimized
                                        onError={() => handleImageError(index)}
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-muted">
                                        <FiX className="text-muted-foreground" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Fullscreen Modal */}
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur"
                        onClick={() => setIsFullscreen(false)}
                    >
                        <button
                            onClick={() => setIsFullscreen(false)}
                            className="absolute right-4 top-4 rounded-full bg-background p-2 shadow-lg"
                            aria-label="Fechar tela cheia"
                        >
                            <FiX className="h-6 w-6" />
                        </button>

                        <div className="relative h-[90vh] w-[90vw]">
                            {!imageErrors[selectedIndex] ? (
                                <Image
                                    src={getImagePath(itemKey, currentImage!)}
                                    alt={`${title} - Imagem ${selectedIndex + 1}`}
                                    fill
                                    className="object-contain"
                                    sizes="90vw"
                                    unoptimized
                                    onError={() => handleImageError(selectedIndex)}
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <p className="text-muted-foreground">Erro ao carregar imagem</p>
                                </div>
                            )}
                        </div>

                        {/* Fullscreen Navigation */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        prevImage();
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background p-3 shadow-lg"
                                    aria-label="Imagem anterior"
                                >
                                    <FiChevronLeft className="h-8 w-8" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        nextImage();
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background p-3 shadow-lg"
                                    aria-label="Próxima imagem"
                                >
                                    <FiChevronRight className="h-8 w-8" />
                                </button>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}