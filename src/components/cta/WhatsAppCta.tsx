// src/components/cta/WhatsAppCta.tsx
//
// CTA ÚNICO de WhatsApp do site (spec §7). Todo botão/link de WhatsApp passa por aqui.
// - Anchor REAL pra wa.me (existe no HTML cru — crawlers de IA não executam JS)
// - ?text= pré-preenchido contextual por superfície, com lacunas (Data/Bairro/Convidados)
// - Evento GA4 whatsapp_click{surface, product} via dataLayer
// - `withMeta` renderiza junto: "ou ligue (11) 96526-1000" (tel: rastreado) +
//   linha de estado fora-do-horário (server-rendered, os dois estados desenhados)
// - Verde #25D366/gradiente verde é EXCLUSIVO desta ação (e do tel:)
"use client";

import { FaWhatsapp } from "react-icons/fa";
import { cn } from "@/lib/utils";
import {
    WHATSAPP_CONFIG,
    buildWhatsAppUrl,
    getHoursLine,
    type WhatsAppSurface,
} from "@/config/whatsapp.config";
import { trackWhatsAppClick, trackTelClick } from "@/lib/gtm-utils";
import type { ReactNode } from "react";

type Variant =
    /** Botão verde grande (CTA principal) */
    | "primary"
    /** Botão outline (ação secundária, ex.: "Fazer uma pergunta") */
    | "outline"
    /** Pill compacta (header desktop) */
    | "compact"
    /** Ícone redondo (header mobile / footer social) */
    | "icon"
    /** Link de texto inline */
    | "inline"
    /** Sem estilo/ícone próprio — children definem o layout (cards clicáveis) */
    | "unstyled";

export interface WhatsAppCtaProps {
    /** Superfície de conversão — define o prefill e o parâmetro GA4 */
    surface: WhatsAppSurface;
    /** Nome do produto/categoria (prefill contextual + GA4 product) */
    product?: string;
    /** Override completo da mensagem (ex.: carrinho de orçamento multi-linha) */
    message?: string;
    variant?: Variant;
    /** Renderiza "ou ligue (11) 96526-1000" + linha fora-do-horário abaixo do botão */
    withMeta?: boolean;
    /** Alinhamento do bloco meta (segue o layout do CTA) */
    metaAlign?: "left" | "center" | "right";
    className?: string;
    /** Classe extra do wrapper quando withMeta */
    wrapperClassName?: string;
    /** Callback extra no clique (ex.: fechar menu mobile) */
    onNavigate?: () => void;
    children?: ReactNode;
}

const VARIANT_CLASSES: Record<Variant, string> = {
    primary:
        "inline-flex items-center justify-center gap-2 rounded-md h-11 px-8 text-base font-semibold text-white " +
        "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 " +
        "shadow-lg shadow-green-500/30 transition-all hover:shadow-green-500/40",
    outline:
        "inline-flex items-center justify-center gap-2 rounded-md h-11 px-8 text-base font-semibold " +
        "border-2 border-border bg-transparent hover:border-green-500/60 hover:bg-green-500/10 transition-all",
    compact:
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white " +
        "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 " +
        "shadow-lg shadow-green-500/30 transition-all hover:scale-[1.03] hover:shadow-xl hover:shadow-green-500/40",
    icon:
        "inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-600/15 text-green-400 " +
        "hover:bg-green-600/25 transition-colors",
    inline:
        "inline-flex items-center gap-1.5 font-semibold text-green-400 hover:text-green-300 underline-offset-4 hover:underline",
    unstyled: "",
};

const ICON_SIZE: Record<Variant, string> = {
    primary: "h-5 w-5",
    outline: "h-5 w-5",
    compact: "h-4 w-4",
    icon: "h-5 w-5",
    inline: "h-4 w-4",
    unstyled: "",
};

export function WhatsAppCta({
    surface,
    product,
    message,
    variant = "primary",
    withMeta = false,
    metaAlign = "center",
    className,
    wrapperClassName,
    onNavigate,
    children,
}: WhatsAppCtaProps) {
    const href = buildWhatsAppUrl(surface, { product, message });

    const handleClick = () => {
        trackWhatsAppClick(surface, product ? { product } : undefined);
        onNavigate?.();
    };

    const anchor = (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            aria-label={variant === "icon" ? "Pedir orçamento no WhatsApp" : undefined}
            className={cn(VARIANT_CLASSES[variant], className)}
        >
            {variant === "unstyled" ? (
                children
            ) : (
                <>
                    <FaWhatsapp className={ICON_SIZE[variant]} aria-hidden />
                    {variant !== "icon" && (
                        <span>{children ?? "Pedir orçamento no WhatsApp"}</span>
                    )}
                </>
            )}
        </a>
    );

    if (!withMeta) return anchor;

    const alignClass =
        metaAlign === "left"
            ? "items-start text-left"
            : metaAlign === "right"
              ? "items-end text-right"
              : "items-center text-center";

    return (
        <div className={cn("flex flex-col gap-2", alignClass, wrapperClassName)}>
            {anchor}
            <p className="font-body text-xs text-muted-foreground">
                ou ligue{" "}
                <a
                    href={`tel:${WHATSAPP_CONFIG.formattedNumber}`}
                    onClick={() => trackTelClick(surface)}
                    className="font-semibold text-foreground hover:text-green-400 transition-colors tabular-nums"
                >
                    {WHATSAPP_CONFIG.displayNumber}
                </a>
            </p>
            <p className="font-body text-xs text-muted-foreground max-w-xs">
                {getHoursLine()}
            </p>
        </div>
    );
}

/**
 * Bloco meta standalone (tel + fora-do-horário) pra layouts onde o CTA
 * verde fica numa fileira com outros botões e o meta vai embaixo da fileira.
 */
export function WhatsAppCtaMeta({
    surface,
    align = "center",
    className,
}: {
    surface?: WhatsAppSurface;
    align?: "left" | "center" | "right";
    className?: string;
}) {
    const alignClass =
        align === "left"
            ? "items-start text-left"
            : align === "right"
              ? "items-end text-right"
              : "items-center text-center";

    return (
        <div className={cn("flex flex-col gap-1.5", alignClass, className)}>
            <p className="font-body text-xs text-muted-foreground">
                ou ligue{" "}
                <a
                    href={`tel:${WHATSAPP_CONFIG.formattedNumber}`}
                    onClick={() => trackTelClick(surface ?? "global")}
                    className="font-semibold text-foreground hover:text-green-400 transition-colors tabular-nums"
                >
                    {WHATSAPP_CONFIG.displayNumber}
                </a>
            </p>
            <p className="font-body text-xs text-muted-foreground max-w-md">
                {getHoursLine()}
            </p>
        </div>
    );
}

export default WhatsAppCta;
