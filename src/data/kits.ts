// src/data/kits.ts
//
// Kits curados da home (SPEC-FINAL-V2 §3.5). Curadoria HONESTA: cada kit
// descreve equipamentos reais do catálogo — sem preço inventado e sem número
// de convidados fabricado. `guests` fica null até o dono assinar (gate 1.6):
// card sem preço/convidados NÃO tem buraco (a linha simplesmente não renderiza).
// Preço fechado, quando o dono confirmar escopo, entra AQUI primeiro.

export interface Kit {
    id: string;
    /** Nome usado no card e no prefill do WhatsApp (surface "kit"). */
    name: string;
    tagline: string;
    /** 3-4 itens reais que compõem o kit (texto). */
    items: string[];
    image: string;
    imageAlt: string;
    /** Destino do link "ver mais desse tipo". */
    href: string;
    /** "ideal pra X convidados" — null = [CONFIRMAR], não renderiza. */
    guests: string | null;
    /** Preço fechado — null = 2 estados (sem card celebrando ausência). */
    price: string | null;
    accent: string;
}

export const KITS: Kit[] = [
    {
        id: "teen-retro",
        name: "Festa Teen/Retrô",
        tagline: "A esquina dos anos 90 na sua festa.",
        items: ["Fliperama multijogos", "Pinball clássico", "Videokê", "Air game"],
        image: "/carousel/compressed/Pebolim e dois fliperamas.webp",
        imageAlt: "Pebolim e dois fliperamas montados em evento",
        href: "/catalogo/jogos-eletronicos/fliperamas/",
        guests: null,
        price: null,
        accent: "text-cyan-400",
    },
    {
        id: "confra-sipat",
        name: "Confra/SIPAT",
        tagline: "Integração e diversão pra galera da empresa.",
        items: ["Fliperamas", "Máquina de boxe", "Simulador de corrida", "Realidade virtual"],
        image: "/carousel/compressed/Braland.webp",
        imageAlt: "Ativação corporativa do Bradesco (Braland) com games",
        href: "/empresas",
        guests: null,
        price: null,
        accent: "text-purple-400",
    },
    {
        id: "infantil",
        name: "Infantil",
        tagline: "A criançada não para um minuto.",
        items: ["Cama elástica", "Piscina de bolinhas", "Air game infantil", "Just Dance (Wii)"],
        image: "/demonstra/photo_4997175938043194978_y.webp",
        imageAlt: "Máquina de pegar bichinho de pelúcia em festa infantil",
        href: "/festas#infantil",
        guests: null,
        price: null,
        accent: "text-pink-400",
    },
];
