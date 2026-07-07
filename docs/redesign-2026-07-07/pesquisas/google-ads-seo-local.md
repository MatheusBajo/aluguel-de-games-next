# Pesquisa: Google Ads (Quality Score) + SEO Local BR + Arquitetura de Landing Pages

Data: 2026-07-07 · Pesquisador: subagente web (Claude)
Escopo: alugueldegames.com.br (Osasco/SP, locação de games/brinquedos p/ festas e eventos, desde 1993, conversão WhatsApp-first, dono vai rodar Google Ads).

---

## A) Quality Score / Landing Page Experience em 2026

Quality Score continua sendo 3 componentes: **expected CTR + ad relevance + landing page experience**. QS alto = CPC menor e posição melhor com o mesmo lance. O que o Google avalia na landing page em 2026:

1. **Message match (o fator nº 1).** O H1 da página tem que ecoar a keyword/anúncio. Quem busca "aluguel de fliperama SP" e clica num anúncio "Aluguel de Fliperama em SP" precisa cair numa página cujo topo diz exatamente isso, com o fliperama na tela, não na home genérica. Anúncio → página com promessa idêntica = QS sobe, bounce cai.
2. **Mobile UX domina.** ~60% dos cliques de Ads em 2026 são mobile (no nosso nicho, provavelmente mais: público chega por WhatsApp/celular). Página tem que funcionar com uma mão: CTA fixo, sem menu no caminho da conversão, formulário zero (WhatsApp direto).
3. **Core Web Vitals valem pro landing page experience.** LCP < 2.5s, INP < 200ms, CLS < 0.1. Nosso static export Next.js já entrega isso se as imagens do catálogo forem otimizadas (AVIF/WebP, `priority` no hero, dimensões fixas pra não ter CLS). Testar cada LP no PageSpeed Insights mobile antes de ligar campanha.
4. **Transparência e confiança.** Endereço/região atendida, telefone visível, CNPJ no rodapé, política de privacidade, "como funciona" (entrega, montagem, retirada). Google pontua isso explicitamente como "trustworthiness". Casa com a direção do dono: prova real (desde 1993, Bradesco/Spotify/Arnold Classic/Danilo Gentili) em vez de frufru.
5. **Navegação fácil e conteúdo útil.** A LP deve responder as 4 perguntas do cliente na ordem: o que tem → como funciona/quanto custa (ou como orçar) → prova → como chamar. Nada de parágrafo institucional antes disso.

**Conversão WhatsApp no Ads (importante pro dono):**
- Rastrear só o clique no botão do WhatsApp é fraco. Padrão recomendado: evento GTM/GA4 no clique do CTA **com qualificação** (ex.: usuário ficou 20s+ na página OU rolou 20%+) importado como conversão no Google Ads. Depois, evoluir pra conversão offline (marcar no CRM/planilha quem fechou e subir pro Ads).
- O Google tem **message assets de WhatsApp** ("conversation started") disponíveis no Brasil pra Search/PMax: o clique no anúncio já abre a conversa. Vale ativar em paralelo às LPs.
- Link do WhatsApp sempre com `?text=` pré-preenchido citando a página ("Oi! Vi a página de fliperama e quero um orçamento pra [data]") — encurta o atendimento e permite atribuir a origem.

## B) SEO local BR pro nicho de locação pra festas

**Papel do GBP vs site (Whitespark 2026 + fontes BR):**
- **Map pack / Google Maps**: 8 dos 10 principais fatores vêm do próprio Google Business Profile (categoria primária, keywords no perfil, fotos, posts, atributos). Sinais de avaliação = ~20% do peso e subindo (recência, frequência, nota, resposta rápida). Sinais comportamentais (cliques, rotas, ligações a partir do perfil) também rankeiam. **Tradução: o map pack se ganha no GBP, não no site.** Isso valida a decisão de NÃO ter review próprio no site: as avaliações têm que nascer no Google.
- **Busca orgânica local**: aí sim o site manda — conteúdo, on-page, links, autoridade. E em 2026 a "local landing page" do site voltou a pesar inclusive pro pack (o Google cruza site ↔ GBP).
- **NAP consistente** (nome, endereço, telefone idênticos) entre site, GBP e diretórios: inconsistência = sinal de baixa confiança. O (11) 96526-1000 e "Osasco/SP" têm que estar idênticos em tudo.

**Ações GBP (entregar como checklist pro dono, é dele a operação):**
- Categoria primária correta (ex.: "Serviço de aluguel de equipamentos p/ festas") + categorias secundárias.
- Pedir avaliação no fim de TODO evento (QR code/link curto no ato da retirada dos equipamentos) e responder todas. Ritmo > volume.
- Fotos reais de eventos toda semana (algoritmo de "frescor" premia sinal de vida constante).
- Posts com os produtos-âncora (fliperama, videokê, VR) e eventos corporativos feitos.

**Intenções de busca reais do nicho (padrões confirmados nos SERPs BR):**
| Intenção | Exemplos | Página que responde |
|---|---|---|
| Produto + região (transacional, grosso do volume) | "aluguel de fliperama sp", "locação de videokê são paulo", "aluguel de máquina de dança" | Página de categoria/produto |
| Preço (alta intenção, competidores escondem) | "quanto custa alugar um fliperama", "aluguel de videokê preço" | Bloco/FAQ de preço na página do produto + página "quanto custa" |
| Ocasião (B2B e B2C) | "atrações para festa de empresa", "brinquedos para confraternização", "aluguel de videogame para festa infantil", "atrações para SIPAT/feira/stand" | Páginas de ocasião (/empresas, /festas) |
| Genérica de nicho | "aluguel de brinquedos para festa", "locação de games" | Home + catálogo |
| Informacional (funil topo, AI-friendly) | "o que é air game", "fliperama quantos jogos tem", "videokê ou karaokê diferença" | FAQ/conteúdo nas páginas de produto |

**Oportunidade concreta**: os SERPs de "quanto custa" são fracos (todo mundo esconde preço e manda "consulte"). Uma página honesta de faixas de preço/como funciona o orçamento ("valor depende de equipamento, período e região; orçamento em minutos no WhatsApp" + faixas reais confirmadas pelo dono `[PLACEHOLDER: faixas reais]`) tem chance de featured snippet e citação por IA.

**GEO/AEO (site AI-friendly):**
- IAs locais (ChatGPT, Perplexity, AI Overviews) montam resposta a partir de: GBP forte, páginas de serviço com localização explícita, conteúdo em formato de resposta e dados estruturados. Local business tem vantagem: relevância geográfica é sinal direto.
- Implementar JSON-LD: `LocalBusiness` (com `foundingDate: 1993`, `areaServed`, telefone, endereço), `Service`/`Product` por categoria (sem preço fake; `priceRange` genérico ok), `FAQPage` nas páginas com Q&A real, `BreadcrumbList`.
- Q&A com **H3 de pergunta real + resposta direta de 2-4 frases** (não accordion vazio): é o que engines extraem e citam.
- Afirmações factuais citáveis em texto corrido: "A Aluguel de Games faz locação de fliperamas, videokês e games para festas em São Paulo e região desde 1993, com eventos realizados para Bradesco, Spotify, Arnold Classic e Danilo Gentili." Uma frase assim, na home e no /sobre, é exatamente o formato que LLM repete.
- `llms.txt` na raiz com resumo do negócio + links das páginas-chave (custo zero, aposta barata).
- Reddit/UGC responde por ~40% das citações de IA: fora do site, presença em diretórios BR (GetNinjas, Festabox etc.) e NAP consistente ajudam a entrar na base das engines.

## C) Estrutura de landing pages sem virar doorway

**O que o Google pune (doorway)**: páginas em massa quase idênticas trocando só a cidade, criadas pra interceptar query e afunilar pro mesmo lugar. Concorrente MC Diversões faz exatamente isso (`/locacao-de-fliperama-preco-santo-andre` e dezenas de variações) — rankeia hoje, mas é o padrão que o spam update derruba, não copiar.

**Regra prática das fontes**: página local só se ~40-60% do conteúdo for único e específico daquele recorte (fotos de eventos reais na região, logística/prazo de entrega dali, FAQ próprio, depoimento/case dali). Se não tem conteúdo único, não cria a página: **usa segmentação geográfica do próprio Ads** (campanha com raio/cidades) apontando pra página de produto.

**Hierarquia de prioridade (consenso das fontes):**
1. **Por produto/categoria** — obrigatório. É onde o volume transacional está e onde o message match do Ads é perfeito. 1 ad group = 1 página de categoria.
2. **Por ocasião/público** — 2 a 4 páginas no máximo (empresas/corporativo é a de maior ticket; festa infantil/aniversário a de maior volume). Diferenciação real: atrações típicas, formato (monitores, tempo), cases.
3. **Por região** — só onde há justificativa real: Osasco (sede, casa com o GBP), São Paulo capital, e no máximo 2-3 recortes com demanda comprovada (Alphaville/Barueri, ABC). Cada uma com conteúdo único de verdade. **Não** fazer por bairro/zona em massa.

**Anatomia da LP que converte (mobile-first, WhatsApp-first):**
H1 com a keyword → subtítulo com a prova ("desde 1993, +30 anos de eventos") → CTA WhatsApp acima da dobra → grade/fotos reais do equipamento → "como funciona" em 3-4 passos (orçamento → entrega e montagem → festa → retirada) → bloco de preço honesto ou "como calculamos" → prova social (logos Bradesco/Spotify/Arnold Classic/Danilo Gentili + link "avalie no Google") → FAQ (5-8 perguntas reais) → CTA final + telefone. Botão WhatsApp fixo (sticky) no mobile a página inteira.

**Estrutura de campanha casada:** 1 campanha Search por tema (Fliperama, Videokê, VR/Games, Corporativo, Genérica "brinquedos p/ festa"), ad groups por variação de keyword, cada ad group → LP correspondente. Negativar "comprar", "usado", "mercado livre". Extensões: local (GBP linkado), chamada, message asset WhatsApp, sitelinks pras categorias.

---

## Arquitetura recomendada (mapa de páginas)

```
/                               Home: posicionamento + âncoras de categoria + prova (1993, logos) + WhatsApp
/catalogo                       Hub do catálogo (já existe, file-based)
/catalogo/fliperamas            ┐
/catalogo/videokes              │ Páginas de CATEGORIA = LPs primárias do Ads
/catalogo/realidade-virtual     │ (H1 = keyword, FAQ própria, schema Service+FAQ,
/catalogo/consoles-ps5-xbox     │  fotos reais, CTA WhatsApp sticky)
/catalogo/maquina-de-danca      │
/catalogo/maquina-de-pegar-bichinho │
/catalogo/jogos-de-mesa         ┘ (sinuca, pebolim, air game)
/catalogo/[produto]             Detalhe do item (já existe via [...slug])
/empresas                       LP B2B: corporativo/confraternização/SIPAT/feiras (já existe; virar LP de campanha)
/festas                         LP B2C: aniversário/festa infantil/casamento (criar; espelho do /empresas)
/quanto-custa                   Preços/faixas honestas + como orçar (gap dos concorrentes; alvo de snippet/IA)
/como-funciona                  Entrega, montagem, área atendida (já existe)
/regiao/osasco  /regiao/sao-paulo  (+ máx. 2: alphaville-barueri, abc) — só com conteúdo único real
/sobre                          História 1993 + clientes (tempero, não hero)
/galeria /contato               Suporte (já existem)
```

Fontes principais: support.google.com (QS, 6167118), groas.com e get-ryze.ai (LP experience 2026), harmo.me (Whitespark Local Search Ranking Factors 2026), jetlocal.com.br e escoladeseo.com (GBP BR 2026), searchengineland.com (service area pages; WhatsApp conversation started), pete-bowen.com e eduvert.co (tracking WhatsApp como conversão), manningmarketing.com e ricketyroo.com (location vs doorway), johnpaulhernandez.com e harisandcoacademy.com (AEO/GEO 2026), SERPs reais do nicho (mcdiversoes, megapowergames, aluguegames, funplayeventos, upalele).
