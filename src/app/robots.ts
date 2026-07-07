// src/app/robots.ts
//
// ÚNICA fonte de robots do site (public/robots.txt corrompido foi deletado
// na fase 0). Libera explicitamente os crawlers de IA — cada bot com
// directive própria (SPEC-FINAL-V2 §8 / brief gate 1.4: bot bloqueado ≈
// −18-34% de citações naquele motor). Bloqueia só /studio/ (Sanity Studio,
// desligado no app).
export const dynamic = "force-static";
export const revalidate = false;
import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site.config';

const AI_BOTS = [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-SearchBot',
    'Claude-User',
    'PerplexityBot',
    'Perplexity-User',
    'Google-Extended',
    'Meta-ExternalAgent',
];

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/studio/'],
            },
            ...AI_BOTS.map((bot) => ({
                userAgent: bot,
                allow: '/',
                disallow: ['/studio/'],
            })),
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
