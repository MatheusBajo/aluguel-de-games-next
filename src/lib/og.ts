import { getSiteUrl } from '@/lib/site.config'

/**
 * Imagem padrão de preview de link (Open Graph).
 *
 * ⚠️ POR QUE ISTO EXISTE — leia antes de declarar `openGraph` numa página nova.
 *
 * No Next.js, quando uma página declara `openGraph` no seu metadata, ela
 * SUBSTITUI o bloco `openGraph` do layout INTEIRO — não faz merge campo a
 * campo. Ou seja: a página que declara `openGraph: { title, description }`
 * sem `images` fica COMPLETAMENTE SEM og:image, mesmo com o layout tendo uma.
 *
 * Foi exatamente o que aconteceu: 20 páginas (a /catalogo/, as 15 categorias e
 * 4 institucionais) foram pro ar sem imagem de preview nenhuma. E o preview de
 * link importa mais aqui que na média, porque o canal de conversão deste
 * negócio é o WhatsApp: é essa a imagem que aparece toda vez que alguém
 * encaminha o link pra um amigo ou pro grupo da festa.
 *
 * REGRA: toda página que declarar `openGraph` tem que espalhar `...ogImagens()`
 * (ou passar `images: ogImagens()`) dentro dele.
 */
export function ogImagens(alt = 'Aluguel de Games — fliperama, videokê e games pra festa em Osasco e Grande SP') {
    return [
        {
            url: `${getSiteUrl()}/og-aluguel-de-games.jpg`,
            width: 1200,
            height: 630,
            alt,
            type: 'image/jpeg',
        },
    ]
}
