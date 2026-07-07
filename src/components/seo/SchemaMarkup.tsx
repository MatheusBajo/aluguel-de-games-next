// src/components/seo/SchemaMarkup.tsx
//
// Schema global inserido em TODAS as páginas via layout.tsx.
// Contém apenas WebSite (com SearchAction). O EntertainmentBusiness completo
// fica na home (src/app/page.tsx) para não duplicar. Breadcrumbs específicos
// devem ficar em cada página de catálogo/produto.

export default function SchemaMarkup() {
    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': 'https://www.alugueldegames.com.br/#website',
        name: 'Aluguel de Games',
        url: 'https://www.alugueldegames.com.br',
        inLanguage: 'pt-BR',
        publisher: {
            '@id': 'https://www.alugueldegames.com.br/#organization'
        },
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://www.alugueldegames.com.br/catalogo?search={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
    );
}