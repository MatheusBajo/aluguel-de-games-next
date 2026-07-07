// src/components/StickyBar.tsx
//
// Sticky bottom bar GLOBAL mobile (<768px) — SPEC-FINAL-V2 §3.11 / §4.11.
// UMA barra só: WhatsApp (prefill da página atual) + Ligar. Substitui o float
// no mobile (o float vira desktop-only) — nunca duas barras flutuantes juntas
// (proibição §11). Na HOME aparece só após 400px de scroll; nas demais rotas
// aparece de cara. Context-aware: a `surface` sai do pathname.
// NOTA: nomear o PRODUTO no prefill (rota de produto) fica pro estágio do
// produto, que tem o nome em mãos; aqui a rota de catálogo usa prefill de
// categoria (genérico honesto).
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import { BUSINESS } from "@/config/business.config";
import { getWaHref, type WaSurface } from "@/config/whatsapp.config";
import { trackTelClick, trackWhatsAppCta } from "@/lib/gtm-utils";

function surfaceFor(pathname: string): WaSurface {
    if (pathname === "/") return "home";
    if (pathname.startsWith("/empresas")) return "empresas";
    if (pathname.startsWith("/festas")) return "festas";
    if (pathname.startsWith("/catalogo")) return "category";
    return "generic";
}

export default function StickyBar() {
    const pathname = usePathname() ?? "/";
    const isHome = pathname === "/";
    const [visible, setVisible] = useState(!isHome);

    useEffect(() => {
        if (!isHome) {
            setVisible(true);
            return;
        }
        setVisible(window.scrollY > 400);
        const onScroll = () => setVisible(window.scrollY > 400);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [isHome]);

    const surface = surfaceFor(pathname);
    const href = getWaHref(surface);

    return (
        <div
            className={`fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background/95 backdrop-blur-xl transition-transform duration-300 md:hidden ${
                visible ? "translate-y-0" : "translate-y-full"
            }`}
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
            <div className="flex items-stretch gap-2 p-2.5">
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppCta(surface, undefined, "sticky_bar")}
                    className="flex flex-[2] items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-green-500/30"
                >
                    <FaWhatsapp className="h-5 w-5" />
                    Pedir orçamento
                </a>
                <a
                    href={`tel:${BUSINESS.phoneE164}`}
                    onClick={() => trackTelClick(surface, "sticky_bar")}
                    aria-label={`Ligar para ${BUSINESS.phoneDisplay}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border/70 bg-card/60 px-4 py-3 text-sm font-semibold text-foreground"
                >
                    <FaPhoneAlt className="h-4 w-4" />
                    Ligar
                </a>
            </div>
        </div>
    );
}
