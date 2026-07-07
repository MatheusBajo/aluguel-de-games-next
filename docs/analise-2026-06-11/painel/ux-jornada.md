# Parecer — Pesquisa de UX e Jornada do Usuário
Site: alugueldegames.com.br · Lente: jornada completa (descoberta → exploração → decisão → contato)
Autor: especialista UX research do painel · Data: 2026-06-11
Insumos: screenshots desktop/mobile (home, catálogo, produto, como-funciona, empresas), pagetext, auditorias de código (home-hero, catalog-listing, product-page, nav-conversion, static-pages), pesquisas (whatsapp-cro, rental-ux, competitors-br), verificações pontuais no código (Header.tsx, HTMLs renderizados).

---

## 1. O mapa da jornada (e a tese central)

Quem é o usuário típico: (a) mãe/pai organizando festa, **mobile**, à noite, com 3–4 abas de concorrentes abertas; (b) RH/agência montando confraternização/SIPAT, desktop, horário comercial; (c) pessoa que **recebeu o link pelo WhatsApp** de alguém da família/empresa.

```
DESCOBERTA            EXPLORAÇÃO               DECISÃO                  CONTATO
Google/indicação  →   home / catálogo      →   página de produto    →   clique WhatsApp
WhatsApp preview      "o que existe?"          "serve pra MINHA          "e agora, o que
                                                festa? quanto custa?"     eu escrevo?"
```

**Tese central deste parecer:** o site investe quase tudo na fase de EXPLORAÇÃO (design acima da média, catálogo profundo, animações) e quase nada nas duas pontas que decidem o negócio:

1. **A ponta de entrada** quebra em mobile/4G: hero com `opacity:0` até o GSAP rodar, 36 MB de vídeo em autoplay e ~9 MB de cards disputando banda — o usuário rola antes de qualquer coisa pintar.
2. **A ponta de saída** termina com uma lição de casa: depois de todo o trabalho do site, o usuário cai num **chat do WhatsApp em branco** e precisa redigir do zero ("oi, queria saber sobre o fliperama... como era o nome mesmo?"). O custo de redação no pico de intenção é o maior ponto único de fricção do funil — e a correção é trivial (o helper `getWhatsAppLink()` já existe e está abandonado).

A jornada não é "site → conversão". É **"site → conversa"**. A comparação entre concorrentes deste nicho não acontece nos sites — acontece em 3–4 conversas paralelas de WhatsApp. Vence quem (a) faz a primeira mensagem se escrever sozinha, (b) responde primeiro, (c) deu ao usuário argumentos para defender a escolha no grupo da família/empresa.

---

## 2. Onde a jornada quebra, etapa por etapa

### 2.1 Descoberta — os 3 primeiros segundos não existem
- H1 e carousel nascem invisíveis (`opacity:0` + GSAP + fonts.ready). Em 4G mediano, LCP 4–6s. O usuário deste segmento decide em segundos se "o site é profissional" — e este site, **que é o mais profissional do nicho**, mostra tela preta primeiro.
- O canal de descoberta mais importante nem é o Google: é o **link compartilhado no WhatsApp**. E o preview (OG) é um logo quadrado 1000×1000 declarado como 1200×630 — um mini-outdoor desperdiçado no exato canal onde a empresa vive.
- **Insight não levantado pelas auditorias: o comitê de decisão mora num grupo de WhatsApp.** Festa de criança é decidida no grupo da família; confraternização, no grupo do trabalho. A página de produto compartilhada É a apresentação do produto ao comitê. Hoje: OG ruim, botão share que não faz nada em desktop (sem fallback de copiar link), mensagem pré-preenchida sem URL do produto. O "share loop" — usuário manda o link pro grupo, grupo aprova, alguém chama no zap — é um funil inteiro que o site ignora.

### 2.2 Exploração — taxonomia de depósito, não arquitetura de decisão
- O catálogo é organizado por **taxonomia de equipamento** (Jogos de Mesa / Jogos Eletrônicos / ...), mas o usuário pensa por **ocasião e restrição**: "festa de 10 anos num salão de condomínio", "confraternização de 40 adultos", "casamento". Não existe nenhum caminho "por evento" — e a pesquisa de concorrentes mostra que NENHUM concorrente BR tem isso (lacuna de mercado, não só correção).
- A vitrine abre errada: bug NFC/NFD faz `/catalogo` abrir com "Jogos de Mesa" (1 sinuca, 1 pebolim) em vez do carro-chefe; Sinuca e Pebolim — clássicos da locação — vivem sob o heading **"Outros"**. É o equivalente físico de esconder a vitrine principal no fundo da loja.
- Rolagem mobile do catálogo: ~6.000 px lógicos (7+ telas) sem atalho, sem âncora funcional, sem headers clicáveis. Nos screenshots, as seções inferiores (Piscinas, Projetores, VR, Videokês) aparecem como **cards escuros sem imagem** — em rolagem rápida o usuário real vê o mesmo: um catálogo que parece vazio.
- O card oferece **zero atributos de decisão** (só título + "locações" fabricadas). Com 53 produtos indistinguíveis, o usuário não consegue comparar → paralisia de escolha → ou abandona, ou chega no WhatsApp com a pergunta mais cara de atender: "o que vocês têm?".

### 2.3 Decisão — as 5 perguntas que travam o orçamento ficam sem resposta
A página de produto descreve o **objeto** ("DualSense com feedback háptico"), não o **evento**. As perguntas reais do momento de decisão:
1. **Quanto custa?** (nenhuma âncora em lugar nenhum)
2. **Cabe no meu espaço / precisa de tomada?** (sem ficha técnica)
3. **Quantas pessoas brincam / pra que idade?** (ausente)
4. **Como funciona entrega/montagem/chuva/pagamento?** (existe página boa — ver abaixo)
5. **Posso confiar?** (zero depoimentos; números "500+/100%" não batem com 33 anos)

**Achado de arquitetura de informação que nenhuma auditoria conectou:** a página `/como-funciona` é a melhor peça de redução de objeção do site (6 passos honestos, "tudo no pacote, sem surpresas") — e está **enterrada no dropdown "Sobre"** (verificado em `Header.tsx:35-43`). Ninguém procura "como funciona o aluguel" dentro de "Sobre". Pior: a página de produto — o lugar exato da hesitação — não linka para ela (as únicas ocorrências de `como-funciona` nos HTMLs de produto são o footer). O remédio existe e está fora do alcance do paciente.

- Galeria de produto inoperável por toque (controles só em `:hover`) — em um negócio onde a foto É o produto, o usuário mobile fica preso na primeira imagem ou em thumbs de 48px.
- CTA mobile 2–3 telas abaixo, sem sticky; Related Products aleatórios empurram o rodapé para longe; o modal do Top 10 é beco sem saída (só WhatsApp, sem link pra página do produto).

### 2.4 Contato — o momento de pico de intenção é o mais negligenciado
- ~90% dos CTAs abrem `wa.me` **sem `?text=`**. Fricção dupla: o usuário precisa redigir (muitos desistem ou mandam "oi" e esperam) e o atendente recebe lead sem contexto. A pesquisa CRO mostra que mensagem pré-preenchida contextual é o ganho mais barato do canal.
- **Hesitação social, não só informacional:** brasileiro conhece a dança do "pedir preço no zap" — medo de ser pressionado, constrangimento de perguntar preço e sumir. Sem âncora de preço e sem saber o que acontece após o clique ("vão me ligar? respondem quando?"), o clique tem custo emocional. Nada perto dos CTAs diz "Respondemos em ~15 min em horário comercial · orçamento sem compromisso".
- O formulário de /contato **promete abrir o WhatsApp pré-preenchido e não abre** — quebra de promessa na página de conversão; três narrativas conflitantes na mesma tela.
- Leads de festa chegam à noite e no fim de semana; não há indicação de mensagem automática de ausência/saudação no WhatsApp Business (custo zero, fora do código).

### 2.5 Fricção transversal de confiança — a empresa mais antiga do mercado parece inventada
- "500+ eventos" em 33 anos ≈ 15/ano — **subvende drasticamente** e cria incoerência subliminar com "desde 1993". Números incoerentes geram desconfiança mesmo quando o usuário não faz a conta.
- "Locações" fabricadas por hash em todos os cards + badge "1" falsa no float + "Online" às 3h de domingo + "100% Satisfação": quatro pequenas desonestidades num site cujo único trunfo imbatível (mais antigo que TODOS os concorrentes pesquisados) é **verdadeiro**.
- **Conexão competitiva que as auditorias não fizeram:** a pesquisa de concorrentes ridiculariza o Aluga Videogames por exibir contadores "0+" ("quebra de credibilidade grave")... e o screenshot full-page da home/sobre/galeria deste site captura exatamente **"0+"** (bug do Counter que reseta a 0 na hidratação e só anima no IntersectionObserver). Quem rola rápido, imprime ou recebe preview vê o mesmo defeito do pior concorrente.

---

## 3. Ideias novas (não levantadas, ou levantadas sem a moldura da jornada)

1. **Trilhas por ocasião (decision architecture, não busca).** 3 a 5 páginas estáticas curadas — "Festa infantil", "Festa teen/adulto", "Confraternização & SIPAT", "Condomínio/escola" — cada uma com 6–10 itens escolhidos a dedo, mini-FAQ da ocasião e CTA com mensagem pré-preenchida da ocasião ("Olá! Quero orçamento para festa infantil, ~30 convidados"). Resolve a paralisia de escolha, vira landing de SEO long-tail, e nenhum concorrente direto tem. Custo: páginas estáticas + curadoria do dono.
2. **Construtor de mensagem (não formulário).** Mini-fluxo de 3 toques antes do wa.me: tipo de evento → data → bairro/cidade → abre WhatsApp com mensagem montada. Não é pedágio (link direto continua existindo): é um "escrevedor da primeira mensagem" que qualifica o lead, e ainda permite registrar os dados no GA4 antes do salto pro app — fechando parcialmente o buraco de atribuição.
3. **Tratar o compartilhamento como funil de primeira classe.** Botão "Enviar pro grupo" na página de produto (Web Share API com fallback copiar-link), OG 1200×630 real por produto, e URL do produto dentro da mensagem pré-preenchida (o atendente clica e vê do que o cliente fala). O comitê de decisão está no WhatsApp — dar a ele material.
4. **Mover "Como Funciona" para o caminho da decisão.** Top-level no nav (ou rebatizar o dropdown), bloco "Como funciona o aluguel — 6 passos" resumido na página de produto (accordion) e link sob o CTA. Completar as 3 objeções que faltam na página: frete, pagamento/sinal, chuva.
5. **Microexpectativa pós-clique.** Uma linha sob cada CTA: "Resposta em ~15 min (seg–sáb, horário comercial) · orçamento sem compromisso" + saudação/ausência configuradas no WhatsApp Business. Reduz o custo emocional do clique e protege o lead noturno.
6. **Coerência numérica como projeto de copy, não de código.** Sentar com o dono, levantar números reais defensáveis (eventos/ano × 33 anos, clientes corporativos, avaliações Google) e reescrever TODOS os blocos de stats a partir de uma única fonte (site.config). O ativo "1993" é o melhor do mercado e hoje está diluído por números pequenos e fabricados.

---

## 4. Discordâncias e caveats com as auditorias

1. **"CTA do hero abaixo da dobra no desktop" está superdimensionado.** Header tem CTA verde persistente, float é onipresente — em desktop ninguém deixa de achar o botão. O gargalo não é achar o botão, é o que acontece depois do clique (chat vazio) e antes dele (medo do "quanto custa"). Refazer o layout do hero (esforço médio) antes de pré-preencher mensagens (trivial) seria inverter a ordem. Em mobile — a maioria do tráfego — a auditoria mesma admite que o CTA fica no limite da dobra.
2. **Busca e filtros no catálogo: prioridade menor do que sugerem.** Com 53 produtos, busca resolve um problema que quase ninguém tem; filtro facetado sem atributos reais nos cards devolve os mesmos cards indecidíveis. O problema é de **curadoria e ordenação** (NFC fix, campo `ordem`, fim do balde "Outros", trilhas por ocasião) — isso vem antes; busca é nice-to-have para quando o catálogo dobrar.
3. **"Publicar preços" (pesquisa rental-ux) precisa de tradução cultural.** As fontes são americanas; no nicho BR quase ninguém publica preço e o preço real varia por data/região/frete. Abrir tabela cheia: âncora para baixo nas negociações, manutenção eterna para 1 dev, e informação de graça para concorrente. A versão certa é estreita: "a partir de R$ X" em 2–3 categorias âncora + 2–3 combos com preço fechado (modelo Ritmo de Festas/Alugue Games) — testar antes de generalizar.
4. **Severidade "Alta" de SEO técnico (canonical, JSON-LD) é correta para aquisição, mas não deve consumir o orçamento da conversão.** Com 1 dev e tempo finito, consertar schema antes do handoff pro WhatsApp é polir a porta de entrada enquanto a saída está emperrada. A sequência que respeita a jornada: (1º) mensagem+tracking nos CTAs, (2º) vitrine/ordenação, (3º) objeções no produto, (4º) SEO técnico.

---

## 5. Top recomendações priorizadas (impacto × esforço honestos)

| # | Recomendação | Impacto | Esforço | Etapa da jornada |
|---|---|---|---|---|
| 1 | Mensagem pré-preenchida contextual em TODOS os CTAs (com URL do produto; variantes home/categoria/empresas) + tracking unificado | Alto | Trivial | Contato |
| 2 | Expectativa pós-clique junto aos CTAs + saudação/ausência no WhatsApp Business | Alto | Trivial (parte nem é código) | Contato |
| 3 | Consertar a vitrine: normalize NFC, ordem curada, acabar com "Outros" engolindo sinuca/pebolim | Alto | Trivial/Baixo | Exploração |
| 4 | Bloco "Como funciona" + FAQ de objeções (frete, pagamento, chuva, espaço/tomada) na página de produto; tirar a página do dropdown "Sobre" | Alto | Baixo | Decisão |
| 5 | Trocar números fabricados por coerência real ("locações" hash, 500+, 100%, badge falsa, Counter 0+) — uma passada única de verdade | Alto (confiança) | Baixo | Transversal |
| 6 | Galeria de produto operável por toque + CTA sticky mobile | Alto (mobile é maioria) | Baixo/Médio | Decisão |
| 7 | Hero pintando sem JS (CSS reveal + fetchpriority) e vídeos do Demonstra sob demanda | Alto | Baixo/Médio | Descoberta |
| 8 | Trilhas por ocasião (3–5 páginas curadas com CTA contextual) | Alto | Médio | Exploração/Decisão |
| 9 | Share-loop: OG 1200×630 por produto + share com fallback + URL na mensagem | Médio | Baixo/Médio | Descoberta (2ª onda) |
| 10 | Âncora de preço estreita: "a partir de R$ X" em 2–3 categorias + 2 combos fechados | Médio/Alto | Baixo (decisão de negócio, não de código) | Decisão |

**Regra de bolso para o dono (1 dev, orçamento curto):** tudo que toca o momento do clique no WhatsApp vem primeiro; tudo que é taxonomia/SEO técnico vem depois. A empresa mais antiga do mercado não precisa parecer maior do que é — precisa parar de parecer menor.
