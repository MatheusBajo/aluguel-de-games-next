/**
 * Tipos do colorthief para uso NO BROWSER.
 *
 * Por que este arquivo existe: o package.json do colorthief@2.7.0 aponta o campo
 * "types" para dist/color-thief-node.d.ts — a build de Node, que exporta funções
 * soltas. Mas o código do site importa a build de browser (dist/color-thief.js),
 * que exporta uma CLASSE. Resultado: `new ColorThief()` quebrava o type-check com
 * "This expression is not constructable" e derrubava o `next build` inteiro.
 *
 * O tsconfig aponta o specifier "colorthief" para cá via `paths`, então estas
 * assinaturas valem no lugar das do pacote. Se um dia o colorthief arrumar o
 * campo "types", basta remover a entrada de `paths` e apagar este arquivo.
 *
 * Consumidores: src/components/ui/CarouselOverlayGradient.tsx
 */
declare module "colorthief" {
    /** RGB de 0 a 255. */
    export type RGB = [number, number, number];

    export default class ColorThief {
        /**
         * Cor dominante da imagem. `quality` 1 = varre todo pixel (lento);
         * valores maiores amostram e ficam mais rápidos. Padrão do lib: 10.
         */
        getColor(img: HTMLImageElement, quality?: number): RGB;

        /**
         * Paleta com até `colorCount` cores. Pode devolver menos que o pedido
         * quando a imagem tem pouca variação de cor.
         */
        getPalette(img: HTMLImageElement, colorCount?: number, quality?: number): RGB[];
    }
}
