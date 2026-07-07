# Complemento de pesquisa (verificado pelo orquestrador, 2026-06-11)

## 1. CAVEAT IMPORTANTE — FAQ rich results estão sendo REMOVIDOS pelo Google

- O search appearance de FAQ, o relatório de rich results e o suporte no Rich Results Test serão removidos em **junho de 2026** (suporte na API do Search Console em agosto/2026).
- Em junho/2025 o Google já tinha aposentado 7 outros tipos (Course Info, Claim Review, Special Announcement etc.).
- **Implicação para o site:** criar conteúdo de FAQ continua valendo MUITO (responde objeções, alimenta AI Overviews e long-tail), mas a recomendação de "FAQPage schema para ganhar rich snippet" não deve ser vendida como ganho de SERP — o snippet não existirá mais. Priorizar o conteúdo em si, schema FAQPage opcional.
- Tipos que CONTINUAM gerando rich results: Product, Review/AggregateRating (primeira parte, não sindicado), Article, Organization, **LocalBusiness**, **BreadcrumbList**, Event, Video.
- Review snippet para LocalBusiness: só avaliações primárias (coletadas no próprio site), transparentes, não auto-geradas — widget de reviews do Google NÃO vira rich result do próprio negócio (política anti self-serving: aggregateRating de LocalBusiness sobre si mesmo não é elegível desde 2019; o valor das reviews do Google aparece no Maps/GBP, não como estrelas do site na SERP).

## 2. Imagens em static export (confirmação técnica)

- `unoptimized: true` é necessário no export estático, mas a otimização deve mover-se para BUILD TIME: bibliotecas prontas **next-image-export-optimizer** ou **next-export-optimize-images** (ambas usam sharp, geram variantes + srcset e mantêm lazy-load/CLS do next/image). Alternativa: script sharp próprio de ~50 linhas.
- `sizes` accurate importa: cards de ~250px não devem servir originais de 1200×1600.

## 3. SEO local BR (Google Perfil da Empresa) — confirmações

- Negócio que atende no endereço do cliente (caso do Aluguel de Games) deve usar GBP como **"negócio de área de serviço"**: endereço oculto, até 20 áreas de cobertura (cidades/CEPs da Grande SP).
- Brasil é um dos países mais sensíveis a reputação/avaliações do mundo na decisão local (Harmo + Reclame Aqui 2025) — pedir avaliações ativamente é a alavanca nº 1.
- NAP idêntico em toda a web (site, GBP, Instagram, diretórios). O site hoje NÃO exibe endereço/CNPJ — para service-area business o endereço pode ficar oculto, mas telefone/nome devem ser idênticos, e CNPJ no site ajuda confiança.
- Conteúdo local denso por região atendida (bairros, casos reais na região) ranqueia melhor que páginas-cidade vazias.

## 4. Dark mode em site comercial (nuance para o debate)

- Dados de mercado: ~83% dos consumidores usam dark mode nos devices; caso Terra (BR) +170% páginas/sessão após dark mode. Dark mode funciona bem para marcas tech/luxo/gamer — alinhado ao posicionamento do site.
- MAS: pesquisa também mostra que light mode é percebido como mais confiável em públicos família/infantil (mães organizando festa, avós). Sites de brinquedo/festa infantil tendem a temas claros e coloridos.
- Recomendação equilibrada: manter dark como identidade (diferencia dos concorrentes e casa com 'games'), mas garantir contraste AA, e considerar um toggle de tema claro (next-themes já está no projeto!) ou ao menos testar páginas de alto tráfego família (categoria infantil) com fundo claro.

Fontes principais:
- https://developers.google.com/search/blog/2023/08/howto-faq-changes
- https://www.getpassionfruit.com/blog/what-changed-with-google-drops-faq-rich-results-and-what-to-do-now
- https://www.brightlocal.com/learn/review-schema/
- https://developers.google.com/search/docs/appearance/structured-data/review-snippet
- https://www.npmjs.com/package/next-image-export-optimizer
- https://next-export-optimize-images.vercel.app/
- https://support.google.com/business/answer/9157481?hl=pt-BR
- https://ethosgrowth.com.br/blog/seo-local-google-maps
- https://www.outcrowd.io/blog/dark-mode-conversion-booster-or-marketing-disaster
- https://www.digitalrootsmedia.com/blog/web-design/dark-mode-web-design-guide/
