/* Server Component: gera HTML durante o build */
import fs from "node:fs/promises";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { FiImage } from "react-icons/fi";

interface Metadata {
    titulo: string;
    descricao?: string;
    imagens?: string[];
}

async function getCatalog(): Promise<(Metadata & { key: string })[]> {
    const root = path.join(process.cwd(), "Organizado");
    const out: (Metadata & { key: string })[] = [];

    async function walk(dir: string) {
        const list = await fs.readdir(dir, { withFileTypes: true });
        for (const itm of list) {
            const abs = path.join(dir, itm.name);
            if (itm.isDirectory()) await walk(abs);
            if (itm.name === "metadata.json") {
                const raw = await fs.readFile(abs, "utf8");
                const data = JSON.parse(raw) as Metadata;
                out.push({ ...data, key: path.relative(root, dir) });
            }
        }
    }
    await walk(root);
    return out;
}

export default async function Catalogo() {
    const itens = await getCatalog();

    return (
        <main className="mx-auto max-w-screen-xl px-4 py-8">
            <h1 className="mb-6 text-3xl font-bold">Catálogo</h1>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {itens.map((it) => (
                    <Link
                        href={`/itens/${encodeURIComponent(it.key)}`}
                        key={it.key}
                        className="group flex flex-col overflow-hidden rounded-lg border"
                    >
                        {it.imagens?.[0] ? (
                            <Image
                                src={it.imagens[0]}
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
