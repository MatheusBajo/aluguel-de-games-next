// src/components/orcamento/StickyBar.tsx
//
// Sticky bottom bar GLOBAL no mobile (<768px) — spec §3. UMA barra fixa,
// context-aware: WhatsApp (verde, prefill da página atual) + Ligar (tel:).
// SUBSTITUI o WhatsAppFloat no mobile (mata o conflito de duas barras: existe
// só uma <768px; desktop mantém o float). Na home aparece após 400px de scroll
// (não briga com o CTA do hero); nas demais páginas, sempre.
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import { Phone } from "lucide-react";
import {
    WHATSAPP_CONFIG,
    buildWhatsAppUrl,
    type WhatsAppSurface,
} from "@/config/whatsapp.config";
import { trackWhatsAppClick, trackTelClick } from "@/lib/gtm-utils";
import { useStickyProduct } from "@/components/orcamento/ProductStickyContext";

/** Deriva a superfície de conversão pela rota atual (prefill contextual). */
function surfaceForPath(pathname: string | null): WhatsAppSurface {
    if (!pathname || pathname === "/") return "home";
    if (pathname.startsWith("/empresas")) return "empresas";
    if (pathname.startsWith("/festas")) return "festas";
    if (pathname.startsWith("/quanto-custa")) return "orcamento";
    if (pathname.startsWith("/catalogo")) return "category";
    return "global";
}

export function StickyBar() {
    const pathname = usePathname();
    const { product } = useStickyProduct();
    const isHome = !pathname || pathname === "/";
    const [visible, setVisible] = useState(!isHome);

    useEffect(() => {
        if (!isHome) {
            setVisible(true);
            return;
        }
        const onScroll = () => setVisible(window.scrollY > 400);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [isHome]);

    // Página de produto → prefill nomeia o item (contexto injetado via ponte).
    const surface: WhatsAppSurface = product ? "product" : surfaceForPath(pathname);
    const waHref = buildWhatsAppUrl(surface, product ? { product } : undefined);

    return (
        <div
            className={
                "fixed inset-x-0 bottom-0 z-40 md:hidden " +
                "transition-transform duration-300 " +
                (visible ? "translate-y-0" : "translate-y-full")
            }
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            aria-hidden={!visible}
        >
            <div className="flex h-14 items-stretch gap-px border-t border-border/60 bg-background/95 backdrop-blur-lg">
                <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                        trackWhatsAppClick(surface, {
                            placement: "sticky-bar",
                            ...(product ? { product } : {}),
                        })
                    }
                    className="flex flex-[2] items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-base font-semibold text-white"
                >
                    <FaWhatsapp className="h-5 w-5" aria-hidden />
                    Pedir orçamento
                </a>
                <a
                    href={`tel:${WHATSAPP_CONFIG.formattedNumber}`}
                    onClick={() => trackTelClick(surface, { placement: "sticky-bar" })}
                    className="flex flex-1 items-center justify-center gap-2 bg-card text-base font-semibold text-foreground"
                    aria-label={`Ligar para ${WHATSAPP_CONFIG.displayNumber}`}
                >
                    <Phone className="h-5 w-5" aria-hidden />
                    Ligar
                </a>
            </div>
        </div>
    );
}

export default StickyBar;
