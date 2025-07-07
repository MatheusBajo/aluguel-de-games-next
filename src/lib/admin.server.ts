import 'server-only'
import fs from 'node:fs/promises'
import path from 'node:path'

const rootDir = path.join(process.cwd(), 'public', 'Organizado')

export interface ProductMeta {
    titulo: string
    descricao: string
    ordem: number
    imagens: string[]
}

export async function createProduct(dirSegments: string[], name: string) {
    const dir = path.join(rootDir, ...dirSegments, name)
    await fs.mkdir(dir, { recursive: true })
    const meta: ProductMeta = {
        titulo: name,
        descricao: '',
        ordem: 9999,
        imagens: []
    }
    await fs.writeFile(
        path.join(dir, 'metadata.json'),
        JSON.stringify(meta, null, 2),
        'utf8'
    )
}

export async function updateMetadata(dirSegments: string[], data: Partial<ProductMeta>) {
    const dir = path.join(rootDir, ...dirSegments)
    const metaPath = path.join(dir, 'metadata.json')
    const raw = await fs.readFile(metaPath, 'utf8')
    const meta = JSON.parse(raw) as ProductMeta
    const newMeta = { ...meta, ...data }
    await fs.writeFile(metaPath, JSON.stringify(newMeta, null, 2), 'utf8')
}