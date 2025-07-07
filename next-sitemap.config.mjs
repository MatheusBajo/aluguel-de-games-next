// next-sitemap.config.js (na raiz do projeto)
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.alugueldegames.com',
  generateRobotsTxt: false, // Já temos um robots.txt customizado
  generateIndexSitemap: false,
  outDir: 'public',
}