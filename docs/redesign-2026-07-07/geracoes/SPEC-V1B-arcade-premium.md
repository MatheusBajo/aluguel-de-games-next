# SPEC V1B — ARCADE PREMIUM

Redesign total · Aluguel de Games (alugueldegames.com.br) · 07/07/2026
Base: branch `design-opus-4.8` (evolução, não reescrita do zero). Contrato: `../BRIEF-REDESIGN.md` — todos os gates 1.1–1.7 são pré-condição desta spec.

---

## 1. Conceito

**Três frases:**

1. A Aluguel de Games é o arcade mais antigo da Grande SP em forma de empresa: o site vira o fliperama definitivo dela — preto de gabinete, neon dosado como luz de marquise (não como poluição de LAN house), tipografia editorial 2026 e o catálogo tratado como vitrine de máquinas, cada uma com ficha técnica de verdade.
2. Toda a estética serve UM funil: o cliente no celular vê o que tem, entende como orçar, encontra prova verificável (1993 + Bradesco/Spotify/Arnold Classic/Gentili) e aperta o botão verde com a mensagem já escrita — o verde é a única cor de ação da interface inteira, como o botão START de um gabinete.
3. Por baixo do visual, cada página é um documento citável por IA: answer capsule no topo, specs em tabela HTML crua, FAQ em `<details>`, JSON-LD server-side — o site mais bonito do nicho é também o único que ChatGPT/Perplexity conseguem ler.

**Por que ganha dos concorrentes:** Freitas, Mega Power, MC Diversões, Fun Play e Alugue Games competem com sites de template claro, foto de banco de imagem, zero specs, zero preparo GEO e prova social fraca ou fabricada. O Arcade Premium ataca os três eixos ao mesmo tempo: (a) **memória visual** — é o único site do nicho com identidade (dark arcade elevado), o cliente lembra "aquele site preto dos fliperamas"; (b) **autoridade honesta** — "desde 1993, mais antiga que o PlayStation" é um claim que nenhum concorrente pode copiar, e os nomes Bradesco/Spotify/Arnold/Gentili são verificáveis; (c) **terreno GEO vago** — os 9 concorrentes fetchados em jul/2026 têm zero answer capsule, zero FAQPage, vários bloqueando bots de IA por descuido. Quem estrutura primeiro vira a resposta padrão dos motores.

---

## 2. Arquitetura de páginas (sitemap proposto)

Segue a IA do brief §2 à risca. Papel de cada rota:

| Rota | Papel SEO | Papel Ads | Papel GEO |
|---|---|---|---|
| `/` | Head terms ("aluguel de games sp"), brand | Destino de brand campaign apenas | Answer capsule + frase citável + FAQPage |
| `/catalogo` | Hub de link equity → categorias (headings linkados) | — | ItemList schema, índice extraível |
| `/catalogo/fliperamas` (+6) | **7 LPs primárias**: 1 keyword transacional cada ("aluguel de fliperama sp") | **1 ad group : 1 página**, H1 = keyword | Answer capsule + tabela comparativa dos modelos + FAQ própria + Service/FAQPage schema |
| `/catalogo/[produto]` | Long-tail ("aluguel fliperama snack") | Destino de DSA/remarketing | Ficha técnica em tabela = chunk perfeito pra retrieval |
| `/empresas` | "locação de games eventos corporativos", "sipat" | Campanha B2B própria | Capsule B2B + dimensionamento em tabela |
| `/festas` (nasce) | "brinquedos para festa de aniversário adulto/infantil" | Campanha B2C festas | Espelho B2C do /empresas |
| `/quanto-custa` (nasce) | **Gap nº1 do nicho** — featured snippet "quanto custa alugar fliperama" | Destino de query de preço (alta intenção) | Página mais citável do site: pergunta + resposta direta + tabela de fatores |
| `/como-funciona` | Suporte de conversão, "como funciona aluguel de brinquedos" | Extensão de sitelink | HowTo schema, passos numerados com prazos reais |
| `/sobre` | Brand + E-E-A-T (fatos datáveis, 1993→hoje) | Sitelink | Frase factual citável + timeline com datas |
| `/galeria` | Imagens por evento nomeado (image SEO com alt real) | Sitelink / prova | Álbuns "Spotify, 2024 · 6 máquinas" = prova extraível |
| `/contato` | NAP consistência | Sitelink | NAP idêntico ao GBP/Foursquare/Bing |
| `/regiao/{osasco,sao-paulo,alphaville-barueri,abc}` | Local pack support, MÁX. 4, só com 40–60% conteúdo único | Geo-campanhas | areaServed reforçado; anti-doorway: sem conteúdo único, não publica |

**Morre** (fase 0, antes de qualquer pixel novo): `sales-utils.ts` + 3 render points, badge "1" do float, "98%", `StarRating` órfão, `public/sitemap.xml` stale, `public/robots.txt` corrompido, `ADMIN.md`, postbuild `next-sitemap`, deps Sanity do bundle (decisão: **remover agora, religar pós-launch se o dono quiser editar** — não ficar no meio).
**Dono único do sitemap:** `app/sitemap.ts` reescrito com slugs NFC normalizados (mesma função de slug do build de rotas, importada de um módulo só) + TODAS as rotas estáticas e dinâmicas. Aceite: `npm run build && grep -c "<url>" out/sitemap.xml` bate com o total de rotas, zero URL com espaço/acento.

---

## 3. HOME seção por seção (mobile-first, ordem = escada de decisão)

Regra transversal: cada dobra tem UM job e UM CTA. Verde só em ação WhatsApp. Tudo abaixo renderiza no HTML estático; animação é progressiva (CSS-first, `prefers-reduced-motion` desliga tudo).

### 3.1 Hero — "a marquise"
- **Layout mobile:** badge → H1 → sub → CTA dual → carrossel. O texto vem ANTES da imagem no DOM (LCP = H1 pinta sem JS; carrossel é enhancement).
- Badge mono (`label-arcade`): `★ DESDE 1993 · OSASCO E GRANDE SP` com glow roxo sutil.
- **H1:** "Fliperama, videokê e games na sua festa. Desde 1993." (keyword na frente, claim junto).
- Sub (1 linha): "Entrega, montagem e suporte técnico inclusos na Grande São Paulo."
- **CTA dual:** `[WhatsApp verde] Pedir orçamento` (prefill home, ver §8) + `[ghost] Ver catálogo`. Logo abaixo, em texto 14px: "ou ligue **(11) 96526-1000**" (`tel:` rastreado). Full-width no mobile, lado a lado ≥sm.
- Carrossel: mantém os 10 slides reais, corner-brackets arcade, **legenda DENTRO do scrim** ("Aniversário do Danilo Gentili", "Bradesco · Braland") — a legenda é a prova, não decoração. Autoplay pausa em `prefers-reduced-motion` e em touch.
- SEM stats animados no hero (o Counter 33+/500+/98% morre; o que era 98% não volta em lugar nenhum).

### 3.2 Trust strip verificável (a "régua de crédito")
Barra horizontal logo sob o hero, texto puro (nada de logo-wall sem autorização):
`Desde 1993 · milhares de eventos [PLACEHOLDER: dono confirma nº real] · Bradesco · Spotify · Arnold Classic · Danilo Gentili · ★ 4,X no Google [PLACEHOLDER: nota+link GBP]`
A nota Google é link pro Maps ("ver avaliações"). No mobile vira marquee lento em loop (pausa em reduced-motion, conteúdo íntegro no HTML).

### 3.3 Answer capsule (o "lede")
Primeiro bloco de TEXTO corrido da página, 40–80 palavras, estilizado como parágrafo editorial grande (não parece SEO-block):
> "A Aluguel de Games loca fliperamas, videokês, games, realidade virtual e jogos de mesa para festas e eventos em Osasco e toda a Grande São Paulo desde 1993. O orçamento é pelo WhatsApp (11) 96526-1000: você diz data, bairro e o que quer, a gente responde com valor fechado. Entrega, montagem e suporte técnico inclusos."

### 3.4 Kits — curadoria antes do paredão
3–4 cards grandes horizontais (scroll-snap no mobile): **Festa Teen**, **Noite Retrô**, **Confraternização/SIPAT**, **Festa Infantil**. Cada card: foto real, 3–4 itens do kit em texto, chip "escopo fixo", CTA verde "Orçar este kit" (prefill nomeando o kit). Kits são onde preço fechado entra primeiro se o dono assinar (§6 do brief).

### 3.5 Fileiras Netflix (7 categorias)
Mantém `CatalogSection` atual (funciona), com upgrades: título da fileira é `<h2>` LINKADO pra categoria-LP; cards com **spec chips reais** no lugar do contador fake ("2 jogadores · 1,8m · 220V" vindos do metadata estendido, fallback: "Entrega e montagem incluídas"); LQIP/cor dominante obrigatório.

### 3.6 Top 10 mais pedidos
Mantém o formato editorial numerado (é memorável), SEM contador de locações e sem estrela. Badge honesto permitido: "mais pedido" (curadoria do dono) / "novo no catálogo". Texto ≥12px sempre (corrige os 6,7px).

### 3.7 Como funciona — 4 passos compactos
4 passos numerados em linha (mobile: vertical): "1. Chama no WhatsApp · 2. Recebe o orçamento · 3. A gente entrega e monta · 4. Buscamos depois da festa". Link "ver detalhes, prazos e política de chuva →" pra `/como-funciona`. CTA verde no fim do bloco.

### 3.8 Prova por evento (galeria nomeada)
Grid 2×2 (mobile: carrossel snap) de álbuns REAIS: "Spotify, 2024 · 6 máquinas", "Bradesco · Braland", "Aniversário do Danilo Gentili", "Arnold Classic". Foto + legenda + link pro álbum em `/galeria`. É a seção que nenhum concorrente consegue copiar.

### 3.9 Quanto custa (teaser honesto)
Bloco curto: H2 "Quanto custa alugar?" + 3 linhas: o preço depende de equipamento, data e região; diária padrão de X horas `[PLACEHOLDER]`; link forte "Entenda o orçamento →" `/quanto-custa` + CTA verde "Pedir valor agora".

### 3.10 FAQ da home (6 perguntas)
`<details>/<summary>` nativos (NUNCA Radix fechado), FAQPage schema espelhando 1:1: chuva, prazo de reserva, o que está incluso, área atendida, tomada/espaço, e se dá problema no equipamento (garantia formalizada com o dono, §6).

### 3.11 Frase citável + fecho
Parágrafo factual (o formato que LLM repete): "A Aluguel de Games realiza eventos em Osasco e Grande São Paulo desde 1993, com equipamentos locados para Bradesco, Spotify, Arnold Classic e Danilo Gentili." + link `/sobre`. Depois, CTA final grande (verde + tel) em card com moldura neon.
**Footer:** NAP completo + **CNPJ `[PLACEHOLDER]`** + link LGPD/privacidade + links de categoria (SEO interno) + "avalie a gente no Google" → GBP.

**Float WhatsApp:** mantém, SEM badge "1"; some quando um CTA sticky de página de produto está visível (regra de convivência, §4).

---

## 4. Página de produto seção por seção

Template `/catalogo/[produto]`. Job: transformar interesse em mensagem contextual com data/bairro.

1. **Breadcrumb** (BreadcrumbList schema) + categoria linkada.
2. **Galeria** — fotos reais, LQIP cor-dominante, aspect fixo (CLS 0), swipe no mobile; corner-brackets como moldura da imagem ativa.
3. **H1 + capsule do produto** — H1 = nome; abaixo, 2–3 frases: o que é, pra que festa serve, o que está incluso. No HTML cru.
4. **Bloco de conversão** — CTA verde "Pedir orçamento no WhatsApp" (prefill: "Oi! Vi o *{Produto}* no site e quero um orçamento. Data: ___ / Bairro: ___ / Convidados: ___") + "ou ligue (11) 96526-1000" + botão secundário "+ Adicionar ao orçamento" (carrinho localStorage, §8). **Preço:** as duas variantes desenhadas — COM preço: linha "a partir de R$ XXX / diária" acima do CTA em mono, hierarquia própria (nunca badge enfiada); SEM preço: no lugar, linha "Valor fechado por WhatsApp em minutos · sem compromisso". Nenhuma parece quebrada.
5. **Ficha técnica** — `<table>` HTML real (o coração GEO da página): dimensões (L×A×P), peso, tomada 110/220V, nº de jogadores, espaço mínimo, passa em porta/elevador (sim/não/medida), itens inclusos. Campos novos no `metadata.json` (`specs: {...}`); enquanto o dono não preencher um campo, a LINHA não renderiza (nunca "—" fake).
6. **"Na sua festa"** — 3 fatos verificáveis fixos: "Entrega e montagem incluídas · Equipamento testado antes de sair · Contrato e NF". (Substituto no pixel do contador fake.)
7. **FAQ do item** (3–5, `<details>` + FAQPage): tomada, espaço, escada/elevador, idade recomendada, e a garantia de troca/técnico.
8. **Relacionados** — 4 cards da mesma categoria + card do kit que contém o item.
9. **Sticky CTA mobile** — barra inferior fixa: `[verde] Orçar {Produto}` + ícone tel. Aparece após o usuário passar o bloco 4; o WhatsAppFloat se esconde enquanto a barra está visível (resolve a pergunta (d) do consenso: nunca dois verdes flutuando). `z-index` abaixo do lightbox da galeria; some com teclado aberto.

JSON-LD: `Product` + `Offer { businessFunction: LeaseOut, seller: #organization }` (preço só se real), Breadcrumb, FAQPage. Tudo `<script>` server-side no HTML.

---

## 5. /empresas (B2B) seção por seção

Job: fazer o RH/compras conseguir APROVAR internamente. Tom: menos neon, mais precisão (o dark fica, o glow cai 50% via token de intensidade).

1. **Hero B2B** — H1 "Games para eventos corporativos: SIPAT, confraternização e ativação de marca". Sub: "Desde 1993 · CNPJ, contrato e NF · Grande São Paulo". CTA verde "Orçamento corporativo" (prefill B2B: empresa/data/nº pessoas/local) + tel.
2. **Answer capsule B2B** (40–80 palavras): quem atende, o que entrega, como orça, prazos.
3. **Cases nomeados** — Bradesco·Braland (destaque com fotos), Spotify, Arnold Classic (vídeo mantido), Danilo Gentili. Formato ficha: evento, ano, nº de máquinas `[PLACEHOLDER: dono confirma nºs]`. Zero adjetivo, só fato.
4. **Guia de dimensionamento** — `<table>`: 50 / 150 / 400 pessoas → nº sugerido de estações, mix recomendado, espaço e tomadas necessários, nº de técnicos. (Tabela = chunk GEO perfeito + ferramenta real de aprovação.)
5. **Kit aprovação interna** — botão "Baixar kit (PDF)": 1 página com CNPJ, escopo padrão, requisitos técnicos, política de cancelamento, fotos. Gerado 1x, estático em `/public`. É o atalho pro decisor que precisa convencer o chefe.
6. **Como funciona corporativo** — 4 passos com prazos reais + **aviso honesto de agenda**: "novembro e dezembro lotam com semanas de antecedência — reserve antes" (urgência VERDADEIRA, única permitida no site).
7. **FAQ B2B** (`<details>` + schema): NF/faturamento, contrato, seguro/responsabilidade, montagem fora do horário comercial, tomadas/infra, cancelamento.
8. **Form de fecho** — telefone OBRIGATÓRIO, e-mail opcional, empresa, data, nº pessoas; pós-envio abre wa.me pré-preenchido com os dados. CTA verde + tel repetidos.

Schema: Service ("locação de games para eventos corporativos") + FAQPage + Breadcrumb. Campanha Ads própria (H1 = keyword do ad group B2B).

---

## 6. Sistema de prova social HONESTO

Princípio: **prova = fato verificável ou não vai pro ar.** Zero review próprio, zero número sem fonte. Hierarquia de prova (nesta ordem de força):

1. **Idade** — "Desde 1993" é o ativo nº1: badge do hero, title/OG de todas as páginas, trust strip, footer, JSON-LD `foundingDate`. Ângulo de copy autorizado: "mais antiga que o PlayStation" (PS1 = 1994, verificável). Comparativo com concorrentes NÃO vai pro site (vai pro Ads/pitch se o dono quiser).
2. **Nomes reais** — Bradesco, Spotify, Arnold Classic, Danilo Gentili em TEXTO (trust strip, carrossel com legenda, /empresas, /galeria). Logo-wall só com autorização formal por escrito `[PLACEHOLDER]`.
3. **Galeria por evento nomeado** — álbum com contexto ("Spotify, 2024 · 6 máquinas"): prova navegável que nenhum concorrente tem.
4. **Volume qualitativo** — "milhares de eventos" `[PLACEHOLDER: dono confirma se existe nº real; se existir, usar o nº com âncora temporal: 'mais de N eventos desde 1993']`. O `Counter` nunca renderiza "0+" nem valor fake.
5. **Nota Google linkada** — "★ 4,X no Google · ver avaliações" → GBP `[PLACEHOLDER: nota+URL]`. Reviews VIVEM lá; o site aponta, exibe a nota real e pede review ("avalie a gente") no footer e no pós-evento (checklist do dono).
6. **Garantia anti-risco formalizada** — redigida COM o dono a partir do que ele já pratica: "Deu problema no equipamento? Trocamos ou mandamos técnico no local." + política de chuva/reagendamento. Vai na FAQ de todas as páginas-chave e no /como-funciona. Formalizar, não inventar.

**Auditoria permanente (CI ou pre-commit):** `grep -rE "sales-utils|98%|reviewCount|ratingValue|locações" src/` = zero hits; todo claim numérico novo exige fonte no PR.

---

## 7. Direção visual — Arcade Premium

**Tese estética:** gabinete de fliperama sob luz de museu. Base quase-preta com textura mínima, neon como ACENTO cirúrgico (marquise, não letreiro de LAN house), tipografia editorial grande, ritmo de grid suíço. Evolução do dark/neon atual (consenso: mantém, sem toggle claro): menos cores gritando ao mesmo tempo, mais intenção.

### Paleta (tokens Tailwind v4, `@theme` no globals.css)
```css
@theme {
  /* Base — "cabinet" */
  --color-void: #08080D;        /* fundo página */
  --color-cabinet: #0E0E16;     /* surface de card */
  --color-panel: #16161f;       /* surface elevada / hover */
  --color-line: rgba(168,85,247,.14);  /* bordas */

  /* Texto */
  --color-ink: #F4F4F8;         /* títulos */
  --color-ink-dim: #A8A8B8;     /* corpo — NUNCA abaixo disto pra texto informativo (AA no void) */

  /* Neon — orçamento de 2 cores por viewport */
  --color-neon-purple: #A855F7; /* marca, glow, bordas ativas */
  --color-neon-cyan: #22D3EE;   /* secundária: links, hovers, detalhes HUD */
  /* pink/blue atuais são DEMITIDOS de papel estrutural (só em gradientes de foto/scrim) */

  /* Ação — exclusivo */
  --color-start: #22C55E;       /* verde WhatsApp: SÓ em CTA de conversa/tel. Proibido decorativo */
  --color-start-hover: #16A34A;

  /* Honestidade visual */
  --color-warn: #FBBF24;        /* avisos reais (agenda nov/dez) */
}
```
**Regra do orçamento de neon:** máximo 1 elemento com glow forte por viewport; glow = estado (ativo/hover/destaque), nunca papel de parede. `/empresas` roda com intensidade 50% (`--glow-scale: .5`).

### Tipografia (mantém as 3 famílias, endurece a escala)
- **Bricolage Grotesque** (display): H1 clamp(2.25rem→4.5rem), leading 0.95, tracking -0.02em. Só headings.
- **DM Sans** (body): 1rem/1.6; **piso absoluto 12px** (label-arcade sobe de 0.7rem pra 0.75rem).
- **JetBrains Mono** (HUD): specs, preços, badges, labels `PRESS START`-style em uppercase tracking 0.25em. É a voz "máquina" da marca.
- Numerais tabulares em qualquer número (preço, dimensão, ano).

### Motion
- CSS-first: hero pinta sem JS (fade/rise via `@keyframes`, nunca `opacity:0` inicial em conteúdo LCP).
- Vocabulário: rise-in 300ms cubic-bezier(.2,.8,.2,1) em entrada de seção (1x, `IntersectionObserver`); glow-pulse LENTO (3s) só no CTA final; scanline sutil opcional no 404 e na moldura do carrossel (opacity ≤ .06).
- `prefers-reduced-motion`: mata autoplay, marquee, pulse e parallax — gate de aceite, não afterthought.
- Framer Motion permanece só onde já existe e ganha guard; nada de motion novo dependente de JS acima da dobra.

### Imagem
- **LQIP obrigatório em TODA imagem** (script sharp one-off gera dominant-color + blur base64 no metadata.json; imagem sem placeholder no dark lê como quebrada).
- AVIF/WebP, dimensões fixas (CLS 0), alt descritivo real ("Fliperama Snack em festa corporativa — Bradesco 2024").
- Fotos reais sempre; nunca stock. Scrim gradiente `void→transparent` pra legenda legível dentro da foto.

### Componentes-assinatura
Corner-brackets (moldura HUD) nas imagens ativas; divisor de seção "insert coin" (linha + dot central neon); card de catálogo com borda `--color-line` que acende roxo no hover + spec chips mono; 404 arcade mantido; botão verde com label mono "PEDIR ORÇAMENTO ▸" estilo botão START.

---

## 8. Camada GEO/AI-friendly + SEO técnico (embutida no design, não bolt-on)

### Conversão instrumentada (gate 1.2)
- **`<WhatsAppCta>` único** sobre `whatsapp.config.ts`: props `surface` ("home" | "category" | "product" | "empresas" | "kit" | "orcamento") → `?text=` contextual humano com lacunas "Data: ___ / Bairro: ___ / Convidados: ___"; dispara GA4 (`whatsapp_click` + surface + product_name); todo uso renderiza par "ou ligue (11) 96526-1000" (`tel:` rastreado). 100% dos CTAs migram pra ele (grep-aceite: zero `wa.me` fora do componente).
- **Carrinho de orçamento** (Goodshuffle Wishlist pattern): "+ Adicionar ao orçamento" nos cards/produto → drawer client-side (localStorage): lista de itens, data OBRIGATÓRIA, bairro, tipo de festa → CTA gera wa.me multi-linha ("Oi! Quero orçamento para: • Fliperama Snack • Videokê … Data: … Bairro: …"). Zero backend. Kits usam o mesmo mecanismo.
- Conversão GA4→Ads: clique WhatsApp qualificado (20s+ na página). Tracking fechado ANTES de mídia.

### SEO técnico (gate 1.3)
- Sitemap: **`app/sitemap.ts` único dono** (slugs NFC via módulo compartilhado com o gerador de rotas; todas as rotas incl. /empresas /galeria /como-funciona /festas /quanto-custa). Deletar `public/sitemap.xml` e postbuild next-sitemap.
- Robots: deletar `public/robots.txt` (corrompido); `app/robots.ts` vira dono, liberando explicitamente GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Meta-ExternalAgent (cada um com directive própria) e bloqueando `/studio/` pra todos.
- JSON-LD **server-side inline** (`<script type="application/ld+json">` no RSC, nunca next/script): grafo com `@id` único — EntertainmentBusiness (foundingDate 1993, NAP, geo, `areaServed` Osasco+Grande SP, `hasMap` → GBP `[PLACEHOLDER URL]`, `sameAs` GBP/Instagram/wa.me), Offer LeaseOut, CollectionPage+ItemList, BreadcrumbList, FAQPage por página com FAQ visível, HowTo em /como-funciona, `dateModified` real do build.
- Canonical absoluto por página; www unificado (.htaccess mantido + redirects de slug curto /fliperama /videoke /vr); titles "Aluguel de {X} para Festas e Eventos | Desde 1993"; **OG 1200×630 real por template** (dark com foto + badge 1993 — WhatsApp é a SERP do dark social); `verification.google` só com código real.
- Hero server-rendered pintando sem JS (regressão `ssr:false` proibida).

### GEO (gate 1.4)
- **Regra do HTML cru** em todo template: preço/spec/FAQ/telefone/capsule existem no HTML servido. FAQ = `<details>/<summary>` nativo sempre (Radix Accordion proibido em conteúdo SEO). **Teste de aceite automatizável:** script `scripts/geo-audit.sh` roda `curl $URL | grep` pra telefone, capsule (primeiras 8 palavras), 1 pergunta de FAQ e 1 célula de spec em CADA template — falhou, não deploya.
- Answer capsule 40–80 palavras como primeiro texto de: home, 7 categorias, produto (versão curta), /empresas, /festas, /quanto-custa, /como-funciona.
- H2/H3 em formato de pergunta + seções autossuficientes (chunk retrieval) + tabelas de specs (nenhum concorrente publica; pergunta nº1 de apartamento).
- Frase factual citável na home e /sobre (formato §3.11).
- `llms.txt` gerado no build (30 min de custo, expectativa ZERO declarada).
- **Checklist off-site pro dono** (entregável .md): GBP completo + Bing Places + Foursquare + Apple Maps com NAP idêntico; pedir review Google no fim de cada evento; baseline mensal JÁ (antes do redesign): perguntar a ChatGPT/Perplexity/Gemini "aluguel de fliperama em Osasco/SP" e registrar quem é citado.

### Ads (gate 1.5)
Anatomia fixa das 7 categoria-LPs + /empresas + /festas + /quanto-custa: H1 keyword → sub "desde 1993" → CTA verde acima da dobra + tel → fotos reais → 4 passos → bloco de preço honesto → prova nomeada + link Google → FAQ → CTA final; sticky verde a página toda. CWV verde mobile (LCP<2.5s / INP<200ms / CLS<0.1) testado no PageSpeed antes de campanha. CNPJ+NAP+LGPD no footer.

### /quanto-custa (gate 1.6)
H1 "Quanto custa alugar fliperama, videokê e games?" → resposta direta em 50 palavras (snippet-alvo) → tabela "o que influencia o preço" (equipamento, período da diária `[PLACEHOLDER: horas]`, data/sazonalidade, região/frete, escada/andar) → faixas por categoria `[PLACEHOLDER: dono confirma]` → quando existe "a partir de R$" (só com compromisso escrito, piloto kits) → CTA. FAQPage schema.

---

## 9. Copy de exemplo (tom: direto, sem letra miúda, zero frufru)

**Hero (H1 + sub):**
> **Fliperama, videokê e games na sua festa. Desde 1993.**
> Entrega, montagem e suporte técnico inclusos em Osasco e toda a Grande São Paulo.

**CTA principal (botão + linha de apoio):**
> **PEDIR ORÇAMENTO NO WHATSAPP ▸**
> Resposta rápida em horário comercial · ou ligue (11) 96526-1000

**Claim de idade (trust strip / sobre):**
> Alugando diversão desde 1993 — antes do PlayStation existir. São mais de três décadas de festas, e os equipamentos que já animaram eventos do Bradesco, do Spotify, da Arnold Classic e do Danilo Gentili são os mesmos que chegam montados na sua casa.

**Abertura /empresas:**
> Games para o seu evento corporativo, sem dor de cabeça pra aprovar: CNPJ, contrato e nota fiscal desde o primeiro orçamento. A gente dimensiona por número de pessoas, entrega, monta, opera e desmonta — SIPAT, confraternização ou ativação de marca, em toda a Grande São Paulo. Bradesco, Spotify e Arnold Classic já fizeram festa com a gente. Novembro e dezembro lotam cedo: reserve antes.

**FAQ destaque (a que mata a objeção nº1):**
> **E se o equipamento der problema no meio da festa?**
> A gente resolve: troca o equipamento ou manda técnico no local, sem custo. Todo item sai testado da nossa base e vai com contrato — se algo falhar, o problema é nosso, não seu. `[PLACEHOLDER: validar redação final com o dono — formalizar o que ele já pratica]`

---

## 10. Esforço estimado (1 dev, dias úteis) e plano de corte

| Fase | Escopo | Dias |
|---|---|---|
| **0. Des-fabricação + quebras binárias** (gates 1.1/1.3 — VAI PRO AR ANTES DE TUDO) | deletar sales-utils+render points, badge "1", 98%; sitemap único NFC; robots.ts+bots IA; robots.txt fora; canonical/OG; `<WhatsAppCta>` + prefill 100% + tel + GA4 | **4** |
| 1. Design system Arcade Premium | tokens @theme, tipografia/escala, componentes-assinatura, LQIP pipeline (script sharp), reduced-motion | 3 |
| 2. Home nova | 12 seções §3, FAQ+schema, capsule, trust strip | 4 |
| 3. Produto + categoria-LP | template produto (ficha/spec no metadata, sticky CTA, FAQ), 7 categoria-LPs com anatomia Ads | 5 |
| 4. Carrinho de orçamento | drawer localStorage → wa.me multi-linha + kits | 3 |
| 5. Páginas novas | /quanto-custa, /festas, elevação /empresas (tabela dimensionamento, PDF kit, FAQ), /como-funciona HowTo | 4 |
| 6. GEO layer + QA | geo-audit.sh, llms.txt, curl-greps, PageSpeed/CWV, OG images, checklist off-site do dono | 3 |
| **Total** | | **26** |

**Se apertar, corta nesta ordem (o que NÃO corta: fase 0, nunca):**
1. `/regiao/*` (já é opcional; geo-targeting do Ads cobre) — corte grátis.
2. `/festas` (o /empresas + categorias seguram B2C no início) — economiza 1,5d.
3. PDF kit aprovação (vira v2; a tabela de dimensionamento fica) — 1d.
4. Carrinho de orçamento inteiro (prefill unitário já converte; kits viram prefill fixo) — 3d.
5. Componentes-assinatura de motion (scanline, marquee: só estático) — 1d.
**Intocáveis mesmo no corte máximo:** fase 0, ficha técnica em tabela, answer capsules, FAQ `<details>`+schema, /quanto-custa (é o gap nº1 do mercado — se sobrar UM dia de página nova, é ela).

Sanity: **fora do bundle no launch** (remover deps). Religa pós-launch como decisão própria, quando o campo `locacoes` real do dono puder substituir com honestidade o que o hash fingia.
