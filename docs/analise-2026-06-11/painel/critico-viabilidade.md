# Crítico de Viabilidade — "O que cabe na vida real?"

**Papel:** cético de execução. Premissas verificadas no código antes de opinar:
- `getWhatsAppLink()` existe em `src/config/whatsapp.config.ts` e é usado APENAS em `ProductInfo.tsx` — o fix de pré-preenchimento é de fato trivial. ✓
- O repositório tem **zero commits** (`git log` → "does not have any commits yet"). Qualquer plano que toque mídia em lote sem commit prévio é roleta-russa. ✓
- `public/` = **591 MB**, 49 MP4s. ✓
- `metadata.json` tem só `titulo/descricao/ordem/imagens` — specs estruturadas são campo novo + renderização nova, não "só transcrever". ✓
- Campo `ordem` já existe em `admin.server.ts` (default 9999) — curadoria de ordenação tem infraestrutura pronta. ✓

## Diagnóstico geral do painel

O painel produziu **~120 recomendações para 1 dev** em uma empresa onde o dono também é a operação. Mesmo aceitando os rótulos de esforço do próprio painel, só os itens "trivial/baixo" somam 6-10 semanas de dev — e os rótulos mentem sistematicamente em três pontos:

1. **"Esforço baixo" que esconde dependência do dono.** Reviews, preço-âncora, specs, fotos, combos com preço fechado, reativação de carteira: nada disso é código. São processos operacionais, decisões comerciais e coleta de conteúdo. Se não tiver um responsável NÃO-dev nomeado e um ritual semanal, morre na planilha. O painel inteiro trata "o dono faz" como custo zero — o dono tem um negócio para tocar.
2. **"Script de ~30 linhas" / "1 dia de trabalho" para infra.** Pipeline de imagens com sharp + custom loader sobre 591 MB com nomes de arquivo em NFD (o MESMO bug Unicode que quebra o catálogo vai quebrar o pipeline), cache incremental, e deploy na Hostinger: isso é 2-3 dias na melhor hipótese e uma superfície nova de manutenção. Vale a pena — mas orçado honestamente, e DEPOIS dos ganhos de 30 minutos (logo de 516 KB).
3. **Volume como risco em si.** Com 1 dev, a restrição não é saber o que fazer — é WIP. Plano realista de 3 meses: **~30 dias úteis de dev + ~2h/semana do dono.** Tudo que não couber nisso é consultorês.

**Risco sistêmico que o painel cita mas não eleva:** zero commits + plano cheio de operações destrutivas (ffmpeg, renames, sharp sobre originais). O item "backup + git antes de qualquer batch de mídia" não é recomendação — é **pré-condição bloqueante nº 0**.

## Vereditos (~16 recomendações mais recorrentes)

### APOIAR (cabem nos 3 meses, payoff quase certo)

**1. Mensagem pré-preenchida em todos os CTAs** — APOIAR. Único item citado por 8 lentes E pelas 4 personas. Verificado: o helper existe, é trocar a constante e passar contexto. 1-2 dias incluindo variantes por superfície. Se só uma coisa for feita, é esta. Cuidado: a versão "campos estruturados Data/Bairro/Convidados" é a v2 — não segurem a v1 (produto + URL) esperando o template perfeito.

**2. Componente WhatsAppCta único + tracking GA4** — APOIAR. 1-2 dias, e é o multiplicador: prefill, a11y, fallback `tel:`, tracking herdam de graça em 20+ CTAs. A "reconciliação mensal cliques × conversas" só sobrevive se virar ritual de 30 min com data marcada — caso contrário é a primeira coisa que morre.

**3. Sprint de des-fabricação 48h** — APOIAR. É deleção: hash de locações, badge '1', 'Online' estático, 98%/100%. Zero dependência do dono além de um "sim". O crítico de confiança está certo: risco assimétrico, decisão fácil. Discordância da Camila ("substituir por atributo real") é v2 — depende de specs que ainda não existem; remover não pode esperar a substituição ficar pronta.

**4. Fix da vitrine/catálogo (NFC, ordem, fim do 'Outros', headers linkados)** — APOIAR. O normalize é 1 linha; `ordem` já existe no admin; linkar headers às category pages existentes é costura, não construção. Única parte com dono: decidir a ordem curada (1 reunião de 1h).

**5. Hero pintando sem JS** — APOIAR. 2-4h, padrão CSS já existe no projeto, e a crítica de performance está certa contra a própria performance.md: comprimir vídeo não muda LCP de elemento com opacity:0. Primeiro commit técnico do plano.

**6. Fundação SEO técnica (GSC → canonical → sitemap único → JSON-LD server-side)** — APOIAR, na semana 2-3. É o raro caso de pacote técnico honestamente orçado (dias, não semanas) e bounded. Concordo com a discordância interna: matar o next-sitemap em vez de manter dois geradores. GSC via DNS primeiro — medição antes de fix é a única ordem defensável.

**7. Pacote legibilidade (12px mínimo, contraste, fallback 'ou ligue')** — APOIAR. CSS bounded, sem dependência externa, e duas personas (Fernanda, Seu Antônio) travam exatamente aí. O 'ou ligue (11)...' junto ao CTA custa uma linha e cobre o decisor 50+ que paga bodas e formatura.

### MODIFICAR (a ideia é certa, a dose/ordem está errada)

**8. Galeria de produto touch** — MODIFICAR. Fazer JÁ a versão mínima: controles visíveis abaixo de md:, aria-labels, tap = fullscreen (horas). NÃO fazer agora o rebuild embla + swipe + campo de capa curada (projeto de dias com risco de regressão). Empacotar a v1 com o sticky CTA como "projeto página de produto mobile" e medir whatsapp_click antes de investir na v2.

**9. Dieta de vídeos do Demonstra** — MODIFICAR. Aprovado SOMENTE após gate duro: `git init` + primeiro commit + backup de `public/` fora da máquina. Repo com zero commits + ffmpeg em lote sobre originais únicos da empresa = como se perde acervo de 33 anos. Concordo com a curadoria 3-4 clipes (menos trabalho E melhor resultado que recomprimir 7).

**10. Pipeline sharp + custom loader** — MODIFICAR. Não é "30 linhas": orçar 2-3 dias, testar com nomes NFD, e fazer DEPOIS de logo (30 min, -516 KB), vídeos e hero. Se o mês 2 apertar, é o item que desliza sem culpa — os sizes ruins doem menos que hero invisível e chat vazio.

**11. Specs estruturadas + reescrita das descrições** — MODIFICAR. "As medidas já estão nos filenames" é meia-verdade: extração + confirmação com o dono + renderização nova + 54 produtos = projeto de semanas disfarçado de transcrição. Versão viável: schema de campos 1 vez, conteúdo nos **top 15** (fliperamas vazios, videokê, boxe, Top 10) em 3 meses. 54 é fantasia; 15 bons batem 54 medíocres. A contradição do videokê (30.000 vs 12.000 músicas, "até 2023") é fix de texto de 1h — destacar do projeto grande e fazer já.

**12. Páginas por ocasião / kits** — MODIFICAR. Consenso de 6+ lentes na ideia, e todas subestimam o custo: cada página real = curadoria + copy + fotos + FAQ + decisão de combo. **2 páginas, não 6-8**: 'Festa infantil em casa/condomínio' (persona com maior volume) e 'Confraternização/SIPAT' (deadline sazonal real — precisa estar no ar até agosto). Lançar, medir whatsapp_click, e SÓ então expandir. Kits com preço fechado dependem de o dono definir e honrar preços — sem esse compromisso por escrito, lançar kits SEM preço com CTA pré-preenchido.

**13. GBP + motor de reviews** — MODIFICAR. A ideia é das melhores do painel; o rótulo "custo zero, sem dev" é falso, como o próprio especialista local admite: ordem obrigatória é bloco NAP/CNPJ no site (meio dia de dev) → documentação → cadastro SAB (verificação por vídeo, semanas) → processo D+1. E o motor de reviews é PROCESSO: mensagem template salva no WhatsApp Business + responsável nomeado + meta simples (ex.: pedir em 100% dos eventos). Sem dono do processo, em 60 dias ninguém pede mais.

**14. Âncora de preço 'a partir de R$ X'** — MODIFICAR. As 4 personas travam em preço — ignorar não é opção — mas o gargalo não é código, é compromisso comercial do dono (CDC art. 30: oferta vincula). Sequência viável: (a) página 'Quanto custa? Entenda o orçamento' (só conteúdo, zero risco, responde a intenção de busca nº 1); (b) SE o dono assinar pisos cumpríveis, testar 'a partir de' em 2 categorias por 60 dias. Pular direto para (b) sem o dono é recomendação que volta.

**15. OG image 1200×630** — MODIFICAR. Separar o que o painel fundiu: OG global decente (1 imagem estática, ~1h, mata o clipart laranja) é semana 1; OG por produto gerada em build entra junto com o pipeline sharp, não antes. O painel elevou a prioridade do segundo carregando no argumento do primeiro.

**16. Overlay de taxonomia** — MODIFICAR. Arquitetura correta, mas é refactor de 2-3 dias tocando rotas/sitemap/breadcrumb com risco de regressão em 54 URLs. Não deixar o fix NFC de 1 linha refém do refactor: NFC já; overlay como projeto do mês 2, com o manifesto de redirects junto (esse sim, inegociável antes de qualquer rename).

### DESAFIAR (consultorês ou fora do horizonte de 3 meses)

**17. Redesign de logo + fotografia humana + sessão noturna + foto anos 90** — DESAFIAR. Exige contratar designer, produzir ensaios, garimpar arquivo físico — projetos de marca com orçamento e gestão próprios que uma SMB de 1 dev não executa em paralelo ao backlog técnico. O que sobrevive: comprimir o logo atual (30 min) e trocar a OG global. O resto é trimestre 2+, se houver verba. "Esforço do dono, não do dev" não torna grátis — torna improvável.

**18. Portfólio de crescimento (parceiros comissionados, B2B recorrente, barter com criadores, PR, reativação da carteira de 33 anos)** — DESAFIAR em bloco. São 5 novos negócios/processos comerciais, cada um exigindo vendas ativas, material e follow-up — para uma empresa que ainda não responde WhatsApp fora do horário. Única exceção viável: reativação ESTREITA — só os clientes de confraternização dez/2025, contatados em setembro/2026. Uma lista de uma tarde, não "33 anos de carteira tabulados".

**19. Carrinho multi-item / mini-configurador / busca client-side** — DESAFIAR (= apoiar os críticos que já pediram adiamento, contra a persona Camila que o chama de "o que mais paga"). Cart em localStorage num site estático é superfície nova de bugs e manutenção para pedido típico de 1-3 itens; o template multi-linha no `?text=` + kits cobrem o caso. Revisitar só se o atendente reportar fricção real em pedidos multi-item.

## Plano que cabe em 3 meses (orçamento: ~30 dias-dev + 2h/semana do dono)

- **Semana 0 (gate):** git init + commit + backup de public/. Bloqueante para tudo.
- **Semanas 1-2 (conversão, ~6 dias):** WhatsAppCta único (prefill+tracking+tel:) → des-fabricação → hero CSS-first → NFC/ordem/'Outros' → logo 516KB → OG global → legibilidade.
- **Semanas 3-4 (~5 dias):** sticky CTA + galeria v1 → SEO fundação (GSC primeiro) → NAP/CNPJ/LGPD no footer → fix do texto do videokê.
- **Mês 2 (~10 dias):** vídeos (pós-backup) → specs top-15 → página 'Entenda o orçamento' → 1ª página de ocasião (confra, deadline agosto) → overlay+redirects.
- **Mês 3 (~8 dias):** pipeline sharp + OG por produto → 2ª página de ocasião → facetas leves SE specs prontas.
- **Trilha do dono (paralela, 2h/semana):** saudação/ausência/etiquetas no WhatsApp Business (semana 1) → documentação GBP → cadastro → template de review D+1 → decisão de preço (assinar ou arquivar) → ordem curada do catálogo.
- **Cortado deste trimestre:** redesign de marca, ensaios fotográficos, programa de parceiros, B2B recorrente, barter/PR, carrinho/configurador/busca, consolidação de engines de animação, separar videokês em SKUs, 6-8 páginas de cidade.

**Teste de realidade final:** se em 30 dias o site tiver prefill + tracking + zero números falsos + hero visível em 4G, o trimestre já se pagou. Todo o resto é upside.
