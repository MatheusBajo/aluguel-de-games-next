// src/components/catalogo/ShareButton.tsx
//
// Botão de compartilhar (Web Share API) — único pedaço client do bloco de
// info do produto, mantido pequeno pra ficha/CTA/capsule renderizarem no
// HTML cru (SEO/GEO) sem JS.
"use client";

import { FiShare2 } from "react-icons/fi";

export default function ShareButton({ title }: { title: string }) {
    const handleShare = async () => {
        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share({ title, text: `Confira: ${title}`, url: window.location.href });
            } catch {
                /* usuário cancelou */
            }
        }
    };

    return (
        <button
            type="button"
            onClick={handleShare}
            aria-label="Compartilhar"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:text-foreground"
        >
            <FiShare2 className="h-4 w-4" />
        </button>
    );
}
