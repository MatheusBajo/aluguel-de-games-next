// src/app/robots.ts
//
// FONTE ÚNICA de robots (o antigo public/robots.txt estava corrompido por
// backticks e foi deletado). Libera explicitamente os crawlers de IA
// (GEO — spec §8): cada bot com directive própria. Bloqueia só /studio/.
export const dynamic = "force-static";
export const revalidate = false;

import { MetadataRoute } from 'next';

const BASE_URL = 'https://www.alugueldegames.com.br';

/** Bots de IA liberados (cada um com directive própria — spec §8) */
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
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
