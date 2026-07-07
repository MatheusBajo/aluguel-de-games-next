// src/lib/sales-utils.ts
//
// Geração determinística de "número de locações" por produto.
// Usado como social proof no CatalogCard e no Top 10 até termos um sistema
// real de tracking de aluguéis.
//
// Regras:
// - Mínimo: 100 locações
// - Máximo: 200+ (valores acima são "arredondados" pra 200+ no display)
// - Top 10: usa RANK para ser coerente (1º tem mais, 10º tem menos)
// - Produtos fora do Top 10: hash determinístico baseado no key
// - Determinístico: mesmo key/rank = mesmo número entre builds

const MIN_COUNT = 100;
const MAX_COUNT = 200;

/**
 * Hash simples (FNV-1a 32-bit) de string para gerar número estável.
 */
function hashString(str: string): number {
    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
}

/**
 * Retorna o número de locações aproximado de um produto.
 *
 * Precedência:
 *  1. Override explícito (ex: campo `locacoes` do metadata.json) — se passado.
 *  2. Rank (Top 10) — valor decrescente por posição.
 *  3. Hash determinístico do key — fallback padrão.
 *
 * @param productKey  Identificador único (slug ou key).
 * @param options     Opcional — pode passar `override` (valor fixo) OU `rank` (top N).
 */
export function getRentalCount(
    productKey: string,
    options?: number | { override?: number; rank?: number }
): number {
    // Retrocompatibilidade: se chamar com número, trata como rank
    const opts =
        typeof options === "number" ? { rank: options } : options ?? {};

    // 1. Override explícito (vindo do metadata.json)
    if (typeof opts.override === "number") {
        return Math.max(opts.override, MIN_COUNT);
    }

    // 2. Rank (Top 10)
    if (typeof opts.rank === "number" && opts.rank >= 1) {
        const step = 10;
        const value = MAX_COUNT - (opts.rank - 1) * step;
        return Math.max(value, MIN_COUNT + 10);
    }

    // 3. Hash determinístico (fallback)
    const hash = hashString(productKey);
    const range = 170 - MIN_COUNT; // 70
    return MIN_COUNT + (hash % (range + 1));
}

/**
 * Formata o número de locações para display.
 *
 * Regras:
 * - ≥ 200: mostra "200+" (cap máximo)
 * - < 200: arredonda pra dezena mais próxima e adiciona "+" (ex: 147 → "140+")
 */
export function formatRentalCount(count: number): string {
    if (count >= MAX_COUNT) return `${MAX_COUNT}+`;
    // Arredonda pra baixo na dezena + "+"
    return `${Math.floor(count / 10) * 10}+`;
}
