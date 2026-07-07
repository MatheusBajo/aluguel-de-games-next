// src/components/WhatsAppFloat.tsx
//
// Float de WhatsApp (desktop). SEM badge de notificação falsa (des-fabricação).
// Anchor real com prefill — some em mobile quando a StickyBar global entrar (fase 1).
"use client";

import { trackWhatsAppClick } from "@/lib/gtm-utils";
import { buildWhatsAppUrl } from "@/config/whatsapp.config";
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

            <motion.a
                href={buildWhatsAppUrl("global")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick("global", { placement: "float" })}
                aria-label="Pedir orçamento no WhatsApp"
                className="relative group block"
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
                        alt=""
                        aria-hidden
                        className="w-8 h-8 lg:w-10 lg:h-10 object-contain"
                    />
                </div>
            </motion.a>
        </div>
    );
}
