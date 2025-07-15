// src/lib/image-utils.ts

/**
 * Retorna o caminho completo da imagem baseado no path do produto
 */
export function getImagePath(productPath: string, imageName: string): string {
    // Remove barras iniciais e finais
    const cleanPath = productPath.replace(/^\/+|\/+$/g, '');
    const cleanImage = imageName.replace(/^\/+|\/+$/g, '');

    return `/Organizado/${cleanPath}/${cleanImage}`;
}

/**
 * Extrai a extensão de um arquivo
 */
export function getFileExtension(filename: string): string {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

/**
 * Verifica se é uma imagem válida
 */
export function isValidImage(filename: string): boolean {
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    const ext = getFileExtension(filename);
    return validExtensions.includes(ext);
}

/**
 * Gera um nome único para arquivo
 */
export function generateUniqueFilename(originalName: string): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const ext = getFileExtension(originalName);
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    const safeName = nameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, '_');

    return `${safeName}_${timestamp}_${random}.${ext}`;
}