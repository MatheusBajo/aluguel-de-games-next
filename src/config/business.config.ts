// src/config/business.config.ts
//
// Dados de negócio (NAP, CNPJ, horário, GBP). Fonte única pra footer,
// JSON-LD e CTAs.
//
// REGRA DO FALLBACK (SPEC-FINAL-V2 §1.3): slot sem dado NÃO renderiza.
// Campo `null` = dado ainda não confirmado pelo dono → o componente que
// consome DEVE omitir o bloco correspondente (nunca inventar valor).
// Quando o dono confirmar, é só preencher aqui (ver DONO-CHECKLIST.md).

export const BUSINESS = {
    name: "Aluguel de Games",
    legalName: null as string | null, // [CONFIRMAR COM DONO: razão social]
    cnpj: null as string | null, // [CONFIRMAR COM DONO: CNPJ]
    foundingYear: 1993,

    // NAP — Name/Address/Phone (precisa ser idêntico ao GBP quando confirmado)
    phoneDisplay: "(11) 96526-1000",
    phoneE164: "+5511965261000",
    email: "contato@alugueldegames.com.br",
    address: {
        street: null as string | null, // [CONFIRMAR COM DONO: logradouro completo]
        locality: "Osasco",
        region: "SP",
        country: "BR",
        postalCode: null as string | null, // [CONFIRMAR COM DONO: CEP]
    },

    // Área de atendimento (claim já público no site atual)
    areaServed: [
        "Osasco",
        "São Paulo",
        "Barueri",
        "Carapicuíba",
        "Guarulhos",
        "Santo André",
        "São Bernardo do Campo",
    ],

    // Horário de atendimento. null = não confirmado → CTAs usam a versão
    // sem número ("respondemos no horário comercial").
    // [CONFIRMAR COM DONO: horário, ex { open: 9, close: 18, days: "seg-sex" }]
    hours: null as { open: number; close: number; label: string } | null,

    // Google Business Profile. null = não confirmado → hasMap/"avalie no
    // Google" não renderizam. [CONFIRMAR COM DONO: link do perfil no Maps]
    gbpUrl: null as string | null,

    social: {
        instagram: "https://instagram.com/alugueldegames",
        facebook: "https://facebook.com/alugueldegames",
    },
} as const;

/** Anos de mercado — ÚNICO counter permitido no site (derivado de 1993). */
export function anosDeMercado(): number {
    return new Date().getFullYear() - BUSINESS.foundingYear;
}
