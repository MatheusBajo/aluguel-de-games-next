// src/components/catalogo/CategoryComparisonTable.tsx
//
// Tabela comparativa da categoria (spec §4.5): modelo × specs. Só renderiza
// com ≥3 produtos que tenham spec real (senão OMITE — nada de tabela vazia).
// Hoje a spec real disponível é dimensão (migrada do nome do arquivo); quando o
// dono preencher jogadores/tomada no metadata, as colunas entram sozinhas.
import Link from "next/link";
import type { CatalogItem } from "@/lib/catalog.server";
import { resolveSpecs } from "@/lib/catalog-specs";
import { generateProductUrl } from "@/lib/slug-utils";

interface Row {
    titulo: string;
    href: string;
    dimensoes?: string;
    jogadores?: string;
    tomada?: string;
}

export function CategoryComparisonTable({ items }: { items: CatalogItem[] }) {
    const rows: Row[] = items.map((it) => {
        const s = resolveSpecs(it.specs, it.imagens);
        return {
            titulo: it.titulo,
            href: generateProductUrl(it.key),
            dimensoes: s.dimensoes,
            jogadores: s.jogadores,
            tomada: s.tomada,
        };
    });

    const withSpec = rows.filter((r) => r.dimensoes || r.jogadores || r.tomada);
    if (withSpec.length < 3) return null;

    const showJogadores = withSpec.some((r) => r.jogadores);
    const showTomada = withSpec.some((r) => r.tomada);

    return (
        <section className="mt-14">
            <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight mb-5">
                Compare os modelos
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card/40">
                <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
                    <thead>
                        <tr className="border-b border-border/60">
                            <th className="px-4 py-3 font-body font-semibold text-foreground">Modelo</th>
                            <th className="px-4 py-3 font-body font-semibold text-foreground">Dimensões</th>
                            {showJogadores && (
                                <th className="px-4 py-3 font-body font-semibold text-foreground">Jogadores</th>
                            )}
                            {showTomada && (
                                <th className="px-4 py-3 font-body font-semibold text-foreground">Tomada</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {withSpec.map((r, i) => (
                            <tr
                                key={r.href}
                                className={i !== withSpec.length - 1 ? "border-b border-border/40" : ""}
                            >
                                <td className="px-4 py-3">
                                    <Link href={r.href} className="font-medium text-cyan-400 hover:text-cyan-300">
                                        {r.titulo}
                                    </Link>
                                </td>
                                <td className="px-4 py-3 font-mono tabular-nums text-muted-foreground">
                                    {r.dimensoes ?? ""}
                                </td>
                                {showJogadores && (
                                    <td className="px-4 py-3 font-mono tabular-nums text-muted-foreground">
                                        {r.jogadores ?? ""}
                                    </td>
                                )}
                                {showTomada && (
                                    <td className="px-4 py-3 font-mono tabular-nums text-muted-foreground">
                                        {r.tomada ?? ""}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default CategoryComparisonTable;
