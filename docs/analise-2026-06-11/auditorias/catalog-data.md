# Auditoria — Dados do Catálogo (conteúdo)
Área: `public/Organizado/` (54 metadata.json) + código que os consome.
Data: 2026-06-11. Todos os 54 metadata.json foram lidos; dev server inspecionado via curl.

## Visão geral
- 54 "produtos" (pastas com `metadata.json`), 13 `category.json`, ~543 MB no total — sendo **467 MB de vídeos (42 arquivos .mp4/.MOV)** que o site **nunca exibe** (não existe campo de vídeo no metadata).
- Schema real do metadata: `titulo`, `descricao` (markdown), `ordem`, `imagens[]`, opcionais `locacoes` (5 produtos) e `slug` (1 produto, **campo morto** — nada lê `item.slug`).
- Campos `ordem` (produto e categoria) são **mortos no site público**: nenhum componente ordena por `ordem` (grep em `src/` só acha `ordem` em `CatalogList.server.tsx:6` como prop manual de categorias e em `admin.server.ts`). Produtos aparecem na ordem do `readdir` do filesystem. O esforço de curadoria em Realidade Virtual (`Oculus Go` ordem 0, `Quest 2` ordem 10, `PS VR` ordem 20) não tem efeito.

## BUG CRÍTICO confirmado: home "Máquinas (0)" — Unicode NFD vs NFC
- `src/app/page.tsx:162` compara `sub === "Máquinas"` (literal NFC no código) com o nome da pasta vindo do filesystem do macOS, que é **NFD** (`Máquinas`). Verificado com xxd/python: a pasta `public/Organizado/Jogos Eletrônicos/Máquinas` está em NFD.
- Resultado verificado no HTML renderizado (curl http://localhost:3000): payload RSC contém `"categoria":"Máquinas","items":[]` — a seção destacada da home renderiza **vazia ("Máquinas (0)")** enquanto Fliperamas e Consoles (sem acento) funcionam.
- 6 produtos fortes (Boxe, Dança, Martelo, Martelo Infantil, 2 Gruas) somem da vitrine principal. Fix: normalizar (`.normalize('NFC')`) ou comparar com `norm()` que já existe em `catalog.server.ts:25`.

## Modelagem quebrada: Videokês/Karaokês
- `Videokês/Karaokês/metadata.json` (nível de subcategoria) transforma a subcategoria inteira em UM produto chamado **"Karaoke"** (sem ê), com 42 imagens misturando equipamentos distintos (Matrix RPS 30.000, Matrix Slim, Videokê Pop 300, VMP 2500, caixa KSR, mesa) e descrição que só cobre o Pop 300.
- Como `walk()` em `catalog.server.ts:38-54` para de recursar ao achar `metadata.json`, o produto **`Karaokê 2025` é inalcançável**: não entra em `getCatalog()`/`getAllSlugs()`; `curl /catalogo/videokes/karaokes/karaoke-2025/` → **500**.
- A entrada SEO `videokes/karaokes` em `catalog-categories.ts:139` ("Aluguel de Karaokê...") nunca vira página de categoria, porque a rota resolve como produto.
- Dentro do "produto" Karaokês há lixo operacional público: pastas duplicadas **`QR Code/` (5,7 MB) e `QRcodes/` (3,6 MB)** com conteúdo idêntico, `Tutorial Instalação Matrix Slim e defeitos/` (62 MB de vídeos internos de defeito/reparo), arquivos `.docx` ("Folha para imprimir..."), **lock file do Word `~$lha para imprimir matrix slim .docx`** e fontes CorelDRAW `.cdr` — tudo servido publicamente no static export.

## "Pasta X" — pasta de teste em produção
- `public/Organizado/Pasta X/category.json`: `{"titulo": "Pasta X uai", "descricao": "Pq descrição? Tem como isso?", "ordem": 0}`. É teste/jogo do admin esquecido.
- Não aparece em `/catalogo` (sem produtos dentro), mas o folder navega para **500** em `/catalogo/pasta-x/` e fica no deploy. Remover.
- Obs: `buildCatalogTree()` (`catalog-tree.server.ts:57`) é código morto, mas se reativado **escreve `category.json` dentro de `public/` em runtime** (linha 47) — efeito colateral perigoso.

## Descrições — qualidade e consistência
Tamanho médio ~160 caracteres; nenhum produto tem preço (ok no modelo orçamento), mas também **nenhum** tem: "ideal para N convidados", requisitos de espaço/energia em campo estruturado, idade recomendada, nº de jogadores, dimensões em texto.

### Piores exemplos (na categoria-vitrine Fliperamas, a 1ª da home!)
- `Fliperamas/Fliperama Infantil de 1.000/metadata.json`: **descrição vazia E `imagens: []`** (existe 1 foto na pasta, não referenciada → card sem foto). Pior produto do catálogo.
- `Fliperamas/Fliperama de 1.000`, `Fliperama de 5.000`, `Fliperama SF4 e KOF XIII`: **descrição vazia** (`descricao: ""`).
- `Fliperamas/Fliperama 11.000`: descrição = "Fliperama de 11.000" (repete o título, 19 chars). Pasta chama "Fliperama 11.000", título "Fliperama de 11.000" (inconsistente).
- `Consoles/Nintendo/Nintendo Wii`: descrição inteira = "C/ 2 controles sem nunchuk" (26 chars, telegráfica, e "sem nunchuk" é informação negativa sem contexto).
- 5 de 54 produtos (9%) sem descrição vendável; 4 deles fliperamas — justamente o carro-chefe anunciado.

### Melhores exemplos (padrão a replicar)
- `Jogos de Mesa/Air Games/Air Game Tradicional` (254 chars): benefício + spec + diferencial visual.
- `Simuladores/Simulador de Corrida` (211): hardware nomeado (G29, câmbio), jogos, emoção.
- `Simuladores/Simulador de Montanha Russa` (200): "vira fila de espera no evento" — ótimo copy.
- `Jogos de Mesa/Tamancobol` (191): único que declara requisito real ("tomada 110/220 V e 2 L de água").
- `Fliperamas/Fliperama Mesa` (196): menciona requisito de tomada e TV.

### Erros pontuais
- `Playstation 3` (linha descricao): markdown quebrado — "com pedestal** caso precise**" (asteriscos errados, renderiza sujo).
- Títulos sem acento/typo: **"Maquina  de Dança"** (espaço duplo + sem acento), "Maquina Boxe", "Maquina Martelo" (pasta e título), **"Mesa Liftime"** (typo; a própria descrição escreve "Lifetime" correto).
- "Atari® 2600" usa ® — nenhum outro título usa marca registrada (inconsistente).
- Meta description em `[...slug]/page.tsx:106-110` só remove `*_#` e corta em 155 chars — os bullets `•` viram texto corrido com "•" no meio do snippet do Google.

## Imagens
- **Dimensões presas em NOMES DE ARQUIVO**: padrão da casa é salvar o croqui/foto com medidas no filename ("2,00 ALT x 0,73 LAR x 1,55 COM.webp", "Pinball Digital Lar Frete 0,69, Larg Trás 0,80...", "220 CM Alt X 130 CM Base...). O alt text é genérico ("{title} - Imagem N", `ProductGallery.tsx:61`), então a única forma de o cliente saber as medidas é abrir foto por foto. Dado valioso não estruturado.
- **Capa ruim**: `imagens[0]` vira capa do card e og:image (`page.tsx:101`). Em vários produtos a 1ª imagem é o croqui de medidas, não a foto bonita: Rock Band ("0,75 Larg (Tv32) x 2,00 Comp..."), Basquete ("2,00 Alt x 2,00 Comp..."), Pinball Digital, Maquina Boxe ("220 CM Alt..."), Maquina Martelo ("2,55 Alt..."), Cama Elástica ("2,23mt.webp"), Piscina de Bolinhas ("2MT x 2MT - Copia.webp"), Tamancobol, Simulador Montanha Russa, Mesa Beer Pong.
- **Galerias desbalanceadas**: Karaokês 42 imgs, Pebolim 35, Mesa de Sinuca 33, Tênis de Mesa 23 (muitas redundantes/baixa qualidade WhatsApp) vs Mesa Liftime 1, Mesa de Carteado 1, PS3 1 (a foto do PS3 é "Estações de Games.webp", genérica), Nintendo Wii 1, Fliperamas novos 1 .jpg de WhatsApp (resto do catálogo é .webp — 8 jpg recentes sem otimizar).
- **Imagens órfãs** (no disco, fora do metadata → invisíveis): Xbox One 2 fotos; Pinball Digital 1; Fliperama Infantil de 1.000 a única foto; pasta `Máquina de pegar Bichinho - Azul/Medidas/` com 8 imagens de medidas não referenciadas; `.../Azul/Vídeos/` 15 MB.
- **14 imagens idênticas (md5) compartilhadas entre produtos diferentes**: 2 fotos repetidas entre Maquina Boxe | Maquina Martelo | Pinball 007; 1 entre Martelo Infantil | Pinball Digital | Air Game Infantil; 1 entre Basquete | Piscina de Bolinhas; 1 entre Air Game Roxo | Basquete; 1 entre Pebolim | Tênis de Mesa; 1 entre Sinuca | Pebolim — fotos de ambiente coladas em produtos errados, passa desleixo na galeria.
- Lixo de nomes: " - Copia.webp", "(1).webp", "download.webp", "Atarii.webp", "Tamalcobol" (typo), duplicatas quase idênticas com sufixo extra ("...8a.webp" e "...8aa.webp" no Martelo Infantil).

## Produto duplicado
- **"Carrinho Infantil" existe 2x** (`Jogos Eletrônicos/Carrinho Infantil` e `Piscinas.../Carrinho Infantil`) com metadata idêntico e 6 das 7 fotos idênticas (md5). Duas URLs 200 com conteúdo duplicado (canonical diferente cada uma) — dilui SEO e duplica manutenção. Se a intenção é aparecer em 2 categorias, precisa de mecanismo de referência, não cópia.

## Social proof fabricado (interseção com conteúdo)
- Só 5 produtos têm `locacoes` real(?) no metadata (PS3 140, PS4 165, PS5 185, X360 130, XOne 155). Para os outros 49, `sales-utils.ts:62-65` **gera um número fake determinístico (100–170) por hash do key**, exibido como "N locações" no `CatalogCard.tsx:96`. Produto sem foto e sem descrição (Fliperama Infantil de 1.000) exibe "1XX locações". Risco de credibilidade/queixa (número inventado apresentado como histórico).

## Categorias
- `category.json` todos com `descricao: ""` (exceto a piada da Pasta X) e `ordem` não usado no site.
- Desequilíbrio: Jogos Eletrônicos = 29 produtos; Videokês = 1 produto efetivo; Realidade Virtual = 3 (Oculus Go é produto descontinuado/fraco para 2026); Piscinas/Infantil = 4; Projetores & Extras = 6 (mistura infra com jogo).
- `catalog-categories.ts:79` (metaTitle Consoles) promete **"PS5, Xbox, Switch e Mais"** — não existe Nintendo Switch no catálogo (só Wii). Promessa SEO sem produto.

## Oportunidades acionáveis (ordem de impacto)
1. **Corrigir o bug NFD/NFC** (`page.tsx:160-163` → comparar com `norm()` ou `.normalize('NFC')`) — devolve a seção Máquinas à home imediatamente.
2. **Escrever as 5 descrições vazias/inúteis** (4 fliperamas + Wii) no padrão dos melhores exemplos: o que inclui, nº de jogos, dimensões, requisito de tomada/espaço, "ideal para X convidados / festa Y".
3. **Estruturar specs no metadata** (`dimensoes`, `area_necessaria`, `energia`, `jogadores`, `idade`, `ideal_para`): os dados JÁ EXISTEM nos filenames das fotos — é migração, não criação. Renderizar como tabela de especificações no produto (ótimo pra SEO e reduz perguntas no WhatsApp).
4. **Campo `videos[]`**: 42 vídeos já gravados (467 MB) e nenhum exibido. Curar 1 vídeo curto por produto-chave (Plataforma 360, Máquina de Boxe, Grua, Air Game) = prova social visual que vende sozinha; mover o resto pra fora do deploy.
5. **Limpeza do repositório público**: remover Pasta X, QRcodes duplicado, tutoriais internos/manuais (147 MB do manual PS5, 82 MB Tutorial Quest, 62 MB "defeitos" Matrix), `~$*.docx`, `.cdr` → corta ~450 MB do deploy e some com documentos internos publicamente acessíveis.
6. **Separar Karaokês em produtos reais** (Matrix RPS 30.000 / Matrix Slim / Pop 300 / Karaokê 2025) — hoje é 1 página confusa com 42 fotos; a categoria com maior potencial de busca ("aluguel de karaokê sp") está mal servida.
7. **Curar `imagens[0]`** de ~10 produtos para foto-herói (croqui de medidas vai pro fim ou pra seção "Medidas").
8. **Listas de jogos como conteúdo**: `Jogos Quest2.txt` e `Jogos Go.txt` existem; "quais jogos vêm?" é a pergunta nº1 — publicar lista no produto (consoles, fliperamas 1.000/5.000/11.000).
9. **FAQ por produto** (espaço, energia, montagem, chuva p/ infláveis) + "ideal para N convidados" — diferencial de conversão e long-tail SEO.
10. Resolver Carrinho Infantil duplicado; decidir fonte única + referência cruzada.
11. Substituir `locacoes` fake por contagem real ou remover o badge dos produtos sem dado real.
12. Adicionar produto Nintendo Switch ou remover "Switch" do metaTitle em `catalog-categories.ts:79`.

## Estatísticas rápidas
- 54 metadata.json | 5 descrições vazias/inúteis | 1 produto sem imagem no metadata | 2 produtos duplicados (Carrinho) | 1 produto inalcançável (Karaokê 2025) | 14 imagens repetidas entre produtos | 42 vídeos não usados (467 MB) | `ordem` e `slug` campos mortos | 543 MB total em public/Organizado.
