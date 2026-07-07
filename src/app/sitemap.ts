// src/app/sitemap.ts
//
// FONTE ÚNICA de sitemap (next-sitemap/postbuild e public/sitemap.xml morreram).
// Usa slug-utils pra gerar as MESMAS URLs que generateStaticParams gera
// (o sitemap antigo emitia keys cruas com acento/espaço → 404).
// Rotas: estáticas + TODAS as categorias (prefixos) + TODOS os produtos.
export const dynamic = "force-static";
export const revalidate = false;

import { MetadataRoute } from 'next';
import { getCatalog } from '@/lib/catalog.server';
import { segmentsToSlug } from '@/lib/slug-utils';

const BASE_URL = 'https://www.alugueldegames.com.br';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const lastModified = new Date(); // data real do build

    // ---- Rotas estáticas (apenas rotas que EXISTEM — zero 404 no sitemap) ----
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: `${BASE_URL}/`, lastModified, changeFrequency: 'weekly', priority: 1.0 },
        { url: `${BASE_URL}/catalogo/`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${BASE_URL}/empresas/`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${BASE_URL}/quanto-custa/`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/festas/`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/como-funciona/`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/sobre/`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/galeria/`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/contato/`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
        { url: `${BASE_URL}/privacidade/`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    ];

    // ---- Catálogo: categorias (prefixos) + produtos (keys completas) ----
    const catalogo = await getCatalog();
    const productPaths = new Set<string>();
    const categoryPaths = new Set<string>();

    for (const item of catalogo) {
        const segments = segmentsToSlug(item.key.split('/'));
        productPaths.add(segments.join('/'));
        // todos os prefixos são páginas de categoria
        for (let i = 1; i < segments.length; i++) {
            categoryPaths.add(segments.slice(0, i).join('/'));
        }
    }

    const categoryRoutes: MetadataRoute.Sitemap = [...categoryPaths].sort().map((path) => ({
        url: `${BASE_URL}/catalogo/${path}/`,
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    const productRoutes: MetadataRoute.Sitemap = [...productPaths].sort().map((path) => ({
        url: `${BASE_URL}/catalogo/${path}/`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
