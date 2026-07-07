# VEREDITO FINAL — Painel de redesign Aluguel de Games (07/07/2026)

Moderador: síntese das 6 gerações × 4 críticos (dono, cliente-mãe 22h, RH/B2B desktop, auditor SEO/GEO/perf), sobre o BRIEF-REDESIGN.md e as 4 pesquisas.
Saídas: `SPEC-FINAL-V1.md` (redesign total) e `SPEC-FINAL-V2.md` (evolução do opus-4.8).

---

## 1. Placar consolidado (média das 4 lentes)

| Spec | Dono | Mãe | RH/B2B | Auditor | **Média** | Destino no merge |
|---|---|---|---|---|---|---|
| **V1A — Conversão radical** | 7,0 | 7,5 | 6,0 | 7,0 | **6,9** | Motor da FINAL-V1: hero estático, sticky bar global, widget, audits CI. Migração de URL REJEITADA |
| **V1C — AI-native** | 6,0 | 6,0 | 8,0 | 7,5 | **6,9** | Esqueleto da FINAL-V1: URLs aninhadas, H1, anatomia de resposta, e-mail B2B, chips "vai bem em". Estética terminal REJEITADA |
| **V2B — Catálogo-first** | 8,0 | 7,0 | 7,0 | 5,0 | **6,75** | Base da FINAL-V2: vitrine por ocasião, produto padrão-ouro, escopo 15 specs. Busca REMOVIDA, `ocasioes[]` ganhou fallback, home ganhou dobra de preço |
| **V2C — Prova + B2B** | 7,0 | 5,0 | 7,5 | 6,0 | **6,4** | /empresas das DUAS finais (estrutura + kit PDF URL estável) + regra de fallback de placeholder + taxonomia GA4. H1 "inesquecível" REJEITADO |
| **V2A — Polish & conversão** | 6,0 | 6,0 | 5,5 | 7,0 | **6,1** | Método da fase 0 (arquivo:linha) nas duas finais + planilha de specs + copy "combos saem melhor". Demonstra standalone e ícone "+" REJEITADOS |
| **V1B — Arcade premium** | 5,0 | 5,0 | 6,5 | 6,0 | **5,6** | Doa a melhor FAQ de garantia ("o problema é nosso, não seu"), `--glow-scale` e o aceite de sitemap por grep. Marquee, PRESS START e prioridade estética REJEITADOS |

Nenhuma geração aprovada inteira — as duas finais são fusões, como os 4 críticos convergiram em recomendar.

## 2. Decisões-chave da SPEC-FINAL-V1 (redesign total)

1. **Base V1C + motor V1A** (o par que o auditor apontou): URLs aninhadas intactas = zero migração/301/colisão ("Carrinho Infantil" ×2 verificado no repo) e **hero estático** = LCP resolvido por arquitetura, não por fé — 5 das 6 gerações mantinham carrossel autoplay e prometiam CWV verde.
2. H1 `Aluguel de fliperama, videokê e games para festas` (melhor message match); /quanto-custa vira dobra 3 da home (V1A) — a pergunta nº1 nunca fica atrás de vitrine.
3. Widget "monte sua festa" renomeado (não promete orçamento em 30s — promete mandar o pedido em 1 mensagem); sticky bar global mobile ÚNICA e context-aware (mata o conflito de duas barras da V1A original).
4. Estética: dark/neon humano; mono só em specs/números — a "cara de terminal" da V1C foi o motivo das notas 6,0 de dono e mãe.
5. 24 dias; /festas e kit PDF B2B viraram NUNCA-CORTA (4 de 6 gerações cortavam primeiro a LP do público que paga o Ads).

## 3. Decisões-chave da SPEC-FINAL-V2 (evolução opus-4.8)

1. **Base V2B** (nota máxima do dono: pensa por ocasião e orça as 2h/semana dele) com as 3 falhas reprovatórias corrigidas: busca REMOVIDA (violação do brief), fileiras por ocasião com **fallback automático categoria→ocasião** (`occasions.ts`; curadoria vira override, fileira nunca nasce magra), e **dobra "Quanto custa" + pergunta de preço na FAQ da home** (a V2B nunca mencionava preço na página mais visitada).
2. Carrossel mantido (mandato desta versão) mas des-JSificado no primeiro paint: slide 1 renderiza server-side como `<img>` priority; embla hidrata depois. **Gate escrito: LCP >2.5s após otimização ⇒ transplanta o hero estático da FINAL-V1, sem novo debate.**
3. H1 transacional mata o "inesquecível"; Demonstra funde na dobra de prova; "+ Orçamento" sempre com rótulo; trust strip quebra em 2 linhas (nunca marquee/scroll).
4. Estimativa corrigida de 18 → 23 dias (a fase de 7 LPs+carrinho em 3 dias era a menos crível das seis).

## 4. Correções transversais que NENHUMA geração tinha (entraram nas duas)

- **Estado fora-do-horário** junto de todo CTA (a mãe às 22h convertia pra uma conversa que não ia acontecer).
- **SLA = número**: toda promessa de tempo ("em horas", "em minutos", "1 dia útil") vira `[CONFIRMAR COM DONO]`; default "horário comercial". Mesma doença do contador fake, versão relógio.
- **Form B2B com destino real**: Web3Forms (padrão já existente em `ContactForm.tsx:51` — a crítica S1 do auditor estava parcialmente errada: o form de /contato JÁ entrega por e-mail; o buraco era /empresas) + **e-mail corporativo visível com mailto** (gate do RH).
- **Dimensionamento ganha a linha 151-250 pessoas** (o caso mediano de confra caía fora de todas as tabelas) + colunas técnicos/tomadas/montagem.
- **"NF" vira "NF/fatura de locação" explicada** (locação de bens móveis não emite NFS-e comum — só a V2C sabia).
- **2h/semana do dono orçadas** em `DONO-CHECKLIST.md` priorizado; specs começam pelos 15 produtos top.
- FAQPage/HowTo vendidos ao dono como GEO, nunca como rich result (Google matou em 2023).

## 5. Críticas REJEITADAS (com motivo)

- **Mãe: "ancorar magnitude de preço mesmo sem o dono"** — rejeitada como pedida: número sem assinatura é fabricação (gate binário). Aceita a versão possível: fallback que ensina os fatores + "combos saem melhor"; âncoras só com compromisso escrito.
- **RH: "cotação formal da MINHA data por e-mail"** — rejeitada no launch: exigiria backend/sistema de proposta (static export é inegociável). Mitigada com Web3Forms + e-mail visível + kit PDF encaminhável.
- **Dono sobre V1C: "GEO é robô de 2027, cortar"** — parcialmente rejeitada: a ESTRUTURA GEO (capsule, tabela, FAQ nativa) fica porque é a mesma que serve Ads/SEO/humano a custo marginal zero; o que caiu foi GEO como tese de venda e a estética de terminal.
- **Auditor S1 como formulado ("lead formal por e-mail não existe")** — parcialmente rejeitada por evidência no repo: `ContactForm.tsx` já posta na Web3Forms. Corrigido o que faltava (/empresas).

## 6. Recomendação: qual vai ao ar primeiro

**A FINAL-V2 (evolução do opus-4.8).** Motivos: (1) o working tree JÁ é o opus-4.8 — 90% das rotas e do grafo JSON-LD existem, menor risco de regressão na janela em que o Ads liga; (2) mesmo total de dias no papel (23 vs 24), mas a V2 entrega valor incremental deployável por fase (fase 0 em 3,5 dias já melhora o site no ar), enquanto a V1 troca a home/hero inteiros antes de estabilizar; (3) as duas compartilham fase 0, motor de conversão, /empresas, /quanto-custa e a camada GEO — o que a V1 tem de exclusivo (hero estático, home 8 dobras) está preservado como **válvula já decidida**: se o carrossel reprovar no PageSpeed (LCP >2.5s), o hero estático da FINAL-V1 entra sem novo painel. Ordem de execução: fase 0 AMANHÃ (é idêntica nas duas e é pré-condição de qualquer campanha) → FINAL-V2 completa → medir Ads/CWV/GEO por 60-90 dias → decidir se elementos da FINAL-V1 (home resposta, hero estático) entram como evolução seguinte.
