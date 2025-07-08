// src/components/ui/WhatsAppButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { FaWhatsapp } from "react-icons/fa";
import { trackWhatsAppClick } from "@/lib/gtm-utils";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    message?: string;
    trackingLocation: string;
    variant?: "default" | "outline" | "ghost";
    size?: "default" | "sm" | "lg" | "icon";
    showIcon?: boolean;
    phoneNumber?: string;
}

export const WhatsAppButton = forwardRef<HTMLButtonElement, WhatsAppButtonProps>(
    ({
         children = "Fazer Orçamento",
         message = "",
         trackingLocation,
         variant = "default",
         size = "default",
         showIcon = true,
         phoneNumber = "+551142377766",
         className,
         onClick,
         ...props
     }, ref) => {
        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            // Track no GTM
            trackWhatsAppClick(trackingLocation, {
                button_text: children?.toString(),
                message: message
            });

            // Executa onClick customizado se houver
            if (onClick) {
                onClick(e);
            }

            // Abre o WhatsApp
            const url = `https://wa.me/${phoneNumber}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
            window.open(url, '_blank');
        };

        return (
            <Button
                ref={ref}
                variant={variant}
                size={size}
                onClick={handleClick}
                className={cn(
                    variant === "default" && "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0",
                    className
                )}
                {...props}
            >
                {showIcon && <FaWhatsapp className="mr-2 h-5 w-5" />}
                {children}
            </Button>
        );
    }
);

WhatsAppButton.displayName = "WhatsAppButton";