"use client";
// app/catalogo/[...slug]/page.tsx – versão revisada com Open Graph absoluto e descrição limpa
import { notFound } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import { getCatalog, getItem } from "@/lib/catalog.server";
import { ProductGallery } from "@/components/catalogo/ProductGallery";
import { ProductInfo } from "@/components/catalogo/ProductInfo";
import { RelatedProducts } from "@/components/catalogo/RelatedProducts";

/* -------------------------------------------------------------
 * Constantes utilitárias
 * -----------------------------------------------------------*/
const SITE = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? ""; // sem barra final

function stripMarkdown(md: string) {
    return md
        .replace(/\*\*|__/g, "")            // bold/italic
        .replace(/`([^`]+)`/g, "$1")          // inline code
        .replace(/\![^[\]]*\[[^\]]*\]\([^)]*\)/g, "") // imagens markdown
        .replace(/\[[^\]]*\]\([^)]*\)/g, "")           // links
        .replace(/[#>*_\-]/g, "")             // demais tokens
        .replace(/\n+/g, " ")                // novas linhas → espaço
        .trim();
}

/* -------------------------------------------------------------
 * Tipagem Next 14+ app router
 * -----------------------------------------------------------*/
type Params = { slug: string[] };
interface CatalogPageProps {
    params: Promise<Params>;
}

/* -------------------------------------------------------------
 * SSG params
 * -----------------------------------------------------------*/
export async function generateStaticParams() {
    const catalogo = await getCatalog();
    return catalogo.map((item) => ({
        slug: item.key.split("/").map(encodeURIComponent),
    }));
}

/* -------------------------------------------------------------
 * Meta dinâmico (OpenGraph + Twitter + canonical)
 * -----------------------------------------------------------*/
export async function generateMetadata({ params }: CatalogPageProps) {
    const { slug: slugArr } = await params;
    const item = await getItem(slugArr.map(decodeURIComponent));
    if (!item) return { title: "Produto não encontrado" };

    const url = `${SITE}/catalogo/${slugArr.map(encodeURIComponent).join("/")}`;
    const descricaoPlain = stripMarkdown(item.descricao || "").slice(0, 155);
    const firstImg = item.imagens?.[0]
        ? `${SITE}/Organizado/${item.key}/${item.imagens[0]}`
        : `${SITE}/og-default.jpg`;

    return {
        title: item.titulo,
        description: descricaoPlain,
        alternates: { canonical: url },
        openGraph: {
            title: item.titulo,
            description: descricaoPlain,
            type: "website",
            url,
            images: [
                {
                    url: firstImg,
                    width: 800,
                    height: 600,
                    alt: item.titulo,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: item.titulo,
            description: descricaoPlain,
            images: [firstImg],
        },
    } as const;
}

/* -------------------------------------------------------------
 * Página do produto
 * -----------------------------------------------------------*/
export default async function ProdutoPage({ params }: CatalogPageProps) {
    const { slug: slugArr } = await params;
    const item = await getItem(slugArr.map(decodeURIComponent));
    if (!item) notFound();

    const categoria = item.key.split("/")[0];

    return (
        <>
            {/* LD-JSON para SEO */}
            <Script
                id="ld-product"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Product",
                        name: item.titulo,
                        description: stripMarkdown(item.descricao || ""),
                        image: item.imagens?.map(
                            (img) => `${SITE}/Organizado/${item.key}/${img}`
                        ),
                    }),
                }}
            />

            <main className="relative mx-auto max-w-screen-2xl">
                {/* Breadcrumb */}
                <nav className="px-4 py-4 text-sm">
                    <ol className="flex items-center gap-2 text-muted-foreground">
                        <li>
                            <Link href="/catalogo">Catálogo</Link>
                        </li>
                        <li>/</li>
                        <li>
                            <Link href={`/catalogo/${encodeURIComponent(categoria)}`}>{
                                categoria
                            }</Link>
                        </li>
                        <li>/</li>
                        <li className="font-medium text-foreground">{item.titulo}</li>
                    </ol>
                </nav>

                {/* Conteúdo do produto */}
                <div className="grid gap-8 px-4 pb-16 lg:grid-cols-2">
                    <ProductGallery
                        images={item.imagens || []}
                        title={item.titulo}
                        itemKey={item.key}
                    />

                    <ProductInfo
                        titulo={item.titulo}
                        descricao={item.descricao || ""}
                        categoria={categoria}
                    />
                </div>

                {/* Produtos Relacionados */}
                <RelatedProducts categoria={categoria} currentKey={item.key} />
            </main>
        </>
    );
}
