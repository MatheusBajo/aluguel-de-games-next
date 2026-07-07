import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { WhatsAppCta, WhatsAppCtaMeta } from "@/components/cta/WhatsAppCta";
import { Counter } from "@/components/ui/Counter";

export const metadata: Metadata = {
    title: "Galeria de Eventos - Veja Nossos Trabalhos",
    description:
        "Confira fotos de festas, eventos corporativos, casamentos e formaturas que animamos. Fliperamas, videokês, pinballs e muito mais em ação.",
    alternates: { canonical: "https://www.alugueldegames.com.br/galeria" },
    openGraph: {
        title: "Galeria de Eventos - Aluguel de Games",
        description: "Fotos reais de festas e eventos animados pela Aluguel de Games em São Paulo.",
        url: "https://www.alugueldegames.com.br/galeria",
        siteName: "Aluguel de Games",
        locale: "pt_BR",
        type: "website",
    },
};

const fotos = [
    { src: "/carousel/compressed/Braland.webp", alt: "Evento corporativo Bradesco - Braland", legenda: "Bradesco · Braland", tag: "Corporativo" },
    { src: "/carousel/compressed/PinballDaniloGentili.webp", alt: "Pinball 007 no aniversário do Danilo Gentili", legenda: "Danilo Gentili", tag: "Aniversário" },
    { src: "/carousel/compressed/Boxing Machine.webp", alt: "Máquina de boxe em evento", legenda: "Boxing Machine", tag: "Atração" },
    { src: "/carousel/compressed/Pebolim e dois fliperamas.webp", alt: "Pebolim e fliperamas em festa", legenda: "Pebolim + Fliperamas", tag: "Festa" },
    { src: "/carousel/compressed/Martelo de força.webp", alt: "Martelo de força em ação", legenda: "Martelo de força", tag: "Atração" },
    { src: "/carousel/compressed/Karaokê Matrix Mesa.webp", alt: "Karaokê Matrix em festa", legenda: "Karaokê Matrix Mesa", tag: "Festa" },
    { src: "/carousel/compressed/Simulador Grua Fliperama.webp", alt: "Simulador, grua e fliperama em evento", legenda: "Simulador + Grua + Fliperama", tag: "Festa" },
    { src: "/carousel/compressed/Karaokê Matrix Slim.webp", alt: "Karaokê Matrix Slim em festa", legenda: "Karaokê Matrix Slim", tag: "Festa" },
    { src: "/carousel/compressed/Videokê Pop 300.webp", alt: "Videokê Pop 300 em evento", legenda: "Videokê Pop 300", tag: "Festa" },
    { src: "/carousel/compressed/Karaokê Matrix 30000.webp", alt: "Karaokê Matrix 30.000", legenda: "Matrix 30.000", tag: "Festa" },
    { src: "/carousel/compressed/c71c0260-95d7-4e66-9ca6-0bda25008d18.webp", alt: "Sinuca e Air Game", legenda: "Sinuca + Air Game", tag: "Festa" },
    { src: "/carousel/compressed/da066c60-0c96-46ee-b01d-8f34deab7c6c.webp", alt: "Pinballs e fliperamas em evento", legenda: "Pinballs e Fliperamas", tag: "Festa" },
    { src: "/carousel/compressed/59dcb12d-11b2-45d3-832d-513e09971850.webp", alt: "Equipamentos montados em festa", legenda: "Equipamentos em evento", tag: "Festa" },
    { src: "/carousel/compressed/5f18e410-b9b3-4f43-83c2-23d31779a5b6.webp", alt: "Festa animada com equipamentos", legenda: "Diversão garantida", tag: "Festa" },
    { src: "/carousel/compressed/a4a14cfc-a795-49b5-bcd3-04ad9a7deaa0.webp", alt: "Evento com fliperamas", legenda: "Fliperamas em ação", tag: "Festa" },
    { src: "/carousel/compressed/c8c532f9-1046-422d-91ee-5bd1358f6a50.webp", alt: "Atrações de evento", legenda: "Atrações em destaque", tag: "Festa" },
    { src: "/carousel/compressed/d7271fdf-5def-4040-9de5-c19cae821caf.webp", alt: "Evento empresarial", legenda: "Evento empresarial", tag: "Corporativo" },
    { src: "/carousel/compressed/e26c11dc-3176-41db-91cc-2fbd8a085f25.webp", alt: "Festa com games", legenda: "Festa com games", tag: "Festa" },
    { src: "/carousel/compressed/photo_5100669647556029615_y.webp", alt: "Equipamentos em festa", legenda: "Setup completo", tag: "Festa" },
    { src: "/carousel/compressed/photo_5147916662928944180_y (1).webp", alt: "Evento do Spotify com nossos equipamentos", legenda: "Evento Spotify", tag: "Corporativo" },
];

export default function GaleriaPage() {
    return (
        <main className="relative overflow-hidden">
            {/* Decorações */}
            <div className="pointer-events-none absolute inset-0 grid-tron opacity-20" aria-hidden />
            <div className="pointer-events-none absolute -top-20 right-0 h-96 w-96 rounded-full bg-pink-500/10 blur-3xl" aria-hidden />

            {/* ============= HERO ============= */}
            <section className="relative mx-auto max-w-7xl px-4 pt-16 pb-12 md:pt-24">
                <div className="grid gap-8 md:grid-cols-[2fr_1fr] md:items-end">
                    <div>
                        <p className="rise-in label-arcade text-pink-400 mb-6 inline-flex items-center gap-2">
                            <span>★ Eventos reais</span>
                        </p>

                        <h1 className="rise-in font-display font-extrabold leading-[0.92] tracking-tight text-5xl sm:text-6xl md:text-7xl lg:text-8xl" style={{ animationDelay: '120ms' }}>
                            Quem joga com<br />
                            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent italic">
                                a gente.
                            </span>
                        </h1>
                    </div>

                    <p className="rise-in font-body text-base md:text-lg text-muted-foreground" style={{ animationDelay: '240ms' }}>
                        De aniversários intimistas a grandes ativações corporativas — Bradesco,
                        Danilo Gentili e centenas de festas que viraram boas histórias.
                    </p>
                </div>
            </section>

            <div className="mx-auto max-w-7xl px-4">
                <div className="divider-neon" />
            </div>

            {/* ============= GRID MASONRY ============= */}
            <section className="relative mx-auto max-w-7xl px-4 py-16 md:py-20">
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 [column-fill:_balance]">
                    {fotos.map((foto, i) => (
                        <figure
                            key={foto.src}
                            className="rise-in group relative mb-3 overflow-hidden rounded-xl border border-border/40 bg-card/40 break-inside-avoid"
                            style={{ animationDelay: `${i * 30}ms` }}
                        >
                            <img
                                src={foto.src}
                                alt={foto.alt}
                                loading={i < 6 ? "eager" : "lazy"}
                                className="w-full transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Tag superior */}
                            <span className="absolute top-3 left-3 label-arcade text-white bg-black/70 backdrop-blur-sm px-2 py-1 rounded-sm border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                {foto.tag}
                            </span>

                            {/* Overlay com legenda */}
                            <figcaption className="absolute inset-x-0 bottom-0 p-4 translate-y-full bg-gradient-to-t from-black via-black/85 to-transparent transition-transform duration-300 group-hover:translate-y-0">
                                <p className="font-display text-sm md:text-base font-bold text-white">
                                    {foto.legenda}
                                </p>
                                <p className="label-arcade text-pink-300 mt-1">{foto.tag}</p>
                            </figcaption>

                            {/* Corner brackets sutis */}
                            <span className="absolute top-2 right-2 w-3 h-3 border-t border-r border-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </figure>
                    ))}
                </div>
            </section>

            {/* ============= PROVA (só número verificável + nomes reais) ============= */}
            <section className="relative mx-auto max-w-7xl px-4 py-16">
                <div className="rounded-2xl overflow-hidden border border-border/40 bg-background p-8 md:p-10 text-center">
                    <div className="rise-in">
                        <Counter
                            to={new Date().getFullYear() - 1993}
                            duration={2.2}
                            className="font-display font-extrabold text-4xl md:text-6xl tracking-tight bg-gradient-to-br from-pink-400 to-blue-400 bg-clip-text text-transparent block"
                        />
                        <p className="label-arcade text-muted-foreground mt-2">Anos alugando games (desde 1993)</p>
                    </div>
                    <div className="rise-in mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs md:text-sm" style={{ animationDelay: '120ms' }}>
                        <span className="label-arcade text-muted-foreground/80">▸ já jogaram com a gente</span>
                        <span className="font-mono font-bold text-foreground/80">Bradesco</span>
                        <span className="text-muted-foreground/30">·</span>
                        <span className="font-mono font-bold text-foreground/80">Spotify</span>
                        <span className="text-muted-foreground/30">·</span>
                        <span className="font-mono font-bold text-foreground/80">Arnold Classic</span>
                        <span className="text-muted-foreground/30">·</span>
                        <span className="font-mono font-bold text-foreground/80">Danilo Gentili</span>
                    </div>
                </div>
            </section>

            {/* ============= CTA ============= */}
            <section className="relative mx-auto max-w-7xl px-4 pb-24 md:pb-32 pt-16">
                <div className="text-center">
                    <p className="label-arcade text-pink-400 mb-4">📸 Quer ver seu evento aqui?</p>
                    <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight leading-[0.95] mb-4">
                        Vamos criar uma<br />
                        <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent italic">
                            boa história.
                        </span>
                    </h2>
                    <p className="font-body text-muted-foreground max-w-xl mx-auto mb-8">
                        Agende seu evento conosco e vire o próximo case da nossa galeria.
                    </p>
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <WhatsAppCta surface="home" variant="primary">
                                Pedir orçamento no WhatsApp
                            </WhatsAppCta>
                            <Button asChild size="lg" variant="outline">
                                <Link href="/catalogo">Ver catálogo completo</Link>
                            </Button>
                        </div>
                        <WhatsAppCtaMeta surface="home" />
                    </div>
                </div>
            </section>
        </main>
    );
}
