"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import {trackWhatsAppClick} from "@/lib/gtm-utils";

interface MediaItem {
    id: string;
    type: 'video' | 'image';
    src: string;
    title: string;
    preserveAspect?: boolean;
}

const mediaItems: MediaItem[] = [
    {
        id: '1',
        type: 'video',
        src: '/demonstra/VID-20230928-WA0025.mp4',
        title: 'Danilo Gentili - Pinball',
        preserveAspect: false
    },
    {
        id: '2',
        type: 'video',
        src: '/demonstra/VID-20231020-WA0026.mp4',
        title: 'Evento Especial',
    },
    {
        id: '3',
        type: 'image',
        src: '/carousel/compressed/PinballDaniloGentili.webp',
        title: 'Pinball Premium - Danilo',
        preserveAspect: true
    },
    {
        id: '4',
        type: 'video',
        src: '/demonstra/WhatsApp Video 2021-08-09 at 11.57.30.mp4',
        title: 'Festa Corporativa',
    },
    {
        id: '5',
        type: 'video',
        src: '/demonstra/WhatsApp Video 2023-10-04 at 17.45.14 - Copia.mp4',
        title: 'Fliperama Clássico',
    },
    {
        id: '6',
        type: 'video',
        src: '/demonstra/WhatsApp Video 2025-07-01 at 13.12.12.mp4',
        title: 'Kay Black - Máquina de Boxe',
    },
    {
        id: '7',
        type: 'video',
        src: '/demonstra/Vídeo do WhatsApp de 2024-11-13 à(s) 17.19.45_c9e99fd1.mp4',
        title: 'Diversão Garantida',
    },
    {
        id: '8',
        type: 'image',
        src: '/demonstra/photo_4997175938043194978_y.webp',
        title: 'Momento Especial',
    },
    {
        id: '9',
        type: 'video',
        src: '/demonstra/20250405_165640.mp4',
        title: 'Lançamento 2025',
    }
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    }
};

function MediaCard({ item }: { item: MediaItem }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 1, height: 1 });

    useEffect(() => {
        if (item.type === 'video' && videoRef.current) {
            const video = videoRef.current;
            video.muted = true;

            video.addEventListener('loadedmetadata', () => {
                setDimensions({
                    width: video.videoWidth,
                    height: video.videoHeight
                });
                setIsLoaded(true);
                video.play().catch(error => {
                    console.log('Autoplay prevented:', error);
                });
            });
        } else if (item.type === 'image') {
            const img = new Image();
            img.onload = () => {
                setDimensions({
                    width: img.width,
                    height: img.height
                });
                setIsLoaded(true);
            };
            img.src = item.src;
        }
    }, [item]);

    const getSpanClass = () => {
        const ratio = dimensions.width / dimensions.height;

        if (ratio < 0.7) {
            return "col-span-1 row-span-2";
        } else if (ratio > 1.5) {
            return "col-span-2 row-span-1";
        } else if (ratio > 1.2) {
            return "col-span-2 row-span-1";
        } else {
            return "col-span-1 row-span-1";
        }
    };

    const getObjectFit = () => {
        return item.preserveAspect ? 'object-contain' : 'object-cover';
    };

    const getBackgroundClass = () => {
        return item.preserveAspect ? 'bg-gray-900' : '';
    };

    return (
        <motion.div
            variants={itemVariants}
            className={cn(
                "relative overflow-hidden rounded-lg group cursor-pointer",
                "transition-all duration-300 hover:shadow-2xl hover:z-10",
                getBackgroundClass(),
                getSpanClass()
            )}
            style={{
                minHeight: '150px'
            }}
        >
            {!isLoaded && (
                <div className="absolute inset-0 bg-gray-800 animate-pulse" />
            )}
            <div className="relative w-full h-full">
                {item.type === 'video' ? (
                    <video
                        ref={videoRef}
                        className={cn(
                            "w-full h-full",
                            getObjectFit()
                        )}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                    >
                        <source src={item.src} type="video/mp4" />
                    </video>
                ) : (
                    <img
                        src={item.src}
                        alt={item.title}
                        className={cn(
                            "w-full h-full",
                            getObjectFit()
                        )}
                        loading="lazy"
                        onLoad={() => setIsLoaded(true)}
                    />
                )}
                <div className={cn(
                    "absolute inset-0 pointer-events-none",
                    item.preserveAspect
                        ? "bg-gradient-to-t from-gray-900/90 via-transparent to-transparent"
                        : "bg-gradient-to-t from-black/50 via-transparent to-transparent"
                )} />
                <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3">
                    <h3 className="text-white text-xs md:text-sm font-medium drop-shadow-md line-clamp-1">
                        {item.title}
                    </h3>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
        </motion.div>
    );
}

export default function Demonstra() {
    return (
        <section className="min-h-screen bg-black py-8 md:py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-center mb-6 md:mb-8"
                >
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                        <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                            Nossos Brinquedos em Ação
                        </span>
                    </h1>
                    <p className="text-sm md:text-base text-gray-400">
                        Momentos reais com personalidades e clientes especiais
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 auto-rows-[150px] md:auto-rows-[180px]"
                    style={{
                        gridAutoFlow: 'dense'
                    }}
                >
                    {mediaItems.map((item) => (
                        <MediaCard key={item.id} item={item} />
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="mt-8 md:mt-12 text-center"
                >
                    <p className="text-gray-400 text-sm md:text-base mb-4">
                        Quer proporcionar momentos únicos como esses?
                    </p>

                    <a
                        href="https://wa.me/+551142377766"
                        target="_blank"
                        onClick={() => trackWhatsAppClick('home_cta_demonstracao')}
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm md:text-base font-medium transition-colors"
                    >
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        Solicitar orçamento
                    </a>
                </motion.div>
            </div>
        </section>
    );
}