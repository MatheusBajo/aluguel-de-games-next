// src/lib/site.config.ts

/**
 * Retorna a URL base do site
 * Funciona tanto em produção quanto nos previews do Vercel
 */
export function getSiteUrl(): string {
    // 1. Variável de ambiente customizada (maior prioridade)
    if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL;
    }

    // 2. URL do Vercel (para previews)
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    // 3. URL de produção (fallback)
    return 'https://alugueldegames.com';
}

/**
 * Configurações do site
 */
export const siteConfig = {
    name: 'Aluguel de Games',
    description: 'Aluguel de equipamentos de entretenimento para festas e eventos',
    url: getSiteUrl(),
    ogImage: '/Logo-Aluguel-de-games.png',
    links: {
        whatsapp: 'https://wa.me/+551142377766',
        instagram: 'https://instagram.com/alugueldegames',
        facebook: 'https://facebook.com/alugueldegames',
    },
} as const;