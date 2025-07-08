import { notFound } from "next/navigation";
import Script from "next/script";
import { getCatalog, getItem } from "@/lib/catalog.server";
import { ProductGallery } from "@/components/catalogo/ProductGallery";
import { ProductInfo } from "@/components/catalogo/ProductInfo";
import { RelatedProducts } from "@/components/catalogo/RelatedProducts";
import Link from "next/link";
import type { Metadata } from "next";

/* ------------------------------------------------------------------ */
/*  TIPAGENS                                                          */
/* ------------------------------------------------------------------ */

type Params = { slug: string[] };

/* ------------------------------------------------------------------ */
/*  STATIC PARAMS                                                     */
/* ------------------------------------------------------------------ */
export async function generateStaticParams() {
    const catalogo = await getCatalog();

    // devolve segmentos puros ─ sem encode
    return catalogo.map((item) => ({
        slug: item.key.split("/"),   // aqui já vem "air games"
    }));
}

/* ------------------------------------------------------------------ */
/*  METADADOS                                                         */
/* ------------------------------------------------------------------ */


export async function generateMetadata(
    { params }: { params: Promise<Params> }
): Promise<Metadata> {
    const { slug } = await params;          // << precisa do await
    const item = await getItem(slug.map(decodeURIComponent));

    if (!item) {
        return {
            title: "Produto não encontrado",
            openGraph: {
                title: "Produto não encontrado",
                url: "https://alugueldegames.com/catalogo",
                type: "website",
            },
        };
    }

    const url   = `https://alugueldegames.com/catalogo/${slug.map(encodeURIComponent).join("/")}`;
    const image = `https://alugueldegames.com/Organizado/${item.key}/${item.imagens?.[0] ?? "default.jpg"}`;

    return {
        title: item.titulo,
        description: item.descricao?.slice(0, 155) ?? "",
        alternates: { canonical: url },
        openGraph: {
            type: "website",
            url,
            title: item.titulo,
            description: item.descricao,
            siteName: "Aluguel de Games",
            locale: "pt_BR",
            images: [{ url: image, width: 1200, height: 630 }],
        },
        twitter: {
            card: "summary_large_image",
            title: item.titulo,
            description: item.descricao,
            images: [image],
        },
        // other: {
        //     "product:price:amount": item.preco?.toString() ?? "",
        //     "product:price:currency": "BRL",
        // },
    };
}

/* ------------------------------------------------------------------ */
/*  PÁGINA                                                            */
/* ------------------------------------------------------------------ */
export default async function ProdutoPage(
    { params }: { params: Promise<Params> }
) {
    const { slug } = await params;          // idem
    const item = await getItem(slug.map(decodeURIComponent));
    if (!item) notFound();

    const categoria = item.key.split("/")[0];

    return (
        <>
            <Script
                id="ld-product"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Product",
                        name: item.titulo,
                        description: item.descricao,
                        image: item.imagens?.map(
                            (img) => `https://alugueldegames.com/Organizado/${item.key}/${img}`
                        ),
                    }),
                }}
            />

            <main className="relative mx-auto max-w-screen-2xl">
                {/* Breadcrumb */}
                <nav className="px-4 py-4 text-sm">
                    <ol className="flex items-center gap-2 text-muted-foreground">
                        <li>
                            <Link
                                href={`/catalogo/${item.key
                                    }`}
                            >
                                Catálogo
                            </Link>
                        </li>
                        <li>/</li>
                        <li>
                            <Link
                                href={`/catalogo/${item.key
                                    }`}
                            >
                                {categoria}
                            </Link>
                        </li>
                        <li>/</li>
                        <li className="text-foreground font-medium">{item.titulo}</li>
                    </ol>
                </nav>

                {/* Product Content */}
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

                {/* Related Products */}
                <RelatedProducts categoria={categoria} currentKey={item.key} />
            </main>
        </>
    );
}
