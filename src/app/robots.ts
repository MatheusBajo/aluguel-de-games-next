// src/app/robots.ts
//
// FONTE ÚNICA do robots.txt. O public/robots.txt foi apagado: quando os dois
// existem, o arquivo estático de public/ vence e este aqui vira código morto.
export const dynamic    = "force-static";
export const revalidate = false;
import { MetadataRoute } from 'next';

/**
 * Bots de IA liberados DE PROPÓSITO. Não bloquear sem ler isto antes.
 *
 * A distinção que importa: cada empresa tem um bot de TREINO e outro de BUSCA.
 * Bloquear o de treino NÃO tira o site das respostas; bloquear o de busca tira.
 * Este negócio vive de ser lembrado quando alguém pergunta "onde alugo fliperama
 * em Osasco" — estar no corpus e no índice das IAs é o produto, não o risco.
 *
 *   OAI-SearchBot    busca do ChatGPT      (é ele que tira do ChatGPT, não o GPTBot)
 *   GPTBot           treino da OpenAI
 *   ChatGPT-User     usuário pedindo pro ChatGPT abrir o link
 *   ClaudeBot        treino da Anthropic
 *   Claude-SearchBot busca do Claude
 *   Claude-User      usuário pedindo pro Claude abrir o link
 *   PerplexityBot    citação da Perplexity (a doc deles diz que NÃO treina modelo)
 *   Perplexity-User  usuário pedindo pra Perplexity abrir o link
 *   Meta-WebIndexer  busca da Meta  → é o que faz aparecer na Meta AI DENTRO do
 *                                     WhatsApp e do Instagram, onde está o público
 *   meta-externalagent   treino da Meta
 *   Applebot-Extended    treino da Apple
 *   Google-Extended      treino do Gemini. Bloquear NÃO tira do AI Overviews
 *                        (isso vem do índice do Googlebot) e não é sinal de ranking.
 *
 * ⚠️ NUNCA usar coringa em "meta" ou "facebook", e nunca bloquear
 * facebookexternalhit: é ELE que gera o preview de link no WhatsApp. Bloquear
 * quebra o cartão de todo link que a família manda pro cliente — e o WhatsApp
 * é o canal de conversão do site.
 */
const AI_BOTS = [
    'OAI-SearchBot',
    'GPTBot',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-SearchBot',
    'Claude-User',
    'PerplexityBot',
    'Perplexity-User',
    'Meta-WebIndexer',
    'meta-externalagent',
    'Applebot-Extended',
    'Google-Extended',
];

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/admin/',
                    '/_next/',
                    '/static/',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
            },
            {
                userAgent: AI_BOTS,
                allow: '/',
            },
        ],
        sitemap: 'https://www.alugueldegames.com.br/sitemap.xml',
        // `host` é diretiva do Yandex. Google ignora, nenhum bot de IA usa.
        // O canônico de verdade é o 301 apex→www do .htaccess + <link rel=canonical>.
    };
}
