# Parecer — Lente: Design Visual e UI
Auditor: especialista em design visual/UI · Data: 2026-06-11
Base: screenshots desktop (home, catálogo, PS5, empresas, galeria, como-funciona, 404) vistos em recortes de alta resolução; auditorias home-hero, catalog-listing, product-page, static-pages, accessibility; pesquisa competitors-br; verificação pontual no código (layout.tsx, globals.css, CatalogCard.tsx, ProductInfo.tsx, filesystem de imagens).

---

## 1. Avaliação geral: o sistema visual é um ativo — o problema é o que entra nele

O site tem um design system genuinamente acima do setor:

- **Tipografia em 3 vozes bem definida** (layout.tsx:12-29): Bricolage Grotesque (display), DM Sans (body), JetBrains Mono (labels). O dispositivo de headline assinatura — *bold display + continuação em itálico esmaecido + destaque em gradiente* ("Sua festa. **Nossa diversão.**", "Eventos corporativos **que ninguém esquece**", "Desde **1993** fazendo festa virar memória") — é aplicado com consistência em todas as páginas. Isso é raro até em site de agência.
- **Eyebrow labels em mono uppercase** (`.label-arcade`: "< QUEM SOMOS >", "VAMOS JOGAR?", "B2B · SOLUÇÕES CORPORATIVAS") criam uma voz "arcade-tech" coerente com o negócio.
- **A 404 é um ativo de marca** (neon, "ESSE LEVEL NÃO EXISTE", "INSERT COIN · WHATSAPP", "RESTART", atalhos de categoria) — melhor página do site em personalidade.
- **/empresas é a página mais bem acabada**: passos numerados 01-04 com numerais em gradiente, grids limpos, cases com foto. Padrão a ser replicado.

A conclusão da lente visual é inversa à intuição: **não é o layout que derruba a qualidade percebida — é o conteúdo visual (fotos, placeholders, números zerados) entrando num sistema que promete mais do que ele entrega.** Um visitante lê o site como "agência fez o site, mas a empresa parece abandonada por dentro". Os refinamentos abaixo atacam exatamente essa dissonância.

---

## 2. Achados novos (não levantados, ou não conectados, pelas auditorias)

### 2.1 O design system não tem estado de carregamento — e no tema escuro isso parece site quebrado (ALTO)
Nos screenshots full-page capturados do próprio localhost, **seções inteiras do /catalogo renderizam como retângulos escuros vazios**: todos os cards de "Piscinas, Infláveis...", todos os 6 de "Projetores & Extras", os 3 de "Realidade Virtual", e TODOS os cards da vitrine da home ("O que joga na sua festa"). Verifiquei o filesystem: as imagens EXISTEM (Oculus Quest 2 tem 8 fotos). O que se vê é o estado de loading real de quem rola a página em 4G: `CatalogCard.tsx:50` usa `aspect-square bg-gray-900` sem skeleton, sem blur-up, sem cor dominante — sobre fundo `#0a0a0a`, imagem não carregada é **indistinguível de imagem quebrada**. Em site claro, um box cinza lê como "carregando"; em dark theme, lê como "abandonado".
**Fix:** placeholder de cor dominante ou LQIP gerado em build (o projeto JÁ depende de `sharp` — extrair cor média/blurhash por imagem e gravar no metadata.json é um script de uma tarde), + shimmer sutil + nome do produto visível no card desde o SSR. Isso também amortece o peso das imagens cruas de 1.7MB apontado pela auditoria de performance.

### 2.2 A direção de fotografia é o teto da qualidade percebida — ninguém a tratou como o problema nº 1 visual (ALTO)
As auditorias falam de peso, alt-text e encoding das imagens; nenhuma diz o óbvio da lente visual: **as fotos são de WhatsApp** — máquinas em garagem/depósito, fundo com entulho, enquadramento torto, e na /galeria há **flyers de divulgação com starburst e texto colorido ("Videokê Pop 300 · 30.000 músicas até 2024") misturados às fotos reais de eventos**. Esses flyers, num masonry de tema escuro premium, leem como anúncio de classificados — destroem em 2 segundos o que a tipografia construiu.
Plano realista para 1 dev sem orçamento de estúdio:
1. **Hoje:** remover os flyers da galeria (são 4-6 imagens); deixar só foto real.
2. **Esta semana:** curadoria da PRIMEIRA imagem de cada produto (é a que aparece no card) — escolher a mais limpa das que já existem; o admin com @dnd-kit já permite reordenar.
3. **Padronizar tratamento:** scrim escuro permanente na base do card (hoje o gradiente só aparece no hover — `CatalogCard.tsx:63`) unifica fotos heterogêneas de graça.
4. **Médio prazo:** uma tarde de fotos com fundo neutro escuro para os 15 produtos mais alugados, ou pipeline sharp com vinheta/fundo escurecido.

### 2.3 Contadores "0+" — o site exibe exatamente o defeito que a pesquisa aponta como fraqueza de concorrente (ALTO, esforço trivial)
Os screenshots capturam "0+ anos", "0+ eventos", "**0% satisfação**" na home, galeria e sobre (Counter reseta o SSR para 0 e espera IntersectionObserver — static-pages.md §5.1). A pesquisa de concorrentes registra sobre a Aluga Videogames: *"contadores exibindo 0+ — quebra de credibilidade grave… site visivelmente malcuidado. Oportunidade fácil de superar."* Ou seja: **o site está sujeito a ser descrito pelo cliente exatamente como descrevemos o pior concorrente.** "0% satisfação" visível em qualquer print/render lento é o pior pixel do site inteiro. Fix: nunca resetar a zero (animar a partir do valor final, ou só animar se o observer disparar em <1s; fallback = valor estático).

### 2.4 Semântica de cor: o verde do WhatsApp está sendo diluído por 54 badges falsas (MÉDIO, esforço trivial)
O sistema de cor é: gradiente azul→roxo→rosa = marca; **verde = ação WhatsApp** (correto, reconhecimento universal). Mas cada card do catálogo exibe "140+ locações" em **verde com ícone TrendingUp** (`CatalogCard.tsx:92-99`). Resultado: numa tela do catálogo há ~12 elementos verdes "decorativos" competindo com o único verde que importa (CTA). Como essas locações são fabricadas por hash (risco de confiança apontado por 2 auditorias — concordo em remover), a solução de cor vem junto: **remover ou neutralizar para cinza, e reservar verde exclusivamente para ações de WhatsApp.** Custo zero, devolve hierarquia de ação ao site inteiro.

### 2.5 Colapso de hierarquia nos cabeçalhos do /catalogo (MÉDIO)
Três níveis competem visualmente: faixa-gradiente H2 (categoria) → pill H3 (subcategoria) → badge de categoria em cada card. Casos absurdos visíveis no screenshot:
- "Projetores & Extras" (faixa) seguida de "Outros (6)" (pill) — subcabeçalho que não informa nada, 5× "Outros" na página;
- "Videokês — **1 produtos** disponíveis" com 1 card órfão e ~400px de vazio abaixo (o grid reserva 6 colunas);
- badge "Jogos de Mesa" repetida em todos os cards DENTRO da seção "Jogos de Mesa".
**Regras simples:** (a) suprimir o pill quando a subcategoria é única ou se chama "Outros"; (b) remover a badge do card quando renderizado dentro da própria seção; (c) singular/plural correto; (d) grid com `auto-fit` ou fundir categorias de 1-2 itens numa seção "Mais equipamentos".

### 2.6 Ritmo vertical: vazios gigantes leem como erro, não como respiro (MÉDIO)
No dark theme sem mudanças de fundo entre seções, os gaps de 300-500px (cauda do /catalogo após Videokês, bloco vazio na seção "Desde 1993", `min-h-screen` no Demonstra) parecem página quebrada — não há borda nem tint que diga "a seção acabou". As faixas-gradiente do catálogo já resolvem isso onde existem. **Fix:** escala de espaçamento única entre seções (ex.: py-24), remover `min-h-screen` decorativo, e usar tint/borda sutil para delimitar seções longas.

### 2.7 Trust bar de texto onde deveria haver logos (MÉDIO-ALTO, conecta 3 fontes)
Sob o hero: "Grandes empresas · Personalidades públicas · Festas particulares · Eventos corporativos" — texto mono pequeno. A pesquisa mostra TDB ganhando com 12 logos (CBF, Prime Video); a empresa TEM Bradesco, Spotify (foto na galeria!), Arnold Classic, Danilo Gentili — escondidos em legendas. **Um logo-wall monocromático (logos brancos a ~40% de opacidade, acendendo no hover) é a mudança visual de maior alavancagem de credibilidade do site**, e o estilo combina com o dark theme. Onde não houver logo licenciável, usar nome tipográfico em mono uppercase — já é a linguagem do site.

### 2.8 Slot de estatística com frase dentro + 4 versões dos mesmos números (MÉDIO)
`ProductInfo.tsx:118` põe "Orçamento via Whatsapp" em `text-2xl font-bold` no lugar de um número — visualmente parece um erro de template (e "Whatsapp" grafado errado). As trincas de stats aparecem em 4+ páginas com valores divergentes (98% vs 100%; 500+ com 3 legendas). **Fix de design + consistência juntos:** um componente `<StatsRow>` único com fonte única de dados (site.config), e o slot do meio do produto vira um stat real ("33+ anos") ou um selo, não uma frase.

### 2.9 Legenda do hero: texto no centro, scrim na base (BAIXO-MÉDIO — concordo e estendo a auditoria)
A auditoria apontou contraste/8pt; o ponto de design: a legenda carrega o melhor conteúdo do site ("Aniversário do Danilo Gentili — Pinball 007") e está na posição de menor legibilidade. Mover para dentro do scrim inferior, ≥12-14px, com o nome do cliente em destaque mono — a legenda vira prova social, não decoração.

---

## 3. Onde o visual JÁ ajuda (não mexer)
- Sistema tipográfico e dispositivo de headline — manter intacto.
- 404 arcade — referência de marca; espalhar sua linguagem (neon/scanline sutil) em micro-momentos (hover de cards, dividers), não o contrário.
- Hierarquia de CTA verde-sólido vs outline — correta e consistente.
- /empresas como template de qualidade para reformar /sobre (que é texto puro).
- Footer: completo, bem organizado, com hierarquia clara.

---

## 4. Discordâncias e caveats (para o debate)

1. **"Tirar as animações do caminho crítico" ≠ "tirar as animações".** As auditorias de perf/a11y, lidas ao pé da letra, levariam a remover a coreografia de entrada (opacity:0 no SSR, GSAP no hero). O diagnóstico está certo, mas o remédio deve preservar a linguagem de movimento — ela é parte mensurável do "acima da média do setor". Padrão correto: conteúdo visível por default, animação como enhancement (classe `js-anim`/`whileInView` com fallback CSS), não cortar tweens.

2. **Discordo de enriquecer o CatalogCard com descrição/dimensões/hint "Ver detalhes"** (catalog-listing §10). Num card de ~200px, descrição de 150 chars vira ruído e mata o scan do grid. O problema do card não é falta de texto — é a foto fraca e a métrica falsa. Affordance se resolve com uma seta discreta na linha do título e cursor/elevação; informação técnica pertence à página do produto (lá sim, faltando).

3. **A 404 está sub-priorizada nas auditorias** — tratada como página com "problemas menores" (CSS inline, falta busca). É o contrário: é o melhor artefato de identidade do site e deveria ser tratada como fonte do design language a propagar. Gastar esforço "arrumando" a 404 antes de consertar os "0+" e as fotos é inverter prioridades.

4. **Caveat sobre preço-âncora** (competitors-br §1 recomenda "a partir de R$X"): se o negócio adotar, isso exige redesenho deliberado da hierarquia do card e da página de produto — preço muda o que o olho busca primeiro. Implementação tímida (badge "consulte", "R$ —") reproduziria o bug "R$ 0" que ridicularizamos na Aluga Videogames. Ou entra com design próprio, ou não entra.

---

## 5. Top recomendações priorizadas (impacto × esforço honestos)

| # | Ação | Impacto | Esforço |
|---|------|---------|---------|
| 1 | Counters nunca resetarem a 0 (Counter.tsx) | Alto | Trivial |
| 2 | Placeholder LQIP/cor dominante + shimmer nos cards e galerias (sharp em build) | Alto | Médio |
| 3 | Curadoria fotográfica: tirar flyers da galeria, eleger 1ª foto limpa por produto, scrim permanente nos cards | Alto | Baixo |
| 4 | Logo-wall/nomes monocromáticos no lugar da trust bar de texto | Alto | Baixo |
| 5 | Verde exclusivo para WhatsApp; remover/neutralizar badges "locações" | Médio | Trivial |
| 6 | Higiene de hierarquia no /catalogo (suprimir "Outros", badge redundante, plural, vazio da cauda) | Médio | Baixo |
| 7 | `<StatsRow>` único com fonte única de números (mata 98%-vs-100% e o slot quebrado do produto) | Médio | Baixo |
| 8 | Legenda do hero no scrim inferior, ≥12px, cliente em destaque | Médio | Trivial |
| 9 | Escala única de espaçamento entre seções; remover min-h-screen decorativo | Médio | Médio |

