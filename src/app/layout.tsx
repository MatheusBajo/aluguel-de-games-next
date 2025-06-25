import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata = {
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
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html className={"dark"} lang="pt-br" suppressHydrationWarning>
        <body>
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
        </body>
        </html>
    );
}
