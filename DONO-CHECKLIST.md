# DONO-CHECKLIST — o que só o dono pode responder

As ~2h/semana do dono são orçadas AQUI, em ordem de prioridade
(SPEC-FINAL-V2 §1 regra 8). Cada resposta destrava um pedaço do site que
hoje está oculto (regra: slot sem dado confirmado NÃO aparece no site —
nada é inventado).

Onde preencher no código: `src/config/business.config.ts` (dados) — o resto
o dev aplica.

## Prioridade 1 — destrava conversão/confiança AGORA

1. [ ] **Garantia** — confirmar a redação: "Deu defeito? Trocamos ou mandamos
   técnico no local, sem custo. O problema é nosso, não seu." É exatamente
   isso que você já pratica? Ajustar palavras se precisar.
2. [ ] **E-mail corporativo** pro /empresas (RH precisa de e-mail visível).
   Hoje só existe contato@alugueldegames.com.br — é esse mesmo?
3. [ ] **CNPJ + razão social** (vai no footer, na política de privacidade e
   no kit B2B; pré-requisito de homologação corporativa).
4. [ ] **Nota do Google + link do perfil** (Google Business Profile). Sem o
   link, o site não mostra "★ nota no Google" nem "avalie a gente".
5. [ ] **Horário de atendimento oficial** — o site antigo dizia seg-sex
   08:30-18:00 e sáb 08:00-12:30 (mantido na página de contato e no schema).
   Confirma? Esse horário passa a aparecer junto de todo botão de WhatsApp.

## Prioridade 2 — produto/preço

6. [ ] **Período da diária padrão** (quantas horas cobre? hora extra?).
7. [ ] **Specs dos 15 produtos top** (planilha: dimensões montado/fechado,
   passa em porta de 80cm?, elevador?, tomada 110/220, consumo, nº de
   jogadores, idade recomendada, espaço mínimo, peso).
   → JÁ FEITO automático: **19 produtos** têm "Dimensões (montado)" no site,
   extraídas do NOME DO ARQUIVO das fotos (ex.: PS5, pinballs, air games,
   simuladores). Falta você confirmar essas medidas e preencher o RESTO
   (voltagem, jogadores, idade, peso, passa-porta/elevador) — cada campo que
   você mandar vira uma linha nova na ficha; campo em branco não aparece.
   Também dá pra sobrescrever a resposta-resumo (`capsule`) e o FAQ de um
   produto específico, se quiser texto próprio.
8. [ ] **Faixas de preço por categoria** ("a partir de R$" SÓ com seu
   compromisso escrito; sem isso o site segue com a versão honesta sem faixa).
9. [ ] **Ranking do Top 10** — ordenar 1x os mais pedidos de verdade.
10. [ ] **Nº real de eventos** (se existir registro; senão fica "milhares de
    eventos" sem número).

## Prioridade 3 — prova social

11. [ ] **Álbuns da galeria**: ano + escopo de cada evento nomeado
    (ex.: "Arnold Classic 2025 · ativação com simuladores").
12. [ ] **Autorização de logos** (Bradesco/Spotify/etc. em texto é seguro;
    logo-wall só com autorização formal).
13. [ ] **Endereço completo** (rua/CEP) — necessário pro NAP idêntico ao GBP.
14. [ ] **Fotos nomeadas de evento** pra dobra de prova da home (§3.9): hoje
    entram Danilo Gentili + Bradesco/Braland (fotos reais) + 1 foto de máquina
    de boxe sem cliente. Faltam fotos que possamos NOMEAR de **Arnold Classic**
    e **Spotify** (senão o nome fica só na frase citável, sem card com foto —
    não colamos nome em foto que não é do evento). Manda foto + ano/escopo.
15. [ ] **"Mais pedido"/"novo" por produto** — se quiser badge honesta na
    vitrine, diga quais itens são de fato "mais pedido" ou novidade. Sem isso
    nenhum card leva badge e a fileira "Chegou no catálogo" fica fora.
16. [ ] **Nº de convidados por Kit** (Teen/Retrô, Confra/SIPAT, Infantil) —
    "ideal pra X convidados". Sem número, a linha não aparece no card.

## Prioridade 2b — empresas (B2B) e páginas novas

Destas depende o quanto a página /empresas e o kit de aprovação convencem o
financeiro/RH. Nada disso é inventado no site: enquanto não confirmar, o texto
fica na versão honesta (sem número/dado cravado).

17. [ ] **E-mail do comercial** que aparece no /empresas e no kit. Hoje mostra
    `contato@alugueldegames.com.br`. É esse ou tem um e-mail comercial/vendas
    dedicado? (aparece no hero, no form e no kit imprimível).
18. [ ] **Faturamento B2B** — trabalha com prazo (ex.: pagamento 30 dias após o
    evento)? Empenho? O site hoje diz só "condições ajustadas ao seu financeiro".
    Confirmando, dá pra ser específico.
19. [ ] **Dimensionamento por porte** — a tabela do /empresas sugere faixas de
    "atrações por nº de participantes" (2-3 até 50 pessoas, 5-7 pra 151-250 etc.)
    como PONTO DE PARTIDA. Confere se essas faixas batem com o que você faz na
    prática e, se quiser, me passa m² / nº de tomadas / nº de técnicos por porte
    pra virar coluna exata (hoje isso é "dimensionado no projeto").
20. [ ] **Agenda de novembro/dezembro** — qual a janela real pra fechar confra de
    fim de ano? (o site avisa que lota, sem data específica).
21. [ ] **Seguro / responsabilidade** — a locação tem cobertura de seguro? O kit
    NÃO menciona seguro até você confirmar (não afirmamos o que não sabemos).
22. [ ] **Relatório/fotos pós-evento** — você entrega registro/fotos da ativação
    pro cliente corporativo prestar contas? O processo do /empresas e o kit citam
    isso como "se solicitado"; confirma se é padrão.
23. [ ] **CNPJ + razão social + endereço no kit** — assim que preencher no
    `business.config.ts` (itens 3 e 13), o kit de aprovação passa a imprimir o
    bloco legal completo automaticamente (hoje diz "enviados junto com a proposta").

## Off-site (não é do site, mas é do projeto)

- [ ] Google Business Profile completo (categoria, fotos, horário).
- [ ] Bing Places + Foursquare + Apple Maps com NAP IDÊNTICO ao GBP
  (60-70% das recomendações locais do ChatGPT vêm da Foursquare).
- [ ] Pedir avaliação no Google no fim de cada evento (mensagem pronta).
- [ ] Baseline mensal: perguntar ao ChatGPT/Perplexity/Gemini "aluguel de
  fliperama em Osasco/SP" e anotar se a Aluguel de Games aparece.
