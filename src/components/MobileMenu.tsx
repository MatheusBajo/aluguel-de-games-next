"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { WHATSAPP_CONFIG } from "@/config/whatsapp.config";
import { trackWhatsAppClick } from "@/lib/gtm-utils";

const equipamentos = [
    { href: "/catalogo/jogos-eletronicos/fliperamas/", label: "Fliperamas", emoji: "🕹️" },
    { href: "/catalogo/videokes/", label: "Videokê & Karaokê", emoji: "🎤" },
    { href: "/catalogo/realidade-virtual/", label: "Realidade Virtual", emoji: "🥽" },
    { href: "/catalogo/jogos-eletronicos/consoles/", label: "Consoles", emoji: "🎮" },
    { href: "/catalogo/jogos-eletronicos/pinballs/", label: "Pinballs", emoji: "⚡" },
    { href: "/catalogo/jogos-eletronicos/maquinas/", label: "Máquinas Arcade", emoji: "💪" },
    { href: "/catalogo/jogos-de-mesa/", label: "Jogos de Mesa", emoji: "🎱" },
    { href: "/catalogo/piscinas-inflaveis-cama-elastica-infantil/", label: "Infláveis e Infantil", emoji: "🎈" },
];

const paginas = [
    { href: "/", label: "Início" },
    { href: "/catalogo", label: "Catálogo Completo" },
    { href: "/sobre", label: "Sobre Nós" },
    { href: "/como-funciona", label: "Como Funciona" },
    { href: "/empresas", label: "Para Empresas" },
    { href: "/galeria", label: "Galeria" },
    { href: "/contato", label: "Contato" },
];

export default function MobileMenu() {
    const [open, setOpen] = useState(false);

    // Trava o scroll do body quando o menu está aberto
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    // Fecha com ESC
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                aria-label="Abrir menu"
                className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-muted/50 transition-colors"
            >
                <Menu className="h-6 w-6" />
            </button>

            {/* Backdrop */}
            <div
                onClick={() => setOpen(false)}
                aria-hidden="true"
                className={`fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm transition-opacity md:hidden ${
                    open ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
            />

            {/* Drawer da direita */}
            <aside
                role="dialog"
                aria-modal="true"
                aria-label="Menu de navegação"
                className={`fixed right-0 top-0 z-[1001] h-full w-[85%] max-w-sm overflow-y-auto border-l border-border bg-background shadow-2xl transition-transform md:hidden ${
                    open ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Header do drawer */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur p-4">
                    <Link
                        href="/"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2"
                    >
                        <img
                            src="/carro-logo-aluguel-de-games.png"
                            alt="Aluguel de Games"
                            className="h-6 dark:invert"
                        />
                        <span className="font-bold uppercase">Aluguel de Games</span>
                    </Link>
                    <button
                        onClick={() => setOpen(false)}
                        aria-label="Fechar menu"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted/50 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Conteúdo do menu */}
                <nav className="flex flex-col gap-6 p-4 pb-24">
                    {/* CTA WhatsApp */}
                    <Button
                        asChild
                        size="lg"
                        className="bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800"
                    >
                        <Link
                            href={WHATSAPP_CONFIG.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {
                                trackWhatsAppClick("mobile_menu_orcamento");
                                setOpen(false);
                            }}
                        >
                            <FaWhatsapp className="mr-2 h-5 w-5" />
                            Fazer orçamento agora
                        </Link>
                    </Button>

                    {/* Equipamentos */}
                    <div>
                        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            Equipamentos
                        </h3>
                        <ul className="space-y-1">
                            {equipamentos.map((eq) => (
                                <li key={eq.href}>
                                    <Link
                                        href={eq.href}
                                        onClick={() => setOpen(false)}
                                        className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted/50"
                                    >
                                        <span className="text-lg">{eq.emoji}</span>
                                        <span className="flex-1">{eq.label}</span>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Páginas */}
                    <div>
                        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            Navegação
                        </h3>
                        <ul className="space-y-1">
                            {paginas.map((p) => (
                                <li key={p.href}>
                                    <Link
                                        href={p.href}
                                        onClick={() => setOpen(false)}
                                        className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted/50"
                                    >
                                        {p.label}
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contato direto */}
                    <div className="rounded-lg border border-border/60 bg-card/40 p-4 text-sm">
                        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            Contato
                        </p>
                        <p className="font-medium">{WHATSAPP_CONFIG.displayNumber}</p>
                        <p className="text-xs text-muted-foreground">contato@alugueldegames.com.br</p>
                    </div>
                </nav>
            </aside>
        </>
    );
}
