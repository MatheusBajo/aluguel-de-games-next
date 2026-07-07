// src/lib/site.config.ts
import { WHATSAPP_CONFIG } from '@/config/whatsapp.config';

/**
 * Host canônico do site. O .htaccess da Hostinger faz 301 de tudo pra www —
 * canonical/sitemap/robots/schema DEVEM usar este host (host www unificado,
 * brief §1.3).
 */
export const SITE_URL = 'https://www.alugueldegames.com.br';

/**
 * Retorna a URL base do site
 * Funciona tanto em produção quanto nos previews do Vercel
 */
export function getSiteUrl(): string {
    // 1. Variável de ambiente customizada (maior prioridade).
    //    Normaliza o domínio de produção pro host canônico www — o env local
    //    aponta pra alugueldegames.com.br sem www, o que geraria canonical
    //    divergente do 301 do .htaccess.
    if (process.env.NEXT_PUBLIC_SITE_URL) {
        const url = process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
        if (/^https?:\/\/(www\.)?alugueldegames\.com\.br$/.test(url)) {
            return SITE_URL;
        }
        return url;
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