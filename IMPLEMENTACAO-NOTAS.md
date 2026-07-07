# Notas de implementação — redesign V1 (branch redesign-v1-fable)

Registro de decisões e ambiguidades resolvidas por estágio. Spec: `docs/redesign-2026-07-07/SPEC-FINAL-V1.md`.

---

## Estágio 1 — Fundação técnica (FASE 0) · 2026-07-07

### O que foi feito

**(a) Des-fabricação total**
- Deletados: `src/lib/sales-utils.ts`, `src/components/util/StarRating.tsx` (órfão; a spec citava `ui/StarRating.tsx`, o caminho real era `util/`), `src/components/StartCarouselClaude.tsx` (hero legado NÃO usado, continha "500+/98%"), `ADMIN.md`.
- Contador fake de "locações" removido dos 3 render points: `CatalogCard` (virou "Entrega e montagem incluídas" — fato real; spec real por produto entra na fase 4), `TopToys`, `CarouselModal`.
- Badge "1" bouncing removida do `WhatsAppFloat` (agora é anchor real com prefill + tracking; sem notificação falsa).
- "98% satisfação" / "500+ eventos" / "100% satisfação" removidos de `Main.tsx`, `ProductInfo.tsx`, `StartCarousel.tsx`, `sobre/page.tsx`, `galeria/page.tsx`. Substituto: único counter permitido (anos desde 1993, computado) + prova com nomes reais (Bradesco · Spotify · Arnold Classic · Danilo Gentili).
- "60+ equipamentos" (hardcoded) removido; "mais de 60 atrações" em /sobre virou "dezenas de atrações" (catálogo real tem 54 itens — claim era falso).
- Badge "Disponível" com `badge-live` (pulso = liveness fake) removida do CarouselModal; "Live" na galeria virou "★ Eventos reais".
- SLA sem assinatura ("proposta em até 1 dia útil" em /empresas) → "resposta em horário comercial" (regra da spec).
- "Entrega Grátis" (badge do catálogo) → "Entrega e montagem incluídas" (linguagem da spec, claim que o dono já pratica).
- Horários específicos de atendimento (contato: "08:30—18:00 / sáb 08:00—12:30", inconsistentes com o JSON-LD antigo "09:00-18:00" — prova de que pelo menos um era inventado) removidos → "horário comercial" + linha fora-do-horário. Horário real = `[CONFIRMAR COM DONO]` em `ATTENDANCE_HOURS` (`whatsapp.config.ts`).
- `audit:fake` adicionado ao package.json (grep `sales-utils|98%|reviewCount|ratingValue|locações` em src, excluindo .css por falso positivo de cor `0 0% 98%`). Passa.

**(b) `<WhatsAppCta>` único** (`src/components/cta/WhatsAppCta.tsx`)
- Anchor REAL pra wa.me (href existe no HTML cru do build — verificado por grep no out/).
- Prefill por surface (`home|category|product|empresas|kit|orcamento|festas|global`) em `whatsapp.config.ts` (`buildWhatsAppUrl`), com lacunas Data/Bairro/Convidados (copy §9.2/§9.4 da spec). `message` prop = override (carrinho multi-linha na fase 1).
- GA4 via dataLayer: `whatsapp_click{surface, product}` + `tel_click{surface}` (taxonomia §8; `gtm-utils.ts` atualizado).
- Variants: `primary|outline|compact|icon|inline|unstyled` (unstyled = cards clicáveis, ex.: /contato).
- `withMeta`/`<WhatsAppCtaMeta>`: "ou ligue (11) 96526-1000" (tel: rastreado) + linha fora-do-horário com os DOIS estados desenhados: sem horário confirmado renderiza "Fora do horário comercial? Manda mesmo assim…" (nunca placeholder cru no HTML público); com `ATTENDANCE_HOURS.confirmed=true` renderiza "Atendemos das Xh às Yh…".
- MIGRADOS todos os CTAs: Header (desktop+mobile), MobileMenu, StartCarousel (hero), Main (CTA final), Footer (strip + ícone social), WhatsAppFloat, CarouselModal, ProductInfo, CatalogoList, CategoryListing, Demonstra, ComoFunciona, páginas como-funciona/contato/empresas/sobre/galeria/not-found. Zero link wa.me fora do componente (exceto `sameAs` de schema e llms.txt, que são dados).
- Surfaces usadas: home (páginas B2C genéricas), category (CategoryListing, nomeia a categoria), product (produto + modal Top 10, nomeia o produto), empresas (/empresas), global (header/menu/float/404).

**(c) robots** — `public/robots.txt` corrompido (backticks) DELETADO; `src/app/robots.ts` único: `*` + os 10 bots de IA da spec com directive própria (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Meta-ExternalAgent), `Disallow: /studio/` só, Sitemap absoluto. Verificado no out/.

**(d) Sitemap único** — `src/app/sitemap.ts` reescrito com `slug-utils` (mesmas URLs do `generateStaticParams`, NFC/sem acento — aceite: 76 URLs no out/sitemap.xml, zero espaço/acento, bate com as rotas exportadas). Mortos: `public/sitemap.xml` (stale), `next-sitemap.config.js`, script `postbuild` e devDep `next-sitemap`. Rotas novas (/festas, /quanto-custa) entram no sitemap quando as páginas nascerem (fase 5) — sitemap só anuncia rota que existe.

**(e) JSON-LD server-side** — `src/components/seo/JsonLd.tsx` (script inline server, substitui `next/script` client em `catalogo/[...slug]/page.tsx`) + helpers em `src/lib/schema.ts`:
- `localBusinessSchema()` (EntertainmentBusiness `@id`, foundingDate 1993, areaServed Osasco+Grande SP, telefone) + `websiteSchema()` (SEM SearchAction — busca é proibida pelo brief §2) no LAYOUT (todas as páginas). O schema duplicado da home foi removido.
- `productSchema` (Offer LeaseOut, sem aggregateRating), `collectionPageSchema`, `breadcrumbSchema`, `faqPageSchema` prontos pros próximos estágios. BreadcrumbList já emitido em categoria e produto.
- Slots sem dado confirmado NÃO renderizam (regra §1.3): `hasMap`/`sameAs` GBP (`GBP_URL=null`), endereço com rua (`STREET_ADDRESS=null`), `openingHoursSpecification` (`OPENING_HOURS=null`), `taxID` (`CNPJ=null`) — todos com `[CONFIRMAR COM DONO]` no código. O JSON-LD antigo tinha horários e geo de São Paulo-centro inventados: removidos.
- Breadcrumb visual do produto consertado: categoria linka `/catalogo/{slug}/` real (antes: âncora morta `#Categoria`).

**(f) llms.txt** — `src/app/llms.txt/route.ts` (force-static, gerado no build): frase citável, índice de páginas, categorias com CONTAGEM REAL de itens do metadata, contato. Expectativa zero declarada.

**(g) Footer + LGPD** — Footer com: NAP (Osasco · SP + Grande SP; endereço de rua aguarda dono), tel/e-mail, linha fora-do-horário, CNPJ com placeholder visível `[CONFIRMAR COM DONO: CNPJ]` (os dois estados desenhados via `CNPJ` em schema.ts), link "Privacidade (LGPD)", 7 links de categoria + páginas, bloco "Avalie no Google" pronto (só renderiza com `GBP_URL`). Página `/privacidade` criada (LGPD honesta: GTM/GA4, Web3Forms, WhatsApp; direitos; sem juridiquês inventado).

### Decisões / ambiguidades resolvidas
1. **Placeholder público vs fallback**: o placeholder `[CONFIRMAR COM DONO]` só aparece onde o dono PRECISA ver (CNPJ no footer/privacidade, comentários de código). Dados de negócio (horário, GBP, endereço-rua) usam a regra §1.3: slot não renderiza até confirmar. Trocar é 1 linha em `schema.ts`/`whatsapp.config.ts`.
2. **`.env.local` tinha `NEXT_PUBLIC_SITE_URL` sem www** (host canônico é www): não pude editar o arquivo (bloqueado pelo ambiente); `getSiteUrl()` agora normaliza não-www→www. Recomendo corrigir o .env.local na mão.
3. **Deps Sanity removidas** do package.json (spec: morre na fase 0); `studio/` fica no repo mas foi excluído do tsconfig (senão o typecheck quebra sem as deps). Religar = decisão pós-launch.
4. **colorthief**: typecheck quebrou após o npm install (tipagem aponta pro build node, não-construtível) — cast explícito em `DynamicGradient.tsx` e `CarouselOverlayGradient.tsx`. Pré-existente, não relacionado à des-fabricação.
5. **WhatsAppFloat mantido em mobile** por enquanto: a StickyBar global é da fase 1; sem ela, remover o float deixaria mobile sem CTA persistente. Quando a StickyBar entrar, o float vira desktop-only (spec §3).
6. **"Fliperama de 11.000" / "até 11.000 jogos" / "30.000 músicas"**: nomes de produto vêm do metadata do dono (dado dele, não inventado). A COPY de categoria que repete o número (catalog-categories.ts) precisa de gate `[CONFIRMAR COM DONO]` quando a fase 3 reescrever as categoria-LPs.
7. **"centenas de festas"** (galeria) mantido como claim qualitativo honesto (lower bound óbvio de 33 anos); "milhares de eventos" só com confirmação do dono (trust strip da fase 2).
8. **Tel links soltos** (contato card, MobileMenu) têm `tel:` + tracking onde há client boundary; o card de ligação de /contato ficou sem evento GA4 (página server) — cobrir via trigger de tel: no GTM se quiser 100%.

### Pendências pro próximo estágio
- Fase 1: QuoteCart + StickyBar global (aí WhatsAppFloat sai do mobile) + tokens/pipeline LQIP.
- DONO-CHECKLIST.md (spec §1.8) ainda não criado — criar quando as perguntas das fases 2-5 estiverem consolidadas (CNPJ, horário, GBP, endereço, garantia já estão marcadas no código).
- OG image 1200×630 real por template = fase 6.

---

## Estágio 2 — Home (8 dobras) + navegação · 2026-07-08

### O que foi feito
Home reconstruída do zero (`src/app/page.tsx`) na ordem fixa da spec §3 (o que tem →
quanto custa → como orçar → como funciona → prova → FAQ → CTA). Server component:
todo conteúdo no HTML cru; só QuoteWidget e StickyBar são ilhas client.

- **D1 Hero estático** (`src/components/home/HomeHero.tsx`): foto real como LCP via `<img>`
  ELEMENT (nunca CSS bg), `fetchPriority="high"` (o export serializa `fetchPriority` camelCase —
  atributo HTML é case-insensitive, o browser honra como `fetchpriority`), `width/height`
  fixos (sem CLS), scrim duplo pra legibilidade. **SEM carrossel** (o StartCarousel morreu).
  Badge "★ Desde 1993 · Osasco e Grande SP" · **H1 exato** "Aluguel de fliperama, videokê e
  games para festas" · sub · CTA dual (verde WhatsApp + ghost `<a href="#o-que-tem">` que
  funciona sem JS) · tel + linha fora-do-horário server-rendered.
- **D1.5 TrustStrip** (`src/components/content/TrustStrip.tsx`): "Desde 1993" + clientes reais
  nomeados. Item "★ Google" só renderiza com `GBP_URL` (fallback §1.3). "milhares de eventos"
  omitido até o dono dar o número.
- **D2**: `AnswerCapsule` (§9.1, 1º texto corrido, HTML cru) + `CategoryGrid` (2×4, foto do 1º
  produto real + **contagem REAL de itens** do metadata) + chips por ocasião (→ /festas,
  /festas#adulto, /empresas).
- **D3 PriceBlock** (`src/components/home/PriceBlock.tsx`): ABERTA, HTML cru, **versão B**
  (4 fatores + "combos saem melhor", zero número) + link /quanto-custa + CTA verde.
- **D4 QuoteWidget** (client): chips multi-select + data(obrigatória)/bairro/convidados →
  wa.me multi-linha. **Degrada sem JS**: o CTA é um `<a>` cujo href já vem do server com o
  prefill base (verificado no export). GA4 `orcamento_add`/`orcamento_send`.
- **D5 HowItWorks**: 4 passos scroll-snap mobile + **garantia** (§9.6, redação final [CONFIRMAR]).
- **D6 ProofSection**: fotos NOMEADAS só onde a foto é real (Bradesco/Braland, Danilo Gentili);
  demais slides = fotos reais com legenda descritiva honesta (nunca rotular foto genérica com
  nome de cliente). Numeral 1993 outline + frase citável §9.3 (verbatim = /sobre) + único
  counter permitido (anos, estático) + botão Google gated em `GBP_URL`.
- **D7 FaqNative** (`src/components/content/FaqNative.tsx`): 6× `<details>/<summary>` nativo +
  **FAQPage JSON-LD emitido pelo próprio componente** (espelho 1:1, não tem como divergir).
- **D8**: CTA final + `WhatsAppCtaMeta`.
- **StickyBar global mobile** (`src/components/orcamento/StickyBar.tsx`): `md:hidden`, WhatsApp
  (prefill derivado da rota) + Ligar; na home aparece após 400px de scroll, nas demais sempre.
  `WhatsAppFloat` agora `hidden md:block` (desktop-only) — mata o conflito de duas barras.

### Decisões / ambiguidades resolvidas
1. **Tokens §7**: a spec propõe `--color-bg/surface/ink/...`, mas o globals.css ainda roda os
   tokens oklch do tema atual. Introduzir um sistema paralelo no meio do estágio = risco de
   inconsistência entre páginas. Mapeei a INTENÇÃO de cor da spec nas classes Tailwind que o
   site já usa: WhatsApp verde exclusivo (green-600/700), links/foco cyan-400, labels pink-400,
   decoração purple-500, preço/fato amber (yellow-400). Piso 12px respeitado (mín. `text-xs`).
2. **Foto do hero**: escolhi `da066c60...webp` (1283×849, alta resolução) em vez da foto do
   Danilo (340×231, LCP ruim). Mostra fliperamas + pinballs num evento real = message match do
   H1. Legenda honesta descreve a cena, sem inventar cliente. Danilo/Bradesco entram na prova (D6)
   com as fotos reais deles.
3. **Imagens da vitrine**: `getImagePath` cru (sem encodeURI), igual ao CatalogCard que já
   funciona em produção (next/image unoptimized = mesmo caminho). NFD/NFC: a contagem/filtro por
   categoria usa SLUG (`segmentsToSlug`), não a key crua — o macOS devolve nomes em NFD e o
   prefix-match na key crua falhava (bug pego e evitado).
4. **/quanto-custa e /festas criadas (lean)**: a home linka pra elas (D3, chips D2) e são
   NUNCA-CORTA; deixar link morto na página mestre é pior que antecipar 2 páginas enxutas. Versão
   completa (tabela de preço, faixas, mix por ocasião com produtos/fotos, bodas/60-70-80) fica
   na fase 5. Ambas com AnswerCapsule + FAQ (FAQPage) + breadcrumb + CTA. Adicionadas ao sitemap
   (78 URLs agora).
5. **Tel no hero sem GA**: o tel do scrim é anchor server (sem onClick) pra manter o hero
   estático (LCP). Todos os outros tel (meta, sticky bar) rastreiam. Cobrir o do hero com um
   trigger `tel:` global no GTM (mesma pendência aberta no estágio 1).
6. **DONO-CHECKLIST.md criado** em `docs/redesign-2026-07-07/` (spec §1.8) consolidando os
   [CONFIRMAR] dos estágios 1-2.

### Limpeza de mortos
Deletados (100% home-only, verificado por grep): `HomeShell.tsx`, `StartCarousel.tsx`,
`Main.tsx`, `AnimatedCarouselText.tsx`, `ui/AnimatedHeadline.tsx`. `Counter` mantido (usado em
/sobre e /galeria). `Demonstra` e `TopToys` (+CarouselModal/JSON/CSS) ficaram ÓRFÃOS (só o Main
os usava) — não deletei pra não expandir o raio de quebra no meio do estágio; candidatos a
remoção numa limpeza dedicada (TopToys = "Top 10 mais alugados", ranking não verificável, não
entra em nenhuma página nova).

### Verificação
`npm run build` verde (85 páginas, +2 vs estágio 1). `audit:fake` passa. Raw-HTML do export
conferido por grep: home tem telefone, answer capsule, 6 `<details>`, "Quanto custa", `<img>` do
hero com `fetchPriority`, FAQPage; /festas e /quanto-custa idem (details + FAQPage + telefone).
Sitemap = 78 URLs, zero acento/espaço, com /quanto-custa e /festas. Sem dev server (proibido);
verificação por build + inspeção do HTML servido.

### Pendências pro próximo estágio
- Fase 3: template categoria-LP + 7 instâncias (a home já linka as categorias certas).
- QuoteCart/QuoteDrawer GLOBAL com localStorage (fase 1 da spec) — o QuoteWidget da home é
  self-contained (state local, sem carrinho persistente). Integrar quando o carrinho global nascer.
- StickyBar em página de produto precisa do prefill com nome do produto (surface `product`) —
  hoje /catalogo/* usa surface `category`. Enriquecer na fase 4.
- `audit:raw` / `audit:sitemap` como scripts de CI = fase 6 (a checagem foi feita à mão aqui).
- Órfãos Demonstra/TopToys: limpar em passada dedicada.

---

## Estágio 3 — Catálogo + página de produto · 2026-07-08

### O que foi feito
Reconstrução da PÁGINA DE PRODUTO (maior intenção) na ordem da spec §4 + upgrade
da LP de categoria (§4 anatomia) + hub /catalogo (§2). Tudo server-first: specs,
capsule, FAQ, schema e telefone existem no HTML cru.

**Data / contrato (spec §7 "extensão do metadata.json")**
- `CatalogItem` (catalog.server.ts) ganhou campos OPCIONAIS: `specs`, `faq`,
  `capsule`, `badges`, `placeholder`. Sem dado, o slot não renderiza (§1.3).
- `src/lib/catalog-specs.ts`: tipo `ProductSpecs` + `specsToRows` (linhas legíveis
  E machine-readable) + **migração de DIMENSÃO do nome de arquivo das fotos**
  (achado §4 passo 5 — dado que o DONO digitou, nunca inventado). Parser
  conservador (`dimensionFromImages`): só extrai string que começa em token de
  medida (decimal ou nº+unidade), corta prefixo de nome-de-produto, exige unidade.
  **14/53 produtos ganham dimensão real hoje**; o resto herda o contrato pro dono
  preencher (fase 4). `resolveSpecs` nunca sobrescreve dado confirmado com derivado.
- `src/lib/catalog-content.ts`: FAQ da categoria (6) + do produto (4, herdada) +
  answer capsules (categoria usa CONTAGEM REAL; produto gera do nome) + chips de
  ocasião. Respostas honestas: onde faltaria número do dono (horas da diária,
  política de chuva formal), a copy responde SEM cravar número — nunca inventa.

**Produto** (`catalogo/[...slug]/page.tsx` reescrito)
- Título transacional `<title>` = "Aluguel de {Produto} para Festas e Eventos |
  Aluguel de Games" (absolute, sem duplo-branding do template); H1 visível =
  "Aluguel de {Produto}" (§4.3). OG title idem.
- Layout: breadcrumb → (galeria | painel de decisão) → ficha técnica → chips
  "vai bem em" → descrição → FAQ → relacionados.
- `ProductGallery` REESCRITA (spec §4.2): **scroll-snap CSS nativa** (swipe no
  touch), controles SEMPRE visíveis (não escondidos em :hover, que o dedo não
  tem), tap na foto = fullscreen, 1ª imagem `priority` + aspect-square fixo (zero
  CLS), teclado no lightbox. Framer-motion removido desta superfície.
- `ProductPanel` (server): categoria linkada + badges + H1 + AnswerCapsule +
  bloco de decisão (3 fatos verificáveis + garantia colada §9.6 + preço 2-estados
  honesto "sem card celebrando a ausência" + link /quanto-custa) + CTAs (verde
  exclusivo). `ShareButton` = ilha client mínima. `ProductDescription` = markdown
  do dono (omite quando a descrição é só o próprio título).
- `SpecsTable` (server): `<table>` mono/tabular; linha sem dado some, tabela some
  se não houver spec. As MESMAS linhas viram `additionalProperty` no Product JSON-LD.
- Schema: Product + Offer LeaseOut + additionalProperty + BreadcrumbList (server);
  FAQPage sai do `<FaqNative>` (espelho 1:1). Sem aggregateRating. **JSON-LD
  validado por parse no export** (5 blocos, todos OK).
- Sticky com contexto do produto (§4.10): `ProductStickyContext` (provider no
  layout) + `<SetStickyProduct>` na página → a StickyBar GLOBAL troca o prefill
  pra surface="product" nomeando o item (progressive: HTML servido traz o prefill
  de categoria, a hidratação faz o upgrade). Sem segunda barra.
- `RelatedProducts`: curadoria por IRMÃOS (mesmo pai) + resto da categoria; nunca
  "quem alugou" (não existe o dado).

**Categoria** (`CategoryListing` reescrita p/ anatomia §4)
- breadcrumb → H1=keyword → AnswerCapsule (contagem real) → **CTA dual acima da
  dobra + tel + fora-do-horário** → grid FOTO-first (cards com 1 linha de spec
  real via `specLine`; fallback "Entrega e montagem incluídas") → tabela
  comparativa (`CategoryComparisonTable`, só com ≥3 specs, senão OMITE) → como
  funciona (3 passos) → preço honesto (reusa `PriceBlock`, 2 estados) → FAQ
  (`FaqNative` → FAQPage) → CTA final. Schema CollectionPage+ItemList+FAQPage+
  BreadcrumbList completo (verificado no export).

**Hub** (`Catalogo` reescrito, §2): headings LINKADOS às LPs de categoria + ordem
curada (Jogos Eletrônicos → Videokês → VR → Jogos de Mesa → Projetores →
Infláveis) + grids foto-first com spec real + capsule + CTA. Contagens reais.
- `CatalogCard`: prop `specLine` (dimensão real, mono) no lugar do fallback; botão
  "+ Orçamento" fica pra fase do QuoteCart (card é um `<a>` — botão aninhado é HTML
  inválido; hoje o card leva pro produto, onde o CTA de orçamento vive).

**Des-fabricação residual**
- Removido `"locacoes": 185/…` de 5 metadata.json (PS3/4/5, Xbox 360/One) — número
  fake que ainda SHIPPAVA pro out/ (não era renderizado, mas um crawler leria).
  `audit:fake` endurecido pra pegar `locacoes|locações` em `public/Organizado`.
- `/catalogo` metadata: "Mais de 60 equipamentos" (catálogo real tem ~53) → copy
  sem número.

### Decisões / ambiguidades resolvidas
1. **Specs = migração honesta, não invenção**: dimensões vêm do nome de arquivo
   das fotos (o dono digitou). Voltagem/jogadores/idade NÃO são adivinhados — só
   entram quando o dono preencher `specs` no metadata. Alguns rótulos migrados são
   imperfeitos ("2,55 Alt Com o carrinho") mas são a medida REAL dele; melhor real
   e imperfeito que fabricado.
2. **"11.000 jogos" na copy de categoria** (catalog-categories.ts) mantido: é o
   nome do produto do dono, já flaggeado no estágio 1; não amplifiquei nem
   inventei número novo. Rewrite dessa copy = fora do escopo do estágio.
3. **"+ Adicionar ao orçamento" (§4.4) → "Tirar dúvida no WhatsApp"**: o carrinho
   global (QuoteCart) é fase 1, ainda não existe. Rótulo honesto e funcional agora;
   integra no cart quando nascer.
4. **Tabela comparativa**: célula vazia = em branco (nunca "—", regra §1.3). Hoje
   só a coluna Dimensões aparece (única spec disponível); jogadores/tomada entram
   sozinhas quando o dono preencher.
5. **react-markdown em server component**: funciona no RSC (sem "use client");
   build valida.

### Verificação (build + raw-HTML do export; sem dev server)
- `npm run build` verde (85 páginas, estático). `audit:fake` passa (agora inclui
  metadata público).
- Produto (pebolim): `<title>` transacional, telefone, capsule, "Ficha técnica" +
  dimensão real, 4 `<details>`, JSON-LD Product+LeaseOut+additionalProperty+
  FAQPage+BreadcrumbList (todos parseiam), H1 "Aluguel de Pebolim", chips /festas.
- Produto sem spec (Atari): ficha técnica OMITIDA (0), FAQ herdada (4), capsule ok.
- Categoria (jogos-de-mesa): capsule, "Compare os modelos", 6 `<details>`,
  CollectionPage+ItemList+FAQPage, CTA dual. Sitemap = 78 URLs, zero acento/espaço.

### Pendências pro próximo estágio
- Fase 4 real: dono preenche `specs` (voltagem/jogadores/idade/peso/porta/elevador)
  dos 15 top via planilha; pipeline LQIP grava `placeholder` no metadata (galeria
  já aceita `placeholder`). `badges` (novo/mais-pedido) idem.
- QuoteCart/QuoteDrawer global (fase 1): então "+ Adicionar ao orçamento" no card e
  no painel vira ação real de carrinho.
- Órfãos após o reescrito: `CatalogList.server.tsx` + `CatalogSection.tsx`
  (o hub não usa mais) + Demonstra/TopToys — limpar em passada dedicada.
- OG image 1200×630 por template (produto/categoria) = fase 6.

---

## Estágio 4 — Páginas de dinheiro e confiança · 2026-07-08

### O que foi feito
Reconstrução das páginas de intenção de compra/confiança (spec §5/§6), todas
server-first: telefone, capsule, tabelas, FAQ e schema existem no HTML cru.

**(a) /quanto-custa (completa)** — resposta direta ~50 palavras (snippet §9.5) +
`<table>` "O que influencia o preço" (6 fatores: equipamento, nº de itens, data,
período, região, acesso no local — cada linha diz COMO pesa, nunca QUANTO) +
"Faixas de referência" com os **2 estados desenhados** (`PRICE_RANGES` em
schema.ts: null → versão B "como a gente calcula" + "combos saem melhor", zero
número; preenchido → tabela categoria×"a partir de"). FAQ ampliada (5, incl.
"por que não tem tabela fixa" e "dá pra ter ideia sem passar dados") + FAQPage.

**(b) /empresas (máquina B2B, rewrite total)** — hero H1 keyword "Aluguel de
games para eventos corporativos em SP" + sub §5.1 + badge gated (CNPJ ou "desde
1993 · emitimos nota") + **CTA triplo**: WhatsApp + "Ver kit de aprovação (PDF)"
+ e-mail visível (mailto gated em `CORP_EMAIL`; sem ele, fallback honesto aponta
pro form "que vai direto pro e-mail" — os 2 estados). AnswerCapsule §9.4.
**Dimensionamento `<table>`** com a linha 151-250 destacada (gate): mostra Porte
+ Atrações + Mix sugerido (recomendação editorial honesta) + CTA por porte; os
números logísticos finos (m²/tomadas/técnicos) são [CONFIRMAR] e NÃO renderizam
como fato ("o fino a gente fecha no orçamento"). Cases nomeados (Bradesco foto,
Arnold vídeo, Spotify texto) com escopo qualitativo honesto (sem "6 máquinas · 2
dias" fabricado). Agenda honesta (nov/dez lotam). Processo 4+1 passos (o 5º =
registro pós-evento [CONFIRMAR]). **FAQ B2B** (`<details>`+FAQPage): NF explica
locação de bem móvel (LC 116/2003 + Súmula Vinculante 31 STF), pagamento/boleto,
homologação de fornecedor, operação, montagem fora do horário, shopping/expo —
**seguro OMITIDO (gate §5.4)** até o dono confirmar. **Form B2B** `ContactFormB2B`
(Web3Forms, mesmo padrão do ContactForm; campos empresa/tel obrigatório/email/
data/pessoas; pós-envio = confirmação + botão OPCIONAL "continuar no WhatsApp"; o
dado não evapora se a aba morrer). GA4 `form_submit_b2b`. Schema Service+FAQPage+
BreadcrumbList.

**Kit de aprovação** (`/empresas/kit-aprovacao`, item NUNCA-CORTA §5.4) — página
IMPRIMÍVEL (o RH salva PDF pelo navegador; sem dep HTML→PDF nova). `@media print`
some header/footer/sticky. Conteúdo: quem somos (desde 1993 = anti-risco), o que
está incluso, como orçamos (versão sem-faixa), cronograma-modelo, cadastro de
fornecedor (gated em CNPJ; sem ele, "a gente envia os dados na hora"). Botão
`KitPrintButton` (client) dispara `window.print()` + GA4 `kit_pdf_download`.

**(c) /como-funciona (rewrite)** — passos numerados (HowTo schema) + a **FAQ REAL
das personas** em `<details>` (chuva, sinal/cancelamento, hora extra, elevador/
escada, 110/220V, horário de chegada da equipe, garantia §9.6) + FAQPage. Sinal %
e prazo de reagendamento = [CONFIRMAR] → resposta honesta sem número. Removidos os
fakes herdados: "60+ equipamentos", "press start", "em até 1 dia útil".

**(d) /festas (enriquecida)** — página única com âncoras #infantil/#adulto (spec
§2 modela assim; sub-páginas por ocasião = risco de doorway §11, evitado). Cada
seção: foto REAL com legenda honesta (infantil = grua+fliperama; adulto = pinball
do Danilo Gentili, foto real nomeada) + "cobre" (bodas/60-70-80/15 anos/família) +
4 produtos linkados + CTA. FAQ ampliada (idade, apto/salão, nº de itens×convidados,
chuva, antecedência) + FAQPage. Índice rápido por âncora.

**(e) /sobre (enxuto)** — REMOVIDA a seção "valores/Quatro pilares/O que nos move"
(missão/visão/valores = proibido §11) e a linha "a missão segue a mesma". Ficou:
linha do tempo de fatos datáveis 1993→hoje + frase citável VERBATIM (= home §9.3)
+ contador de anos. 404 ajustada: CTA "Insert Coin" → "Pedir orçamento no WhatsApp"
(texto humano §7; resto do arcade 404 = assinatura mantida).

**(f) DONO-CHECKLIST.md na RAIZ** — versão mestre priorizada por SEMANA (4×2h):
sem1 garantia/chuva/sinal/período + CNPJ/e-mail; sem2 Google/NAP/endereço/horário;
sem3 seguro(gate)/pagamento/dimensionamento/faixas; sem4 specs/galeria/logos/foto.
Tabela de "interruptores" (cada dado → arquivo+constante). O checklist em `docs/`
virou pointer pro da raiz (evita drift).

### Infra nova
- `schema.ts`: `serviceSchema`, `howToSchema`, e constantes gated `CORP_EMAIL`,
  `PRICE_RANGES` (além de CNPJ/GBP_URL/STREET_ADDRESS/OPENING_HOURS já existentes).
- `gtm-utils.ts`: `trackKitDownload` (kit_pdf_download) + `trackFormSubmitB2b`
  (form_submit_b2b) — completam a taxonomia §8.
- sitemap: +/empresas/kit-aprovacao (79 URLs).

### Decisões / ambiguidades resolvidas
1. **/festas: página única, não sub-páginas.** A spec §2/§6 modela /festas com
   âncoras (#infantil/#adulto); §11 proíbe doorway pages. Sub-páginas finas por
   ocasião seriam thin/doorway → enriqueci a página única com foto+mix+FAQ por
   seção. Confraternização/SIPAT vive em /empresas (cross-link), não em /festas.
2. **E-mail corporativo (gate /empresas) sem dado = fallback honesto.** A spec pede
   "e-mail visível", mas o e-mail é [CONFIRMAR] e a regra §1.3 proíbe placeholder
   cru pro cliente. Resolvi com `CORP_EMAIL` (null): sem ele, nenhum mailto quebrado
   — a página aponta pro form B2B ("vai direto pro nosso e-mail"), que é destino
   real. Marcado como bloqueador nº1 de /empresas no checklist. Vira 1 linha quando
   o dono der o e-mail.
3. **Dimensionamento: mix sim, logística não.** Recomendar "fliperama + console +
   mesa" pra até 50 pessoas é conselho editorial honesto; cravar "~15m² · 2 tomadas
   · 1 técnico" é dado logístico que só o dono tem (§5.3 [CONFIRMAR]). Tabela mostra
   o mix + Atrações (faixa) e diz "o fino a gente fecha no orçamento".
4. **Kit = página imprimível, não .pdf gerado no build.** Gerar PDF fixo exigiria
   dep HTML→PDF (puppeteer) — a spec §5.4 aceita "PDF placeholder ou página
   imprimível". A página `/empresas/kit-aprovacao` imprime/salva-PDF pelo navegador,
   URL estável. PDF fixo no build = pós-launch (checklist).
5. **NF de locação (LC 116/2003 + SV 31 STF).** Explicação fiscal correta e medida
   ("locação de bem móvel não gera NFS-e de serviço; emitimos fatura/nota de
   locação + contrato"), com "se tiver requisito específico, a gente adequa" pra não
   dar conselho fiscal fechado sobre o regime do dono.
6. **Seguro = gate binário.** Enquanto o dono não confirmar cobertura, o site NÃO
   menciona seguro em lugar nenhum (nem FAQ, nem kit). Melhor silêncio honesto que
   promessa. Vira FAQ nova quando confirmado.

### Verificação (build + raw-HTML do export; sem dev server)
`npm run build` verde (**86 páginas**, +1 = kit). `audit:fake` passa. Greps no
out/: cada página nova tem telefone + FAQ `<details>` (empresas 6, como-funciona 7,
quanto-custa 5, festas 5) + FAQPage. Schema por parse: /empresas = Service+FAQPage+
BreadcrumbList (+ org/website globais), /como-funciona = HowTo+FAQPage+Breadcrumb,
todos parseiam. Gates B2B no HTML: "151 a 250", "LC 116/2003", "Súmula Vinculante
31", form ("Enviar cotação"), e-mail fallback. **Zero** "seguro" na /empresas,
**zero** missão/visão/valores na /sobre, **zero** "60+ equipamentos"/"press start"
na /como-funciona. Sitemap = 79 URLs, +/empresas/kit-aprovacao, zero acento/espaço.

### Pendências pro próximo estágio (fase 6)
- OG 1200×630 por template; `audit:raw`/`audit:sitemap` como scripts de CI (checagem
  feita à mão aqui); llms.txt já cita as páginas mas pode ganhar as novas seções.
- Órfãos ainda de pé (limpeza dedicada): `Demonstra`, `TopToys`(+CarouselModal/JSON/
  CSS), `CatalogList.server`, `CatalogSection`, `ComoFunciona` (seção legada em
  components/sections, NÃO é a page /como-funciona), `sales`? já morto. O
  `components/sections/como-funciona/ComoFunciona.tsx` e `videos-e-imagens/Demonstra`
  não são mais referenciados pelas páginas novas.
- Kit em .pdf real (build), specs dos 15 top, faixas de preço — dependem do dono.

## Estágio 5 — Build verde + aceite + push (opus-4.8 / Fable 5)

**Build:** `next build` verde — 86 páginas, export estático `Exporting (3/3)`, typecheck OK. `prebuild` limpa `.next`; sem `postbuild`/next-sitemap (sitemap é rota `app/sitemap.ts`, arquivo único `out/sitemap.xml`, 79 URLs).

**Lint:** `next lint` = **0 erros**, 13 warnings pré-existentes (aceitáveis, registrados):
- `@next/next/no-img-element` em CategoryGrid/HomeHero/ProofSection (uso deliberado de `<img>` no static export com AVIF+LQIP próprios; `next/image` optimizer não roda em export).
- `react-hooks/exhaustive-deps` em FlyingEmojis (cleanup de ref) — comportamento intencional.
- 1 `Unused eslint-disable` em `types/global.d.ts`.

**Erros zerados nesta rodada:** removi `let`→`const` (catalog-specs), `catch(e)`→`catch`, var `tree` morta e `any`→tipos em catalog-tree.server / catalog.server, `any`→`unknown` em gtm-utils (7×), imports/vars não usados (TrustStrip `anos`, DynamicGradient `CSSProperties`, catalog-content `FAQ_CHUVA`).

**Órfãos removidos** (0 importers, confirmado por grep): `components/sections/como-funciona/` (seção legada, NÃO a page), `components/sections/top-toys/` (+ data/css/product-modal), `components/sections/videos-e-imagens/Demonstra.tsx`. Isso limpou 4 dos erros de lint de brinde.

**Aceite (out/ exportado) — item a item:**
1. JSON-LD LocalBusiness+foundingDate na home: OK (`EntertainmentBusiness`, subclasse de LocalBusiness, mais específica) + `"foundingDate":"1993"`.
2. FAQ em `<details>` no HTML cru: OK (home 6, como-funciona 7, quanto-custa 5, empresas 6, festas 5).
3. robots.txt com bots de IA: OK (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, +1).
4. sitemap único e válido: OK (`out/sitemap.xml`, urlset válido, 79 locs, sem acento/espaço).
5. Zero contador fake (sales-utils/hash/reviewCount/ratingValue): OK (grep vazio no out/).
6. llms.txt presente: OK (2248 bytes).

**Fora da spec / riscos:** `CatalogList.server` mantido (1 importer real, não é órfão). Bloqueadores do dono seguem gated (e-mail corporativo, CNPJ no rodapé, GBP, seguro B2B, faixas de preço reais, specs dos 15 top, kit .pdf gerado) — todos no DONO-CHECKLIST.md. `EntertainmentBusiness` escolhido no lugar de `LocalBusiness` puro por ser mais preciso p/ locação de entretenimento (ainda é LocalBusiness na hierarquia schema.org, satisfaz rich-results).
