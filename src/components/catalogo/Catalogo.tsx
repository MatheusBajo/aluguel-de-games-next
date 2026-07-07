// src/components/catalogo/Catalogo.tsx
//
// Hub do catálogo (spec §2: "Hub — headings LINKADOS às categorias"). Ordem
// CURADA das categorias de nível-1, cada uma com o heading clicável levando pra
// LP da categoria (destino de Ads) + trilho foto-first de produtos. Server-first:
// tudo no HTML cru. Zero número inventado (contagens são reais do metadata).
import Link from "next/link";
import { getCatalog } from "@/lib/catalog.server";
import { resolveSpecs } from "@/lib/catalog-specs";
import { toSlug } from "@/lib/slug-utils";
import { getCategoryMetadata } from "@/lib/catalog-categories";
import { CatalogCard } from "@/components/catalogo/CatalogCard";
import { AnswerCapsule } from "@/components/content/AnswerCapsule";
import { WhatsAppCta, WhatsAppCtaMeta } from "@/components/cta/WhatsAppCta";

// Ordem curada: categorias de maior intenção primeiro.
const ORDER = [
    "Jogos Eletrônicos",
    "Videokês",
    "Realidade Virtual",
    "Jogos de Mesa",
    "Projetores & Extras",
    "Piscinas, Infláveis, Cama Elástica, Infantil",
];

export default async function Catalogo() {
    const itens = await getCatalog();

    // agrupa por categoria de nível-1
    const grupos: Record<string, typeof itens> = {};
    for (const it of itens) {
        const cat = it.key.split("/")[0];
        (grupos[cat] ||= []).push(it);
    }

    const catsOrdenadas = [
        ...ORDER.filter((c) => grupos[c]?.length),
        ...Object.keys(grupos).filter((c) => !ORDER.includes(c) && grupos[c]?.length),
    ];

    return (
        <main className="relative mx-auto max-w-screen-xl px-4 md:px-6 py-10 md:py-12">
            {/* Header */}
            <header className="mb-8">
                <p className="label-arcade text-cyan-400 mb-4 inline-flex items-center gap-2">
                    <span aria-hidden>★</span>
                    <span>Desde 1993 · Osasco e Grande SP</span>
                </p>
                <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">
                    Catálogo de aluguel para festas e eventos
                </h1>
            </header>

            <AnswerCapsule label="Resposta rápida">
                A Aluguel de Games loca fliperamas, videokês, realidade virtual, consoles, máquina de
                dança, pinball e jogos de mesa para festas e eventos em Osasco e toda a Grande São Paulo.
                Escolhe o que curtir aqui embaixo: a gente entrega montado e testado, com contrato e nota
                fiscal. Desde 1993. Orçamento pelo WhatsApp.
            </AnswerCapsule>

            {/* Trilhos por categoria (heading linkado à LP) */}
            <div className="mt-12 flex flex-col gap-14">
                {catsOrdenadas.map((cat) => {
                    const arr = grupos[cat];
                    const slug = toSlug(cat);
                    const href = `/catalogo/${slug}/`;
                    const meta = getCategoryMetadata([slug]);
                    const label = meta.breadcrumbName ?? cat;

                    return (
                        <section key={cat}>
                            <div className="mb-4 flex items-end justify-between gap-4">
                                <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight">
                                    <Link href={href} className="transition-colors hover:text-cyan-300">
                                        {label}
                                    </Link>
                                </h2>
                                <Link
                                    href={href}
                                    className="shrink-0 text-sm font-semibold text-cyan-400 hover:text-cyan-300"
                                >
                                    Ver {arr.length} {arr.length === 1 ? "opção" : "opções"} →
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                {arr.slice(0, 10).map((item, i) => {
                                    const dims = resolveSpecs(item.specs, item.imagens).dimensoes;
                                    return <CatalogCard key={item.key} item={item} index={i} specLine={dims} />;
                                })}
                            </div>
                        </section>
                    );
                })}
            </div>

            {/* CTA */}
            <section className="mt-16 rounded-3xl border-2 border-purple-500/40 bg-gradient-to-br from-blue-950/40 via-purple-950/40 to-pink-950/40 p-8 md:p-10 text-center">
                <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight mb-3">
                    Não sabe por onde começar?
                </h2>
                <p className="font-body text-muted-foreground max-w-lg mx-auto mb-6">
                    Manda a data e o tipo de festa no WhatsApp que a gente monta o pacote ideal pra você.
                </p>
                <div className="flex flex-col items-center gap-3">
                    <WhatsAppCta surface="category" variant="primary">
                        Pedir orçamento no WhatsApp
                    </WhatsAppCta>
                    <WhatsAppCtaMeta surface="category" align="center" />
                </div>
            </section>
        </main>
    );
}
