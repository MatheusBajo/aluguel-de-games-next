# Parecer — Lente: Conteúdo & Copy
**Auditor:** especialista em copywriting de conversão, arquitetura de conteúdo e tom de voz
**Data:** 2026-06-11
**Insumos lidos:** catalog-data.md, static-pages.md, product-page.md, competitors-br.md, whatsapp-cro.md, pagetext (home, como-funciona, sobre, empresas, prod-ps5, prod-pebolim) + metadata.json reais do repositório.

---

## 1. Diagnóstico central (o que as auditorias não disseram)

As auditorias trataram o catálogo como problema de **SEO** ("thin content, max 254 chars"). O problema é anterior: **a voz da marca morre exatamente onde o dinheiro está**. As páginas institucionais têm uma das melhores vozes do segmento ("sem letra miúda", "Bora montar o pacote ideal", "Não é plantão no local, mas estamos alcançáveis") — honesta, brasileira, com personalidade arcade. Aí o usuário clica num produto e encontra... a legenda do card repetida. As descrições foram escritas para caber num card de 254 caracteres e a página de produto renderiza o mesmo texto. Não é conteúdo raso; é **conteúdo de card no lugar de conteúdo de página**.

Segundo achado que ninguém levantou: **a nomenclatura dos produtos é jargão interno**. "Fliperama de 1.000" significa "1.000 jogos em 1" — mas a mãe organizando aniversário, o RH montando SIPAT, não sabem disso. "Fliperama de 1.000" vs "Fliperama de 5.000" vs "Fliperama 11.000" (sem o "de"!) parece código de estoque. "Tamancobol", "Air Game Quântico", "Mesa Liftime" (typo de Lifetime) — títulos que são simultaneamente o H1, o title SEO e a primeira linha da mensagem de WhatsApp. Renomear é copy de altíssima alavancagem: "Fliperama Retrô — 1.000 Jogos em 1" resolve compreensão, keyword ("fliperama retrô") e diferenciação entre os modelos de uma vez.

Terceiro: **o conteúdo que falta já existe, preso em lugares errados**. As dimensões do PS5 estão no filename `Estação Play 5 0,75 Larg (Tv32) x 0,40 Comp x 1,95 Altura.webp`. As do Pebolim em `Pebolim 0,96 altura x 1,38 largura...webp`. Os modelos de videokê em `MATRIX C TV.webp`, `VMP 2500.webp`. Manuais em `/manual/`. Isso transforma o projeto de "escrever 54 descrições do zero" em "extrair + confirmar + redigir" — muito mais viável para 1 dev + dono.

Quarto: **inconsistência numérica entre páginas mina a credibilidade da copy**. A home e /sobre dizem "98% Satisfação"; a página de produto diz "100% Satisfação"; "500+ eventos realizados" em 33 anos dá ~15 eventos/ano (o concorrente Mega Power, com 28 anos, alega 50 mil). O maior ativo da marca — ser mais antiga que TODOS os concorrentes pesquisados — está sendo diluído por números que parecem inventados e nem batem entre si.

---

## 2. Template de descrição de produto (estrutura fixa, 400–800 chars de prosa + campos estruturados)

```
[GANCHO] 1 frase — a cena na festa, não o equipamento.
[O QUE É] 2-3 frases — o que faz, traduzindo spec em benefício
          (regra: toda spec ganha tradução. "feedback háptico" →
          "controle que vibra e reage ao jogo").
[NO PACOTE] o que vai junto: entrega, montagem, teste, retirada,
          TV/acessórios, suporte.
[ESPECIFICAÇÕES] tabela via campos estruturados no metadata.json:
          dimensoes, espacoNecessario, energia, jogadores,
          idadeMinima, ambiente (coberto/descoberto), acessoNecessario
          (porta/elevador/escada — fliperama pesa!).
[IDEAL PARA] 3-4 ocasiões — vira link interno p/ as landing pages
          de ocasião (seção 5).
[DICA DE QUEM MONTA HÁ 33 ANOS] 1 frase opcional de autoridade
          ("para 15+ crianças, duas estações eliminam fila").
```

Campos novos no `metadata.json` (renderizados como tabela "Ficha técnica" na página de produto):

```json
{
  "specs": {
    "dimensoes": "0,75 × 0,40 m · 1,95 m de altura",
    "espacoNecessario": "~1 m² encostado na parede",
    "energia": "1 tomada comum (bivolt)",
    "jogadores": "2 simultâneos",
    "idadeMinima": "Livre",
    "ambiente": "Coberto"
  },
  "idealPara": ["aniversario-infantil", "confraternizacao", "sipat"],
  "faq": [{ "q": "...", "a": "..." }]
}
```

---

## 3. Dois exemplos completos reescritos

### 3.1 Fliperama de 1.000 (hoje: descrição VAZIA, 1 foto de WhatsApp)

**Título novo:** `Fliperama Retrô — 1.000 Jogos em 1`
**Title SEO:** `Aluguel de Fliperama Retrô (1.000 jogos) para Festas | Aluguel de Games SP`

> **O fliperama que era a estrela das esquinas nos anos 90 — agora na sua festa.**
>
> Gabinete arcade clássico com **1.000 jogos em 1**: Street Fighter II, Metal Slug, Pac-Man, Cadillacs and Dinosaurs e tudo que marcou época [confirmar lista com o dono]. Controles originais de fliperama — manche e botões — para **2 jogadores ao mesmo tempo**, sem ficha e sem moeda: é ligar e jogar a noite inteira. Funciona com convidado de 8 a 60 anos; é o equipamento que faz o tio e o sobrinho disputarem a mesma máquina.
>
> **No pacote:** entrega, montagem, teste no local e retirada depois da festa. Você só indica a tomada.
>
> **Ficha técnica**
> - Espaço: ~1 m² (gabinete de ~0,70 × 0,80 m, 1,75 m de altura) [confirmar medidas]
> - Energia: 1 tomada comum, bivolt [confirmar]
> - Jogadores: 2 simultâneos · Idade: livre
> - Ambiente: coberto · Acesso: passa em porta comum; consulte se houver escada
>
> **Ideal para:** aniversários, festas de 15 anos com tema retrô, confraternizações, SIPAT.
>
> **Dica de quem monta isso desde 1993:** posicione o fliperama longe da caixa de som — a fila se forma sozinha e vira ponto de encontro da festa.

*(~900 chars de prosa + ficha. Os `[confirmar]` são deliberados: o template força o dono a validar fatos em vez de a IA inventar specs.)*

### 3.2 PlayStation 5 (hoje: "DualSense com feedback háptico + 1 jogo físico + 2 digitais / Entregamos com TV 32″ ou 43″ se necessário")

A copy atual lidera com "feedback háptico" — spec que não significa nada para quem decide (pais, RH). E "se necessário" enfraquece o maior benefício (TV inclusa).

**Título:** `PlayStation 5 — Estação Completa com TV`
**Title SEO:** `Aluguel de PlayStation 5 com TV para Festas e Eventos | Aluguel de Games SP`

> **A estação de jogo mais disputada da festa.**
>
> PlayStation 5 montado em estação própria com **TV de 32″ ou 43″ inclusa**: a gente chega, instala, testa e a fila se forma. Vão junto **3 jogos à sua escolha** (1 físico + 2 digitais) — futebol, Fortnite, corrida, luta... me diz a idade da turma que a gente sugere os títulos certos. Controles DualSense que vibram e reagem ao jogo — a criançada percebe a diferença na hora.
>
> **No pacote:** console + TV + estação com pedestal + 2 controles + entrega, montagem e retirada.
>
> **Ficha técnica**
> - Espaço: ~1 m² encostado na parede (estação de 0,75 m de largura × 1,95 m de altura)
> - Energia: 1 tomada comum
> - Jogadores: 2 simultâneos por estação · Idade: livre (jogos conforme classificação)
> - Ambiente: coberto
>
> **Ideal para:** aniversários infantis e teen, espaço kids de casamento, confraternização de empresa.
>
> **Dica de quem monta isso há 33 anos:** acima de 15 crianças, vale alugar 2 estações e montar um torneio — acaba a fila e vira atração principal.

*(As dimensões vêm do filename real `Estação Play 5 0,75 Larg (Tv32) x 0,40 Comp x 1,95 Altura.webp` — dado que já existia, invisível.)*

---

## 4. Estrutura de FAQ

### 4.1 FAQ geral — em /como-funciona (e reaproveitada em /contato)

Bloco de 10 perguntas, cada resposta de 2-4 frases na voz da marca, com `FAQPage` JSON-LD (ver caveat na seção 7):

1. **Quanto custa alugar?** (resposta honesta: depende de equipamento, data, região e duração; orçamento em até X min no horário comercial; sem compromisso)
2. **O frete está incluso?** (a dúvida nº 1 do mercado — responder mesmo que a resposta seja "depende da região")
3. **Por quanto tempo fico com o equipamento?** (diária? período da festa? pernoite?)
4. **Como e quando eu pago?** (PIX, cartão, boleto p/ empresas — hoje só /empresas menciona)
5. **Com quanta antecedência preciso reservar?** (já existe no passo 03 — consolidar)
6. **E se chover / eu precisar remarcar?** (política de chuva é argumento-chave do benchmark Baby Eventos)
7. **Preciso de tomada especial? Quanto espaço?** (110/220V, m² por tipo de equipamento)
8. **O equipamento sobe escada / passa na porta?** (objeção real de apartamento/salão)
9. **Vocês ficam no evento?** (monitor incluso vs suporte por telefone — o site já responde com honestidade rara; virar FAQ)
10. **Atendem meu bairro/cidade?** (lista + fallback "manda mensagem")

### 4.2 FAQ por categoria — 3-5 perguntas no rodapé de cada página de categoria

- **Fliperamas:** Quantos jogos têm? Precisa de ficha? Quanto pesa / sobe escada? Criança alcança?
- **Videokê:** Quantas músicas? Tem pontuação? Quantos microfones? Tem as músicas mais novas/sertanejo?
- **Realidade Virtual:** A partir de que idade? Enjoa? Precisa de quanto espaço? Vem monitor para orientar?
- **Infláveis/Infantil:** E se chover? Quanto tempo de montagem? Precisa de monitor? Qual a idade máxima?
- **Consoles:** Quais jogos vêm? Posso escolher? Vem TV? Quantos jogam ao mesmo tempo?

As perguntas de categoria são exatamente as long-tails que os concorrentes diretos não respondem (só Baby Eventos e Freitas têm FAQ — e nenhum dos diretos de games).

### 4.3 Micro-FAQ por produto (opcional, fase 2)

Campo `faq` no metadata.json, 2-3 perguntas só quando o produto tem objeção específica (VR → enjoo; Máquina de Boxe → força/segurança; inflável → chuva).

---

## 5. Páginas de conteúdo que faltam (em ordem de valor)

1. **"Quanto custa? Entenda o orçamento" (/orcamento ou seção em /como-funciona).** A intenção de busca nº 1 do nicho ("quanto custa alugar fliperama") não tem NENHUMA resposta no site — nem nos concorrentes (só Alugue Games R$ 890 e Karaoke SP "a partir de R$ 200"). Página que explica **o que compõe o preço** (equipamento, distância, data, duração), o que está sempre incluso (montagem, suporte) e — se o dono topar — faixas honestas por categoria ("mesas de jogos a partir de R$ X; fliperamas a partir de R$ Y"). Mesmo SEM publicar números, a página que explica o orçamento rankeia para a query e qualifica o lead. Com números, vira diferenciação de SERP/CTR contra um mercado inteiro de "sob consulta".

2. **Landing pages por ocasião (5, não 50):** `/festas/aniversario-infantil`, `/festas/15-anos`, `/festas/casamento` (espaço kids + lounge), `/empresas/confraternizacao-fim-de-ano`, `/empresas/sipat`. Cada uma = 1 kit nomeado com 3-5 equipamentos do catálogo + copy de cena ("o que não pode faltar") + mini-FAQ + CTA WhatsApp pré-preenchido com a ocasião. Isso replica a estratégia de KITS dos concorrentes (Alugue Games, Fun Play) **sem precisar publicar preço**, e cria o destino dos links "Ideal para" das descrições de produto — malha interna que hoje não existe.

3. **Guias evergreen (2-3, máximo):** "Como organizar uma festa gamer em casa — checklist de quem monta há 33 anos" e "Fliperama, pinball ou console: qual alugar para o seu evento?". E-E-A-T legítimo: 33 anos de experiência REAL é o que o Google quer ver assinado. **Não** recomendo "blog" com cadência — 1 dev, sem fôlego editorial; 3 guias perenes bem linkados valem mais que 30 posts.

4. **Separar os modelos de videokê** (Pop 300, Matrix, VMP 2500 — hoje 42 fotos misturadas num produto "Karaoke") em produtos individuais com copy própria. O nicho de videokê premia especialização técnica (Freitas vence nomeando o equipamento Raf como argumento); "aluguel videokê matrix são paulo" é long-tail sem dono.

5. **Página /sobre com fotos reais + 1 parágrafo "por que 'de 1.000'?"** — micro-conteúdo de nostalgia explicando o jargão dos fliperamas vira charme de marca em vez de barreira.

---

## 6. Guia de tom de voz (codificar o que já é bom)

A voz existe e é o maior diferencial de copy do site. Falta **escrever a regra** para ela sobreviver ao crescimento do catálogo (e à tentação de gerar descrição por IA sem direção). Uma página:

- **Somos:** diretos, brasileiros, "sem letra miúda". 2ª pessoa ("você"), contrações ("pra", "pro" — já usadas), humor arcade leve.
- **Regra de ouro:** toda spec ganha tradução de benefício. "1.000 jogos em 1" → "a noite inteira sem repetir jogo". "Feedback háptico" → "controle que vibra e reage".
- **Proibido:** corporativês ("soluções em entretenimento", "proporcionar momentos únicos" — essa frase está na home HOJE e é a linha mais fraca do site), promessas não verificáveis ("100% satisfação"), jargão sem explicação ("de 1.000").
- **Números:** só os que defendemos com fonte. "33 anos" é matável por aritmética (1993) — usar sempre. "500+ eventos"/"98%"/"100%" — unificar numa constante única e auditável ou trocar por claims qualitativos ("clientes que voltam geração após geração" — já existe e é melhor).
- **Glossário interno → cliente:** "de 1.000/5.000/11.000" → "1.000/5.000/11.000 jogos em 1"; "brinquedo" (mensagem default do WhatsApp!) → "equipamento/atração"; "Jogos Eletrônicos" (categoria-raiz que aparece no breadcrumb e nos cards) ≠ "Fliperamas/Consoles" (nav) — alinhar vocabulário de navegação e taxonomia.

---

## 7. Conexões e achados novos (resumo)

| # | Achado novo desta lente | Por que importa |
|---|---|---|
| 1 | Nomenclatura de produto é jargão interno (Fliperama "de 1.000", Tamancobol, Mesa Liftime) | Título = H1 = title SEO = 1ª linha do WhatsApp. Renomear é a menor edição com maior alcance |
| 2 | Specs já existem presas em filenames/manuais — projeto é extração, não criação | Reduz o esforço estimado das auditorias; um script gera rascunho de `specs` p/ o dono confirmar |
| 3 | "98%" (home/sobre) vs "100%" (produto) de satisfação — contradição entre páginas | Pior que stat sem fonte é stat que não bate consigo mesma |
| 4 | Descrição atual = legenda de card renderizada como página | Alongar sem reestruturar (gancho→pacote→ficha→ocasião) só produz thin content mais comprido |
| 5 | "Ideal para" nas descrições + landing pages de ocasião = malha interna que não existe hoje | Conteúdo de produto e de ocasião se retroalimentam (SEO + funil) |
| 6 | "Top 10 que viraram tradição" (copy boa) sustentada por locações geradas por hash (prova falsa) | Trocar número fake por curadoria editorial assumida: "os 10 que a gente mais monta" + 1 frase de bastidor por item — defensável e mais persuasivo |

---

## 8. Priorização honesta (impacto × esforço, pensando em 1 dev + dono)

| Prioridade | Ação | Impacto | Esforço |
|---|---|---|---|
| 1 | Reescrever descrições com template (começar pelos 6 fliperamas vazios — categoria carro-chefe) | Alto | Médio (2-3 dias dono+IA com template; dev: render da ficha) |
| 2 | Campos `specs` no metadata + harvest de filenames/manuais | Alto | Baixo-médio |
| 3 | FAQ geral em /como-funciona (10 perguntas) | Alto | Baixo (1 dia de escrita, meio dia dev) |
| 4 | Página "Quanto custa / como funciona o orçamento" | Alto | Médio (decisão de negócio sobre faixas) |
| 5 | Renomear produtos-jargão + glossário de voz (1 página) | Médio-alto | Trivial-baixo |
| 6 | 5 landing pages de ocasião com kits nomeados | Alto | Médio-alto (1-2 dias cada) |
| 7 | Separar videokês em modelos | Médio | Médio |
| 8 | Unificar números da marca (constante única, claims defensáveis) | Médio | Trivial |
| 9 | FAQ por categoria | Médio | Baixo |
| 10 | 2-3 guias evergreen | Médio (longo prazo) | Médio |

---

## 9. Discordâncias e caveats (para o debate)

1. **"FAQPage schema captura rich results" (static-pages.md §3.2, catalog-data.md §5.3) — exagero.** Desde 2023 o Google restringiu FAQ rich results a sites governamentais e de saúde de alta autoridade; um site comercial de aluguel quase certamente NÃO ganhará as perguntinhas expandidas na SERP. O FAQ vale MUITO — por conversão (mata objeção na página) e por long-tail no corpo do texto — mas vender o schema como "maior ROI de conteúdo" promete um resultado visual que não virá. Implementar o schema custa nada, então façam — mas o business case é conversão, não estrelinha.

2. **"Publicar 'a partir de R$ X' por categoria seria diferenciação imediata" (competitors-br.md, síntese #1) — meio certo, meio armadilha.** Âncora de preço público em negócio de orçamento personalizado cria atrito novo: o cliente chega no WhatsApp ancorado no piso ("mas no site dizia R$ X") e todo orçamento acima vira decepção. Funciona para Alugue Games porque eles vendem KITS padronizados com escopo fixo. Para um catálogo de 54 itens com frete variável, a versão segura é a **página que explica o orçamento** (variáveis + o que está incluso) e, só se o dono conseguir honrar pisos, faixas por categoria. É decisão de operação comercial, não quick win de copy.

3. **As auditorias enquadram o catálogo raso como problema de SEO ("thin content") — o enquadramento subestima o problema.** Mesmo se o Google não existisse, 33 das 54 páginas de produto não dão ao visitante UMA razão para clicar "Fazer Orçamento" (sem dimensão, sem o que está incluso, sem jogos, sem ocasião). Alongar texto para "resolver thin content" sem estrutura de venda produziria thin content mais comprido. A métrica de sucesso certa é taxa de clique no CTA por página de produto (o `whatsapp_click` por produto já existe no GTM), não contagem de caracteres.

4. **"Vídeo curto por produto" (catalog-data.md §5.4, product-page.md §4.12) — despriorizar.** Para 1 dev: curar/recomprimir 465 MB de MP4s, lidar com poster/lazy-load (a auditoria de /empresas mostra o estrago de vídeo mal embedado: 17 MB em autoplay) e manter isso em 54 produtos é projeto grande com retorno incerto. Foto com overlay de dimensões + ficha técnica + copy boa entrega 80% do valor por 20% do custo. Vídeo: só nos 5 produtos-herói, depois que o texto estiver no lugar.

