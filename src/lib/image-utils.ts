// src/lib/image-utils.ts

/**
 * Normaliza caminhos de imagem para funcionar corretamente no Vercel
 * Lida com espaços, caracteres especiais e case sensitivity
 */
export function getImagePath(itemKey: string, imageName: string): string {
    // Garante que os segmentos do caminho sejam codificados individualmente
    const pathSegments = itemKey.split('/');
    const encodedPath = pathSegments.map(segment => encodeURIComponent(segment)).join('/');

    // Codifica o nome da imagem também
    const encodedImageName = encodeURIComponent(imageName);

    return `/Organizado/${encodedPath}/${encodedImageName}`;
}

/**
 * Decodifica um caminho para uso em comparações
 */
export function decodePath(path: string): string {
    return decodeURIComponent(path);
}

/**
 * Verifica se o caminho da imagem precisa de encoding
 */
export function needsEncoding(path: string): boolean {
    return /[\s%]/.test(path);
}

/**
 * Cria um caminho seguro para URLs
 */
export function createSafeUrl(basePath: string, ...segments: string[]): string {
    return [basePath, ...segments]
        .map(segment => encodeURIComponent(segment))
        .join('/');
}