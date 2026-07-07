// next-sitemap.config.js (na raiz do projeto)
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.alugueldegames.com.br',
  generateRobotsTxt: false, // Já temos um robots.txt customizado
  generateIndexSitemap: false,
  outDir: 'public',
  trailingSlash: true,

  // Excluir arquivos que não são páginas indexáveis (robots.txt, sitemap, manifest, 404, etc.)
  exclude: [
    '/robots.txt',
    '/sitemap.xml',
    '/manifest.webmanifest',
    '/404',
    '/favicon.ico',
    '/api/*',
    '/_next/*',
  ],

  // Transformação customizada por URL — define prioridade e changefreq semânticos
  transform: async (config, path) => {
    const now = new Date().toISOString();

    // Home — prioridade máxima
    if (path === '/' || path === '') {
      return { loc: path, changefreq: 'weekly', priority: 1.0, lastmod: now };
    }

    // Catálogo principal e página de empresas (B2B) — alta prioridade
    if (path === '/catalogo' || path === '/catalogo/' || path === '/empresas' || path === '/empresas/') {
      return { loc: path, changefreq: 'weekly', priority: 0.9, lastmod: now };
    }

    // Páginas institucionais importantes — prioridade média-alta
    if (
      path === '/sobre' || path === '/sobre/' ||
      path === '/como-funciona' || path === '/como-funciona/' ||
      path === '/contato' || path === '/contato/' ||
      path === '/galeria' || path === '/galeria/'
    ) {
      return { loc: path, changefreq: 'monthly', priority: 0.8, lastmod: now };
    }

    // Páginas de produto/categoria (catalogo/...)
    if (path.startsWith('/catalogo/')) {
      return { loc: path, changefreq: 'monthly', priority: 0.7, lastmod: now };
    }

    // Demais páginas
    return { loc: path, changefreq: 'monthly', priority: 0.5, lastmod: now };
  },
}
