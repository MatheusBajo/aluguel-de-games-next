// src/components/home/PriceTeaser.tsx
//
// Dobra "Quanto custa" (SPEC-FINAL-V2 §3.6) — corrige o buraco nº1 da V2B
// (a home mais visitada nunca falava de preço). ABERTA, nunca <details>.
// Como diária/faixas ainda são [CONFIRMAR COM DONO], usamos a VERSÃO B:
// só os 3 fatores + "combo sai melhor" (zero número fabricado). Quando o dono
// assinar horas/faixas, plugar aqui. Link forte → /quanto-custa + CTA verde.
// SERVER component (HTML cru); CTA verde é ilha client.
import Link from "next/link";
import { WhatsAppCta, PhoneSupportLine } from "@/components/cta/WhatsAppCta";

const FATORES = [
    { n: "01", t: "O equipamento", d: "Um fliperama, um videokê ou um combo de várias atrações — cada item tem seu valor." },
    { n: "02", t: "A data", d: "Fim de semana e dezembro lotam a agenda antes; quanto mais cedo você fecha, melhor." },
    { n: "03", t: "O bairro da entrega", d: "A região da Grande SP entra na conta da entrega e montagem." },
];

export default function PriceTeaser() {
    return (
        <section aria-label="Quanto custa" className="w-full">
            <div className="mx-auto max-w-5xl px-4">
                <div className="rounded-3xl border border-border/60 bg-card/30 p-6 md:p-10">
                    <div className="mb-6 grid gap-4 md:grid-cols-[1.3fr_1fr] md:items-end">
                        <div>
                            <p className="label-arcade mb-3 text-green-400">▸ sem letra miúda</p>
                            <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
                                Quanto custa alugar?
                            </h2>
                        </div>
                        <p className="font-body text-muted-foreground">
                            Não tem tabela mágica: o valor da sua festa depende de três coisas.
                            Entrega, montagem, retirada e suporte já entram no combinado, sem taxa escondida.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        {FATORES.map((f) => (
                            <div key={f.n} className="rounded-2xl border border-border/50 bg-background/50 p-5">
                                <span className="numeral-huge !text-4xl">{f.n}</span>
                                <h3 className="mt-2 font-display text-lg font-bold">{f.t}</h3>
                                <p className="mt-1 font-body text-sm text-zinc-300">{f.d}</p>
                            </div>
                        ))}
                    </div>

                    <p className="mt-6 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3 font-body text-sm text-zinc-200">
                        <strong className="text-foreground">Dica:</strong> alugando mais de um item junto,
                        o combo sai melhor do que fechar cada coisa separada.
                    </p>

                    <div className="mt-7 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <Link
                            href="/quanto-custa"
                            className="inline-flex items-center gap-2 font-body text-sm font-semibold text-foreground underline underline-offset-4 transition-colors hover:text-green-400"
                        >
                            Entenda o orçamento <span aria-hidden>→</span>
                        </Link>
                        <div className="flex flex-col items-start gap-2 sm:items-end">
                            <WhatsAppCta
                                surface="home"
                                location="price_teaser"
                                label="Pedir o valor da minha festa"
                            />
                            <PhoneSupportLine surface="home" location="price_teaser" className="text-left sm:text-right" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
