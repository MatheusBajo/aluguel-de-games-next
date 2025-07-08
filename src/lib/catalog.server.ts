import 'server-only'
import fs from 'node:fs/promises'
import path from 'node:path'

export interface CatalogItem {
    key: string;
    titulo: string;
    descricao?: string;
    imagens?: string[];
}

const rootDir = path.join(process.cwd(), 'public', 'Organizado');

// Função auxiliar para normalizar strings para comparação
function normalizeString(str: string): string {
    return str.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^a-z0-9]/g, ''); // Remove caracteres especiais
}

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

// Função auxiliar para encontrar o diretório real (case-insensitive)
async function findRealPath(basePath: string, segments: string[]): Promise<string[] | null> {
    let currentPath = basePath;
    const realSegments: string[] = [];

    for (const segment of segments) {
        try {
            const entries = await fs.readdir(currentPath);
            const normalizedSegment = normalizeString(segment);

            // Procura por correspondência case-insensitive
            const match = entries.find(entry =>
                normalizeString(entry) === normalizedSegment
            );

            if (!match) {
                return null;
            }

            realSegments.push(match);
            currentPath = path.join(currentPath, match);
        } catch {
            return null;
        }
    }

    return realSegments;
}

export async function getItem(slug: string[]): Promise<(CatalogItem & { dir: string }) | null> {
    // Primeiro, tenta o caminho exato
    const exactDir = path.join(rootDir, ...slug);
    try {
        const raw = await fs.readFile(path.join(exactDir, 'metadata.json'), 'utf8');
        const data = JSON.parse(raw) as Omit<CatalogItem, 'key'>;
        return { ...data, key: slug.join('/'), dir: slug.join('/') };
    } catch {
        // Se falhar, tenta busca case-insensitive
    }

    // Busca case-insensitive
    const realSegments = await findRealPath(rootDir, slug);
    if (!realSegments) {
        return null;
    }

    const dir = path.join(rootDir, ...realSegments);
    try {
        const raw = await fs.readFile(path.join(dir, 'metadata.json'), 'utf8');
        const data = JSON.parse(raw) as Omit<CatalogItem, 'key'>;
        // Retorna com a key real (preservando maiúsculas/minúsculas originais)
        return { ...data, key: realSegments.join('/'), dir: realSegments.join('/') };
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