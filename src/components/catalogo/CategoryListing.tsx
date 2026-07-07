// src/components/catalogo/CategoryListing.tsx
//
// LP de categoria — anatomia fixa do gate 1.5 (spec §4):
// breadcrumb → H1=keyword → answer capsule → CTA dual + tel/fora-do-horário →
// grid FOTO-first (1 linha de spec real) → tabela comparativa → como funciona (3) →
// preço honesto (2 estados) → FAQ (<details> + FAQPage) → CTA final.
// Schema (CollectionPage+ItemList+BreadcrumbList) sai de page.tsx; FAQPage do <FaqNative>.
import Link from 'next/link';
import { CatalogCard } from '@/components/catalogo/CatalogCard';
import { CategoryComparisonTable } from '@/components/catalogo/CategoryComparisonTable';
import { Button } from '@/components/ui/button';
import { WhatsAppCta, WhatsAppCtaMeta } from '@/components/cta/WhatsAppCta';
import { AnswerCapsule } from '@/components/content/AnswerCapsule';
import { FaqNative } from '@/components/content/FaqNative';
import { PriceBlock } from '@/components/home/PriceBlock';
import type { CatalogItem } from '@/lib/catalog.server';
import type { CategoryMetadata } from '@/lib/catalog-categories';
import { CATEGORIES } from '@/lib/catalog-categories';
import { resolveSpecs } from '@/lib/catalog-specs';
import { buildCategoryCapsule, getCategoryFaq } from '@/lib/catalog-content';

interface CategoryListingProps {
    slug: string[];
    meta: CategoryMetadata;
    items: CatalogItem[];
}

const STEPS = [
    { n: '01', t: 'Você chama no WhatsApp', d: 'Manda a data, o bairro e o que curtiu.' },
    { n: '02', t: 'A gente fecha data e valor', d: 'Com contrato e nota fiscal, sem taxa escondida.' },
    { n: '03', t: 'Entregamos e montamos', d: 'Testado antes da festa. Buscamos depois.' },
];

export function CategoryListing({ slug, meta, items }: CategoryListingProps) {
    const breadcrumbs = slug.map((_, idx) => {
        const partialSlug = slug.slice(0, idx + 1);
        const partialKey = partialSlug.join('/');
        const partialMeta = CATEGORIES[partialKey];
        const name =
            partialMeta?.breadcrumbName ??
            partialSlug[idx].replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
        return { href: `/catalogo/${partialSlug.join('/')}/`, name };
    });

    const categoryLabel = breadcrumbs[breadcrumbs.length - 1]?.name ?? 'Categoria';
    const capsule = buildCategoryCapsule(categoryLabel, items.length);
    const faqs = getCategoryFaq();

    return (
        <main className="relative overflow-hidden">
            {/* Decorações */}
            <div className="pointer-events-none absolute inset-0 grid-tron opacity-25" aria-hidden />
            <div className="pointer-events-none absolute -top-20 right-10 h-72 w-72 rounded-full bg-purple-500/15 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute top-1/3 -left-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" aria-hidden />

            <div className="relative mx-auto max-w-screen-xl px-4 md:px-6 pb-16">

                {/* ============= BREADCRUMB ============= */}
                <nav aria-label="Breadcrumb" className="pt-6 pb-4">
                    <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 label-arcade text-muted-foreground/70">
                        <li><Link href="/" className="hover:text-foreground transition-colors">HOME</Link></li>
                        <li aria-hidden className="text-muted-foreground/40">/</li>
                        <li><Link href="/catalogo" className="hover:text-foreground transition-colors">CATÁLOGO</Link></li>
                        {breadcrumbs.map((crumb, i) => {
                            const isLast = i === breadcrumbs.length - 1;
                            return (
                                <span key={crumb.href} className="contents">
                                    <li aria-hidden className="text-muted-foreground/40">/</li>
                                    <li className={isLast ? 'text-foreground font-bold' : ''}>
                                        {isLast ? (
                                            <span>{crumb.name.toUpperCase()}</span>
                                        ) : (
                                            <Link href={crumb.href} className="hover:text-foreground transition-colors">
                                                {crumb.name.toUpperCase()}
                                            </Link>
                                        )}
                                    </li>
                                </span>
                            );
                        })}
                    </ol>
                </nav>

                {/* ============= HERO: H1 + CTA acima da dobra ============= */}
                <header className="relative py-6 md:py-10">
                    <p className="label-arcade text-cyan-400 mb-4 inline-flex items-center gap-2">
                        <span aria-hidden>★</span>
                        <span>Desde 1993 · Osasco e Grande SP</span>
                    </p>

                    <h1 className="font-display font-extrabold leading-[0.95] tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                        <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                            {meta.title}
                        </span>
                    </h1>

                    <p className="mt-5 font-body text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                        {meta.description}
                    </p>

                    {/* CTA dual + tel/fora-do-horário (spec §4.3) */}
                    <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <WhatsAppCta surface="category" product={categoryLabel} variant="primary">
                            Pedir orçamento no WhatsApp
                        </WhatsAppCta>
                        <a
                            href="#equipamentos"
                            className="inline-flex items-center justify-center gap-2 rounded-md h-11 px-6 text-base font-semibold border-2 border-border bg-transparent transition-colors hover:border-cyan-400/60 hover:text-cyan-300"
                        >
                            Ver equipamentos ↓
                        </a>
                    </div>
                    <WhatsAppCtaMeta surface="category" align="left" className="mt-3" />
                </header>

                {/* ============= ANSWER CAPSULE ============= */}
                <AnswerCapsule className="mt-4" label="Resposta rápida">{capsule}</AnswerCapsule>

                {/* ============= DIVIDER ============= */}
                <div className="divider-neon my-10 md:my-12" />

                {/* ============= GRID DE PRODUTOS (foto-first) ============= */}
                <section id="equipamentos" className="scroll-mt-24">
                    <div className="mb-5 flex items-baseline justify-between">
                        <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight">
                            {items.length} {items.length === 1 ? 'opção disponível' : 'opções disponíveis'}
                        </h2>
                    </div>

                    {items.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {items.map((item, i) => {
                                const dims = resolveSpecs(item.specs, item.imagens).dimensoes;
                                return <CatalogCard key={item.key} item={item} index={i} specLine={dims} />;
                            })}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-border/60 bg-card/40 p-8 md:p-12 text-center backdrop-blur-sm">
                            <p className="label-arcade text-muted-foreground/70 mb-3">✗ Vazio</p>
                            <p className="font-body text-muted-foreground">
                                Não encontramos equipamentos nessa categoria no momento.
                            </p>
                            <Button asChild className="mt-6">
                                <Link href="/catalogo">Ver catálogo completo</Link>
                            </Button>
                        </div>
                    )}
                </section>

                {/* ============= TABELA COMPARATIVA (só com ≥3 specs) ============= */}
                <CategoryComparisonTable items={items} />

                {/* ============= COMO FUNCIONA (3 passos) ============= */}
                <section className="mt-14">
                    <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight mb-6">
                        Como funciona
                    </h2>
                    <ol className="grid gap-4 sm:grid-cols-3">
                        {STEPS.map((s) => (
                            <li key={s.n} className="rounded-2xl border border-border/60 bg-card/40 p-5">
                                <span className="font-mono text-sm font-bold text-cyan-400 tabular-nums">{s.n}</span>
                                <h3 className="mt-2 font-display text-base font-bold text-foreground">{s.t}</h3>
                                <p className="mt-1 font-body text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                            </li>
                        ))}
                    </ol>
                    <Link
                        href="/como-funciona"
                        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cyan-400 hover:text-cyan-300"
                    >
                        Ver o passo a passo completo →
                    </Link>
                </section>

                {/* ============= PREÇO HONESTO (2 estados) ============= */}
                <section className="mt-14">
                    <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight mb-5">
                        Quanto custa alugar?
                    </h2>
                    <PriceBlock />
                </section>

                {/* ============= FAQ (<details> + FAQPage) ============= */}
                <section className="mt-14">
                    <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight mb-5">
                        Perguntas frequentes
                    </h2>
                    <FaqNative faqs={faqs} />
                </section>

                {/* ============= CTA FINAL ============= */}
                <section className="relative mt-16">
                    <div className="relative overflow-hidden rounded-3xl border-2 border-purple-500/40 bg-gradient-to-br from-blue-950/50 via-purple-950/50 to-pink-950/50 p-8 md:p-12">
                        <div className="absolute inset-0 dot-grid-dense opacity-25" aria-hidden />
                        <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-pink-500/20 blur-3xl" />
                        <span className="pointer-events-none absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-400/60" />
                        <span className="pointer-events-none absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-400/60" />
                        <span className="pointer-events-none absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-400/60" />
                        <span className="pointer-events-none absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-400/60" />

                        <div className="relative grid md:grid-cols-[1.5fr_1fr] gap-8 items-center">
                            <div>
                                <p className="label-arcade text-cyan-400 mb-3">→ Bora fechar?</p>
                                <h2 className="font-display font-extrabold text-2xl md:text-4xl tracking-tight leading-[0.95] mb-4">
                                    Monta o pacote ideal<br />
                                    <span className="italic font-normal text-muted-foreground/80">pro seu evento.</span>
                                </h2>
                                <p className="font-body text-muted-foreground text-sm md:text-base max-w-lg">
                                    Fala com a gente no WhatsApp — a gente ajuda a escolher e já manda o valor.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 md:items-end">
                                <WhatsAppCta surface="category" product={categoryLabel} variant="primary" className="w-full md:w-auto">
                                    Pedir orçamento no WhatsApp
                                </WhatsAppCta>
                                <Button asChild size="lg" variant="outline" className="w-full md:w-auto">
                                    <Link href="/catalogo">Ver catálogo completo</Link>
                                </Button>
                                <WhatsAppCtaMeta surface="category" align="right" className="items-center text-center md:items-end md:text-right" />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
