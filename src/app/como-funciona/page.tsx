import type { Metadata } from "next";
import { WhatsAppCta } from "@/components/cta/WhatsAppCta";
import FaqNative, { type FaqEntry } from "@/components/seo/FaqNative";
import JsonLd from "@/components/seo/JsonLd";
import { howToSchema, breadcrumbSchema } from "@/lib/schema";
import { BUSINESS } from "@/config/business.config";

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

// FAQ operacional das personas (SPEC-FINAL-V2 §6 / brief 1.4): chuva, sinal,
// duração/hora extra, elevador/escada, tomada 110/220, horário de chegada da
// equipe, garantia de substituição. Espelha o texto visível (FAQPage).
const FAQ: FaqEntry[] = [
    {
        question: "E se chover no dia da festa?",
        answer:
            "Equipamento eletrônico precisa ficar coberto. Se o evento é ao ar livre, a gente combina antes um ponto coberto pra " +
            "montagem e conversa sobre remarcação em caso de chuva forte. É só alinhar isso quando fechar o orçamento pra não ter susto no dia.",
    },
    {
        question: "Precisa dar sinal? E se eu precisar cancelar ou remarcar?",
        answer:
            "As condições de reserva, sinal e remarcação a gente combina de forma clara e por escrito no contrato, junto com o orçamento. " +
            "Precisou mudar a data? Fala com a gente o quanto antes que a gente tenta encaixar conforme a agenda.",
    },
    {
        question: "Por quanto tempo o equipamento fica? Tem como estender?",
        answer:
            "O período combinado cobre a duração da festa. Precisando de mais horas, pernoite ou um horário específico de retirada, " +
            "dá pra estender — é só combinar antes no orçamento pra a gente reservar a equipe e o transporte.",
    },
    {
        question: "Os equipamentos passam em escada e elevador?",
        answer:
            "Boa parte passa em porta comum e elevador; alguns itens maiores (simulador, certos fliperamas) pedem mais espaço ou acesso térreo. " +
            "Manda o tipo do local e se tem escada ou elevador que a gente confirma o que encaixa antes de fechar.",
    },
    {
        question: "Precisa de tomada 110V ou 220V? Quanta energia consome?",
        answer:
            "Cada equipamento tem a sua voltagem e a gente informa no orçamento. No dia, a equipe leva extensão e organiza a ligação. " +
            "Se o local tiver poucos pontos de energia ou risco de sobrecarga, avisa que a gente planeja a distribuição junto.",
    },
    {
        question: "A que horas a equipe chega pra montar?",
        answer:
            "A equipe chega com antecedência pra montar e testar tudo antes do evento começar — o horário certo a gente combina no fechamento, " +
            "de acordo com a hora da sua festa e as regras do local (salão, condomínio, buffet).",
    },
    {
        question: "E se um equipamento der defeito durante o evento?",
        answer:
            "Se der qualquer problema, a gente troca o equipamento ou manda um técnico no local, sem custo extra pra você. " +
            "Ficamos alcançáveis por telefone durante o horário do evento pra resolver rápido. O problema é nosso, não seu.",
    },
];

const HOWTO_STEPS = passos.map((p) => ({ name: p.titulo, text: p.texto }));

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

                <p className="rise-in mt-8 font-body text-base md:text-lg leading-relaxed text-zinc-300 max-w-3xl" style={{ animationDelay: '240ms' }}>
                    Alugar games com a <strong className="text-foreground font-semibold">Aluguel de Games</strong> é simples: você
                    escolhe as atrações, pede o orçamento pelo WhatsApp{" "}
                    <a href={`tel:${BUSINESS.phoneE164}`} className="font-semibold text-foreground hover:text-green-400 transition-colors tabular-nums">
                        {BUSINESS.phoneDisplay}
                    </a>
                    , a gente entrega e monta tudo no dia da festa em Osasco e na Grande São Paulo, fica de suporte durante o evento
                    e busca depois. Sem letra miúda, sem complicação. Desde 1993.
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

            {/* ============= FAQ OPERACIONAL ============= */}
            <section className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
                <div className="mb-10 text-center">
                    <p className="label-arcade text-cyan-400 mb-3">? dúvidas do dia da festa</p>
                    <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight leading-[0.95]">
                        Chuva, tomada, elevador,<br />
                        <span className="italic font-normal text-muted-foreground/80">defeito. A gente responde.</span>
                    </h2>
                </div>
                <FaqNative items={FAQ} withSchema />
            </section>

            {/* ============= CTA ============= */}
            <section className="relative mx-auto max-w-6xl px-4 pb-24 md:pb-32">
                <div className="relative overflow-hidden rounded-3xl border-2 border-green-500/40 bg-gradient-to-br from-green-950/40 via-emerald-950/30 to-background p-10 md:p-14 text-center">
                    <div className="absolute inset-0 dot-grid-dense opacity-30" aria-hidden />
                    <div className="relative">
                        <p className="label-arcade text-green-400 mb-4">▸ bora marcar</p>
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

            {/* HowTo (GEO/AI, não rich result) + BreadcrumbList server-side */}
            <JsonLd
                data={howToSchema({
                    name: "Como funciona o aluguel de games para festas",
                    description:
                        "Do orçamento pelo WhatsApp até a retirada: passo a passo do aluguel de fliperamas, videokês e games para festas e eventos em São Paulo.",
                    steps: HOWTO_STEPS,
                })}
            />
            <JsonLd
                data={breadcrumbSchema([
                    { name: "Início", url: "/" },
                    { name: "Como funciona", url: "/como-funciona" },
                ])}
            />
        </main>
    );
}
