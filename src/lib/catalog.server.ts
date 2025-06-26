import 'server-only'          // garante erro claro se cair no client
import fs from 'node:fs/promises'
import path from 'node:path'

export interface CatalogItem {
    key: string;
    titulo: string;
    descricao?: string;
    imagens?: string[];
}

const rootDir = path.join(process.cwd(), 'public', 'Organizado');

async function walk(dir: string, segments: string[], out: CatalogItem[], limit?: number) {
    if (limit && out.length >= limit) return;
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const abs = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            const metaPath = path.join(abs, 'metadata.json');
            try {
                const raw = await fs.readFile(metaPath, 'utf8');
                const data = JSON.parse(raw) as Omit<CatalogItem, 'key'>;
                out.push({ ...data, key: [...segments, entry.name].join('/') });
                if (limit && out.length >= limit) return;
            } catch {
                await walk(abs, [...segments, entry.name], out, limit);
            }
        }
    }
}

export async function getCatalog(limit?: number): Promise<CatalogItem[]> {
    const items: CatalogItem[] = [];
    await walk(rootDir, [], items, limit);
    return items;
}

export async function getItem(slug: string[]): Promise<(CatalogItem & { dir: string }) | null> {
    const dir = path.join(rootDir, ...slug);
    try {
        const raw = await fs.readFile(path.join(dir, 'metadata.json'), 'utf8');
        const data = JSON.parse(raw) as Omit<CatalogItem, 'key'>;
        return { ...data, key: slug.join('/'), dir: slug.join('/') };
    } catch {
        return null;
    }
}

export async function getAllSlugs(): Promise<string[][]> {
    const slugs: string[][] = [];
    async function walkDirs(dir: string, segments: string[]) {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            const abs = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                const metaPath = path.join(abs, 'metadata.json');
                try {
                    await fs.access(metaPath);
                    slugs.push([...segments, entry.name]);
                } catch {
                    await walkDirs(abs, [...segments, entry.name]);
                }
            }
        }
    }
    await walkDirs(rootDir, []);
    return slugs;
}
