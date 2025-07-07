// src/app/sitemap.ts
export const dynamic = "force-static";
export const revalidate = false;

import { MetadataRoute } from 'next';
import { getCatalog } from '@/lib/catalog.server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://alugueldegames.com';

    // Páginas estáticas
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/catalogo`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/sobre`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/contato`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        },
    ];

    // Páginas dinâmicas do catálogo - usando keys normalizadas
    const catalogo = await getCatalog();
    const catalogPages = catalogo.map((item) => ({
        url: `${baseUrl}/catalogo/${item.key}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [...staticPages, ...catalogPages];
}