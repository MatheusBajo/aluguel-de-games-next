// src/app/page.tsx
import CatalogList from './catalogo/CatalogList.server'
import HomeShell from '@/components/HomeShell'
import { Metadata } from 'next'

export const metadata: Metadata = {
    metadataBase: new URL('https://alugueldegames.com'),
    title: {
        default: 'Aluguel de Games - Locação de Jogos e Equipamentos para Festas e Eventos',
        template: '%s | Aluguel de Games'
    },
    description: 'Aluguel de fliperamas, videokês, simuladores VR, máquinas de música e jogos para festas e eventos em São Paulo. Entrega grátis, instalação e suporte técnico incluídos. Orçamento sem compromisso!',
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
        'simulador de corrida'
    ],
    authors: [{ name: 'Aluguel de Games' }],
    creator: 'Aluguel de Games',
    publisher: 'Aluguel de Games',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        title: 'Aluguel de Games - Transforme seu Evento em Diversão',
        description: 'Locação de equipamentos de entretenimento para festas e eventos. Fliperamas, VR, Karaokê e muito mais! Entrega grátis em SP.',
        url: 'https://alugueldegames.com',
        siteName: 'Aluguel de Games',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Aluguel de Games - Equipamentos de Entretenimento para Festas'
            }
        ],
        locale: 'pt_BR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Aluguel de Games - Locação de Jogos e Entretenimento',
        description: 'Transforme seu evento com nossos equipamentos de entretenimento. Orçamento grátis!',
        images: ['/og-image.jpg'],
        creator: '@alugueldegames',
    },
    alternates: {
        canonical: 'https://alugueldegames.com',
    },
    robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'seu-codigo-google-aqui',
    },
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 5,
    },
    category: 'entretenimento',
}

// Estrutura de dados para SEO
const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Aluguel de Games',
    description: 'Aluguel de equipamentos de entretenimento para festas e eventos',
    url: 'https://alugueldegames.com',
    telephone: '+551142377766',
    address: {
        '@type': 'PostalAddress',
        addressLocality: 'São Paulo',
        addressRegion: 'SP',
        addressCountry: 'BR'
    },
    geo: {
        '@type': 'GeoCoordinates',
        latitude: -23.5505,
        longitude: -46.6333
    },
    openingHours: 'Mo-Fr 09:00-18:00, Sa 09:00-14:00',
    priceRange: '$$',
    image: 'https://alugueldegames.com/logo.png',
    sameAs: [
        'https://wa.me/+551142377766',
        'https://instagram.com/alugueldegames'
    ],
    aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '127'
    }
}

export default function Home() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="flex flex-col items-center gap-10">
                <HomeShell/>

                {/* Título da seção de catálogo */}
                <div className="text-center px-4">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Nosso Catálogo
                    </h1>
                    <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Equipamentos de última geração para tornar seu evento inesquecível
                    </p>
                </div>

                {/* Catálogo com limite responsivo */}
                <CatalogList
                    order={['VR', 'Videokês',  'Máquinas', 'Fliperamas', 'Air Games']}
                    limitPerCat={4} // Desktop: 4 itens
                    limitPerCatMobile={3} // Mobile: 3 itens
                    isLandingPage={true}
                />
            </div>
        </>
    )
}