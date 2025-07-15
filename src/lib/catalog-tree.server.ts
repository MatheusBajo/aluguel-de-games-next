// src/lib/catalog-tree.server.ts
import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';

const rootDir = path.join(process.cwd(), 'public', 'Organizado');

interface CategoryMetadata {
    titulo: string;
    ordem: number;
    descricao?: string;
}

interface ProductMetadata {
    titulo: string;
    descricao?: string;
    ordem: number;
    imagens: string[];
}

interface TreeNode {
    key: string;
    name: string;
    type: 'category' | 'product';
    metadata: CategoryMetadata | ProductMetadata;
    children: TreeNode[];
}

// Função para ler ou criar metadata de categoria
async function getCategoryMetadata(dirPath: string): Promise<CategoryMetadata> {
    const metaPath = path.join(dirPath, 'category.json');
    try {
        const data = await fs.readFile(metaPath, 'utf8');
        return JSON.parse(data);
    } catch {
        // Se não existe, cria um padrão
        const parts = dirPath.split(path.sep);
        const name = parts[parts.length - 1];
        const defaultMeta: CategoryMetadata = {
            titulo: name,
            ordem: 9999,
            descricao: ''
        };

        // Tenta criar o arquivo
        try {
            await fs.writeFile(metaPath, JSON.stringify(defaultMeta, null, 2));
        } catch (e) {
            // Ignora erro se não conseguir criar
        }

        return defaultMeta;
    }
}

// Função para construir a árvore completa
export async function buildCatalogTree(): Promise<TreeNode[]> {
    const tree: TreeNode[] = [];

    async function processDirectory(dirPath: string, relativePath: string[] = []): Promise<TreeNode[]> {
        const items = await fs.readdir(dirPath, { withFileTypes: true });
        const nodes: TreeNode[] = [];

        for (const item of items) {
            const itemPath = path.join(dirPath, item.name);
            const itemRelativePath = [...relativePath, item.name];
            const key = itemRelativePath.join('/');

            if (item.isDirectory()) {
                // Verifica se é um produto (tem metadata.json)
                const metadataPath = path.join(itemPath, 'metadata.json');
                let isProduct = false;
                let metadata: any;

                try {
                    const metaContent = await fs.readFile(metadataPath, 'utf8');
                    metadata = JSON.parse(metaContent);
                    isProduct = true;
                } catch {
                    // Não é um produto, é uma categoria
                    metadata = await getCategoryMetadata(itemPath);
                }

                if (isProduct) {
                    // É um produto
                    nodes.push({
                        key,
                        name: item.name,
                        type: 'product',
                        metadata: metadata as ProductMetadata,
                        children: []
                    });
                } else {
                    // É uma categoria
                    const children = await processDirectory(itemPath, itemRelativePath);
                    nodes.push({
                        key,
                        name: item.name,
                        type: 'category',
                        metadata: metadata as CategoryMetadata,
                        children
                    });
                }
            }
        }

        return nodes;
    }

    return processDirectory(rootDir);
}