# SPEC V2A — "Polish & Conversão" (evolução do design-opus-4.8)

Data: 2026-07-07 · Autor: designer de produto sênior (geração V2A)
Base: branch `design-opus-4.8` como está no working tree. Estratégia: **mexer o mínimo na estrutura, maximizar conversão + GEO**. Mantém carrossel hero, fileiras Netflix, dark/neon, Bricolage/DM Sans/JetBrains. Tudo aqui referencia arquivos reais do repo.

---

## 1. Conceito

1. **O site é a vitrine de um vendedor de WhatsApp com 33 anos de estrada**: cada tela responde, nessa ordem, "o que tem → quanto custa/como orçar → como funciona → quem já contratou" e termina num botão verde que abre conversa já preenchida com o contexto da página.
2. **A prova não é adjetivo, é fato datável**: "desde 1993" + Bradesco, Spotify, Arnold Classic e Danilo Gentili em texto cru no HTML, repetidos na mesma frase citável em todas as superfícies, pra virar a resposta que ChatGPT/Perplexity/AI Overviews dão quando alguém pergunta "aluguel de fliperama em SP".
3. **V2A não redesenha, afia**: mantém a identidade dark/neon arcade do opus-4.8 (que já é a melhor do nicho) e gasta o esforço onde o dinheiro passa: des-fabricação, prefill contextual, ficha técnica em tabela, /quanto-custa, carrinho de orçamento e HTML cru pra crawler de IA.

**Por que ganha dos concorrentes:** Freitas/Mega Power/MC/Fun Play têm sites de 2015: sem specs, sem preço, sem prefill decente, zero GEO, prova social genérica. Nós somos os únicos com (a) claim de idade que bate todos (1993 > Dalbrin 31 > Freitas 30...), (b) nomes verificáveis nível Bradesco/Spotify, (c) página de preço num nicho onde 7 de 9 escondem, (d) HTML legível por IA num terreno 100% vago. O Fun Play tem prefill por produto; a gente entrega prefill por produto + lacunas Data/Bairro/Convidados + carrinho multi-item, que chega no WhatsApp do dono como lead já qualificado.

---

## 2. Arquitetura de páginas (sitemap proposto)

Evolução, não revolução: 90% já existe no branch. Nasce o que o brief manda, morre o que fabrica.

| Rota | Status | Papel SEO | Papel Ads | Papel GEO |
|---|---|---|---|---|
| `/` | polir | head terms "aluguel de games sp" | destino de brand/genérica | answer capsule + frase citável nº1 |
| `/catalogo` | polir | hub interno, headings→links de categoria | — | ItemList completo em HTML |
| `/catalogo/{7 categorias}` | elevar | LPs primárias ("aluguel de fliperama sp"…) | **1 ad group : 1 página**, H1 = keyword | capsule + FAQ própria + Service schema |
| `/catalogo/[produto]` | elevar | long-tail (nome do equipamento) | destino de shopping-like/DSA | **tabela de specs** (dado extraível) |
| `/empresas` | elevar | "entretenimento evento corporativo sp" | campanha B2B própria | capsule B2B + case nomeado |
| `/festas` | **nasce** | "atrações festa aniversário/infantil sp" | campanha B2C própria | espelho B2C do /empresas |
| `/quanto-custa` | **nasce** | featured snippet "quanto custa alugar fliperama" | destino de query de preço | página mais citável do site |
| `/como-funciona` | elevar | "como funciona locação de brinquedos" | quality score (transparência) | HowTo schema + prazos reais |
| `/sobre` | polir | E-E-A-T, fatos datáveis 1993→hoje | — | frase citável nº2 + dateModified |
| `/galeria` | polir | image SEO por evento nomeado | prova pra LP linkar | álbuns "Spotify, 2024 · 6 máquinas" |
| `/contato` | polir | NAP consistente | extensão de local | telefone/endereço em HTML cru |
| `/regiao/{osasco,sao-paulo}` | opcional pós-launch | local pack | geo-campanhas | máx. 4, só com 40-60% conteúdo único |

**Morre:** `src/lib/sales-utils.ts` + 3 render points, badge "1" (`WhatsAppFloat.tsx:78`), "98%" e contador "500+" (`Main.tsx:108-120`), "500+/100%" do `ProductInfo.tsx:112-125`, `StarRating.tsx` órfão, `app/sitemap.ts` atual (URLs cruas com acento) E `public/sitemap.xml` stale (fica UM: `sitemap.ts` reescrito com `segmentsToSlug` + todas as rotas), `public/robots.txt` corrompido (vence `robots.ts` reescrito), `ADMIN.md`, deps Sanity do `package.json` do app (studio/ fica no repo, desligado, decisão pós-launch).

**Nasce:** `<WhatsAppCta>` único, carrinho de orçamento (localStorage), `/festas`, `/quanto-custa`, kits (3: Festa Teen/Retrô, Confra/SIPAT, Infantil) como entradas curadas no metadata.json, campo `specs` e `faq` no schema do metadata.json, `<SpecsTable>`, `<FaqBlock>` (`<details>` nativo), `<AnswerCapsule>`, `llms.txt` no build, seção "chegou no catálogo" com badge honesto ("novo").

---

## 3. HOME seção por seção (mobile-first, ordem = escada de convicção)

A home atual (`src/app/page.tsx` + `HomeShell` + `Main.tsx`) já tem a espinha certa. V2A reordena e poda. Ordem final do scroll:

### 3.1 Hero (mantém carrossel, aperta a promessa) — 1º viewport
- Badge "★ Desde 1993 · Osasco e Grande SP" (adiciona Osasco: local pack + honestidade NAP).
- H1 mantido no espírito, reescrito transacional: **"Aluguel de fliperama, videokê e games para festas"** + linha animada menor "sua festa inesquecível" (a keyword entra no H1, o charme fica no sub). H1 pinta sem JS: `AnimatedHeadline` só anima depois de hidratar, texto presente no HTML desde o build (regra `opacity:0` não conta pra LCP).
- Carrossel embla mantido (10 slides), MAS: legenda dentro do scrim em todo slide ("Aniversário do Danilo Gentili", "Bradesco · Braland") ≥12px, `sizes` correto, primeiro slide `priority` + LQIP.
- **CTA dual abaixo do hero (mantido)**: "Pedir orçamento" verde (prefill home: "Oi! Quero um orçamento pra minha festa. Data: ___ / Bairro: ___ / Convidados: ___") + "Ver catálogo" outline. Logo abaixo, em texto: "ou ligue **(11) 96526-1000**" com `tel:` rastreado.
- **Trust strip substituindo os Counters fake**: linha única em texto — "Desde 1993 · milhares de eventos `[PLACEHOLDER: dono confirma nº real]` · Bradesco, Spotify, Arnold Classic, Danilo Gentili" + "★ 4,x no Google `[PLACEHOLDER: nota+link GBP]`" linkando o Maps. Counter fica SÓ no "33 anos" (esse é real e recalculado: `new Date().getFullYear() - 1993`).

### 3.2 Answer capsule (NOVO, logo após o hero, antes de qualquer fileira)
Bloco de texto server-rendered, 40-80 palavras, `<p>` simples estilizado como card discreto:
> "A Aluguel de Games loca fliperamas, videokês, consoles (PS5/Xbox), realidade virtual, máquinas de dança e jogos de mesa para festas e eventos em Osasco e toda a Grande São Paulo desde 1993. Entrega, montagem e suporte técnico inclusos. Orçamento pelo WhatsApp (11) 96526-1000: mande data, bairro e número de convidados."

É o primeiro texto que crawler de IA encontra. `curl | grep "desde 1993"` passa.

### 3.3 KITS (NOVO — curadoria antes do paredão)
3 cards horizontais scrolláveis no mobile: **Festa Teen/Retrô** (fliperama + air game + console), **Confra/SIPAT** (link pro /empresas), **Infantil** (link pro /festas). Cada card: foto real, o que inclui em texto, CTA "Orçar este kit" com prefill do kit inteiro. Sem preço até o dono assinar faixa (§6 do brief); com preço, o card ganha linha "a partir de R$ X `[PLACEHOLDER]`".

### 3.4 Fileiras Netflix (mantidas, 3 categorias, `CatalogSection`)
Iguais às atuais MAS: heading de cada fileira vira LINK pra página de categoria (hoje é texto morto: maior ganho de SEO interno sem escrever conteúdo). Card (`CatalogCard.tsx`) trocado: linha de "locações" fake (linha 91-99) → linha de atributo real do metadata ("2 jogadores · 1,8m · 220V") ou fallback "Entrega e montagem incluídas". Botão "+ Adicionar ao orçamento" discreto no card (ícone +, canto inferior direito).

### 3.5 Top 10 (mantido, limpo)
`TopToys` fica (é distintivo e verdadeiro como curadoria "mais pedidos"), sai o contador fake (`TopToys.tsx:347`) e o `ssr:false` (linha 14 do `Main.tsx`: Top 10 precisa existir no HTML; virar server component ou `forceMount`).

### 3.6 Demonstra (vídeos, mantido)
Como está, com `poster` + lazy real.

### 3.7 "Desde 1993" (seção editorial do `Main.tsx`, enxugada 40%)
Mantém o counter gigante 33+ e o parágrafo, MATA o grid de 4 "valores" (Tradição/Qualidade/Atendimento/Diversão = frufru condenado pelo brief) e os stats inline 500+/98%. No lugar do grid: **frase factual citável em `<blockquote>`** ("A Aluguel de Games realiza eventos desde 1993, incluindo Bradesco, Spotify, Arnold Classic e o aniversário de Danilo Gentili.") + 3 fatos verificáveis com ícone: "Entrega e montagem incluídas · Equipamento testado antes de cada evento · Contrato e NF". Link pro /sobre mantido.

### 3.8 FAQ da home (NOVO)
5 perguntas em `<details>/<summary>` nativo + FAQPage schema espelhando: "Quanto custa alugar um fliperama?" (resposta resumida + link /quanto-custa), "Vocês entregam em [bairro]? ", "Quanto tempo dura a locação?", "E se o equipamento der defeito?" (garantia real do dono `[PLACEHOLDER: redigir com ele]`), "Com quanta antecedência preciso reservar?".

### 3.9 CTA final (mantido do `Main.tsx`, +telefone)
Card neon atual fica; adiciona "ou ligue (11) 96526-1000" e troca o prefill genérico pelo roteiro com lacunas.

**Mobile:** tudo acima em coluna única, CTAs full-width, fileiras com scroll-snap horizontal, `WhatsAppFloat` mantido SEM badge "1", aparecendo após 600px de scroll pra não competir com o CTA do hero.

---

## 4. Página de produto seção por seção (`/catalogo/[produto]`)

Estrutura atual (`[...slug]/page.tsx` + `ProductGallery` + `ProductInfo`) mantida em grid 2 colunas desktop / coluna única mobile. Mudanças:

1. **Breadcrumb** (existe): consertar o link de categoria — hoje aponta `/catalogo#Categoria` (linha 291); vai pra `/catalogo/{slug-da-categoria}/` + BreadcrumbList schema (não existe hoje).
2. **Galeria** (mantida): LQIP obrigatório, primeira imagem `priority`, dimensões fixas (CLS).
3. **Título + capsule do produto**: H1 mantido; abaixo, 1-2 frases server-rendered "o que é / pra que festa serve / o que está incluso" (extraídas do metadata, não do markdown solto).
4. **`<SpecsTable>` (NOVO, coração GEO da página)**: `<table>` HTML real com Dimensões (L×A×P), Peso, Tomada 110/220V, Nº de jogadores, Espaço mínimo, **Passa em porta/elevador? (sim/não + largura mínima)**, Jogos inclusos. Fonte: campo `specs` novo no metadata.json, preenchido produto a produto (dono valida com fita métrica: é a pergunta nº1 de quem mora em apartamento e NENHUM concorrente publica). Produto sem specs ainda: tabela mostra só as linhas preenchidas, nunca "N/A" em cascata.
5. **Bloco "o que está incluso"** (evolui as ✓ atuais do `ProductInfo:84-92`): Entrega e montagem, retirada, suporte durante o evento, período padrão da diária `[PLACEHOLDER: dono confirma horas]`.
6. **Preço**: as DUAS versões desenhadas. SEM preço (default): linha "💬 Orçamento em minutos pelo WhatsApp: preço depende de data, bairro e quantidade de itens" + link /quanto-custa. COM preço (se o dono assinar): "A partir de **R$ X** / diária" como linha de destaque acima do CTA, mesmo peso tipográfico do título da tabela: nunca badge enfiada.
7. **CTA duplo + carrinho**: "Pedir orçamento no WhatsApp" (prefill: "Oi! Vi o *{titulo}* no site e quero um orçamento. Data: ___ / Bairro: ___ / Convidados: ___") + "**+ Adicionar ao orçamento**" (outline, empilha no localStorage). Abaixo: "ou ligue (11) 96526-1000".
8. **Trust badges atuais (fake) morrem** (`ProductInfo:112-125`): substituídos por 1 linha "Desde 1993 · Bradesco, Spotify, Arnold Classic e milhares de festas".
9. **FAQ do produto** (3-4 perguntas, `<details>`, do campo `faq` do metadata com fallback pra FAQ da categoria) + FAQPage schema.
10. **Relacionados** (`RelatedProducts`, mantido).
11. **Sticky CTA mobile**: barra fixa bottom com "Pedir orçamento" (verde) + ícone "+" do carrinho. Convivência com o float (pergunta aberta do consenso): **na página de produto o `WhatsAppFloat` some** e a barra sticky assume; float só em páginas sem sticky. Galeria touch não conflita: barra tem 56px, `env(safe-area-inset-bottom)`, e a galeria termina antes.
12. JSON-LD: `Product`+`Offer LeaseOut` (existe) + `additionalProperty` espelhando a SpecsTable + BreadcrumbList + FAQPage; sai `next/script`, entra `<script>` inline server-side (garantia de HTML cru).

### Drawer do carrinho de orçamento (global, client-side puro)
Ícone contador no Header + na sticky bar. Drawer: lista de itens (thumb + título + remover), campos **Data (obrigatória)**, Bairro, Tipo de festa, nº convidados; CTA verde "Enviar orçamento no WhatsApp" gera wa.me multi-linha ("Oi! Quero orçamento pra festa dia {data} em {bairro}: • Fliperama Snack • Air Game…"). GA4 `begin_checkout`-like custom event. Zero backend.

---

## 5. /empresas (B2B) seção por seção

Página atual (399 linhas) já é forte: hero + case Bradesco. Elevar:

1. **Hero** (mantido): H1 atual é bonito mas fraco pra Ads: vira **"Aluguel de games para eventos corporativos em SP"** + sub com a promessa ("SIPAT, confraternização, ativação: desde 1993, com NF, contrato e equipe no local"). CTA "Falar com consultor" ganha prefill B2B: "Oi! Sou da empresa ___ e quero orçamento pra um evento corporativo. Data: ___ / Local: ___ / nº de pessoas: ___".
2. **Answer capsule B2B** logo após o hero (40-80 palavras: o que faz, pra que ocasião, NF/contrato, Bradesco/Spotify/Arnold como prova).
3. **Cases nomeados** (grid atual mantido): cada card ganha legenda factual "Bradesco · Braland · ativação de marca" e link pro álbum da /galeria.
4. **Guia de dimensionamento (NOVO, tabela HTML)**: 50 / 150 / 400 pessoas × quantos equipamentos recomendados, exemplo de mix, espaço necessário. É dado extraível que nenhum concorrente tem e o RH copia pro e-mail interno.
5. **Kit aprovação interna (NOVO)**: botão "Baixar kit pra aprovação (PDF)": 1 página com CNPJ, NF, contrato, seguro/responsabilidade `[PLACEHOLDER: conferir o que existe]`, fotos, mini-cases. Gerado uma vez, estático em /public. É o que destrava compras/financeiro.
6. **Diferenciais** (grid atual de 6, mantido): já são fatos (NF, consultor, equipe, pagamento), não frufru. Só revisar copy.
7. **Aviso honesto de agenda**: linha "Novembro e dezembro lotam com semanas de antecedência: confras fecham cedo" (verdade sazonal que gera urgência honesta).
8. **FAQ B2B** (`<details>` + schema): faturamento/boleto, prazo de proposta, montagem fora de horário comercial, homologação de fornecedor.
9. **CTA final**: consultor + telefone + e-mail `[PLACEHOLDER]` (B2B às vezes precisa de e-mail formal).

---

## 6. Sistema de prova social HONESTO

Camadas, todas verificáveis, zero número inventado:

| Camada | Onde | Formato |
|---|---|---|
| **Idade** | badge hero, title/OG, trust strip, junto de TODO botão verde ("Desde 1993 · atendimento direto no WhatsApp") | "Desde 1993" sempre; "33 anos" só calculado em runtime de build; ângulo "mais antiga que o PlayStation" liberado pra copy de seção |
| **Volume** | trust strip, /sobre, produto | "milhares de eventos" `[PLACEHOLDER: dono confirma se existe nº real; se existir, usar o exato: '11.400 eventos' > '500+']` |
| **Nomes** | trust strip, /empresas, /galeria, frase citável | SEMPRE texto ("Bradesco, Spotify, Arnold Classic, Danilo Gentili"); logo-wall SÓ com autorização formal `[PLACEHOLDER]` |
| **Google** | trust strip + footer + /contato | nota real + link direto pro perfil GBP ("★ 4,x no Google: veja as avaliações"); schema `hasMap`. Reviews VIVEM lá: o site nunca hospeda review próprio |
| **Portfólio** | /galeria | álbuns por evento: "Spotify, 2024 · 6 máquinas · São Paulo" — foto com contexto vale por depoimento |
| **Garantia** | produto, FAQ, como-funciona | redigida com o dono a partir da prática real: "Deu defeito? Trocamos o equipamento ou mandamos técnico" + política de chuva/reagendamento `[PLACEHOLDER: formalizar]` |

**Auditoria contínua:** grep de CI simples (script no package.json) que falha o build se `sales-utils|98%|500\+|reviewCount|ratingValue` aparecer em src/. Des-fabricação vira gate permanente, não faxina única.

---

## 7. Direção visual (evoluir o dark/neon, não trocar)

**Princípio: o neon vira moldura, o conteúdo vira rei.** O opus-4.8 acerta a vibe arcade; peca quando decoração compete com informação (texto 6,7px no Top 10, `text-muted-foreground/40` informativo, vazios escuros).

- **Paleta (mantida, com papéis endurecidos):**
  - Fundo: escala atual oklch (`--background` 14.5%, `--background-base` 7.6%).
  - Neon roxo/rosa/ciano: SÓ decoração e ênfase editorial (labels, dividers, brackets, gradientes de heading). Nunca em texto informativo <16px.
  - **Verde = EXCLUSIVO de ação WhatsApp** (token novo `--cta-whatsapp: oklch(64% 0.17 150)` ± o green-600 atual): proibido verde em badge, ícone de spec, sucesso genérico. O olho aprende: verde = falar com a gente.
  - Âmbar suave pra badges honestos ("novo", "mais pedido").
- **Tipografia (mantida):** Bricolage Grotesque display / DM Sans body / JetBrains Mono pra labels-arcade e números. Regras novas: corpo mínimo **14px** (12px só em legenda/label, nunca menos: hoje há 6,7px), `text-muted-foreground/40-60` abolido pra conteúdo (só decoração), line-height corpo ≥1.6.
- **Tokens Tailwind (extensão do globals.css atual):**
  ```
  --cta-whatsapp / --cta-whatsapp-hover     (verde, exclusivo)
  --trust-accent: var(--primary-yellow)     (badges honestos)
  --surface-capsule: color-mix(in oklch, var(--background-card) 80%, transparent)
  --text-min: 0.875rem                      (guard-rail de legibilidade)
  spacing: sticky-bar 3.5rem + safe-area
  ```
- **Motion:** mantém rise-in/counters/hover-scale, com 3 regras: (1) `prefers-reduced-motion` desliga TUDO (gate, já parcialmente presente); (2) nada anima opacidade de conteúdo above-the-fold (LCP); (3) animação nunca segura informação: estado final legível sem JS.
- **Imagens:** LQIP/cor dominante obrigatório em toda imagem (dark + imagem sem placeholder = parece quebrado); batch sharp one-off gera os placeholders no metadata.json; AVIF/WebP; dimensões fixas.
- **Assinaturas mantidas:** corner brackets, divider-neon, dot-grid, 404 arcade, label-arcade. São a personalidade: ficam.

---

## 8. Camada GEO/AI-friendly + SEO técnico (embutida, não bolt-on)

**Fase 0 (antes de qualquer página nova):**
1. `robots.ts` reescrito: allow geral + directives explícitas pros 10 bots de IA (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Meta-ExternalAgent), `disallow: /studio/`; **deletar `public/robots.txt`** (corrompido por backticks).
2. **UM sitemap**: `app/sitemap.ts` reescrito usando `segmentsToSlug` (o atual gera URL com acento → 404) + TODAS as rotas estáticas (/empresas, /galeria, /como-funciona, /festas, /quanto-custa); matar postbuild `next-sitemap` e o `public/sitemap.xml` de abril.
3. JSON-LD 100% server-side `<script>` inline (trocar os `next/script` de `[...slug]/page.tsx:206,266`): LocalBusiness/EntertainmentBusiness com `foundingDate: "1993"`, endereço Osasco `[PLACEHOLDER: endereço exato]`, `areaServed`, `hasMap` (GBP), `sameAs`; Offer LeaseOut; BreadcrumbList; FAQPage; HowTo em /como-funciona; `dateModified` real de build.
4. `verification.google` real quando o dono verificar GSC (nunca placeholder).

**Regra do HTML cru (transversal, teste de aceite por template):**
`curl $URL | grep` precisa achar: telefone formatado, answer capsule, ao menos 1 pergunta de FAQ, 1 linha da SpecsTable. Implicações no design: FAQ = `<details>/<summary>` (nunca Radix Accordion fechado), Top 10 sem `ssr:false`, capsules e tabelas são server components, drawer/carrinho é o ÚNICO conteúdo permitido client-only (é interação, não informação).

**Padrões por página:** answer capsule primeiro bloco (home, categorias, /empresas, /festas, /quanto-custa, /como-funciona); H2 em formato de pergunta ("Quanto custa alugar um fliperama em SP?"); seções autossuficientes (chunk retrieval: cada seção entendível sozinha); tabelas de specs/dimensionamento; frase factual citável na home e /sobre.

**llms.txt** gerado no build (30 min, expectativa zero, documentado como aposta grátis).

**Off-site (checklist entregável pro dono, fora do código):** GBP completo + Bing Places + Foursquare + Apple Maps, NAP idêntico ao footer; pedir review Google no fim de cada evento; baseline mensal perguntando às IAs "aluguel de fliperama Osasco/SP" (começa JÁ, antes do redesign, pra medir delta).

**Ads-ready:** H1 das categorias = keyword exata (já quase lá no `catalog-categories.ts`; revisar 7 principais); CTA acima da dobra em toda LP; CWV verde mobile ANTES de campanha (PageSpeed em cada LP); footer com **CNPJ `[PLACEHOLDER]` + endereço + telefone + link Política de Privacidade/LGPD** (página estática nova, 1h); GA4: evento `whatsapp_click` qualificado (20s+ na página) exportado como conversão pro Ads; reconciliação GA4 × etiquetas WhatsApp documentada num README curto pro dono.

---

## 9. Copy de exemplo (5 textos-chave, tom: direto, sem letra miúda)

**Hero (H1 + sub):**
> **Aluguel de fliperama, videokê e games para festas**
> Levamos, montamos e damos suporte na sua festa em Osasco e toda a Grande SP. Desde 1993 — manda a data no WhatsApp e recebe o orçamento em minutos.

**CTA principal (botão + linha de apoio):**
> **[💬 Pedir orçamento no WhatsApp]**
> Resposta rápida em horário comercial · ou ligue (11) 96526-1000
> _(prefill: "Oi! Quero um orçamento pra minha festa 🎮 Data: ___ / Bairro: ___ / Convidados: ___")_

**Claim de idade (trust strip / seção 1993):**
> Alugando diversão desde 1993 — antes do PlayStation existir. São 33 anos e milhares de festas, de aniversário em Osasco a eventos pra Bradesco, Spotify, Arnold Classic e Danilo Gentili.

**Abertura /empresas:**
> **Aluguel de games para eventos corporativos em SP.** SIPAT, confraternização, lançamento, ativação de marca: a gente monta, opera e desmonta, com NF, contrato e equipe no local. Desde 1993, com eventos realizados para Bradesco, Spotify e Arnold Classic. Diga data, local e número de pessoas — o consultor devolve proposta e mix de equipamentos recomendado.

**FAQ destaque (home + /quanto-custa):**
> **Quanto custa alugar um fliperama pra festa?**
> Depende de três coisas: data (fim de semana e dezembro lotam), bairro (a entrega é nossa) e quantos itens você aluga junto (combos saem melhor). A diária padrão cobre a festa inteira, com entrega, montagem e suporte inclusos: sem taxa escondida. Manda data e bairro no WhatsApp que a gente fecha o número na hora. Faixas de referência: veja /quanto-custa. `[PLACEHOLDER: faixas reais assinadas pelo dono]`

---

## 10. Esforço estimado (1 dev, dias úteis)

| Fase | Escopo | Dias |
|---|---|---|
| **0. Des-fabricação + fundação** (gates 1.1-1.3, DEPLOY IMEDIATO) | matar sales-utils/badge/98%/500+, `<WhatsAppCta>` + prefill em tudo + tel:, sitemap único, robots.ts, JSON-LD server-side, GA4 conversão, footer CNPJ/LGPD | **4** |
| 1. Home V2A | trust strip, capsule, kits, headings-link, FAQ home, poda seção 1993, Top10 sem ssr:false | 4 |
| 2. Produto + carrinho | SpecsTable + schema metadata, FAQ produto, sticky CTA, drawer orçamento, breadcrumb/schema | 5 |
| 3. Categorias-LP | capsule + FAQ + Service schema nas 7, H1=keyword, revisão copy | 3 |
| 4. /quanto-custa + /festas | conteúdo + tabelas + schema (copy com o dono) | 3 |
| 5. /empresas elevada + PDF kit + /como-funciona HowTo + galeria por álbum | | 4 |
| 6. Performance/LQIP + curl-audit + PageSpeed + QA mobile | | 3 |
| **Total** | | **~26 dias** (5-6 semanas com folga) |

**Se apertar, corta nesta ordem (de trás pra frente no valor):**
1. /festas (geo-campanha do Ads aponta categoria B2C enquanto isso);
2. PDF kit aprovação (vira "peça por WhatsApp");
3. Álbuns da galeria (mantém galeria atual com legendas);
4. Kits da home (fileiras já vendem);
5. Carrinho de orçamento (prefill single-item já converte; carrinho é upgrade, não fundação).

**Nunca corta:** fase 0 (des-fabricação/sitemap/prefill/tracking), SpecsTable, /quanto-custa, sticky CTA mobile. É onde mora a diferença entre "site bonito" e "vendedor que trabalha sozinho".

**Preenchimento do metadata (specs/FAQ):** ~60 produtos × 10 min com o dono = espalhado nas 2h/semana dele ao longo das fases; template de planilha pronto na fase 2; produto sem specs continua digno (tabela parcial + fallback).
