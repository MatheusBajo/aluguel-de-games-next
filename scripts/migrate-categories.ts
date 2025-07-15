// scripts/migrate-categories.ts
// Execute com: npx tsx scripts/migrate-categories.ts

import fs from 'node:fs/promises';
import path from 'node:path';

const rootDir = path.join(process.cwd(), 'public', 'Organizado');

async function migrateCategories() {
    console.log('🚀 Iniciando migração de categorias...\n');

    async function processDirectory(dirPath: string, level: number = 0): Promise<void> {
        const items = await fs.readdir(dirPath, { withFileTypes: true });

        for (const item of items) {
            if (!item.isDirectory()) continue;

            const itemPath = path.join(dirPath, item.name);
            const categoryJsonPath = path.join(itemPath, 'category.json');
            const metadataJsonPath = path.join(itemPath, 'metadata.json');

            try {
                // Verifica se já tem metadata.json (é um produto)
                await fs.access(metadataJsonPath);
                console.log(`${'  '.repeat(level)}📦 ${item.name} (produto - ignorado)`);
                continue;
            } catch {
                // Não tem metadata.json, então é uma categoria
            }

            try {
                // Verifica se já tem category.json
                await fs.access(categoryJsonPath);
                console.log(`${'  '.repeat(level)}✅ ${item.name} (categoria já migrada)`);
            } catch {
                // Não tem category.json, criar um
                const categoryData = {
                    titulo: item.name
                        .split('-')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' '),
                    descricao: '',
                    ordem: 9999
                };

                await fs.writeFile(
                    categoryJsonPath,
                    JSON.stringify(categoryData, null, 2)
                );

                console.log(`${'  '.repeat(level)}📁 ${item.name} (categoria migrada)`);
            }

            // Processar subdiretórios
            await processDirectory(itemPath, level + 1);
        }
    }

    await processDirectory(rootDir);
    console.log('\n✨ Migração concluída!');
}

// Executar migração
migrateCategories().catch(console.error);