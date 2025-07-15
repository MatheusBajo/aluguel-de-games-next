// src/components/seo/OGImagePreload.tsx
export function OGImagePreload({ imageUrl }: { imageUrl: string }) {
    return (
        <>
            {/* Preload da imagem para melhor performance */}
            <link
                rel="preload"
                as="image"
                href={imageUrl}
                crossOrigin="anonymous"
            />

            {/* Meta tags adicionais para garantir que a imagem apareça */}
            <meta property="og:image:secure_url" content={imageUrl} />
            <meta property="og:image:type" content="image/jpeg" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content="Produto disponível para aluguel" />

            {/* Twitter específico */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:image" content={imageUrl} />
        </>
    );
}