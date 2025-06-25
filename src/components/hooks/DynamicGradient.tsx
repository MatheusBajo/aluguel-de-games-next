/* src/components/hooks/DynamicGradient.tsx */
"use client";

import { usePalette } from 'color-thief-react';

export function DynamicGradient({
                                    imageUrl,
                                    opacity = 1,
                                    blur = '50px',
                                    typeOfGradient = 'radial'
                                }: {
    imageUrl: string;
    opacity?: number;
    blur?: string;
    typeOfGradient?: 'radial' | 'linear';
}) {
    const { data: palette, loading, error } = usePalette(imageUrl, 5, 'hex');
    if (error) {
        console.error(error);
        return null;
    }

    if (loading || error || !palette) return null;

    const stops = palette
        .map((color, i) => {
            const pos = Math.round((i / (palette.length - 1)) * 100);
            return `${color} ${pos}%`;
        })
        .join(', ');

    const gradient1 = `radial-gradient(circle at 50% 100%, ${stops})`;
    const gradient2 = `radial-gradient(circle at 50% 50%, ${stops})`;

    const gradient = typeOfGradient === 'radial' ? gradient1 : gradient2;

    return (
        <div
            style={{
                position: 'absolute',
                opacity: opacity,
                inset: 0,
                zIndex: -1,
                filter: `blur(${blur})`,
                background: gradient,
                transition: 'all 1s ease',
            }}
        />
    );
}
