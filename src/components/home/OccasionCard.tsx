// src/components/home/OccasionCard.tsx
//
// Card honesto da vitrine por ocasião (SPEC-FINAL-V2 §3.4, gate 1.1).
// foto LQIP + título + linha de spec REAL (no lugar exato do contador fake que
// morreu na fase 0) + ação dupla:
//   1. verde compacto → WhatsApp com prefill DO produto (ação).
//   2. "Ver detalhes" COM RÓTULO → página do produto (nunca ícone solto).
// Nota: o botão "+ Orçamento" (adiciona ao carrinho) chega no estágio do
// QuoteCart; até lá a ação secundária leva ao produto, que hospeda o fluxo.
// Badge de categoria (neon) = rótulo, não número. Sem badge fabricada.
import Image from "next/image";
import Link from "next/link";
import { FiImage } from "react-icons/fi";
import { getImagePath } from "@/lib/image-utils";
import { generateProductUrl } from "@/lib/slug-utils";
import { WhatsAppCta } from "@/components/cta/WhatsAppCta";
import type { CatalogItem } from "@/lib/catalog.server";

export default function OccasionCard({ item }: { item: CatalogItem }) {
    const href = generateProductUrl(item.key);
    const categoria = item.key.split("/")[0];
    const img = item.imagens?.[0];
    // Linha de spec real (fase 1 preenche specs{}); fallback honesto até lá.
    const specLine = (item as { specLine?: string }).specLine ?? "Entrega e montagem incluídas";

    return (
        <article className="group flex w-[150px] flex-col overflow-hidden rounded-xl border border-border/60 bg-card/40 sm:w-[190px]">
            <Link href={href} className="relative block aspect-square overflow-hidden bg-zinc-900">
                {img ? (
                    <Image
                        src={getImagePath(item.key, img)}
                        alt={item.titulo}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="190px"
                        unoptimized
                    />
                ) : (
                    <span className="flex h-full w-full items-center justify-center">
                        <FiImage className="h-10 w-10 text-zinc-700" />
                    </span>
                )}
                <span className="absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[0.6875rem] font-medium text-white backdrop-blur-sm">
                    {categoria}
                </span>
            </Link>

            <div className="flex flex-1 flex-col gap-2 p-2.5">
                <Link href={href}>
                    <h4 className="line-clamp-2 text-sm font-medium text-gray-200 transition-colors group-hover:text-purple-400">
                        {item.titulo}
                    </h4>
                </Link>
                <p className="text-xs leading-snug text-zinc-300">{specLine}</p>

                <div className="mt-auto flex flex-col gap-1.5 pt-1">
                    <WhatsAppCta
                        surface="product"
                        product={item.titulo}
                        location="occasion_card"
                        variant="compact"
                        label="Orçamento"
                        className="w-full justify-center !px-3 !py-1.5 text-xs"
                    />
                    <Link
                        href={href}
                        className="inline-flex items-center justify-center rounded-full border border-border/70 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-purple-500/60 hover:text-foreground"
                    >
                        Ver detalhes
                    </Link>
                </div>
            </div>
        </article>
    );
}
