// src/app/catalogo/[...slug]/page.tsx
import { notFound } from "next/navigation";
import Script from "next/script";
import { getCatalog, getItem } from "@/lib/catalog.server";
import { ProductGallery } from "@/components/catalogo/ProductGallery";
import { ProductInfo } from "@/components/catalogo/ProductInfo";
import { RelatedProducts } from "@/components/catalogo/RelatedProducts";
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

    // Não decodificar aqui - Next.js já fornece decodificado
    const item = await getItem(slugArr);
    if (!item) return { title: "Produto não encontrado" };

    // Usa a função centralizada para pegar a URL base
    const baseUrl = getSiteUrl();

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

    return {
        title: `${item.titulo} - Aluguel de Games`,
        description: cleanDescription,
        alternates: {
            canonical: url
        },
        openGraph: {
            title: item.titulo,
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

    // Não decodificar aqui - Next.js já fornece decodificado
    const item = await getItem(slugArr);
    if (!item) {
        console.error(`Produto não encontrado: ${slugArr.join('/')}`);
        notFound();
    }

    const categoria = item.key.split("/")[0];

    // Usa a função centralizada para pegar a URL base
    const baseUrl = getSiteUrl();

    // URL da imagem para o Schema
    const imageUrl = item.imagens?.length
        ? `${baseUrl}${getImagePath(item.key, item.imagens[0])}`
        : null;

    // Todas as imagens para o Schema
    const allImages = item.imagens?.map(
        (img) => `${baseUrl}${getImagePath(item.key, img)}`
    );

    // Structured Data melhorado
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: item.titulo,
        description: item.descricao?.replace(/[*_#]/g, '').trim(),
        image: allImages,
        brand: {
            "@type": "Organization",
            name: "Aluguel de Games"
        },
        offers: {
            "@type": "Offer",
            priceCurrency: "BRL",
            availability: "https://schema.org/InStock",
            seller: {
                "@type": "Organization",
                name: "Aluguel de Games"
            }
        },
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "5",
            reviewCount: "47"
        }
    };

    return (
        <>
            {/* Structured Data */}
            <Script
                id="ld-product"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData),
                }}
            />

            <main className="relative mx-auto max-w-screen-2xl">
                {/* Breadcrumb */}
                <nav className="px-4 py-4 text-sm">
                    <ol className="flex items-center gap-2 text-muted-foreground">
                        <li>
                            <Link href="/">
                                Home
                            </Link>
                        </li>
                        <li>/</li>
                        <li>
                            <Link href="/catalogo">
                                Catálogo
                            </Link>
                        </li>
                        <li>/</li>
                        <li>
                            <Link href={`/catalogo#${encodeURIComponent(categoria)}`}>
                                {categoria}
                            </Link>
                        </li>
                        <li>/</li>
                        <li className="text-foreground font-medium">{item.titulo}</li>
                    </ol>
                </nav>

                {/* Product Content */}
                <div className="grid gap-8 px-4 pb-16 lg:grid-cols-2">
                    {/* Gallery */}
                    <ProductGallery
                        images={item.imagens || []}
                        title={item.titulo}
                        itemKey={item.key}
                    />

                    {/* Info */}
                    <ProductInfo
                        titulo={item.titulo}
                        descricao={item.descricao || ""}
                        categoria={categoria}
                    />
                </div>

                {/* Related Products */}
                <RelatedProducts categoria={categoria} currentKey={item.key} />
            </main>
        </>
    );
}