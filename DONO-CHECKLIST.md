# DONO-CHECKLIST — o que só o dono tem

Este é o documento MESTRE (versão completa e priorizada) do que depende do dono pra
o site sair 100%. Regra que vale pra tudo: **nada é inventado**. Onde falta um dado
do dono, o site ou omite o trecho (nunca mostra "—" nem placeholder cru pro cliente)
ou responde de forma honesta sem cravar número. Preencher cada item = 1 linha de
código no arquivo indicado, e o trecho liga sozinho.

As **2h/semana do dono são recurso orçado** — o plano abaixo cabe em ~4 semanas de 2h.
Marca **[x]** com a data quando confirmar.

---

## Semana 1 — o que destrava mais coisa (≈2h)

### 1. Garantia e políticas (redação final) — PRIORIDADE MÁXIMA
- [ ] **Garantia de defeito.** O site JÁ diz "troca ou manda técnico no local, sem custo"
  (home, produto, /como-funciona, /empresas). Confirmar que é isso mesmo: tem franquia?
  prazo de resposta no local? → texto em `src/lib/catalog-content.ts` (FAQ_GARANTIA) e
  `src/app/como-funciona/page.tsx`.
- [ ] **Política de chuva / reagendamento.** Hoje a resposta é honesta mas genérica
  ("precisa de cobertura; combinamos reagendamento"). Falta a regra real: reagenda sem
  custo? até quando avisar? → FAQ em `festas/page.tsx` e `como-funciona/page.tsx`.
- [ ] **Sinal e cancelamento.** Hoje: "costuma pedir um sinal, condições no contrato"
  (sem %). Confirmar o % do sinal e a regra de cancelamento → `como-funciona/page.tsx`.
- [ ] **Período da diária (em horas).** Hoje: "a diária cobre o período do seu evento"
  (sem número). Confirmar as HORAS da diária padrão → destrava faixas de preço e a spec
  do produto → `src/config/whatsapp.config.ts` + FAQ "Qual o período da diária?".

### 2. CNPJ + e-mail corporativo — GATE da /empresas
- [ ] **CNPJ.** Hoje omitido do JSON-LD (`taxID`) e o footer mostra o placeholder pro
  dono ver. Preencher `CNPJ` em `src/lib/schema.ts` → liga footer, badge da /empresas,
  cabeçalho do kit de aprovação e o bloco de cadastro de fornecedor.
- [ ] **E-mail corporativo.** É o **bloqueador nº1 da /empresas** (persona RH tem WhatsApp
  Web bloqueado). Sem ele, o `mailto:` visível não renderiza e a página cai no fallback
  (form + WhatsApp). Preencher `CORP_EMAIL` em `src/lib/schema.ts` → liga o e-mail visível
  no hero e no CTA da /empresas e no kit.

---

## Semana 2 — Google e presença (≈2h)

### 3. Google Business Profile (link + nota)
- [ ] **Link do GBP.** Preencher `GBP_URL` em `src/lib/schema.ts` → liga: item "★ Google"
  na trust strip da home, botão "Ver avaliações no Google" na prova, `hasMap` + `sameAs`
  no schema e o bloco "avalie a gente" no footer.
- [ ] **Nota média** (opcional). Só o link já ajuda; a nota é opcional. NUNCA inventamos
  nota nem review (o site não tem `aggregateRating` de propósito).
- [ ] **WhatsApp Business** configurado (perfil, catálogo, respostas rápidas, horário) —
  não muda código, mas é o outro lado da conversão que o site gera.

### 4. Off-site NAP idêntico
- [ ] GBP + Bing Places + Foursquare + Apple Maps com **o mesmo** nome/endereço/telefone.
- [ ] Pedir review no Google **depois de cada evento** (rotina, não código).

### 5. Endereço e horário
- [ ] **Endereço completo** (rua/nº/CEP em Osasco) → `STREET_ADDRESS` em `src/lib/schema.ts`.
  Hoje o schema/footer usam só "Osasco · SP · Grande SP".
- [ ] **Horário real** (abre/fecha, sábado?) → `ATTENDANCE_HOURS` em
  `src/config/whatsapp.config.ts` (`confirmed: true`). Enquanto `false`, todo CTA mostra
  "horário comercial" + "manda mesmo assim, respondemos no próximo período".

---

## Semana 3 — /empresas fino + preço (≈2h)

### 6. /empresas — dados que faltam
- [ ] **Seguro / responsabilidade civil.** GATE: enquanto o dono não confirmar, o site
  **NÃO menciona seguro** (nem no FAQ, nem no kit) — de propósito, pra não prometer o que
  não tem. Confirmar se há cobertura/responsabilidade → aí entra uma FAQ nova em
  `src/app/empresas/page.tsx` (FAQ_B2B).
- [ ] **Formas e prazo de pagamento** reais (boleto? faturamento 14/28/30 dias? PIX?) →
  hoje a resposta é "a gente se adapta à sua política" (honesto, sem cravar). Confirmar
  pra deixar específico na FAQ da /empresas.
- [ ] **Dimensionamento logístico** por porte (m², nº de tomadas, nº de técnicos, tempo de
  montagem). Hoje a tabela mostra só o MIX sugerido (recomendação honesta) e diz "o fino a
  gente fecha no orçamento". Confirmar os números → viram colunas na tabela de
  `empresas/page.tsx` (`PORTES`).
- [ ] **Relatório/fotos pós-evento.** O passo "Fechamento" da /empresas cita "a gente
  combina o registro do evento". Ele já manda fotos pro cliente hoje? Se sim, vira promessa
  firme; se não, ajusta a redação.
- [ ] **Escopo dos cases** (Bradesco/Arnold/Spotify): "6 máquinas · 2 dias" etc. Hoje é
  qualitativo honesto, sem número. Confirmar pra deixar concreto em `CASES` da /empresas.

### 7. Faixas de preço (opcional, mas alto impacto)
- [ ] Faixas por categoria OU "a partir de R$ X" — **só com compromisso escrito** (o site
  passa a exibir e a honrar). Preencher `PRICE_RANGES` em `src/lib/schema.ts`. Sem isso,
  /quanto-custa e a home rodam na **versão B** (4 fatores + "combos saem melhor", zero
  número). Piloto sugerido: preço fechado só de kits fechados.

---

## Semana 4 — catálogo e mídia (≈2h, incremental)

### 8. Specs dos 15 produtos mais pedidos
- [ ] Planilha-template: dimensões L×A×P, peso, tomada 110/220V, nº de jogadores, espaço
  mínimo, passa em porta de 80cm?, elevador?, itens inclusos.
- **JÁ ESTÁ LIGADO**: a ficha técnica `<table>` + o JSON-LD `additionalProperty` leem o
  campo **`specs`** de cada `public/Organizado/.../metadata.json`. Preencher = a linha
  aparece; vazio = a linha some (sem "—", sem buraco).
- **14 produtos já têm DIMENSÃO** automática (migrada do nome de arquivo das fotos). Falta
  voltagem, jogadores, idade, peso — **só o dono tem**.

### 9. Galeria: ano/escopo dos álbuns
- [ ] Por álbum: "Spotify, 2024 · 6 máquinas" etc. Sem confirmação → grid com legendas
  nomeadas sem ano (fallback já desenhado).

### 10. Autorização de logos
- [ ] Logo-wall de clientes (Bradesco/Spotify/etc.) só entra com **autorização formal**.
  Hoje usamos os NOMES em texto (fato verificável) + fotos onde a foto é real de verdade
  (Bradesco/Braland, Danilo Gentili). Nunca foto genérica rotulada com nome de cliente.

### 11. Foto do fundador (opcional, /sobre)
- [ ] Se quiser rosto na /sobre, mandar 1 foto. Sem ela, a página fica só com a história
  (funciona bem assim).

---

## Fora do caminho crítico (dá pra deixar pro fim)
- Kit de aprovação em PDF "de verdade": hoje é uma página imprimível
  (`/empresas/kit-aprovacao`) que o RH salva como PDF pelo próprio navegador. Gerar um .pdf
  fixo no build exige ferramenta extra — só vale a pena depois que o conteúdo estiver
  fechado com o dono.
- Baseline mensal de citação em IA (ChatGPT/Perplexity) — começar a medir já, é rotina.

---

### Resumo dos "interruptores" (tudo em 2 arquivos)
| Dado | Arquivo | Constante |
|---|---|---|
| CNPJ | `src/lib/schema.ts` | `CNPJ` |
| E-mail corporativo | `src/lib/schema.ts` | `CORP_EMAIL` |
| Link Google (GBP) | `src/lib/schema.ts` | `GBP_URL` |
| Endereço (rua) | `src/lib/schema.ts` | `STREET_ADDRESS` |
| Faixas de preço | `src/lib/schema.ts` | `PRICE_RANGES` |
| Horário | `src/config/whatsapp.config.ts` | `ATTENDANCE_HOURS` |
| Specs por produto | `public/Organizado/.../metadata.json` | `specs` |
