// src/lib/product-content.ts
//
// Conteúdo textual do produto (SPEC-FINAL-V2 §4.4/§4.7/§4.9). Tudo derivado de
// FATO (título, categoria, política real de entrega/garantia da empresa) —
// nenhum número ou promessa fabricada. O dono pode sobrescrever via
// metadata.json (`capsule`, `faq[]`); sem isso, usa estes defaults honestos.

import type { CatalogItem } from '@/lib/catalog.server';
import type { FaqEntry } from '@/components/seo/FaqNative';
import type { CategoryMetadata } from '@/lib/catalog-categories';
import { occasionsForItem, type Occasion } from '@/lib/occasions';
import { BUSINESS } from '@/config/business.config';

/**
 * Answer capsule do produto (§4.4) — 40-60 palavras, primeiro texto corrido,
 * extraível por IA/Google. Fatos verdadeiros pra qualquer item do catálogo.
 */
export function productCapsule(item: CatalogItem): string {
    if (item.capsule) return item.capsule;
    return (
        `Alugue o ${item.titulo} para festas e eventos em Osasco e toda a Grande São Paulo. ` +
        `A gente entrega montado e testado, dá suporte durante a locação e busca depois — ` +
        `com contrato e nota fiscal. O valor fechado depende da data e do bairro: manda os dois ` +
        `no WhatsApp ${BUSINESS.phoneDisplay} que a gente responde com o orçamento. Desde 1993.`
    );
}

/** Chips "vai bem em" (§4.7): ocasiões do item → /festas /empresas. */
export interface OccasionChip {
    label: string;
    href: string;
}
const OCCASION_CHIP: Record<Occasion, OccasionChip> = {
    infantil: { label: 'Festa infantil', href: '/festas#infantil' },
    adulta: { label: 'Festa adulta e retrô', href: '/festas#adulto' },
    empresa: { label: 'Evento de empresa', href: '/empresas' },
};

export function occasionChipsFor(item: CatalogItem): OccasionChip[] {
    return occasionsForItem(item).map((o) => OCCASION_CHIP[o]);
}

/**
 * FAQ default do item (§4.9) — 4 perguntas honestas com resposta 1:1 no texto
 * visível (vai no FAQPage). Preço aponta pra /quanto-custa; garantia usa a
 * política real da empresa (troca/técnico no local). Sem número inventado.
 * O dono pode sobrescrever com `faq[]` no metadata.json.
 */
export function productFaq(item: CatalogItem): FaqEntry[] {
    if (item.faq?.length) return item.faq;
    const nome = item.titulo;
    return [
        {
            question: `O aluguel do ${nome} inclui entrega e montagem?`,
            answer:
                'Inclui. A gente entrega, monta e testa o equipamento antes do evento e busca depois. ' +
                'Entrega, montagem e suporte estão inclusos no orçamento em toda a Grande São Paulo.',
        },
        {
            question: `Quanto custa alugar o ${nome}?`,
            answer:
                'O valor fechado depende da data e do bairro da entrega. Alugando mais de um item junto, ' +
                'o combo sai melhor. Manda a data e o bairro no WhatsApp que a gente responde com o orçamento.',
            link: { href: '/quanto-custa', label: 'Entenda como funciona o orçamento' },
        },
        {
            question: 'E se der defeito durante a festa?',
            answer:
                'Se der qualquer problema, a gente troca o equipamento ou manda um técnico no local, ' +
                'sem custo extra pra você. O problema é nosso, não seu.',
        },
        {
            question: `Quanto tempo o ${nome} fica no meu evento?`,
            answer:
                'O período da diária a gente combina no orçamento e costuma cobrir a duração da festa. ' +
                'Precisa de mais tempo, pernoite ou horário específico? Fala com a gente que a gente ajusta.',
        },
    ];
}

/** Capsule da categoria-LP (§4 categoria) — resposta curta e extraível. */
export function categoryCapsule(meta: CategoryMetadata): string {
    return meta.description;
}

/**
 * FAQ default da categoria-LP (§4 categoria). Genérica e honesta; o valor é
 * GEO/extração + FAQPage 1:1. Cidades reais vêm de BUSINESS.areaServed.
 */
export function categoryFaq(label: string): FaqEntry[] {
    const cidades = BUSINESS.areaServed.slice(0, 6).join(', ');
    return [
        {
            question: `Vocês entregam e montam o ${label.toLowerCase()}?`,
            answer:
                'Entregamos, montamos e testamos antes do evento, e buscamos depois. Entrega, montagem e ' +
                'suporte estão inclusos no orçamento em toda a Grande São Paulo.',
        },
        {
            question: `Quanto custa alugar ${label.toLowerCase()}?`,
            answer:
                'O valor depende do equipamento, da data e do bairro da entrega. Alugando mais de um item ' +
                'junto, o combo sai melhor. Manda os dados no WhatsApp que a gente responde com o orçamento.',
            link: { href: '/quanto-custa', label: 'Entenda como funciona o preço' },
        },
        {
            question: 'E se der defeito durante o evento?',
            answer:
                'A gente troca o equipamento ou manda um técnico no local, sem custo extra. ' +
                'O problema é nosso, não seu.',
        },
        {
            question: 'Atendem a minha região?',
            answer: `Atendemos Osasco e toda a Grande São Paulo, incluindo ${cidades} e cidades vizinhas. Na dúvida, manda seu bairro no WhatsApp.`,
        },
    ];
}
