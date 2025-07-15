// src/components/WhatsAppFloat.tsx
"use client";

import { trackWhatsAppClick } from "@/lib/gtm-utils";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function WhatsAppFloat() {
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        // Mostra tooltip após 5 segundos
        const timer = setTimeout(() => {
            setShowTooltip(true);
        }, 5000);

        // Esconde tooltip após 15 segundos
        const hideTimer = setTimeout(() => {
            setShowTooltip(false);
        }, 15000);

        return () => {
            clearTimeout(timer);
            clearTimeout(hideTimer);
        };
    }, []);

    const handleClick = () => {
        trackWhatsAppClick('floating_button', {
            page_url: window.location.pathname,
            page_title: document.title
        });

        window.open('https://wa.me/+551142377766', '_blank');
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 lg:bottom-6 lg:right-6">
            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="absolute bottom-full right-0 mb-2 whitespace-nowrap"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg px-4 py-2 text-sm">
                            <p className="font-medium">Precisa de ajuda?</p>
                            <p className="text-xs text-muted-foreground">Clique para falar conosco!</p>
                            <div className="absolute bottom-0 right-6 translate-y-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white dark:border-t-gray-800" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={handleClick}
                className="relative group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setShowTooltip(false)}
            >
                {/* Pulse animation */}
                <div className="absolute inset-0 bg-green-600 rounded-full animate-ping opacity-20" />

                {/* Button */}
                <div className="relative bg-green-600 hover:bg-green-700 rounded-full p-3 lg:p-4 shadow-lg transition-colors">
                    <img
                        src="/WhatsApp-logo-42377766.png"
                        alt="WhatsApp"
                        className="w-8 h-8 lg:w-10 lg:h-10 object-contain"
                    />
                </div>

                {/* Badge de notificação */}
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                    1
                </div>
            </motion.button>
        </div>
    );
}