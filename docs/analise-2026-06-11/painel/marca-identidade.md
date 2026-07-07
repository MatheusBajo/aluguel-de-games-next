# Parecer de Especialista — Marca e Identidade
**Site:** alugueldegames.com.br · **Data:** 2026-06-11
**Lente:** branding, identidade visual e verbal, naming, equity de marca
**Material visto:** screenshots (home, 404, sobre, galeria, empresas, catálogo, produto, desktop+mobile), arquivos de logo no repositório, auditorias home-hero / static-pages / nav-conversion / catalog-data, pesquisas competitors-br e design-trends.

---

## Diagnóstico central: a marca está invertida

Esta empresa tem três ativos de marca que NENHUM concorrente pesquisado tem juntos:
1. **33 anos (desde 1993)** — mais antiga que todos: Freitas (30), Mega Power (28), MC (22), Fun Play (20), Alugue Games (11), TDB (sem idade declarada).
2. **Prova social de elite**: Bradesco/Braland, Spotify, Danilo Gentili, Arnold Classic, Kay Black.
3. **Uma estética arcade/neon executada acima da média do setor inteiro** (o concorrente médio tem contador "0+", "R$ 0" no hero e SSL quebrado).

E o site faz o oposto do que deveria com cada um:
- A **antiguidade** vira uma linha pequena de texto e um contador que buga em "0+".
- A **prova real** (Bradesco, Spotify, Gentili) vive escondida em legenda de carrossel que troca a cada 3,5s e em tooltip de hover que não existe no mobile.
- No lugar dela, o site **promove prova inventada**: badges "110+/160+ locações" gerados por hash determinístico (`src/lib/sales-utils.ts` — confirmado no código: FNV-1a sobre o slug, mín. 100, máx. "200+"), badge falsa de notificação "1" no botão flutuante, "Online · Pronto pra atender" às 3h de domingo, "500+ eventos" (15/ano em 33 anos — número que SUBVENDE), "98%/100% satisfação" sem fonte.

**Para uma marca cuja única narrativa defensável é "somos os mais antigos e confiáveis do mercado", números fabricados são veneno lento.** A mãe não percebe; o comprador de RH que compara três fornecedores percebe. E quando percebe um número falso, desconta TODOS os outros — inclusive o "desde 1993", que é verdadeiro.

---

## 1. O logo: o ponto onde a marca quebra

Vi os arquivos: `public/carro-logo-aluguel-de-games.png` e `public/Logo-Aluguel-de-games.png`.

**O conceito está certo. A execução está errada.** O caminhão carregando um fliperama é, conceitualmente, o negócio inteiro em um ícone: "a gente leva o fliperama até a sua festa". Isso é raro — a maioria dos concorrentes usa controle de videogame genérico. Não joguem o conceito fora.

A execução, porém, é clipart de 2009: olho "googly" no para-brisa, controle de PS4 fotorrealista colado num desenho flat, adesivo de karaokê desproporcional, e a versão wordmark em **fonte verde casual sobre degradê laranja/amarelo** dizendo "Aluguel de Games **& Karaokê**" — um nome que o resto do site nem usa. O site parece 2026; o logo parece banner de Mercado Livre.

Onde isso dói de verdade:
- **`Logo-Aluguel-de-games.png` (1000×1000, laranja) é a OG image global** (`site.config.ts:35`, `page.tsx:48`, fallback do catálogo). Ou seja: **toda vez que alguém compartilha o site no WhatsApp — o único canal de conversão — o preview é o clipart laranja**, anulando 100% do trabalho de identidade dark/neon. É o touchpoint de marca mais visto e o pior executado.
- É também o favicon (.ico), o ícone do manifest e o `logo` do JSON-LD — ou seja, é a cara da marca no Google.

**Recomendação:** redesenho do mark mantendo o caminhão+fliperama, em traço flat/neon monocromático (funciona em verde-WhatsApp, branco e roxo-neon), com lockup "ALUGUEL DE GAMES · DESDE 1993". Um designer freelancer resolve; o dev troca 5 referências de arquivo. Antes disso (esta semana): gerar uma OG 1200×630 com foto real de evento + lockup atual + "desde 1993" — custo de uma tarde, impacto em todo compartilhamento.

## 2. "Desde 1993" precisa virar dispositivo de marca, não estatística

Hoje 1993 aparece como: linha de texto pequena no hero ("★ Desde 1993 · Grande SP"), contador "33+" (que reseta pra "0+" no bug do Counter), rodapé, e — surpreendentemente — no lugar mais inspirado do site: o 404, que assina **"© ALUGUEL DE GAMES · PLAYER 1 · SINCE 1993"**.

O medo de "gritar antiguidade e parecer datado" tem uma solução que o próprio site já descobriu sem perceber: **retrô é o gênero da marca**. Uma locadora de fliperamas é a única categoria de negócio onde "somos de 1993" é literalmente o produto — 1993 é a era de ouro do arcade (Street Fighter II, Mortal Kombat). Não é "empresa velha"; é "a gente estava lá quando o fliperama era a esquina". Conteúdo retrô dentro de container moderno (o site atual) nunca parece datado — parece curadoria.

Concretamente:
- **Selo pixel "SINCE 1993"** (estilo badge de high-score, como o 404 já faz) ao lado do logo no header/footer e nos cards de proposta B2B.
- **/sobre tem storytelling ótimo ("Cinco capítulos. Uma só história.") mas zero fotos.** Uma única foto de arquivo dos anos 90 — o caminhão antigo, uma nota fiscal de 1993, um fliperama original — vale mais que os 4 contadores somados. É prova infalsificável: nenhum concorrente consegue copiar.
- **Lockup verbal padrão**: "Aluguel de Games · desde 1993" em title, OG, assinatura de WhatsApp do atendente. Isso também mitiga o problema do nome genérico (ver §5).

## 3. Anistia geral dos números inventados

Proposta de política de marca em uma frase: **nenhum número no site que o dono não consiga defender numa ligação de procurement do Bradesco.**

Remover/substituir:
| Hoje | Problema | Substituto |
|---|---|---|
| "110+/160+ locações" por card (hash) | Fabricado; padrão repetitivo entrega o truque | Badge real só onde há dado ("Top 10 mais pedidos" curado pelo dono) ou nada |
| Badge "1" no WhatsApp float | Dark pattern reconhecível | "Resposta rápida" |
| "Online · Pronto pra atender" estático | Falso fora do horário | Condicionar ao horário ou "Respondemos em minutos no horário comercial" |
| "500+ eventos" / "98%" / "100% satisfação" | Subvende E não tem fonte | "33 anos · milhares de festas" + link Google Reviews real + 3 depoimentos com nome |
| Contadores que resetam pra "0+" | Pior vitrine possível dos números | Fix do Counter (nunca resetar a zero) |

E promover o que é real: mover Bradesco/Spotify/Gentili/Arnold Classic de legendas rotativas para uma **faixa fixa "Quem já jogou com a gente"** na home e em /empresas — em texto nomeado + foto do evento (sobre uso de logos, ver discordância D3).

## 4. Dark/neon: manter e defender — com uma válvula de calor humano

A pergunta do briefing era "o tom dark afasta o público mãe/RH ou diferencia?". Resposta: **diferencia — e é o maior ativo visual da marca** (validado pela referência Arcade Club no nicho exato; concorrentes diretos têm sites visualmente amadores). Abandonar ou diluir com toggle claro seria destruir a única identidade visual memorável do setor, para um dev solo manter dois temas.

O que de fato afasta a mãe não é o fundo escuro — é a **ausência de gente nas fotos**. O site mostra equipamento parado e eventos corporativos; a mãe precisa ver criança rindo num pula-pula e adolescente no Just Dance. Receita:
- Direção de fotografia: priorizar fotos de **pessoas jogando** (o acervo de vídeos de WhatsApp em /demonstra mostra que esse material existe).
- Cards de produto com a foto em superfície clara/elevada (padrão Steam/PlayStation Store) — resolve "equipamento flutuando no escuro" sem sair do tema.
- A jornada infantil (Infláveis/Infantil) pode rodar 10% mais quente — gradientes rosa/laranja nos acentos, mesma estrutura — sem fork do tema.

## 5. Naming: o nome é genérico; o produto é jargão interno

**Nome da empresa.** "Aluguel de Games" é categoria, não marca — e o mercado é um pântano de sósias: Alugue Games, Aluga Videogames, Aluga Play, TDB Games. No boca-a-boca por WhatsApp ("aluguei com a aluguel de games") a confusão é garantida. NÃO recomendo renomear (domínio exact-match + 33 anos de equity + orçamento limitado), mas recomendo **nunca pronunciar o nome sem o sobrenome**: "Aluguel de Games · desde 1993". O ano é o sobrenome que nenhum sósia pode usar.

**Nome dos produtos.** "Fliperama de 11.000" — 11.000 o quê? Para o dono é óbvio (jogos); para a mãe pode ser preço, modelo ou peso. Pior: 4 fliperamas (a categoria-bandeira!) têm descrição VAZIA. A UPALÊLÊ usa "+ de 12.000 jogos" no título justamente porque o número com unidade é gancho de SERP. Fórmula de naming benefício-primeiro:
- "Fliperama de 11.000" → **"Fliperama Retrô — 11 mil jogos em 1"**
- "Fliperama SF4 e KOF XIII" → "Fliperama de Luta — Street Fighter & King of Fighters"
- "Maquina Boxe" → "Máquina de Boxe — Medidor de Força" (e corrigir acentos/espaços duplos das pastas)
- "Mesa Liftime" → corrigir typo ("Lifetime")
- Karaokês: separar os modelos (Pop 300, Matrix, VMP 2500) hoje fundidos num produto só com 42 fotos — long-tail de SEO e clareza.
Regra: o nome deve responder "o que meu convidado vai ver na festa?".

## 6. A página 404 é a pedra de roseta da voz da marca

"ESSE LEVEL NÃO EXISTE", barra de HP, "INSERT COIN — WHATSAPP", "RESTART", "PLAYER 1 · SINCE 1993". É a melhor peça de branding do site inteiro — confiante, literal ao negócio, engraçada sem ser infantil — e está escondida na página de erro. Nenhum concorrente tem voz; todos falam "corporativês de orçamento".

Recomendo extrair dela um **mini-guia de voz** (1 página) e aplicar em microcopy de custo zero: estado de sucesso do formulário ("LEVEL UP! Orçamento enviado"), estados vazios do catálogo, loading, labels de seção (o site já usa "· VAMOS JOGAR?"), assinatura do rodapé. Cuidado: voz arcade no MICROCOPY, nunca no CTA principal — "Pedir orçamento" deve continuar sendo "Pedir orçamento" (clareza > graça no ponto de conversão).

---

## Discordâncias com as auditorias (para o debate)

**D1 — "Dark mode prejudica conversão/confiança corporativa" (design-trends §1).** A pesquisa NN/g citada vale para leitura longa e e-commerce mainstream. Aqui o dark/neon é coerência de categoria (arcade) e o ÚNICO diferencial visual num mercado de sites quebrados. Implementar toggle claro/escuro, como a pesquisa sugere ser "tendência", é custo permanente de manutenção dobrada para um dev solo e dilui a marca. Corrijam fotografia e contraste; não toquem no tema.

**D2 — "500+ eventos é subestimado, número deveria ser maior" (home-hero §5, static-pages).** As auditorias acertam o sintoma e erram o remédio implícito: trocar 500 por 1.700 estimados é repetir o pecado original (número inventado, só que maior). A correção de marca é substituir agregados não-auditáveis por prova verificável: link de Google Reviews, eventos nomeados com data, depoimentos com nome. Um número honesto que a empresa consiga defender — ou nenhum.

**D3 — "Colocar logos de Bradesco/Spotify no hero converteria muito mais" (home-hero §5, static-pages §4).** Cuidado: usar logomarca de terceiro como endosso sem autorização é risco jurídico/relacional real para uma empresa pequena (o Bradesco tem mais advogado que o setor inteiro tem funcionário). Caminho seguro e quase tão forte: citação nominal em texto + foto do evento real ("Braland — convenção Bradesco, 2024"), e pedir autorização formal para os 3-4 logos principais. A foto do evento é prova mais crível que o logo, aliás.

**D4 — Auditorias tratam o badge de "locações" como social proof a melhorar; nenhuma o nomeia como problema de integridade.** O catalog-data nota que `locacoes` (override real) nunca é usado, e o nav-conversion pega a badge "1" falsa — mas ninguém conectou o padrão: locações por hash + "Top 10 mais alugados" rankeado por posição (não por dado) + "Online" estático + "98%" formam um SISTEMA de prova fabricada. Visto de fora, isso não é um detalhe de UX; é a marca apostando contra seu próprio ativo principal (confiança de 33 anos). Deveria ser tratado como item único, prioritário, e não como cinco bugs menores.

---

## Top de recomendações (impacto × esforço, pensando em 1 dev + orçamento curto)

| # | Ação | Impacto | Esforço |
|---|---|---|---|
| 1 | OG image 1200×630 real (foto de evento + lockup + "desde 1993") substituindo o clipart laranja em todos os usos | Alto | Trivial |
| 2 | Anistia dos números inventados + promoção da prova real (faixa "Quem já jogou com a gente") | Alto | Baixo |
| 3 | Lockup "Aluguel de Games · desde 1993" + selo pixel SINCE 1993 (header, footer, titles, assinatura WhatsApp) | Alto | Baixo |
| 4 | Redesenho do logo mantendo o caminhão (flat/neon, sem "& Karaokê") + favicon/ico/manifest | Alto | Médio (gasto único c/ designer) |
| 5 | Renaming benefício-primeiro dos produtos + descrições dos 4 fliperamas vazios + separar videokês | Médio-Alto | Médio |
| 6 | Foto de arquivo anos 90 na /sobre + 2-3 na home (prova infalsificável da antiguidade) | Médio-Alto | Baixo (esforço do dono, não do dev) |
| 7 | Guia de voz derivado do 404 aplicado a microcopy (form, estados vazios, labels) | Médio | Baixo |
| 8 | Direção de fotografia humana (gente jogando) + cards de produto em superfície clara | Alto | Médio-Alto (contínuo) |

**Síntese em uma frase:** parem de fabricar prova que não precisam e comecem a exibir a prova que só vocês têm — 1993, Bradesco, Spotify, Gentili — dentro da estética arcade que já é a melhor do mercado; e não deixem o clipart laranja de 2009 ser a primeira coisa que o cliente vê no WhatsApp.
