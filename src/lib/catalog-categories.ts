// src/lib/catalog-categories.ts
//
// Metadata SEO-otimizada para páginas de listagem de categoria.
// Cada categoria principal tem H1, descrição e meta title customizados.
// Categorias sem entrada usam fallback genérico.

export type CategoryMetadata = {
    /** H1 da página - a "headline" principal, otimizada pra SEO */
    title: string;
    /** Parágrafo introdutório (também usado como meta description) */
    description: string;
    /** <title> do navegador. Se omitido, usa o `title` */
    metaTitle?: string;
    /** Título amigável usado em breadcrumbs e navegação */
    breadcrumbName?: string;
};

/**
 * Metadata por slug de categoria. Slugs são em kebab-case sem acentos.
 * Adicionar/refinar aqui conforme novas categorias forem criadas.
 */
export const CATEGORIES: Record<string, CategoryMetadata> = {
    // ===== Categorias top-level =====
    'jogos-eletronicos': {
        title: 'Aluguel de Jogos Eletrônicos para Festas e Eventos em SP',
        metaTitle: 'Aluguel de Jogos Eletrônicos em SP | Aluguel de Games',
        description:
            'Locação de fliperamas, consoles, simuladores, máquinas e pinballs para festas, eventos corporativos, casamentos e formaturas em São Paulo. Desde 1993, com entrega, montagem e suporte técnico inclusos.',
        breadcrumbName: 'Jogos Eletrônicos',
    },
    'jogos-de-mesa': {
        title: 'Aluguel de Jogos de Mesa para Festas e Eventos em SP',
        metaTitle: 'Aluguel de Jogos de Mesa em SP | Aluguel de Games',
        description:
            'Mesa de sinuca, pebolim, air game, basquete, tênis de mesa e mais. Equipamentos para descontrair sua festa ou evento corporativo em São Paulo. Entrega e montagem inclusos.',
        breadcrumbName: 'Jogos de Mesa',
    },
    'realidade-virtual': {
        title: 'Aluguel de Realidade Virtual (VR) para Festas e Eventos em SP',
        metaTitle: 'Aluguel de Realidade Virtual em SP | VR para Eventos',
        description:
            'Simuladores de realidade virtual, Oculus Quest, PlayStation VR e mais. Experiência imersiva que encanta convidados de todas as idades em festas e eventos corporativos em São Paulo.',
        breadcrumbName: 'Realidade Virtual',
    },
    'videokes': {
        title: 'Aluguel de Videokê e Karaokê para Festas e Eventos em SP',
        metaTitle: 'Aluguel de Videokê em SP | Karaokê para Eventos',
        description:
            'Videokê profissional com mais de 30.000 músicas, letra na tela e caixa de som potente. Transforme qualquer festa em um show de karaokê. Atendemos toda a Grande SP.',
        breadcrumbName: 'Videokês',
    },
    'piscinas-inflaveis-cama-elastica-infantil': {
        title: 'Aluguel de Piscinas Infláveis e Cama Elástica para Festa Infantil',
        metaTitle: 'Aluguel de Infláveis e Cama Elástica em SP',
        description:
            'Cama elástica, piscina de bolinhas, balão pula-pula, carrinho infantil e muito mais. Diversão garantida para festas infantis em São Paulo, com segurança e qualidade.',
        breadcrumbName: 'Infláveis e Infantil',
    },
    'projetores-extras': {
        title: 'Aluguel de Projetores, Mesas e Acessórios para Eventos em SP',
        metaTitle: 'Aluguel de Projetores e Mesas para Eventos | SP',
        description:
            'Projetores, mesas de carteado, beer pong, plataforma 360, mesas e cadeiras para complementar seu evento em São Paulo. Pacote completo de entretenimento e infraestrutura.',
        breadcrumbName: 'Projetores e Extras',
    },

    // ===== Subcategorias (segundo nível) =====
    'jogos-eletronicos/fliperamas': {
        title: 'Aluguel de Fliperama para Festas e Eventos em São Paulo',
        metaTitle: 'Aluguel de Fliperama em SP | Festas e Eventos',
        description:
            'Fliperamas multijogos com até 11.000 jogos clássicos: Street Fighter, Metal Slug, Pac-Man, Mortal Kombat, e muito mais. Diversão garantida pra todas as idades. Entrega, montagem e suporte técnico inclusos.',
        breadcrumbName: 'Fliperamas',
    },
    'jogos-eletronicos/consoles': {
        title: 'Aluguel de Consoles para Festas e Eventos em SP',
        metaTitle: 'Aluguel de PS5, Xbox, Switch e Mais | Aluguel de Games',
        description:
            'PlayStation 5, PS4, Xbox One, Xbox 360, Nintendo Wii, Atari e mais. Consoles montados com TV grande e jogos pré-instalados, prontos para sua festa em São Paulo.',
        breadcrumbName: 'Consoles',
    },
    'jogos-eletronicos/pinballs': {
        title: 'Aluguel de Pinball para Festas e Eventos em São Paulo',
        metaTitle: 'Aluguel de Pinball em SP | Máquinas Clássicas',
        description:
            'Pinballs clássicos e digitais: Pinball 007, Capcom Football, Magic, No Fear e mais. A nostalgia dos arcades direto na sua festa ou evento corporativo em São Paulo.',
        breadcrumbName: 'Pinballs',
    },
    'jogos-eletronicos/maquinas': {
        title: 'Aluguel de Máquinas Arcade para Festas em SP',
        metaTitle: 'Aluguel de Máquinas Arcade em SP | Boxe, Dança, Martelo',
        description:
            'Máquina de boxe, máquina de dança (DDR), máquina martelo, máquinas de pegar bichinho (grua) e muito mais. Atrações que viram destaque do seu evento.',
        breadcrumbName: 'Máquinas',
    },
    'jogos-eletronicos/simuladores': {
        title: 'Aluguel de Simuladores para Eventos em São Paulo',
        metaTitle: 'Aluguel de Simulador de Corrida e Montanha-Russa | SP',
        description:
            'Simulador de corrida e simulador de montanha-russa para uma experiência imersiva em festas e eventos corporativos. Transformamos seu evento em parque de diversões.',
        breadcrumbName: 'Simuladores',
    },

    // ===== Subcategorias (terceiro nível) =====
    'jogos-eletronicos/consoles/playstation': {
        title: 'Aluguel de PlayStation para Festas em SP (PS3, PS4, PS5)',
        metaTitle: 'Aluguel de PlayStation em SP | PS3, PS4, PS5',
        description:
            'Aluguel de PlayStation 3, 4 e 5 com TVs, controles extras e jogos populares pré-instalados. Pacote Rock Band também disponível. Atendemos toda a Grande SP.',
        breadcrumbName: 'PlayStation',
    },
    'jogos-eletronicos/consoles/xbox': {
        title: 'Aluguel de Xbox para Festas em SP (Xbox 360 e Xbox One)',
        metaTitle: 'Aluguel de Xbox 360 e Xbox One em SP | Festas',
        description:
            'Aluguel de Xbox 360 e Xbox One com TVs, controles e jogos populares. Ideal pra festas, eventos corporativos e confraternizações em São Paulo.',
        breadcrumbName: 'Xbox',
    },
    'jogos-eletronicos/consoles/nintendo': {
        title: 'Aluguel de Nintendo Wii para Festas em São Paulo',
        metaTitle: 'Aluguel de Nintendo Wii em SP | Just Dance, Wii Sports',
        description:
            'Nintendo Wii com Just Dance, Wii Sports e jogos clássicos. Diversão interativa que faz sucesso em festas infantis e eventos corporativos em SP.',
        breadcrumbName: 'Nintendo',
    },
    'jogos-de-mesa/air-games': {
        title: 'Aluguel de Air Game para Festas em São Paulo',
        metaTitle: 'Aluguel de Air Game em SP | Hockey de Mesa',
        description:
            'Air games (air hockey) infantil, tradicional, super metal e quântico. Mesas profissionais com efeitos de luz e som para festas memoráveis.',
        breadcrumbName: 'Air Games',
    },
    'videokes/karaokes': {
        title: 'Aluguel de Karaokê para Festas em São Paulo',
        metaTitle: 'Aluguel de Karaokê em SP | Festas e Eventos',
        description:
            'Karaokês profissionais com microfones sem fio, caixa de som potente e biblioteca enorme de músicas nacionais e internacionais. Transforme sua festa em um show.',
        breadcrumbName: 'Karaokês',
    },
};

/**
 * Gera metadata genérica baseada no slug, para categorias sem entrada customizada.
 */
function generateFallback(slug: string[]): CategoryMetadata {
    const lastSegment = slug[slug.length - 1] || 'categoria';
    const readable = lastSegment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());

    return {
        title: `Aluguel de ${readable} para Festas e Eventos em São Paulo`,
        metaTitle: `Aluguel de ${readable} em SP | Aluguel de Games`,
        description: `Confira nossa seleção de ${readable.toLowerCase()} para alugar em festas e eventos em São Paulo. Desde 1993, com entrega, montagem e suporte técnico inclusos.`,
        breadcrumbName: readable,
    };
}

/**
 * Retorna a metadata da categoria pelo slug. Usa fallback se não houver entrada customizada.
 */
export function getCategoryMetadata(slug: string[]): CategoryMetadata {
    const key = slug.join('/');
    return CATEGORIES[key] ?? generateFallback(slug);
}
