# Parecer — Arquitetura de Informação (Taxonomia, Ocasiões, Kits, Migração)

Analista: especialista em Arquitetura de Informação · Data: 2026-06-11
Base: catalog-listing.md, catalog-data.md, nav-conversion.md, seo-infra.md, product-page.md, rental-ux.md, competitors-br.md, whatsapp-cro.md + código vivo (`catalog.server.ts`, `slug-utils.ts`, `catalog-categories.ts`, `Header.tsx`, `public/.htaccess`, árvore real de `public/Organizado/`).

---

## 1. O diagnóstico que as auditorias circundam mas não nomeiam: o acoplamento triplo

A pasta `public/Organizado/` exerce **três papéis ao mesmo tempo**:

1. **Armazenamento físico** (imagens, vídeos, metadata.json);
2. **Taxonomia de navegação** (nome da pasta = nome da categoria/seção);
3. **Estrutura de URL** (`generateProductUrl` slugifica o caminho completo de pastas — `slug-utils.ts:28-33`).

Esse acoplamento triplo é a **causa-raiz comum** de pelo menos seis achados que as auditorias listam como problemas independentes:

| Achado nas auditorias | Causa-raiz |
|---|---|
| Ordenação NFC/NFD quebrada (catalog-listing #3) | nome de pasta do macOS É a chave de taxonomia |
| "Pasta X uai" pública em produção (catalog-data #5) | pasta de teste vira categoria e URL automaticamente |
| Carrinho Infantil duplicado com 2 URLs (catalog-data #4) | sem identidade de produto separada da localização física |
| "Karaokê 2025" engolido pelo pai (catalog-data #3) | hierarquia de pastas decide o que é produto vs. variação |
| URLs com 5 níveis (`/catalogo/jogos-eletronicos/consoles/playstation/playstation-5/`) | profundidade de pasta vaza para a URL |
| "Maquina  de Dança" (espaço duplo) afetando slug | nome de arquivo = dado canônico |

**Consequência estratégica:** qualquer evolução de taxonomia (renomear "Piscinas, Infláveis, Cama Elástica, Infantil", achatar Consoles, mover produto de categoria) hoje implica mover pastas → quebrar URLs → perder SEO. O sistema pune a melhoria da IA. É por isso que a taxonomia está congelada do jeito que o filesystem nasceu.

**A correção não é migrar de CMS.** É introduzir uma **camada de taxonomia desacoplada** (overlay): um único arquivo versionado (`src/data/taxonomy.ts` ou `taxonomy.json`) com, por categoria: `slug` (canônico, NFC), `pasta` (caminho físico), `label` (exibição), `ordem`, `descricaoCurta`, `ocasioes[]`. O `catalog.server.ts` passa a consultar o overlay para agrupar/ordenar/rotular, e o filesystem volta a ser só armazenamento. Custo: ~1 dia de dev. Benefício: mata o bug NFC/NFD por construção, devolve a curadoria comercial (Fliperamas abrindo o catálogo), e destrava tudo que vem abaixo **sem mover uma pasta nem quebrar uma URL**.

---

## 2. Taxonomia dupla: tipo × ocasião (a lacuna nº 1 do site — e do mercado)

### O problema
A taxonomia atual é 100% por **tipo de equipamento** (Jogos Eletrônicos > Fliperamas > ...). Mas o usuário não acorda querendo "um jogo eletrônico" — ele acorda com um **problema de ocasião**: "festa de 10 anos do meu filho", "confraternização da firma", "o que colocar no casamento pra não ficar parado". A própria página /empresas já prova que o negócio pensa assim (seções SIPAT, Fim de Ano, ativação) — mas isso não existe como **estrutura navegável**: não há uma única URL no site que responda "o que alugar para festa infantil".

A pesquisa de concorrentes confirma a lacuna no mercado local: sites dos EUA têm "Shop by Event" como padrão; **nenhum concorrente direto brasileiro pesquisado tem navegação por ocasião** (rental-ux.md §4). Baby Eventos, o benchmark de prova social, navega por tema de personagem — não por ocasião. É uma faixa aberta.

### A regra de ouro (que as auditorias não estabelecem)
**Ocasião é um ATRIBUTO, não uma segunda hierarquia de pastas.** A relação é muitos-para-muitos (Pebolim serve festa infantil, confraternização E casamento). Quem tenta materializar ocasião como pasta/categoria duplica produtos (já temos um Carrinho Infantil duplicado para mostrar onde isso termina). Implementação correta no stack atual:

1. Campo `ocasioes: string[]` no metadata.json (o admin com @dnd-kit já edita metadata) **ou**, mais barato para começar, curadoria centralizada em `src/data/ocasioes.ts`: cada ocasião lista keys de produtos em ordem de relevância. Centralizado > distribuído para 54 itens e 1 dev — uma tela, uma revisão.
2. Rota estática `/para/[ocasiao]/` via `generateStaticParams` (compatível com `output: 'export'`): 6 a 8 páginas:
   - `/para/festa-infantil/` · `/para/festa-de-15-anos/` (e aniversário teen) · `/para/casamento/` · `/para/confraternizacao-de-empresa/` · `/para/sipat/` · `/para/festa-em-condominio/` · `/para/formatura/` · `/para/festa-junina/` (sazonal)
3. Anatomia de cada página (isto é landing page de intenção, não listagem burra): H1 com a ocasião + copy de 2-3 parágrafos (o que funciona nessa ocasião, quantos convidados, espaço típico) + **kit recomendado** (ver §3) + grade dos produtos curados + FAQ da ocasião (3-5 perguntas com schema FAQPage — resolve de uma vez o "não existe NENHUM FAQ no site" do seo-infra #12.4) + CTA WhatsApp **pré-preenchido com a ocasião** ("Olá! Estou organizando uma confraternização de empresa e quero um orçamento") — encaixa perfeito na recomendação nº 1 do nav-conversion.
4. Navegação: bloco "Para que ocasião é seu evento?" na home (acima do catálogo), grupo "Por ocasião" no dropdown do header e no menu mobile, cross-links nas páginas de produto ("ideal para: festa infantil · condomínio").

### Por que isso é o maior alavancador de SEO disponível
As queries de ocasião ("atrações para festa de 15 anos", "o que alugar para confraternização de empresa", "brincadeiras para SIPAT") têm intenção comercial altíssima e concorrência fraca (concorrentes diretos não têm essas páginas; quem rankeia são blogs genéricos de buffet). 6-8 páginas densas e curadas valem mais que as 54 páginas thin de produto que existem hoje — e dão ao Google Ads landing pages com Quality Score decente para campanhas sazonais (Dia das Crianças, fim de ano corporativo), que hoje teriam que apontar para /catalogo genérico.

---

## 3. Kits/combos como objetos de primeira classe

Três concorrentes diretos (Alugue Games, Fun Play, Mega Power) vendem **kits nomeados**; o único com preço-âncora público (Alugue Games, Kit Festa 1 a R$ 890) usa o kit exatamente como contêiner do preço. A pesquisa rental-ux aponta o modelo híbrido validado no Brasil (Ritmo de Festas: combos com preço fechado, itens individuais sem preço). O Aluguel de Games tem o catálogo mais profundo do nicho e **zero kits** — o cliente precisa montar a festa item a item num catálogo de 54 produtos sem preço. Isso é paralisia de escolha entregue de graça ao concorrente que vende "Kit Festa 2".

**Implementação no stack atual (sem tocar em pasta nenhuma):**
- `src/data/kits.ts`: cada kit = `slug`, `nome`, `ocasioes[]`, `itens: key[]` (referência aos produtos existentes — reusa fotos e descrições), `convidadosIdeal`, `espacoNecessario`, `precoAPartir?` (opcional).
- Rota `/kits/[slug]/` estática. 3 a 5 kits bastam para lançar: **Kit Festa em Casa** (1 console + 1 jogo de mesa — cabe em apartamento), **Kit Festão** (fliperama + air game + videokê), **Kit Corporativo/SIPAT** (simulador + VR + máquina de boxe), **Kit Casamento** (videokê + plataforma 360 + pebolim), **Kit Infantil**.
- CTA do kit gera mensagem WhatsApp **estruturada com a lista de itens + campo de data** — é o "carrinho de orçamento" do padrão internacional (Goodshuffle: wishlist→quote) reduzido à versão WhatsApp-first brasileira, sem precisar de carrinho de verdade.
- Kit é também o lugar seguro para testar preço-âncora ("a partir de R$ X") sem abrir tabela de 54 itens — ver discordância D2.

Kits ainda resolvem um problema de IA que ninguém apontou: são o **objeto compartilhável**. Ninguém manda 5 links de produto pro cônjuge/RH aprovar; manda 1 link de kit. Com OG image decente (seo-infra #6), o kit vira a unidade de circulação no WhatsApp — o canal que já é 100% da conversão.

---

## 4. Navegação facetada leve — na ordem certa

Com 54 produtos, facetas client-side são tecnicamente triviais (índice JSON de build de ~15KB). Mas a auditoria de dados é clara: **não existe nenhum atributo estruturado** (dimensões, energia, jogadores, idade, ambiente). Faceta sem dado é botão morto. A ordem de dependência é:

1. **Primeiro** os campos no metadata.json (catalog-data já recomenda: `dimensoes`, `espacoNecessario`, `energia`, `jogadores`, `idadeMinima`, `ambiente` + meu `ocasioes`). As dimensões já existem presas em nomes de arquivo ("Pebolim 0,96 altura x 1,38 largura...") — é trabalho de transcrição, não de pesquisa.
2. **Depois** 3-4 chips de filtro em /catalogo e nas categorias: **Ocasião**, **Idade**, **Espaço** — e o filtro-assassino para SP: **"Cabe em apartamento"** (porta/elevador é A pergunta de pré-venda de quem mora em prédio; nenhum concorrente filtra por isso). Mobile: botão "Mostrar X resultados", padrão Baymard.
3. **Sem URLs indexáveis por combinação de faceta.** Faceta é estado client-side; só ocasião ganha URL estática (§2). Isso evita inflar o crawl com páginas doorway — com 54 produtos, o SEO programático de facetas não compensa o risco.

Nota: a busca client-side que o catalog-listing recomenda (oportunidade #7) só fica boa **depois** do passo 1 — hoje ela indexaria só títulos ("Máquina de pegar Bichinho" não responde quem busca "garra" ou "pelúcia"). Ver discordância D1.

---

## 5. Costurar os dois sistemas de navegação que vivem de costas um pro outro

Achado de síntese (as auditorias listam as peças, não o padrão): o site tem **dois sistemas de browse paralelos que não se referenciam**:

- O **mega-/catalogo** (503KB, todas as seções, h2/h3 de texto puro, âncoras quebradas);
- As **páginas de categoria** (`CategoryListing` — heroes, copy SEO em `catalog-categories.ts`, schema CollectionPage, CTA duplo — o melhor template do site), alcançáveis SÓ pelo dropdown do header e footer.

E o breadcrumb do produto aponta para âncora quebrada do sistema A em vez da página boa do sistema B. Costura (1 dia de trabalho, quase tudo já existe):
- h2/h3 de /catalogo viram links "Ver todos os fliperamas →" para as category pages;
- breadcrumb de produto → `/catalogo/<slug-categoria>/` + schema BreadcrumbList;
- /catalogo ganha uma nav sticky de categorias (resolve o scroll de 6 categorias no mobile sem precisar de busca);
- related products passam a cruzar **por ocasião**, não só por pasta ("quem alugou fliperama pra confraternização também levou videokê") — hoje os relacionados são irmãos de pasta, ou seja, mostram o concorrente interno mais parecido em vez do complemento.

---

## 6. Crimes de rotulagem que o overlay resolve de graça

1. **"Piscinas, Infláveis, Cama Elástica, Infantil"** é uma lista de inventário, não um nome de categoria — e gera o slug `piscinas-inflaveis-cama-elastica-infantil`. A mesma categoria tem **três nomes** conforme a superfície: nome da pasta, "Infláveis & Infantil" (header), "Infláveis e Infantil" (breadcrumbName). Com o overlay (§1), o label vira "Infláveis & Infantil" em todo lugar e o slug curto `inflaveis-infantil` pode nascer com 301 no .htaccess (mecânica já existente e usada — o arquivo já redireciona `/inflaveis` para a URL longa!).
2. **"Projetores & Extras" é gaveta de bagunça** escondendo a **Plataforma 360°** — um dos itens mais buscados do mercado de eventos ("plataforma 360 aluguel" tem volume real) e queridinho de casamento/corporativo — junto com mesa de carteado e "Mesa Liftime" (typo de Lifetime). A Plataforma 360 merece destaque em ocasiões casamento/corporativo e no dropdown do header; hoje não tem rota de descoberta nenhuma além de rolar até o fim do catálogo.
3. **"Jogos Eletrônicos" carrega 29 de 54 produtos (54%)** — desequilíbrio clássico de taxonomia. O header já "sabe" disso e o contorna linkando direto para as subcategorias (Fliperamas, Consoles, Pinballs, Máquinas) — mas /catalogo e os breadcrumbs ainda expõem o nível inchado. O overlay permite promover as subcategorias fortes a seções de primeiro nível na **apresentação**, mantendo as pastas e URLs como estão.

---

## 7. Migração sem quebrar URLs — o plano em 3 fases

A boa notícia que ninguém destacou: **tudo de maior valor é puramente aditivo**. Ocasiões, kits, facetas, costura de navegação e overlay de rótulos não alteram NENHUMA URL existente.

**Fase 0 — Aditiva (sem risco):** overlay de taxonomia (§1) + páginas de ocasião (§2) + kits (§3) + costura (§5). URLs novas, zero alteradas.

**Fase 1 — Identidade de produto:** campo `slug?` opcional no metadata.json com override; `generateProductUrl` consulta override → fallback no caminho de pastas (comportamento atual intacto). Resolve casos pontuais: o Carrinho Infantil duplicado (um vira canonical/redirect do outro), o "Karaokê 2025" engolido, futuros renomes de produto.

**Fase 2 — Encurtamento de URLs (opcional, só quando a Fase 1 estiver madura):** achatar `/catalogo/jogos-eletronicos/consoles/playstation/playstation-5/` → `/catalogo/consoles/playstation-5/`. Pré-condição inegociável: **manifesto de redirects versionado** (`redirects.json` → script de build gera o bloco 301 do `.htaccess` — o site é static export na Hostinger/LiteSpeed, então .htaccess é O mecanismo, e o arquivo já tem a seção "REDIRECTS — URLs antigas" pronta para receber). Regra operacional para o time de 1 dev: *nenhuma pasta é renomeada sem uma linha correspondente no manifesto*. Sem isso, qualquer "padronização de nomenclatura" recomendada pelas outras auditorias (renomear "Maquina  de Dança" etc.) é uma quebra de URL disfarçada de limpeza.

Importante: a Fase 2 tem o **menor ROI das três** — 301 preserva a maior parte do sinal, mas toda migração de URL custa semanas de reindexação. Só vale a pena embalada junto com uma melhoria real de conteúdo (descrições novas, atributos), nunca sozinha.

---

## 8. Priorização honesta (impacto × esforço, para 1 dev)

| # | Recomendação | Impacto | Esforço | Dependências |
|---|---|---|---|---|
| 1 | Overlay de taxonomia (slug/label/ordem/ocasiões num arquivo) | Alto | Baixo | — (mata NFC/NFD e rótulos triplos de quebra) |
| 2 | 6-8 páginas de ocasião `/para/...` com FAQ + CTA contextual | Alto | Médio | #1; conteúdo é o custo real |
| 3 | 3-5 kits nomeados com mensagem WhatsApp estruturada | Alto | Médio | #1 |
| 4 | Atributos estruturados no metadata (espaço/energia/idade/ocasiões) | Alto | Médio-Alto | trabalho de conteúdo, dados já existem espalhados |
| 5 | Costura /catalogo ↔ category pages + breadcrumb correto | Médio-Alto | Trivial-Baixo | — |
| 6 | Rótulos: "Infláveis & Infantil" unificado; Plataforma 360 fora da gaveta | Médio | Trivial | #1 |
| 7 | Chips de faceta client-side ("Cabe em apartamento", idade, ocasião) | Médio | Baixo | #4 |
| 8 | Manifesto de redirects 301 versionado → .htaccess no build | Médio (risco evitado) | Baixo | pré-condição de qualquer renome futuro |

---

## 9. Discordâncias e caveats (para o debate do painel)

**D1 — Busca client-side está superestimada (catalog-listing, oportunidade #7).** Com 54 produtos sem atributos estruturados e descrições de ≤254 chars, a busca só indexa títulos — e títulos do catálogo não falam a língua do usuário ("Máquina de pegar Bichinho - Grua 2 garras Japonesa" vs. a busca real "garra"/"pelúcia"). Numa coleção desse tamanho, nav sticky + páginas de ocasião entregam mais findability por hora de dev do que uma caixa de busca. Busca vira boa DEPOIS dos atributos (#4) — e aí sim, com log de queries no GTM, vira ferramenta de pesquisa de vocabulário do cliente, que é seu valor real.

**D2 — O "consenso" de transparência de preço (rental-ux §1) está sendo importado sem tradução.** As fontes são fornecedores de software de rental dos EUA (Goodshuffle, TapGoods) com interesse direto na tese. No mercado real pesquisado, só 2 de ~10 concorrentes ancoram preço, e a precificação de locação em SP varia por distância, escada/elevador, duração e data — preço público em 54 itens é passivo de manutenção e de negociação para uma empresa de 1 dev. A versão que defendo: **preço-âncora só nos kits** ("a partir de R$ X"), que é onde a comparação com Alugue Games (R$ 890) acontece de fato. Itens individuais continuam sob orçamento.

**D3 — "Separar os modelos de videokê em produtos individuais" (catalog-data, oportunidade #5) contradiz o próprio diagnóstico de thin content.** Multiplicar SKUs (Pop 300, Matrix, VMP 2500) sem capacidade de produzir conteúdo único para cada um cria mais páginas de 150 caracteres — exatamente o problema que a mesma auditoria condena. Long-tail "aluguel videokê matrix" tem volume marginal. Melhor: UMA página de videokê forte com seção "modelos disponíveis" (variações com foto e specs), e só promover um modelo a produto se ele ganhar demanda própria comprovada. O caso "Karaokê 2025 engolido" é bug de walk(), não argumento para estilhaçar o catálogo.

**D4 — As recomendações de "padronizar nomenclatura de pastas" (catalog-data #7, catalog-listing #9 do encoding) são quebra de URL disfarçada.** Renomear "Maquina  de Dança" → "Máquina de Dança" muda o slug e mata a URL indexada. Nenhuma auditoria conecta a limpeza de dados ao custo de SEO. Qualquer renome físico precisa vir DEPOIS do manifesto de redirects (#8) — ou, melhor, ser tornado desnecessário pelo overlay (#1), que corrige o rótulo exibido sem tocar na pasta.

**Caveat geral:** nada da minha lente importa se os fundamentos das outras auditorias não forem corrigidos antes — catálogo invisível pré-hydration, canonical www/não-www dividido e locações fabricadas vêm primeiro. Minha proposta é a camada que vem imediatamente depois, e o overlay (#1) deveria entrar no mesmo sprint dos fixes, porque o fix do bug NFC/NFD "de 1 linha" é remendo sobre a causa-raiz que o overlay elimina.

---

## Adendo (pós-releitura do catalog-data.md atualizado)
- A auditoria de dados confirma que já existe **1 produto com campo `slug` no metadata — morto** (nada lê `item.slug`): a Fase 1 do plano de migração não é invenção minha, é completar uma intenção que já está no schema.
- `ordem` também é campo morto no site público — o overlay (§1) é o lugar natural para a ordenação voltar a ter efeito, honrando a curadoria que o admin já grava.
- "Pasta X" e "Karaokê 2025" navegam para **500** (não apenas 404) — mais um sintoma do acoplamento pasta=rota: lixo de filesystem vira superfície pública de erro.
