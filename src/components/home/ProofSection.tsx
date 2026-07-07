// src/components/home/ProofSection.tsx
//
// Prova (SPEC-FINAL-V2 §3.9) — UMA dobra que FUNDE "Desde 1993" + o Demonstra.
// Mata o grid de 4 "valores" (frufru) e os stats inline. Traz:
//  - cards de evento REAL (foto + legenda nomeada) → /galeria
//  - 1 vídeo do Demonstra como prova (preload="metadata")
//  - frase citável §9.3 em <blockquote> + numeral 33 (anos) + link /sobre
//  - "Ver avaliações no Google" só com GBP confirmado (null = omitido)
// SERVER component (HTML cru). Nota honesta: só 2 cards têm foto nomeável
// (Gentili, Bradesco); o 3º é foto real de equipamento SEM atribuir cliente
// falso. Fotos nomeadas de Arnold Classic/Spotify entram quando o dono enviar
// ([CONFIRMAR COM DONO: fotos + ano/escopo dos eventos]).
import Link from "next/link";
import Image from "next/image";
import { BUSINESS, anosDeMercado } from "@/config/business.config";

interface ProofCard {
    image: string;
    caption: string;
    context: string;
}

const CARDS: ProofCard[] = [
    {
        image: "/carousel/compressed/PinballDaniloGentili.webp",
        caption: "Aniversário do Danilo Gentili",
        context: "Pinball 007 na festa do apresentador.",
    },
    {
        image: "/carousel/compressed/Braland.webp",
        caption: "Bradesco · Braland",
        context: "Ativação de marca com games para o time.",
    },
    {
        image: "/carousel/compressed/Boxing Machine.webp",
        caption: "Máquina de boxe em evento",
        context: "Atração que junta fila e vira disputa.",
    },
];

export default function ProofSection() {
    const anos = anosDeMercado();

    return (
        <section aria-label="Prova" className="relative w-full overflow-hidden py-12 md:py-16">
            <div className="pointer-events-none absolute inset-0 dot-grid opacity-25" aria-hidden />
            <div className="section-fade-top" aria-hidden />
            <div className="section-fade-bottom" aria-hidden />

            <div className="relative mx-auto max-w-6xl px-4">
                {/* Header + numeral 33 */}
                <div className="mb-10 grid items-end gap-6 lg:grid-cols-[2fr_1fr]">
                    <div>
                        <p className="label-arcade mb-3 text-purple-400">▸ prova, não promessa</p>
                        <h2 className="font-display text-4xl font-extrabold leading-[0.95] tracking-tight md:text-5xl">
                            Eventos reais,{" "}
                            <span className="italic font-normal text-muted-foreground/80">gente de verdade.</span>
                        </h2>
                    </div>
                    <div className="lg:border-l lg:border-purple-500/30 lg:pl-8">
                        <span className="numeral-huge-filled block tabular-nums !text-6xl md:!text-7xl">{anos}</span>
                        <p className="label-arcade mt-2 text-muted-foreground">anos no mercado</p>
                    </div>
                </div>

                {/* Cards de evento + vídeo de prova */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {CARDS.map((c) => (
                        <Link
                            key={c.image}
                            href="/galeria"
                            className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-900"
                        >
                            <Image
                                src={c.image}
                                alt={`${c.caption} — ${c.context}`}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 50vw, 25vw"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 p-3">
                                <p className="text-sm font-semibold text-white drop-shadow">{c.caption}</p>
                                <p className="mt-0.5 text-xs text-zinc-300">{c.context}</p>
                            </div>
                        </Link>
                    ))}

                    {/* Vídeo de prova (o resto do Demonstra morreu da home). */}
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-900 md:col-span-2 lg:col-span-1">
                        <video
                            className="h-full w-full object-cover"
                            preload="metadata"
                            controls
                            muted
                            playsInline
                            poster="/carousel/compressed/da066c60-0c96-46ee-b01d-8f34deab7c6c.webp"
                        >
                            <source src="/demonstra/VID-20231020-WA0026.mp4" type="video/mp4" />
                        </video>
                        <span className="pointer-events-none absolute left-3 top-3 rounded bg-black/60 px-2 py-0.5 text-[0.6875rem] font-medium text-white backdrop-blur-sm">
                            ▶ vídeo real do evento
                        </span>
                    </div>
                </div>

                {/* Frase citável §9.3 (verbatim home + /sobre) */}
                <blockquote className="mx-auto mt-12 max-w-3xl border-l-2 border-purple-500/50 pl-5 font-display text-xl font-medium leading-snug text-foreground md:text-2xl">
                    A Aluguel de Games loca fliperamas, videokês e games para festas em Osasco e Grande
                    São Paulo desde 1993 — antes do primeiro PlayStation existir — com eventos realizados
                    para Bradesco, Spotify, Arnold Classic e Danilo Gentili.
                </blockquote>

                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <Link
                        href="/sobre"
                        className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <span className="border-b border-border pb-0.5 transition-colors group-hover:border-purple-400">
                            Conhecer nossa história
                        </span>
                        <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
                    </Link>
                    {/* Avaliações no Google só com GBP confirmado (§1.3). */}
                    {BUSINESS.gbpUrl && (
                        <a
                            href={BUSINESS.gbpUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:underline"
                        >
                            <span aria-hidden>★</span> Ver avaliações no Google <span aria-hidden>→</span>
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}
