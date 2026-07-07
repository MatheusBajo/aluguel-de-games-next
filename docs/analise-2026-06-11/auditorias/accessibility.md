# Auditoria de Acessibilidade (WCAG 2.2 AA) — Aluguel de Games

Escopo: `src/components/` e `src/app/` + HTML renderizado via curl (localhost:3000).
Data: 2026-06-11. Stack: Next 15 / React 19 / Tailwind 4, tema escuro forçado (`html.dark`), conversão via WhatsApp.

## Resumo executivo

O site tem uma base razoável (landmarks corretos, labels de formulário associados, Radix nos modais principais,
`prefers-reduced-motion` parcialmente tratado em CSS), mas **a navegação por teclado está quebrada nos componentes de
maior valor de conversão** (Top 10 da home, dropdown do header, setas dos carrosséis, galeria de produto) e há
**conteúdo em movimento perpétuo sem mecanismo de pausa** (autoplay de carrosséis, vídeos em loop, emojis voadores,
animações ping/bounce). Contraste falha em vários textos secundários por uso sistemático de modificadores de opacidade
(`text-muted-foreground/50`, `text-white/40`) e existem textos de 5pt/7pt no Top 10. A home renderiza 3 `<h1>` (um deles
aninhado dentro de um `<h2>`). Não há skip link.

---

## 1. CRÍTICO/ALTO — Teclado e foco

### 1.1 Top 10 da home: cards não acionáveis por teclado + outline removido
- `src/components/sections/top-toys/TopToys.tsx:287-293` — o card é um `<a>` **sem `href`** com `onClick` e `tabIndex={0}`.
  Âncora sem href não dispara `click` com Enter; não há `role="button"` nem `onKeyDown`. Usuário de teclado **não
  consegue abrir o modal de produto** (que contém o CTA de WhatsApp). WCAG 2.1.1.
- `src/components/sections/top-toys/top-toys.css:383-385` — `.title-card:focus { outline: none }` remove o indicador de
  foco dos cards. WCAG 2.4.7. Também `.lolomoRow { outline: 0 }` (linha 217-218).
- `TopToys.tsx:368-388` — setas prev/next são `<div role="button" tabIndex={0}>` com `onClick` mas **sem `onKeyDown`**
  (role=button não dá comportamento de teclado de graça) e **sem `aria-label`**. WCAG 2.1.1 / 4.1.2.
- `TopToys.tsx:255-273` — indicadores de paginação são `<li>` clicáveis sem role, sem tabIndex, sem nome acessível;
  no CSS (`top-toys.css:242-247`) medem **12px × 2px** e só aparecem no hover. WCAG 2.1.1 / 2.5.8 (alvo mínimo 24px).
- `TopToys.tsx:291` — `aria-hidden="false"` explícito no link (inócuo porém sintoma de markup copiado da Netflix).

### 1.2 Dropdown do header é mouse-only
- `src/components/Header.tsx:125-196` — dropdown "Catálogo"/"Sobre" abre apenas via `onMouseEnter`/`onMouseLeave`.
  Sem `aria-expanded`, `aria-haspopup`, sem abertura por foco/Enter, sem fechamento por ESC. Usuário de teclado no
  desktop nunca vê os 8 atalhos de categoria. WCAG 2.1.1 / 4.1.2. (Mitigação parcial: links existem no footer.)

### 1.3 MobileMenu: dialog sem gestão de foco e drawer focável quando fechado
- `src/components/MobileMenu.tsx:77-84` — `<aside role="dialog" aria-modal="true">` porém:
  - **Sem focus trap** e sem mover o foco para dentro ao abrir / devolver ao fechar (WCAG 2.4.3; aria-modal sem trap
    é enganoso para SR).
  - O drawer fica **sempre renderizado** fora da tela (`translate-x-full`) sem `inert`/`aria-hidden`/`visibility:hidden`:
    com o menu fechado, o Tab percorre ~17 links invisíveis (WCAG 2.4.3, foco em conteúdo oculto).
- `MobileMenu.tsx:59-65` — botão hambúrguer sem `aria-expanded`/`aria-controls`.
- Ponto positivo: fecha com ESC (linhas 48-55) e tem `aria-label`.

### 1.4 Carrossel hero: áreas de navegação são divs clicáveis
- `src/components/ui/carousel-landing.tsx:186-213` — `CarouselAreaNavigation` usa `<div onClick>` ocupando 20% de cada
  lado, sem role, sem tabIndex, sem nome. Teclado não consegue trocar slides do hero (`StartCarousel.tsx`). WCAG 2.1.1.
  O container do carrossel também não tem `role="region"`/`aria-roledescription` (diferente do `carousel.tsx` shadcn,
  que está correto — ver linhas 137-148 de `src/components/ui/carousel.tsx`).

### 1.5 Galeria de produto: controles invisíveis para teclado e lightbox sem semântica
- `src/components/catalogo/ProductGallery.tsx:73-94` — botões prev/next/fullscreen são `opacity-0` e só aparecem com
  `group-hover` — **foco por teclado não os revela** (falta `focus-visible:opacity-100`) e são icon-only **sem
  `aria-label`**. WCAG 2.4.7 / 4.1.2 / 1.1.1.
- `ProductGallery.tsx:142-173` — modal fullscreen caseiro: sem `role="dialog"`, sem focus trap, **sem fechar com ESC**,
  botão de fechar sem nome acessível. WCAG 2.1.2 / 4.1.2.
- Thumbnails ok (nome via alt da imagem, 48px), mas sem `aria-current` para indicar a selecionada.

### 1.6 ProductInfo: botões fantasma
- `src/components/catalogo/ProductInfo.tsx:69-74` — botões Share e Heart icon-only sem `aria-label`; o **Heart não tem
  handler nenhum** (controle morto que recebe foco e não faz nada). WCAG 4.1.2 + confusão real de UX.

### 1.7 Sem skip link
- `src/app/layout.tsx:74-95` — não há "pular para o conteúdo". Header fixo + nav com dropdowns torna isso relevante.
  WCAG 2.4.1. (Landmarks existem: header/nav/main/footer confirmados via curl.)

---

## 2. ALTO — Movimento sem pausa / prefers-reduced-motion

### 2.1 Autoplay de carrosséis sem controle de pausa
- `src/components/StartCarousel.tsx:33` — `Autoplay({ delay: 3500, stopOnInteraction: true })` no hero. Não há botão
  pausar/retomar visível. WCAG 2.2.2 (conteúdo em movimento >5s iniciado automaticamente exige mecanismo de pausa).
- `src/components/ui/carousel-landing.tsx:179-184` — pior: após interação, força `autoplay.play()` de novo em 5s
  (`setTimeout(() => autoplay.play(), 5000)`), anulando o stopOnInteraction.
- Embla Autoplay não respeita `prefers-reduced-motion` por padrão — nenhum gate no código.

### 2.2 Vídeos autoplay em loop sem controles
- `src/components/sections/videos-e-imagens/Demonstra.tsx:171-184` — até 7 vídeos `autoPlay muted loop` simultâneos na
  home, sem `controls`, sem pausa. WCAG 2.2.2. Sem nome acessível (sem aria-label/title) — na página /empresas os
  vídeos têm `aria-label` (`src/app/empresas/page.tsx:165-173,199-207`), mas idem sem pausa.

### 2.3 FlyingEmojis: stream infinito de emojis no DOM
- `src/components/hooks/FlyingEmojis.tsx:53-65` — cria um emoji a cada 400–1400ms para sempre (usado no
  CarouselModal, `CarouselModal.tsx:140-144`). Sem `prefers-reduced-motion`, sem pausa (WCAG 2.2.2) e o container
  **não tem `aria-hidden`** — os emojis (texto real: ❤️🔥🤩🎉👏) entram na árvore de acessibilidade e podem ser
  anunciados/atrapalhar o virtual buffer de leitores de tela.

### 2.4 Animações infinitas sem guard de reduced motion
- `src/components/WhatsAppFloat.tsx:65` `animate-ping` + `:77` `animate-bounce` (badge "1") — infinitas, sem
  `motion-reduce:`/media query.
- `src/app/globals.css:164-184` — `.gradient-slide` (headline do hero) anima infinito; **não** está no bloco
  `@media (prefers-reduced-motion: reduce)` (linhas 397-405 cobrem rise-in/hero-cta/badge-live, mas não gradient-slide).
- GSAP: `src/components/sections/como-funciona/ComoFunciona.tsx:80+` e `src/components/StartCarouselClaude.tsx:62-84`
  usam `gsap.matchMedia()` só com breakpoints de largura — sem condição `(prefers-reduced-motion: reduce)`.
- Framer Motion: nenhum `<MotionConfig reducedMotion="user">` no app (Main.tsx, CatalogCard, Demonstra, WhatsAppFloat).
- Pontos positivos: `AnimatedHeadline.tsx:31-35` e `Counter.tsx:52-53` respeitam reduced motion; CSS de modal
  (globals.css:325-330) e CTAs (397-405) também; `not-found.tsx:198` idem.

### 2.5 Tooltip automático do WhatsAppFloat
- `WhatsAppFloat.tsx:12-27` — tooltip aparece sozinho aos 5s e some aos 15s; não é dismissível pelo usuário
  (WCAG 1.4.13 é sobre hover/focus, mas o padrão de conteúdo intermitente também toca 2.2.2 brandamente). Menor.
- Badge "1" falso de notificação entra no nome acessível do botão ("WhatsApp 1") — padrão enganoso (dark-pattern leve).

---

## 3. MÉDIO — Estrutura semântica

### 3.1 Múltiplos h1 na home + aninhamento inválido
- Confirmado via curl: SSR já traz 2 `<h1>`; com `TopToys` (ssr:false) hidratado são **3 h1**:
  1. `AnimatedHeadline` (`StartCarousel.tsx:62-69` → `AnimatedHeadline.tsx:79` renderiza `<h1>`).
  2. `TopToys.tsx:236-246` — **`<h1>` dentro de `<span>` dentro de `<h2 class="rowHeader">`** ("Brinquedos: top 10
     mais alugados"). HTML inválido (heading dentro de heading) + h1 duplicado. WCAG 1.3.1.
  3. `Demonstra.tsx:224-228` — `<h1>Nossos Brinquedos em Ação</h1>`.
- `src/components/catalogo/ProductInfo.tsx:65,85` — página de produto pula de h1 para h3 ("Características").
- `AnimatedCarouselText.tsx:112-117` — legenda do carrossel é um `<h2>` cujo conteúdo troca a cada 3,5s e é
  picotado em chars pelo SplitText; deveria ser `<p aria-hidden>` ou ao menos não-heading com `aria-live="off"`.

### 3.2 Alt text fraco no carrossel principal
- `StartCarousel.tsx:94` — `alt={"Imagem Carousel " + (index+1)}` é alt genérico/inútil; os textos descritivos existem
  no array (`carouselItems[].text`, linhas 20-29) mas vão para o overlay animado, não para o alt. WCAG 1.1.1.
- Demais imagens OK: curl confirmou 0 `<img>` sem alt em todas as rotas; CatalogCard/ProductGallery/galeria usam alt
  significativo.

### 3.3 StarRating sem alternativa textual
- `src/components/util/StarRating.tsx:15-25` — só ícones FaStar, sem `aria-label`/texto oculto com o valor. WCAG 1.1.1.

### 3.4 Idioma de textos ocultos
- `src/components/ui/dialog-antigo.tsx:81` — `<span class="sr-only">Close</span>` e `carousel.tsx:208,235`
  ("Previous slide"/"Next slide") em inglês num site pt-BR. WCAG 3.1.2 (menor). O CarouselModal sobrescreve com
  aria-label pt-BR (`CarouselModal.tsx:199-207`) — bom.

---

## 4. MÉDIO — Contraste e legibilidade (tema escuro)

Tokens: `--background` dark = oklch(14.5%) ≈ #0a0a0a; `--muted-foreground` dark = oklch(70.8%) ≈ #a3a3a3
(globals.css:727,744). `text-muted-foreground` puro ≈ 7,8:1 — **passa**. O problema é o padrão de aplicar opacidade:

- `text-muted-foreground/50` ≈ 3,4:1 — **reprova** texto normal (AA exige 4,5:1).
  Usos: `ContactForm.tsx:21` (placeholder /50), `contato/page.tsx:148`, `MobileMenu` não, `Main.tsx` etc.
- `text-muted-foreground/60` ≈ 4,2:1 — reprova em texto pequeno. Usos: `ContactForm.tsx:207,231`
  ("A gente responde em 1 dia útil", 12px), `StartCarousel.tsx:163`, `Main.tsx:194`.
- `text-white/40` em `CarouselModal.tsx:188` ("Entrega · Montagem · Suporte", `label-arcade` = 11px) ≈ 3,5:1 — reprova.
- `text-gray-500` em `CatalogCard.tsx:98` ("locações", 12px sobre `bg-gray-800/50`) ≈ 3,5:1 — reprova.
- `text-muted-foreground/70` (~5,1:1) e `text-gray-400` (Demonstra:229,254) passam.
- Títulos com `text-muted-foreground/70` no h1 (`StartCarousel.tsx:67`) passam por serem texto grande (≥3:1).

### Tipografia minúscula
- `TopToys.tsx:335-348` — `text-[7pt]` (≈9px) e `text-[5pt]` (≈6,7px) para título/desc/locações nos cards mobile.
  Ilegível para baixa visão; zoom de texto quebra o truncate. Não é falha automática de WCAG, mas é o pior ponto de
  legibilidade do site.
- `AnimatedCarouselText.tsx:114` — `text-[8pt]` (≈10,6px) para a legenda do hero em mobile.
- `.label-arcade` = 0.7rem (11,2px) uppercase com letter-spacing 0.25em usado por todo o site, com frequência em /50-/60
  de opacidade (globals.css:35-41).

---

## 5. BAIXO — Outros

- **Alvo de toque**: indicadores do TopToys 12×2px (ver 1.1); demais botões ≥36px ok (WCAG 2.5.8 mínimo 24px).
- **`select-none`** no hero e cards (`StartCarousel.tsx:78`, TopToys) impede seleção/cópia de texto — atrito para
  usuários de ampliação/leitura.
- **Honeypot** do form usa `className="hidden"` + `display:none` — ok, não focável (correto).
- **Form de contato bem feito**: labels `htmlFor` corretos (`ContactForm.tsx:88-201`), `autoComplete`, `role="status"`
  / `role="alert"` no feedback (239,249). Falta apenas `aria-required`/asterisco no select e `focus-visible` já coberto.
- **Viewport ok**: sem `user-scalable=no` (`layout.tsx:60`). Zoom permitido.
- **Botões shadcn**: `focus-visible:ring-[3px]` presente (`button.tsx:8`) — bom onde o Button é usado.
- **CarouselModal (Radix)**: focus trap, ESC, `DialogTitle/Description` ocultos corretos (`CarouselModal.tsx:55-60`);
  setas com aria-label pt-BR. Melhor componente do site em a11y. Indicadores de slide são decorativos (spans) — ok,
  mas sem anúncio de mudança de slide (aria-live) — menor.
- **aria-live ausente em todo o site** (curl: 0 ocorrências) — mudanças dinâmicas (slides, contadores) silenciosas;
  o form usa role status/alert que suprem o caso mais importante.
- **Breadcrumb correto** em `CategoryListing.tsx:48` (`<nav aria-label="Breadcrumb">`) — bom.
- **2 `<nav>` sem aria-label distintos** (header e drawer) — menor.
- **useKeyboardShortcuts** (`src/components/hooks/useKeyboardShortcuts.ts:34-38`) sequestra Ctrl/Cmd+F (busca do
  navegador) se for usado — verificar onde é montado; hoje parece código de admin.

---

## Top recomendações (impacto × esforço)

1. **Top 10**: trocar `<a onClick>` por `<button>`, remover `outline:none`, adicionar aria-label nas setas +
   onKeyDown — destrava teclado no componente de maior conversão da home. (Esforço baixo)
2. **MobileMenu**: `inert` quando fechado + foco inicial no drawer + `aria-expanded` no hambúrguer; ou migrar para
   Radix Dialog/Sheet que faz tudo isso de graça. (Esforço baixo-médio)
3. **Header dropdown**: abrir também em focus/click com `aria-expanded` + ESC. (Esforço baixo)
4. **Pausa global de movimento**: botão pausar no hero + gate `prefers-reduced-motion` para Embla Autoplay, vídeos
   do Demonstra (renderizar `controls` ou poster estático) e FlyingEmojis (`aria-hidden` + early-return). (Médio)
5. **Contraste**: criar token `--muted-foreground-strong` e abolir `/40-/60` em texto informativo; subir 7pt/5pt do
   TopToys para mínimo 11-12px. (Baixo)
6. **Headings**: um único h1 por página (home), remover h1-dentro-de-h2 do TopToys, rebaixar h1 do Demonstra para h2.
   (Trivial)
7. **Skip link** no layout.tsx antes do Header. (Trivial)
8. **ProductGallery**: aria-labels, `focus-visible:opacity-100`, ESC no fullscreen ou usar Radix Dialog. (Baixo)
