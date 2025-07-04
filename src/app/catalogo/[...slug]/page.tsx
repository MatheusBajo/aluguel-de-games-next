import { notFound } from "next/navigation";
import Script from "next/script";
import { getCatalog, getItem } from "@/lib/catalog.server";
import { ProductGallery } from "@/components/catalogo/ProductGallery";
import { ProductInfo } from "@/components/catalogo/ProductInfo";
import { RelatedProducts } from "@/components/catalogo/RelatedProducts";
import Link from "next/link";

/**
 * Tipos locais — não usamos PageProps do Next porque ele tem outras
 * expectativas internas. Mantemos só o que precisamos aqui.
 */
export type Params = { slug: string[] };

export async function generateStaticParams() {
    const catalogo = await getCatalog();

    return catalogo.map((item) => ({
        // cada segmento sem caracteres proibidos
        slug: item.key.split("/").map(encodeURIComponent),
    }));
}

export async function generateMetadata({ params }: { params: Params }) {
    const slugArr = params.slug;

    const item = await getItem(slugArr.map(decodeURIComponent));
    if (!item) return { title: "Produto não encontrado" };

    const url = `https://alugueldegames.com/catalogo/${slugArr
        .map(encodeURIComponent)
        .join("/")}`;

    return {
        title: item.titulo,
        description: item.descricao?.slice(0, 155) || "",
        alternates: { canonical: url },
        openGraph: {
            title: item.titulo,
            description: item.descricao,
            url,
            images: item.imagens?.length
                ? [`https://alugueldegames.com/Organizado/${item.key}/${item.imagens[0]}`]
                : [],
        },
    };
}

export default async function ProdutoPage({ params }: { params: Params }) {
    const slugArr = params.slug;

    const item = await getItem(slugArr.map(decodeURIComponent));
    if (!item) notFound();

    const categoria = item.key.split("/")[0];

    return (
        <>
            {/* Structured Data */}
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
                            (img) =>
                                `https://alugueldegames.com/Organizado/${item.key}/${img}`
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
                                    .split("/")
                                    .map(encodeURIComponent)
                                    .join("/")}`}
                            >
                                Catálogo
                            </Link>
                        </li>
                        <li>/</li>
                        <li>
                            <Link
                                href={`/catalogo/${item.key
                                    .split("/")
                                    .map(encodeURIComponent)
                                    .join("/")}`}
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
