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
