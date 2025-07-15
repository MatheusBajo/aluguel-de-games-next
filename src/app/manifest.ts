// src/app/manifest.ts
export const dynamic    = "force-static";
export const revalidate = false;

import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Aluguel de Games - Locação de Jogos e Equipamentos',
        short_name: 'Aluguel de Games',
        description: 'Aluguel de fliperamas, videokês, simuladores e equipamentos para festas e eventos',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
            {
                src: '/Logo-Aluguel-de-games.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
            {
                src: '/Logo-Aluguel-de-games.png',
                sizes: '1000x1000',
                type: 'image/png',
            },
            {
                src: '/Logo-Aluguel-de-games.png',
                sizes: '1000x1000',
                type: 'image/png',
            },
        ],
    };
}