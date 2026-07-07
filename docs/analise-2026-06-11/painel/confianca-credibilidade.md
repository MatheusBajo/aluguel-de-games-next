# Parecer — Lente: Confiança e Credibilidade
Painel de auditoria · alugueldegames.com.br · 2026-06-11
Material lido: auditorias home-hero, nav-conversion, product-page, static-pages, catalog-data; pesquisas competitors-br, whatsapp-cro, complemento-verificado; código-fonte (sales-utils.ts, src/app/) e texto renderizado de /sobre e /empresas.

---

## 1. O diagnóstico central: o site INVERTE a equação de confiança

Este negócio tem o problema de confiança mais raro que existe: **fabrica prova social fraca enquanto senta em cima da prova social mais forte do mercado inteiro**.

O que está fabricado (confirmei no código):
- `src/lib/sales-utils.ts` — "locações" geradas por hash FNV-1a (100–200+), exibidas como métrica real em CatalogCard e no modal Top 10. O próprio comentário do arquivo admite a invenção.
- Badge "1" de notificação falsa no WhatsAppFloat (animate-bounce).
- "98% Satisfação" (/sobre, hero) vs "100% Satisfação" (página de produto) — duas mentiras que nem combinam entre si.
- "Online · Pronto pra atender" estático em /contato (domingo, 3h da manhã: "Online").
- "Ao enviar, abrimos um chat pré-preenchido no WhatsApp" em /contato — o formulário manda e-mail via Web3Forms e não abre WhatsApp nenhum.
- Badge "Disponível" sempre verde no modal Top 10, sem checagem real.
- /empresas promete "equipe fica acompanhando durante o evento" enquanto /como-funciona diz explicitamente "não é plantão no local" — para B2B isso é risco contratual, não só de copy.

O que é REAL e ninguém no mercado consegue copiar:
- **Desde 1993 = 33 anos.** A pesquisa de concorrentes confirma: Freitas Videokê tem 30, Mega Power 28, MC Diversões 22, Fun Play 20, Alugue Games 11. É a empresa mais antiga do nicho pesquisado — literalmente **mais antiga que o PlayStation** (lançado em dez/1994). Essa frase é verificável, memorável e nenhum concorrente pode usá-la.
- Clientes nomeáveis: **Bradesco/Braland, Spotify, Arnold Classic 2025, Danilo Gentili, Kay Black** — hoje escondidos como legendas de carrossel e captions de galeria que **nem aparecem no mobile** (hover-only).
- 54 produtos com fotos reais + **467 MB de vídeos reais de eventos que o site nunca exibe**.
- Copy honesta em vários pontos ("não é plantão no local", "respondemos em 1 dia útil") — o tom honesto JÁ EXISTE; a fabricação é um corpo estranho.

A ironia quantitativa: o número fabricado "500+ eventos desde 1993" dá ~15 eventos/ano — **a mentira subvende a empresa**. Um negócio que sobreviveu 33 anos fez milhares de eventos. Inventaram um número pior que a realidade.

## 2. O risco, dimensionado com honestidade

- **CDC art. 37 (publicidade enganosa):** risco de autuação formal por "140+ locações" é baixo na prática (Procon age por denúncia; dano individual é difuso). O risco real é outro:
- **Risco de detecção e humilhação pública:** qualquer pessoa que abra 3 cards percebe que TODOS os produtos têm "100+ a 200+ locações". Um comprador corporativo de procurement, um concorrente, ou um post no Reclame Aqui/Reddit destrói de uma vez o ativo de 33 anos. O padrão é trivialmente detectável (faixa estreita, sempre dezena + "+").
- **Risco B2B contratual:** a promessa divergente de "equipe no local" em /empresas pode ser exigida em contrato por cliente corporativo.
- **Risco LGPD (achado novo, confirmado por grep):** zero menção a "privacidade", "LGPD" ou política de dados em todo o `src/`. O site roda GTM/GA4 e um formulário que coleta nome, e-mail, telefone e data de evento via Web3Forms (processador terceiro, dados saem do país). Para B2B, ausência de política de privacidade é item de checklist de compliance; para ANPD, é não-conformidade básica. Nenhuma das 10 auditorias listou isso.
- **Risco assimétrico:** para uma empresa de 1993, a perda marginal de conversão por remover os números falsos é ~zero (eles são fracos); a perda potencial por mantê-los é o ativo inteiro de reputação. Decisão fácil.

## 3. Estratégia em 3 ondas: "Deflacionar para a verdade, depois inflar com evidência"

### Onda 1 — Sprint de des-fabricação (48h de trabalho, tudo deleção/copy)
1. Remover `getRentalCount` por hash: deletar o badge "locações" dos cards onde não há `locacoes` real no metadata (5 produtos têm). Substituto honesto e imediato: badge qualitativo "Top 10 mais pedidos" (a empresa SABE quais são, o TopToys já existe) ou nada.
2. Remover badge "1" do WhatsAppFloat. Substituto: nada, ou "Resposta rápida" (texto, não notificação falsa).
3. Remover "98%/100% Satisfação" até existir fonte (reviews Google). Remover "500+ eventos" (ver Onda 3 — contar, não estimar).
4. Corrigir /contato: ou o form abre o wa.me pré-preenchido pós-envio (melhor: conversão dupla), ou a copy para de prometer isso. Trocar "Online · Pronto pra atender" por condicional de horário comercial ou "Respondemos rápido em horário comercial".
5. Alinhar /empresas × /como-funciona sobre equipe no local — e transformar a divergência em produto: "acompanhamento no local" como opcional pago para B2B (upsell honesto).
6. Corrigir "Máquinas (0)" (bug NFD/NFC) — uma prateleira vazia na vitrine principal é problema de confiança tanto quanto de código.

### Onda 2 — Promover a prova real (1–2 semanas)
7. **CNPJ + razão social no footer** + "Contrato e NF em todos os eventos". No Brasil, B2B confere CNPJ antes de fechar; e o cartão CNPJ da Receita mostra a **data de abertura** — se for 1993, o CNPJ público vira a PROVA verificável do claim de 33 anos. (Verificar a data antes; se a empresa foi reconstituída depois, ajustar a narrativa: "operação desde 1993".)
8. **Trust bar do hero com nomes reais** em vez do texto genérico "Grandes empresas · Personalidades públicas": "Bradesco · Spotify · Arnold Classic · Danilo Gentili". Texto factual ("já realizamos eventos para") tem risco jurídico menor que logo-wall; para logos, pedir autorização — Bradesco/Spotify têm guidelines. TDB exibe 12 logos sem aparente problema, mas o caminho conservador é nome em texto + foto real do evento (que já possuem).
9. **Legendas da galeria visíveis no mobile** — hoje o name-dropping (Bradesco, Spotify, Gentili) é hover-only e o público majoritário (mobile) nunca vê. É a correção de confiança com melhor custo-benefício do site: a prova existe, está renderizada, e está invisível.
10. **Página de produto:** trocar o bloco de stats fabricadas por 3 fatos verificáveis: "Entrega e montagem incluídas · Equipamento testado antes do evento · Contrato e NF". (E corrigir "Whatsapp" → "WhatsApp".)
11. **Políticas publicadas** (página "Combinados" ou seção em /como-funciona): política de chuva (infláveis/área externa — benchmark Baby Eventos), cancelamento/remarcação, **garantia de substituição** ("se o equipamento falhar e não resolvermos, substituímos ou devolvemos proporcional" — eles já fazem manutenção preventiva; escrever isso é grátis e nenhum concorrente direto de games tem), formas de pagamento e sinal, frete. Cada política publicada é uma objeção a menos no WhatsApp e conteúdo long-tail.
12. **Política de privacidade LGPD** (1 página estática): o que coletam (form, GA4/GTM), com quem compartilham (Web3Forms, Google), contato. Barato, obrigatório, e item de checklist B2B.

### Onda 3 — Construir o motor de prova (processo contínuo, quase zero código)
13. **Google Business Profile como negócio de área de serviço** — minha busca não encontrou o perfil (inconclusivo, mas suspeito). Primeiro passo: auditar se existe; se não, criar com endereço oculto + 20 áreas da Grande SP. Sem GBP, "avaliações Google" nem é possível.
14. **Fluxo pós-evento de coleta de reviews:** a empresa JÁ conversa com 100% dos clientes no WhatsApp. D+1 do evento: mensagem padrão (resposta rápida do WhatsApp Business) com link direto de avaliação (g.page/r/…). Meta realista: 40–60 reviews em 6 meses — supera todos os concorrentes diretos de games (nenhum tem depoimentos + rating juntos; só Baby Eventos, de infantil, tem 664). Reviews vão pro GBP/Maps — não usar como aggregateRating do próprio site no schema (não elegível desde 2019; a auditoria de produto acertou em não inventar).
15. **Contador real de eventos:** etiquetas no WhatsApp Business ("Evento realizado") + planilha mensal. Em 6–12 meses existe um número REAL ("Mais de 300 eventos só em 2026") que ninguém precisa inflar. Até lá, claims sem número: "3 gerações de clientes", "mais antiga locadora de games de SP que conhecemos" (ou a versão segura: "no mercado desde antes do PlayStation existir").
16. **Autorização de imagem no contrato** (1 cláusula opt-in) + foto/vídeo de cada evento → alimenta galeria, cases B2B com números (nº participantes), e os depoimentos com nome + bairro/empresa que hoje são zero em todo o site.
17. **Usar os 467 MB de vídeos reais:** curar 1 vídeo curto comprimido por produto-chave. Vídeo de fila no evento real é prova que nenhum número substitui — e já está gravado.

## 4. Conexões que as auditorias não fizeram

- **O WhatsApp preview é uma superfície de confiança.** O cliente típico compartilha o link do produto no grupo da família/da firma para decidir. OG image quebrada (webp declarado como jpeg, 1200×630 falso, og:image:secure_url com `name` em vez de `property`) = card feio ou sem imagem **no exato momento da decisão social**. A correção de OG não é "SEO", é prova social no canal nº 1.
- **A mensagem pré-preenchida é o primeiro aperto de mão.** Chat vazio transmite "empresa que não se preparou". `getWhatsAppLink()` já existe e está abandonado — é também um tema de credibilidade, não só de CRO.
- **Honestidade já é o tom da casa** ("não é plantão no local", "respondemos em 1 dia útil", a decisão consciente de não inventar aggregateRating no schema). A fabricação é incoerente com a própria voz da marca — remover não é "perder uma tática", é restaurar consistência.
- **Concorrentes quebrados são o piso da régua:** Aluga Videogames exibe contadores "0+" e "R$ 0" no hero — e o próprio site daqui tem o bug do Counter que mostra "0+" em /sobre e /galeria após hidratação. O site está a um bug de parecer com o pior concorrente. Corrigir o Counter é item de credibilidade, não de performance.

## 5. Discordâncias e caveats (para o debate do painel)

1. **"Publicar preço-âncora 'a partir de R$'" (pesquisa de concorrentes, síntese #1):** discordo de adotar como recomendação geral. Sob CDC art. 30, oferta vincula; âncora baixa que nunca se realiza converte clique em desconfiança no momento do orçamento — o pior lugar para perder confiança. Se fizer, que seja piso real e cumprível em 2–3 categorias de teste (ex.: console em dia útil na capital), com condições explícitas. Âncora desonesta é a mesma doença das "locações" por hash, com outra roupa.
2. **"500+ eventos subvende — número provavelmente maior" (várias auditorias):** concordo com o diagnóstico, discordo do remédio implícito. Não se corrige um número inventado para baixo inventando um maior. Remover o claim numérico até existir contagem real (Onda 3). "33 anos" sozinho carrega a narrativa nesse meio-tempo.
3. **"A/B testar o badge falso '1'" (whatsapp-cro §2):** não se A/B testa desonestidade. O teste pode até "ganhar" em cliques de curiosidade e ainda assim corroer a marca — métrica de clique não captura confiança queimada. Remover sem teste.
4. **Peso relativo das auditorias técnicas:** performance/a11y/SEO têm dezenas de itens com semanas de esforço; a des-fabricação inteira (Onda 1) é ~2 dias e protege o ativo principal do negócio (reputação de 33 anos). Para 1 dev com orçamento limitado, a ordem certa é: des-fabricar → promover prova real → só então a fila técnica longa. As auditorias listam a fabricação como "um dos" achados; pela minha lente, é O achado.

## 6. Resumo executivo para o dono

Você tem a história mais antiga do mercado e clientes que seus concorrentes matariam para ter no portfólio — e o site esconde isso atrás de números de mentira que qualquer cliente atento percebe. O plano: (1) dois dias apagando tudo que é inventado; (2) duas semanas colocando Bradesco/Spotify/33 anos/CNPJ/políticas na frente; (3) um processo simples no WhatsApp que você já usa para colher avaliações Google e contar eventos de verdade. Em 6 meses, você terá a única empresa do nicho com antiguidade + clientes nomeados + reviews reais — uma posição que nenhum concorrente consegue falsificar.
