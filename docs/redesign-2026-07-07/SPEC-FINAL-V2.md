# SPEC FINAL V2 — EVOLUÇÃO DO OPUS-4.8 ("Catálogo por Ocasião, Honesto e Rápido")

Data: 2026-07-07 · Moderador do painel (síntese final)
Base vencedora: **V2B Catálogo-first** (nota mais alta do dono e da persona compradora; único plano que orça as 2h/semana do dono) **com as 3 falhas que a reprovavam corrigidas**: (a) busca REMOVIDA (violação do brief §2), (b) fileiras por ocasião com fallback automático (não dependem de curadoria total), (c) dobra de preço na home (a V2B nunca falava de preço). Enxertos: fase 0 arquivo:linha da V2A, /empresas máquina da V2C + e-mail/relatório da V1C + FAQ operacional da V1A, sticky bar global da V1A, FAQ de garantia da V1B, regra de fallback de placeholder e taxonomia GA4 da V2C, copy de preço da V2A.
Contrato: `BRIEF-REDESIGN.md` (gates 1.1–1.7). Repo: `/Users/matheusbajo/Projetos/WebstormProjects/aluguel-de-games-next` (working tree = `design-opus-4.8`). **Mantém: carrossel no hero (compactado e des-JSificado no primeiro paint), fileiras Netflix, dark/neon, trio tipográfico, grafo JSON-LD do opus-4.8, URLs aninhadas atuais (zero migração).**

**Rejeições explícitas (com motivo):**
- Busca client-side no /catalogo (V2B §2) — item "não ressuscitar" do brief; chips de categoria resolvem 54 itens.
- H1 "…ser inesquecível" (V2C) — adjetivo sem keyword; pior message match das seis.
- Manter Demonstra "como está" (V2A §3.6) — vídeo standalone no meio da escada é pedágio; vídeo vira PROVA (funde na dobra de prova).
- "+ Orçamento" como ícone minúsculo (V2A §3.4) — alvo de toque ambíguo; botão com rótulo.
- Trust strip em "scroll horizontal sem quebrar" (V2C §3.3) — esconde Spotify/Gentili fora da tela; quebra em 2 linhas.
- SLA "resposta no mesmo dia / em 1 dia útil / em minutos" sem placeholder — número de relógio não assinado. Default: "resposta em horário comercial".

---

## 1. REGRAS TRANSVERSAIS (idênticas nas duas specs finais; falhou = não deploya)

1. **Fase 0 cirúrgica (arquivo:linha) no ar ANTES de qualquer pixel novo:** deletar `src/lib/sales-utils.ts` + render points `src/components/catalogo/CatalogCard.tsx:96`, `src/components/sections/top-toys/TopToys.tsx:347`, `CarouselModal.tsx:85-86`; badge "1" de `src/components/WhatsAppFloat.tsx:78-80`; "98%" de `src/components/Main.tsx:118`; "500+/100%" de `src/components/catalogo/ProductInfo.tsx:112-125`; `StarRating.tsx` órfão; `ADMIN.md`.
2. **Todo número (inclusive de tempo e de catálogo) passa pelo dono** ou vira `[CONFIRMAR COM DONO: x]`.
3. **Regra do fallback (V2C §6.4):** todo placeholder tem os dois estados desenhados; slot sem dado NÃO renderiza.
4. **HTML cru como DoD:** FAQ = `<details>/<summary>`; capsule/specs/telefone/preço no HTML servido; aceite `npm run audit:raw`.
5. **Verde = exclusivo WhatsApp/tel.** 6. **Piso 12px; `/40-60` abolido em texto informativo.**
7. **Estado fora-do-horário em todo CTA:** "Atendemos das `[CONFIRMAR: 9h]` às `[CONFIRMAR: 18h]`. Fora do horário? Manda mesmo assim — respondemos no próximo período de atendimento."
8. **2h/semana do dono orçadas** via `DONO-CHECKLIST.md` priorizado (garantia → e-mail/CNPJ → nota Google → diária → specs 15 top → faixas → álbuns → logos).

---

## 2. ARQUITETURA (evolução: 90% existe no branch)

URLs atuais mantidas (aninhadas). `.htaccess` mantido (www + slugs curtos de campanha).

| Rota | Status | Papel |
|---|---|---|
| `/` | reordenar | brand + head terms; vitrine por ocasião |
| `/catalogo` | polir | hub; headings → LINKS de categoria; **SEM busca** |
| `/catalogo/{7 categorias}` | elevar | LPs primárias de Ads (1 ad group : 1 página; H1 = keyword) |
| `/catalogo/{...}/[produto]` | elevar | padrão-ouro: SpecsTable + FAQ + 2 estados de preço |
| `/empresas` (+ `/empresas/kit-aprovacao.pdf`) | elevar | máquina B2B (§5) |
| `/festas` | **nasce** | espelho B2C — NUNCA-CORTA (LP do público que paga o Ads) |
| `/quanto-custa` | **nasce** | gap nº1 do mercado; snippet + citação IA |
| `/como-funciona` | elevar | prazos reais, sinal, chuva, defeito; HowTo (valor GEO, sem promessa de rich result) |
| `/sobre` `/galeria` `/contato` | polir | fatos datáveis / álbuns por evento / form Web3Forms existente |
| `/privacidade` | **nasce** | LGPD (gate 1.5) |
| `/regiao/{osasco,sao-paulo}` | opcional pós-launch | só com 40-60% conteúdo único |

**Morre na fase 0:** sales-utils + render points, badge "1", "98%", "500+", StarRating, `public/robots.txt` corrompido, `public/sitemap.xml` stale, postbuild `next-sitemap` (`package.json:10`), deps Sanity do app (studio/ fica desligado no repo), ADMIN.md.

---

## 3. HOME seção por seção (mobile-first)

### 3.1 Hero compacto (carrossel MANTIDO, LCP resolvido por engenharia)
- **Orçamento explícito do 1º viewport (390×844):** badge + H1 + sub + CTA dual + linha tel. Trust strip e carrossel entram no scroll seguinte — a promessa "tudo em ≤70vh" da V2B não fecha e foi abandonada (crítica procedente do dono).
- Badge `★ Desde 1993 · Osasco e Grande SP`.
- **H1:** `Aluguel de fliperama, videokê e games pra sua festa. Desde 1993.` (keyword na frente; mata o "inesquecível"). Texto presente no HTML desde o build; animação letter-by-letter vira CSS puro (nunca `opacity:0` inicial no LCP).
- Sub: "Entrega, montagem e suporte inclusos na Grande São Paulo."
- **CTA dual:** verde `Pedir orçamento no WhatsApp` (prefill §9.2) + outline `Ver catálogo` (âncora §3.4). Abaixo: "ou ligue **(11) 96526-1000**" + linha fora-do-horário.
- **Carrossel (faixa ~40vh, abaixo do CTA):** mitigação de LCP obrigatória — **slide 1 renderiza server-side como `<img>` estático `priority` + LQIP** (o embla hidrata DEPOIS e assume os 10 slides; sem JS, fica a foto 1); autoplay só pós-hidratação, pausa em `prefers-reduced-motion` e em touch; `sizes` correto; legenda DENTRO do scrim em todo slide ("Aniversário do Danilo Gentili", "Bradesco · Braland"), ≥12px, contraste AA. **Gate de campanha: se PageSpeed mobile der LCP >2.5s na home/LPs após otimização, transplanta-se o hero estático da SPEC-FINAL-V1 (decisão já tomada, sem novo debate).**
- Counters 33+/500+/60+ morrem; único counter do site = **33 anos** (derivado de 1993).

### 3.2 Trust strip verificável (estática, quebra em até 2 linhas; nunca marquee/scroll)
`Desde 1993 · milhares de eventos [CONFIRMAR COM DONO: nº real] · Bradesco · Spotify · Arnold Classic · Danilo Gentili · ★ {nota} no Google [CONFIRMAR: nota+link GBP]` — nota linka o Maps; item sem dado é omitido.

### 3.3 Answer capsule (primeiro texto corrido; copy §9.1). `curl / | grep "desde 1993"` passa.

### 3.4 VITRINE POR OCASIÃO (coração da V2B, com plano de abastecimento corrigido)
3 fileiras curadas (mesmo `CatalogSection`, scroll-snap, `initialLimit 6`):

| Fileira | Fonte | CTA |
|---|---|---|
| **Pra festa infantil** | `ocasioes[]` do metadata OU fallback | "Ver tudo pra festa infantil" → /festas |
| **Pra festa adulta / retrô** | idem | "Montar minha festa" → abre QuoteDrawer |
| **Pra evento de empresa** | idem | "Sou empresa" → /empresas |

- **Fallback automático (corrige a dependência apontada pelo auditor):** `src/lib/occasions.ts` mapeia categoria→ocasião por default (Piscinas/Infláveis/Infantil→infantil; Jogos de Mesa+Videokês+Fliperamas→adulta; VR+Dança+Fliperamas→empresa). `ocasioes[]` no metadata.json é OVERRIDE de curadoria (dono taga os 15 top; erro tipo "sinuca na fileira infantil" se corrige por override). Fileira nunca nasce magra.
- **Card honesto (gate 1.1):** foto LQIP + título + linha de spec real ("2 jogadores · 1,8m · 220V") no lugar exato do contador fake (fallback: "Entrega e montagem incluídas") + botão duplo: verde compacto (wa.me prefill do produto) e **"+ Orçamento" COM RÓTULO** (nunca ícone solto). Badges: `novo` / `mais pedido` `[CONFIRMAR COM DONO]`, nunca número.
- Depois das fileiras: **régua de 7 chips de categoria** (links internos pras 7 LPs) + fileira "Chegou no catálogo" (badge `novo` honesto).

### 3.5 KITS (curadoria antes do paredão) — dados em `src/data/kits.ts`
3 cards: **Festa Teen/Retrô** · **Confra/SIPAT** (→ /empresas) · **Infantil** (→ /festas). Foto real + 3-4 itens em texto + "ideal pra X convidados `[CONFIRMAR]`" + CTA verde com prefill do kit. Preço fechado entra primeiro AQUI se o dono assinar (escopo fixo, gate 1.6); card sem preço não tem buraco.

### 3.6 QUANTO CUSTA (dobra nova — corrige o buraco nº1 da V2B; ABERTA, nunca `<details>`)
H2 "Quanto custa alugar?" + 4 linhas HTML cru: os 3 fatores (equipamento, data, bairro) + "alugando mais de um item junto, o combo sai melhor" (copy V2A) + diária padrão `[CONFIRMAR: horas]` + faixas `[CONFIRMAR COM DONO]` (versão B sem faixas: só fatores+combo, zero número). Link forte `Entenda o orçamento → /quanto-custa` + CTA verde `Pedir o valor da minha festa`.

### 3.7 Top 10 mais pedidos (mantido, limpo)
`TopToys` sem contador (fase 0), sem estrela, **sem `ssr:false`** (`Main.tsx:14` — vira server component ou forceMount; precisa existir no HTML). Ranking = curadoria do dono `[CONFIRMAR: ordena 1x]`. Número mono = RANK. Texto ≥12px (mata os 6,7px).

### 3.8 Como funciona (4 passos compactos, 2×2 mobile)
Escolhe → Chama no WhatsApp → Entregamos e montamos → Buscamos depois. + garantia 1 linha ("Deu problema? Trocamos ou técnico no local — o problema é nosso, não seu `[CONFIRMAR]`"). Link → /como-funciona.

### 3.9 Prova (UMA dobra; funde a seção "Desde 1993" + Demonstra do `Main.tsx`)
- Mata o grid de 4 "valores" (Tradição/Qualidade/... = frufru) e os stats inline.
- 3 cards de evento real (foto + legenda nomeada + 1 linha de contexto `[CONFIRMAR: "Arnold Classic 2025 · ativação com simuladores"]`) → /galeria; 1 vídeo do Demonstra entra AQUI como prova (poster + `preload="metadata"`), o resto da seção de vídeos morre da home.
- Frase citável (§9.3) em `<blockquote>` + numeral 33 + link /sobre + `Ver avaliações no Google →` `[CONFIRMAR: link GBP]`.

### 3.10 FAQ da home (5 `<details>` + FAQPage 1:1)
**Quanto custa alugar? (resumo + link /quanto-custa — a pergunta nº1 ENTRA)** · E se chover? · E se der defeito? (garantia) · Qual o período da diária? · Atendem meu bairro? (lista real de cidades).

### 3.11 CTA final + footer
CTA dual + tel + fora-do-horário. Footer: NAP + **CNPJ `[CONFIRMAR]`** + /privacidade + links das 7 categorias + GBP "avalie a gente" + Instagram + horário.

**Sticky bottom bar global mobile (<768px, enxerto V1A):** UMA barra fixa `WhatsApp` (prefill da página atual; no produto nomeia o produto) + `Ligar`; substitui o float no mobile (float desktop fica, sem badge). Na home aparece após 400px de scroll.

---

## 4. PÁGINA DE PRODUTO — padrão-ouro (V2B §4 com enxertos)

1. Breadcrumb (consertar `#Categoria` → `/catalogo/{slug-categoria}/`) + BreadcrumbList.
2. **Galeria scroll-snap CSS nativa** (substitui embla NESTA superfície; dots de posição; lightbox JS opcional pra zoom — "pinch via img padrão" da V2B não existe, corrigido). LQIP, 1ª imagem priority, dimensões fixas.
3. H1 = "Aluguel de {Produto}" + badge de categoria + linha de spec resumida.
4. Answer capsule do produto (40-60 palavras).
5. **Bloco de decisão:**
   - 3 fatos: `Entrega e montagem incluídas · Testado antes do evento · Contrato e NF`.
   - **Garantia colada aqui (posição V2C):** "Deu defeito? Trocamos ou mandamos técnico no local, sem custo. `[CONFIRMAR]`"
   - Preço 2 estados (gate 1.6): SEM = **1 linha honesta** "O valor fechado depende de data e bairro — manda os dois no WhatsApp" + link /quanto-custa (linha simples; SEM card celebrando a ausência — crítica procedente da mãe); COM = "a partir de R$ X / diária de {N}h" em destaque tipográfico próprio, nunca badge.
   - CTA verde `Pedir orçamento deste item` (prefill) + `+ Adicionar ao orçamento` (outline com rótulo) + tel + fora-do-horário.
6. **Ficha técnica `<table>`:** dimensões montado, dimensões fechado (transporte), **passa em porta de 80cm? / elevador?**, tomada 110/220, consumo, nº jogadores, idade recomendada, espaço mínimo, peso. Fonte: `specs{}` no metadata.json (15 top primeiro; **dimensões que hoje vivem em NOME DE ARQUIVO de foto migram pro campo**). Linha sem dado NÃO renderiza (nada de "consulte" em cascata).
7. **Chips "vai bem em"** (V1C): infantil/adulto/empresa → /festas /empresas.
8. O que está incluso + descrição (markdown atual).
9. FAQ do item (2-4 `<details>` + FAQPage; videokê: "quantas músicas? `[CONFIRMAR]`").
10. Relacionados (curadoria por ocasião compartilhada — nunca "quem alugou também").
11. Sticky bar global assume com prefill do produto; float não renderiza no mobile.
JSON-LD: Product + Offer LeaseOut (padrão opus-4.8 mantido) + additionalProperty + FAQPage + BreadcrumbList, tudo `<script>` inline server (trocar `next/script` de `[...slug]/page.tsx:206,266`). Sem aggregateRating.

**Categoria-LP (7):** H1 = keyword → capsule → CTA dual acima da dobra → **grid de cards (foto primeiro)** → tabela comparativa (só com ≥3 produtos com specs; senão omite) → como funciona resumido → bloco de preço honesto → prova nomeada + link Google → FAQ própria → CTA final; sticky a página toda. CollectionPage+ItemList+FAQPage.

---

## 5. /EMPRESAS — máquina B2B (idêntica à SPEC-FINAL-V1 §5; resumo dos gates)

Estrutura V2C + canais V1C + FAQ V1A. **Gates:** (a) **e-mail corporativo visível + `mailto:` com assunto pré-preenchido** `[CONFIRMAR COM DONO: e-mail]`; (b) tabela de dimensionamento com **linha 151-250 pessoas** (caso mediano de confra) e colunas equipamentos/mix/m²/tomadas/técnicos/montagem `[CONFIRMAR: números]`; (c) **kit PDF NUNCA-CORTA**: 2 páginas, URL estável `/empresas/kit-aprovacao.pdf`, sem e-mail gate, com razão social+CNPJ+NAP (V2B), faixa de investimento `[CONFIRMAR]` com versão sem-faixa desenhada (V1C), modelo de cronograma (V2C), seguro `[CONFIRMAR — sem resposta, kit não menciona]`; (d) FAQ B2B com **"NF de locação"** explicada (locação de bens móveis não emite NFS-e comum) + faturamento 30d + homologação + "funcionário opera?" + montagem fora de horário; (e) **form com destino real via Web3Forms** (padrão de `ContactForm.tsx:51` — entrega por e-mail em static export; pós-envio oferece wa.me como OPÇÃO, dado não evapora); (f) cases com escopo factual `[CONFIRMAR]`; (g) agenda honesta nov/dez `[CONFIRMAR: janela]`; (h) processo com **relatório/fotos pós-evento** como passo final `[CONFIRMAR]`. H1: "Aluguel de games para eventos corporativos em SP". `--glow-scale: .5` nesta página. Schema: Service+FAQPage+BreadcrumbList. GA4 `kit_pdf_download`, `form_submit_b2b`.

---

## 6. /QUANTO-CUSTA · /FESTAS · /COMO-FUNCIONA · /SOBRE · /GALERIA

Iguais à SPEC-FINAL-V1 §6 (mesmo conteúdo, mesma copy §9). Destaques: /quanto-custa com resposta de 50 palavras + tabela de fatores + 2 estados de faixa; /festas com âncoras #infantil/#adulto e NUNCA-CORTA; /como-funciona com HowTo vendido como GEO (sem promessa de rich result); /galeria com álbuns nomeados `[CONFIRMAR: ano/escopo]` e fallback grid com legendas.

---

## 7. DIREÇÃO VISUAL (disciplinar o dark/neon existente)

- Mantém: dark sem toggle, Bricolage/DM Sans/JetBrains Mono (`next/font`), corner-brackets, divider-neon, dot-grid, 404 arcade, dual CTA.
- **Tokens novos em `src/app/globals.css` `@theme`:**

```css
--color-whatsapp: #25D366;  --color-whatsapp-hover: #1EBE5D;  /* EXCLUSIVO ação */
--color-fact: #d4d4d8;            /* texto de prova/specs (zinc-300, ≥12px) */
--color-surface-fact: #18181b;    /* placa técnica */
--trust-accent: /* âmbar atual */ ;  /* badges honestos "novo"/"mais pedido" */
--glow-scale: 1;                  /* /empresas = .5 */
--text-min: 0.75rem;              /* piso 12px */
```

- Neons roxo/rosa/ciano/azul viram **cores de categoria** (labels, chips, divisores) — nunca botão de ação.
- Mono SÓ em specs/tabelas/rank/ano (telefone e preço em DM Sans forte — legibilidade > estética de dado).
- Motion: CSS-first; framer-motion só abaixo da dobra e atrás de `prefers-reduced-motion`; nada anima conteúdo LCP; **orçamento de JS:** `next/dynamic` pros blocos abaixo da dobra (QuoteDrawer, vídeo de prova, Top10 visual) — resposta à crítica "carrega todo o peso do opus-4.8".
- Imagem: LQIP obrigatório (sharp one-off grava `placeholder` no metadata.json), AVIF/WebP, dimensões fixas, alt real.

**Componentes a criar:** `src/components/cta/WhatsAppCta.tsx` (surfaces: home|category|product|empresas|kit|orcamento|festas; prefill+GA4+tel+fora-do-horário) · `src/components/orcamento/QuoteCart.tsx`+`QuoteDrawer.tsx` (localStorage; data obrigatória; wa.me multi-linha) · `StickyBar.tsx` (global mobile) · `AnswerCapsule.tsx` · `SpecsTable.tsx` · `FaqNative.tsx` · `TrustStrip.tsx` · `src/lib/occasions.ts` (mapa categoria→ocasião + override) · `src/data/kits.ts` · `src/components/seo/JsonLd.tsx`.
**Alterar:** `whatsapp.config.ts` (prefills por surface), `CatalogCard.tsx` (spec real + botão duplo), `CatalogSection.tsx` (heading → LINK da categoria), `Main.tsx` (fundir 1993+Demonstra, matar grid de valores, tirar ssr:false), `StartCarousel.tsx` (slide 1 estático server-side), `Footer.tsx`, `Header.tsx` (contador do orçamento), `ProductInfo.tsx`/`ProductGallery.tsx` (padrão-ouro §4).
**Extensão `metadata.json`:** `specs{}`, `faq[]`, `capsule`, `badges[]`, `ocasioes[]` (override), `placeholder`. 15 produtos top primeiro via planilha-template do dono.

---

## 8. SEO/GEO/ADS TÉCNICO (idêntico à SPEC-FINAL-V1 §8)

robots.ts único com os 10 bots de IA + `Disallow: /studio/` (deletar `public/robots.txt`) · sitemap.ts único NFC com TODAS as rotas + aceite `grep -c "<url>"` (matar `public/sitemap.xml` + postbuild) · JSON-LD server-side por página (EntertainmentBusiness foundingDate 1993 + hasMap + Offer LeaseOut + CollectionPage/ItemList + FAQPage + HowTo + BreadcrumbList + dateModified real) · llms.txt no build (expectativa zero declarada) · canonical absoluto · OG 1200×630 real por template · `verification.google` só com código real · CWV verde por LP no PageSpeed ANTES de campanha · conversão GA4 `whatsapp_click` qualificado 20s+ importada no Ads + message assets · taxonomia GA4: `whatsapp_click{surface,product}`, `tel_click`, `orcamento_add`, `orcamento_send`, `kit_pdf_download`, `form_submit_b2b` · audits CI: `audit:fake`, `audit:raw`, `audit:sitemap` (build falha) · off-site no DONO-CHECKLIST.md (GBP+Bing+Foursquare+Apple Maps NAP idêntico; review pós-evento; baseline mensal de citação IA começa JÁ).

---

## 9. COPY PRONTA (PT-BR)

**9.1 Answer capsule home:** igual SPEC-FINAL-V1 §9.1.
**9.2 CTA + prefills:** botão `Pedir orçamento no WhatsApp`; apoio `ou ligue (11) 96526-1000 · atendemos das [X]h às [Y]h [CONFIRMAR]`; prefills home/produto/kit/B2B iguais à V1 §9.2/9.4 (kit: `Oi! Quero orçar o *Kit {nome}*.\nData: ___\nBairro: ___\nConvidados: ___`).
**9.3 Frase citável (verbatim home + /sobre):** igual V1 §9.3.
**9.4 /empresas capsule:** igual V1 §9.4 (com "fatura de locação" e menção ao e-mail).
**9.5 FAQ de preço (home §3.10 + /quanto-custa):** igual V1 §9.5 (inclui "o combo sai melhor").
**9.6 Garantia:** igual V1 §9.6 ("o problema é nosso, não seu" `[CONFIRMAR]`).

---

## 10. ESFORÇO (1 dev) E PLANO DE CORTE

Estimativa realista (a fase 2 de 3 dias da V2B era a menos crível das seis — corrigida):

| Fase | Escopo | Dias |
|---|---|---|
| **0** | Des-fabricação arquivo:linha · robots.ts · sitemap único + aceite · `<WhatsAppCta>` em 100% dos CTAs + tel + GA4 · JSON-LD inline · footer CNPJ/LGPD · **DEPLOY** | 3,5 |
| 1 | Produto padrão-ouro: `specs{}`/`faq[]`/`ocasioes[]` no metadata (15 top, planilha do dono) · SpecsTable · galeria scroll-snap+LQIP · garantia no bloco · 2 estados de preço · JSON-LD estendido | 4 |
| 2 | Carrinho + sticky: QuoteCart/Drawer → wa.me multi-linha · StickyBar global · `occasions.ts` | 2,5 |
| 3 | Home reordenada: hero compacto (slide 1 estático) · vitrine por ocasião · dobra quanto-custa · kits · prova fundida · FAQ · trust strip | 3,5 |
| 4 | 7 categorias-LP (capsule+FAQ+tabela+schema) + `audit-html` no CI | 3 |
| 5 | /quanto-custa · /festas · /empresas máquina (kit PDF + dimensionamento + Web3Forms + e-mail) · /como-funciona HowTo · /privacidade | 4 |
| 6 | Polimento: CWV por LP (gate: LCP>2.5s ⇒ transplanta hero estático da V1) · llms.txt · OG por template · galeria álbuns · remover deps Sanity | 2,5 |
| | **Total** | **23** |

**Corte (nesta ordem — /festas e kit PDF NUNCA-CORTA):**
1. /regiao/* — grátis (já é pós-launch).
2. Tabela comparativa das categorias — 0,5d.
3. Kits viram 3 cards com prefill multi-item (sem `kits.ts` dedicado) — 0,5d.
4. Álbuns da galeria → grid com legendas — 1d.
5. Fileira "Chegou no catálogo" — 0,5d.
**Nunca corta:** fase 0, specs+garantia+sticky do produto, carrinho→WhatsApp, /quanto-custa, /festas, kit PDF + e-mail em /empresas, answer capsules, FAQ nativa, dobra de preço na home.

## 11. O QUE NÃO FAZER (lista fechada)

Busca (qualquer forma) · migração de slug · marquee/scroll na trust strip · contador/percentual/review fabricado · aggregateRating/review próprio · "Online agora"/badge falsa · SLA sem assinatura ("mesmo dia", "1 dia útil", "em minutos") · número de catálogo sem confirmação · card que celebra ausência de preço · "+ Orçamento" como ícone sem rótulo · seção missão/visão/valores · logo-wall sem autorização · Radix Accordion em FAQ · `ssr:false` above-the-fold · autoplay sem slide 1 estático server-side · doorway de cidade · toggle claro · A/B de micro-copy · depender de Sanity pra lançar · vender FAQ/HowTo schema como rich result · duas barras flutuantes simultâneas · texto <12px · fileira de ocasião sem fallback automático.
