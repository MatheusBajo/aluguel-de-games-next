# DONO-CHECKLIST — o que só o dono tem (spec §1.8)

As 2h/semana do dono são recurso orçado. Ordem de prioridade abaixo (spec §1.8).
Cada item liga um trecho que HOJE está omitido ou genérico (regra do fallback §1.3:
slot sem dado confirmado não renderiza — nada de "—", nada de placeholder cru pro
cliente). Trocar cada um é 1 linha de código no arquivo indicado.

Formato: **[ ]** pendente · **[x]** confirmado (data).

---

## 1. Garantia / política (redação final)
- [ ] **Garantia de defeito** — a gente JÁ diz "troca ou manda técnico no local, sem custo"
  (home D5, produto, FAQ). Falta o dono **formalizar a redação oficial** (é isso mesmo?
  tem franquia? prazo de resposta no local?). Arquivo: texto em `src/components/home/HowItWorks.tsx`
  + FAQ da home/quanto-custa/festas.
- [ ] **Política de chuva / reagendamento** — hoje a resposta é honesta mas genérica
  ("precisa de cobertura; combinamos reagendamento"). Falta a regra real (reagenda sem custo?
  até quando avisar?). Arquivos: FAQ em `page.tsx`, `festas/page.tsx`.
- [ ] **Período da diária** — hoje: "a diária cobre o período do seu evento" (sem número).
  Confirmar as HORAS reais da diária padrão → destrava faixas de preço e specs.
  Arquivo: `ATTENDANCE_HOURS`/copy; FAQ "Qual o período da diária?".

## 2. E-mail corporativo + CNPJ
- [ ] **CNPJ** — hoje aparece como `[CONFIRMAR COM DONO: CNPJ]` no footer (visível de propósito,
  pro dono ver) e é omitido do JSON-LD (`taxID`). Preencher `CNPJ` em `src/lib/schema.ts`.
- [ ] **E-mail corporativo** — necessário pra /empresas (persona RH com WhatsApp Web bloqueado,
  gate da página). Sem ele, o `mailto:` de /empresas não renderiza. (fase 5)

## 3. Google (nota + link)
- [ ] **Link do Google Business Profile** — preencher `GBP_URL` em `src/lib/schema.ts`.
  Destrava: item "★ avaliações no Google" na trust strip (D1.5), botão "Ver avaliações no
  Google" na prova (D6), `hasMap` + `sameAs` no schema, bloco "avalie a gente" no footer.
- [ ] **Nota média** (se quiser exibir) — só o link já ajuda; a nota numérica é opcional.
  NUNCA inventamos nota nem review (sem `aggregateRating`).

## 4. Período da diária → ver item 1.

## 5. Specs dos 15 produtos mais pedidos (fase 4)
- [ ] Planilha-template: dimensões L×A×P, peso, tomada 110/220V, nº jogadores, espaço mínimo,
  passa em porta de 80cm?, elevador?, itens inclusos. Hoje o card de produto mostra "Entrega
  e montagem incluídas" no lugar da spec (fallback). (fase 4)

## 6. Faixas de preço (opcional)
- [ ] Faixas por categoria OU "a partir de R$ X" — SÓ com compromisso escrito do dono.
  Sem isso, /quanto-custa e a home rodam na **versão B** (4 fatores + "combos saem melhor",
  zero número). Piloto sugerido: preço fechado só de kits.

## 7. Ano / escopo dos álbuns da galeria (fase 6)
- [ ] Por álbum: "Spotify, 2024 · 6 máquinas" etc. Sem confirmação → grid com legendas
  nomeadas sem ano (fallback).

## 8. Autorização de logos (fase 5)
- [ ] Logo-wall de clientes (Bradesco/Spotify/etc.) só entra com autorização formal.
  Hoje usamos os NOMES em texto (fato verificável) + fotos onde a foto é real (Bradesco/Braland,
  Danilo Gentili). Nunca foto genérica rotulada com nome de cliente.

---

### Endereço (entra junto com o CNPJ — Osasco já está; falta a rua)
- [ ] **Endereço completo** (rua/número/CEP em Osasco) → `STREET_ADDRESS` em `src/lib/schema.ts`.
  Hoje o schema/footer usam só "Osasco · SP · Grande SP".

### Horário de atendimento
- [ ] **Horário real** (abre/fecha, sábado?) → `ATTENDANCE_HOURS` em `src/config/whatsapp.config.ts`
  (`confirmed: true`). Enquanto `false`, todo CTA mostra "horário comercial" + "manda mesmo
  assim, respondemos no próximo período" (os dois estados já desenhados).
