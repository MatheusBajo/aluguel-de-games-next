// src/components/home/CategoryChips.tsx
//
// Régua de chips de categoria (SPEC-FINAL-V2 §3.4) — links internos pras LPs
// primárias de Ads (1 ad group : 1 página). Cores neon = CATEGORIA (label),
// nunca ação. Emoji só decorativo. 7 categorias-carro-chefe; Pinballs segue
// no header/footer. A fileira "Chegou no catálogo" (badge `novo`) foi OMITIDA:
// sem dado de novidade assinado pelo dono, marcar "novo" seria fabricação.
import Link from "next/link";

const CHIPS: { label: string; href: string; emoji: string; color: string }[] = [
    { label: "Fliperamas", href: "/catalogo/jogos-eletronicos/fliperamas/", emoji: "🕹️", color: "hover:border-cyan-500/60 hover:text-cyan-300" },
    { label: "Videokê & Karaokê", href: "/catalogo/videokes/", emoji: "🎤", color: "hover:border-pink-500/60 hover:text-pink-300" },
    { label: "Realidade Virtual", href: "/catalogo/realidade-virtual/", emoji: "🥽", color: "hover:border-purple-500/60 hover:text-purple-300" },
    { label: "Consoles", href: "/catalogo/jogos-eletronicos/consoles/", emoji: "🎮", color: "hover:border-blue-500/60 hover:text-blue-300" },
    { label: "Máquinas Arcade", href: "/catalogo/jogos-eletronicos/maquinas/", emoji: "💪", color: "hover:border-amber-500/60 hover:text-amber-300" },
    { label: "Jogos de Mesa", href: "/catalogo/jogos-de-mesa/", emoji: "🎱", color: "hover:border-green-500/60 hover:text-green-300" },
    { label: "Infláveis & Infantil", href: "/catalogo/piscinas-inflaveis-cama-elastica-infantil/", emoji: "🎈", color: "hover:border-rose-500/60 hover:text-rose-300" },
];

export default function CategoryChips() {
    return (
        <section aria-label="Categorias" className="w-full">
            <div className="mx-auto max-w-5xl px-4">
                <p className="label-arcade mb-4 text-center text-muted-foreground/60">
                    ▸ ou navegue por categoria
                </p>
                <div className="flex flex-wrap justify-center gap-2.5">
                    {CHIPS.map((c) => (
                        <Link
                            key={c.href}
                            href={c.href}
                            className={`inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/40 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors ${c.color}`}
                        >
                            <span aria-hidden>{c.emoji}</span>
                            {c.label}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
