// src/lib/occasions.ts
//
// Mapa categoria → ocasião (SPEC-FINAL-V2 §3.4).
// Regra do fallback (corrige a dependência apontada pelo auditor): a fileira
// por ocasião da home NUNCA nasce magra. O metadata.json de cada produto pode
// trazer `ocasioes[]` como OVERRIDE de curadoria do dono (taga os 15 top);
// quando não traz, a ocasião é DERIVADA da categoria pelo mapa abaixo.
//
// Mapa default (§3.4):
//   Piscinas/Infláveis/Infantil          → infantil
//   Jogos de Mesa + Videokês + Fliperamas → adulta
//   VR + Dança(Máquinas) + Fliperamas     → empresa

import type { CatalogItem } from '@/lib/catalog.server';

export type Occasion = 'infantil' | 'adulta' | 'empresa';

const norm = (s: string) =>
    s
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]/g, '');

/** Deriva ocasiões a partir da árvore de categorias (segmentos da key). */
function occasionsFromCategory(key: string): Occasion[] {
    const seg = key.split('/').map(norm);
    const top = seg[0] ?? '';
    const sub = seg[1] ?? '';
    const out = new Set<Occasion>();

    // Infantil: piscinas, infláveis, cama elástica, infantil.
    if (top.includes('piscina') || top.includes('inflavel') || top.includes('infantil') || top.includes('camaelastica')) {
        out.add('infantil');
    }

    // Adulta / retrô: jogos de mesa, videokês e fliperamas.
    if (top.includes('jogosdemesa') || top.includes('videoke') || sub.includes('fliperama')) {
        out.add('adulta');
    }

    // Empresa: realidade virtual, máquinas (dança/boxe) e fliperamas.
    if (top.includes('realidadevirtual') || sub.includes('maquina') || sub.includes('fliperama') || sub.includes('simulador')) {
        out.add('empresa');
    }

    return [...out];
}

/** Ocasiões de um item: override do metadata (`ocasioes[]`) ou fallback. */
export function occasionsForItem(item: CatalogItem): Occasion[] {
    const override = (item as { ocasioes?: unknown }).ocasioes;
    if (Array.isArray(override) && override.length) {
        return override.filter((o): o is Occasion =>
            o === 'infantil' || o === 'adulta' || o === 'empresa',
        );
    }
    return occasionsFromCategory(item.key);
}

/** Filtra o catálogo pra uma ocasião. Curados (override) vêm primeiro. */
export function itemsForOccasion(items: CatalogItem[], occasion: Occasion): CatalogItem[] {
    const matched = items.filter((it) => occasionsForItem(it).includes(occasion));
    // Override (curadoria do dono) na frente; resto preserva ordem do catálogo.
    return matched.sort((a, b) => {
        const aCur = Array.isArray((a as { ocasioes?: unknown }).ocasioes) ? 0 : 1;
        const bCur = Array.isArray((b as { ocasioes?: unknown }).ocasioes) ? 0 : 1;
        return aCur - bCur;
    });
}

export interface OccasionDef {
    id: Occasion;
    /** Rótulo da fileira (vira heading-link). */
    label: string;
    /** Cor de categoria (neon) — label/divisor, nunca botão de ação. */
    accent: string;
    /** CTA da fileira: rótulo + destino. */
    cta: { label: string; href: string };
}

/**
 * Definição das 3 fileiras da vitrine por ocasião (§3.4).
 * NOTA de rota: /festas e /quanto-custa nascem em estágio posterior do
 * roadmap V2; os links já apontam pro destino final da spec.
 */
export const OCCASIONS: OccasionDef[] = [
    {
        id: 'infantil',
        label: 'Pra festa infantil',
        accent: 'text-pink-400',
        cta: { label: 'Ver tudo pra festa infantil', href: '/festas#infantil' },
    },
    {
        id: 'adulta',
        label: 'Pra festa adulta e retrô',
        accent: 'text-cyan-400',
        cta: { label: 'Montar minha festa', href: '/catalogo' },
    },
    {
        id: 'empresa',
        label: 'Pra evento de empresa',
        accent: 'text-purple-400',
        cta: { label: 'Sou empresa', href: '/empresas' },
    },
];
