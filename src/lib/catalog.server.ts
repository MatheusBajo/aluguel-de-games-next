// src/lib/catalog.server.ts
import 'server-only'
import fs from 'node:fs/promises'
import path from 'node:path'
import { segmentsToSlug } from './slug-utils'

export interface CatalogItem {
    key: string
    titulo: string
    descricao?: string
    imagens?: string[]
    ordem?: number
}

const rootDir = path.join(process.cwd(), 'public', 'Organizado')

/* util ────────────────────────────────────────────────────────────── */
const norm = (s: string) =>
    s
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '')

/* catalogo completo (recursivo) ------------------------------------ */
async function walk(
    dir: string,
    seg: string[],
    out: CatalogItem[],
    limit?: number
) {
    if (limit && out.length >= limit) return
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const e of entries) {
        if (!e.isDirectory()) continue
        const abs = path.join(dir, e.name)
        const meta = path.join(abs, 'metadata.json')

        // ⚠️ NÃO REMOVER O normalize('NFC').
        //
        // O macOS devolve nome de arquivo em NFD (decomposto: "a" + acento
        // combinante), enquanto o Windows devolve NFC (precomposto: "á"). São
        // bytes diferentes para o MESMO nome: "Máquinas" tem 9 bytes em NFC e
        // 10 em NFD, e `nfd === "Máquinas"` é **false**.
        //
        // O site foi construído no PC (Windows), onde tudo batia. Ao buildar no
        // Mac, toda comparação contra literal acentuado passou a falhar em
        // silêncio: `sub === "Máquinas"` em src/app/page.tsx devolvia false e a
        // seção Máquinas sumia da home E da página de categoria — sem erro
        // nenhum no build, com as páginas de produto ainda existindo. Bug mudo,
        // do tipo que só aparece com o site no ar.
        //
        // Normalizando aqui, na única porta de entrada do disco, a `key` fica
        // NFC sempre e o resto do código pode comparar com literal normalmente,
        // rodando em Mac, Windows ou no CI.
        const nome = e.name.normalize('NFC')

        try {
            const raw = await fs.readFile(meta, 'utf8')
            const data = JSON.parse(raw) as Omit<CatalogItem, 'key'>
            out.push({ ...data, key: [...seg, nome].join('/') })
            if (limit && out.length >= limit) return
        } catch {
            await walk(abs, [...seg, nome], out, limit)
        }
    }
}

export async function getCatalog(limit?: number) {
    const out: CatalogItem[] = []
    await walk(rootDir, [], out, limit)
    return out
}

/* busca case-insensitive + sem acento ------------------------------ */
async function findReal(segments: string[]) {
    let cur = rootDir
    const real: string[] = []

    for (const s of segments) {
        const list = await fs.readdir(cur)
        const match = list.find((x) => norm(x) === norm(s))
        if (!match) return null
        real.push(match)
        cur = path.join(cur, match)
    }
    return real
}

export async function getItem(slug: string[]) {
    // 1. tenta caminho exato
    try {
        const p = path.join(rootDir, ...slug, 'metadata.json')
        const raw = await fs.readFile(p, 'utf8')
        const data = JSON.parse(raw) as Omit<CatalogItem, 'key'>
        return { ...data, key: slug.join('/') }
    } catch {
        /* vazio */
    }

    // 2. fallback case-insensitive
    const real = await findReal(slug)
    if (!real) return null
    try {
        const p = path.join(rootDir, ...real, 'metadata.json')
        const raw = await fs.readFile(p, 'utf8')
        const data = JSON.parse(raw) as Omit<CatalogItem, 'key'>
        return { ...data, key: real.join('/') }
    } catch {
        return null
    }
}

export async function getAllSlugs() {
    const items: CatalogItem[] = []
    await walk(rootDir, [], items)
    return items.map((item) => item.key.split('/'))
}

/**
 * Todos os produtos DENTRO de uma categoria (em qualquer profundidade).
 *
 * Existe porque a rota /catalogo/[...slug] gera URL pra TODA categoria
 * (generateStaticParams monta cada prefixo do caminho), mas até 14/ago/2026 a
 * página só sabia renderizar PRODUTO: em categoria ela caía no notFound().
 * Como o site é export estático, esse "não encontrado" virava um arquivo HTML
 * servido com HTTP 200 — ou seja, /catalogo/jogos-eletronicos/maquinas/ e
 * todas as outras respondiam 200 mostrando página em branco. Passava em
 * qualquer teste que olhasse só o código HTTP.
 *
 * A comparação é feita em SLUG dos dois lados, então acento e maiúscula não
 * atrapalham. O `+ '/'` no prefixo é proposital: garante que a categoria não
 * liste a si mesma, só o que está abaixo dela.
 */
export async function getCategoryItems(categorySlug: string[]): Promise<CatalogItem[]> {
    if (!categorySlug || categorySlug.length === 0) return []

    const all = await getCatalog()
    const alvo = segmentsToSlug(categorySlug).join('/')

    return all.filter((item) => {
        const itemSlug = segmentsToSlug(item.key.split('/')).join('/')
        return itemSlug.startsWith(alvo + '/')
    })
}
