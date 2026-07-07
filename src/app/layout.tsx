import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {ThemeProvider} from "@/components/theme-provider";
import JsonLd from "@/components/seo/JsonLd";
import { globalGraph } from "@/lib/schema";
import Script from "next/script";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { Bricolage_Grotesque, DM_Sans, JetBrains_Mono } from "next/font/google";

import type { Metadata } from "next";

const fontDisplay = Bricolage_Grotesque({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-display",
    weight: ["400", "600", "700", "800"],
});

const fontBody = DM_Sans({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-body",
    weight: ["400", "500", "600", "700"],
});

const fontMono = JetBrains_Mono({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-mono",
    weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://www.alugueldegames.com.br"),
    title: {
        template: "%s | Aluguel de Games SP",
        default: "Aluguel de Games SP | Fliperamas, Videokê e VR para Festas desde 1993",
    },
    description: "Desde 1993, aluguel de fliperamas, videokês, simuladores VR, consoles, pinball e máquinas de dança para festas e eventos em São Paulo. Entrega, montagem e suporte técnico inclusos.",
    openGraph: {
        type: "website",
        locale: "pt_BR",
        url: "https://www.alugueldegames.com.br/",
        siteName: "Aluguel de Games",
    },
    icons: {
        icon: "/Logo-Aluguel-de-games.ico",
        apple: "/Logo-Aluguel-de-games.ico",
    },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html className={`dark ${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`} lang="pt-br" suppressHydrationWarning>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <meta charSet="UTF-8"/>
            <Script id="gtm" strategy="afterInteractive">
                {`
                    (function(w,d,s,l,i){w[l]=w[l]||[];
                    w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
                    var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
                    j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                    f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
                `}
            </Script>
            <link rel="icon" href="/Logo-Aluguel-de-games.ico"/>
        </head>
        <body>
        <noscript>
            <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
                height="0"
                width="0"
                style={{display: 'none', visibility: 'hidden'}}
            />
        </noscript>
        <ThemeProvider
            defaultTheme="dark"
        >
            <div>
                <Header/>
                {children}
                <WhatsAppFloat />
                <Footer/>
            </div>
        </ThemeProvider>
        {/* JSON-LD global server-side: EntertainmentBusiness (foundingDate
            1993, areaServed, hasMap qdo confirmado) + WebSite. HTML cru. */}
        <JsonLd data={globalGraph()} />
        </body>
        </html>
    );
}