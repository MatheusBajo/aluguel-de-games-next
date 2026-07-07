// src/components/catalogo/SpecsTable.tsx
//
// Ficha técnica <table> legível (mono/tabular-nums, spec §4.5) E machine-readable
// (as mesmas linhas viram `additionalProperty` no Product JSON-LD — page.tsx usa
// `specsToRows`). Server component: existe no HTML cru (aceite audit:raw).
// Linha sem dado NÃO renderiza; sem nenhuma spec, a tabela inteira some (§1.3).

import type { ProductSpecs } from '@/lib/catalog-specs';
import { specsToRows } from '@/lib/catalog-specs';
import { cn } from '@/lib/utils';

export function SpecsTable({
    specs,
    className,
}: {
    specs?: ProductSpecs | null;
    className?: string;
}) {
    const rows = specsToRows(specs);
    if (!rows.length) return null;

    return (
        <section className={cn('scroll-mt-24', className)} id="ficha-tecnica">
            <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight mb-5">
                Ficha técnica
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card/40">
                <table className="w-full border-collapse text-left">
                    <tbody>
                        {rows.map((row, i) => (
                            <tr
                                key={row.label}
                                className={cn(
                                    'align-top',
                                    i !== rows.length - 1 && 'border-b border-border/40'
                                )}
                            >
                                <th
                                    scope="row"
                                    className="w-2/5 min-w-[9rem] px-4 py-3 font-body text-sm font-semibold text-foreground"
                                >
                                    {row.label}
                                </th>
                                <td className="px-4 py-3 font-mono text-sm tabular-nums text-muted-foreground">
                                    {row.value}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="mt-3 font-body text-xs text-muted-foreground">
                Medidas informadas pela nossa equipe. Confirma o espaço no seu local? A gente ajuda a dimensionar no WhatsApp.
            </p>
        </section>
    );
}

export default SpecsTable;
