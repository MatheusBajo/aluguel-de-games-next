# Crítica — Auditor técnico SEO/GEO/Performance

Data: 2026-07-07 · Lente: LCP 4G mobile (Ads QS), message match, schema no HTML servido, GEO real vs teatro, risco doorway, viabilidade em static export, acessibilidade pragmática.
Fatos verificados no repo antes de criticar: `public/robots.txt` corrompido por backticks (confirmado), 3 fontes de sitemap coexistindo (`app/sitemap.ts` + postbuild `next-sitemap` + `public/sitemap.xml`), `output: 'export'` com `images.unoptimized: true`, catálogo aninhado em até 4 níveis (`Jogos Eletrônicos/Consoles/Nintendo/Nintendo Wii`), 54 `metadata.json`, e **"Carrinho Infantil" existe em DUAS categorias** (`Jogos Eletrônicos/` e `Piscinas, Infláveis…/`).

---

## 0. Falhas SISTÊMICAS (as 6 specs compartilham; nenhuma admite)

Estas quatro derrubam promessas de todas as propostas ao mesmo tempo:

**S1 — O form B2B/contato não tem destino em static export.** Todas as specs escrevem "form (telefone obrigatório, e-mail opcional) → pós-envio abre wa.me". Sem API route, sem SSR, sem backend: esse "form" é um compositor de wa.me disfarçado. Nenhuma spec nomeia um form backend (Formspree, Web3Forms, mailto) nem admite pro dono que lead de formulário NÃO chega por e-mail. RH de empresa grande às vezes NÃO PODE usar WhatsApp corporativo — o único caminho B2B "formal" prometido é uma ilusão de UI. Isso precisa de decisão explícita (serviço third-party ou matar o form e assumir wa.me/tel/e-mail linkado).

**S2 — Schema-teatro parcial: FAQPage e HowTo não rendem mais rich result.** Google restringiu FAQ rich results a sites governamentais/saúde (ago/2023) e matou HowTo rich results (set/2023). O valor de FAQPage/HowTo hoje é GEO/consistência, ZERO ganho de SERP. V1B §2, V1C §8.3, V2A §8, V2C §2 e §8.7 vendem "HowTo schema" em /como-funciona como se fosse alvo de busca. Não é mentira estrutural (o markup não prejudica), mas é expectativa inflada vendida ao dono — exatamente o que o brief chama de aposta que precisa ser declarada com "expectativa zero", como fizeram (corretamente) com llms.txt. Crédito: nenhuma spec faz teatro de llms.txt — todas herdaram o framing honesto do brief.

**S3 — 4 de 6 specs mantêm o carrossel embla de 10 slides no hero e prometem LCP<2.5s em 4G.** Com `images.unoptimized: true`, tudo depende do batch sharp one-off ser executado com rigor. Carrossel autoplay como primeiro elemento visual = o LCP é a IMAGEM do slide (não o H1 — ver erro conceitual da V1B abaixo), e embla+autoplay+10 fotos reais em 4G é o maior risco isolado de QS baixo do projeto. Só V1A remove o risco estruturalmente; V2B o "rebaixa" sem resolver.

**S4 — Ninguém resolve a colisão de slug plano.** As specs que achatam URLs de produto pra `/catalogo/{produto}` (V1A explicitamente, V2B/V2C por implicação no sitemap §2) ignoram que o catálogo REAL tem nome de produto duplicado entre categorias ("Carrinho Infantil" ×2, verificado). Slug plano sem sufixo de categoria = 404 ou sobrescrita silenciosa no build. Só a V1C escapa por manter URLs aninhadas.

---

## 1. SPEC V1A — Conversão Radical · **Nota: 7,0**

### Os 3 piores problemas

1. **§2 "Migração de URL (uma vez, definitiva)" é roleta-russa de 301 na véspera de ligar Ads — com colisão de slug comprovada.** Achatar `/catalogo/jogos-eletronicos/fliperamas/` pra `/catalogo/fliperamas` + ~60 produtos pra `/catalogo/{produto}` mistura categoria e produto no MESMO namespace do catch-all (quem desambigua "fliperama-snack" de "fliperamas"?) e colide no caso real "Carrinho Infantil" (duas pastas, um slug). Ganho de ranking de URL plana vs aninhada: ~zero (Google não pontua profundidade de path com breadcrumb schema correto). Risco: churn de indexação de dezenas de URLs + equity diluído por 301 exatamente quando o QS das LPs vai ser medido. Migração eletiva, payoff nulo, downside real. Cortar a migração e manter nesting (como V1C) tira o único defeito grave da spec.

2. **§3 Dobra 1 se contradiz no elemento LCP e superlota o viewport de 390px.** O texto diz "UMA imagem estática de evento real como LCP (`<img>` priority)" e três linhas depois, no mobile, "imagem como fundo com scrim". CSS `background-image` não é descoberto pelo preload scanner (LCP atrasa um ciclo inteiro de request a menos que se adicione `<link rel=preload>` manual — não especificado). E a dobra promete H1 + capsule de 40-80 palavras + trust strip de 7 itens + CTA dual + linha de tel "em 1 tela": a 390×844 com texto ≥12px isso não fecha; a trust strip sozinha quebra em 2-3 linhas. Alguém vai "resolver" diminuindo fonte — violando o gate 1.7.

3. **§3 Dobra 8: sticky bottom bar GLOBAL no mobile taxa ~56-64px de viewport em TODA página, e convive mal com a sticky de produto do §4.8.** A spec cria duas barras fixas com regras de aparição diferentes (global sempre; produto "após rolar além do bloco de decisão") sem dizer qual vence quando as duas condições valem. Barra permanente desde o primeiro pixel também compete com o CTA hero da própria dobra 1 (dois botões verdes visíveis simultâneos = viola o espírito do "verde exclusivo de ação"). E `100svh` de hero + barra fixa = corte de conteúdo em browsers com UI dinâmica.

Menor, mas anoto: H1 da home sem a palavra "aluguel" ("Fliperama, videokê e games na sua festa…") enfraquece message match do head term "aluguel de games sp" que a §2 declara como papel da home no Ads.

### O que as outras deveriam roubar
**O hero estático matando o carrossel autoplay (§3 Dobra 1) + os 3 audits de CI (§8: `audit:fake`, `audit:raw`, `audit:sitemap`).** É a única spec que resolve o LCP por arquitetura em vez de por promessa, e a única que transforma os gates do brief em scripts que falham build.

---

## 2. SPEC V1B — Arcade Premium · **Nota: 6,0**

### Os 3 piores problemas

1. **§3.1 tem um erro conceitual de Core Web Vitals embutido como premissa: "o texto vem ANTES da imagem no DOM (LCP = H1 pinta sem JS)".** LCP não é escolhido por ordem de DOM: é o maior elemento pintado no viewport. Com um carrossel de foto de evento ocupando a dobra, o candidato a LCP é a IMAGEM do slide 1, servida por embla com autoplay, em `images.unoptimized`. A spec inteira de performance está apoiada numa leitura errada da métrica — e é a spec que MANTÉM os 10 slides. Prometer "CWV verde antes de campanha" (§8) sem tocar no maior peso da página é auditoria de checklist, não de engenharia.

2. **§3.2 trust strip como "marquee lento em loop" no mobile é anti-padrão triplo.** (a) O conteúdo mais persuasivo do site (1993, Bradesco, Spotify, nota Google) fica em movimento — leitura interrompida, link do GBP virando alvo móvel de toque (touch target móvel = falha pragmática de acessibilidade); (b) marquee CSS exige duplicar o conteúdo no DOM pro loop ser contínuo — texto duplicado no HTML cru que a própria spec manda auditar por grep; (c) `prefers-reduced-motion` desligar o marquee cria DOIS layouts pra manter. Custo alto, ganho zero sobre uma linha que simplesmente quebra.

3. **§10: 26 dias — a estimativa mais cara das seis — pra uma "evolução, não reescrita", com 3 dias de design system ANTES de qualquer ganho de conversão.** A fase 1 inteira (tokens, "orçamento de neon", componentes-assinatura, `--glow-scale`) é polimento estético não-auditável ("máximo 1 glow forte por viewport" não é testável) posicionado antes do carrinho (fase 4) e das páginas que fazem dinheiro (fase 5). Se o plano de corte for acionado, corta-se conversão (carrinho, corte 4) e mantém-se scanline. A alocação de esforço contradiz a direção nº4 do dono (primeiro o que importa pro cliente).

### O que as outras deveriam roubar
**O aceite mensurável de sitemap (§2): `npm run build && grep -c "<url>" out/sitemap.xml` bate com o total de rotas, zero URL com espaço/acento.** É o único critério de aceite do projeto inteiro que valida a quebra binária nº1 do SEO atual (URLs com acento → 404) de forma que uma máquina confere.

---

## 3. SPEC V1C — AI-Native · **Nota: 7,5**

### Os 3 piores problemas

1. **O princípio organizador ("desenhado para máquinas") otimiza pro canal de MENOR retorno mensurável do brief.** O próprio brief define a meta GEO como "ser citado em ≥1 motor em 6 meses" — aposta de baixa certeza — enquanto Ads é dinheiro imediato do dono. A V1C subordina a estética à leitura por máquina ("dark arcade de dados", mono/tabular/timestamp como identidade, §7) num negócio onde quem decide é mãe organizando aniversário no celular. O HTML citável não exige que o site PAREÇA um terminal; specs em tabela + capsule fazem o trabalho GEO com qualquer pele visual. Risco concreto de Ads: anúncio "fliperama para festa infantil" aterrissando numa página com cara de dashboard = scent quebrado, bounce, QS caindo — o oposto do que a spec promete no §2.

2. **§3 H1 mantém o carrossel de 10 slides como primeiro visual (mesma bomba de LCP da V1B), em contradição direta com a própria régua da spec.** Uma proposta cujo conceito é "cada página é uma resposta que pinta sem JS" não pode entregar como primeira dobra um componente embla hidratado com autoplay. É a incoerência interna mais gritante das seis specs: a camada de dados é AI-native, o hero é 2024-legacy.

3. **§10: ~19 dias com a fase 1 fantasiosa: "AnswerCapsule + FactTable + FaqNative + TrustStrip + specs no metadata (7 categorias + ~20 produtos COM o dono) + FAQ por página" em 4 dias.** Coletar spec real (dimensão, tomada, passa-na-porta) de 20 produtos exige o dono com fita métrica no depósito — gargalo de 2h/semana dele, não de dev. V2A é a única que precifica isso honestamente ("~60 produtos × 10 min espalhado nas 2h/semana ao longo das fases"). A V1C esconde a dependência crítica do cronograma dentro de uma fase de 4 dias.

### O que as outras deveriam roubar
**Manter as URLs aninhadas (`/catalogo/{...}/[produto]`, §2) — zero migração, zero 301, zero colisão de slug — e o H1 transacional perfeito: "Aluguel de fliperama, videokê e games para festas".** É a única spec sem risco de migração de URL E com "aluguel de" na frente do H1 da home. As duas coisas juntas são o melhor par SEO/Ads das seis propostas.

---

## 4. SPEC V2A — Polish & Conversão · **Nota: 7,0**

### Os 3 piores problemas

1. **§7 "Motion: mantém rise-in/counters/hover-scale" + embla 10 slides + framer-motion = a spec carrega TODO o peso JS do opus-4.8 pra dentro das LPs de Ads e promete INP<200ms em Android intermediário.** É a única proposta que não corta NENHUM componente pesado (V1A mata o carrossel, V2B mata o embla da galeria de produto). "Polir" o que existe inclui polir o bundle — e a spec não tem uma linha de orçamento de JS, não menciona `next/dynamic` pros blocos abaixo da dobra, nada. O CWV verde da §8 é fé, não plano.

2. **§10: 26 dias derruba a premissa da spec.** "Mexer o mínimo na estrutura" custando o MESMO que o redesign total mais caro (V1B, 26d) e 44% mais que a V2C (17d) significa uma de duas coisas: ou a estimativa das outras é fantasia, ou o "polish" está inflado. Como a V2A é a mais honesta no custo do preenchimento de specs, aposto na primeira — mas então a spec deveria ATACAR as estimativas rivais em vez de se vender como caminho barato. Como está, ela perde a única vantagem competitiva de uma proposta conservadora: ser mais rápida.

3. **§3.8: FAQ da home com "Vocês entregam em [bairro]?" — pergunta parametrizada impossível em HTML estático.** Detalhe? Não: é sintoma. FAQ que promete resposta por bairro num site sem backend ou vira resposta genérica ("atendemos Osasco e Grande SP" — e aí a pergunta está errada) ou vira 96 variações que não existem. Numa spec cuja força é citar arquivo e linha do repo real, deslizes de viabilidade em conteúdo mostram que a camada de copy não passou pelo mesmo rigor da camada de código. O mesmo §3.8 promete FAQPage schema espelhando — schema de pergunta que o HTML não responde de verdade é o começo do teatro.

### O que as outras deveriam roubar
**O aterramento cirúrgico no repo (§2 e §4): cada item de des-fabricação com arquivo:linha real (`CatalogCard.tsx:91-99`, `Main.tsx:108-120`, `ProductInfo.tsx:112-125`, breadcrumb `#Categoria` na linha 291, `next/script` em 206/266).** É a única spec cuja fase 0 um dev executa HOJE sem abrir investigação. As outras cinco descrevem intenção; a V2A descreve o diff.

---

## 5. SPEC V2B — Catálogo-First · **Nota: 5,0**

### Os 3 piores problemas

1. **§2 ressuscita a BUSCA ("busca client-side simples no /catalogo") — violação frontal do contrato.** O brief §2 lista "Não ressuscitar sem gatilho novo (cortado em junho): carrinho e-commerce/configurador/**busca**". A própria spec abre dizendo "onde este doc conflitar com o brief, o brief vence" e conflita 15 linhas depois. Pelo regime do brief ("falhou 1 = reprova"), isso é desclassificação técnica até a linha ser removida. Não é pedantismo: busca client-side num catálogo de 54 itens com 7 categorias navegáveis é feature de vaidade que adiciona JS, estado e manutenção pra resolver um problema que chips de categoria já resolvem.

2. **§3.3 a home inteira depende de um campo `ocasioes[]` que não existe e que só o dono pode preencher — e a spec orça 15 produtos na fase 1.** As 3 fileiras por ocasião são o "coração do V2B" (título da seção). Com 15 de 54 produtos curados, cada fileira tem ~5 itens no dia do launch, e a fileira "Pra evento de empresa" fica anêmica. O contraexemplo citado pelo próprio brief (seção vazia da MC apodrecendo) vale aqui: curadoria por ocasião é conceito CERTO (cliente pensa "festa do meu filho", não "jogos eletrônicos") com plano de abastecimento ERRADO. Faltou: fallback desenhado pra fileira magra + mapeamento automático categoria→ocasião como default.

3. **§10: 18 dias é a estimativa menos crível das seis.** Fase 2 = "7 LPs de categoria (capsule + tabela comparativa + FAQ + schema) + QuoteCartDrawer completo + audit-html.sh no CI" em **3 dias**. Só as 7 tabelas comparativas exigem specs estruturadas de dezenas de produtos (dependência da fase 1 que só cobriu 15) — ou as tabelas nascem esqueléticas, minando exatamente o chunk GEO que a spec vende como diferencial. Junte §4.2 "pinch-zoom via `<img>` padrão" (mobile browser não faz pinch-zoom de imagem inline; precisa de lightbox JS ou viewport zoom) e §3.1 carrossel "atrás/abaixo do texto" (layering indefinido = scrim/contraste AA não especificado onde texto cruza foto) e o padrão é claro: a spec resolve os problemas difíceis com frases vagas.

### O que as outras deveriam roubar
**§4.2: galeria de produto em scroll-snap CSS nativo, matando o embla na página que recebe DSA/remarketing.** É a única ideia das seis que REMOVE JavaScript de uma superfície de Ads em vez de adicionar. Junto: a observação de que as dimensões hoje vivem em NOME DE ARQUIVO de imagem (§4.7) — achado real de auditoria que nenhuma outra spec viu.

---

## 6. SPEC V2C — Prova + B2B · **Nota: 6,0**

### Os 3 piores problemas

1. **§3.1 mantém o H1 atual "Aluguel de games pra sua festa ser inesquecível" — o pior message match das seis specs.** "Ser inesquecível" é exatamente o adjetivo inflado que o brief §1.7 manda cortar, e o H1 não contém fliperama/videokê (os head terms reais). A spec declara a home como destino "brand only" no Ads (§2) pra se absolver, mas o SEO orgânico da home continua mirando "aluguel de games sp" com um H1 emocional. Todas as outras cinco reescreveram o H1; a V2C manteve o frufru por inércia de "evolução" — numa spec cujo tema é PROVA sobre adjetivo, o primeiro texto da página é um adjetivo.

2. **A tese B2B-first aloca o esforço no segmento errado sem dado que a sustente.** A home B2C recebe o mínimo ("a home de opus-4.8 já acerta o esqueleto", §3) enquanto /empresas ganha máquina completa (§5, a seção mais longa da spec). Nenhum número no brief diz que B2B é a maior receita — os cases (Bradesco/Spotify) são a melhor PROVA, não necessariamente o maior FUNIL; festa de aniversário em Osasco é presumivelmente o volume. Se o dono roda Ads majoritariamente B2C (provável: "festas e eventos" é o negócio), a spec entrega a menor melhoria nas LPs que mais recebem clique. Agrava: S1 (form sem backend) atinge ESTA spec com mais força, porque seu público-alvo (RH/compras) é justamente quem exigiria canal formal.

3. **§10 fase 0 de 1,5 dia não inclui o JSON-LD server-side, e nenhuma fase o inclui explicitamente.** O grafo (EntertainmentBusiness + hasMap + Offer LeaseOut + Breadcrumb, §8.7) é gate 1.3 do brief — obrigatório — mas no cronograma aparece só "FAQ + schema" na fase 2 e "GSC real" na fase 7. Compare: V2A põe "JSON-LD server-side" nominalmente na fase 0 de 4 dias. A estimativa de ~17 dias (12 no corte máximo) é a mais sedutora das seis exatamente porque itens obrigatórios ficaram sem dono no cronograma. Barato no papel, estouro na prática. Mesma classe de problema: trust strip "scroll horizontal sem quebrar" (§3.3) esconde Spotify/Gentili fora da tela no primeiro paint — a prova mais forte do site invisível por padrão no mobile.

### O que as outras deveriam roubar
**§6.4: "Todo `[PLACEHOLDER]` tem fallback desenhado" como regra de sistema (trust strip sem nota do Google só omite o item; card de kit sem preço não tem buraco).** É a única spec que trata os dois estados de CADA placeholder como requisito de design, não caso a caso. Bônus: a taxonomia GA4 mais completa (§8.10: `whatsapp_click` com surface, `tel_click`, `orcamento_add`, `kit_pdf_download`) — as outras rastreiam só o clique verde.

---

## Tabela final

| Spec | Nota | Maior força (nesta lente) | Falha que derruba |
|---|---|---|---|
| V1C AI-Native | **7,5** | URLs aninhadas sem migração + melhor H1 + anatomia de resposta | Mantém carrossel no hero (incoerência com o próprio conceito); estética terminal vs persona B2C |
| V1A Conversão Radical | **7,0** | Único hero estático (LCP resolvido por arquitetura) + audits em CI | Migração de URL eletiva com colisão de slug real ("Carrinho Infantil" ×2) |
| V2A Polish | **7,0** | Aterramento arquivo:linha no repo real; fase 0 executável hoje | Carrega todo o peso JS do opus-4.8 pras LPs; 26d mata a premissa "polish" |
| V1B Arcade Premium | **6,0** | Aceite mensurável de sitemap | Erro conceitual de LCP ("LCP = H1") como premissa de performance; marquee na prova |
| V2C Prova + B2B | **6,0** | Regra de fallback por placeholder + taxonomia GA4 | H1 frufru mantido; JSON-LD obrigatório sem dono no cronograma; aposta B2B sem dado |
| V2B Catálogo-First | **5,0** | Galeria scroll-snap CSS (remove JS de superfície de Ads) | Ressuscita BUSCA (violação de contrato do brief); home dependente de `ocasioes[]` inexistente |

## Veredito (auditor técnico)

Nenhuma das seis merece aprovação como está; duas merecem fusão. A base vencedora é **V1C** (URLs intactas = zero risco de migração, melhor H1 transacional, anatomia de resposta consistente) **com o hero estático da V1A transplantado** — é o único jeito de as promessas de LCP<2.5s em 4G serem engenharia em vez de fé, porque 5 das 6 specs mantêm um carrossel embla autoplay de 10 fotos como primeiro elemento pintado e uma delas (V1B) chega a errar o conceito da métrica. Da V2A entra o método (diff cirúrgico com arquivo:linha pra fase 0), da V2C a regra de fallback por placeholder + eventos GA4, da V2B só a galeria scroll-snap. **V2B está tecnicamente reprovada até remover a busca** (item explicitamente não-ressuscitável do brief). A migração de slug plano da V1A deve ser cortada: colisão real verificada no repo e payoff de ranking nulo. Antes de qualquer campanha: decidir o destino do form B2B (static export não entrega e-mail sozinho — falha sistêmica S1 que nenhuma spec enxergou) e parar de vender FAQPage/HowTo como ganho de SERP (Google matou esses rich results em 2023; o valor restante é GEO e deve ser vendido ao dono como tal). O terreno GEO é real e vago, mas quem paga o redesign nos primeiros 6 meses é o Ads — a proposta final tem que ser auditável por máquina (audits de CI da V1A + aceite de sitemap da V1B) porque promessa de CWV sem gate de build é como os concorrentes chegaram aos sites que têm hoje.
