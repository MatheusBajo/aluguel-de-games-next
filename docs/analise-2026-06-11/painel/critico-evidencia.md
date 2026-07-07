# Crítico — Verificador de Evidências
Auditoria por amostragem das premissas factuais do painel contra o código real
(`/Users/matheusbajo/Projetos/WebstormProjects/aluguel-de-games-next`) e o dev server (`http://localhost:3000`).
Data: 2026-06-11.

## 1. Premissas VERIFICADAS COMO VERDADEIRAS (com evidência)

| # | Premissa do painel | Evidência | Veredito |
|---|---|---|---|
| 1 | "Locações" geradas por hash | `src/lib/sales-utils.ts` — FNV-1a sobre a key, range 100–200, rank para Top10. Renderiza em `CatalogCard.tsx:96`, `TopToys.tsx`, `CarouselModal.tsx`. O próprio comentário do arquivo admite: "social proof ... até termos um sistema real". | **TRUE** |
| 2 | ~90% dos CTAs abrem chat vazio; helper abandonado | 24 usos de `WHATSAPP_CONFIG.link` cru (sem `?text=`) vs 2 superfícies pré-preenchidas (ProductInfo via `getWhatsAppLink`, CarouselModal). `WhatsAppButton.tsx` existe e tem **zero** imports — e tem o bug do `+` (`formattedNumber = '+5511...'` injetado em `wa.me/`). | **TRUE** |
| 3 | Sitemap quebrado / conflito | `curl localhost:3000/sitemap.xml` → **500 real**: "A conflicting public file and page file was found for path /sitemap.xml". `public/sitemap.xml` (next-sitemap) datado **2026-04-18** (~2 meses defasado). `src/app/sitemap.ts` usa `item.key` cru (pastas com espaço/acento, ex.: `catalogo/Jogos Eletrônicos/...`) — URLs não-slugificadas. | **TRUE — pior que descrito** |
| 4 | JSON-LD de produto não sai no HTML | O schema Product usa `next/script` (`page.tsx:266`) → presente só no flight RSC, **ausente** como `<script type="application/ld+json">` no HTML servido (grep no HTML do produto: só o WebSite schema, que usa `<script>` puro). Bônus: a image do schema usa host **sem www** e espaços não-encodados. | **TRUE** |
| 5 | Canonical com host trocado | Produto: `<link rel="canonical" href="https://alugueldegames.com.br/catalogo/...">` (sem www, sem trailing slash). Home: `https://www.alugueldegames.com.br/`. Inconsistência confirmada no HTML servido. | **TRUE** |
| 6 | SearchAction aponta para busca inexistente | `SchemaMarkup.tsx` → `/catalogo?search={...}`; não há implementação de busca. | **TRUE** |
| 7 | Counter reseta a 0 ("0+"/"0%") | `Counter.tsx`: SSR renderiza valor final, `useEffect` pós-mount **reseta a 0** até IntersectionObserver disparar. Nuance: respeita `prefers-reduced-motion`. | **TRUE** |
| 8 | Hero invisível sem JS | `AnimatedHeadline.tsx:79` — h1 com `style={{ opacity: 0 }}` inline, revelado só por useEffect+GSAP (import dinâmico). Carrossel: `StartCarousel.tsx:78` `opacity-0 translate-y-[-30px]` + `gsap.to`. O padrão `.rise-in` (CSS puro, `globals.css:154`) existe e já é usado em outros elementos do MESMO hero. | **TRUE** |
| 9 | Vídeos do Demonstra ~36MB autoplay | `public/demonstra/*.mp4` = **35MB, 7 arquivos**; `<video autoPlay preload="metadata">` em `Demonstra.tsx:177-181`. | **TRUE** |
| 10 | Logo 516KB renderizado a ~24px | `carro-logo-aluguel-de-games.png` = 527.766 bytes, 2213×1181, `className="h-5 md:h-6"` no Header. | **TRUE** |
| 11 | Bug NFC/NFD quebra a ordem curada do catálogo | Pastas `Jogos Eletrônicos`, `Videokês`, `Piscinas...` estão **NFD** no disco. `Catalogo.tsx:26` passa `order={["Jogos Eletrônicos","Videokês",...]}` em **NFC** → `order.includes(k)` e `lvl1[k]` falham silenciosamente; categorias acentuadas caem pro fim. HTML servido confirma: 1ª seção = "Jogos de Mesa" → primeiros produtos = **Air Games** (a ordem curada queria Jogos Eletrônicos primeiro). | **TRUE — exatamente como descrito** |
| 12 | Sinuca/Pebolim sob "Outros" | `CatalogList.server.tsx:56` — `const [, sub = "Outros"]`; subcategorias com 1 item viram soloItems sob heading "Outros". HTML servido: h3 "Outros" precede Basquete/Mesa de Sinuca/Pebolim/Tamancobol/Tênis de Mesa. | **TRUE** |
| 13 | Texto 5pt/7pt no Top 10; legenda 8pt no hero | `TopToys.tsx:335,340,345` (`text-[5pt]`, `text-[7pt]`); `AnimatedCarouselText.tsx:114` (`text-[8pt]`). | **TRUE** |
| 14 | CNPJ zero no site | `grep -rin cnpj src/` → vazio. | **TRUE** |
| 15 | "Online · Pronto pra atender" estático | `contato/page.tsx:35-37`. Nota: só na página /contato, não "junto aos CTAs" em geral. | **TRUE (escopo menor)** |
| 16 | 98% vs 100% divergentes + slot de stat com frase | 98%: `Main.tsx:118`, `sobre:205`, `galeria:126`. ProductInfo: `500+` (l.114), `Orçamento via Whatsapp` em `text-2xl` (l.118), `100%` (l.122). | **TRUE** |
| 17 | Galeria hover-only, sem toque | `ProductGallery.tsx:73-93` — setas e fullscreen com `opacity-0 group-hover:opacity-100`, sem aria-label, imagem principal sem onClick. | **TRUE** |
| 18 | Badge "1" falsa + float sem âncora | `WhatsAppFloat.tsx` — badge vermelha "1" com `animate-bounce`; `<button>` + `window.open` (não anchor); link sem `?text=`. | **TRUE** |
| 19 | OG image quebrada | Home: og:image = `Logo-Aluguel-de-games.png` (**1000×1000 quadrado**) declarado como **1200×630**. Produto: foto real mas dimensões declaradas falsas (1200×630) e host sem www. | **TRUE** |
| 20 | Form de /contato quebra a promessa | `contato/page.tsx:123`: "Ao enviar, abrimos um chat pré-preenchido no WhatsApp". `ContactForm.tsx` só posta no Web3Forms e mostra "Recebido!". E-mail `required`, telefone opcional (persona Antônio certa). | **TRUE** |
| 21 | Como Funciona/Contato no dropdown "Sobre" | `Header.tsx:35-43`. | **TRUE** |
| 22 | Repo com zero commits | `git log` → "branch 'main' does not have any commits yet". Pré-requisito de backup antes de batch de mídia é VÁLIDO e urgente. | **TRUE** |
| 23 | ~465MB de mídia não referenciada / tutoriais internos públicos | mp4 em `public/` = **502MB (49 arquivos)**; demonstra usa 35MB → ~467MB fora do site. Tutoriais PS5 = 92MB + 55MB (**147MB**, painel falou 96MB — SUBESTIMOU). Tutoriais Matrix Slim, Plataforma 360 e Quest também públicos. | **TRUE** |
| 24 | Carrinho Infantil duplicado | Duas pastas: `Jogos Eletrônicos/Carrinho Infantil` e `Piscinas.../Carrinho Infantil`. | **TRUE** |
| 25 | Dimensões presas em filenames | Confirmado: `Pebolim/1M Alt x 80 CM Larg x 1,45 Comp.webp`, `Cama Elástica/3,05 mt x 2,50 Altura.webp`, `Plataforma 360°/Espaço 2MT x 2MT.webp` etc. | **TRUE** |
| 26 | Breadcrumb aponta âncora em vez da category page | HTML do produto: breadcrumb → `/catalogo#Jogos%20Eletro%CC%82nicos` (âncora **NFD-encoded**), enquanto `/catalogo/jogos-eletronicos/fliperamas/` existe e responde 200. | **TRUE** |
| 27 | Mensagem do produto sem URL | `ProductInfo.tsx:36-38` — mensagem tem título, não tem link da página. | **TRUE** |

## 2. Premissas COM ERRO OU EXAGERO

| # | Claim | Realidade verificada | Correção |
|---|---|---|---|
| E1 | "os 6 fliperamas com descrição vazia" (SEO, Copy) | **4 produtos** com descrição vazia (SF4/KOF XIII, Fliperama de 1.000, de 5.000, Infantil de 1.000) — todos fliperamas, mas são 4. A lente de marca acertou ("4 fliperamas"). 50/54 produtos têm ≤254 chars (consistente com "descrições = legendas de card"). | Número errado em 2 lentes; direção certa |
| E2 | "O hero e a MAIORIA dos CTAs são invisíveis no GA4" (CRO) | O CTA do hero ("Pedir orçamento", `StartCarousel.tsx:123`) **não** rastreia — verdade. Mas há **8 call sites com tracking**: header (2), float, mobile menu, CTA final da home, Demonstra, produto (2). Os furos são hero + CTAs de categoria/empresas/como-funciona/galeria. | "Maioria invisível" é exagero; é fechar lacunas (~1 dia), não construir do zero — o que ENFRAQUECE a urgência relativa desse item e FORTALECE a do pré-preenchimento |
| E3 | "Counter captura '0% satisfação' em screenshot" | Mecanismo confirmado (reset a 0 pós-hidratação), mas respeita `prefers-reduced-motion` e o SSR serve o valor final — o "0" só existe na janela hidratação→viewport. Real, porém menos catastrófico que "página inteira com 0". | Severidade ok, narrativa um grau acima |
| E4 | "Karaokê 2025 dá erro 500 / produto órfão" (persona Camila) | Não localizei pasta "Karaokê 2025"; `Videokês/` contém só `Karaokês/` (fotos hash-named + subpasta de tutorial interno). Não reproduzi o 500. | NÃO VERIFICADO — checar antes de virar item de plano |
| E5 | "'Online · Pronto pra atender' mente no pico de intenção, junto aos CTAs" | Existe, mas **apenas** na página /contato — não no float nem na página de produto. | Escopo superdimensionado em 2-3 pareceres |
| E6 | "Pasta X pública" como bug de vitrine | A pasta existe e é servida via URL, mas **não renderiza** no /catalogo (sem produtos elegíveis no HTML servido). É problema de higiene/exposição, não de vitrine visível. | Reclassificar: privacidade/deploy, não UX |
| E7 | "Máquinas (0)" no dropdown | A rota `/catalogo/jogos-eletronicos/maquinas/` responde 200 e a pasta tem 6 produtos. O "(0)" não foi reproduzido. | NÃO VERIFICADO |

## 3. Implicações para a priorização (síntese do verificador)

1. **A "des-fabricação" é a recomendação mais sólida do painel.** Cada peça citada existe literalmente no código (hash, badge "1", 98/100%, Online estático, promessa falsa do form). É deleção, custa ~2 dias, e o risco é assimétrico.
2. **O combo NFC + ordem curada é ainda mais barato do que o painel vendeu**: a intenção editorial JÁ está codificada (`Catalogo.tsx` order array) e falha por normalização — um `.normalize('NFC')` no agrupamento resolve a vitrine inteira.
3. **O item de sitemap merece upgrade de severidade**: não é só "defasado" — `/sitemap.xml` retorna **500 hoje** no dev server por conflito public/app, e o gerador do app produziria URLs com espaço/acento. A discordância da lente SEO (matar next-sitemap, consertar sitemap.ts com `segmentsToSlug`) é a saída certa.
4. **O item de tracking merece downgrade de esforço**: metade da infraestrutura existe (`trackWhatsAppClick` em 8 superfícies); o trabalho é cobrir hero + catálogo/empresas e padronizar no componente único.
5. **Specs em filenames confirmadas** — o "sprint de conteúdo" é mesmo extração, não criação.
6. **Zero commits no git** torna o item "backup antes de batch de mídia" um pré-requisito INEGOCIÁVEL de qualquer plano com ffmpeg/sharp/rename.
7. Dois números do painel circulam errados (6 vs 4 descrições vazias; "96MB de tutorial" vs 147MB reais) — inócuos para a direção, mas o relatório final deve usar os números corretos.
