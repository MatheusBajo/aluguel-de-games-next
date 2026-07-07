# Análise Completa — Aluguel de Games
**UX · UI · SEO · Performance · Conversão · Conteúdo · Acessibilidade · Mercado**

Data: 11/06/2026 · Site: https://www.alugueldegames.com.br

---

## Como esta análise foi feita

Mais de **40 agentes de IA** trabalharam em 4 fases, com debate e verificação cruzada:

1. **Varredura de código** — 10 auditores paralelos (home/hero, catálogo, página de produto, infraestrutura de SEO, performance, acessibilidade, navegação/conversão, páginas institucionais, dados do catálogo, dívida técnica), cada um validando achados contra o código, o dev server local **e o site em produção**.
2. **Pesquisa de mercado** — 6 pesquisadores web (concorrentes brasileiros, SEO local BR, CRO para negócios WhatsApp-first, UX de locação para eventos, direção visual 2025-26, SEO técnico para Next.js estático).
3. **Painel de especialistas + personas** — 13 especialistas (UX, UI, SEO, CRO, a11y, performance, conteúdo, mobile, arquitetura de informação, marca, SEO local, growth, confiança) + 4 personas simuladas navegando o site real (mãe organizando festa infantil às 22h, analista de RH cotando confraternização, aniversariante de 30 anos, senhor de 64 anos organizando bodas de ouro). Em seguida, **4 críticos** (viabilidade, impacto, advogado do usuário, verificador de evidências) desafiaram as ~120 recomendações, e um moderador produziu o consenso final.
4. **Verificação adversarial** — as 14 alegações centrais deste relatório foram re-verificadas independentemente contra o código e o site em produção. **Todas confirmadas.**

Todos os 39 pareceres completos estão em [`docs/analise-2026-06-11/`](docs/analise-2026-06-11/) (índice no final).

---

## Leitura executiva

**O site é, visualmente e em copy, o melhor do setor** — identidade arcade/neon consistente, tom de voz que diferencia ("sem letra miúda", "Manual do Jogador"), páginas institucionais muito acima da média (a /empresas fala a língua de RH; a 404 é um show). E o negócio tem o ativo mais raro do mercado: **desde 1993 — mais antigo que TODOS os concorrentes pesquisados** (Freitas 30 anos, Mega Power 28, MC Diversões 22, Fun Play 20, Alugue Games 11).

Mas por baixo da estética há três camadas de problema:

1. **Invisibilidade para o Google** — o sitemap em produção lista dezenas de URLs quebradas (404) e **nenhuma página de produto real**; o schema de Produto não sai no HTML; o robots.txt bloqueia o Google de renderizar o site; o domínio está dividido entre www e não-www. O coração do negócio (54 páginas de produto) está praticamente invisível para busca.
2. **Fricção exatamente no momento da conversão** — 24 dos ~26 botões de WhatsApp abrem **chat vazio**; não há nenhuma noção de preço; não há ficha técnica (dimensões/tomada/idade); o CTA fica abaixo da dobra no mobile; a galeria de fotos é inoperável por toque. As 4 personas travaram nos mesmos lugares.
3. **Risco patrimonial e de confiança** — o repositório git está **corrompido e sem nenhum commit** (perda do histórico na migração Windows→Mac; sem remote; catálogo excluído do versionamento pelo .gitignore; ADMIN.md com senha em texto plano). E o site exibe prova social **fabricada** (contadores de "locações" gerados por hash, badge de notificação falsa, "98%/100% satisfação" sem fonte) — enquanto a prova REAL (Bradesco, Spotify, Danilo Gentili, 33 anos) está subaproveitada.

**O teste de realidade dos 30 dias** (régua do consenso): se em 30 dias o site tiver (a) mensagem pré-preenchida em todos os CTAs, (b) tracking fechado, (c) zero números falsos, (d) hero visível em 4G e (e) WhatsApp Business respondendo com faixa de preço — o trimestre já se pagou.

---

## ⚠️ Pré-condição bloqueante nº 0 (antes de qualquer outra coisa)

O `.git/` está **corrompido**: existem refs, mas os pack files (que contêm a história) não vieram na migração Windows→Mac — `git log` retorna "does not have any commits yet", `git fsck` acusa ponteiros inválidos, e **não há remote configurado**. Além disso, o `.gitignore` exclui `/public/Organizado/` — o catálogo inteiro (dado de negócio, 543MB) ficaria fora do git mesmo após commitar.

**Ações imediatas (~1h):**
1. **Deletar/reescrever `ADMIN.md`** — contém usuário e senha em texto plano (linhas 5-9) de um painel que nem existe mais. Se essa senha é reutilizada em qualquer outro lugar (Hostinger, e-mail), trocar. Isso ANTES de qualquer push.
2. Revisar `.gitattributes` (regras LFS órfãs — sem git-lfs instalado, `git add` de imagens falha) e decidir o esquema do catálogo (repo separado com LFS, ou backup versionado tipo restic/Backblaze).
3. `git add` + primeiro commit + **remote privado** + push.
4. Backup de `public/` fora da máquina.

Nada de ffmpeg, sharp ou rename em lote de mídia antes disso — são os únicos originais de 33 anos de acervo.

---

## Achados críticos (todos verificados em código e/ou produção)

### SEO — o catálogo está invisível

| # | Achado | Evidência |
|---|--------|-----------|
| 1 | **Sitemap em produção lista URLs 404 e nenhum produto real.** `sitemap.ts` usa a chave crua da pasta (`/catalogo/Jogos de Mesa/Air Games/...` — com espaços e acentos) em vez do slug. Está no ar assim desde set/2025. | `src/app/sitemap.ts:42`; curl no sitemap de produção |
| 2 | **`/sitemap.xml`, `/robots.txt` e `/manifest.webmanifest` retornam 500 no dev** — conflito entre arquivos legados em `public/` e as rotas do App Router (dois geradores de sitemap concorrentes: next-sitemap no postbuild + sitemap.ts). | verificado via curl no dev server |
| 3 | **JSON-LD de Produto nunca chega ao HTML** — injetado via `next/script` (pós-hidratação). E o `robots.txt` tem `Disallow: /_next/`, impedindo o Googlebot de executar o JS que o injetaria. Schema 100% invisível. | `[...slug]/page.tsx:266`; `robots.ts:15`; curl em produção = 0 ocorrências |
| 4 | **Host canônico dividido**: `.env.local` define `NEXT_PUBLIC_SITE_URL` **sem www**; o resto do site usa **com www**. Canonical dos produtos sai sem www e sem barra final, divergindo do sitemap; ambos os hosts respondem 200 sem redirect. | `site.config.ts:8-26`; curl em produção |
| 5 | **BreadcrumbList sumiu** (existia no build de produção de set/2025, não existe no código atual — regressão irreversível sem git) e títulos duplicam a marca ("Pebolim - Aluguel de Games \| Aluguel de Games SP") sem a keyword transacional "aluguel de". | `[...slug]/page.tsx:113`; `layout.tsx:36` |
| 6 | **og:image fraca/ausente** nas páginas-chave — logo quadrado 1000×1000 declarado como 1200×630; /catalogo, /sobre, /contato, /galeria sem og:image. Num negócio cuja conversão circula DENTRO do WhatsApp, o preview do link é o outdoor. | metadata das páginas; sips no arquivo |

### Conversão — fricção no momento decisivo

| # | Achado | Evidência |
|---|--------|-----------|
| 7 | **24 dos ~26 CTAs de WhatsApp abrem chat vazio** — `getWhatsAppLink()` existe pronto e só a página de produto usa. O usuário às 22h precisa redigir do zero; o atendente recebe "oi" sem contexto. | `whatsapp.config.ts:12-19`; grep nos componentes |
| 8 | **O CTA do hero (provavelmente o mais clicado do site) é o único sem tracking GTM** — e `trackProductView`/`trackFormSubmit` nunca são chamados. O funil está cego nos pontos de maior intenção. | `StartCarousel.tsx:123`; grep |
| 9 | **O formulário de contato promete "abrimos um chat pré-preenchido no WhatsApp" e envia e-mail via Web3Forms** — promessa quebrada no fluxo de conversão; e o telefone é opcional enquanto o e-mail é obrigatório (invertido para um negócio que fecha por WhatsApp). | `contato/page.tsx:123` vs `ContactForm.tsx:51` |
| 10 | **Zero âncora de preço, zero ficha técnica** — nenhuma dimensão, voltagem, idade recomendada ou nº de jogadores em produto algum. As medidas EXISTEM — presas em nomes de arquivo de foto ("Pebolim 0,96 altura x 1,38 largura....webp"). | levantamento dos 54 metadata.json |
| 11 | **Galeria de produto inoperável por toque** — controles com `opacity-0` que só aparecem em `:hover` (não existe hover em celular); sem swipe; sem teclado; lightbox sem ESC. A página que decide o aluguel é zona morta no mobile. | `ProductGallery.tsx:75-94` |
| 12 | **CTA abaixo da dobra no produto mobile** (galeria → título → descrição → características → botão), sem sticky bar. | `ProductInfo.tsx:94-109` |

### Confiança — prova social fabricada vs ativo real desperdiçado

| # | Achado | Evidência |
|---|--------|-----------|
| 13 | **"140+ locações" em todos os cards é gerado por hash FNV-1a do nome da pasta** (100–200, determinístico). O próprio comentário do código admite: "até termos um sistema real de tracking". Risco CDC art. 37 + basta um cliente perceber o padrão. | `sales-utils.ts:40-64` |
| 14 | **Badge de notificação "1" falsa** (vermelha, pulsando) no botão flutuante; selo **"Online · Pronto pra atender" estático** (mente às 3h da manhã); "98% satisfação" na home vs "100%" no produto, sem fonte. | `WhatsAppFloat.tsx:77`; `contato/page.tsx:35` |
| 15 | **Contadores animados aparecem como "0+"** quando a animação de scroll não dispara (capturado em screenshot na /galeria) — exatamente o defeito que ridiculariza o pior concorrente pesquisado. | `Counter.tsx` + screenshot da galeria |
| 16 | **Sem CNPJ, sem endereço-base, sem política de privacidade** — num site que roda GTM/GA4 e coleta dados por formulário (LGPD), e num negócio que precisa de pré-homologação para vender a empresas. | grep em todo o src/ |

### Performance — o peso invisível

| # | Achado | Evidência |
|---|--------|-----------|
| 17 | **~35MB de vídeo MP4 em autoplay simultâneo na home** — 7 vídeos brutos de WhatsApp tocando ao mesmo tempo, mesmo fora da viewport (sem IntersectionObserver; `preload="metadata"` anulado pelo autoplay). Em 4G, mata o LCP e o plano de dados do cliente. | `Demonstra.tsx:17-74,171-184`; du em public/demonstra |
| 18 | **Hero invisível até o JS rodar** — h1 com `style="opacity:0"` inline no HTML; revelação depende de hidratação + download do GSAP + fonts.ready. Em conexão lenta: topo da página em branco por segundos. O padrão CSS correto (`.rise-in`) já existe no projeto. | `AnimatedHeadline.tsx:79`; HTML renderizado |
| 19 | **Logo de 516KB (2213×1181px) renderizado a 20-24px em TODAS as páginas.** Pior relação custo/benefício do site; correção de 30 minutos. | `public/carro-logo-aluguel-de-games.png` |
| 20 | **Catálogo serve originais de 1200×1600 em cards de ~250px** — `unoptimized: true` sem nenhum pipeline compensatório (o sharp está instalado e não é usado). 67MB de webp; página de produto chega a 11MB. | `next.config.ts`; `CatalogCard.tsx:54-63` |
| 21 | **465MB de vídeos não referenciados são deployados publicamente** — incluindo tutoriais operacionais internos (92MB de tutorial de PS5, vídeos de defeitos/reparo de karaokê), .docx, .cdr e lock files do Word. Deploy de ~600MB para um site que precisa de ~130MB. | find em public/Organizado |

### Bugs funcionais

| # | Achado | Evidência |
|---|--------|-----------|
| 22 | **"Máquinas (0)" na home — bug de Unicode NFC vs NFD.** As pastas no macOS estão em NFD; o literal `"Máquinas"` no código é NFC; a comparação nunca casa e a vitrine renderiza vazia. **6 produtos fortes (Boxe, Dança, Martelo, Gruas) somem da home.** O mesmo bug quebra a ordem curada das categorias no /catalogo (a página abre com "Jogos de Mesa" em vez dos fliperamas carro-chefe). Fix: `.normalize('NFC')` — 1 linha. | `page.tsx:153-163`; `catalog.server.ts:48`; verificado por codepoints |
| 23 | **Top 10 invisível para SEO e teclado** — `ssr: false` faz a seção mais vendedora da home não existir no HTML estático; os cards são `<a>` sem href que não abrem com Enter; indicadores de paginação com área de clique de 12×2px; títulos de card em ~9px e descrição em ~6,7px (ilegível para qualquer pessoa). | `Main.tsx:14`; `TopToys.tsx:287-293,335-348` |
| 24 | **Produto-órfão**: `Karaokê 2025` está aninhado dentro do "produto" Karaokês e nunca entra no catálogo (o walk() para no primeiro metadata.json). A subcategoria inteira de videokês virou UM produto com 42 fotos misturando modelos distintos. | `catalog.server.ts:43-52` |
| 25 | **4 fliperamas com descrição VAZIA** (na categoria carro-chefe!), descrição máxima do catálogo inteiro = 254 caracteres (thin content), "Carrinho Infantil" duplicado em 2 categorias, "Pasta X uai" (teste) pública em produção, 14 imagens duplicadas entre produtos errados, croquis de medida usados como foto de capa em ~10 produtos. | levantamento completo dos metadata.json |
| 26 | **~20 arquivos mortos com armadilha de nomenclatura**: `card-antigo.tsx`/`dialog-antigo.tsx` são os VIVOS; `card.tsx`/`dialog.tsx` estão mortos. `StartCarouselClaude.tsx` (hero duplicado de 283 linhas) morto; ~16 dependências mortas no package.json (Sanity v5 inteiro, 2 libs de drag-and-drop, etc. — 1,1GB de node_modules). | grep de imports |

---

## O que o site já faz muito bem (não mexer)

- **Copy e identidade**: headline clara e regionalizada, tom "sem letra miúda", sistema visual arcade/neon consistente. As personas confirmaram: *"foi exatamente o que diferenciou este site das outras 3 abas que eu tinha abertas"*. **O consenso decidiu manter o dark theme** (coerência de categoria) — corrigir contraste, não o tema.
- **Páginas institucionais acima da média**: /empresas fala a língua de RH (SIPAT, NF, contrato, faturamento, cases Bradesco/Arnold Classic); /como-funciona responde antecedência e montagem com honestidade rara ("não é plantão no local, mas estamos alcançáveis"); a 404 é a melhor do segmento (status 404 real, devolve ao funil, tema GAME OVER).
- **Engenharia pontual exemplar**: `Counter.tsx` (SSR-safe, reduced-motion), `ContactForm` (labels, autocomplete, honeypot), `.htaccess` da Hostinger (redirects, gzip, cache immutable), JSON-LD da home (EntertainmentBusiness completo com foundingDate 1993), decisão explícita no código de NÃO inventar aggregateRating no schema.
- **Jornada curta**: 1 clique até o WhatsApp de qualquer página; dual CTA consistente; fotos reais de eventos reais (com famosos).
- **O catálogo mais profundo do mercado** (54 produtos vs 3 kits genéricos dos concorrentes) — só falta o conteúdo de cada item fazer jus.

---

## A voz dos clientes (4 personas navegaram o site real)

**Fernanda, 38, mãe — festa de 25 crianças, R$1.500, navegando às 22h no celular:**
*"Seu site é o mais bonito do setor e os seus 33 anos aparecem — isso me trouxe até a porta. Mas eu fui embora com as mesmas dúvidas com que cheguei: quanto custa mais ou menos, se cabe no salão, se serve pra criança de 6 anos. Quem responder isso primeiro fica com a festa do Theo."* Leu "Fliperama de 11.000" como **R$ 11.000** e levou um susto. Os "130+ locações" funcionaram nela (não percebeu o fake) — mas o badge "1" falso e o "Online" às 22h34, sim, e a incomodaram.

**Ricardo, 31, analista de RH — confraternização de 400 pessoas, precisa de NF e proposta formal:**
A página /empresas convence, os cases Bradesco/Arnold impressionam — mas ele *"teria que printar o site para montar o slide interno"*. Pediu: **PDF de apresentação baixável**, CNPJ visível, e-mail corporativo, guia de dimensionamento por porte. O contador "0+" que ele viu na galeria quase o fez fechar a aba.

**Camila, 29, designer — festa de 30 anos retrô-gamer, sensível a estética e preço:**
O site é "instagramável" e ela acha o que quer — mas não consegue estimar se cabe no orçamento (precisa de 4 itens: fliperama + videokê + boxe + beer pong) e a galeria por toque não funciona. Fecharia na hora com um **kit com preço fechado**.

**Seu Antônio, 64 — bodas de ouro, 80 pessoas no salão da igreja:**
*"Conversa vazia é que nem entrar numa loja e o vendedor ficar te olhando calado."* Não achou o telefone com facilidade, o texto pequeno e acinzentado cansa, os termos gamer confundem — e a única pergunta dele sobre o videokê (*tem Roberto Carlos, MPB, anos 60-80?*) não tem resposta no site. **Nenhuma das 12 lentes de especialista tinha pensado no segmento "festas de família"** — entrou no plano por voz da persona.

**Convergência das 4**: todas travaram em (1) preço, (2) ficha técnica, (3) chat vazio, (4) perguntas práticas (chuva, sinal, duração, montagem). **Nenhuma travou em canonical, sitemap ou navegação por teclado** — por isso o plano prioriza conversão antes de SEO técnico (exceto as quebras binárias, que são urgentes).

---

## Mercado (6 pesquisas + concorrentes visitados)

- **Ninguém no nicho mostra preço** (exceções: Alugue Games "Kit Festa R$ 890" e Karaoke SP "a partir de R$ 200" no title). Mostrar faixa "a partir de" é diferenciação imediata — mas exige compromisso do dono (CDC art. 30: oferta vincula).
- **Prova social é o flanco aberto**: nenhum concorrente direto de games combina reviews + depoimentos + números. O benchmark é Baby Eventos (brinquedos infantis): 664 avaliações Google 5.0 exibidas no site. **Brasil é um dos países mais sensíveis a avaliação do mundo** na decisão local.
- **Os que crescem vendem KITS nomeados** (Kit Festa 1/2/3, Combos) — decisão mais fácil, ticket maior. O site não tem equivalente.
- **SEO local agressivo funciona**: MC Diversões domina a SERP de fliperama com 2 domínios e páginas por cidade; Freitas lista bairros; Fun Play põe o telefone no title.
- **Higiene técnica vence fácil**: concorrentes exibem contadores "0+", "A partir de R$ 0", SSL quebrado. Um site rápido e sem números falsos já se destaca.
- **WhatsApp-first está certo para o Brasil** (89% usam WhatsApp com empresas; mensagens têm ~98% de abertura) — mas o jogo se ganha no pós-clique: responder em <5min torna a conversão ~40% mais provável; quem responde primeiro leva 35-50% das vendas.
- **Atenção (junho/2026)**: o Google **removeu os rich results de FAQ** — conteúdo de FAQ continua valendo muito (objeções + AI Overviews), mas não esperar estrelinhas de FAQPage. Reviews de LocalBusiness sobre si mesmo também não geram estrelas (política "self-serving") — o caminho para estrelas na SERP é `aggregateRating` real no schema **Product** das páginas de item.

---

## Plano de ação consolidado (consenso do painel após debate)

Orçamento realista assumido pelo painel: **~30 dias úteis de dev + ~2h/semana do dono** num trimestre.

### Horizonte 1 — Quick wins (≤1 dia cada)

| # | Ação | Régua |
|---|------|-------|
| 0 | **Git + backup** (pré-condição bloqueante — ver seção acima) | ~1h |
| 1 | **Mensagem pré-preenchida em TODOS os CTAs de WhatsApp** (v1: produto + URL; usar o `getWhatsAppLink()` que já existe; consertar o `+` no wa.me) — *único item pedido por 8 lentes, 4 personas e 4 críticos* | 1-2 dias |
| 2 | **Des-fabricação em 48h**: remover locações-hash, badge "1", "Online" perpétuo (trocar por "fora do horário? manda mesmo assim — respondemos às 8h30"), 98%/100%; contadores nunca exibirem 0 | 1 dia |
| 3 | **Vitrine**: `.normalize('NFC')` (conserta "Máquinas (0)" E a ordem das categorias), aplicar campo `ordem`, acabar com o balde "Outros" | 1 dia |
| 4 | **Hero pintando sem JS** (CSS `.rise-in` já existente; `fetchpriority` no slide 1) + **logo 516KB → SVG/webp** — LCP estimado de ~5-8s para ~2-2,5s | meio dia |
| 5 | **Sitemap**: consertar `sitemap.ts` com slugs, deletar next-sitemap + arquivos legados de `public/` (um dono só por endpoint), e **verificar o Google Search Console** (via DNS) no mesmo dia | meio dia |
| 6 | **CNPJ + razão social + base + "Contrato e NF" no footer** + página de privacidade LGPD + corrigir geo do schema (hoje: Praça da Sé) | meio dia |
| 7 | **OG image global 1200×630** (foto real de evento + "desde 1993") | 1-2h |
| 8 | **WhatsApp Business operacional (dono, zero código)**: saudação, ausência, respostas rápidas COM faixa de preço, etiquetas de funil — *elevado a nº 1 em impacto pelo crítico de impacto* | uma tarde |
| 9 | **Copy urgente**: contradição 30.000 vs 12.000 músicas do videokê, "atualizado até 2023" (em 2026!), repertório por década (Roberto Carlos/MPB), renomear "Fliperama de 11.000" → "Fliperama Retrô — 11.000 jogos em 1", typos ("Maquina  de Dança", "Mesa Liftime") | 1 dia |
| 10 | **Legibilidade**: mínimo 12px (Top 10 usa ~6,7px!), abolir `text-muted-foreground/40-60` em texto informativo | meio dia |
| 11 | **Telefone como conversão**: "ou ligue (11) 96526-1000" junto aos CTAs, rastrear `tel:`, **telefone obrigatório no form (e-mail opcional)**, e pós-envio do form abrir wa.me pré-preenchido (cumprindo a promessa da página) | 1 dia |

### Horizonte 2 — Sprint (1-2 semanas)

1. **Componente `<WhatsAppCta>` único** — prefill v2 com roteiro de lacunas ("Data: ___ / Bairro: ___ / Convidados: ___ / Itens: ___"), tracking GA4 completo, fallback tel:, aria. 20+ CTAs herdam tudo. + **ritual mensal de 30min**: cliques GA4 × conversas × orçamentos × fechamentos (etiquetas).
2. **Pacote "página de produto mobile"** — sticky bar de orçamento (substituindo o float), galeria touch v1 (controles visíveis, aria, tap = fullscreen), recuperar a dobra. Medir `whatsapp_click` por 3-4 semanas.
3. **Specs estruturadas nos top 15 produtos** (dimensões/voltagem/jogadores/idade extraídas dos filenames + confirmação do dono) — os chips reais entram no pixel onde estava o contador falso.
4. **FAQ das personas em /como-funciona**: chuva, sinal/cancelamento, duração + hora extra, horário de montagem, elevador, tomada, idade, garantia de substituição. Resolver a contradição "equipe no local" vs "não é plantão" produtizando "Operação assistida" como add-on.
5. **Dieta de vídeos** (pós-backup): curadoria para 3-4 clipes, 720p, poster, tap-to-play — ~35MB → ~2MB. + **prune do deploy** (502MB de mp4, incluindo tutoriais internos hoje públicos).
6. **Batch one-off de imagens com sharp** (originais gigantes → página de produto de 11MB para ~1,5MB; tratando nomes NFD).
7. **Google Business Profile** (Service Area Business, fundação 1993) + **motor de reviews D+1** via WhatsApp Business — a única fonte nova de demanda barata e o único fosso defensável do nicho.
8. **Fundação SEO restante**: host www unificado, JSON-LD Product server-side, BreadcrumbList, titles "Aluguel de {Produto}...", headings do catálogo linkando as páginas de categoria (que já existem e são boas).
9. **Promover a prova real**: "já realizamos eventos para Bradesco, Spotify, Arnold Classic, Danilo Gentili" em texto visível; legendas da galeria visíveis no mobile; 3 fatos verificáveis no lugar das stats fabricadas.
10. **Preço — escada de risco**: faixa na resposta rápida do WhatsApp (já), página "Quanto custa? Entenda o orçamento" (sprint), pisos públicos "a partir de R$" só com compromisso escrito do dono (piloto em 2 categorias, 60 dias).

### Horizonte 3 — Estruturais (1-3 meses)

1. **2-3 páginas por ocasião** (não 6-8): "Festa Infantil em casa/condomínio", "Confraternização/SIPAT" (no ar até agosto — pico set-nov) e **"Festas de família"** (bodas, 60/70/80 anos — segmento que nenhuma lente enxergou, entrou por voz da persona). Na home, 1 frase: *"do salão do seu prédio ao evento da TV"*.
2. **3-4 kits nomeados de escopo fixo** (Festa Teen/Retrô, Confraternização, SIPAT, Infantil) — o multi-item sem carrinho; preço fechado só com compromisso do dono.
3. **Conteúdo da cauda** (~39 produtos restantes com template: gancho → o que é → no pacote → ficha → ideal para) + UMA página de videokê forte com modelos e repertório por década.
4. **Reativação estreita da carteira**: clientes de confraternização dez/2025 contactados em set/2026 (uma lista de uma tarde) + mineração de localidades dos forms para futuras páginas regionais.
5. **Mídia paga em rajadas sazonais** (search de alta intenção, R$30-50/dia nas 4-5 janelas) — somente com tracking fechado.
6. **Pacote B2B**: PDF "kit aprovação interna" baixável, guia de dimensionamento por porte, e-mail corporativo, aviso honesto de agenda nov/dez.
7. **Prova social composta**: contagem real de eventos via etiquetas, cláusula de autorização de imagem no contrato, QR "avalie a gente" no equipamento, foto de arquivo dos anos 90 na /sobre.
8. **Dívidas condicionais** (só com gatilho): pipeline completo de imagens + OG por produto; overlay de taxonomia + redirects (se houver rename); facetas client-side (depois das specs); consolidação framer/GSAP (se INP de campo provar necessidade).

### Cortado do trimestre (decisão do painel, com motivo)

Redesign de logo/ensaios fotográficos (projeto de marca com orçamento próprio) · carrinho multi-item/configurador/busca (kits + prefill cobrem; pedido típico 1-3 itens) · 6-8 páginas de cidade (GBP + reviews capturam o local com 5% do esforço) · split do videokê em SKUs (thin content ao quadrado) · programa de parceiros/B2B recorrente/PR (5 negócios novos para uma operação que ainda não responde fora do horário) · **toggle de tema claro** (dark/neon é coerência de categoria — corrigir contraste, não o tema).

---

## As controvérsias do debate (e como foram decididas)

O painel discordou de verdade em 12 pontos — os mais relevantes:

1. **Preço público** — 4 posições incompatíveis. Decisão: escada de risco (faixa no WhatsApp já → página explicativa → pisos públicos só com compromisso escrito do dono). Tabela aberta rejeitada (CDC art. 30 + manutenção).
2. **SEO técnico vs conversão primeiro** — as auditorias rotulavam canonical/JSON-LD como "Alto"; 3 de 4 personas: *"nada técnico me impediu de converter"*. Decisão: só quebras binárias na semana 1 (sitemap 500 + GSC); o resto depois do pacote de conversão. *"SEO traz a próxima Fernanda; conteúdo converte a que já chegou."*
3. **Des-fabricação: remover vs substituir** — decisão híbrida: badge e "Online" saem JÁ; o pixel das "locações" recebe o atributo real quando as specs chegarem — mas a remoção não espera a substituição. E **não se faz A/B de desonestidade** (confiança venceu CRO).
4. **Páginas por ocasião: 6-8 vs 2-3** — venceu a evidência incômoda do crítico: a empresa não preencheu 254 caracteres em 50 produtos; não escreverá 8 landings. Dose: 2-3 com deadline sazonal.
5. **Carrinho multi-item** — persona Camila ("o que mais paga") vs CRO + críticos. Adiado: kits + lacuna "Itens: ___" cobrem; revisitar com fricção real reportada pelo atendente.
6. **Performance** — "pipeline + RUM" (engenheiro) vs "catnip de engenheiro" (impacto). Ficou: hero CSS-first ANTES de vídeo (elemento com opacity:0 não conta para LCP), logo, curadoria de clipes, batch one-off; o resto condicional.

---

## Artefatos completos

Tudo está versionável em [`docs/analise-2026-06-11/`](docs/analise-2026-06-11/):

- **`auditorias/`** — 10 auditorias de código com evidência arquivo:linha (home-hero, catalog-listing, product-page, seo-infra, performance, accessibility, nav-conversion, static-pages, catalog-data, tech-debt)
- **`pesquisas/`** — 7 pesquisas de mercado com fontes (competitors-br, local-seo-br, whatsapp-cro, rental-ux, design-trends, technical-seo, complemento-verificado)
- **`painel/`** — 22 pareceres: 13 especialistas, 4 personas (leitura recomendada: persona-mae.md), 4 críticos e o **consenso-final.md** (a versão íntegra do plano acima, com as 12 controvérsias)

*Nota de honestidade metodológica: as alegações deste relatório foram verificadas de forma independente contra o código e o site em produção. Dois achados de pareceres individuais foram **corrigidos** no processo: `catalog-categories.ts` NÃO é código morto (3 imports ativos), e o erro 500 do "Karaokê 2025" não foi reproduzido de forma consistente (o produto é, de fato, inalcançável no catálogo — mas o código de erro varia). Os contadores de locações fabricados funcionaram até na nossa persona-mãe — o que reforça que o problema é ético/legal, não de eficácia.*
