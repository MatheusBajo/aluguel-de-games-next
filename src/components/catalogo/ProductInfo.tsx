// src/components/catalogo/ProductInfo.tsx
//
// Coluna de decisão do produto (SPEC-FINAL-V2 §4.3–§4.5, §4.7). SERVER
// component: H1, capsule, ficha-chip, 3 fatos, garantia, preço honesto e CTAs
// ficam no HTML cru (SEO/GEO) — só o Share é client. Preço = estado SEM
// (gate 1.6): 1 linha honesta + link /quanto-custa; nunca card celebrando a
// ausência de valor. CTA de WhatsApp com prefill do produto via <WhatsAppCta>.
import Link from "next/link";
import { FiCheck, FiTruck, FiShield, FiFileText } from "react-icons/fi";
import { WhatsAppCta, PhoneSupportLine } from "@/components/cta/WhatsAppCta";
import ShareButton from "@/components/catalogo/ShareButton";
import type { CatalogItem } from "@/lib/catalog.server";
import { buildSpecChips } from "@/lib/product-specs";
import { productCapsule, occasionChipsFor } from "@/lib/product-content";

interface ProductInfoProps {
    item: CatalogItem;
    categoria: string;
    categoriaSlug: string;
    /** H1 transacional já montado pela página. */
    heading: string;
}

const FACTS = [
    { icon: FiTruck, text: "Entrega e montagem inclusas" },
    { icon: FiCheck, text: "Testado antes do evento" },
    { icon: FiFileText, text: "Contrato e nota fiscal" },
];

export function ProductInfo({ item, categoria, categoriaSlug, heading }: ProductInfoProps) {
    const chips = buildSpecChips(item);
    const capsule = productCapsule(item);
    const occasionChips = occasionChipsFor(item);

    return (
        <div className="flex flex-col gap-6">
            {/* Cabeçalho: categoria + H1 + ficha-chip */}
            <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                    <Link
                        href={`/catalogo/${categoriaSlug}/`}
                        className="inline-flex items-center rounded-full border border-purple-500/40 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300 transition-colors hover:bg-purple-500/20"
                    >
                        {categoria}
                    </Link>
                    <ShareButton title={item.titulo} />
                </div>

                <h1 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
                    {heading}
                </h1>

                {chips.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                        {chips.map((c) => (
                            <li
                                key={c}
                                className="rounded-full border border-border/60 bg-card/50 px-3 py-1 font-mono text-xs text-[var(--color-fact)]"
                            >
                                {c}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Answer capsule (§4.4) — primeiro texto corrido, extraível */}
            <p className="font-body text-[0.9375rem] leading-relaxed text-zinc-300">
                {capsule}
            </p>

            {/* 3 fatos (§4.5) */}
            <ul className="grid gap-2 sm:grid-cols-3">
                {FACTS.map((f) => (
                    <li
                        key={f.text}
                        className="flex items-center gap-2 rounded-xl border border-border/50 bg-card/40 px-3 py-2.5 text-sm text-zinc-200"
                    >
                        <f.icon className="h-4 w-4 shrink-0 text-green-500" />
                        {f.text}
                    </li>
                ))}
            </ul>

            {/* Garantia colada (§4.5 / §9.6) */}
            <div className="flex items-start gap-3 rounded-xl border border-green-600/30 bg-green-600/5 p-4">
                <FiShield className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                <p className="text-sm leading-relaxed text-zinc-200">
                    <strong className="font-semibold text-foreground">Deu defeito?</strong> Trocamos ou
                    mandamos um técnico no local, sem custo. O problema é nosso, não seu.
                </p>
            </div>

            {/* Preço — estado SEM (gate 1.6): 1 linha honesta, sem card de ausência */}
            <p className="text-sm leading-relaxed text-zinc-300">
                O valor fechado depende da data e do bairro da entrega — manda os dois no WhatsApp que a
                gente responde com o orçamento.{" "}
                <Link href="/quanto-custa" className="font-semibold text-foreground underline underline-offset-4 hover:text-green-400">
                    Entenda como funciona o preço →
                </Link>
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-3">
                <WhatsAppCta
                    surface="product"
                    product={item.titulo}
                    location="product_page"
                    label="Pedir orçamento deste item"
                    className="w-full"
                />
                <WhatsAppCta
                    surface="product"
                    product={item.titulo}
                    location="product_page_duvida"
                    variant="outline"
                    label="Tirar uma dúvida no WhatsApp"
                    className="w-full"
                />
                <PhoneSupportLine surface="product" location="product_page" />
            </div>

            {/* "Vai bem em" (§4.7) */}
            {occasionChips.length > 0 && (
                <div className="border-t border-border/50 pt-5">
                    <p className="label-arcade mb-3 text-muted-foreground/70">▸ vai bem em</p>
                    <div className="flex flex-wrap gap-2">
                        {occasionChips.map((o) => (
                            <Link
                                key={o.href}
                                href={o.href}
                                className="inline-flex items-center gap-1 rounded-full border border-border/70 px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-purple-500/60 hover:text-foreground"
                            >
                                {o.label} <span aria-hidden>→</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
