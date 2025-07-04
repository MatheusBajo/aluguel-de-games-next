import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {ThemeProvider} from "@/components/theme-provider";
import SchemaMarkup from "@/components/seo/SchemaMarkup";
import Script from "next/script";

export const metadata = {
    title: {
        template: "%s | Aluguel de Games",
        default: "Aluguel de Games",
    },
    icons: {
        icon: "/Logo-Aluguel-de-games.ico",
        apple: "/Logo-Aluguel-de-games.ico",
    },
    description: "Aluguel de fliperamas, karaokês e entretenimento para eventos",
    openGraph: {
        type: "website",
        locale: "pt_BR",
        url: "https://www.alugueldegames.com/",
        siteName: "Aluguel de Games",

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
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <Header/>
            {children}
            <a
                href="https://wa.me/+551142377766"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-4 right-4 z-50 drop-shadow-primary lg:m-6 m-0 p-0 select-none"
            >
                <img
                    src="/WhatsApp-logo-42377766.png"
                    alt="WhatsApp"
                    className="lg:size-25 size-16 object-contain"
                />
            </a>
            <Footer/>
        </ThemeProvider>
        <SchemaMarkup/>
        </body>
        </html>
    );
}
