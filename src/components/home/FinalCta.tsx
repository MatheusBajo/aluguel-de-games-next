// src/components/home/FinalCta.tsx
//
// CTA final da home (SPEC-FINAL-V2 §3.11) — dual + tel + fora-do-horário.
// SERVER component; os CTAs são ilhas client (WhatsAppCta/PhoneSupportLine).
import Link from "next/link";
import { FaGamepad } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { WhatsAppCta, PhoneSupportLine } from "@/components/cta/WhatsAppCta";

export default function FinalCta() {
    return (
        <section className="relative w-full overflow-hidden py-12 md:py-20">
            <div className="section-fade-top" aria-hidden />
            <div className="mx-auto max-w-6xl px-4">
                <div className="relative overflow-hidden rounded-3xl border-2 border-purple-500/40 bg-gradient-to-br from-blue-950/50 via-purple-950/50 to-pink-950/50 p-8 md:p-14 lg:p-20">
                    <div className="dot-grid-dense absolute inset-0 opacity-20" aria-hidden />
                    <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-pink-500/30 blur-3xl" aria-hidden />
                    <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-blue-500/30 blur-3xl" aria-hidden />

                    <span className="pointer-events-none absolute left-4 top-4 h-8 w-8 border-l-2 border-t-2 border-cyan-400/60" />
                    <span className="pointer-events-none absolute right-4 top-4 h-8 w-8 border-r-2 border-t-2 border-cyan-400/60" />
                    <span className="pointer-events-none absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-cyan-400/60" />
                    <span className="pointer-events-none absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-cyan-400/60" />

                    <div className="relative grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
                        <div>
                            <p className="label-arcade mb-4 text-cyan-400">★ orçamento sem compromisso</p>
                            <h2 className="mb-5 font-display text-4xl font-extrabold leading-[0.92] tracking-tight md:text-6xl">
                                Bora montar o<br />
                                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text italic text-transparent">
                                    pacote ideal
                                </span>{" "}
                                pro seu evento?
                            </h2>
                            <p className="max-w-xl font-body text-base text-muted-foreground md:text-lg">
                                Manda data, local e número de convidados pelo WhatsApp. A gente responde
                                com uma proposta pra sua festa — sem pressão de venda, sem letra miúda.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 lg:items-end">
                            <WhatsAppCta
                                surface="home"
                                location="home_cta_final"
                                label="Pedir orçamento no WhatsApp"
                                className="hero-cta-primary w-full lg:w-auto"
                            />
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="hero-cta-secondary w-full border-2 px-8 text-base font-semibold hover:border-purple-500/60 hover:bg-purple-500/10 lg:w-auto"
                            >
                                <Link href="/catalogo">
                                    <FaGamepad className="mr-2 h-5 w-5" />
                                    Ver catálogo completo
                                </Link>
                            </Button>
                            <PhoneSupportLine surface="home" location="home_cta_final" className="mt-1 text-center lg:text-right" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
