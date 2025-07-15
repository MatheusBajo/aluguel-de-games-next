// src/components/seo/SchemaMarkup.tsx
export default function SchemaMarkup() {
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Aluguel de Games',
        url: 'https://www.alugueldegames.com.br',
        logo: 'https://www.alugueldegames.com.br/carro-logo-aluguel-de-games.png',
        description: 'Empresa especializada em locação de equipamentos de entretenimento para festas e eventos',
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'São Paulo',
            addressRegion: 'SP',
            addressCountry: 'BR'
        },
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+55-11-4237-7766',
            contactType: 'customer service',
            areaServed: 'BR',
            availableLanguage: 'Portuguese'
        },
        sameAs: [
            'https://instagram.com/alugueldegames',
            'https://facebook.com/alugueldegames',
            'https://wa.me/+551142377766'
        ]
    };

    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Aluguel de Games',
        url: 'https://www.alugueldegames.com.br',
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://www.alugueldegames.com.br/catalogo?search={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
        }
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://www.alugueldegames.com.br'
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Catálogo',
                item: 'https://www.alugueldegames.com.br/catalogo'
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
        </>
    );
}

// Para usar no layout.tsx principal:
// import SchemaMarkup from '@/components/seo/SchemaMarkup'
//
// E adicionar dentro do <body>:
// <SchemaMarkup />