// src/components/catalogo/Catalogo.tsx
//
// Hub do catálogo (SPEC-FINAL-V2 §2): SEM busca (proibição do brief), headings
// de categoria viram LINKS pras LPs, ordem curada. Answer capsule no topo
// (texto corrido extraível). SERVER component — zero JS aqui.
import CatalogList from "@/app/catalogo/CatalogList.server";
import { WhatsAppCta, PhoneSupportLine } from "@/components/cta/WhatsAppCta";

// Ordem curada das categorias nível-1 (NFC — casada com o nome real da pasta
// dentro do CatalogList, que normaliza os dois lados).
const CURATED_ORDER = [
    "Jogos Eletrônicos",
    "Videokês",
    "Realidade Virtual",
    "Jogos de Mesa",
    "Piscinas, Infláveis, Cama Elástica, Infantil",
    "Projetores & Extras",
];

export default async function Catalogo() {
    return (
        <main className="relative mx-auto max-w-screen-2xl px-4 py-12">
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -left-4 top-20 h-72 w-72 rounded-full bg-primary-blue/10 blur-3xl" />
                <div className="absolute -right-4 top-96 h-72 w-72 rounded-full bg-primary-purple/10 blur-3xl" />
            </div>

            {/* Header */}
            <div className="mb-10 text-center">
                <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
                    Catálogo de aluguel para festas e eventos
                </h1>
                {/* Answer capsule (texto corrido extraível — SEO/GEO) */}
                <p className="mx-auto max-w-3xl text-base md:text-lg text-muted-foreground leading-relaxed">
                    Fliperamas, videokês, PS5, realidade virtual, pinball, máquinas de dança, jogos de
                    mesa e brinquedos infláveis para alugar em Osasco e toda a Grande São Paulo. A gente
                    entrega montado e testado, com contrato e nota fiscal. Escolhe abaixo e pede o
                    orçamento pelo WhatsApp. Desde 1993.
                </p>

                <div className="mt-6 flex flex-col items-center gap-2">
                    <WhatsAppCta
                        surface="category"
                        location="catalog_hub"
                        label="Pedir orçamento no WhatsApp"
                    />
                    <PhoneSupportLine surface="category" location="catalog_hub" className="text-center" />
                </div>
            </div>

            {/* Catalog */}
            <CatalogList order={CURATED_ORDER} />
        </main>
    );
}
