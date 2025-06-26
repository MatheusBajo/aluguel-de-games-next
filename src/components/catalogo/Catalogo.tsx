/* Server Component: gera HTML durante o build */
import Image from "next/image";
import Link from "next/link";
import { FiImage } from "react-icons/fi";
import { getCatalog } from "@/lib/catalog";

export default async function Catalogo() {
    const itens = await getCatalog();

    return (
        <main className="mx-auto max-w-screen-xl px-4 py-8">
            <h1 className="mb-6 text-3xl font-bold">Catálogo</h1>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
                                width={640}
                                height={480}
                                className="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                        ) : (
                            <div className="flex h-48 w-full items-center justify-center bg-muted">
                                <FiImage className="text-3xl text-muted-foreground" />
                            </div>
                        )}

                        <div className="flex flex-1 flex-col p-4">
                            <h2 className="mb-1 text-lg font-semibold">{it.titulo}</h2>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {it.descricao ?? ""}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
}
