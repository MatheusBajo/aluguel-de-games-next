// src/components/cta/WhatsAppCta.tsx
//
// CTA ÚNICO de WhatsApp do site (SPEC-FINAL-V2 §1.2 / brief gate 1.2).
// - Anchor REAL pra wa.me (link com ?text= no HTML servido, crawler lê sem JS)
// - Prefill contextual por superfície (home/category/product/empresas/kit…)
// - Evento GA4 via dataLayer: whatsapp_click{surface,product} + tel_click
// - Linha "ou ligue (11) 96526-1000" junto de todo CTA principal
// - Estado fora-do-horário: com horário confirmado no BUSINESS.hours mostra
//   "atendemos das Xh às Yh" e, fora do horário (client-side), a linha
//   "manda mesmo assim"; sem horário confirmado (null) usa a versão sem
//   número — nunca SLA inventado ("em minutos"/"1 dia útil" é proibido).
"use client";

import { FaWhatsapp } from "react-icons/fa";
import { useEffect, useState, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";
import { BUSINESS } from "@/config/business.config";
import { getWaHref, type WaSurface } from "@/config/whatsapp.config";
import { trackTelClick, trackWhatsAppCta } from "@/lib/gtm-utils";

type Variant = "primary" | "outline" | "compact" | "icon" | "unstyled";

export interface WhatsAppCtaProps {
    /** Superfície de conversão — define o prefill e o GA4 `surface`. */
    surface: WaSurface;
    /** Nome do produto/categoria/kit (entra no prefill e no GA4 `product`). */
    product?: string;
    /** Sufixo de tracking pra distinguir posições na mesma página. */
    location?: string;
    variant?: Variant;
    /** Mostra "ou ligue (11) 96526-1000" + estado fora-do-horário. */
    withPhone?: boolean;
    label?: string;
    className?: string;
    /** Classe do wrapper (quando withPhone renderiza botão + linha de apoio). */
    wrapperClassName?: string;
    children?: ReactNode;
    onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

const VARIANT_CLASSES: Record<Exclude<Variant, "unstyled">, string> = {
    primary:
        "inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-8 h-12 text-base font-semibold text-white shadow-lg shadow-green-500/30 transition-all hover:shadow-green-500/50",
    outline:
        "inline-flex items-center justify-center gap-2 rounded-md border-2 border-green-600/60 px-8 h-12 text-base font-semibold text-green-400 hover:bg-green-500/10 transition-all",
    compact:
        "inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-green-500/30 transition-all hover:scale-[1.03] hover:shadow-xl hover:shadow-green-500/40",
    icon:
        "inline-flex items-center justify-center rounded-full bg-green-600 hover:bg-green-700 text-white transition-colors",
};

/** true quando o relógio do visitante está fora do horário configurado. */
function useForaDoHorario(): boolean {
    const [fora, setFora] = useState(false);
    useEffect(() => {
        if (!BUSINESS.hours) return;
        const h = new Date().getHours();
        setFora(h < BUSINESS.hours.open || h >= BUSINESS.hours.close);
    }, []);
    return fora;
}

/** Linha de apoio: telefone rastreado + horário/fora-do-horário. */
export function PhoneSupportLine({
    surface,
    location,
    className,
}: {
    surface: WaSurface;
    location?: string;
    className?: string;
}) {
    const fora = useForaDoHorario();
    const hours = BUSINESS.hours;

    return (
        <div className={cn("text-xs leading-relaxed text-zinc-400 font-body", className)}>
            <p>
                ou ligue{" "}
                <a
                    href={`tel:${BUSINESS.phoneE164}`}
                    onClick={() => trackTelClick(surface, location)}
                    className="font-semibold text-zinc-200 hover:text-green-400 transition-colors tabular-nums"
                >
                    {BUSINESS.phoneDisplay}
                </a>
                {hours && <> · atendemos das {hours.open}h às {hours.close}h</>}
            </p>
            {hours ? (
                fora && (
                    <p className="mt-0.5">
                        Fora do horário? Manda mesmo assim — respondemos no próximo
                        período de atendimento.
                    </p>
                )
            ) : (
                <p className="mt-0.5">
                    Pode mandar a qualquer hora — respondemos no horário comercial.
                </p>
            )}
        </div>
    );
}

/** Link de telefone rastreado (tel_click) pra usar solto em páginas. */
export function TelLink({
    surface = "generic",
    location,
    className,
    children,
}: {
    surface?: WaSurface;
    location?: string;
    className?: string;
    children?: ReactNode;
}) {
    return (
        <a
            href={`tel:${BUSINESS.phoneE164}`}
            onClick={() => trackTelClick(surface, location)}
            className={className}
        >
            {children ?? BUSINESS.phoneDisplay}
        </a>
    );
}

export function WhatsAppCta({
    surface,
    product,
    location,
    variant = "primary",
    withPhone = false,
    label,
    className,
    wrapperClassName,
    children,
    onClick,
}: WhatsAppCtaProps) {
    const href = getWaHref(surface, product);

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        trackWhatsAppCta(surface, product, location);
        onClick?.(e);
    };

    const anchor = (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className={
                variant === "unstyled"
                    ? className
                    : cn(VARIANT_CLASSES[variant], className)
            }
            aria-label={
                variant === "icon" ? (label ?? "Pedir orçamento no WhatsApp") : undefined
            }
        >
            {variant === "icon" ? (
                children ?? <FaWhatsapp className="h-5 w-5" />
            ) : (
                children ?? (
                    <>
                        <FaWhatsapp className="h-5 w-5" />
                        <span>{label ?? "Pedir orçamento no WhatsApp"}</span>
                    </>
                )
            )}
        </a>
    );

    if (!withPhone) return anchor;

    return (
        <div className={cn("flex flex-col items-center gap-2", wrapperClassName)}>
            {anchor}
            <PhoneSupportLine surface={surface} location={location} className="text-center" />
        </div>
    );
}

export default WhatsAppCta;
