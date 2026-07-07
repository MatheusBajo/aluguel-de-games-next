# Auditoria — Páginas Institucionais (Aluguel de Games)

Escopo: `/como-funciona`, `/sobre`, `/contato`, `/empresas`, `/galeria`, `not-found` (404)
+ componentes de apoio (`Counter.tsx`, `ContactForm.tsx`, `ComoFunciona.tsx` órfão).
Todas as rotas respondem 200 no dev server; rota inexistente retorna 404 correto.
Todas estão linkadas no Header (dropdown "Sobre"), MobileMenu e Footer — sem páginas órfãs.

---

## 1. /como-funciona — `src/app/como-funciona/page.tsx`

### O que funciona
- 6 passos claros e honestos (page.tsx:22-59). Tom conversacional, "sem letra miúda" — bom.
- Elimina objeções-chave: **antecedência** (7–15 dias; corporativo 30+ — page.tsx:39),
  **montagem incluída** (page.tsx:45, 64), **cobertura geográfica** (page.tsx:63),
  **suporte durante evento** com expectativa honesta ("não é plantão no local" — page.tsx:51).
- CTA final WhatsApp claro (page.tsx:172-181). Metadata e canonical corretos.

### Problemas
1. **Objeção "pagamento" não respondida** — formas de pagamento (PIX, cartão, boleto)
   só aparecem em /empresas (empresas/page.tsx:38). O consumidor B2C que pergunta
   "como pago? precisa de sinal/caução?" sai sem resposta. Passo 03 "Agende a data"
   (page.tsx:37-39) seria o lugar natural.
2. **Objeção "frete/custo de entrega" não respondida** — não há nenhuma menção a
   frete incluso ou cobrado à parte em todo o site institucional. É a pergunta nº1
   de quem compara orçamentos de locação.
3. **Objeções práticas ausentes**: requisitos de espaço, tomadas/voltagem (110/220V),
   evento em área externa/chuva, escadas/elevador (fliperama pesa!). São perguntas
   reais de quem aluga arcade e geram ida-e-volta no WhatsApp.
4. **Sem FAQ + sem schema FAQPage** — página perfeita para um bloco de FAQ com
   JSON-LD `FAQPage` (hoje só existe o schema WebSite global em
   `src/components/seo/SchemaMarkup.tsx`, injetado no layout). Oportunidade SEO
   (rich snippet) + conversão.
5. **Componente morto**: `src/components/sections/como-funciona/ComoFunciona.tsx`
   (15,7 KB, GSAP+SplitText+Framer) **não é importado em lugar nenhum** (verificado
   via grep — só aparece no próprio arquivo). A página atual reimplementa tudo
   server-side. Código órfão que confunde manutenção e diverge da copy real
   (versão antiga tinha só 4 passos e "Garantia de funcionamento").

---

## 2. /sobre — `src/app/sobre/page.tsx`

### O que funciona
- Storytelling editorial forte: linha do tempo 1993→hoje (page.tsx:24-55), pilares,
  números. Copy bem acima da média para página "Sobre".
- Anos calculados dinamicamente: `new Date().getFullYear() - 1993` (page.tsx:65).

### Problemas
1. **Título/description hardcoded "33 Anos"** (page.tsx:9, 16) vs corpo dinâmico —
   em build de 2027 o corpo dirá 34 e o `<title>` continuará 33. Com static export
   o ano congela no build de toda forma; padronizar (ou gerar metadata com a mesma
   conta) evita divergência.
2. **Stats sem lastro**: "500+ eventos realizados" e "98% satisfação" (page.tsx:203-205).
   500 eventos em 33 anos = ~15/ano — provavelmente **subvende** drasticamente o
   negócio (1 evento/fim de semana já daria 1.700+). Número parece inventado para
   baixo. E 98% de satisfação sem fonte (Google Reviews? pesquisa?) fragiliza a prova.
3. **Bug visual dos contadores "0+"** — ver seção Counter abaixo. Os 4 stats ficam
   abaixo da dobra; após a hidratação o texto vira "0+"/"0%" até o usuário rolar.
4. Sem nenhuma foto da equipe/sede/história — página "Sobre" 100% texto+números;
   para um negócio desde 1993, fotos de época seriam prova social poderosa.
5. Sem depoimentos de clientes (nenhuma página institucional tem).

---

## 3. /contato — `src/app/contato/page.tsx` + `src/components/forms/ContactForm.tsx`

### O que funciona
- Hierarquia certa: WhatsApp como canal hero (page.tsx:62-91), telefone secundário,
  formulário completo (nome, email, tel, tipo, data, local, mensagem) com honeypot
  anti-spam (ContactForm.tsx:76-83), estados de envio/erro bem tratados.
- Horários explícitos (page.tsx:168-181) e cobertura geográfica com fallback
  "manda mensagem que a gente avalia" (page.tsx:203-206) — ótimo tratamento de objeção.

### Problemas
1. **[ALTO] Copy promete uma coisa, formulário faz outra** — page.tsx:123:
   *"Ao enviar, abrimos um chat pré-preenchido no WhatsApp — é só confirmar."*
   Mas `ContactForm.tsx` envia para **Web3Forms (e-mail)** (ContactForm.tsx:51) e o
   próprio form diz "★ Direto no nosso email" (ContactForm.tsx:230). O usuário envia
   esperando cair no WhatsApp e... nada abre. Quebra de expectativa na página de
   conversão. Ou muda a copy, ou implementa o redirect pro wa.me com texto montado.
2. **Página diz "Três formas de chegar"** (page.tsx:48) mas **omite o e-mail**
   (`contato@alugueldegames.com.br` existe só no Footer.tsx:160-163). Comprador
   corporativo/procurement quer e-mail visível na página de contato.
3. Badge **"Online · Pronto pra atender"** (page.tsx:35-37) é estático — domingo
   às 3h continua "Online". Promessa falsa sutil; ou condicionar ao horário, ou
   trocar por "Respondemos rápido".
4. `WEB3FORMS_ACCESS_KEY` hardcoded no client (ContactForm.tsx:8) — é público por
   design no Web3Forms, mas sem rate-limit/captcha além do honeypot; spam pode
   poluir a caixa. Baixa severidade.
5. Campo data sem `min` (aceita datas passadas) e telefone sem máscara — atrito menor.
6. Sem link/mapa da região atendida (um mapa simples da Grande SP reforçaria cobertura).
7. Form não pede nº de convidados (placeholder menciona, mas campo dedicado
   qualificaria melhor o lead).

---

## 4. /empresas — `src/app/empresas/page.tsx`

### O que funciona
- **Fala a língua do RH/eventos**: SIPAT, confraternização, team building,
  lançamento, workshops, inaugurações com tags de área (RH/SST, Marketing, Cultura)
  (page.tsx:24-31). Vocabulário B2B correto.
- Diferenciais que decisor corporativo precisa ouvir: **NF e contrato, consultor
  dedicado, boleto/faturamento, 50–1000+ pessoas** (page.tsx:33-40).
- Cases com nome forte: Bradesco/Braland (foto) + Arnold Classic 2025 (vídeo).
- Processo de contratação em 4 passos com SLA "proposta em até 1 dia útil"
  (page.tsx:341-344, 373). CTA "Falar com consultor B2B".

### Problemas
1. **[MÉDIO] Promessa de serviço inconsistente com o resto do site** —
   empresas/page.tsx:344: "Equipe entrega, monta, testa e **fica acompanhando
   durante o horário do evento**" + diferencial "Equipe no local" (page.tsx:36).
   Já como-funciona/page.tsx:51 diz explicitamente "**Não é plantão no local**,
   mas estamos alcançáveis [por telefone]" e contato/page.tsx:185 reforça.
   Para B2B isso é risco real: cliente corporativo pode exigir contratualmente o
   que a página prometeu. Alinhar a copy (ou oferecer staff on-site como opcional
   pago — aliás, ótimo upsell).
2. **[MÉDIO] ~17 MB de vídeo em autoplay** — dois `<video autoPlay loop>`:
   `/demonstra/20250405_165640.mp4` (10 MB, page.tsx:165-174) e
   `/demonstra/WhatsApp Video 2021-08-09 at 11.57.30.mp4` (6,7 MB, page.tsx:199-208).
   `preload="metadata"` é irrelevante com autoplay — o navegador baixa tudo.
   Mobile 4G sofre; LCP/da página despenca. Comprimir para <2 MB cada (ou poster +
   play sob clique). Bônus: renomear arquivo "WhatsApp Video... .mp4" (espaços,
   nome de origem amador na URL pública).
3. **Prova social subaproveitada**: a galeria tem foto de **evento do Spotify**
   (galeria/page.tsx:43) que NÃO aparece em /empresas. Meta description diz
   "Bradesco, entre outros" — cadê os outros? Um logo-wall (Bradesco, Spotify,
   Arnold Classic...) multiplicaria a credibilidade B2B.
4. **CTA não carrega contexto B2B**: todos os botões usam `WHATSAPP_CONFIG.link`
   puro (sem `?text=`). O helper `getWhatsAppLink(mensagem)` existe
   (src/config/whatsapp.config.ts:13-20) e só é usado em ProductInfo.tsx:44.
   Lead de /empresas chega no WhatsApp mudo — atendente não sabe que é corporativo.
   Mensagem pré-preenchida tipo "Olá! Quero orçamento para evento corporativo"
   qualificaria e permitiria medir origem.
5. Passo "Brief" menciona "via WhatsApp **ou e-mail**" (page.tsx:341) mas a página
   não exibe e-mail nenhum.
6. Terceiro "case" é genérico ("Equipamentos ao vivo") — vitrine, não case. Sem
   números de resultado (nº participantes, NPS do evento) os cases são só fotos.

---

## 5. /galeria — `src/app/galeria/page.tsx`

### O que funciona
- 20 fotos reais com alt-text decente, masonry, lazy-load a partir da 7ª
  (page.tsx:94). Name-dropping: Bradesco, Danilo Gentili, Spotify (page.tsx:24-43).
- CTA "Quer ver seu evento aqui?" fecha o loop de prova social → conversão.

### Problemas
1. **[ALTO] Contadores aparecem como "0+" — bug confirmado no código**
   (`src/components/ui/Counter.tsx`). Fluxo: SSR renderiza o valor final
   (verifiquei via curl: o HTML do servidor contém "500+"), mas após a hidratação
   o efeito **reseta o texto para "0+"** (Counter.tsx:61) e só anima quando o
   IntersectionObserver dispara com `threshold: 0.3` (Counter.tsx:63-89).
   A seção de stats fica **abaixo de 20 imagens** (page.tsx:120-139), então:
   - screenshots full-page/print capturam "0+ Eventos, 0+ Anos, 0+ Equipamentos, 0%";
   - usuário que rola rápido vê o flash de "0+";
   - se o `import("gsap")` dinâmico falhar (rede ruim), fica "0+" para sempre;
   - risco de o Googlebot indexar o DOM pós-hidratação com "0+" (ele renderiza
     mas não rola; viewport alto costuma disparar o observer, mas o snapshot pode
     pegar o valor no meio da animação de 2s).
   Fix barato: nunca resetar para 0 — animar do valor final apenas quando visível,
   ou usar CSS `@property`/`animation-timeline: view()` com fallback estático.
   Afeta /sobre (page.tsx:99-107, 200-217) e /galeria (page.tsx:121-138).
2. **[MÉDIO] Legendas e tags invisíveis no mobile** — caption só aparece em
   `group-hover` (page.tsx:99-109: `opacity-0 group-hover:opacity-100` e
   `translate-y-full group-hover:translate-y-0`). Touch não tem hover: a maioria
   dos visitantes (mobile) vê fotos **sem identificação nenhuma** — perde-se o
   name-dropping (Bradesco, Spotify, Gentili) justamente onde mais converte.
3. Sem lightbox/zoom — fotos pequenas no masonry não são clicáveis.
4. Sem filtro por tag (Corporativo/Festa/Aniversário) apesar de as tags existirem
   nos dados (page.tsx:24-43) — fácil de implementar e útil pro lead B2B.
5. 7 fotos com legendas genéricas ("Diversão garantida", "Setup completo",
   "Atrações em destaque") e arquivos com nome UUID — conteúdo fino na metade
   inferior da grade.
6. Só fotos, nenhum vídeo — os vídeos bons estão escondidos em /empresas.

---

## 6. 404 — `src/app/not-found.tsx`

### O que funciona — página excelente, melhor 404 que eu já vi em site de locação
- Tema arcade coerente com a marca ("GAME OVER", HP bar, glitch, scanlines).
- **Devolve ao funil**: 6 atalhos para categorias do catálogo (not-found.tsx:13-20)
  — todos retornam **200** (verificado por curl) — + CTA WhatsApp ("Insert Coin")
  + Home ("Restart") (not-found.tsx:319-340).
- `robots: noindex, follow` correto (not-found.tsx:10); rota inexistente retorna
  HTTP 404 de verdade; `prefers-reduced-motion` respeitado (not-found.tsx:198-206).

### Problemas (menores)
1. Atalhos com URLs de categoria **hardcoded** (not-found.tsx:14-19) — se algum
   slug do catálogo mudar, a página 404 passa a apontar para... outros 404.
   Gerar a partir de `catalog.server.ts` blindaria.
2. Sem campo de busca — para quem caiu de um link quebrado de produto, buscar
   pelo nome seria o caminho mais curto (o site tem SearchAction no schema).
3. ~180 linhas de CSS inline por render — cosmético, mas podia viver no globals.

---

## Transversais (todas as páginas da área)

1. **Nenhuma página institucional usa mensagem pré-preenchida no WhatsApp** —
   `getWhatsAppLink()` existe e está abandonado. Cada página deveria mandar
   contexto ("vim da página de empresas/galeria/como-funciona") → lead mais
   qualificado + atribuição de origem grátis.
2. **Zero depoimentos/avaliações** em qualquer página institucional. "98%
   satisfação" sem uma única citação de cliente. Google Reviews embed ou 3
   quotes com nome/empresa mudariam o jogo.
3. **Sem breadcrumbs/JSON-LD específico** (AboutPage, ContactPage, FAQPage,
   ImageGallery) — só o WebSite schema global do layout.
4. Inconsistência de stats: "500+ eventos" convive com "centenas de festas"
   (galeria/page.tsx:73) e 33 anos de história — números pequenos demais para a
   narrativa, e sem fonte.
5. Copy geral tem qualidade alta (tom "a gente", honestidade sobre suporte) —
   o problema não é o texto, é o que falta: prova social com rosto, preços/frete,
   FAQ e consistência de promessas entre páginas.
