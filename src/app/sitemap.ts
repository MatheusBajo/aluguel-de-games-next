// src/app/sitemap.ts
//
// ÚNICO dono do sitemap (SPEC-FINAL-V2 §8 / brief gate 1.3).
// - public/sitemap.xml (stale de abril) e o postbuild next-sitemap MORRERAM
//   na fase 0 — este arquivo gera tudo no build.
// - Slugs normalizados via slug-utils (NFC → ASCII, zero acento/espaço na
//   URL; o sitemap antigo publicava keys cruas com acento → 404).
// - TODAS as rotas: estáticas + categorias intermediárias + produtos.
// - Aceite: grep -c "<url>" out/sitemap.xml = nº de rotas, zero URL
//   com espaço/acento (scripts/audit.mjs roda no postbuild).
export const dynamic = "force-static";
export const revalidate = false;

import { MetadataRoute } from 'next';
import { getCatalog } from '@/lib/catalog.server';
import { segmentsToSlug } from '@/lib/slug-utils';
import { SITE_URL } from '@/lib/site.config';

type Entry = MetadataRoute.Sitemap[number];

const STATIC_ROUTES: Array<{ path: string; priority: number; changeFrequency: Entry['changeFrequency'] }> = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/catalogo', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/empresas', priority: 0.9, changeFrequency: 'weekly' },
    // LPs de intenção (nascem no estágio 4): quanto-custa = gap nº1 do nicho,
    // festas = LP do público que paga o Ads.
    { path: '/quanto-custa', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/festas', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/como-funciona', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/sobre', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/galeria', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/contato', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/privacidade', priority: 0.3, changeFrequency: 'yearly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();

    const staticPages: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
        url: r.path === '' ? `${SITE_URL}/` : `${SITE_URL}${r.path}/`,
        lastModified: now,
        changeFrequency: r.changeFrequency,
        priority: r.priority,
    }));

    // Rotas do catálogo: todos os prefixos (categorias/subcategorias) +
    // produtos, com slug ASCII idêntico ao generateStaticParams do
    // [...slug]/page.tsx (mesma função slug-utils → zero divergência).
    const catalog = await getCatalog();
    const paths = new Set<string>();

    for (const item of catalog) {
        const segments = segmentsToSlug(item.key.split('/'));
        for (let i = 1; i <= segments.length; i++) {
            paths.add(segments.slice(0, i).join('/'));
        }
    }

    const catalogPages: MetadataRoute.Sitemap = Array.from(paths)
        .sort()
        .map((slugPath) => {
            const depth = slugPath.split('/').length;
            return {
                url: `${SITE_URL}/catalogo/${slugPath}/`,
                lastModified: now,
                // Categorias (nível 1) = LPs primárias de Ads → prioridade maior
                changeFrequency: 'weekly' as const,
                priority: depth === 1 ? 0.8 : 0.7,
            };
        });

    return [...staticPages, ...catalogPages];
}
