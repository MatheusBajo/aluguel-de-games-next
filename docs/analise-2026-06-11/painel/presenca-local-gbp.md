# Parecer — Presença Local & Google Business Profile
**Painel de auditoria · alugueldegames.com.br · 2026-06-11**
**Lente:** SEO local, GBP, NAP, páginas regionais. Complementa (não repete) `research/local-seo-br.md` e o §6 do `experts/seo-strategy.md`.

---

## 1. Estado atual verificado (com método e limitações declaradas)

O que eu consegui verificar de fora (WebSearch, base nos EUA — **não enxergo o map pack brasileiro**, e isso importa para ler as conclusões abaixo):

1. **O telefone (11) 96526-1000 não tem NENHUMA citação na web indexada fora do próprio site.** Busquei `"Aluguel de Games" "96526-1000"` — só aparecem páginas de alugueldegames.com.br. Tradução: a pegada de citações locais (o que o Google usa como "proeminência" fora do GBP) é **zero**. Nem Apontador, nem GuiaMais, nem diretório de festas, nem matéria, nem marketplace.
2. **A marca só ranqueia pelo próprio nome.** Em "aluguel de fliperama São Paulo" quem aparece é MC Diversões, locacaodefliperama.com.br, Upalêlê, Diver, Mega Power, Dinâmica — alugueldegames.com.br não aparece em nenhuma variação que testei além do nome exato da marca.
3. **Não encontrei nenhum vestígio indexado de um Google Business Profile** (sem g.page, sem maps.google nos resultados, sem terceiros citando avaliações). Duas hipóteses: (a) não existe perfil; (b) existe, mas sem reviews, sem link pro site e sem atividade — para efeitos práticos dá no mesmo. **Primeira ação do dono: buscar "Aluguel de Games" no Google Maps logado e verificar se há perfil para reivindicar.** Um negócio de 1993 pode ter um perfil-fantasma criado automaticamente pelo Google — reivindicar é mais rápido que criar.
4. **O Instagram @alugueldegames existe** (verificado por fetch direto), mas não é encontrável por busca — outro sinal de entidade fraca. O `sameAs` do schema aponta para instagram/facebook `.com/alugueldegames`; o Facebook eu **não** consegui confirmar que existe — checar, porque `sameAs` para perfil inexistente é sinal de entidade quebrado.
5. **No site:** nenhum endereço físico, nenhum bairro, nenhum CNPJ, nenhuma razão social (confirmado em `pagetext/contato.txt` e grep no código). O schema da home tem `GeoCoordinates -23.5505/-46.6333` = **Praça da Sé** (marco zero genérico) e `addressLocality: São Paulo` sem rua. `areaServed` lista 6 cidades; a página de contato promete "capital, ABC, Alphaville, Guarulhos, Osasco, Cotia" — listas diferentes.

**Síntese:** o negócio mais antigo do nicho (1993, mais velho que Freitas/30 e Mega Power/28) é, para o ecossistema local do Google, uma **entidade que não existe**. Não é um problema de otimização — é um problema de presença. E é a maior assimetria do diagnóstico inteiro: as auditorias acharam dezenas de bugs no site, mas o canal onde o site nem compete (mapa + "perto de mim" + reviews) está intocado **pelos concorrentes diretos também** (nenhum player de games tem reviews fortes; o benchmark de 664 reviews é do nicho infantil, Baby Eventos). É terreno vago.

---

## 2. A peça que falta antes do GBP: identidade local no site (NAP anchor)

Todo plano local começa com uma decisão de negócio que nenhuma auditoria levantou: **o negócio precisa assumir publicamente onde fica.**

- **Hoje:** "Atendemos toda a Grande São Paulo" sem base declarada. Isso enfraquece: (a) verificação do GBP (ver §3); (b) consistência NAP para citações; (c) confiança do cliente B2B (RH de empresa que contrata SIPAT pesquisa CNPJ antes de fechar); (d) o schema, que hoje mente apontando para a Praça da Sé.
- **Compliance que vira SEO:** o Decreto 7.962/2013 (lei do e-commerce) e o CDC esperam identificação do fornecedor (razão social, CNPJ, endereço) em sites que ofertam comercialmente. O site é lead-gen, não loja, então o risco prático é baixo — mas o fix é trivial e o subproduto é exatamente o NAP anchor que o SEO local precisa.
- **Ação (meio dia de dev + decisão do dono):** bloco no rodapé e em /contato com razão social, CNPJ, "Base em [bairro], São Paulo — atendemos toda a Grande SP" (basta o bairro/cidade se não quiserem expor a rua), e corrigir o schema: `PostalAddress` com bairro/CEP real, `GeoCoordinates` da base real, `areaServed` unificado com a lista de /contato, `contactPoint` com o WhatsApp. Sem isso, "consertar o geo" (recomendação óbvia das auditorias) é só trocar uma coordenada falsa por outra.

---

## 3. GBP do zero ao "mais avaliado do nicho" — plano operacional

### 3.1 Criar/reivindicar (semana 1 — dono, sem dev, MAS com expectativa honesta)
- Perfil **Service Area Business** (endereço oculto) ou híbrido se houver galpão/escritório apresentável. Categoria primária: **"Serviço de aluguel de equipamentos para festas"**; secundárias: serviço de entretenimento, aluguel de equipamentos audiovisuais.
- **Data de abertura: 1993.** Campo pouco usado do GBP que imprime a longevidade direto no perfil — é o único claim que nenhum concorrente pode copiar, e aqui ele aparece no mapa, não só no site.
- **Caveat de verificação que o parecer de SEO subestimou ("pode começar hoje"):** para SAB novo, o método dominante hoje é **verificação por vídeo** — o Google pede prova de operação real: equipamento em estoque, veículo (idealmente adesivado), documentos com endereço. Um negócio sem fachada e sem endereço no site pode levar semanas e cair em suspensão. Preparar ANTES: bloco NAP no site (§2), documento CNPJ com endereço, vídeo do galpão com as máquinas. O NAP no site é pré-requisito da verificação, não cosmético.
- Preencher: as ~20 áreas de serviço (capital + ABC + Guarulhos + Osasco/Barueri + Cotia + Alphaville/Santana de Parnaíba…), todos os serviços nomeados ("Aluguel de Fliperama", "Aluguel de Videokê"…), aba Produtos com foto por equipamento, fotos reais da galeria (montagens, eventos corporativos — Bradesco/Spotify são prova social também no Maps), horário, link do site **com UTM** (`?utm_source=google&utm_medium=organic&utm_campaign=gbp`) para o GA4/GTM já existente medir o canal.

### 3.2 A máquina de reviews (a vantagem estrutural deste negócio)
Toda venda já termina numa conversa de WhatsApp ativa — o pedido de review tem custo marginal zero e taxa de abertura >90%:
- D+1 a D+2 pós-evento, mensagem do mesmo chat: agradecimento + link curto `g.page/r/…/review` + sugestão de contar **o que alugou e em que bairro/ocasião** (review com keyword+região reforça relevância local; sugerir tema é permitido, incentivar com desconto NÃO é).
- Responder 100% das reviews (sinal de proeminência + o dono aparece vivo).
- **Clientes B2B também avaliam:** o RH que contratou a SIPAT, a agência da ativação. Review corporativo com nome de empresa pesa muito em percepção.
- Meta realista: 33 anos de clientela + fluxo WhatsApp = **50-100 reviews em 12 meses**, suficiente para ser o perfil mais avaliado do nicho de games (hoje ninguém tem nada).

### 3.3 Ideia que ninguém levantou: o equipamento é mídia local
A máquina alugada passa 6-12 horas no meio de uma festa com 30-200 pessoas — convidados, não só o contratante. **Adesivo discreto/QR no equipamento**: "Curtiu? Aluguel de Games · desde 1993 · @alugueldegames · [QR]". O QR pode rotacionar destino (perfil GBP/review para o contratante, site para convidados). É aquisição de marca + reviews + seguidores a custo de uma gráfica. A Mega Power adesiva máquinas com a marca DO CLIENTE para B2B; aqui é o inverso, no B2C, e ninguém do nicho faz.

### 3.4 Cadência (1h/semana do dono, não do dev)
- 2 posts/mês no GBP (sazonal: festa junina abr-jun, confraternização set-dez, SIPAT, volta às aulas) + 4-8 fotos novas/mês vindas dos eventos da semana.
- Pedir permissão de foto na entrega ("podemos postar 1 foto da montagem?") — alimenta GBP, Instagram E as futuras páginas regionais com foto real por cidade. Um fluxo, três canais.

---

## 4. Páginas regionais guiadas por dados que o site JÁ coleta

A recomendação genérica "criar páginas por região" está em 3 documentos. O que falta é **o critério de escolha** — e ele está dentro de casa:

- O formulário de /contato já pede **"Local / Bairro / Cidade"**, e todo orçamento de WhatsApp menciona o endereço do evento. **Ninguém conectou isso à estratégia local.** Ação: tabular 6-12 meses de histórico (planilha simples: cidade/zona × tipo de evento × equipamento) → escolher as 6-8 regiões pela receita REAL, não por chute.
- O mesmo dado vira o **elemento de unicidade** que separa página regional de doorway page: "Já realizamos N eventos em Guarulhos", tempo médio de chegada da base até lá, política de frete da região, foto de evento local (do fluxo do §3.4), bairros/buffets atendidos. Sem esses dados a página não nasce.
- Estrutura: hub `/areas-atendidas/` no rodapé + 6-8 páginas, schema `Service` com `areaServed` + `FAQPage` local ("atendem Alphaville? qual o frete? precisa de tomada 220v no salão?"), no sitemap. Combinação serviço×cidade SÓ para os 2 carros-chefe (fliperama, videokê) nas 2 maiores praças — mais que isso é canibalização e manutenção que 1 dev não sustenta.
- **Sequenciamento honesto:** isso é P2/P3. Antes vêm os fixes de fundação (canonical/sitemap/JSON-LD — sem isso página nova nasce com canonical errado) e o GBP (que não depende de dev nenhum).

---

## 5. Citações e links locais — versão mínima que vale o esforço

- **Mínimo viável (1 tarde):** Bing Places, Apple Business Connect (Apple Maps — grátis e vazio de concorrência no nicho), Apontador, GuiaMais, NAP idêntico no Instagram (bio com "São Paulo · Grande SP · desde 1993" + link) e Facebook (confirmar/criar a página que o sameAs já promete). Formato idêntico ao bloco do rodapé (§2): mesmo nome, mesmo telefone, mesma descrição de área.
- **Links locais com 33 anos de relacionamento:** a empresa certamente tem buffets, espaços de festa e agências parceiras de décadas. Pedir inclusão na página "fornecedores parceiros" de 10 deles (oferecendo reciprocidade na futura página regional: "espaços onde já montamos em Moema: Buffet X…") = links locais reais, impossíveis de replicar por concorrente novo. É o tipo de proeminência que o Whitespark põe no topo e que ninguém constrói porque exige o que só este negócio tem: tempo de praça.
- **Não fazer:** sair cadastrando em 50 diretórios genéricos de SEO. Meia dúzia de citações corretas + reviews + meia dúzia de links de parceiros reais > 50 cadastros lixo.

---

## 6. Métricas e expectativas honestas

- **O que o GBP ganha:** "perto de mim", buscas de marca, map pack na região da base. **O que ele NÃO ganha:** map pack na Grande SP inteira — proximidade do endereço verificado continua pesando, e cadastrar 20 áreas de serviço **não compensa isso** (ver discordância 2). A divisão de trabalho é: GBP+reviews = mapa/proximidade; páginas regionais = orgânico "aluguel de X em [cidade]"; categoria = orgânico "aluguel de X sp".
- Medir: GSC (quando verificarem — pré-requisito de tudo), insights do GBP (ligações, cliques com UTM), e o mais importante: **perguntar a origem no próprio WhatsApp** ("como nos achou?") — com conversão 100% WhatsApp, atribuição manual de 1 pergunta vale mais que qualquer dashboard.
- Horizonte realista: GBP verificado + 20 reviews em 3-4 meses; efeito de map pack local em 2-6 meses; páginas regionais rankeando em 3-9 meses. Quem prometer "perto de mim" em 30 dias está vendendo fumaça.

---

## 7. Discordâncias e caveats (para o debate)

1. **`research/local-seo-br.md` recomenda "ativar chat/mensagens" no GBP — recomendação morta.** O Google **descontinuou o recurso de chat do Business Profile em julho/2024**. O caminho real: telefone do perfil = número WhatsApp-ativo, e o link do site levando ao funil WhatsApp que já existe. Detalhe pequeno, mas mostra que parte da pesquisa foi escrita com playbook pré-2024 — conferir o resto contra a UI atual do GBP antes de executar.
2. **"Cadastrar até 20 áreas de serviço" aparece como ação de alto impacto — é higiene, não alavanca.** Áreas de serviço no GBP afetam exibição/elegibilidade, **não ranking**; a proximidade do endereço verificado segue mandando (a própria pesquisa admite isso no §1.1 e depois contradiz na priorização). Preencher as 20 áreas leva 10 minutos e deve ser feito — mas o impacto vendido pertence às reviews e às páginas regionais, não ao formulário de áreas.
3. **`experts/seo-strategy.md` §6: "GBP pode começar hoje, sem dev" — meia verdade.** Sem NAP no site, sem endereço documentável e sem material para a verificação por vídeo, o cadastro de um SAB trava ou cai em suspensão — e perfil suspenso é semanas de recurso. A ordem certa é: bloco NAP/CNPJ no site (meio dia de dev) → documentação → cadastro. O "sem dev" subestima justamente o passo que destrava o resto.
4. **Cautela com "o local pack aparece antes do orgânico para 'aluguel de fliperama'".** Não consegui verificar o SERP brasileiro daqui (busca US), mas o padrão do nicho nos resultados que vi é forte domínio de orgânico/exact-match (MC Diversões, locacaodefliperama.com.br) — e a pesquisa de concorrentes não menciona nenhum player ganhando por mapa. O local pack importa (e está vago), mas se o painel ordenar investimento como se TODA query do nicho fosse mapa-primeiro, vai superinvestir em GBP e subinvestir nas categorias órfãs — que o parecer de SEO mostrou ser o fix mais barato. Os dois canais são complementares, não substitutos; validar com 5 buscas no celular em SP antes de fechar prioridade.

---

## 8. Top ações da lente local (impacto × esforço)

| # | Ação | Impacto | Esforço | Quem |
|---|---|---|---|---|
| 1 | Bloco NAP no site: razão social, CNPJ, bairro-base + schema com geo/endereço real e areaServed unificado | Alto (destrava GBP, citações, confiança B2B) | Baixo | Dev (0,5 dia) + decisão do dono |
| 2 | Criar/reivindicar GBP (SAB, categoria de party rental, abertura 1993, serviços, produtos, fotos, UTM) | Alto | Baixo (mas verificação pode levar semanas) | Dono |
| 3 | Motor de reviews via WhatsApp D+1 pós-evento (link g.page/r, responder 100%) | Alto | Baixo | Atendente |
| 4 | Minerar formulário/WhatsApp por "Local/Bairro/Cidade" → ranking de regiões por receita real | Alto (define o roadmap regional com dados) | Baixo | Dono (planilha) |
| 5 | Hub /areas-atendidas + 6-8 páginas regionais com dados/fotos reais (após fundação técnica) | Alto | Médio | Dev + dono |
| 6 | QR/adesivo "avalie a gente" no equipamento entregue | Médio | Trivial | Gráfica |
| 7 | Citações mínimas (Bing, Apple, Apontador, GuiaMais) + confirmar/criar Facebook do sameAs + bio IG com cidade | Médio | Baixo | Dono |
| 8 | Links de parceiros: 10 buffets/espaços com página "fornecedores" linkando o site | Médio | Baixo (relacionamento já existe) | Dono |

— Fim do parecer —
