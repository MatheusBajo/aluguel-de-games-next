// src/components/empresas/KitPrintButton.tsx
//
// Botão que dispara a impressão / salvar-como-PDF do kit de aprovação (spec §5.4).
// Sem gerar PDF no build (sem dep nova de HTML→PDF): a página é imprimível e o RH
// salva como PDF pelo próprio navegador. GA4: kit_pdf_download.
"use client";

import { Printer } from "lucide-react";
import { trackKitDownload } from "@/lib/gtm-utils";

export default function KitPrintButton() {
    return (
        <button
            type="button"
            onClick={() => {
                trackKitDownload({ placement: "kit-page" });
                window.print();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-md h-11 px-6 text-base font-semibold border-2 border-cyan-500/50 bg-cyan-500/10 text-foreground hover:border-cyan-400 hover:bg-cyan-500/20 transition-all"
        >
            <Printer className="h-5 w-5" aria-hidden />
            Imprimir ou salvar em PDF
        </button>
    );
}
