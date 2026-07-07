# SPEC V2B — CATÁLOGO-FIRST (evolução do design-opus-4.8)

Data: 2026-07-07 · Autor: designer de produto sênior (geração V2B)
Contrato: satisfaz 100% dos gates do `../BRIEF-REDESIGN.md`. Onde este doc conflitar com o brief, o brief vence.
Base de código: branch `design-opus-4.8` (working tree atual). Esta proposta é **evolução**, não rewrite: mantém a linguagem Netflix-style dark/neon, o `HomeShell` server-rendered, o grafo JSON-LD limpo e o `whatsapp.config.ts` — e reconstrói a hierarquia em volta do catálogo.

---

## 1. CONCEITO

**Três frases:**
1. O site é a vitrine de produtos mais bem-feita do nicho: quem chega do Google Ads ou do WhatsApp vê EQUIPAMENTO (foto real, spec real, botão verde) em menos de 5 segundos, sem passar por nenhuma dobra institucional.
2. Cada card e cada página de produto é uma mini-landing honesta: specs em tabela HTML crua, FAQ nativa, "+ Adicionar ao orçamento" que vira UMA mensagem de WhatsApp multi-item com data e bairro já preenchidos.
3. A prova ("desde 1993", Bradesco/Spotify/Arnold Classic/Gentili) nunca ganha seção própria acima do catálogo: ela é tempero costurado no hero compacto, nos cards e no rodapé de cada fluxo — presente em todo scroll, dona de nenhum.

**Por que ganha dos concorrentes:** os 9 concorrentes fetchados em jul/2026 têm catálogos-lista (foto + nome + "consulte"), zero specs publicadas, zero preparo GEO e prefill de WhatsApp só na Fun Play. O V2B ataca exatamente esses quatro vazios: (a) é o único catálogo do nicho com ficha técnica extraível (dimensões, tomada, nº de jogadores, passa-na-porta) — a pergunta nº1 de quem mora em apartamento e o dado que LLMs citam; (b) é o único com orçamento multi-item sem fricção (padrão Goodshuffle Wishlist, client-side puro); (c) é o único cujo HTML cru responde "quanto custa" e "como funciona" sem executar JS — terreno GEO 100% vago; (d) tem a prova mais forte do mercado (33 anos, mais antiga que o PlayStation, clientes com nome) usada como fato verificável e não como frufru. Contra a Fun Play (o concorrente mais competente em conversão), vencemos em profundidade de página de produto e em preparo Ads/GEO; contra os demais, vencemos em tudo.

---

## 2. ARQUITETURA DE PÁGINAS (sitemap proposto)

```
/                              Vitrine curada por ocasião (ver §3)
/catalogo                      Hub denso: TODAS as categorias com headings linkados + busca client-side simples (filtro por nome, zero backend)
/catalogo/fliperamas           ┐
/catalogo/videokes             │ 7 LPs de categoria = destinos primários de Ads
/catalogo/realidade-virtual    │ (1 ad group : 1 página; H1 = keyword)
/catalogo/consoles-ps5-xbox    │ Cada uma: answer capsule + grid de produtos +
/catalogo/maquina-de-danca     │ tabela comparativa da categoria + FAQ própria
/catalogo/maquina-de-pegar-bichinho │ + Service/CollectionPage/FAQPage schema + CTA sticky
/catalogo/jogos-de-mesa        ┘
/catalogo/{produto}            Página de produto padrão-ouro (ver §4)
/kits/{festa-teen, confraternizacao, infantil}  3 kits nomeados, escopo fixo (candidatos a preço fechado)
/empresas                      LP B2B elevada (ver §5) — campanha própria
/festas                        NASCE: espelho B2C (aniversário, infantil, bodas 60-70-80)
/quanto-custa                  NASCE: gap nº1 do mercado (7/9 escondem preço)
/como-funciona                 Elevar a referência do nicho: prazos reais, sinal, chuva, HowTo schema
/sobre                         Fatos datáveis (1993→hoje), frase citável, hasMap
/galeria                       Álbuns POR EVENTO nomeado ("Spotify, 2024 · 6 máquinas")
/contato                       Form (tel obrigatório) + pós-envio abre wa.me prefill
/regiao/{osasco, sao-paulo, alphaville-barueri, abc}  MÁX 4, só com 40-60% conteúdo único; senão não nascem
```

**Papel de cada camada:**

| Camada | SEO | Ads | GEO/AI |
|---|---|---|---|
| Home | Brand queries + "aluguel de games" head term | Destino de campanha de marca só | Frase factual citável + answer capsule; primeira página que bots leem |
| Categorias (7) | Queries transacionais ("aluguel de fliperama sp") — o coração do SEO | **Destinos primários** (1 ad group : 1 categoria; H1 = keyword) | Answer capsule + tabela comparativa + FAQPage por página = chunks citáveis |
| Produto | Long-tail ("aluguel fliperama snack machine") | Sitelinks e anúncios de produto específico | Ficha técnica em tabela = dado extraível que nenhum concorrente tem |
| /quanto-custa | Featured snippet "quanto custa alugar fliperama" | Destino pra queries de preço (alto intent) | Alvo nº1 de citação por IA (pergunta mais feita aos motores) |
| /empresas, /festas | "aluguel de games evento corporativo", "brinquedos festa infantil" | Campanhas segmentadas por público | Answer capsules segmentadas por persona |
| /como-funciona | Queries informacionais | Quality score (transparência) | HowTo schema + seções autossuficientes |
| /sobre, /galeria | E-E-A-T, prova indexável | — | Fatos datáveis que LLMs usam pra validar "desde 1993" |

**Morre** (herdado do brief, executado na fase 0): `sales-utils.ts` + 3 render points, badge "1" do float, "98%", `StarRating` órfão, guerra de sitemaps (fica SÓ `app/sitemap.ts` consertado), `public/robots.txt` corrompido (fica `robots.ts`), `ADMIN.md`, deps Sanity do bundle (decisão: REMOVER agora, religar pós-launch se o dono quiser preencher `locacoes` reais).

---

## 3. HOME — seção por seção (mobile-first, ordem de render)

Princípio V2B: **o catálogo começa no 1º viewport e meio.** O hero do opus-4.8 encolhe; tudo que era institucional desce ou vira tempero. Ordem fixa do brief respeitada: oferta → preço/como orçar → processo → prova → CTA.

### 3.1 Hero compacto (server-rendered, pinta sem JS)
- Altura alvo mobile: ≤ 70vh (hoje o hero + stats + trust bar empurram o catálogo pra ~2,5 viewports).
- Badge `★ Desde 1993 · Osasco e Grande SP` (mantém).
- **H1:** "Fliperama, videokê e games pra sua festa. Desde 1993." (keyword na frente; a animação letter-by-letter do opus-4.8 vira `animation` CSS pura com conteúdo presente no HTML — `opacity:0` inicial proibido pro LCP).
- Sub (1 linha): "Entrega, montagem e suporte inclusos na Grande São Paulo."
- **Trust strip verificável** (texto, 12px+, dentro do hero): `Desde 1993 · milhares de eventos [PLACEHOLDER: dono confirma nº real] · Bradesco, Spotify, Arnold Classic, Danilo Gentili · ★ 4,x no Google [PLACEHOLDER: nota + link GBP]` — a nota linka o Maps.
- **CTA dual:** botão verde "Pedir orçamento no WhatsApp" (prefill home: "Oi! Quero um orçamento pra festa. Data: ___ / Bairro: ___ / Convidados: ___") + secundário "Ver catálogo" (âncora pra 3.3). Abaixo, em texto: "ou ligue **(11) 96526-1000**" (`tel:` rastreado).
- Carrossel mantido mas rebaixado: vira faixa de 40vh atrás/abaixo do texto, corner-brackets arcade mantidos, **legenda dentro do scrim** ("Aniversário do Danilo Gentili" é a melhor prova do site). Autoplay pausa com `prefers-reduced-motion`.

### 3.2 Answer capsule (primeiro bloco de texto após o hero)
Parágrafo de 40-80 palavras, HTML cru, sem componente client: o-que / pra-quem / onde / desde-1993 / como-orçar (copy em §9.3). É o chunk que AI Overviews e ChatGPT citam. Testável: `curl / | grep "desde 1993"`.

### 3.3 VITRINE POR OCASIÃO (o coração do V2B)
Substitui as 3 fileiras por categoria técnica (Fliperamas/Máquinas/Consoles) por **3 fileiras curadas por OCASIÃO** — porque o cliente pensa "festa do meu filho", não "jogos eletrônicos nível 2":

| Fileira | Curadoria (via campo `ocasioes[]` no metadata.json) | CTA da fileira |
|---|---|---|
| **Pra festa infantil** | cama elástica, garra, air game, fliperama, consoles | "Ver tudo pra festa infantil" → /festas |
| **Pra festa adulta / retrô** | fliperama multijogos, videokê, sinuca, pebolim, pinball | "Montar minha festa" → carrinho de orçamento |
| **Pra evento de empresa** | VR, máquina de dança, fliperama, kits SIPAT | "Sou empresa" → /empresas |

- Mesmo componente `CatalogSection` (scroll horizontal snap, 3 cards visíveis no mobile), `initialLimit 6`.
- **Card honesto (redesenhado, gate 1.1):** foto LQIP + título + **linha de spec real** ("2 jogadores · 1,8m · 220V" — vem do metadata) no lugar exato onde ficava o contador fake + botão duplo: verde compacto (wa.me prefill do produto) e "+ Orçamento" (adiciona ao carrinho). Badges permitidos: "novo", "mais pedido" [só com confirmação do dono], nunca número.
- Depois das 3 fileiras de ocasião: **régua de categorias** (7 chips linkando as 7 LPs — os links internos que o /catalogo precisava) + fileira "Chegou no catálogo".

### 3.4 Kits nomeados (curadoria antes do paredão)
3 cards grandes: **Festa Teen/Retrô** · **Confraternização/SIPAT** · **Infantil**. Cada um: 3-4 itens com foto, "escopo fixo, orçamento em 1 mensagem", CTA verde com prefill do kit inteiro. (Kits = onde preço fechado entra primeiro se o dono topar, gate 1.6.)

### 3.5 Top 10 mais alugados
Mantém o componente, **sem contador fake** (já removido na fase 0). Ranking editorial do dono [PLACEHOLDER: dono ordena 1x]. Números do rank em fonte mono neon — o número é o RANK, não uma métrica inventada.

### 3.6 Como funciona (compacto, 4 passos)
4 passos numerados em linha (mobile: 2x2): Escolhe no site → Chama no WhatsApp → Entregamos e montamos → Buscamos no dia seguinte. Link "detalhes, prazos e política de chuva" → /como-funciona. Sem vídeo, sem accordion.

### 3.7 Prova (uma dobra só, no fim)
- **Frase factual citável** em texto corrido (copy §9.3) + link /sobre.
- 3 álbuns da galeria com nome de evento ("Bradesco · Braland", "Spotify, 2024", "Danilo Gentili") → /galeria.
- Link "Veja nossas avaliações no Google" → GBP. **Zero seção de depoimentos própria.**

### 3.8 FAQ da home (4 perguntas, `<details>/<summary>` nativo)
E se chover? · Qual o período da diária? · Vocês montam? · Atendem meu bairro? — respostas de 2-3 linhas, FAQPage schema espelhando o texto. HTML cru auditável.

### 3.9 CTA final + footer
Repetição do CTA dual. Footer: NAP completo + CNPJ + link LGPD/privacidade + horários + links das 7 categorias (SEO interno) + Instagram/GBP.

**Float WhatsApp:** mantém, sem badge fake; esconde quando qualquer CTA sticky ou dual está visível no viewport (IntersectionObserver).

---

## 4. PÁGINA DE PRODUTO — padrão-ouro (a página mais importante do V2B)

Rota `/catalogo/{produto}` (slug NFC normalizado). Ordem mobile:

1. **Breadcrumb** (visível + BreadcrumbList schema).
2. **Galeria touch:** scroll-snap horizontal nativo (CSS, não embla — funciona sem JS), dots de posição, LQIP/cor dominante em toda imagem, pinch-zoom via `<img>` padrão. Primeira imagem = LCP com `priority` e dimensões fixas (CLS 0).
3. **H1 = nome do produto** + badge de categoria + linha de spec resumida ("2 jogadores · 1,86m · 110/220V").
4. **Answer capsule do produto** (40-60 palavras: o que é, pra que festa serve, o que está incluso, como orçar).
5. **Bloco de preço (2 estados, gate 1.6):**
   - *Sem preço (default):* card "Orçamento em 1 mensagem" com 3 fatores que influenciam (data, bairro, itens) + link "entenda o preço" → /quanto-custa. Desenhado como feature, não como ausência.
   - *Com preço (se o dono assinar):* "a partir de R$ X / diária" em destaque tipográfico próprio, período da diária explícito ao lado. A hierarquia do card muda deliberadamente (preço vira o elemento nº2 depois do H1).
6. **CTA principal:** verde "Pedir orçamento deste item" (prefill: "Oi! Vi o *{produto}* no site e quero um orçamento. Data: ___ / Bairro: ___") + "+ Adicionar ao orçamento" (outline) + "ou ligue (11) 96526-1000".
7. **Ficha técnica em `<table>`** (a arma GEO): Dimensões montado · Dimensões fechado (transporte) · Passa em porta de 80cm? · Elevador? · Tomada 110/220 · Consumo · Nº de jogadores · Idade recomendada · Espaço mínimo · Peso. Fonte: extensão `specs{}` no metadata.json (fase 1 preenche as ~15 mais alugadas; resto ganha linhas "consulte" honestas). As dimensões que hoje vivem em NOME DE ARQUIVO de imagem ("2,00 Alt x 2,00 Comp...") migram pro campo estruturado.
8. **O que está incluso:** entrega, montagem, retirada, suporte/troca em caso de defeito [redigido com o dono, gate 1.7], contrato e NF.
9. **Descrição** (markdown atual do metadata, mantém).
10. **FAQ do item** (2-4 perguntas específicas, `<details>`): "cabe no meu apartamento?", "precisa de técnico?", "quantas músicas tem?" (videokê) — FAQPage schema.
11. **Relacionados:** fileira "quem alugou este também leva" (curadoria por `ocasioes[]` compartilhada, não algoritmo).
12. **Sticky CTA mobile** (resolve a pergunta (d) do consenso): barra inferior fixa de 56px com "+ Orçamento" (esquerda, outline) e "WhatsApp" (direita, verde, 60% da largura). Aparece após o usuário passar do CTA nº6; o float some enquanto a barra está montada; a galeria fica livre porque a barra só ocupa o bottom edge.

**JSON-LD server-side:** Product + Offer `businessFunction: LeaseOut` (mantém padrão opus-4.8) + `additionalProperty` espelhando a ficha técnica + BreadcrumbList + FAQPage. Sem aggregateRating (continua removido até haver reviews reais — e mesmo assim, do Google, não próprio).

**Página de CATEGORIA** (irmã, resumida): H1 = keyword · answer capsule · grid de cards honestos · **tabela comparativa da categoria** (modelo × jogadores × dimensões × tomada — chunk GEO matador) · FAQ da categoria · CTA sticky · CollectionPage+ItemList+FAQPage schema. Anatomia bate 1:1 com a LP obrigatória do gate 1.5.

---

## 5. /EMPRESAS (B2B) — seção por seção

A página atual (399 linhas) tem os cases certos; elevação = tirar o tom de "landing bonita" e dar ferramentas de aprovação interna. Ordem:

1. **H1:** "Aluguel de games para eventos corporativos" + sub: "SIPAT, confraternização, ativação de marca. Desde 1993, com contrato e NF." CTA dual acima da dobra (prefill B2B: "Oi! Sou da empresa ___ e quero orçamento pra evento corporativo. Data: ___ / Local: ___ / Nº de pessoas: ___").
2. **Answer capsule B2B** (copy §9.4).
3. **Prova imediata:** case Bradesco·Braland (mantém destaque atual) + Spotify + Arnold Classic + vídeo — nomes em texto, logo-wall só com autorização formal [PLACEHOLDER].
4. **Guia de dimensionamento** (tabela HTML): 50 pessoas → 2-3 equipamentos sugeridos · 150 → 4-6 + máquina de dança · 400 → 8+ com operação assistida. Cada linha com link pros produtos. (Nenhum concorrente publica isso; é o chunk que a IA cita pra "quantos fliperamas pra 200 pessoas".)
5. **Kit aprovação interna (PDF estático no /public):** 1 página com CNPJ, razão social, NAP, o que está incluso, contrato/NF, seguro [PLACEHOLDER: dono confirma], fotos de 2 cases. Botão "Baixar kit pra aprovação do financeiro" — remove o atrito real do B2B (convencer o chefe).
6. **Como funciona pra empresas:** 4 passos com prazos reais + **aviso honesto de agenda:** "novembro e dezembro lotam com 30-45 dias de antecedência" [PLACEHOLDER: dono confirma janela].
7. **FAQ B2B** (`<details>` + schema): faturamento/boleto? · NF? · montagem fora de horário comercial? · técnico no local? · seguro/responsabilidade?
8. **CTA final:** WhatsApp + tel + form curto (empresa, telefone OBRIGATÓRIO, e-mail opcional, data); pós-envio abre wa.me pré-preenchido.

---

## 6. SISTEMA DE PROVA SOCIAL HONESTO

**Escada de claims (só estes 3 degraus, nada fora):**
1. **Fato verificável:** "Desde 1993" (title, OG, hero, JSON-LD foundingDate, junto de cada botão verde em contexto de decisão). "Mais antiga do segmento na Grande SP" (bate Dalbrin 31, Freitas 30, Mega Power 28). Ângulo de copy: "mais antiga que o PlayStation". Nomes reais: Bradesco, Spotify, Arnold Classic, Danilo Gentili — sempre em TEXTO, com foto/álbum na galeria como evidência.
2. **Qualitativo honesto:** "milhares de eventos" [PLACEHOLDER: dono confirma se existe número real; se existir, entra COM fonte "nº de contratos desde 1993"].
3. **Delegado ao Google:** nota + reviews vivem no GBP. O site EXIBE "★ 4,x no Google (N avaliações)" [PLACEHOLDER: nota real + link] e pede: "Fez evento com a gente? Avalia no Google" (link direto de review). `hasMap` no LocalBusiness.

**Proibições executáveis (auditáveis por grep no CI):** zero `sales-utils`, zero "98%", zero badge de notificação, zero aggregateRating próprio, zero contador que renderize "0+", zero "Online agora". Substituto no pixel dos contadores: linha de spec real do produto ou trio "Entrega e montagem incluídas · Equipamento testado · Contrato e NF".

**Prova que se mantém sozinha (restrição 1 dev + dono 2h/semana):** galeria por evento cresce 1 álbum por evento grande (dono manda fotos no WhatsApp, Matheus sobe); trust strip e frase citável são estáticas; nada de seção que apodrece vazia (contraexemplo: depoimentos da MC).

---

## 7. DIREÇÃO VISUAL

**Evolução, não ruptura:** o dark/neon arcade do opus-4.8 é consenso e diferencial (todos os concorrentes são branco-bootstrap). O V2B o disciplina a serviço do produto: neon = navegação e ação; a FOTO do equipamento é a estrela.

- **Paleta (tokens Tailwind/CSS já existentes, com adições):**
  - Base: `--background` quase-preto atual, `--card` grafite.
  - `--neon-cyan #22d3ee`, `--neon-pink #ec4899`, `--neon-purple #a855f7`, `--neon-blue #3b82f6` (mantém) → passam a ser **cores de categoria** (fliperamas=pink, videokê=cyan, VR=purple, mesa=blue...), usadas em labels, chips e divisores. Nunca em botão de ação.
  - **NOVO `--whatsapp: #25D366` + `--whatsapp-hover`:** verde é EXCLUSIVO de ação WhatsApp (gate 1.2). Nenhum outro elemento verde no site.
  - Texto informativo: mínimo `--muted-foreground` pleno; **abolir `/40-60`** em texto que carrega informação. ≥12px sempre (mono labels sobem de 6,7px pra 12px).
- **Tipografia:** mantém trio `next/font` — Bricolage Grotesque (display, headlines), DM Sans (body), JetBrains Mono (labels arcade, specs, rank do Top 10). Specs em tabela usam mono: reforça "dado técnico honesto".
- **Motion:** CSS-first. Hero pinta sem JS (keyframes com conteúdo presente, nunca `opacity:0` esperando hidratação). Fileiras: scroll-snap nativo. Micro-interações framer-motion só abaixo da dobra e atrás de `prefers-reduced-motion` (gate). Carrossel autoplay pausável (PauseContext atual mantém).
- **Imagem:** LQIP/cor dominante OBRIGATÓRIO em toda `<img>` (dark sem placeholder lê como quebrado); AVIF/WebP batch via sharp one-off; dimensões fixas (CLS<0.1); corner-brackets arcade mantidos como assinatura em heros/galerias.
- **Componentes-chave novos:** `<WhatsAppCta>` único (variantes: hero/card/produto/sticky/kit — todas com prefill+GA4+tel fallback), `<SpecTable>`, `<AnswerCapsule>`, `<FaqNative>` (details/summary estilizado), `<QuoteCartDrawer>` (localStorage), `<StickyCtaBar>`, `<TrustStrip>`.
- **404 arcade e dual CTA:** mantidos (consenso).

---

## 8. CAMADA GEO/AI + SEO TÉCNICO (embutida no design, não bolt-on)

- **robots.ts único** (deleta `public/robots.txt` corrompido): Allow geral + directive própria por bot de IA (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Meta-ExternalAgent), Disallow `/studio/` pra todos.
- **UM sitemap:** `app/sitemap.ts` consertado (slugs NFC normalizados via `slug-utils`, TODAS as rotas incluindo /empresas /galeria /como-funciona /festas /quanto-custa /kits), `lastmod` real do build. Morrem: postbuild `next-sitemap` e `public/sitemap.xml` commitado.
- **Regra do HTML cru como DoD de todo template:** crawler de IA não roda JS ⇒ answer capsule, specs, preço, FAQ, telefone e frase citável existem no HTML servido. FAQ SEMPRE `<details>/<summary>` (nunca Radix Accordion fechado; se Radix for inevitável, `forceMount`+CSS). **Aceite automatizável:** script `scripts/audit-html.sh` roda `curl $URL | grep` de telefone + capsule + 1 spec em cada template no CI do build.
- **JSON-LD server-side** (`<script>` inline no RSC, padrão atual mantido): grafo único — EntertainmentBusiness `@id` (+`foundingDate:1993`, `areaServed` liderado por **Osasco**, `hasMap`→GBP, `sameAs` GBP/Instagram/wa.me) · Offer LeaseOut + additionalProperty nos produtos · CollectionPage+ItemList nas categorias · BreadcrumbList · FAQPage espelhando FAQs visíveis · HowTo em /como-funciona. `dateModified` real.
- **Answer capsule** (40-80 palavras) como primeiro texto de: home, 7 categorias, produto, /empresas, /festas, /quanto-custa, /como-funciona.
- **H2/H3 em pergunta** ("Quanto custa alugar um fliperama?", "O fliperama passa na porta?") + seções autossuficientes (chunk retrieval) + tabelas de specs (dado > adjetivo).
- **llms.txt** gerado no build (30 min de custo, expectativa zero — nunca como aposta).
- **Ads:** canonical absoluto por página; titles "Aluguel de {X} para Festas e Eventos" keyword-first; OG 1200×630 real por categoria (WhatsApp = SERP do dark social); `.htaccess` mantém 301 www + slugs curtos de campanha (/fliperama, /videoke, /vr); GSC verificado com código real (nunca placeholder); conversão GA4 "clique WhatsApp qualificado 20s+" fechada ANTES de mídia.
- **Off-site (entregável pro dono, fora do design):** GBP completo + Bing Places + Foursquare + Apple Maps com NAP idêntico ao footer; pedir review no fim de cada evento; baseline mensal de citação por IA começa JÁ (antes do redesign ir ao ar).

---

## 9. COPY DE EXEMPLO (tom: direto, sem letra miúda, zero frufru)

**9.1 Hero (H1 + sub):**
> **Fliperama, videokê e games pra sua festa. Desde 1993.**
> Você escolhe no catálogo, a gente entrega, monta e dá suporte na Grande São Paulo. Orçamento em 1 mensagem.

**9.2 CTA principal (botão + linha de apoio):**
> [ 🟢 **Pedir orçamento no WhatsApp** ]
> ou ligue (11) 96526-1000 · resposta no mesmo dia
> *(prefill: "Oi! Quero um orçamento pra festa. Data: ___ / Bairro: ___ / Convidados: ___")*

**9.3 Claim de idade + frase citável (home e /sobre, HTML cru):**
> A Aluguel de Games loca fliperamas, videokês, realidade virtual e games para festas e eventos em Osasco e Grande São Paulo **desde 1993** — antes do primeiro PlayStation existir. São milhares de eventos realizados [PLACEHOLDER: dono confirma nº], incluindo Bradesco, Spotify, Arnold Classic e o aniversário do Danilo Gentili. Orçamento pelo WhatsApp: você manda data e bairro, a gente responde com valor fechado.

**9.4 Abertura /empresas (answer capsule B2B):**
> Games para SIPAT, confraternização e ativação de marca, com contrato, nota fiscal e técnico no local. Atendemos empresas na Grande São Paulo desde 1993 — Bradesco, Spotify e Arnold Classic já fizeram evento com a gente. Diga data, local e número de pessoas no WhatsApp e receba proposta com tudo incluso: entrega, montagem, operação e retirada.

**9.5 FAQ destaque (a resposta que vira featured snippet em /quanto-custa):**
> **Quanto custa alugar um fliperama?**
> O valor depende de três coisas: o equipamento, a data (fim de semana e dezembro lotam antes) e o bairro da entrega. A diária padrão cobre [PLACEHOLDER: dono confirma período, ex. 24h], com entrega, montagem e retirada incluídas — sem taxa escondida. Faixas de referência: [PLACEHOLDER: dono confirma faixas]. Manda data e bairro no WhatsApp que a gente fecha o valor na hora.

---

## 10. ESFORÇO (1 dev, dias úteis) E PLANO DE CORTE

| Fase | Escopo | Dias |
|---|---|---|
| **0 — Gates no ar antes de tudo** (regra WIP) | Des-fabricação (sales-utils + 3 render points, badge, 98%, StarRating) · robots.ts único · sitemap único NFC · `<WhatsAppCta>` com prefill em 100% dos CTAs existentes + tel + GA4 · conserta OG/canonical | **3** |
| 1 — Produto padrão-ouro | `specs{}`/`faq[]`/`ocasioes[]` no metadata.json (15 itens top) · SpecTable · galeria scroll-snap+LQIP · sticky bar · FAQ nativa · JSON-LD estendido · 2 estados de preço | **4** |
| 2 — Categorias-LP + carrinho | 7 LPs com capsule+tabela comparativa+FAQ+schema · QuoteCartDrawer localStorage → wa.me multi-item · audit-html.sh no build | **3** |
| 3 — Home catálogo-first | Hero compacto · fileiras por ocasião · cards honestos · kits · régua de categorias · FAQ home · footer NAP/CNPJ/LGPD | **3** |
| 4 — Páginas novas + B2B | /quanto-custa · /festas · /empresas elevada (dimensionamento + PDF kit) · /como-funciona HowTo · galeria por evento | **3** |
| 5 — Polimento | CWV mobile verde (PageSpeed) · llms.txt · OG por categoria · remover deps Sanity · /regiao (só se sobrar fôlego) | **2** |
| **Total** | | **18 dias** (~4 semanas com folga) |

**Se apertar, corta nesta ordem (o que fica ainda passa em todos os gates):**
1. `/regiao/*` inteiro (geo-targeting do Ads cobre) — já é opcional.
2. `/festas` (fileira "infantil" da home + categoria infláveis seguram a ponta 1-2 meses).
3. Tabela comparativa nas categorias (fica só grid + capsule + FAQ).
4. Kits como PÁGINAS (viram 3 cards na home com prefill multi-item — o mecanismo do carrinho já entrega o valor).
5. PDF kit aprovação B2B (vira bloco de texto com CNPJ na própria página).

**Nunca corta:** fase 0 inteira, specs+sticky do produto, carrinho→WhatsApp, /quanto-custa (é o gap nº1 do mercado e a página GEO mais valiosa), answer capsules, FAQ nativa.
