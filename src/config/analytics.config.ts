// src/config/analytics.config.ts
//
// ⚠️ POR QUE ISTO É UM ARQUIVO COMMITADO E NÃO UMA VARIÁVEL DE AMBIENTE
//
// Entre 13/08/2026 e 20/08/2026 o site ficou SEM RASTREAMENTO NENHUM. O
// layout.tsx lia `process.env.NEXT_PUBLIC_GTM_ID`, que só existia no
// .env.local da máquina do dev. O .env.local NÃO vai pro git (e nem deve).
// Quando o GitHub Actions buildou, a variável não existia, e o Next colocou
// a string literal "undefined" no lugar:
//
//     https://www.googletagmanager.com/ns.html?id=undefined
//     https://www.googletagmanager.com/gtm.js?id=
//
// Sem o ID o container do GTM nunca carrega. E como o GA4 e a tag de
// conversão do Google Ads vivem DENTRO do container, morreu tudo junto:
// zero page_view, zero clique de WhatsApp, zero conversão. O dono só
// percebeu pelas campanhas despencando.
//
// O detalhe que torna isso um erro de arquitetura, não um acidente:
// ID de container do GTM NÃO É SEGREDO. Ele aparece no HTML de toda página
// de todo site que usa GTM — qualquer um lê com Ctrl+U. Tratar como segredo
// não protegeu nada e criou um ponto de falha silencioso.
//
// Agora o valor mora aqui, versionado. Um clone limpo, o CI, ou qualquer
// máquina nova buildam com rastreamento funcionando, sem depender de
// ninguém lembrar de copiar um .env.
//
// A variável de ambiente continua funcionando, para quando alguém quiser
// apontar um container de teste sem mexer no código.

/**
 * Container do Google Tag Manager.
 * Dentro dele vivem o GA4 e a tag de conversão do Google Ads.
 * Confirmado em produção em 09/08/2026 e no histórico do git.
 */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-WN24XLQC';

/**
 * Trava de build. Roda no servidor, durante o `next build`.
 *
 * Se o ID sumir, vier vazio ou vier com a string "undefined", o BUILD QUEBRA
 * em vez de gerar um site mudo. Falhar alto no CI é muito melhor que
 * descobrir sete dias depois que as campanhas pararam de converter.
 */
export function assertGtmId(): void {
    const id = GTM_ID;
    if (!id || id === 'undefined' || id === 'null' || !/^GTM-[A-Z0-9]{6,}$/.test(id)) {
        throw new Error(
            `[analytics] GTM_ID inválido: ${JSON.stringify(id)}.\n` +
            `Esperado algo como "GTM-WN24XLQC".\n` +
            `Foi exatamente isto que deixou o site sem rastreamento de 13 a 20/08/2026.\n` +
            `Conserte em src/config/analytics.config.ts ou em NEXT_PUBLIC_GTM_ID.`
        );
    }
}
