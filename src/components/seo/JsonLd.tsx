// src/components/seo/JsonLd.tsx
//
// Renderizador de JSON-LD SERVER-SIDE: <script> inline no HTML cru do build
// (NUNCA next/script — crawler de IA não executa JS; brief gate 1.3/1.4).
// Server component: zero JS no cliente.

export function JsonLd({ data }: { data: object }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

export default JsonLd;
