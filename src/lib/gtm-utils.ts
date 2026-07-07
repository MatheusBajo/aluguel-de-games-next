// src/lib/gtm-utils.ts

declare global {
    interface Window {
        dataLayer: unknown[];
    }
}

/**
 * Função genérica para enviar eventos para a camada de dados do GTM.
 * @param eventName - O nome do evento que será usado no acionador do GTM.
 * @param eventData - Um objeto com todos os parâmetros a serem enviados.
 */
export function trackEvent(eventName: string, eventData: Record<string, unknown>) {
    // Garante que o dataLayer exista no objeto window
    window.dataLayer = window.dataLayer || [];

    // Envia o objeto para a camada de dados.
    // A chave 'event' é o que o GTM usa para identificar um evento.
    // O '...eventData' adiciona todos os outros parâmetros que enviamos.
    window.dataLayer.push({
        'event': eventName,
        ...eventData
    });
}

/**
 * Rastreia clique em CTA de WhatsApp (taxonomia GA4 da spec §8):
 * whatsapp_click{surface, product}
 * @param surface - Superfície de conversão (home|category|product|empresas|kit|orcamento|festas|global).
 * @param additionalData - Parâmetros extras (ex.: product).
 */
export function trackWhatsAppClick(surface: string, additionalData?: Record<string, unknown>) {
    trackEvent('whatsapp_click', {
        surface,
        ...additionalData
    });
}

/**
 * Rastreia clique em link tel: (conversão de 1ª classe, mesma taxonomia).
 */
export function trackTelClick(surface: string, additionalData?: Record<string, unknown>) {
    trackEvent('tel_click', {
        surface,
        ...additionalData
    });
}

/**
 * Rastreia visualização de produto
 */
export function trackProductView(product: {
    name: string;
    category: string;
    id?: string;
}) {
    trackEvent('view_item', {
        currency: 'BRL',
        value: 0,
        items: [{
            item_name: product.name,
            item_category: product.category,
            item_id: product.id || product.name.toLowerCase().replace(/\s+/g, '-')
        }]
    });
}

/**
 * Rastreia download/visualização do kit de aprovação B2B (taxonomia §8):
 * kit_pdf_download
 */
export function trackKitDownload(additionalData?: Record<string, unknown>) {
    trackEvent('kit_pdf_download', { surface: 'kit', ...additionalData });
}

/**
 * Rastreia envio do formulário corporativo (taxonomia §8): form_submit_b2b
 */
export function trackFormSubmitB2b(additionalData?: Record<string, unknown>) {
    trackEvent('form_submit_b2b', { surface: 'empresas', ...additionalData });
}

/**
 * Rastreia envio de formulário
 */
export function trackFormSubmit(formName: string, formData?: Record<string, unknown>) {
    trackEvent('form_submit', {
        form_name: formName,
        form_data: formData,
        timestamp: new Date().toISOString()
    });
}

/**
 * Rastreia navegação no catálogo
 */
export function trackCatalogNavigation(category: string, action: string) {
    trackEvent('catalog_interaction', {
        category,
        action,
        timestamp: new Date().toISOString()
    });
}