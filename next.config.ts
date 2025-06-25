// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Para deploy estático (GitHub Pages)
    output: 'export',
    images: {
        unoptimized: true,
    },
    // Se for hospedar no GitHub Pages
    // basePath: '/aluguel-de-games-proj',
};

export default nextConfig;