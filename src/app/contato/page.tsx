import type { Metadata } from "next";
import { FaWhatsapp, FaInstagram, FaFacebookF } from "react-icons/fa";
import { Phone, Clock } from "@phosphor-icons/react/ssr";
import { WHATSAPP_CONFIG, getHoursLine } from "@/config/whatsapp.config";
import { WhatsAppCta, WhatsAppCtaMeta } from "@/components/cta/WhatsAppCta";
import ContactForm from "@/components/forms/ContactForm";

export const metadata: Metadata = {
    title: "Contato - Fale com a Aluguel de Games",
    description:
        "Entre em contato pelo WhatsApp (11) 96526-1000, formulário ou ligação. Atendemos toda a Grande São Paulo. Orçamento sem compromisso.",
    alternates: { canonical: "https://www.alugueldegames.com.br/contato" },
    openGraph: {
        title: "Contato - Aluguel de Games SP",
        description: "Fale com a gente pelo WhatsApp, formulário ou telefone. Orçamento personalizado sem compromisso.",
        url: "https://www.alugueldegames.com.br/contato",
        siteName: "Aluguel de Games",
        locale: "pt_BR",
        type: "website",
    },
};

export default function ContatoPage() {
    return (
        <main className="relative overflow-hidden">
            {/* Decorações */}
            <div className="pointer-events-none absolute inset-0 grid-tron opacity-30" aria-hidden />
            <div className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-green-500/10 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" aria-hidden />

            {/* ============= HERO ============= */}
            <section className="relative mx-auto max-w-5xl px-4 pt-16 pb-12 md:pt-24 md:pb-16">
                <p className="rise-in label-arcade text-green-400 mb-6 inline-flex items-center gap-2">
                    <span className="badge-live text-green-400">Online</span>
                    <span className="text-muted-foreground/60">·</span>
                    <span>Pronto pra atender</span>
                </p>

                <h1 className="rise-in font-display font-extrabold leading-[0.92] tracking-tight text-5xl sm:text-6xl md:text-7xl lg:text-8xl" style={{ animationDelay: '120ms' }}>
                    Fala com<br />
                    <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent italic">
                        a gente.
                    </span>
                </h1>

                <p className="rise-in mt-8 font-body text-lg md:text-xl text-muted-foreground max-w-xl" style={{ animationDelay: '240ms' }}>
                    Três formas de chegar até a gente — escolhe a que funciona melhor pra você.
                </p>
            </section>

            <div className="mx-auto max-w-5xl px-4">
                <div className="divider-neon" />
            </div>

            {/* ============= WHATSAPP DESTAQUE + TELEFONE ============= */}
            <section className="relative mx-auto max-w-5xl px-4 py-12 md:py-16">
                <p className="label-arcade text-cyan-400 mb-6">→ Canais rápidos</p>

                <div className="grid gap-4 md:grid-cols-5">
                    {/* WhatsApp destacado */}
                    <WhatsAppCta
                        surface="home"
                        variant="unstyled"
                        className="rise-in group relative overflow-hidden rounded-3xl border-2 border-green-500/40 bg-gradient-to-br from-green-500/10 via-green-600/10 to-emerald-700/10 p-8 transition-all hover:scale-[1.02] hover:border-green-400 hover:shadow-xl hover:shadow-green-500/20 md:col-span-3 block"
                    >
                        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-green-500/20 blur-3xl" />
                        <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-green-400" />
                        <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-green-400" />
                        <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-green-400" />
                        <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-green-400" />

                        <div className="relative">
                            <p className="label-arcade text-green-400 mb-4">★ Canal preferido</p>
                            <div className="flex items-center gap-4 mb-4">
                                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-600">
                                    <FaWhatsapp className="h-7 w-7 text-white" />
                                </span>
                                <span className="font-display text-3xl md:text-4xl font-extrabold">
                                    WhatsApp
                                </span>
                            </div>
                            <p className="font-mono text-3xl md:text-4xl font-bold tabular-nums">
                                {WHATSAPP_CONFIG.displayNumber}
                            </p>
                            <p className="font-body text-sm text-muted-foreground mt-3">
                                Toque pra abrir o WhatsApp →
                            </p>
                            <p className="font-body text-xs text-muted-foreground mt-2">
                                {getHoursLine()}
                            </p>
                        </div>
                    </WhatsAppCta>

                    {/* Telefone / ligação */}
                    <a
                        href={`tel:${WHATSAPP_CONFIG.formattedNumber}`}
                        className="rise-in group relative overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-7 transition-all hover:border-purple-500/50 hover:bg-card/70 md:col-span-2"
                        style={{ animationDelay: '100ms' }}
                    >
                        <p className="label-arcade text-purple-400 mb-4">☎ Ligação</p>
                        <div className="flex items-center gap-3 mb-3">
                            <Phone className="h-6 w-6 text-purple-400" weight="fill" />
                            <span className="font-display text-xl font-bold">Prefere ligar?</span>
                        </div>
                        <p className="font-mono text-base md:text-lg font-semibold tabular-nums">
                            {WHATSAPP_CONFIG.displayNumber}
                        </p>
                        <p className="font-body text-xs text-muted-foreground mt-3">
                            Dentro do horário comercial
                        </p>
                    </a>
                </div>
            </section>

            {/* ============= FORMULÁRIO ============= */}
            <section className="relative mx-auto max-w-4xl px-4 py-16 md:py-20">
                <div className="mb-10 text-center md:text-left">
                    <p className="label-arcade text-purple-400 mb-3">✉ Ou manda pelo formulário</p>
                    <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight leading-[0.95]">
                        Conta pra gente<br />
                        <span className="italic font-normal text-muted-foreground/80">como vai ser seu evento.</span>
                    </h2>
                    <p className="mt-4 font-body text-muted-foreground">
                        Preenche os dados abaixo. Ao enviar, abrimos um chat pré-preenchido no WhatsApp — é só confirmar.
                    </p>
                </div>

                {/* Card do form com contraste forte */}
                <div className="relative rounded-3xl border-2 border-purple-500/40 bg-gradient-to-br from-card/95 via-card/85 to-card/95 p-6 md:p-10 shadow-2xl shadow-purple-500/10">
                    {/* Decoração: dot pattern sutil no fundo */}
                    <div className="pointer-events-none absolute inset-0 dot-grid opacity-30 rounded-3xl" aria-hidden />

                    {/* Corner brackets arcade */}
                    <span className="pointer-events-none absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-cyan-400/70" aria-hidden />
                    <span className="pointer-events-none absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-cyan-400/70" aria-hidden />
                    <span className="pointer-events-none absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-cyan-400/70" aria-hidden />
                    <span className="pointer-events-none absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-cyan-400/70" aria-hidden />

                    {/* Glow decorativo */}
                    <div className="pointer-events-none absolute -top-20 -right-20 w-60 h-60 rounded-full bg-purple-500/15 blur-3xl" aria-hidden />
                    <div className="pointer-events-none absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-cyan-500/10 blur-3xl" aria-hidden />

                    {/* Badge topo */}
                    <div className="relative mb-6 flex items-center justify-between flex-wrap gap-3">
                        <span className="label-arcade text-cyan-400 inline-flex items-center gap-2">
                            <span className="badge-live text-cyan-400">form</span>
                            <span>preencha os dados</span>
                        </span>
                        <span className="label-arcade text-muted-foreground/50 font-mono">
                            ID: 0001
                        </span>
                    </div>

                    <div className="relative">
                        <ContactForm />
                    </div>
                </div>
            </section>

            {/* ============= HORÁRIO + ATENDIMENTO ============= */}
            <section className="relative mx-auto max-w-5xl px-4 py-16 md:py-20">
                <div className="grid gap-px bg-border/40 md:grid-cols-2 rounded-2xl overflow-hidden border border-border/40">
                    {/* Horário */}
                    <div className="bg-background p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Clock className="h-5 w-5 text-purple-400" weight="bold" />
                            <p className="label-arcade text-purple-400">Horário comercial</p>
                        </div>
                        {/* Horário específico só entra com confirmação do dono
                            [CONFIRMAR COM DONO: horário de atendimento seg-sex e sábado] */}
                        <p className="font-body text-sm text-muted-foreground leading-relaxed">
                            Atendemos em horário comercial. {getHoursLine()}
                        </p>
                        <p className="font-body text-xs text-muted-foreground mt-6 leading-relaxed">
                            Eventos acontecem em qualquer dia. Ficamos alcançáveis por telefone
                            durante o horário do evento caso algum equipamento precise de ajuste.
                        </p>
                    </div>

                    {/* Onde atendemos */}
                    <div className="bg-background p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="h-5 w-5 flex items-center justify-center text-cyan-400">📍</span>
                            <p className="label-arcade text-cyan-400">Onde atendemos</p>
                        </div>
                        <h3 className="font-display text-xl font-bold mb-3">
                            Toda a <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Grande São Paulo</span>
                        </h3>
                        <p className="font-body text-sm text-muted-foreground leading-relaxed">
                            Atendemos capital, ABC, Alphaville, Guarulhos, Osasco, Cotia e
                            grande parte da Grande SP. Também avaliamos outras regiões e litoral
                            conforme o evento.
                        </p>
                        <p className="font-body text-sm text-muted-foreground/80 mt-3 leading-relaxed">
                            <strong className="text-foreground">Não sabe se atendemos a sua região?</strong>{" "}
                            Manda uma mensagem no WhatsApp que a gente avalia caso a caso.
                        </p>
                    </div>
                </div>
            </section>

            {/* ============= REDES ============= */}
            <section className="relative mx-auto max-w-5xl px-4 py-16">
                <p className="label-arcade text-pink-400 mb-6">⊹ Onde mais nos achar</p>
                <div className="flex flex-wrap gap-3">
                    <a
                        href="https://instagram.com/alugueldegames"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 rounded-full border border-border/60 bg-background/50 backdrop-blur-sm px-5 py-3 font-medium transition-all hover:border-pink-500 hover:bg-pink-500/10"
                    >
                        <FaInstagram className="h-4 w-4 transition-transform group-hover:scale-125" />
                        Instagram
                    </a>
                    <a
                        href="https://facebook.com/alugueldegames"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 rounded-full border border-border/60 bg-background/50 backdrop-blur-sm px-5 py-3 font-medium transition-all hover:border-blue-500 hover:bg-blue-500/10"
                    >
                        <FaFacebookF className="h-4 w-4 transition-transform group-hover:scale-125" />
                        Facebook
                    </a>
                </div>
            </section>

            {/* ============= CTA ============= */}
            <section className="relative mx-auto max-w-5xl px-4 pb-24 md:pb-32">
                <div className="text-center">
                    <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight leading-[0.95] mb-4">
                        Vai ter festa?<br />
                        <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent italic">
                            Bora conversar.
                        </span>
                    </h2>
                    <div className="flex flex-col items-center gap-3">
                        <WhatsAppCta surface="home" variant="primary">
                            Iniciar conversa no WhatsApp
                        </WhatsAppCta>
                        <WhatsAppCtaMeta surface="home" />
                    </div>
                </div>
            </section>
        </main>
    );
}
