# Auditoria — Página de Produto (/catalogo/[...slug])

Arquivos analisados:
- src/app/catalogo/[...slug]/page.tsx
- src/components/catalogo/ProductInfo.tsx
- src/components/catalogo/ProductGallery.tsx
- src/components/catalogo/RelatedProducts.tsx
- src/components/catalogo/CatalogCard.tsx (usado pelos relacionados)
- src/components/sections/top-toys/product-modal/CarouselModal.tsx
- src/lib/sales-utils.ts
- src/hooks/useModalHistory.ts
- Verificação ao vivo: curl http://localhost:3000/catalogo/realidade-virtual/oculus-quest-2/

---

## 1. PROVA SOCIAL FABRICADA E INCONSISTENTE (ALTO — confiança/risco legal)

### 1a. "Locações" geradas por hash — dado inventado
- `src/lib/sales-utils.ts:1-13` — o próprio comentário admite: "Geração determinística de
  'número de locações' por produto. Usado como social proof ... até termos um sistema real
  de tracking de aluguéis". Min 100, máx 200+, hash FNV-1a do key (linhas 20-27, 60-63).
- Exibido como dado real em:
  - `src/components/catalogo/CatalogCard.tsx:96` — `formatRentalCount(getRentalCount(item.key, { override: item.locacoes }))` + label "locações" (linha 98). Esses cards aparecem nos "Produtos Relacionados" da própria página de produto.
  - `src/components/sections/top-toys/product-modal/CarouselModal.tsx:85-86,153-157` — "140+ locações" com ícone TrendingUp, rank-based (`getRentalCount(item.id, rank)`).
- Risco: número inventado apresentado como métrica real = publicidade enganosa (CDC art. 37).
  Se um cliente perceber que TODO produto tem entre "100+" e "200+", a credibilidade da
  marca inteira despenca. O campo `locacoes` do metadata.json permite override real, mas
  nenhum metadata.json define esse campo hoje.

### 1b. Métricas contraditórias entre páginas
- Página de produto: `ProductInfo.tsx:122-123` → **"100% Satisfação"**
- Home: `src/components/StartCarouselClaude.tsx:185` → **"98%" Satisfação**
- Página de produto: `ProductInfo.tsx:114-115` → "500+ Eventos realizados"
- Home: `StartCarouselClaude.tsx:181-182` → "500+ Eventos desde 1993"
- Sobre: `src/app/sobre/page.tsx:203` → "500+ Eventos realizados"
- "500+ eventos desde 1993" = ~15 eventos/ano em 33 anos — número que SUBVENDE a empresa.
  Inconsistência 98% vs 100% é exatamente o tipo de coisa que comprador corporativo nota.

### 1c. Badge do meio quebrado visualmente
- `ProductInfo.tsx:118` — "Orçamento via Whatsapp" renderizado com `text-2xl font-bold`
  (estilo de número de estatística) — uma frase longa no slot de uma métrica; além disso
  "Whatsapp" grafado errado (correto: WhatsApp).

---

## 2. SEO TÉCNICO DA PÁGINA DE PRODUTO (ALTO)

### 2a. Canonical conflita com URL real e com o sitemap (3 hosts/formatos diferentes)
- `page.tsx:96-98` — canonical de produto montado SEM trailing slash:
  `${baseUrl}/catalogo/${slugArr.map(encodeURIComponent).join("/")}`
- `next.config.ts:10` — `trailingSlash: true` → a URL real servida é `.../oculus-quest-2/`
- `.env` — `NEXT_PUBLIC_SITE_URL=https://alugueldegames.com.br` (SEM www)
- `src/app/layout.tsx:34` — `metadataBase: https://www.alugueldegames.com.br` (COM www)
- `next-sitemap.config.js:4` — `siteUrl: 'https://www.alugueldegames.com.br'` (COM www)
- HTML renderizado confirmado via curl:
  `<link rel="canonical" href="https://alugueldegames.com.br/catalogo/realidade-virtual/oculus-quest-2"/>`
  → canonical aponta para host sem www E sem barra final, enquanto o sitemap submete
  URLs www com barra. O Google recebe sinais canônicos contraditórios em TODAS as ~54
  páginas de produto. Nota: canonical de categoria (page.tsx:62) TEM barra final —
  inconsistência até dentro do mesmo arquivo.

### 2b. Título duplica a marca
- `page.tsx:113` — `title: \`${item.titulo} - Aluguel de Games\`` passa pelo template do
  layout (`layout.tsx:36` — `"%s | Aluguel de Games SP"`), resultando em:
  **"Oculus Quest 2 - Aluguel de Games | Aluguel de Games SP"** (confirmado no HTML).
  Marca repetida 2x desperdiça os ~60 chars do SERP. Também perde keywords transacionais —
  ideal seria algo como "Aluguel de Oculus Quest 2 para Festas e Eventos em SP".

### 2c. Product JSON-LD não está no HTML estático
- `page.tsx:266-272` usa `next/script` (estratégia padrão afterInteractive) para o schema
  Product → o script é injetado só após a hidratação no cliente. No HTML inicial do curl, o
  único `<script type="application/ld+json">` presente é o WebSite (do layout); o Product
  só existe escapado dentro do payload RSC. Google geralmente renderiza JS, mas Bing/
  outros crawlers e validadores não veem. Para um site 100% estático isso é desperdício —
  basta `<script type="application/ld+json">` nativo no JSX. Mesmo problema no
  CollectionPage de categorias (page.tsx:206-210).
- Positivo: comentário em page.tsx:237-239 mostra decisão consciente de NÃO inventar
  aggregateRating — correto (contrasta com as "locações" fabricadas do item 1a).
- Falta `BreadcrumbList` schema (breadcrumb visual existe, page.tsx:276-298, sem markup).

### 2d. OG tags para WhatsApp com defeitos (irônico: WhatsApp é O canal de conversão)
- `page.tsx:143-148` — bloco `other` com 'og:image:secure_url' etc. é renderizado pelo
  Next como `<meta name="og:image:secure_url" ...>` (atributo `name`, não `property`) —
  parsers OG ignoram. Confirmado no HTML; e a URL nesse bloco sai SEM encoding
  ("/Organizado/Realidade Virtual/Oculus Quest 2/...", com espaços).
- `og:image:type` declara `image/jpeg` mas as imagens são `.webp` (page.tsx:129);
  WhatsApp historicamente é exigente com preview — webp declarado como jpeg pode quebrar
  a thumbnail quando o cliente compartilha o link do produto no próprio WhatsApp.
- width/height declarados 1200x630 (page.tsx:126-127) são falsos — as fotos de produto são
  ~quadradas.

### 2e. Conteúdo raso (thin content)
- Texto visível total da página: ~1,5 KB (medido no HTML renderizado).
- Descrições no metadata.json: mín 0, máx 254 caracteres. 4 produtos com descrição VAZIA
  (Fliperama de 1.000 / 5.000 / Infantil de 1.000 / SF4 e KOF XIII) e 1 com 19 chars
  (Fliperama 11.000). Mediana ~160 chars (3 bullets).
- O box "Características" (`ProductInfo.tsx:84-92`) é IDÊNTICO em todos os 54 produtos
  (4 bullets genéricos) — zero conteúdo único por página.
- Não existem: especificações técnicas (dimensões, peso, voltagem 110/220V, espaço
  necessário, nº de jogadores, faixa etária, lista de jogos inclusos), FAQ por produto,
  fotos do equipamento em eventos reais, vídeo. Para quem aluga para festa, "passa na
  porta/elevador?" e "precisa de tomada?" são perguntas de pré-venda que hoje viram
  fricção no WhatsApp. 54 páginas quase idênticas entre si = risco de thin/doorway
  content e desperdício do potencial de long-tail ("alugar fliperama para casamento").

### 2f. generateStaticParams / 404
- `page.tsx:26-46` — sólido: gera todos os prefixes (categorias intermediárias + produto),
  Set para deduplicar, `dynamicParams = false`. Em dev, slug inexistente devolve HTTP 500
  (testado: /catalogo/nao-existe-xyz/ → 500), mas em static export o host serve o 404.html
  — comportamento dev-only, ok.
- Curiosidade de dados: "Videokês/Karaokês" é produto (tem metadata.json) E pai de
  "Videokês/Karaokês/Karaokê 2025" — getItem resolve produto primeiro (page.tsx:170),
  então /catalogo/videokes/karaokes/ mostra o produto e o filho "Karaokê 2025" fica
  acessível só pela URL direta/sitemap.

---

## 3. CTA / CONVERSÃO (MÉDIO-ALTO)

### 3a. CTA abaixo da dobra no mobile, sem sticky
- Ordem mobile: breadcrumb → galeria com `mt-20` (80px de espaço morto,
  `ProductGallery.tsx:44` e `:33`) → imagem quadrada full-width → thumbnails → badge →
  H1 → descrição → box características → SÓ ENTÃO os botões (ProductInfo.tsx:95-109).
  Em qualquer celular o CTA fica 2+ telas abaixo. Não há CTA sticky de produto.
- O `mt-20` da galeria também desalinha as colunas no desktop (a coluna de info não tem
  o mesmo offset) — a galeria começa 80px abaixo do H1.
- O WhatsAppFloat global (`src/components/WhatsAppFloat.tsx:29-36`) existe, mas abre o
  wa.me SEM mensagem (`WHATSAPP_CONFIG.link` puro) — quem clica nele da página do
  Fliperama chega no atendente sem contexto nenhum. Perde o principal benefício de estar
  numa página de produto.

### 3b. Mensagem pré-preenchida: contextual, porém inconsistente e pobre
- `ProductInfo.tsx:35-44` — BOM: inclui o título do produto ("Olá! Gostaria de fazer um
  orçamento para o produto: X."). Dois CTAs (Orçamento + Pergunta) com tracking GTM
  diferenciado por location e product_name (linhas 40-50) — bem feito.
- `CarouselModal.tsx:47-50` usa `WHATSAPP_CONFIG.message.product` =
  "aluguel do brinquedo: X" (`src/config/whatsapp.config.ts:8`) — chamar um PS5/fliperama/
  simulador de "brinquedo" desalinha com o posicionamento (especialmente público
  corporativo da página /empresas). 3 copys diferentes da mesma intenção no site.
- Nenhuma mensagem inclui a URL do produto nem coleta qualificadores (data do evento,
  região, duração) — um mini-form opcional de 2 campos antes do redirect aumentaria a
  qualidade do lead sem matar a conversão.
- Sem preço nem ancoragem ("a partir de R$ X" / "combos a partir de..."). Ausência total
  de preço é defensável no modelo de orçamento, mas alguma ancoragem reduziria leads
  desqualificados e o medo de "deve ser caro".

### 3c. Modal Top 10 não rastreia conversão
- `CarouselModal.tsx:180` — `onClick={() => window.open(buildWhatsAppLink(item.title), "_blank")}`
  SEM `trackWhatsAppClick` — cliques de orçamento vindos do Top 10 (provável maior fonte
  de interesse da home) são invisíveis no GTM/GA. ProductInfo rastreia; o modal não.
- Modal também não tem link "ver página do produto" — usuário interessado não consegue
  ir do modal para a página com todas as fotos/descrição.
- Badge "Disponível" fixo (CarouselModal.tsx:150-152) — disponibilidade fabricada, sempre
  verde, sem checagem real.

### 3d. UI morta / fricção menor
- `ProductInfo.tsx:72-74` — botão coração (FiHeart) sem onClick, não faz NADA. UI morta
  ao lado do share.
- `ProductInfo.tsx:20-32` — handleShare só funciona se `navigator.share` existir (mobile/
  Safari); em desktop Firefox/Chrome antigo o clique é um no-op silencioso. Sem fallback
  de copiar link.
- Claims divergentes: box diz "Entrega e instalação incluídas" (ProductInfo.tsx:87) e o
  fallback de meta description diz "Entrega e instalação grátis!" (page.tsx:110).

---

## 4. GALERIA (BAIXO — globalmente OK)
- `ProductGallery.tsx` — funcional e razoável: thumbnails, contador, fullscreen com
  layoutId compartilhado, AnimatePresence. Pontos:
  - Setas de navegação só aparecem em hover (`opacity-0 group-hover:opacity-100`,
    linhas 75/81) — em touch não há hover; funciona porque o tap revela, mas affordance
    fraca; não há swipe gesture na imagem principal (só botões).
  - `sizes="...33vw"` (linha 64) incorreto para uma coluna de 50% em desktop — irrelevante
    na prática porque `unoptimized: true` (sem srcset), mas denota copy-paste.
  - Alt text genérico "X - Imagem 2" (linha 61) — perde SEO de imagem (Google Images é
    canal real para "fliperama aluguel").
  - Fullscreen sem navegação prev/next (precisa fechar para trocar de imagem) e sem
    suporte a tecla ESC/setas.
  - `priority={selectedIndex === 0}` (linha 65) — bom para LCP.
  - Sem foto "em contexto de evento" — todas as fotos são de catálogo.

## 5. PRODUTOS RELACIONADOS (MÉDIO)
- `RelatedProducts.tsx:12-14` — `allItems.filter(item.key.startsWith(categoria)).slice(0, 4)`:
  1. Usa só a categoria top-level: para "Jogos Eletrônicos/Consoles/Playstation/PS5", os
     "relacionados" são os 4 primeiros itens de TODA a categoria "Jogos Eletrônicos" em
     ordem de leitura do catálogo (provavelmente fliperamas) — não os outros consoles.
  2. Sempre os MESMOS 4 itens para quase todos os produtos da categoria (sem shuffle,
     sem afinidade, sem cross-category "quem alugou X também alugou Y").
  3. `startsWith` com string crua é frágil (colisão por prefixo se uma categoria for
     prefixo de outra; hoje não há caso, mas "Jogos de Mesa"/"Jogos Eletrônicos" mostram
     o risco — deveria comparar o segmento, não prefixo de string).
- Sem link "ver toda a categoria" no fim da seção — dead end se os 4 não interessarem.
- Os cards exibem as "locações" fabricadas (ver item 1a) bem na página de produto.

## 6. useModalHistory (BAIXO)
- `useModalHistory.ts:11,31,37` — três `console.log` de debug em produção.
- Lógica geral correta (pushState ao abrir, popstate fecha, history.back() ao fechar no X,
  limpeza de entrada órfã na montagem via replaceState — linhas 7-13). Riscos menores:
  - `window.history.back()` no fechamento (linha 54) é assíncrono; fechar e reabrir o
    modal muito rápido pode criar corrida entre o back pendente e o novo pushState.
  - O hook é usado só no TopToys (TopToys.tsx:50); o fullscreen da ProductGallery NÃO usa
    — botão voltar do Android dentro do fullscreen da galeria sai da página em vez de
    fechar o overlay (inconsistência de comportamento entre os dois modais).

## 7. BREADCRUMB (MÉDIO)
- `page.tsx:291` — link da categoria aponta para `/catalogo#${encodeURIComponent(categoria)}`
  (âncora na listagem geral, com nome cru acentuado) em vez da página real de categoria
  `/catalogo/jogos-eletronicos/` que EXISTE, é estática e indexável (CategoryListing).
  Joga PageRank interno na âncora errada e piora a navegação.
- Níveis intermediários omitidos (ex.: "Consoles" e "Playstation" não aparecem para o PS5).
- Sem BreadcrumbList JSON-LD (rich snippet de breadcrumb perdido no SERP).

---

## RESUMO DE OPORTUNIDADES (priorizadas para conversão)
1. CTA sticky mobile (barra fixa com "Pedir orçamento no WhatsApp" + nome do produto).
2. WhatsAppFloat contextual: na rota /catalogo/[produto], pré-preencher com o título.
3. Unificar copy do WhatsApp ("brinquedo" → "equipamento") e incluir URL do produto.
4. Adicionar trackWhatsAppClick no CarouselModal + link "ver detalhes" para a página.
5. Substituir "locações" hash por dados reais (campo locacoes no metadata.json) ou
   remover; unificar 98%/100% e revisar "500+ desde 1993" (subvende).
6. Enriquecer metadata.json: especificações estruturadas (dimensões, voltagem, espaço,
   jogadores, jogos inclusos), FAQ, 2-3 parágrafos únicos por produto; preencher os 4
   produtos com descrição vazia.
7. Corrigir canonical (www + trailing slash, alinhar .env/metadataBase/sitemap) e título
   (remover "- Aluguel de Games" do page-level title; usar padrão transacional).
8. JSON-LD inline (sem next/script) + BreadcrumbList.
9. Breadcrumb → linkar páginas de categoria reais com todos os níveis.
10. Relacionados por subcategoria + shuffle determinístico + link "ver categoria".
