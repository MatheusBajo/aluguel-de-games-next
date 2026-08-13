import Link from "next/link";
import type { Metadata } from "next";
import { getCatalog } from "@/lib/catalog.server";
import { Button } from "@/components/ui/button";
import { FaWhatsapp } from "react-icons/fa";
import { WHATSAPP_CONFIG } from "@/config/whatsapp.config";
import { Counter } from "@/components/ui/Counter";

export const metadata: Metadata = {
    title: "Sobre Nós - 33 Anos de História desde 1993",
    description:
        "Conheça a história da Aluguel de Games. Desde 1993 transformando festas e eventos em São Paulo com fliperamas, videokês, realidade virtual e muito mais. Tradição, qualidade e diversão.",
    alternates: { canonical: "https://www.alugueldegames.com.br/sobre" },
    openGraph: {
        title: "Sobre a Aluguel de Games - Desde 1993",
        description:
            "33+ anos transformando festas e eventos em São Paulo. Conheça nossa história, valores e missão.",
        url: "https://www.alugueldegames.com.br/sobre",
        siteName: "Aluguel de Games",
        locale: "pt_BR",
        type: "website",
    },
};

const linhaDoTempo = [
    {
        ano: "1993",
        titulo: "Onde tudo começou",
        texto:
            "Nasce a Aluguel de Games, levando entretenimento de qualidade para festas e eventos em São Paulo numa época em que fliperama ainda era a estrela das esquinas.",
    },
    {
        ano: "2000s",
        titulo: "O catálogo cresce",
        texto:
            "Videokês, máquinas de dança, simuladores e equipamentos para festas infantis entram no portfólio. A diversão ganha novos formatos.",
    },
    {
        ano: "2010s",
        titulo: "Era dos consoles",
        texto:
            "PlayStation, Xbox e Nintendo Wii viram presença obrigatória em eventos corporativos. Atendemos confraternizações de empresas que viram parceiras de longa data.",
    },
    {
        ano: "2020s",
        titulo: "Realidade Virtual",
        texto:
            "Investimos em VR, Oculus Quest e simuladores imersivos. A diversão fica ainda mais sensorial — e ainda mais memorável.",
    },
    {
        ano: "Hoje",
        titulo: "Mais de 60 atrações",
        texto:
            "Atendemos toda a Grande São Paulo com a mesma paixão de 1993, agora com um catálogo gigantesco e equipe experiente em qualquer tipo de evento.",
    },
];

const valores = [
    { num: "01", titulo: "Tradição", texto: "Mais de três décadas no mercado, com clientes que voltam geração após geração." },
    { num: "02", titulo: "Qualidade", texto: "Equipamentos modernos, com manutenção preventiva e suporte disponível se precisar." },
    { num: "03", titulo: "Atendimento", texto: "Consultor dedicado do primeiro orçamento até a retirada dos equipamentos." },
    { num: "04", titulo: "Diversão", texto: "Garantia de entretenimento de qualidade para todas as idades em qualquer evento." },
];

export default async function SobrePage() {
    const anos = new Date().getFullYear() - 1993;

    // Contagem real do catálogo, feita no build. Se o dono adicionar um produto,
    // o número sobe sozinho no próximo deploy — não tem número pra manter na mão.
    const catalogo = await getCatalog();
    const totalEquipamentos = catalogo.length;
    const totalCategorias = new Set(
        catalogo.map((item) => item.key.split("/")[0])
    ).size;

    return (
        <main className="relative overflow-hidden">
            {/* Decorações de fundo */}
            <div className="pointer-events-none absolute inset-0 grid-tron opacity-50" aria-hidden />
            <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" aria-hidden />

            {/* ============= HERO EDITORIAL ============= */}
            <section className="relative mx-auto max-w-6xl px-4 pt-16 pb-24 md:pt-24 md:pb-32">
                <p className="rise-in label-arcade text-purple-400 mb-6">
                    <span className="inline-block w-12 h-px bg-purple-400 align-middle mr-3" />
                    Capítulo 01 · A história
                </p>

                <h1 className="rise-in font-display font-extrabold leading-[0.92] tracking-tight text-5xl sm:text-6xl md:text-7xl lg:text-8xl" style={{ animationDelay: '120ms' }}>
                    Desde <span className="text-neon">1993</span>,<br />
                    transformando<br />
                    <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent italic">
                        festas em memórias.
                    </span>
                </h1>

                <div className="rise-in mt-12 grid gap-12 md:grid-cols-[2fr_1fr] md:gap-20" style={{ animationDelay: '240ms' }}>
                    <p className="font-body text-lg md:text-xl leading-relaxed text-muted-foreground max-w-2xl">
                        Quando um fliperama ainda era a estrela das esquinas, decidimos levá-lo para
                        festas e eventos. <strong className="text-foreground font-semibold">{anos} anos depois</strong>, a missão segue a mesma:
                        criar momentos inesquecíveis com entretenimento de qualidade — agora também
                        com VR, simuladores, consoles modernos e mais de 60 atrações no catálogo.
                    </p>

                    <div className="space-y-4 md:border-l md:border-purple-500/30 md:pl-8">
                        <div>
                            <Counter
                                to={anos}
                                suffix="+"
                                duration={2.2}
                                className="numeral-huge-filled !text-7xl md:!text-8xl block"
                            />
                            <p className="label-arcade text-muted-foreground mt-2">Anos no mercado</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* divisor neon */}
            <div className="mx-auto max-w-6xl px-4">
                <div className="divider-neon" />
            </div>

            {/* ============= LINHA DO TEMPO EDITORIAL ============= */}
            <section className="relative mx-auto max-w-6xl px-4 py-24 md:py-32">
                <div className="mb-16 flex items-end justify-between gap-4 flex-wrap">
                    <div>
                        <p className="label-arcade text-cyan-400 mb-3">Capítulo 02 · A trajetória</p>
                        <h2 className="font-display font-extrabold text-4xl md:text-6xl tracking-tight leading-[0.95]">
                            Cinco capítulos.<br />
                            <span className="text-muted-foreground/70">Uma só história.</span>
                        </h2>
                    </div>
                    <p className="label-arcade text-muted-foreground">
                        ↓ scroll
                    </p>
                </div>

                <ol className="space-y-2 md:space-y-0">
                    {linhaDoTempo.map((item, i) => (
                        <li
                            key={item.ano}
                            className="rise-in group relative grid gap-2 border-t border-border/50 py-8 md:grid-cols-[180px_1fr] md:gap-12 md:py-10 transition-colors hover:border-purple-500/50"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <p className="font-display text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                {item.ano}
                            </p>
                            <div className="md:pt-2">
                                <h3 className="font-display text-xl md:text-2xl font-bold mb-2 transition-colors group-hover:text-purple-300">
                                    {item.titulo}
                                </h3>
                                <p className="font-body text-base text-muted-foreground max-w-2xl leading-relaxed">
                                    {item.texto}
                                </p>
                            </div>
                            {/* Decoração lateral */}
                            <span className="hidden md:block absolute right-0 top-10 label-arcade text-muted-foreground/40 group-hover:text-purple-400/60 transition-colors">
                                {String(i + 1).padStart(2, '0')}/{linhaDoTempo.length}
                            </span>
                        </li>
                    ))}
                    <li className="border-t border-border/50" />
                </ol>
            </section>

            {/* ============= VALORES ============= */}
            <section className="relative mx-auto max-w-6xl px-4 py-24 md:py-32">
                <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" aria-hidden />

                <div className="relative">
                    <p className="label-arcade text-pink-400 mb-3">Capítulo 03 · O que nos move</p>
                    <h2 className="font-display font-extrabold text-4xl md:text-6xl tracking-tight leading-[0.95] mb-16">
                        Quatro pilares<br />
                        <span className="italic font-normal text-muted-foreground/80">que sustentam tudo.</span>
                    </h2>

                    <div className="grid gap-px bg-border/50 md:grid-cols-2 lg:grid-cols-4 rounded-2xl overflow-hidden border border-border/50">
                        {valores.map((v, i) => (
                            <article
                                key={v.num}
                                className="rise-in relative bg-background p-8 transition-all hover:bg-card/60 group"
                                style={{ animationDelay: `${i * 80}ms` }}
                            >
                                <p className="numeral-huge !text-7xl mb-4 transition-all group-hover:[-webkit-text-stroke-color:_rgba(168,85,247,0.9)]">
                                    {v.num}
                                </p>
                                <h3 className="font-display text-xl font-bold mb-2">{v.titulo}</h3>
                                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                                    {v.texto}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============= NÚMEROS / STATS ============= */}
            <section className="relative mx-auto max-w-6xl px-4 py-24">
                <div className="relative overflow-hidden rounded-3xl border-2 border-purple-500/30 bg-gradient-to-br from-blue-950/40 via-purple-950/40 to-pink-950/40 p-10 md:p-16">
                    <div className="absolute inset-0 dot-grid-dense opacity-30" aria-hidden />
                    <div className="relative">
                        <p className="label-arcade text-cyan-400 mb-3">Em números</p>
                        <h2 className="font-display font-extrabold text-3xl md:text-5xl mb-12 tracking-tight">
                            A escala da diversão.
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {/* SÓ NÚMERO CONTÁVEL. Saíram "500+ Eventos realizados" e
                                "98% Satisfação": ninguém mediu, ninguém consegue provar,
                                e alegação não comprovável é reprovação por Deturpação no
                                Google Ads + exposição no CDC art. 36. Os quatro de agora
                                saem de contagem real: anos vem da data de 1993 e
                                equipamentos/categorias são contados do próprio catálogo
                                a cada build, então nunca ficam desatualizados. */}
                            {[
                                { to: anos, suffix: "+", label: "Anos de mercado" },
                                { to: totalEquipamentos, suffix: "", label: "Equipamentos no catálogo" },
                                { to: totalCategorias, suffix: "", label: "Categorias" },
                                { to: 1993, suffix: "", label: "Na estrada desde" },
                            ].map((s, i) => (
                                <div key={s.label} className="rise-in" style={{ animationDelay: `${i * 100}ms` }}>
                                    <Counter
                                        to={s.to}
                                        suffix={s.suffix}
                                        duration={2 + i * 0.2}
                                        className="font-display font-extrabold text-4xl md:text-6xl tracking-tight bg-gradient-to-br from-blue-400 to-pink-400 bg-clip-text text-transparent block"
                                    />
                                    <p className="label-arcade text-muted-foreground mt-2">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ============= CTA ============= */}
            <section className="relative mx-auto max-w-6xl px-4 pb-24 md:pb-32">
                <div className="text-center">
                    <p className="label-arcade text-purple-400 mb-4">Capítulo final · sua vez</p>
                    <h2 className="font-display font-extrabold text-4xl md:text-6xl tracking-tight leading-[0.95] mb-6">
                        Faça parte do<br />
                        <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                            próximo capítulo.
                        </span>
                    </h2>
                    <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto mb-8">
                        Transformamos qualquer evento em uma história pra contar depois.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            asChild
                            size="lg"
                            className="bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 font-semibold"
                        >
                            <Link href={WHATSAPP_CONFIG.link} target="_blank" rel="noopener noreferrer">
                                <FaWhatsapp className="mr-2 h-5 w-5" />
                                Pedir orçamento no WhatsApp
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link href="/catalogo">Explorar catálogo</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    );
}
