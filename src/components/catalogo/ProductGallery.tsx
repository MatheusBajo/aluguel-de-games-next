// src/components/catalogo/ProductGallery.tsx
"use client";

import {useState} from "react";
import Image from "next/image";
import {AnimatePresence, motion} from "framer-motion";
import {FiChevronLeft, FiChevronRight, FiMaximize2, FiX} from "react-icons/fi";
import {cn} from "@/lib/utils";

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
            <div className="mt-20 min-w-0 max-w-full">
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
                            transition={{duration: 0.3}}
                            className="relative h-full w-full"
                        >
                            <Image
                                src={`/Organizado/${itemKey}/${currentImage}`}
                                alt={`${title} - Imagem ${selectedIndex + 1}`}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                priority={selectedIndex === 0}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-1.5 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 md:left-4 md:p-2"
                            >
                                <FiChevronLeft className="h-4 w-4 md:h-5 md:w-5"/>
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-1.5 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 md:right-4 md:p-2"
                            >
                                <FiChevronRight className="h-4 w-4 md:h-5 md:w-5"/>
                            </button>
                        </>
                    )}

                    {/* Fullscreen Button */}
                    <button
                        onClick={() => setIsFullscreen(true)}
                        className="absolute right-2 top-2 z-10 rounded-full bg-background/80 p-1.5 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 md:right-4 md:top-4 md:p-2"
                    >
                        <FiMaximize2 className="h-4 w-4 md:h-5 md:w-5"/>
                    </button>

                    {/* Image Counter */}
                    <div className="absolute bottom-2 left-2 rounded-full bg-background/80 px-2 py-1 text-xs backdrop-blur-sm md:bottom-4 md:left-4 md:px-3 md:text-sm">
                        {selectedIndex + 1} / {images.length}
                    </div>
                </motion.div>

                {/* Thumbnails - Container com controle rígido */}
                {images.length > 1 && (
                    <div className="mt-4 w-full min-w-0">
                        <div
                            className="flex space-x-1.5 overflow-x-auto md:space-x-2"
                            style={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                                WebkitScrollbar: { display: 'none' }
                            }}
                        >
                            {images.map((img, idx) => (
                                <div
                                    key={idx}
                                    className="flex-shrink-0"
                                >
                                    <button
                                        onClick={() => setSelectedIndex(idx)}
                                        className={cn(
                                            "relative block h-12 w-12 overflow-hidden rounded-lg border-2 transition-all duration-300 md:h-20 md:w-20",
                                            selectedIndex === idx
                                                ? "border-primary ring-1 ring-primary/30"
                                                : "border-transparent hover:border-muted-foreground/50"
                                        )}
                                    >
                                        <Image
                                            src={`/Organizado/${itemKey}/${img}`}
                                            alt={`${title} - Miniatura ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 48px, 80px"
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
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
                        className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4"
                        onClick={() => setIsFullscreen(false)}
                    >
                        <button
                            className="absolute right-4 top-4 z-10 rounded-full bg-background/80 p-2 backdrop-blur-sm"
                            onClick={() => setIsFullscreen(false)}
                        >
                            <FiX className="h-6 w-6" />
                        </button>

                        <motion.div
                            layoutId="gallery-main"
                            className="relative flex h-full w-full items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={`/Organizado/${itemKey}/${currentImage}`}
                                alt={`${title} - Imagem ${selectedIndex + 1}`}
                                width={1200}
                                height={1200}
                                className="max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] object-contain"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CSS para esconder scrollbar completamente */}
            <style jsx>{`
                .overflow-x-auto::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </>
    );
}