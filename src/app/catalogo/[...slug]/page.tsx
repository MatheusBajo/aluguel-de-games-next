// src/app/catalogo/[...slug]/page.tsx
import { notFound } from "next/navigation";
import { getCatalog, getCategoryItems, getItem } from "@/lib/catalog.server";
import { ProductGallery } from "@/components/catalogo/ProductGallery";
import { ProductInfo } from "@/components/catalogo/ProductInfo";
import ProductDescription from "@/components/catalogo/ProductDescription";
import SpecsTable from "@/components/catalogo/SpecsTable";
import { RelatedProducts } from "@/components/catalogo/RelatedProducts";
import { CategoryListing } from "@/components/catalogo/CategoryListing";
import FaqNative from "@/components/seo/FaqNative";
import { SetStickyProduct } from "@/components/sticky/StickyProduct";
import { getCategoryMetadata } from "@/lib/catalog-categories";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, collectionPageSchema, productSchema } from "@/lib/schema";
import { specAdditionalProperties } from "@/lib/product-specs";
import { productFaq } from "@/lib/product-content";
import Link from "next/link";
import type { Metadata } from "next";
import { getImagePath } from "@/lib/image-utils";
import { getSiteUrl } from "@/lib/site.config";
import { segmentsToSlug } from "@/lib/slug-utils";
// Força geração estática
export const dynamic = 'force-static';

export const dynamicParams = false;
// Tipos atualizados para Next.js 15
type Params = { slug: string[] }

export type CatalogPageProps = {
    params: Promise<Params>
}

/** H1/título transacional do produto (SPEC-FINAL-V2 §4.3 + estágio 3). */
function productHeading(titulo: string): string {
    return `Aluguel de ${titulo} para Festas e Eventos`;
}

export async function generateStaticParams() {
    const catalogo = await getCatalog();

    // vamos acumular em Set p/ evitar duplicatas
    const paramSet = new Set<string>();

    catalogo.forEach((item) => {
        // ["Videokes","Karaokes","Modelo X"] → ["videokes","karaokes","modelo-x"]
        const segments = segmentsToSlug(item.key.split("/"));

        // gera todas as prefixes:
        // [videokes]  [videokes,karaokes]  [videokes,karaokes,modelo-x]
        for (let i = 1; i <= segments.length; i++) {
            const slice = segments.slice(0, i);
            paramSet.add(JSON.stringify({ slug: slice }));
        }
    });

    // converte Set → array de objetos
    return Array.from(paramSet).map((s) => JSON.parse(s));
}

export async function generateMetadata({ params }: CatalogPageProps): Promise<Metadata> {
    // Await params pois agora é uma Promise
    const resolvedParams = await params;
    const slugArr = resolvedParams.slug;
    const baseUrl = getSiteUrl();

    // Tenta como produto primeiro
    const item = await getItem(slugArr);

    // Se não for produto, verifica se é categoria
    if (!item) {
        const categoryItems = await getCategoryItems(slugArr);
        if (categoryItems.length > 0) {
            const meta = getCategoryMetadata(slugArr);
            const url = `${baseUrl}/catalogo/${slugArr.join('/')}/`;
            return {
                title: meta.metaTitle ?? meta.title,
                description: meta.description.slice(0, 160),
                alternates: { canonical: url },
                openGraph: {
                    title: meta.title,
                    description: meta.description,
                    url,
                    siteName: 'Aluguel de Games',
                    images: [{
                        url: `${baseUrl}/Logo-Aluguel-de-games.png`,
                        width: 1200,
                        height: 630,
                        alt: meta.title,
                    }],
                    locale: 'pt_BR',
                    type: 'website',
                },
                twitter: {
                    card: 'summary_large_image',
                    title: meta.title,
                    description: meta.description,
                },
                robots: {
                    index: true,
                    follow: true,
                },
            };
        }
        return { title: 'Página não encontrada' };
    }

    // URL do produto
    const url = `${baseUrl}/catalogo/${slugArr
        .map(encodeURIComponent)
        .join("/")}/`;

    // URL da imagem - usa path relativo para funcionar em qualquer domínio
    const imageUrl = item.imagens?.length
        ? `${baseUrl}${getImagePath(item.key, item.imagens[0])}`
        : `${baseUrl}/Logo-Aluguel-de-games.png`;

    // Descrição limpa (remove markdown); fallback transacional honesto.
    const cleanDescription = (item.descricao
        ?.replace(/[*_#]/g, '')
        ?.replace(/\n/g, ' ')
        ?.trim()
        ?.slice(0, 155)) ||
        `Alugue ${item.titulo} para festas e eventos em Osasco e Grande São Paulo. Entrega, montagem e suporte inclusos. Desde 1993.`;

    const heading = productHeading(item.titulo);

    return {
        // Título transacional controlado (evita duplicar o template do layout).
        title: { absolute: `${heading} em SP | Aluguel de Games` },
        description: cleanDescription,
        alternates: {
            canonical: url
        },
        openGraph: {
            title: heading,
            description: cleanDescription,
            url,
            siteName: 'Aluguel de Games',
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: item.titulo,
                    type: 'image/jpeg',
                }
            ],
            locale: 'pt_BR',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: heading,
            description: cleanDescription,
            images: [imageUrl],
            creator: '@alugueldegames',
        },
        // Meta tags adicionais para WhatsApp
        other: {
            'og:image:secure_url': imageUrl,
            'og:image:type': 'image/jpeg',
            'og:image:width': '1200',
            'og:image:height': '630',
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}



export default async function ProdutoPage({ params }: CatalogPageProps) {
    // Await params pois agora é uma Promise
    const resolvedParams = await params;
    const slugArr = resolvedParams.slug;

    // 1. Tenta como produto específico
    const item = await getItem(slugArr);

    // 2. Se não for produto, tenta renderizar como categoria (listagem)
    if (!item) {
        const categoryItems = await getCategoryItems(slugArr);

        if (categoryItems.length > 0) {
            const meta = getCategoryMetadata(slugArr);

            // JSON-LD server-side (script inline no HTML cru, nunca next/script)
            const collectionSchema = collectionPageSchema({
                name: meta.title,
                description: meta.description,
                url: `/catalogo/${slugArr.join('/')}/`,
                items: categoryItems.slice(0, 20).map((it) => ({
                    name: it.titulo,
                    url: `/catalogo/${segmentsToSlug(it.key.split('/')).join('/')}/`,
                })),
            });

            const crumbs = breadcrumbSchema([
                { name: 'Home', url: '/' },
                { name: 'Catálogo', url: '/catalogo/' },
                ...slugArr.map((seg, i) => ({
                    name: getCategoryMetadata(slugArr.slice(0, i + 1)).title,
                    url: `/catalogo/${slugArr.slice(0, i + 1).join('/')}/`,
                })),
            ]);

            return (
                <>
                    <JsonLd data={collectionSchema} />
                    <JsonLd data={crumbs} />
                    <CategoryListing slug={slugArr} meta={meta} items={categoryItems} />
                </>
            );
        }

        // 3. Nem produto, nem categoria → 404 real
        console.error(`Slug não encontrado: ${slugArr.join('/')}`);
        notFound();
    }

    const segs = item.key.split("/");
    const slugSegs = segmentsToSlug(segs);
    const heading = productHeading(item.titulo);

    // Categoria imediata (pai) — rótulo do badge + link.
    const parentSlugArr = slugSegs.slice(0, -1);
    const parentSlug = parentSlugArr.join("/");
    const parentMeta = getCategoryMetadata(parentSlugArr);
    const parentName = parentMeta.breadcrumbName ?? segs[segs.length - 2] ?? segs[0];

    // Migalhas completas (todas as categorias intermediárias).
    const categoryCrumbs = segs.slice(0, -1).map((seg, i) => {
        const prefix = slugSegs.slice(0, i + 1);
        const m = getCategoryMetadata(prefix);
        return {
            name: m.breadcrumbName ?? seg,
            href: `/catalogo/${prefix.join("/")}/`,
        };
    });

    const baseUrl = getSiteUrl();

    // Todas as imagens para o Schema
    const allImages = item.imagens?.map(
        (img) => `${baseUrl}${getImagePath(item.key, img)}`
    );

    const productUrl = `/catalogo/${slugSegs.join('/')}/`;

    // Structured Data server-side (script inline no HTML cru).
    // Product + Offer LeaseOut + additionalProperty (specs reais); sem
    // aggregateRating (só com reviews reais — proibição §11).
    const structuredData = productSchema({
        name: item.titulo,
        description: (item.descricao?.replace(/[*_#]/g, '').trim()) ||
            `Aluguel de ${item.titulo} para festas e eventos em Osasco e Grande São Paulo. Desde 1993.`,
        images: allImages,
        url: productUrl,
        properties: specAdditionalProperties(item),
    });

    const crumbs = breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Catálogo', url: '/catalogo/' },
        ...categoryCrumbs.map((c) => ({ name: c.name, url: c.href })),
        { name: item.titulo, url: productUrl },
    ]);

    const faq = productFaq(item);

    return (
        <>
            {/* Structured Data */}
            <JsonLd data={structuredData} />
            <JsonLd data={crumbs} />

            {/* StickyBar global assume o prefill do produto no mobile (§4.11) */}
            <SetStickyProduct name={item.titulo} />

            <main className="relative mx-auto max-w-screen-xl px-4 pb-20 md:px-6">
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="py-4 text-sm">
                    <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground">
                        <li>
                            <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
                        </li>
                        <li aria-hidden className="text-muted-foreground/40">/</li>
                        <li>
                            <Link href="/catalogo/" className="transition-colors hover:text-foreground">Catálogo</Link>
                        </li>
                        {categoryCrumbs.map((c) => (
                            <span key={c.href} className="contents">
                                <li aria-hidden className="text-muted-foreground/40">/</li>
                                <li>
                                    <Link href={c.href} className="transition-colors hover:text-foreground">{c.name}</Link>
                                </li>
                            </span>
                        ))}
                        <li aria-hidden className="text-muted-foreground/40">/</li>
                        <li className="font-medium text-foreground">{item.titulo}</li>
                    </ol>
                </nav>

                {/* Galeria + decisão */}
                <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
                    <div className="lg:sticky lg:top-24 lg:self-start">
                        <ProductGallery
                            images={item.imagens || []}
                            title={item.titulo}
                            itemKey={item.key}
                        />
                    </div>

                    <ProductInfo
                        item={item}
                        categoria={parentName}
                        categoriaSlug={parentSlug}
                        heading={heading}
                    />
                </div>

                {/* Ficha técnica (omite se não há dado real) */}
                <div className="mt-12">
                    <SpecsTable item={item} />
                </div>

                {/* Incluso + descrição */}
                <div className="mt-12">
                    <ProductDescription descricao={item.descricao} />
                </div>

                {/* FAQ do item (+ FAQPage 1:1) */}
                <section aria-label="Perguntas frequentes" className="mt-14">
                    <h2 className="mb-6 text-center font-display text-2xl font-extrabold tracking-tight md:text-3xl">
                        Perguntas frequentes
                    </h2>
                    <FaqNative items={faq} withSchema />
                </section>

                {/* Relacionados por ocasião */}
                <div className="mt-16">
                    <RelatedProducts item={item} />
                </div>
            </main>
        </>
    );
}
