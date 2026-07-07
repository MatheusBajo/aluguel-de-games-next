// src/components/catalogo/CategoryListing.tsx
import Link from 'next/link';
import { CatalogCard } from '@/components/catalogo/CatalogCard';
import { Button } from '@/components/ui/button';
import { WhatsAppCta, PhoneSupportLine } from '@/components/cta/WhatsAppCta';
import type { CatalogItem } from '@/lib/catalog.server';
import type { CategoryMetadata } from '@/lib/catalog-categories';
import { CATEGORIES } from '@/lib/catalog-categories';

interface CategoryListingProps {
    /** Slug da categoria atual (ex: ['jogos-eletronicos', 'fliperamas']) */
    slug: string[];
    /** Metadata da categoria (título, descrição, etc.) */
    meta: CategoryMetadata;
    /** Produtos pertencentes a essa categoria */
    items: CatalogItem[];
}

export function CategoryListing({ slug, meta, items }: CategoryListingProps) {
    // Breadcrumbs com nomes amigáveis
    const breadcrumbs = slug.map((_, idx) => {
        const partialSlug = slug.slice(0, idx + 1);
        const partialKey = partialSlug.join('/');
        const partialMeta = CATEGORIES[partialKey];
        const name =
            partialMeta?.breadcrumbName ??
            partialSlug[idx].replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
        return {
            href: `/catalogo/${partialSlug.join('/')}/`,
            name,
        };
    });

    // Categoria atual (último segmento) pra label
    const categoryLabel = breadcrumbs[breadcrumbs.length - 1]?.name ?? 'Categoria';

    return (
        <main className="relative overflow-hidden">
            {/* Decorações */}
            <div className="pointer-events-none absolute inset-0 grid-tron opacity-25" aria-hidden />
            <div className="pointer-events-none absolute -top-20 right-10 h-72 w-72 rounded-full bg-purple-500/15 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute top-1/3 -left-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" aria-hidden />

            <div className="relative mx-auto max-w-screen-2xl px-4 md:px-6 pb-16">

                {/* ============= BREADCRUMB ============= */}
                <nav aria-label="Breadcrumb" className="pt-6 pb-4">
                    <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 label-arcade text-muted-foreground/70">
                        <li>
                            <Link href="/" className="hover:text-foreground transition-colors">
                                HOME
                            </Link>
                        </li>
                        <li aria-hidden className="text-muted-foreground/40">/</li>
                        <li>
                            <Link href="/catalogo" className="hover:text-foreground transition-colors">
                                CATÁLOGO
                            </Link>
                        </li>
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

                {/* ============= HERO DA CATEGORIA ============= */}
                <header className="relative py-8 md:py-14 mb-10 md:mb-16">
                    <div className="grid lg:grid-cols-[2fr_1fr] gap-8 lg:gap-16 items-end">
                        <div>
                            <p className="rise-in label-arcade text-cyan-400 mb-4 inline-flex items-center gap-2">
                                <span className="badge-live text-cyan-400">★</span>
                                <span>{categoryLabel}</span>
                            </p>

                            <h1 className="rise-in font-display font-extrabold leading-[0.92] tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl" style={{ animationDelay: '100ms' }}>
                                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                    {meta.title}
                                </span>
                            </h1>

                            <p className="rise-in mt-6 font-body text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed" style={{ animationDelay: '220ms' }}>
                                {meta.description}
                            </p>
                        </div>

                        {/* Counter de equipamentos grandão */}
                        <div className="rise-in lg:border-l lg:border-purple-500/30 lg:pl-8 flex lg:block items-baseline gap-4" style={{ animationDelay: '340ms' }}>
                            <span className="numeral-huge-filled !text-6xl md:!text-7xl lg:!text-8xl block tabular-nums">
                                {String(items.length).padStart(2, '0')}
                            </span>
                            <p className="label-arcade text-muted-foreground mt-2">
                                {items.length === 1 ? 'equipamento disponível' : 'equipamentos disponíveis'}
                            </p>
                        </div>
                    </div>
                </header>

                {/* ============= DIVIDER ============= */}
                <div className="divider-neon mb-10 md:mb-14" />

                {/* ============= GRID DE PRODUTOS ============= */}
                {items.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {items.map((item, i) => (
                            <CatalogCard key={item.key} item={item} index={i} />
                        ))}
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

                {/* ============= CTA FINAL ============= */}
                <section className="relative mt-16 md:mt-20">
                    <div className="relative overflow-hidden rounded-3xl border-2 border-purple-500/40 bg-gradient-to-br from-blue-950/50 via-purple-950/50 to-pink-950/50 p-8 md:p-12">
                        {/* Decorações */}
                        <div className="absolute inset-0 dot-grid-dense opacity-25" aria-hidden />
                        <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-pink-500/20 blur-3xl" />
                        {/* Corner brackets */}
                        <span className="pointer-events-none absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-400/60" />
                        <span className="pointer-events-none absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-400/60" />
                        <span className="pointer-events-none absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-400/60" />
                        <span className="pointer-events-none absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-400/60" />

                        <div className="relative grid md:grid-cols-[1.5fr_1fr] gap-8 items-center">
                            <div>
                                <p className="label-arcade text-cyan-400 mb-3">→ Não achou o que queria?</p>
                                <h2 className="font-display font-extrabold text-2xl md:text-4xl tracking-tight leading-[0.95] mb-4">
                                    A gente tem<br />
                                    <span className="italic font-normal text-muted-foreground/80">
                                        muito mais no catálogo.
                                    </span>
                                </h2>
                                <p className="font-body text-muted-foreground text-sm md:text-base max-w-lg">
                                    Fale com a gente no WhatsApp — montamos o pacote ideal
                                    pro seu evento com tudo que você precisar.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 md:items-end">
                                <WhatsAppCta
                                    surface="category"
                                    product={meta.title}
                                    location="category_cta_final"
                                    label="Pedir orçamento no WhatsApp"
                                    className="w-full md:w-auto"
                                />
                                <Button asChild size="lg" variant="outline" className="w-full md:w-auto">
                                    <Link href="/catalogo">Ver catálogo completo</Link>
                                </Button>
                                <PhoneSupportLine surface="category" location="category_cta_final" className="md:text-right" />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
