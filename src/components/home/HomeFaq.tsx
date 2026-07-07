// src/components/home/HomeFaq.tsx
//
// FAQ da home (SPEC-FINAL-V2 §3.10) — 5 perguntas + FAQPage 1:1. A pergunta
// nº1 do mercado (quanto custa) ENTRA na home, com resumo + link /quanto-custa.
// Números de tempo/diária ficam SEM valor inventado ([CONFIRMAR COM DONO]).
import FaqNative, { type FaqEntry } from "@/components/seo/FaqNative";
import { BUSINESS } from "@/config/business.config";

const CIDADES = BUSINESS.areaServed.join(", ");

const ITEMS: FaqEntry[] = [
    {
        question: "Quanto custa alugar?",
        answer:
            "Depende de três coisas: o equipamento, a data (fim de semana e dezembro lotam antes) e o bairro da entrega. A diária já inclui entrega, montagem, retirada e suporte, sem taxa escondida. Alugando mais de um item junto, o combo sai melhor. Manda data e bairro no WhatsApp que a gente fecha o valor.",
        link: { href: "/quanto-custa", label: "Entenda o orçamento" },
    },
    {
        question: "E se chover?",
        answer:
            "Games são equipamentos eletrônicos e precisam de área coberta. Se a previsão preocupar, a gente combina antes um plano B (área coberta, tenda ou remarcação) pra sua festa não ficar na mão.",
    },
    {
        question: "E se o equipamento der defeito no meio da festa?",
        answer:
            "A gente resolve: troca o equipamento ou manda técnico no local, sem custo. Todo item sai testado da nossa base e vai com contrato — se algo falhar, o problema é nosso, não seu.",
    },
    {
        question: "Qual o período da diária?",
        answer:
            "A diária cobre o período do seu evento. O número exato de horas, o horário de entrega e o de retirada a gente combina junto no orçamento, de acordo com a sua festa.",
    },
    {
        question: "Atendem o meu bairro?",
        answer:
            `Nossa base é em Osasco e atendemos toda a Grande São Paulo: ${CIDADES} e região. Não achou a sua cidade? Manda no WhatsApp que a gente confirma a entrega.`,
    },
];

export default function HomeFaq() {
    return (
        <section aria-label="Perguntas frequentes" className="w-full">
            <div className="mx-auto max-w-3xl px-4">
                <div className="mb-8 text-center">
                    <p className="label-arcade mb-3 text-cyan-400">▸ perguntas frequentes</p>
                    <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
                        Ainda com dúvida?
                    </h2>
                </div>
                <FaqNative items={ITEMS} withSchema />
            </div>
        </section>
    );
}
