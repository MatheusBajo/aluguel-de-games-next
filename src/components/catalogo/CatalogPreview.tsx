/* Server Component: mostra alguns itens do catálogo */
import Image from "next/image";
import Link from "next/link";
import { FiImage } from "react-icons/fi";
import { getCatalog } from '@/lib/catalog.server'
import { Button } from "@/components/ui/button";

export default async function CatalogPreview({ limit = 6 }: { limit?: number }) {
    const itens = await getCatalog(limit);

    return (
        <section className="mx-auto max-w-screen-xl px-4 py-8">
            <h2 className="mb-6 text-2xl font-bold">Catálogo</h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                {itens.map((it) => (
                    <Link
                        href={`/catalogo/${encodeURIComponent(it.key)}`}
                        key={it.key}
                        className="group flex flex-col overflow-hidden rounded-lg border"
                    >
                        {it.imagens?.[0] ? (
                            <Image
                                src={`/Organizado/${it.key}/${it.imagens[0]}`}
                                alt={it.titulo}
                                width={320}
                                height={240}
                                className="h-32 w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                        ) : (
                            <div className="flex h-32 w-full items-center justify-center bg-muted">
                                <FiImage className="text-2xl text-muted-foreground" />
                            </div>
                        )}
                        <div className="p-2">
                            <h3 className="text-sm font-semibold truncate">
                                {it.titulo}
                            </h3>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="mt-6 text-center">
                <Button asChild>
                    <Link href="/catalogo">Ver catálogo completo</Link>
                </Button>
            </div>
        </section>
    );
}
