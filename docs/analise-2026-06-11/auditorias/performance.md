# Auditoria de Performance e Core Web Vitals — Aluguel de Games

Data: 2026-06-11 · Analista: agente de performance (auditoria profunda)
Stack: Next.js 15 (App Router, React 19, Tailwind 4), `output: 'export'` (HTML estático na Hostinger/LiteSpeed), tema escuro, conversão via WhatsApp.

## Números levantados (medidos, não estimados)

| Métrica | Valor |
|---|---|
| `public/` total | **591 MB** (731 arquivos) |
| MP4 em `public/` | **501,6 MB em 49 arquivos** (tutoriais/manuais dentro de `public/Organizado/`) |
| WEBP em `public/` | 74,4 MB em 564 arquivos |
| Vídeos com autoplay na home (`/demonstra`) | **~34,7 MB em 7 vídeos** (10,0 + 6,7 + 6,1 + 4,9 + 3,2 + 2,1 + 1,7 MB) |
| Preloads `as=image` na home | 10 imagens ≈ **930 KB** (todas do carrossel hero) |
| Imagens únicas na página de produto "Máquina Boxe" | **11,34 MB em 19 arquivos** |
| Imagens dos cards em `/catalogo` | **8,4 MB em 46 imagens** (servidas no original) |
| Maiores webp | 1,7 MB / 1,6 MB / 1,46 MB — todas **3000×4000 ou 3024×4032 px** |
| HTML da home (dev) | 402 KB bruto / **41 KB gzip** |
| HTML `/catalogo` (dev) | 503 KB bruto |
| `node_modules` | **1,1 GB** |

## ACHADOS CRÍTICOS

### 1. ~35 MB de vídeo autoplay na home (CRÍTICO)
- `src/components/sections/videos-e-imagens/Demonstra.tsx:17-74` — 9 itens, 7 vídeos `.mp4` de `/demonstra/`.
- `Demonstra.tsx:171-184` — `<video autoPlay muted loop playsInline preload="metadata">`; `Demonstra.tsx:103-117` — no `loadedmetadata` chama `video.play()` incondicionalmente.
- **Sem IntersectionObserver, sem poster, sem lazy-mount**: os 7 vídeos começam a baixar/tocar mesmo fora da viewport. Em 4G (~5 Mbps) são ~55 s de download; estoura qualquer orçamento de dados móveis e compete com tudo (LCP, JS, imagens).
- Vídeos são gravações de WhatsApp sem re-encode (ex.: `20250405_165640.mp4` = 10 MB).
- Correção: poster webp + carregar `src` só quando visível (IO), re-encodar para 720p H.264 CRF 28 (cada um cairia para ~1–2 MB) ou usar `preload="none"`.

### 2. `images.unoptimized: true` + originais 3000×4000 servidos direto (CRÍTICO)
- `next.config.ts:7-9` — obrigatório com `output: 'export'`, mas **nenhum pipeline alternativo existe**.
- `src/components/catalogo/ProductGallery.tsx:60-67` — `next/image` com `sizes=` que NÃO faz nada com `unoptimized` (não gera srcset): serve o arquivo original. Imagem principal da "Máquina Boxe": **1,46 MB, 3024×4032** exibida a ~600 px.
- Thumbnails de 48–80 px (`ProductGallery.tsx:120+`) baixam o MESMO arquivo de megabytes.
- `/catalogo`: 52 cards servindo originais (8,4 MB; ex. `Fliperama 5.000.webp` 579 KB @ 3072×4096 num card de ~200 px).
- Home (strip de catálogo): 13 imagens `/Organizado/` originais (lazy, mas pesadas ao rolar).
- **Ironia: `sharp` está em `dependencies` (package.json:55) e não é importado em lugar nenhum** (src/, scripts/, studio/). Dá para gerar variantes (400w/800w/1600w) no build com um script + loader custom, ou usar `next-image-export-optimizer`.
- Impacto: LCP móvel de produto facilmente > 6–10 s; banda total da página de produto ~11,3 MB.

### 3. Hero (LCP) invisível até o JS rodar (ALTO)
- `src/components/StartCarousel.tsx:85` — wrapper `.div-carousel` com `opacity-0 translate-y-[-30px]` no HTML estático; só fica visível quando GSAP roda (`StartCarousel.tsx:43-46`).
- `src/components/ui/AnimatedHeadline.tsx:38-60` — o **h1 do hero** começa com opacity 0 e só aparece após `import("gsap")` dinâmico + `import("gsap/SplitText")` + `document.fonts.ready`.
- Consequência: o benefício do static export é anulado — o candidato a LCP (headline + slide 1) é "renderizado" tarde porque elementos com opacity:0 não contam para LCP. Em conexão lenta o usuário vê página vazia com decoração de fundo. Se o JS falhar, o hero NUNCA aparece (exceto com prefers-reduced-motion).
- Correção: renderizar visível por padrão e animar com classe CSS adicionada via JS (progressive enhancement), ou animar apenas transform (não opacity inicial), ou `gsap.from()` em vez de estado inicial no markup.

### 4. Primeira seção (TopToys) com `ssr: false` (ALTO)
- `src/components/Main.tsx:14` — `dynamic(() => import(".../TopToys"), { ssr: false })`.
- A primeira seção após o hero ("Top 10 mais alugados") não existe no HTML estático: buraco de conteúdo para SEO, CLS quando monta, e espera de hidratação + chunk extra. Os dados são JSON estático (`top-toys/data/topToysData_full_svg_all.json`, 11 KB) — não há motivo para client-only.
- TopToys também importa `gsap` + `ScrollTrigger` (`TopToys.tsx:9-10`) além do framer-motion já usado na página.

### 5. 10 preloads de imagem competindo com o LCP (ALTO)
- HTML da home: 10 × `<link rel="preload" as="image">` (todas as slides do carrossel) ≈ **930 KB** com prioridade alta, sendo que só a slide 1 é visível. Uma delas (`c71c0260...webp`) tem **4032×3024 / 354 KB** — nem foi comprimida como as demais (resto está em ~1024×576).
- Correção: preload apenas da slide 1 com `fetchpriority="high"`; demais slides lazy via embla.

## ACHADOS MÉDIOS

### 6. package.json inchado: dependências mortas/duplicadas (MÉDIO — afeta build/DX e risco de bundle)
Verificado por grep de imports em src/, scripts/, studio/:
- **Nunca importadas em lugar nenhum**: `styled-components`, `react-dnd`, `react-dnd-html5-backend`, `@dnd-kit/core`, `@dnd-kit/sortable`, `color-thief-react`, `phosphor-icons` (v1, CSS font), `react-confetti`, `next-sanity`, `@sanity/image-url`, `react-dropzone`, `slugify`, `sharp` (deveria ser usada! ver item 2).
- **Duplicações**: `colorthief` E `color-thief-react`; `react-dnd` E `@dnd-kit`; `phosphor-icons` E `@phosphor-icons/react`; GSAP E framer-motion (ambos rodam na home); 3 bibliotecas de ícones em uso real (`react-icons`, `lucide-react`, `@phosphor-icons/react`).
- **`sanity` (^5.21) e `@sanity/vision` no package.json raiz** (package.json:29-30,53) mas só usados em `studio/` — que TEM package.json próprio. São centenas de MB do node_modules de 1,1 GB e alongam `npm install`/CI.
- Componentes mortos: `src/components/StartCarouselClaude.tsx` (não referenciado), `src/components/ui/sonner.tsx` (Toaster nunca montado), `src/components/mode-toggle.tsx` (nunca usado — dark forçado), `dialog-antigo.tsx` só usado pelo modal antigo.
- Risco real: tree-shaking protege o bundle das deps não importadas, mas o custo é instalação, atualização, auditoria de segurança e chance de alguém importar `color-thief-react`/`react-dnd` por engano.

### 7. 501 MB de vídeos tutoriais dentro de `public/Organizado/` (MÉDIO — deploy/custos)
- `output: 'export'` copia TUDO de `public/` para `out/` → o deploy carrega ~591 MB, incluindo `video tutorial playstation 5 - versão lenta.mp4` (96,7 MB!), versões "lenta" e "rápida" do mesmo tutorial (154 MB juntas), vídeos comprimidos E não-comprimidos duplicados (`Alinhando Quest... .mp4` 44,6 MB + versão "Comprimido" 41 MB).
- Também vão para o servidor público: 11 `.docx`, 4 `.cdr` (CorelDRAW), 2 `.py`, 1 `.mov` — arquivos internos expostos e indexáveis.
- Correção: mover manuais/tutoriais para fora de `public/` (ou hospedar no YouTube não listado), e filtrar extensões no build.

### 8. ColorThief na thread principal durante o carregamento (MÉDIO)
- `src/components/ui/CarouselOverlayGradient.tsx:42-70` — no mount, decodifica as 10 imagens do carrossel e roda `getPalette()` (canvas) em cada uma, na main thread, durante a janela crítica de LCP/INP. Os gradientes são determinísticos — podiam ser pré-computados no build (script com sharp/node) e embutidos como constantes.

### 9. CLS no grid Demonstra (MÉDIO)
- `Demonstra.tsx:131-143` — `getSpanClass()` depende de `dimensions` carregado async (metadata do vídeo/img); com `gridAutoFlow: 'dense'` os cards trocam de span e o grid REFLUI conforme cada mídia carrega → layout shifts visíveis na seção. Dimensões podiam estar hard-coded no array `mediaItems`.

## ACHADOS BAIXOS

### 10. Fontes: 3 famílias / 11 pesos (BAIXO)
- `src/app/layout.tsx:12-31` — Bricolage Grotesque (4 pesos) + DM Sans (4) + JetBrains Mono (3) via `next/font` (self-hosted, `display: swap` — bom). ~11 arquivos woff2. JetBrains Mono é usada só para acentos `label-arcade`/numerais; `globals.css:15` redefine `--font-mono` para fonte de sistema, criando conflito de cascata — vale auditar se JetBrains Mono é necessária. Cortar pesos não usados (ex.: 500/600 intermediários) economiza ~50–100 KB.

### 11. GTM (BAIXO — ok no geral)
- `layout.tsx:62-71` — GTM inline com `strategy="afterInteractive"` + noscript iframe: padrão correto. ID via env presente (`GTM-WN24XLQC` renderizado). Único refinamento: `strategy="lazyOnload"` ou Partytown se TBT móvel estiver alto (GTM costuma puxar 80–200 KB de tags).

### 12. next-themes desnecessário (BAIXO)
- Tema dark é forçado (`<html className="dark">`, layout.tsx:58) e o `mode-toggle` não é montado em lugar nenhum; `ThemeProvider` (next-themes) + `suppressHydrationWarning` são peso/complexidade sem função atual.

### 13. HTML pesado mas aceitável (BAIXO)
- Home 402 KB bruto / 41 KB gzip (dev). Páginas de catálogo ~500 KB por causa de menus repetidos e SVG paths inline. Com gzip do LiteSpeed fica ok; não é gargalo perto das mídias.

## PONTOS FORTES (não quebrar)
- `public/.htaccess` muito bem feito: força HTTPS+www, gzip para texto/JS/CSS, `Cache-Control immutable` 1 ano para `/_next/static`, HTML 1h must-revalidate, MIME types webp/avif/woff2, redirects 301 de campanhas antigas.
- `next/font` self-hosted com `display: swap` (sem CSS bloqueante do Google Fonts).
- Imagens do carrossel hero majoritariamente comprimidas (~1024×576, 45–80 KB) — exceto 1 (354 KB / 4032px).
- `loading="lazy"` consistente nos grids de catálogo (52/52 em /catalogo).
- `AnimatedHeadline` respeita `prefers-reduced-motion`; GSAP via dynamic import (intenção certa, execução com efeito colateral no LCP).
- Static export = TTFB excelente; cache de HTML 1h coerente.

## TOP AÇÕES POR IMPACTO (estimativa)
1. Lazy + poster + re-encode dos 7 vídeos da home: **-30 a -33 MB** no peso da home.
2. Pipeline de imagens no build com sharp (variantes 400/800/1600w + srcset manual ou next-image-export-optimizer): **-80~90% no peso de imagem** de produto/catálogo (11,3 MB → ~1,5 MB no produto típico).
3. Remover opacity-0 inicial do hero/h1 (animar por cima): LCP móvel deve cair de ~5-8s para ~1.5-2.5s.
4. Remover `ssr:false` do TopToys: conteúdo na primeira dobra presente no HTML.
5. Preload só da slide 1 (fetchpriority=high): libera ~870 KB de banda crítica.
6. Limpar package.json (13 deps mortas + sanity → studio/): instala/CI mais rápidos, node_modules -300~500 MB.
7. Tirar 501 MB de tutoriais/docx/cdr/py do deploy público.
8. Pré-computar gradientes do ColorThief no build.
9. Unificar animação (GSAP OU framer-motion) e ícones (1 lib) a médio prazo.

## Observações de medição
- Dev server (turbopack) não reflete bundle de produção; não rodei `npm run build` para não derrubar o dev server compartilhado da auditoria. Pesos de JS de produção devem ser confirmados com `next build` + analyze.
- Páginas medidas: `/`, `/catalogo/`, `/catalogo/jogos-eletronicos/maquinas/maquina-boxe/`, `/galeria/`.
