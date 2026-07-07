// src/components/empresas/PrintButton.tsx
//
// Botão "imprimir / salvar em PDF" do kit de aprovação (SPEC-FINAL-V2 §5 gate c).
// Em static export o kit é uma página imprimível (sem backend gerando PDF): o
// window.print() do navegador salva em PDF. Dispara kit_pdf_download (§8).
"use client";

import { Printer } from "lucide-react";
import { trackKitPdfDownload } from "@/lib/gtm-utils";

export default function PrintButton() {
    return (
        <button
            type="button"
            onClick={() => {
                trackKitPdfDownload("kit_page_print");
                window.print();
            }}
            className="no-print inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-blue-600 to-cyan-600 px-6 h-12 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition-colors hover:from-blue-500 hover:to-cyan-500"
        >
            <Printer className="h-5 w-5" />
            Imprimir / salvar em PDF
        </button>
    );
}
