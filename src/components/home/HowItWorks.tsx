// src/components/home/HowItWorks.tsx
//
// D5 — Como funciona (spec §3). 4 passos, scroll-snap no mobile. Fecha com a
// linha de garantia (§9.6) — "o problema é nosso, não seu". Server component.
import Link from "next/link";

const PASSOS = [
    {
        n: "01",
        titulo: "Você chama no WhatsApp",
        texto: "Manda a data, o bairro e o que curte. A gente responde com o valor fechado.",
    },
    {
        n: "02",
        titulo: "Fechamos data e valor",
        texto: "Combinado o pacote, vai contrato e nota fiscal — tudo no claro.",
    },
    {
        n: "03",
        titulo: "Entregamos e montamos",
        texto: "Chegamos antes da festa, montamos e testamos cada equipamento.",
    },
    {
        n: "04",
        titulo: "Buscamos depois",
        texto: "Acabou a festa, a gente retira. Você não carrega nada.",
    },
] as const;

export function HowItWorks() {
    return (
        <div>
            {/* scroll-snap horizontal no mobile, grid no desktop */}
            <ol className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scrollbar-hide md:grid md:grid-cols-4 md:overflow-visible">
                {PASSOS.map((p) => (
                    <li
                        key={p.n}
                        className="relative min-w-[78%] snap-start rounded-2xl border border-border/60 bg-card/40 p-6 sm:min-w-[60%] md:min-w-0"
                    >
                        <span className="numeral-huge !text-5xl group-hover:opacity-100">
                            {p.n}
                        </span>
                        <h3 className="mt-3 font-display text-lg font-bold text-foreground">
                            {p.titulo}
                        </h3>
                        <p className="mt-1.5 font-body text-sm leading-relaxed text-muted-foreground">
                            {p.texto}
                        </p>
                    </li>
                ))}
            </ol>

            {/* Garantia — spec §9.6 (redação final aguarda o dono formalizar) */}
            <div className="mt-6 rounded-2xl border border-purple-500/30 bg-purple-500/5 p-5 md:p-6">
                <p className="font-body text-base leading-relaxed text-foreground md:text-lg">
                    <strong className="font-semibold">Deu problema no meio da festa?</strong>{" "}
                    A gente resolve: troca o equipamento ou manda técnico no local, sem custo.
                    Todo item sai testado da nossa base e vai com contrato — se algo falhar,
                    o problema é nosso, não seu.
                </p>
                <Link
                    href="/como-funciona"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 underline-offset-4 hover:text-cyan-300 hover:underline"
                >
                    Ver como funciona em detalhe
                    <span aria-hidden>→</span>
                </Link>
            </div>
        </div>
    );
}

export default HowItWorks;
