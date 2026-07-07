// src/lib/catalog-content.ts
//
// Conteúdo citável (answer capsule + FAQ) para categoria e produto.
// TUDO honesto e sem número inventado (spec §1.2/§1.3): onde faltaria um dado
// do dono (horas da diária, política de chuva formal), a copy responde SEM
// cravar número — nunca deixa buraco, nunca inventa. Reaproveitado:
//   - categoria: FAQ da categoria (spec §4.8) + capsule (§4.2)
//   - produto:   FAQ herdada da categoria quando o item não tem `faq` própria
//                (spec §7 "resto herda FAQ da categoria e omite tabela")

import type { FaqEntry } from '@/lib/schema';

/* ------------------------------------------------------------------ */
/* FAQ universal — vale pra qualquer equipamento (respostas honestas)   */
/* ------------------------------------------------------------------ */

const FAQ_QUANTO_CUSTA: FaqEntry = {
    question: 'Quanto custa para alugar?',
    answer:
        'Depende de três coisas: o equipamento, a data (fim de semana e dezembro lotam antes) e o bairro da entrega — sempre com entrega e montagem inclusas, sem taxa escondida. Alugando mais de um item junto, o combo sai melhor. Manda a data e o bairro no WhatsApp que a gente fecha o valor.',
};

const FAQ_ENTREGA: FaqEntry = {
    question: 'Como funciona a entrega e a montagem?',
    answer:
        'A gente entrega, monta e testa o equipamento no local antes da festa começar, e busca depois. Entrega, montagem e retirada já entram no orçamento. Atendemos Osasco e toda a Grande São Paulo.',
};

const FAQ_GARANTIA: FaqEntry = {
    // Copy §9.6 (garantia) — mesma redação no produto, na categoria e em /como-funciona.
    question: 'E se o equipamento der problema durante a festa?',
    answer:
        'A gente resolve: troca o equipamento ou manda um técnico no local, sem custo. Todo item sai testado da nossa base e vai com contrato — se algo falhar, o problema é nosso, não seu.',
};

const FAQ_PERIODO: FaqEntry = {
    // Período da diária = [CONFIRMAR COM DONO] → resposta sem cravar horas.
    question: 'Qual é o período da diária?',
    answer:
        'A diária cobre o período combinado para a sua festa, com entrega e retirada inclusas. Manda a data e o horário do evento no WhatsApp que a gente confirma tudo antes de fechar.',
};

const FAQ_BAIRRO: FaqEntry = {
    question: 'Vocês atendem o meu bairro?',
    answer:
        'Atendemos Osasco e toda a Grande São Paulo: capital, Barueri, Carapicuíba, Guarulhos, Santo André, São Bernardo e região. Manda o bairro ou a cidade no WhatsApp que a gente confirma a entrega.',
};

const FAQ_ANTECEDENCIA: FaqEntry = {
    question: 'Com quanta antecedência preciso reservar?',
    answer:
        'Quanto antes, melhor: fins de semana e o fim do ano (novembro e dezembro) enchem primeiro. Mas, mesmo em cima da hora, manda a data que a gente vê o que dá para encaixar.',
};

/** FAQ da categoria (spec §4.8: 4-6 itens). */
export function getCategoryFaq(): FaqEntry[] {
    return [
        FAQ_QUANTO_CUSTA,
        FAQ_ENTREGA,
        FAQ_GARANTIA,
        FAQ_PERIODO,
        FAQ_BAIRRO,
        FAQ_ANTECEDENCIA,
    ];
}

/** FAQ do produto (spec §4.8: 3-4 itens) — herdada quando o item não tem própria. */
export function getProductFaq(): FaqEntry[] {
    return [FAQ_GARANTIA, FAQ_ENTREGA, FAQ_PERIODO, FAQ_QUANTO_CUSTA];
}

/* ------------------------------------------------------------------ */
/* Answer capsules (40-80 palavras, sem número inventado)               */
/* ------------------------------------------------------------------ */

/** Cápsula da categoria — usa a CONTAGEM REAL de itens (nada inventado). */
export function buildCategoryCapsule(categoriaLabel: string, count: number): string {
    const nome = categoriaLabel.toLowerCase();
    const qtd =
        count > 0
            ? `${count} ${count === 1 ? 'opção' : 'opções'} de ${nome}`
            : `${nome}`;
    return `A Aluguel de Games tem ${qtd} para alugar em festas e eventos em Osasco e toda a Grande São Paulo. Você escolhe, a gente entrega montado e testado, com contrato e nota fiscal — e dá suporte durante a locação. Desde 1993. Peça o orçamento pelo WhatsApp.`;
}

/** Cápsula do produto — usa o `capsule` do metadata se houver, senão gera. */
export function buildProductCapsule(titulo: string, capsule?: string): string {
    if (capsule?.trim()) return capsule.trim();
    return `O ${titulo} é uma das atrações que a Aluguel de Games loca para festas e eventos em Osasco e toda a Grande São Paulo. A gente entrega, monta e testa antes do evento, com contrato e nota fiscal, e dá suporte durante a locação. Desde 1993. Peça o orçamento pelo WhatsApp.`;
}

/* ------------------------------------------------------------------ */
/* Chips "vai bem em" (spec §4.6 / §3 D2) — ocasião → LP do público      */
/* ------------------------------------------------------------------ */

export const OCCASION_CHIPS: { label: string; href: string }[] = [
    { label: 'Festa infantil', href: '/festas#infantil' },
    { label: 'Aniversário adulto', href: '/festas#adulto' },
    { label: 'Evento de empresa', href: '/empresas' },
];
