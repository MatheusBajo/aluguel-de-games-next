# Parecer — Lente: Performance / Core Web Vitals
**Painel de auditoria Aluguel de Games · 2026-06-11**
**Contexto operacional:** Next.js 15 `output: 'export'`, Hostinger/LiteSpeed (.htaccess já exemplar), 1 dev, orçamento limitado. ffmpeg e sharp já disponíveis na máquina do dev (verificado: `/opt/homebrew/bin/ffmpeg`; `sharp ^0.34.3` em dependencies sem nenhum import).

A auditoria performance.md mapeou os pesos corretamente. Meu papel aqui não é repetir: é dar a **ordem exata de ataque**, a **técnica específica de cada item** (compatível com static export + LiteSpeed), o **protocolo de medição** e estimativas honestas de ganho. E discordar onde a ordem proposta desperdiçaria os primeiros dias de trabalho.

---

## 0. A tese central (onde discordo da ordem da auditoria)

A auditoria trata "35 MB de vídeo" como achado nº 1 e o pipeline de imagens como nº 2. **Os bytes são o segundo problema. O primeiro é que o LCP da home não é limitado por banda — é limitado por JavaScript.**

Cadeia real do LCP hoje (confirmada no HTML renderizado):
```
HTML chega (rápido, static export) →
  <h1 style="opacity:0"> e .div-carousel opacity-0 →
  hidratação React (~280 KB de flight payload) →
  import("gsap") + import("gsap/SplitText") →
  await document.fonts.ready →
  delay 0.15s + tween 0.9s →
  SÓ ENTÃO o candidato a LCP pinta
```
Elementos com `opacity: 0` **não contam como pintados** para o LCP. Você pode comprimir os 35 MB de vídeo para 3 MB e o LCP móvel continua em 5–7s, porque o gargalo é essa cadeia. O inverso também vale: consertar só a cadeia e deixar 35 MB de vídeo saturando o 4G ainda atrasa o chunk do GSAP. **Os dois se alimentam — mas o fix da cadeia custa ~2 horas e o do vídeo custa ~1 dia.** Em plano para 1 dev, a ordem racional é: cadeia de render primeiro, vídeos em seguida, imagens depois.

Segunda tese: **nenhum batch destrutivo de mídia (ffmpeg/sharp/rename) antes de versionamento**. A auditoria tech-debt achou o repositório com ZERO commits. Rodar ffmpeg em lote sobre `public/` sem git/backup é roleta-russa. O Dia 0 do plano de performance é, ironicamente, git.

---

## 1. Protocolo de medição (Dia 0 — meio dia, pré-requisito de tudo)

Sem isso, ninguém saberá se o trabalho valeu. Custo: meio dia, uma vez.

### 1.1 Baseline de laboratório (antes de tocar em qualquer coisa)
```bash
npm run build && npm run postbuild
npx serve out -l 3001   # servir o export real, não o dev server
for p in "" "catalogo/" "catalogo/jogos-eletronicos/maquinas/maquina-boxe/" "catalogo/fliperamas/"; do
  npx lighthouse "http://localhost:3001/$p" \
    --form-factor=mobile --screenEmulation.mobile \
    --output=json --output=html \
    --output-path="./perf-baseline/$(echo ${p:-home} | tr '/' '-')" --quiet
done
```
Rodar 3× cada e usar a mediana (variância de Lighthouse é real). As 4 URLs são os 4 templates do site: home, hub de catálogo, página de produto (landing típica de Ads) e categoria. Guardar os JSONs no repositório (`perf-baseline/`) — é o "antes" do case.

### 1.2 RUM de verdade, de graça, com o que já existe (ideia que nenhuma auditoria levantou)
O site já tem GTM com eventos de clique de WhatsApp estruturados (`trackWhatsAppClick`). Adicionar uma tag Custom HTML no GTM com a lib `web-vitals` (~2 KB):
```html
<script type="module">
import {onLCP, onINP, onCLS} from 'https://unpkg.com/web-vitals@4?module';
const send = ({name, value, rating}) => dataLayer.push({
  event: 'cwv', cwv_metric: name, cwv_value: Math.round(value), cwv_rating: rating,
  page_template: location.pathname === '/' ? 'home' : location.pathname.startsWith('/catalogo') ? 'catalogo' : 'institucional'
});
onLCP(send); onINP(send); onCLS(send);
</script>
```
Com isso o GA4 passa a permitir a análise que importa para o dono: **taxa de clique no WhatsApp segmentada por bucket de LCP**. É o argumento de negócio que transforma "performance" de custo em receita mensurável. O site provavelmente não tem amostra suficiente no CrUX (PSI vai mostrar "sem dados de campo") — RUM próprio é a única forma de ver o campo real.

### 1.3 Métrica de deploy
`du -sh out/` antes/depois. Hoje: ~600 MB. Meta: < 150 MB.

---

## 2. Dia 0,5 — Pré-requisito: backup + git (2h)

1. Backup único de `public/` (zip para Drive/HD externo) — são os originais de mídia da empresa.
2. `git init` já existe; fazer commit do **código** imediatamente. Para `public/Organizado` (543 MB): ou Git LFS, ou `.gitignore` da mídia com backup documentado. Não bloquear o commit do código por causa da mídia.
3. Só então liberar os batches de ffmpeg/sharp abaixo.

---

## 3. Fase 1 — A semana que resolve ~85% do problema

### Item 1 — Destravar a cadeia de render do hero (2–4h) → **o maior ganho de LCP por hora investida**
- `AnimatedHeadline.tsx:79`: remover `style={{opacity: 0}}` do markup. Padrão: conteúdo **visível por default**; o JS adiciona uma classe (ou seta opacity 0 via GSAP `gsap.set` imediatamente antes do tween) só quando o GSAP já carregou. Quem tem JS rápido vê a animação; quem está em 4G lento vê o headline instantâneo. O próprio projeto já tem o padrão certo (`.rise-in` CSS, usado no parágrafo e badge) — é replicá-lo.
- `StartCarousel.tsx:78`: trocar `opacity-0 translate-y-[-30px]` + tween por animação CSS `.rise-in` (ou manter GSAP como enhancement com a mesma técnica acima).
- `StartCarousel.tsx:8-10`: os imports **estáticos** de `gsap`, `ScrollTrigger` e `SplitText` anulam o code-splitting que `AnimatedHeadline` e `Counter` fazem via `import()` dinâmico. Tornar dinâmicos; `ScrollTrigger` é registrado e nunca usado nesse componente — remover.
- Slide 1 do carrossel: `fetchpriority="high"` + `width`/`height` explícitos. Slides 2–10: `loading="lazy"` — isso **elimina os 10 `<link rel="preload" as="image">`** (~930 KB disputando prioridade alta com o LCP).
- `CarouselOverlayGradient.tsx`: a paleta ColorThief é 100% determinística sobre 10 imagens estáticas. Pré-computar UMA VEZ (rodar o ColorThief no browser, copiar os 10 pares de hex para uma constante) e deletar `colorthief` do bundle + as 10 decodificações de imagem na main thread durante o load.

**Ganho estimado:** LCP móvel da home de ~5–8s para ~2–2,5s (em lab). É o item nº 3 da auditoria revisada, mas deveria ser o nº 1 do plano de execução: menor esforço, maior ganho de LCP, zero risco de regressão visual (a animação continua existindo).

### Item 2 — Vídeos do Demonstra: re-encode + IO + poster (1 dia)
Medições reais (ffprobe): `20250405_165640.mp4` = 1080×1920, 18,7s @ ~4,4 Mbps = 10,5 MB. Exibido num card de grid de ~300–400 px. O re-encode certo:

```bash
mkdir -p public/demonstra/opt
i=1
for f in public/demonstra/*.mp4; do
  ffmpeg -i "$f" \
    -vf "scale=w=720:h=720:force_original_aspect_ratio=decrease:force_divisible_by=2" \
    -c:v libx264 -crf 27 -preset slow -profile:v main -pix_fmt yuv420p \
    -movflags +faststart -an \
    "public/demonstra/opt/demo-$i.mp4"
  ffmpeg -ss 1 -i "public/demonstra/opt/demo-$i.mp4" -frames:v 1 \
    "public/demonstra/opt/demo-$i-poster.png" && \
    npx sharp-cli -i "public/demonstra/opt/demo-$i-poster.png" -o "public/demonstra/opt/demo-$i-poster.webp" resize 720
  i=$((i+1))
done
```
Detalhes que importam:
- **`-an`**: os vídeos são `muted` — remover a trilha de áudio é ganho grátis de 10–15%.
- **`-movflags +faststart`**: moov atom no início = playback progressivo imediato (vídeos de WhatsApp têm o moov no fim).
- **`scale=720` no lado maior + CRF 27**: o de 10,5 MB cai para ~0,7–1,0 MB; total dos 7 de ~35 MB para ~5–6 MB.
- **Renomear para ASCII** (`demo-1.mp4`): cache keys limpos no LiteSpeed, sem fragilidade de URL-encoding (`Vídeo do WhatsApp de 2024-11-13 à(s)...` é pedir problema em CDN futura).

No componente (`Demonstra.tsx`):
- `preload="none"` + `poster={...}` (com `preload="none"`, o poster é o único byte baixado até interação/IO).
- IntersectionObserver de ~20 linhas: `play()` quando ≥35% visível, `pause()` ao sair. Um único IO para a seção inteira, observando cada `<video>`.
- **Hardcodar os aspect-ratios no array `mediaItems`** e calcular `getSpanClass()` deles — mata o refluxo do grid (`grid-auto-flow: dense` reorganizando conforme cada metadata chega) que é o maior CLS real da home.
- Trocar `animate="visible"` por `whileInView` (a animação de entrada hoje roda fora da tela, desperdiçada).

**Ganho estimado:** home de ~40 MB para ~4 MB transferidos; em 4G isso devolve ~55s de banda. INP durante o load melhora (1–2 decoders ativos em vez de 7). LCP ganha indiretamente (−0,5 a −1,5s pela banda liberada para o slide 1 + chunks JS).

### Item 3 — Logo: 516 KB → ~6 KB (30 min) — **caiu da versão revisada da auditoria; repor**
`carro-logo-aluguel-de-games.png` (2213×1181, ~516 KB) renderizado a 20–24 px de altura no Header, MobileMenu E Footer — **toda página, todo visitante**. Verificado: 3 pontos de uso + 1 no JSON-LD (`page.tsx:119`, esse pode continuar PNG).
```bash
npx sharp-cli -i public/carro-logo-aluguel-de-games.png -o public/logo-header.webp resize 320  # ~6-10 KB
```
Ideal: vetorizar para SVG (~3 KB, nítido em retina, o `dark:invert` CSS continua funcionando). Na primeira visita móvel isso tira meio megabyte do caminho crítico de TODAS as páginas — melhor relação ganho/esforço do site inteiro.

### Item 4 — Pipeline de thumbnails com sharp + custom loader (1–2 dias, o fix das landing de Ads)
A peça que falta com `output: 'export'`. Duas partes:

**(a) Script de geração** (`scripts/generate-thumbs.mts`, rodar no `prebuild`):
```ts
import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";

const WIDTHS = [320, 640, 1080];
async function* walk(dir: string): AsyncGenerator<string> {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}
for await (const file of walk("public/Organizado")) {
  if (!/\.(webp|jpe?g|png)$/i.test(file) || /\.t\d+\.webp$/.test(file)) continue;
  for (const w of WIDTHS) {
    const out = file.replace(/\.\w+$/, `.t${w}.webp`);
    try { if ((await stat(out)).mtimeMs > (await stat(file)).mtimeMs) continue; } catch {}
    await sharp(file).resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 72 }).toFile(out);
  }
}
```
Incremental (compara mtime): primeira execução ~1–2 min para 516 webp; depois, segundos. Os derivados ficam ao lado dos originais e são deployados juntos (+~20 MB no `out/` — irrelevante perto dos 465 MB que saem no Item 5).

**(b) Custom loader em vez de `unoptimized`** — com `output: 'export'`, `next/image` aceita `loader` custom (é a alternativa oficial ao `unoptimized`):
```ts
// next.config.ts
images: { loader: 'custom', loaderFile: './src/lib/image-loader.ts',
          deviceSizes: [320, 640, 1080], imageSizes: [] }
// src/lib/image-loader.ts
export default function loader({ src, width }: { src: string; width: number }) {
  if (!src.startsWith('/Organizado/')) return src;
  const w = width <= 320 ? 320 : width <= 640 ? 640 : 1080;
  return src.replace(/\.(webp|jpe?g|png)$/i, `.t${w}.webp`);
}
```
Com isso o `sizes` que já está escrito nos componentes (`CatalogCard.tsx`, `ProductGallery.tsx`) **passa a funcionar** — o Next gera `srcset` real. Remover os props `unoptimized` espalhados. Os thumbs de 48–80 px da galeria de produto param de baixar arquivos de 1,4 MB; a imagem principal do produto usa o `.t1080` (o original continua disponível para o lightbox fullscreen).

**Ganho estimado:** página de produto "Máquina Boxe" de 11,3 MB → ~1,2 MB; LCP de produto/categoria (landing de Ads!) −1 a −2s; scroll completo de `/catalogo` de ~8,4 MB → ~1 MB.

### Item 5 — Prune do deploy (2h)
Script `postbuild` (depois do next-sitemap):
```bash
find out/Organizado -type f \( -name "*.mp4" -o -name "*.mov" -o -name "*.docx" \
  -o -name "*.cdr" -o -name "*.py" \) -delete
rm -rf "out/Organizado/Pasta X" out/gifs/search.gif
```
(Os MP4 de `out/Organizado` não são referenciados por nenhuma página — confirmado pela auditoria; os de `out/demonstra/opt` ficam.) Deploy cai de ~600 MB para ~130 MB, upload na Hostinger 5× mais rápido, e os tutoriais internos (96 MB de "video tutorial playstation 5"!) saem do ar público. Bônus de privacidade que nenhuma ferramenta de CWV mede.

---

## 4. Fase 2 — Semana 2 (consolidação, só depois de re-medir)

6. **TopToys sem `ssr:false`** (30 min): dados são JSON local de 11 KB; renderizar no servidor elimina o buraco pós-hero + CLS + conteúdo invisível para crawler.
7. **Projeção de campos do catálogo no servidor** (2h): `page.tsx` passa o catálogo inteiro (descrições markdown completas) para client components que fazem `slice` no cliente. Projetar `{key, titulo, imagens[0]}` no servidor corta ~100 KB+ do flight payload de 280 KB → hidratação mais barata → INP melhor em Android de entrada.
8. **OG image real 1200×630** (1h): a declarada é 1200×630 mas o arquivo é 1000×1000 (290 KB). Para um negócio cujo funil VIVE dentro do WhatsApp, o preview de link é o verdadeiro "first paint". Foto de evento + "Desde 1993 · Grande SP", JPEG ~100 KB. (As auditorias classificam como BAIXO; pela lente do funil deste negócio específico, é MÉDIO-ALTO.)
9. **Fontes** (1h): cortar de 11 woff2 para ~6–7 (JetBrains Mono 1 peso; DM Sans sem 500 ou 600). −50–100 KB no first load.
10. **`content-visibility: auto`** nas seções below-fold da home (Demonstra, Sobre, CTA final, Catálogo) com `contain-intrinsic-size` aproximado (ideia nova, 30 min): o browser pula layout/paint do que está fora da tela — ganho real de renderização em home longa, de graça.
11. **Speculation Rules** (30 min, ideia nova): site estático = prefetch seguro e barato. Um `<script type="speculationrules">` com `prefetch` de `/catalogo/` e das 3 categorias-chefe em `moderate` eagerness torna a navegação home→catálogo quase instantânea em Chrome/Android (maioria do tráfego BR). Progressive enhancement puro — browsers sem suporte ignoram.

## 5. Fase 3 — Só se o RUM mandar (não fazer preventivamente)

- **Dieta de JS / consolidar framer-motion+GSAP**: a auditoria estima 1–2 dias para −40–80 KB gz. Com RUM instalado, só atacar se INP de campo > 200ms depois das Fases 1–2. A identidade visual do site (acima da média do setor — é diferencial competitivo real) depende dessas animações; refatorar as duas engines com 1 dev é onde nascem regressões visuais que ninguém percebe até o cliente reclamar. `LazyMotion` + `m` do framer-motion é o meio-termo barato (−25 KB) se precisar.
- **GTM lazyOnload/Partytown**: só se TBT de campo acusar; o GTM é o sistema de medição de conversão — mexer por último.
- Limpeza de deps mortas: fazer, mas é higiene de CI/manutenção, **não** performance de usuário (zero impacto em CWV — a própria auditoria admite; não deixar isso roubar atenção do orçamento).

---

## 6. Metas numéricas (lab, mobile 4G emulado, mediana de 3 runs)

| Página | LCP hoje (est.) | LCP meta F1 | Peso hoje | Peso meta |
|---|---|---|---|---|
| Home | 5–8s | **≤2,5s** | ~40 MB (com scroll) | **≤4 MB** |
| /catalogo | 3,5–5s | **≤2,5s** | ~8,4 MB img | **≤1,5 MB** |
| Produto (Máq. Boxe) | 6–10s | **≤2,5s** | 11,3 MB | **≤1,5 MB** |
| CLS home | >0,1 (grid Demonstra) | **<0,05** | — | — |
| Deploy `out/` | ~600 MB | **≤150 MB** | — | — |

Campo (GA4/RUM): instalar na Fase 0, comparar distribuição de LCP/INP 2 semanas antes × 2 semanas depois, segmentado por template; cruzar com `whatsapp_click`.

---

## 7. Discordâncias e caveats (para o debate do painel)

1. **Ordem do plano da performance.md**: vídeos como item 1 e pipeline de imagens como item 2 invertem o custo/benefício. O fix da cadeia de render do hero (`opacity:0` até GSAP rodar) custa 2–4h, destrava o LCP inteiro e deveria ser o primeiro commit. Bytes sem render desbloqueado = LCP igual.
2. **"Recomprimir e manter os 7 autoplays" é meta errada**: mesmo a 1 MB cada, 7 decoders H.264 simultâneos custam CPU/bateria e jank em Android de entrada (INP), e uma parede de 7 vídeos tocando compete consigo mesma por atenção. Curadoria: 3–4 melhores clipes com IO play/pause (resto vira foto) é mais rápido E vende melhor. Performance e conversão apontam para o mesmo lado aqui.
3. **Consolidação de libs de animação (1–2 dias) é ROI ruim agora**: o design acima da média é o diferencial competitivo nº 1 do site contra os concorrentes (que são visualmente datados). Arriscar regressões visuais para −40–80 KB gz, antes de ter RUM provando que INP é problema de campo, é otimização especulativa. Adiar para Fase 3 condicionada a dados.
4. **A versão revisada da performance.md derrubou o logo de 516 KB da lista de ações** — e ele é o melhor custo/benefício do site (30 min, −0,5 MB em TODAS as páginas, 3 pontos de uso confirmados: Header.tsx:106, MobileMenu.tsx:93, Footer.tsx:50). Repor como quick win nº 1 do Dia 1.
5. **Caveat de sequência que nenhuma auditoria conectou**: o repositório tem zero commits (tech-debt) e o plano de performance exige batches destrutivos de mídia (ffmpeg/rename/sharp). Backup + commit de código é pré-requisito formal do plano de performance, não um item paralelo de "dívida técnica".
6. **Caveat sobre dev server**: todos os números de HTML/payload foram medidos no dev server (turbopack). O flight payload e os assets são os mesmos em produção, mas qualquer número de JS/TBT precisa ser re-validado com `next build` antes de virar baseline.

## 8. Resumo executivo para o dono

Três dias de trabalho focado (hero render + vídeos + logo + thumbs + prune) transformam um site de ~40 MB com LCP de 5–8s num site de ~3 MB com LCP ~2s — usando só ferramentas que já estão instaladas (ffmpeg, sharp) e sem trocar nada de visual. O quarto dia instala medição (RUM via GTM) que conecta velocidade a cliques de WhatsApp — a prova, em reais, de que valeu. Tudo o que for além disso (refatorar animações, trocar libs) só com dados de campo justificando.
