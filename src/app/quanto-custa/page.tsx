import Link from "next/link";
import type { Metadata } from "next";
import { WhatsAppCta, PhoneSupportLine } from "@/components/cta/WhatsAppCta";
import FaqNative, { type FaqEntry } from "@/components/seo/FaqNative";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { BUSINESS } from "@/config/business.config";
import { SITE_URL } from "@/lib/site.config";

export const metadata: Metadata = {
    title: {
        absolute: "Quanto custa alugar games para festa? | Aluguel de Games SP",
    },
    description:
        "Quanto custa alugar fliperama, videokê ou games para festa em SP? Entenda o que influencia o valor: equipamento, data, bairro e combo. Entrega, montagem e suporte inclusos. Orçamento pelo WhatsApp, desde 1993.",
    alternates: { canonical: `${SITE_URL}/quanto-custa` },
    openGraph: {
        title: "Quanto custa alugar games para festa?",
        description:
            "Entenda o orçamento do aluguel de games para festas e eventos em São Paulo: os fatores que mexem no preço e o que já está incluso.",
        url: `${SITE_URL}/quanto-custa`,
        siteName: "Aluguel de Games",
        locale: "pt_BR",
        type: "website",
    },
};

// FAQ de preço (SPEC-FINAL-V2 §3.10 / §9.5). Honesta: sem faixa fabricada,
// combo, período da diária, entrega e sinal. Espelha o texto visível (FAQPage).
const FAQ: FaqEntry[] = [
    {
        question: "Quanto custa alugar um fliperama ou games para festa?",
        answer:
            "Não existe tabela única: o valor depende do equipamento escolhido, da data do evento e do bairro da entrega. " +
            "Entrega, montagem, retirada e suporte já entram no combinado. Manda a data e o bairro no WhatsApp que a gente " +
            "responde com o valor fechado da sua festa, sem compromisso.",
    },
    {
        question: "Qual é o período da diária? Cobre o dia todo?",
        answer:
            "O período que o equipamento fica no seu evento a gente combina no orçamento e costuma cobrir a duração da festa. " +
            "Precisa de mais horas, pernoite ou um horário específico de entrega e retirada? Fala com a gente que a gente ajusta.",
    },
    {
        question: "Sai mais barato alugar mais de um equipamento junto?",
        answer:
            "Sim. Alugando mais de um item na mesma festa, o combo costuma sair melhor do que fechar cada coisa separada — " +
            "a entrega e a montagem são as mesmas. Monta a lista do que você quer que a gente fecha um valor de conjunto.",
    },
    {
        question: "A entrega e a montagem são cobradas à parte?",
        answer:
            "Entrega, montagem, teste dos equipamentos, suporte durante a locação e retirada depois já estão inclusos no orçamento " +
            "em toda a Grande São Paulo. A região do evento entra no cálculo, mas não vem como taxa surpresa no fim.",
    },
    {
        question: "Precisa dar sinal pra reservar a data?",
        answer:
            "As condições de reserva e pagamento a gente combina junto com o orçamento, de forma clara e por escrito no contrato. " +
            "Fim de semana e dezembro lotam a agenda antes — quanto mais cedo você fecha, mais garantida fica a sua data.",
    },
    {
        question: "Quais as formas de pagamento?",
        answer:
            "Trabalhamos com PIX, dinheiro e cartão. Para empresas, também dá pra combinar contrato e fatura de locação pro financeiro. " +
            "As condições certinhas entram no orçamento.",
    },
];

const FATORES = [
    {
        n: "01",
        t: "O equipamento",
        d: "Um fliperama, um videokê, uma máquina de VR ou um combo de várias atrações — cada item tem o seu valor de diária. Itens maiores (simulador, pinball) pesam diferente de um jogo de mesa.",
    },
    {
        n: "02",
        t: "A data",
        d: "Fim de semana, feriado e dezembro lotam a agenda antes. Quanto mais cedo você fecha, mais fácil garantir a data e o equipamento que você quer.",
    },
    {
        n: "03",
        t: "O bairro da entrega",
        d: "A região da Grande SP entra na conta da entrega e montagem. Não vira taxa escondida: já está dentro do valor que a gente passa.",
    },
    {
        n: "04",
        t: "Quantos itens juntos",
        d: "Alugando mais de uma atração na mesma festa, o combo costuma sair melhor — a equipe e o transporte são os mesmos pra levar tudo.",
    },
];

const INCLUSO = [
    "Entrega no local do evento",
    "Montagem e teste de cada equipamento",
    "Suporte durante a locação",
    "Retirada depois da festa",
    "Contrato e nota / fatura de locação",
];

export default function QuantoCustaPage() {
    const anos = new Date().getFullYear() - BUSINESS.foundingYear;

    return (
        <main className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 grid-tron opacity-30" aria-hidden />
            <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-green-500/10 blur-3xl" aria-hidden />

            {/* ============= HERO ============= */}
            <section className="relative mx-auto max-w-5xl px-4 pt-16 pb-10 md:pt-24 md:pb-14">
                <nav aria-label="Você está em" className="mb-6 font-body text-xs text-muted-foreground/70">
                    <Link href="/" className="hover:text-foreground">Início</Link>
                    <span className="mx-1.5" aria-hidden>/</span>
                    <span className="text-foreground">Quanto custa</span>
                </nav>

                <p className="rise-in label-arcade text-green-400 mb-5 inline-flex items-center gap-2">
                    <span className="badge-live text-green-400">★</span>
                    <span>Desde 1993 · sem letra miúda</span>
                </p>

                <h1 className="rise-in font-display font-extrabold leading-[0.95] tracking-tight text-4xl sm:text-5xl md:text-6xl" style={{ animationDelay: "120ms" }}>
                    Quanto custa alugar<br />
                    <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent italic">
                        games para festa?
                    </span>
                </h1>

                {/* Answer capsule — resposta direta (extraível por IA/Google) */}
                <div className="rise-in mt-8 max-w-3xl" style={{ animationDelay: "240ms" }}>
                    <p className="font-body text-base md:text-lg leading-relaxed text-zinc-300">
                        O aluguel de games para festas em <strong className="text-foreground font-semibold">Osasco e na Grande
                        São Paulo</strong> não tem preço de tabela: o valor depende do <strong className="text-foreground font-semibold">equipamento</strong>,
                        da <strong className="text-foreground font-semibold">data</strong> e do <strong className="text-foreground font-semibold">bairro
                        da entrega</strong>. Entrega, montagem, suporte e retirada já entram no combinado. Alugando mais de um
                        item junto, o combo sai melhor. Manda a data e o bairro no WhatsApp{" "}
                        <a href={`tel:${BUSINESS.phoneE164}`} className="font-semibold text-foreground hover:text-green-400 transition-colors tabular-nums">
                            {BUSINESS.phoneDisplay}
                        </a>{" "}
                        que a gente responde com o valor fechado. Desde 1993.
                    </p>
                </div>

                <div className="rise-in mt-8 flex flex-col items-start gap-3" style={{ animationDelay: "360ms" }}>
                    <WhatsAppCta surface="home" location="quanto_custa_hero" label="Pedir o valor da minha festa" />
                    <PhoneSupportLine surface="home" location="quanto_custa_hero" />
                </div>
            </section>

            <div className="mx-auto max-w-5xl px-4">
                <div className="divider-neon" />
            </div>

            {/* ============= OS FATORES ============= */}
            <section className="relative mx-auto max-w-5xl px-4 py-16 md:py-20">
                <p className="label-arcade text-cyan-400 mb-3">→ o que mexe no preço</p>
                <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight leading-[0.95] mb-10">
                    Quatro coisas definem<br />
                    <span className="italic font-normal text-muted-foreground/80">o valor da sua festa.</span>
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                    {FATORES.map((f) => (
                        <div key={f.n} className="rounded-2xl border border-border/60 bg-card/40 p-6">
                            <span className="numeral-huge !text-4xl">{f.n}</span>
                            <h3 className="mt-2 font-display text-xl font-bold">{f.t}</h3>
                            <p className="mt-2 font-body text-sm leading-relaxed text-zinc-300">{f.d}</p>
                        </div>
                    ))}
                </div>

                <p className="mt-6 rounded-xl border border-green-500/20 bg-green-500/5 px-5 py-4 font-body text-sm md:text-base text-zinc-200">
                    <strong className="text-foreground">Na prática:</strong> a gente prefere passar um valor fechado, olhando a
                    sua data e o seu bairro, do que cravar um número genérico na tela que talvez não valha pro seu caso.
                    É mais honesto e costuma sair melhor pra você.
                </p>
            </section>

            {/* ============= O QUE JÁ ESTÁ INCLUSO ============= */}
            <section className="relative mx-auto max-w-5xl px-4 py-16 md:py-20">
                <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" aria-hidden />
                <div className="relative grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-center">
                    <div>
                        <p className="label-arcade text-pink-400 mb-3">⊹ já está no valor</p>
                        <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight leading-[0.95]">
                            Sem taxa<br />escondida.
                        </h2>
                        <p className="mt-4 font-body text-muted-foreground">
                            O que entra no orçamento é o que você paga. Nada de custo surpresa aparecendo no dia do evento.
                        </p>
                    </div>
                    <ul className="grid gap-3 sm:grid-cols-2">
                        {INCLUSO.map((i) => (
                            <li key={i} className="flex items-start gap-3 rounded-xl border border-border/50 bg-background/50 px-4 py-3">
                                <span aria-hidden className="mt-0.5 text-green-400">✓</span>
                                <span className="font-body text-sm text-zinc-200">{i}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ============= PERÍODO DA DIÁRIA (versão honesta sem número) ===== */}
            <section className="relative mx-auto max-w-5xl px-4 py-16 md:py-20">
                <div className="rounded-3xl border border-border/60 bg-card/30 p-6 md:p-10">
                    <p className="label-arcade text-cyan-400 mb-3">⏱ período da locação</p>
                    <h2 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight leading-tight mb-4">
                        Quanto tempo o equipamento fica?
                    </h2>
                    <p className="font-body text-base leading-relaxed text-zinc-300 max-w-3xl">
                        O período combinado cobre a duração da sua festa. A equipe chega antes pra montar e testar tudo, o
                        equipamento fica à disposição durante o evento, e a gente volta pra retirar depois. Se você precisar de
                        um horário específico de chegada, mais horas ou pernoite, é só combinar no orçamento — a gente adapta ao
                        seu evento.
                    </p>
                </div>
            </section>

            {/* ============= FAQ ============= */}
            <section className="relative mx-auto max-w-5xl px-4 py-16 md:py-20">
                <p className="label-arcade text-purple-400 mb-3 text-center">? perguntas sobre preço</p>
                <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight leading-[0.95] mb-10 text-center">
                    Dúvidas de orçamento.
                </h2>
                <FaqNative items={FAQ} withSchema />
            </section>

            {/* ============= CTA FINAL ============= */}
            <section className="relative mx-auto max-w-5xl px-4 pb-24 md:pb-32">
                <div className="relative overflow-hidden rounded-3xl border-2 border-green-500/40 bg-gradient-to-br from-green-950/40 via-emerald-950/30 to-background p-8 md:p-12 text-center">
                    <div className="pointer-events-none absolute -top-20 -right-20 w-60 h-60 rounded-full bg-green-500/20 blur-3xl" />
                    <p className="label-arcade text-green-400 mb-3">▸ sua festa</p>
                    <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight leading-[0.95] mb-4">
                        Manda a data e o bairro.<br />
                        <span className="italic font-normal text-muted-foreground/80">A gente responde com o valor.</span>
                    </h2>
                    <p className="font-body text-muted-foreground max-w-xl mx-auto mb-8">
                        {anos} anos alugando games pra festa na Grande SP. Orçamento sem compromisso.
                    </p>
                    <WhatsAppCta surface="home" location="quanto_custa_cta_final" label="Pedir o valor da minha festa" withPhone />
                </div>
            </section>

            <JsonLd
                data={breadcrumbSchema([
                    { name: "Início", url: "/" },
                    { name: "Quanto custa", url: "/quanto-custa" },
                ])}
            />
        </main>
    );
}
