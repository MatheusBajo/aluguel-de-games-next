# GEO/AEO — site AI-friendly (pesquisa 07/jul/2026)

Pesquisa web sobre o estado da arte 2025-2026 de sites preparados pra serem lidos, citados e recomendados por ChatGPT, Claude, Perplexity e Google AI Overviews, traduzida em checklist pro site alugueldegames.com.br (Next.js 15 static export, conversão WhatsApp-first, Google Ads entrando).

## TL;DR (veredito)

1. **A oportunidade é real e o mercado está vazio.** 45% dos consumidores já usam IA pra achar negócio local (era 6% um ano antes), mas o ChatGPT recomenda só ~1,2% dos negócios locais e 88% deles não têm estratégia nenhuma. Visitante vindo de busca IA converte ~14% vs ~3% do Google tradicional. Quem estruturar primeiro, leva.
2. **llms.txt NÃO é prioridade.** Evidência de 2026 é contundente: 97% dos arquivos llms.txt recebem ZERO requests (Ahrefs, log de 137k domínios), nenhum provider (OpenAI, Google, Anthropic) suporta oficialmente, e estudo da SE Ranking (300k domínios) não achou correlação com citação em IA. Fazer só como "custa 30 min", nunca como aposta.
3. **O que realmente move:** HTML estático completo (crawlers de IA NÃO executam JavaScript), robots.txt liberando os bots certos, JSON-LD (LocalBusiness/Service/FAQ), conteúdo answer-first (resposta direta de 40-80 palavras logo após heading-pergunta), e presença off-site (Foursquare + Bing Places + GBP alimentam 60-70% das recomendações locais do ChatGPT).
4. **"Desde 1993" é o ativo GEO perfeito:** fato datável, verificável, diferenciador contra todo concorrente. IA cita fatos concretos, não frufru ("qualidade e confiança" é invisível pra LLM).

---

## O que a pesquisa mostrou

### 1. llms.txt / llms-full.txt — hype > realidade

- Adoção subiu 8,8x, mas **97% dos llms.txt recebem zero requests** (Ahrefs, maio/2026, logs de 137k domínios). Bots de IA = 1,1% dos requests ao arquivo.
- **Nenhum provider grande suporta**: OpenAI honra só robots.txt; Google confirmou (Gary Illyes, jul/2025) que não usa e não planeja usar; Anthropic publica o próprio llms.txt mas não declara que o crawler consome o padrão.
- SE Ranking (300k domínios): **zero correlação estatística** entre ter llms.txt e ser citado por IA. Search Engine Land: 8 de 9 sites sem mudança de tráfego após implementar.
- Comparação recorrente na literatura: a meta tag `keywords` dos anos 2000.
- **Decisão pro projeto:** gerar um llms.txt simples no build (índice de páginas + descrição do negócio) porque custa quase nada e não tem downside, mas SEM esperar retorno. Prioridade mínima.

### 2. robots.txt pra crawlers de IA — LIBERAR TUDO

Pra um negócio local que QUER ser citado, a resposta é permitir todas as 3 categorias de bot (treino, busca, user-triggered). Bloquear bot de busca/user tira o site das respostas; cada bot bloqueado custa ~18-34% das citações potenciais naquele motor. Bloquear treino (GPTBot/ClaudeBot) faria sentido só pra quem vende conteúdo — não é o caso: queremos estar DENTRO do modelo.

Frota 2026 (cada token precisa de directive própria — bloquear ClaudeBot não bloqueia Claude-SearchBot):

| Vendor | Treino | Busca/índice | User-triggered |
|---|---|---|---|
| OpenAI | GPTBot | OAI-SearchBot | ChatGPT-User |
| Anthropic | ClaudeBot | Claude-SearchBot | Claude-User |
| Perplexity | — | PerplexityBot | Perplexity-User |
| Google | Google-Extended | (Googlebot normal) | — |
| Meta | Meta-ExternalAgent | — | — |
| Microsoft | — | Bingbot (alimenta ChatGPT search/Copilot) | — |

```
# robots.txt — liberar geral (site quer ser citado)
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: Claude-User
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Perplexity-User
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Meta-ExternalAgent
Allow: /
User-agent: *
Allow: /
Sitemap: https://www.alugueldegames.com.br/sitemap.xml
```

(Excluir do allow: /studio/ do Sanity e rotas administrativas.)

### 3. Crawlers de IA NÃO executam JavaScript (o fato técnico mais importante)

- Análise Vercel+MERJ (500M+ fetches do GPTBot): **zero evidência de execução de JS**. GPTBot baixa arquivos .js (11,5% das vezes) mas não roda. Vale pra GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Meta-ExternalAgent. Só o Googlebot renderiza JS.
- Eles fazem UM fetch do HTML cru, extraem e vão embora. Sem retry, sem wait.
- **Consequência pro nosso stack:** static export do Next.js já entrega HTML pronto (ótimo), MAS componentes client que montam conteúdo pós-hidratação ficam invisíveis. Armadilha concreta: **Radix Accordion/Tabs desmontam o conteúdo fechado por padrão** → FAQ dentro de accordion Radix = invisível pra IA. Usar `forceMount` + esconder via CSS, ou `<details>/<summary>` nativo, ou parágrafos abertos.
- Auditoria simples: `curl https://site.com/pagina | grep "texto importante"` — se não aparece no HTML cru, IA não vê.

### 4. Schema.org / JSON-LD — o que os motores generativos usam de verdade

- Schema rico aparece em **61% das páginas citadas pelo ChatGPT** vs 25% das URLs de SERP tradicional. Estudo CMU/KDD 2024: markup estruturado no top-5 de features correlacionadas com citação.
- Stack pra negócio local de serviço: **LocalBusiness + Service + FAQPage + Organization** (Review/AggregateRating só puxando dado REAL do Google — sem sistema próprio, conforme direção do dono).
- **FAQ rich result morreu no Google (mai/2026), mas o schema FAQPage não**: Bingbot (que alimenta ChatGPT search/Copilot) e PerplexityBot continuam parseando. Consenso 2026: o conteúdo Q&A VISÍVEL no HTML é quem carrega o piano; o schema é seguro barato por cima. Fazer os dois.
- Campos que valem ouro no LocalBusiness: `foundingDate: "1993"`, `areaServed` (Osasco, São Paulo, Grande SP, Alphaville...), `geo`, `telephone`, `openingHours`, `sameAs` (GBP, Instagram, Facebook), `makesOffer`/`hasOfferCatalog` apontando pros Services.
- `dateModified` real (páginas com dateModified <90 dias ganham prioridade em queries temporais).

### 5. Conteúdo answer-first (o formato que a IA cita)

- **72,4% das páginas citadas pelo ChatGPT contêm um "answer capsule"** identificável: resposta autossuficiente de 40-80 palavras logo após um H2 em formato de pergunta. É a commonality mais consistente entre páginas citadas.
- AI Overviews citam do primeiro 30% do conteúdo em 55% dos casos → resposta primeiro, contexto depois (o oposto da página institucional que enrola).
- Estatísticas/números no texto: +22% de visibilidade em IA; citações de fonte: +37% (AirOps 2025). Listas e tabelas HTML são extraíveis; listicles = 43,8% das citações do ChatGPT.
- Receita por seção: H2-pergunta → parágrafo-resposta de 40-80 palavras que se sustenta sozinho → detalhe/tabela → CTA. Cada seção precisa fazer sentido ISOLADA (chunk retrieval).
- Isso casa 1:1 com a direção do dono ("primeiro o que importa pro cliente"): a página answer-first É a página anti-frufru.

### 6. Como usuário chega a negócio local via IA em 2026

- **45% dos consumidores** usam IA pra achar negócio local (7x o ano anterior); faixa 30-44 anos lidera com 64%. IA já é a 3ª fonte de recomendação local (atrás de Google e Facebook).
- **Só 45% de overlap** entre quem ranqueia no Google local e quem aparece em resposta de IA → SEO bom não garante GEO.
- **Fontes do ChatGPT pra local:** 60-70% das recomendações locais vêm da **Foursquare Places API**; camada web usa **índice do Bing / Bing Places**. Gemini usa Google Business Profile. Ou seja: o jogo local se ganha TAMBÉM fora do site (GBP + Bing Places + Apple Maps + Foursquare, NAP consistente).
- Brasil: ChatGPT concentra **78,4% do tráfego de IA** (Perplexity 8,4%, Gemini 5,9%, Copilot 3,8%) → otimizar pro ChatGPT = otimizar pra Bing+Foursquare. Busca com IA já é o canal que mais converte no BR (mediana 7,8%, Leadster Panorama PRO 2026).
- Corroboração multi-fonte: IA confia mais em marca mencionada em vários domínios independentes (listas "melhores de", imprensa local, diretórios de festa/eventos).

---

## CHECKLIST IMPLEMENTÁVEL (Next.js static export)

Formato: `[impacto / esforço]`. Ordem = ordem de execução recomendada.

### Fase 1 — fundação técnica (fazer JÁ, no redesign)

- [ ] **1. robots.txt liberando todos os bots de IA** `[alto / baixo]`
  `app/robots.ts` (funciona com static export) com a lista da seção 2 acima + Sitemap. Excluir /studio/.
- [ ] **2. Auditoria "HTML cru"** `[alto / baixo]`
  `curl` em cada template (home, categoria, item, /empresas, FAQ) e conferir que preço/specs/FAQ/telefone estão no HTML servido. Corrigir qualquer conteúdo que só nasce client-side. Atenção especial: Radix Accordion/Tabs (usar `forceMount` ou `<details>` nativo pra FAQ).
- [ ] **3. JSON-LD LocalBusiness global** `[alto / baixo]`
  No layout: name, url, telephone (+55 11 96526-1000), address (Osasco/SP), geo, `foundingDate: "1993"`, areaServed (Osasco, São Paulo, Grande SP, Barueri/Alphaville, Carapicuíba...), openingHours, sameAs (GBP, Instagram, Facebook, WhatsApp wa.me), image/logo.
- [ ] **4. JSON-LD Service/Product por item do catálogo** `[alto / médio]`
  Gerar no build a partir do metadata.json: um bloco `Service` (ou `Product` com `offers` se tiver preço) por página de item: nome, descrição, imagem, categoria, areaServed, provider → LocalBusiness. Static export gera tudo em build time, custo zero em runtime.
- [ ] **5. Sitemap.xml + canonical + metadata por página** `[alto / baixo]`
  `app/sitemap.ts`, canonical absoluto, title/description únicos e honestos por página (title = resposta, não slogan).
- [ ] **6. FAQPage schema + FAQ visível** `[alto / médio]`
  FAQ em HTML aberto (não escondido em JS) nas páginas-chave + markup FAQPage espelhando EXATAMENTE o texto visível. Perguntas reais de cliente: "Quanto custa alugar um fliperama?", "Vocês entregam e montam?", "Qual área vocês atendem?", "Precisa de tomada especial?", "Com quanto tempo reservar?", "E se o equipamento der problema na festa?".

### Fase 2 — conteúdo answer-first (junto com o redesign das páginas)

- [ ] **7. Answer capsule no topo de cada página de categoria/item** `[alto / médio]`
  Primeiro bloco de texto = 40-80 palavras respondendo "o que é, pra quem, onde, desde quando, como orçar". Ex.: "A Aluguel de Games loca fliperamas para festas e eventos em Osasco e toda a Grande São Paulo desde 1993. A locação inclui entrega, montagem e retirada. Orçamento em minutos pelo WhatsApp (11) 96526-1000." IA extrai isso inteiro.
- [ ] **8. H2 em formato de pergunta + seções autossuficientes** `[alto / médio]`
  Reestruturar copy: cada seção responde uma pergunta e se sustenta sozinha (chunk retrieval). Tabelas HTML pra specs (dimensões, energia, espaço, nº de jogadores, montagem) — dado extraível > adjetivo.
- [ ] **9. Página/bloco de preço honesto** `[alto / médio]`
  IA adora responder "quanto custa". Se preço fixo não dá, publicar faixas reais + o que influencia (duração, distância, quantidade de itens). `[PLACEHOLDER: dono confirma faixas]`. Dobra como landing quality pro Google Ads.
- [ ] **10. Prova = fatos datáveis, zero frufru** `[médio-alto / baixo]`
  Em /sobre e /empresas: "desde 1993 (33 anos)", "mais antiga do segmento na Grande SP", eventos reais nomeados (Bradesco, Spotify, Arnold Classic, Danilo Gentili) escritos como fato citável. Claims quantitativos só honestos: "milhares de eventos" `[PLACEHOLDER: dono confirma se tem número real]`. PROIBIDO contador fabricado (análise jun/2026 já condenou).
- [ ] **11. dateModified real** `[médio / baixo]`
  Schema com dateModified verdadeiro (build injeta data do último commit da página/conteúdo). Não fingir frescor.
- [ ] **12. Landing pages por intenção de busca** `[alto / alto]`
  "aluguel de fliperama SP", "locação de videokê pra festa", "aluguel de brinquedos pra festa de empresa" etc., cada uma answer-first + FAQ + CTA WhatsApp. Serve Ads (quality score) e GEO ao mesmo tempo. Conteúdo genuíno por página, sem template com swap de palavra.

### Fase 3 — off-site (tarefa do dono, mas decisiva pra IA local)

- [ ] **13. Google Business Profile completo** `[alto / baixo]`
  Categoria certa, 20+ fotos, lista de serviços, horários, posts 1-2x/semana. Alimenta Gemini/AI Overviews. Reviews continuam vivendo lá (direção do dono).
- [ ] **14. Bing Places + Foursquare + Apple Maps** `[alto / baixo]`
  60-70% das recomendações locais do ChatGPT saem da Foursquare; camada web usa Bing. Criar/reivindicar os 3 com NAP idêntico ao site e ao GBP. Provavelmente o item de maior ROI-por-hora de toda a lista.
- [ ] **15. NAP consistente em tudo** `[alto / baixo]`
  Nome, endereço, telefone idênticos: site (footer + schema), GBP, Bing, Foursquare, Apple, Facebook, Instagram.
- [ ] **16. Menções de terceiros** `[médio / alto]`
  Aparecer em listas "melhores locação de brinquedos pra festa SP", diretórios de fornecedores de eventos, imprensa local de Osasco. Corroboração multi-fonte = confiança da IA. Longo prazo.

### Fase 4 — opcional/baixa prioridade

- [ ] **17. llms.txt gerado no build** `[baixo / baixo]`
  Markdown com descrição do negócio + índice de páginas, gerado do metadata.json. Sem expectativa (97% recebem zero requests; nenhum provider suporta). Fazer por custar 30 min, não por retorno.
- [ ] **18. Monitorar citação em IA** `[médio / baixo]`
  1x/mês perguntar a ChatGPT/Perplexity/Gemini "aluguel de fliperama pra festa em Osasco/SP" e registrar se/como a empresa aparece. Baseline antes do redesign pra medir efeito.

## O que NÃO fazer

- ❌ Bloquear GPTBot/ClaudeBot/PerplexityBot "por segurança": mata a citação.
- ❌ Números fabricados (contador por hash, reviews inventadas): já condenado na análise de jun/2026 e LLM cruza fontes.
- ❌ Sistema de review próprio no site: avaliação vive no Google Maps/GBP (direção do dono).
- ❌ Texto institucional ("qualidade, segurança e confiança"): invisível pra IA e pra humano.
- ❌ Apostar em llms.txt como estratégia.
- ❌ FAQ só dentro de accordion client-side sem o texto no HTML inicial.

## Fontes principais

- [Ahrefs — What is llms.txt (evidência 97% zero requests)](https://ahrefs.com/blog/what-is-llms-txt/)
- [PPC Land — llms.txt adoption 8.8x but 97% zero requests](https://ppc.land/llms-txt-adoption-rises-8-8x-but-97-of-files-get-zero-ai-requests/)
- [Anagram — AI Crawlers Explained 2026 (user-agents, robots.txt)](https://www.anagram.ai/blog/ai-crawlers-explained-gptbot-claudebot-perplexitybot-and-how-to-let-them-in-2026)
- [Digital Applied — AI Crawler Access Control decision matrix](https://www.digitalapplied.com/blog/ai-crawler-access-control-2026-robots-llms-txt-decision-matrix)
- [Vercel — The rise of the AI crawler (JS não executa)](https://vercel.com/blog/the-rise-of-the-ai-crawler)
- [Lantern — AI Crawlers Do Not Render JavaScript](https://www.asklantern.com/blogs/ai-crawlers-do-not-render-javascript)
- [EvolveAMZ — Local Business AI Search Playbook 2026 (Foursquare/Bing/trust stack)](https://evolveamz.com/local-business-ai-search-guide/)
- [MarketersMedia — 45% dos consumidores usam IA pra negócio local](https://news.marketersmedia.com/45percent-of-consumers-now-use-ai-to-find-local-businesses-heres-what-that-changes/89195019)
- [PingPrime — Answer-First page structure (72,4% answer capsule)](https://www.pingprime.ai/en-be/blog/page-answer-first-ia)
- [AirOps — Question-based headings / ChatGPT content structure](https://www.airops.com/blog/question-based-headings-ai-citations)
- [SEO Strategy UK — FAQ schema após deprecação mai/2026](https://www.seostrategy.co.uk/learn/faq-schema-deprecation-2026-rich-result-vs-schema/)
- [Google — LocalBusiness structured data docs](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- [Stackmatix — Structured data & AI search (61% vs 25% schema em páginas citadas)](https://www.stackmatix.com/blog/structured-data-ai-search)
- [Full Services — Busca com IA no Brasil 2026 (ChatGPT 78% do tráfego IA)](https://full.services/estado-da-busca-com-ia-no-brasil-2026/)
