// src/components/catalogo/ProductPanel.tsx
//
// Coluna de decisão da página de produto (spec §4.3 + §4.4), SERVER-rendered
// (existe no HTML cru — aceite audit:raw): H1 transacional + answer capsule +
// 3 fatos verificáveis + garantia colada + preço 2-estados honesto + CTAs.
// Verde é exclusivo do WhatsApp/tel (via <WhatsAppCta>). Zero número inventado.

import Link from "next/link";
import { Check } from "lucide-react";
import { AnswerCapsule } from "@/components/content/AnswerCapsule";
import { WhatsAppCta } from "@/components/cta/WhatsAppCta";
import { ShareButton } from "@/components/catalogo/ShareButton";

const BADGE_LABEL: Record<string, string> = {
    novo: "Novo",
    "mais-pedido": "Mais pedido",
};

const FACTS = [
    "Entrega e montagem incluídas",
    "Equipamento testado antes do evento",
    "Contrato e nota fiscal",
];

export function ProductPanel({
    titulo,
    capsule,
    categoriaLabel,
    categoriaHref,
    badges,
}: {
    titulo: string;
    capsule: string;
    categoriaLabel: string;
    categoriaHref: string;
    badges?: ("novo" | "mais-pedido")[];
}) {
    return (
        <div className="flex flex-col gap-6">
            {/* Categoria + selos */}
            <div className="flex flex-wrap items-center gap-2">
                <Link
                    href={categoriaHref}
                    className="inline-flex items-center rounded-full border border-purple-500/40 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300 transition-colors hover:bg-purple-500/20"
                >
                    {categoriaLabel}
                </Link>
                {badges?.map((b) => (
                    <span
                        key={b}
                        className="inline-flex items-center rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-semibold text-cyan-300"
                    >
                        {BADGE_LABEL[b] ?? b}
                    </span>
                ))}
            </div>

            {/* H1 transacional (spec §4.3) + share */}
            <div className="flex items-start justify-between gap-4">
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[0.95]">
                    Aluguel de {titulo}
                </h1>
                <div className="shrink-0 pt-1">
                    <ShareButton title={`Aluguel de ${titulo}`} />
                </div>
            </div>

            {/* Answer capsule (o que é, pra que festa, o que tá incluso) */}
            <AnswerCapsule label={null}>{capsule}</AnswerCapsule>

            {/* Bloco de decisão: fatos + garantia + preço */}
            <div className="rounded-2xl border border-border/60 bg-card/40 p-5 md:p-6">
                <ul className="flex flex-col gap-2.5">
                    {FACTS.map((f) => (
                        <li key={f} className="flex items-center gap-2.5 text-sm md:text-base">
                            <Check className="h-5 w-5 shrink-0 text-green-500" strokeWidth={2.5} aria-hidden />
                            <span className="text-foreground">{f}</span>
                        </li>
                    ))}
                </ul>

                {/* Garantia colada (spec §4.4 + §9.6) */}
                <div className="mt-5 rounded-xl border border-purple-500/25 bg-purple-500/5 p-4">
                    <p className="font-display text-sm md:text-base font-semibold text-foreground">
                        Deu defeito no meio da festa?
                    </p>
                    <p className="mt-1 font-body text-sm text-muted-foreground">
                        Trocamos o equipamento ou mandamos técnico no local, sem custo. O problema é nosso, não seu.
                    </p>
                </div>

                {/* Preço 2-estados — sem faixa confirmada: 1 linha honesta + link */}
                <div className="mt-5 border-t border-border/40 pt-4">
                    <p className="font-body text-sm md:text-base text-foreground">
                        O valor fechado depende da data e do bairro da entrega — manda os dois no WhatsApp que a gente fecha.
                    </p>
                    <Link
                        href="/quanto-custa"
                        className="mt-1.5 inline-flex items-center gap-1 text-sm font-semibold text-cyan-400 hover:text-cyan-300"
                    >
                        Entenda como funciona o orçamento →
                    </Link>
                </div>
            </div>

            {/* CTAs — verde exclusivo da ação */}
            <div className="flex flex-col gap-3">
                <WhatsAppCta
                    surface="product"
                    product={titulo}
                    variant="primary"
                    withMeta
                    metaAlign="left"
                    className="w-full h-12"
                    wrapperClassName="w-full"
                >
                    Pedir orçamento deste item
                </WhatsAppCta>

                <WhatsAppCta
                    surface="product"
                    product={titulo}
                    message={`Oi! Tenho uma dúvida sobre o *${titulo}*.`}
                    variant="outline"
                    className="w-full"
                >
                    Tirar dúvida no WhatsApp
                </WhatsAppCta>
            </div>
        </div>
    );
}

export default ProductPanel;
