// src/components/home/HomeHero.tsx
//
// D1 — Hero resposta (spec §3). ESTÁTICO, pinta sem JS (decisão de arquitetura):
//   - UMA foto real de evento como LCP: <img> ELEMENT (nunca CSS background —
//     o preload scanner não descobre bg), fetchPriority alto, dimensões fixas.
//   - Badge · H1 transacional · sub · CTA dual (verde WhatsApp + ghost âncora) · tel.
// D1.5 — Trust strip logo abaixo da dobra (a matemática de 1 tela não fecha).
//
// Server component: o CTA verde e a linha de tel são ilhas client (<WhatsAppCta>),
// o resto é HTML cru. O ghost "Ver o que tem" é <a href="#o-que-tem"> (sem JS).
import { WhatsAppCta } from "@/components/cta/WhatsAppCta";
import { TrustStrip } from "@/components/content/TrustStrip";
import { WHATSAPP_CONFIG } from "@/config/whatsapp.config";

// Foto real: fliperamas + pinballs montados num evento (message match do H1).
const HERO_IMG = "/carousel/compressed/da066c60-0c96-46ee-b01d-8f34deab7c6c.webp";

export function HomeHero() {
    return (
        <section className="relative w-full">
            {/* ---------- D1 ---------- */}
            <div className="relative w-full overflow-hidden">
                {/* LCP: foto real como <img>, dimensões fixas (sem CLS), prioridade alta */}
                <img
                    src={HERO_IMG}
                    alt="Fliperamas e pinballs montados para um evento na Grande São Paulo"
                    width={1283}
                    height={849}
                    fetchPriority="high"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                {/* Scrim pra legibilidade do texto sobre a foto (mais forte na base/esquerda) */}
                <div
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40"
                    aria-hidden
                />
                <div
                    className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent"
                    aria-hidden
                />

                {/* Conteúdo — mín. de uma tela; ancorado embaixo no mobile (scrim mais forte lá) */}
                <div className="relative z-10 mx-auto flex min-h-[620px] max-w-6xl flex-col justify-end px-4 pb-10 pt-24 sm:min-h-[600px] md:min-h-[680px] md:justify-center md:px-6 md:pb-16 md:pt-28">
                    <div className="max-w-2xl">
                        <p className="label-arcade mb-4 inline-flex items-center gap-2 text-cyan-300">
                            <span aria-hidden>★</span>
                            <span>Desde 1993 · Osasco e Grande SP</span>
                        </p>

                        <h1 className="font-display text-4xl font-extrabold leading-[0.98] tracking-tight text-white sm:text-5xl md:text-6xl">
                            Aluguel de fliperama, videokê e games{" "}
                            <span className="bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text italic text-transparent">
                                para festas
                            </span>
                        </h1>

                        <p className="mt-5 max-w-xl font-body text-base text-white/85 md:text-lg">
                            Entrega, montagem e suporte inclusos na Grande São Paulo. Desde 1993.
                        </p>

                        {/* CTA dual */}
                        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <WhatsAppCta
                                surface="home"
                                variant="primary"
                                className="w-full sm:w-auto"
                            >
                                Pedir orçamento no WhatsApp
                            </WhatsAppCta>

                            <a
                                href="#o-que-tem"
                                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border-2 border-white/25 bg-white/5 px-7 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:border-white/50 hover:bg-white/10 sm:w-auto"
                            >
                                Ver o que tem
                                <span aria-hidden>↓</span>
                            </a>
                        </div>

                        {/* tel + linha fora-do-horário (server-rendered nos dois estados) */}
                        <p className="mt-4 font-body text-sm text-white/75">
                            ou ligue{" "}
                            <a
                                href={`tel:${WHATSAPP_CONFIG.formattedNumber}`}
                                className="font-semibold text-white underline-offset-4 hover:underline tabular-nums"
                            >
                                {WHATSAPP_CONFIG.displayNumber}
                            </a>{" "}
                            · atendemos em horário comercial. Fora do horário? Manda mesmo assim,
                            respondemos no próximo período.
                        </p>
                    </div>

                    {/* Legenda da foto, dentro do scrim (canto inferior) */}
                    <p className="mt-8 self-start font-body text-xs text-white/55 md:absolute md:bottom-5 md:right-6 md:mt-0 md:self-auto">
                        Fliperamas e pinballs montados num evento real
                    </p>
                </div>
            </div>

            {/* ---------- D1.5 — Trust strip (estática, quebra em 2 linhas) ---------- */}
            <div className="border-y border-border/40 bg-background/60 py-4">
                <div className="mx-auto max-w-6xl px-4 md:px-6">
                    <TrustStrip />
                </div>
            </div>
        </section>
    );
}

export default HomeHero;
