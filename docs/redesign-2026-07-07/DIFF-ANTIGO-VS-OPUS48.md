# Diff estrutural — design ANTIGO (`main`) vs design ATUAL (`design-opus-4.8`)

Data: 2026-07-07 · Repo: `/Users/matheusbajo/Projetos/WebstormProjects/aluguel-de-games-next`
Nota de método: os branches **não têm merge base** (`git diff main...design-opus-4.8` falha com "no merge base" — histórico foi resetado). O diff abaixo foi feito por comparação de árvore (`git diff main design-opus-4.8`, `ls-tree`, `show`) + leitura dos arquivos-chave nas duas versões. Escala do diff bruto: **821 arquivos, +55.659 / −21.228 linhas** (inclui `studio/package-lock.json` com ~14,7k linhas e docs de análise).

---

## (a) Rotas / páginas novas

| Rota | main (antigo) | design-opus-4.8 (novo) |
|---|---|---|
| `/` | ✅ home (hero carrossel + 3 seções de catálogo) | ✅ home redesenhada |
| `/catalogo` + `/catalogo/[...slug]` | ✅ | ✅ (agora com páginas de CATEGORIA reais via `CategoryListing` + `catalog-categories.ts`) |
| `/sobre` | ❌ **não existia** (mas o `sitemap.ts` de main já anunciava a URL → 404 indexável) | ✅ `src/app/sobre/page.tsx` (254 linhas, timeline desde 1993) |
| `/contato` | ❌ (idem: anunciada no sitemap, 404) | ✅ `src/app/contato/page.tsx` (form via web3forms + WhatsApp) |
| `/empresas` | ❌ | ✅ `src/app/empresas/page.tsx` (399 linhas, landing B2B: SIPAT/confra/ativação, case Bradesco·Braland em destaque, vídeo Arnold Classic, "NF · Contrato · Grande SP") |
| `/como-funciona` | ❌ (existia só como seção da home) | ✅ página própria (passo a passo + "33+ anos de mercado") |
| `/galeria` | ❌ | ✅ `src/app/galeria/page.tsx` (fotos reais com legenda: Bradesco·Braland, Danilo Gentili, evento Spotify) |
| `not-found` (404) | ❌ default do Next | ✅ `src/app/not-found.tsx` custom (354 linhas, tema arcade, "Since 1993") |

Extras novos fora de rota: `studio/` (Sanity), `docs/analise-2026-06-11/` (auditorias + painel multiagente + consenso), `ANALISE-COMPLETA-2026-06-11.md`, `ADMIN.md`, `CLAUDE.md`, `TEST-404.md`, `public/.htaccess`, `scripts/` iguais nos dois.

Navegação: Header antigo tinha dropdown com âncoras `/catalogo#Fliperamas` (e itens "história/equipe/parceiros" comentados); o novo tem menu real com 8 categorias slugadas (`/catalogo/jogos-eletronicos/fliperamas/`, `/catalogo/videokes/`…), item "Empresas" de primeiro nível e dropdown "Sobre" (História/Como Funciona/Galeria/Contato) + `MobileMenu.tsx` novo.

---

## (b) O que mudou na HOME

**Antigo (`main:src/app/page.tsx`, 188 linhas):**
- `HomeShell` era client-only com `dynamic(..., { ssr: false })` → **hero e Main não existiam no HTML servido** (péssimo pra SEO/LCP; era literalmente uma página quase vazia pro crawler).
- Sem headline H1 de verdade acima do carrossel: a página abria direto no carrossel embla (10 slides, autoplay 3s) com um único botão central "🏅 Nosso Catalogo" (sem acento).
- H1 real era "Nosso Catálogo" no meio da página.
- Único CTA WhatsApp da home ficava no fim do `Main.tsx` (e o float).
- 3 fileiras de catálogo (Fliperamas / Máquinas / Consoles, 6 itens + "ver mais") — estilo Netflix já existia.

**Novo (`src/app/page.tsx`, 253 linhas + `StartCarousel.tsx` reescrito):**
- `HomeShell` virou import server-side normal → **hero renderiza no HTML estático**.
- Hero novo: badge "★ Desde 1993 · Grande SP", H1 animado "Aluguel de games pra sua festa ser inesquecível", sub com "entrega, montagem e suporte na Grande SP", carrossel mantido (mesmos 10 slides, incl. Danilo Gentili e Braland/Bradesco) com corner-brackets arcade.
- **CTA dual logo abaixo do hero: "Pedir orçamento" (WhatsApp verde, número novo via `WHATSAPP_CONFIG`) + "Ver catálogo"** — mobile-first (full-width em telas pequenas).
- Stats animados no hero (`Counter`): **33+ anos · 500+ eventos · 60+ equipamentos**; trust bar "atendemos: Grandes empresas · Personalidades públicas · Festas particulares · Eventos corporativos" (qualitativo, sem logo).
- `Main.tsx` reorganizado: Top 10 mais alugados → Demonstra (vídeos) → seção "Desde 1993" com counter gigante de anos + grid de 4 valores + stats inline (500+ eventos / 60+ equipamentos / **98% satisfação**) + link pra `/sobre`.
- As 3 fileiras Netflix continuam iguais (mesmos `CatalogSection`, `initialLimit 6/3`), agora com header editorial "O que joga na sua festa." e divisores neon.
- Tipografia nova via `next/font` (Bricolage Grotesque / DM Sans / JetBrains Mono) — antes não havia fonte custom carregada no layout.

---

## (c) Prova social — como cada versão trata

**Antigo (main) — fabricação explícita:**
- JSON-LD da home: `aggregateRating { ratingValue: 4.9, reviewCount: 127 }` — **inventado** (`main:src/app/page.tsx:106-110`).
- JSON-LD de TODA página de produto: `ratingValue: "5", reviewCount: "47"` — **inventado e igual pra todos** (`main:src/app/catalogo/[...slug]/page.tsx:174-177`). Risco real de penalização por structured data enganoso.
- `StarRating` com `item.rate` no Top 10 e no modal (estrelas fake vindas do JSON).
- Stats na home: "500+ eventos / 98% satisfação" hardcoded.
- "Desde 1993" já existia, mas enterrado no meio do `Main.tsx`.

**Novo (design-opus-4.8) — melhorou muito, mas NÃO está limpo:**
- ✅ `aggregateRating` **removido** da home e do produto, com comentário explícito no código: "aggregateRating removido propositalmente. Só adicionar quando houver reviews reais" (`src/app/catalogo/[...slug]/page.tsx:237-239`).
- ✅ Estrelas fake (`StarRating`) **não são mais renderizadas** em lugar nenhum (componente ainda existe, órfão).
- ✅ "Desde 1993" promovido a ativo nº1: badge no hero, título/description, JSON-LD `foundingDate: '1993'`, counter 33+, páginas /sobre e /como-funciona.
- ✅ Prova por nome real: Bradesco (Braland), Danilo Gentili, Spotify, Arnold Classic aparecem em carrossel, /empresas e /galeria — honesto e verificável.
- ❌ **`src/lib/sales-utils.ts` AINDA EXISTE E AINDA É USADO**: contador de "locações" gerado por hash FNV-1a do key (100–170, exibido "140+ locações"). Renderizado em `CatalogCard.tsx:96`, `TopToys.tsx:347` e `CarouselModal.tsx:85-86`. **O consenso de junho mandou remover** (`docs/analise-2026-06-11/painel/consenso-final.md:30` e `:139`: "'locações' por hash saem já") — não foi executado.
- ❌ Badge vermelha **"1" bouncing** no WhatsAppFloat (notificação falsa) continua (`src/components/WhatsAppFloat.tsx:78-80`) — também condenada no consenso.
- ❌ "98% satisfação" continua no `Main.tsx:118` (número sem fonte; o consenso apontou até divergência 98%/100% entre lugares).
- ⚠️ "500+ eventos" é palpite não confirmado (pra 33 anos de empresa é provavelmente SUBestimado — vale trocar por "milhares de eventos" com confirmação do dono).

**Resumo da tese:** o antigo fabricava REVIEWS (pior tipo: schema enganoso pro Google); o novo matou as reviews fake mas manteve os CONTADORES fake de locações + badge "1" + 98% — exatamente os 3 itens que a análise de junho mandou tirar.

---

## (d) Infra de SEO / GEO por versão

**Igual nos dois branches:** `src/app/robots.ts` e `src/app/sitemap.ts` (byte a byte idênticos), `public/robots.txt` e `public/sitemap.xml` commitados, GTM via `NEXT_PUBLIC_GTM_ID`, static export (`output: 'export'`), trailingSlash.

**O que o novo corrigiu:**
- Title/description da home e do layout reescritos com keyword + diferencial: "Aluguel de Games SP | Fliperamas, Videokê e VR para Festas **desde 1993**" (antes: genérico, sem 1993).
- JSON-LD da home: `LocalBusiness` genérico → **`EntertainmentBusiness` com `@id`, `foundingDate: 1993`, `areaServed` (6 cidades), `openingHoursSpecification` estruturado, `hasOfferCatalog` com 6 serviços, `paymentAccepted`** — muito mais rico pra AI Overviews/GEO.
- `SchemaMarkup` global: antes duplicava Organization + WebSite + Breadcrumb hardcoded em toda página; agora só WebSite+SearchAction com `@id` linkando o `#organization` da home (grafo limpo, sem duplicação).
- Produto: `Offer` agora tem `businessFunction: LeaseOut` (GoodRelations — semanticamente correto pra LOCAÇÃO, não venda) e seller referenciando o `#organization`.
- Categoria: novo schema `CollectionPage` + `ItemList` com até 20 itens (`[...slug]/page.tsx:182-202`) — não existia.
- Canonical por página em todas as rotas novas (`alternates.canonical`).
- Removido o lixo do antigo: `verification: { google: 'seu-codigo-google-aqui' }` (placeholder INVÁLIDO que ia pro HTML) virou TODO comentado; `nocache: true` removido; `viewport` dentro de metadata (deprecated no Next 15) removido.
- **`public/.htaccess` novo (Hostinger/LiteSpeed)**: 301 http→https, não-www→www (mata conteúdo duplicado), **redirects 301 de slugs curtos de campanha** (`/fliperama`, `/videoke`, `/vr`, `/consoles`…→ categorias) — pensado pra Google Ads, não existia no antigo.
- `next-sitemap.config.js`: antes 8 linhas cruas; agora com `exclude` e `transform` custom (prioridade semântica: home 1.0, catálogo+empresas 0.9, institucionais 0.8, produtos 0.7).
- Hero server-rendered (ver seção b) — o maior ganho de SEO do redesign: antes o crawler via a home quase vazia.
- Telefone/WhatsApp: antigo hardcodava o número VELHO `(11) 4237-7766` em ~15 arquivos (JSON-LD incluso); novo centraliza em `src/config/whatsapp.config.ts` com o número certo **(11) 96526-1000** + mensagens pré-preenchidas por produto.

**Buracos que SOBRARAM no novo (importante pro time):**
1. **3 fontes concorrentes de sitemap**: `src/app/sitemap.ts` (App Router), postbuild `next-sitemap` (escreve em `public/`) e `public/sitemap.xml` commitado (gerado em **18/abr/2026**, stale). Pior: o `sitemap.ts` do App Router monta URLs com `item.key` CRU (acento/espaço: `/catalogo/Jogos Eletrônicos/...`) enquanto o site usa slugs normalizados → se ele vencer no export, o sitemap aponta pra 404. O `public/sitemap.xml` (74 URLs, slugs corretos, inclui /empresas /galeria /como-funciona) é o único correto hoje, mas está com lastmod de abril.
2. `src/app/sitemap.ts` não lista `/empresas`, `/galeria` nem `/como-funciona` (só home/catalogo/sobre/contato + produtos).
3. **`public/robots.txt` começa e termina com um backtick literal** (`` `User-agent... ``) — arquivo corrompido nos DOIS branches; coexiste com `robots.ts`.
4. Zero FAQPage/HowTo schema em qualquer página (como-funciona é o lugar óbvio) e nenhum `llms.txt` — pra meta AI-friendly/AEO ainda não há nada específico.
5. GBP/Google Maps: nenhum link "avalie no Google"/`hasMap` no schema (reviews devem viver no GBP, mas o site não aponta pra lá).

---

## (e) Sanity — o que o `studio/` cobre

- Studio standalone em `studio/` (Sanity v5, projectId `2fhr4hm5`, dataset `production`, deploy previsto em `alugueldegames.sanity.studio`). Schemas:
  - **`produto`**: titulo, slug, categoria (ref), descricao, imagens[] com alt, ordem, **`locacoes` (número real de locações — campo pro dono preencher)**, destaque (bool), rankTop10 (1-10).
  - **`categoria`**: nome, slug, emoji, descricao SEO, tituloSeo (H1), ordem.
  - **`siteConfig`**: singleton de config do site.
  - `structure.ts` com organização do painel.
- **PORÉM: o front NÃO consome o Sanity.** `grep sanity src/` = zero resultados. `next-sanity`, `sanity`, `@sanity/image-url` estão no `package.json` do app mas nunca importados. O catálogo continua 100% file-based (`public/Organizado/**/metadata.json`). O studio é infra pronta-mas-desligada: content model desenhado (inclusive o campo `locacoes` que substituiria o hash fake) sem pipeline de leitura.
- `ADMIN.md` descreve um painel `/admin` com rotas `/api/admin/*` que **não existem em nenhum dos dois branches** (doc órfã de uma iteração anterior; `src/lib/admin.server.ts` existe nos dois).

---

## (f) O que o antigo tinha que o novo PERDEU

Quase nada — o novo é superset. Perdas reais:
- `src/components/sections/top-toys/data/topToysData.json` e `topToysData_full_svg_backup.json` (variantes de dados do Top 10; ficou só `topToysData_full_svg_all.json`). Sem impacto: era duplicação.
- Estrelas de rating no Top 10/modal (perda INTENCIONAL e correta — eram fake).
- `headers()` de segurança no `next.config.ts` (X-Frame-Options etc.) — mas eles **nunca funcionaram** com `output: 'export'`; o novo movou a responsabilidade pro `.htaccess` (que os implementa de verdade). Perda nominal, ganho real.
- Nada de rota, componente visível ou asset foi removido; `public/carousel`, `public/demonstra`, logos e o catálogo inteiro estão nos dois.

---

## Pendências acionáveis (herdadas + novas), em ordem de dano

1. Remover `sales-utils.ts` + os 3 render points de "locações" fake (CatalogCard:96, TopToys:347, CarouselModal:85) — já era veredito do consenso de junho.
2. Tirar badge "1" do WhatsAppFloat e o "98% satisfação"; validar "500+ eventos" com o dono (provável "milhares").
3. Resolver a guerra de sitemaps (matar `public/sitemap.xml` commitado OU o `app/sitemap.ts` quebrado; deixar UMA fonte com slugs corretos e todas as 7 rotas).
4. Consertar `public/robots.txt` (backticks) ou deletá-lo em favor do `robots.ts`.
5. Adicionar FAQPage schema em /como-funciona e /empresas + link GBP; avaliar `llms.txt` pra meta GEO.
6. Decidir o destino do Sanity: ligar o front no studio (o campo `locacoes` real já está modelado) ou tirar as deps do bundle.
7. Trocar `verification.google` TODO pelo código real do Search Console quando o dono verificar o domínio.
