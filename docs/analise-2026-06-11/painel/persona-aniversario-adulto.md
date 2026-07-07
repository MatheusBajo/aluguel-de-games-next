# Persona: Camila, 29 — festa de 30 anos "retrô-gamer" num rooftop (60 pessoas)

**Quem sou eu:** designer, organizo minha festa de 30 anos num rooftop alugado na zona oeste de SP. Tema retrô-gamer. Lista de desejos: **fliperama + videokê + máquina de boxe** (e descobri que queria beer pong também). Vou ratear com o namorado, então preço importa. Navego 100% no celular, geralmente à noite, em paralelo com Instagram e mais 2-3 abas de concorrentes. A estética da festa É o produto — se não rende foto, não aconteceu.

Material analisado: screenshots mobile (home, catálogo, fliperamas, pebolim, galeria + crops), pagetext de 6 páginas, navegação real em localhost:3000 (videokê, máquina de boxe), metadata.json dos produtos da minha lista, cruzado com as auditorias de nav-conversion, product-page, catalog-data e a pesquisa rental-ux.

---

## 1. Primeira impressão (home mobile): "ok, vocês entenderam a vibe"

O site é **escuro, neon, com microcopy de arcade** ("press start", "Manual do jogador v1.0", "O que joga na sua festa"). Pra uma festa retrô-gamer isso é EXATAMENTE o moodboard. Nenhum concorrente que abri parece assim — a maioria parece site de buffet infantil de 2012. Primeiro ponto pra vocês: **eu ficaria**. O hero com "Desde 1993" também me pega: empresa mais velha que eu não vai sumir com meu sinal.

O carrossel do hero mostrando a máquina de BOXING logo de cara foi sorte ou inteligência — é um dos meus 3 itens. "Aniversário Danilo Gentili", Bradesco, Spotify na galeria: registro mental de "gente séria". Confiança ✅.

**Mas**: o site é instagramável; **as fotos dos produtos não são.** E eu compro pela foto.

## 2. Caçando meus 3 itens

### Fliperama — achei, mas não entendi o que estava lendo
Menu → Fliperamas, fácil. Aí me deparo com: "Fliperama de 11.000", "Fliperama de 5.000", "Fliperama de 1.000". **Minha primeira leitura honesta: achei que era o preço.** "Fliperama de 11.000... reais?? Passou do orçamento, próximo." Demorei pra inferir que é número de JOGOS — e só porque a categoria diz "11.000 jogos clássicos" no texto de intro, que eu quase pulei. A descrição do produto "Fliperama de 11.000" é literalmente o título repetido (confirmei no metadata.json). Pra um item-vitrine, é o produto pior explicado do site. Qual a diferença entre o de 5.000 e o de 11.000 além do número? Tamanho? Dois jogadores? Tela? Não diz.

### Videokê — a vitrine promete, a prateleira tem 1 item genérico
O menu tem categoria com emoji de microfone ("Videokê & Karaokê" — está até no `<title>` do site!). Clico e encontro **UM produto chamado "Karaoke"**, sem acento, cuja descrição é do "Videokê Pop 300 ... catálogo atualizado até 2023". Pra minha festa em 2026, "até 2023" = sem os hits que minhas amigas vão querer cantar. Detalhe que me deixou confusa de verdade: **a Galeria mostra QUATRO modelos** (Karaokê Matrix Mesa, Matrix Slim, Pop 300, Matrix 30.000) que não existem no catálogo. Então vocês têm 4 e me mostram 1? Qual vem pra minha festa? (Nota técnica: existe um "Karaokê 2025" com 30.000 músicas no metadata, mas a URL dele dá erro 500 e nenhum link aponta pra ele — o melhor produto da categoria está literalmente inalcançável.)

### Máquina de boxe — achei, gostei, mas o rooftop tem perguntas
"Maquina Boxe" (sem acento, sem "de" — eu sou designer, eu NOTO typo, e typo em vitrine me faz baixar meio ponto de confiança). Descrição ok (sensor de força, ranking). Fotos: prints de WhatsApp de eventos reais — autêntico, mas nada que eu salvaria no Pinterest. E a pergunta que me faria travar o pedido: **cabe no elevador de serviço? Quanto pesa? Precisa de tomada 220V? Pode em rooftop?** Nada disso está na página. (Ironia cruel: a dimensão EXISTE no site — escondida no NOME DO ARQUIVO de uma foto: "220 CM Alt X 130 CM Base lateral x 140CM Base Frontal.webp". A informação que eu preciso está num filename.)

### Bônus — Beer Pong existe e eu NUNCA acharia
Mesa de Beer Pong, item perfeito pra minha festa, está enterrada em... **"Projetores & Extras"**. Eu só descobri porque li o catálogo inteiro pra esta auditoria. Nenhuma pessoa real faz isso.

## 3. Orçamento: impossível estimar, e isso me manda pros concorrentes

Eu preciso de UMA coisa pra decidir se rateio com o namorado fecha: **ordem de grandeza**. R$ 500 ou R$ 5.000? O site não dá nem pista: sem preço, sem "a partir de", sem combo, sem período padrão de locação (4h? o dia todo? minha festa vai até 2h da manhã — hora extra existe?). O resultado prático do meu comportamento real: **abro WhatsApp de 3 empresas ao mesmo tempo, mando a mesma pergunta, e quem responder mais rápido com número claro leva.** O site lindo de vocês vira só mais um chat na fila — todo o investimento em design se dissolve porque a decisão migrou pro WhatsApp em igualdade de condições com o site feio do concorrente.

E o atrito de iniciar esse chat é meu: quero 3 itens, mas o CTA do produto pré-preenche só 1 produto (e a maioria dos CTAs não pré-preenche NADA, como a auditoria de conversão já mapeou). Vou ter que digitar: "oi, queria fliperama (qual??), videokê e máquina de boxe, dia X, rooftop em Pinheiros, 60 pessoas..." — num site que já sabia tudo isso enquanto eu navegava.

## 4. O teste do Instagram

Antes de mandar mensagem eu SEMPRE confiro o Instagram (link existe no footer: instagram.com/alugueldegames — ok). O site não embeda nem referencia o feed em lugar nenhum visível. A Galeria tem fotos reais mas com legendas como "Evento", "Festa", "Diversão garantida" — e as fotos são de festas dos outros, diurnas, fundo bagunçado. A foto principal do Pebolim é numa casa de lago linda, mas é a casa de alguém, não a MINHA festa. **O que me faria salvar e mandar pro namorado: uma foto noturna, fliperama ligado brilhando neon num terraço, gente de 25-35 anos com drink na mão.** Vocês alugam exatamente isso e não têm UMA foto assim.

## 5. O que me faria fechar NA HORA vs. continuar pesquisando

**Fecharia na hora se existisse:**
1. Um combo "Festa Adulta / Aniversário Retrô" — fliperama + karaokê + boxe (+ beer pong) com "a partir de R$ X" e foto noturna do conjunto montado;
2. Resposta na página pra "cabe no elevador / qual tomada / pode em rooftop";
3. Botão que monta minha mensagem de WhatsApp com os 3 itens + data + bairro já preenchidos.

**O que me faz continuar pesquisando (estado atual):** silêncio total sobre preço, videokê confuso/desatualizado, fotos que não vendem a MINHA festa, e a sensação de que "festa particular adulta" é o 3º público da casa (a home lista "Grandes empresas · Personalidades públicas · Festas particulares..." — eu sou a terceira da fila).

Veredito honesto: **TALVEZ**. O design e os 33 anos me trazem até o WhatsApp — acima da média do setor. Mas chego lá sem âncora de preço e com 3 dúvidas que a página podia ter matado, então a conversão depende 100% da velocidade e qualidade do atendente. O site faz 70% do trabalho de sedução e 0% do trabalho de fechamento.

---

## Recomendações (lente: cliente festa-adulta; honestidade de impacto/esforço)

| # | Recomendação | Impacto | Esforço |
|---|---|---|---|
| 1 | **Página/combo "Festa Adulta & Aniversário Retrô"** com fliperama + karaokê + boxe + beer pong, "a partir de R$ X", período padrão e foto do conjunto. É também landing de SEO ("aluguel fliperama aniversário adulto sp"). Zero inventário novo — só curadoria do que já existe. | Alto (cria o caminho do 2º maior público; ancora preço) | Médio (1 página + 1 sessão de fotos + decidir o preço-âncora) |
| 2 | **Renomear fliperamas: "Fliperama 11.000 JOGOS"** (e descrever a diferença real entre os modelos: tamanho, nº de jogadores, jogos destaque). Leigo lê "de 11.000" como preço. | Alto (mata má-interpretação no produto-vitrine nº 1) | Trivial (editar metadata.json) |
| 3 | **Consertar a categoria Videokê**: expor os 4 modelos que a Galeria já mostra, destravar o "Karaokê 2025" (hoje 500/sem link), e atualizar/remover o "catálogo até 2023". Videokê está no title do site; hoje é a categoria mais quebrada. | Alto | Baixo-médio (reestruturar 1 pasta + metadata) |
| 4 | **Ficha técnica mínima por produto**: dimensões montado, peso, tomada (110/220V), cabe em elevador?, indoor/outdoor. Os dados parcialmente já existem (até em filename de foto!). É a pergunta nº 1 de quem faz festa em prédio/rooftop em SP. | Alto (mata a objeção que trava o lead urbano) | Médio (coletar dados; template já suporta bullets) |
| 5 | **"Monte seu orçamento" multi-item**: checkbox "+ adicionar ao orçamento" nos cards → flutuante mostra contagem → gera wa.me com lista de itens + campo data + bairro. Funciona em site estático (localStorage). Resolve a dor real de quem quer 2-4 itens (a maioria das festas). | Alto (qualifica o lead e diferencia de TODOS os concorrentes BR) | Médio-alto (componente client novo — é o maior investimento de dev desta lista, e o que mais paga) |
| 6 | **Uma sessão de fotos noturna no galpão**: máquinas ligadas, luz apagada, neon. 10 fotos resolvem hero, combos, Instagram e o problema de "foto de WhatsApp" do catálogo inteiro. Não é tarefa de dev. | Alto (percepção de valor sobe em TODAS as páginas) | Baixo (1 dia, 1 fotógrafo ou um bom celular + tripé) |
| 7 | **Mover/duplicar Beer Pong (e Plataforma 360°) pra contexto de festa adulta** — "Projetores & Extras" é onde itens instagramáveis vão pra morrer. | Médio | Trivial |
| 8 | **Corrigir typos de vitrine**: "Maquina Boxe"→"Máquina de Boxe", "Maquina  de Dança" (espaço duplo), "Whatsapp"→"WhatsApp". Pra público que avalia estética, typo em título de produto é ruído de confiança barato de eliminar. | Médio (confiança) | Trivial |
| 9 | **Período de locação + regras de hora extra visíveis** (festa adulta vara a madrugada — a dúvida "até que horas?" é universal e ninguém do setor responde no site). | Médio | Trivial (1 linha no Como Funciona + ficha do produto) |
| 10 | **Strip "siga o making-of no Instagram"** na Galeria/home (ou embed leve). O público 25-35 valida a empresa pelo IG antes do WhatsApp; hoje o link está só no footer. | Médio | Baixo |

## Discordâncias e caveats com as auditorias (pro debate)

1. **Prioridade invertida: infra SEO vs. conteúdo que fecha venda.** As auditorias dedicam enorme atenção a canonical/www/trailing-slash (corretas tecnicamente). Mas do lado de cá da tela, NADA disso me impede de comprar — o que me impede é não saber preço, não entender o produto e não confiar na foto. Pra uma empresa de 1 dev, eu trocaria 2 semanas de correção de canonicals por 2 dias de metadata.json bem escrito + 1 sessão de fotos. O SEO técnico importa, mas é otimizar a chegada a uma loja que não fecha a venda de quem já chegou.

2. **"Locações fabricadas" — concordo com o problema, discordo do remédio implícito.** A auditoria trata como risco CDC e sugere (implicitamente) remover. Como usuária: eu nem acreditava nos números ("110+", "160+", tudo na mesma faixa — cheira a métrica decorativa), mas eles não me ofenderam; apenas **ocupam o espaço visual da informação que eu realmente queria** (preço-âncora, dimensões, nº de jogadores). Remover sem substituir deixa o card mais pobre. O remédio é substituição: trocar "150+ locações" por atributo real e útil ("2 jogadores · 1,8m · 220V").

3. **O catálogo de página única no mobile não é o vilão.** Auditorias de IA/UX tendem a condenar a página gigante de 11.000px. Como usuária mobile grazing às 23h, rolar UMA página com tudo é confortável — melhor que pagination. O problema real é a falta de âncoras/atalhos de categoria no topo e de qualquer filtro por ocasião ("festa adulta"), não o modelo single-page em si.

4. **Acessibilidade do dropdown por teclado: real, mas não é o incêndio.** Pra ESTE negócio (compra emocional, mobile-first, conversão WhatsApp), o dropdown desktop inacessível por Tab afeta uma fração mínima do funil. Corrigir, sim (é barato e certo), mas se a lista de prioridades tem 40 itens e 1 dev, isso não entra no top 10 — e algumas auditorias o pintam como "médio" no mesmo nível de coisas que custam venda todo dia.

5. **Caveat sobre mim mesma:** sou UMA persona. O combo "festa adulta" que eu peço não pode canibalizar a clareza pro público corporativo (que já tem /empresas) nem pro infantil. A solução não é refazer o site pra mim — é me dar UM caminho (1 página de combo + 1 filtro de ocasião) sem mexer no resto.

— Camila (persona festa-adulta), 2026-06-11
