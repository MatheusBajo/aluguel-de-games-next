# SPEC V1C — AI-NATIVE

**Redesign total · Aluguel de Games (alugueldegames.com.br) · 07/07/2026**
Ângulo: o primeiro site do nicho desenhado para a era dos agentes. Cada página é uma **resposta estruturada** que humano escaneia em 10 segundos e IA cita palavra por palavra. GEO não é camada por cima: é o princípio organizador do design.

Base: BRIEF-REDESIGN.md (todos os gates 1.1–1.7 são pré-condição desta spec, não escopo dela). Branch de partida: `design-opus-4.8`.

---

## 1. Conceito

**Três frases:**

1. Todo site do nicho fala COM o cliente; este é o primeiro desenhado para ser **lido, extraído e recomendado por máquinas** (ChatGPT, Perplexity, AI Overviews) sem deixar de ser a brochura de um scroll que converte humano no WhatsApp.
2. Cada página segue a mesma anatomia de resposta: **cápsula de 40–80 palavras → fatos extraíveis em tabela → como orçar → prova verificável (1993 + Bradesco/Spotify/Arnold/Gentili) → FAQ nativa → botão verde com mensagem pronta**, tudo presente no HTML cru e espelhado em JSON-LD.
3. A estética evolui o dark/neon atual para um "dark arcade de dados": o monoespaço, o número tabular e o timestamp viram a linguagem visual da honestidade — o site PARECE verificável porque É verificável.

**Por que ganha dos concorrentes:**

| Frente | Concorrentes (Freitas, Mega Power, MC, Fun Play, Alugue Games…) | V1C |
|---|---|---|
| GEO/AEO | ZERO preparo (9 sites fetchados jul/2026: nenhum tem answer capsule, FAQ schema, specs, bots de IA liberados) | Terreno 100% vago; quem estrutura primeiro vira A fonte citada. Custo marginal baixo, fosso alto: copiar exige re-arquitetar o site inteiro |
| Preço | 7 de 9 escondem | /quanto-custa dona da intenção nº1 + snippet + citação IA |
| Specs | Nenhum publica dimensão/tomada/porta | Tabela de ficha técnica em TODO produto (pergunta nº1 de apartamento) |
| Prova | "Qualidade e confiança" genérico ou depoimento vazio | 1993 (mais antiga que todos, mais antiga que o PlayStation) + nomes reais verificáveis + Google Maps linkado |
| Conversão | Botão WhatsApp seco; só Fun Play tem prefill | Prefill contextual 100% dos CTAs + carrinho de orçamento→wa.me + tel de 1ª classe |

O ganho composto: a MESMA estrutura que faz a IA citar (fatos densos, tabela, pergunta-resposta) é a que faz o Google dar snippet, o Ads dar QS alto e o humano decidir rápido. Um investimento, quatro canais.

---

## 2. Arquitetura de páginas

```
/                              Home — vitrine + resposta-mãe ("quem é, o que loca, desde quando, onde")
/catalogo                      Hub de categorias (headings linkados)
/catalogo/{7 categorias}       LPs primárias de Ads + páginas-resposta por intenção
   fliperamas · videokes · realidade-virtual · consoles-ps5-xbox ·
   maquina-de-danca · maquina-de-pegar-bichinho · jogos-de-mesa
/catalogo/{...}/[produto]      Ficha técnica = unidade mínima citável (Product+Offer LeaseOut)
/empresas                      B2B: SIPAT/confra/ativação, kit aprovação, dimensionamento 50/150/400
/festas                        NASCE — espelho B2C (aniversário, infantil, bodas, 60-70-80 anos)
/quanto-custa                  NASCE — a página que o nicho inteiro se recusa a ter
/como-funciona                 Referência do nicho: passos com prazos reais, sinal, chuva, defeito (HowTo)
/sobre                         Fatos datáveis 1993→hoje (linha do tempo, zero missão/visão)
/galeria                       Álbuns POR EVENTO nomeado ("Spotify, 2024 · 6 máquinas")
/contato                       Tel + WhatsApp + form (telefone obrigatório, pós-envio abre wa.me)
/regiao/{osasco,sao-paulo,alphaville-barueri,abc}   MÁX. 4, só com 40–60% de conteúdo único
llms.txt · sitemap.xml (ÚNICO) · robots.ts (bots de IA liberados) · .htaccess (301 + slugs de campanha)
```

**Papel de cada tipo de página nos 3 canais:**

| Página | SEO | Ads | GEO |
|---|---|---|---|
| Home | brand + "aluguel de games sp"; frase factual citável; grafo `@id` raiz | destino de campanha brand only | resposta-mãe: cápsula que define a empresa; a frase que a IA repete |
| Categoria (7) | keywords transacionais ("aluguel de fliperama sp") | **destino primário**: 1 ad group = 1 página, H1 = keyword | resposta por intenção: cápsula + tabela comparativa dos itens + FAQ da categoria |
| Produto | long-tail ("alugar máquina de pegar bichinho") | destino de anúncio dinâmico/DSA | unidade extraível: specs em tabela, Product+Offer, resposta a "cabe no elevador?" |
| /quanto-custa | featured snippet "quanto custa alugar fliperama" | destino de campanha de consideração | citação de preço: IA responde faixa e cita a fonte |
| /empresas | "locação de games eventos corporativos" | campanha B2B própria | resposta B2B: dimensionamento em tabela = dado que agente de compras (humano ou IA) extrai |
| /festas | "brinquedos para festa de aniversário adulto" | campanha B2C sazonal | resposta por ocasião |
| /como-funciona | "como funciona aluguel de brinquedos" | — (suporte de QS) | HowTo estruturado; mata objeções na fonte |
| /regiao (≤4) | pack local complementar ao GBP | geo-targeting aponta pra categoria (não pra doorway) | reforço de `areaServed` com conteúdo único |

**Morre** (herda o brief, sem exceção): `sales-utils.ts` + 3 render points, badge "1", "98%", `StarRating` órfão, guerra de sitemaps (fica só `app/sitemap.ts` CORRIGIDO: slugs NFC kebab-case, todas as rotas; deletar `public/sitemap.xml` e o postbuild `next-sitemap`), `public/robots.txt` corrompido (fica `robots.ts`), ADMIN.md, deps Sanity do bundle (decisão V1C: **remover agora, religar pós-launch se o dono aderir ao painel** — não ficar no meio).

---

## 3. HOME seção por seção (mobile-first, um scroll)

Ordem fixa do brief: o que tem → como orçar → como funciona → prova → CTA. Toda seção pinta sem JS.

**H1. Hero-resposta** *(primeiro viewport inteiro; server-rendered, CSS-first)*
- Badge factual: `★ Desde 1993 · Osasco e Grande SP` (mono, cyan).
- H1: **"Aluguel de fliperama, videokê e games para festas"** — keyword na frente, sem poesia. Sub de 1 linha: "Entrega, montagem e suporte inclusos. A locadora de games mais antiga da Grande SP."
- Carrossel atual mantido (10 slides, corner-brackets), MAS a legenda entra DENTRO do scrim: "Aniversário do Danilo Gentili", "Bradesco · Braland", "Spotify". LQIP obrigatório.
- **CTA dual acima da dobra**: `[🟢 Pedir orçamento no WhatsApp]` (prefill home) + `[Ver catálogo]`. Logo abaixo, em texto ≥12px: "ou ligue **(11) 96526-1000**" (link `tel:` rastreado).
- **Answer capsule** (40–80 palavras) como PRIMEIRO bloco de texto real do HTML, visível, estilo "lead de jornal" (não fine print): quem é, o que loca, pra quem, onde, desde 1993, como orçar. É o que a IA extrai e o humano lê em 5s.

**H2. Trust strip verificável** *(1 linha, mono, scrollável no touch)*
`Desde 1993 · milhares de eventos [PLACEHOLDER: dono confirma nº real] · Bradesco · Spotify · Arnold Classic · Danilo Gentili · ★ {nota} no Google →` (nota real linkando o Maps `[PLACEHOLDER: dono confirma nota/link GBP]`). Nomes em TEXTO. Nenhum contador animado de coisa não verificada.

**H3. Kits nomeados** *(curadoria antes do paredão — 3 cards horizontais no mobile)*
Festa Teen/Retrô · Confraternização/SIPAT · Infantil. Cada card: 1 foto real, 3–4 itens do kit em texto, "+ Adicionar ao orçamento" e CTA verde com prefill do kit. Kits = onde preço fechado entra primeiro se o dono se comprometer (`[PLACEHOLDER: faixa por kit]`).

**H4. Fileiras Netflix por categoria** *(mantidas do opus-4.8)*
7 fileiras, header da fileira = LINK pra categoria ("Fliperamas →"). Card: foto LQIP + nome + **1 linha de spec real em mono** ("2 jogadores · 1,8m · 220V" — o substituto no pixel do contador fake) + "+ Orçamento". Sem estrela, sem contador.

**H5. Top 10 mais pedidos** *(mantido, des-fabricado)*
Ranking editorial assumido: "os que mais saem em festa" (curadoria do dono, honesta). Badge posição em mono. Texto ≥12px (corrigir os 6,7px). Sem número de locações.

**H6. Como funciona em 4 passos** *(resumo, 4 cards numerados)*
Escolheu → Chamou no WhatsApp (orçamento em horas `[PLACEHOLDER: prazo real]`) → Entregamos e montamos → Buscamos depois. Link "ver detalhes, prazos e política de chuva →" pra /como-funciona. CTA verde no fim do bloco.

**H7. Quanto custa (teaser honesto)** *(bloco curto)*
"O preço depende do equipamento, do bairro e da data. Diária padrão de {X}h `[PLACEHOLDER]`. Sem taxa escondida: entrega, montagem e retirada inclusas na Grande SP." → CTA "Entenda o orçamento →" (/quanto-custa) + botão verde.

**H8. Prova: frase citável + galeria mini** *(a seção "Desde 1993" reescrita)*
A frase factual em destaque tipográfico (ver §9.3) + 3 fotos de eventos nomeados linkando /galeria + link /sobre. SEM grid de valores, SEM "98%", SEM counter de satisfação. Um único counter permitido: **33** (anos, aritmética verificável).

**H9. FAQ da home** *(4–6 perguntas, `<details>` nativo)*
Atende onde? Quanto custa? Com quanto tempo reservo? E se chover? Tem nota fiscal? — respostas de 2–3 frases, espelhadas em FAQPage schema.

**H10. CTA final + footer denso**
Bloco verde full-width: "Fala com a gente agora" + prefill + tel. Footer: NAP completo, **CNPJ, LGPD/privacidade**, horário, área atendida por extenso, links pra TODAS as páginas (crawl path), GBP/Instagram.

---

## 4. Página de PRODUTO seção por seção

Template = "ficha técnica que conversa". Tudo no HTML cru.

1. **Breadcrumb** (visível + BreadcrumbList schema).
2. **Galeria** (fotos reais, LQIP, swipe; primeira imagem = LCP com dimensões fixas).
3. **Header do produto**: H1 "Aluguel de {Produto}" + cápsula de 40–60 palavras (o que é, quantos jogam, pra que festa vai bem, onde entrega).
4. **CTA primário**: `[🟢 Pedir orçamento]` com prefill do produto ("Oi! Vi o *{Produto}* no site. Data: ___ / Bairro: ___ / Convidados: ___") + "ou ligue (11) 96526-1000" + `[+ Adicionar ao orçamento]` (secundário, outline).
5. **Ficha técnica em `<table>`** (extensão `specs` no metadata.json): dimensões (C×L×A), peso, tomada 110/220V, nº de jogadores, espaço mínimo, **passa em porta 80cm? / elevador?**, itens inclusos. Estilo mono/tabular (ver §7). Dado faltando = linha omitida, nunca inventada.
6. **Bloco de preço nas DUAS versões** (gate 1.6): SEM preço → "O valor depende de data e bairro. Diária padrão {X}h. Peça agora, respondemos em horas `[PLACEHOLDER]`" + link /quanto-custa (desenhado como afirmação, não desculpa). COM preço (kits/piloto) → "a partir de R$ {N} · diária {X}h" em destaque tipográfico próprio, hierarquia redesenhada (preço vira o primeiro fato da ficha, não badge enfiada).
7. **"Vai bem em"**: chips de ocasião linkando /festas e /empresas (interlinking semântico).
8. **FAQ do item** (`<details>`, 3–5 perguntas específicas: precisa de técnico? monta em quanto tempo? funciona na chuva/área externa? consome muita energia?) + FAQPage schema.
9. **Relacionados** (mesma categoria, 4 cards).
10. **Sticky CTA mobile**: barra inferior fixa `[🟢 Orçamento] [+ Lista]`, `position:fixed` com `env(safe-area-inset-bottom)`; o WhatsAppFloat **não renderiza** neste template (resolve a convivência: sticky bar substitui o float; galeria touch fica livre acima da barra).

Schema: `Product` + `Offer{businessFunction: LeaseOut, seller:@id}` + `additionalProperty` espelhando cada linha da tabela + FAQPage + BreadcrumbList. `dateModified` real do build.

**Categoria (LP de Ads)** usa a mesma espinha: H1 = keyword → cápsula → CTA dual acima da dobra → **tabela comparativa dos itens** (nome, jogadores, espaço, tomada — o "Netflix vira planilha" que IA adora extrair) → grid de cards → como funciona resumido → preço honesto → prova → FAQ da categoria → CTA final. Sticky verde a página toda.

---

## 5. /EMPRESAS seção por seção

1. **Hero B2B** (manter a base atual, tom mais sóbrio): badge "B2B · CNPJ {nº} `[PLACEHOLDER]`", H1 "Locação de games para eventos corporativos em SP". Cápsula: quem atende, desde 1993, NF + contrato, Bradesco/Spotify/Arnold como fato. CTA `[🟢 Falar com consultor]` (prefill B2B: "Olá! Evento corporativo. Empresa: ___ / Data: ___ / Nº pessoas: ___ / Local: ___") + tel.
2. **Prova imediata**: card Bradesco·Braland (existe) + strip Spotify · Arnold Classic · `[PLACEHOLDER: outros com autorização]`. Foto com legenda nomeada.
3. **Ocasiões** (grid atual mantido: SIPAT, confra, lançamento, team building, treinamento, inauguração) — cada uma com 1 frase de dimensionamento, não emoji solto.
4. **Guia de dimensionamento em `<table>`** (novo, âncora GEO da página): 50 / 150 / 400 pessoas → nº de equipamentos sugerido, área necessária, tomadas, tempo de montagem `[PLACEHOLDER: dono valida números]`. É O dado que nenhum concorrente publica e que RH/compras copia pro e-mail interno.
5. **Kit aprovação interna (PDF)**: botão "Baixar kit pra aprovação (PDF)" — 1 página com CNPJ, NF, contrato, seguro/responsabilidades, fotos, faixa de investimento `[PLACEHOLDER]`. Gerado 1x no build, estático. O lead B2B vende a ideia internamente sem depender de call.
6. **Processo B2B em 4 passos**: briefing → proposta com NF/contrato em {X}h → execução com equipe no local → relatório/fotos pós-evento `[PLACEHOLDER: prazos reais]`.
7. **Aviso honesto de agenda**: "Novembro e dezembro lotam com semanas de antecedência. Pra confra de fim de ano, feche até outubro." (honestidade que converte + urgência real, não fake).
8. **FAQ B2B** (`<details>` + schema): faturamento/boleto? contrato e seguro? monta em shopping/escritório? energia necessária? cancelamento?
9. **CTA final** verde + tel + e-mail corporativo.

Schema: `Service` (eventos corporativos) + FAQPage + LocalBusiness ref `@id`.

---

## 6. Sistema de prova social HONESTO

Princípio: **prova = fato verificável ou não entra.** O design tem UMA linguagem visual pra fato (mono, tabular, com fonte/link) — se não dá pra vestir de fato, é frufru e morre.

- **Idade**: "Desde 1993 · a locadora de games mais antiga da Grande SP" — em title, OG, hero, e em MICRO junto de cada botão verde ("Desde 1993 · resposta em horas"). Ângulo de apoio: "mais antiga que o PlayStation" (lançado dez/1994) em /sobre e social.
- **Volume**: "milhares de eventos" `[PLACEHOLDER: dono confirma se existe número real]`. Nunca contador animado de valor não verificado; `Counter` só pro 33.
- **Nomes reais**: Bradesco (Braland), Spotify, Arnold Classic, Danilo Gentili — sempre TEXTO + foto com legenda nomeada na /galeria (álbum "Spotify, 2024 · 6 máquinas"). Logo-wall só com autorização formal `[PLACEHOLDER]`.
- **Reviews**: vivem no Google. O site linka: trust strip "★ {nota} no Google →" + `hasMap` no schema + bloco "Avalie no Google" no footer e na /galeria. ZERO sistema próprio, zero depoimento sem nome-data.
- **Garantia anti-risco**: formalizar o que o dono JÁ pratica ("Deu defeito? Trocamos o equipamento ou técnico no local" + política de chuva/reagendamento `[PLACEHOLDER: redigir com o dono]`) — box padrão perto do CTA em produto/categoria.
- **Auditoria contínua**: grep-audit no CI (`sales-utils|98%|reviewCount|ratingValue`) = build FALHA se número fabricado voltar. A honestidade vira teste automatizado.

---

## 7. Direção visual

**Conceito: "dark arcade de dados".** Mantém o dark/neon (consenso, sem toggle claro), mas muda o papel do neon: de decoração pra **sinalização**. Fundo mais calmo, texto mais claro, neon só em borda/acento/estado. A novidade V1C: a estética de terminal/dados (mono, tabular-nums, labels timestamp) vira a identidade da prova — specs, fatos e trust strip PARECEM dados porque SÃO dados.

**Paleta (tokens Tailwind v4 `@theme`, evolução dos atuais):**

```css
--background: #0a0a0f;          /* quase-preto azulado, base atual mantida */
--surface:    #12121a;          /* cards */
--foreground: #f4f4f5;          /* texto: contraste AA garantido */
--muted-fg:   #a1a1aa;          /* mínimo permitido pra texto informativo (aboli /40-60) */
--neon-cyan:  #22d3ee;          /* acento primário: links, badges factuais, foco */
--neon-purple:#a855f7;          /* acento secundário: divisores, hover */
--neon-pink:  #ec4899;          /* raro: destaque editorial (Top 10) */
--whatsapp:   #16a34a → #15803d;/* VERDE = EXCLUSIVO de ação WhatsApp (gate) */
--fact:       #67e8f9;          /* cor da linguagem de fato (mono): specs, trust strip */
```

**Tipografia** (next/font, mantida do opus-4.8 com papéis endurecidos):
- **Bricolage Grotesque** — display/H1-H2, extrabold, tracking-tight. Só títulos.
- **DM Sans** — corpo. Base 16px; **nada abaixo de 12px em lugar nenhum** (gate).
- **JetBrains Mono** — a fonte da verdade: specs, trust strip, badges, tabelas, telefone, preço. `font-variant-numeric: tabular-nums`.

**Motion:** entrada = `rise-in` sutil (mantido) só acima da dobra; CSS-only pra hero (LCP sem JS). Carrossel: autoplay pausável, `prefers-reduced-motion` desliga TUDO (gate). Nada de glow pulsante em texto corrido; `badge-live` morre junto com a badge "1". Micro-interação permitida: tick verde ao adicionar ao orçamento, contagem do drawer.

**Componentes-chave novos:** `<AnswerCapsule>` (lead de página, tipografia própria), `<FactTable>` (ficha técnica mono), `<TrustStrip>`, `<WhatsAppCta>` (único, prefill+GA4+tel), `<QuoteCart>` (drawer localStorage), `<FaqNative>` (`<details>` estilizado + schema espelhado), `<StickyQuoteBar>` (produto mobile). Imagem: `<Img>` com LQIP/cor dominante OBRIGATÓRIO (imagem sem placeholder no dark = quebrada). 404 arcade mantido.

---

## 8. Camada GEO/AI-friendly + SEO técnico (embutida, não bolt-on)

1. **Regra do HTML cru como DoD de todo componente**: aceite = `curl $URL | grep` acha telefone, cápsula, FAQ, spec e preço/como-orçar em CADA template. Radix Accordion/Tabs PROIBIDOS em conteúdo informativo (só `<details>`/`<summary>` ou forceMount+CSS).
2. **Anatomia de resposta padronizada**: answer capsule (40–80 palavras) primeiro bloco de texto de home, 7 categorias, /empresas, /festas, /quanto-custa, /como-funciona; H2/H3 em formato de pergunta; seções autossuficientes (chunk retrieval: cada seção se sustenta sem o resto da página); tabelas HTML pra todo dado comparável.
3. **Grafo JSON-LD server-side** (no HTML, nunca next/script): `EntertainmentBusiness#organization` (foundingDate 1993, NAP, geo, areaServed Osasco+Grande SP, openingHours, `hasMap`→GBP, sameAs GBP/Instagram/wa.me) referenciado por `@id` em todas as páginas; Product+Offer LeaseOut+additionalProperty no produto; CollectionPage+ItemList na categoria; FAQPage espelhando texto visível; HowTo em /como-funciona; BreadcrumbList em tudo; `dateModified` real do build. Zero duplicação de Organization.
4. **robots.ts**: allow explícito por token — GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Meta-ExternalAgent; disallow /studio/. Deletar `public/robots.txt` corrompido.
5. **UM sitemap**: `app/sitemap.ts` corrigido (slugs NFC kebab-case = os das rotas reais; TODAS as páginas incl. /empresas /galeria /como-funciona /festas /quanto-custa /regiao); matar `public/sitemap.xml` e o postbuild. Canonical absoluto por página; www unificado via .htaccess (mantido); OG 1200×630 real por template (WhatsApp = SERP do dark social).
6. **llms.txt** gerado no build (índice: quem somos, categorias, quanto-custa, contato) — 30 min, expectativa zero, declarado como tal.
7. **Frase factual citável** (home + /sobre, §9.3) — formato sujeito-verbo-fatos que LLM repete inteiro.
8. **Performance/Ads**: hero pinta sem JS; AVIF/WebP dimensões fixas (batch sharp one-off); CWV verde mobile ANTES de campanha; GA4: clique WhatsApp qualificado (20s+) como conversão; reconciliação GA4×etiquetas WhatsApp; GSC verificado de verdade (nunca placeholder).
9. **Off-site (entregável pro dono, checklist de 1 página)**: GBP completo + Bing Places + **Foursquare** + Apple Maps, NAP idêntico ao footer; pedir review Google no fim de cada evento; baseline mensal JÁ: perguntar a ChatGPT/Perplexity/Gemini "aluguel de fliperama Osasco/SP" e registrar quem é citado.

---

## 9. Copy de exemplo (tom: direto, sem letra miúda, zero frufru)

**9.1 Hero (H1 + sub + capsule):**
> **Aluguel de fliperama, videokê e games para festas**
> Entrega, montagem e suporte inclusos na Grande SP. Desde 1993.
>
> *A Aluguel de Games loca fliperamas, videokês, PS5, realidade virtual, máquina de dança e jogos de mesa para festas e eventos em Osasco e toda a Grande São Paulo. Você escolhe no catálogo, chama no WhatsApp e recebe o orçamento em horas. Entregamos, montamos, testamos e buscamos depois. No mercado desde 1993.*

**9.2 CTA principal:**
> 🟢 **Pedir orçamento no WhatsApp**
> ou ligue (11) 96526-1000 · Desde 1993 · resposta em horas
> *(prefill: "Oi! Quero um orçamento. Equipamento: ___ / Data: ___ / Bairro: ___ / Nº de convidados: ___")*

**9.3 Claim de idade (frase citável, home + /sobre):**
> A Aluguel de Games realiza locação de fliperamas, videokês e games para festas em Osasco e Grande São Paulo desde 1993 — antes do primeiro PlayStation existir — com milhares de eventos realizados, incluindo Bradesco, Spotify, Arnold Classic e o aniversário do Danilo Gentili.

**9.4 Abertura /empresas:**
> **Locação de games para eventos corporativos em SP.**
> SIPAT, confraternização, lançamento, team building. Nota fiscal, contrato e equipe no local. Desde 1993 atendendo empresas na Grande São Paulo — Bradesco e Spotify entre elas. Diga data, local e número de pessoas: a proposta chega pronta pra aprovação interna, com PDF pro seu financeiro.

**9.5 FAQ destaque (/quanto-custa e home):**
> **Quanto custa alugar um fliperama?**
> Depende do equipamento, do bairro de entrega e da data. A diária padrão é de {X} horas e já inclui entrega, montagem, retirada e suporte — sem taxa escondida. Fim de semana e dezembro têm mais procura, então reserve antes. Chame no WhatsApp com data e bairro: o orçamento fechado sai em horas. `[PLACEHOLDER: dono confirma diária e faixas]`

---

## 10. Esforço (1 dev = Matheus) e plano de corte

| Fase | Escopo | Dias |
|---|---|---|
| **0. Des-fabricação + fundações** (gates 1.1–1.3; NO AR antes de tudo) | deletar fakes, `<WhatsAppCta>` prefill 100%, tel, GA4, sitemap único, robots.ts, JSON-LD base+hasMap, canonical | 3 |
| 1. Sistema de resposta | AnswerCapsule/FactTable/FaqNative/TrustStrip + specs no metadata.json (7 categorias + ~20 produtos-chave com dono) + FAQ por página | 4 |
| 2. Home + produto + categoria | template novo nas 3 superfícies, sticky bar, duas versões de preço, curl-audit | 4 |
| 3. Carrinho de orçamento | QuoteCart localStorage + drawer + wa.me multi-linha + kits | 2 |
| 4. Páginas novas | /quanto-custa, /festas, /empresas elevada (tabela+PDF), /como-funciona HowTo | 3 |
| 5. Polimento | /sobre /galeria álbuns, /regiao (≤4), llms.txt, CWV, PageSpeed, grep-audit CI, checklist off-site | 3 |
| **Total** | | **~19 dias** (4 semanas com folga) |

**Se apertar, corta nesta ordem** (o núcleo AI-native sobrevive até o corte 4):
1. /regiao (geo-targeting do Ads pra categoria resolve).
2. PDF kit aprovação (vira seção HTML na /empresas).
3. /festas (home + categorias seguram o B2C; nasce depois).
4. Specs completas em TODOS os produtos → só 7 categorias + top 20 produtos.
5. Álbuns da galeria → grid simples com legendas nomeadas.
**Nunca corta:** fase 0, answer capsules, FAQ nativa + schema, prefill, tabela de specs nos top produtos, /quanto-custa (é o diferencial inteiro).
