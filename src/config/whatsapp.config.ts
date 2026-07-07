// src/config/whatsapp.config.ts
//
// Fonte única de link/telefone/prefill de WhatsApp.
// TODO CTA de WhatsApp do site passa por <WhatsAppCta> (src/components/cta),
// que consome getWaHref() daqui. Copy dos prefills: SPEC-FINAL-V1 §9.2/9.4
// (referenciada pela SPEC-FINAL-V2 §9.2).

export const WHATSAPP_CONFIG = {
    number: '11965261000',
    formattedNumber: '+5511965261000',
    displayNumber: '(11) 96526-1000',
    link: 'https://wa.me/5511965261000',
    message: {
        default: 'Oi! Quero um orçamento.\nData: ___\nBairro/cidade: ___',
        product: (productName: string) =>
            `Oi! Vi o *${productName}* no site e quero um orçamento.\nData: ___\nBairro/cidade: ___`,
    },
} as const;

/**
 * Superfícies de conversão (taxonomia GA4: whatsapp_click{surface,product}).
 * Cada superfície tem um prefill humano com lacunas (Data/Bairro/Convidados)
 * pro lead já chegar qualificado na conversa.
 */
export type WaSurface =
    | 'home'
    | 'category'
    | 'product'
    | 'empresas'
    | 'kit'
    | 'orcamento'
    | 'festas'
    | 'generic';

const PREFILLS: Record<WaSurface, (ctx?: string) => string> = {
    home: () =>
        'Oi! Quero um orçamento pra minha festa 🎉\nData: ___\nBairro/cidade: ___\nConvidados: ___\nItens: me ajuda a escolher',
    festas: () =>
        'Oi! Quero um orçamento pra minha festa 🎉\nData: ___\nBairro/cidade: ___\nConvidados: ___\nItens: me ajuda a escolher',
    category: (categoria) =>
        `Oi! Quero um orçamento de ${categoria ?? 'games'} pra minha festa.\nData: ___\nBairro/cidade: ___\nConvidados: ___`,
    product: (produto) =>
        `Oi! Vi o *${produto ?? 'equipamento'}* no site e quero um orçamento.\nData: ___\nBairro/cidade: ___`,
    kit: (kit) =>
        `Oi! Quero orçar o *Kit ${kit ?? ''}*.\nData: ___\nBairro: ___\nConvidados: ___`,
    empresas: () =>
        'Olá! Sou da empresa ___ e quero orçamento pra evento corporativo.\nTipo (SIPAT/confra/ativação): ___\nPessoas: ___\nData: ___\nCidade: ___',
    // Carrinho de orçamento (QuoteCart, fase 2): o texto multi-linha vem
    // pronto do drawer — aqui só repassa.
    orcamento: (mensagem) =>
        mensagem ?? 'Oi! Quero um orçamento.\nData: ___\nBairro/cidade: ___',
    generic: () => 'Oi! Quero um orçamento.\nData: ___\nBairro/cidade: ___',
};

/** Monta a mensagem pré-preenchida da superfície. */
export function getWaMessage(surface: WaSurface, context?: string): string {
    return PREFILLS[surface](context);
}

/** Href real de wa.me com ?text= pré-preenchido (fica no HTML servido). */
export function getWaHref(surface: WaSurface, context?: string): string {
    return `${WHATSAPP_CONFIG.link}?text=${encodeURIComponent(getWaMessage(surface, context))}`;
}

/** Compat: link com mensagem livre (usos legados). */
export const getWhatsAppLink = (message?: string) => {
    const baseUrl = WHATSAPP_CONFIG.link;
    if (message) {
        const encodedMessage = encodeURIComponent(message);
        return `${baseUrl}?text=${encodedMessage}`;
    }
    return baseUrl;
};
