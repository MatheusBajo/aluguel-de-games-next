import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllSlugs, getItem } from "@/lib/catalog";

export async function generateStaticParams() {
    const slugs = await getAllSlugs();
    return slugs.map((slug) => ({ slug }));
}

export default async function CatalogItemPage({
    params,
}: {
    params: { slug: string[] };
}) {
    const item = await getItem(params.slug);
    if (!item) return notFound();

    return (
        <main className="mx-auto max-w-screen-lg px-4 py-8">
            <h1 className="mb-4 text-3xl font-bold">{item.titulo}</h1>
            {item.descricao && (
                <p className="mb-6 max-w-prose text-muted-foreground">
                    {item.descricao}
                </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
                {item.imagens?.map((img) => (
                    <Image
                        key={img}
                        src={`/Organizado/${item.dir}/${img}`}
                        alt={item.titulo}
                        width={800}
                        height={600}
                        className="w-full object-contain"
                    />
                ))}
            </div>
        </main>
    );
}
