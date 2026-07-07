// src/components/home/HowItWorks.tsx
//
// Como funciona (SPEC-FINAL-V2 §3.8) — 4 passos compactos, 2×2 no mobile +
// garantia em 1 linha. Link → /como-funciona (HowTo mora lá). SERVER component.
import Link from "next/link";

const PASSOS = [
    { n: "01", t: "Escolhe", d: "Vê o catálogo e separa o que combina com a sua festa." },
    { n: "02", t: "Chama no WhatsApp", d: "Manda data, bairro e convidados. A gente fecha o orçamento." },
    { n: "03", t: "Entregamos e montamos", d: "No dia, levamos, montamos e testamos tudo antes de começar." },
    { n: "04", t: "Buscamos depois", d: "Acabou a festa? A retirada é com a gente. Você só curte." },
];

export default function HowItWorks() {
    return (
        <section aria-label="Como funciona" className="w-full">
            <div className="mx-auto max-w-5xl px-4">
                <div className="mb-8 text-center">
                    <p className="label-arcade mb-3 text-blue-400">▸ simples assim</p>
                    <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
                        Como funciona
                    </h2>
                </div>

                <ol className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {PASSOS.map((p) => (
                        <li key={p.n} className="rounded-2xl border border-border/50 bg-card/40 p-5">
                            <span className="numeral-huge !text-4xl">{p.n}</span>
                            <h3 className="mt-2 font-display text-base font-bold md:text-lg">{p.t}</h3>
                            <p className="mt-1 font-body text-sm text-zinc-300">{p.d}</p>
                        </li>
                    ))}
                </ol>

                {/* Garantia em 1 linha (§9.6). Redação final [CONFIRMAR COM DONO]. */}
                <p className="mx-auto mt-6 max-w-3xl text-center font-body text-sm text-zinc-300">
                    <strong className="text-foreground">Deu problema no meio da festa?</strong>{" "}
                    Trocamos o equipamento ou mandamos técnico no local. O problema é nosso, não seu.
                </p>

                <div className="mt-5 text-center">
                    <Link
                        href="/como-funciona"
                        className="inline-flex items-center gap-2 font-body text-sm font-semibold text-foreground underline underline-offset-4 transition-colors hover:text-blue-400"
                    >
                        Ver prazos, sinal, chuva e defeito <span aria-hidden>→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
