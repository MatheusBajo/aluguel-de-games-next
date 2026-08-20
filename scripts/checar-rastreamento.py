#!/usr/bin/env python3
"""
Confere que o Google Tag Manager está vivo no HTML gerado.

POR QUE ESTE ARQUIVO EXISTE
De 13 a 20/08/2026 o site ficou SETE DIAS sem rastreamento nenhum, e o build
passou verde o tempo todo. O ID do container vinha de NEXT_PUBLIC_GTM_ID, que
só existia no .env.local da máquina do dev. No GitHub Actions a variável não
existia, e o Next escreveu a string literal "undefined" na página:

    https://www.googletagmanager.com/ns.html?id=undefined
    https://www.googletagmanager.com/gtm.js?id=

Sem container, o GA4 e a tag de conversão do Google Ads morrem junto. As
campanhas do dono ficaram sem nenhuma conversão registrada e ele só percebeu
pelo desempenho caindo.

O QUE DÁ PRA CONFERIR, E O QUE NÃO DÁ
O HTML tem duas referências ao GTM, e elas são diferentes:

  1. <iframe src=".../ns.html?id=GTM-XXXXXXX">  (dentro do <noscript>)
     Esta tem o ID LITERAL. É a que dá pra verificar.

  2. j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl
     Esta NÃO tem o ID: ele entra pela variável `i` do bootstrap. Procurar o
     ID aqui sempre acha string vazia — foi o falso positivo que derrubou a
     primeira versão desta checagem. O ID literal do bootstrap está no último
     argumento da IIFE: ...,'script','dataLayer','GTM-XXXXXXX')

Uso:  python3 scripts/checar-rastreamento.py [pasta_do_build]
Sai com 0 se está tudo certo, 1 se achou problema.
"""
import glob
import os
import re
import sys

PADRAO_ID = re.compile(r"^GTM-[A-Z0-9]{6,}$")

# o iframe do <noscript>, que carrega o ID literal
RE_IFRAME = re.compile(r"googletagmanager\.com/ns\.html\?id=([^\"'&<\s\\]*)")

# o último argumento da IIFE do bootstrap: ...,'dataLayer','GTM-XXXX')
RE_BOOTSTRAP = re.compile(r"'dataLayer'\s*,\s*'([^']*)'")


def checar(pasta="out"):
    paginas = sorted(glob.glob(os.path.join(pasta, "**", "index.html"), recursive=True))
    if not paginas:
        print(f"ERRO: nenhuma página encontrada em {pasta}/")
        return 1

    problemas = []
    for f in paginas:
        with open(f, encoding="utf-8", errors="ignore") as fh:
            h = fh.read()

        achou_algum = False

        for m in RE_IFRAME.finditer(h):
            achou_algum = True
            i = m.group(1)
            if not PADRAO_ID.match(i):
                problemas.append((f, f"iframe do noscript com container inválido: {i!r}"))

        for m in RE_BOOTSTRAP.finditer(h):
            achou_algum = True
            i = m.group(1)
            if not PADRAO_ID.match(i):
                problemas.append((f, f"bootstrap do GTM com container inválido: {i!r}"))

        if not achou_algum:
            problemas.append((f, "nenhuma referência ao GTM na página"))

    print(f"{len(paginas)} páginas verificadas, {len(problemas)} com problema")
    for f, e in problemas[:12]:
        print(f"   {f}: {e}")
    if len(problemas) > 12:
        print(f"   ... e mais {len(problemas) - 12}")

    if problemas:
        print("")
        print("O site subiria SEM RASTREAMENTO. Foi exatamente isso que deixou as")
        print("campanhas do Google Ads sem conversão de 13 a 20/08/2026.")
        print("Confira src/config/analytics.config.ts")
        return 1

    ids = set()
    for f in paginas[:5]:
        with open(f, encoding="utf-8", errors="ignore") as fh:
            ids.update(RE_IFRAME.findall(fh.read()))
    print(f"container ativo: {', '.join(sorted(ids)) or '(?)'}")
    return 0


if __name__ == "__main__":
    sys.exit(checar(sys.argv[1] if len(sys.argv) > 1 else "out"))
