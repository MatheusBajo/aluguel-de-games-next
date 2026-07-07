// src/lib/schema.ts
//
// Builders de JSON-LD (grafo do opus-4.8 mantido e centralizado).
// Tudo renderiza via <JsonLd> server-side no HTML do build.
// Regra do fallback: dado não confirmado no BUSINESS (endereço, GBP…) é
// OMITIDO do schema — nunca inventado.
import { BUSINESS } from '@/config/business.config';
import { WHATSAPP_CONFIG } from '@/config/whatsapp.config';
import { SITE_URL } from '@/lib/site.config';

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Data do build (dateModified real — nunca inventada). */
const BUILD_DATE = new Date().toISOString().slice(0, 10);

/**
 * EntertainmentBusiness/LocalBusiness global (layout → todas as páginas).
 * foundingDate 1993 + areaServed + hasMap (só com GBP confirmado).
 */
export function localBusinessSchema() {
    return {
        '@type': 'EntertainmentBusiness',
        '@id': ORGANIZATION_ID,
        name: BUSINESS.name,
        ...(BUSINESS.legalName ? { legalName: BUSINESS.legalName } : {}),
        description:
            'Desde 1993, aluguel de fliperamas, videokês, realidade virtual, pinball, consoles e máquinas de dança para festas e eventos em Osasco e Grande São Paulo.',
        url: SITE_URL,
        foundingDate: '1993',
        telephone: BUSINESS.phoneE164,
        email: BUSINESS.email,
        address: {
            '@type': 'PostalAddress',
            ...(BUSINESS.address.street ? { streetAddress: BUSINESS.address.street } : {}),
            ...(BUSINESS.address.postalCode ? { postalCode: BUSINESS.address.postalCode } : {}),
            addressLocality: BUSINESS.address.locality,
            addressRegion: BUSINESS.address.region,
            addressCountry: BUSINESS.address.country,
        },
        // [CONFIRMAR COM DONO: horário oficial] — valores herdados do site
        // atual (contato); confirmar antes de campanha (DONO-CHECKLIST.md).
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '08:30',
                closes: '18:00',
            },
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Saturday'],
                opens: '08:00',
                closes: '12:30',
            },
        ],
        priceRange: '$$',
        currenciesAccepted: 'BRL',
        paymentAccepted: 'Dinheiro, Cartão de Crédito, Cartão de Débito, PIX',
        image: `${SITE_URL}/Logo-Aluguel-de-games.png`,
        logo: `${SITE_URL}/carro-logo-aluguel-de-games.png`,
        areaServed: BUSINESS.areaServed.map((name) => ({ '@type': 'City', name })),
        ...(BUSINESS.gbpUrl ? { hasMap: BUSINESS.gbpUrl } : {}),
        sameAs: [
            WHATSAPP_CONFIG.link,
            BUSINESS.social.instagram,
            BUSINESS.social.facebook,
            ...(BUSINESS.gbpUrl ? [BUSINESS.gbpUrl] : []),
        ],
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Equipamentos para Locação',
            itemListElement: [
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Aluguel de Fliperama' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Aluguel de Videokê' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Aluguel de Realidade Virtual' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Aluguel de Pinball' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Aluguel de Máquinas de Dança' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Aluguel de Consoles (PS5, Xbox, Switch)' } },
            ],
        },
    };
}

/** WebSite (sem SearchAction: busca foi removida do site — brief §2). */
export function webSiteSchema() {
    return {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        name: BUSINESS.name,
        url: SITE_URL,
        inLanguage: 'pt-BR',
        dateModified: BUILD_DATE,
        publisher: { '@id': ORGANIZATION_ID },
    };
}

/** Grafo global (layout): LocalBusiness + WebSite num @graph único. */
export function globalGraph() {
    return {
        '@context': 'https://schema.org',
        '@graph': [localBusinessSchema(), webSiteSchema()],
    };
}

/* ------------------------------------------------------------------ */
/* Helpers pros próximos estágios (produto/categoria/FAQ/breadcrumb)  */
/* ------------------------------------------------------------------ */

export interface BreadcrumbItem {
    name: string;
    /** URL absoluta ou path começando com / */
    url: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.name,
            item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
        })),
    };
}

export interface ProductSchemaInput {
    name: string;
    description?: string;
    images?: string[];
    url: string;
    /** additionalProperty (specs reais do metadata.json — fase 1). */
    properties?: Array<{ name: string; value: string }>;
    /** Preço "a partir de" — SÓ com compromisso escrito do dono (gate 1.6). */
    lowPrice?: number;
}

/** Product + Offer LeaseOut (padrão opus-4.8; sem aggregateRating). */
export function productSchema(input: ProductSchemaInput) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: input.name,
        ...(input.description ? { description: input.description } : {}),
        ...(input.images?.length ? { image: input.images } : {}),
        url: input.url.startsWith('http') ? input.url : `${SITE_URL}${input.url}`,
        brand: { '@type': 'Organization', name: BUSINESS.name },
        ...(input.properties?.length
            ? {
                  additionalProperty: input.properties.map((p) => ({
                      '@type': 'PropertyValue',
                      name: p.name,
                      value: p.value,
                  })),
              }
            : {}),
        offers: {
            '@type': 'Offer',
            priceCurrency: 'BRL',
            ...(typeof input.lowPrice === 'number' ? { price: input.lowPrice } : {}),
            availability: 'https://schema.org/InStock',
            businessFunction: 'http://purl.org/goodrelations/v1#LeaseOut',
            seller: {
                '@type': 'EntertainmentBusiness',
                '@id': ORGANIZATION_ID,
                name: BUSINESS.name,
            },
        },
    };
}

export interface FaqItem {
    question: string;
    answer: string;
}

/**
 * FAQPage 1:1 com o texto VISÍVEL da página (<details>/<summary>).
 * Valor = GEO/extração, não rich result (Google matou FAQ rich result em 2023).
 */
export function faqPageSchema(items: FaqItem[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
    };
}

export interface CollectionSchemaInput {
    name: string;
    description?: string;
    url: string;
    items: Array<{ name: string; url: string }>;
}

/** CollectionPage + ItemList (categorias do catálogo). */
export function collectionPageSchema(input: CollectionSchemaInput) {
    return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: input.name,
        ...(input.description ? { description: input.description } : {}),
        url: input.url.startsWith('http') ? input.url : `${SITE_URL}${input.url}`,
        dateModified: BUILD_DATE,
        isPartOf: { '@id': WEBSITE_ID },
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: input.items.length,
            itemListElement: input.items.map((it, idx) => ({
                '@type': 'ListItem',
                position: idx + 1,
                name: it.name,
                url: it.url.startsWith('http') ? it.url : `${SITE_URL}${it.url}`,
            })),
        },
    };
}
