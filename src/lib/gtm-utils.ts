// src/lib/gtm-utils.ts

declare global {
    interface Window {
        dataLayer: any[];
    }
}

/**
 * Envia evento para o Google Tag Manager
 */
export function trackEvent(eventName: string, parameters?: Record<string, any>) {
    if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
            event: eventName,
            ...parameters
        });
    }
}

/**
 * Rastreia cliques no WhatsApp
 */
export function trackWhatsAppClick(location: string, additionalData?: Record<string, any>) {
    trackEvent('whatsapp_click', {
        click_location: location,
        timestamp: new Date().toISOString(),
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