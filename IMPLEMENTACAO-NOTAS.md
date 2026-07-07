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
