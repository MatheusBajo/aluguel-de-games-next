import Link from "next/link";
import { ogImagens } from '@/lib/og';
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { FaWhatsapp } from "react-icons/fa";
import { WHATSAPP_CONFIG } from "@/config/whatsapp.config";

export const metadata: Metadata = {
    title: "Aluguel de Games para Empresas - Eventos Corporativos em SP",
    description:
        "Locação de equipamentos de entretenimento para SIPAT, confraternização de fim de ano, lançamentos, treinamentos e team building. Atendimento corporativo dedicado, NF e contrato. Já atendemos Bradesco, entre outros.",
    alternates: { canonical: "https://www.alugueldegames.com.br/empresas" },
    openGraph: {
        title: "Aluguel de Games para Empresas",
        description:
            "Soluções B2B de entretenimento para eventos corporativos em São Paulo. SIPAT, confraternização, team building e mais.",
        url: "https://www.alugueldegames.com.br/empresas",
        siteName: "Aluguel de Games",
        locale: "pt_BR",
        type: "website",
        images: [{ url: "/carousel/compressed/Braland.webp", width: 1200, height: 630, alt: "Evento Bradesco - Braland" }],
    },
};

const ocasioes = [
    { emoji: "🛡️", tag: "RH / SST", titulo: "SIPAT" },
    { emoji: "🎄", tag: "Fim de Ano", titulo: "Confraternização" },
    { emoji: "🚀", tag: "Marketing", titulo: "Lançamento de Produto" },
    { emoji: "🤝", tag: "Cultura", titulo: "Team Building" },
    { emoji: "🎓", tag: "Treinamento", titulo: "Workshops" },
    { emoji: "🏢", tag: "Marca", titulo: "Inaugurações" },
];

const diferenciais = [
    { num: "01", titulo: "NF e contrato", texto: "Documentação completa pro financeiro." },
    { num: "02", titulo: "Consultor dedicado", texto: "Um único ponto de contato do briefing à execução." },
    { num: "03", titulo: "Equipe no local", texto: "Montagem e instalação profissional." },
    { num: "04", titulo: "Pacotes flexíveis", texto: "De 50 a 1000+ pessoas, sob medida." },
    { num: "05", titulo: "Pagamento facilitado", texto: "Boleto, faturamento, PIX e cartão." },
    { num: "06", titulo: "Toda a Grande SP", texto: "Capital, ABC, Alphaville e mais." },
];

export default function EmpresasPage() {
    return (
        <main className="relative overflow-hidden">
            {/* Decorações de fundo */}
            <div className="pointer-events-none absolute inset-0 grid-tron opacity-30" aria-hidden />
            <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" aria-hidden />

            {/* ============= HERO B2B ============= */}
            <section className="relative mx-auto max-w-7xl px-4 pt-16 pb-20 md:pt-24 md:pb-28">
                <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-16 items-end">
                    <div>
                        <p className="rise-in label-arcade text-cyan-400 mb-6 inline-flex items-center gap-2">
                            <span className="badge-live text-cyan-400">B2B</span>
                            <span className="text-muted-foreground/60">·</span>
                            <span>Soluções corporativas</span>
                        </p>

                        <h1 className="rise-in font-display font-extrabold leading-[0.92] tracking-tight text-5xl sm:text-6xl md:text-7xl lg:text-8xl" style={{ animationDelay: '120ms' }}>
                            Eventos<br />
                            <span className="italic font-normal text-muted-foreground/70">corporativos</span><br />
                            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                que ninguém
                            </span><br />
                            esquece.
                        </h1>

                        <p className="rise-in mt-8 font-body text-lg md:text-xl text-muted-foreground max-w-xl" style={{ animationDelay: '240ms' }}>
                            Equipamentos de entretenimento profissionais para SIPAT, confraternizações,
                            lançamentos e ativações de marca em São Paulo. Estrutura B2B completa.
                        </p>

                        <div className="rise-in mt-10 flex flex-col sm:flex-row gap-3" style={{ animationDelay: '360ms' }}>
                            <Button
                                asChild
                                size="lg"
                                className="bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 font-semibold"
                            >
                                <Link href={WHATSAPP_CONFIG.link} target="_blank" rel="noopener noreferrer">
                                    <FaWhatsapp className="mr-2 h-5 w-5" />
                                    Falar com consultor
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline">
                                <Link href="/catalogo">Ver catálogo</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Cartão lateral com case Bradesco */}
                    <aside className="rise-in relative" style={{ animationDelay: '500ms' }}>
                        <div className="relative overflow-hidden rounded-3xl border border-purple-500/30">
                            <img
                                src="/carousel/compressed/Braland.webp"
                                alt="Evento corporativo Bradesco - Braland"
                                className="w-full aspect-[4/5] object-cover"
                                loading="eager"
                            />
                            {/* Gradient suave só na base pra legibilidade do texto */}
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 p-6">
                                <p className="label-arcade text-cyan-300 mb-2">★ Case</p>
                                <p className="font-display text-2xl font-bold text-white">Bradesco · Braland</p>
                                <p className="font-body text-sm text-white/70 mt-1">
                                    Ativação corporativa de grande porte
                                </p>
                            </div>
                            {/* Corner brackets */}
                            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
                            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
                        </div>
                    </aside>
                </div>
            </section>

            <div className="mx-auto max-w-7xl px-4">
                <div className="divider-neon" />
            </div>

            {/* ============= CASES (BRADESCO + ARNOLD + VIDEO DINÂMICO) ============= */}
            <section className="relative mx-auto max-w-7xl px-4 py-24 md:py-32">
                <div className="mb-12 grid md:grid-cols-[1.5fr_1fr] gap-6 md:items-end">
                    <div>
                        <p className="label-arcade text-pink-400 mb-3">★ Cases em ação</p>
                        <h2 className="font-display font-extrabold text-4xl md:text-6xl tracking-tight leading-[0.95]">
                            Quem já jogou<br />
                            <span className="italic font-normal text-muted-foreground/80">com a gente.</span>
                        </h2>
                    </div>
                    <p className="font-body text-muted-foreground text-sm md:text-base">
                        De gigantes do mercado financeiro a grandes eventos fitness —
                        nossa estrutura atende qualquer porte de ativação corporativa.
                    </p>
                </div>

                {/* Grid de cases: 3 cards 9:16 — Bradesco (foto) + 2 vídeos verticais */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Case 1: Bradesco */}
                    <article className="rise-in group relative overflow-hidden rounded-2xl border-2 border-cyan-500/30 bg-black aspect-[9/16]">
                        <img
                            src="/carousel/compressed/Braland.webp"
                            alt="Evento corporativo Bradesco - Braland"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                        />
                        {/* Gradient suave SÓ no rodapé — deixa a mídia respirar */}
                        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
                        <span className="pointer-events-none absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
                        <span className="pointer-events-none absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-400" />

                        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                            <p className="label-arcade text-cyan-300 mb-2 text-[10px]">▸ Ativação corporativa</p>
                            <h3 className="font-display font-extrabold text-white text-2xl md:text-3xl leading-[1.05] mb-1">
                                Bradesco
                            </h3>
                            <p className="font-display text-sm text-cyan-200/80 italic mb-2">Braland</p>
                            <p className="font-body text-xs md:text-sm text-white/75 leading-snug">
                                Ativação corporativa de grande porte para colaboradores e convidados do banco.
                            </p>
                        </div>
                    </article>

                    {/* Case 2: Arnold Classic 2025 (vídeo 9:16) */}
                    <article className="rise-in group relative overflow-hidden rounded-2xl border-2 border-pink-500/30 bg-black aspect-[9/16]" style={{ animationDelay: '120ms' }}>
                        <video
                            src="/demonstra/20250405_165640.mp4"
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            aria-label="Arnold Classic 2025 no Expo Center"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Gradient suave SÓ no rodapé — deixa a mídia respirar */}
                        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
                        <span className="pointer-events-none absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-pink-400" />
                        <span className="pointer-events-none absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-pink-400" />

                        {/* Badge "Vídeo" */}
                        <span className="absolute top-4 right-14 badge-live text-pink-300 bg-black/60 backdrop-blur-md px-2 py-1 rounded-sm border border-pink-400/30 text-[10px]">
                            Vídeo
                        </span>

                        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                            <p className="label-arcade text-pink-300 mb-2 text-[10px]">▸ Evento fitness 2025</p>
                            <h3 className="font-display font-extrabold text-white text-2xl md:text-3xl leading-[1.05] mb-1">
                                Arnold Classic
                            </h3>
                            <p className="font-display text-sm text-pink-200/80 italic mb-2">Expo Center · SP</p>
                            <p className="font-body text-xs md:text-sm text-white/75 leading-snug">
                                Ativação no maior evento fitness do Brasil, com grandes nomes do mercado.
                            </p>
                        </div>
                    </article>

                    {/* Case 3: Equipamentos em ação (vídeo dinâmico) */}
                    <article className="rise-in group relative overflow-hidden rounded-2xl border-2 border-purple-500/30 bg-black aspect-[9/16] sm:col-span-2 lg:col-span-1" style={{ animationDelay: '240ms' }}>
                        <video
                            src="/demonstra/WhatsApp Video 2021-08-09 at 11.57.30.mp4"
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            aria-label="Nossos equipamentos em ação"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Gradient suave SÓ no rodapé — deixa a mídia respirar */}
                        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
                        <span className="pointer-events-none absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-purple-400" />
                        <span className="pointer-events-none absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-purple-400" />

                        <span className="absolute top-4 right-14 badge-live text-purple-300 bg-black/60 backdrop-blur-md px-2 py-1 rounded-sm border border-purple-400/30 text-[10px]">
                            Vídeo
                        </span>

                        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                            <p className="label-arcade text-purple-300 mb-2 text-[10px]">▶ Em ação</p>
                            <h3 className="font-display font-extrabold text-white text-2xl md:text-3xl leading-[1.05] mb-1">
                                Equipamentos
                            </h3>
                            <p className="font-display text-sm text-purple-200/80 italic mb-2">ao vivo</p>
                            <p className="font-body text-xs md:text-sm text-white/75 leading-snug">
                                Um apanhado de setups reais em festas e eventos que já animamos.
                            </p>
                        </div>
                    </article>
                </div>

                <p className="mt-6 text-sm text-muted-foreground italic text-center">
                    33+ anos atendendo desde eventos pequenos até grandes ativações corporativas.
                </p>
            </section>

            {/* ============= CTA PUNCH (logo após cases) ============= */}
            <section className="relative mx-auto max-w-7xl px-4 pb-16">
                <div className="relative overflow-hidden rounded-3xl border-2 border-green-500/40 bg-gradient-to-br from-green-950/40 via-emerald-950/30 to-background p-6 md:p-10">
                    <div className="pointer-events-none absolute -top-20 -right-20 w-60 h-60 rounded-full bg-green-500/20 blur-3xl" />
                    <span className="pointer-events-none absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-green-400" />
                    <span className="pointer-events-none absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-green-400" />

                    <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <p className="label-arcade text-green-400 mb-2">▸ Sua vez</p>
                            <h3 className="font-display font-extrabold text-2xl md:text-4xl tracking-tight leading-[1.05]">
                                Seu evento pode<br className="hidden md:block" />
                                <span className="italic font-normal text-muted-foreground/80"> ser o próximo case.</span>
                            </h3>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                            <Button
                                asChild
                                size="lg"
                                className="bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-500 hover:to-green-600 font-semibold px-8 shadow-lg shadow-green-500/30"
                            >
                                <Link href={WHATSAPP_CONFIG.link} target="_blank" rel="noopener noreferrer">
                                    <FaWhatsapp className="mr-2 h-5 w-5" />
                                    Falar com consultor
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============= OCASIÕES (enxuto) ============= */}
            <section className="relative mx-auto max-w-7xl px-4 py-20 md:py-24">
                <div className="mb-10 max-w-3xl">
                    <p className="label-arcade text-purple-400 mb-3">→ Ocasiões</p>
                    <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight leading-[0.95]">
                        Para qualquer tipo<br />
                        <span className="italic font-normal text-muted-foreground/80">de evento corporativo.</span>
                    </h2>
                </div>

                <div className="grid gap-px bg-border/40 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 rounded-2xl overflow-hidden border border-border/40">
                    {ocasioes.map((o, i) => (
                        <article
                            key={o.titulo}
                            className="rise-in group relative bg-background p-5 md:p-6 transition-all hover:bg-card/60 text-center md:text-left"
                            style={{ animationDelay: `${i * 50}ms` }}
                        >
                            <span className="text-4xl md:text-5xl block mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 origin-center md:origin-left">
                                {o.emoji}
                            </span>
                            <p className="label-arcade text-purple-400/70 mb-1 text-[10px]">{o.tag}</p>
                            <h3 className="font-display text-sm md:text-base font-bold group-hover:text-purple-300 transition-colors leading-tight">
                                {o.titulo}
                            </h3>
                        </article>
                    ))}
                </div>
            </section>

            {/* ============= DIFERENCIAIS B2B (enxuto, grid) ============= */}
            <section className="relative mx-auto max-w-7xl px-4 py-20 md:py-24">
                <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" aria-hidden />

                <div className="relative">
                    <div className="mb-10 max-w-3xl">
                        <p className="label-arcade text-pink-400 mb-3">★ Por que empresas escolhem</p>
                        <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight leading-[0.95]">
                            Estrutura corporativa<br />
                            <span className="bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
                                completa.
                            </span>
                        </h2>
                    </div>

                    <div className="grid gap-px bg-border/40 grid-cols-2 md:grid-cols-3 rounded-2xl overflow-hidden border border-border/40">
                        {diferenciais.map((d, i) => (
                            <div
                                key={d.num}
                                className="rise-in group bg-background p-5 md:p-6 transition-all hover:bg-card/60"
                                style={{ animationDelay: `${i * 50}ms` }}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-mono font-bold text-purple-400 text-sm">{d.num}</span>
                                    <div className="h-px flex-1 bg-border/60 group-hover:bg-purple-500/40 transition-colors" />
                                </div>
                                <h3 className="font-display text-base md:text-lg font-bold mb-1 group-hover:text-purple-300 transition-colors">{d.titulo}</h3>
                                <p className="font-body text-xs md:text-sm text-muted-foreground leading-snug">{d.texto}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============= COMO CONTRATAR ============= */}
            <section className="relative mx-auto max-w-7xl px-4 py-24 md:py-32">
                <div className="mb-16">
                    <p className="label-arcade text-cyan-400 mb-3">↳ Processo</p>
                    <h2 className="font-display font-extrabold text-4xl md:text-6xl tracking-tight leading-[0.95]">
                        Como contratar.
                    </h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[
                        { num: "01", titulo: "Brief", texto: "Você nos conta sobre o evento (data, local, público, objetivo) via WhatsApp ou e-mail." },
                        { num: "02", titulo: "Proposta", texto: "Em até 1 dia útil você recebe proposta detalhada com equipamentos e investimento." },
                        { num: "03", titulo: "Contrato", texto: "Definimos os detalhes finais, emitimos contrato e enviamos para assinatura." },
                        { num: "04", titulo: "Execução", texto: "Equipe entrega, monta, testa e fica acompanhando durante o horário do evento." },
                    ].map((step, i) => (
                        <div
                            key={step.num}
                            className="rise-in relative rounded-2xl border border-border/60 bg-card/40 p-6 transition-all hover:border-purple-500/50 hover:bg-card/70"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <p className="numeral-huge !text-5xl mb-3">{step.num}</p>
                            <h3 className="font-display text-lg font-bold mb-2">{step.titulo}</h3>
                            <p className="font-body text-sm text-muted-foreground leading-relaxed">{step.texto}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ============= CTA ============= */}
            <section className="relative mx-auto max-w-7xl px-4 pb-24 md:pb-32">
                <div className="relative overflow-hidden rounded-3xl border-2 border-purple-500/40 bg-gradient-to-br from-blue-950/50 via-purple-950/50 to-pink-950/50 p-10 md:p-16">
                    <div className="absolute inset-0 dot-grid-dense opacity-30" aria-hidden />
                    <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-pink-500/20 blur-3xl" aria-hidden />

                    <div className="relative grid md:grid-cols-[1.5fr_1fr] gap-10 items-center">
                        <div>
                            <p className="label-arcade text-cyan-400 mb-4">→ Vamos conversar</p>
                            <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight leading-[0.95] mb-4">
                                Pronto para o<br />
                                próximo evento?
                            </h2>
                            <p className="font-body text-base md:text-lg text-muted-foreground max-w-lg">
                                Atendimento dedicado, proposta em até 1 dia útil, sem compromisso. Atendemos toda a Grande SP.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 md:items-end">
                            <Button
                                asChild
                                size="lg"
                                className="bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 font-semibold w-full md:w-auto"
                            >
                                <Link href={WHATSAPP_CONFIG.link} target="_blank" rel="noopener noreferrer">
                                    <FaWhatsapp className="mr-2 h-5 w-5" />
                                    Falar com consultor B2B
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="w-full md:w-auto">
                                <Link href="/contato">Outras formas de contato</Link>
                            </Button>
                            <p className="label-arcade text-muted-foreground/70 mt-2 text-right">
                                NF · Contrato · Grande SP
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
