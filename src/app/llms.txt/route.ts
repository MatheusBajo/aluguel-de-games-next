// src/app/llms.txt/route.ts
//
// llms.txt gerado no BUILD (static export). Expectativa declarada: ZERO —
// nenhum provider de IA consome llms.txt hoje (97% dos sites que publicam
// recebem zero requests). Custa 30 min, então existe; a aposta GEO real é
// HTML cru + JSON-LD + robots liberando os bots (SPEC-FINAL-V2 §8).
export const dynamic = 'force-static';

import { getCatalog } from '@/lib/catalog.server';
import { segmentsToSlug } from '@/lib/slug-utils';
import { SITE_URL } from '@/lib/site.config';
import { BUSINESS } from '@/config/business.config';

export async function GET() {
    const catalog = await getCatalog();

    // Categorias de topo com contagem real de itens
    const byCategory = new Map<string, number>();
    for (const item of catalog) {
        const top = item.key.split('/')[0];
        byCategory.set(top, (byCategory.get(top) ?? 0) + 1);
    }

    const categoriesList = Array.from(byCategory.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([cat, count]) => {
            const slug = segmentsToSlug([cat]).join('');
            return `- [${cat}](${SITE_URL}/catalogo/${slug}/): ${count} equipamentos para locação`;
        })
        .join('\n');

    const text = `# Aluguel de Games

> A Aluguel de Games loca fliperamas, videokês, PS5, realidade virtual, máquina de dança e jogos de mesa para festas e eventos em Osasco e toda a Grande São Paulo, desde 1993. Entrega, montagem e suporte inclusos. Orçamento pelo WhatsApp ${BUSINESS.phoneDisplay}.

Empresa fundada em 1993 (mais antiga do segmento na região), com eventos realizados para Bradesco, Spotify, Arnold Classic e Danilo Gentili.

Contato: WhatsApp/telefone ${BUSINESS.phoneDisplay} · ${BUSINESS.email}

## Páginas principais

- [Catálogo completo](${SITE_URL}/catalogo/): todos os equipamentos disponíveis para aluguel
- [Para empresas](${SITE_URL}/empresas/): eventos corporativos, SIPAT, confraternização, ativação de marca
- [Como funciona](${SITE_URL}/como-funciona/): passo a passo do aluguel, entrega e retirada
- [Sobre](${SITE_URL}/sobre/): história da empresa desde 1993
- [Galeria](${SITE_URL}/galeria/): fotos de eventos reais
- [Contato](${SITE_URL}/contato/): WhatsApp, telefone e formulário

## Categorias do catálogo

${categoriesList}

## Área de atendimento

${BUSINESS.areaServed.join(', ')} e demais cidades da Grande São Paulo.
`;

    return new Response(text, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
}
