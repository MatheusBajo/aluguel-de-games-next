// src/components/catalogo/ShareButton.tsx
// Botão de compartilhar (Web Share API) — ilha client mínima.
"use client";

import { FiShare2 } from "react-icons/fi";

export function ShareButton({ title }: { title: string }) {
    const handleShare = async () => {
        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share({ title, url: window.location.href });
            } catch {
                /* usuário cancelou */
            }
        } else if (typeof navigator !== "undefined" && navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(window.location.href);
            } catch {
                /* noop */
            }
        }
    };

    return (
        <button
            type="button"
            onClick={handleShare}
            aria-label="Compartilhar"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:text-foreground hover:border-border"
        >
            <FiShare2 className="h-4 w-4" />
        </button>
    );
}

export default ShareButton;
