export const WHATSAPP_CONFIG = {
    number: '11965261000',
    formattedNumber: '+5511965261000',
    displayNumber: '(11) 96526-1000',
    link: 'https://wa.me/5511965261000',
    message: {
        default: 'Olá! Gostaria de mais informações sobre o aluguel de brinquedos.',
        product: (productName: string) => `Olá! Gostaria de mais informações sobre o aluguel do brinquedo: ${productName}`,
    }
} as const;

export const getWhatsAppLink = (message?: string) => {
    const baseUrl = WHATSAPP_CONFIG.link;
    if (message) {
        const encodedMessage = encodeURIComponent(message);
        return `${baseUrl}?text=${encodedMessage}`;
    }
    return baseUrl;
};