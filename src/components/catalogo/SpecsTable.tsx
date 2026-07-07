// src/components/catalogo/SpecsTable.tsx
//
// Ficha técnica (SPEC-FINAL-V2 §4.6). SERVER component — HTML cru, zero JS.
// Renderiza chips de leitura rápida + <table> semântica (machine-readable:
// <th scope="row"> por atributo). Linha sem dado não existe; ficha vazia não
// renderiza nada (o pai decide o fallback). Fonte: buildSpecRows (specs{} do
// dono OU dimensões derivadas do nome de arquivo).
import type { CatalogItem } from '@/lib/catalog.server';
import { buildSpecRows, buildSpecChips } from '@/lib/product-specs';

export default function SpecsTable({ item }: { item: CatalogItem }) {
    const rows = buildSpecRows(item);
    if (!rows.length) return null;

    const chips = buildSpecChips(item);
    const hasApprox = rows.some((r) => r.approx);

    return (
        <section
            aria-label="Ficha técnica"
            className="rounded-2xl border border-border/60 bg-[var(--color-surface-fact)]/60 p-5 md:p-6"
        >
            <h2 className="mb-4 font-display text-lg font-bold tracking-tight md:text-xl">
                Ficha técnica
            </h2>

            {chips.length > 0 && (
                <ul className="mb-5 flex flex-wrap gap-2" aria-hidden>
                    {chips.map((c) => (
                        <li
                            key={c}
                            className="rounded-full border border-border/60 bg-card/60 px-3 py-1 font-mono text-xs text-[var(--color-fact)]"
                        >
                            {c}
                        </li>
                    ))}
                </ul>
            )}

            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                    <tbody>
                        {rows.map((r) => (
                            <tr key={r.label} className="border-b border-border/40 last:border-0">
                                <th
                                    scope="row"
                                    className="py-2.5 pr-4 text-left align-top font-body font-medium text-muted-foreground"
                                >
                                    {r.label}
                                </th>
                                <td className="py-2.5 text-right align-top font-mono text-[var(--color-fact)] tabular-nums">
                                    {r.value}
                                    {r.approx && <span className="ml-1 text-muted-foreground/70">*</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {hasApprox && (
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground/70">
                    * Medida aproximada. Confirme as dimensões exatas no WhatsApp antes do
                    evento (elevador, porta, espaço).
                </p>
            )}
        </section>
    );
}
