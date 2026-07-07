// src/components/seo/JsonLd.tsx
//
// Componente SERVER de JSON-LD: emite <script type="application/ld+json">
// direto no HTML cru do build (crawlers de IA não executam JS — next/script
// client-side é invisível pra eles). Substitui os usos de next/script.
//
// Uso: <JsonLd data={schema} /> ou <JsonLd data={[schemaA, schemaB]} />

type JsonLdData = Record<string, unknown>;

export function JsonLd({ data }: { data: JsonLdData | JsonLdData[] }) {
    const items = Array.isArray(data) ? data : [data];
    return (
        <>
            {items.map((item, i) => (
                <script
                    key={i}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
                />
            ))}
        </>
    );
}

export default JsonLd;
