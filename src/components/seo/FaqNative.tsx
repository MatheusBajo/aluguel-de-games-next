// src/components/seo/FaqNative.tsx
//
// FAQ nativa (SPEC-FINAL-V2 §3.10 / §4.9) — HTML CRU com <details>/<summary>
// (NUNCA Radix Accordion: o texto precisa existir no HTML sem JS). Emite o
// FAQPage 1:1 com o texto VISÍVEL (valor = GEO/extração, não rich result).
// SERVER component. Reutilizável em home, produto, categorias e /empresas.
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import { faqPageSchema } from "@/lib/schema";

export interface FaqEntry {
    question: string;
    /** Resposta em texto (vai no HTML visível E no JSON-LD). */
    answer: string;
    /** Link opcional exibido abaixo da resposta (não entra no schema). */
    link?: { href: string; label: string };
}

interface Props {
    items: FaqEntry[];
    /** Emite <script> FAQPage. Ligar em UMA superfície por página. */
    withSchema?: boolean;
    className?: string;
}

export default function FaqNative({ items, withSchema = true, className }: Props) {
    if (!items.length) return null;
    return (
        <div className={className}>
            <div className="mx-auto max-w-3xl divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/60 bg-card/30">
                {items.map((f) => (
                    <details key={f.question} className="group px-5">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-base font-semibold marker:content-none md:text-lg">
                            {f.question}
                            <span
                                aria-hidden
                                className="shrink-0 text-muted-foreground transition-transform group-open:rotate-45"
                            >
                                +
                            </span>
                        </summary>
                        <div className="pb-5 font-body text-sm leading-relaxed text-zinc-300 md:text-[0.9375rem]">
                            <p>{f.answer}</p>
                            {f.link && (
                                <Link
                                    href={f.link.href}
                                    className="mt-2 inline-flex items-center gap-1 font-semibold text-foreground underline underline-offset-4 transition-colors hover:text-green-400"
                                >
                                    {f.link.label} <span aria-hidden>→</span>
                                </Link>
                            )}
                        </div>
                    </details>
                ))}
            </div>
            {withSchema && <JsonLd data={faqPageSchema(items.map((f) => ({ question: f.question, answer: f.answer })))} />}
        </div>
    );
}
