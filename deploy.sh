#!/usr/bin/env bash
# =============================================================================
# deploy.sh — Aluguel de Games → Hostinger
# =============================================================================
# Build do Next.js (static export) + upload incremental pra Hostinger.
#
#   ./deploy.sh              # DRY-RUN: mostra o que mudaria, não sobe nada
#   ./deploy.sh --go         # sobe de verdade
#   ./deploy.sh --go --prune # sobe E apaga do servidor o que não existe mais
#   ./deploy.sh --skip-build # usa o out/ que já existe, não rebuilda
#   ./deploy.sh --verify     # só testa as URLs em produção, não sobe nada
#
# Config em .env.deploy (fora do git). Senha de FTP fica no Keychain do macOS,
# nunca em arquivo. Ver .env.deploy.example.
# =============================================================================

set -euo pipefail

cd "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

RED=$'\033[0;31m'; GRN=$'\033[0;32m'; YEL=$'\033[0;33m'; BLU=$'\033[0;34m'; DIM=$'\033[2m'; NC=$'\033[0m'
say()  { printf "%s\n" "$*"; }
step() { printf "\n${BLU}▸ %s${NC}\n" "$*"; }
ok()   { printf "  ${GRN}✓${NC} %s\n" "$*"; }
warn() { printf "  ${YEL}!${NC} %s\n" "$*"; }
die()  { printf "\n${RED}✗ %s${NC}\n\n" "$*" >&2; exit 1; }

# ---------------------------------------------------------------- flags -----
GO=0; PRUNE=0; SKIP_BUILD=0; VERIFY_ONLY=0
for a in "$@"; do case "$a" in
  --go)         GO=1 ;;
  --prune)      PRUNE=1 ;;
  --skip-build) SKIP_BUILD=1 ;;
  --verify)     VERIFY_ONLY=1 ;;
  -h|--help)    sed -n '2,20p' "$0"; exit 0 ;;
  *)            die "flag desconhecida: $a" ;;
esac; done

# ---------------------------------------------------------------- config ----
[[ -f .env.deploy ]] || die "falta o .env.deploy — copie de .env.deploy.example e preencha"
# shellcheck disable=SC1091
source .env.deploy

: "${METHOD:?defina METHOD=ssh ou METHOD=ftp no .env.deploy}"
: "${REMOTE_DIR:?defina REMOTE_DIR no .env.deploy}"
SITE_URL="${SITE_URL:-https://www.alugueldegames.com.br}"
OUT_DIR="out"

# ------------------------------------------------------- verificação pós ----
# URLs que TÊM que responder 200 depois do deploy. Se alguma falhar, o deploy
# quebrou algo — e você fica sabendo na hora, não pelo pai ligando.
VERIFY_URLS=(
  "/"
  "/catalogo/"
  "/catalogo/jogos-eletronicos/"
  "/catalogo/jogos-eletronicos/consoles/playstation/playstation-5/"
  "/catalogo/jogos-eletronicos/fliperamas/fliperama-11000/"
  "/catalogo/jogos-eletronicos/maquinas/maquina-de-ursinho-toy-mix/"
  "/catalogo/videokes/karaokes/"
  "/catalogo/realidade-virtual/oculus-quest-2/"
  "/catalogo/jogos-de-mesa/pebolim/"
  "/sitemap.xml"
  "/robots.txt"
)

verificar() {
  step "Verificando produção ($SITE_URL)"
  local falhou=0 code
  for u in "${VERIFY_URLS[@]}"; do
    code=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 20 "$SITE_URL$u" || echo "000")
    if [[ "$code" == "200" ]]; then
      printf "  ${GRN}%s${NC}  %s\n" "$code" "$u"
    else
      printf "  ${RED}%s${NC}  %s\n" "$code" "$u"
      falhou=$((falhou+1))
    fi
  done
  # canônico: apex tem que redirecionar 301 pra www
  local apex; apex="${SITE_URL/https:\/\/www./https://}"
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 20 "$apex/" || echo "000")
  if [[ "$code" == "301" ]]; then ok "apex → www dá 301 (canônico certo)"
  else warn "apex responde $code (esperado 301). O .htaccess subiu?"; fi

  if (( falhou > 0 )); then die "$falhou URL(s) quebrada(s) em produção"; fi
  ok "todas as ${#VERIFY_URLS[@]} URLs respondendo 200"
}

if (( VERIFY_ONLY )); then verificar; exit 0; fi

# ---------------------------------------------------------------- build -----
if (( SKIP_BUILD )); then
  step "Build pulado (--skip-build), usando o out/ que já existe"
  [[ -d "$OUT_DIR" ]] || die "não existe $OUT_DIR/ — rode sem --skip-build"
else
  step "Build (next build + next-sitemap)"
  npm run build
  ok "build verde"
fi

# ------------------------------------------------- sanity check do out/ -----
# Trava de segurança: se o build saiu pela metade, NÃO deixa subir. Foi
# exatamente isso que deixou /sobre/ e /contato/ em 404 no ar por meses.
step "Conferindo o out/ antes de subir"
[[ -f "$OUT_DIR/index.html"  ]] || die "$OUT_DIR/index.html não existe — build incompleto"
[[ -f "$OUT_DIR/.htaccess"   ]] || die "$OUT_DIR/.htaccess não existe — sem ele o site perde redirect www, 404 custom e cache"
[[ -f "$OUT_DIR/sitemap.xml" ]] || die "$OUT_DIR/sitemap.xml não existe — o next-sitemap não rodou"
[[ -f "$OUT_DIR/robots.txt"  ]] || die "$OUT_DIR/robots.txt não existe"
[[ -f "$OUT_DIR/404/index.html" ]] || die "$OUT_DIR/404/index.html não existe — o ErrorDocument do .htaccess vai apontar pro vazio"

PAGINAS=$(find "$OUT_DIR" -name "index.html" | wc -l | tr -d ' ')
ARQUIVOS=$(find "$OUT_DIR" -type f | wc -l | tr -d ' ')
(( PAGINAS >= 65 )) || die "só $PAGINAS páginas HTML no out/ (esperado 65+) — build saiu pela metade"

# toda página do menu tem que existir em disco antes de subir
for p in catalogo 404; do
  [[ -f "$OUT_DIR/$p/index.html" ]] || die "falta $OUT_DIR/$p/index.html — o menu vai linkar pra 404"
done

# o sitemap não pode listar URL que não existe em disco (o bug atual de produção)
FANTASMA=0
while IFS= read -r loc; do
  path="${loc#*alugueldegames.com.br}"; path="${path%/}"
  [[ -z "$path" ]] && continue
  if [[ ! -f "$OUT_DIR$path/index.html" && ! -f "$OUT_DIR$path" ]]; then
    warn "sitemap lista URL que não existe no build: $path"; FANTASMA=$((FANTASMA+1))
  fi
done < <(grep -o '<loc>[^<]*</loc>' "$OUT_DIR/sitemap.xml" | sed 's/<[^>]*>//g')
(( FANTASMA == 0 )) || die "$FANTASMA URL(s) fantasma no sitemap — é isso que hoje mata 55 URLs no Google"

ok "$PAGINAS páginas HTML · $ARQUIVOS arquivos · $(du -sh "$OUT_DIR" | cut -f1)"
ok ".htaccess, sitemap.xml, robots.txt e 404 presentes"
ok "sitemap bate 1-pra-1 com os arquivos em disco"

# ---------------------------------------------------------------- upload ----
MODO=$( (( GO )) && echo "SUBINDO DE VERDADE" || echo "DRY-RUN (nada é enviado)" )
step "Upload via ${METHOD^^} — $MODO"
(( PRUNE )) && warn "--prune ligado: arquivos que não existem no out/ serão APAGADOS do servidor"

case "$METHOD" in
# ---------------------------------------------------------------------- SSH -
ssh)
  : "${SSH_HOST:?}"; : "${SSH_USER:?}"; SSH_PORT="${SSH_PORT:-65002}"
  RSYNC_FLAGS=(-az --human-readable --info=stats2 --no-perms --no-owner --no-group
               --exclude '.DS_Store' --exclude '*.map')
  (( GO ))    || RSYNC_FLAGS+=(--dry-run --itemize-changes)
  (( PRUNE )) && RSYNC_FLAGS+=(--delete --delete-after)

  # Ordem importa: assets primeiro, HTML por último. Assim nenhum visitante
  # pega um HTML novo apontando pra um JS/imagem que ainda não subiu.
  say "${DIM}  1/2 assets (imagens, js, css, fontes)${NC}"
  rsync "${RSYNC_FLAGS[@]}" -e "ssh -p $SSH_PORT" \
    --exclude '*.html' --exclude 'sitemap.xml' --exclude 'robots.txt' \
    "$OUT_DIR/" "$SSH_USER@$SSH_HOST:$REMOTE_DIR/"

  say "${DIM}  2/2 HTML + .htaccess + sitemap${NC}"
  rsync "${RSYNC_FLAGS[@]}" -e "ssh -p $SSH_PORT" \
    "$OUT_DIR/" "$SSH_USER@$SSH_HOST:$REMOTE_DIR/"
  ;;
# ---------------------------------------------------------------------- FTP -
ftp)
  command -v lftp >/dev/null || die "lftp não instalado. Rode: brew install lftp"
  : "${FTP_HOST:?}"; : "${FTP_USER:?}"; : "${FTP_KEYCHAIN_ITEM:?}"
  # senha sai do Keychain do macOS, nunca de arquivo
  FTP_PASS=$(security find-generic-password -s "$FTP_KEYCHAIN_ITEM" -a "$FTP_USER" -w 2>/dev/null) \
    || die "senha não encontrada no Keychain. Rode:
    security add-generic-password -s '$FTP_KEYCHAIN_ITEM' -a '$FTP_USER' -w"

  MIRROR_FLAGS="--reverse --only-newer --parallel=4 --exclude-glob .DS_Store --exclude-glob *.map"
  (( GO ))    || MIRROR_FLAGS="$MIRROR_FLAGS --dry-run"
  (( PRUNE )) && MIRROR_FLAGS="$MIRROR_FLAGS --delete"

  LFTP_PASS="$FTP_PASS" lftp -c "
    set ftp:ssl-force true; set ssl:verify-certificate no; set cmd:fail-exit true;
    open -u '$FTP_USER',\"\$LFTP_PASS\" '$FTP_HOST';
    mirror $MIRROR_FLAGS --exclude-glob *.html --exclude-glob sitemap.xml '$OUT_DIR' '$REMOTE_DIR';
    mirror $MIRROR_FLAGS '$OUT_DIR' '$REMOTE_DIR';
  "
  ;;
*) die "METHOD inválido: '$METHOD' (use ssh ou ftp)" ;;
esac

if (( ! GO )); then
  printf "\n${YEL}Isso foi um DRY-RUN. Nada subiu.${NC}\n"
  printf "Se a lista acima tá certa, rode:  ${GRN}./deploy.sh --go${NC}\n\n"
  exit 0
fi

ok "upload concluído"
sleep 5   # dá um tempo pro cache do LiteSpeed
verificar

printf "\n${GRN}Deploy no ar.${NC} Próximo passo: reenviar o sitemap no Search Console\n"
printf "${DIM}  https://search.google.com/search-console → Sitemaps → $SITE_URL/sitemap.xml${NC}\n\n"
