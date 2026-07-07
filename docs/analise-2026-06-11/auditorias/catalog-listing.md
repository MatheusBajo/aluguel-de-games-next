# Auditoria — Listagem do Catálogo (/catalogo e páginas de categoria)

Escopo: `src/app/catalogo/page.tsx`, `CatalogGrouped.server.tsx`, `CatalogList.server.tsx`,
`src/components/catalogo/{Catalogo,CatalogoList,CatalogSection,CategoryListing,CatalogPreview,CatalogCard}.tsx`.
Verificações feitas contra o dev server (http://localhost:3000/catalogo) e o filesystem `public/Organizado/`.

Dados de contexto: 54 produtos (metadata.json), 7 pastas nível-1 (incluindo "Pasta X" vazia, que
não renderiza porque não tem produtos — ok). HTML renderizado de /catalogo ≈ 503KB.

---

## ARQUITETURA REAL DA PÁGINA

- `/catalogo` → `page.tsx:23-25` → `Catalogo.tsx` → `CatalogList.server.tsx` → `CatalogSection.tsx` (client) → `CatalogCard.tsx` (client).
- `/catalogo/[...slug]` → se não é produto, tenta categoria → `CategoryListing.tsx` (`[...slug]/page.tsx:173-214`).
- **Código morto**: `CatalogGrouped.server.tsx`, `CatalogPreview.tsx` e `CatalogoList.tsx` não são importados por ninguém (verificado com grep). Detalhe importante: `CatalogoList.tsx` é uma versão MELHOR da página viva (badges "Entrega Grátis/Suporte/Higienizados" nas linhas 28-47 e CTA WhatsApp no final, linhas 56-76) — e está morta. A página viva (`Catalogo.tsx`) não tem nada disso.

---

## ISSUES (com evidência)

### 1. [ALTA] Social proof fabricado nos cards — "140+ locações" é hash do nome do produto
- `CatalogCard.tsx:90-99` exibe contagem de locações com ícone TrendingUp verde.
- `src/lib/sales-utils.ts:1-12` admite no comentário: "Geração determinística de 'número de locações'... até termos um sistema real de tracking". O número é FNV-1a hash do key do produto, mapeado para 100–170, formatado como "140+" (`formatRentalCount`, sales-utils.ts:73-78).
- Apenas 5 metadata.json têm campo `locacoes` real (override); os outros ~49 cards mostram números inventados.
- Ironia: `[...slug]/page.tsx:237-239` tem comentário dizendo que aggregateRating foi removido de propósito porque "dados inventados podem gerar penalização" — mas o número de locações visível segue inventado. Risco de confiança + CDC (publicidade enganosa) + inconsistência de postura.
- 53 ocorrências de "locações" no HTML renderizado de /catalogo.

### 2. [ALTA] Catálogo inteiro invisível até o JS hidratar (SSR com opacity:0)
- `CatalogSection.tsx:63-69` (`motion.section initial={{opacity:0,y:20}}`) + `CatalogSection.tsx:96-103` (motion.div por card) + `CatalogCard.tsx:33-37` (mais um motion.div por card — animação DUPLICADA aninhada).
- Verificado no HTML SSR: **118 elementos com `style="opacity:0"`** — todas as seções e todos os cards chegam invisíveis. Só os h2 de categoria (server) aparecem antes do framer-motion hidratar.
- Em 3G/4G fraco o usuário vê títulos de categoria e um vazio. Penaliza LCP/percepção de velocidade na página mais importante de browsing. `animate` (não `whileInView`) significa que nem é animação on-scroll — é só um fade-in de entrada que custa a visibilidade pré-hydration.

### 3. [ALTA] Ordenação manual de categorias silenciosamente quebrada (NFC vs NFD) — verificado ao vivo
- `Catalogo.tsx:25-32` passa `order={["Jogos Eletrônicos","Videokês","Jogos de Mesa","Consoles"]}` (strings NFC do código-fonte).
- As pastas em disco estão em NFD (decomposição Unicode do macOS). Testado com node: `"Jogos Eletrônicos" === pasta` → **false**; só "Jogos de Mesa" (sem acento) casa.
- `CatalogList.server.tsx:33-38`: as entradas NFC do `order` viram chaves sem itens e são filtradas (`lvl1[k]?.length`); as categorias reais NFD caem no "resto".
- Resultado renderizado confirmado via curl: ordem real = **Jogos de Mesa → Jogos Eletrônicos → Piscinas → Projetores → RV → Videokês**. A categoria-carro-chefe (Jogos Eletrônicos, 29 produtos, fliperamas) NÃO abre a página; "Videokês" (2º na intenção) está por último. Curadoria comercial perdida sem nenhum erro visível.
- "Consoles" no order nem é categoria nível-1 (é subpasta de Jogos Eletrônicos) — intenção desatualizada.
- Fix: comparar com `.normalize('NFC')` dos dois lados, ou reusar o `norm()` de `catalog.server.ts:24-29`.

### 4. [MÉDIA] /catalogo não linka para as páginas de categoria (que existem e são boas)
- Os h2 de categoria (`CatalogList.server.tsx:85-87`) e h3 de subcategoria (`CatalogSection.tsx:49-60`) são texto puro. As landing pages `/catalogo/jogos-eletronicos/` etc. (CategoryListing, com hero, schema CollectionPage e copy SEO) só são alcançáveis pelo dropdown do header e footer.
- Perde internal linking (SEO) e um caminho natural de navegação ("ver tudo de Fliperamas").
- Links de categoria presentes no HTML de /catalogo: só 4, todos vindos do header/footer (jogos-de-mesa, piscinas…, realidade-virtual, videokes).

### 5. [MÉDIA] Breadcrumb do produto aponta para âncora quebrada + ids duplicados/NFD
- `[...slug]/page.tsx:291`: link `/catalogo#${encodeURIComponent(categoria)}` usa a categoria nível-1 (ex.: "Jogos Eletrônicos"), mas os ids das seções são os nomes das SUBcategorias (`CatalogSection.tsx:64`). Não existe id de nível-1 → o clique cai no topo da página gigante.
- Ids renderizados verificados: `id="Outros"` aparece **5×** (HTML inválido, âncora ambígua); `id="Ma%CC%81quinas"` é NFD percent-encoded — qualquer link construído com string NFC nunca casa.
- O certo: breadcrumb do produto deveria linkar para `/catalogo/<slug-da-categoria>/` (a página dedicada já existe).

### 6. [MÉDIA] Página viva do catálogo perdeu o CTA de conversão (existe só no código morto)
- `Catalogo.tsx` (vivo) termina na grade — sem CTA "Não encontrou? Chama no WhatsApp". Esse bloco existe em `CatalogoList.tsx:56-76` (morto). Verificado no HTML: zero matches para "Não encontrou o que procurava" em /catalogo.
- A página de categoria (CategoryListing.tsx:136-183) TEM CTA duplo bem feito — o catálogo principal, página de maior tráfego de browsing, depende só do botão flutuante de WhatsApp.

### 7. [MÉDIA] Sem busca, sem filtros, sem TOC/nav interna numa página com 54 produtos
- Nenhum componente de busca/filtro em todo o catálogo (grep em src/ — os hits de "search" são Header/SEO, não busca de produtos).
- A página é um scroll longo (~6 categorias, 500KB de HTML); não há nav lateral/sticky de categorias nem âncoras funcionais (issue 5). Para festa/evento, filtros úteis seriam: tipo de evento, espaço necessário, faixa etária.
- Com 54 itens, uma busca client-side é trivial e barata.

### 8. [MÉDIA] Campo `ordem` do metadata.json é ignorado na vitrine pública
- `CatalogItem.ordem` declarado em `catalog.server.ts:12`, presente em todos os metadata.json (51× com default 9999, 3 produtos com valores curados 0/10/20 — alguém tentou ordenar).
- Nenhum sort em `getCatalog` (catalog.server.ts:56-60), `CatalogList.server.tsx`, `CatalogSection.tsx` ou `getCategoryItems`. Produtos saem na ordem do readdir do filesystem. O admin (com @dnd-kit) escreve uma curadoria que a vitrine nunca aplica.

### 9. [MÉDIA] Detecção mobile via useState/resize causa salto de layout pós-hydration
- `CatalogSection.tsx:36-46`: `isMobile` inicia `false` → SSR renderiza limite desktop (12); no mobile, após hidratar, corta para 6 → conteúdo some/pula (ex.: Consoles tem 8 itens, perde 2 e ganha botão "Ver mais 2 produtos").
- Deveria ser CSS (ocultar itens >n com `hidden md:block`) ou um único limite. Listener de resize sem debounce é detalhe menor.

### 10. [BAIXA/MÉDIA] Card fraco em informação e affordance
- `CatalogCard.tsx`: título (2 linhas) + locações fabricadas. Sem descrição (existe em todos os metadata, 150–200 chars), sem dimensões/requisitos, sem preço (ok no modelo WhatsApp), sem hint "Ver detalhes" — affordance de clique é só hover (borda/cor), inexistente no touch.
- Badge de categoria (`CatalogCard.tsx:71-79`) é redundante: repete o nome da seção onde o card já está — ruído num card pequeno.
- Itens "solo" são agrupados sob heading genérico "Outros" (`CatalogList.server.tsx:115-126`) — "Passa ou Repassa" e "Carrinho Infantil" ficam enterrados sem o nome real da subcategoria.

### 11. [BAIXA] Estado vazio de categoria é código morto / categoria vazia vira 404
- `CategoryListing.tsx:123-133` tem empty state bonito ("✗ Vazio" + botão), mas `[...slug]/page.tsx:176` só renderiza CategoryListing se `categoryItems.length > 0`; senão `notFound()` (linha 218). Categoria conhecida que zerar produtos vira 404 seco em vez da página amigável.

### 12. [BAIXA] URLs de imagem sem encoding + nomes de arquivo problemáticos
- `image-utils.ts:6-12` concatena sem `encodeURI`. Srcs renderizados contêm espaços, acentos NFD e parênteses: `/Organizado/Jogos de Mesa/Air Games/Air Game Infantil/Imagem do WhatsApp de 2025-07-14 à(s) 12.21.08_7437351e.jpg`. Funciona no dev server; frágil em CDN/host que normalize NFC ou seja estrito com encoding. Nomes "Imagem do WhatsApp..." também vazam para o HTML.
- Imagens cruas de até 1.7MB (webp) servidas para cards de ~200px com `unoptimized` (`CatalogCard.tsx:59`) — o atributo `sizes` (linha 58) é inócuo com unoptimized. (Perf detalhada é de outra área, mas afeta a grade mobile.)

### 13. [BAIXA] Pequenas inconsistências
- `Catalogo.tsx:3` importa `motion` do framer-motion sem usar, num server component async.
- OG description promete "Mais de 60 equipamentos" (`page.tsx:10`); são 54 metadata.json.
- Cards usam `<h3>` (`CatalogCard.tsx:86`) no mesmo nível dos títulos de subcategoria h3 — hierarquia de headings achatada.
- `CatalogoList.tsx:1` tem comentário de path errado ("Catalogo.tsx") — sintoma da duplicação.

---

## PONTOS FORTES
- Páginas de categoria (CategoryListing) bem acima da média: breadcrumb com aria-label e nomes amigáveis (linhas 21-79), hero com contador, schema CollectionPage+ItemList (`[...slug]/page.tsx:182-202`), CTA duplo, copy SEO por categoria em `catalog-categories.ts`.
- Resolução de slug case/acento-insensível robusta (`catalog.server.ts:24-29, 64-76`).
- "Ver mais"/progressive disclosure mantém a página de catálogo navegável sem paginação.
- Fallback de imagem nos cards (estado `imageError`, `CatalogCard.tsx:28, 65-69`).
- Hierarquia h1→h2(categoria)→h3(subcategoria) correta na listagem.
- Decisão consciente e documentada de NÃO inventar aggregateRating no schema do produto.

## OPORTUNIDADES PRIORIZADAS
1. Corrigir o `order` com normalização Unicode (1 linha com `norm()` já existente) e colocar Jogos Eletrônicos/Fliperamas abrindo a página — curadoria comercial de graça.
2. Trocar locações por hash por sinais reais (badge "Mais alugado" curado via metadata, ou contagem real) — ou remover; hoje é passivo de confiança.
3. Tornar h2/h3 de categoria links para as landing pages de categoria + corrigir breadcrumb do produto para a URL da categoria (não âncora).
4. Remover `initial opacity:0` do caminho SSR (usar CSS `animate-in` já disponível, como o próprio CatalogList.server.tsx:100 faz) para o catálogo pintar instantaneamente.
5. Ressuscitar o CTA WhatsApp do código morto (CatalogoList.tsx:56-76) no fim de /catalogo.
6. Aplicar `ordem` do metadata no sort das seções (honra o admin existente).
7. Busca client-side simples + nav sticky de categorias (54 itens — custo baixo, ganho alto em mobile).
8. Apagar os 3 componentes mortos após aproveitar o que prestam (CatalogGrouped, CatalogPreview, CatalogoList).
9. `encodeURI` no getImagePath + renomear arquivos para slugs ASCII no pipeline do admin.
