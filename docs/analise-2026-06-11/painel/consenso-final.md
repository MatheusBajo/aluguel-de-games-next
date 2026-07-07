# CONSENSO FINAL — Auditoria "Aluguel de Games"
**Moderação final do painel (12 lentes + 4 personas + 4 críticos) — 2026-06-11**

---

## Moldura de decisão

O painel produziu ~120 recomendações. Este consenso filtra por quatro réguas, na ordem:

1. **Viabilidade real** — 1 dev + dono-operador. Orçamento do trimestre: ~30 dias úteis de dev + ~2h/semana do dono. Tudo que não cabe é consultorês.
2. **Cadeia causal até receita** — o negócio é (leads que chegam ao chat) × (velocidade/qualidade da 1ª resposta) × (fechamento na conversa). O site é a brochura que alimenta um vendedor no WhatsApp; os dois minutos decisivos são o minuto ANTES do clique (medo do preço) e o minuto DEPOIS (chat vazio, resposta lenta).
3. **Voz das personas** — as 4 travaram nos mesmos lugares: preço, ficha técnica, chat vazio, perguntas práticas sem resposta. Nenhuma travou em canonical, sitemap ou teclado.
4. **Evidência verificada** — só entram premissas confirmadas no código (hash de locações, 24 CTAs sem prefill, sitemap 500 ativo, NFC/NFD, logo 527KB, zero commits, zero CNPJ etc.).

**Teste de realidade dos 30 dias (régua do trimestre):** se em 30 dias houver (a) prefill em todos os CTAs, (b) tracking fechado, (c) zero números falsos, (d) hero visível em 4G e (e) WhatsApp Business operando com resposta rápida de faixa de preço — o trimestre já se pagou.

**Pré-condição bloqueante nº 0:** `git init` + primeiro commit + backup de `public/` fora da máquina. O repo tem ZERO commits (verificado) e o plano contém operações destrutivas (ffmpeg, sharp, renames) sobre originais únicos de 33 anos. Nada de batch de mídia antes disso.

---

## HORIZONTE 1 — QUICK WINS (≤1 dia cada)

### QW1. Git + backup de `public/` (pré-condição nº 0)
`git init`, primeiro commit, cópia de `public/` (591 MB) fora da máquina. Bloqueia formalmente qualquer ffmpeg/sharp/rename. ~1h.

### QW2. Mensagem pré-preenchida (v1) em TODOS os CTAs de WhatsApp
Único item citado por 8 lentes, 4 personas e apoiado pelos 4 críticos. `getWhatsAppLink()` já existe (`src/config/whatsapp.config.ts`) e só `ProductInfo.tsx` usa; 24 CTAs abrem chat vazio no pico de intenção. v1 = `?text=` com nome do produto + URL, variantes por superfície (produto/categoria/home/empresas), consertando o bug do `+` no `WhatsAppButton.tsx` órfão. Não segurar a v1 esperando o template perfeito — o roteiro com lacunas é v2 (sprint).

### QW3. Sprint de des-fabricação (48h de deleção)
Remover: "locações" por hash (`sales-utils.ts` — o próprio comentário admite placeholder), badge "1" falsa do float, 98%/100% divergentes, "Online · Pronto pra atender" estático. No lugar do "Online": horário real + "fora do horário? manda mesmo assim, respondemos às 8h30" (linha pedida pela persona, ausente de todas as lentes). Incluir o fix do `Counter.tsx` que renderiza "0+ anos / 0% satisfação" (valor real no SSR, nunca 0). Rótulo honesto: protege o ativo dos 33 anos; não é alavanca de receita de curto prazo.

### QW4. Vitrine do catálogo: normalize('NFC') + ordem curada + fim do "Outros"
Verificado: a ordem curada JÁ EXISTE em `Catalogo.tsx` e falha silenciosamente porque as pastas estão NFD no disco e o array está NFC — fix de 1 linha. Aplicar o campo `ordem` que o admin já tem, suprimir o heading-balde "Outros" (Sinuca/Pebolim para categorias reais). Dependência única: 1h com o dono para a ordem.

### QW5. Hero pintando sem JS + logo de 527KB → ~6KB
Trocar o gate GSAP do h1/carousel (`opacity:0` inline) pelo `.rise-in` CSS que já existe em `globals.css`; `fetchpriority` no slide 1, lazy nos 2-10. Elemento com opacity:0 não conta para LCP — este fix vem ANTES de comprimir vídeo. Junto: `carro-logo-aluguel-de-games.png` (527KB, 2213×1181 renderizado a 20-24px em todas as páginas) → SVG/webp. 2-4h + 30min; LCP estimado de ~5-8s para ~2-2,5s.

### QW6. Matar o sitemap 500 + GSC
O `/sitemap.xml` retorna 500 HOJE (conflito public/app verificado) e o público está 2 meses defasado. Decisão da discordância: consertar `src/app/sitemap.ts` com `segmentsToSlug` e DELETAR next-sitemap + postbuild + arquivos de `public/` (um dono só de sitemap/robots). Verificar o Google Search Console via DNS no mesmo dia — medição antes de qualquer outro fix de SEO.

### QW7. Identidade legal: CNPJ + NAP + LGPD
Razão social, CNPJ, bairro-base e "Contrato e NF" no footer, /empresas e /contato; página de privacidade LGPD (site roda GTM/GA4 + form coletando dados — achado novo da lente de confiança); corrigir o geo do schema (hoje aponta Praça da Sé). Meio dia; pré-requisito do GBP e da pré-homologação B2B (bloqueio nº1 do Ricardo). O cartão CNPJ ainda prova o "desde 1993".

### QW8. OG image global 1200×630
O clipart laranja quadrado é a cara da marca em todo compartilhamento no único canal de conversão. 1 imagem estática (foto real de evento + lockup "desde 1993"), corrigindo dimensões falsas e host sem www nas meta tags. ~1-2h. OG por produto NÃO entra aqui (foi separada pelo crítico de viabilidade — vai junto com pipeline de imagens, condicional).

### QW9. Operação pós-clique no WhatsApp Business (dono, zero código)
Elevada a nº 1 em impacto pelo cético: as 4 personas dizem "mando para 3 concorrentes, quem responder primeiro com preço leva". Saudação, mensagem de ausência, respostas rápidas que JÁ entregam faixa de preço, etiquetas de funil (lead/orçamento/fechado). No site: promessa honesta de tempo de resposta junto aos CTAs. Uma tarde do dono — a maior razão impacto/esforço do conjunto.

### QW10. Copy urgente do catálogo: videokê + nomes crípticos + typos
Consertar a contradição 30.000 vs 12.000 músicas e o "atualizado até 2023" (em 2026), e listar repertório por década (Roberto Carlos, MPB, anos 60-80 — a única pergunta da festa de bodas, que nenhuma lente respondeu). Renomear "Fliperama de 11.000" → "Fliperama Retrô — 11.000 jogos em 1" (DUAS personas leram como preço). Corrigir "Maquina Boxe", "Maquina  de Dança", "Whatsapp". Tudo texto em metadata.json.

### QW11. Pacote legibilidade
Mínimo 12px (matar os 5pt/7pt do Top 10 — a vitrine mais merchandizada é ilegível para 100% do mobile e para todo decisor 40+ com presbiopia) e abolir `text-muted-foreground/40-60` em texto informativo. CSS bounded. Prioridade acima de qualquer trabalho de teclado/ARIA (pragmatismo vence purismo — ver controvérsias).

### QW12. Canal telefone como conversão de primeira classe
"ou ligue (11) 96526-1000" junto aos CTAs principais (decisor 50+ e RH em desktop corporativo sem WhatsApp Web); rastrear cliques `tel:` no GA4 (hoje invisíveis — o plano de medição inteiro era WhatsApp-cêntrico); inverter o formulário (telefone obrigatório, e-mail opcional — hoje é o contrário, verificado em `ContactForm.tsx`); e cumprir a promessa do form: pós-envio abre wa.me pré-preenchido com os dados (a quebra está confirmada).

---

## HORIZONTE 2 — SPRINT (1-2 semanas)

### S1. Componente `<WhatsAppCta>` único + medição como ritual
O multiplicador: anchor real (não button+window.open), prefill v2 com roteiro de lacunas ("Data: ___ / Bairro: ___ / Convidados: ___ / Itens: ___" — formato pedido pelas personas, não texto de marketing), tracking GA4 fechando os furos reais (hero, categoria, empresas — verificado: 8 superfícies já rastreiam, o gap é menor que o painel disse), fallback `tel:`, aria. 1-2 dias; 20+ CTAs herdam tudo. Junto: reconciliação mensal cliques GA4 × conversas × orçamentos × fechamentos via etiquetas — ritual de 30 min com data marcada e dono nomeado, para detectar quebra e mix de canal (não para A/B de micro-copy, que nunca atinge significância neste tráfego).

### S2. Pacote "página de produto mobile"
A página de maior intenção, consertada para o público majoritário: (a) barra sticky de orçamento com contexto do produto, SUBSTITUINDO o float (que colide com botões e carregava a badge falsa); (b) galeria touch v1 — controles visíveis abaixo de md:, aria-labels, tap = fullscreen, ESC (hoje opacity-0 hover-only = zona morta no touch, verificado linha a linha); (c) recuperar a dobra (remover mt-20, breadcrumb em 1 linha). Medir whatsapp_click 3-4 semanas; rebuild embla/swipe/capa curada é v2 condicionada.

### S3. Specs estruturadas no metadata.json — top 15 produtos
Schema de campos uma vez (dimensões, voltagem, jogadores, idade, indoor/outdoor, "cabe em elevador?"); conteúdo extraído dos filenames (verificado: "Pebolim/1M Alt x 80 CM Larg…", "Plataforma 360°/Espaço 2MT x 2MT") + confirmação do dono. Renderizar como chips/tabela — o atributo real ("2 jogadores · 1,8m · 220V") entra no pixel onde estava o badge de locações falso (remédio pedido por 2 personas). Top 15 = 4 fliperamas vazios (são 4, não 6 — corrigido pelo verificador), videokê, boxe, Top 10. Os 39 da cauda ficam para o horizonte 3.

### S4. FAQ das personas em /como-funciona + políticas como produto de confiança
A lista vem das personas, não de keywords: chuva, sinal/cancelamento, duração + hora extra (festa adulta vara a madrugada), horário de chegada da equipe (a mãe precisa reservar o salão), elevador/escada, tomada 110/220, idade, garantia de substituição de equipamento (grátis de escrever, nenhum concorrente tem). Resolver a contradição "equipe fica no local" (/empresas) vs "não é plantão" (/como-funciona) produtizando "Operação assistida" como add-on explícito. Linkar/resumir no ponto de decisão (accordion na página de produto). FAQPage schema vai junto por custo zero — sem vender rich snippet (restrito a gov/saúde desde 2023).

### S5. Dieta de vídeos do Demonstra (pós-gate de backup)
Curadoria para 3-4 melhores clipes (não recomprimir e manter 7 autoplays — menos trabalho E vende melhor), ffmpeg 720p CRF27 `-an +faststart`, poster webp, `preload=none` + tap-to-play/IntersectionObserver, aspect-ratio fixo (mata o maior CLS da home). Resolve de uma vez: ~35MB → ~2MB, WCAG 2.2.2, bateria, 4G. Junto: prune do deploy — 502MB de mp4 em public/ incluindo 147MB de tutoriais internos de PS5 hoje públicos (privacidade + deploy 5× mais rápido).

### S6. Batch one-off de imagens (sem custom loader)
Script sharp simples redimensionando os originais gigantes referenciados (a página de produto de 11,3MB cai para ~1,5MB), tratando filenames NFD (o mesmo bug Unicode quebraria o pipeline). Decisão dos críticos: o batch entrega ~90% do ganho; pipeline 320/640/1080 + custom loader fica condicional no horizonte 3.

### S7. Google Business Profile + motor de reviews D+1
Na ordem obrigatória: NAP no site (QW7) → documentação → cadastro como Service Area Business com data de abertura 1993 (verificação por vídeo leva semanas — iniciar cedo). Motor de reviews é PROCESSO: template D+1 salvo no WhatsApp Business, responsável nomeado, meta de pedir em 100% dos eventos, responder todas. Reviews linkadas são a prova verificável que substitui o "98%" — "minha geração não acredita em número de site" (persona 64). Única fonte nova de demanda barata e único fosso defensável do nicho.

### S8. Fundação SEO restante (semana 2-3, nunca antes da conversão)
Canonical/host www unificado via `NEXT_PUBLIC_SITE_URL` (mata a cadeia de 2 redirects nas 54 páginas e a divergência home-com-www vs produto-sem-www, verificada); JSON-LD de Produto movido de `next/script` para `<script>` server-side (hoje não sai no HTML servido — verificado); titles transacionais "Aluguel de {Produto} para Festas e Eventos" + "desde 1993" na home; costurar os dois sistemas de navegação — headings do /catalogo e breadcrumbs linkando as category pages que já existem (maior ganho de SEO sem escrever conteúdo); deletar o SearchAction (sitelinks searchbox descontinuado).

### S9. Promover a prova REAL
Citação nominal factual "já realizamos eventos para Bradesco, Spotify, Arnold Classic, Danilo Gentili" visível (texto, não logo-wall — risco jurídico; autorização formal só para 3-4 logos depois); legendas da galeria visíveis no mobile e legenda do hero dentro do scrim ≥12px (a melhor prova social do site está em 8pt fora do gradiente); página de produto com 3 fatos verificáveis no lugar das stats fabricadas: "Entrega e montagem incluídas · Equipamento testado antes do evento · Contrato e NF".

### S10. Preço — a escada de menor risco
Degrau 1 (já feito no QW9): faixa de preço na resposta rápida do WhatsApp — resolve em minutos, zero risco CDC, ajustável por data/região. Degrau 2: página "Quanto custa? Entenda o orçamento" (variáveis + o que está incluso; intenção de busca nº 1 do nicho sem dono). Degrau 3: reunião de decisão com o dono — SE assinar pisos reais e cumpríveis, piloto "a partir de R$" em 2 categorias por 60 dias; senão, faixas só por ocasião/porte nos kits do horizonte 3. Tabela aberta catálogo-wide: rejeitada (CDC art. 30 + manutenção eterna).

---

## HORIZONTE 3 — ESTRUTURAIS (1-3 meses)

### E1. Páginas por ocasião — 2-3, não 6-8
"Festa Infantil em casa/condomínio" (persona de maior volume; reúne itens hoje espalhados em 4 categorias), "Confraternização/SIPAT" (deadline real: no ar até agosto, pico de busca set-nov; fotos Bradesco/Spotify já existem) e "Festas de família" (bodas, 60/70/80 anos, salão de igreja — o segmento do decisor que PAGA, que NENHUMA das 12 lentes listou; entrou por voz da persona). Cada página: 6-10 itens curados + FAQ + CTA pré-preenchido da ocasião. Na home, 1 frase de aceno: "do salão do seu prédio ao evento da TV". Expandir SÓ se gerarem conversas etiquetadas — o caso de conversão precisa se sustentar sem o adoçante de SEO.

### E2. Kits nomeados de escopo fixo (3-4) — o multi-item sem carrinho
Festa Teen/Retrô, Confraternização, SIPAT, Infantil em `src/data/kits.ts` referenciando produtos existentes (zero mudança de pastas). Mensagem WhatsApp estruturada multi-item via `?text=` com lacuna "Itens: ___" — atende as 2 personas que precisam de 2-4 itens sem construir carrinho/configurador (rejeitados; revisitar só se o atendente reportar fricção real). Preço fechado nos kits somente com compromisso escrito do dono (é onde a âncora pública é mais segura: escopo fixo).

### E3. Conteúdo da cauda do catálogo + página de videokê forte
Template de venda (gancho → o que é → no pacote → ficha técnica → ideal para) nos ~39 produtos restantes — specs + 2-4 linhas bastam na cauda; descrição completa só onde há demanda. UMA página de videokê robusta com seção de modelos (Pop 300, Matrix, VMP 2500) e repertório por década — decisão contra o split em SKUs (ver controvérsias). Métrica de sucesso: whatsapp_click por página, não contagem de caracteres.

### E4. Reativação sazonal da carteira (versão estreita) + mineração de localidades
Começa com UMA lista de uma tarde: clientes de confraternização dez/2025, contatados em setembro/2026. Se converter, expandir por janela (junina, Dia das Crianças, SIPAT). Em paralelo (planilha, zero dev): tabular o campo Local/Bairro do formulário e o histórico do WhatsApp — define por receita real as futuras páginas regionais e gera o conteúdo único que separa página local de doorway. Provavelmente o maior ROI absoluto da empresa; apareceu em 1 lente porque não é auditável por grep.

### E5. Mídia paga em rajadas sazonais — somente com tracking fechado
Search de alta intenção ("aluguel de fliperama sp") R$ 30-50/dia concentrado nas 4-5 janelas previsíveis; landing = categoria/ocasião com prefill; CTWA apenas para audiências mornas (benchmarks de CTWA frio são números de vendor — num nicho sem preço público gera "quanto custa?" em volume que consome o único atendente). O tracking (S1) é o único item técnico que bloqueia este.

### E6. Pacote B2B na /empresas
Kit aprovação interna em PDF baixável (quem somos, 33 anos, cases com nomes, NF/contrato/pagamento, cobertura) — "a feature B2B mais barata com maior impacto: transforma o RH em vendedor interno"; e-mail corporativo em destaque + form coerente com campo empresa/nº de pessoas; "33 anos · desde 1993" no hero B2B (argumento anti-risco que nenhum concorrente tem); guia de dimensionamento por porte (50/150/400 pessoas: atrações, espaço, energia); aviso honesto de agenda nov/dez.

### E7. Prova social composta de longo prazo
Contagem REAL de eventos via etiquetas do WhatsApp Business (em 6-12 meses, "300+ eventos em 2026" substitui o debate estéril '500 vs 5.000' — não se corrige número inventado inventando um maior); cláusula de autorização de imagem no contrato (gera fotos/depoimentos com nome); QR "avalie a gente" no equipamento entregue (mídia gratuita numa festa com dezenas de convidados); foto de arquivo dos anos 90 na /sobre (tarefa de gaveta do dono — prova de antiguidade infalsificável).

### E8. Dívidas condicionais — só com gatilho explícito
(a) Overlay de taxonomia + manifesto de redirects 301: somente quando/se houver renomeação de pastas/rótulos — o NFC já foi resolvido sem ele; manifesto antes de qualquer rename é inegociável. (b) Pipeline sharp 320/640/1080 + custom loader + OG por produto: se o batch one-off (S6) não bastar. (c) Facetas client-side ("cabe em apartamento"): depois dos atributos estruturados completos. (d) Consolidação framer-motion/GSAP: só se medição de campo provar INP ruim. Sem gatilho, nenhum destes consome o orçamento.

---

## CORTADO DO TRIMESTRE (com motivo)

- **Redesign de logo / ensaios fotográficos / guia de voz** — projetos de marca com orçamento próprio; sem cadeia causal até receita neste estágio. Sobrevivem: OG global, logo comprimido, foto anos 90 de gaveta.
- **Carrinho multi-item / mini-configurador / busca client-side** — pedido típico 1-3 itens; kits + prefill multi-linha cobrem; busca sem atributos só indexa títulos que não falam a língua do usuário.
- **6-8 páginas de cidade / citações em massa** — payoff 6-12 meses, conteúdo real não existe organizado, versão boilerplate é doorway. GBP + reviews capturam a demanda local com 5% do esforço.
- **Split de videokê em SKUs** — sem dados por modelo, é thin content ao quadrado.
- **RUM web-vitals / content-visibility / speculation rules** — amostra de SMB não sustenta conclusão; micro-otimização sem cliente pagante.
- **Programa de parceiros / B2B recorrente / barter / PR** — 5 negócios novos para uma operação que ainda não responde fora do horário. Exceção: reativação estreita (E4).
- **Toggle de tema claro** — dark/neon é coerência de categoria e diferencial; corrigir fotografia e contraste, não o tema.

---

## CONTROVÉRSIAS E COMO FORAM DECIDIDAS

1. **Preço público** — 4 versões incompatíveis no painel (por categoria / só kits / página explicativa / nenhum número), e o cético de impacto rejeitando até a página sem número. Decisão: escada de risco — faixa de preço na resposta rápida do WhatsApp JÁ (fora do site, zero risco CDC, resolve em minutos), página "Entenda o orçamento" no sprint, pisos públicos só com compromisso escrito do dono em 2 categorias/kits de escopo fixo. Tabela aberta rejeitada por CDC art. 30 + manutenção.

2. **Des-fabricação: remover vs substituir, e quanto vale** — Decisão híbrida: badge "1" e "Online" saem JÁ (dano sentido pelas personas — imitam o celular delas); "locações" por hash saem já e o pixel recebe atributo real quando as specs chegarem (a remoção NÃO espera a substituição — viabilidade vence Camila no sequenciamento). Rótulo honesto do cético de impacto adotado: protege o ativo, não promete receita imediata. E não se A/B testa desonestidade (confiança vence CRO).

3. **SEO técnico primeiro vs conversão primeiro** — auditorias rotulavam canonical/JSON-LD como "Alto"; 3 de 4 personas e 2 críticos: "nada técnico me impediu de converter". Decisão: só quebras binárias na semana 1 (sitemap com 500 ATIVO + GSC); o resto na semana 2-3, depois de prefill/vitrine/produto mobile. No sitemap, venceu a discordância verificada: matar next-sitemap, consertar sitemap.ts.

4. **Páginas por ocasião: 6-8 vs 2-3** — críticos venceram com evidência incômoda: a empresa não preencheu 254 caracteres em 50/54 produtos; não escreverá 8 landings densas. Dose: 2-3 com deadline sazonal. "Festas de família" entrou por voz da persona — nenhuma das 12 lentes listou o segmento do decisor que paga.

5. **Carrinho/configurador/busca** — persona Camila ("o que mais paga") vs CRO/mobile/IA/ambos críticos. Venceram os críticos: adiado; kits + lacuna "Itens: ___" cobrem o caso multi-item; revisitar apenas com fricção reportada pelo atendente.

6. **Overlay de taxonomia** — "causa-raiz de 6 bugs" (IA) vs "moldura antes do quadro" (impacto). Meio-termo do viabilidade venceu: NFC de 1 linha imediato e desacoplado; overlay condicional ao primeiro rename real, sempre precedido do manifesto de redirects.

7. **Split do videokê** — SEO/copy (long-tail por modelo) vs IA + verificador. Venceu o contra: não há dados por modelo no filesystem (verificado), seria thin content ao quadrado, e o "erro 500 do Karaokê 2025" citado por 2 pareceres NÃO foi reproduzido. Uma página forte com modelos e repertório por década atende as 2 personas hoje.

8. **Engenharia de performance** — pipeline+RUM+speculation rules (performance) vs "catnip de engenheiro" (impacto). Ficou: hero CSS-first ANTES dos vídeos (opacity:0 não conta para LCP — discordância interna acolhida), logo, curadoria 3-4 clipes (não recompressão dos 7), batch one-off de imagens. Pipeline/loader condicional; RUM/content-visibility/speculation rules cortados.

9. **Ordem do plano local** — "GBP começa hoje sem dev" (seo-strategy) vs "NAP primeiro" (local + verificador). Venceu NAP primeiro: zero ocorrências de CNPJ no site (verificado); SAB trava na verificação sem NAP público. Páginas regionais adiadas para fase 2; mineração de localidades (planilha) começa já. Caveat mantido: validar com 5 buscas reais no celular se o map pack precede o orgânico no nicho.

10. **Medição e experimentos** — "tracking antes de tudo" + A/B (CRO) vs "fantasia de experimentação" (impacto) + correção de escopo do verificador (8 superfícies já rastreiam; furo real = hero/categoria/empresas). Decisão: tracking de carona no componente único (~1 dia, não projeto); reconciliação mensal como ritual de 30 min com dono nomeado; medição para detectar quebra e mix, não para arbitrar micro-variantes; bloqueador apenas para mídia paga.

11. **Telefone e acessibilidade** — plano WhatsApp-cêntrico do painel vs persona 64 + advogado do usuário. Venceram as personas: "ou ligue" junto aos CTAs, tel: rastreado, form com telefone obrigatório. Em a11y, pragmatismo venceu purismo: galeria touch + legibilidade 12px antes de teclado/ARIA; gate `prefers-reduced-motion` em vez de botão de pausa; sem aria-live em carrossel.

12. **Marca** — redesign do logo/fotografia (brand) vs corte (ambos críticos). Cortado do trimestre; "1993 como sobrenome da marca" sobrevive como copy/lockup de custo zero (titles, OG, assinatura). Dark theme mantido por consenso contra o toggle claro.

---

## RITUAL DE ACOMPANHAMENTO

- **Mensal (30 min, data marcada, dono nomeado):** reconciliação cliques GA4 × conversas novas × orçamentos × fechamentos (etiquetas WhatsApp Business) + tel: clicks.
- **Critério de pronto de cada entrega mobile:** teste manual de 15 min — toque, zoom de texto 200%, Tab até o CTA, reduzir movimento ativado.
- **Regra de WIP:** nada do horizonte 3 começa enquanto os quick wins não estiverem 100% no ar.
