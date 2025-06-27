// src/components/catalogo/CatalogList.server.tsx
import Image from 'next/image'
import Link from 'next/link'
import { FiImage } from 'react-icons/fi'
import { getCatalog } from '@/lib/catalog.server'

interface Props {
    order?: string[]           // ['Fliperamas', 'Air Games', ...]
    limitPerCat?: number       // opcional
}

export default async function CatalogList({ order, limitPerCat }: Props) {
    const itens = await getCatalog()
    const grupos = itens.reduce<Record<string, typeof itens>>((acc, it) => {
        const cat = it.key.split('/')[0]
        ;(acc[cat] ||= []).push(it)
        return acc
    }, {})

    // aplica ordem recebida
    const categorias = order
        ? [...order, ...Object.keys(grupos).filter((c) => !order.includes(c))]
        : Object.keys(grupos)

    return (
        <div className="space-y-12">
            {categorias.map((cat) => {
                const arr = grupos[cat]?.slice(0, limitPerCat)
                if (!arr?.length) return null
                return (
                    <section key={cat} id={encodeURIComponent(cat)}>
                        <h2 className="mb-4 text-2xl font-bold">{cat}</h2>

                        {/* trilho horizontal */}
                        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
                            {arr.map((it) => (
                                <Link
                                    key={it.key}
                                    href={`/catalogo/${it.key
                                        .split('/')
                                        .map(encodeURIComponent)
                                        .join('/')}`}
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
                )
            })}
        </div>
    )
}
