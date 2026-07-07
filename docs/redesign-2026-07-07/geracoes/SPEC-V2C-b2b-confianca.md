# SPEC V2C — "PROVA + B2B" (evolução do design opus-4.8)

Data: 2026-07-07 · Autor: designer de produto sênior (geração V2C do painel)
Base: branch `design-opus-4.8` (working tree atual). Esta spec é EVOLUÇÃO, não reescrita: mantém o esqueleto, o dark/neon e as 8 páginas existentes; muda a espinha dorsal de prova social, eleva /empresas a máquina de venda B2B e fecha 100% dos gates do BRIEF-REDESIGN.md.

---

## 1. Conceito em 3 frases + por que ganha

1. **A empresa mais antiga do nicho na Grande SP não pode parecer "mais um site de brinquedos": todo scroll, em toda página, encosta em prova verificável** — "desde 1993", Bradesco, Spotify, Arnold Classic, Danilo Gentili — servida como elemento estrutural (trust strip, provas contextuais por categoria, álbuns nomeados), nunca como seção institucional.
2. **/empresas deixa de ser landing bonita e vira máquina de aprovação interna**: o comprador B2B não decide sozinho, ele precisa CONVENCER o financeiro/RH; então a página entrega o kit pronto (PDF de aprovação, CNPJ visível, dimensionamento 50/150/400 pessoas, prazos e agenda honesta de nov/dez) e reduz o ciclo de venda de semanas pra dias.
3. **Reviews não moram no site**: o site afirma só o que pode provar (idade, nomes, fotos de eventos reais) e delega avaliação ao Google Maps com link "veja/avalie no Google" — o que casa com GEO, porque LLMs cruzam site × GBP e recompensam consistência.

**Por que ganha dos concorrentes:** os 9 sites analisados (Freitas ~30, Mega Power ~28, MC ~22, Fun Play ~20, Alugue Games ~11, etc.) têm menos idade e NENHUM (a) publica specs em tabela, (b) tem página B2B com kit de aprovação, (c) tem portfólio por evento nomeado, (d) tem qualquer preparo GEO. A V2C ataca exatamente esses 4 vazios com o único ativo que ninguém pode copiar: 33 anos com clientes de nome nacional. "Mais antiga que o PlayStation" é um claim que só esta empresa pode fazer.

---

## 2. Arquitetura de páginas (sitemap proposto) e papel de cada uma

```
/                                Home. SEO: head terms ("aluguel de games sp"). Ads: brand only.
                                 GEO: answer capsule + frase citável canônica.
/catalogo                        Hub navegável. SEO: interlinking (headings → categorias).
/catalogo/{7 categorias}         LPs PRIMÁRIAS de Ads (1 ad group : 1 página, H1 = keyword):
  fliperamas · videokes · realidade-virtual · consoles-ps5-xbox ·
  maquina-de-danca · maquina-de-pegar-bichinho · jogos-de-mesa
                                 GEO: capsule + FAQ própria + tabela comparativa dos itens.
/catalogo/[produto]              Ficha técnica (tabela HTML) + galeria + FAQ do item + orçamento.
                                 SEO: long tail ("aluguel fliperama snack"). GEO: specs extraíveis.
/empresas                        MÁQUINA B2B (seção 5). Ads: campanha própria (SIPAT, confra,
                                 ativação de marca). SEO: "aluguel de games eventos corporativos".
/empresas/kit-aprovacao.pdf      PDF estático gerado no build (ver 5.4). Lead magnet sem backend.
/festas                          NASCE. Espelho B2C: aniversário adulto/infantil, bodas, 15 anos,
                                 60-70-80 anos. Ads: "aluguel de jogos festa aniversário".
/quanto-custa                    NASCE. Gap nº1 (7/9 escondem preço). Featured snippet + citação IA.
/como-funciona                   Elevada a referência do nicho: prazos reais, sinal, chuva, defeito.
                                 HowTo schema. Alvo de "como funciona aluguel de fliperama".
/sobre                           Fatos datáveis (linha 1993→2026), frase citável, foto do fundador
                                 [PLACEHOLDER]. História = tempero, 1 página só.
/galeria                         Álbuns POR EVENTO nomeado ("Spotify, 2024 · 6 máquinas").
/contato                         Form (tel obrigatório, e-mail opcional) → pós-envio abre wa.me.
/regiao/{osasco, sao-paulo, alphaville-barueri, abc}   MÁX 4, SÓ com 40-60% conteúdo único
                                 (equipes/logística/eventos reais daquela região); senão não nasce.
```

Morre (herdado do brief, executado na fase 0): `sales-utils.ts` + 3 render points, badge "1" do float, "98%", `StarRating` órfão, guerra de sitemaps (fica SÓ `app/sitemap.ts` corrigido com slugs NFC + todas as rotas; deletar `public/sitemap.xml` commitado e o postbuild `next-sitemap`), `public/robots.txt` corrompido (fica `app/robots.ts` com os 10 bots de IA), `ADMIN.md`, deps Sanity do `package.json` do app (studio/ fica no repo, desligado; religar é decisão pós-launch).

---

## 3. HOME seção por seção (mobile-first, ordem = escada de convencimento)

Ordem fixa do brief em toda página: **o que tem → como orçar → como funciona → prova → CTA**. A home de opus-4.8 já acerta o esqueleto; a V2C corrige a camada de prova e injeta a capsule.

**3.1 Hero (server-rendered, pinta sem JS — manter conquista do opus-4.8)**
- Badge: `★ Desde 1993 · Osasco e Grande SP` (adicionar Osasco: âncora local pro GBP/LocalBusiness).
- H1 (mantém): "Aluguel de games pra sua festa ser inesquecível". Sub nova: "Fliperama, videokê, VR, PS5 e máquinas de festa. Entrega, montagem e técnico de plantão na Grande SP. Desde 1993."
- Carrossel mantido (10 slides), com LEGENDA DENTRO DO SCRIM em todo slide: "Aniversário do Danilo Gentili", "Bradesco · Braland", "Spotify". A melhor prova do site hoje está muda; aqui ela fala. Texto ≥12px, contraste AA sobre o scrim.
- Animações CSS-first (`rise-in` mantido), `opacity` inicial nunca 0 no LCP element.

**3.2 CTA dual (primeira dobra mobile, logo sob o hero)**
- `<WhatsAppCta surface="home">` verde: "Pedir orçamento no WhatsApp" com prefill: "Oi! Quero um orçamento pra minha festa. Data: ___ / Bairro: ___ / Convidados: ___". Ao lado/abaixo: "ou ligue (11) 96526-1000" (link `tel:` rastreado). Botão 2 outline: "Ver catálogo".
- Verde = cor EXCLUSIVA de ação WhatsApp em todo o site (nenhum outro elemento verde).

**3.3 Trust strip verificável (substitui os counters 33+/500+/60+ e o trust bar qualitativo)**
- Uma linha (scroll horizontal no mobile, sem quebrar): `Desde 1993 · milhares de eventos [PLACEHOLDER: dono confirma nº real] · Bradesco · Spotify · Arnold Classic · Danilo Gentili · ★ 4,x no Google [PLACEHOLDER: nota+link GBP]`.
- Nomes em TEXTO (logo-wall só com autorização formal). Nota do Google linka o perfil do Maps (`hasMap` no schema). O counter "33+" pode ficar (é derivável de 1993); "500+ eventos" e "98%" morrem.

**3.4 Answer capsule (novo, primeiro bloco de TEXTO corrido da página)**
- 40-80 palavras, HTML cru, logo após a trust strip, estilizada como bloco editorial discreto (não parece "texto SEO"): o-que / pra-quem / onde / desde-1993 / como-orçar. Ver copy na seção 9.3.

**3.5 KITS (novo, curadoria ANTES do paredão de catálogo)**
- 3 cards horizontais (scroll-snap no mobile): **Festa Teen/Retrô** (fliperama + console + máquina de dança), **Confra/SIPAT** (link pra /empresas), **Infantil** (garra + air game + inflável). Cada card: 3 itens com thumb, "ideal pra X convidados", `<WhatsAppCta surface="kit">` com prefill nomeando o kit. Sem preço até o dono assinar piso (gate 1.6); com preço, o card ganha linha "a partir de R$ ___" acima do CTA.
- Kits são dados em `src/data/kits.ts` (build-time, sem CMS).

**3.6 Fileiras Netflix (mantidas: Fliperamas / Máquinas / Consoles)**
- `CatalogCard` limpo: no lugar do contador fake, linha de atributo real do produto vindo do metadata estendido ("2 jogadores · 1,8m · 220V") com fallback pros 3 fatos fixos ("Entrega e montagem incluídas · Testado antes do evento · Contrato e NF"). Headings linkam a categoria (`/catalogo/fliperamas` etc.) — maior ganho de interlinking sem escrever conteúdo.

**3.7 Prova em contexto (substitui a seção "Desde 1993" com grid de 4 valores do Main.tsx)**
- Faixa horizontal com 3 cards de evento real (foto + legenda nomeada + 1 linha de contexto: "Arnold Classic 2025 · Expo Center · ativação com simuladores") + link "Ver galeria de eventos". Zero adjetivo, zero "valores da empresa". O bloco Demonstra (vídeos) funde aqui: vídeo é prova, não decoração.

**3.8 FAQ da home (novo) + fecho**
- 4 perguntas em `<details>/<summary>` nativo (chuva, o que está incluso, quanto tempo dura a diária, atende meu bairro?) com FAQPage schema espelhando o texto.
- Frase factual citável (seção 9, copy 3) como parágrafo final + link /sobre.
- CTA final dual (WhatsApp prefill + tel). Footer: CNPJ, NAP completo, LGPD/privacidade, link GBP.

Mobile: dobras 3.1-3.3 cabem no primeiro scroll e meio; float do WhatsApp mantido SEM badge "1".

---

## 4. Página de produto seção por seção

1. **Breadcrumb** (BreadcrumbList schema) + **H1** = "Aluguel de {Produto}" (title: "Aluguel de {Produto} para Festas e Eventos | Desde 1993").
2. **Galeria** (fotos do metadata.json, LQIP obrigatório, dimensões fixas → CLS 0).
3. **Answer capsule do produto** (2-3 frases, HTML cru): o que é, pra que festa serve, o que está incluso.
4. **Bloco de conversão**: `<WhatsAppCta surface="product">` prefill "Oi! Vi o *{Produto}* no site e quero um orçamento. Data: ___ / Bairro: ___" + "ou ligue (11) 96526-1000" + botão secundário "+ Adicionar ao orçamento" (localStorage; drawer com data obrigatória/bairro/tipo de festa; CTA do drawer gera wa.me multi-linha com todos os itens).
5. **Ficha técnica em `<table>` HTML** (extensão do metadata.json: `specs: { jogadores, dimensoes, tomada, espacoMinimo, passaEmPorta, peso }`): é o dado que NENHUM concorrente publica e a pergunta nº1 de apartamento. Preenchimento incremental: tabela renderiza só as linhas existentes; sem specs → mostra os 3 fatos fixos (nunca tabela vazia).
6. **Preço**: duas variantes desenhadas (gate 1.6). SEM preço: linha "Orçamento em minutos pelo WhatsApp · valor depende de data, bairro e período" linkando /quanto-custa. COM preço (compromisso escrito do dono): "A partir de R$ ___ / diária" como linha tipográfica forte acima do CTA, não badge.
7. **O que está incluso** (lista fixa de 4: entrega+montagem, teste no local, técnico de plantão, retirada) + **garantia anti-risco** (1 frase formalizada com o dono: "Deu defeito? Trocamos o equipamento ou mandamos técnico, sem custo" `[PLACEHOLDER: dono valida a política]`).
8. **FAQ do item** (2-4 perguntas em `<details>`, FAQPage schema): tomada, espaço, elevador, idade.
9. **Relacionados** (mantém `RelatedProducts`) + prova contextual: 1 foto de evento real usando o item, quando existir no acervo da galeria.
10. **Sticky CTA mobile**: barra inferior fixa (aparece após rolar a galeria, some quando o CTA principal está visível — resolve a convivência com galeria touch; o float esconde enquanto a sticky bar está ativa): "Pedir orçamento · {Produto}" verde + ícone tel.
11. JSON-LD: `Product` + `Offer businessFunction: LeaseOut` + seller → `#organization` (mantém padrão opus-4.8), sem aggregateRating.

---

## 5. /empresas (B2B) seção por seção — a máquina

Tese da página: quem chega aqui é RH/compras/agência com um chefe pra convencer. A página vende DUAS vezes: pro visitante e pro aprovador dele.

**5.1 Hero B2B** (evolui o atual): mantém o layout grid com case Bradesco ao lado. H1 vira keyword: "Aluguel de games para eventos corporativos em SP". Sub: "SIPAT, confraternização, ativação de marca. NF, contrato e equipe no local. Desde 1993: Bradesco, Spotify e Arnold Classic já jogaram com a gente." CTA: "Falar com consultor" (prefill B2B: "Oi! Sou da empresa ___ e quero orçamento pra um evento corporativo. Data: ___ / Local: ___ / Nº pessoas: ___") + "ou ligue (11) 96526-1000".

**5.2 Answer capsule B2B** + linha de credenciais em texto: `CNPJ [PLACEHOLDER] · NF e contrato · atendemos toda a Grande SP`.

**5.3 Guia de dimensionamento 50/150/400 (novo, coração da página)**
- Tabela HTML de 3 colunas (mobile: cards empilhados): **até 50 pessoas** (2-3 equipamentos, ex.: 1 fliperama + 1 console + 1 jogo de mesa, espaço ~15m²), **até 150** (4-6 equipamentos + máquina de destaque tipo garra/dança, ~40m²), **300-400+** (estações múltiplas, simuladores, operação com equipe dedicada, ~100m²+, padrão Arnold Classic).
- Cada porte: nº de equipamentos sugerido, espaço, tomadas necessárias, tempo de montagem, e CTA próprio com prefill do porte. Números logísticos `[PLACEHOLDER: dono valida]`. É conteúdo GEO-perfeito: pergunta real ("quantos brinquedos pra 100 pessoas?") que nenhum concorrente responde.

**5.4 Kit de aprovação interna (novo, lead magnet estático)**
- Card destacado: "Precisa aprovar internamente? Baixe o kit (PDF, 2 páginas): quem somos + CNPJ, clientes atendidos, o que está incluso, requisitos técnicos, modelo de cronograma". Link direto pro PDF (gerado no build a partir de um HTML impresso via script one-off; sem backend, sem e-mail gate — atrito zero, e o PDF circula com a marca dentro da empresa cliente). Evento GA4 no download.

**5.5 Cases (mantém o grid 3×[9:16] atual: Bradesco foto + Arnold vídeo + equipamentos)** — adiciona 4º card Spotify quando houver mídia `[PLACEHOLDER: foto Spotify]`; cada case ganha 1 linha de escopo factual ("6 máquinas · 2 dias" `[PLACEHOLDER]`).

**5.6 Agenda honesta (novo, curto)**
- Bloco de 2 frases: "Novembro e dezembro lotam com confraternizações: empresas que fecham até setembro garantem data e equipamento. Fora da alta temporada, conseguimos atender até pedidos da mesma semana." Urgência REAL, não countdown fake. `[PLACEHOLDER: dono valida prazos]`.

**5.7 Como contratar** (mantém os 4 passos atuais: Brief → Proposta em 1 dia útil → Contrato → Execução) + **diferenciais** (mantém grid 06, trocando "Pacotes flexíveis: de 50 a 1000+ pessoas" pra linkar o dimensionamento).

**5.8 FAQ B2B** (`<details>` + FAQPage): faturamento/boleto, homologação de fornecedor, seguro/responsabilidade, montagem fora de horário comercial, NF de locação.

**5.9 CTA final** (mantém o atual) + linha "NF · Contrato · CNPJ [PLACEHOLDER] · Grande SP".

JSON-LD: Service ("Locação de games para eventos corporativos") + FAQPage + BreadcrumbList.

---

## 6. Sistema de prova social HONESTO (transversal)

**Inventário do que é verdade e pode ser dito:**
| Claim | Forma no site | Fonte |
|---|---|---|
| Desde 1993 / 33 anos / mais antiga do segmento na Grande SP | badge hero, title, trust strip, JSON-LD `foundingDate` | registro da empresa (verificável) |
| "Mais antiga que o PlayStation" | ângulo de copy em /sobre e social | fato (PS1 = dez/1994) |
| Bradesco, Spotify, Arnold Classic, Danilo Gentili | texto na trust strip, cases /empresas, álbuns /galeria, legendas do carrossel | fotos/vídeos próprios do acervo |
| "Milhares de eventos" | trust strip | `[PLACEHOLDER: dono confirma se existe nº real; se Sanity ligar, campo `locacoes` real substitui]` |
| Nota do Google | trust strip + footer, linkada ao Maps | GBP `[PLACEHOLDER: nota + URL]` |
| Garantia anti-risco | produto + como-funciona | política real do dono, formalizada `[PLACEHOLDER]` |

**Regras duras (gate binário, auditável por grep):**
1. Nenhum número que não esteja na tabela acima. `grep -r "98%\|locações\|reviewCount\|ratingValue" src/` = zero.
2. Reviews vivem no Google Maps: o site EXIBE a nota real + link "avalie no Google" (pedido pós-evento vira processo do dono), NUNCA widget de depoimento próprio (a seção vazia da MC é o contraexemplo: apodrece sem curadoria).
3. Prova sempre COM contexto: foto nomeada > logo > adjetivo. Álbum da galeria = "Evento, ano · escopo" (padrão PartySlate).
4. Todo `[PLACEHOLDER]` tem fallback desenhado: a trust strip sem nota do Google só omite o último item; o card de kit sem preço não tem buraco visual.

---

## 7. Direção visual (evolução do dark/neon, não revolução)

**Mantém** (consenso jun/2026): dark permanente sem toggle, fundo quase-preto, acentos neon, corner brackets arcade, `divider-neon`, 404 arcade, tipografia Bricolage Grotesque (display) / DM Sans (body) / JetBrains Mono (numerais/labels).

**Evolui:**
- **Hierarquia de acento com papel fixo**: verde `#22c55e` = SÓ WhatsApp/ação; ciano = B2B e labels informativos; rosa/magenta = editorial/festa (B2C); roxo = navegação/hover. Hoje os 4 se misturam por vibe; a V2C fixa o mapa semântico (1 cor = 1 significado) pra o olho aprender o site em 2 dobras.
- **Camada de prova tem estilo próprio**: tudo que é FATO (trust strip, specs, credenciais, legendas de evento) usa JetBrains Mono em `--text-fact` (zinc-300, ≥12px, nunca `/40-60`), sobre superfície levemente elevada. Fato parece placa técnica; marketing parece editorial. O usuário distingue no reflexo.
- **Legibilidade como gate**: mínimo 12px absoluto; `text-muted-foreground` com opacidade modificada abolido pra texto informativo; contraste AA em cima de imagem = scrim obrigatório.
- **Motion**: manter `rise-in` e hovers, tudo CSS; `prefers-reduced-motion` desliga TUDO (já há base no globals.css:404); nada de animação em conteúdo above-the-fold que atrase LCP; autoplay de vídeo só com `preload="metadata"` + poster.
- **LQIP obrigatório**: cor dominante ou blur de 16px inline em toda imagem (batch sharp one-off gerando `placeholder` no metadata.json); imagem sem placeholder no dark lê como quebrada.

**Tokens Tailwind (extensão do globals.css `@theme`):**
```css
--color-whatsapp: #22c55e;        /* exclusivo ação WhatsApp */
--color-whatsapp-hover: #16a34a;
--color-accent-b2b: #22d3ee;      /* ciano: corporativo/labels */
--color-accent-party: #ec4899;    /* rosa: editorial B2C */
--color-accent-nav: #a855f7;      /* roxo: navegação/hover */
--color-fact: #d4d4d8;            /* texto de prova/specs, zinc-300 */
--color-surface-fact: #18181b;    /* superfície de placa técnica */
--font-fact: var(--font-mono);    /* JetBrains Mono */
--text-min: 0.75rem;              /* 12px: piso absoluto */
```

---

## 8. Camada GEO/AI-friendly + SEO técnico embutida no design

**Regra mãe: se não está no HTML cru, não existe.** Aceite por template: `curl $URL | grep` acha telefone, capsule, FAQ, specs.

1. **robots.ts único** (deletar `public/robots.txt` corrompido): allow explícito por token pra GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Meta-ExternalAgent; disallow `/studio/` pra todos.
2. **sitemap.ts único**: slugs normalizados (NFC, mesmos helpers do `slug-utils.ts`), TODAS as rotas (incl. /empresas, /galeria, /como-funciona, /festas, /quanto-custa, /regiao/*), `lastmod` real do build; matar `public/sitemap.xml` e postbuild `next-sitemap`.
3. **Answer capsule** como componente `<AnswerCapsule>` server-rendered: primeiro bloco de texto de home, 7 categorias, /empresas, /festas, /quanto-custa, /como-funciona (40-80 palavras; AI Overviews citam do primeiro 30% do texto).
4. **FAQ = `<details>/<summary>` nativo SEMPRE** (nunca Radix Accordion fechado: desmonta e some do HTML). FAQPage schema espelha o texto visível 1:1, por página, específico da página.
5. **H2/H3 em pergunta** nas páginas de intenção ("Quanto custa alugar um fliperama?", "Fliperama passa em porta de apartamento?", "Quantos equipamentos pra 100 pessoas?") + seções autossuficientes (chunk retrieval: cada seção se sustenta sem o resto da página).
6. **Tabelas HTML de specs** (produto) e dimensionamento (/empresas): dado extraível > adjetivo.
7. **JSON-LD server-side** (`<script>` no JSX, padrão já usado): grafo com `@id` único; home = EntertainmentBusiness com `foundingDate: 1993`, NAP real Osasco `[PLACEHOLDER: endereço]`, `areaServed`, `hasMap` → GBP, `sameAs`; produto = Product+Offer LeaseOut; categoria = CollectionPage+ItemList; como-funciona = HowTo; FAQPage onde houver FAQ; `dateModified` real do build.
8. **Frase factual citável** (copy 9.3) na home e /sobre, verbatim idêntica nos dois lugares (consistência aumenta chance de citação literal).
9. **llms.txt** gerado no build (30 min de custo, expectativa zero declarada).
10. **Ads-ready por construção**: H1 = keyword em toda LP de categoria; CTA acima da dobra; CWV verde (imagens AVIF/WebP com width/height fixos, hero sem JS, zero layout shift de fonte via `font-display: swap` + fallback metrics); CNPJ+NAP+LGPD no footer (quality score + GBP + homologação B2B); GA4: eventos `whatsapp_click` (com `surface` + 20s+ qualificado), `tel_click`, `orcamento_add`, `kit_pdf_download` — fechados ANTES de mídia.
11. **Off-site (entregável pro dono, fora do design)**: GBP completo + Bing Places + Foursquare + Apple Maps com NAP idêntico; pedido de review pós-evento; baseline mensal de citação IA começa JÁ (antes do redesign ir ao ar).

---

## 9. Copy de exemplo (PT-BR, tom: direto, sem letra miúda, zero frufru)

**9.1 Hero (home):**
> **Aluguel de games pra sua festa ser inesquecível.**
> Fliperama, videokê, VR, PS5 e máquinas de festa. Entrega, montagem e técnico de plantão na Grande SP. Desde 1993.

**9.2 CTA principal (botão + linha de apoio):**
> [🟢 **Pedir orçamento no WhatsApp**]
> ou ligue (11) 96526-1000 · resposta em horário comercial
> *prefill:* "Oi! Quero um orçamento pra minha festa. Data: ___ / Bairro: ___ / Convidados: ___"

**9.3 Claim de idade (frase citável, verbatim na home e /sobre):**
> A Aluguel de Games loca fliperamas, videokês, realidade virtual e games para festas e eventos em Osasco e Grande São Paulo desde 1993 — é a locadora de games mais antiga da região, com eventos realizados para Bradesco, Spotify, Arnold Classic e Danilo Gentili. Orçamento pelo WhatsApp (11) 96526-1000.
> *(variação de tempero pra /sobre: "Estamos nisso desde antes do PlayStation existir.")*

**9.4 Abertura /empresas (answer capsule B2B):**
> Locação de fliperamas, videokês, simuladores e games para eventos corporativos em São Paulo: SIPAT, confraternização, lançamento e ativação de marca. NF, contrato, equipe de montagem no local e proposta em até 1 dia útil. Desde 1993 — Bradesco, Spotify e Arnold Classic já jogaram com a gente. Fale com um consultor no WhatsApp ou baixe o kit de aprovação pra apresentar aí dentro.

**9.5 FAQ destaque (/quanto-custa e produto):**
> **Quanto custa alugar um fliperama?**
> O valor depende de três coisas: qual equipamento, pra onde vai (bairro/cidade) e a data (fim de semana e dezembro têm mais procura). A diária padrão cobre [X horas — PLACEHOLDER: dono confirma] com entrega, montagem, teste e retirada inclusos. Manda data e bairro no WhatsApp e o orçamento fechado sai em minutos: (11) 96526-1000.

---

## 10. Esforço estimado (1 dev = Matheus) e plano de corte

| Fase | Escopo | Dias |
|---|---|---|
| **0. Des-fabricação + quebras binárias** (gate: vai ao ar ANTES de tudo) | deletar sales-utils + render points, badge "1", "98%"; sitemap único NFC; robots.ts com bots IA; footer CNPJ/NAP/LGPD | 1,5 |
| **1. Motor de conversão** | `<WhatsAppCta>` único (prefill por surface + GA4 + tel), sticky CTA produto, trust strip, capsules home/categorias | 2,5 |
| **2. Produto + specs** | extensão metadata.json (specs/FAQ/placeholder LQIP via sharp one-off), tabela de ficha técnica, FAQ `<details>` + schema, variantes com/sem preço | 3 |
| **3. Carrinho de orçamento → wa.me** | localStorage + drawer + mensagem multi-linha + eventos GA4 | 2 |
| **4. /empresas máquina B2B** | dimensionamento, kit PDF (build), agenda honesta, FAQ B2B, case Spotify | 2 |
| **5. Páginas novas** | /quanto-custa, /festas, kits na home (`kits.ts`), elevação /como-funciona (HowTo) | 3 |
| **6. Galeria por evento + /sobre fatos + regiao (se houver conteúdo)** | álbuns nomeados, frase citável, máx 4 regiões | 2 |
| **7. QA dos gates** | curl-grep por template, PageSpeed mobile, grep-audit números, GSC real | 1 |
| **Total** | | **~17 dias** |

**Se apertar, corta nesta ordem (de trás pra frente na dor):**
1. `/regiao/*` inteiro (geo-targeting do Ads cobre) — economiza 1 dia.
2. `/festas` (home + categorias seguram o B2C; nasce depois) — 1,5 dia.
3. Carrinho de orçamento (o prefill unitário já converte; carrinho é otimização multi-item) — 2 dias.
4. Kit PDF (a seção de dimensionamento fica; o PDF vira fase 2) — 0,5 dia.
**Nunca corta:** fase 0, `<WhatsAppCta>`, /quanto-custa (gap nº1 do mercado, 1 dia de escrita + template), trust strip, specs em tabela. Com todos os cortes: **~12 dias** mantendo todos os gates do brief.
