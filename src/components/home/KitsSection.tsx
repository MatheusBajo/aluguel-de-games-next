// src/components/home/KitsSection.tsx
//
// Kits (SPEC-FINAL-V2 §3.5) — curadoria antes do paredão. 3 cards com foto
// real + 3-4 itens em texto + CTA verde com prefill do kit. Linhas de preço /
// "ideal pra X convidados" só aparecem quando o dono assina (null = omitido,
// card sem buraco). SERVER component; o CTA verde é ilha client (WhatsAppCta).
import Link from "next/link";
import Image from "next/image";
import { KITS } from "@/data/kits";
import { WhatsAppCta } from "@/components/cta/WhatsAppCta";

export default function KitsSection() {
    return (
        <section aria-label="Kits" className="w-full">
            <div className="mx-auto max-w-6xl px-4">
                <div className="mb-8 text-center">
                    <p className="label-arcade mb-3 text-amber-400">▸ combos prontos</p>
                    <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
                        Kits pra facilitar
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl font-body text-muted-foreground">
                        Não sabe por onde começar? Escolhe um kit e ajusta no WhatsApp.
                        Alugando mais de um item junto, o combo sai melhor.
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {KITS.map((kit) => (
                        <article
                            key={kit.id}
                            className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/40"
                        >
                            <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
                                <Image
                                    src={kit.image}
                                    alt={kit.imageAlt}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                            </div>

                            <div className="flex flex-1 flex-col gap-3 p-5">
                                <div>
                                    <p className={`label-arcade mb-1 ${kit.accent}`}>kit</p>
                                    <h3 className="font-display text-xl font-bold">{kit.name}</h3>
                                    <p className="mt-1 font-body text-sm text-muted-foreground">{kit.tagline}</p>
                                </div>

                                <ul className="flex flex-wrap gap-1.5">
                                    {kit.items.map((it) => (
                                        <li
                                            key={it}
                                            className="rounded-full border border-border/60 bg-background/60 px-2.5 py-1 text-xs text-zinc-300"
                                        >
                                            {it}
                                        </li>
                                    ))}
                                </ul>

                                {/* Linhas condicionais: só com dado assinado (§1.3 / gate 1.6). */}
                                {kit.guests && (
                                    <p className="text-xs text-muted-foreground">Ideal pra {kit.guests}.</p>
                                )}
                                {kit.price && (
                                    <p className="font-display text-lg font-bold text-foreground">{kit.price}</p>
                                )}

                                <div className="mt-auto flex flex-col gap-2 pt-1">
                                    <WhatsAppCta
                                        surface="kit"
                                        product={kit.name}
                                        location={`kit_${kit.id}`}
                                        variant="compact"
                                        label={`Orçar Kit ${kit.name}`}
                                        className="w-full justify-center"
                                    />
                                    <Link
                                        href={kit.href}
                                        className="text-center text-xs font-medium text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
                                    >
                                        ver itens desse tipo
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
