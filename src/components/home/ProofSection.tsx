// src/components/home/ProofSection.tsx
//
// D6 — Prova (spec §3). Nomes reais, ZERO número inventado.
//  - Numeral 1993 outline + claim + frase citável (§9.3, verbatim = /sobre).
//  - Carrossel MANUAL (scroll-snap CSS, sem autoplay) de fotos: clientes
//    NOMEADOS só onde a foto é real (Bradesco/Braland, Danilo Gentili); demais
//    slides = fotos reais de evento com legenda descritiva honesta (nunca
//    rotular foto genérica com nome de cliente que não está nela).
//  - Único counter do site: anos desde 1993 (estático, honesto).
//  - "Ver avaliações no Google" só renderiza com GBP confirmado (§1.3).
import Link from "next/link";
import { GBP_URL } from "@/lib/schema";

interface ProofPhoto {
    image: string;
    caption: string;
    /** cliente nomeado (aparece com selo) vs foto de evento com legenda descritiva */
    named?: boolean;
}

const PHOTOS: ProofPhoto[] = [
    { image: "/carousel/compressed/Braland.webp", caption: "Bradesco · Braland", named: true },
    { image: "/carousel/compressed/PinballDaniloGentili.webp", caption: "Aniversário do Danilo Gentili", named: true },
    { image: "/carousel/compressed/Pebolim e dois fliperamas.webp", caption: "Pebolim + fliperamas em festa" },
    { image: "/carousel/compressed/Boxing Machine.webp", caption: "Máquina de boxe no evento" },
    { image: "/carousel/compressed/c71c0260-95d7-4e66-9ca6-0bda25008d18.webp", caption: "Sinuca e air game em ação" },
];

export function ProofSection() {
    const anos = new Date().getFullYear() - 1993;

    return (
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            {/* Claim + numeral + frase citável */}
            <div>
                <div className="flex items-baseline gap-4">
                    <span
                        className="font-display text-6xl font-extrabold leading-none tracking-tight text-transparent md:text-8xl"
                        style={{ WebkitTextStroke: "2px rgba(168,85,247,0.55)" }}
                    >
                        1993
                    </span>
                    <span className="font-body text-sm text-muted-foreground">
                        <strong className="block font-mono text-2xl font-extrabold text-foreground tabular-nums md:text-3xl">
                            {anos} anos
                        </strong>
                        alugando games
                    </span>
                </div>

                <h2 className="mt-5 font-display text-2xl font-extrabold leading-tight text-foreground md:text-3xl">
                    Alugando games antes do primeiro PlayStation existir.
                </h2>

                {/* Frase citável — verbatim idêntica à da /sobre (spec §9.3) */}
                <p className="mt-4 font-body text-base leading-relaxed text-muted-foreground">
                    A Aluguel de Games loca fliperamas, videokês e games para festas em Osasco
                    e Grande São Paulo desde 1993 — antes do primeiro PlayStation existir — com
                    eventos realizados para{" "}
                    <span className="font-semibold text-foreground">Bradesco</span>,{" "}
                    <span className="font-semibold text-foreground">Spotify</span>,{" "}
                    <span className="font-semibold text-foreground">Arnold Classic</span> e{" "}
                    <span className="font-semibold text-foreground">Danilo Gentili</span>.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
                    <Link
                        href="/sobre"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 underline-offset-4 hover:text-cyan-300 hover:underline"
                    >
                        Conhecer nossa história
                        <span aria-hidden>→</span>
                    </Link>
                    {/* avaliações no Google — só com GBP confirmado (os dois estados desenhados) */}
                    {GBP_URL && (
                        <a
                            href={GBP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 underline-offset-4 hover:text-cyan-300 hover:underline"
                        >
                            Ver avaliações no Google
                            <span aria-hidden>→</span>
                        </a>
                    )}
                </div>
            </div>

            {/* Carrossel manual (scroll-snap CSS, sem autoplay) */}
            <div>
                <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 scrollbar-hide">
                    {PHOTOS.map((p) => (
                        <li key={p.image} className="min-w-[75%] snap-start sm:min-w-[52%] lg:min-w-[46%]">
                            <Link
                                href="/galeria"
                                className="group relative block overflow-hidden rounded-2xl border border-border/60"
                            >
                                <div className="aspect-[4/3] overflow-hidden bg-background">
                                    <img
                                        src={p.image}
                                        alt={p.caption}
                                        loading="lazy"
                                        decoding="async"
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" aria-hidden />
                                <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-3">
                                    {p.named && (
                                        <span className="rounded-full bg-cyan-400/20 px-2 py-0.5 font-mono text-xs font-bold uppercase tracking-wide text-cyan-300">
                                            cliente real
                                        </span>
                                    )}
                                    <span className="font-body text-sm font-semibold text-white">
                                        {p.caption}
                                    </span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
                <p className="mt-1 text-center font-body text-xs text-muted-foreground/80 sm:text-left">
                    arraste pra ver mais · toque pra abrir a galeria
                </p>
            </div>
        </div>
    );
}

export default ProofSection;
