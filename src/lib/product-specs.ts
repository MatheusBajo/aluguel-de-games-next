// src/lib/product-specs.ts
//
// Ficha técnica do produto (SPEC-FINAL-V2 §4.6) — legível E machine-readable.
// Duas fontes HONESTAS, nunca fabricadas:
//   1. `specs{}` curado no metadata.json (planilha do dono — DONO-CHECKLIST).
//   2. Dimensões extraídas do NOME DE ARQUIVO das fotos (o dono já mediu e
//      escreveu a medida no nome do arquivo). §4.6 pede essa migração.
// Regra do fallback (§1.3): linha sem dado NÃO renderiza. Se não há NENHUM
// dado real, a ficha inteira é omitida (nada de "consulte" em cascata).

import type { CatalogItem, ProductSpecs } from '@/lib/catalog.server';

/* ------------------------------------------------------------------ */
/* Extração de dimensões a partir do nome de arquivo das fotos         */
/* ------------------------------------------------------------------ */

type Axis = 'A' | 'L' | 'C' | 'P';
interface Dims { A?: number; L?: number; C?: number; P?: number }

const AXIS_MATCHERS: { k: Axis; re: RegExp }[] = [
    { k: 'A', re: /^(altura|alt)$/ },
    { k: 'L', re: /^(largura|larg|lar)$/ },
    { k: 'C', re: /^(comprimento|comp|com)$/ },
    { k: 'P', re: /^(profundidade|prof)$/ },
];

// Faixa sã pra equipamento de festa (metros). Fora disso = erro de parse.
const MIN_M = 0.1;
const MAX_M = 6.0;

function toMeters(numStr: string, unit?: string): number | null {
    const n = parseFloat(numStr.replace(',', '.'));
    if (Number.isNaN(n)) return null;
    const u = (unit || '').toLowerCase();
    if (u.startsWith('cm')) return n / 100;
    if (u === 'mt' || u === 'm' || u === 'metros') return n;
    // Sem unidade: número >= 10 é quase sempre cm ("80 Larg"); senão metros.
    return n >= 10 ? n / 100 : n;
}

/** Formata metros: inteiro sem casas ("2 m"), senão 2 casas ("0,40 m"). */
function fmtM(m: number): string {
    return Math.abs(m - Math.round(m)) < 1e-9
        ? `${Math.round(m)} m`
        : `${m.toFixed(2).replace('.', ',')} m`;
}

/**
 * Faz o parse de UMA legenda de dimensão (nome de arquivo). Detecta a
 * orientação da legenda (número-antes vs eixo-antes) e casa cada eixo com o
 * número do lado certo — resolve tanto "0,75 Larg x 1,95 Altura" quanto
 * "Altura 1,18 Largura 0,78". Descarta valores fora da faixa sã.
 */
function parseCaption(name: string): Dims {
    const base = name.replace(/\.[a-z0-9]+$/i, '').toLowerCase();
    const tokens: ({ type: 'num'; v: number | null } | { type: 'axis'; k: Axis })[] = [];
    const re =
        /(\d+(?:[.,]\d+)?)\s*(cm|mt|metros|m)?|(altura|alt|largura|larg|lar|comprimento|comp|com|profundidade|prof)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(base))) {
        if (m[3]) {
            const A = AXIS_MATCHERS.find((a) => a.re.test(m![3]));
            if (A) tokens.push({ type: 'axis', k: A.k });
        } else {
            tokens.push({ type: 'num', v: toMeters(m[1], m[2]) });
        }
    }

    // Orientação dominante: número imediatamente ANTES ou DEPOIS do eixo?
    let pre = 0;
    let post = 0;
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].type !== 'axis') continue;
        if (tokens[i - 1]?.type === 'num') pre++;
        if (tokens[i + 1]?.type === 'num') post++;
    }
    const usePre = pre >= post;

    const found: Dims = {};
    const used = new Set<number>();
    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        if (t.type !== 'axis') continue;
        const order = usePre ? [i - 1, i + 1] : [i + 1, i - 1];
        for (const j of order) {
            const cand = tokens[j];
            if (j < 0 || j >= tokens.length || used.has(j) || !cand || cand.type !== 'num') continue;
            used.add(j);
            const v = cand.v;
            if (v != null && v >= MIN_M && v <= MAX_M && !(t.k in found)) found[t.k] = v;
            break;
        }
    }
    return found;
}

/** Melhor conjunto de dimensões entre TODAS as fotos do item (≥2 eixos). */
export function derivedDimensions(item: CatalogItem): Dims | null {
    let best: Dims = {};
    for (const img of item.imagens ?? []) {
        const d = parseCaption(img);
        if (Object.keys(d).length > Object.keys(best).length) best = d;
    }
    return Object.keys(best).length >= 2 ? best : null;
}

const AXIS_LABEL: Record<Axis, string> = { A: 'A', L: 'L', C: 'C', P: 'P' };

function dimsToString(d: Dims): string {
    return (['A', 'L', 'C', 'P'] as Axis[])
        .filter((k) => k in d)
        .map((k) => `${AXIS_LABEL[k]} ${fmtM(d[k]!)}`)
        .join(' × ');
}

/* ------------------------------------------------------------------ */
/* Linhas da ficha técnica (visível + machine-readable)               */
/* ------------------------------------------------------------------ */

export interface SpecRow {
    label: string;
    value: string;
    /** Marca a linha como aproximada (medida do dono via nome de arquivo). */
    approx?: boolean;
}

function boolLabel(b: boolean): string {
    return b ? 'Sim' : 'Não';
}

/**
 * Monta as linhas da ficha. Ordem = §4.6. Prioriza `specs{}` curado; usa as
 * dimensões derivadas do nome de arquivo só quando o dono ainda não preencheu.
 * Retorna [] quando não há NENHUM dado real (ficha é omitida pelo componente).
 */
export function buildSpecRows(item: CatalogItem): SpecRow[] {
    const s: ProductSpecs = item.specs ?? {};
    const rows: SpecRow[] = [];

    const derived = derivedDimensions(item);
    const dimMontado = s.dimensoesMontado ?? (derived ? dimsToString(derived) : undefined);

    if (dimMontado) rows.push({ label: 'Dimensões (montado)', value: dimMontado, approx: !s.dimensoesMontado });
    if (s.dimensoesFechado) rows.push({ label: 'Dimensões (fechado, transporte)', value: s.dimensoesFechado });
    if (typeof s.passaPorta80 === 'boolean') rows.push({ label: 'Passa em porta de 80 cm?', value: boolLabel(s.passaPorta80) });
    if (typeof s.elevador === 'boolean') rows.push({ label: 'Cabe no elevador?', value: boolLabel(s.elevador) });
    if (s.voltagem) rows.push({ label: 'Tomada', value: s.voltagem });
    if (s.consumo) rows.push({ label: 'Consumo', value: s.consumo });
    if (s.jogadores) rows.push({ label: 'Jogadores', value: s.jogadores });
    if (s.idade) rows.push({ label: 'Idade recomendada', value: s.idade });
    if (s.espacoMinimo) rows.push({ label: 'Espaço mínimo', value: s.espacoMinimo });
    if (s.peso) rows.push({ label: 'Peso', value: s.peso });

    return rows;
}

/** Chips curtos pro topo (subconjunto do que existir). */
export function buildSpecChips(item: CatalogItem): string[] {
    const s = item.specs ?? {};
    const chips: string[] = [];
    if (s.jogadores) chips.push(`${s.jogadores} jogadores`);
    if (s.idade) chips.push(s.idade === 'Livre' ? 'Livre' : `${s.idade}`);
    if (s.voltagem) chips.push(s.voltagem);
    const derived = derivedDimensions(item);
    const dim = s.dimensoesMontado ?? (derived ? dimsToString(derived) : undefined);
    if (dim) chips.push(dim);
    return chips;
}

/** Linha de spec compacta pro card do catálogo (no lugar do contador fake). */
export function specLineFor(item: CatalogItem): string | null {
    const s = item.specs ?? {};
    if (s.jogadores) return `${s.jogadores} jogadores`;
    if (s.voltagem) return s.voltagem;
    const derived = derivedDimensions(item);
    if (derived) return dimsToString(derived);
    return null;
}

/** additionalProperty pro JSON-LD (Product) — só com dado real. */
export function specAdditionalProperties(item: CatalogItem): { name: string; value: string }[] {
    return buildSpecRows(item).map((r) => ({ name: r.label, value: r.value }));
}
