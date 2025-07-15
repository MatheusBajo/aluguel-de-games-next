// src/lib/catalog.server.ts
import 'server-only'
import fs from 'node:fs/promises'
import path from 'node:path'

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

        try {
            const raw = await fs.readFile(meta, 'utf8')
            const data = JSON.parse(raw) as Omit<CatalogItem, 'key'>
            out.push({ ...data, key: [...seg, e.name].join('/') })
            if (limit && out.length >= limit) return
        } catch {
            await walk(abs, [...seg, e.name], out, limit)
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