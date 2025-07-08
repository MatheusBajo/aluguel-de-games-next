// app/catalogo/[...slug]/page.tsx – Server Component with OG metadata
import fs from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import dynamic from "next/dynamic";

// 👇 client‑side heavy gallery lazy‑loaded
const ProductGallery = dynamic(() => import("@/components/catalogo/ProductGallery"), {
    ssr: false,
});
const ProductInfo = dynamic(() => import("@/components/catalogo/ProductInfo"), {
    ssr: false,
});

// ---------- helpers ----------
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "";

function readMeta(dir: string) {
    const metaPath = path.join(dir, "metadata.json");
    return JSON.parse(fs.readFileSync(metaPath, "utf-8")) as {
        titulo: string;
        descricao: string;
        imagens: string[];
    };
}

// ---------- params / metadata ----------
export async function generateStaticParams() {
    // percorre Organizado/**/metadata.json e devolve slugs
    const root = path.join(process.cwd(), "Organizado");
    const params: { slug: string[] }[] = [];
    const walk = async (dir: string, parts: string[] = []) => {
        const list = await fs.readdir(dir, { withFileTypes: true });
        for (const d of list) {
            if (d.isDirectory()) await walk(path.join(dir, d.name), [...parts, d.name]);
            if (d.name === "metadata.json") params.push({ slug: parts });
        }
    };
    await walk(root);
    return params;
}

export async function generateMetadata({ params }: { params: { slug: string[] } }): Promise<Metadata> {
    const dir = path.join(process.cwd(), "Organizado", ...params.slug);
    let meta;
    try {
        meta = readMeta(dir);
    } catch {
        return {};
    }
    const imgAbs = meta.imagens?.[0]
        ? `${SITE}/${path.join("Organizado", ...params.slug, meta.imagens[0])}`
        : `${SITE}/og-default.jpg`;
    const plain = meta.descricao.replace(/\*\*|\n|\r/g, " ").slice(0, 150);
    const url = `${SITE}/catalogo/${params.slug.join("/")}`;
    return {
        title: meta.titulo,
        description: plain,
        openGraph: {
            title: meta.titulo,
            description: plain,
            url,
            images: [{ url: imgAbs, width: 800, height: 600 }],
            type: "website",
        },
        twitter: { card: "summary_large_image", title: meta.titulo, description: plain, images: [imgAbs] },
        alternates: { canonical: url },
    };
}

// ---------- page component ----------
export default async function ProdutoPage({ params }: { params: { slug: string[] } }) {
    const dir = path.join(process.cwd(), "Organizado", ...params.slug);
    let meta;
    try {
        meta = readMeta(dir);
    } catch {
        notFound();
    }
    const media = meta.imagens.map((img) => `/Organizado/${params.slug.join("/")}/${img}`);

    return (
        <div className="mx-auto max-w-screen-lg px-4 py-8 space-y-8">
            <ProductInfo titulo={meta.titulo} descricao={meta.descricao} />
            <ProductGallery imagens={media} />
        </div>
    );
}
