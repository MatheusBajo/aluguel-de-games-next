// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Para deploy estático (GitHub Pages)
    // output: 'export',
    images: {
        unoptimized: true,
    },
    // Se for hospedar no GitHub Pages
    // basePath: '/aluguel-de-games-proj',
    // trailingSlash: true,
    eslint: {
        ignoreDuringBuilds: true,
    },

    // Comprimir arquivos HTML
    compress: true,

    output: 'export',

    // Headers de segurança e performance
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN'
                    },
                ],
            },
        ];
    },

};

export default nextConfig;