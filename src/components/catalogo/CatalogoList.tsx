// src/components/catalogo/Catalogo.tsx
import CatalogList from "@/app/catalogo/CatalogList.server";
import { WhatsAppCta, WhatsAppCtaMeta } from "@/components/cta/WhatsAppCta";

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
                        <span>Entrega e montagem incluídas</span>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-purple-600/10 text-purple-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Suporte disponível</span>
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
                <div className="flex flex-col items-center gap-3">
                    <WhatsAppCta surface="home" variant="primary">
                        Pedir orçamento no WhatsApp
                    </WhatsAppCta>
                    <WhatsAppCtaMeta surface="home" />
                </div>
            </div>
        </main>
    );
}