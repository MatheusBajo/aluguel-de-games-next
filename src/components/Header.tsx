"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { WhatsAppCta } from "@/components/cta/WhatsAppCta";
import MobileMenu from "@/components/MobileMenu";

/* ============================================================
   NAV ITEMS — adicione/remova aqui
   ============================================================ */
const navItems = [
    {
        label: "Catálogo",
        href: "/catalogo",
        dropdown: [
            { href: "/catalogo/jogos-eletronicos/fliperamas/", label: "Fliperamas", emoji: "🕹️" },
            { href: "/catalogo/videokes/", label: "Videokê & Karaokê", emoji: "🎤" },
            { href: "/catalogo/realidade-virtual/", label: "Realidade Virtual", emoji: "🥽" },
            { href: "/catalogo/jogos-eletronicos/consoles/", label: "Consoles", emoji: "🎮" },
            { href: "/catalogo/jogos-eletronicos/pinballs/", label: "Pinballs", emoji: "⚡" },
            { href: "/catalogo/jogos-eletronicos/maquinas/", label: "Máquinas", emoji: "💪" },
            { href: "/catalogo/jogos-de-mesa/", label: "Jogos de Mesa", emoji: "🎱" },
            { href: "/catalogo/piscinas-inflaveis-cama-elastica-infantil/", label: "Infláveis & Infantil", emoji: "🎈" },
        ],
    },
    {
        label: "Empresas",
        href: "/empresas",
    },
    {
        label: "Sobre",
        href: "/sobre",
        dropdown: [
            { href: "/sobre", label: "Nossa História" },
            { href: "/como-funciona", label: "Como Funciona" },
            { href: "/galeria", label: "Galeria" },
            { href: "/contato", label: "Contato" },
        ],
    },
];

export default function Header() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Scroll-reactive: muda densidade do header ao rolar
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Fecha dropdown ao mudar de rota
    useEffect(() => {
        setOpenDropdown(null);
    }, [pathname]);

    const handleEnter = (label: string) => {
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        setOpenDropdown(label);
    };
    const handleLeave = () => {
        closeTimerRef.current = setTimeout(() => setOpenDropdown(null), 150);
    };

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname?.startsWith(href);
    };

    return (
        <header
            className={`sticky top-0 z-50 w-full isolate border-b transition-all duration-300 ${
                scrolled
                    ? "border-border/60 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65"
                    : "border-transparent bg-background/40 backdrop-blur-md supports-[backdrop-filter]:bg-background/20"
            }`}
        >
            {/* Linha gradiente sutil no topo */}
            <span
                aria-hidden
                className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent transition-opacity duration-300 ${
                    scrolled ? "opacity-100" : "opacity-0"
                }`}
            />

            <nav
                className={`mx-auto grid items-center w-full max-w-screen-2xl px-4 md:px-6 transition-all duration-300 ${
                    scrolled ? "h-14" : "h-16 md:h-20"
                } grid-cols-[auto_1fr_auto] md:grid-cols-[1fr_auto_1fr] gap-4`}
            >
                {/* ============= LOGO ============= */}
                <Link
                    href="/"
                    className="group flex items-center gap-2.5 shrink-0 transition-opacity hover:opacity-80 justify-self-start"
                >
                    <span className="relative inline-flex">
                        <img
                            src="/carro-logo-aluguel-de-games.png"
                            alt="Aluguel de Games"
                            className={`dark:invert transition-all duration-300 ${
                                scrolled ? "h-5" : "h-5 md:h-6"
                            }`}
                        />
                    </span>
                    <span className="font-display font-extrabold uppercase tracking-tight text-sm md:text-base hidden sm:inline">
                        Aluguel de Games
                    </span>
                </Link>

                {/* ============= NAV CENTRAL (verdadeiramente centralizado via grid) ============= */}
                <div className="hidden md:flex justify-center items-center gap-1">
                    {navItems.map((item) => {
                        const active = isActive(item.href);
                        const hasDropdown = !!item.dropdown;

                        return (
                            <div
                                key={item.label}
                                className="relative"
                                onMouseEnter={() => hasDropdown && handleEnter(item.label)}
                                onMouseLeave={handleLeave}
                            >
                                <Link
                                    href={item.href}
                                    className={`group relative inline-flex items-center gap-1.5 px-3 py-2 font-medium text-sm transition-colors ${
                                        active
                                            ? "text-foreground"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    {item.label}
                                    {hasDropdown && (
                                        <ChevronDown
                                            className={`h-3.5 w-3.5 transition-transform ${
                                                openDropdown === item.label ? "rotate-180" : ""
                                            }`}
                                        />
                                    )}

                                    {/* Underline animado */}
                                    <span
                                        className={`absolute bottom-0 left-3 right-3 h-px origin-left bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-transform duration-300 ${
                                            active
                                                ? "scale-x-100"
                                                : "scale-x-0 group-hover:scale-x-100"
                                        }`}
                                    />
                                </Link>

                                {/* Dropdown */}
                                {hasDropdown && openDropdown === item.label && (
                                    <div
                                        className="absolute top-full left-1/2 -translate-x-1/2 pt-2"
                                        onMouseEnter={() => handleEnter(item.label)}
                                        onMouseLeave={handleLeave}
                                    >
                                        <div className="header-dropdown relative min-w-[260px] rounded-xl border border-border/60 bg-background/95 backdrop-blur-xl shadow-2xl shadow-purple-500/10 p-2">
                                            {/* Corner brackets ciano (HUD) */}
                                            <span className="absolute -top-px left-3 w-4 h-4 border-t-2 border-l-2 border-cyan-400/70 rounded-tl-md" />
                                            <span className="absolute -top-px right-3 w-4 h-4 border-t-2 border-r-2 border-cyan-400/70 rounded-tr-md" />

                                            <ul className="grid gap-0.5">
                                                {item.dropdown!.map((sub) => (
                                                    <li key={sub.href}>
                                                        <Link
                                                            href={sub.href}
                                                            className="group/sub flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-card hover:translate-x-0.5"
                                                            onClick={() => setOpenDropdown(null)}
                                                        >
                                                            {"emoji" in sub && (
                                                                <span className="text-base transition-transform group-hover/sub:scale-125 group-hover/sub:rotate-6">
                                                                    {sub.emoji}
                                                                </span>
                                                            )}
                                                            <span className="flex-1">{sub.label}</span>
                                                            <span className="text-muted-foreground/40 transition-all group-hover/sub:text-purple-400 group-hover/sub:translate-x-0.5">
                                                                →
                                                            </span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* ============= AÇÕES À DIREITA ============= */}
                <div className="flex items-center gap-2 justify-self-end">
                    {/* CTA Orçamento (desktop) */}
                    <WhatsAppCta
                        surface="global"
                        variant="compact"
                        className="hidden md:inline-flex"
                    >
                        Pedir orçamento
                    </WhatsAppCta>

                    {/* WhatsApp icon (mobile) */}
                    <WhatsAppCta
                        surface="global"
                        variant="icon"
                        className="md:hidden"
                    />

                    {/* Mobile menu */}
                    <MobileMenu />
                </div>
            </nav>
        </header>
    );
}
