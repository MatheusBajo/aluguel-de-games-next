# Crítico — Advogado do usuário final
*Releitura dos 4 relatos de persona (Fernanda/mãe, Ricardo/RH, Camila/festa adulta, Seu Antônio/bodas) contra as recomendações dos 12 especialistas. Verificações de código: `getWhatsAppLink()` existe e só é usado em ProductInfo.tsx; ContactForm.tsx exige e-mail (linha 113) e deixa telefone opcional (linha 129); `tel:` só aparece em /contato e Footer.*

## Tese

As quatro personas — que não se conhecem, têm 29 a 64 anos e orçamentos de R$1.500 a evento de 400 pessoas — travaram **nos mesmos quatro lugares**: (1) zero noção de preço com medo de "passar vergonha perguntando"; (2) nenhuma ficha técnica (cabe? tomada? idade? quantos jogam?); (3) chat de WhatsApp vazio no pico de intenção; (4) perguntas práticas sem resposta (chuva, sinal, duração, montagem, repertório). **Nenhuma das quatro foi travada por canonical, sitemap, JSON-LD, bundle de animação ou navegação por teclado.** Três das quatro discordam explicitamente da priorização técnica das auditorias — e elas pagam a conta.

O painel acerta muito (mensagem pré-preenchida, specs, FAQ, ocasiões aparecem em quase todas as lentes). Mas comete três pecados contra o usuário:

**Pecado 1 — Tradução errada do "porquê".** A mensagem pré-preenchida é vendida pelos especialistas como "qualificação de lead de graça" (visão do atendente). Para Fernanda às 22h é **roteiro do que informar**; para Seu Antônio é a diferença entre enviar e travar ("conversa vazia é que nem entrar numa loja e o vendedor ficar te olhando calado"). A implementação muda: lacunas a completar (`Data: ___ / Bairro: ___ / Convidados: ___`) servem ao cliente; um texto pronto de marketing serve só ao funil. Idem des-fabricação: o crítico de confiança trata como risco CDC/bomba reputacional; as duas personas que NOTARAM o fake (Fernanda e Antônio) se incomodaram com **badge '1' e 'Online' perpétuo** — os que imitam o celular delas — e nem perceberam o hash das "locações". Camila e Fernanda pedem **substituição** ("2 jogadores · 1,8m · 220V" no pixel do numerinho), não deleção que empobrece o card.

**Pecado 2 — O segmento invisível.** As páginas por ocasião dos especialistas listam festa infantil, 15 anos, casamento, confraternização, SIPAT. **Nenhuma lista inclui "festas de família" (bodas, 60/70/80 anos, salão de igreja)** — o segmento do Seu Antônio, o decisor que PAGA e que a empresa de 1993 tem mais autoridade para atender. Mesmo apagão no produto: os especialistas querem separar modelos de videokê por long-tail SEO ("aluguel videokê matrix"), e ninguém propôs responder a única pergunta da festa de bodas: **tem Roberto Carlos, MPB, anos 60-80?** A contradição 30.000 vs 12.000 músicas e o "atualizado até 2023" (em 2026!) afetaram DUAS personas e aparecem como nota de rodapé.

**Pecado 3 — Rejeições e omissões por playbook.** O CRO rejeita o orçamento multi-item como "exagero importado dos EUA" citando "pedido típico de 1-3 itens" — mas 2 das 4 personas precisam de 2-4 itens (Camila: fliperama+videokê+boxe+beer pong; Fernanda: rodízio para 25 crianças), e a versão leve (checkbox → wa.me com lista) não é o carrinho americano de 500 SKUs. Aceito a sequência (mensagem com lacunas primeiro, medir), não o "adiar indefinidamente". E há pedidos diretos de persona que NENHUM especialista propôs (lista abaixo).

## O que as personas pediram e nenhum especialista propôs

1. **Inverter o formulário: telefone obrigatório, e-mail opcional** (Antônio; confirmado no código — hoje é o contrário). Custo: 2 atributos HTML.
2. **Rastrear cliques em `tel:` e tratar ligação como conversão** (Antônio: "para decisor 50+ a ligação É conversão"). Todo o plano de medição do CRO é WhatsApp-cêntrico.
3. **"Kit aprovação interna": PDF baixável de 2-4 páginas na /empresas** (Ricardo: "vou ter que printar o site para montar meu slide"). A feature B2B mais barata que transforma o RH em vendedor interno. Zero menção em 12 lentes.
4. **"Operação assistida" como add-on explícito** (Ricardo) — resolve a contradição /empresas ("equipe acompanha") vs /como-funciona ("não é plantão") virando upsell; o crítico de confiança só manda apagar a divergência.
5. **Guia de dimensionamento** — "para X convidados, Y atrações" (Fernanda) / tabela por porte 50/150/400/1000 (Ricardo). Aparece em dois pareceres de persona e em nenhum top de especialista.
6. **Aceno de uma linha à festa pequena na home** (Fernanda: "será que sou cliente pequena demais?" — a home abre com 'Grandes empresas · Personalidades públicas'). Especialistas redesenham hero, ninguém escreve a frase "do salão do seu prédio ao evento da TV".
7. **Repertório por década no videokê + seção "Festas de família"** (Antônio).
8. **Aviso honesto de agenda sazonal** ("nov/dez fecha com N semanas") (Ricardo) — o growth usa sazonalidade para outbound, não como informação de planejamento no site.
9. **Expectativa fora do horário no lugar do 'Online' falso**: "manda agora, respondemos a partir das 8h30" (Fernanda) — os especialistas removem o fake; a persona pede o que entra no lugar.

## Vereditos (≈16 recomendações mais recorrentes)

| # | Recomendação | Veredito | Síntese |
|---|---|---|---|
| 1 | Mensagem pré-preenchida em todos os CTAs | **APOIAR** | Única rec pedida pelas 4 personas com 4 motivos diferentes. Implementar como roteiro com lacunas, não como texto de marketing; incluir linha para itens múltiplos. |
| 2 | Specs estruturadas no metadata (extração dos filenames) | **APOIAR** | "Cabe no salão/elevador? 110/220? criança de 6 usa? quantos jogam?" travou as 4 personas. A informação já existe em nomes de arquivo — vergonha operacional, não falta de dado. |
| 3 | FAQ real em /como-funciona | **APOIAR** | Usar a lista das personas (chuva, sinal, cancelamento, duração, horário de montagem, elevador, hora extra, idade), não keywords de SEO. Cada resposta = uma mãe a menos desistindo calada. |
| 4 | Âncora de preço "a partir de R$ X" estreita | **MODIFICAR** | O bloqueio real é emocional ("medo de passar vergonha"). Primeiro a página "Entenda o orçamento" (variáveis + o que está incluso) + faixas por ocasião/porte ("festa infantil em condomínio: entre X e Y"); B2B por pessoa/porte atrás de 1 clique (âncora baixa pública assusta compras — Ricardo). Piso público só se for real e cumprível. |
| 5 | Sprint de des-fabricação em 48h | **MODIFICAR** | Badge '1' e 'Online' perpétuo: remover JÁ (duas personas se sentiram enganadas — dano real). 'Locações' hash: SUBSTITUIR por atributo útil no mesmo pixel, não deletar (Fernanda e Camila: card vazio é pior). No lugar do 'Online': "fora do horário? manda mesmo assim, respondemos às 8h30". |
| 6 | Trilhas/páginas por ocasião | **MODIFICAR** | Apoio forte, mas a lista dos especialistas tem um buraco: incluir "Festas de família" (bodas, 60+, igreja) — o decisor que paga e que nenhuma das 12 lentes enxergou — e a linha de aceno à festa pequena na home. |
| 7 | Sticky CTA mobile no produto | **MODIFICAR** | Fazer como SUBSTITUTO do float (que colide com botões e carrega a badge falsa — Antônio), não como mais um botão. Expectativa de impacto honesta: nenhuma persona teve dificuldade de ACHAR o botão; o gargalo é o pós-clique. |
| 8 | Galeria touch-first + controles visíveis | **APOIAR** | Camila compra pela foto e a página que decide o aluguel é zona morta no touch. Empacotar com capa curada (a 1ª foto do Pebolim é a casa de lago de alguém). |
| 9 | Semana de fundação SEO técnico (canonical/sitemap/JSON-LD) | **DESAFIAR** | Nada técnico travou nenhuma persona; 3 de 4 discordam explicitamente da prioridade. SEO traz a próxima Fernanda; conteúdo converte a que já chegou — e hoje ela chega e vai embora com as mesmas dúvidas. Fazer GSC (trivial) já; o resto DEPOIS do pacote specs+FAQ+mensagem. |
| 10 | Pacote legibilidade (12px mínimo, fim do contraste /40-/60) | **APOIAR** | O Top 10 (vitrine nº1, com o videokê em 2º) é ilegível exatamente para quem paga bodas e formaturas. Elevar acima de qualquer trabalho de teclado/ARIA, como pede o próprio Antônio. |
| 11 | Counters nunca resetarem a 0 | **APOIAR** | Ricardo fecharia a aba: "0+" é o defeito que a própria pesquisa ridiculariza no pior concorrente, na seção de prova social. |
| 12 | Renomear produtos crípticos ("Fliperama de 11.000") | **APOIAR** | Duas personas leram como PREÇO e uma levou susto de R$ 11.000. Trivial, metadata.json. Corrigir typos junto ("Maquina Boxe") — Camila desconta confiança por typo em vitrine. |
| 13 | GBP + motor de reviews via WhatsApp | **APOIAR** | Não por ranking: reviews com link são a prova VERIFICÁVEL que Antônio ("minha geração não acredita em porcentagem de site") e Ricardo ("98% sem fonte não entra em slide") pediram. Substitui a discussão estéril "500 vs 5.000 eventos". |
| 14 | Separar modelos de videokê em produtos individuais | **MODIFICAR** | O split é resposta de SEO a uma dor que é de USUÁRIO: resolver primeiro a contradição 30.000 vs 12.000, o "até 2023", o Karaokê 2025 dando 500, e listar repertório por década (Roberto Carlos/MPB/60-80). Uma página forte com variantes serve Antônio e Camila; estilhaçar SKUs sem isso só multiplica thin content. |
| 15 | Kits/combos por ocasião com preço fechado | **APOIAR** | Camila "fecharia na hora"; Fernanda quer combo por nº de crianças; é a forma de âncora de preço que menos constrange. E desafio à rejeição do multi-item pelo CRO: 2 de 4 personas precisam de 2-4 itens — combos + lacuna de itens na mensagem agora; versão checkbox→wa.me se os dados confirmarem. |
| 16 | Fallback de canal "ou ligue" junto aos CTAs | **APOIAR+ESTENDER** | Único especialista (a11y pragmática) que ouviu o Antônio. Estender com o que ninguém propôs: telefone obrigatório no form (e-mail opcional), rastrear tel:, replicar o quadro "Prefere ligar?" além de /contato. |

## Menções rápidas
- **Hero sem JS / dieta 4G**: apoiar o fix barato do hero (2-4h); não deixar o pipeline de imagens/curadoria de vídeo (semanas) furar a fila do conteúdo que fecha venda.
- **Logo-wall Bradesco/Spotify**: modificar para citação nominal + foto do evento + autorização dos 3-4 principais (versão da lente de marca) — Ricardo precisa de material citável, não de risco jurídico.
- **OG image 1200×630**: apoiar em segunda onda; a decisão acontece em grupo de WhatsApp, mas nenhuma persona travou nisso.
- **Consolidar engines de animação / limpeza de deps**: desafiar qualquer prioridade — zero impacto nas personas; o tom e o motion são o que diferenciou o site das outras 3 abas (Fernanda e Camila pedem para NÃO "consertar" o tom).

## Top 5 (se só 5 pudessem ser feitas)
1. **Mensagem pré-preenchida com roteiro de lacunas em TODOS os CTAs** (+ "ou ligue" ao lado) — destrava o pico de intenção das 4 personas; código já existe abandonado.
2. **Ficha técnica nos 54 produtos** (dimensões, tomada, idade, jogadores, duração) extraída dos filenames — mata a objeção nº1 do cliente urbano de prédio/salão.
3. **Página "Quanto custa? Entenda o orçamento" + faixas por ocasião/porte** — remove o medo de "passar vergonha" sem abrir tabela nem ancorar negociação para baixo.
4. **FAQ das personas + caça às contradições** (chuva/sinal/duração/montagem; 30k vs 12k músicas; "equipe no local" vs "não é plantão"; form que promete WhatsApp e manda e-mail) — informação trocada mina os 33 anos mais que qualquer contador.
5. **Honestidade voltada ao usuário**: remover badge '1' e 'Online' perpétuo (trocar por "respondemos às 8h30"), substituir 'locações' hash por atributo real no card, e contadores nunca exibirem 0.

— Crítico advogado do usuário final, 2026-06-11
