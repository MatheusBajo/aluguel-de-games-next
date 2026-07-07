# SPEC FINAL V1 — REDESIGN TOTAL ("Resposta que Converte")

Data: 2026-07-07 · Moderador do painel (síntese final)
Base vencedora: **V1C (AI-native: URLs aninhadas intactas, anatomia de resposta, melhor H1)** com o **motor de conversão da V1A transplantado** (hero estático, sticky bar global, audits de CI, /quanto-custa na dobra 3). Enxertos: fase 0 arquivo:linha da V2A, /empresas da V2C+V1C+V1A (merge do crítico RH), FAQ de garantia da V1B, chips "vai bem em" da V1C, copy de preço da V2A, regra de fallback de placeholder da V2C.
Contrato: `BRIEF-REDESIGN.md` — todos os gates 1.1–1.7 são pré-condição. Repo: `/Users/matheusbajo/Projetos/WebstormProjects/aluguel-de-games-next` (branch de trabalho: `design-opus-4.8`).

**O que esta spec REJEITA das gerações (com motivo):**
- Migração de slug plano da V1A — colisão real verificada ("Carrinho Infantil" em 2 categorias), payoff de ranking ~zero, roleta de 301 na véspera do Ads. **URLs aninhadas atuais ficam.**
- Estética terminal da V1C (mono/timestamp em telefone/preço/tudo) — persona B2C é mãe no celular, não auditor. Mono fica SÓ em tabela de specs e números tabulares.
- Marquee/`PRESS START`/scanline da V1B — prova em movimento não se lê; HUD confunde quem paga.
- Busca client-side (V2B) — item explicitamente não-ressuscitável do brief §2.
- Qualquer SLA de tempo sem assinatura ("resposta em horas/minutos") — mesma doença do contador fake. Default: "resposta em horário comercial".

---

## 1. REGRAS TRANSVERSAIS (valem pra toda página; falhou = não deploya)

1. **Des-fabricação primeiro (fase 0 no ar antes de qualquer pixel novo).** Endereços exatos:
   - Deletar `src/lib/sales-utils.ts`; remover render points em `src/components/catalogo/CatalogCard.tsx:96` (linha "locações"), `src/components/sections/top-toys/TopToys.tsx:347`, `CarouselModal.tsx:85-86`.
   - Remover badge "1" bouncing de `src/components/WhatsAppFloat.tsx:78-80`.
   - Remover "98% satisfação" de `src/components/Main.tsx:118` e stats "500+/100%" de `src/components/catalogo/ProductInfo.tsx:112-125`.
   - Deletar `src/components/ui/StarRating.tsx` (órfão), `ADMIN.md`.
2. **Todo número passa pelo dono.** Inclui números de catálogo ("11.000 jogos" → `[CONFIRMAR COM DONO: nº de jogos do multijogos]`) e promessas de tempo. Zero exceção.
3. **Regra do fallback (herdada da V2C §6.4):** todo `[CONFIRMAR COM DONO: x]` tem os DOIS estados desenhados. Slot sem dado confirmado NÃO renderiza (nunca "—", nunca "consulte" em cascata, nunca buraco visual).
4. **Regra do HTML cru:** telefone, answer capsule, FAQ, specs e preço/como-orçar existem no HTML servido de cada template. FAQ = `<details>/<summary>` nativo SEMPRE (Radix Accordion/Tabs proibidos em conteúdo informativo). Aceite: `npm run audit:raw` (curl | grep por template).
5. **Verde `#25D366` é EXCLUSIVO de ação WhatsApp/tel.** Nenhum outro elemento verde.
6. **Texto informativo ≥12px, `text-muted-foreground/40-60` abolido pra conteúdo.**
7. **Estado fora-do-horário (buraco que nenhuma geração resolveu):** todo CTA principal tem linha de apoio server-rendered: "Atendemos das `[CONFIRMAR COM DONO: 9h]` às `[CONFIRMAR COM DONO: 18h]`. Fora do horário? Manda mesmo assim — respondemos no próximo período de atendimento." Enhancement client-side opcional troca pra "estamos online agora" APENAS derivado do horário real (nunca "Online" perpétuo).
8. **As 2h/semana do dono são recurso orçado.** Entregável `docs/redesign-2026-07-07/DONO-CHECKLIST.md` com ordem de prioridade: (1) garantia/política de chuva redigida, (2) e-mail corporativo + CNPJ, (3) nota+link Google, (4) período da diária, (5) specs dos 15 produtos mais pedidos, (6) faixas de preço (opcional), (7) ano/escopo dos álbuns, (8) autorização de logos. Nada além disso entra no caminho crítico.

---

## 2. ARQUITETURA DE PÁGINAS

**URLs de produto e categoria NÃO mudam** (aninhadas, como hoje: `/catalogo/jogos-eletronicos/fliperamas/`, `/catalogo/.../produto/`). Zero 301 de catálogo. `.htaccess` mantém www + slugs curtos de campanha (`/fliperama`, `/videoke`, `/vr`, `/consoles` → categorias).

```
/                         LP mestre (brand + head terms). H1 transacional + hero estático
/catalogo                 Hub (headings LINKADOS às categorias)
/catalogo/{7 categorias}  LPs primárias de Ads (1 ad group : 1 página, H1 = keyword):
                          fliperamas · videokes · realidade-virtual · consoles-ps5-xbox ·
                          maquina-de-danca · maquina-de-pegar-bichinho · jogos-de-mesa
/catalogo/{...}/[produto] Ficha técnica citável (Product+Offer LeaseOut) — URL atual mantida
/quanto-custa             NASCE — gap nº1 (7/9 concorrentes escondem preço)
/como-funciona            Elevada: passos com prazos reais, sinal, chuva, defeito (HowTo schema)
/festas                   NASCE — espelho B2C (infantil, aniversário adulto, bodas, 60-70-80)
/empresas                 Máquina B2B (ver §5) + /empresas/kit-aprovacao.pdf (URL estável)
/sobre /galeria /contato  Elevadas (fatos datáveis / álbuns por evento / form Web3Forms)
/privacidade              NASCE — LGPD (gate 1.5), estática, 1h de trabalho
/regiao/{osasco,sao-paulo} MÁX 2 no launch; +2 só com 40-60% conteúdo único comprovado
```

**Morre na fase 0:** sales-utils + render points, badge "1", "98%", "500+", StarRating, `public/robots.txt` (corrompido por backticks), `public/sitemap.xml` (stale abril), postbuild `next-sitemap` (sai do `package.json:10` e da dep), deps Sanity do `package.json` do app (studio/ fica no repo desligado; religar = decisão pós-launch), `ADMIN.md`.

---

## 3. HOME — dobra por dobra (mobile-first, 390px primeiro)

Ordem fixa: o que tem → quanto custa/como orçar → como funciona → prova → CTA.

### D1 — Hero resposta (estático, pinta sem JS — decisão de arquitetura, não de fé)
- **SEM carrossel.** UMA foto real de evento como LCP: `<img>` ELEMENT (nunca CSS background — preload scanner não descobre), `priority`, AVIF, dimensões fixas, LQIP, legenda dentro do scrim: "Aniversário do Danilo Gentili".
- Badge: `★ Desde 1993 · Osasco e Grande SP`.
- **H1:** `Aluguel de fliperama, videokê e games para festas` (o melhor message match das 6 gerações — keyword "aluguel" na frente).
- Sub (1 linha): "Entrega, montagem e suporte inclusos na Grande São Paulo. Desde 1993."
- **CTA dual:** verde `Pedir orçamento no WhatsApp` (prefill §9.2) + ghost `Ver o que tem ↓`. Abaixo, ≥12px: "ou ligue **(11) 96526-1000**" (`tel:` rastreado) + linha fora-do-horário (§1.7).
- Orçamento de viewport 390×844: badge + H1 + sub + CTA dual + tel cabem; **trust strip fica na D1.5, logo abaixo da dobra** (a matemática de enfiar tudo em 1 tela não fecha — crítica procedente do dono à V2B).

### D1.5 — Trust strip verificável (estática, quebra em 2 linhas se precisar; NUNCA marquee)
`Desde 1993 · milhares de eventos [CONFIRMAR COM DONO: nº real] · Bradesco · Spotify · Arnold Classic · Danilo Gentili · ★ {nota} no Google [CONFIRMAR COM DONO: nota + link GBP]` — nota linka o Maps. Sem dado confirmado, o item é omitido (fallback §1.3).

### D2 — Answer capsule + o que tem
- `<AnswerCapsule>` (primeiro texto corrido, 40-80 palavras — copy §9.1).
- H2: **"O que dá pra alugar?"** — grid 2×4 (mobile 2 col) de cards de categoria: foto real, nome, 1 fato real do metadata (`"12 modelos"` = contagem real de itens; specs de catálogo tipo "X jogos" só com `[CONFIRMAR COM DONO]`). Link → categoria-LP.
- Linha de **chips por ocasião** sob o grid: `Festa infantil → /festas · Aniversário adulto → /festas#adulto · Evento de empresa → /empresas` (a tradução "penso por ocasião" da V2B, sem reestruturar a home).

### D3 — Quanto custa (a dobra que nenhum concorrente tem — ABERTA, nunca em accordion)
- H2: **"Quanto custa alugar?"**
- 3-4 linhas em HTML cru (copy §9.5 resumida): o que influencia (equipamento, data, bairro, nº de itens — "combos saem melhor"), período padrão da diária `[CONFIRMAR COM DONO: horas]`, faixas `[CONFIRMAR COM DONO: faixas por categoria]`.
- Versão B (sem faixas assinadas): mantém os 4 fatores + "combos saem melhor" + CTA. Nenhum número inventado; âncora de magnitude ("a partir de R$") SÓ com compromisso escrito.
- Link forte: `Entenda o orçamento completo → /quanto-custa` + CTA verde `Pedir o valor da minha festa`.

### D4 — Monte sua festa (widget de orçamento inline)
- H2: **"Monte sua festa e mande em 1 mensagem"** (NÃO "orçamento em 30 segundos" — promete número que não chega; crítica procedente da persona mãe).
- Chips multi-select de itens populares → data (obrigatória) + bairro + convidados (opcionais) → CTA verde `Enviar no WhatsApp` (wa.me multi-linha §9.2). Mesmo estado do `<QuoteCart>` global (localStorage).
- Progressive enhancement: sem JS degrada pra CTA com prefill de lacunas. Conteúdo SEO da página não depende do widget.

### D5 — Como funciona (4 passos, scroll-snap mobile)
1. Você chama no WhatsApp → 2. Fechamos data e valor (contrato e NF) → 3. Entregamos e montamos antes da festa → 4. Buscamos depois. **"Deu problema? Trocamos ou mandamos técnico — o problema é nosso, não seu."** `[CONFIRMAR COM DONO: redação final da garantia — formalizar o que já pratica]`. Link → /como-funciona.

### D6 — Prova (nomes reais, zero número inventado)
- Carrossel MANUAL (scroll-snap CSS, sem autoplay) de fotos nomeadas: Bradesco·Braland, Spotify, Arnold Classic, Danilo Gentili → cada slide linka o álbum em /galeria.
- Numeral `1993` outline + claim "Desde 1993 — alugando games antes do PlayStation existir." + frase citável (§9.3) + link /sobre.
- Botão `Ver avaliações no Google →` `[CONFIRMAR COM DONO: link GBP]`. Zero review no site.
- Único counter permitido no site: **33** (anos; `new Date().getFullYear() - 1993`).

### D7 — FAQ da home (6 `<details>` + FAQPage schema espelhando 1:1)
Quanto custa? (resumo + link /quanto-custa) · E se chover? · E se o equipamento der problema? (garantia) · Qual o período da diária? · Atendem meu bairro? (resposta: lista real de cidades da Grande SP — nunca pergunta parametrizada) · Com quanta antecedência reservo?

### D8 — CTA final + footer
CTA dual + tel + linha fora-do-horário. Footer: NAP completo, **CNPJ `[CONFIRMAR COM DONO]`**, link /privacidade, links das 7 categorias + páginas, GBP ("avalie a gente no Google") + Instagram, horário.

**Sticky bottom bar global (mobile <768px):** UMA barra fixa (56px + `env(safe-area-inset-bottom)`) com `WhatsApp` (verde, prefill da página atual — na página de produto o prefill nomeia o produto) + `Ligar`. **Substitui o float em mobile** (mata o conflito de duas barras da V1A: existe SÓ uma, context-aware). Desktop mantém `WhatsAppFloat` sem badge. Aparece após 400px de scroll na home (não briga com o CTA do hero); nas demais páginas, sempre.

---

## 4. CATEGORIA-LP (7 instâncias) e PRODUTO

### Categoria (destino primário do Ads — anatomia fixa do gate 1.5)
1. Breadcrumb + **H1 = keyword** ("Aluguel de Fliperama para Festas e Eventos").
2. Answer capsule da categoria (40-80 palavras).
3. CTA dual acima da dobra + tel + fora-do-horário.
4. **Grid de cards (FOTO primeiro — a foto convence, a tabela confirma; crítica procedente da mãe à V1C).** Card: foto LQIP + nome + 1 linha de spec real ("2 jogadores · 1,8m · 220V") ou fallback "Entrega e montagem incluídas" + botão "+ Orçamento".
5. Tabela comparativa da categoria (modelo × jogadores × dimensões × tomada) — DEPOIS do grid, só com ≥3 produtos com specs preenchidas (fallback: omite).
6. Como funciona resumido (3 passos) + bloco de preço honesto (2 estados).
7. Prova: 1 foto de evento nomeada + link Google.
8. FAQ da categoria (4-6 `<details>`, específicas: videokê = "quantas músicas? `[CONFIRMAR COM DONO]`").
9. CTA final. Schema: CollectionPage + ItemList + FAQPage + BreadcrumbList.

### Produto (`/catalogo/{...}/[produto]` — URL atual)
1. Breadcrumb (consertar link de categoria: hoje `#Categoria` — vai pra `/catalogo/{slug}/`) + BreadcrumbList.
2. **Galeria scroll-snap CSS nativa** (mata o embla nesta superfície — único enxerto técnico da V2B; LQIP, primeira imagem priority, dimensões fixas).
3. H1 = "Aluguel de {Produto}" + capsule do produto (o que é, pra que festa, o que tá incluso).
4. **Bloco de decisão** (above the fold mobile):
   - 3 fatos verificáveis (substituto no pixel do contador fake): `Entrega e montagem incluídas · Equipamento testado antes do evento · Contrato e NF`.
   - **Garantia colada aqui** (posição da V2C): "Deu defeito? Trocamos ou mandamos técnico no local, sem custo. `[CONFIRMAR COM DONO]`"
   - Preço 2 estados: SEM = 1 linha honesta "O valor fechado depende de data e bairro — manda os dois no WhatsApp" + link /quanto-custa (linha simples, NÃO card celebrando a ausência); COM = "a partir de R$ X / diária de {N}h" em destaque tipográfico próprio.
   - CTA verde `Pedir orçamento deste item` (prefill §9.2) + `+ Adicionar ao orçamento` (outline) + tel.
5. **Ficha técnica `<table>`** (mono, tabular-nums): dimensões L×A×P, peso, tomada 110/220V, nº jogadores, espaço mínimo, **passa em porta de 80cm? / elevador?**, itens inclusos. Linha sem dado não renderiza. As dimensões que hoje vivem em NOME DE ARQUIVO de foto migram pro campo `specs` (achado da V2B).
6. **Chips "vai bem em"** (V1C): festa infantil / aniversário adulto / evento de empresa → linkam /festas e /empresas.
7. Descrição (markdown atual do metadata).
8. FAQ do item (3-4 `<details>` + FAQPage).
9. Relacionados (`RelatedProducts` mantido; curadoria por categoria, nunca "quem alugou").
10. Sticky bar global assume (§3) com prefill do produto.
Schema: Product + Offer `businessFunction: LeaseOut` + `additionalProperty` espelhando a tabela + FAQPage. Sem aggregateRating.

---

## 5. /EMPRESAS — merge das 3 melhores (estrutura V2C + canais V1C + FAQ V1A)

Persona: RH/compras em DESKTOP CORPORATIVO com WhatsApp Web bloqueado. **Gates desta página:** e-mail visível, linha 151-250 pessoas, seguro respondido, "NF de locação" explicada.

1. **Hero B2B:** H1 `Aluguel de games para eventos corporativos em SP` + sub "SIPAT, confraternização e ativação de marca. NF de locação, contrato e equipe no local. Desde 1993." + badge `CNPJ [CONFIRMAR COM DONO]`. CTA triplo: verde `Falar com consultor no WhatsApp` (prefill §9.4) + `Baixar kit de aprovação (PDF)` + **`✉ [CONFIRMAR COM DONO: e-mail]` visível com `mailto:` de assunto pré-preenchido** ("Cotação evento corporativo — {empresa}"). Tel em texto.
2. Answer capsule B2B (§9.4).
3. **Guia de dimensionamento `<table>` — COM a linha do caso mediano:**

| Porte | Equipamentos | Mix sugerido | Espaço | Tomadas | Técnicos | Montagem |
|---|---|---|---|---|---|---|
| até 50 | 2-3 | fliperama + console + mesa | ~15m² | 2× 110/220 | 1 | `[CONFIRMAR]` |
| 51-150 | 4-6 | + garra ou dança | ~40m² | 4 | 1-2 | `[CONFIRMAR]` |
| **151-250** | 6-8 | + videokê ou VR, operação assistida | ~60m² | 6 | 2 | `[CONFIRMAR]` |
| 251-400+ | 8+ | estações múltiplas, padrão Arnold Classic | 100m²+ | `[CONFIRMAR]` | equipe dedicada | `[CONFIRMAR]` |

   Números logísticos todos `[CONFIRMAR COM DONO]`; sem confirmação a coluna não renderiza. CTA com prefill por porte. Linhas linkam produtos.
4. **Kit de aprovação (PDF, item NUNCA-CORTA):** formato V2C (2 páginas, URL estável `/empresas/kit-aprovacao.pdf`, gerado no build via HTML→PDF one-off, sem e-mail gate) + cadastro V2B (razão social, CNPJ, NAP) + faixa de investimento V1C `[CONFIRMAR COM DONO: faixa]` **com versão sem-faixa desenhada** (bloco vira "como orçamos: 4 fatores") + modelo de cronograma + seguro/responsabilidade `[CONFIRMAR COM DONO — GATE: sem resposta, kit e FAQ não mencionam seguro]` + fotos de 2 cases. GA4 `kit_pdf_download`.
5. Cases nomeados: Bradesco·Braland (foto) + Arnold Classic (vídeo) + Spotify `[CONFIRMAR COM DONO: mídia]`, cada um com 1 linha de escopo factual `[CONFIRMAR: "6 máquinas · 2 dias"]`. Logo-wall só com autorização formal.
6. Agenda honesta: "Novembro e dezembro lotam com semanas de antecedência `[CONFIRMAR: janela]`. Fora da alta temporada, atendemos até pedidos da mesma semana `[CONFIRMAR]`."
7. Processo B2B em 4 passos + **relatório/fotos pós-evento como passo final** (V1C — prestação de contas pro chefe) `[CONFIRMAR COM DONO: ele já manda fotos?]`.
8. **FAQ B2B** (`<details>` + schema — a operacional da V1A + a fiscal da V2C): Faturamento 30 dias/boleto? · Homologação de fornecedor? · **"Vocês emitem NF?"** → resposta explica **fatura/NF de locação de bens móveis** (locação não gera NFS-e comum — LC 116/2003) · Seguro/responsabilidade? · Funcionário opera a máquina? · Montagem fora do horário comercial? · Evento em shopping/rua?
9. **Form B2B com destino REAL:** Web3Forms (mesmo padrão de `src/components/forms/ContactForm.tsx:51` — funciona em static export e ENTREGA por e-mail). Campos: empresa, telefone (obrigatório), e-mail, data, nº pessoas. Pós-envio: confirmação + botão opcional "continuar no WhatsApp" (wa.me prefill). O dado NÃO evapora se a aba do wa.me morrer.
10. CTA final: WhatsApp + tel + e-mail. Schema: Service + FAQPage + BreadcrumbList.

---

## 6. /QUANTO-CUSTA, /FESTAS, /COMO-FUNCIONA, /SOBRE, /GALERIA

- **/quanto-custa** — H1 "Quanto custa alugar fliperama, videokê e games?"; resposta direta de 50 palavras (snippet-alvo, §9.5); tabela "o que influencia o preço" (equipamento, período da diária `[CONFIRMAR: horas]`, data/sazonalidade, região, escada/andar, nº de itens); faixas por categoria `[CONFIRMAR COM DONO]` (versão B: sem faixas, com "como calculamos" + "combos saem melhor"); "a partir de R$" só com compromisso escrito (piloto: kits); FAQ + FAQPage. CTA + sticky.
- **/festas** — espelho B2C: seções âncora #infantil, #adulto (bodas, 60-70-80, 15 anos); cada uma com mix sugerido, 3 produtos linkados, foto real, FAQ própria (idade mínima, espaço em apartamento, chuva). NUNCA primeiro corte (é a LP do público que paga o Ads — crítica procedente da mãe).
- **/como-funciona** — passos numerados com prazos reais `[CONFIRMAR]`, sinal `[CONFIRMAR: %]`, política de chuva/reagendamento `[CONFIRMAR]`, defeito/garantia, HowTo schema (**vendido ao dono como GEO/consistência, NÃO como rich result — Google matou HowTo/FAQ rich results em 2023**).
- **/sobre** — fatos datáveis 1993→hoje, frase citável verbatim idêntica à da home, foto do fundador `[CONFIRMAR]`, zero missão/visão.
- **/galeria** — álbuns POR EVENTO: "Spotify, 2024 · 6 máquinas" `[CONFIRMAR: ano/escopo por álbum]`. Fallback (dono não confirmar): grid com legendas nomeadas sem ano.

---

## 7. DIREÇÃO VISUAL (dark/neon domesticado — humano, não terminal)

Tokens Tailwind v4 `@theme` em `src/app/globals.css` (evolução dos atuais):

```css
--color-bg:        #0A0A12;  --color-surface: #12121C;  --color-surface-2: #1A1A28;
--color-line:      rgb(168 85 247 / 0.16);
--color-ink:       #F4F4F8;  --color-ink-soft: #A6A6BD; /* piso de texto informativo */
--color-whatsapp:  #25D366;  --color-whatsapp-hover: #1EBE5D; /* EXCLUSIVO ação */
--color-neon-cyan: #22D3EE;  /* links, foco */  --color-neon-pink: #EC4899; /* labels editoriais */
--color-neon-purple: #A855F7; /* decoração estrutural */
--color-fact:      #FACC15;  /* âmbar: preço/faixas */
--glow-scale: 1;             /* /empresas roda com .5 (enxerto V1B) */
```

- Tipografia mantida: Bricolage Grotesque (display) / DM Sans (body 16px) / JetBrains Mono (SÓ specs, tabelas, rank, ano — telefone e preço em DM Sans forte). Piso 12px absoluto.
- Motion: CSS-first; `rise-in` em entrada de seção; `prefers-reduced-motion` desliga TUDO (gate). Nada anima opacidade de conteúdo above-the-fold.
- Imagem: LQIP/cor dominante OBRIGATÓRIO (batch sharp one-off grava `placeholder` no metadata.json); AVIF/WebP; dimensões fixas; alt descritivo real.
- Assinaturas mantidas: corner-brackets, divider-neon, dot-grid, 404 arcade. Máx 1 textura decorativa por dobra. Botões de CTA: texto humano normal ("Pedir orçamento no WhatsApp"), nunca HUD.

**Componentes a criar** (todos server-first exceto interação):
`src/components/cta/WhatsAppCta.tsx` (único; props `surface: home|category|product|empresas|kit|orcamento|festas`, prefill humano com lacunas, GA4, par `tel:`, linha fora-do-horário) · `src/components/orcamento/QuoteCart.tsx` + `QuoteDrawer.tsx` (localStorage, data obrigatória, wa.me multi-linha) · `src/components/orcamento/StickyBar.tsx` (global mobile) · `src/components/content/AnswerCapsule.tsx` · `SpecsTable.tsx` · `FaqNative.tsx` (`<details>` + FAQPage espelhado) · `TrustStrip.tsx` · `src/components/seo/JsonLd.tsx` (`<script>` inline server; substituir os `next/script` de `src/app/catalogo/[...slug]/page.tsx:206,266`).
**Alterar:** `whatsapp.config.ts` (mapa de prefills por surface), `CatalogCard.tsx` (spec real no lugar do contador + botão "+ Orçamento" COM RÓTULO, não ícone solto), `Main.tsx` (matar grid de 4 valores + ssr:false do Top 10), `Footer.tsx` (CNPJ/LGPD/GBP), `Header.tsx` (contador do orçamento).
**Extensão do `metadata.json`** (fonte de verdade, sem CMS): `specs{dimensoes,peso,tomada,jogadores,espacoMinimo,passaPorta80,elevador,itensInclusos[]}`, `faq[]`, `capsule`, `badges[]` (enum: `novo|mais-pedido`), `placeholder` (LQIP). Preenchimento: **15 produtos top primeiro** (planilha-template pro dono — enxerto V2A), resto herda FAQ da categoria e omite tabela.

---

## 8. SEO/GEO/ADS TÉCNICO

- **robots:** deletar `public/robots.txt`; `src/app/robots.ts` único com directive própria por bot: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Meta-ExternalAgent (Allow: /), `Disallow: /studio/`, Sitemap absoluto.
- **UM sitemap:** `src/app/sitemap.ts` reescrito usando `slug-utils` (NFC — o atual gera URL com acento → 404), TODAS as rotas (incl. /empresas /galeria /como-funciona /festas /quanto-custa /privacidade). Aceite (V1B): `npm run build && grep -c "<url>" out/sitemap.xml` = total de rotas, zero URL com espaço/acento. Matar `public/sitemap.xml` + postbuild.
- **JSON-LD server-side por página:** home = EntertainmentBusiness `@id` (foundingDate "1993", NAP `[CONFIRMAR: endereço]`, geo, areaServed Osasco+Grande SP, openingHours, `hasMap`→GBP, sameAs GBP/Instagram/wa.me) + WebSite; categoria = CollectionPage+ItemList+FAQPage; produto = Product+Offer LeaseOut+additionalProperty+FAQPage; /como-funciona = HowTo; /empresas = Service+FAQPage; tudo com BreadcrumbList e `dateModified` real do build. FAQPage/HowTo = valor GEO, zero promessa de rich result.
- **llms.txt** gerado no build (índice + descrição) — 30 min, expectativa ZERO declarada.
- **Ads:** 1 ad group : 1 categoria-LP; H1 = keyword; CWV verde mobile (LCP<2.5s/INP<200ms/CLS<0.1) no PageSpeed ANTES de campanha; conversão GA4 = `whatsapp_click` qualificado (20s+) importado no Ads; message assets WhatsApp em paralelo; reconciliação GA4 × etiquetas.
- **GA4 (taxonomia V2C):** `whatsapp_click{surface,product}`, `tel_click`, `orcamento_add`, `orcamento_send{itens,data}`, `kit_pdf_download`, `form_submit_b2b`.
- **Audits no CI (`package.json` scripts):** `audit:fake` (grep `sales-utils|98%|reviewCount|ratingValue|locações` = zero), `audit:raw` (curl|grep telefone+capsule+FAQ+spec por template no export), `audit:sitemap` (zero 404). Build falha se qualquer um falhar.
- **Off-site (DONO-CHECKLIST.md):** GBP completo + Bing Places + Foursquare + Apple Maps com NAP idêntico; pedir review Google pós-evento; baseline mensal de citação IA começa JÁ.

---

## 9. COPY PRONTA (PT-BR)

**9.1 Answer capsule da home:**
> A Aluguel de Games loca fliperamas, videokês, PS5, realidade virtual, máquina de dança e jogos de mesa para festas e eventos em Osasco e toda a Grande São Paulo. Você escolhe, a gente entrega montado e testado, com contrato e nota fiscal. Orçamento pelo WhatsApp (11) 96526-1000. Desde 1993.

**9.2 Prefills:**
- Home/widget: `Oi! Quero um orçamento pra minha festa 🎉\nData: ___\nBairro/cidade: ___\nConvidados: ___\nItens: {itens ou "me ajuda a escolher"}`
- Produto: `Oi! Vi o *{produto}* no site e quero um orçamento.\nData: ___\nBairro/cidade: ___`
- Linha de apoio de TODO CTA: `ou ligue (11) 96526-1000 · atendemos das [X]h às [Y]h [CONFIRMAR]`

**9.3 Frase citável (verbatim home + /sobre):**
> A Aluguel de Games loca fliperamas, videokês e games para festas em Osasco e Grande São Paulo desde 1993 — antes do primeiro PlayStation existir — com eventos realizados para Bradesco, Spotify, Arnold Classic e Danilo Gentili.

**9.4 Capsule /empresas + prefill B2B:**
> Locação de fliperamas, videokês, simuladores e games para eventos corporativos em São Paulo: SIPAT, confraternização, lançamento e ativação de marca. Fatura de locação, contrato e equipe no local. Desde 1993 — Bradesco, Spotify e Arnold Classic já jogaram com a gente. Fale com um consultor, escreva pro nosso e-mail ou baixe o kit de aprovação pra apresentar aí dentro.
> Prefill: `Olá! Sou da empresa ___ e quero orçamento pra evento corporativo.\nTipo (SIPAT/confra/ativação): ___\nPessoas: ___\nData: ___\nCidade: ___`

**9.5 FAQ-snippet de preço (/quanto-custa + home):**
> **Quanto custa alugar um fliperama pra festa?**
> Depende de três coisas: o equipamento, a data (fim de semana e dezembro lotam antes) e o bairro da entrega. A diária padrão cobre `[CONFIRMAR COM DONO: período]`, com entrega, montagem, retirada e suporte inclusos — sem taxa escondida. Alugando mais de um item junto, o combo sai melhor. Faixas de referência: `[CONFIRMAR COM DONO: faixas]`. Manda data e bairro no WhatsApp que a gente fecha o valor.

**9.6 Garantia (produto + FAQ + como-funciona):**
> **E se o equipamento der problema no meio da festa?**
> A gente resolve: troca o equipamento ou manda técnico no local, sem custo. Todo item sai testado da nossa base e vai com contrato — se algo falhar, o problema é nosso, não seu. `[CONFIRMAR COM DONO: redação final]`

---

## 10. ESFORÇO (1 dev) E PLANO DE CORTE

| Fase | Escopo | Dias |
|---|---|---|
| **0** | Des-fabricação (arquivo:linha §1.1) · robots.ts · sitemap único + aceite · `<WhatsAppCta>` prefill 100% + tel + GA4 · JSON-LD server-side base · footer CNPJ/LGPD · **DEPLOY** | 4 |
| 1 | Motor: QuoteCart+drawer+wa.me multi-linha · StickyBar global · tokens/piso 12px · pipeline LQIP/AVIF (sharp one-off) | 3 |
| 2 | Home nova (8 dobras, hero estático, widget) + FAQ/schema | 3 |
| 3 | Template categoria-LP + 7 instâncias (capsule/FAQ/tabela) — SEM migração de URL | 3 |
| 4 | Produto novo (galeria scroll-snap, SpecsTable, garantia, chips) + extensão metadata + 15 specs top c/ planilha do dono | 4 |
| 5 | /quanto-custa · /festas · /como-funciona (HowTo) · /empresas máquina (kit PDF + dimensionamento + Web3Forms + e-mail) · /privacidade | 4 |
| 6 | GEO final: llms.txt, audits CI, CWV pass (PageSpeed por LP), OG 1200×630 por template, /sobre, /galeria álbuns | 3 |
| | **Total** | **24** |

**Corte (nesta ordem — /festas e kit PDF são NUNCA-CORTA):**
1. /regiao/* (geo-targeting do Ads cobre) — grátis.
2. Álbuns da galeria → grid com legendas — 1d.
3. Tabela comparativa das categorias — 0,5d.
4. Widget de orçamento da home → CTA com prefill (drawer global fica) — 1d.
5. Specs além dos 15 top → herda categoria — 1d.
**Nunca corta:** fase 0, prefill universal, tel junto ao CTA, HTML cru, /quanto-custa, /festas, kit PDF B2B, e-mail em /empresas, garantia no produto.

## 11. O QUE NÃO FAZER (lista fechada)

Migração de slug do catálogo · busca (qualquer forma) · carrossel autoplay no hero · marquee · contador/percentual/review fabricado · aggregateRating · sistema de review próprio · "Online agora" · badge de notificação · SLA de tempo sem assinatura do dono · número de catálogo sem confirmação · seção missão/visão/valores · logo-wall sem autorização formal · Radix Accordion em FAQ · `ssr:false` above-the-fold · doorway pages de cidade · toggle claro · A/B de micro-copy · depender de Sanity pra lançar · prometer FAQ/HowTo rich result ao dono · duas barras flutuantes simultâneas · texto <12px.
