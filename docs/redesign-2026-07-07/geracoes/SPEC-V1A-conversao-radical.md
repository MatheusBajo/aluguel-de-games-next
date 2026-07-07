# SPEC V1A — CONVERSÃO RADICAL

**Redesign total · Aluguel de Games (alugueldegames.com.br) · 07/07/2026**
Ângulo: o site inteiro é uma máquina de gerar conversa qualificada no WhatsApp a partir de Google Ads. Answer-first, quase landing page multi-seção, ousadia > tradição.
Contrato-base: `docs/redesign-2026-07-07/BRIEF-REDESIGN.md` (todos os gates 1.1–1.7 são assumidos como cumpridos por esta spec; onde a spec toca num gate, o gate é citado).

---

## 1. CONCEITO

**Em 3 frases:**

1. O site não é um catálogo com botão de contato: é um **compositor de mensagem de WhatsApp com um catálogo dentro** — cada scroll, card e FAQ existe pra que o cliente chegue no botão verde com data, bairro e itens já na mensagem.
2. Toda página responde as 3 perguntas do cliente **na primeira dobra do celular** (o que tem → quanto custa/como orçar → como funciona), com a prova verificável (1993 + Bradesco/Spotify/Arnold Classic/Gentili) servida em HTML cru que ChatGPT/Perplexity conseguem citar.
3. A home vira uma **LP mestre de ~8 dobras** e cada categoria vira uma LP autônoma de Ads com a mesma anatomia — o site inteiro é um sistema de landing pages que compartilham um único motor de conversão (`<WhatsAppCta>` + carrinho de orçamento localStorage).

**Por que ganha dos concorrentes:**

- **Nenhum dos 9 concorrentes** responde preço, specs ou processo no HTML. 7 de 9 escondem preço; zero publicam dimensões/tomada/porta; zero têm answer capsule ou FAQ estruturada. A gente responde tudo isso na primeira dobra e em `<details>` indexável → featured snippet + citação por IA num terreno 100% vago (confirmado jul/2026).
- **Fun Play tem prefill por produto; ninguém tem orçamento multi-item.** O carrinho de orçamento → wa.me (padrão Goodshuffle Wishlist, zero backend) faz o lead chegar com 2-3 itens + data + bairro na primeira mensagem: lead mais caro de imitar do nicho.
- **"Desde 1993" bate todo mundo** (Dalbrin 31, Freitas ~30, Mega Power ~28, MC ~22, Fun Play ~20, Alugue Games ~11) e vira o selo de risco-zero colado em cada botão verde, não um parágrafo institucional que ninguém lê.
- **Velocidade de LP**: static export + hero CSS-first + AVIF = CWV verde onde concorrente carrega slider de 4MB. QS ≥ 7 com o mesmo orçamento de mídia = clique mais barato.

---

## 2. ARQUITETURA DE PÁGINAS (sitemap proposto)

Estrutura ENXUTA: 11 templates, ~85 URLs. Cada página tem UM papel de aquisição declarado. Regra transversal: toda página é uma LP completa (answer capsule → oferta → preço/como orçar → prova → FAQ → CTA), porque tanto o Ads quanto a IA quanto o Google podem aterrissar o usuário em QUALQUER uma.

```
/                                LP MESTRE (brand + head terms "aluguel de games")
/catalogo                        Hub índice (navegação + SEO interno, não destino de Ads)
/catalogo/fliperamas             ┐
/catalogo/videokes               │ 7 CATEGORIA-LPs = destinos primários de Ads
/catalogo/realidade-virtual      │ (1 ad group : 1 página; H1 = keyword)
/catalogo/consoles-ps5-xbox      │ slug PLANO, sem nível intermediário
/catalogo/maquina-de-danca       │ "jogos-eletronicos" na URL
/catalogo/maquina-de-pegar-bichinho │
/catalogo/jogos-de-mesa          ┘
/catalogo/{produto}              ~60 fichas de produto (SEO long-tail + suporte à decisão)
/quanto-custa                    LP de intenção nº1 do mercado (gap: 7/9 escondem preço)
/como-funciona                   Referência do nicho: processo, prazos, chuva, defeito (HowTo)
/festas                          LP B2C: aniversário adulto/infantil, bodas, 60-70-80 anos
/empresas                        LP B2B: SIPAT, confra, ativação (campanha própria)
/galeria                         Prova visual: álbuns POR EVENTO nomeado
/sobre                           Fatos datáveis 1993→hoje (E-E-A-T + frase citável)
/contato                         Rede de segurança (form + tel + wa.me + NAP)
/regiao/osasco                   ┐ MÁXIMO 4, SÓ com 40-60% conteúdo único real
/regiao/sao-paulo                ┘ (nasce com 2; +alphaville-barueri/abc se provarem)
```

**Papel de cada URL por canal:**

| URL | Google Ads | SEO orgânico | GEO/IA |
|---|---|---|---|
| `/` | brand + genérico "aluguel de games sp" | head terms, sitelinks | frase factual citável + capsule mestre |
| `/catalogo/{7 categorias}` | **destino primário** (1 ad group cada) | "aluguel de fliperama sp" etc. | capsule + tabela comparativa + FAQ própria |
| `/catalogo/{produto}` | não recebe Ads (QS baixo) | long-tail "alugar fliperama snack" | ficha técnica em tabela = chunk extraível |
| `/quanto-custa` | ad group "preço/quanto custa" | featured snippet alvo | resposta canônica de preço do nicho |
| `/como-funciona` | não | "como funciona aluguel de fliperama" | HowTo schema + política de chuva/defeito |
| `/festas` | ad group "festa infantil/aniversário" | "brinquedos pra festa adulto" | capsule B2C |
| `/empresas` | ad group B2B "sipat/confraternização" | "games evento corporativo" | capsule B2B + dimensionamento em tabela |
| `/galeria`, `/sobre` | não | E-E-A-T, imagem | evidência nomeada que IA verifica |
| `/regiao/*` | geo-bid reforço | "aluguel de games osasco" | menção local (Foursquare/GBP linkados) |

**Migração de URL (uma vez, definitiva):** os slugs aninhados atuais (`/catalogo/jogos-eletronicos/fliperamas/` etc.) ganham **301 no `.htaccess`** pros slugs planos. Slugs curtos de campanha (`/fliperama`, `/videoke`, `/vr`, `/consoles`, `/danca`, `/garra`, `/sinuca`) continuam como 301 → categoria-LP. Produto permanece com slug próprio NFC normalizado. **UM dono de sitemap**: `app/sitemap.ts` reescrito (slugs normalizados via `slug-utils`, TODAS as rotas), `public/sitemap.xml` commitado e postbuild `next-sitemap` morrem (gate 1.3).

**Morre junto (gate 1.1/1.3):** `sales-utils.ts` + 3 render points, badge "1" do float, "98%", `StarRating` órfão, `robots.txt` corrompido (fica `robots.ts`), `ADMIN.md`, deps Sanity do bundle (decisão desta spec: **remover agora, religar pós-launch se o dono quiser editar specs/locações** — não ficar no meio).

---

## 3. HOME — LP MESTRE, DOBRA POR DOBRA (mobile-first)

Princípio radical: a home é desenhada no viewport de 390px primeiro; desktop é a versão espaçada dela. Nenhuma dobra existe "porque site tem". Ordem fixa do brief: oferta → preço/como orçar → como funciona → prova → CTA.

### Dobra 1 — HERO RESPOSTA (100svh máx, pinta sem JS)

- **Answer capsule como sub do H1** (gate 1.4): é o primeiro texto do `<body>`.
- H1 (server-rendered, CSS-only reveal): **"Fliperama, videokê e games na sua festa. A gente entrega, monta e busca."**
- Sub/capsule (40-80 palavras): a frase factual citável — ver copy §9.3.
- **Trust strip verificável** logo abaixo (texto, não logo-wall): `Desde 1993 · milhares de eventos [PLACEHOLDER: dono confirma nº real] · Bradesco · Spotify · Arnold Classic · Danilo Gentili` + `★ {nota} no Google` linkando o GBP `[PLACEHOLDER: nota/link]`.
- **CTA dual**: botão verde `Pedir orçamento no WhatsApp` (prefill home, ver §9.2) + ghost `Ver o que tem ↓` (scroll âncora). Sob o botão verde, em texto ≥12px: `ou ligue (11) 96526-1000` com `tel:` rastreado.
- Visual: UMA imagem estática de evento real como LCP (`<img>` priority, AVIF, dimensões fixas, LQIP) com legenda dentro do scrim: `"Aniversário do Danilo Gentili"`. O carrossel autoplay SAI do hero (vira a Dobra 6 de prova). Hero estático = LCP < 2.5s garantido + zero CLS.
- Mobile: H1 + capsule + trust strip + CTA cabem em 1 tela; imagem como fundo com scrim, não bloco separado.

### Dobra 2 — O QUE TEM (7 categorias, escaneável em 5 segundos)

- H2-pergunta: **"O que dá pra alugar?"**
- Grid 2 colunas mobile / 4 desktop de **cards de categoria**: foto real, nome, 1 linha de fato (`"até 11.000 jogos"`, `"+30.000 músicas"`), contagem real de itens vinda do metadata.json (`"12 modelos"`). Link pra categoria-LP.
- Oitavo card: `Catálogo completo →` (/catalogo).
- Sem CTA verde aqui: essa dobra é navegação. Verde é exclusivo de ação WhatsApp (gate 1.2).

### Dobra 3 — QUANTO CUSTA (a dobra que nenhum concorrente tem)

- H2-pergunta: **"Quanto custa alugar?"**
- 3 linhas honestas em HTML cru: o que influencia o preço (equipamento, período da diária, região de entrega), período padrão da diária, e faixas `[PLACEHOLDER: dono confirma]`. Se faixas não vierem: versão B com "como calculamos em 4 fatores" — as duas versões desenhadas, nenhuma parece quebrada (gate 1.6).
- Link forte: `Entenda o orçamento completo → /quanto-custa`.
- CTA verde secundário: `Pedir preço da minha festa` (prefill com lacunas Data/Bairro/Convidados).

### Dobra 4 — MONTE SEU ORÇAMENTO (a aposta radical da V1A)

- H2: **"Monte seu orçamento em 30 segundos"**.
- Widget client-side (localStorage, zero backend): 3 passos inline na própria home:
  1. chips de itens populares (Fliperama, Videokê, PS5, Máquina de dança, Garra, Sinuca, VR) — multi-select;
  2. data da festa (obrigatória) + bairro/cidade + nº convidados (opcionais);
  3. botão verde `Enviar no WhatsApp` → gera wa.me multi-linha (ver §9.2).
- É o MESMO mecanismo do carrinho de orçamento global (drawer): a home embute o formulário; cards de produto alimentam o mesmo estado via `+ Adicionar ao orçamento`.
- Progressive enhancement: sem JS, a dobra degrada pra CTA verde com prefill genérico + `tel:`. O conteúdo SEO da página não depende do widget.
- GA4: cada passo emite evento; clique final = conversão candidata (com regra 20s+ na página).

### Dobra 5 — COMO FUNCIONA (4 passos, inline)

- H2-pergunta: **"Como funciona o aluguel?"**
- 4 passos numerados em cards horizontais (scroll-snap no mobile): `1. Você chama no WhatsApp` → `2. Fechamos data e valor (contrato e NF)` → `3. Entregamos e montamos antes da festa` → `4. Buscamos depois. Deu problema? Trocamos ou técnico no local` `[PLACEHOLDER: garantia redigida com o dono — formalizar o que ele já pratica]`.
- Link `Detalhes, prazos e política de chuva → /como-funciona`.

### Dobra 6 — PROVA (nomes reais, zero número inventado)

- H2: **"Quem já contratou"**.
- Carrossel manual (sem autoplay) das fotos de evento com legenda nomeada: Bradesco·Braland, Spotify, Arnold Classic, Danilo Gentili — cada slide linka o álbum na /galeria.
- Bloco 1993: numeral gigante `1993` (outline neon) + claim: **"Desde 1993. Alugando games antes do PlayStation existir."** + 1 parágrafo de fatos datáveis + link /sobre.
- Botão `Ver avaliações no Google →` (GBP) `[PLACEHOLDER: link]`. Nenhuma review renderizada no site (gate do dono).

### Dobra 7 — FAQ (HTML nativo, GEO)

- H2: **"Perguntas de quem tá fechando"** — 6 itens em `<details>/<summary>` (NUNCA Radix fechado): chuva, sinal/cancelamento, período da diária + hora extra, horário de montagem, elevador/escada/porta, tomada 110/220. FAQPage schema espelhando o texto 1:1.

### Dobra 8 — CTA FINAL + FOOTER

- Repetição do CTA dual + telefone. Footer: NAP completo, **CNPJ, LGPD/privacidade** (gate 1.5), links das 7 categorias + páginas, GBP/Instagram, horário.
- **Sticky bottom bar mobile (global)**: barra fina com `WhatsApp` (verde, prefill da página atual) + `Ligar`. Substitui o float bolha em telas <768px (resolve a convivência float×conteúdo; sem badge fake). Desktop mantém float limpo sem badge.

---

## 4. PÁGINA DE PRODUTO (`/catalogo/{produto}`) — mini-LP de decisão

Papel: converter quem já sabe O QUE quer e tirar TODAS as dúvidas de viabilidade (a pergunta nº1 de apartamento: "passa na porta? qual tomada?"). Tudo em HTML cru.

1. **Breadcrumb** (BreadcrumbList schema) + H1 = nome do produto.
2. **Galeria** touch (swipe, sem autoplay, LQIP em toda imagem) — 60% da tela mobile, primeira imagem = LCP priority.
3. **Bloco de decisão** (imediatamente abaixo da galeria, above the fold no mobile):
   - Answer capsule do produto (2-3 linhas: o que é, pra que festa, o que tá incluso).
   - **Fatos verificáveis no lugar do contador fake** (gate 1.1): `Entrega e montagem incluídas · Equipamento testado antes do evento · Contrato e NF`.
   - Preço: faixa da categoria `[PLACEHOLDER]` OU link "como calculamos" → /quanto-custa (duas versões desenhadas).
   - CTA verde `Pedir orçamento deste item` (prefill: `"Oi! Vi o *{produto}* no site…"` + lacunas) + `ou ligue (11) 96526-1000` + botão secundário `+ Adicionar ao orçamento`.
4. **Ficha técnica em `<table>`** (extensão do metadata.json, ver §8): dimensões L×P×A, peso, tomada 110/220V, consumo, nº de jogadores, espaço mínimo, **passa em porta 80cm? / elevador?**, itens inclusos. Dado extraível > adjetivo. Nenhum concorrente tem isso.
5. **Descrição** (markdown atual do metadata.json, renderizada server-side).
6. **FAQ do item** (3-4 `<details>` específicos: "precisa de ponto de energia dedicado?", "criança de 5 anos joga?") + FAQPage schema.
7. **Relacionados**: "Quem alugou este também leva" (curadoria manual por categoria no metadata — NUNCA número de locações) — 4 cards com `+ Adicionar ao orçamento`.
8. **Sticky CTA mobile**: barra fixa com preço/faixa (se houver) + `Orçamento no WhatsApp`. Aparece após o usuário rolar além do bloco de decisão (não briga com a galeria touch: galeria fica acima da zona da barra e a barra só monta no scroll — resposta à pergunta (d) do consenso).
9. Schema: `Product` + `Offer businessFunction: LeaseOut` + seller → `#organization`; sem aggregateRating (continua removido até existir review real).

---

## 5. /EMPRESAS — LP B2B, SEÇÃO POR SEÇÃO

Papel: campanha própria de Ads B2B + ranquear "games para evento corporativo". Persona: RH/compras que precisa APROVAR internamente — o design entrega munição de aprovação, não inspiração.

1. **Hero B2B**: H1 `Games para eventos corporativos: SIPAT, confraternização e ativação de marca` + capsule (40-80 palavras, com 1993 + Bradesco/Spotify/Arnold) + CTA dual: verde `Falar com consultor no WhatsApp` (prefill B2B, §9.4) + `Baixar kit de aprovação (PDF)` + tel.
2. **Prova imediata**: strip de cases nomeados em TEXTO (Bradesco·Braland, Spotify, Arnold Classic South America) + foto do case Bradesco com legenda. Logo-wall SÓ com autorização formal `[PLACEHOLDER]`.
3. **Kit aprovação interna (PDF)**: 1 página gerada no build (dados do metadata + config): CNPJ, NAP, o que está incluso, contrato/NF, seguro/responsabilidade `[PLACEHOLDER: dono confirma termos]`, cases. É o artefato que o RH encaminha pro financeiro — nenhum concorrente oferece.
4. **Guia de dimensionamento em `<table>`** (GEO gold): 3 linhas — evento de 50 / 150 / 400 pessoas → nº sugerido de equipamentos, mix recomendado, espaço e energia necessários `[PLACEHOLDER: dono valida mix]`. H2-pergunta: "Quantos equipamentos pro meu evento?"
5. **Ocasiões** (6 cards atuais mantidos: SIPAT, confra, lançamento, team building, workshop, inauguração) — cada card com âncora própria pra sitelink de Ads.
6. **Como funciona B2B**: 4 passos com prazos + **aviso honesto de agenda**: "novembro/dezembro fecham com semanas de antecedência — reserve cedo" (honestidade que converte).
7. **Diferenciais operacionais** (os 6 atuais: NF/contrato, consultor único, equipe no local, pacotes, faturamento, Grande SP) — mantidos, são fatos.
8. **FAQ B2B** em `<details>` + schema: faturamento 30 dias? homologação de fornecedor? seguro? funcionário opera a máquina? evento em shopping/rua?
9. **CTA final** + form curto (telefone OBRIGATÓRIO, e-mail opcional; pós-envio abre wa.me pré-preenchido — gate 1.2).

---

## 6. SISTEMA DE PROVA SOCIAL HONESTO

Inventário COMPLETO do que pode ser dito (e como), auditável por grep:

| Ativo | Onde aparece | Forma |
|---|---|---|
| Desde 1993 (33 anos) | title, OG, hero, badge junto de CADA botão verde, /sobre, JSON-LD `foundingDate` | `Desde 1993` + variação "antes do PlayStation existir" |
| Volume de eventos | trust strip, /sobre | `milhares de eventos` `[PLACEHOLDER: se o dono tiver nº real, ex. "mais de 4.000", entra com fonte]` — NUNCA contador animado partindo de 0, NUNCA hash |
| Clientes nomeados | trust strip, dobra prova, /empresas, /galeria | TEXTO corrido (citável por IA); foto com legenda nomeada; logo só com autorização formal |
| Nota Google | trust strip + botão "Ver avaliações no Google" | número REAL + link GBP `[PLACEHOLDER]`; se dono não confirmar, o slot não renderiza (design prevê os dois estados) |
| Galeria por evento | /galeria | álbum nomeado `"Spotify, 2024 · 6 máquinas"` (padrão PartySlate) `[PLACEHOLDER: dono confirma ano/escopo por álbum]` |
| Garantia anti-risco | como-funciona, produto, FAQ | redigida COM o dono a partir do que já pratica; nunca inventada |
| Badges de card | catálogo | só editoriais honestos: `novo no catálogo`, `mais pedido` (curadoria manual), atributo real `2 jogadores · 1,8m · 220V` |

**Proibições (gate binário, grep-audit):** zero review no site (vivem no GBP), zero %, zero contador fake, zero "online agora", zero badge de notificação falsa. `Counter` nunca renderiza "0+". Todo claim numérico tem fonte ou `[PLACEHOLDER]` visível só no código.

**Rotina do dono (off-site, entregável do projeto):** GBP completo + Bing Places + Foursquare + Apple Maps com NAP idêntico; pedir review Google no fim de cada evento; baseline mensal perguntando às IAs "aluguel de fliperama Osasco".

---

## 7. DIREÇÃO VISUAL

**Tese: manter o dark/neon (consenso, sem toggle claro) mas domesticá-lo a serviço da conversão.** O neon atual é personalidade; o problema é ruído em superfície de decisão. Regra nova: **neon decora, nunca compete com o verde.**

- **Hierarquia de cor de ação:** verde WhatsApp `#25D366` é EXCLUSIVO de ação de conversa (wa.me/tel). Nenhum outro elemento verde no site. Hover `#1EBE5D`, foco com ring ciano. Links/navegação = ciano; editorial/labels = pink; estrutura = purple em opacidade baixa.
- **Paleta (tokens Tailwind v4 `@theme`):**

```css
@theme {
  --color-bg:        #0A0A12;   /* fundo global (quase-preto azulado) */
  --color-surface:   #12121C;   /* cards */
  --color-surface-2: #1A1A28;   /* card elevado / drawer */
  --color-line:      rgb(168 85 247 / 0.16);  /* bordas */
  --color-ink:       #F4F4F8;   /* texto principal */
  --color-ink-soft:  #A6A6BD;   /* secundário — NUNCA abaixo disso em texto informativo */
  --color-whatsapp:       #25D366;
  --color-whatsapp-hover: #1EBE5D;
  --color-neon-cyan:   #22D3EE;  /* links, dados, foco */
  --color-neon-pink:   #EC4899;  /* labels editoriais */
  --color-neon-purple: #A855F7;  /* decoração estrutural */
  --color-fact:        #FACC15;  /* âmbar: preço/faixas e destaques factuais */
}
```

- **Tipografia:** mantém o trio — Bricolage Grotesque (display, headings), DM Sans (body), JetBrains Mono (specs, números, labels). **Piso 12px absoluto**: `.label-arcade` sobe de 0.7rem→0.75rem; abolir `text-muted-foreground/40-60` em texto informativo (opacidade mínima de texto = `--color-ink-soft` sólido). Body mobile 16px.
- **Motion:** entradas `rise-in` CSS-only (server-friendly, já existe) com stagger; carrossel do hero morre (imagem estática); carrosséis restantes são manuais (scroll-snap); numeral 1993 com stroke neon estático (sem count-up de dado de negócio — count-up só no "33 anos", que é aritmética verificável). **`prefers-reduced-motion` é gate**: tudo vira opacity simples.
- **Imagem:** LQIP/cor dominante OBRIGATÓRIO em toda imagem (dark sem placeholder lê como quebrado — gate 1.7); pipeline sharp one-off gera AVIF/WebP + placeholder base64 no build; dimensões fixas sempre (CLS 0). Zero vazios de 300-500px.
- **Assinaturas mantidas do opus-4.8:** corner-brackets, dot-grid, divider-neon, numeral-huge, 404 arcade, dual CTA. Usadas com parcimônia: máx. 1 textura decorativa por dobra.
- **Card de produto, 2 estados desenhados** (gate 1.6): SEM preço = foto + nome + atributo real + fatos; COM preço = faixa em âmbar mono ocupando a linha do atributo, hierarquia redesenhada (nunca badge enfiada, nunca "R$ 0").

---

## 8. CAMADA GEO/AI + SEO TÉCNICO (embutida no design, não bolt-on)

- **Regra do HTML cru como critério de aceite de TODO componente:** `curl $URL | grep` acha telefone, capsule, FAQ, specs e preço em cada template. FAQ = `<details>` nativo; tabs/accordion Radix proibidos em conteúdo SEO (ou `forceMount`+CSS).
- **Answer capsule** (40-80 palavras: o-quê/pra-quem/onde/desde-1993/como-orçar) é o primeiro bloco de texto de: home, 7 categorias, produto (versão curta), /empresas, /festas, /quanto-custa, /como-funciona. Componente `<AnswerCapsule>` server-only, recebe strings do metadata/config.
- **H2 em formato de pergunta** por todo o site (§3-5) + seções autossuficientes (chunk retrieval) + tabelas HTML de specs e dimensionamento.
- **`robots.ts` único** liberando os 10 bots de IA (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Meta-ExternalAgent — cada um com directive própria), `Disallow: /studio/`; `public/robots.txt` deletado (gate 1.3/1.4).
- **JSON-LD server-side** (`<script>` no RSC, padrão já usado): grafo único — `EntertainmentBusiness` na home ganha `hasMap` (GBP) `[PLACEHOLDER]`, `areaServed` com Osasco primeiro; `Product+Offer LeaseOut` no produto; `CollectionPage+ItemList` na categoria; `BreadcrumbList` global; `FAQPage` espelhando cada FAQ visível; `HowTo` em /como-funciona; `dateModified` real (git mtime no build).
- **Extensão do metadata.json** (fonte de verdade, sem CMS): campos novos opcionais por produto — `specs { dimensoes, peso, tomada, jogadores, espacoMinimo, passaPorta80, itensInclusos[] }`, `faq[]`, `capsule`, `badges[]` (enum honesto), `relacionados[]`. Fallback digno quando ausentes (tabela só renderiza linhas existentes).
- **Ads/CWV:** 1 ad group = 1 página; H1 = keyword; CTA verde acima da dobra em toda LP; LCP<2.5s / INP<200ms / CLS<0.1 verificados no PageSpeed mobile ANTES de campanha; conversão GA4 = clique wa.me com 20s+ na página, importada no Ads; reconciliação mensal GA4 × etiquetas WhatsApp.
- **llms.txt** gerado no build (30 min, expectativa zero); canonical absoluto por página; `verification.google` só com código real; OG 1200×630 real por template (WhatsApp = SERP do dark social).
- **Auditorias no CI (scripts npm):** `audit:fake` (grep sales-utils/98%/badge), `audit:raw` (curl|grep por template no export), `audit:sitemap` (zero 404).

---

## 9. COPY DE EXEMPLO (os 5 textos mais importantes)

**9.1 Hero da home (H1 + capsule):**
> **Fliperama, videokê e games na sua festa. A gente entrega, monta e busca.**
> Alugue fliperamas, videokê, PS5, realidade virtual, máquina de dança e jogos de mesa para festas e eventos em Osasco e toda a Grande São Paulo. Você escolhe, a gente entrega montado e testado, com contrato e nota fiscal. Orçamento na hora pelo WhatsApp. Desde 1993.

**9.2 CTA principal (botão + prefill):**
> Botão: **Pedir orçamento no WhatsApp** · sub: `resposta rápida em horário comercial · ou ligue (11) 96526-1000`
> Prefill (home/orçamento): `Oi! Quero um orçamento pra minha festa 🎉\nData: ___\nBairro/cidade: ___\nConvidados: ___\nItens: {itens do orçamento ou "me ajuda a escolher"}`
> Prefill (produto): `Oi! Vi o *{produto}* no site e quero um orçamento.\nData: ___\nBairro/cidade: ___`

**9.3 Claim de idade (frase citável, home + /sobre):**
> **Desde 1993 — alugando games antes do PlayStation existir.**
> A Aluguel de Games loca fliperamas, videokês e games para festas em Osasco e Grande São Paulo desde 1993, com eventos realizados para Bradesco, Spotify, Arnold Classic e Danilo Gentili.

**9.4 Abertura /empresas (capsule B2B):**
> **Games para SIPAT, confraternização e ativação de marca — com NF, contrato e equipe no local.**
> Atendemos eventos corporativos de 50 a 1.000+ pessoas na Grande São Paulo desde 1993: fliperamas, videokê, VR e máquinas de dança, com consultor único do briefing à retirada. Já montamos eventos para Bradesco, Spotify e Arnold Classic. Baixe o kit de aprovação e feche em uma conversa.
> Prefill B2B: `Olá! Sou da empresa ___ e quero orçamento pra um evento corporativo.\nTipo (SIPAT/confra/ativação): ___\nPessoas: ___\nData: ___\nCidade: ___`

**9.5 FAQ destaque (o snippet-alvo, em /quanto-custa e na home):**
> **Quanto custa alugar um fliperama pra festa?**
> O valor depende do equipamento, do período da diária e da região de entrega. A diária padrão cobre `[PLACEHOLDER: período confirmado pelo dono]`, já com entrega, montagem, retirada e suporte inclusos — sem taxa escondida. Fliperamas ficam na faixa de `[PLACEHOLDER: faixa]`; pelo WhatsApp você recebe o valor fechado da sua data em minutos.

---

## 10. ESFORÇO ESTIMADO (1 dev) E PLANO DE CORTE

Ordem respeita a regra de WIP: **fase 0 no ar ANTES de estrutura nova.**

| Fase | Escopo | Dias |
|---|---|---|
| 0 | Gates 1.1-1.3: des-fabricação (deletar sales-utils + render points, badge, 98%), sitemap único, robots.ts, `<WhatsAppCta>` + prefill 100% + tel + GA4 | 3 |
| 1 | Motor de conversão: carrinho de orçamento (localStorage + drawer + wa.me multi-linha), sticky bottom bar mobile, tokens/tipografia (piso 12px) | 3 |
| 2 | Home nova (8 dobras, hero estático, widget orçamento, FAQ details) | 3 |
| 3 | Template categoria-LP + 7 instâncias + 301s de migração + capsules/FAQs por categoria | 4 |
| 4 | Produto novo (ficha técnica, sticky CTA, 2 estados de preço) + extensão metadata.json + preenchimento de specs (~60 itens, o grosso do tempo) | 4 |
| 5 | /quanto-custa + /como-funciona elevada (HowTo) + /empresas elevada (PDF kit + dimensionamento) + /festas | 4 |
| 6 | GEO final: llms.txt, JSON-LD completo, auditorias CI, pipeline LQIP/AVIF, CWV pass, OG por template | 2 |
| — | **Total** | **23** |

**Se apertar, cortar nesta ordem (o núcleo de conversão nunca é cortado):**
1. `/regiao/*` (geo-bid do Ads cobre) e `/festas` (home + categorias seguram B2C) — economiza 2 dias.
2. Galeria por evento vira grid simples com legendas (álbuns = v2) — 1 dia.
3. PDF kit aprovação vira seção HTML imprimível — 0,5 dia.
4. Widget de orçamento da home vira só CTA com prefill de lacunas (drawer global fica) — 1 dia.
5. Specs completas só nos 20 produtos mais buscados; resto herda specs da categoria — 1,5 dia.
**Piso irredutível (~17 dias):** fases 0-2 + template de categoria + produto com ficha mínima + /quanto-custa.
**Nunca cortar:** des-fabricação, prefill universal, telefone junto ao CTA, HTML cru, /quanto-custa.
