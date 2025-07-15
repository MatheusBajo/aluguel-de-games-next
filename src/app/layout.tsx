import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {ThemeProvider} from "@/components/theme-provider";
import SchemaMarkup from "@/components/seo/SchemaMarkup";
import Script from "next/script";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import type { Metadata } from "next";

export const metadata: Metadata = {
    metadataBase: new URL("https://alugueldegames.com"),
    title: {
        template: "%s | Aluguel de Games",
        default: "Aluguel de Games",
    },
    description: "Aluguel de fliperamas, karaokês e entretenimento para eventos",
    openGraph: {
        type: "website",
        locale: "pt_BR",
        url: "https://www.alugueldegames.com/",
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
        <html className={""} lang="pt-br" suppressHydrationWarning>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <meta charSet="UTF-8"/>
            <link rel="manifest" href="/manifest.webmanifest"/>
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
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
        >
            <Header/>
            {children}
            <WhatsAppFloat />
            <Footer/>
        </ThemeProvider>
        <SchemaMarkup/>
        </body>
        </html>
    );
}