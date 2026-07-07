/* components/Main.tsx  */
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FaTrophy, FaShieldAlt, FaHeart, FaGamepad } from "react-icons/fa";
import dynamic from "next/dynamic";
import Demonstra from "@/components/sections/videos-e-imagens/Demonstra";
import { WhatsAppCta, PhoneSupportLine } from "@/components/cta/WhatsAppCta";
import { Counter } from "@/components/ui/Counter";

const TopToys = dynamic(() => import("@/components/sections/top-toys/TopToys"), { ssr: false });

export default function Main() {
    const anosDeAtuacao = new Date().getFullYear() - 1993;

    const valores = [
        { icon: FaTrophy, num: "01", titulo: "Tradição", texto: "Mais de três décadas no mercado, com clientes que voltam geração após geração." },
        { icon: FaShieldAlt, num: "02", titulo: "Qualidade", texto: "Equipamentos modernos, com manutenção preventiva e suporte técnico." },
        { icon: FaHeart, num: "03", titulo: "Atendimento", texto: "Consultor dedicado do primeiro orçamento até a retirada." },
        { icon: FaGamepad, num: "04", titulo: "Diversão", texto: "Garantia de entretenimento de qualidade para todas as idades." },
    ];

    return (
        <main className="mx-auto flex !w-full flex-col gap-16 md:gap-28 pt-5">

            {/* =============== SECTION 1 — TOP TOYS =============== */}
            <section className="px-4 !w-full !max-w-full">
                <div className="text-center mb-8 md:mb-12 max-w-3xl mx-auto">
                    <p className="label-arcade text-cyan-400 mb-3">★ Top 10 mais alugados</p>
                    <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight leading-[0.95]">
                        10 atrações<br />
                        <span className="italic font-normal text-muted-foreground/70">que viraram tradição.</span>
                    </h2>
                </div>
                <TopToys />
            </section>

            <Demonstra />

            {/* =============== SECTION 3 — SOBRE NÓS (editorial arcade) =============== */}
            <section className="relative overflow-hidden py-12 md:py-16">
                {/* Decorações */}
                <div className="pointer-events-none absolute inset-0 dot-grid opacity-30" aria-hidden />
                <div className="pointer-events-none absolute -top-20 right-1/4 h-72 w-72 rounded-full bg-purple-500/15 blur-3xl" aria-hidden />
                {/* Fades top e bottom suavizam o corte */}
                <div className="section-fade-top" aria-hidden />
                <div className="section-fade-bottom" aria-hidden />

                <div className="relative mx-auto max-w-6xl px-4">
                    {/* Header */}
                    <div className="mb-12 grid lg:grid-cols-[2fr_1fr] gap-8 items-end">
                        <div>
                            <p className="label-arcade text-purple-400 mb-3">▸ Quem somos</p>
                            <h2 className="font-display font-extrabold text-4xl md:text-6xl tracking-tight leading-[0.95]">
                                Desde <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">1993</span><br />
                                <span className="italic font-normal text-muted-foreground/80">fazendo festa virar memória.</span>
                            </h2>
                        </div>

                        {/* Counter de anos gigante */}
                        <div className="lg:border-l lg:border-purple-500/30 lg:pl-8">
                            <Counter
                                to={anosDeAtuacao}
                                suffix="+"
                                duration={2.4}
                                className="numeral-huge-filled !text-7xl md:!text-8xl block tabular-nums"
                            />
                            <p className="label-arcade text-muted-foreground mt-2">Anos no mercado</p>
                        </div>
                    </div>

                    {/* Texto descritivo */}
                    <p className="font-body text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed mb-12">
                        Nascemos quando fliperama era estrela das esquinas e seguimos transformando festas
                        e eventos em São Paulo. Nosso compromisso: <strong className="text-foreground font-semibold">entretenimento de
                        qualidade</strong>, do clássico fliperama ao mais moderno simulador de realidade virtual.
                    </p>

                    {/* Grid editorial de valores */}
                    <div className="grid gap-px bg-border/50 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl overflow-hidden border border-border/50">
                        {valores.map((v, i) => (
                            <motion.article
                                key={v.num}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: i * 0.08 }}
                                className="relative bg-background p-6 md:p-7 transition-all hover:bg-card/60 group"
                            >
                                <div className="flex items-baseline gap-3 mb-4">
                                    <span className="numeral-huge !text-4xl group-hover:[-webkit-text-stroke-color:_rgba(168,85,247,0.9)] transition-all">
                                        {v.num}
                                    </span>
                                    <v.icon className="text-xl text-purple-400/80 group-hover:text-purple-300 transition-colors" />
                                </div>
                                <h3 className="font-display text-lg font-bold mb-2">{v.titulo}</h3>
                                <p className="font-body text-sm text-muted-foreground leading-relaxed">{v.texto}</p>
                            </motion.article>
                        ))}
                    </div>

                    {/* Prova nomeada (clientes reais, sem número fabricado) */}
                    <p className="mt-10 font-body text-sm text-muted-foreground">
                        Já jogaram com a gente:{" "}
                        <span className="text-foreground font-semibold">Bradesco</span> ·{" "}
                        <span className="text-foreground font-semibold">Spotify</span> ·{" "}
                        <span className="text-foreground font-semibold">Arnold Classic</span> ·{" "}
                        <span className="text-foreground font-semibold">Danilo Gentili</span>
                    </p>

                    {/* Link sutil */}
                    <div className="mt-10">
                        <Link href="/sobre" className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                            <span className="border-b border-border group-hover:border-purple-400 transition-colors pb-0.5">
                                Conhecer nossa história completa
                            </span>
                            <span className="transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* =============== SECTION 4 — CTA FINAL EDITORIAL =============== */}
            <section className="relative overflow-hidden py-12 md:py-20">
                <div className="section-fade-top" aria-hidden />
                <div className="mx-auto max-w-6xl px-4">
                    <div className="relative overflow-hidden rounded-3xl border-2 border-purple-500/40 bg-gradient-to-br from-blue-950/50 via-purple-950/50 to-pink-950/50 p-8 md:p-14 lg:p-20">
                        {/* Decorações internas */}
                        <div className="absolute inset-0 dot-grid-dense opacity-20" aria-hidden />
                        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-pink-500/30 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-blue-500/30 blur-3xl" />

                        {/* Corner brackets */}
                        <span className="pointer-events-none absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-400/60" />
                        <span className="pointer-events-none absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-400/60" />
                        <span className="pointer-events-none absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-400/60" />
                        <span className="pointer-events-none absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-400/60" />

                        <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
                            <div>
                                <p className="label-arcade text-cyan-400 mb-4 inline-flex items-center gap-2">
                                    <span className="badge-live text-cyan-400">★</span>
                                    <span>Orçamento sem compromisso</span>
                                </p>

                                <h2 className="font-display font-extrabold text-4xl md:text-6xl tracking-tight leading-[0.92] mb-5">
                                    Bora montar o<br />
                                    <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent italic">
                                        pacote ideal
                                    </span>{" "}
                                    pro seu evento?
                                </h2>

                                <p className="font-body text-base md:text-lg text-muted-foreground max-w-xl">
                                    Manda data, local e número de convidados pelo WhatsApp.
                                    A gente responde com uma proposta personalizada — sem pressão de venda, sem letra miúda.
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
                                    className="hero-cta-secondary w-full lg:w-auto font-semibold text-base px-8 border-2 hover:border-purple-500/60 hover:bg-purple-500/10"
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
        </main>
    );
}
