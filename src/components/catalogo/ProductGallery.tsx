// src/components/catalogo/ProductGallery.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiMaximize2, FiX } from "react-icons/fi";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
    images: string[];
    title: string;
    itemKey: string;
}

export function ProductGallery({ images, title, itemKey }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const hasImages = images.length > 0;
    const currentImage = hasImages ? images[selectedIndex] : null;

    const nextImage = () => {
        setSelectedIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (!hasImages) {
        return (
            <div className="sticky top-20 flex aspect-square items-center justify-center rounded-3xl border bg-muted/20">
                <p className="text-muted-foreground">Sem imagens disponíveis</p>
            </div>
        );
    }

    return (
        <>
            <div className="sticky top-20">
                {/* Main Image */}
                <motion.div
                    className="group relative aspect-square overflow-hidden rounded-3xl border bg-muted/20"
                    layoutId="gallery-main"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedIndex}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="relative h-full w-full"
                        >
                            <Image
                                src={`/Organizado/${itemKey}/${currentImage}`}
                                alt={`${title} - Imagem ${selectedIndex + 1}`}
                                fill
                                className="object-contain"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                priority={selectedIndex === 0}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"
                            >
                                <FiChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"
                            >
                                <FiChevronRight className="h-5 w-5" />
                            </button>
                        </>
                    )}

                    {/* Fullscreen Button */}
                    <button
                        onClick={() => setIsFullscreen(true)}
                        className="absolute right-4 top-4 rounded-full bg-background/80 p-2 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"
                    >
                        <FiMaximize2 className="h-5 w-5" />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-4 rounded-full bg-background/80 px-3 py-1 text-sm backdrop-blur-sm">
                        {selectedIndex + 1} / {images.length}
                    </div>
                </motion.div>

                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedIndex(idx)}
                                className={cn(
                                    "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-300",
                                    selectedIndex === idx
                                        ? "border-primary ring-2 ring-primary/30"
                                        : "border-transparent hover:border-muted-foreground/50"
                                )}
                            >
                                <Image
                                    src={`/Organizado/${itemKey}/${img}`}
                                    alt={`${title} - Miniatura ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Fullscreen Modal */}
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
                        onClick={() => setIsFullscreen(false)}
                    >
                        <button
                            className="absolute right-4 top-4 rounded-full bg-background/80 p-2 backdrop-blur-sm"
                            onClick={() => setIsFullscreen(false)}
                        >
                            <FiX className="h-6 w-6" />
                        </button>

                        <motion.div
                            layoutId="gallery-main"
                            className="relative max-h-[90vh] max-w-[90vw]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={`/Organizado/${itemKey}/${currentImage}`}
                                alt={`${title} - Imagem ${selectedIndex + 1}`}
                                width={1200}
                                height={1200}
                                className="h-auto max-h-[90vh] w-auto object-contain"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}