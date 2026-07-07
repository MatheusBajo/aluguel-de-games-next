# Parecer — Estratégia de SEO (conteúdo + técnico)
**Painel de auditoria · alugueldegames.com.br · 2026-06-11**
**Lente:** Estratégia de SEO — o que criar, em que ordem, e o que NÃO fazer. As auditorias `seo-infra.md` e `product-page.md` já mapearam os bugs; este parecer decide prioridade e direção.

---

## 1. Diagnóstico estratégico em uma frase

O site tem o **melhor produto editorial do nicho** (design, copy, páginas de categoria curadas em `catalog-categories.ts`) sentado sobre uma **fundação de indexação bagunçada** (dois geradores de sitemap em conflito servindo o arquivo do build anterior, endpoints 500 em dev, canonicals em host errado gerando cadeia de 2 redirects em todas as páginas de produto, schema Product invisível no HTML, GSC nunca verificado) e **zero estratégia de captura de demanda** (sem páginas por tipo de evento, sem presença local estruturada, catálogo inteiro em thin content). A boa notícia: a demanda do nicho é quase toda transacional e local, os concorrentes são tecnicamente fracos (SSL quebrado, contadores "0+", sites datados), e o trunfo "desde 1993 — mais antigo que TODOS os concorrentes" ainda não foi convertido em sinal de busca.

A ordem importa mais que a lista: **medir antes de remediar, fundação antes de conteúdo, hubs antes de long-tail.**

---

## 2. Sequência técnica — "Semana de fundação" (P0, ~2-3 dias de dev)

As auditorias listam os fixes; aqui está a ordem e o porquê:

1. **Verificar o domínio no Google Search Console (via DNS) — ANTES de qualquer fix.** Custa zero código. O pipeline de sitemap serve o arquivo do build anterior há meses e ninguém ficou sabendo justamente porque não há GSC. Sem ele, nenhum dos fixes abaixo é verificável. Inclui: submeter o sitemap consertado, inspecionar URLs de produto, acompanhar "Duplicate, Google chose different canonical".
2. **Unificar o host canônico nos sinais on-page:** o 301 non-www→www já existe (`.htaccess`); o problema é que `NEXT_PUBLIC_SITE_URL` sem www faz TODAS as páginas de produto/categoria declararem canonical/og:url que passa por **cadeia de 2 redirects** (non-www→www, sem-barra→com-barra), contradizendo o sitemap. Corrigir a env, trocar hardcodes por `getSiteUrl()` único, e adicionar trailing slash no canonical de produto.
3. **Um único dono do sitemap/robots/manifest:** hoje há duas fontes para cada um (App Router + arquivos em `public/`), com 500 em dev e sitemap defasado em produção (postbuild grava em `public/`, que só entra no deploy SEGUINTE). Escolher um dono, garantir URLs slugificadas com trailing slash, incluir as ~15 páginas de categoria e as 3 estáticas faltantes, e deletar a fonte perdedora (incluindo o `public/robots.txt` corrompido com backticks).
4. **JSON-LD no servidor + destravar render:** trocar `<Script>` por `<script>` nas páginas de produto/categoria (2 linhas — a home já faz certo) e garantir `Allow: /_next/static/` na fonte de robots que sobreviver. Hoje o schema Product não chega em nenhum crawler que não execute JS — e o cuidado todo do schema (LeaseOut, seller, decisão madura de não inventar aggregateRating) está sendo desperdiçado.
5. **Titles transacionais sem marca duplicada** (ver §4).
6. **Restaurar BreadcrumbList** (regressão vs. produção) em produto e categoria.

Tudo isso é mudança de poucas linhas. **Não publicar nenhum conteúdo novo antes desta semana** — seria construir sobre areia.

**Trilha paralela sem dev (dono/atendente):** Google Business Profile — ver §6. Pode começar hoje.

---

## 3. Arquitetura de captura de demanda — o mapa de queries do nicho

A demanda se organiza em 4 camadas. O site só compete (mal) na primeira:

| Camada | Exemplos de query | Página que captura | Status hoje |
|---|---|---|---|
| **Head por equipamento** | "aluguel de fliperama sp", "aluguel de videokê", "locação de videogame para festa" | Páginas de categoria (`/catalogo/jogos-eletronicos/fliperamas/` etc.) | Existem, bem escritas (`catalog-categories.ts`) — mas **órfãs** (ver §3.1) |
| **Long-tail por equipamento/modelo** | "aluguel máquina de boxe", "fliperama 11.000 jogos", "aluguel videokê matrix", "plataforma 360 evento" | Páginas de produto | Existem mas com **thin content** (≤254 chars, 4 fliperamas com descrição VAZIA, box "Características" idêntico nas 54 páginas) |
| **Por tipo de evento** | "atrações para festa de 15 anos", "aluguel de games confraternização", "SIPAT atividades diferentes", "atrações festa junina corporativa" | **Não existe nenhuma página** (só /empresas, genérica B2B) | Lacuna total — é onde o catálogo profundo vira diferencial |
| **Por cidade/região** | "aluguel de fliperama guarulhos", "videokê osasco", "locação de games abc" | **Não existe** | MC Diversões domina fliperama na SERP exatamente com isso |

### 3.1 A jogada nº 1 não é criar nada: é deixar de esconder o que existe

As páginas de categoria são o ativo de SEO mais valioso do site e estão **quase órfãs** — conexão entre 3 auditorias que ninguém amarrou:
- Os headings h2/h3 do `/catalogo` não são links (catalog-listing) — a página com mais autoridade interna passa ~zero links para elas (só 4 links de categoria no HTML, vindos do header/footer);
- O breadcrumb do produto aponta para `/catalogo#âncora-quebrada` (ids NFD/duplicados) em vez de `/catalogo/<categoria>/` (product-page);
- O `sitemap.ts` do App Router nem as inclui; RelatedProducts não tem "ver toda a categoria".

**Fix (1-2 dias):** headers do catálogo viram links, breadcrumb aponta para a categoria real, "Ver todos de {categoria}" no fim do related, chips de subcategoria no topo das páginas de categoria. Resultado: as páginas que disputam "aluguel de fliperama sp" passam de ~0 links internos para dezenas — sem escrever uma linha de conteúdo.

### 3.2 Long-tail por equipamento: o conteúdo é DADO, não prosa

O catálogo inteiro é thin content, mas a solução não é "escrever textão". A auditoria de dados achou as dimensões **presas em nomes de arquivo** ("Pebolim 0,96 altura x 1,38 largura…"). Estratégia:

- **Campos estruturados no metadata.json** (`dimensoes`, `espacoNecessario`, `energia`, `jogadores`, `idadeMinima`, `ambiente`, `idealPara`) → tabela de especificações renderizada → alimenta `Product.additionalProperty` no schema → captura queries de cauda ("fliperama medidas", "máquina de boxe precisa de 220v") → e é exatamente o conteúdo que destrava o orçamento no WhatsApp ("passa no elevador?", "precisa de tomada?"). SEO e CRO no mesmo movimento.
- **Descrições 400-800 chars com estrutura fixa** (o que é → o que está incluso → requisitos → ideal para). **Começar pelos 6 fliperamas com descrição vazia/quase vazia** — fliperama é a categoria com mais demanda de busca e está com as piores páginas. O box "Características" genérico idêntico em 54 páginas deve virar specs por produto.
- **Separar os modelos de videokê** (Pop 300, Matrix, VMP 2500) hoje amontoados num produto com 42 fotos — cada modelo é uma query long-tail ("aluguel videokê raf eletronics" — note que o concorrente Freitas usa a marca Raf como argumento técnico). De quebra resolve o produto-órfão "Karaokê 2025".
- **Resolver o "Carrinho Infantil" duplicado** (duas URLs, mesmo conteúdo) — canonical ou mover para uma categoria só.
- **Higiene de imagem**: renomear "Imagem do WhatsApp de 2025-07-14…" para slugs descritivos + alt text. Nesse nicho a busca por imagens ("fliperama para festa") tem peso real.

### 3.3 Páginas por tipo de evento (6-8 páginas, o melhor ROI de conteúdo NOVO)

Ninguém no nicho de games faz isso bem; o site já tem as fotos (galeria com Bradesco, Spotify, Danilo Gentili) e os equipamentos. Cada página = combinação curada de produtos + 2-3 fotos reais + FAQ específico + CTA WhatsApp pré-preenchido por contexto:

1. `/festas/festa-infantil/` — infláveis + fliperama infantil + carrinho
2. `/festas/festa-de-15-anos/` — videokê, plataforma 360, pista de dança
3. `/festas/confraternizacao-de-fim-de-ano/` — **publicar até agosto** (pico de busca set-nov)
4. `/festas/sipat/` — linguagem SST, máquina de boxe/dança, NF e contrato (puxa do /empresas)
5. `/festas/casamento/` — jogos de mesa, videokê
6. `/festas/festa-junina-corporativa/` — sazonal forte (abr-jun)
7. (depois) formatura, feiras/ativações de marca

Esforço: ~1 página/semana usando um template único. São as únicas páginas "novas" que recomendo nos próximos 3 meses. **Não criar blog** (ver discordâncias).

### 3.4 Cidades: versão contida do playbook MC Diversões

MC Diversões prova a demanda com landing pages por cidade — mas copiar o modelo multi-domínio/dezenas de páginas seria doorway spam com prazo de validade e um fardo para 1 dev. Versão defensável:
- 1 hub `/areas-atendidas/` linkada do footer;
- **5-8 páginas de cidade no máximo** (Guarulhos, Osasco, ABC, Alphaville/Barueri, capital por zona se houver dados), cada uma só se tiver **conteúdo real diferenciado**: foto de evento naquela cidade, logística/tempo de chegada, depoimento local. Sem conteúdo real → não criar a página.
- `areaServed` do schema já lista 6 cidades — alinhar com as páginas.

---

## 4. Padrão de titles/headings — e o gancho que nenhum concorrente pode copiar

- **Produto:** `Aluguel de {Produto} para Festas e Eventos` + template de marca (mata a duplicação "Aluguel de Games | Aluguel de Games SP" nas 54 páginas e coloca a keyword transacional na frente — quem busca digita "aluguel de…", não "Pebolim").
- **Categoria:** manter os metaTitles curados de `catalog-categories.ts`, conferindo o template para não duplicar marca.
- **Home:** testar `Aluguel de Fliperama, Videokê e Games para Festas em SP · Desde 1993`. O "desde 1993" no title/description é o **único claim do mercado que nenhum concorrente pode igualar** (Freitas: 30 anos; Mega Power: 28). Karaoke SP usa preço no title como gancho de CTR; nós temos longevidade. Levar "desde 1993" também às meta descriptions de categoria.
- **Headings:** corrigir hierarquia (card em h3 competindo com subcategoria em h3; CategoryListing pulando h1→h3) — menor, mas barato de arrumar junto.

---

## 5. WhatsApp é a "SERP do dark social" — og:image como prioridade de SEO, não cosmético

Nesse negócio o link é compartilhado no grupo da família/da firma para decidir a festa. O preview do WhatsApp é visto por mais decisores que a SERP do Google. Hoje: og:image ausente em /catalogo e institucionais, logo quadrado 1000×1000 declarado como 1200×630 na home, webp declarado como jpeg com dimensões falsas no produto, bloco `og:image:secure_url` com `name=` (ignorado por parsers). Prioridade real:
1. og-image default de marca 1200×630 (foto de evento + logo) no layout;
2. og-image por produto gerada no build com Sharp (já é dependência) — foto + título + "Aluguel para festas · Desde 1993";
3. incluir a URL do produto na mensagem pré-preenchida do WhatsApp (o atendente clica e o link circula com preview bonito — loop de divulgação gratuito).

---

## 6. Google Business Profile + máquina de reviews — o canal que não precisa de dev

Para "aluguel de fliperama" o Google mostra **local pack antes dos resultados orgânicos**. Nenhuma auditoria tratou disso a fundo:

1. **Reivindicar/otimizar o GBP** como service-area business (Grande SP), categoria "Serviço de aluguel de equipamentos para festas"; popular com as 20 fotos da galeria (Bradesco, Spotify…); link do site com UTM; WhatsApp como canal de mensagem.
2. **Corrigir o geo do schema** — hoje aponta para a Praça da Sé (coordenada genérica do centro de SP). Alinhar NAP site ↔ GBP.
3. **A máquina de reviews que só este negócio tem:** TODA venda termina numa conversa de WhatsApp ativa. Mensagem padrão pós-evento ("Curtiu? Avalia a gente aqui: {link curto do GBP}") = pipeline de reviews a custo zero. Benchmark do setor: Baby Eventos com 664 reviews 5.0 domina o nicho infantil; **nenhum concorrente direto de games tem reviews fortes**. Em 12 meses dá para ser o mais avaliado do nicho.
4. **Fechar o loop no site:** exibir nota + 3-4 reviews reais (curados, estáticos) na home e nas páginas de produto — substitui com vantagem o contador fake de "locações" (problema legal apontado em 3 auditorias) e, com reviews reais, destrava `aggregateRating` legítimo no schema lá na frente.

---

## 7. FAQ — fazer, mas pelas razões certas (ver discordância #1)

Um bloco de 8-10 perguntas em `/como-funciona` (pagamento, frete, duração da locação, 110/220v, chuva, cancelamento, antecedência) + 3-5 por página de categoria/evento. Valor real: responder objeções (CRO), capturar People Also Ask e cauda conversacional, e alimentar AI Overviews/assistentes — que em 2026 respondem boa parte das queries "como funciona aluguel de X". O FAQPage schema pode ser incluído (custo zero), mas **sem esperar rich result** (restrito pelo Google desde ago/2023 a sites governamentais/de saúde).

---

## 8. Roadmap consolidado (1 dev, horas vagas)

| Fase | Quando | O quê | Impacto |
|---|---|---|---|
| **P0 — Fundação** | Semana 1 | GSC + canonicals/env www + sitemap único com URLs reais + JSON-LD server + robots limpo + titles + breadcrumb schema | Destrava tudo |
| **P0 paralelo (sem dev)** | Semana 1+ | GBP otimizado + rotina de pedir review pós-evento | Local pack |
| **P1 — Hubs** | Semanas 2-3 | Internal linking para categorias (§3.1) + og:image default/produto + remover SearchAction + merge Carrinho Infantil | Alto, barato |
| **P2 — Conteúdo de catálogo** | Mês 2 | Specs estruturadas + descrições (fliperamas primeiro) + separar videokês + FAQ como-funciona | Long-tail |
| **P3 — Demanda nova** | Meses 2-3 | 6 páginas de tipo de evento (confraternização ATÉ AGOSTO) + hub áreas atendidas + 5-8 cidades com conteúdo real | Médio-alto |
| **Contínuo** | Mensal | GSC review, refresh sazonal, reviews → site | Composto |

O que fica de fora de propósito: blog genérico, multi-domínio, busca interna "para o schema", qualquer página de cidade sem conteúdo real.

---

## 9. Discordâncias e caveats (alimentar o debate)

1. **"FAQ rich result em queries locais é espaço fácil" está desatualizado.** Desde agosto/2023 o Google restringiu FAQ rich results a sites governamentais/de saúde reconhecidos. FAQs continuam valendo — para usuário, PAA e AI Overviews — mas vender o snippet como ganho é prometer o que não vem.
2. **SearchAction: não implementem busca para "honrar o schema" (sugerido como opção na seo-infra).** O Google **descontinuou o sitelinks searchbox em outubro/2024** — o markup é ignorado. A única ação correta de SEO é deletar o SearchAction. Busca client-side pode valer como UX para 54 produtos, mas é decisão de produto, não de SEO.
3. **Sobre o dono do sitemap, defendo explicitamente a opção "matar o next-sitemap"** (a seo-infra apresenta as duas saídas como equivalentes). O bug era de mapeamento (key crua vs. slug) e de pipeline (postbuild gravando em `public/`, entregando o sitemap do build anterior), não de arquitetura do App Router. Para 1 dev, consertar `src/app/sitemap.ts` (3 linhas com `segmentsToSlug`) e deletar dependência + postbuild + arquivos de `public/` é a solução com menos peças móveis — elimina exatamente a classe de conflito que causou os 500 e o sitemap defasado.
4. **A pesquisa de concorrentes flerta com o playbook errado em SEO local.** MC Diversões domina a SERP de fliperama com multi-domínio + dezenas de landing pages por cidade — funciona hoje, mas é doorway-page clássico: risco crescente de punição e, para 1 dev, dívida de manutenção garantida. A versão contida (hub + 5-8 cidades com conteúdo real) captura ~80% do ganho com ~10% do risco. Mesma cautela com "número de telefone no title" (Fun Play): hack de CTR que polui o snippet e envelhece mal.

— Fim do parecer —
