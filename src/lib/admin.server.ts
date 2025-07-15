// src/lib/admin.server.ts
import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';

const rootDir = path.join(process.cwd(), 'public', 'Organizado');

export interface Metadata {
    titulo: string;
    descricao?: string;
    ordem?: number;
    imagens?: string[];
}

// Cria um novo produto
export async function createProduct(dirSegments: string[], name: string) {
    const dir = path.join(rootDir, ...dirSegments, name);
    await fs.mkdir(dir, { recursive: true });

    const meta: Metadata = {
        titulo: name,
        descricao: '',
        ordem: 9999,
        imagens: []
    };

    await fs.writeFile(
        path.join(dir, 'metadata.json'),
        JSON.stringify(meta, null, 2),
        'utf8'
    );
}

// Atualiza metadata de um produto
export async function updateMetadata(segments: string[], metadata: Metadata) {
    const dir = path.join(rootDir, ...segments);
    const metaPath = path.join(dir, 'metadata.json');

    // Garante que o diretório existe
    await fs.mkdir(dir, { recursive: true });

    // Lê metadata existente se houver
    let existingMetadata: Metadata = {
        titulo: segments[segments.length - 1] || '',
        descricao: '',
        ordem: 9999,
        imagens: []
    };

    try {
        const content = await fs.readFile(metaPath, 'utf8');
        existingMetadata = JSON.parse(content);
    } catch {
        // Arquivo não existe ainda, usar valores padrão
    }

    // Mescla metadata existente com nova
    const finalMetadata = {
        ...existingMetadata,
        ...metadata
    };

    // Salva o metadata
    await fs.writeFile(
        metaPath,
        JSON.stringify(finalMetadata, null, 2),
        'utf-8'
    );
}

// Gera metadata.json para pastas que não têm
export async function generateMetadataForFolder(segments: string[]) {
    const dir = path.join(rootDir, ...segments);
    const metaPath = path.join(dir, 'metadata.json');

    try {
        // Verifica se já existe
        await fs.access(metaPath);
        return; // Já tem metadata
    } catch {
        // Não existe, vamos criar
    }

    const folderName = segments[segments.length - 1] || 'Root';
    const metadata: Metadata = {
        titulo: folderName,
        descricao: '',
        ordem: 9999,
        imagens: []
    };

    await fs.writeFile(
        metaPath,
        JSON.stringify(metadata, null, 2),
        'utf-8'
    );
}