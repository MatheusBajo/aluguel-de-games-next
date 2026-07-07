// src/lib/catalog-specs.ts
//
// Ficha técnica do produto (spec §4.5 + §7 "extensão do metadata.json").
// Fonte de verdade = campo `specs` no metadata.json (o dono preenche via
// planilha na fase 4). Enquanto isso, MIGRAMOS as dimensões que já vivem em
// NOME DE ARQUIVO das fotos (achado da V2B, spec §4 passo 5) — dado real do
// dono, NUNCA inventado. Slot sem dado NÃO renderiza (regra do fallback §1.3).
//
// Zero fabricação: só extraímos strings de medida que o próprio dono digitou
// no nome do arquivo. Voltagem/jogadores/idade/peso só entram quando vierem
// no `specs` do metadata (não são adivinhados).

/** Ficha técnica estruturada (o dono preenche o resto na fase 4). */
export interface ProductSpecs {
    /** Dimensões (ex.: "1,90 × 0,95 × 0,75 m") — pode vir do nome do arquivo */
    dimensoes?: string;
    peso?: string;
    /** Tomada / voltagem (ex.: "110/220V") */
    tomada?: string;
    jogadores?: string;
    /** Espaço mínimo recomendado no local */
    espacoMinimo?: string;
    /** "Passa em porta de 80 cm?" — sim/não/observação */
    passaPorta80?: string;
    /** "Cabe no elevador?" */
    elevador?: string;
    /** Idade recomendada */
    idade?: string;
    /** Itens que acompanham a locação */
    itensInclusos?: string[];
}

/** Rótulos legíveis (pt-BR) por campo, na ordem de exibição da tabela. */
const SPEC_LABELS: { key: keyof ProductSpecs; label: string }[] = [
    { key: 'dimensoes', label: 'Dimensões' },
    { key: 'peso', label: 'Peso' },
    { key: 'tomada', label: 'Tomada' },
    { key: 'jogadores', label: 'Jogadores' },
    { key: 'idade', label: 'Idade recomendada' },
    { key: 'espacoMinimo', label: 'Espaço mínimo' },
    { key: 'passaPorta80', label: 'Passa em porta de 80 cm?' },
    { key: 'elevador', label: 'Cabe no elevador?' },
];

export interface SpecRow {
    label: string;
    value: string;
}

/**
 * Transforma `specs` em linhas prontas pra `<table>` e pro JSON-LD
 * (`additionalProperty`). Só entra linha com valor real — nada de "—"/"consulte".
 */
export function specsToRows(specs?: ProductSpecs | null): SpecRow[] {
    if (!specs) return [];
    const rows: SpecRow[] = [];
    for (const { key, label } of SPEC_LABELS) {
        const raw = specs[key];
        if (typeof raw === 'string' && raw.trim()) {
            rows.push({ label, value: raw.trim() });
        }
    }
    if (specs.itensInclusos?.length) {
        rows.push({ label: 'Itens inclusos', value: specs.itensInclusos.join(', ') });
    }
    return rows;
}

/* ------------------------------------------------------------------ */
/* Migração: dimensões a partir do NOME DO ARQUIVO das fotos            */
/* ------------------------------------------------------------------ */

// Um "token de medida" = número decimal (1,90 / 1.90) OU inteiro colado a
// uma unidade (80cm, 1M, 220 cm). É o sinal de que a string é uma dimensão
// digitada pelo dono, e não um UUID / "photo_123" / "WhatsApp Image ...".
const MEASURE_RE = /\d+[.,]\d+|\d+\s?(?:m|cm|mm)\b/i;
const DIM_KEYWORD_RE = /(alt(?:ura)?|larg(?:ura)?|comp(?:rimento)?|profund\w*)\s*$/i;

/**
 * Tenta ler uma dimensão legível do nome de UMA imagem.
 * Retorna null se o nome não parece uma medida (UUID, foto solta, etc.).
 */
export function dimensionFromImageName(imageName: string): string | null {
    // tira extensão + ruído comum de nome de arquivo
    const s = imageName
        .replace(/\.[a-z0-9]+$/i, '')
        .replace(/\s*-?\s*c[oó]pia\s*$/i, '')
        .replace(/\s*\(\d+\)\s*$/, '')
        .replace(/^croqui\s+/i, '')
        .trim();

    const m = s.match(MEASURE_RE);
    if (!m || m.index === undefined) return null;

    // corta o prefixo de nome-de-produto ("Pebolim ", "Estação Play 5 ")
    let start = m.index;
    const before = s.slice(0, start);
    const kw = before.match(DIM_KEYWORD_RE); // mas mantém "alt"/"larg" colado
    if (kw && kw.index !== undefined) start = kw.index;

    const out = s.slice(start).trim();
    // precisa sobrar pelo menos uma unidade pra ser dimensão de verdade
    if (!/(m|cm|mm)\b/i.test(out)) return null;
    return out;
}

/**
 * Escolhe a melhor dimensão entre todas as imagens (a que descreve mais eixos,
 * i.e. mais separadores "x"). Retorna null se nenhuma imagem for uma medida.
 */
export function dimensionFromImages(images?: string[] | null): string | null {
    if (!images?.length) return null;
    let best: string | null = null;
    let bestAxes = -1;
    for (const img of images) {
        const dim = dimensionFromImageName(img);
        if (!dim) continue;
        const axes = (dim.match(/x/gi) || []).length;
        if (axes > bestAxes) {
            bestAxes = axes;
            best = dim;
        }
    }
    return best;
}

/**
 * Ficha técnica efetiva do produto: parte do `specs` do metadata (dono) e
 * completa `dimensoes` a partir do nome de arquivo quando o dono ainda não
 * preencheu. Nunca sobrescreve dado confirmado com dado derivado.
 */
export function resolveSpecs(
    specs: ProductSpecs | undefined,
    images: string[] | undefined
): ProductSpecs {
    const resolved: ProductSpecs = { ...(specs ?? {}) };
    if (!resolved.dimensoes) {
        const derived = dimensionFromImages(images);
        if (derived) resolved.dimensoes = derived;
    }
    return resolved;
}
