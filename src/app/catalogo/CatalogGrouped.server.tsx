// src/components/catalogo/CatalogGrouped.server.tsx
import Image from 'next/image'
import Link from 'next/link'
import { FiImage } from 'react-icons/fi'
import { getCatalog } from '@/lib/catalog.server'
import {generateProductUrl} from "@/lib/slug-utils";

export default async function CatalogGrouped() {
    const itens = await getCatalog()
    const grupos = itens.reduce<Record<string, typeof itens>>((acc, it) => {
        const categoria = it.key.split('/')[0]
        ;(acc[categoria] ||= []).push(it)
        return acc
    }, {})

    return (
        <main className="mx-auto max-w-screen-xl px-4 py-8 space-y-12">
            {Object.entries(grupos).map(([cat, arr]) => (
                <section key={cat}>
                    <h2 className="mb-4 text-2xl font-bold">{cat}</h2>

                    {/* trilho horizontal com snap */}
                    <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
                        {arr.map((it) => (
                            <Link
                                href={generateProductUrl(it.key)}
                                key={it.key}
                                className="group flex min-w-[220px] max-w-[220px] flex-col overflow-hidden rounded-lg border snap-start"
                            >
                                {it.imagens?.[0] ? (
                                    <Image
                                        src={`/Organizado/${it.key}/${it.imagens[0]}`}
                                        alt={it.titulo}
                                        width={320}
                                        height={240}
                                        className="h-36 w-full object-cover transition group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-36 w-full items-center justify-center bg-muted">
                                        <FiImage className="text-2xl text-muted-foreground" />
                                    </div>
                                )}

                                <div className="flex flex-1 flex-col p-3">
                                    <h3 className="text-sm font-semibold">{it.titulo}</h3>
                                    <p className="text-xs text-muted-foreground line-clamp-3">
                                        {it.descricao ?? ''}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            ))}
        </main>
    )
}
