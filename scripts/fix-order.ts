// scripts/fix-order.ts
// Script adicional para definir ordem inicial baseada em ordem alfabética

import fs from 'node:fs/promises';
import path from 'node:path';

const rootDir = path.join(process.cwd(), 'public', 'Organizado');

async function fixOrder() {
    console.log('🔢 Ajustando ordem dos itens...\n');

    async function processDirectory(dirPath: string): Promise<void> {
        const items = await fs.readdir(dirPath, { withFileTypes: true });
        const directories = items.filter(item => item.isDirectory());

        // Separar categorias e produtos
        const categories: string[] = [];
        const products: string[] = [];

        for (const dir of directories) {
            const itemPath = path.join(dirPath, dir.name);

            try {
                await fs.access(path.join(itemPath, 'metadata.json'));
                products.push(dir.name);
            } catch {
                categories.push(dir.name);
            }
        }

        // Ordenar e atualizar categorias
        categories.sort();
        for (let i = 0; i < categories.length; i++) {
            const catPath = path.join(dirPath, categories[i]);
            const categoryJsonPath = path.join(catPath, 'category.json');

            try {
                const content = await fs.readFile(categoryJsonPath, 'utf8');
                const data = JSON.parse(content);
                data.ordem = i * 10;
                await fs.writeFile(categoryJsonPath, JSON.stringify(data, null, 2));
                console.log(`📁 ${categories[i]} - ordem: ${i * 10}`);
            } catch {
                // Ignorar se não conseguir
            }

            // Processar subcategorias
            await processDirectory(catPath);
        }

        // Ordenar e atualizar produtos
        products.sort();
        for (let i = 0; i < products.length; i++) {
            const prodPath = path.join(dirPath, products[i]);
            const metadataPath = path.join(prodPath, 'metadata.json');

            try {
                const content = await fs.readFile(metadataPath, 'utf8');
                const data = JSON.parse(content);
                data.ordem = (categories.length + i) * 10;
                await fs.writeFile(metadataPath, JSON.stringify(data, null, 2));
                console.log(`📦 ${products[i]} - ordem: ${(categories.length + i) * 10}`);
            } catch {
                // Ignorar se não conseguir
            }
        }
    }

    await processDirectory(rootDir);
    console.log('\n✨ Ordem ajustada!');
}

// Para executar apenas este script, descomente a linha abaixo:
// fixOrder().catch(console.error);