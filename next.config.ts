// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Export estático (HTML puro servido pela Hostinger)
    output: 'export',
    images: {
        unoptimized: true, // obrigatório com output: 'export'
    },
    trailingSlash: true,
    eslint: {
        ignoreDuringBuilds: true,
    },

    // Comprimir arquivos HTML no build
    compress: true,

    // NOTA: headers() e redirects() NÃO funcionam com output: 'export'.
    // Os headers de segurança/cache e os redirects (www, HTTPS) são feitos
    // via .htaccess servido pela Hostinger (LiteSpeed lê nativamente).
};

export default nextConfig;