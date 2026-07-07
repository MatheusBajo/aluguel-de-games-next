// src/components/content/FaqNative.tsx
//
// FAQ em <details>/<summary> NATIVO (spec §1.4: Radix Accordion PROIBIDO em
// conteúdo informativo — precisa existir no HTML cru e abrir sem JS).
// Renderiza TAMBÉM o FAQPage JSON-LD espelhando 1:1 o texto visível, no mesmo
// componente, pra pergunta/resposta nunca divergirem do schema (spec §3 D7).
import type { FaqEntry } from "@/lib/schema";
import { faqPageSchema } from "@/lib/schema";
import JsonLd from "@/components/seo/JsonLd";
import { cn } from "@/lib/utils";

export function FaqNative({
    faqs,
    className,
    /** Emite o FAQPage JSON-LD (default: sim). Desligue se a página já emite. */
    emitSchema = true,
}: {
    faqs: FaqEntry[];
    className?: string;
    emitSchema?: boolean;
}) {
    if (!faqs.length) return null;

    return (
        <div className={cn("flex flex-col gap-3", className)}>
            {faqs.map((faq) => (
                <details
                    key={faq.question}
                    className="group rounded-xl border border-border/60 bg-card/40 px-5 py-4 open:border-purple-500/40 open:bg-card/70 transition-colors"
                >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base md:text-lg font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                        <span>{faq.question}</span>
                        <span
                            aria-hidden
                            className="shrink-0 text-cyan-400 transition-transform duration-200 group-open:rotate-45"
                        >
                            +
                        </span>
                    </summary>
                    <div className="mt-3 font-body text-sm md:text-base leading-relaxed text-muted-foreground">
                        {faq.answer}
                    </div>
                </details>
            ))}

            {emitSchema && <JsonLd data={faqPageSchema(faqs)} />}
        </div>
    );
}

export default FaqNative;
