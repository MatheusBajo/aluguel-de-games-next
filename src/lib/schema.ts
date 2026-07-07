// src/lib/schema.ts
//
// Helpers de JSON-LD (grafo sem duplicação — spec §8). Renderizados
// SERVER-SIDE via <JsonLd> (src/components/seo/JsonLd.tsx).
//
// Regra do fallback (spec §1.3): slot sem dado confirmado NÃO renderiza.
// Por isso hasMap/geo/endereço/horário ficam FORA até o dono confirmar
// (ver GBP_URL / STREET_ADDRESS abaixo + DONO-CHECKLIST).

import { getSiteUrl } from '@/lib/site.config';
import { WHATSAPP_CONFIG } from '@/config/whatsapp.config';

/* ------------------------------------------------------------------ */
/* Dados aguardando o dono (null = não renderiza o slot)               */
/* ------------------------------------------------------------------ */

/** [CONFIRMAR COM DONO: link do perfil no Google Business Profile] → vira hasMap + sameAs */
export const GBP_URL: string | null = null;

/** [CONFIRMAR COM DONO: endereço completo com rua/número/CEP em Osasco] */
export const STREET_ADDRESS: string | null = null;

/** [CONFIRMAR COM DONO: horário de atendimento] → vira openingHoursSpecification */
export const OPENING_HOURS: { days: string[]; opens: string; closes: string }[] | null = null;

/** [CONFIRMAR COM DONO: CNPJ] → footer + schema (taxID) + /empresas */
export const CNPJ: string | null = null;

/**
 * [CONFIRMAR COM DONO: e-mail corporativo] → gate da /empresas (persona RH com
 * WhatsApp Web bloqueado). Enquanto null, o mailto NÃO renderiza (regra §1.3);
 * a página cai no fallback honesto (form B2B + WhatsApp + tel). É o bloqueador
 * nº1 de /empresas no DONO-CHECKLIST.
 */
export const CORP_EMAIL: string | null = null;

/**
 * [CONFIRMAR COM DONO: faixas de preço por categoria OU "a partir de R$ X"].
 * SÓ com compromisso escrito do dono (spec §6/§1.2). Enquanto null, /quanto-custa
 * e a home rodam na VERSÃO B (4 fatores + "combos saem melhor", zero número).
 */
export const PRICE_RANGES: { categoria: string; faixa: string }[] | null = null;

const ORG_ID = () => `${getSiteUrl()}/#organization`;
const WEBSITE_ID = () => `${getSiteUrl()}/#website`;

/* ------------------------------------------------------------------ */
/* LocalBusiness (EntertainmentBusiness) — layout, todas as páginas     */
/* ------------------------------------------------------------------ */

export function localBusinessSchema() {
    const baseUrl = getSiteUrl();

    const schema: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'EntertainmentBusiness',
        '@id': ORG_ID(),
        name: 'Aluguel de Games',
        description:
            'Locação de fliperamas, videokês, realidade virtual, consoles, máquina de dança e jogos de mesa para festas e eventos em Osasco e toda a Grande São Paulo. Desde 1993, com entrega, montagem e suporte inclusos.',
        url: baseUrl,
        foundingDate: '1993',
        telephone: WHATSAPP_CONFIG.formattedNumber,
        image: `${baseUrl}/Logo-Aluguel-de-games.png`,
        logo: `${baseUrl}/carro-logo-aluguel-de-games.png`,
        address: {
            '@type': 'PostalAddress',
            // [CONFIRMAR COM DONO: endereço] — rua/CEP só entram confirmados
            ...(STREET_ADDRESS ? { streetAddress: STREET_ADDRESS } : {}),
            addressLocality: 'Osasco',
            addressRegion: 'SP',
            addressCountry: 'BR',
        },
        areaServed: [
            { '@type': 'City', name: 'Osasco' },
            { '@type': 'City', name: 'São Paulo' },
            { '@type': 'City', name: 'Barueri' },
            { '@type': 'City', name: 'Carapicuíba' },
            { '@type': 'City', name: 'Guarulhos' },
            { '@type': 'City', name: 'Santo André' },
            { '@type': 'City', name: 'São Bernardo do Campo' },
            { '@type': 'AdministrativeArea', name: 'Grande São Paulo' },
        ],
        currenciesAccepted: 'BRL',
        sameAs: [
            WHATSAPP_CONFIG.link,
            'https://instagram.com/alugueldegames',
            ...(GBP_URL ? [GBP_URL] : []),
        ],
    };

    if (GBP_URL) schema.hasMap = GBP_URL;
    if (CNPJ) schema.taxID = CNPJ;
    if (OPENING_HOURS) {
        schema.openingHoursSpecification = OPENING_HOURS.map((h) => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: h.days,
            opens: h.opens,
            closes: h.closes,
        }));
    }

    return schema;
}

/* ------------------------------------------------------------------ */
/* WebSite — layout (SEM SearchAction: busca não existe no site)        */
/* ------------------------------------------------------------------ */

export function websiteSchema() {
    const baseUrl = getSiteUrl();
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': WEBSITE_ID(),
        name: 'Aluguel de Games',
        url: baseUrl,
        inLanguage: 'pt-BR',
        publisher: { '@id': ORG_ID() },
        dateModified: new Date().toISOString(), // data real do build
    };
}

/* ------------------------------------------------------------------ */
/* BreadcrumbList                                                       */
/* ------------------------------------------------------------------ */

export interface BreadcrumbItem {
    name: string;
    /** URL absoluta ou path começando com / */
    url: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
    const baseUrl = getSiteUrl();
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: item.name,
            item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
        })),
    };
}

/* ------------------------------------------------------------------ */
/* Product + Offer LeaseOut (página de produto)                         */
/* ------------------------------------------------------------------ */

export interface ProductSchemaInput {
    name: string;
    description?: string;
    images?: string[];
    url: string;
    /** Pares nome/valor da ficha técnica (specs) — só os preenchidos */
    additionalProperty?: { name: string; value: string }[];
}

export function productSchema(input: ProductSchemaInput) {
    const schema: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: input.name,
        url: input.url,
        brand: { '@type': 'Organization', name: 'Aluguel de Games' },
        offers: {
            '@type': 'Offer',
            priceCurrency: 'BRL',
            availability: 'https://schema.org/InStock',
            businessFunction: 'http://purl.org/goodrelations/v1#LeaseOut',
            seller: { '@id': ORG_ID() },
        },
        // Sem aggregateRating: só com reviews reais (gate binário do brief).
    };
    if (input.description) schema.description = input.description;
    if (input.images?.length) schema.image = input.images;
    if (input.additionalProperty?.length) {
        schema.additionalProperty = input.additionalProperty.map((p) => ({
            '@type': 'PropertyValue',
            name: p.name,
            value: p.value,
        }));
    }
    return schema;
}

/* ------------------------------------------------------------------ */
/* CollectionPage + ItemList (categoria)                                */
/* ------------------------------------------------------------------ */

export function collectionPageSchema(input: {
    name: string;
    description?: string;
    url: string;
    items: { name: string; url: string }[];
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: input.name,
        ...(input.description ? { description: input.description } : {}),
        url: input.url,
        isPartOf: { '@id': WEBSITE_ID() },
        dateModified: new Date().toISOString(),
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: input.items.length,
            itemListElement: input.items.map((item, idx) => ({
                '@type': 'ListItem',
                position: idx + 1,
                name: item.name,
                url: item.url,
            })),
        },
    };
}

/* ------------------------------------------------------------------ */
/* FAQPage — o schema DEVE espelhar 1:1 o texto visível em <details>    */
/* ------------------------------------------------------------------ */

export interface FaqEntry {
    question: string;
    answer: string;
}

export function faqPageSchema(faqs: FaqEntry[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
    };
}

/* ------------------------------------------------------------------ */
/* Service (/empresas — valor GEO, sem promessa de rich result)         */
/* ------------------------------------------------------------------ */

export function serviceSchema(input: {
    name: string;
    description: string;
    url: string;
    serviceType?: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: input.name,
        description: input.description,
        url: input.url,
        ...(input.serviceType ? { serviceType: input.serviceType } : {}),
        provider: { '@id': ORG_ID() },
        areaServed: [
            { '@type': 'City', name: 'São Paulo' },
            { '@type': 'City', name: 'Osasco' },
            { '@type': 'AdministrativeArea', name: 'Grande São Paulo' },
        ],
    };
}

/* ------------------------------------------------------------------ */
/* HowTo (/como-funciona — GEO/consistência, NÃO rich result)           */
/* ------------------------------------------------------------------ */

export function howToSchema(input: {
    name: string;
    description?: string;
    steps: { name: string; text: string }[];
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: input.name,
        ...(input.description ? { description: input.description } : {}),
        step: input.steps.map((s, idx) => ({
            '@type': 'HowToStep',
            position: idx + 1,
            name: s.name,
            text: s.text,
        })),
    };
}
