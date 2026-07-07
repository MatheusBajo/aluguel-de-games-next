# CRÍTICA — Lente RH/Compras B2B (confraternização de 200 pessoas, desktop corporativo)

**Persona:** analista de RH cotando confra de fim de ano para 200 pessoas. Estou no desktop da empresa: **WhatsApp Web bloqueado pela TI**. Preciso de 3 coisas pra aprovar internamente: (1) documento com CNPJ/razão social/NF/seguro que eu encaminhe pro financeiro; (2) canal escrito que funcione no meu ambiente (e-mail) + telefone; (3) uma /empresas que me diga QUANTOS equipamentos pra 200 pessoas e me dê prova que o chefe aceite.

**Data:** 07/07/2026 · Avaliadas: SPEC-V1A, V1B, V1C, V2A, V2B, V2C contra o BRIEF-REDESIGN.md.

---

## Os 3 furos SISTÊMICOS (valem pras 6 — herdados do brief, mas nenhuma spec escapou)

Antes das notas, o que me impede de fechar com QUALQUER uma das seis como estão:

1. **O funil inteiro pressupõe que wa.me funciona — no meu desktop não funciona.** Todas as specs seguem o gate 1.2 do brief: form com "pós-envio abre wa.me pré-preenchido". Static export = sem backend = o form NÃO envia nada pra ninguém; ele só monta um link de WhatsApp. Com WhatsApp Web bloqueado, eu preencho empresa/data/nº de pessoas, aperto enviar, abre uma aba que a TI mata, e **meu dado evapora**. Nenhuma das 6 specs desenhou `mailto:` de fallback, provedor de form estático (Formspree-like) ou sequer exibiu um e-mail comercial pra eu escrever por conta própria (exceções parciais: V1C e V2A, ver abaixo). O `tel:` no desktop corporativo abre um diálogo "escolher aplicativo" — inútil; o que me salva é o NÚMERO em texto, que todas têm.

2. **200 pessoas não existe em nenhuma tabela de dimensionamento.** As 6 specs copiaram o "50/150/400" do brief §2 sem questionar. Confra corporativa típica é 100–300 pessoas; 200 é O caso mediano, e em todas eu tenho que interpolar por conta própria antes de levar pro chefe. A V2C é a pior instância: "até 50 / até 150 / 300-400+" — 151 a 299 é literalmente terra de ninguém, com CTA por porte que não tem porte pra mim.

3. **"NF, contrato e seguro" é promessa com [PLACEHOLDER] embaixo.** Seguro/responsabilidade civil é pergunta de gate em qualquer empresa pra evento de 200 pessoas, e nas 6 specs a resposta é `[PLACEHOLDER: dono confirma]`. Se o dono não confirmar, a página vai ao ar sem a resposta que trava minha aprovação. Detalhe que só a V2C percebeu: **locação de bens móveis não gera NFS-e comum** (LC 116/2003 — não é serviço); o financeiro devolve o processo se o site prometer "NF" genérica e chegar fatura de locação. A V2C lista "NF de locação" na FAQ; as outras 5 prometem "NF" no escuro.

Bônus sistêmico: **nenhuma spec oferece proposta formal por e-mail** (PDF de cotação com CNPJ). O kit de aprovação é genérico; a cotação da MINHA data — o anexo que vai na requisição de compra — só existe dentro de uma conversa de WhatsApp que eu não consigo abrir.

---

## Notas

| Spec | Nota (0-10) | Resumo na minha lente |
|---|---|---|
| V1C — AI-Native | **8,0** | Única com e-mail corporativo exibido; CNPJ no hero B2B; PDF com faixa de investimento; relatório pós-evento |
| V2C — Prova+B2B | **7,5** | Melhor artefato de aprovação (PDF 2 pág. + cronograma + URL estável), mas ZERO e-mail e o buraco dos 200 é o pior |
| V2B — Catálogo-first | **7,0** | PDF mais completo cadastralmente (razão social) e mais protegido no corte; home me faz atravessar vitrine infantil |
| V1B — Arcade Premium | **6,5** | Tabela com nº de técnicos (a melhor) e tom sóbrio no B2B; mas PDF sem seguro e 26 dias gastos majoritariamente em estética |
| V1A — Conversão Radical | **6,0** | FAQ B2B operacional boa; mas /empresas é apêndice de uma máquina B2C e o PDF é o 3º item a morrer no corte |
| V2A — Polish & Conversão | **5,5** | PDF do kit é o corte nº2 ("vira 'peça por WhatsApp'"), tabela mais rasa das 6, e-mail = placeholder |

---

## V1A — Conversão Radical · **6,0**

A spec é uma máquina de B2C mobile; /empresas (§5) é competente mas claramente a 9ª prioridade de um documento com 8 dobras de home.

**3 piores problemas:**
1. **§5.9 + §9.4 — canal escrito inexistente.** Form com "telefone OBRIGATÓRIO, e-mail opcional, pós-envio abre wa.me": no meu desktop o fluxo morre no wa.me e o dado digitado não vai pra lugar nenhum. Nenhum e-mail da empresa aparece em toda a página. O prefill B2B de §9.4 ("Olá! Sou da empresa ___…") é ótimo — pra quem pode abrir WhatsApp, que não é meu caso.
2. **§5.4 — dimensionamento raso e placeholder-dependente.** "Nº sugerido de equipamentos, mix recomendado, espaço e energia" para 50/150/400: sem tempo de montagem, sem equipe/técnicos, sem linha pra 200, e o mix inteiro é `[PLACEHOLDER: dono valida]`. Se o dono não validar, minha tabela-argumento nasce vazia.
3. **§5.3 + §10 corte 3 — o artefato de aprovação é descartável.** PDF de 1 página "gerado no build (dados do metadata + config)": gerar doc de homologação a partir de metadata de catálogo promete um PDF raquítico (sem razão social, sem detalhe de seguro). E no plano de corte ele vira "seção HTML imprimível" — eu não encaminho "imprima esta página" pro financeiro.

**O que as outras deveriam roubar:** a FAQ B2B de §5.8 é a mais operacional das seis — "faturamento 30 dias?", "homologação de fornecedor?", "funcionário opera a máquina?", "evento em shopping/rua?". São exatamente as perguntas que facilities/compras me fazem de volta.

---

## V1B — Arcade Premium · **6,5**

**3 piores problemas:**
1. **§5.8 — mesmo dead-end de form** (tel obrigatório, e-mail opcional, pós-envio wa.me) e nenhum e-mail corporativo exibido. Num desktop corporativo, o único canal utilizável da página inteira é discar o telefone — em 2026, pra compra corporativa, isso é fluxo de 1998.
2. **§5.5 vs §5.7 — o PDF não responde o que a própria página promete.** O kit traz "CNPJ, escopo padrão, requisitos técnicos, política de cancelamento, fotos" — **sem seguro/responsabilidade** — enquanto a FAQ da mesma página levanta a pergunta do seguro. O documento que eu encaminho pro financeiro chega sem a resposta que a página admite ser relevante. Encaminhei, voltou com pergunta: perdi um ciclo.
3. **§7 + §10 — energia no lugar errado pro meu caso.** É a estimativa mais cara (26 dias) e a spec dedica páginas a "luz de museu", "orçamento de neon", scanline e botão START, enquanto /empresas é 1 fase entre 7 e o PDF é corte nº3. O `--glow-scale: .5` do B2B (bom!) é a confissão de que a estética-tese atrapalha o decisor corporativo.

**O que as outras deveriam roubar:** a coluna **"nº de técnicos"** no dimensionamento (§5.4) — é a única tabela que me diz se vem gente operando; pra 200 pessoas isso é pergunta de segurança do trabalho — e o dial de sobriedade (`--glow-scale`) por página.

---

## V1C — AI-Native · **8,0**

A melhor pra mim, com folga em UM critério decisivo: é a única spec onde /empresas termina com **"CTA final verde + tel + e-mail corporativo"** (§5.9). Alguém aqui lembrou que B2B escreve e-mail. CNPJ como badge no hero (§5.1), PDF com **faixa de investimento** (§5.5 — o número que orçamento interno precisa), e "relatório/fotos pós-evento" no processo (§5.6) — prestação de contas pronta pro meu chefe. Copy 9.4 ("proposta chega pronta pra aprovação interna, com PDF pro seu financeiro") fala minha língua.

**3 piores problemas:**
1. **§5 — sem form e canal escrito só no rodapé da página.** O e-mail existe mas é o último item do último bloco; não há form nenhum em /empresas (o form vive em /contato). E a promessa central — "proposta pronta pra aprovação interna" — **não diz por qual canal a proposta chega**. Se for WhatsApp, no meu desktop não chega. A spec vende o desfecho certo sem desenhar o transporte.
2. **§5.5 — "faixa de investimento [PLACEHOLDER]" dentro do PDF sem fallback desenhado.** O brief 1.6 diz que preço só entra com compromisso escrito do dono. Se ele não assinar (cenário provável no launch), o kit é gerado SEM o dado que mais importa — e a V1C, que exige "duas versões desenhadas" pra tudo, não desenhou a versão sem-faixa do próprio PDF.
3. **§5.4 — dimensionamento cita "área necessária, tomadas, tempo de montagem" mas tudo `[PLACEHOLDER: dono valida números]`, sem m² de referência, sem CTA por porte e com o mesmo buraco dos 200.** A V2C fez essa tabela concreta (~15/40/100m²); a V1C deixou esqueleto. E no plano de corte (§10 corte 2), o PDF é o segundo a morrer — contradiz o próprio copy 9.4.

**O que as outras deveriam roubar:** **e-mail corporativo visível no CTA** + **relatório/fotos pós-evento** como passo do processo. Custo zero, e é o que transforma "festa" em "fornecedor auditável".

---

## V2A — Polish & Conversão · **5,5**

A spec mais honesta em cirurgia de código (cita arquivo:linha do repo real) e a mais fraca na minha lente.

**3 piores problemas:**
1. **§10 corte 2 — "PDF kit aprovação (vira 'peça por WhatsApp')".** Transformar o artefato de aprovação interna em "chama no zap" é literalmente o anti-requisito da persona B2B desktop. É o segundo item da lista de corte: na primeira pressão de prazo, a única coisa que eu conseguiria encaminhar pro financeiro deixa de existir.
2. **§5.4 — a tabela de dimensionamento mais rasa das seis:** "quantos equipamentos recomendados, exemplo de mix, espaço" — sem tomadas, sem tempo de montagem, sem equipe, sem CTA por porte, sem linha pra 200. É um parágrafo com moldura de tabela.
3. **§5.9 — "e-mail `[PLACEHOLDER]` (B2B às vezes precisa de e-mail formal)".** Reconhece o problema e o adia. "Às vezes"? Compras corporativa SEMPRE precisa de trilha escrita. Sem form em /empresas, com e-mail placeholder e wa.me bloqueado, a página me dá um telefone e um tchau. E §5.5 "seguro/responsabilidade [PLACEHOLDER: conferir o que existe]" sugere que nem se sabe se seguro existe — isso ia estourar na minha homologação.

**O que as outras deveriam roubar:** cases com **legenda factual linkando o álbum nomeado da /galeria** (§5.3) — trilha de evidência em 2 cliques ("Bradesco · Braland · ativação de marca" → fotos do evento) pro chefe cético verificar sozinho.

---

## V2B — Catálogo-first · **7,0**

**3 piores problemas:**
1. **§5.8 — form dead-end padrão** (tel obrigatório, e-mail opcional, pós-envio wa.me) e nenhum e-mail publicado. E a FAQ B2B (§5.7) esquece "homologação de fornecedor" — a pergunta que V1A e V2A lembraram e que é o MEU processo.
2. **§1/§3 — a home me expulsa.** A tese "quem chega vê EQUIPAMENTO em 5 segundos, sem passar por nenhuma dobra institucional" é ótima pro pai comprando festa infantil e ruim pra mim: chegando pela busca da marca, atravesso "Pra festa infantil" e "Pra festa adulta" até achar 1 fileira "Sou empresa". Institucional é exatamente o que EU vim buscar (CNPJ, prova, processo). A vitrine por ocasião trata B2B como 1/3 de fileira.
3. **§5.4 — dimensionamento diz menos que o da V2C:** "50 → 2-3 equipamentos · 150 → 4-6 + máquina de dança · 400 → 8+ com operação assistida" — sem m², sem tomadas, sem tempo de montagem, e "operação assistida" só aparece no porte 400: pra 200 pessoas eu não sei se vem equipe. Buraco dos 200 incluso.

**O que as outras deveriam roubar:** o kit PDF com **razão social + NAP completos** (§5.5 — único com dados cadastrais de verdade, que é o que a homologação pede) e as **linhas do dimensionamento linkando os produtos** (§4-5) — a tabela vira lista de compras interna. Bônus: é a spec que mais protege o PDF no corte (5º de 5).

---

## V2C — Prova + B2B · **7,5**

A única spec construída EM VOLTA de mim ("o comprador B2B não decide sozinho, ele precisa CONVENCER o financeiro/RH", §1.2) — e por isso os furos doem mais.

**3 piores problemas:**
1. **E-mail: ZERO em toda a /empresas (§5.1–5.9).** Sem form, sem endereço de e-mail, sem mailto. A "máquina de aprovação interna" me oferece wa.me (bloqueado) e telefone. A "proposta em até 1 dia útil" (§5.7) chega por onde? Se a resposta é WhatsApp, a máquina não funciona no ambiente onde o RH trabalha 8h por dia. É a contradição central da spec: entendeu o comprador melhor que todas e esqueceu o canal dele.
2. **§5.3 — "até 50 / até 150 / 300-400+": evento de 200 pessoas não cai em NENHUMA linha.** E é a única spec com CTA de prefill POR PORTE — ou seja, o funil segmentado que ela inventou não tem segmento pro caso mais comum de confra corporativa. Pra spec cuja tese é dimensionamento, é o erro mais embaraçoso das seis.
3. **§10 — a tese é subfinanciada e placeholder-dependente.** Fase 4 dá **2 dias** pra "máquina B2B" inteira (dimensionamento + PDF 2 páginas + agenda + FAQ + case Spotify); o kit PDF é corte nº4; e os dados que sustentam a página — m², prazos, "6 máquinas · 2 dias" dos cases (§5.5), janela de agenda (§5.6) — são TODOS `[PLACEHOLDER: dono valida]`, sem plano de extração desses números do dono (que tem 2h/semana). Risco real: a máquina lança como esqueleto de placeholders.

**O que as outras deveriam roubar:** o **kit em URL estável `/empresas/kit-aprovacao.pdf`, 2 páginas, com modelo de cronograma e sem e-mail gate** (§2, §5.4) — é o único artefato das seis que eu consigo colar num e-mail interno hoje e que "circula com a marca dentro da empresa cliente". E a FAQ **"NF de locação"** (§5.8) — única spec que sabe que locação não emite NFS-e comum.

---

## Veredito da lente RH/B2B

Nenhuma das seis passa no meu teste de mesa como está: **eu, no desktop da empresa, não consigo iniciar uma cotação por escrito em nenhuma delas** — o form é fachada pra um wa.me que a TI bloqueia, e só a V1C publica um e-mail. Recomendação dura pro merge: (a) e-mail corporativo visível + mailto com assunto pré-preenchido em /empresas é GATE, não nice-to-have; (b) a tabela de dimensionamento precisa de uma linha 150–250 pessoas (o caso mediano de confra) com equipe/tomadas/m²/tempo; (c) o kit PDF adota o formato V2C (2 pág., URL estável, cronograma) com o cadastro da V2B (razão social+NAP) e a faixa de investimento da V1C, e vira item NUNCA-CORTA; (d) "NF" vira "fatura/NF de locação" explicada, senão compras devolve; (e) seguro/responsabilidade sai de [PLACEHOLDER] ANTES do launch da /empresas ou a seção não sobe. Base recomendada pra /empresas: **V2C** (estrutura) + e-mail/relatório da **V1C** + FAQ operacional da **V1A**.
