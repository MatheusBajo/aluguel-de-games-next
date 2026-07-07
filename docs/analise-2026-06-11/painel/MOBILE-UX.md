# Parecer — Lente: Experiência Mobile
Auditor: especialista mobile UX · Data: 2026-06-11
Material: 12 screenshots mobile (722px = viewport ~361 CSS px @2x, dev server), crops em viewport real, código em src/, 10 auditorias de código, 3 pesquisas.

## 0. Contexto da lente
Quem organiza festa pesquisa no celular, à noite, no WhatsApp da família. Para este negócio, o site mobile não é "uma versão" — é A loja. Avaliei dobra, thumb zone, toque, peso em 4G e propus os layouts ideais de produto e home.

Caveat de método: os screenshots foram tirados em dev mode (badge "N" do Next visível) e capturam o drawer do menu fora da tela à direita (página com 2× de largura na captura). Verifiquei no código: o drawer é `position:fixed` + `body{overflow-x-hidden}` — **não** há scroll horizontal real para o usuário; é artefato de captura. Mas o artefato comprova o achado da auditoria de a11y: o drawer fica renderizado e focável quando fechado (falta `inert`).

---

## 1. O que os screenshots mostram que as auditorias não viram

### 1.1 O canto inferior direito é terra de ninguém (colisões do WhatsAppFloat) — NOVO
O float (`fixed bottom-4 right-4`, ~56px + badge fake "1") colide com conteúdo em praticamente toda página no viewport de 361px:
- **/404**: o float com badge "1" cobre o próprio botão "INSERT COIN - WHATSAPP" — dois botões de WhatsApp empilhados um sobre o outro, no mesmo pixel (visto no screenshot).
- **/como-funciona**: float + tooltip "Precisa de ajuda?" cobrem o texto do passo 01 ("Não sabe escolher? A gente ajuda...").
- **/sobre**: cobre o contador "33+ anos".
- **/catalogo** e páginas de categoria: cobre o badge/título dos cards da coluna direita do grid 2-col.
- **Página de produto**: flutua colado na fileira share/coração e ao lado do título.
- **Home**: cobre parte da régua de stats do hero.
Diagnóstico: não é "um bug do float" — é a ausência de um **sistema de borda inferior mobile**. A mesma decisão de design que deixou a página de produto sem CTA sticky deixou o float brigando com tudo. Um único componente "barra de conversão mobile" resolve os dois: barra sticky contextual nas páginas de produto/categoria (o float some nelas) e float pequeno e honesto (sem badge "1") no resto.

### 1.2 A imagem principal da galeria é uma zona morta de toque — NOVO (agrava o achado 2.4 da auditoria de produto)
A auditoria viu que os controles são `opacity-0 group-hover`. O código confirma pior: a imagem principal **não tem onClick nenhum** (`ProductGallery.tsx:45-67`) — tocar na foto não abre fullscreen, não avança, não faz nada (no máximo dispara o hover emulado e revela botões de 28px de forma flaky). Não há um único handler de toque no arquivo (grep onTouch/Pointer/drag = 0). Com "1/18" e "1/35" indicando dezenas de fotos, o usuário mobile fica preso na foto 1 ou nas thumbs de 48px. **Para um produto que se vende por foto, a galeria mobile é o coração — e está parada.** O projeto já tem embla-carousel; portar a galeria para embla dá swipe + snap por ~1 dia.

### 1.3 A primeira foto não é uma capa — NOVO
Pebolim abre com "1/35": uma foto ambiente de casa de lago onde a mesa aparece pequena e ao fundo. A ordem das fotos é a ordem do filesystem; não existe campo `capa` no metadata. No mobile, a foto 1 + título é tudo que cabe na dobra — é o pitch inteiro. Curar capa (campo `capa` no metadata.json + fallback primeira foto) e limitar a galeria a ~10 fotos curadas ("ver todas as 35") é barato e de impacto direto. Bônus: a capa curada vira a OG image do WhatsApp.

### 1.4 Top 10 mobile: a seção mais vendedora é ilegível para TODOS, não só para baixa visão — reframing
A auditoria de a11y registrou `text-[5pt]/[7pt]` como problema de acessibilidade. No screenshot a 361px: os numerais gigantes 1-2 dominam, os cards têm ~95px e o texto ("Mais de 30.000 jogos retrô...") é ruído ilegível. Isso não é um issue de WCAG — é a **seção de merchandising nº 1 da home não funcionando para 100% dos usuários mobile**. Somado ao `ssr:false` (buraco até hidratar) e ao modal beco-sem-saída (só WhatsApp, sem link pra página do produto), o Top 10 mobile é custo sem retorno hoje.

### 1.5 Contadores renderizam "0+ EVENTOS / 0% SATISFAÇÃO" — eco exato do concorrente ridicularizado
No full-page screenshot da home, a seção Sobre exibe "0+ eventos, 0+ equipamentos, 0% satisfação" (Counter reseta para 0 no client e só anima ao entrar na viewport). Usuário real que rola devagar vê a animação; mas capturas, preview tools, renderizações sem scroll-trigger e qualquer falha de JS mostram os zeros. A pesquisa de concorrentes aponta que a Aluga Videogames "quebra credibilidade grave" com contadores "0+" — o site flerta com o mesmo vexame em estados de renderização não-felizes. Fix: nunca resetar para 0 no SSR/estado inicial (animar de um valor próximo, ou só animar se IO disparou de fato).

### 1.6 Dobra da página de produto: a soma dos pequenos custos — quantificado
No viewport de 361×800: header (56px) + breadcrumb em 2 linhas (~64px) + vão morto `mt-20` (80px) = ~200px queimados antes da galeria. A galeria `aspect-square` (361px) + thumbs (~64px) + badge + título... o CTA "Fazer Orçamento" fica na borda da dobra no melhor caso (PS5, descrição curta) e 1.5-2 telas abaixo no pior (descrições longas). Três fixes triviais somam quase meia tela: remover mt-20, breadcrumb compacto de 1 linha ("‹ Jogos Eletrônicos"), e galeria 4:3 em vez de 1:1 para fotos landscape.

### 1.7 Related Products mobile = 4 viewports de produtos errados — agrava o 2.10
No mobile os 4 related são cards full-width empilhados: ~4 telas de rolagem mostrando, depois do PS5, um "Carrinho Infantil" (filesystem order da categoria raiz). Trocar por carrossel horizontal com scroll-snap (2.2 cards visíveis) devolve 3 telas e força afinidade por subcategoria.

### 1.8 Catálogo mobile: 8 telas de rolagem começando pela seção errada — efeito composto
/catalogo tem ~5.850 CSS px (≈8 viewports). Por causa do bug NFC/NFD, a primeira seção é "Jogos de Mesa > Air Games" (nicho) em vez de Fliperamas/Consoles (carro-chefe). Sem busca, sem chip bar, sem headers clicáveis, o custo de achar algo no polegar é altíssimo. Três auditorias flagram pedaços (ordem quebrada, headers sem link, "Outros"); o efeito mobile é multiplicativo: **o usuário 4G baixa 8 telas de imagens originais para ver primeiro o produto errado**. Fix combinado: normalize NFC (1 linha) + chip bar sticky horizontal de categorias no topo + headers linkando às páginas de categoria.

### 1.9 O que está genuinamente BOM no mobile (não mexer)
- **CTA do hero está acima da dobra no mobile** (confirmado no screenshot; o problema de dobra é só desktop).
- Menu drawer: bem desenhado visualmente, CTA no topo, contato no rodapé.
- /contato mobile é excelente: cards de canal com alvo de toque grande ("Toque pra abrir o WhatsApp"), hierarquia clara.
- /404 é a melhor página criativa do site (tema fliperama, "insert coin") — só sofre a colisão do float.
- Footer completo e legível; tipografia geral grande e confortável (fora Top 10 e legenda do hero).
- Páginas de categoria (cat-fliperamas) têm H1 forte + contagem + grid limpo — a melhor base mobile do site.

---

## 2. Thumb zone — mapa rápido
- **Topo direito** (pior alcance): WhatsApp icon do header + hambúrguer. OK como secundário.
- **Centro do fluxo**: CTAs inline verdes — bons, mas rolam para fora.
- **Base direita** (melhor alcance): float — hoje o único elemento persistente, e está poluído (badge fake) e colidindo.
- **Base inteira** (zona nobre): vazia. Nenhuma barra sticky. É o maior imóvel desperdiçado do site.

## 3. Orçamento 4G (peso por página, dados reais do repo)
| Página | Peso imagem/vídeo potencial | Em 4G (~5 Mbps) |
|---|---|---|
| Home | ~36 MB vídeo (7 autoplay) + ~1,2 MB hero + catálogo inline | ~60 s de banda saturada |
| /catalogo (scroll completo) | ~8,9 MB de originais 1200×1600 em cards de 165px | ~15 s |
| Produto (Pebolim) | 5,3 MB / 35 fotos originais (thumbs de 48px baixam o original) | ~9 s |
| Logo (todas) | 528 KB PNG para 24px de altura | grátis de consertar |
A correção não é "otimizar tudo": é **poster + tap-to-play nos vídeos (e 3 em vez de 7), thumbs 320/640 via sharp (já instalado), logo SVG**. Isso muda a home de ~37 MB para ~2 MB.

---

## 4. Layout mobile ideal — Página de Produto
```
┌─────────────────────────────┐
│ Header compacto 56px        │
│ ‹ Fliperamas    (1 linha)   │ ← breadcrumb = link de volta à categoria, truncado
│ ┌─────────────────────────┐ │
│ │ GALERIA edge-to-edge 4:3│ │ ← swipe (embla), dots + "3/10", tap = fullscreen,
│ │  capa curada            │ │   setas sempre visíveis em touch, pinch no fullscreen
│ └─────────────────────────┘ │   máx ~10 fotos curadas + "ver todas (35)"
│ H1 Pebolim                  │
│ [2-4 jog] [1,4m] [110/220V] │ ← chips de SPECS REAIS (metadata), não texto genérico
│ ★ Desde 1993 · Entrega e    │ ← 1 linha de confiança honesta (substitui "500+/100%")
│   montagem inclusas         │
│ [▷ Fazer orçamento (verde)] │ ← CTA inline no primeiro viewport
│ Descrição curta…  [ler mais]│ ← colapsável; descrição longa não empurra nada
│ ▸ Especificações (accordion)│ ← espaço necessário, tomada, montagem — o que trava orçamento
│ ▸ Dúvidas comuns (3-5 FAQ)  │ ← chuva, prazo, área de entrega
│ Quem alugou (1-2 fotos reais│
│   de evento + review Google)│
│ Relacionados ─ carrossel    │ ← scroll-snap horizontal, 2.2 cards, mesma subcategoria
│ Footer                      │
╞═════════════════════════════╡
│ STICKY BAR 64px:            │ ← aparece após rolar a galeria; substitui o float aqui
│ [🟢 Orçamento no WhatsApp]  │   msg pré-preenchida c/ produto+URL; microcopy
│  "resposta rápida no horário│   honesta de tempo de resposta
│   comercial"                │
└─────────────────────────────┘
```
Princípios: 1 viewport = foto + nome + specs + CTA; tudo abaixo é tira-objeções; a base da tela pertence à conversão.

## 5. Layout mobile ideal — Home
```
┌─────────────────────────────┐
│ Hero: badge 1993 + H1 (CSS  │ ← reveal por CSS (.rise-in já existe); zero gate de JS
│ reveal) + sub + [CTA dupla] │ ← CTAs ANTES do carousel (garante dobra em qq tela)
│ carousel 4:3, 5 slides,     │
│ legenda legível ≥12px       │
├─────────────────────────────┤
│ PROVA: "33 anos · +N mil    │ ← número real do dono; link Google Reviews
│ eventos · ★4,9 Google"      │
├─────────────────────────────┤
│ CATEGORIAS grid 2×3:        │ ← job-to-be-done nº1 mobile: "o que vocês têm?"
│ Fliperama │ Karaokê         │   cards com foto, linkando às páginas de categoria
│ VR        │ Consoles        │   (hoje esses links só existem no dropdown desktop!)
│ Mesas     │ Infláveis       │
├─────────────────────────────┤
│ TOP 10 carrossel horizontal │ ← SSR, texto ≥12px, tap → PÁGINA do produto
│ leve (sem clone Netflix)    │   (modal só-WhatsApp vira atalho secundário)
├─────────────────────────────┤
│ EM AÇÃO: 3 vídeos poster +  │ ← tap-to-play; resto vive na /galeria
│ ▷ play (700KB cada, 720p)   │
├─────────────────────────────┤
│ Como funciona (3 passos     │
│ compactos) + CTA final      │
│ Footer                      │
└─────────────────────────────┘
```
Mudança estrutural mais importante: **subir o acesso às categorias para a 2ª-3ª dobra** — hoje o caminho mobile para o catálogo é 1 link no fim do hero ou o menu; a home gasta as dobras 2-5 com Top 10 ilegível + 36 MB de vídeo.

---

## 6. Prioridades da lente mobile (impacto × esforço honestos)
1. **Barra de conversão sticky no produto + aposentar badge "1" + float ceder** — alto, baixo-médio. Resolve dobra, thumb zone e colisões de uma vez.
2. **Galeria touch (embla: swipe, tap-fullscreen, setas visíveis) + capa curada** — alto, médio. O coração da decisão de compra mobile.
3. **Dieta 4G da home (3 vídeos poster/tap-to-play + recompressão; logo SVG)** — alto, médio. De ~37 MB para ~2 MB.
4. **Catálogo navegável (NFC fix + chip bar sticky + headers linkados + thumbs sharp)** — alto, baixo-médio.
5. **Hero sem gate de JS (CSS reveal) + fetchpriority slide 1** — alto para LCP, baixo.
6. **Mensagens pré-preenchidas em todos os CTAs** (helper já existe) — alto, trivial. Digitar no teclado mobile é fricção que o ?text= elimina.
7. **Top 10: texto legível + tap → página de produto** — médio-alto, médio.
8. **Related em carrossel horizontal por subcategoria** — médio, baixo.
9. **Specs + FAQ por produto (chips/accordion)** — médio-alto, médio (depende de conteúdo do dono).
10. **mt-20 + breadcrumb 1 linha + galeria 4:3** — médio, trivial.

## 7. Discordâncias e caveats (para o debate)
1. **A régua de severidade das auditorias mede corretude técnica, não receita.** Canonical/JSON-LD estão como "ALTO" e a galeria/CTA mobile como "MÉDIO". Com tráfego majoritariamente mobile e conversão 100% WhatsApp, é o inverso: o funil mobile move receita já; os fixes SEO são baratos e devem ser feitos, mas não são "os mais graves".
2. **Mini-configurador de orçamento (pesquisa CRO): não construir agora.** A própria literatura citada admite +40% de abandono em quebras de fluxo mobile. Para 1 dev, sticky bar + ?text= contextual entrega 80% do valor com 10% do risco. Configurador só como teste, depois do básico.
3. **A11y pede controles/pausa nos 7 vídeos autoplay — é o patch errado.** A correção certa é remover o autoplay (poster + tap-to-play): resolve WCAG 2.2.2, 36 MB de dados, bateria, CLS e iOS Low Power Mode de uma vez. Adicionar botões de pausa a 7 vídeos autoplay institucionaliza o desperdício.
4. **"Consolidar engines de animação" (perf, 1-2 dias por 40-80 KB): adiar.** No mobile o gargalo são assets (MB), não os KB de JS. Mesmo raciocínio para boa parte da limpeza de deps: higiene, não conversão.
5. Caveat interno do painel: a auditoria de navegação chama o MobileMenu de "excelente"; a de a11y mostra que por dentro (focus trap/inert) está quebrado. Ambas certas — visual ótimo, esqueleto frágil. E o problema mobile real não está dentro do menu: está na borda inferior da tela, que ninguém gerencia.
