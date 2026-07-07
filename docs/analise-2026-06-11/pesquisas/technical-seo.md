# SEO Técnico para Next.js Static Export em 2026 — Pesquisa

**Contexto:** alugueldegames.com.br — Next.js 15, `output: 'export'`, `images.unoptimized: true`, `trailingSlash: true`, hospedado na Hostinger (LiteSpeed, .htaccess), sitemap via next-sitemap, schemas atuais: WebSite + SearchAction, CollectionPage + ItemList, Product + Offer, EntertainmentBusiness. Catálogo: 543MB em `public/Organizado`, 516 imagens .webp + 11 .jpg, 16 arquivos > 500KB. Não usa `next/image` (tags `<img>` cruas).

---

## 1. Core Web Vitals e ranking em 2026

### Status como fator de ranking
- Google confirma que CWV "se alinha com o que nossos sistemas centrais de ranking buscam recompensar" — é parte dos sinais de page experience, mas **peso modesto**: relevância de conteúdo continua dominante; CWV funciona como **desempate em nichos competitivos** (exatamente o caso de "aluguel de fliperama São Paulo", onde concorrentes têm conteúdo parecido).
- Avaliação: **75º percentil do CrUX por URL** — os 3 thresholds precisam passar:
  - **LCP < 2,5s** (carregamento)
  - **INP < 200ms** (responsividade — substituiu FID em março/2024)
  - **CLS < 0,1** (estabilidade visual)
- Web Almanac 2025: só **48% das páginas mobile** passam nos 3 — passar é vantagem real, não higiene básica.
- Monitoramento: relatório Core Web Vitals do Search Console + CrUX. Site de tráfego médio pode não ter dados CrUX por URL — nesse caso o Google agrupa por "origem" (site inteiro), o que torna QUALQUER página lenta um risco para o site todo.

### INP — principais causas em sites Next.js
- **Third-party scripts são a causa nº 1** de reprovação em CWV em sites Next.js otimizados. Time Chrome Aurora: container GTM com 18 tags aumenta Total Blocking Time **~20x**; mover GTM para web worker (Partytown) reduziu TBT em **92%**.
- Recomendações práticas:
  - Usar `@next/third-parties` (`<GoogleTagManager />`) em vez de script manual no layout — defaults melhores.
  - `strategy="lazyOnload"` para scripts não críticos (chat, pixels secundários) — carrega em idle, não compete com chunks do Next.
  - **Auditar o container GTM**: cada tag adiciona main-thread work; remover tags mortas vale mais que qualquer otimização de código.
  - Reduzir hidratação: tudo que não é interativo deve ser Server Component (App Router já ajuda); cuidado com Framer Motion/GSAP rodando animações pesadas no load — animar só `transform`/`opacity` (compositor), nunca layout.
  - React 19.2 (já usado pelo projeto via React 19) traz melhorias de scheduling que ajudam INP automaticamente.

### LCP — hero image
- Só **2,1% das páginas fazem preload da imagem LCP** (Web Almanac 2025) — oportunidade barata:
  ```html
  <link rel="preload" as="image" imagesrcset="hero-800.webp 800w, hero-1200.webp 1200w" imagesizes="100vw" fetchpriority="high">
  ```
- `fetchpriority="high"` + `loading="eager"` SÓ na imagem LCP (hero da home / 1ª foto do produto). **Nunca** preload de várias imagens — divide banda e atrasa tudo.
- `loading="lazy"` em tudo below-the-fold, **jamais** na imagem LCP (lazy no LCP é o erro clássico que adiciona ~500ms+).
- 57% das imagens LCP da web ainda são JPEG, 26% PNG — o site já usa WebP (516/527), o que é bom; AVIF tem 94,9% de suporte global em 2026 e comprime ~20-30% melhor que WebP.

---

## 2. Imagens sem next/image em static export

### O problema
`output: 'export'` desabilita a Image Optimization API (que otimiza on-demand no servidor). Com `unoptimized: true` + `<img>` cru, o usuário mobile baixa a imagem em tamanho integral — sem srcset, sem variantes.

### Soluções (em ordem de custo/benefício para este projeto)

**A) `next-image-export-optimizer`** (caminho mais maduro)
- Roda como passo pós-build (`next build && next-image-export-optimizer`), usa **sharp**.
- Gera variantes WebP nos device sizes (640/750/828/1080/1200/1920/2048/3840) + image sizes (16–384), componente `<ExportedImage />` substitui `<Image />`, com blur placeholder automático.
- Usa hash para pular imagens já otimizadas (builds incrementais rápidos). Requer Next 13+ (ok, projeto usa 15).
- Caveat: 543MB de catálogo → primeiro build vai demorar; depois é incremental.

**B) Script sharp customizado no build** (mais controle, integra com o sistema de metadata.json)
- Padrão 2026: gerar **no mínimo 3 larguras** — 400w, 800w, 1200w para imagens de conteúdo (+1600/2000w para hero full-bleed) em AVIF + WebP + fallback JPEG via `<picture>`.
- Como o catálogo já é file-based (`public/Organizado` + metadata.json), um script em `scripts/` pode gerar variantes ao lado dos originais e um manifesto JSON com dimensões (evita CLS: sempre emitir `width`/`height`).
- sharp é 4-5x mais rápido que ImageMagick (libvips).

**C) CDN com image resizing on-the-fly**
- Cloudflare na frente da Hostinger: grátis para cache/TLS, mas **Image Resizing/Transformations é recurso pago**. BunnyCDN Optimizer (~US$9,5/mês) é alternativa barata. Para um catálogo estático que muda pouco, otimização em build (A/B) é mais simples e sem custo recorrente.

### Higiene imediata (independente da solução)
- Comprimir os **16 arquivos > 500KB** e converter os 11 .jpg restantes para WebP.
- `width`/`height` (ou `aspect-ratio` CSS) em TODAS as `<img>` → CLS.
- Nomes de arquivo descritivos e alt text em pt-BR ("fliperama-multijogos-aluguel.webp") — pilares do ranking no Google Imagens.

---

## 3. Sitemap de imagens

- Google suporta `<image:image>`/`<image:loc>` dentro do sitemap normal — até **1.000 imagens por `<url>`**; arquivo até 50MB/50k URLs.
- **next-sitemap NÃO gera image sitemap automaticamente** — mas o `transform` aceita campo `images: [{ loc }]`; dá para ler o metadata.json de cada produto e injetar as fotos correspondentes em cada URL de catálogo. Alternativa: script próprio gerando `sitemap-images.xml` + `additionalSitemaps` no robots.
- `<image:loc>` PODE apontar para outro domínio (CDN) — verificar o domínio do CDN no Search Console nesse caso.
- Relevância para o nicho: buscas "aluguel fliperama", "máquina de fliperama para festa" exibem image packs no Google BR — catálogo com fotos próprias bem indexadas em Google Imagens é canal de aquisição real.

### Problema encontrado no next-sitemap.config.js atual
- O `transform` usa `lastmod: new Date().toISOString()` para TODAS as URLs em todo build → **lastmod falso**. Google declarou que ignora lastmod quando detecta imprecisão sistemática, e isso reduz a confiança no sitemap inteiro (afeta priorização de recrawl). Corrigir para usar mtime real do metadata.json/arquivo da página, ou omitir lastmod.
- `priority` e `changefreq` são ignorados pelo Google há anos — inofensivos, mas não gastar esforço neles.

---

## 4. Rich results no Google (políticas vigentes — junho/2026)

### FAQ — MORTO
- **7/maio/2026**: FAQ rich results deixaram de aparecer na busca para TODOS os sites (já estavam restritos a gov/saúde desde ago/2023). Junho/2026: removidos do Search Console e do Rich Results Test; agosto/2026: removidos da API.
- HowTo já estava morto desde 2023. Em jun/2025 o Google aposentou mais 7 tipos (ClaimReview, Course Info, etc.).
- FAQPage markup não prejudica se ficar, mas **não investir nele esperando SERP feature**. O que continua valendo: **FAQ visível em texto** no formato pergunta→resposta direta — é o formato que LLMs/AI Overviews extraem com mais facilidade (citabilidade em AI Overviews no Brasil).

### Review/estrelas — regra do "self-serving" (desde 2019, vigente)
- Reviews sobre a entidade A publicados no site da entidade A = **self-serving** → páginas com `LocalBusiness` ou qualquer subtipo de `Organization` (incl. **EntertainmentBusiness**, usado hoje no site) ficam **inelegíveis para estrelas**, mesmo via widget de terceiros (Google/Facebook reviews embedado).
- Sem penalidade por manter o markup — só não gera estrelas. **Não adicionar `aggregateRating` ao EntertainmentBusiness** — é esforço morto.

### Product — caminho viável para estrelas
- Product snippet exige **UM** de: `review`, `aggregateRating`, `offers`. Página deve focar em **um único produto**. Preço NÃO é obrigatório para Product snippet (offers sem review/aggregateRating gera warning no teste, mas review/aggregateRating sozinhos bastam) — compatível com o modelo "sem preço no site, conversão via WhatsApp".
- A restrição self-serving NÃO se aplica a Product (e-commerce mostra estrelas dos próprios produtos normalmente). Estratégia: coletar avaliações reais por item (pós-evento via WhatsApp) e marcar `aggregateRating`+`review` no Product das páginas de item.
- Caveat honesto: docs do Google não citam aluguel explicitamente; itens tangíveis alugáveis costumam ser aceitos, mas reviews precisam ser REAIS e visíveis na página (markup deve refletir conteúdo visível — política geral de structured data).
- Merchant listing (Shopping) exige price/availability/condition — não se aplica a aluguel sem preço; ignorar.

### LocalBusiness para service-area business (Grande SP)
- Para negócio que atende na casa do cliente: usar `areaServed` (lista de cidades da Grande SP) e/ou `serviceArea` com `GeoCircle` (geoMidpoint + geoRadius); **não publicar endereço falso/residencial** se oculto no Google Business Profile.
- `sameAs` apontando para Google Business Profile, Instagram, etc. fortalece a entidade. Subtipo: EntertainmentBusiness é razoável; a única forma garantida de exibir área de atendimento na SERP local é via **Google Business Profile**, não schema.
- BreadcrumbList: continua 100% suportado — vale adicionar nas páginas de catálogo aninhadas (`/catalogo/categoria/produto/`).

---

## 5. Canonical / trailing slash em static hosting

- URLs com e sem slash final são **páginas distintas** para o Google → divide link equity e gasta crawl budget.
- O projeto já está consistente: `trailingSlash: true` no next.config + next-sitemap. ✔
- **Canonical sozinho NÃO basta** — é dica, não diretiva. Precisa de **301 server-side** no .htaccess (LiteSpeed lê .htaccess nativamente e recarrega sem restart):
  - Cadeia ÚNICA de redirect: `http://` ou `non-www` ou `sem-slash` → `https://www.alugueldegames.com.br/caminho/` em **um único salto** (cadeias de 2-3 redirects desperdiçam crawl budget e atrasam usuários).
  - Static export gera `pagina/index.html`; garantir que `/pagina.html` e `/pagina` (sem slash) redirecionem 301 para `/pagina/`.
- Verificar que TODA página emite `<link rel="canonical">` **absoluto, com www e slash final**, idêntico à URL do sitemap (mismatch canonical×sitemap confunde a canonicalização).
- Cache no .htaccess (LiteSpeed):
  - `/_next/static/*` → `Cache-Control: public, max-age=31536000, immutable` (hash no nome do arquivo).
  - `/Organizado/*` (imagens) → max-age longo (30d+); HTML → max-age curto/`no-cache` com revalidação.

---

## 6. Checklist acionável priorizado (para o site)

1. **[Alto impacto]** Pipeline de imagens em build: adotar `next-image-export-optimizer` OU script sharp em `scripts/` gerando variantes 400/800/1200w (+hero 1600w) com srcset/sizes; emitir width/height sempre.
2. **[Alto impacto]** Hero/LCP: `<link rel="preload" imagesrcset … fetchpriority="high">` na home e `fetchpriority="high"` na 1ª imagem das páginas de produto; lazy em todo o resto.
3. **[Alto impacto]** GTM: migrar para `@next/third-parties` e auditar tags do container (maior alavanca de INP/TBT).
4. **[Médio]** Reviews: coletar avaliações reais por produto e adicionar `aggregateRating`/`review` ao schema **Product** (não ao EntertainmentBusiness — self-serving). Único caminho realista para estrelas na SERP.
5. **[Médio]** LocalBusiness/EntertainmentBusiness: adicionar `areaServed` com cidades da Grande SP + `sameAs` (GBP, redes sociais).
6. **[Médio]** Sitemap: corrigir `lastmod` falso (usar mtime real ou omitir); estender transform para injetar `images:` por URL de produto (image sitemap embutido).
7. **[Médio]** .htaccess: consolidar redirects 301 em salto único (http/non-www/sem-slash) + Cache-Control immutable para `/_next/static` e longo para `/Organizado`.
8. **[Baixo]** Comprimir os 16 arquivos >500KB, converter os 11 jpg para WebP; avaliar AVIF via `<picture>`.
9. **[Baixo]** Não investir em FAQPage markup (morto em mai/2026); manter FAQ visível em texto para AI Overviews. Adicionar BreadcrumbList no catálogo.
10. **[Monitorar]** Search Console → relatório Core Web Vitals (mobile) por grupo de URL; PSI nos 3 templates (home, categoria, produto).

---

## Fontes principais
- https://developers.google.com/search/docs/appearance/core-web-vitals
- https://web.dev/articles/defining-core-web-vitals-thresholds
- https://developers.google.com/search/docs/appearance/structured-data/review-snippet
- https://developers.google.com/search/docs/appearance/structured-data/product-snippet
- https://developers.google.com/search/docs/appearance/structured-data/local-business
- https://developers.google.com/search/blog/2023/08/howto-faq-changes
- https://www.getpassionfruit.com/blog/what-changed-with-google-drops-faq-rich-results-and-what-to-do-now (depreciação FAQ mai/2026)
- https://whitespark.ca/blog/local-businesses-say-goodbye-to-review-snippets-in-google/
- https://www.brightlocal.com/learn/review-schema/
- https://github.com/Niels-IO/next-image-export-optimizer
- https://nextjs.org/docs/app/api-reference/components/image / https://nextjs.org/docs/messages/export-image-api
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
- https://developers.google.com/search/docs/appearance/google-images
- https://web.dev/articles/preload-responsive-images
- https://addyosmani.com/blog/fetch-priority/
- https://developer.chrome.com/blog/next-third-parties
- https://calendar.perfplanet.com/2025/react-19-2-further-advances-inp-optimization/
- https://medium.com/preply-engineering/how-preply-improved-inp-on-a-next-js-application-without-react-server-components-and-app-router-491713149875
- https://makersden.io/blog/optimize-web-vitals-in-nextjs-2025
- https://www.corewebvitals.io/pagespeed/nextjs-fix-third-pary-scripts
- https://requestmetrics.com/web-performance/high-performance-images/
- https://www.zachleat.com/web/trailing-slash/
- https://blog.litespeedtech.com/2017/07/26/wpw-rewrite-rules-in-the-proper-order/
- https://sharp.pixelplumbing.com/
