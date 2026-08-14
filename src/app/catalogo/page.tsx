import Catalogo from "@/components/catalogo/Catalogo";
import { ogImagens } from '@/lib/og';
import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site.config";

const url = `${getSiteUrl()}/catalogo/`;

// ⚠️ Esta página é destino natural de sitelink do Google Ads e não tinha
// canonical nem Open Graph. Sem canonical, apex e www podem ser indexados como
// páginas diferentes; sem og:image, o link compartilhado no WhatsApp (que é o
// canal de conversão deste negócio) sai sem imagem.
export const metadata: Metadata = {
    title: "Catálogo completo de equipamentos para festa e evento",
    description:
        "Fliperama, videokê, pinball, realidade virtual, consoles, pebolim, pula-pula e máquinas de prêmio para alugar em Osasco e Grande São Paulo. Orçamento pelo WhatsApp.",
    alternates: { canonical: url },
    openGraph: {
            images: ogImagens(),
        title: "Catálogo — Aluguel de Games",
        description:
            "Todos os equipamentos disponíveis para locação em Osasco e Grande São Paulo, desde 1993.",
        url,
        siteName: "Aluguel de Games",
        locale: "pt_BR",
        type: "website",
    },
};

export default function CatalogoPage() {
    return <Catalogo />;
}
