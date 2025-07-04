/* components/Main.tsx  */
"use client";

import Link from "next/link";
import {Button} from "@/components/ui/button";
import {DynamicGradient} from "@/components/hooks/DynamicGradient";
import { motion } from "framer-motion";
import {FaGamepad, FaHeart, FaTrophy, FaShieldAlt, FaWhatsapp} from "react-icons/fa";

/*  ↓ importe as seções pesadas via dynamic para evitar SSR de GSAP etc. */
import dynamic from "next/dynamic";

const TopToys      = dynamic(() => import("@/components/sections/top-toys/TopToys"),      { ssr: false });
const ComoFunciona = dynamic(() => import("@/components/sections/como-funciona/ComoFunciona"), { ssr: false });

export default function Main() {

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    return (
        <main className="mx-auto flex !w-full flex-col gap-12 md:gap-20 pt-5">
            {/* =============== SECTION 1 — TOP TOYS =============== */}
            <section className="px-4 !w-full !max-w-full">
                <motion.div
                    className="text-center mb-8 md:mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                        Equipamentos em{' '}
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Destaque
                        </span>
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Os favoritos dos nossos clientes para tornar qualquer evento especial
                    </p>
                </motion.div>
                <TopToys />
            </section>

            {/* =============== SECTION 2 — COMO FUNCIONA =============== */}
            <ComoFunciona />

            {/* =============== SECTION 3 — SOBRE NÓS MELHORADO =============== */}
            <section className="relative overflow-hidden py-12 md:py-20">
                {/* Background decorativo com gradiente suave */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-secondary/5">
                    <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:30px_30px]" />
                    {/* Gradiente suave no topo */}
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
                    {/* Gradiente suave no bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
                </div>

                <div className="relative z-10 mx-auto max-w-6xl px-5">
                    <motion.div
                        className="text-center mb-12 md:mb-16"
                        {...fadeInUp}
                    >
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                            Sobre a{' '}
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Aluguel de Games
                </span>
                        </h2>
                        <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
                            Há mais de 10 anos transformando eventos em experiências inesquecíveis
                        </p>
                    </motion.div>

                    <div className="grid gap-8 md:gap-12 lg:grid-cols-2 items-center">
                        {/* Logo + efeito */}
                        <motion.div
                            className="flex flex-col items-center gap-5"
                            initial={{opacity: 0, scale: 0.8}}
                            animate={{opacity: 1, scale: 1}}
                            transition={{duration: 0.8, delay: 0.2}}
                        >
                            {/* wrapper exclusivo do logo */}
                            <div className="relative inline-block group">
                                <DynamicGradient
                                    imageUrl="/carro-logo-aluguel-de-games.png"
                                    className="pointer-events-none"
                                    typeOfGradient={"radial"}
                                    blur={"50px"}
                                />

                                <img
                                    src="/carro-logo-aluguel-de-games.png"
                                    alt="Logo Aluguel de Games"
                                    className="relative z-10 h-32 md:h-40 select-none dark:invert"
                                />
                            </div>

                            <span className="text-xl md:text-2xl font-bold uppercase">
                    Aluguel de Games
                </span>
                        </motion.div>

                        {/* Texto e valores */}
                        <motion.div
                            className="flex flex-col gap-6"
                            initial={{opacity: 0, x: 20}}
                            animate={{opacity: 1, x: 0}}
                            transition={{duration: 0.8, delay: 0.4}}
                        >
                            <h3 className="text-2xl md:text-3xl font-bold">Nossa História</h3>
                            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                                Há mais de 10 anos transformamos eventos em experiências marcantes.
                                Nossa missão é tornar o entretenimento de qualidade
                                <strong className="text-primary"> acessível</strong> em todo o Brasil, levando desde
                                Fliperamas retrô até Realidade Virtual de última geração.
                            </p>

                            {/* Cards de valores */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                <motion.div
                                    className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-primary/10"
                                    whileHover={{scale: 1.02, borderColor: "hsl(var(--primary) / 0.3)"}}
                                >
                                    <FaTrophy className="text-2xl text-primary mb-2"/>
                                    <h4 className="font-semibold mb-1">Inovação</h4>
                                    <p className="text-xs md:text-sm text-muted-foreground">
                                        Equipamentos sempre atualizados com as últimas tecnologias
                                    </p>
                                </motion.div>

                                <motion.div
                                    className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-primary/10"
                                    whileHover={{scale: 1.02, borderColor: "hsl(var(--primary) / 0.3)"}}
                                >
                                    <FaShieldAlt className="text-2xl text-primary mb-2"/>
                                    <h4 className="font-semibold mb-1">Qualidade</h4>
                                    <p className="text-xs md:text-sm text-muted-foreground">
                                        Manutenção preventiva e suporte técnico no evento
                                    </p>
                                </motion.div>

                                <motion.div
                                    className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-primary/10"
                                    whileHover={{scale: 1.02, borderColor: "hsl(var(--primary) / 0.3)"}}
                                >
                                    <FaHeart className="text-2xl text-primary mb-2"/>
                                    <h4 className="font-semibold mb-1">Atendimento</h4>
                                    <p className="text-xs md:text-sm text-muted-foreground">
                                        Consultores dedicados do orçamento à retirada
                                    </p>
                                </motion.div>

                                <motion.div
                                    className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-primary/10"
                                    whileHover={{scale: 1.02, borderColor: "hsl(var(--primary) / 0.3)"}}
                                >
                                    <FaGamepad className="text-2xl text-primary mb-2"/>
                                    <h4 className="font-semibold mb-1">Diversão</h4>
                                    <p className="text-xs md:text-sm text-muted-foreground">
                                        Garantia de entretenimento para todas as idades
                                    </p>
                                </motion.div>
                            </div>

                            <Button asChild className="w-full sm:w-auto">
                                <Link href="/sobre">
                                    Conhecer nossa história completa
                                </Link>
                            </Button>
                        </motion.div>
                    </div>

                    {/* Estatísticas */}
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 md:mt-20"
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.8, delay: 0.6}}
                    >
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-primary">10+</div>
                            <p className="text-sm text-muted-foreground mt-1">Anos de Experiência</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-primary">500+</div>
                            <p className="text-sm text-muted-foreground mt-1">Eventos Realizados</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-primary">98%</div>
                            <p className="text-sm text-muted-foreground mt-1">Satisfação</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-primary">24/7</div>
                            <p className="text-sm text-muted-foreground mt-1">Suporte</p>
                        </div>
                    </motion.div>
                </div>

                {/* Gradiente de transição suave no final */}
                <div className="absolute -bottom-1 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-background pointer-events-none z-20" />
            </section>

            {/* =============== SECTION 4 — CALL TO ACTION REDESENHO =============== */}
            <section className="relative overflow-hidden py-16 md:py-24">
                {/* Background com gradiente animado */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />
                    <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
                    {/* Gradiente suave no topo */}
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
                </div>

                {/* Elementos decorativos animados */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl"
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>

                <motion.div
                    className="relative z-10 mx-auto max-w-5xl px-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-[2px]">
                        <div className="relative rounded-3xl bg-background/[85%] backdrop-blur-xl p-8 md:p-12 lg:p-16">
                            {/* Padrão decorativo */}
                            <div className="absolute top-0 right-0 w-full h-full opacity-5">
                                <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                                    <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
                                        <circle cx="2" cy="2" r="1" fill="currentColor" />
                                    </pattern>
                                    <rect width="400" height="400" fill="url(#grid)" />
                                </svg>
                            </div>

                            <div className="relative flex flex-col items-center gap-6 text-center">
                                {/* Badge */}
                                <motion.div
                                    className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                                    Orçamento Grátis
                                </motion.div>

                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                                    Pronto para{' '}
                                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Transformar
                        </span>
                                    {' '}seu Evento?
                                </h2>

                                <p className="max-w-2xl text-base md:text-lg text-muted-foreground">
                                    Nossa equipe está pronta para criar a experiência perfeita para você.
                                    Orçamento personalizado em minutos!
                                </p>

                                {/* Benefícios rápidos */}
                                <div className="flex flex-wrap justify-center gap-4 my-4">
                                    {["✓ Resposta em minutos", "✓ Entrega grátis", "✓ Suporte 24h"].map((item, i) => (
                                        <motion.span
                                            key={i}
                                            className="text-sm text-muted-foreground"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + i * 0.1 }}
                                        >
                                            {item}
                                        </motion.span>
                                    ))}
                                </div>

                                {/* CTAs melhorados */}
                                <motion.div
                                    className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <Button
                                        size="lg"
                                        className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                                        asChild
                                    >
                                        <Link href="https://wa.me/+551142377766" target="_blank">
                                <span className="relative z-10 flex items-center gap-2">
                                    <FaWhatsapp className="h-5 w-5" />
                                    Fazer Orçamento Agora
                                </span>
                                            <motion.div
                                                className="absolute inset-0 bg-white"
                                                initial={{ x: "-100%" }}
                                                whileHover={{ x: 0 }}
                                                transition={{ type: "tween" }}
                                                style={{ opacity: 0.2 }}
                                            />
                                        </Link>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="group"
                                        asChild
                                    >
                                        <Link href="/catalogo">
                                            <FaGamepad className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                                            Ver Catálogo Completo
                                        </Link>
                                    </Button>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Gradiente de transição suave no final */}
                <div className="absolute -bottom-1 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-background pointer-events-none z-20" />
            </section>
        </main>
    );
}