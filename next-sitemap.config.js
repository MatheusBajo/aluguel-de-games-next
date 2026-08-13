// next-sitemap.config.js (na raiz do projeto)
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.alugueldegames.com.br',
  generateRobotsTxt: false, // fonte única do robots.txt é src/app/robots.ts
  generateIndexSitemap: false,
  // ⚠️ TEM que ser 'out', não 'public'. Este script roda no `postbuild`, ou seja
  // DEPOIS do `next build` já ter copiado public/ para dentro de out/. Escrevendo
  // em public/, o sitemap fresco só chegava em out/ no build SEGUINTE — o site
  // publicava eternamente o sitemap de uma versão atrás. Foi essa a causa das
  // 55 de 56 URLs mortas no sitemap em produção. Não reverter.
  outDir: 'out',
  trailingSlash: true,

  // Rotas que existem como arquivo em out/ mas NÃO são página indexável.
  // ⚠️ com trailingSlash:true o next-sitemap enxerga '/robots.txt/' e
  // '/sitemap.xml/', com barra no fim. Sem as duas formas, as três entravam no
  // sitemap como URL fantasma (o sitemap listava a si mesmo e ao robots).
  exclude: [
    '/robots.txt', '/robots.txt/',
    '/sitemap.xml', '/sitemap.xml/',
    '/manifest.webmanifest', '/manifest.webmanifest/',
    '/404', '/404/',
    '/favicon.ico',
    '/_next/*',
  ],
}