# Parecer de Especialista — Otimização de Conversão (CRO)
**Lente:** funil de orçamento via WhatsApp · alugueldegames.com.br
**Data:** 2026-06-11 · Insumos: nav-conversion.md, whatsapp-cro.md, competitors-br.md, rental-ux.md, product-page.md, home-hero.md, screenshots mobile (home, produto, catálogo), pagetext.

---

## 0. Tese central (o que as auditorias não disseram)

As auditorias mapearam bem os defeitos (CTAs sem `?text=`, tracking cego, badge falsa, prova social fabricada). Mas todas olham para o **site**. O funil deste negócio tem 6 estágios e **4 deles acontecem dentro do WhatsApp**, fora do site e fora do GA4:

```
SERP/indicação → página → clique wa.me → mensagem ENVIADA → resposta → orçamento → fechamento → pós-evento
   (CTR)         (CTA)      [GA4 vê até aqui]      [daqui pra frente: só o WhatsApp Business vê]
```

**O vazamento mais caro do funil é invisível: clique → mensagem enviada.** Usuário clica, cai num chat vazio, não sabe o que escrever, fecha o app. Estimativas de mercado: 20–40% dos cliques nunca viram mensagem. Nenhuma auditoria quantificou isso porque não dá para medir direto — mas dá para medir por **reconciliação**: cliques `whatsapp_click` no GA4 por semana × conversas novas recebidas no WhatsApp Business na mesma semana. Essa razão é o KPI número 1 deste negócio e hoje ninguém a calcula.

Segunda tese: **a mensagem pré-preenchida não é um detalhe de UX — ela É o formulário.** O site não precisa de formulário multi-step nem carrinho de orçamento: o campo `?text=` do wa.me carrega a qualificação inteira (produto, data, bairro, nº de convidados) sem quebra de mídia. Isso ataca simultaneamente o vazamento clique→mensagem E o custo de atendimento (menos ida-e-volta por conversa = resposta mais rápida = mais fechamento, com 1 atendente).

---

## 1. O funil ideal, estágio por estágio

| Estágio | Alavanca | Estado hoje | Meta/observável |
|---|---|---|---|
| SERP → sessão | Title com âncora de preço ("a partir de R$") e keyword "aluguel de" | Title duplica marca, sem preço | CTR no Search Console |
| Sessão → clique | CTA visível na dobra (sticky mobile), copy verbo+benefício, trust no momento do clique | CTA abaixo da dobra no produto mobile; hero sem tracking | `whatsapp_click`/sessão (4–8% em produto) |
| Clique → mensagem enviada | **Mensagem pré-preenchida estruturada** | ~90% dos CTAs abrem chat VAZIO | razão conversas novas / cliques GA4 (meta >70%) |
| Mensagem → resposta | Saudação automática, mensagem de ausência, promessa de tempo no site | "Online · pronto pra atender" estático (falso às 3h) | tempo 1ª resposta <5min comercial |
| Conversa → orçamento | Campos já na mensagem; respostas rápidas; catálogo WhatsApp como cardápio | Lead chega "oi" cru; atendente pergunta tudo | nº de mensagens até orçamento (de ~8 para ~3) |
| Orçamento → fechamento | Follow-up 1h/24h/48h; etiquetas como funil | Sem processo visível | % orçamento→fechado por etiqueta |
| Pós-evento | **Pedido de review Google + foto do evento** | Zero reviews no site; prova social fabricada por hash | reviews/mês — alimenta o topo do funil |

O último estágio é o que transforma o funil em **flywheel**: o pedido de review pós-evento (1 mensagem padrão no WhatsApp Business, custo zero) gera a prova social real que substitui as "140+ locações" fabricadas e que nenhum concorrente direto de games tem (benchmark do setor: Baby Eventos, 664 reviews — mas em brinquedos infantis, não em games).

---

## 2. Arquitetura de mensagens (spec pronta para implementar)

Princípio: **uma família de templates, 3 blocos** — contexto (de onde o lead veio, em linguagem humana, nunca código), qualificação (campos para o usuário completar), tom. Quebra de linha via `%0A`, negrito com `*asteriscos*` (renderiza no WhatsApp). O contexto em linguagem natural ("Vi o *Fliperama Snack* no site") funciona como atribuição que o usuário **não apaga** — diferente de UTM/ref code com cara de rastreador.

**Produto (CTA "Fazer Orçamento" + float quando em página de produto):**
```
Olá! Vi o *{titulo}* no site e quero um orçamento.
• Data do evento:
• Bairro/cidade:
• Nº aprox. de convidados:
```

**Categoria (CatalogoList / CategoryListing):**
```
Olá! Estou vendo os *{categoria}* no site e quero um orçamento.
• Data do evento:
• Bairro/cidade:
```

**Genérico (header, float fora de produto, footer, hero):**
```
Olá! Vi o site e quero um orçamento pra um evento.
• Data:
• Bairro/cidade:
• O que procuro (games, karaokê, infláveis...):
```

**Empresas (/empresas — hoje o lead B2B chega sem contexto nenhum):**
```
Olá! Quero um orçamento para um *evento corporativo* (confraternização, SIPAT, feira...).
• Empresa:
• Data:
• Local:
• Nº de participantes:
```

Implementação: o componente `WhatsAppButton.tsx` que já existe e nunca foi importado resolve mensagem+tracking de uma vez (consertar o `+` no wa.me, apontado pela pesquisa). É 1 componente client substituindo ~20 `<Link>` crus. **Esforço: 1 dia. É a maior alavanca individual do site.**

Risco conhecido: parte dos usuários apaga o texto. Sinal de alarme a monitorar: % de primeiras mensagens chegando vazias/`oi` (o atendente conta numa planilha semanal). Ver Experimento 1.

---

## 3. Posicionamento de CTA — só 3 mudanças importam

1. **Sticky bar mobile na página de produto** (a página de maior intenção): barra fixa inferior "Pedir orçamento no WhatsApp" que aparece quando o CTA original sai da viewport. Screenshot mobile confirma: galeria → título → características → CTA; em descrição longa o botão some por 2–3 telas. Efeito esperado grande (>30% no clique do produto) — é o tipo de mudança que dá para validar mesmo com pouco tráfego.
2. **Hero desktop: CTA acima da dobra.** O layout split (texto+CTA à esquerda, carousel à direita) já existe pronto no código morto `StartCarouselClaude.tsx` — ironia apontada pela auditoria de home. Aproveitar o layout, deletar o resto.
3. **Trust no momento do clique, não longe dele.** Hoje o bloco sob o CTA do produto diz "500+ eventos / 100% satisfação" — números fabricados/subestimados (33 anos × ~100-300 eventos/ano = milhares; "500+" SUBVENDE a empresa mais antiga do mercado). Trocar por: "★ Desde 1993 — a locadora de games mais antiga de SP" + link "avaliações no Google" quando existirem. O ativo "mais antiga que TODOS os concorrentes" (Freitas 30, Mega Power 28, Fun Play 20) deve estar colado em cada botão verde, porque é no clique que a confiança é gasta.

Microcopy do botão: "Pedir orçamento no WhatsApp" + subtexto honesto sensível a horário: em horário comercial "Respondemos em poucos minutos"; fora dele "Deixa sua mensagem — respondemos logo cedo" (substitui o "Online" falso às 3h da manhã; é client-side, funciona em site estático).

---

## 4. Âncora de preço: publicar "a partir de" é vantagem? SIM — mas no nível certo

O mercado inteiro esconde preço (exceções: Alugue Games R$ 890/kit, Karaoke SP "a partir de R$ 200" no title). Minha posição, mais cirúrgica que a da pesquisa rental-ux:

- **Por categoria, sim** — "Fliperamas: aluguel a partir de R$ X · diária com entrega e montagem" no topo da página de categoria e na meta description. Ganhos: (a) CTR na SERP num mercado de resultados sem preço; (b) filtro de leads fora de orçamento ANTES de consumirem o tempo do único atendente — para 1 atendente, hora economizada é a moeda mais escassa; (c) confiança ("quem mostra preço não tem o que esconder").
- **Em combos, preço fechado** (ver §5) — âncora completa, comparável, anunciável.
- **Por item individual, NÃO** (discordância com rental-ux — ver §9). Manutenção de ~54 preços, guerra de preço com concorrente que undercuta, e perda da flexibilidade de negociação que o WhatsApp permite (frete por região, data de semana vs fim de semana).
- Tão importante quanto o preço: **publicar o período padrão** ("diária = até X horas, hora extra R$ Y") — mata a pergunta nº 1 da conversa.

Pré-requisito não-técnico: o dono define 8 números (1 por categoria) + 4 preços de combo. Sem isso nada anda — é a primeira conversa a ter.

---

## 5. Kits/combos por ocasião — a curadoria que falta

Paradoxo atual: o site tem o catálogo mais profundo do mercado (54 produtos vs 3 kits genéricos dos concorrentes), mas o screenshot do catálogo mobile é um paredão de scroll — **excesso de escolha sem curadoria**. O cliente não pensa "quero um Atari 2600"; pensa "festa de 15 anos, 30 adolescentes, salão de festas". Os concorrentes que crescem (Alugue Games, Fun Play, Mega Power) vendem KITS nomeados.

Proposta — 4 combos, cada um com página própria (landing de SEO + destino de anúncio + item do catálogo WhatsApp):

| Combo | Composição exemplo | Preço |
|---|---|---|
| **Festa Teen** | 2 consoles + fliperama + air hockey | fechado |
| **Confraternização** | karaokê + fliperama + mesa de jogos | fechado |
| **SIPAT / Corporativo** | VR + simulador + fliperama adesivado | "a partir de" |
| **Festa Infantil** | inflável + carrinho + console | fechado |

Cada página: foto do setup completo (não dos itens isolados), o que está incluso (entrega, montagem, suporte, período), preço, FAQ curto (espaço, tomada, chuva), CTA com mensagem pré-preenchida do combo. Os combos viram também os primeiros cards do /catalogo (curadoria acima do paredão) e os criativos das campanhas sazonais (Dia das Crianças, fim de ano corporativo).

---

## 6. Prova social: do fake ao flywheel

Sequência de substituição (a auditoria mandou "remover o fake"; eu mando **trocar por um processo que gera o real**):

1. Remover "N+ locações" por hash e "100% satisfação" (risco CDC + basta 1 cliente perceber o padrão).
2. Perguntar ao dono os números reais agregados: eventos/ano × 33 anos. Provavelmente algo como "milhares de eventos desde 1993" — mais forte e defensável que "500+".
3. **Processo pós-evento (zero código):** mensagem padrão no WhatsApp Business 1 dia após o evento: agradecimento + link de review do Google + pedido de 1 foto do equipamento na festa (com autorização de uso). 10 eventos/mês ⇒ ~3-5 reviews/mês ⇒ em 1 ano, dezenas de reviews — nenhum concorrente direto de games tem isso.
4. As fotos autorizadas alimentam a galeria e as páginas de produto ("este fliperama numa festa real em Guarulhos") — foto lifestyle no card aumenta CTR (+32% no grid, dados Shopify citados em rental-ux).
5. Quando houver ~20 reviews: selo "Nota X no Google · N avaliações" ao lado dos CTAs e JSON-LD aggregateRating LEGÍTIMO (o time já teve o critério de recusar o fake no schema — manter esse critério, agora com dado real).

---

## 7. Pós-clique (onde o orçamento é ganho ou perdido) — zero código

Para o dono, não para o dev:
- **Saudação automática** + **mensagem de ausência** no WhatsApp Business (leads de festa chegam à noite e no fim de semana; o vácuo noturno mata o lead que vai chamar o concorrente de manhã).
- **Respostas rápidas** (/orcamento, /área, /chuva, /pagamento).
- **Etiquetas como funil**: Novo lead → Orçamento enviado → Aguardando → Fechado → Pós-evento. 15 min/semana de disciplina.
- **Reconciliação mensal**: cliques GA4 × conversas novas × orçamentos × fechamentos. Quatro números numa planilha. É o único jeito de saber se qualquer mudança do site funcionou — e custa nada.
- **Catálogo do WhatsApp Business** com os ~20 itens top + 4 combos, linkando de volta ao site — o atendente manda o card do item em vez de digitar.

---

## 8. Funis diferentes para públicos diferentes (B2C ≠ B2B)

- **B2C (festa):** WhatsApp-first, mensagem estruturada, decisão emocional rápida, acontece à noite. O formulário é alternativa, não pedágio.
- **B2B (/empresas):** quem cota é RH/compras, em horário comercial, por e-mail, com processo. Aqui o **formulário ganha relevância** (anexar proposta, CNPJ, aprovação interna) e o WhatsApp precisa do template corporativo (§2). Adicionar à página: CNPJ no footer (trust BR barato, apontado pela auditoria), logos de clientes corporativos reais de 33 anos de história (TDB ganha com CBF/Paramount; a empresa mais antiga do mercado certamente tem logos engavetados), e a oferta de **adesivagem/branding de máquinas** se existir (diferencial B2B que só Mega Power explora).
- O bug de promessa do form ("abrimos um chat pré-preenchido" → não abre) deve ser resolvido CUMPRINDO a promessa: pós-envio, botão "Continuar no WhatsApp" com mensagem montada a partir dos campos do form — conversão dupla (e-mail + chat) e atribuição determinística de graça.

---

## 9. Os 3 experimentos A/B mais valiosos (com desenho honesto)

**Caveat estatístico antes de tudo:** com tráfego de SMB, teste A/B clássico de micro-copy nunca atinge significância (um teste 50/50 detectando +15% precisa de dezenas de milhares de sessões por braço). Os experimentos abaixo são desenhados para efeitos GRANDES, medidos onde o dado existe (GA4 para clique, WhatsApp/etiquetas para qualidade), com alternância temporal ou split por categoria em vez de randomização por sessão. E há um pré-requisito absoluto: **consertar a medição primeiro** (hero e 90% dos CTAs hoje são invisíveis no GA4; `whatsapp_click` como key event; `view_item` disparando) — não se testa o que não se mede.

**EXP 1 — Mensagem estruturada vs. simples (a aposta de maior valor):**
- A: mensagem atual de produto ("Gostaria de fazer um orçamento para o produto: X.") · B: template estruturado do §2.
- Alternância semanal (semanas pares/ímpares) em todos os CTAs de produto.
- Métricas: razão conversas/cliques; nº de mensagens até o orçamento enviado; % de leads com data+bairro na 1ª mensagem (atendente marca na planilha); guardrail: % de mensagens apagadas/vazias.
- Por quê primeiro: afeta 100% dos leads e mede o vazamento invisível.

**EXP 2 — Âncora de preço na categoria:**
- B nas 2 categorias de maior tráfego (Fliperamas, Consoles): "a partir de R$ X · diária com entrega e montagem" no topo + meta description; 2 categorias semelhantes como controle.
- Métricas: `whatsapp_click`/sessão da categoria; % de leads "fora de orçamento" (etiqueta); CTR na SERP via Search Console (antes/depois, 4–6 semanas).
- Decide a maior questão estratégica do site com risco contido (2 categorias, reversível em 1 commit).

**EXP 3 — Sticky CTA mobile no produto:**
- A: atual · B: barra fixa inferior com contexto do produto, visível após o CTA original sair da tela.
- Métrica: `whatsapp_click`/sessão mobile em páginas de produto (GA4 puro — o efeito esperado é grande o suficiente para aparecer em pre/post de 3–4 semanas).
- O mais barato dos três (~meio dia de dev) e o único 100% mensurável dentro do GA4.

---

## 10. Ordem de execução para 1 dev + dono

**Semana 1 — código (2–3 dias):** componente WhatsAppCta único (mensagem estruturada + tracking + wa.me sem `+`) substituindo todos os links crus · sticky CTA mobile produto · remover badge "1" e locações por hash · subtexto de horário nos CTAs · `whatsapp_click` key event no GA4 · form dispara `generate_lead` e oferece "Continuar no WhatsApp".
**Semana 1 — dono (zero código):** saudação/ausência/etiquetas/respostas rápidas no WhatsApp Business · definir 8 âncoras de categoria + 4 combos com preço · começar o pedido de review pós-evento · desencavar logos corporativos e números reais (eventos/ano).
**Mês 1:** 4 páginas de combo · âncoras nas 2 categorias-teste (EXP 2) · hero split desktop · OG image 1200×630 real por produto (o link compartilhado no grupo da família/empresa no WhatsApp é o outdoor mais barato deste negócio — eu elevaria a prioridade que a auditoria deu como "baixa") · CNPJ + reviews no footer.
**Trimestre:** catálogo WhatsApp Business · reconciliação mensal rodando · CTWA sazonal (Dia das Crianças/fim de ano) comparando CPL contra tráfego ao site · selo de reviews quando houver massa.

---

## 11. Discordâncias e caveats (para o debate do painel)

1. **Mini-configurador de orçamento (whatsapp-cro, rec. 7): prioridade errada.** A mensagem pré-preenchida estruturada entrega ~80% do valor por ~5% do esforço, sem nova superfície de manutenção para 1 dev. Só construir o configurador se o EXP 1 mostrar deleção em massa dos campos — hipótese, não plano.
2. **Carrinho de orçamento multi-item ("padrão de ouro" do rental-ux): exagero para este negócio.** É padrão de locadora americana com 500 SKUs e software de inventário. Aqui o pedido típico tem 1–3 itens, a lista cabe na mensagem do WhatsApp, e os COMBOS resolvem o multi-item com curadoria em vez de mais UI. Adiar indefinidamente.
3. **Transparência de preço por item (rental-ux): meio certo, meio importado.** O dado "39% dos leads fora de orçamento" e a tese pró-transparência vêm do mercado US com software de booking. No mercado BR de locação via WhatsApp, o ponto ótimo é âncora por categoria + combos fechados; preço unitário em 54 itens cria custo de manutenção e guerra de preço sem ganho proporcional — e a conversa de preço no WhatsApp é onde o atendente vende valor (33 anos, suporte, entrega).
4. **As auditorias superestimam micro-achados de conversão e subestimam o pós-clique.** Badge "1" falsa, "Contato" escondido no dropdown, coração morto: reais, mas movem décimos de ponto. O funil deste negócio ganha ou perde nos estágios que nenhum código toca — mensagem enviada, velocidade de resposta, follow-up, review pós-evento. Se o painel priorizar 20 fixes de site e nenhum processo de WhatsApp Business, otimizamos a metade errada do funil. Corolário: qualquer proposta de "rodar A/B no GA4" sem reconciliação com o lado WhatsApp vai produzir conclusões estatisticamente vazias com este volume de tráfego.

---

## 12. Resumo em uma frase

Trocar ~20 links crus de wa.me por um componente com mensagem estruturada + medir o funil dos dois lados (GA4 e etiquetas) + dar curadoria (combos com preço) e prova social real (reviews pós-evento) ao ativo que nenhum concorrente pode copiar: **33 anos de festas**.
