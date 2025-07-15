// src/lib/generateMetaTags.ts - Helper para meta tags consistentes
interface MetaTagsProps {
    title: string;
    description: string;
    image?: string;
    url: string;
    type?: 'website' | 'article' | 'product';
    keywords?: string[];
}

export function generateMetaTags({
                                     title,
                                     description,
                                     image,
                                     url,
                                     type = 'website',
                                     keywords = [],
                                 }: MetaTagsProps) {
    const siteName = 'Aluguel de Games';
    const defaultImage = 'https://www.alugueldegames.com/og-image.jpg';

    return {
        title: `${title} | ${siteName}`,
        description: description.slice(0, 160),
        keywords: keywords.join(', '),
        authors: [{ name: siteName }],
        creator: siteName,
        publisher: siteName,

        alternates: {
            canonical: url,
        },

        openGraph: {
            title,
            description,
            url,
            siteName,
            images: image ? [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: title,
                }
            ] : [{
                url: defaultImage,
                width: 1200,
                height: 630,
                alt: siteName,
            }],
            locale: 'pt_BR',
            type,
        },

        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: image ? [image] : [defaultImage],
            creator: '@alugueldegames',
        },

        robots: {
            index: true,
            follow: true,
            nocache: false,
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
            google: 'seu-codigo-google',
            yandex: 'seu-codigo-yandex',
        },
    };
}