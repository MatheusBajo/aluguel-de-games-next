// src/lib/site.config.ts
import { WHATSAPP_CONFIG } from '@/config/whatsapp.config';

/**
 * Retorna a URL base do site
 * Funciona tanto em produção quanto nos previews do Vercel
 */
export function getSiteUrl(): string {
    // 1. Variável de ambiente customizada (maior prioridade)
    if (process.env.NEXT_PUBLIC_SITE_URL) {
        // Host canônico é www (o .htaccess já faz 301 de não-www → www).
        // Normaliza pra não emitir canonical/sitemap/JSON-LD no host errado.
        return process.env.NEXT_PUBLIC_SITE_URL.replace(
            /^https?:\/\/alugueldegames\.com\.br/,
            'https://www.alugueldegames.com.br'
        ).replace(/\/$/, '');
    }

    // 2. Para produção, usa o domínio final
    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL) {
        return 'https://www.alugueldegames.com.br';
    }

    // 3. Para Vercel (preview e branches)
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    // 4. Fallback
    return 'https://www.alugueldegames.com.br';
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
        whatsapp: WHATSAPP_CONFIG.link,
        instagram: 'https://instagram.com/alugueldegames',
        facebook: 'https://facebook.com/alugueldegames',
    },
} as const;