# Auditoria — Home Page e Hero
**Área:** `src/app/page.tsx`, `HomeShell.tsx`, `Main.tsx`, `StartCarousel.tsx`, `StartCarouselClaude.tsx`, `AnimatedCarouselText.tsx`, `ui/carousel-landing.tsx`, `ui/AnimatedHeadline.tsx`, `hooks/DynamicGradient.tsx`, `hooks/FlyingEmojis.tsx`, `sections/*`
**Data:** 2026-06-11 · Verificado contra dev server `http://localhost:3000` (HTML renderizado salvo em `/tmp/aluguel-analysis/home.html`, 402 KB)

---

## 1. BUG CONFIRMADO: "Máquinas (0)" — Unicode NFC vs NFD (CRÍTICO para qualidade percebida)

**Causa raiz confirmada por teste.** O nome da pasta no disco (macOS/APFS) está em forma **NFD** (decomposta): `M` `a` `U+0301 (acento combinante)` `quinas`. O literal em `src/app/page.tsx:153-163` está em **NFC** (`á` = U+00E1):

```
// teste node executado:
"Máquinas" (do readdir)  → NFC? false  NFD? true  → codepoints: 4d 61 301 71 75 69 6e 61 73
'Máquinas' (literal NFC) → NÃO é igual ao nome do filesystem
```

Fluxo do bug:
1. `src/lib/catalog.server.ts:48` — `walk()` monta a `key` com `e.name` cru do `fs.readdir`, **sem normalizar** (`out.push({ ...data, key: [...seg, e.name].join('/') })`).
2. `src/app/page.tsx:160-163` — `const [, sub] = it.key.split("/")` e depois `if (sub === "Máquinas")` compara NFD (filesystem) com NFC (código-fonte) → **nunca bate**. "Fliperamas" e "Consoles" são ASCII puro, por isso funcionam.
3. `src/app/page.tsx:214-220` — `CatalogSection categoria="Máquinas" items={groups["Máquinas"]}` recebe array vazio.
4. `src/components/catalogo/CatalogSection.tsx:71-83` — **não há guarda para `items.length === 0`**: renderiza o cabeçalho com `({items.length})` e um grid vazio.

**Confirmado no HTML renderizado:** `<h3 ...>Máquinas</h3><span class="text-sm text-gray-500">(0)</span>` seguido de `<div class="grid ...."></div>` vazio. No flight data: `"Máquinas\",\"items\":[]`.

A pasta existe e tem 6 produtos: `public/Organizado/Jogos Eletrônicos/Máquinas/` (Maquina de Dança, Maquina Boxe, Maquina Martelo, Martelo Infantil, 2× Máquina de pegar Bichinho). Ou seja: a home promete "os 3 carros-chefe do catálogo" (page.tsx:195) e exibe uma prateleira vazia — péssimo para confiança.

**Correções recomendadas (duas camadas):**
- Normalizar na origem: em `catalog.server.ts:48`, usar `e.name.normalize('NFC')` ao montar a key (idem em `getAllSlugs`/`findReal` para consistência). É a correção robusta — vale para qualquer pasta acentuada futura (afeta também "Jogos Eletrônicos", "Videokês" etc. em qualquer comparação literal).
- Defesa em profundidade: em `CatalogSection.tsx`, retornar `null` (ou esconder o header) quando `items.length === 0`; em `page.tsx`, filtrar grupos vazios antes de renderizar.
- Observação: o util `norm()` em `catalog.server.ts:24-29` já faz `.normalize('NFD')` para a busca de slugs — o bug é só na comparação literal da home, que não usa `norm()`.

---

## 2. Peso de mídia: ~35 MB de vídeo em autoplay simultâneo na home (ALTO)

`src/components/sections/videos-e-imagens/Demonstra.tsx:17-74` lista 7 vídeos MP4 locais; pesos reais medidos:

| arquivo | peso |
|---|---|
| 20250405_165640.mp4 | 10 MB |
| WhatsApp Video 2021-08-09...mp4 | 6.8 MB |
| VID-20231020-WA0026.mp4 | 6.1 MB |
| WhatsApp Video 2023-10-04...mp4 | 4.9 MB |
| VID-20230928-WA0025.mp4 | 3.2 MB |
| Vídeo do WhatsApp de 2024-11-13 à(s)...mp4 | 2.1 MB |
| WhatsApp Video 2025-07-01...mp4 | 1.7 MB |
| **Total** | **~34.8 MB** |

- Todos com `autoPlay muted loop playsInline` (Demonstra.tsx:171-184) e **sem IntersectionObserver** — os 7 tocam ao mesmo tempo, mesmo fora do viewport. `preload="metadata"` é anulado pelo `autoPlay`.
- Em 4G isso compete com o LCP do hero e mata o plano de dados do visitante mobile (persona principal: mãe organizando festa pelo celular).
- Nomes de arquivo com espaços, acentos e parênteses (`Vídeo do WhatsApp de 2024-11-13 à(s) 17.19.45_c9e99fd1.mp4`) — frágil para CDN/encoding de URL.
- `Demonstra.tsx:216` — `min-h-screen` força a seção a ocupar viewport inteiro mesmo com pouco conteúdo.
- **Recomendações:** comprimir/transcodificar (H.264 720p ~1 MB cada ou poster + play sob clique), montar `<video>` só quando visível (IntersectionObserver), renomear arquivos para slugs ASCII.

## 3. Hero invisível até o JS hidratar — risco de LCP/abandono (ALTO)

- `src/components/ui/AnimatedHeadline.tsx:79` — `<h1 style={{ opacity: 0 }}>` no HTML estático. Só fica visível após: hidratação React → `import("gsap")` dinâmico → `document.fonts.ready` → SplitText → tween. Confirmado no HTML renderizado: `h1 style="opacity:0"`. Em conexão lenta, o headline (proposta de valor) fica invisível por segundos. `prefers-reduced-motion` é respeitado (linha 31-35), mas se o chunk do gsap falhar, o h1 fica invisível para sempre.
- `src/components/StartCarousel.tsx:78` — `.div-carousel` com `opacity-0 translate-y-[-30px]` revertido apenas por GSAP em `useLayoutEffect` (linhas 39-42). O carrossel — provável elemento LCP — está oculto no HTML inicial. **Sem fallback para `prefers-reduced-motion`** aqui (o tween roda sempre).
- CTAs do hero têm `cta-bounce-in 0.7s ... 0.5s both` (globals.css:351-361) + wrapper `.rise-in` com `animationDelay: 380ms` (StartCarousel.tsx:117) — CSS puro (ok sem JS), mas soma ~1s até o CTA estar visualmente estável.
- **Recomendação:** padrão "progressive enhancement" — conteúdo visível por padrão, classe `js-anim` adicionada para esconder/animar só quando o JS já está garantido; ou animar com CSS como os `.rise-in`.

## 4. CTA primário do hero SEM tracking de conversão (ALTO para mensuração)

- `src/components/StartCarousel.tsx:123-127` — o botão "Pedir orçamento" do hero (CTA mais importante do site) **não chama `trackWhatsAppClick`**. Comparar com:
  - `Main.tsx:178` — CTA final: `trackWhatsAppClick("home_cta_final_orcamento")` ✔
  - `Demonstra.tsx:261` — `trackWhatsAppClick('home_cta_demonstracao')` ✔
  - `WhatsAppFloat.tsx:30` — `trackWhatsAppClick('floating_button', ...)` ✔
- Resultado: o funil no GTM/GA4 fica cego exatamente no ponto de maior intenção. Impossível comparar performance hero vs CTA final.
- Bônus: o hero usa `WHATSAPP_CONFIG.link` cru, sem `?text=` — `getWhatsAppLink(message)` existe em `src/config/whatsapp.config.ts:12-19` e não é usado; o cliente chega no WhatsApp com a caixa vazia (atrito + mensagens iniciais sem contexto para o atendente).

## 5. Hierarquia visual / dobra (MÉDIO-ALTO)

- Desktop: label + headline (`text-4xl…lg:text-7xl`) + sub + carrossel `aspect-video max-h-[640px]` (StartCarousel.tsx:91) ≈ 1000–1150px antes dos CTAs → **"Pedir orçamento" abaixo da dobra** em notebooks 768–900px de altura. Mitigado parcialmente pelo `WhatsAppFloat` (layout.tsx:89), mas o CTA contextual do hero não é visto sem scroll.
- A ordem das seções é estranha para o funil (posições confirmadas no HTML): Hero (27.6k) → Top 10 (41k) → Vídeos (55.9k) → Quem somos (66.4k) → **CTA final "pacote ideal" (74.9k)** → **Catálogo em destaque (79k)**. O catálogo com links para produtos vem DEPOIS do "CTA final" — quem segue o fluxo recebe o fechamento antes da vitrine. Catálogo destacado deveria vir antes do CTA de fechamento.
- Estatísticas (500+/60+/98%) duplicadas na mesma página: hero (StartCarousel.tsx:143-158) e Quem Somos (Main.tsx:106-121) — redundância dilui impacto.
- `StartCarousel.tsx:145` — `Counter to={33}` hardcoded ("33+ anos") vs `Main.tsx:17` que calcula `new Date().getFullYear() - 1993` dinamicamente. Em 2027 o hero estará errado.
- "500+ eventos" desde 1993 ≈ 15 eventos/ano — número provavelmente subestimado que enfraquece a prova social; "98% satisfação" sem fonte.
- Trust bar (StartCarousel.tsx:160-172) é só texto ("Grandes empresas · Personalidades públicas...") — sendo que o negócio TEM provas concretas (Bradesco/"Braland", Danilo Gentili) escondidas como legendas de carrossel. Logos/nomes reais converteriam muito mais.

## 6. Duplicação e código morto de carrossel (MÉDIO)

- `src/components/StartCarouselClaude.tsx` (283 linhas) — **não é importado em lugar nenhum** (grep confirmado). É um segundo hero completo, com headline diferente ("Transforme seu Evento em Diversão"). Pior: referencia `/carousel/compressed/*.png` (linhas 20, 27, 34, 41) — **esses .png não existem** (`ls *.png` → vazio; só há .webp). Se alguém reativar, 4 imagens 404.
- `src/components/hooks/DynamicGradient.tsx` — **não usado em lugar nenhum** (só a própria definição). Código morto com colorthief.
- `FlyingEmojis.tsx` — usado apenas em `CarouselModal.tsx:142` (modal do Top 10). Não está na home diretamente; ok, mas vive em `hooks/` sendo componente visual (organização confusa).
- Três implementações de slider coexistem: embla (`carousel-landing.tsx`), slider manual estilo Netflix (`TopToys.tsx`, ~400 linhas com scroll/clone manual) e o `CarouselModal`. Manutenção tripla.
- `carousel-landing.tsx:48` — `const [autoplay] = useState(null)` nunca recebe valor; exposto no contexto (linha 114) e em deps de efeito (linha 98) — código morto interno.
- `StartCarousel.tsx:8-10, 35-37` — importa e registra `ScrollTrigger` e `SplitText` estaticamente **sem usar nenhum dos dois** no componente. Isso põe gsap+plugins no bundle inicial e anula o "code split" prometido no comentário de `AnimatedHeadline.tsx:21` (que importa gsap dinamicamente). `AnimatedCarouselText.tsx:10-14` também importa estaticamente.

## 7. Carrossel hero: UX e acessibilidade (MÉDIO)

- `carousel-landing.tsx:186-213` (`CarouselAreaNavigation`) — duas zonas de clique de **20% da largura cada** (40% do hero) com setas **sempre visíveis** sobre a imagem; são `<div onClick>` sem `role="button"`, sem `aria-label`, sem `tabIndex` → invisíveis para teclado/leitor de tela. Em mobile, tap nas laterais navega em vez de permitir arrasto (o overlay intercepta o gesto horizontal; só `touchAction: pan-y`).
- `AnimatedCarouselText.tsx:111-117` — legenda renderizada **centralizada no meio da imagem** (`items-center justify-center`), mas o gradiente de legibilidade fica **na base** (StartCarousel.tsx:98, comentário: "mais forte na base pra texto ficar legível"). Texto branco no centro de fotos claras = contraste ruim. E `text-[8pt]` (~10.6px) em mobile é ilegível — abaixo do mínimo prático de 12px.
- A legenda usa `<h2>` para texto decorativo de slide — polui o outline de headings (10 h2 "fantasma" rotativos).
- `StartCarousel.tsx:94` — `alt={"Imagem Carousel N"}` genérico, sendo que `carouselItems[i].text` tem descrições ótimas ("Aniversário do Danilo Gentili — Pinball 007"). Alt ruim para SEO de imagem e leitores de tela.
- As 10 imagens do carrossel (~945 KB no total; maior: `c71c0260...webp` 362 KB) carregam **todas eager** (sem `loading="lazy"` nos slides fora da viewport, sem `width/height` → confirmei 27 `<img>` sem width no HTML) e `CarouselOverlayGradient.tsx:42-60` ainda decodifica **todas as 10** com ColorThief no mount (Promise.all) só para gerar gradientes decorativos.
- `Autoplay({ delay: 3500, stopOnInteraction: true })` (StartCarousel.tsx:33) — 3.5s é rápido para ler legenda + ver a foto; após interação o autoplay para de vez (exceto cliques nas setas, que religam após 5s via `handleInteraction`).

## 8. Headings e semântica (MÉDIO)

Confirmado no HTML renderizado (SSR): 2 `<h1>` — o do hero ("Aluguel de games…") e **outro em Demonstra.tsx:224** ("Nossos Brinquedos em Ação"). Client-side soma um 3º: `TopToys.tsx:236-246` renderiza `<h2 class="rowHeader"><span><div class="px-5"><h1>Brinquedos: top 10 mais alugados</h1></div></span></h2>` — **h1 aninhado dentro de h2** (HTML inválido; parser fecha o h2 sozinho) e título redundante com o h2 "10 atrações que viraram tradição" de `Main.tsx:33-36` logo acima — dois títulos para a mesma seção.
- Recomendação: 1 único h1 (hero); rebaixar Demonstra e TopToys interno para h2/h3 ou texto não-heading.

## 9. TopToys com `ssr: false` — seção vazia no HTML estático (MÉDIO)

`Main.tsx:14` — `dynamic(() => import(...TopToys), { ssr: false })` **sem fallback `loading`**. Em static export, o HTML da home tem o título da seção mas o conteúdo do Top 10 não existe (confirmado: "Brinquedos: top 10" ausente do HTML SSR). Efeitos: flash de seção vazia + layout shift quando o JS chega; conteúdo invisível para crawlers que não executam JS; os cards do Top 10 abrem **modal** (sem link para página de produto) — zero link equity interno da seção mais nobre da home.

## 10. Metadata/SEO da home (BAIXO-MÉDIO)

- OG image (`page.tsx:46-53`): declara `1200x630` mas `/Logo-Aluguel-de-games.png` é **1000x1000** (290 KB) — preview de compartilhamento corta/encaixa mal no WhatsApp (justamente o canal de conversão!). Criar OG 1200×630 real com foto de evento.
- `page.tsx:78-79` — verificação do Google Search Console pendente (TODO no código).
- JSON-LD `EntertainmentBusiness` bem feito (foundingDate, areaServed, OfferCatalog) ✔.
- HTML de 402 KB para a home — catálogo serializado 2× (HTML + RSC flight). Aceitável em static export, mas é peso gratuito; os grupos poderiam ser enxugados (só key/titulo/1ª imagem).

## 11. Pontos fortes (manter)

- `Counter.tsx` — SSR-safe exemplar: renderiza valor final no HTML, anima só após hidratar, IntersectionObserver + reduced-motion ✔.
- `AnimatedHeadline` — split por linhas com máscara, espera fonts, respeita reduced-motion, gsap dinâmico — engenharia cuidadosa (apesar do problema do opacity:0 inicial).
- Copy do hero é clara e localizada ("Aluguel de games pra sua festa ser inesquecível", "Desde 1993 · Grande SP") — proposta de valor + diferencial de longevidade acima da dobra ✔.
- Dois CTAs com hierarquia correta (WhatsApp primário verde, catálogo secundário outline) repetidos em 3 pontos da página ✔.
- `globals.css:397-404` — bloco `prefers-reduced-motion` cobre `.rise-in` e CTAs ✔.
- Prova social concreta existe no acervo (Danilo Gentili, Bradesco/Braland, Kay Black) — só precisa ser promovida de legenda a destaque.

## 12. Resumo de correções priorizadas

| # | Ação | Arquivo:linha | Impacto |
|---|---|---|---|
| 1 | `e.name.normalize('NFC')` no walk + guard `items.length===0` | catalog.server.ts:48, CatalogSection.tsx:62, page.tsx:153-163 | Elimina "Máquinas (0)"; +6 produtos voltam à vitrine |
| 2 | Comprimir vídeos + lazy mount por viewport | Demonstra.tsx:17-74,171 | -30 MB na home; LCP/4G |
| 3 | Adicionar `trackWhatsAppClick('hero_orcamento')` + `getWhatsAppLink(msg)` | StartCarousel.tsx:123 | Funil mensurável; menos atrito |
| 4 | Conteúdo do hero visível por padrão (anim como enhancement) | AnimatedHeadline.tsx:79, StartCarousel.tsx:78 | LCP/resiliência |
| 5 | Deletar StartCarouselClaude.tsx e DynamicGradient.tsx | — | Higiene |
| 6 | Corrigir h1 aninhado / múltiplos h1 | TopToys.tsx:236-246, Demonstra.tsx:224 | SEO/a11y |
| 7 | Legenda do carrossel: base + fonte ≥12px + alt descritivo | AnimatedCarouselText.tsx:111-117, StartCarousel.tsx:94 | Legibilidade |
| 8 | Mover catálogo destacado para antes do CTA final | page.tsx:166-250 | Fluxo de funil |
| 9 | OG image 1200×630 real | page.tsx:46-53 | CTR em compartilhamento |
| 10 | Setas do carrossel acessíveis (button + aria-label) | carousel-landing.tsx:186-213 | a11y |
