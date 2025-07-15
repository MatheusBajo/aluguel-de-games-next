// next-sitemap.config.js (na raiz do projeto)
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.alugueldegames.com.br',
  generateRobotsTxt: false, // Já temos um robots.txt customizado
  generateIndexSitemap: false,
  outDir: 'public',
}