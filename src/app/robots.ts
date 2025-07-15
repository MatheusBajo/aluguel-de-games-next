// src/app/robots.ts
export const dynamic    = "force-static";
export const revalidate = false;
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/admin/',
                    '/_next/',
                    '/static/',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
            },
        ],
        sitemap: 'https://www.alugueldegames.com.br/sitemap.xml',
        host: 'https://www.alugueldegames.com.br',
    };
}