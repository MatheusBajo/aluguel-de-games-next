// src/app/como-funciona/page.tsx
//
// /como-funciona (spec §6): passos numerados (HowTo schema) + a FAQ REAL das
// personas em <details> nativo (chuva, sinal/cancelamento, hora extra,
// elevador/escada, 110/220V, horário de chegada da equipe, garantia de
// substituição) + FAQPage. Onde faltaria número do dono (sinal %, prazo de
// reagendamento), a resposta é honesta SEM cravar número (regra §1.2). HowTo/
// FAQPage = valor GEO/consistência, zero promessa de rich result (§6).
import type { Metadata } from "next";
import Link from "next/link";

import { AnswerCapsule } from "@/components/content/AnswerCapsule";
import { FaqNative } from "@/components/content/FaqNative";
import { WhatsAppCta, WhatsAppCtaMeta } from "@/components/cta/WhatsAppCta";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, howToSchema, type FaqEntry } from "@/lib/schema";

export const metadata: Metadata = {
    title: "Como funciona o aluguel de games: passo a passo, chuva, defeito",
    description:
        "Como funciona alugar fliperama, videokê e games para a sua festa: do orçamento no WhatsApp à retirada. E as respostas reais: e se chover, e o sinal, hora extra, elevador ou escada, 110 ou 220V, a que horas a equipe chega e a garantia se der defeito.",
    alternates: { canonical: "https://www.alugueldegames.com.br/como-funciona" },
    openGraph: {
        title: "Como funciona o aluguel de games",
        description:
            "Do orçamento à retirada, sem letra miúda. E as respostas reais: chuva, sinal, defeito, voltagem e acesso no local.",
        url: "https://www.alugueldegames.com.br/como-funciona",
        siteName: "Aluguel de Games",
        locale: "pt_BR",
        type: "website",
    },
};

const PASSOS: { num: string; titulo: string; texto: string }[] = [
    {
        num: "01",
        titulo: "Você chama no WhatsApp",
        texto:
            "Manda a data, o bairro e o que você tá pensando (ou pede ajuda pra escolher). A gente responde com o mix e o valor, sem compromisso e sem taxa escondida.",
    },
    {
        num: "02",
        titulo: "Fechamos data e valor",
        texto:
            "Aceitou? A gente reserva a data, faz o contrato e emite a nota fiscal de locação. Normalmente pede um sinal pra segurar a data — o valor e a forma a gente combina no fechamento.",
    },
    {
        num: "03",
        titulo: "Entregamos e montamos antes",
        texto:
            "No dia, a equipe chega com antecedência, monta tudo e testa cada equipamento antes da festa começar. Você não precisa fazer nada.",
    },
    {
        num: "04",
        titulo: "Buscamos depois",
        texto:
            "Acabou a festa, a gente volta pra desmontar e retirar tudo. Durante a locação, se algo der problema, é só chamar: o problema é nosso, não seu.",
    },
];

const FAQ: FaqEntry[] = [
    {
        question: "E se chover?",
        answer:
            "Equipamento eletrônico vai sempre pra área coberta — tenda, salão ou varanda coberta. Se a sua festa é ao ar livre, avisa na hora do orçamento que a gente combina a proteção e, se for o caso, um plano de reagendamento antes de fechar.",
    },
    {
        question: "Como funciona o sinal? E se eu precisar cancelar ou remarcar?",
        answer:
            "Pra reservar a data a gente costuma pedir um sinal, e o restante fica pra perto do evento — o valor e a forma são combinados no fechamento e ficam no contrato. Precisou remarcar? Fala com a gente o quanto antes que a gente tenta reagendar pra outra data. As condições de cancelamento a gente alinha por escrito antes de você pagar.",
    },
    {
        question: "E se a festa passar do horário combinado? Tem hora extra?",
        answer:
            "Dá pra estender. Se o evento for mais longo do que o previsto, é só combinar com a equipe na hora — entra como adicional no acerto. Melhor ainda: já dá a margem do horário no orçamento que a gente calcula tudo de uma vez.",
    },
    {
        question: "Meu evento é num andar de cima. Precisa de elevador? Sobe escada?",
        answer:
            "A gente precisa saber disso ANTES: alguns equipamentos são grandes e pesados. Manda se é térreo, se tem elevador ou se é escada, e o tamanho da porta e do elevador. Com isso a gente confirma o que passa no local e leva a equipe certa pra montar sem sufoco.",
    },
    {
        question: "Os equipamentos são 110V ou 220V?",
        answer:
            "Depende do equipamento — a maioria roda em 110V ou 220V, e alguns precisam de tomada específica. A gente confirma a voltagem do seu local antes do evento e leva o que precisar (extensão, filtro de linha, adaptador) pra ligar tudo com segurança.",
    },
    {
        question: "A que horas a equipe chega pra montar?",
        answer:
            "A equipe chega com antecedência pra montar e testar tudo antes de a festa começar — você não recebe convidado com a gente ainda montando. O horário exato a gente combina conforme a sua janela de montagem (antes do expediente, à noite, no fim de semana).",
    },
    {
        // Garantia — copy §9.6, mesma redação do produto e da home.
        question: "E se o equipamento der problema no meio da festa?",
        answer:
            "A gente resolve: troca o equipamento ou manda técnico no local, sem custo. Todo item sai testado da nossa base e vai com contrato — se algo falhar, o problema é nosso, não seu.",
    },
];

export default function ComoFuncionaPage() {
    return (
        <main className="mx-auto w-full max-w-4xl px-4 py-16 md:px-6 md:py-20">
            <nav className="mb-6 font-mono text-xs text-muted-foreground" aria-label="Trilha">
                <Link href="/" className="hover:text-foreground">Início</Link>
                <span className="mx-1.5" aria-hidden>/</span>
                <span className="text-foreground">Como funciona</span>
            </nav>

            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
                Como funciona o aluguel
            </h1>

            <div className="mt-6">
                <AnswerCapsule label="Em resumo">
                    Alugar com a gente é simples: você chama no WhatsApp com a data e o bairro, a
                    gente fecha o mix e o valor com contrato e nota fiscal, entrega e monta tudo
                    antes da festa e busca depois. Se algo der defeito durante a locação, a gente
                    troca ou manda técnico no local, sem custo. Desde 1993, em Osasco e toda a
                    Grande São Paulo.
                </AnswerCapsule>
            </div>

            {/* ============= PASSOS (HowTo) ============= */}
            <section className="mt-12">
                <h2 className="mb-6 font-display text-2xl font-extrabold tracking-tight md:text-3xl">
                    Do orçamento à retirada, em 4 passos
                </h2>
                <ol className="grid gap-4 sm:grid-cols-2">
                    {PASSOS.map((p) => (
                        <li
                            key={p.num}
                            className="rounded-2xl border border-border/60 bg-card/40 p-5 md:p-6"
                        >
                            <p className="font-mono text-2xl font-bold text-cyan-400 tabular-nums">
                                {p.num}
                            </p>
                            <h3 className="mt-2 font-display text-lg font-bold">{p.titulo}</h3>
                            <p className="mt-1 font-body text-sm leading-relaxed text-muted-foreground md:text-base">
                                {p.texto}
                            </p>
                        </li>
                    ))}
                </ol>
            </section>

            {/* ============= GARANTIA (destaque) ============= */}
            <section className="mt-10">
                <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-6 md:p-8">
                    <p className="label-arcade text-green-400 mb-2">▸ Garantia</p>
                    <p className="font-body text-base leading-relaxed text-foreground md:text-lg">
                        Deu problema no meio da festa? A gente resolve: troca o equipamento ou
                        manda técnico no local, sem custo. Todo item sai testado da nossa base e
                        vai com contrato — se algo falhar, <strong>o problema é nosso, não seu.</strong>
                    </p>
                </div>
            </section>

            {/* ============= FAQ REAL DAS PERSONAS ============= */}
            <section className="mt-14">
                <h2 className="mb-6 font-display text-2xl font-extrabold tracking-tight md:text-3xl">
                    As perguntas que todo mundo faz
                </h2>
                <FaqNative faqs={FAQ} />
            </section>

            {/* ============= CTA ============= */}
            <section className="mt-14 rounded-3xl border border-purple-500/30 bg-card/40 p-8 text-center md:p-12">
                <h2 className="mx-auto max-w-xl font-display text-2xl font-extrabold tracking-tight md:text-4xl">
                    Ficou alguma dúvida? Manda no WhatsApp
                </h2>
                <p className="mx-auto mt-3 max-w-lg font-body text-muted-foreground">
                    A gente responde antes de você fechar qualquer coisa. Sem compromisso.
                </p>
                <div className="mt-6 flex flex-col items-center gap-4">
                    <WhatsAppCta surface="home" variant="primary">
                        Pedir orçamento no WhatsApp
                    </WhatsAppCta>
                    <WhatsAppCtaMeta surface="home" />
                </div>
            </section>

            {/* Schema: HowTo + FAQPage (via FaqNative) + BreadcrumbList */}
            <JsonLd
                data={[
                    howToSchema({
                        name: "Como funciona o aluguel de games para festas",
                        description:
                            "Passo a passo para alugar fliperama, videokê e games para festas e eventos em Osasco e Grande São Paulo.",
                        steps: PASSOS.map((p) => ({ name: p.titulo, text: p.texto })),
                    }),
                    breadcrumbSchema([
                        { name: "Início", url: "/" },
                        { name: "Como funciona", url: "/como-funciona" },
                    ]),
                ]}
            />
        </main>
    );
}
