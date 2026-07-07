// src/lib/catalog.server.ts
import 'server-only'
import fs from 'node:fs/promises'
import path from 'node:path'
import { segmentsToSlug } from './slug-utils'

/**
 * Ficha técnica estruturada (SPEC-FINAL-V2 §4.6). Fonte curada = planilha do
 * dono (DONO-CHECKLIST.md). Campo ausente = linha NÃO renderiza (§1.3): nunca
 * "consulte" em cascata. Dimensões que hoje vivem em NOME DE ARQUIVO de foto
 * são extraídas automaticamente por product-specs.ts como fallback honesto.
 */
export interface ProductSpecs {
    /** "A 1,95 m × L 0,75 m × C 0,40 m" (montado). */
    dimensoesMontado?: string
    /** Dimensões fechado/transporte. */
    dimensoesFechado?: string
    /** Passa em porta de 80 cm? */
    passaPorta80?: boolean
    /** Cabe no elevador? */
    elevador?: boolean
    /** Tomada: "110V", "220V", "110V/220V", "Bivolt", "Não usa energia". */
    voltagem?: string
    /** Consumo aproximado. */
    consumo?: string
    /** Nº de jogadores ("1 a 2"). */
    jogadores?: string
    /** Idade recomendada ("Livre", "6+"). */
    idade?: string
    /** Espaço mínimo de operação. */
    espacoMinimo?: string
    /** Peso aproximado. */
    peso?: string
}

export interface CatalogItem {
    key: string
    titulo: string
    descricao?: string
    imagens?: string[]
    ordem?: number
    /** Ficha técnica curada pelo dono (opcional; §4.6). */
    specs?: ProductSpecs
    /** FAQ do item (opcional; §4.9). Sem isso usa o default honesto. */
    faq?: { question: string; answer: string }[]
    /** Answer capsule do produto (opcional; §4.4). */
    capsule?: string
    /** Badges honestos ("mais pedido"/"novo") — só com assinatura do dono. */
    badges?: string[]
    /** Override de ocasião (§3.4) — curadoria do dono. */
    ocasioes?: ('infantil' | 'adulta' | 'empresa')[]
    /** Contador legado do metadata (NÃO exibido — proibição §11). */
    locacoes?: number
    // Propriedades admin
    metadata?: any
    path?: string
    images?: string[]
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

/**
 * Retorna todos os produtos cuja key (após normalização para slug) começa
 * com o caminho da categoria informada. Ex: ['jogos-eletronicos', 'fliperamas']
 * retorna todos os fliperamas dentro de jogos-eletronicos.
 *
 * Retorna array vazio se a categoria não existe ou não tem produtos.
 */
export async function getCategoryItems(categorySlug: string[]): Promise<CatalogItem[]> {
    if (!categorySlug || categorySlug.length === 0) return []

    const all = await getCatalog()
    const targetSlug = categorySlug.join('/')

    return all.filter((item) => {
        const itemSegments = item.key.split('/')
        const itemSlug = segmentsToSlug(itemSegments).join('/')
        // Item deve estar DENTRO da categoria (não ser a própria categoria),
        // ou seja, ter mais segmentos depois do prefixo.
        return itemSlug.startsWith(targetSlug + '/')
    })
}