# BRIEF DEFINITIVO — Redesign Aluguel de Games (07/07/2026)

Autor: estrategista-chefe (síntese de 6 relatórios: diff antigo vs opus-4.8, consenso jun/2026, GEO/AI-friendly, Ads+SEO local, concorrentes BR, referências internacionais).
Escopo: este documento é o contrato que **as duas versões de design** devem satisfazer. Tudo em "Requisitos obrigatórios" é gate de aprovação (falhou 1 = reprova). O resto é direção recomendada com liberdade de execução.

**Tese em uma frase:** o site é a brochura de um vendedor que atende no WhatsApp; ele ganha quando entrega ao cliente, no celular, em um scroll: o que tem → como funciona/como orçar → prova verificável ("desde 1993" + Bradesco/Spotify/Arnold Classic/Gentili) → botão verde com mensagem pronta. E ganha o jogo de 2026 quando esse mesmo conteúdo, servido em HTML cru + JSON-LD, vira a fonte que ChatGPT/Perplexity/AI Overviews citam num nicho onde NENHUM concorrente tem preparo GEO (terreno 100% vago, confirmado em 9 sites fetchados em jul/2026).

---

## 1. REQUISITOS OBRIGATÓRIOS (gates de aprovação)

### 1.1 Des-fabricação — pré-condição, não feature (herança executável do consenso jun/2026)
- [ ] **Deletar `src/lib/sales-utils.ts`** e os 3 render points do contador fake de "locações" por hash FNV-1a: `CatalogCard.tsx:96`, `TopToys.tsx:347`, `CarouselModal.tsx:85-86`. Remoção NÃO espera substituto ("não se faz A/B de desonestidade").
- [ ] **Remover badge "1" bouncing** do `WhatsAppFloat.tsx:78-80` (notificação falsa).
- [ ] **Remover "98% satisfação"** (`Main.tsx:118`) e qualquer % sem fonte.
- [ ] Substituto no pixel: atributo real do produto ("2 jogadores · 1,8m · 220V") ou 3 fatos verificáveis ("Entrega e montagem incluídas · Equipamento testado · Contrato e NF").
- [ ] "500+ eventos" SUBVENDE 33 anos → trocar por claim qualitativo honesto "milhares de eventos" `[PLACEHOLDER: dono confirma se existe número real]`. `aggregateRating` só quando houver reviews reais (continua removido). Contador `Counter` nunca renderiza "0+".
- [ ] PROIBIDO: sistema de reviews próprio no site (avaliações vivem no Google/GBP; site exibe/linka), "Online" perpétuo, número inventado em qualquer forma.

### 1.2 Conversão WhatsApp + telefone (item nº1 unânime do painel: 8 lentes + 4 personas + 4 críticos)
- [ ] **Prefill em 100% dos CTAs de WhatsApp** via componente único `<WhatsAppCta>` sobre `whatsapp.config.ts`: anchor real, `?text=` contextual por superfície (produto: "Oi! Vi o *Fliperama Snack* no site…"; categoria; home; /empresas; kit), roteiro com lacunas ("Data: ___ / Bairro: ___ / Convidados: ___"), tracking GA4, fallback `tel:`. Linguagem humana, nunca código de rastreio. (Fun Play já faz prefill por produto; ser melhor que ele.)
- [ ] **Telefone é conversão de 1ª classe:** "ou ligue (11) 96526-1000" junto a todo CTA principal, `tel:` rastreado. Se houver form (/contato, /empresas): telefone OBRIGATÓRIO, e-mail opcional, pós-envio abre wa.me pré-preenchido.
- [ ] **Carrinho de orçamento → WhatsApp** (padrão Goodshuffle Wishlist, 100% client-side/localStorage, zero backend): "+ Adicionar ao orçamento" nos cards, drawer com data (obrigatória)/bairro/tipo de festa, CTA gera wa.me multi-linha. É o multi-item SEM carrinho de e-commerce; os KITS usam o mesmo mecanismo.
- [ ] Mobile: CTA sticky de orçamento na página de produto (o design deve resolver a convivência com galeria touch e com o float — pergunta em aberto (d) do consenso). Verde = cor EXCLUSIVA de ação WhatsApp.

### 1.3 SEO técnico (quebras binárias primeiro)
- [ ] **UMA fonte de sitemap.** Hoje há 3 concorrentes: `app/sitemap.ts` (gera URLs cruas com acento/espaço → 404), postbuild `next-sitemap`, `public/sitemap.xml` commitado (correto porém stale de abril). Decidir 1 dono, slugs normalizados (NFC), TODAS as rotas (/empresas, /galeria, /como-funciona incluídas), matar o resto.
- [ ] **Consertar `public/robots.txt`** (backticks literais corrompem o arquivo nos 2 branches) ou deletar em favor de `app/robots.ts`.
- [ ] JSON-LD **server-side** (`<script>` no HTML, não next/Script): EntertainmentBusiness/LocalBusiness com `@id`, `foundingDate: "1993"`, NAP, geo, `areaServed` (Osasco + Grande SP), `openingHours`, `sameAs` (GBP/Instagram/wa.me), `hasMap` → Google Maps; Offer com `businessFunction: LeaseOut`; CollectionPage+ItemList em categoria; BreadcrumbList; FAQPage onde houver FAQ visível; grafo sem duplicação (manter o padrão do opus-4.8).
- [ ] Canonical absoluto por página; host www unificado (.htaccess 301 já existe, manter); titles transacionais "Aluguel de {Produto} para Festas e Eventos" (keyword na frente); OG 1200x630 real (WhatsApp = SERP do dark social); `verification.google` real quando o dono verificar o GSC (nunca placeholder no HTML).
- [ ] Hero renderiza no HTML estático e pinta SEM JS (CSS-first; `opacity:0` não conta pra LCP). Nada de `ssr:false` em conteúdo above-the-fold (regressão proibida — era o maior defeito do main).
- [ ] Categoria linkada dos headings do /catalogo (maior ganho sem escrever conteúdo).

### 1.4 GEO / AI-friendly (direção nova do dono; mercado vazio = quem estruturar primeiro leva)
- [ ] **robots liberando TODOS os bots de IA** (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Meta-ExternalAgent; cada token com directive própria), excluindo /studio/. Cada bot bloqueado ≈ −18-34% de citações naquele motor.
- [ ] **Regra do HTML cru:** crawlers de IA NÃO executam JS (Vercel: 500M fetches do GPTBot, zero JS). Todo preço/spec/FAQ/telefone/answer capsule precisa existir no HTML servido. Armadilha concreta: Radix Accordion/Tabs desmontam conteúdo fechado → FAQ usa `<details>/<summary>` nativo ou `forceMount` + CSS. Teste de aceite: `curl $URL | grep "texto-chave"` em cada template.
- [ ] **Answer capsule** (40-80 palavras, o-que/pra-quem/onde/desde-1993/como-orçar) como primeiro bloco de texto de home, categorias, /empresas, /festas, /quanto-custa, /como-funciona (72,4% das páginas citadas pelo ChatGPT têm esse formato; AI Overviews citam do primeiro 30% do texto).
- [ ] H2/H3 em formato de pergunta + seções autossuficientes (chunk retrieval) + **tabelas HTML de specs** (dimensões, tomada 110/220, nº jogadores, espaço, passa em porta/elevador) — dado extraível > adjetivo. Nenhum concorrente publica specs; é a pergunta nº1 de quem mora em apartamento.
- [ ] FAQ visível + FAQPage schema espelhando o texto, por página-chave e ESPECÍFICO da página (não /faq genérico). Perguntas das personas: chuva, sinal/cancelamento, duração+hora extra, horário de montagem, elevador/escada, tomada, idade, garantia de substituição/técnico.
- [ ] Frase factual citável na home e /sobre: "A Aluguel de Games loca fliperamas, videokês e games para festas em Osasco e Grande São Paulo desde 1993, com eventos realizados para Bradesco, Spotify, Arnold Classic e Danilo Gentili." (formato que LLM repete). `dateModified` real no schema.
- [ ] llms.txt gerado no build: fazer por custar 30 min, expectativa ZERO (97% recebem zero requests; nenhum provider suporta). Nunca como aposta.
- [ ] Checklist off-site pro dono (fora do design, mas entregável do projeto): GBP completo + Bing Places + Foursquare + Apple Maps com NAP idêntico (60-70% das recomendações locais do ChatGPT vêm da Foursquare; no BR ChatGPT = 78% do tráfego de IA → otimizar Bing+Foursquare). Pedir review Google no fim de cada evento. Baseline mensal: perguntar às IAs "aluguel de fliperama Osasco/SP" e registrar.

### 1.5 Landing quality pra Google Ads
- [ ] **Message match:** 1 ad group : 1 página; H1 = keyword da campanha; o produto anunciado visível no 1º viewport. Destinos de campanha: páginas de CATEGORIA (primárias), /empresas, /festas, /quanto-custa, kits.
- [ ] Anatomia obrigatória da LP (mobile, ~60%+ dos cliques): H1 keyword → sub com prova "desde 1993" → CTA WhatsApp acima da dobra + tel → fotos reais → como-funciona 4 passos → bloco de preço honesto ou "como calculamos" → prova (nomes reais + link "avalie no Google") → FAQ → CTA final. Botão sticky a página toda.
- [ ] CWV nas LPs: LCP < 2.5s, INP < 200ms, CLS < 0.1 (imagens AVIF/WebP com dimensões fixas, batch sharp one-off; testar PageSpeed mobile antes de ligar campanha).
- [ ] Transparência = quality score: região atendida, telefone visível, **CNPJ + NAP + LGPD/privacidade no footer** (também destrava GBP e pré-homologação B2B).
- [ ] Tracking fechado ANTES de mídia paga (regra S1 herdada): clique WhatsApp qualificado (20s+ na página) como conversão GA4→Ads + message assets nativos de WhatsApp em paralelo; medir por reconciliação GA4 × etiquetas WhatsApp (sem A/B de micro-copy: tráfego SMB não atinge significância).
- [ ] `.htaccess` com redirects de slugs curtos de campanha (/fliperama, /videoke, /vr…) mantido.

### 1.6 Preço = escada de risco (CDC art. 30; não re-decidir)
- [ ] Página **/quanto-custa** ("Quanto custa? Entenda o orçamento") = intenção de busca nº1 sem dono no nicho (7 de 9 concorrentes escondem preço) + alvo de featured snippet e citação IA. Publica: o que influencia o preço, período padrão da diária (mata a pergunta nº1), faixas `[PLACEHOLDER: dono confirma]`.
- [ ] Pisos "a partir de R$" SÓ com compromisso escrito do dono (piloto 2 categorias/60 dias). Preço fechado é mais seguro em KITS (escopo fixo).
- [ ] O design entrega **as DUAS versões** de card/página (com e sem preço) sem nenhuma parecer quebrada; se preço entrar, a hierarquia do card é redesenhada deliberadamente (não badge enfiada — o "R$ 0" do concorrente é o anti-padrão).

### 1.7 Prova social honesta + anti-frufru + mobile-first (regras transversais)
- [ ] Trust strip verificável no hero (padrão GameTruck): "Desde 1993 · milhares de eventos · Bradesco, Spotify, Arnold Classic, Danilo Gentili" + nota real do Google linkando o Maps `[PLACEHOLDER: dono confirma nota/link]`. Nomes em TEXTO; logo-wall só com autorização formal.
- [ ] "Desde 1993, a mais antiga do segmento na Grande SP" bate TODOS (Dalbrin 31, Freitas 30, Mega Power 28, MC 22, Fun Play 20, Alugue Games 11): usar em title/OG/hero/junto de cada botão verde. Ângulo de copy disponível: "mais antiga que o PlayStation".
- [ ] Galeria POR EVENTO com contexto (padrão PartySlate): álbum nomeado "Spotify, 2024 · 6 máquinas" — nenhum concorrente tem portfólio navegável.
- [ ] Garantia anti-risco explícita, redigida com o dono a partir do que ele JÁ pratica ("defeito? trocamos ou técnico no local" + política de chuva/reagendamento). Formalizar, não inventar.
- [ ] Zero frufru: nenhuma seção "missão/visão/valores", nenhum "qualidade e confiança". História 1993 = tempero em /sobre, nunca abre página. Ordem fixa de qualquer página: o que tem → quanto custa/como orçar → como funciona → prova → CTA.
- [ ] Mobile-first real: texto ≥12px SEMPRE (Top 10 estava em 6,7px), abolir `text-muted-foreground/40-60` informativo, touch targets confortáveis, legenda do hero dentro do scrim ("Aniversário do Danilo Gentili" é a melhor prova social do site), `prefers-reduced-motion` como gate.
- [ ] Dark/neon mantido (consenso; sem toggle claro). Corolários: LQIP/cor dominante obrigatório em TODA imagem (imagem sem placeholder no dark lê como quebrada), zero vazios de 300-500px, 404 arcade e dual CTA mantidos.

## 2. ARQUITETURA DE INFORMAÇÃO

```
/                         Home: hero server-rendered (badge 1993 + H1 + carrossel) → CTA dual →
                          trust strip → KITS (curadoria antes do paredão) → fileiras Netflix →
                          Top 10 (sem contador fake) → frase citável + link /sobre
/catalogo                 Hub (+ headings linkando categorias)
/catalogo/{categoria}     7 LPs primárias de Ads: fliperamas, videokes (UMA página forte, SEM split
                          em SKUs), realidade-virtual, consoles-ps5-xbox, maquina-de-danca,
                          maquina-de-pegar-bichinho, jogos-de-mesa — cada uma com answer capsule,
                          FAQ própria, Service+FAQPage schema, CTA sticky
/catalogo/[produto]       Detalhe: ficha técnica em tabela, galeria, FAQ do item, sticky CTA,
                          "+ Adicionar ao orçamento"
/empresas                 B2B (existe; elevar): PDF "kit aprovação interna", CNPJ, guia de
                          dimensionamento 50/150/400 pessoas, aviso honesto de agenda nov/dez,
                          case Bradesco/Arnold — campanha própria
/festas                   NASCE: espelho B2C (aniversário/infantil/família: bodas, 60-70-80 anos)
/quanto-custa             NASCE: gap nº1 do mercado (ver 1.6)
/como-funciona            Existe; elevar a referência do nicho: passos numerados com prazos reais,
                          sinal, defeito/chuva, HowTo schema
/sobre /galeria /contato  Existem; /sobre = fatos datáveis, /galeria = álbuns por evento
/regiao/{osasco,sao-paulo} MÁXIMO 4 (+alphaville-barueri, abc), SÓ com 40-60% de conteúdo único
                          real; senão geo-targeting do Ads pra categoria (anti-doorway; o padrão
                          MC Diversões é alvo de spam update, não referência)
```

**Morre:** sales-utils.ts + 3 render points, badge "1", "98%", StarRating órfão, `public/sitemap.xml` stale OU `app/sitemap.ts` quebrado (fica um), robots.txt corrompido, ADMIN.md (descreve /admin inexistente), deps Sanity do bundle SE a decisão for não ligar (ver §4), sitemap anunciando rota que não existe.
**Nasce:** /festas, /quanto-custa, carrinho de orçamento→WhatsApp, kits nomeados (3-4: Festa Teen/Retrô, Confraternização/SIPAT, Infantil), fichas técnicas no metadata.json, FAQs por página, answer capsules, robots.ts com bots de IA, llms.txt, seção "chegou no catálogo" + badges honestos ("novo"/"mais pedido").
**Não ressuscitar sem gatilho novo (cortado em junho):** carrinho e-commerce/configurador/busca, 6-8 páginas de cidade, split do videokê, redesign de logo/ensaio foto, toggle claro, RUM/pipeline completo de imagem, programa de parceiros/PR, A/B de micro-copy.

## 3. MÉTRICAS DE SUCESSO

1. **Negócio (norte):** conversas WhatsApp iniciadas/semana com mensagem contextual (lead qualificado chegando pronto) + ligações `tel:`; reconciliação GA4 × etiquetas WhatsApp; % de leads com data+bairro já na 1ª mensagem.
2. **Ads:** QS ≥ 7 nas LPs de categoria; CWV verde mobile (LCP<2.5s / INP<200ms / CLS<0.1) em toda LP antes de campanha ativa.
3. **SEO:** sitemap único sem 404; GSC verificado e sem erros de cobertura; ranking nas queries transacionais (aluguel de fliperama sp, locação de videokê…) e featured snippet alvo em "quanto custa alugar fliperama".
4. **GEO (baseline JÁ, antes do redesign):** 1x/mês perguntar a ChatGPT/Perplexity/Gemini "aluguel de fliperama/videokê pra festa em Osasco/SP" → meta: ser citado pelo nome em ≥1 motor em 6 meses; requests de bots de IA aparecendo nos logs.
5. **Integridade (gate binário):** zero número fabricado no site (auditável por grep: sales-utils, "98%", badge fake); todo claim numérico com fonte ou `[PLACEHOLDER]` aguardando o dono.
6. **HTML cru:** `curl | grep` acha telefone, answer capsule, FAQ e specs em todos os templates.

## 4. RESTRIÇÕES TÉCNICAS

- **Next.js 15 + React 19 + TS, `output: 'export'` (static export é INEGOCIÁVEL: Hostinger/LiteSpeed + .htaccess).** Consequências: sem API routes/SSR/middleware em runtime; headers de segurança e redirects vivem no .htaccess; JSON-LD e todo conteúdo gerados em BUILD; interatividade (carrinho de orçamento, drawer) = client-side puro com localStorage.
- Tailwind + shadcn/Radix: cuidado com Radix Accordion/Tabs em conteúdo SEO/GEO (desmonta fechado → invisível pra IA; usar `<details>` ou forceMount).
- **Catálogo file-based HOJE** (`public/Organizado/**/metadata.json`) é a fonte de verdade; specs/FAQ/kits entram como extensão de schema do metadata.json. **Sanity = evolução, não dependência:** studio/ pronto (projectId 2fhr4hm5, campo `locacoes` real modelado) mas front não consome nada. O design NÃO pode depender de CMS pra lançar; decisão explícita pós-lançamento: ligar Sanity (aí `locacoes` real do dono substitui honestamente o que o hash fingia) OU remover as deps do bundle. Não ficar no meio.
- **1 dev (Matheus) mantendo + dono-operador (~2h/semana):** nada que exija curadoria contínua pra não apodrecer (a seção de depoimentos VAZIA da MC há 1+ mês é o contraexemplo). Conteúdo que não se atualiza sozinho precisa de fallback digno.
- Regra de WIP herdada: quick wins (des-fabricação, prefill, tracking, sitemap/robots) 100% no ar ANTES de estrutura nova. O redesign respeita essa ordem: fase 0 = gates 1.1-1.3, depois páginas novas.
- Placeholders de negócio marcados `[PLACEHOLDER: dono confirma]` (faixas de preço, nº real de eventos, autorização de logos, nota Google) — o design funciona nas duas hipóteses de cada um.
- Orçamento de mídia: campanha só liga com tracking fechado (S1) e CWV verde.
