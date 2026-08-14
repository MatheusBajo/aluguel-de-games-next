#!/usr/bin/env bash
# =============================================================================
# publicar.sh — um comando só: build, confere, sobe pro GitHub e publica
# =============================================================================
#
#   bash publicar.sh            # ENSAIO: faz tudo, mas não escreve no servidor
#   bash publicar.sh --publicar # publica de verdade (pede confirmação)
#
# É retomável: se o push cair no meio, roda de novo que ele continua de onde
# parou. Nada é enviado pro servidor antes de TODAS as verificações passarem.
#
# (rodar com `bash`, nunca colar no terminal: o zsh interativo faz expansão de
#  histórico com "!" e corrompe comando colado.)
# =============================================================================

set -uo pipefail
cd "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

V=$'\033[0;32m'; R=$'\033[0;31m'; A=$'\033[0;33m'; Z=$'\033[0;34m'; D=$'\033[2m'; N=$'\033[0m'
etapa() { printf "\n${Z}▸ %s${N}\n" "$*"; }
ok()    { printf "  ${V}ok${N}  %s\n" "$*"; }
morre() { printf "\n${R}✗ %s${N}\n\n" "$*" >&2; exit 1; }

PUBLICAR=0
for a in "$@"; do
  case "$a" in
    --publicar) PUBLICAR=1 ;;
    -h|--help) sed -n '2,14p' "$0"; exit 0 ;;
    *) morre "flag desconhecida: $a" ;;
  esac
done

MODO=$( ((PUBLICAR)) && echo "PUBLICAR DE VERDADE" || echo "ENSAIO (não escreve no servidor)" )
printf "\n${Z}════ %s ════${N}\n" "$MODO"

# ── 0. pré-requisitos ────────────────────────────────────────────────────────
command -v gh >/dev/null || morre "o gh não está instalado"
gh auth status >/dev/null 2>&1 || morre "o gh não está logado. Rode: gh auth login"
[ -z "$(git status --porcelain -- src public .github 2>/dev/null)" ] || {
  printf "\n${A}Você tem alteração não commitada:${N}\n"
  git status --short -- src public .github | head -10 | sed 's/^/    /'
  morre "commite antes de publicar (ou use git stash)"
}

# ── 1. build ─────────────────────────────────────────────────────────────────
etapa "1/5  Buildando"
rm -rf .next
npm run build > /tmp/publicar-build.log 2>&1 || {
  tail -25 /tmp/publicar-build.log; morre "o build falhou (log em /tmp/publicar-build.log)"
}
ok "$(find out -name index.html | wc -l | tr -d ' ') páginas · $(du -sh out | cut -f1)"

# ── 2. verificações locais ───────────────────────────────────────────────────
# São as MESMAS do pipeline. Rodam aqui primeiro pra você descobrir problema em
# 10 segundos, em vez de esperar 3 minutos o CI reprovar.
etapa "2/5  Conferindo o build"

node scripts/checar-arquivos-versionados.mjs >/dev/null 2>&1 || {
  node scripts/checar-arquivos-versionados.mjs
  morre "tem arquivo que o site usa e não está no git — o CI não conseguiria buildar"
}
ok "todo arquivo usado está versionado"

# extrai as travas do próprio workflow, pra nunca divergirem
node -e "
const y=require('js-yaml'),fs=require('fs');
const d=y.load(fs.readFileSync('.github/workflows/deploy.yml','utf8'));
const s=d.jobs['build-e-deploy'].steps.find(x=>x.name&&x.name.includes('Conferir o build'));
fs.writeFileSync('/tmp/publicar-travas.sh',s.run);
" 2>/dev/null || morre "não consegui ler as travas do workflow"

if ! bash /tmp/publicar-travas.sh > /tmp/publicar-travas.log 2>&1; then
  grep -vE '^::(end)?group|^\s*$' /tmp/publicar-travas.log | tail -20 | sed 's/^/    /'
  morre "as travas reprovaram. NADA foi enviado."
fi
ok "sitemap, imagens, telefone, páginas vazias e cabeçalhos"

# ── 3. GitHub ────────────────────────────────────────────────────────────────
etapa "3/5  Subindo pro GitHub"
git fetch origin main --quiet 2>/dev/null
COMMITS=$(git rev-list --reverse origin/main..main)
TOTAL=$(printf "%s" "$COMMITS" | grep -c . || true)

if [ "$TOTAL" -eq 0 ]; then
  ok "já estava em dia"
else
  # um commit por vez: o push inteiro de uma vez dá HTTP 408 daqui do Japão
  I=0
  for C in $COMMITS; do
    I=$((I+1))
    printf "  ${D}[%s/%s]${N} %s\n" "$I" "$TOTAL" "$(git log -1 --format='%h %s' "$C" | cut -c1-56)"
    git push --quiet origin "+${C}:refs/heads/main" || {
      printf "\n  ${A}o push caiu neste commit. Rode de novo que ele continua daqui.${N}\n\n"
      exit 1
    }
  done
  ok "$TOTAL commit(s) no GitHub"
fi

# ── 4. confirmação ───────────────────────────────────────────────────────────
if ((PUBLICAR)); then
  printf "\n${A}Isto vai trocar o site no ar (alugueldegames.com.br).${N}\n"
  printf "Digite ${V}publicar${N} pra confirmar: "
  read -r RESP
  [ "$RESP" = "publicar" ] || morre "cancelado. Nada foi enviado pro servidor."
fi

# ── 5. deploy ────────────────────────────────────────────────────────────────
etapa "4/5  Disparando o pipeline"
DRY=$( ((PUBLICAR)) && echo false || echo true )
gh workflow run deploy.yml --ref main -f dry_run="$DRY" >/dev/null || morre "não consegui disparar o workflow"
sleep 8
RUN=$(gh run list --workflow=deploy.yml --limit 1 --json databaseId --jq '.[0].databaseId')
ok "run $RUN · https://github.com/MatheusBajo/aluguel-de-games-next/actions/runs/$RUN"

etapa "5/5  Acompanhando"
while :; do
  EST=$(gh run view "$RUN" --json status,conclusion --jq '"\(.status)|\(.conclusion // "")"' 2>/dev/null)
  [ "${EST%%|*}" = "completed" ] && break
  printf "  ${D}%s  %s${N}\n" "$(date +%H:%M:%S)" "${EST%%|*}"
  sleep 15
done
CONC="${EST##*|}"
gh run view "$RUN" --json jobs --jq '.jobs[0].steps[] | "  \(.conclusion // .status | sub("success";"ok") | sub("skipped";"--")) \(.name)"' 2>/dev/null | head -9

if [ "$CONC" != "success" ]; then
  printf "\n${R}✗ falhou.${N} Log do que reprovou:\n\n"
  gh run view "$RUN" --log-failed 2>/dev/null | tail -20 | sed 's/^/    /'
  printf "\n  ${D}Se reprovou ANTES do upload, o site no ar não foi tocado.${N}\n\n"
  exit 1
fi

if ((PUBLICAR)); then
  printf "\n${V}════ NO AR ════${N}\n"
  printf "  https://www.alugueldegames.com.br\n"
  printf "  ${D}o próprio pipeline já conferiu as URLs em produção${N}\n\n"
else
  printf "\n${V}════ ENSAIO OK ════${N}\n"
  printf "  Nada foi escrito no servidor. Pra publicar de verdade:\n"
  printf "  ${V}bash publicar.sh --publicar${N}\n\n"
fi
