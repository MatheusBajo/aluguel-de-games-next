import Catalogo from "@/components/catalogo/Catalogo";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Catálogo Completo | Aluguel de Equipamentos para Festas em SP",
    description: "Veja o catálogo completo de equipamentos de entretenimento para alugar em São Paulo: fliperamas, videokês, realidade virtual, consoles, pinball, máquinas de dança e muito mais. Desde 1993.",
    alternates: { canonical: "https://www.alugueldegames.com.br/catalogo" },
    openGraph: {
        title: "Catálogo Completo de Equipamentos para Festas e Eventos",
        description: "Fliperamas, videokês, realidade virtual, consoles, pinball e mais para sua festa ou evento corporativo em São Paulo. Entrega, montagem e suporte técnico inclusos. Desde 1993.",
        url: "https://www.alugueldegames.com.br/catalogo",
        siteName: "Aluguel de Games",
        locale: "pt_BR",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Catálogo - Aluguel de Games SP",
        description: "Fliperamas, videokês, VR, consoles e mais para festas e eventos em São Paulo. Desde 1993.",
    },
};

export default function CatalogoPage() {
    return <Catalogo />;
}
