// src/config/whatsapp.config.ts
//
// Fonte única de verdade pra conversão WhatsApp/telefone.
// Todo CTA de WhatsApp do site passa por <WhatsAppCta> (src/components/cta/WhatsAppCta.tsx),
// que consome os prefills daqui. NUNCA gerar link wa.me na mão em componente.

export const WHATSAPP_CONFIG = {
    number: '11965261000',
    formattedNumber: '+5511965261000',
    displayNumber: '(11) 96526-1000',
    link: 'https://wa.me/5511965261000',
} as const;

/**
 * Horário de atendimento.
 * [CONFIRMAR COM DONO: horário real de atendimento (abre/fecha, sábado?)]
 * Enquanto `confirmed: false`, NENHUM horário específico é renderizado no site
 * (regra do fallback: slot sem dado confirmado não renderiza número nenhum).
 */
export const ATTENDANCE_HOURS = {
    opens: '9h',
    closes: '18h',
    confirmed: false,
} as const;

/** Linha de apoio fora-do-horário — os DOIS estados desenhados (spec §1.7 + §1.3). */
export function getHoursLine(): string {
    if (ATTENDANCE_HOURS.confirmed) {
        return `Atendemos das ${ATTENDANCE_HOURS.opens} às ${ATTENDANCE_HOURS.closes}. Fora do horário? Manda mesmo assim — respondemos no próximo período de atendimento.`;
    }
    return 'Fora do horário comercial? Manda mesmo assim — respondemos no próximo período de atendimento.';
}

/**
 * Superfícies de conversão (spec §7). Cada uma tem prefill próprio,
 * humano e com lacunas pra pessoa preencher (Data/Bairro/Convidados).
 */
export type WhatsAppSurface =
    | 'home'
    | 'category'
    | 'product'
    | 'empresas'
    | 'kit'
    | 'orcamento'
    | 'festas'
    | 'global';

const PREFILL_HOME = `Oi! Quero um orçamento pra minha festa 🎉
Data: ___
Bairro/cidade: ___
Convidados: ___
Itens: me ajuda a escolher`;

const PREFILL_EMPRESAS = `Olá! Sou da empresa ___ e quero orçamento pra evento corporativo.
Tipo (SIPAT/confra/ativação): ___
Pessoas: ___
Data: ___
Cidade: ___`;

const PREFILL_FESTAS = `Oi! Tô montando uma festa e quero um orçamento.
Ocasião: ___
Data: ___
Bairro/cidade: ___
Convidados: ___`;

/**
 * Monta a mensagem prefill de uma superfície.
 * `context.product` = nome do produto ou da categoria (quando aplicável).
 * `context.message` = override completo (ex.: wa.me multi-linha do carrinho de orçamento).
 */
export function buildWhatsAppMessage(
    surface: WhatsAppSurface,
    context?: { product?: string; message?: string }
): string {
    if (context?.message) return context.message;

    switch (surface) {
        case 'product':
            return context?.product
                ? `Oi! Vi o *${context.product}* no site e quero um orçamento.\nData: ___\nBairro/cidade: ___`
                : PREFILL_HOME;
        case 'category':
            return context?.product
                ? `Oi! Quero um orçamento de ${context.product} pra minha festa.\nData: ___\nBairro/cidade: ___`
                : PREFILL_HOME;
        case 'empresas':
        case 'kit':
            return PREFILL_EMPRESAS;
        case 'festas':
            return PREFILL_FESTAS;
        case 'orcamento':
        case 'home':
        case 'global':
        default:
            return PREFILL_HOME;
    }
}

/** URL wa.me completa com ?text= pré-preenchido pra superfície. */
export function buildWhatsAppUrl(
    surface: WhatsAppSurface,
    context?: { product?: string; message?: string }
): string {
    const message = buildWhatsAppMessage(surface, context);
    return `${WHATSAPP_CONFIG.link}?text=${encodeURIComponent(message)}`;
}

/** Compat: link com mensagem custom (usado por código legado; prefira buildWhatsAppUrl). */
export const getWhatsAppLink = (message?: string) => {
    if (message) {
        return `${WHATSAPP_CONFIG.link}?text=${encodeURIComponent(message)}`;
    }
    return WHATSAPP_CONFIG.link;
};
