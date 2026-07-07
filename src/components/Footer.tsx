import Link from "next/link";
import { WHATSAPP_CONFIG } from "@/config/whatsapp.config";
import { FaWhatsapp, FaInstagram, FaFacebookF } from "react-icons/fa";
import { Phone, Envelope, GpsFix } from "@phosphor-icons/react/ssr";

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
                        <Link
                            href={WHATSAPP_CONFIG.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-green-500/30 transition-all hover:scale-[1.03] hover:shadow-xl hover:shadow-green-500/40 lg:justify-self-end"
                        >
                            <FaWhatsapp className="h-5 w-5" />
                            <span>Pedir orçamento</span>
                            <span className="transition-transform group-hover:translate-x-1">→</span>
                        </Link>
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
                            <a
                                href={WHATSAPP_CONFIG.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="WhatsApp"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/40 text-muted-foreground hover:bg-green-500/10 hover:border-green-500/60 hover:text-green-400 transition-all"
                            >
                                <FaWhatsapp className="h-4 w-4" />
                            </a>
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

                    {/* Col 2: Catálogo (3 cols) */}
                    <div className="md:col-span-3">
                        <p className="label-arcade text-purple-400 mb-4">→ Catálogo</p>
                        <ul className="space-y-2.5 font-body text-sm">
                            {[
                                { href: "/catalogo/jogos-eletronicos/fliperamas/", label: "Fliperamas" },
                                { href: "/catalogo/videokes/", label: "Videokês" },
                                { href: "/catalogo/realidade-virtual/", label: "Realidade Virtual" },
                                { href: "/catalogo/jogos-eletronicos/consoles/", label: "Consoles" },
                                { href: "/catalogo/jogos-eletronicos/pinballs/", label: "Pinballs" },
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

                    {/* Col 4: Contato (3 cols) */}
                    <div className="md:col-span-3">
                        <p className="label-arcade text-pink-400 mb-4">→ Contato</p>
                        <ul className="space-y-3 font-body text-sm text-muted-foreground">
                            <li className="flex items-start gap-2.5">
                                <GpsFix weight="fill" className="h-4 w-4 mt-0.5 text-pink-400/70 shrink-0" />
                                <span>Atendemos toda a<br />Grande São Paulo</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Phone weight="fill" className="h-4 w-4 text-pink-400/70 shrink-0" />
                                <a
                                    href={`tel:${WHATSAPP_CONFIG.formattedNumber}`}
                                    className="font-mono font-semibold text-foreground hover:text-pink-400 transition-colors tabular-nums"
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
                        </ul>
                    </div>
                </div>

                {/* ============= BOTTOM ============= */}
                <div className="border-t border-border/50 py-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <p className="label-arcade text-muted-foreground/70 text-center md:text-left">
                        © {ano} Aluguel de Games · {anosDeAtuacao}+ anos de mercado
                    </p>
                    <p className="label-arcade text-muted-foreground/50">
                        ★ Desde 1993 · Grande SP
                    </p>
                </div>
            </div>
        </footer>
    );
}
