# Parecer — Acessibilidade Pragmática
**Painel de auditoria · Aluguel de Games · 2026-06-11**
**Lente:** o que de fato impede pessoas de alugar, vs. conformidade WCAG por checklist.

---

## 1. Quem é o usuário real (e por que isso muda a ordem das prioridades)

A auditoria accessibility.md está tecnicamente correta em praticamente tudo. Mas ela ordena por severidade WCAG, e severidade WCAG não é igual a "impede de alugar" para ESTE público:

- **Pais e mães de 30–50** organizando festa, majoritariamente **no celular, por toque** (sem hover, sem teclado).
- **Presbiopia começa aos ~40** e atinge quase 100% das pessoas aos 50. Ou seja: **metade do público-alvo enxerga mal texto pequeno e de baixo contraste**. Isso não é "edge case de acessibilidade" — é a mediana do cliente.
- **Avós** organizando aniversário de neto: zoom de texto ativado no Android/iOS, paciência zero com interface que se mexe sozinha, e muitos **preferem ligar a usar WhatsApp**.
- **RH/compras (página /empresas)**: o único segmento relevante de **desktop + teclado** — e muitas vezes num computador corporativo **sem WhatsApp Web logado** (TI bloqueia, ou a pessoa não quer logar o WhatsApp pessoal no PC do trabalho).
- Usuários de leitor de tela: existem, merecem funcionar, mas são uma fração pequena DESTE funil. Gasto proporcional.

**Implicação central:** os bugs de acessibilidade mais caros deste site não são os de ARIA — são os que também são bugs de UX mobile puro. A boa notícia para um negócio de 1 dev: **o pacote mínimo de acessibilidade é quase o mesmo pacote de conversão mobile**. Vende-se internamente como "consertar o site no celular", não como "compliance".

---

## 2. O que de fato impede de alugar (Pacote Mínimo — ~2 a 3 dias de dev)

Em ordem de impacto real sobre o funil:

### P1. Galeria de produto invisível no toque — afeta 100% dos usuários mobile
`ProductGallery.tsx:75,81,91` — prev/next/fullscreen com `opacity-0 group-hover:opacity-100`. Em touch não existe hover: **todo usuário de celular** fica sem setas e sem fullscreen na página que decide o aluguel ("quero ver a foto direito antes de chamar no zap"). Isso está arquivado como item 1.5 da auditoria de a11y e 2.4 da de produto, mas é o defeito nº 1 desta lente: não é "usuário de teclado não consegue" — é **ninguém no celular consegue**.
**Fix:** controles sempre visíveis abaixo de `md:` (`opacity-100 md:opacity-0 md:group-hover:opacity-100`), `focus-visible:opacity-100`, `aria-label` nos 3 botões, ESC no fullscreen. Esforço: baixo. Swipe via Embla pode vir depois.

### P2. Texto de 6,7px e contraste reprovado — afeta a metade do público com presbiopia
- `TopToys.tsx:335-348` — `text-[5pt]` (≈6,7px) e `text-[7pt]` (≈9px) no componente "Top 10", vitrine principal da home no mobile. É ilegível para qualquer pessoa acima de 40 sem óculos na mão — exatamente quem decide a festa.
- Padrão sistêmico `text-muted-foreground/50`–`/60` e `text-white/40` (3,4–4,2:1) em texto informativo de 11–12px.
**Fix:** mínimo 12px em qualquer texto informativo; abolir modificador de opacidade abaixo de `/70` em texto (criar 1 token e fazer find-replace). Esforço: baixo. Impacto: alto e transversal (home, cards, formulário, modal).

### P3. Canal de conversão único é uma barreira de acessibilidade — ninguém enquadrou assim
Conversão 100% WhatsApp exclui dois grupos reais:
1. **Avós/clientes mais velhos** que preferem telefone. O `tel:` existe, mas está enterrado no footer e em /contato.
2. **B2B em desktop corporativo**: clicar no CTA verde abre wa.me → interstitial → WhatsApp Web exigindo login com QR code. Para o RH no computador da empresa isso é um beco sem saída de 3 telas.
**Fix barato:** microcopy "ou ligue (11) 96526-1000" como link `tel:` ao lado dos CTAs principais (hero, página de produto, /empresas); em /empresas, dar ao telefone e ao formulário o mesmo peso visual do WhatsApp. Isso é acessibilidade de canal e é também CRO — sinergia direta com a recomendação nº 1 da auditoria nav-conversion (componente único `<WhatsAppCta>`): **o mesmo componente que centraliza mensagem + tracking é onde se centraliza nome acessível, `<a href>` real (o WhatsAppFloat hoje é `<button>`+`window.open`) e o fallback de telefone**. Uma refatoração, quatro problemas.

### P4. Movimento perpétuo — versão pragmática
Hero com autoplay que se auto-religa (`carousel-landing.tsx:179-184`), 7 vídeos em loop, emojis voadores, ping/bounce infinitos. Para usuários com sensibilidade vestibular é tortura; para os demais é distração e 36 MB. O fix pragmático NÃO é botão de pausa (ver discordância D2):
- `<MotionConfig reducedMotion="user">` no root (1 linha, cobre todo Framer Motion);
- gate `prefers-reduced-motion` no Embla Autoplay e nos `video.play()` (que a auditoria de performance já quer pausar com IntersectionObserver — mesma mexida);
- mover `.gradient-slide` para dentro do bloco `@media (prefers-reduced-motion: reduce)` já existente em globals.css:397;
- `FlyingEmojis`: `aria-hidden="true"` no container + early-return sob reduced-motion (os emojis ❤️🔥🎉 hoje entram na árvore de acessibilidade e poluem o leitor de tela dentro do modal de maior intenção).
- remover o `setTimeout(() => autoplay.play(), 5000)` — religar autoplay depois que o usuário interagiu é hostil para todo mundo.
Esforço: baixo-médio. Cobre o espírito do WCAG 2.2.2 para quem precisa, sem inventar UI nova.

### P5. Teclado — só onde o dinheiro passa
Para o usuário B2B desktop (único perfil teclado relevante) e custo quase zero:
- Top 10: `<a onClick>` sem href → `<button>`, remover `outline:none` do CSS (`top-toys.css:383`), `aria-label` nas setas. (O modal que abre já é o melhor componente do site — Radix; só o gatilho está quebrado.)
- Dropdown do header: abrir em focus/click + ESC + `aria-expanded`.
- MobileMenu: atributo `inert` quando fechado (1 linha; hoje o Tab passeia por 17 links invisíveis) + `aria-expanded` no hambúrguer.
Esforço: baixo. **Não** fazer agora: padrão ARIA completo de carrossel, roving tabindex nos indicadores, focus trap artesanal no lightbox (se migrar pra Radix Dialog, vem de graça).

### P6. Higiene semântica de 30 minutos
Um único h1 na home (rebaixar Demonstra e remover o h1-dentro-de-h2 do TopToys), skip link no layout, alt real nas slides do hero (os textos já existem no array `carouselItems[].text` — é mover pro alt). Trivial, e os dois primeiros são também SEO.

**Critério de pronto do pacote mínimo:** página de produto e home testadas (a) no celular por toque, (b) com zoom de texto 200% — nada truncado/ilegível (atenção: `truncate` + `select-none` + px fixos quebram sob zoom; remover `select-none` de texto informativo), (c) Tab do início ao CTA do WhatsApp sem buraco preto, (d) com "reduzir movimento" ativado no sistema — nada se mexe sozinho.

---

## 3. O que pode esperar (e está ok esperar)

- `aria-live` para slides/contadores (ver D3 — fazer errado é pior que não fazer);
- textos sr-only em inglês ("Close", "Previous slide") — irrelevante na prática (D4);
- `StarRating` sem label, `aria-current` em thumbnails, nomes distintos nos dois `<nav>`;
- indicadores de paginação 12×2px do TopToys: em vez de engordar para 24px, simplesmente tirá-los do fluxo interativo (decorativos, `aria-hidden`) — as setas e o scroll fazem o trabalho;
- tooltip do WhatsAppFloat (some sozinho; a badge "1" falsa sai por honestidade, não por WCAG);
- conformidade formal AA documentada — este site não tem obrigação legal específica (não é órgão público; a LBI se aplica, mas o risco prático de autuação para uma SMB deste porte é baixíssimo). O motivo para fazer o pacote mínimo é receita, não risco jurídico — diferente do social proof fabricado, onde o risco CDC é real e a correção é urgente por outra lente.

---

## 4. Conexões que as auditorias não fizeram

1. **A11y mobile = CRO mobile.** P1 (galeria), P2 (legibilidade) e o sticky CTA mobile sugerido pela auditoria de produto (item 2.5) são o mesmo projeto: "a página de produto no celular". Empacotar junto e medir `whatsapp_click` por produto antes/depois — é o experimento mais barato e mais informativo que esse site pode rodar.
2. **Sticky CTA mobile é também acessibilidade motora:** alvo grande, fixo, sempre alcançável com o polegar — melhor do que caçar o botão após 3 telas de scroll. Recomendo com a ressalva: mínimo 48px de altura e sem cobrir o último elemento focável da página.
3. **O componente `<WhatsAppCta>` unificado (nav-conversion rec #2) é o cavalo de Troia da acessibilidade:** anchor real, nome acessível, fallback `tel:`, mensagem contextual e tracking — tudo num lugar só, e os 20+ CTAs herdam de graça. Sequenciar: criar o componente PRIMEIRO, depois o pacote mínimo fica menor.
4. **WhatsApp-first é, em si, uma escolha acessível** para público de baixa familiaridade digital — conversa é mais fácil que formulário. O site está certo em não criar pedágio de formulário. Só precisa do fallback de canal (P3).

---

## 5. Discordâncias e ressalvas (para o debate)

**D1 — A ordenação da auditoria de a11y inverte o funil deste negócio.** Ela abre com "navegação por teclado quebrada nos componentes de maior conversão" como CRÍTICO. Para um público que é esmagadoramente mobile/touch, teclado é o perfil mais raro do funil. Os itens que afetam ordens de magnitude mais alugueis são a galeria hover-only (que a própria auditoria lista, mas em 1.5) e os textos 5pt/contraste (seção 4, "MÉDIO"). Eu faria os fixes de teclado mesmo assim — custam quase nada — mas se o dev só tiver um dia, o dia é da galeria e da legibilidade, não do Top 10 por Tab.

**D2 — Botão de pausa visível no hero (rec. #4 da auditoria) é purismo.** WCAG 2.2.2 pede mecanismo de pausa, mas a leitura pragmática para uma SMB é: respeitar `prefers-reduced-motion` (quem sofre com movimento já tem isso ligado no sistema), matar o re-play forçado pós-interação e pausar vídeos fora do viewport. Um controle de pausa visível adiciona UI, manutenção e decisão de design para benefício marginal. Conformidade formal estrita pode esperar; o alívio real para o usuário sensível vem do gate de sistema.

**D3 — "aria-live ausente em todo o site" não é um gap a preencher — é quase um acerto.** Adicionar aria-live a carrosséis com autoplay de 3,5s criaria um leitor de tela tagarela anunciando slide a cada 3 segundos — pior que o silêncio. O movimento certo é o oposto: silenciar conteúdo auto-rotativo (aria-hidden nos FlyingEmojis, legenda do hero fora de heading e sem anúncio). aria-live só no que o usuário causou (feedback do form — que já existe via role=status/alert).

**D4 — WCAG 3.1.2 nos sr-only em inglês é ruído de checklist.** "Close" e "Previous slide" são anunciados de forma compreensível por NVDA/TalkBack em pt-BR; nenhum aluguel será perdido por isso. Citar tudo é papel da auditoria, mas colocar isso no mesmo documento que a galeria invisível dilui a urgência dos itens que importam. Traduzir quando passar perto do arquivo, nunca como tarefa própria.

---

## 6. Resumo executivo para o dono

Seu site é bonito, mas no celular — onde seu cliente está — as fotos do produto não têm setas, o "Top 10" tem letra de bula de remédio, e tudo pisca e se mexe sozinho. Quem tem mais de 40 anos (a maioria de quem contrata festa) sente isso na pele, mesmo sem saber o nome "acessibilidade". São 2–3 dias de trabalho de 1 dev para consertar o essencial, e a maior parte desse trabalho é a mesma coisa que as outras auditorias pedem por conversão. E coloque "ou ligue" do lado do botão verde: a avó que vai pagar o aniversário do neto agradece — e fecha.
