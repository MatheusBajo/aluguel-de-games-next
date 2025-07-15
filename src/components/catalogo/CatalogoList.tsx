// src/components/catalogo/Catalogo.tsx
import CatalogList from "@/app/catalogo/CatalogList.server";

export default async function Catalogo() {
    return (
        <main className="relative mx-auto max-w-screen-2xl px-4 py-8 md:py-12 lg:py-16">
            {/* Background decoration melhorado */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -left-20 top-40 h-72 md:h-96 w-72 md:w-96 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl animate-pulse" />
                <div className="absolute -right-20 bottom-40 h-72 md:h-96 w-72 md:w-96 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl animate-pulse" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] md:h-[500px] w-[300px] md:w-[500px] rounded-full bg-gradient-to-r from-primary/10 to-purple-600/10 blur-3xl" />
            </div>

            {/* Header melhorado */}
            <div className="mb-8 md:mb-12 lg:mb-16 text-center">
                <h1 className="mb-4 md:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
                        Catálogo Completo
                    </span>
                </h1>
                <p className="mx-auto max-w-3xl text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground px-2 sm:px-4">
                    Explore nossa coleção completa de jogos e equipamentos.
                    Tudo para fazer seu evento ser memorável e divertido!
                </p>

                {/* Badges informativos responsivos */}
                <div className="mt-6 md:mt-8 flex flex-wrap gap-2 sm:gap-3 justify-center">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Entrega Grátis</span>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-purple-600/10 text-purple-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Suporte 24h</span>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-green-600/10 text-green-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>Higienizados</span>
                    </div>
                </div>
            </div>

            {/* Catalog List com responsividade */}
            <CatalogList
                limitPerCat={8} // Desktop: 8 itens por categoria
                limitPerCatMobile={4} // Mobile: 4 itens por categoria
            />

            {/* CTA Section no final */}
            <div className="mt-12 md:mt-16 lg:mt-20 text-center bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4">
                    Não encontrou o que procurava?
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto px-2">
                    Temos ainda mais opções! Entre em contato e conte o que você precisa
                    para seu evento. Vamos encontrar a solução perfeita!
                </p>
                <a
                    href="https://wa.me/+551142377766"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm sm:text-base"
                >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Falar no WhatsApp
                </a>
            </div>
        </main>
    );
}