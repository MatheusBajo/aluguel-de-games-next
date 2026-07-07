// src/components/empresas/KitAprovacaoCta.tsx
//
// CTA do kit de aprovação interna B2B (SPEC-FINAL-V2 §5 gate c).
// Leva pra página imprimível /empresas/kit-aprovacao (sem e-mail gate) e
// dispara o evento GA4 kit_pdf_download (§8). Client só por causa do tracking.
"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackKitPdfDownload } from "@/lib/gtm-utils";

export default function KitAprovacaoCta({
    location,
    className,
    label = "Baixar kit de aprovação (PDF)",
}: {
    location?: string;
    className?: string;
    label?: string;
}) {
    return (
        <Link
            href="/empresas/kit-aprovacao"
            onClick={() => trackKitPdfDownload(location)}
            className={cn(
                "inline-flex items-center justify-center gap-2 rounded-md border-2 border-cyan-500/50 px-6 h-12 text-base font-semibold text-cyan-300 transition-colors hover:bg-cyan-500/10",
                className,
            )}
        >
            <FileText className="h-5 w-5" />
            {label}
        </Link>
    );
}
