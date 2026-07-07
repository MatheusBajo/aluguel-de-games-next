# Crítica — persona "mãe cansada, 22h, celular"

Papel: mãe de 38 anos organizando festa infantil às 22h pelo celular, com 3 concorrentes abertos em abas. Lente: **acho preço ou faixa? entendo o que cabe no meu salão/apartamento? consigo orçar em 2 toques? o texto me respeita ou me enrola? algo me faz desconfiar?**

Data: 2026-07-07 · Insumos: BRIEF-REDESIGN.md + SPEC-V1A/V1B/V1C/V2A/V2B/V2C

---

## Resumo das notas

| Spec | Nota (lente mãe) | Numa frase |
|---|---|---|
| V1A — Conversão Radical | **7,5** | A única que põe "quanto custa" na 3ª dobra da home e me dá barra fixa de WhatsApp+Ligar o site inteiro |
| V2B — Catálogo-First | **7,0** | A única que pensa como eu ("pra festa infantil" como fileira), mas a home NUNCA fala de preço |
| V1C — AI-Native | **6,0** | Respostas diretas, mas desenhado pro robô: tabela como protagonista e "resposta em horas" quando a aba do lado promete minutos |
| V2A — Polish & Conversão | **6,0** | Correto e seguro, mas o preço na home vive dobrado num acordeão no fim, atrás de vídeos e carrossel |
| V2C — Prova + B2B | **5,0** | H1 vago ("inesquecível"), FAQ da home sem pergunta de preço, e corta MEU carrinho antes de cortar o PDF corporativo |
| V1B — Arcade Premium | **5,0** | O mais bonito e o que menos me serve: preço na 9ª de 11 dobras, letreiro que anda, botão "PRESS START" pra quem quer alugar garra pro filho de 7 anos |

---

## Achados transversais (valem pras 6 — e ninguém resolveu)

1. **São 22h e TODAS as specs fingem que é 14h.** Toda conversão é "chama no WhatsApp e recebe em minutos/horas". Eu vou mandar mensagem agora e ficar olhando o "visto" até dormir. NENHUMA spec desenha o estado fora do horário comercial: uma linha honesta perto do CTA ("agora é fora do horário: te respondemos amanhã a partir das 9h") custaria zero e me faria mandar a mensagem em paz em vez de desistir. V1B/V2C chegam perto com "resposta em horário comercial", mas isso é letra de rodapé, não expectativa desenhada.
2. **Toda a história de preço está pendurada em `[PLACEHOLDER: dono confirma]`.** Se o dono não assinar as faixas (e a spec inteira trata isso como provável), TODAS as seis lançam /quanto-custa dizendo "depende de 3 fatores, chama no Whats". Isso é melhor que os concorrentes que escondem tudo, mas do meu sofá é a MESMA resposta: "não te conto". A versão B de cada spec precisa ao menos ancorar magnitude ("festas em apartamento normalmente ficam entre X e Y" ou "o item mais barato do catálogo sai por menos que um bolo decorado") — nenhuma spec exige isso da versão sem faixa.
3. **"Festa infantil" é o público que paga o Google Ads e é a PRIMEIRA coisa cortada.** V1A, V2A e V2C cortam /festas no primeiro ou segundo aperto; V1B corta o carrinho multi-item. Só a V2B me trata como fileira nº1 da home. Se a campanha é "aluguel de brinquedos festa infantil", cortar /festas manda meu clique pago pra uma home genérica.
4. O que todas acertam (registro honesto): specs com "passa na porta de 80cm? / elevador?" é EXATAMENTE a minha pergunta de apartamento e nenhum site que abri hoje responde isso; prefill com lacunas Data/Bairro me poupa digitação; e nenhuma tem contador fake ou "fulana comprou há 5 min", o que já me deixa menos desconfiada que as abas do lado.

---

## V1A — Conversão Radical · Nota 7,5

É a proposta que mais respeita minha pressa: preço é a 3ª dobra da home, o widget "monte seu orçamento" são chips + data + enviar, e a barra fixa embaixo (WhatsApp + Ligar) existe em TODA página, não só no produto. Do meu polegar, é a melhor.

**3 piores problemas:**
1. **§3 Dobra 4 — "Monte seu orçamento em 30 segundos" promete o que não entrega.** Eu leio "orçamento em 30 segundos" e espero um NÚMERO em 30 segundos. O que sai é uma mensagem de WhatsApp que alguém responde amanhã. Às 22h isso é quase pegadinha: preenchi data, bairro, convidados... e ganhei uma conversa pendente. Renomear pro que é ("mande seu pedido em 30 segundos") ou a decepção vira desconfiança — e desconfiança às 22h é fechar a aba.
2. **§10 corte 1 — /festas é a primeira página cortada.** A spec inteira é "sistema de LPs", 1 ad group : 1 página... e a LP do MEU caso (festa infantil/aniversário) é a primeira a morrer "porque home + categorias seguram". Não seguram: a dobra 2 da home me oferece "Fliperamas · até 11.000 jogos" — fato de catálogo, não resposta pra "o que alugo pra festa de criança de 7 anos?". O caminho B2C por ocasião não existe no piso irredutível.
3. **§3 — 8 dobras é uma home de scroll longo pra quem chega exausta.** A escada é boa, mas entre mim e o FAQ (dobra 7, onde moram chuva/cancelamento — minhas objeções reais) existem ~6 telas. A própria spec admite que tudo pode ser porta de entrada; então as objeções de mãe (e se chover? e se quebrar?) precisavam de um eco lá em cima, não só na dobra 7.

**Pra roubar:** a **sticky bottom bar global mobile (§3, dobra 8)** — WhatsApp com prefill da página atual + Ligar, sempre sob o polegar, substituindo o float. É o "orçar em 2 toques" de verdade, em qualquer ponto do site. Todas as outras specs só têm sticky na página de produto.

---

## V1B — Arcade Premium · Nota 5,0

Bonita pra quem gosta de fliperama. Eu não estou comprando estética de arcade, estou alugando diversão pra festa do meu filho e quero preço, medida e botão. A V1B gasta os melhores tijolos na parede errada.

**3 piores problemas:**
1. **§3 — preço na dobra 3.9, a NONA de onze.** Hero, strip, capsule, kits, SETE fileiras de catálogo, Top 10, como funciona, prova... e só então "Quanto custa alugar?". No meu celular isso é um minuto de scroll com o polegar antes da pergunta nº1. A ordem do brief era "o que tem → quanto custa/como orçar → ..."; a V1B empurra o custo pra depois da vitrine INTEIRA. É o site me enrolando com beleza.
2. **§3.2 — trust strip vira marquee em loop no mobile.** Texto que anda é texto que eu não leio e link ("★ 4,x no Google") que eu não consigo tocar — vou tentar tocar e ele foge. Às 22h, com olho cansado, letreiro andante é ruído, e ruído em cima da ÚNICA prova tocável (a nota do Google) é sabotagem da própria prova.
3. **§7/§9 — a linguagem "PRESS START ▸", mono uppercase tracking 0.25em, glow-pulse no CTA.** O botão mais importante do site vestido de HUD de videogame. Eu não sou o gamer nostálgico; sou a cliente que quer um botão verde gordo escrito "Pedir orçamento no WhatsApp". Estética de marca acima da clareza de ação é exatamente o tipo de escolha que me faz achar que a empresa é "pra entendidos" — e abrir a aba do concorrente com botão normal. Agravante: §10 corte 4 mata o carrinho multi-item inteiro (3 dias) pra proteger o design system (fase 1, 3 dias). Prioridade invertida: cortaram a MINHA ferramenta pra manter o scanline.

**Pra roubar:** a **FAQ "E se o equipamento der problema no meio da festa?" (§9)** — "A gente resolve: troca o equipamento ou manda técnico no local, sem custo. Se algo falhar, o problema é nosso, não seu." É a melhor frase das 6 specs: mata a minha maior ansiedade (festa infantil com 20 crianças e a máquina morta) em duas linhas, sem juridiquês.

---

## V1C — AI-Native · Nota 6,0

Honesta, direta, cheia de resposta — mas o cliente-modelo dela é o ChatGPT, e eu sinto isso. Quando a spec diz que a categoria vira "tabela comparativa... que IA adora extrair" (§4), ela confessa pra quem desenhou.

**3 piores problemas:**
1. **§4 (categoria) — "Netflix vira planilha".** A LP de categoria põe tabela comparativa (jogadores × espaço × tomada) como bloco central. Planilha me ajuda DEPOIS que a foto me convenceu; eu escolho brinquedo de festa com o olho ("meu filho vai amar isso") e confirmo com a medida. Tabela antes de foto grande é inverter minha decisão pra agradar o crawler. O dado extraível podia viver na ficha do produto (onde está ótimo) sem virar protagonista da vitrine.
2. **§9.1/9.2 — "recebe o orçamento em horas" / "resposta em horas" colado no botão.** Elogio a honestidade, mas às 22h com 3 abas abertas, "em horas" perde por W.O. pra aba que diz "em minutos" (a V2C diz "sai em minutos", a V1A diz "na hora"). E como as três specs são da MESMA empresa, alguém está errado: ou o dono responde em minutos ou em horas — a promessa junto do CTA precisa ser uma só, real, e desenhada pro fora-de-horário também. Do jeito que está, a V1C é a única que me dá motivo explícito pra não mandar mensagem agora.
3. **§7 — a "linguagem visual da honestidade" é mono/terminal pra TUDO que é fato: specs, trust strip, telefone, preço.** Telefone e preço em fonte de código, num site já escuro, às 22h... parece painel de máquina, não loja. A tese "o site PARECE verificável" funciona pra quem audita; pra mim, JetBrains Mono em cima de tudo é frieza — e festa infantil se vende com calor. O fato precisa ser verificável no conteúdo, não fantasiado de dado no visual.

**Pra roubar:** os **chips "Vai bem em" na página de produto (§4.7)** — o produto linkando "festa infantil", "aniversário adulto", /festas, /empresas. É o único mecanismo das 6 specs em que o PRODUTO me diz se serve pro MEU evento (em vez de eu ter que deduzir da ficha técnica). Barato de fazer e resolve a pergunta "isso é pra criança de 7 anos?" que nenhuma ficha responde.

---

## V2A — Polish & Conversão · Nota 6,0

A mais segura e a mais "empresa": afia o que existe, não quebra nada. Mas ser evolução do site atual significa herdar os vícios dele — e o principal, pra mim, é a home tratar preço como assunto de rodapé.

**3 piores problemas:**
1. **§3.8 — no fluxo da home, preço SÓ aparece dentro de um `<details>` fechado, na 8ª seção.** "Quanto custa alugar um fliperama?" existe... dobrada, num acordeão, depois de kits, fileiras, Top 10, VÍDEOS e a seção editorial de 1993. A V1A pôs a mesma resposta na dobra 3, aberta. Aqui eu preciso (a) chegar ao fim, (b) saber que a resposta está escondida num acordeão, (c) tocar pra abrir. São três barreiras pra pergunta nº1 da persona nº1.
2. **§3.1 + §3.6 — mantém carrossel de 10 slides no hero E a seção Demonstra de vídeos "como está".** Isso é peso e ruído herdados por inércia, não por decisão: 10 slides que giram sozinhos são pro dono se orgulhar, não pra eu decidir; vídeos no meio do caminho às 22h no 4G são um pedágio entre mim e o FAQ. A spec poda o fake com coragem e poupa o gordo com carinho.
3. **§3.4 — "+ Adicionar ao orçamento" como "ícone +, discreto, canto inferior direito" do card.** A feature multi-item mais valiosa pra mim (fliperama + garra + air game numa mensagem só) escondida num alvo de toque minúsculo e ambíguo (+ = favoritar? expandir? zoom?). Discrição aqui é morte por educação: se eu não descubro, não existe. Compare com a V2B, que põe "+ Orçamento" com texto no botão duplo do card.

**Pra roubar:** a **copy de preço do §9 (FAQ destaque)** — "Depende de três coisas: data (fim de semana e dezembro lotam), bairro (a entrega é nossa) e quantos itens você aluga junto (combos saem melhor)." É a única das 6 que me ensina a ECONOMIZAR ("combos saem melhor") em vez de só justificar por que não me conta o preço. Texto que me dá vantagem = texto que me respeita.

---

## V2B — Catálogo-First · Nota 7,0

A única spec que pensa com a MINHA cabeça: fileira "Pra festa infantil" no topo da home, hero curto, produto padrão-ouro com "passa em porta de 80cm?" e sticky bar com botão duplo de verdade. Se eu pousasse nela às 22h, acharia o brinquedo certo mais rápido que em qualquer outra. E aí ela me esconde a única coisa que faltava: o preço.

**3 piores problemas:**
1. **§3 — a home NUNCA fala de preço. Nunca.** Ordem: hero → capsule → vitrine por ocasião → kits → Top 10 → como funciona → prova → FAQ → CTA. Nenhuma dobra "quanto custa", e a FAQ da home (§3.8) pergunta sobre chuva, diária, montagem e bairro — mas NÃO pergunta preço. A pergunta nº1 do mercado (que a própria spec chama de "gap nº1, 7/9 escondem") não existe na página mais visitada do site. /quanto-custa virou quarto de despejo: existe, mas a home não me leva até lá. Pra minha lente, isso é o mesmo pecado dos concorrentes com marketing melhor.
2. **§4.5 — "card 'Orçamento em 1 mensagem'... desenhado como feature, não como ausência".** Tradução: onde deveria estar o preço, tem um card bonito explicando por que não tem preço. Eu reconheço embalagem de ausência em 2 segundos — toda mãe reconhece ("já vou te falar o valor" do vendedor). Vestir o buraco de feature é mais elegante que o "R$ 0" do concorrente, mas é a MESMA enrolação com design melhor. Se não tem faixa, a linha honesta ("o valor fechado depende de data e bairro — me manda os dois que respondo") já basta; não celebre o vazio.
3. **§2 — ressuscita a busca que o consenso de junho matou, e §4.7 entrega "linhas 'consulte' honestas" nos produtos sem spec.** Dois sinais de desconfiança pra quem audita: (a) o brief diz "não ressuscitar sem gatilho novo: ...busca" e a V2B a devolve no /catalogo sem justificar o gatilho — se a spec fura o próprio contrato no §2, o que mais fura na implementação? (b) A spec abre zombando dos concorrentes "foto + nome + 'consulte'" (§1) e fecha shipando "consulte" na maioria do catálogo (~15 fichas completas de ~60). Eu, cliente, caio num produto sem ficha e vejo... o mesmo "consulte" de todo mundo.

**Pra roubar:** a **vitrine por OCASIÃO (§3.3)** — fileiras "Pra festa infantil / Pra festa adulta / Pra evento de empresa" em vez de taxonomia técnica ("jogos eletrônicos nível 2"). É a única tradução real do catálogo pra linguagem de quem compra: eu não procuro "fliperama", eu procuro "festa do meu filho". Toda spec deveria adotar isso na home, com a V2B ou sem ela.

---

## V2C — Prova + B2B · Nota 5,0

Uma spec inteira apaixonada pelo comprador que NÃO sou eu. O RH que precisa convencer o financeiro ganha PDF, tabela de dimensionamento e agenda honesta; a mãe que precisa saber se cabe no salão e quanto custa ganha um H1 de perfume e uma FAQ sem preço.

**3 piores problemas:**
1. **§3.1 — mantém o H1 "Aluguel de games pra sua festa ser inesquecível".** "Inesquecível" é exatamente o adjetivo inflado que o brief manda matar (gate 1.7: zero frufru) e que não me diz NADA: nem o que tem, nem onde, nem quanto. Compare com o H1 da V1A ("A gente entrega, monta e busca") — informação. A única spec que preservou o frufru do site atual é a que se vende como "prova, não adjetivo". Contradição na primeira linha da home.
2. **§3.8 — FAQ da home sem pergunta de preço + nenhuma dobra de custo na home.** Mesmo buraco da V2B: chuva, incluso, diária, bairro... e a pergunta nº1 não está. /quanto-custa nasce (§2), mas a home não constrói caminho até ela. Pra uma spec cuja tese é "consistência gera confiança", esconder o assunto que TODA cliente quer é a inconsistência mais visível.
3. **§10 — o plano de corte sacrifica o B2C pra proteger o B2B.** Ordem de corte: /regiao, /festas (a MINHA página, de novo), carrinho de orçamento (a MINHA ferramenta multi-item, 2 dias)... e o kit PDF corporativo só cai em 4º, valendo 0,5 dia. Ou seja: no aperto, a mãe perde a página dela E o carrinho dela antes de o RH perder o PDF dele. Sendo que quem clica em Google Ads de festa infantil às 22h sou eu, não o RH — o RH manda e-mail às 10h de terça.

**Pra roubar:** a **garantia anti-risco DENTRO da página de produto, colada no bloco de decisão (§4.7)** — "Deu defeito? Trocamos o equipamento ou mandamos técnico, sem custo" como item fixo do "o que está incluso", não como FAQ que preciso procurar. A V1B tem a melhor REDAÇÃO da garantia; a V2C tem a melhor POSIÇÃO: no exato pixel onde eu decido. E a regra §6.4 ("todo placeholder tem fallback desenhado — a trust strip sem nota do Google só omite o item, sem buraco") é a maturidade de design que faltou nas outras cinco.

---

## Veredito da persona

Se eu pousasse nesses seis sites hoje às 22h: fecharia negócio mais rápido no **V1A** (preço na 3ª dobra + barra fixa), acharia o brinquedo certo mais rápido no **V2B** (fileira "pra festa infantil"). O site ideal pra mim é a estrutura de conversão da V1A com a vitrine por ocasião da V2B, o FAQ de garantia da V1B, os chips "vai bem em" da V1C, a copy de preço que ensina a economizar da V2A e a garantia-no-produto da V2C. Os dois buracos que NENHUMA resolveu: o estado fora-do-horário-comercial do WhatsApp (o site inteiro converte pra uma conversa que às 22h não vai acontecer) e um plano B de preço com magnitude real caso o dono nunca assine as faixas — hoje, sem `[PLACEHOLDER]` preenchido, as seis viram "chama no Whats" com roupa diferente.
