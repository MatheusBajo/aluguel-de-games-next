# CRÍTICA — LENTE DO DONO

Quem fala: o dono. 33 anos nisso, desde 1993. Eu pago a conta, eu opero o WhatsApp, eu vou rodar o Google Ads sozinho. Minha régua é uma só: **isso faz meu telefone tocar mais, custa quanto, e eu consigo tocar sozinho depois que o Matheus entregar?** Site bonito que não vende é despesa. Número inventado no meu site é inaceitável: eu construí 33 anos de nome sem mentir pra cliente.

Uma verdade que NENHUMA das seis specs encarou de frente: **minhas 2 horas por semana são o recurso mais escasso do projeto.** Todo mundo me pede placeholder: faixa de preço, nota do Google, garantia redigida, dimensionamento validado, specs de 60 máquinas com fita métrica, ano e escopo de cada álbum, autorização de logo. Somando os pedidos das seis specs dá meses do MEU tempo, e só a V2B dimensionou isso de verdade (15 produtos e o resto com fallback honesto). Quem não orça a minha hora tá orçando errado.

Segunda verdade: **promessa de tempo é número.** "Resposta em horas", "orçamento em minutos", "proposta em 1 dia útil" — várias specs colam isso do lado do botão verde SEM me perguntar. Se eu tô montando evento num sábado e respondo à noite, o site mentiu. Mesma doença do contador fake, só que de relógio. Ou eu assino o SLA, ou não vai pro ar.

---

## Notas (lente do dono: opera 1 pessoa / custo / gera conversa real / número honesto / vende ou enfeita)

| Spec | Nota | Resumo em uma linha |
|---|---|---|
| **V2B — Catálogo-first** | **8,0** | Pensa como o meu cliente pensa ("festa do meu filho"), 18 dias, e foi a única que dimensionou o meu trabalho |
| **V1A — Conversão radical** | **7,0** | O motor de conversão mais afiado dos seis, mas quer mexer nas URLs todas e me cobra 60 fichas técnicas |
| **V2C — Prova + B2B** | **7,0** | A mais barata e a única com ferramenta que vende sem mim (PDF de aprovação), mas erra o centro de gravidade |
| **V1C — AI-native** | **6,0** | Estrutura de manutenção barata, mas otimiza pro robô de 2027 enquanto eu ligo o Ads em 2026 |
| **V2A — Polish & conversão** | **6,0** | Sabe exatamente ONDE mexer no código, mas cobra preço de reforma completa por um retoque |
| **V1B — Arcade premium** | **5,0** | A mais cara, e quando aperta corta o carrinho pra salvar o glow. Prioridade de artista, não de vendedor |

---

## V1A — Conversão Radical · **7,0**

É a spec que mais entendeu pra que serve o site: compositor de mensagem de WhatsApp. O lead chegar com data, bairro e itens já escritos é exatamente o que eu quero na minha tela. Mas:

**Os 3 piores problemas:**

1. **§2 "Migração de URL (uma vez, definitiva)"** — achatar os slugs do catálogo inteiro (~85 URLs) com 301 no `.htaccess`, feito por 1 dev, na mesma janela em que EU ligo campanha paga. Uma regra de rewrite errada e eu pago clique pra página 404. E ninguém me mostrou evidência de que o cliente deixou de me chamar por causa de URL aninhada. Risco de negócio real pra resolver problema de estética de engenheiro. Os slugs curtos de campanha (/fliperama, /videoke) já existem e resolvem o Ads.
2. **§3 Dobra 2: "até 11.000 jogos", "+30.000 músicas" SEM placeholder.** É exatamente a classe de número que a auditoria de junho condenou. Ninguém me perguntou quantos jogos tem o multijogos nem quantas músicas tem o videokê. Se for 3.500 e 12.000, o site tá mentindo do meu lado da banca. Inaceitável — e é a spec que mais prega honestidade. Passou batido no próprio sermão.
3. **§10 Fase 4: specs de ~60 produtos declaradas "o grosso do tempo".** Grosso do tempo DE QUEM? Meu. 60 máquinas medidas, pesadas, tomada conferida, "passa em porta de 80cm" testado — isso sou eu com fita métrica no galpão. Nas minhas 2h/semana são mais de 2 meses SÓ nisso, e o corte pra "20 produtos" aparece como item 5 do plano B, não como plano A.

**O que as outras deviam roubar:** a sticky bottom bar global no mobile (Dobra 8) — WhatsApp + Ligar fixos na base da tela, substituindo o balãozinho flutuante. Dois toques pra falar comigo de qualquer ponto do site, sem badge fake. É o balcão da loja sempre à mão.

---

## V1B — Arcade Premium · **5,0**

"Gabinete de fliperama sob luz de museu." Bonito no papel. Só que eu não vendo museu, vendo festa. E essa é a proposta mais cara das seis.

**Os 3 piores problemas:**

1. **§10: 26 dias, e a Fase 1 inteira (3 dias) é "design system Arcade Premium"** — tokens, orçamento de neon, componentes-assinatura — ANTES de qualquer motor de conversão. Pior: no plano de corte, o item 4 mata o **carrinho de orçamento inteiro (3 dias)** pra preservar scanline e marquee, que nunca entram na lista de corte. Quando o dinheiro aperta, essa spec sacrifica a feature que gera lead pra salvar a que gera elogio. Prioridade invertida de quem paga.
2. **§3.2: a trust strip vira "marquee lento em loop" no mobile.** A ÚNICA linha do site com a nota do Google e os nomes Bradesco/Spotify/Arnold/Gentili... em movimento. Prova que se mexe é prova que não se lê. Meu ativo mais valioso virou letreiro de farmácia.
3. **§7/§9: a linguagem "PRESS START ▸", scanline, glow-pulse é desenhada pra quem AMA arcade — e quem me contrata é a mãe organizando aniversário e o RH aprovando SIPAT.** A spec confunde quem JOGA (o convidado) com quem PAGA (o organizador). Eu atendo há 33 anos: quem fecha o negócio quase nunca é quem vai jogar.

**O que as outras deviam roubar:** a FAQ "E se o equipamento der problema no meio da festa?" (§9) — "a gente resolve: troca ou técnico no local, o problema é nosso, não seu". É a melhor resposta anti-objeção dos seis documentos. É literalmente o que eu falo no telefone há 30 anos. E o `--glow-scale: .5` no /empresas mostra que dá pra controlar o tom por público sem trocar de identidade.

---

## V1C — AI-Native · **6,0**

"O primeiro site do nicho desenhado para a era dos agentes." Tá, mas quem me paga boleto em 2026 é gente, não agente.

**Os 3 piores problemas:**

1. **Horizonte errado como princípio organizador.** Eu vou ligar o Google Ads AGORA. A tese central da V1C (ser citado por ChatGPT/Perplexity) paga em 6+ meses — o próprio brief admite meta de "1 citação em 6 meses" e "expectativa zero" pro llms.txt. GEO tem que vir de carona (como vem nas outras cinco), não ser o motivo da fatura. Investimento com retorno especulativo tratado como espinha dorsal.
2. **§7: "dark arcade de dados" — mono, tabular, timestamp, estética de terminal.** O site "PARECE verificável porque É verificável"... pra máquina. Pra mãe que quer festa de 7 anos, parece painel de bolsa de valores. Festa se vende com foto de criança rindo, e a §6 chega a dizer que "se não dá pra vestir de fato, é frufru e morre" — emoção não é frufru, é o produto que eu alugo.
3. **§9.2/§6: "Desde 1993 · resposta em horas" colado em CADA botão verde, sem placeholder.** Ninguém me perguntou se eu respondo em horas. SLA não assinado é número inventado com cara de compromisso. Se eu demorar 5 horas num domingo de evento, quebrei a promessa do meu próprio site em todas as páginas ao mesmo tempo.

**O que as outras deviam roubar:** a anatomia única de página (capsule → tabela de fatos → como orçar → prova → FAQ → CTA) aplicada em TODA superfície. Pra 1 dev manter e pra mim entender o site, template único é ouro: manutenção barata e nenhuma página órfã de padrão.

---

## V2A — Polish & Conversão · **6,0**

A spec mais honesta tecnicamente: cita arquivo e linha (`CatalogCard.tsx:96`, o breadcrumb quebrado, o `ssr:false` do Top 10). Sabe onde mexer. O problema é o preço da modéstia.

**Os 3 piores problemas:**

1. **§10: ~26 dias pra "mexer o mínimo".** Mesmo preço da reforma total V1B, 8 dias a MAIS que a V2B — que reconstrói home e página de produto. Se "evolução" custa igual revolução, não é economia, é falsa prudência. Ou a estimativa tá gorda ou o escopo "polish" escondeu uma reforma. Eu pago qual dos dois?
2. **§3: a home continua um armário cheio.** Carrossel + capsule + kits + fileiras + Top 10 + **Demonstra mantida "como está" (§3.6)** + seção 1993 + FAQ + CTA. Ninguém justificou o que a seção de vídeos VENDE no meio da escada de convicção — vídeo pesado no celular do cliente que veio do Ads é atrito, não prova. Polir tudo é decidir nada.
3. **§10 rodapé: "~60 produtos × 10 min com o dono, espalhado nas 2h/semana".** Fizeram a conta pela metade: 10 horas SÓ de specs = 5 semanas do meu orçamento de tempo INTEIRO, que também precisa cobrir faixa de preço, nota do Google, garantia, álbuns da galeria e o GBP. O plano consome o operador e não prioriza quais 15 máquinas medir primeiro.

**O que as outras deviam roubar:** a precisão cirúrgica de arquivo/linha na fase 0 (des-fabricação com endereço exato) e o **template de planilha** pra eu preencher specs — é a única spec que transformou "dono confirma" em ferramenta em vez de esperança.

---

## V2B — Catálogo-first · **8,0**

A única que organiza o site do jeito que o cliente me liga: "é festa de criança", "é confraternização da firma". Fileira por OCASIÃO é o meu balcão de 33 anos virado em site. 18 dias, produto padrão-ouro, e specs dimensionadas pra caber na minha vida (15 produtos top, resto com "consulte" honesto). Ganha, mas apanha:

**Os 3 piores problemas:**

1. **§2: "busca client-side simples" no /catalogo.** O consenso de junho CORTOU busca e o brief §2 manda não ressuscitar sem gatilho novo. A spec jura no §1 que "onde conflitar com o brief, o brief vence" e dois parágrafos depois ressuscita o morto sem apresentar gatilho. Se fura o contrato no doc, fura no código. Corta.
2. **§3.3: as 3 fileiras por ocasião dependem de `ocasioes[]` curado no catálogo inteiro — e ninguém disse quem taga.** Sou eu de novo: ~60 produtos classificados, produto novo precisa de tag pra existir na home, produto sem tag some da vitrine. E curadoria errada é vexame: sinuca de bar na fileira "pra festa infantil". Mais uma esteira de manutenção invisível em cima de specs + FAQ + kits + álbuns.
3. **§3.1: a matemática do hero não fecha.** Badge + H1 + sub + trust strip (com nota do Google) + CTA dual + telefone + carrossel de 40vh, tudo "≤70vh" num celular de 390px. Não cabe. Na prática ou a trust strip cai da primeira dobra (e ela é o motivo de confiarem em mim) ou o carrossel vira selo postal. Alguém tem que desenhar isso em tela real antes de prometer.

**O que as outras deviam roubar:** o escopo realista de metadata (§4.7): ficha completa nos 15 mais alugados, linha "consulte" honesta no resto, e migrar as dimensões que hoje vivem em NOME DE ARQUIVO de foto pra campo estruturado. É o único plano de conteúdo que respeita quem opera.

---

## V2C — Prova + B2B · **7,0**

A mais barata (17 dias, piso 12) e a única que me deu uma ferramenta que vende quando eu não tô na conversa: o PDF de aprovação que o RH encaminha pro financeiro. Isso é entender venda B2B. Mas:

**Os 3 piores problemas:**

1. **§3.1: mantém o H1 "Aluguel de games pra sua festa ser inesquecível".** A única das seis que gasta o H1 da home com adjetivo em vez de keyword. "Inesquecível" é exatamente o frufru que a direção proibiu — não traz busca, não traz clareza, não traz conversa. As outras cinco acertaram isso; a V2C manteve por preguiça de brigar com o design atual.
2. **Centro de gravidade no lugar errado.** A seção mais rica é a §5 (/empresas), mas o grosso das conversas do meu WhatsApp é B2C: mãe, aniversário, fim de semana. Na V2C a home e o produto herdam o design velho com retoque, /festas fica pra fase 5 e é o SEGUNDO corte do plano B (§10). Ticket B2B é maior, mas é o aniversário de sábado que paga a folha o ano inteiro. A máquina B2B devia ser o anexo, não o coração.
3. **§10: estimativa otimista demais + SLA sem assinatura.** Fase 0 em 1,5 dia (des-fabricação + sitemap + robots + footer) e carrinho em 2 dias — as MESMAS entregas custam 3-4 dias nas outras cinco specs. Quem paga o estouro sou eu. E a §9.4 promete "proposta em até 1 dia útil" sem `[PLACEHOLDER]`: prazo não confirmado comigo é número inventado, mesmo pecado do contador fake.

**O que as outras deviam roubar:** o kit de aprovação em PDF SEM cadastro (§5.4) + a tabela de dimensionamento 50/150/400 com CTA por porte (§5.3). Nenhum concorrente tem, circula dentro da empresa cliente com a minha marca, e não me custa nada depois de pronto. E a "agenda honesta" (§5.6) que diz que fora de temporada eu atendo até na mesma semana — urgência verdadeira nos dois sentidos.

---

## Veredito do dono

Nenhuma spec ganha inteira. Se eu tivesse que assinar cheque hoje: **base V2B** (é como meu cliente pensa e como meu tempo aguenta), enxertando o motor da V1A (sticky bar + prefill em tudo, SEM a migração de URL), o PDF de aprovação e o dimensionamento da V2C, a precisão de fase 0 da V2A, a FAQ anti-objeção da V1B e a anatomia única de página da V1C. E três regras minhas, inegociáveis: (1) TODO número — inclusive "11.000 jogos" e qualquer "resposta em X horas/minutos" — passa por mim antes de ir pro ar; (2) minhas 2h/semana entram no cronograma como recurso orçado, com lista priorizada do que eu confirmo primeiro; (3) fase 0 no ar antes de qualquer pixel novo, porque contador fake no meu site é o único defeito que me envergonha na frente de 33 anos de cliente.
