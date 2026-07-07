import Link from "next/link";
import { WHATSAPP_CONFIG, getHoursLine } from "@/config/whatsapp.config";
import { CNPJ, GBP_URL } from "@/lib/schema";
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import { Phone, Envelope, GpsFix } from "@phosphor-icons/react/ssr";
import { WhatsAppCta } from "@/components/cta/WhatsAppCta";

export default function Footer() {
    const anosDeAtuacao = new Date().getFullYear() - 1993;
    const ano = new Date().getFullYear();

    return (
        <footer className="relative mt-24 md:mt-32 w-full overflow-hidden border-t border-border/60 bg-background">
            {/* Decorações sutis */}
            <div className="pointer-events-none absolute inset-0 grid-tron opacity-20" aria-hidden />
            <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-72 w-[600px] rounded-full bg-purple-500/10 blur-3xl" aria-hidden />

            <div className="relative mx-auto max-w-screen-2xl px-6 md:px-10">

                {/* ============= TOP STRIP — CTA grande ============= */}
                <div className="border-b border-border/50 py-12 md:py-16">
                    <div className="grid lg:grid-cols-[2fr_1fr] gap-8 items-end">
                        <div>
                            <p className="label-arcade text-cyan-400 mb-3">▸ vamos jogar?</p>
                            <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight leading-[0.95]">
                                Sua festa.<br />
                                <span className="italic font-normal text-muted-foreground/70">
                                    Nossa diversão.
                                </span>
                            </h2>
                        </div>
                        <WhatsAppCta
                            surface="home"
                            variant="primary"
                            withMeta
                            metaAlign="right"
                            className="rounded-full px-8 py-4 h-auto hover:scale-[1.03]"
                            wrapperClassName="lg:justify-self-end items-center lg:items-end text-center lg:text-right"
                        >
                            Pedir orçamento no WhatsApp
                        </WhatsAppCta>
                    </div>
                </div>

                {/* ============= MEIO — 4 colunas ============= */}
                <div className="grid gap-10 md:grid-cols-12 py-12 md:py-16">

                    {/* Col 1: Branding (4 cols) */}
                    <div className="md:col-span-4 space-y-4">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <img
                                src="/carro-logo-aluguel-de-games.png"
                                alt="Aluguel de Games"
                                className="h-7 dark:invert select-none"
                            />
                            <span className="font-display font-extrabold uppercase tracking-tight text-base">
                                Aluguel de Games
                            </span>
                        </Link>
                        <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-sm">
                            Desde 1993 entregando entretenimento de qualidade
                            para festas e eventos em toda a Grande São Paulo.
                        </p>
                        <div className="flex items-center gap-2 pt-2">
                            <WhatsAppCta
                                surface="global"
                                variant="icon"
                                className="h-9 w-9 border border-border/60 bg-card/40 text-muted-foreground hover:bg-green-500/10 hover:border-green-500/60 hover:text-green-400"
                            />
                            <a
                                href="https://instagram.com/alugueldegames"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/40 text-muted-foreground hover:bg-pink-500/10 hover:border-pink-500/60 hover:text-pink-400 transition-all"
                            >
                                <FaInstagram className="h-4 w-4" />
                            </a>
                            <a
                                href="https://facebook.com/alugueldegames"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/40 text-muted-foreground hover:bg-blue-500/10 hover:border-blue-500/60 hover:text-blue-400 transition-all"
                            >
                                <FaFacebookF className="h-3.5 w-3.5" />
                            </a>
                        </div>
                    </div>

                    {/* Col 2: Catálogo (3 cols) — 7 categorias + hub */}
                    <div className="md:col-span-3">
                        <p className="label-arcade text-purple-400 mb-4">→ Catálogo</p>
                        <ul className="space-y-2.5 font-body text-sm">
                            {[
                                { href: "/catalogo/jogos-eletronicos/fliperamas/", label: "Fliperamas" },
                                { href: "/catalogo/videokes/", label: "Videokês" },
                                { href: "/catalogo/realidade-virtual/", label: "Realidade Virtual" },
                                { href: "/catalogo/jogos-eletronicos/consoles/", label: "Consoles" },
                                { href: "/catalogo/jogos-eletronicos/pinballs/", label: "Pinballs" },
                                { href: "/catalogo/jogos-eletronicos/maquinas/", label: "Máquinas Arcade" },
                                { href: "/catalogo/jogos-de-mesa/", label: "Jogos de Mesa" },
                                { href: "/catalogo", label: "Ver tudo →" },
                            ].map((l) => (
                                <li key={l.href}>
                                    <Link
                                        href={l.href}
                                        className="text-muted-foreground hover:text-foreground transition-colors hover:translate-x-0.5 inline-block"
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3: Páginas (2 cols) */}
                    <div className="md:col-span-2">
                        <p className="label-arcade text-cyan-400 mb-4">→ Empresa</p>
                        <ul className="space-y-2.5 font-body text-sm">
                            {[
                                { href: "/sobre", label: "Sobre nós" },
                                { href: "/empresas", label: "Para empresas" },
                                { href: "/como-funciona", label: "Como funciona" },
                                { href: "/galeria", label: "Galeria" },
                                { href: "/contato", label: "Contato" },
                                { href: "/privacidade", label: "Privacidade (LGPD)" },
                            ].map((l) => (
                                <li key={l.href}>
                                    <Link
                                        href={l.href}
                                        className="text-muted-foreground hover:text-foreground transition-colors hover:translate-x-0.5 inline-block"
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 4: Contato / NAP (3 cols) */}
                    <div className="md:col-span-3">
                        <p className="label-arcade text-pink-400 mb-4">→ Contato</p>
                        <ul className="space-y-3 font-body text-sm text-muted-foreground">
                            <li className="flex items-start gap-2.5">
                                <GpsFix weight="fill" className="h-4 w-4 mt-0.5 text-pink-400/70 shrink-0" />
                                <span>
                                    Osasco · SP
                                    <br />
                                    Atendemos toda a Grande São Paulo
                                    {/* [CONFIRMAR COM DONO: endereço completo com rua/número/CEP] */}
                                </span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Phone weight="fill" className="h-4 w-4 text-pink-400/70 shrink-0" />
                                <a
                                    href={`tel:${WHATSAPP_CONFIG.formattedNumber}`}
                                    className="font-semibold text-foreground hover:text-pink-400 transition-colors tabular-nums"
                                >
                                    {WHATSAPP_CONFIG.displayNumber}
                                </a>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Envelope weight="fill" className="h-4 w-4 text-pink-400/70 shrink-0" />
                                <a
                                    href="mailto:contato@alugueldegames.com.br"
                                    className="hover:text-foreground transition-colors break-all"
                                >
                                    contato@alugueldegames.com.br
                                </a>
                            </li>
                            <li className="text-xs leading-relaxed">
                                {getHoursLine()}
                            </li>
                            {GBP_URL && (
                                <li>
                                    <a
                                        href={GBP_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs hover:text-foreground transition-colors"
                                    >
                                        Avalie a gente no Google →
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* ============= BOTTOM (legal / LGPD) ============= */}
                <div className="border-t border-border/50 py-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="text-center md:text-left">
                        <p className="label-arcade text-muted-foreground/70">
                            © {ano} Aluguel de Games · {anosDeAtuacao}+ anos de mercado
                        </p>
                        <p className="font-body text-xs text-muted-foreground/70 mt-1">
                            CNPJ: {CNPJ ?? "[CONFIRMAR COM DONO: CNPJ]"} ·{" "}
                            <Link href="/privacidade" className="hover:text-foreground transition-colors underline underline-offset-2">
                                Política de privacidade
                            </Link>
                        </p>
                    </div>
                    <p className="label-arcade text-muted-foreground/50">
                        ★ Desde 1993 · Osasco e Grande SP
                    </p>
                </div>
            </div>
        </footer>
    );
}
