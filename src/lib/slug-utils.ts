// src/lib/slug-utils.ts

/**
 * Converte uma string para slug URL-friendly
 * Ex: "Balão Pula-Pula" -> "balao-pula-pula"
 */
export function toSlug(str: string): string {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
        .replace(/\s+/g, '-') // Substitui espaços por hífens
        .replace(/-+/g, '-') // Remove hífens duplicados
        .replace(/^-+|-+$/g, ''); // Remove hífens do início e fim
}

/**
 * Converte um array de segmentos para slug
 * Ex: ["Fliperamas", "Fliperama Retrô"] -> ["fliperamas", "fliperama-retro"]
 */
export function segmentsToSlug(segments: string[]): string[] {
    return segments.map(toSlug);
}

/**
 * Gera a URL do produto usando slugs
 * Ex: "Fliperamas/Fliperama Retrô" -> "/catalogo/fliperamas/fliperama-retro"
 */
export function generateProductUrl(key: string): string {
    const segments = key.split('/');
    const slugSegments = segmentsToSlug(segments);
    return `/catalogo/${slugSegments.join('/')}`;
}