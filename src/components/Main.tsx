/* components/Main.tsx  */
"use client";

import {useRef} from "react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {DynamicGradient} from "@/components/hooks/DynamicGradient";

/*  ↓ importe as seções pesadas via dynamic para evitar SSR de GSAP etc. */
import dynamic from "next/dynamic";

const TopToys      = dynamic(() => import("@/components/sections/top-toys/TopToys"),      { ssr: false });
const ComoFunciona = dynamic(() => import("@/components/sections/como-funciona/ComoFunciona"), { ssr: false });
const FlyingEmojis = dynamic(() => import("@/components/hooks/FlyingEmojis"), { ssr: false });

export default function Main() {
    /* FlyingEmojis (se usar) precisa de um contêiner que exista no cliente */
    const emojisRef = useRef<HTMLDivElement | null>(null);

    return (
        <main className="mx-auto flex w-full flex-col gap-20 pt-5">
            {/* =============== SECTION 1 — TOP TOYS =============== */}
            <TopToys />

            {/* =============== SECTION 2 — COMO FUNCIONA =============== */}
            <ComoFunciona />

            {/* =============== SECTION 3 — SOBRE NÓS =============== */}
            <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 px-5 md:flex-row">
                {/* Logo + efeito */}
                <div className="relative flex shrink-0 flex-col items-center gap-5">
                    <DynamicGradient imageUrl="/carro-logo-aluguel-de-games.png" />
                    <img
                        src="/carro-logo-aluguel-de-games.png"
                        alt="Logo Aluguel de Games"


                        className="relative z-10 h-40 select-none dark:invert"
                    />
                    <span className="relative z-10 text-2xl font-bold uppercase">
            Aluguel de Games
          </span>
                </div>

                {/* Texto */}
                <div className="flex flex-col gap-5">
                    <h2 className="text-2xl font-bold">Sobre Nós</h2>
                    <p className="text-sm text-muted-foreground">
                        Há mais de 10 anos transformamos eventos em experiências marcantes.
                        Nossa missão é tornar o entretenimento de qualidade
                        <strong> acessível</strong> em todo o Brasil, levando desde
                        Fliperamas retrô até Realidade Virtual de última geração.
                    </p>
                    <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                        <li>
                            <strong>Inovação:</strong> Equipamentos sempre atualizados.
                        </li>
                        <li>
                            <strong>Qualidade:</strong> Manutenção preventiva e suporte
                            técnico no evento.
                        </li>
                        <li>
                            <strong>Excelência no atendimento:</strong> consultores dedicados
                            do orçamento à retirada.
                        </li>
                    </ul>
                    <Button asChild>
                        <Link href="/sobre">Saiba mais</Link>
                    </Button>
                </div>
            </section>


            {/* =============== SECTION 4 — CALL TO ACTION =============== */}
            <section className="rounded-md bg-secondary py-10 px-5 text-secondary-foreground">
                <div className="mx-auto flex max-w-[1000px] flex-col items-center gap-4 text-center">
                    <h2 className="text-xl font-bold">
                        Pronto para levar mais diversão ao seu evento?
                    </h2>
                    <p className="max-w-xl text-sm md:text-base">
                        Fale com a nossa equipe e monte o combo perfeito para sua festa,
                        feira ou confraternização.
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                        <Link href="/orcamento">Solicitar Orçamento</Link>
                    </Button>
                </div>
            </section>
        </main>
    );
}