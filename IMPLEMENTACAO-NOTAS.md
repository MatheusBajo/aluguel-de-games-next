# IMPLEMENTAÇÃO — notas de decisão (redesign-v2-fable)

Log append-only: cada estágio registra o que decidiu onde a spec era ambígua.

---

## Estágio 1 — Fundação técnica (FASE 0) — 2026-07-07/08

### O que morreu (des-fabricação, gate 1.1)
- `src/lib/sales-utils.ts` + os 3 render points (CatalogCard, TopToys,
  CarouselModal) + campo `locacoes` do CatalogItem.
- Badge "1" bouncing do WhatsAppFloat; badge "Disponível" perpétua do
  CarouselModal (badge falsa, §11); badge "Online" da /contato (idem).
- Counters 500+/60+/98% em Main, StartCarousel, /sobre, /galeria e
  ProductInfo (500+/100%). Único counter que sobrou: **anos desde 1993**
  (derivado, `new Date().getFullYear() - 1993`).
- `StarRating.tsx` (órfão), `ADMIN.md`, `public/robots.txt` (corrompido),
  `public/sitemap.xml` (stale), `next-sitemap` (postbuild + config + devDep).
- Órfãos com CTA de WhatsApp não-migrável deletados junto:
  `CatalogoList.tsx`, `ComoFunciona.tsx` (section), `StartCarouselClaude.tsx`,
  `WhatsAppButton.tsx` (nenhum era importado; evita CTA fora do componente único).
- Claims sem dono: "Entrega grátis" (OG) → "entrega e montagem inclusas";
  "mais de 60 atrações" (/sobre) → "dezenas de atrações"; "60+ equipamentos ·
  maior variedade da Grande SP" (/como-funciona) → claim qualitativo;
  "proposta em até 1 dia útil" (/empresas, 2×) → "resposta em horário
  comercial" (SLA sem assinatura é proibido, §11).

### Substitutos honestos (no pixel do que saiu)
- CatalogCard: linha `item.specLine ?? "Entrega e montagem incluídas"`
  (specLine virá do metadata na fase 1).
- Main/StartCarousel/galeria/sobre: prova nomeada (Bradesco · Spotify ·
  Arnold Classic · Danilo Gentili) e/ou frase citável (§9.3) no lugar dos
  contadores.
- ProductInfo: 3 fatos verificáveis + linha honesta de preço sem valor
  ("valor fechado depende de data e bairro", 1 linha, sem card).

### `<WhatsAppCta>` (gate 1.2)
- `src/components/cta/WhatsAppCta.tsx` — anchor REAL pra wa.me com `?text=`
  no HTML servido; variants primary/outline/compact/icon/unstyled; exporta
  também `PhoneSupportLine` (linha "ou ligue (11) 96526-1000" + estado
  fora-do-horário) e `TelLink` (tel: rastreado).
- Prefills por superfície em `whatsapp.config.ts` (copy §9.2/9.4 da V1):
  home/festas, category, product, kit, empresas, orcamento (fase 2), generic.
- GA4 (taxonomia §8): `whatsapp_click{surface,product}` + `tel_click{surface}`
  via dataLayer (`gtm-utils.ts`); mantido `click_location` pra compat com
  triggers GTM existentes.
- **Fora-do-horário, decisão:** horário do dono ainda não confirmado →
  `BUSINESS.hours = null` e a linha renderiza a versão SEM número: "Pode
  mandar a qualquer hora — respondemos no horário comercial." Quando o dono
  confirmar (DONO-CHECKLIST item 5), preencher `hours` e o componente passa a
  mostrar "atendemos das Xh às Yh" + aviso client-side fora do horário.
  Os DOIS estados estão implementados (regra do fallback, §1.3).
- Migrados 100% dos CTAs: Header (2), MobileMenu, Footer (2+ícone),
  StartCarousel, Main, Demonstra, CarouselModal, ProductInfo (2),
  CategoryListing, WhatsAppFloat, /empresas (3), /contato (3), /sobre,
  /galeria, /como-funciona, 404.

### robots + sitemap (gates 1.3/1.4)
- `robots.ts` único: `*` allow + 10 bots de IA com directive própria
  (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot,
  Claude-User, PerplexityBot, Perplexity-User, Google-Extended,
  Meta-ExternalAgent), todos `Disallow: /studio/`.
- `sitemap.ts` único: 8 rotas estáticas (incl. /privacidade) + todos os
  prefixos + produtos do catálogo com slug ASCII via `slug-utils` (mesma
  função do generateStaticParams → zero divergência). 76 URLs no aceite.
- **Decisão:** `getSiteUrl()` agora normaliza o domínio de produção pro host
  canônico `https://www.alugueldegames.com.br` (o `.env.local` aponta pro
  domínio sem www, o que geraria canonical divergente do 301 www do
  .htaccess). Exportado `SITE_URL` como constante canônica.

### JSON-LD server-side (gate 1.3)
- `src/components/seo/JsonLd.tsx` (server, `<script>` inline no HTML cru) +
  `src/lib/schema.ts` com builders: `globalGraph` (EntertainmentBusiness
  foundingDate 1993 + areaServed Osasco-first + WebSite), `productSchema`
  (Offer LeaseOut, sem aggregateRating), `breadcrumbSchema`, `faqPageSchema`,
  `collectionPageSchema` — os 3 últimos prontos pros próximos estágios.
- Layout renderiza o grafo global; o EntertainmentBusiness duplicado da home
  saiu; `SchemaMarkup.tsx` (WebSite com SearchAction) morreu — SearchAction
  apontava pra busca que o brief mandou não ressuscitar.
- `[...slug]/page.tsx`: `next/script` trocado por `<JsonLd>`;
  produto ganhou BreadcrumbList; categoria ganhou BreadcrumbList; breadcrumb
  visível consertado (`/catalogo#Categoria` → `/catalogo/{slug}/`).
- **Decisões de schema:** (1) `hasMap`/GBP omitido até o dono passar o link
  (slot sem dado não renderiza — nunca inventar URL de Maps); (2) `geo`
  (lat/long do centro de SP, fabricado) REMOVIDO até ter endereço real;
  (3) `addressLocality` corrigido de "São Paulo" pra "Osasco"; (4)
  `openingHours` mantido MAS alinhado com a página /contato
  (seg-sex 08:30-18:00, sáb 08:00-12:30 — os dois divergiam) e flagado no
  DONO-CHECKLIST como a confirmar.

### llms.txt + /privacidade + footer (gates 1.4/1.5)
- `src/app/llms.txt/route.ts` (force-static, gerado no build a partir do
  catálogo real; expectativa zero declarada no próprio arquivo).
- `/privacidade`: LGPD honesta (só descreve o que o site FAZ: GTM/GA4,
  Web3Forms, redirect WhatsApp); CNPJ/razão social entram sozinhos quando
  preenchidos no `business.config.ts`.
- Footer: NAP (Osasco/SP + tel rastreado + e-mail), link LGPD, 7 categorias,
  slot de CNPJ/horário/GBP ("avalie a gente") que só renderizam com dado
  confirmado. **Decisão:** placeholders `[CONFIRMAR COM DONO]` vivem no
  CÓDIGO (`src/config/business.config.ts`, campos null + comentário) e no
  `DONO-CHECKLIST.md` — NÃO renderizam texto de placeholder pro usuário
  final (regra §1.3 "slot sem dado não renderiza" > instrução literal de
  placeholder visível; os dois estados estão desenhados).

### Extras deste estágio (baratos, exigidos por regra transversal)
- H1 do hero trocado pro da spec ("Aluguel de fliperama, videokê e games pra
  sua festa. Desde 1993.") — o "ser inesquecível" está na lista de rejeições
  explícitas; badge "Osasco e Grande SP"; sub da spec. A des-JSificação do
  hero (slide 1 estático) continua sendo fase 3.
- TopToys: texto de 5pt/7pt subiu pro piso de 12px (regra 6).
- Audits de CI: `scripts/audit.mjs` + `postbuild` = `audit:fake` +
  `audit:sitemap` + `audit:raw` (build FALHA se aparecer número fabricado,
  URL com acento no sitemap, ou HTML sem telefone/1993/wa.me).
- `DONO-CHECKLIST.md` criado (2h/semana do dono, priorizado).
- Fix de tipagem pré-existente do colorthief (cast local) que quebrava o
  `next build` após o lockfile ser re-resolvido na remoção do next-sitemap.

### Pendências explícitas (fora do escopo da fase 0)
- Deps Sanity continuam no package.json (spec §2 lista na fase 0, mas a
  tabela de esforço §10 coloca na fase 6; studio/ compila junto — remover
  exige teste próprio).
- Headings do /catalogo → links de categoria (gate 1.3) ficou pro estágio
  do /catalogo (não estava no escopo a-g deste estágio).
- Answer capsule, trust strip, dobra quanto-custa, sticky bar, QuoteCart,
  specs/FAQ por produto: fases 1-5.
- ContactForm: telefone ainda não é obrigatório (gate 1.2 de forms — fase 5
  junto com /empresas máquina).

Build: `npm run build` verde (export estático, 76 rotas) + 3 audits verdes.

---

## Estágio 2 — HOME V2 + NAVEGAÇÃO (SPEC-FINAL-V2 §3) — redesign-v2-fable

Home reconstruída seção por seção, na ordem da spec. Monolitos
`HomeShell.tsx`/`Main.tsx`/`StartCarousel.tsx` removidos e substituídos por
componentes focados em `src/components/home/` compostos no `src/app/page.tsx`.

### Seções entregues
- **§3.1 Hero** (`HomeHero` server + `HeroCarousel` client): ordem do 1º
  viewport = badge → H1 → sub → CTA dual → linha tel; carrossel (~52vh) ABAIXO
  do CTA; counter único = anos desde 1993 (texto no HTML, não animado).
- **§3.2 TrustStrip** (server): estática, quebra em 2 linhas, NUNCA marquee;
  desde 1993 + anos + clientes nomeados. Slots omitidos: "milhares de eventos"
  (sem nº) e "★ nota Google" (sem GBP).
- **§3.3 AnswerCapsule** (server, HTML cru): copy §9.1 verbatim, telefone e
  "Desde 1993" no HTML (passa audit:raw / curl-grep).
- **§3.4 Vitrine por ocasião** (`OccasionRow`/`OccasionCard` + `occasions.ts`):
  3 fileiras Netflix scroll-snap CSS (infantil/adulta/empresa), fonte =
  fallback categoria→ocasião (fileira nunca nasce magra) + override
  `metadata.ocasioes[]`. Card honesto = foto + título + specLine (fallback
  "Entrega e montagem incluídas") + verde compacto (prefill do produto) +
  "Ver detalhes". Régua de 7 chips de categoria.
- **§3.5 Kits** (`KitsSection` + `data/kits.ts`): 3 cards honestos (itens em
  texto, sem preço/convidados inventado; linhas condicionais).
- **§3.6 Quanto custa** (`PriceTeaser`, ABERTA): versão B (3 fatores + combo,
  zero número) + link forte /quanto-custa + CTA verde.
- **§3.7 Top 10** (`TopToys`): tirado o `ssr:false` (agora `"use client"` que
  SSR-a; existe no HTML). Contador/estrela já mortos na fase 0.
- **§3.8 Como funciona** (`HowItWorks`): 4 passos 2×2 + garantia 1 linha (§9.6)
  + link /como-funciona.
- **§3.9 Prova FUNDIDA** (`ProofSection`): mata grid de 4 valores + stats; 3
  cards de evento + 1 vídeo do Demonstra (poster + preload=metadata) +
  blockquote §9.3 verbatim + numeral de anos + link /sobre.
- **§3.10 FAQ** (`HomeFaq` + `seo/FaqNative`): 5 `<details>` + FAQPage 1:1
  (pergunta "quanto custa" ENTRA com resumo + link).
- **§3.11 CTA final** (`FinalCta`) + **StickyBar** global mobile.

### Navegação
- `StickyBar` (global, `md:hidden`): WhatsApp (prefill por rota) + Ligar; na
  home só após 400px de scroll, nas demais rotas de cara. `WhatsAppFloat` virou
  DESKTOP-only (`hidden md:block`) — nunca 2 barras flutuantes juntas (§11).
- Header/nav mantido (já ok da fase 0).

### Tokens (§7)
Adicionados em `globals.css`: `--color-whatsapp(-hover)`, `--color-fact`,
`--color-surface-fact`, `--trust-accent`, `--glow-scale`, `--text-min`, +
utilitários `.occasion-scroller` (scroll-snap) e `.hero-lqip`.

### Decisões / ambiguidades resolvidas (sem perguntar, pelo espírito do brief)
1. **H1 sem opacity:0 no LCP (§3.1):** a antiga `AnimatedHeadline` nascia
   `opacity:0` e revelava via GSAP — violação explícita da spec. Troquei por
   H1 server pintado imediato; a "animação letter-by-letter" virou o shine CSS
   do `.gradient-slide` (fundo, texto sempre visível). LCP protegido.
2. **Slide 1 server-side + LQIP:** slide 1 = `<img loading="eager"
   fetchPriority="high">` sobre LQIP base64 (24px, gerado com sharp) inline no
   HTML; embla só hidrata depois (autoplay só pós-hidratação, não liga em
   prefers-reduced-motion, para em interação/mouse-enter). Sem JS, fica a foto
   1. Legenda estática no scrim de todo slide (≥12px). O texto animado
   letra-a-letra (`AnimatedCarouselText`) saiu do hero (legenda em HTML > efeito).
3. **"+ Orçamento" (carrinho) → "Ver detalhes":** o QuoteCart/Drawer é estágio
   posterior (fase 2 da spec). Até lá a ação secundária do card leva ao produto
   (que hospedará o add-to-cart), sempre COM RÓTULO (nunca ícone solto, §11).
4. **Fileira "Chegou no catálogo" OMITIDA:** badge "novo" só é honesto com
   assinatura do dono (item 15 do checklist). Sem dado, não renderiza (§1.3).
5. **Links pra rotas futuras:** `/quanto-custa` e `/festas` nascem em estágios
   posteriores do roadmap V2; os links já apontam pro destino final da spec
   (§3.4/§3.6). Build não quebra (Next não valida href de `<Link>`); até essas
   páginas existirem, são os únicos 2 links internos que 404 em isolado —
   intencional (forward-compat). Row adulta "Montar minha festa" → /catalogo
   (QuoteDrawer é fase 2).
6. **7 chips de categoria:** Fliperamas, Videokê, VR, Consoles, Máquinas, Jogos
   de Mesa, Infláveis/Infantil (Pinballs segue no header/footer).
7. **Prova (§3.9):** só 2 cards têm foto nomeável honesta (Gentili, Bradesco);
   o 3º é foto real de equipamento SEM cliente falso. Fotos nomeadas de
   Arnold/Spotify = checklist item 14.

### Pendências (fora do escopo deste estágio)
- **JS budget (§7):** home em ~201kB First Load JS (TopToys + carrossel +
  framer). `next/dynamic` (ssr:true) pros blocos abaixo da dobra pra
  code-split = fase 6 (CWV). LCP já resolvido por arquitetura no hero.
- **Poster de vídeo real da prova:** hoje usa um frame webp do catálogo como
  poster; poster próprio (ffmpeg) = fase 6.
- **OG por template da home:** metadata enxuta; OG 1200×630 por página = fase 6.
- **/festas, /quanto-custa, QuoteCart/Drawer:** estágios seguintes.
- Órfãos deixados de propósito (podem ser reusados): `Demonstra.tsx`,
  `AnimatedHeadline.tsx`, `AnimatedCarouselText.tsx` (não importados mais).

Build: `npm run build` verde (export estático, 83 páginas) + 3 audits verdes
(fake/sitemap/raw). Gates verificados no HTML: H1 sem opacity:0, capsule +
telefone + "1993", slide1 eager/fetchPriority + LQIP inline, 5 `<details>` +
FAQPage, 3 fileiras povoadas (56 cards), trust strip, quanto-custa, sticky bar.

---

## Estágio 3 — CATÁLOGO + PÁGINA DE PRODUTO (SPEC-FINAL-V2 §4) — redesign-v2-fable

### Página de produto (padrão-ouro §4) — `[...slug]/page.tsx` reescrita
- **H1/título transacional:** `Aluguel de {Produto} para Festas e Eventos`
  (H1 no HTML cru); `<title>` = `...em SP | Aluguel de Games` (absolute, não
  duplica o template do layout). `productHeading()` centraliza.
- **Answer capsule (§4.4):** `productCapsule()` (server, HTML cru, 40-60
  palavras factuais) — override por `capsule` no metadata.json.
- **Galeria touch (§4.2):** `ProductGallery` reescrita — scroll-snap CSS
  NATIVA (swipe no toque), controles SEMPRE visíveis no mobile (não mais
  `opacity-0 group-hover` = a crítica do opus-4.8 era "no touch o controle
  some"), dots de posição, tap na foto = lightbox, teclado (setas/esc).
  Framer-motion saiu da galeria (mais leve). 1ª img `priority`.
- **Bloco de decisão (§4.5):** `ProductInfo` agora é SERVER component (só o
  `ShareButton` é client) → 3 fatos + garantia colada (§9.6, sem `[CONFIRMAR]`
  vazando pro texto) + preço estado-SEM (1 linha honesta + link /quanto-custa,
  sem card celebrando ausência) + CTA verde `Pedir orçamento deste item`
  (prefill do produto) + CTA outline dúvida + telefone/fora-do-horário.
- **Ficha técnica (§4.6):** `SpecsTable` (server) — chips + `<table>`
  machine-readable (`<th scope="row">`). Fonte: `specs{}` curado OU dimensões
  extraídas do NOME DE ARQUIVO das fotos (§4.6). Ficha vazia NÃO renderiza.
- **Chips "vai bem em" (§4.7):** derivados da ocasião do item → /festas /empresas.
- **Incluso + descrição (§4.8):** `ProductDescription` (server, markdown).
- **FAQ do item (§4.9):** `FaqNative` + `productFaq()` (4 perguntas honestas,
  FAQPage 1:1); override por `faq[]` no metadata.
- **Relacionados (§4.10):** `RelatedProducts` reescrito — por OCASIÃO
  compartilhada + mesma categoria (nunca "quem alugou também" = dado que não
  temos). Cards com spec real.
- **JSON-LD server (§4):** Product + Offer LeaseOut + `additionalProperty`
  (só specs reais) + FAQPage + BreadcrumbList (migalha completa, todos os
  níveis). Sem aggregateRating.
- **Sticky bar do produto (§4.11):** `StickyProductProvider` no layout +
  `SetStickyProduct` na página → a UMA barra global assume o prefill DO
  produto no mobile (nomeia o item). Float continua desktop-only.

### Extração de dimensões do nome de arquivo (`src/lib/product-specs.ts`)
- Parser conservador com detecção de orientação (número-antes vs eixo-antes)
  + faixa sã [0,10 m; 6,0 m]. Validado contra os 54 produtos: **19 ganham
  "Dimensões (montado)" reais** (o dono já mediu e escreveu no nome do arquivo,
  §4.6); os 35 sem medida legível não renderizam linha (§1.3). Zero fabricação.
- Mesma fonte alimenta a linha de spec dos cards (`specLineFor`) e a tabela
  comparativa da categoria.

### Categoria-LP (§4 categoria) — `CategoryListing` estendida
- Capsule (a `meta.description` vira o texto-resposta) + **CTA dual acima da
  dobra** + grid com spec real no card + **tabela comparativa de dimensões**
  (só com ≥3 produtos com dado; senão omite) + **bloco de preço honesto**
  (zero número) + **FAQ própria** (`categoryFaq`, FAQPage) + CTA final.
  CollectionPage + ItemList + FAQPage + BreadcrumbList.

### Hub `/catalogo` (§2) + agrupamento
- Copy "inesquecível" (rejeitada no veredito) REMOVIDA; nova copy transacional
  + answer capsule + CTA.
- **Headings viram LINKS:** h2 da categoria nível-1 → LP; h3 da subcategoria →
  LP (prop `href` nova no `CatalogSection`).
- **NFC:** as pastas do macOS vêm em NFD; `CatalogList` normaliza os dois lados
  antes de casar a ordem curada (bug antigo: categoria com acento sumia porque
  a ordem estava em NFC e a chave em NFD). SEM busca (proibição do brief).
- "Pasta X" (só `category.json`, zero produto) não aparece — walk() só coleta
  quem tem `metadata.json`.

### Decisões / ambiguidades resolvidas (sem perguntar, pelo espírito do brief)
1. **"+ Adicionar ao orçamento" (carrinho, §4.5) adiado:** QuoteCart/Drawer é
   fase 2 da spec (ainda não existe). Em vez de um botão que não faz nada, a
   ação secundária do produto é `Tirar uma dúvida no WhatsApp` (honesto e
   funcional). Registrado como pendência.
2. **Consoles ganharam ocasião (infantil + adulta):** o mapa default do §3.4
   não citava Consoles → PS5/Xbox/Wii ficavam sem "vai bem em" e fora de TODA
   fileira da home. PS5 em festa (infantil e adulta) é fato, não invenção;
   estendi o fallback de `occasions.ts`. Override do dono continua valendo.
3. **Preço sempre no estado-SEM:** nenhum produto tem preço assinado (gate
   1.6) → todo produto/categoria usa a linha honesta + /quanto-custa. O estado
   COM já está codado, liga sozinho quando o dono preencher.
4. **Título do produto:** usei a forma transacional pedida no estágio
   (`...para Festas e Eventos`) em vez do `Aluguel de {Produto}` cru do §4.3
   (mais keyword/intenção; o resto do §4.3 — badge + linha de spec — ficou).

### Pendências (fora do escopo deste estágio)
- **Specs curados dos 15 top** (planilha do dono, checklist item 7): hoje só
  as dimensões auto-derivadas aparecem; voltagem, jogadores, idade, peso,
  passa-porta/elevador só entram quando o dono preencher `specs{}`.
- **LQIP por imagem do produto:** a galeria usa `priority` na 1ª + bg neutro;
  placeholder base64 por foto = fase 6.
- **QuoteCart/Drawer (carrinho → wa.me multi-item):** fase 2.
- **/festas, /quanto-custa:** ainda 404 (nascem no estágio de páginas); os
  links de produto/categoria já apontam pro destino final (forward-compat).
- Órfão novo deixado de propósito: `CatalogGrouped.server.tsx` (não importado).

Build: `npm run build` verde (83 páginas) + 3 audits verdes (fake/sitemap/raw).
Gates conferidos no HTML exportado — produto (PS5): H1 transacional, capsule,
ficha `<th scope="row">` com dimensão real, Product+additionalProperty+LeaseOut,
FAQPage + 4 `<details>`, BreadcrumbList, telefone + wa.me, garantia, vai-bem-em.
Categoria (pinballs): capsule, CTA acima da dobra, tabela comparativa (3 itens),
bloco de preço, FAQPage, CollectionPage. Produto sem medida (Karaoke): ficha
omitida (§1.3). Hub: headings-link + ordem curada NFC.
