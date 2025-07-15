// src/lib/gtm-utils.ts

declare global {
    interface Window {
        dataLayer: any[];
    }
}

/**
 * Função genérica para enviar eventos para a camada de dados do GTM.
 * @param eventName - O nome do evento que será usado no acionador do GTM.
 * @param eventData - Um objeto com todos os parâmetros a serem enviados.
 */
export function trackEvent(eventName: string, eventData: Record<string, any>) {
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
 * Função específica para rastrear cliques de WhatsApp.
 * @param location - String que identifica o local do clique no site.
 * @param additionalData - Quaisquer outros dados a serem enviados.
 */
export function trackWhatsAppClick(location: string, additionalData?: Record<string, any>) {
    trackEvent('whatsapp_click', {
        click_location: location,
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
 * Rastreia envio de formulário
 */
export function trackFormSubmit(formName: string, formData?: Record<string, any>) {
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