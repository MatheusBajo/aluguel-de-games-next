# Auditoria — Infraestrutura de SEO (Aluguel de Games)

Data: 2026-06-11 · Verificado contra dev server (http://localhost:3000) via curl + leitura de código.
Arquivos-chave: `src/app/layout.tsx`, `src/lib/generateMetaTags.ts`, `src/components/seo/SchemaMarkup.tsx`, `src/components/seo/OGImagePreload.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/manifest.ts`, `next-sitemap.config.js`, `src/lib/site.config.ts`, `src/app/catalogo/[...slug]/page.tsx`, `public/.htaccess`, `public/robots.txt`, `public/sitemap.xml`, `public/manifest.webmanifest`.

---

## 1. CONFIRMADO: /sitemap.xml, /robots.txt e /manifest.webmanifest retornam **500** no dev (conflito public/ × app routes) — ALTO

Evidência via curl no dev server:
- `GET /sitemap.xml` → **500** · `GET /robots.txt` → **500** · `GET /manifest.webmanifest` → **500**
- Stack do erro (no `__NEXT_DATA__` da página de erro): `"A conflicting public file and page file was found for path /robots.txt"` (`router-server.js:348`).

Causa raiz — existem DUAS fontes para cada artefato:
| Artefato | Fonte 1 (App Router) | Fonte 2 (estático) |
|---|---|---|
| sitemap.xml | `src/app/sitemap.ts` | `public/sitemap.xml` (gerado pelo next-sitemap, `outDir: 'public'` em `next-sitemap.config.js:7`) |
| robots.txt | `src/app/robots.ts` | `public/robots.txt` (commitado, 16/jul/2025) |
| manifest | `src/app/manifest.ts` | `public/manifest.webmanifest` (commitado, set/2025) |

O Next se recusa a servir rota quando há arquivo público homônimo → 500 nos três endpoints em dev.

**Agravante de pipeline (produção):** `package.json` → `build: next build` (export estático para `out/`) e `postbuild: next-sitemap` que grava em `public/`. Ou seja: o sitemap gerado no postbuild **nunca entra no `out/` do mesmo build** — o deploy leva o sitemap copiado de `public/` no início do build, isto é, **o sitemap do build anterior**. Evidência: `public/sitemap.xml` tem `lastmod 2026-04-18` (estagnado há ~2 meses).

**Correção sugerida:** escolher UMA fonte. Ou (a) apagar `src/app/sitemap.ts|robots.ts|manifest.ts` e manter next-sitemap com `outDir: 'out'` rodando após o export; ou (b) apagar `public/sitemap.xml|robots.txt|manifest.webmanifest` + remover next-sitemap e consertar `sitemap.ts` (ver §3).

## 2. CONFIRMADO: canonical/og:url com **host dividido (www × não-www)** — ALTO

- `.env.local`: `NEXT_PUBLIC_SITE_URL=https://alugueldegames.com.br` (SEM www).
- `src/lib/site.config.ts:8-12`: `getSiteUrl()` prioriza a env → retorna **não-www**.
- Mas: `src/app/layout.tsx:34` (`metadataBase`), `src/app/page.tsx:13,65`, `src/app/{empresas,sobre,contato,como-funciona,galeria,catalogo}/page.tsx` (canonicals hardcoded), `src/app/sitemap.ts:9`, `src/app/robots.ts:24-25`, `next-sitemap.config.js:4`, `SchemaMarkup.tsx:12-23` → todos **com www**.
- Páginas de produto/categoria usam `getSiteUrl()` (`catalogo/[...slug]/page.tsx:52,96`) → **não-www**.

HTML renderizado (curl):
- `/` → `canonical: https://www.alugueldegames.com.br/` ✔ www
- `/catalogo/` → `https://www.alugueldegames.com.br/catalogo/` ✔ www
- `/empresas/` → `https://www.alugueldegames.com.br/empresas/` ✔ www
- **`/catalogo/jogos-de-mesa/pebolim/` → `canonical: https://alugueldegames.com.br/catalogo/jogos-de-mesa/pebolim`** ✘ sem www E sem trailing slash
- **`/catalogo/jogos-de-mesa/` → `https://alugueldegames.com.br/catalogo/jogos-de-mesa/`** ✘ sem www

`public/.htaccess:21-22` força **www** com 301. Resultado em produção: TODAS as páginas de produto/categoria (o grosso do site) declaram canonical/og:url apontando para host que redireciona 301 — e o canonical de produto ainda perde o trailing slash (`page.tsx:96-98` não adiciona `/`; `trailingSlash: true` no `next.config.ts:10`), gerando **cadeia de 2 redirects** (não-www→www, sem-barra→com-barra). Sinal canônico conflita com o sitemap (www). Google geralmente resolve, mas é exatamente o tipo de inconsistência que dilui consolidação de sinais e atrasa indexação.

**Correção:** definir `NEXT_PUBLIC_SITE_URL=https://www.alugueldegames.com.br` no `.env.local`/produção E trocar todos os hardcodes por `getSiteUrl()` (fonte única). Adicionar trailing slash no canonical de produto.

## 3. CONFIRMADO: `src/app/sitemap.ts` gera URLs **inválidas** (keys cruas) e está incompleto — MÉDIO (latente)

- `sitemap.ts:42`: `url: ${baseUrl}/catalogo/${item.key}` — mas `item.key` em `catalog.server.ts:48` é o caminho CRU de pastas (`"Jogos de Mesa/Pebolim"`, com espaços/acentos/maiúsculas). O comentário "usando keys normalizadas" (linha 39) é falso — `generateStaticParams` precisa chamar `segmentsToSlug()` justamente porque a key NÃO é slug (`catalogo/[...slug]/page.tsx:34`).
- Resultado: se esse sitemap algum dia for servido, conteria `https://www.alugueldegames.com.br/catalogo/Jogos Eletrônicos/Fliperamas/...` → 404 (rotas reais são slugificadas e `dynamicParams = false`).
- Faltam `/empresas`, `/como-funciona`, `/galeria` (presentes no next-sitemap via transform, `next-sitemap.config.js:31-43`).
- `lastModified: new Date()` em tudo — lastmod = hora do build para 100% das URLs tira a confiança do Google no campo. Melhor: mtime do `metadata.json` de cada produto.
- Hoje esse arquivo nunca é servido (500 em dev, perde para o public/ em prod) — é peso morto perigoso.

## 4. CONFIRMADO: JSON-LD de **Product/CollectionPage não sai no HTML do servidor** — ALTO

- `catalogo/[...slug]/page.tsx:3` importa `Script` de `next/script` e injeta os schemas `ld-product` (linha 266-272) e `ld-collection` (linha 206-210) com estratégia padrão **afterInteractive** → o script só é inserido no DOM **após hidratação via JS**.
- Evidência: no HTML do curl de `/catalogo/jogos-de-mesa/pebolim/`, `grep '"@type":"Product"'` → **0 ocorrências**; o JSON só existe escapado dentro do payload RSC (`@type\":\"Product`). Mesmo para CollectionPage na categoria.
- Já o `SchemaMarkup.tsx` (WebSite) e o JSON-LD da home (`page.tsx:168-171`) usam `<script>` nativo e **aparecem** no HTML — prova de que a correção é trivial: trocar `<Script>` por `<script type="application/ld+json">` nas páginas de catálogo.
- Impacto: crawlers sem execução de JS (Bing em parte, ferramentas de validação, crawlers de IA, scrapers do WhatsApp) não veem o schema de Produto; Google só vê na segunda onda de renderização. Rich results de produto ficam não confiáveis em ~100+ páginas que são o coração SEO do site.

## 5. CONFIRMADO: `public/robots.txt` corrompido — **backticks literais** no início e fim — MÉDIO

- `xxd` mostra: byte 0 = `` 0x60 ` `` → primeira linha é `` `User-agent: * `` (inválida) e último byte também `` ` `` (`Crawl-delay: 0` ``). Alguém colou um template literal JS no arquivo. CRLF no arquivo todo.
- Efeito prático: parsers ignoram a 1ª linha inválida → as regras `Allow:/Disallow:` seguintes ficam **órfãs de User-agent** e são descartadas até o grupo `User-agent: Googlebot`. Ou seja, o grupo `*` (Disallow /api/, /_next/ etc.) é ignorado por todos os bots. Nada crítico é bloqueado por acidente (sorte), e a linha `Sitemap:` segue válida — mas é o robots.txt PUBLICADO do site com lixo de sintaxe.
- Nota: o `src/app/robots.ts:13-15` (nunca servido hoje) tem `disallow: '/_next/'` no grupo `*` SEM allow para `/_next/static` — se um dia virar a fonte, bloquearia CSS/JS para bots não-Google (Bing renderiza). O public/robots.txt atual faz certo (`Allow: /_next/static`).

## 6. og:image — defaults ruins no canal que converte (WhatsApp) — MÉDIO

- Home: `og:image = /Logo-Aluguel-de-games.png` (logo **quadrado 1000×1000**, 290 KB) declarado como `1200×630` (mentira nas dimensões; rendered HTML confirma width/height 1200/630). Preview no WhatsApp/FB sai cortado/feio — e o WhatsApp é O canal de conversão do negócio.
- `/catalogo/` (página mais linkável depois da home): **sem og:image nenhum** no HTML renderizado.
- Produto: og:image = foto `.webp` mas `og:image:type` hardcoded `image/jpeg` (`catalogo/[...slug]/page.tsx:129,145`); dimensões 1200×630 declaradas para fotos que não têm essa proporção. WhatsApp historicamente é instável com webp em previews.
- Categoria: og:image = logo (com dims falsas) — `page.tsx:72-77`.
- `generateMetaTags.ts:20` default `https://www.alugueldegames.com.br/og-image.jpg` → **404 confirmado** (não existe em public/).

## 7. Código morto de SEO — BAIXO

- `src/lib/generateMetaTags.ts` e `src/components/seo/OGImagePreload.tsx`: **zero imports no projeto** (grep). Ambos com defeitos internos (og-image.jpg 404; OGImagePreload com `og:image:type image/jpeg` hardcoded e meta `twitter:card` duplicável). Ou usa-se e conserta, ou apaga (recomendo apagar OGImagePreload — meta tags fora do `<head>` via componente em body não é padrão App Router).

## 8. Títulos e descriptions — marca duplicada e truncamento sujo — MÉDIO

- Template do layout (`layout.tsx:36`): `%s | Aluguel de Games SP`. Páginas que já incluem marca geram duplicação:
  - Produto: `Pebolim - Aluguel de Games | Aluguel de Games SP` (marca 2×; `[...slug]/page.tsx:113` concatena `- Aluguel de Games`).
  - Categoria: `Aluguel de Jogos de Mesa em SP | Aluguel de Games | Aluguel de Games SP` (**marca 3×**, ~70+ chars, trunca na SERP).
- Description de produto (`page.tsx:106-110`): remove `*_#` mas mantém `•` e corta em 155 chars **no meio da palavra** — renderizado: "...Torneio de duplas garantido em qualquer con". Em todas as páginas de produto.

## 9. Manifest PWA — duplicado e mal configurado — BAIXO

- Duas fontes (ver §1). Conteúdos divergem (`manifest.ts` tem 3 ícones com PNG 1000×1000 duplicado, linhas 22-31; o public/ declara o mesmo PNG como "512x512" — falso).
- `background_color: #ffffff` / `theme_color: #000000` num site dark (tema escuro forçado) → splash screen branca. Sem ícones 192×192/512×512 reais nem `purpose: maskable` → não instala como PWA decente. `<link rel="manifest">` é emitido no HTML (confirmado) mas o endpoint 500a em dev.

## 10. SearchAction aponta para busca que não existe — BAIXO

- `SchemaMarkup.tsx:19-26`: `urlTemplate: .../catalogo?search={search_term_string}` — nenhum componente lê `searchParams`/`useSearchParams` em `/catalogo` (grep vazio). Markup de Sitelinks Searchbox "fake" (e o recurso foi aposentado pelo Google em 2024). Remover ou implementar a busca.

## 11. O que está BOM (registrar para não "consertar" o que funciona)

- `lang="pt-br"` no `<html>` ✔; charset/viewport ok (1 viewport só, confirmado).
- JSON-LD `EntertainmentBusiness` na home (`page.tsx:84-145`) é acima da média: `@id #organization`, foundingDate 1993, telephone, PostalAddress, **GeoCoordinates** (mas -23.5505/-46.6333 = coordenada genérica do centro de SP, não o endereço real), **OpeningHoursSpecification** (seg-sex 9-18, sáb 9-14), priceRange, paymentAccepted, areaServed (6 cidades), sameAs, hasOfferCatalog com 6 serviços. Renderizado server-side ✔.
- `WebSite` global com publisher @id ✔ (mas só home tem o Organization — o @id referenciado existe apenas lá; aceitável).
- Decisão consciente de NÃO inventar aggregateRating (comentário em `[...slug]/page.tsx:237-239`) — correto.
- GTM via env (`GTM-WN24XLQC`) com `<noscript>` iframe ✔ (`layout.tsx:62-82`); afterInteractive é o padrão recomendado. Risco menor: env ausente injeta literal `undefined` no snippet.
- next-sitemap com transform de prioridades semânticas e trailing slash consistente ✔ (é a melhor das duas fontes de sitemap).
- robots meta `index, follow` + googleBot max-image-preview:large nas páginas ✔.
- `.htaccess` com 301 https+www e redirects de URLs antigas/campanhas ✔.

## 12. Oportunidades (prioridade de impacto)

1. **Unificar host + fonte de URL** (corrige §2): env com www + `getSiteUrl()` em todo lugar. 1h de trabalho, remove inconsistência sítio-inteiro.
2. **Matar a duplicação sitemap/robots/manifest** (§1) e consertar pipeline para o sitemap do build atual entrar no `out/`.
3. **JSON-LD de produto em `<script>` nativo** (§4) + adicionar **BreadcrumbList** (breadcrumb visual já existe em `[...slug]/page.tsx:276-298`, é só espelhar em schema — rich result de breadcrumb na SERP).
4. **FAQPage**: não existe NENHUM FAQ no site (grep vazio em como-funciona/empresas/home). Criar seção de perguntas frequentes (entrega? montagem? área atendida? prazo? energia necessária?) em /como-funciona e nas páginas de produto com schema FAQPage — alto impacto para long-tail "quanto custa alugar fliperama" etc.
5. **AggregateRating real**: negócio desde 1993 certamente tem reviews no Google Business Profile. Exibir avaliações reais no site e marcar com Review/AggregateRating no EntertainmentBusiness.
6. **OG images dedicadas 1200×630** (home, /catalogo, /empresas; idealmente por produto, geráveis no build com sharp/satori) — impacto direto em compartilhamento no WhatsApp = canal de conversão.
7. **GeoCoordinates/endereço reais** no schema (hoje é o marco zero de SP) + expandir areaServed; preencher `verification.google` (TODOs em `page.tsx:78-79` e `generateMetaTags.ts:78-79`).
8. **Service schema em /empresas** (eventos corporativos/SIPAT) — página B2B sem nenhum schema próprio.
9. lastmod real por mtime do `metadata.json`; títulos sem marca triplicada; description de produto cortada em fronteira de palavra e sem bullets.
