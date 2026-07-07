// src/app/llms.txt/route.ts
//
// llms.txt gerado no BUILD (static export gera /llms.txt como arquivo).
// Índice + descrição pro consumo de LLMs (spec §8 — custo ~zero,
// expectativa declarada ZERO: quase nenhum provider consome hoje).
export const dynamic = 'force-static';

import { getCatalog } from '@/lib/catalog.server';
import { segmentsToSlug } from '@/lib/slug-utils';
import { getSiteUrl } from '@/lib/site.config';
import { WHATSAPP_CONFIG } from '@/config/whatsapp.config';

export async function GET() {
    const baseUrl = getSiteUrl();
    const catalogo = await getCatalog();

    // Categorias top-level com contagem real de itens
    const byCategory = new Map<string, number>();
    for (const item of catalogo) {
        const top = item.key.split('/')[0];
        byCategory.set(top, (byCategory.get(top) ?? 0) + 1);
    }

    const categoriasList = [...byCategory.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([nome, count]) => {
            const slug = segmentsToSlug([nome])[0];
            return `- [${nome}](${baseUrl}/catalogo/${slug}/): ${count} ${count === 1 ? 'item' : 'itens'} pra locação`;
        })
        .join('\n');

    const body = `# Aluguel de Games

> A Aluguel de Games loca fliperamas, videokês, PS5, realidade virtual, máquina de dança e jogos de mesa para festas e eventos em Osasco e toda a Grande São Paulo, desde 1993. Entrega, montagem e suporte inclusos. Orçamento pelo WhatsApp ${WHATSAPP_CONFIG.displayNumber}.

Empresa fundada em 1993 (antes do primeiro PlayStation existir), com eventos realizados para Bradesco, Spotify, Arnold Classic e Danilo Gentili. Atende festas particulares (aniversário infantil e adulto, casamento, bodas) e eventos corporativos (SIPAT, confraternização, ativação de marca) com contrato e nota fiscal de locação.

## Páginas principais

- [Home](${baseUrl}/): visão geral do serviço de locação de games
- [Catálogo](${baseUrl}/catalogo/): todos os equipamentos disponíveis pra alugar
- [Como funciona](${baseUrl}/como-funciona/): passo a passo do aluguel (orçamento → contrato → entrega e montagem → retirada)
- [Para empresas](${baseUrl}/empresas/): eventos corporativos, SIPAT, confraternização, NF e contrato
- [Galeria](${baseUrl}/galeria/): fotos de eventos reais
- [Sobre](${baseUrl}/sobre/): história da empresa desde 1993
- [Contato](${baseUrl}/contato/): WhatsApp ${WHATSAPP_CONFIG.displayNumber}, telefone e formulário

## Categorias do catálogo

${categoriasList}

## Contato

- WhatsApp e telefone: ${WHATSAPP_CONFIG.displayNumber} (${WHATSAPP_CONFIG.link})
- Área de atendimento: Osasco e toda a Grande São Paulo
`;

    return new Response(body, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
        },
    });
}
