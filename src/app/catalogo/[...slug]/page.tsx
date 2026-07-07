// src/app/catalogo/[...slug]/page.tsx
import { notFound } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, collectionPageSchema, productSchema } from "@/lib/schema";
import { getCatalog, getCategoryItems, getItem } from "@/lib/catalog.server";
import { ProductGallery } from "@/components/catalogo/ProductGallery";
import { ProductPanel } from "@/components/catalogo/ProductPanel";
import { SpecsTable } from "@/components/catalogo/SpecsTable";
import { OccasionChips } from "@/components/catalogo/OccasionChips";
import { ProductDescription } from "@/components/catalogo/ProductDescription";
import { RelatedProducts } from "@/components/catalogo/RelatedProducts";
import { CategoryListing } from "@/components/catalogo/CategoryListing";
import { FaqNative } from "@/components/content/FaqNative";
import { SetStickyProduct } from "@/components/orcamento/ProductStickyContext";
import { getCategoryMetadata } from "@/lib/catalog-categories";
import { resolveSpecs, specsToRows } from "@/lib/catalog-specs";
import { buildProductCapsule, getProductFaq } from "@/lib/catalog-content";
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
                // absolute: metaTitle já traz a marca (evita duplo branding do template)
                title: { absolute: meta.metaTitle ?? meta.title },
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
        .join("/")}`;

    // URL da imagem - usa path relativo para funcionar em qualquer domínio
    const imageUrl = item.imagens?.length
        ? `${baseUrl}${getImagePath(item.key, item.imagens[0])}`
        : `${baseUrl}/Logo-Aluguel-de-games.png`;

    // Descrição limpa (remove markdown)
    const cleanDescription = item.descricao
        ?.replace(/[*_#]/g, '')
        ?.replace(/\n/g, ' ')
        ?.trim()
        ?.slice(0, 155) || `Alugue ${item.titulo} para seu evento. Entrega e instalação grátis!`;

    // Título transacional (spec §4.3 + brief): keyword "aluguel" + intenção de festa.
    const transactionalTitle = `Aluguel de ${item.titulo} para Festas e Eventos`;

    return {
        title: { absolute: `${transactionalTitle} | Aluguel de Games` },
        description: cleanDescription,
        alternates: {
            canonical: url
        },
        openGraph: {
            title: transactionalTitle,
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
            title: item.titulo,
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
            const baseUrl = getSiteUrl();
            const url = `${baseUrl}/catalogo/${slugArr.join('/')}/`;

            // Schemas server-side no HTML cru (CollectionPage + BreadcrumbList)
            const collectionSchema = collectionPageSchema({
                name: meta.title,
                description: meta.description,
                url,
                items: categoryItems.map((it) => ({
                    name: it.titulo,
                    url: `${baseUrl}/catalogo/${segmentsToSlug(it.key.split('/')).join('/')}/`,
                })),
            });
            const crumbs = breadcrumbSchema([
                { name: 'Home', url: '/' },
                { name: 'Catálogo', url: '/catalogo/' },
                ...slugArr.map((_, idx) => ({
                    name: getCategoryMetadata(slugArr.slice(0, idx + 1)).breadcrumbName
                        ?? slugArr[idx],
                    url: `/catalogo/${slugArr.slice(0, idx + 1).join('/')}/`,
                })),
            ]);

            return (
                <>
                    <JsonLd data={[collectionSchema, crumbs]} />
                    <CategoryListing slug={slugArr} meta={meta} items={categoryItems} />
                </>
            );
        }

        // 3. Nem produto, nem categoria → 404 real
        console.error(`Slug não encontrado: ${slugArr.join('/')}`);
        notFound();
    }

    const segments = item.key.split("/");
    const categoria = segments[0];
    const categoriaSlug = segmentsToSlug([categoria])[0];
    const categoriaHref = `/catalogo/${categoriaSlug}/`;
    const categoriaMeta = getCategoryMetadata([categoriaSlug]);
    const categoriaLabel = categoriaMeta.breadcrumbName ?? categoria;

    // Usa a função centralizada para pegar a URL base
    const baseUrl = getSiteUrl();
    const productUrl = `${baseUrl}/catalogo/${segmentsToSlug(segments).join('/')}/`;

    // Todas as imagens para o Schema
    const allImages = item.imagens?.map(
        (img) => `${baseUrl}${getImagePath(item.key, img)}`
    );

    // Ficha técnica: specs do metadata + dimensões migradas do nome do arquivo (§4.5).
    const specs = resolveSpecs(item.specs, item.imagens);
    const specRows = specsToRows(specs); // mesmas linhas viram additionalProperty (machine-readable)

    // Cápsula + FAQ (do item, ou herdada da categoria — spec §7).
    const capsule = buildProductCapsule(item.titulo, item.capsule);
    const faqs = item.faq?.length ? item.faq : getProductFaq();

    // Schemas server-side no HTML cru: Product+Offer LeaseOut + additionalProperty + BreadcrumbList.
    // aggregateRating continua fora — só com reviews reais (gate binário). FAQPage sai do <FaqNative>.
    const structuredData = productSchema({
        name: item.titulo,
        description: item.descricao?.replace(/[*_#]/g, '').trim(),
        images: allImages,
        url: productUrl,
        additionalProperty: specRows.map((r) => ({ name: r.label, value: r.value })),
    });
    const crumbs = breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Catálogo', url: '/catalogo/' },
        { name: categoriaLabel, url: categoriaHref },
        { name: item.titulo, url: productUrl },
    ]);

    return (
        <>
            <JsonLd data={[structuredData, crumbs]} />
            {/* Ponte pra StickyBar global nomear o produto no prefill (spec §4.10) */}
            <SetStickyProduct product={item.titulo} />

            <main className="relative mx-auto max-w-screen-xl px-4 md:px-6 pb-20">
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="py-4 text-sm">
                    <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground">
                        <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
                        <li aria-hidden>/</li>
                        <li><Link href="/catalogo" className="hover:text-foreground transition-colors">Catálogo</Link></li>
                        <li aria-hidden>/</li>
                        <li>
                            <Link href={categoriaHref} className="hover:text-foreground transition-colors">
                                {categoriaLabel}
                            </Link>
                        </li>
                        <li aria-hidden>/</li>
                        <li className="text-foreground font-medium">{item.titulo}</li>
                    </ol>
                </nav>

                {/* Dobra 1: galeria + painel de decisão */}
                <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                    <ProductGallery
                        images={item.imagens || []}
                        title={item.titulo}
                        itemKey={item.key}
                        placeholder={item.placeholder}
                    />
                    <ProductPanel
                        titulo={item.titulo}
                        capsule={capsule}
                        categoriaLabel={categoriaLabel}
                        categoriaHref={categoriaHref}
                        badges={item.badges}
                    />
                </div>

                {/* Ficha técnica (some se não houver spec) */}
                <SpecsTable specs={specs} className="mt-14" />

                {/* Vai bem em (ocasião → LP do público) */}
                <OccasionChips className="mt-14" />

                {/* Sobre o equipamento (descrição markdown do dono) */}
                <div className="mt-14">
                    <ProductDescription descricao={item.descricao} titulo={item.titulo} />
                </div>

                {/* FAQ do item (<details> nativo + FAQPage 1:1) */}
                <section className="mt-14">
                    <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight mb-5">
                        Perguntas frequentes
                    </h2>
                    <FaqNative faqs={faqs} />
                </section>

                {/* Relacionados (curadoria) */}
                <div className="mt-16">
                    <RelatedProducts categoria={categoria} currentKey={item.key} />
                </div>
            </main>
        </>
    );
}