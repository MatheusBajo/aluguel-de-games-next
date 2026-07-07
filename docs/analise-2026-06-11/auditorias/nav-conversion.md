# Auditoria — Navegação e Funil de Conversão
Site: Aluguel de Games (alugueldegames.com.br) · Next.js 15 static export · Conversão via WhatsApp
Data: 2026-06-11 · Analista: subagente nav/conversão

## 1. Mapa do funil (como está hoje)

**Caminho até o orçamento:** de qualquer página, 1 clique — CTA verde "Orçamento" fixo no header desktop (`src/components/Header.tsx:202-211`), ícone WhatsApp no header mobile (`Header.tsx:214-223`), botão flutuante (`src/components/WhatsAppFloat.tsx`), CTA no menu mobile (`src/components/MobileMenu.tsx:111-128`), CTA gigante no footer (`src/components/Footer.tsx:30-39`). Cobertura de CTA é excelente — o problema não é quantidade, é qualidade (mensagem e rastreamento).

**Nav desktop** (`Header.tsx:15-44`): 3 itens top-level (Catálogo c/ dropdown de 8 categorias + emojis, Empresas, Sobre c/ dropdown) + CTA. Enxuto e claro. Ressalvas:
- "Contato" está escondido dentro do dropdown "Sobre" (`Header.tsx:41`) — semanticamente estranho (contato não é "sobre"); usuário que procura telefone no menu desktop não acha de primeira. Mitigado pelo CTA verde e pelo footer.
- Dropdown abre só por `onMouseEnter` (`Header.tsx:128`) — **inacessível por teclado**; quem navega por Tab nunca vê as 8 categorias (a11y, médio).

**Menu mobile** (`MobileMenu.tsx`): bem-feito — trava scroll do body (l.36-45), fecha com ESC (l.48-55), backdrop, CTA WhatsApp no topo do drawer, lista de equipamentos com emojis, bloco de contato com número e email (l.174-180). Sólido.

## 2. ACHADO PRINCIPAL — mensagens pré-preenchidas quase não existem

`src/config/whatsapp.config.ts` define `message.default` (l.7) e `message.product()` (l.8) e o helper `getWhatsAppLink()` (l.12-19). **Porém `WHATSAPP_CONFIG.link` é o wa.me cru sem `?text=`**, e é ele que ~90% dos CTAs usam:

CTAs SEM mensagem pré-preenchida (usuário cai num chat vazio e tem que redigir do zero; atendente recebe "oi" sem contexto):
- Header desktop + mobile (`Header.tsx:203,215`)
- Footer CTA grande + ícone social (`Footer.tsx:31,64`)
- MobileMenu "Fazer orçamento agora" (`MobileMenu.tsx:117`)
- WhatsAppFloat (`WhatsAppFloat.tsx:35`)
- Hero da home — CTA principal do site (`src/components/StartCarousel.tsx:123`)
- CTA final da home (`src/components/Main.tsx:178`) — irônico: o texto ao lado diz "Manda data, local e número de convidados pelo WhatsApp" (Main.tsx:167) mas o link não pré-preenche nada disso
- /contato (3 CTAs: `src/app/contato/page.tsx:63,250` + card)
- /empresas (3 CTAs: `src/app/empresas/page.tsx:79,257,382`) — lead B2B chega sem contexto corporativo
- /sobre:241, /galeria:160, /como-funciona:177, not-found:324
- Catálogo: `src/components/catalogo/CatalogoList.tsx:66` e `CategoryListing.tsx:169` — nem o nome da categoria vai na mensagem
- `src/components/sections/como-funciona/ComoFunciona.tsx:311`, `Demonstra.tsx:259`

CTAs COM mensagem contextual (os únicos):
- Página de produto (`src/components/catalogo/ProductInfo.tsx:35-46`): "Olá! Gostaria de fazer um orçamento para o produto: {titulo}." — bom, mas não inclui a URL do produto (atendente não consegue clicar pra ver qual é).
- Modal do carrossel top-toys (`CarouselModal.tsx:48-49`) usa `message.product()`.

`message.default` ("Olá! Gostaria de mais informações sobre o aluguel de brinquedos.") é **código morto** — nunca usado. Detalhe: o texto fala "brinquedos", mas o posicionamento do site é games/fliperamas — se for usado, revisar copy.

**Verificado no HTML renderizado** (curl localhost:3000): 9 links `wa.me/5511965261000` na home, todos sem `?text=`.

## 3. Rastreamento GTM — funil cego nos pontos de maior tráfego

GTM instalado corretamente no layout (`src/app/layout.tsx:62-77`), container `GTM-WN24XLQC` confirmado no HTML renderizado (env `NEXT_PUBLIC_GTM_ID` em `.env.local` — risco: se o build de produção não tiver a var, o GTM quebra silenciosamente, sem fallback nem warning).

`src/lib/gtm-utils.ts` é limpo: `trackEvent`, `trackWhatsAppClick(location, extra)` → evento `whatsapp_click` com `click_location`.

**CTAs rastreados** (6 pontos): header_cta, header_icon_mobile (`Header.tsx:206,218`), mobile_menu_orcamento (`MobileMenu.tsx:121`), floating_button c/ page_url+page_title (`WhatsAppFloat.tsx:30-33`), home_cta_final_orcamento (`Main.tsx:178`), home_cta_demonstracao (`Demonstra.tsx:261`), product_page_cta_orcamento/pergunta c/ product_name (`ProductInfo.tsx:40-50`).

**CTAs NÃO rastreados** (a maioria, porque são server components com `<Link>` cru, sem onClick):
- Hero da home (`StartCarousel.tsx:123`) — provavelmente o botão mais clicado do site, invisível no GA
- Footer (2 links), /contato (3), /empresas (3), /sobre, /galeria, /como-funciona, not-found, CatalogoList, CategoryListing, ComoFunciona section
- Links `tel:` (Footer.tsx:151, contato/page.tsx:95) sem tracking de clique-para-ligar

**Eventos nunca disparados (código morto em gtm-utils.ts):** `trackFormSubmit` (l.61), `trackProductView` (l.42), `trackCatalogNavigation` (l.72). Em particular, **o formulário de contato não dispara NENHUM evento de conversão** — leads por formulário são invisíveis no GA4/Google Ads.

**Inconsistência de parâmetros:** floating_button manda `page_url/page_title`, product manda `product_name`, demais mandam só `click_location`. Sem padrão, análise no GA4 vira colcha de retalhos.

## 4. Formulário de contato (/contato)

`src/components/forms/ContactForm.tsx`:
- **Funciona em site estático?** Sim — POST client-side para Web3Forms (`https://api.web3forms.com/submit`, l.51), access key pública hardcoded (l.8 — normal no modelo Web3Forms, mas exposta a abuso/spam; proteção é só um honeypot checkbox l.76-83; plano gratuito Web3Forms tem limite de submissions/mês — se estourar, o form falha).
- **Para onde envia?** Email via Web3Forms com subject "Site — Orçamento {tipo} — {nome}" (l.43-46). Bons campos de qualificação: tipo de evento (com "Evento corporativo / SIPAT"), data, local/bairro, mensagem.
- **BUG DE PROMESSA:** a página diz "Ao enviar, abrimos um chat pré-preenchido no WhatsApp — é só confirmar" (`src/app/contato/page.tsx:123`), mas o form **não abre WhatsApp nenhum** — só mostra mensagem de sucesso. E o próprio form diz outra coisa: "★ Direto no nosso email / A gente responde em 1 dia útil" (`ContactForm.tsx:230-233`). Três narrativas conflitantes na mesma página.
- Telefone não é obrigatório (l.128-135) — para negócio que fecha por WhatsApp, lead sem telefone vale muito menos. Sem máscara de telefone.
- Sem `trackFormSubmit` no sucesso (ver §3).
- "A gente responde em 1 dia útil" enfraquece vs. WhatsApp "resposta rápida" — ok como expectativa honesta.

## 5. WhatsAppFloat — pontos de atenção

`src/components/WhatsAppFloat.tsx`:
- **Badge falsa de notificação "1"** com animate-bounce (l.77-79) — dark pattern; usuário percebe que não há mensagem nenhuma. Mina confiança.
- Tooltip "Precisa de ajuda?" aparece 5s, some aos 15s (l.12-27) — só uma vez por pageload, ok.
- `<button>` + `window.open` (l.35) em vez de `<a href>` — funciona (gesto direto de clique), mas um anchor seria mais robusto/acessível. Sem aria-label no botão (nome acessível vem do alt da img, aceitável).
- Ícone via PNG `/WhatsApp-logo-42377766.png` em vez do FaWhatsapp usado no resto do site.

## 6. Código morto / inconsistências

- `src/components/ui/WhatsAppButton.tsx` — componente completo (tracking + mensagem + variantes) **nunca importado em lugar nenhum**. Ironia: é exatamente o componente que resolveria §2 e §3. Detalhe nele: monta URL `wa.me/+5511965261000` (formattedNumber com "+", l.28+46) — forma não-canônica.
- `StartCarouselClaude.tsx` não é usado (`HomeShell.tsx` importa StartCarousel + Main).
- Botão coração (favoritar) sem nenhuma função em `ProductInfo.tsx:72-74` — clique não faz nada.

## 7. Telefone / endereço / horário / trust signals

- **Telefone:** visível no footer (`Footer.tsx:148-156`, com tel: link), menu mobile, /contato em destaque. Bom.
- **Endereço físico:** inexistente em todo o site — só "Atendemos toda a Grande São Paulo". Para service-area business é defensável, mas **sem CNPJ em lugar nenhum** (grep confirmou) — para o público B2B da página /empresas, CNPJ no footer é trust signal barato e importante no Brasil.
- **Horário:** só existe em /contato (`contato/page.tsx:168-181`: Seg-Sex 08:30–18:00, Sáb 08:00–12:30). **DIVERGE do JSON-LD da home** (`src/app/page.tsx:101-114`: 09:00–18:00, Sáb 09:00–14:00). Google pode exibir horário errado no painel. Footer não tem horário.
- **Trust signals:** "Desde 1993" / "33+ anos" no footer (`Footer.tsx:172-177`) — forte e bem usado. Mas: sem link para Google Reviews/Maps, sem selo de avaliações, sem depoimentos no funil de contato. Em `ProductInfo.tsx:112-125`: "500+ eventos" (baixo para 33 anos de empresa — 15/ano?) e "100% Satisfação" (não-verificável, soa inflado) — números provavelmente piores que a realidade real da empresa.
- Social: instagram.com/alugueldegames e facebook.com/alugueldegames no footer e /contato (não validei se os handles existem).
- /contato badge "Online · Pronto pra atender" (`contato/page.tsx:34-38`) é estático — exibe "Online" às 3h da manhã de domingo. Pequena desonestidade.

## 8. Pontos fortes (não mexer)

1. 1 clique até o WhatsApp de qualquer página; CTA persistente no header + float + footer.
2. Página de produto com mensagem contextual + tracking com product_name — padrão correto, só precisa ser replicado.
3. Menu mobile excelente (scroll lock, ESC, CTA no topo, contato no rodapé do drawer).
4. Formulário com campos de qualificação certos (tipo de evento, data, local) e funcional em static export.
5. gtm-utils centralizado e bem documentado; GTM com noscript fallback.
6. /contato completo: WhatsApp em destaque, telefone, horários, área de atendimento, expectativa de resposta.
7. JSON-LD EntertainmentBusiness rico na home (areaServed, openingHours, hasOfferCatalog).

## 9. Recomendações priorizadas

1. **(Alto impacto, baixo esforço)** Usar `getWhatsAppLink(mensagem)` em TODOS os CTAs com mensagens contextuais por página: genérica no header/float ("Olá! Vi o site e quero um orçamento"), corporativa em /empresas, por categoria no catálogo (nome da categoria), com URL do produto na página de produto. O config já existe — é trocar `WHATSAPP_CONFIG.link` por `getWhatsAppLink(...)`.
2. **(Alto)** Criar um único componente client `<WhatsAppCta location="..." message="...">` (ou ressuscitar WhatsAppButton.tsx) e substituir todos os `<Link href={WHATSAPP_CONFIG.link}>` crus — resolve tracking + mensagem de uma vez, inclusive em server components (o componente é client).
3. **(Alto)** Disparar `trackFormSubmit('contact_form')` + evento `generate_lead` no sucesso do form; marcar `whatsapp_click` e `form_submit` como conversões no GA4/Ads.
4. **(Alto)** Decidir o fluxo do form: ou cumprir a promessa (redirecionar pós-envio para WhatsApp pré-preenchido com nome/data/local — conversão dupla) ou corrigir o texto em `contato/page.tsx:123`.
5. **(Médio)** Unificar horários numa única fonte (site.config) e corrigir JSON-LD vs /contato.
6. **(Médio)** Padronizar payload do evento: `click_location` + `page_path` + `product_name?` em todos os cliques.
7. **(Médio)** Remover badge "1" falsa do float; trocar por texto honesto ("Resposta rápida").
8. **(Médio)** Footer: adicionar horário, CNPJ e link Google Reviews; tornar telefone obrigatório no form (ou pelo menos um dos dois: tel/email).
9. **(Baixo)** Dropdown desktop acessível por teclado (focus/aria-expanded); mover "Contato" para top-level ou pro dropdown certo; remover coração morto no ProductInfo; revisar números "500+/100%"; deletar StartCarouselClaude e código morto de gtm-utils ou passar a usá-los.
