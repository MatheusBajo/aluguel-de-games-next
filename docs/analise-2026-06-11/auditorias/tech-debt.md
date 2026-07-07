# Dívida Técnica — Aluguel de Games (auditoria 2026-06-11)

Projeto: /Users/matheusbajo/Projetos/WebstormProjects/aluguel-de-games-next
Next.js 15.3.3, React 19, Tailwind 4, `output: 'export'` (next.config.ts:6), deploy estático Hostinger.

---

## 1. CRÍTICO — Controle de versão efetivamente inexistente (risco de perda total)

**Evidências:**
- `git log` em `main`: "fatal: your current branch 'main' does not have any commits yet". TODO o código está untracked.
- O `.git/` (316MB) está **corrompido**: existem refs (`.git/refs/heads/backup-estavel`, `codex-testes`, `refs/remotes/origin/backup-estavel`) mas `git cat-file -t` falha para os 3 hashes — os objetos commit não existem.
- Causa raiz visível em `.git/objects/pack/`: só sobraram arquivos `.idx`, `.rev` e `.mtimes` — **os `.pack` (que contêm a história de fato) não foram copiados** na migração Windows→Mac.
- Reflog (`.git/logs/HEAD`, 3 linhas) confirma: último commit "Snapshot final antes de descontinuar - migração pro Mac" (timestamp 1779615617 ≈ 24/05/2026), feito na máquina antiga em branch `snapshot-pre-mac-2026`, depois checkout para `main`. Nada disso é recuperável localmente.
- `git fsck`: "invalid sha1 pointer" para as 3 branches, "HEAD points to an unborn branch (main)", reflog entries inválidas.
- `git remote -v`: **vazio** — não há remote configurado (a ref origin/backup-estavel é fantasma).
- `aluguel-de-games-next.git/` na raiz do projeto: tentativa de bare repo de backup com `objects/` e `refs/` **vazios** (criado 24/05, abortado).
- `.git/lfs` tem 286MB de objetos LFS órfãos (`.gitattributes` roteia *.png/*.jpg/*.webp/*.mp4 para LFS).

**Impacto:** uma falha de disco, ransomware ou `rm` errado = perda total do código-fonte. O que existe na Hostinger é só o HTML buildado (out/), não recupera componentes React, scripts, configs. Não há histórico para bisect/rollback; qualquer regressão é irreversível.

**Ação:** (1) hoje: commit inicial em `main` + remote privado (GitHub) + push. (2) Decidir LFS: ou instalar git-lfs e manter `.gitattributes`, ou remover as regras LFS antes do 1º commit (senão `git add` de imagens falha/quebra). (3) Apagar `aluguel-de-games-next.git/` vazio e as refs dangling (`git update-ref -d`).

## 2. CRÍTICO — Catálogo (dado de negócio) excluído do versionamento

- `.gitignore` linha `/public/Organizado/` — o catálogo inteiro (543MB: todos os produtos, `metadata.json` com títulos/descrições/ordem, todas as imagens) fica fora do git **mesmo depois de commitar**.
- `public/` total: 591MB. O catálogo É o produto do site (CLAUDE.md: "File-based catalog system using metadata.json files in public/Organizado/").
- Não há backup automatizado visível (sem script de backup, sem rclone/restic, bare repo vazio).
- Os `metadata.json` são editados à mão/por scripts — sem histórico, um script com bug (ex.: scripts/fix-order.ts reescreve `ordem` em todos os category.json) corrompe tudo sem undo.

**Ação:** repo separado com git-lfs para Organizado/, ou backup versionado (restic/Backblaze). No mínimo: separar os JSONs (leves, críticos) das imagens no esquema de backup.

## 3. ALTO — Credenciais em texto plano em ADMIN.md (raiz do projeto)

- ADMIN.md linhas 5-9: usuário `admin`, senha `admin36925027` hardcoded, documentando painel `/admin/login` e rotas `/api/admin/*` que **não existem mais** (não há `src/app/admin` nem `src/app/api` — `ls src/app` confirma).
- Risco real: senha com padrão pessoal pode estar reutilizada (Hostinger, e-mail, Sanity). Se o repo for publicado no GitHub (passo 1 acima!), a credencial vaza.
- ADMIN.md também documenta arquitetura de metadata.json divergente da atual (campos preco_diaria, destaque etc. — comparar com src/lib/admin.server.ts:8-13 que usa titulo/descricao/ordem/imagens).

**Ação:** deletar ADMIN.md (ou reescrever sem credenciais) ANTES do primeiro commit; trocar a senha onde quer que ela seja usada de verdade.

## 4. MÉDIO — ~16 dependências mortas no package.json (1.1GB node_modules)

Nenhum import em `src/` ou `scripts/` para:
- **Stack Sanity no app principal**: `sanity` (21MB), `next-sanity` (8.6MB), `@sanity/vision`, `@sanity/image-url` (~80MB total em node_modules/@sanity+sanity). Zero uso: `grep -r "sanity" src/` vazio. O studio/ tem package.json PRÓPRIO (studio/package.json) com sanity v3 — as deps da raiz (v5!) são resquício.
- **Drag & drop duplicado e morto**: `react-dnd`, `react-dnd-html5-backend`, `@dnd-kit/core`, `@dnd-kit/sortable` — eram do painel admin removido.
- `styled-components` (2.6MB), `color-thief-react` (o usado é `colorthief` — DynamicGradient.tsx:35), `phosphor-icons` (legado; o usado é `@phosphor-icons/react`), `react-dropzone` + `@types/react-dropzone`, `react-confetti`, `slugify` (slug-utils.ts implementa o próprio), `sharp` (com `unoptimized: true` em next.config.ts:8 o Next nem otimiza imagem).
- `sonner` semi-morto: src/components/ui/sonner.tsx existe mas `<Toaster/>` nunca é montado e `toast()` nunca é chamado.
- Radix mortos (importados só por componentes ui/ mortos, ver §5): `@radix-ui/react-alert-dialog`, `react-select`, `react-scroll-area`, `react-switch`, `react-tabs`, `react-label`, `react-navigation-menu`.
- `postcss` em dependencies (deveria ser devDependency).

**Impacto:** install lento, superfície de CVE maior, `npm audit` ruidoso, confusão sobre o que o site realmente usa. Não afeta bundle do cliente (tree-shaken), afeta DX e segurança da cadeia.

## 5. MÉDIO — ~20 arquivos mortos em src/ (incl. armadilha de nomenclatura "antigo")

**Armadilha real:** os componentes com sufixo `-antigo` são os VIVOS; os "novos" estão mortos:
- `src/components/ui/card-antigo.tsx` → usado por StartCarousel.tsx:5 (carrossel da home, caminho mais quente do site). `src/components/ui/card.tsx` → **0 imports, morto**.
- `src/components/ui/dialog-antigo.tsx` → usado por CarouselModal.tsx:7 (modal de produto TopToys). `src/components/ui/dialog.tsx` → **0 imports, morto**.
- Quem for "modernizar" e editar card.tsx/dialog.tsx não muda nada no site — perda de tempo garantida.

**Duplicata de carrossel:** `StartCarouselClaude.tsx` (236 linhas) é cópia experimental morta; o usado é `StartCarousel.tsx` via HomeShell.tsx:1,7.

**Mortos confirmados (0 imports externos):**
- src/components/StartCarouselClaude.tsx
- src/components/ui/: card.tsx, dialog.tsx, alert-dialog.tsx, select.tsx, switch.tsx, tabs.tsx, scroll-area.tsx, label.tsx, input.tsx, textarea.tsx, navigation-menu.tsx, sonner.tsx
- src/components/mode-toggle.tsx (tema escuro é forçado; toggle nunca montado)
- src/components/catalogo/CatalogoList.tsx e CatalogPreview.tsx (o vivo é CatalogList.server.tsx)
- src/app/catalogo/CatalogGrouped.server.tsx (só auto-referência)
- src/lib/admin.server.ts (97 linhas, CRUD de produto do admin removido — usa fs.writeFile; inofensivo em export estático pois nenhuma rota o importa, mas é peso morto enganoso)
- src/lib/session-store.ts (Map de sessões em memória do admin removido — em static export não roda nunca; **não expõe nada em runtime**, é só código morto)
- src/lib/catalog-tree.server.ts e src/lib/catalog-categories.ts (0 imports)
- src/components/hooks/useKeyboardShortcuts.ts, src/components/util/StarRating.tsx

**Vivos (não remover):** card-antigo, dialog-antigo, carousel.tsx (CarouselModal.tsx:8), carousel-landing.tsx, badge.tsx, button.tsx, AnimatedCarouselText, FlyingEmojis, useModalHistory (TopToys.tsx:50), colorthief.

## 6. MÉDIO — Qualidade sem rede de proteção: lint desligado no build, typecheck falhando, zero testes

- next.config.ts:11-13: `eslint.ignoreDuringBuilds: true`. `npx next lint` hoje: **15 erros + 16 warnings** (8x no-explicit-any em gtm-utils.ts/catalog.server.ts/AnimatedHeadline.tsx; unused-vars em catalog-tree.server.ts:48,58; vários `<img>` sem otimização em CarouselModal.tsx:103, Demonstra.tsx:186 etc.).
- `npx tsc --noEmit` **FALHA com 6 erros em componentes VIVOS**: DynamicGradient.tsx:35 e CarouselOverlayGradient.tsx:53 — `new ColorThief()` "expression is not constructable" (types do colorthief resolvendo para o entry node) + 3 implicit any em DynamicGradient.tsx:49. Ou seja: o IDE/CI vermelho é estado "normal" do projeto, o que treina o dev a ignorar erro real.
- tsconfig.json:24 `include: ["**/*.ts", "**/*.tsx"]` sem excluir `studio/` e `scripts/` — o typecheck do app engloba o studio Sanity (react 18 types) e scripts soltos.
- **Zero testes** (CLAUDE.md admite: "No automated tests currently implemented"). O funil de conversão inteiro (links WhatsApp gerados em client-side, modal de produto, formulário Web3Forms em ContactForm.tsx) não tem nem smoke test. Uma regressão silenciosa no botão de WhatsApp = zero leads até alguém notar manualmente.
- Sem CI de nenhum tipo (sem .github/).

## 7. MÉDIO-BAIXO — Lixo de desenvolvimento servido em produção (public/)

Tudo em `public/` vai para o `out/` e fica acessível por URL (testado no dev server, HTTP 200):
- `public/gerar.py` — pipeline de compressão WebP/H.264 do catálogo (ferramenta de negócio crítica morando na pasta de deploy!)
- `public/generate_tree.py`, `public/Organizado_tree.txt`
- `public/middleware.ts` — middleware Next inteiro (não funciona em static export E está em public/, ou seja, é só um arquivo servido que expõe a lógica de headers/redirects pretendida)
- `.DS_Store` em várias pastas (vão para o deploy se não excluídos)
Impacto: profissionalismo/enumeração de estrutura interna; gerar.py e generate_tree.py deviam estar em `scripts/` e versionados.

## 8. BAIXO — studio/ Sanity: migração de CMS abandonada (decisão pendente)

- `studio/` completo: sanity.config.ts (projectId "2fhr4hm5", dataset production), schemaTypes/ (categoria.ts, produto.ts, siteConfig.ts), structure.ts, package-lock de 551KB — mas **o site não lê NADA do Sanity** (zero imports em src/).
- studio/package.json usa sanity v3 + react 18; raiz tem sanity v5 + react 19 — nem entre si são consistentes.
- É um segundo "admin" abandonado (o primeiro foi o painel /admin documentado em ADMIN.md). Dois sistemas de gestão de catálogo mortos, e a gestão real continua sendo editar metadata.json na mão.
- Decisão a tomar: ou completar a migração para Sanity (resolveria a dívida do catálogo-no-filesystem), ou apagar studio/ + deps sanity da raiz.

## 9. BAIXO — Documentação mentirosa e lixo na raiz

- CLAUDE.md (instruções para IA!) afirma: "Drag & Drop: @dnd-kit for admin interfaces" (não há admin), "Forms: React Hook Form patterns" (react-hook-form **nem está instalado** — ContactForm.tsx usa useState puro), "Sharp for optimization" (sharp não é usado). IA orientada por doc falsa gera código errado.
- ADMIN.md: documenta painel inexistente + credenciais (§3).
- TEST-404.md: instruções de teste manual de set/2025, menciona `not-found-instant.tsx.example` que não existe.
- README.md: **0 bytes**.
- patch-backup-lint.diff: **0 bytes** (lixo na raiz).
- `nul`: artefato de comando Windows mal-redirecionado (conteúdo: "move: command not found"); já está no .gitignore com comentário admitindo o acidente.
- tsconfig.tsbuildinfo de 448KB (abril) na raiz; .MERGE_MSG.swp (vim swap, jun/2025) dentro de .git/; .idea/ e .playwright-mcp/ untracked.

## 10. BAIXO — Duplicação de geração de sitemap

- `src/app/sitemap.ts` (rota App Router, gera /sitemap.xml no build) E `next-sitemap` no postbuild (next-sitemap.config.js) com `outDir: 'public'` — escreve sitemap.xml em public/, que só entra no out/ do **próximo** build (staleness de 1 build) e conflita com o gerado pelo App Router. Dois sistemas mantidos para o mesmo artefato; prioridades/changefreq divergem entre eles.

## 11. BAIXO — Footguns operacionais

- package.json: `predev` e `prebuild` fazem `rmSync('.next')` — rodar `npm run build` com o dev server aberto mata o dev server (corrupção de .next em uso).
- ContactForm.tsx:8: `WEB3FORMS_ACCESS_KEY` hardcoded no client. Para Web3Forms a chave é pública por design, mas hardcoded + sem rate-limit próprio = spam fácil no e-mail de leads; ao menos mover para env var e ativar proteção anti-spam do serviço (hCaptcha do Web3Forms).
- .env.local contém só NEXT_PUBLIC_SITE_URL e NEXT_PUBLIC_GTM_ID (sem segredos) mas está no .gitignore (`.env*`) — num clone novo o build pode sair com URL/GTM errados silenciosamente; documentar num `.env.example`.

---

## Priorização sugerida (esforço × risco)

1. **HOJE (30 min):** deletar/limpar ADMIN.md → `git add -A && git commit` → criar repo privado GitHub → push. Resolver LFS (remover .gitattributes ou instalar git-lfs). [mata o risco existencial]
2. **Esta semana:** backup automatizado de public/Organizado (repo LFS separado ou restic agendado); mover gerar.py/generate_tree.py para scripts/; remover middleware.ts/Organizado_tree.txt de public/.
3. **Próxima sprint:** `npm uninstall` das ~16 deps mortas; deletar os ~20 arquivos mortos; renomear card-antigo→card / dialog-antigo→dialog; corrigir os 15 erros de lint e os 6 de tsc; reativar `ignoreDuringBuilds: false`; CI GitHub Actions (lint + tsc + build).
4. **Backlog:** decidir Sanity (completar ou apagar studio/); unificar sitemap num só gerador; smoke tests de conversão (link WhatsApp renderiza com número certo em produto/home/footer).
