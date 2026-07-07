// src/app/page.tsx
// import CatalogList from './catalogo/CatalogList.server';
import HomeShell from '@/components/HomeShell';
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {CatalogSection} from "@/components/catalogo/CatalogSection";
import {getCatalog} from "@/lib/catalog.server";
import { WHATSAPP_CONFIG } from '@/config/whatsapp.config';

/* ---------- SEO / Metadata ---------- */
export const metadata: Metadata = {
    metadataBase: new URL('https://www.alugueldegames.com.br'),
    title: {
        default:
            'Aluguel de Games SP | Fliperamas, Videokê e VR para Festas desde 1993',
        template: '%s | Aluguel de Games SP',
    },
    description:
        'Desde 1993 alugando fliperamas, videokês, simuladores VR, consoles, pinball e máquinas de dança para festas e eventos em São Paulo. Entrega, montagem e suporte técnico inclusos. Orçamento sem compromisso pelo WhatsApp.',
    keywords: [
        'aluguel de games',
        'locação de jogos',
        'fliperama para festa',
        'videokê',
        'karaokê',
        'realidade virtual',
        'festa infantil',
        'evento corporativo',
        'são paulo',
        'entretenimento para eventos',
        'máquina de música',
        'air game',
        'simulador de corrida',
    ],
    authors: [{ name: 'Aluguel de Games' }],
    creator: 'Aluguel de Games',
    publisher: 'Aluguel de Games',
    formatDetection: { email: false, address: false, telephone: false },
    openGraph: {
        title: 'Aluguel de Games - Transforme seu Evento em Diversão',
        description:
            'Locação de equipamentos de entretenimento para festas e eventos. Fliperamas, VR, Karaokê e muito mais! Entrega grátis em SP.',
        url: 'https://www.alugueldegames.com.br',
        siteName: 'Aluguel de Games',
        images: [
            {
                url: '/Logo-Aluguel-de-games.png',
                width: 1200,
                height: 630,
                alt: 'Aluguel de Games - Equipamentos de Entretenimento para Festas',
            },
        ],
        locale: 'pt_BR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Aluguel de Games - Locação de Jogos e Entretenimento',
        description:
            'Transforme seu evento com nossos equipamentos de entretenimento. Orçamento grátis!',
        images: ['/Logo-Aluguel-de-games.png'],
        creator: '@alugueldegames',
    },
    alternates: { canonical: 'https://www.alugueldegames.com.br' },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    // TODO: substituir pelo código real do Google Search Console após verificação do domínio
    // verification: { google: 'COLAR_CODIGO_AQUI' },
    category: 'entretenimento',
};

/* ---------- JSON‑LD ---------- */
const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EntertainmentBusiness',
    '@id': 'https://www.alugueldegames.com.br/#organization',
    name: 'Aluguel de Games',
    description:
        'Desde 1993, especialistas em aluguel de fliperamas, videokês, realidade virtual, pinball, consoles e máquinas de dança para festas e eventos em São Paulo.',
    url: 'https://www.alugueldegames.com.br',
    foundingDate: '1993',
    telephone: WHATSAPP_CONFIG.formattedNumber,
    address: {
        '@type': 'PostalAddress',
        addressLocality: 'São Paulo',
        addressRegion: 'SP',
        addressCountry: 'BR',
    },
    geo: { '@type': 'GeoCoordinates', latitude: -23.5505, longitude: -46.6333 },
    openingHoursSpecification: [
        {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '18:00',
        },
        {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Saturday'],
            opens: '09:00',
            closes: '14:00',
        },
    ],
    priceRange: '$$',
    currenciesAccepted: 'BRL',
    paymentAccepted: 'Dinheiro, Cartão de Crédito, Cartão de Débito, PIX',
    image: 'https://www.alugueldegames.com.br/Logo-Aluguel-de-games.png',
    logo: 'https://www.alugueldegames.com.br/carro-logo-aluguel-de-games.png',
    areaServed: [
        { '@type': 'City', name: 'São Paulo' },
        { '@type': 'City', name: 'Guarulhos' },
        { '@type': 'City', name: 'Santo André' },
        { '@type': 'City', name: 'São Bernardo do Campo' },
        { '@type': 'City', name: 'Osasco' },
        { '@type': 'City', name: 'Barueri' },
    ],
    sameAs: [
        WHATSAPP_CONFIG.link,
        'https://instagram.com/alugueldegames',
        'https://facebook.com/alugueldegames',
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

/* ---------- Página ---------- */
export default async function Home() {
    /* --- carrega TODO o catálogo --- */
    const items = await getCatalog();

    /* --- separa somente as três sub‑categorias desejadas --- */
    const groups: Record<"Fliperamas" | "Máquinas" | "Consoles", typeof items> = {
        Fliperamas: [],
        Máquinas: [],
        Consoles: [],
    };

    for (const it of items) {
        const [, sub] = it.key.split("/");            // nível‑2
        if (sub === "Fliperamas") groups.Fliperamas.push(it);
        if (sub === "Máquinas")     groups.Máquinas.push(it);
        if (sub === "Consoles")    groups.Consoles.push(it);
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="flex flex-col items-center gap-16 md:gap-24 px-0 py-8">
                <HomeShell />

                {/* =============== SEÇÃO CATÁLOGO HOME =============== */}
                <section className="relative w-full py-12 md:py-16">
                    {/* Decoração */}
                    <div className="pointer-events-none absolute inset-0 dot-grid opacity-25" aria-hidden />
                    {/* Fades */}
                    <div className="section-fade-top" aria-hidden />
                    <div className="section-fade-bottom" aria-hidden />

                    <div className="relative mx-auto max-w-screen-2xl px-4 md:px-6">
                        {/* Header editorial */}
                        <div className="mb-12 md:mb-16 grid lg:grid-cols-[1.5fr_1fr] gap-6 items-end">
                            <div>
                                <p className="label-arcade text-pink-400 mb-3">▸ Catálogo em destaque</p>
                                <h2 className="font-display font-extrabold text-4xl md:text-6xl tracking-tight leading-[0.95]">
                                    O que joga<br />
                                    <span className="italic font-normal text-muted-foreground/70">na sua festa.</span>
                                </h2>
                            </div>
                            <p className="font-body text-muted-foreground max-w-md lg:text-right">
                                Selecionamos os 3 carros-chefe do nosso catálogo. Tem muito mais — explora o catálogo completo pra ver tudo.
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="divider-neon mb-12" />

                        {/* 3 categorias destacadas */}
                        <div className="w-full grid gap-12 md:gap-16">
                            <CatalogSection
                                categoria="Fliperamas"
                                items={groups["Fliperamas"]}
                                initialLimit={6}
                                initialLimitMobile={3}
                                headingLevel="h3"
                            />

                            <div className="divider-neon" />

                            <CatalogSection
                                categoria="Máquinas"
                                items={groups["Máquinas"]}
                                initialLimit={6}
                                initialLimitMobile={3}
                                headingLevel="h3"
                            />

                            <div className="divider-neon" />

                            <CatalogSection
                                categoria="Consoles"
                                items={groups.Consoles}
                                initialLimit={6}
                                initialLimitMobile={3}
                                headingLevel="h3"
                            />
                        </div>

                        {/* CTA Ver catálogo completo */}
                        <div className="mt-16 md:mt-20 text-center">
                            <p className="label-arcade text-cyan-400 mb-3">↓ tem muito mais</p>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="font-semibold text-base px-10 border-2 border-purple-500/40 bg-card/40 text-foreground hover:bg-purple-500/10 hover:text-foreground hover:border-purple-500/80 backdrop-blur-sm transition-all hover:scale-105"
                            >
                                <Link href="/catalogo">
                                    <span className="mr-2">🎮</span>
                                    Ver catálogo completo
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
