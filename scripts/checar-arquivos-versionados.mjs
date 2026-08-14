#!/usr/bin/env node
/**
 * Confere se TODO arquivo de public/ que o site referencia está versionado no git.
 *
 * Por que existe: em 14/ago/2026 o ensaio do deploy reprovou no GitHub Actions
 * com "2 imagens quebradas", enquanto aqui na máquina passava. Motivo: a regra
 * `*.mp4` no .gitignore deixava os vídeos da home de fora do repositório. O
 * arquivo existia no MEU disco, então meu teste passava; o CI clona só o que
 * está no git, então lá o HTML apontava pra vídeo inexistente.
 *
 * Essa é a classe de bug que testar localmente NUNCA pega: o teste local
 * enxerga o disco, o CI enxerga o commit. Este script fecha essa brecha.
 *
 * Uso:  node scripts/checar-arquivos-versionados.mjs
 *       (rode DEPOIS do build, antes de dar push)
 */

import { execSync } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'
import { globSync } from 'node:fs'
import path from 'node:path'

const OUT = 'out'

if (!existsSync(OUT)) {
    console.error(`\n  Não existe ${OUT}/. Rode "npm run build" antes.\n`)
    process.exit(2)
}

// tudo que o git conhece, normalizado (o macOS devolve nome em NFD)
const versionados = new Set(
    execSync('git ls-files -z', { maxBuffer: 512 * 1024 * 1024 })
        .toString()
        .split('\0')
        .filter(Boolean)
        .map((p) => p.normalize('NFC'))
)

const paginas = globSync(`${OUT}/**/index.html`)
const referencias = new Set()

for (const pag of paginas) {
    const html = readFileSync(pag, 'utf8')
    const re = /(?:src|href)="(\/[^"?#]+\.(?:webp|jpg|jpeg|png|gif|svg|mp4|mov|webm|ico|woff2?))"/g
    let m
    while ((m = re.exec(html)) !== null) {
        // desfaz o escape de HTML (&amp;) e o percent-encoding da URL
        const url = decodeURIComponent(m[1].replace(/&amp;/g, '&'))
        if (url.startsWith('/_next/')) continue // gerado no build, não versionado
        referencias.add(url)
    }
}

const faltando = []
for (const url of referencias) {
    // no repositório o arquivo vive em public/<url>
    const noRepo = path.posix.join('public', url.replace(/^\//, '')).normalize('NFC')
    if (!versionados.has(noRepo)) faltando.push(url)
}

console.log(`\n  páginas analisadas : ${paginas.length}`)
console.log(`  arquivos referenciados: ${referencias.size}`)

if (faltando.length === 0) {
    console.log(`  \x1b[32mtodos versionados no git — o CI vai conseguir buildar\x1b[0m\n`)
    process.exit(0)
}

console.log(`\n  \x1b[31m${faltando.length} arquivo(s) que o site usa mas NÃO estão no git:\x1b[0m`)
for (const f of faltando.sort().slice(0, 25)) {
    const noDisco = existsSync(path.join('public', f.replace(/^\//, ''))) ? 'existe no seu disco' : 'não existe nem no disco'
    console.log(`    ${f}`)
    console.log(`      \x1b[2m${noDisco} — o build do GitHub Actions vai quebrar aqui\x1b[0m`)
}
if (faltando.length > 25) console.log(`    ... e mais ${faltando.length - 25}`)
console.log(`\n  Provável causa: regra no .gitignore. Confira com:`)
console.log(`    git check-ignore -v public/<caminho>\n`)
process.exit(1)
