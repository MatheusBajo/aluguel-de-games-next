// src/components/catalogo/ProductDescription.tsx
//
// "O que está incluso" + descrição do item (SPEC-FINAL-V2 §4.8). SERVER
// component — markdown do metadata.json renderizado no HTML cru. Se a descrição
// está vazia (item ainda sem texto), só o bloco "incluso" aparece.
import ReactMarkdown from "react-markdown";

const INCLUSO = [
    "Entrega e montagem no local do evento",
    "Equipamento testado antes de começar",
    "Suporte técnico durante a locação",
    "Retirada depois do evento",
    "Contrato e nota fiscal",
];

export default function ProductDescription({ descricao }: { descricao?: string }) {
    const hasDescricao = !!descricao && descricao.trim().length > 0;

    return (
        <div className="grid gap-6 md:grid-cols-[1fr_1.2fr] md:gap-10">
            <div className="rounded-2xl border border-border/60 bg-card/30 p-5 md:p-6">
                <h2 className="mb-4 font-display text-lg font-bold tracking-tight md:text-xl">
                    O que está incluso
                </h2>
                <ul className="space-y-2.5 text-sm text-zinc-300">
                    {INCLUSO.map((i) => (
                        <li key={i} className="flex items-start gap-2">
                            <span className="mt-0.5 text-green-500" aria-hidden>✓</span>
                            {i}
                        </li>
                    ))}
                </ul>
            </div>

            {hasDescricao && (
                <div>
                    <h2 className="mb-4 font-display text-lg font-bold tracking-tight md:text-xl">
                        Sobre o equipamento
                    </h2>
                    <div className="prose prose-sm prose-invert max-w-none prose-p:text-zinc-300 prose-li:text-zinc-300 prose-strong:text-foreground">
                        <ReactMarkdown>{descricao}</ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    );
}
