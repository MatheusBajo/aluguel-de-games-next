// src/app/page.tsx — HOME V2 (SPEC-FINAL-V2 §3), seção por seção.
// Evolução do opus-4.8: carrossel MANTIDO (slide 1 server-side) + fileiras
// Netflix por ocasião. Ordem da spec:
//   3.1 Hero · 3.2 Trust strip · 3.3 Answer capsule · 3.4 Vitrine por ocasião
//   + chips · 3.5 Kits · 3.6 Quanto custa · 3.7 Top 10 · 3.8 Como funciona
//   · 3.9 Prova (fundida) · 3.10 FAQ · 3.11 CTA final.
import type { Metadata } from "next";

import { getCatalog } from "@/lib/catalog.server";
import { OCCASIONS, itemsForOccasion } from "@/lib/occasions";

import HomeHero from "@/components/home/HomeHero";
import TrustStrip from "@/components/home/TrustStrip";
import AnswerCapsule from "@/components/home/AnswerCapsule";
import OccasionRow from "@/components/home/OccasionRow";
import CategoryChips from "@/components/home/CategoryChips";
import KitsSection from "@/components/home/KitsSection";
import PriceTeaser from "@/components/home/PriceTeaser";
import HowItWorks from "@/components/home/HowItWorks";
import ProofSection from "@/components/home/ProofSection";
import HomeFaq from "@/components/home/HomeFaq";
import FinalCta from "@/components/home/FinalCta";
import TopToys from "@/components/sections/top-toys/TopToys";

export const metadata: Metadata = {
    title: {
        absolute: "Aluguel de Games SP | Fliperamas, Videokê e VR para Festas desde 1993",
    },
    description:
        "Desde 1993, aluguel de fliperamas, videokês, simuladores VR, consoles, pinball e máquinas de dança para festas e eventos em Osasco e Grande São Paulo. Entrega, montagem e suporte inclusos. Orçamento pelo WhatsApp.",
    alternates: { canonical: "https://www.alugueldegames.com.br" },
};

export default async function Home() {
    const items = await getCatalog();
    const rows = OCCASIONS.map((def) => ({ def, items: itemsForOccasion(items, def.id) }));

    return (
        <>
            {/* 3.1 Hero (carrossel + CTA no 1º viewport) */}
            <HomeHero />

            {/* 3.2 Trust strip verificável */}
            <TrustStrip />

            <div className="flex flex-col gap-16 py-12 md:gap-24 md:py-16">
                {/* 3.3 Answer capsule (primeiro texto corrido) */}
                <AnswerCapsule />

                {/* 3.4 Vitrine por ocasião + régua de chips */}
                <section id="catalogo-por-ocasiao" className="flex w-full flex-col gap-12 scroll-mt-24 md:gap-16">
                    <div className="mx-auto max-w-3xl px-4 text-center">
                        <p className="label-arcade mb-3 text-pink-400">▸ escolha por ocasião</p>
                        <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">
                            O que rola na sua festa
                        </h2>
                        <p className="mt-3 font-body text-muted-foreground">
                            Do pula-pula da criançada ao fliperama da firma. Passa o dedo e escolhe.
                        </p>
                    </div>

                    {rows.map(({ def, items }) => (
                        <OccasionRow key={def.id} def={def} items={items} />
                    ))}

                    <CategoryChips />
                </section>

                {/* 3.5 Kits */}
                <KitsSection />

                {/* 3.6 Quanto custa */}
                <PriceTeaser />

                {/* 3.7 Top 10 mais pedidos (sem ssr:false — existe no HTML) */}
                <section className="w-full">
                    <div className="mx-auto mb-8 max-w-3xl px-4 text-center md:mb-12">
                        <p className="label-arcade mb-3 text-cyan-400">★ top 10 mais pedidos</p>
                        <h2 className="font-display text-3xl font-extrabold leading-[0.95] tracking-tight md:text-5xl">
                            10 atrações{" "}
                            <span className="font-normal italic text-muted-foreground/70">que viraram tradição.</span>
                        </h2>
                    </div>
                    <TopToys />
                </section>

                {/* 3.8 Como funciona */}
                <HowItWorks />

                {/* 3.9 Prova (fundida: 1993 + Demonstra) */}
                <ProofSection />

                {/* 3.10 FAQ da home */}
                <HomeFaq />

                {/* 3.11 CTA final */}
                <FinalCta />
            </div>
        </>
    );
}
