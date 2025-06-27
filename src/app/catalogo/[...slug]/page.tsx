import type { Metadata } from 'next'
import Script from 'next/script'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getItem, getAllSlugs } from '@/lib/catalog.server'

/* 1) Rotas estáticas para export */
export async function generateStaticParams() {
    const slugs = await getAllSlugs() // ex.: [["Air Games","Air Game Infantil"], ...]
    return slugs.map(seg => ({ slug: seg.map(encodeURIComponent) }))
}

/* 2) Metadados exclusivos de cada produto */
export async function generateMetadata(
    { params }: { params: { slug: string[] } }
): Promise<Metadata> {
    const item = await getItem(params.slug.map(decodeURIComponent))
    if (!item) return { title: 'Produto não encontrado' }

    const url = `https://seusite.com/catalogo/${params.slug.join('/')}`

    return {
        title: `${item.titulo} | Aluguel de Games`,
        description: item.descricao?.slice(0, 150) ?? '',
        alternates: { canonical: url },
        openGraph: {
            title: item.titulo,
            description: item.descricao,
            url,
            images: item.imagens?.length
                ? [`https://seusite.com/Organizado/${item.key}/${item.imagens[0]}`]
                : []
        }
    }
}

/* 3) Página de produto */
export default async function ProdutoPage(
    { params }: { params: { slug: string[] } }
) {
    const item = await getItem(params.slug.map(decodeURIComponent))
    if (!item) notFound()

    return (
        <main className="mx-auto max-w-screen-lg px-4 py-10">
            {/* Structured Data para rich snippet */}
            <Script
                id="ld-product"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Product',
                        name: item.titulo,
                        description: item.descricao,
                        image: item.imagens?.map(img =>
                            `https://seusite.com/Organizado/${item.key}/${img}`
                        )
                    })
                }}
            />

            <h1 className="mb-6 text-3xl font-bold">{item.titulo}</h1>

            {item.imagens?.length && (
                <div className="grid gap-4 md:grid-cols-2">
                    {item.imagens.map((img, idx) => (
                        <Image
                            key={img + idx}
                            src={`/Organizado/${item.key}/${img}`}
                            alt={item.titulo}
                            width={800}
                            height={600}
                            className="w-full rounded-md object-cover"
                            priority={idx === 0}
                        />
                    ))}
                </div>
            )}

            {item.descricao && (
                <p className="text-lg leading-relaxed my-6">{item.descricao}</p>
            )}

            <div className="mt-4">
                <a
                    href="https://wa.me/+551142377766"
                    target="_blank"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90"
                >
                    Pedir Orçamento no WhatsApp
                </a>
            </div>
        </main>
    )
}
