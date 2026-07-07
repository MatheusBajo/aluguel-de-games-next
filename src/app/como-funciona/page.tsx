import type { Metadata } from "next";
import { WhatsAppCta } from "@/components/cta/WhatsAppCta";

export const metadata: Metadata = {
    title: "Como Funciona o Aluguel - Passo a Passo Simples",
    description:
        "Veja como funciona o aluguel de equipamentos para festas: escolha, orçamento via WhatsApp, entrega, montagem e suporte disponível durante o evento. Tudo simples e sem complicação.",
    alternates: { canonical: "https://www.alugueldegames.com.br/como-funciona" },
    openGraph: {
        title: "Como Funciona o Aluguel - Aluguel de Games",
        description: "Processo simples e transparente. Veja como é fácil ter entretenimento de qualidade no seu evento.",
        url: "https://www.alugueldegames.com.br/como-funciona",
        siteName: "Aluguel de Games",
        locale: "pt_BR",
        type: "website",
    },
};

const passos = [
    {
        num: "01",
        titulo: "Escolha seus equipamentos",
        texto:
            "Navegue pelo nosso catálogo e veja os equipamentos disponíveis. Combine fliperamas, videokês, VR, pinballs e muito mais. Não sabe qual escolher? A gente ajuda a montar o pacote ideal pro tipo de evento e número de convidados.",
    },
    {
        num: "02",
        titulo: "Solicite o orçamento via WhatsApp",
        texto:
            "Manda mensagem pro nosso WhatsApp com data, local e equipamentos desejados. Você recebe uma proposta detalhada e personalizada — sem burocracia e sem compromisso.",
    },
    {
        num: "03",
        titulo: "Agende a data",
        texto:
            "Aceitou o orçamento? A gente reserva os equipamentos pra data do seu evento. Recomendamos agendar com 7 a 15 dias de antecedência (eventos corporativos grandes: 30+ dias).",
    },
    {
        num: "04",
        titulo: "Entrega e montagem",
        texto:
            "No dia combinado, nossa equipe chega no local antes do evento começar, monta tudo, testa cada equipamento e deixa pronto pra diversão. Você não precisa fazer nada.",
    },
    {
        num: "05",
        titulo: "Aproveite seu evento",
        texto:
            "Durante o horário do evento, ficamos disponíveis por telefone caso algum equipamento precise de ajuste. Não é plantão no local, mas estamos alcançáveis se precisar.",
    },
    {
        num: "06",
        titulo: "Retirada sem stress",
        texto:
            "Depois do evento, nossa equipe volta pra desmontar e retirar tudo. Você não precisa se preocupar com nada além de relaxar e lembrar dos bons momentos.",
    },
];

const beneficios = [
    { titulo: "Orçamento sem compromisso", texto: "Resposta rápida pelo WhatsApp, sem pressão de venda." },
    { titulo: "Cobertura na Grande SP", texto: "Capital, ABC, Alphaville, Guarulhos, Osasco e mais." },
    { titulo: "Montagem incluída", texto: "Nossa equipe cuida de tudo no local — você só aproveita." },
    { titulo: "Suporte durante o evento", texto: "Disponíveis por telefone pra qualquer ajuste nos equipamentos." },
    { titulo: "Catálogo variado", texto: "Fliperamas, videokês, VR, consoles, jogos de mesa e mais." },
    { titulo: "Desde 1993", texto: "Mais de três décadas alugando games pra festas na Grande SP." },
];

export default function ComoFuncionaPage() {
    return (
        <main className="relative overflow-hidden">
            {/* Decorações de fundo */}
            <div className="pointer-events-none absolute inset-0 grid-tron opacity-30" aria-hidden />
            <div className="pointer-events-none absolute -top-40 left-1/3 h-96 w-96 rounded-full bg-purple-500/15 blur-3xl" aria-hidden />

            {/* ============= HERO ============= */}
            <section className="relative mx-auto max-w-6xl px-4 pt-16 pb-16 md:pt-24 md:pb-20">
                <p className="rise-in label-arcade text-cyan-400 mb-6">
                    <span className="inline-block w-12 h-px bg-cyan-400 align-middle mr-3" />
                    Manual do jogador · v1.0
                </p>

                <h1 className="rise-in font-display font-extrabold leading-[0.92] tracking-tight text-5xl sm:text-6xl md:text-7xl lg:text-8xl" style={{ animationDelay: '120ms' }}>
                    Como funciona<br />
                    <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent italic">
                        o aluguel?
                    </span>
                </h1>

                <p className="rise-in mt-8 font-body text-lg md:text-xl text-muted-foreground max-w-2xl" style={{ animationDelay: '240ms' }}>
                    Seis passos simples — do primeiro orçamento até a retirada dos equipamentos.
                    Sem letra miúda, sem complicação.
                </p>
            </section>

            <div className="mx-auto max-w-6xl px-4">
                <div className="divider-neon" />
            </div>

            {/* ============= PASSOS ============= */}
            <section className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
                <ol className="space-y-2 md:space-y-0">
                    {passos.map((p, i) => (
                        <li
                            key={p.num}
                            className="rise-in group relative grid gap-4 border-t border-border/50 py-10 md:grid-cols-[140px_1fr] md:gap-12 md:py-12 transition-colors hover:border-purple-500/50"
                            style={{ animationDelay: `${i * 80}ms` }}
                        >
                            <p className="numeral-huge !text-6xl md:!text-8xl transition-all group-hover:[-webkit-text-stroke-color:_rgba(168,85,247,0.9)]">
                                {p.num}
                            </p>
                            <div className="md:pt-3">
                                <h2 className="font-display text-2xl md:text-3xl font-bold mb-3 transition-colors group-hover:text-purple-300">
                                    {p.titulo}
                                </h2>
                                <p className="font-body text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                                    {p.texto}
                                </p>
                            </div>
                            <span className="hidden md:block absolute right-0 top-12 label-arcade text-muted-foreground/40 group-hover:text-cyan-400/70 transition-colors">
                                STEP {String(i + 1).padStart(2, '0')}/{passos.length}
                            </span>
                        </li>
                    ))}
                    <li className="border-t border-border/50" />
                </ol>
            </section>

            {/* ============= BENEFÍCIOS ============= */}
            <section className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
                <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" aria-hidden />

                <div className="relative">
                    <p className="label-arcade text-pink-400 mb-3">⊹ O que está incluso</p>
                    <h2 className="font-display font-extrabold text-4xl md:text-6xl tracking-tight leading-[0.95] mb-12">
                        Tudo no pacote.<br />
                        <span className="italic font-normal text-muted-foreground/80">Sem surpresas.</span>
                    </h2>

                    <div className="grid gap-px bg-border/40 sm:grid-cols-2 lg:grid-cols-3 rounded-2xl overflow-hidden border border-border/40">
                        {beneficios.map((b, i) => (
                            <div
                                key={b.titulo}
                                className="rise-in relative bg-background p-7 transition-all hover:bg-card/60 group"
                                style={{ animationDelay: `${i * 60}ms` }}
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="font-mono text-sm font-bold text-purple-400">/{String(i + 1).padStart(2, '0')}</span>
                                    <div className="h-px flex-1 bg-border/60 group-hover:bg-purple-500/40 transition-colors" />
                                </div>
                                <h3 className="font-display text-lg font-bold mb-2">{b.titulo}</h3>
                                <p className="font-body text-sm text-muted-foreground leading-relaxed">{b.texto}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============= CTA ============= */}
            <section className="relative mx-auto max-w-6xl px-4 pb-24 md:pb-32">
                <div className="relative overflow-hidden rounded-3xl border-2 border-purple-500/40 bg-gradient-to-br from-blue-950/50 via-purple-950/50 to-pink-950/50 p-10 md:p-14 text-center">
                    <div className="absolute inset-0 dot-grid-dense opacity-30" aria-hidden />
                    <div className="relative">
                        <p className="label-arcade text-cyan-400 mb-4">▶ press start</p>
                        <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight leading-[0.95] mb-4">
                            Bora começar?
                        </h2>
                        <p className="font-body text-muted-foreground max-w-xl mx-auto mb-8">
                            Manda os detalhes do seu evento e a gente monta o pacote ideal pra você.
                        </p>
                        <WhatsAppCta
                            surface="home"
                            location="como_funciona_cta"
                            label="Pedir orçamento no WhatsApp"
                            withPhone
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}
