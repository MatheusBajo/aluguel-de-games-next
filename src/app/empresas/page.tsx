import Link from "next/link";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { WhatsAppCta, PhoneSupportLine } from "@/components/cta/WhatsAppCta";
import KitAprovacaoCta from "@/components/empresas/KitAprovacaoCta";
import B2BContactForm from "@/components/forms/B2BContactForm";
import FaqNative, { type FaqEntry } from "@/components/seo/FaqNative";
import JsonLd from "@/components/seo/JsonLd";
import { serviceSchema, breadcrumbSchema } from "@/lib/schema";
import { BUSINESS } from "@/config/business.config";
import { SITE_URL } from "@/lib/site.config";

export const metadata: Metadata = {
    title: {
        absolute: "Aluguel de Games para Eventos Corporativos em SP | Desde 1993",
    },
    description:
        "Aluguel de games para eventos corporativos em São Paulo: SIPAT, confraternização, lançamento e team building. Contrato, NF/fatura de locação, kit de aprovação interna e consultor dedicado. Desde 1993, atendeu Bradesco e Arnold Classic.",
    alternates: { canonical: `${SITE_URL}/empresas` },
    openGraph: {
        title: "Aluguel de Games para Eventos Corporativos em SP",
        description:
            "Estrutura B2B pra SIPAT, confraternização e ativação de marca. NF/fatura de locação, kit de aprovação interna e consultor dedicado. Desde 1993.",
        url: `${SITE_URL}/empresas`,
        siteName: "Aluguel de Games",
        locale: "pt_BR",
        type: "website",
        images: [{ url: "/carousel/compressed/Braland.webp", width: 1200, height: 630, alt: "Evento corporativo Bradesco - Braland" }],
    },
};

// E-mail corporativo com assunto pré-preenchido (gate 5.a).
const MAILTO = `mailto:${BUSINESS.email}?subject=${encodeURIComponent("Orçamento evento corporativo — [empresa]")}`;

// Dimensionamento por porte (gate 5.b). Honesto: as faixas de convidados são
// input do RH; a coluna "atrações" é SUGESTÃO/ponto de partida (a gente ajusta
// no projeto). Área exata em m², carga elétrica, nº de tomadas e de técnicos a
// gente dimensiona no projeto — nunca cravamos número de infra na tela sem
// olhar o evento (regra: número sem confirmação não é fabricado — vira projeto).
const DIMENSIONAMENTO = [
    { porte: "Até 50", atracoes: "2 a 3 estações", perfil: "1 destaque (fliperama ou VR) + jogos rápidos", espaco: "Cabe em foyer ou sala de reunião" },
    { porte: "50 a 150", atracoes: "3 a 5 estações", perfil: "Mix arcade + videokê + jogo de mesa", espaco: "Sala média ou hall" },
    { porte: "151 a 250", atracoes: "5 a 7 estações", perfil: "Arcade + VR + simulador + mesa (rodízio)", espaco: "Salão de eventos" },
    { porte: "250 a 400", atracoes: "7 a 10 estações", perfil: "Várias frentes pra evitar fila", espaco: "Salão amplo" },
    { porte: "400+", atracoes: "10+ estações", perfil: "Ativação de grande porte, várias ilhas", espaco: "Galpão / pavilhão" },
];

// FAQ B2B (gate 5.d): NF/fatura de locação, faturamento, homologação,
// "funcionário opera?", montagem fora de horário. Espelha o texto (FAQPage).
const FAQ: FaqEntry[] = [
    {
        question: "Vocês emitem nota fiscal? Como funciona a NF de locação?",
        answer:
            "Locação de equipamento é locação de bem móvel — o documento certo é a fatura/nota de locação junto com o contrato, e não uma " +
            "nota fiscal de serviço (NFS-e) comum, porque locação de bem móvel não é serviço tributado por ISS. Emitimos contrato e o " +
            "documento fiscal de locação pro seu financeiro. Precisa de um formato específico? Fala com a gente que a gente adequa.",
    },
    {
        question: "Trabalham com faturamento e prazo de pagamento pra empresa?",
        answer:
            "Sim, dá pra combinar condições de faturamento e prazo conforme o processo do seu financeiro (por exemplo, pagamento após o evento). " +
            "As condições certinhas a gente fecha no contrato — manda como funciona o seu financeiro que a gente adapta.",
    },
    {
        question: "Precisam ser homologados como fornecedor. Vocês fornecem os documentos?",
        answer:
            "Fornecemos os documentos de cadastro e homologação que o seu setor de compras pedir (dados da empresa, contrato, documento fiscal). " +
            "Manda o checklist do seu processo de fornecedor que a gente organiza o que for necessário.",
    },
    {
        question: "Precisa de alguém da nossa equipe operando os equipamentos?",
        answer:
            "Não. A gente entrega, monta, testa e deixa tudo pronto pra uso livre dos participantes. Os equipamentos são intuitivos e ficamos " +
            "alcançáveis por telefone durante o evento pra qualquer ajuste. Se você quiser um monitor no local, é só combinar no orçamento.",
    },
    {
        question: "Dá pra montar fora do horário comercial, de madrugada ou no fim de semana?",
        answer:
            "Dá. A montagem e a retirada a gente agenda no horário que o seu evento e o local exigem — inclusive de madrugada, fim de semana ou " +
            "em janelas específicas do prédio. Alinha o horário e as regras do local no fechamento pra a gente programar a equipe.",
    },
    {
        question: "Quanto custa um evento corporativo?",
        answer:
            "O valor depende do mix de equipamentos, do número de participantes, da data e do local. Alugando um conjunto de atrações, o combo " +
            "sai melhor. Manda o porte e a data no formulário ou no WhatsApp que a gente monta uma proposta com o investimento.",
        link: { href: "/quanto-custa", label: "Entenda como calculamos o orçamento" },
    },
];

const DIFERENCIAIS = [
    { num: "01", titulo: "Contrato + fatura de locação", texto: "Documentação completa pro financeiro e pra homologação de fornecedor." },
    { num: "02", titulo: "Consultor dedicado", texto: "Um único ponto de contato do briefing à execução do evento." },
    { num: "03", titulo: "Equipe no local", texto: "Montagem, teste e retirada por conta da nossa equipe." },
    { num: "04", titulo: "Faturamento flexível", texto: "Condições e prazo ajustados ao processo do seu financeiro." },
    { num: "05", titulo: "Toda a Grande SP", texto: "Capital, ABC, Alphaville, Osasco, Guarulhos e região." },
    { num: "06", titulo: "Desde 1993", texto: "Fornecedor consolidado, com histórico e estrutura — não improviso." },
];

const PROCESSO = [
    { num: "01", titulo: "Briefing", texto: "Você conta data, local, porte e objetivo do evento — pelo formulário, e-mail ou WhatsApp." },
    { num: "02", titulo: "Proposta", texto: "Recebe uma proposta com mix de equipamentos e investimento, em horário comercial." },
    { num: "03", titulo: "Contrato", texto: "Fechamos os detalhes, emitimos contrato e a documentação que o seu financeiro precisa." },
    { num: "04", titulo: "Execução", texto: "Equipe entrega, monta, testa e acompanha por telefone durante o evento." },
    { num: "05", titulo: "Pós-evento", texto: "Retirada dos equipamentos e, se você precisar, registro/fotos da ativação pra prestar contas internamente." },
];

export default function EmpresasPage() {
    const anos = new Date().getFullYear() - BUSINESS.foundingYear;

    return (
        // --glow-scale: .5 nesta página (§5) — dark/neon mais sóbrio pro B2B.
        <main className="relative overflow-hidden" style={{ "--glow-scale": "0.5" } as CSSProperties}>
            <div className="pointer-events-none absolute inset-0 grid-tron opacity-20" aria-hidden />
            <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" aria-hidden />

            {/* ============= HERO B2B ============= */}
            <section className="relative mx-auto max-w-6xl px-4 pt-16 pb-14 md:pt-24 md:pb-20">
                <nav aria-label="Você está em" className="mb-6 font-body text-xs text-muted-foreground/70">
                    <Link href="/" className="hover:text-foreground">Início</Link>
                    <span className="mx-1.5" aria-hidden>/</span>
                    <span className="text-foreground">Empresas</span>
                </nav>

                <div className="grid lg:grid-cols-[1.25fr_1fr] gap-10 lg:gap-14 items-end">
                    <div>
                        <p className="rise-in label-arcade text-cyan-400 mb-5 inline-flex items-center gap-2">
                            <span className="badge-live text-cyan-400">B2B</span>
                            <span className="text-muted-foreground/60">·</span>
                            <span>Desde 1993 · atendeu Bradesco e Arnold Classic</span>
                        </p>

                        <h1 className="rise-in font-display font-extrabold leading-[0.95] tracking-tight text-4xl sm:text-5xl md:text-6xl" style={{ animationDelay: "120ms" }}>
                            Aluguel de games<br />
                            para eventos<br />
                            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                                corporativos em SP.
                            </span>
                        </h1>

                        {/* Answer capsule B2B (§9.4): fatura de locação + e-mail */}
                        <p className="rise-in mt-7 font-body text-base md:text-lg leading-relaxed text-zinc-300 max-w-2xl" style={{ animationDelay: "240ms" }}>
                            A <strong className="text-foreground font-semibold">Aluguel de Games</strong> monta a estrutura de
                            entretenimento do seu evento corporativo — SIPAT, confraternização, lançamento, team building e ativação
                            de marca — em São Paulo e toda a Grande SP. Vem com <strong className="text-foreground font-semibold">contrato,
                            NF/fatura de locação</strong>, consultor dedicado e equipe que monta e testa tudo no local. Fala com o
                            comercial pelo WhatsApp, pelo formulário ou pelo e-mail{" "}
                            <a href={MAILTO} className="font-semibold text-foreground underline underline-offset-4 hover:text-cyan-300 break-words">
                                {BUSINESS.email}
                            </a>
                            . Desde 1993.
                        </p>

                        <div className="rise-in mt-8 flex flex-col gap-4" style={{ animationDelay: "360ms" }}>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <WhatsAppCta surface="empresas" location="empresas_hero" label="Falar com o comercial" />
                                <KitAprovacaoCta location="empresas_hero" />
                            </div>
                            <PhoneSupportLine surface="empresas" location="empresas_hero" />
                        </div>
                    </div>

                    {/* Case Bradesco */}
                    <aside className="rise-in relative" style={{ animationDelay: "500ms" }}>
                        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/25">
                            <img
                                src="/carousel/compressed/Braland.webp"
                                alt="Evento corporativo Bradesco - Braland"
                                className="w-full aspect-[4/5] object-cover"
                                loading="eager"
                                width={800}
                                height={1000}
                            />
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 p-6">
                                <p className="label-arcade text-cyan-300 mb-2">★ Case</p>
                                <p className="font-display text-2xl font-bold text-white">Bradesco · Braland</p>
                                <p className="font-body text-sm text-white/70 mt-1">Ativação corporativa de grande porte</p>
                            </div>
                            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
                            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
                        </div>
                    </aside>
                </div>
            </section>

            <div className="mx-auto max-w-6xl px-4"><div className="divider-neon" /></div>

            {/* ============= DIMENSIONAMENTO POR PORTE ============= */}
            <section className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
                <div className="mb-8 max-w-3xl">
                    <p className="label-arcade text-blue-400 mb-3">▦ dimensionamento</p>
                    <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight leading-[0.95]">
                        Quantas atrações<br />
                        <span className="italic font-normal text-muted-foreground/80">pro tamanho do evento?</span>
                    </h2>
                    <p className="mt-4 font-body text-base text-zinc-300">
                        Um ponto de partida pra você já levar pro planejamento interno. O mix final a gente fecha com você no projeto.
                    </p>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-border/60">
                    <table className="w-full min-w-[640px] border-collapse text-left font-body text-sm">
                        <thead>
                            <tr className="bg-[var(--color-surface-fact)]/60 text-zinc-300">
                                <th scope="col" className="px-4 py-3 font-mono font-bold text-blue-300">Participantes</th>
                                <th scope="col" className="px-4 py-3 font-semibold">Atrações (ponto de partida)</th>
                                <th scope="col" className="px-4 py-3 font-semibold">Perfil sugerido do mix</th>
                                <th scope="col" className="px-4 py-3 font-semibold">Espaço</th>
                            </tr>
                        </thead>
                        <tbody>
                            {DIMENSIONAMENTO.map((r) => (
                                <tr key={r.porte} className="border-t border-border/50 align-top">
                                    <th scope="row" className="px-4 py-3 font-mono font-bold text-foreground whitespace-nowrap">{r.porte}</th>
                                    <td className="px-4 py-3 text-zinc-200">{r.atracoes}</td>
                                    <td className="px-4 py-3 text-zinc-300">{r.perfil}</td>
                                    <td className="px-4 py-3 text-zinc-300">{r.espaco}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <p className="mt-4 font-body text-xs md:text-sm leading-relaxed text-muted-foreground max-w-3xl">
                    Montagem, teste, retirada e técnicos já entram no combinado. A <strong className="text-zinc-300 font-semibold">área
                    exata em m², a carga elétrica (110/220V), o número de tomadas e a equipe</strong> a gente dimensiona no projeto do
                    seu evento — cada equipamento tem a ficha certa. Manda o porte e o local que a gente devolve o desenho.
                </p>

                <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                    <WhatsAppCta surface="empresas" location="empresas_dimensionamento" label="Dimensionar o meu evento" />
                    <KitAprovacaoCta location="empresas_dimensionamento" label="Levar o kit pro meu gestor (PDF)" />
                </div>
            </section>

            {/* ============= KIT DE APROVAÇÃO ============= */}
            <section className="relative mx-auto max-w-6xl px-4 pb-8">
                <div className="relative overflow-hidden rounded-3xl border-2 border-cyan-500/30 bg-gradient-to-br from-blue-950/40 via-background to-background p-6 md:p-10">
                    <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-center">
                        <div>
                            <p className="label-arcade text-cyan-400 mb-3">📄 pra aprovar internamente</p>
                            <h2 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight leading-tight mb-3">
                                Kit de aprovação interna
                            </h2>
                            <p className="font-body text-sm md:text-base text-zinc-300 max-w-xl">
                                Uma página pronta pra você imprimir ou salvar em PDF e encaminhar pro seu gestor e pro financeiro:
                                quem somos, o que está incluso, como funciona a documentação (contrato + fatura de locação) e um
                                modelo de cronograma. Sem precisar deixar e-mail: é só abrir e baixar.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 md:items-end">
                            <KitAprovacaoCta location="empresas_kit_bloco" className="w-full md:w-auto" />
                            <p className="label-arcade text-muted-foreground/70 text-right">
                                Contrato · Fatura de locação · Cronograma
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============= DIFERENCIAIS B2B ============= */}
            <section className="relative mx-auto max-w-6xl px-4 py-16 md:py-20">
                <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" aria-hidden />
                <div className="relative">
                    <div className="mb-10 max-w-3xl">
                        <p className="label-arcade text-pink-400 mb-3">★ por que empresas escolhem</p>
                        <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight leading-[0.95]">
                            Estrutura de fornecedor,<br />
                            <span className="italic font-normal text-muted-foreground/80">não de improviso.</span>
                        </h2>
                    </div>
                    <div className="grid gap-px bg-border/40 grid-cols-2 md:grid-cols-3 rounded-2xl overflow-hidden border border-border/40">
                        {DIFERENCIAIS.map((d) => (
                            <div key={d.num} className="group bg-background p-5 md:p-6 transition-colors hover:bg-card/60">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-mono font-bold text-blue-400 text-sm">{d.num}</span>
                                    <div className="h-px flex-1 bg-border/60 group-hover:bg-blue-500/40 transition-colors" />
                                </div>
                                <h3 className="font-display text-base md:text-lg font-bold mb-1">{d.titulo}</h3>
                                <p className="font-body text-xs md:text-sm text-muted-foreground leading-snug">{d.texto}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============= PROCESSO ============= */}
            <section className="relative mx-auto max-w-6xl px-4 py-16 md:py-20">
                <div className="mb-12">
                    <p className="label-arcade text-cyan-400 mb-3">↳ processo</p>
                    <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight leading-[0.95]">
                        Do briefing ao pós-evento.
                    </h2>
                </div>
                <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-5">
                    {PROCESSO.map((step) => (
                        <div key={step.num} className="relative rounded-2xl border border-border/60 bg-card/40 p-5 transition-colors hover:border-blue-500/50">
                            <p className="numeral-huge !text-4xl mb-2">{step.num}</p>
                            <h3 className="font-display text-base font-bold mb-1.5">{step.titulo}</h3>
                            <p className="font-body text-xs md:text-sm text-muted-foreground leading-relaxed">{step.texto}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ============= AGENDA NOV/DEZ (honesto) ============= */}
            <section className="relative mx-auto max-w-6xl px-4 pb-8">
                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 px-6 py-5 flex items-start gap-3">
                    <span aria-hidden className="text-lg">📅</span>
                    <p className="font-body text-sm md:text-base text-zinc-200">
                        <strong className="text-foreground">Vai fazer confraternização de fim de ano?</strong>{" "}
                        Novembro e dezembro são o pico da temporada corporativa e a agenda fecha cedo. Quanto antes você reservar,
                        mais garantida fica a data e o mix que você quer. Manda o período que a gente confirma disponibilidade.
                    </p>
                </div>
            </section>

            {/* ============= FAQ B2B ============= */}
            <section className="relative mx-auto max-w-6xl px-4 py-16 md:py-20">
                <div className="mb-10 text-center">
                    <p className="label-arcade text-purple-400 mb-3">? dúvidas do financeiro e do RH</p>
                    <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight leading-[0.95]">
                        NF, faturamento, homologação.
                    </h2>
                </div>
                <FaqNative items={FAQ} withSchema />
            </section>

            {/* ============= FORMULÁRIO B2B ============= */}
            <section className="relative mx-auto max-w-4xl px-4 py-16 md:py-20">
                <div className="mb-8 text-center md:text-left">
                    <p className="label-arcade text-cyan-400 mb-3">✉ peça uma proposta</p>
                    <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight leading-[0.95]">
                        Conta sobre o evento.
                    </h2>
                    <p className="mt-3 font-body text-muted-foreground">
                        A gente responde no seu e-mail em horário comercial. Prefere e-mail direto?{" "}
                        <a href={MAILTO} className="font-semibold text-foreground underline underline-offset-4 hover:text-cyan-300 break-words">
                            {BUSINESS.email}
                        </a>
                        .
                    </p>
                </div>

                <div className="relative rounded-3xl border-2 border-blue-500/30 bg-gradient-to-br from-card/95 via-card/85 to-card/95 p-6 md:p-10 shadow-2xl shadow-blue-500/10">
                    <span className="pointer-events-none absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-cyan-400/60" aria-hidden />
                    <span className="pointer-events-none absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-cyan-400/60" aria-hidden />
                    <span className="pointer-events-none absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-cyan-400/60" aria-hidden />
                    <span className="pointer-events-none absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-cyan-400/60" aria-hidden />
                    <B2BContactForm />
                </div>
            </section>

            {/* ============= CTA FINAL ============= */}
            <section className="relative mx-auto max-w-6xl px-4 pb-24 md:pb-32">
                <div className="relative overflow-hidden rounded-3xl border-2 border-cyan-500/30 bg-gradient-to-br from-blue-950/50 via-purple-950/40 to-background p-8 md:p-14">
                    <div className="relative grid md:grid-cols-[1.5fr_1fr] gap-8 items-center">
                        <div>
                            <p className="label-arcade text-cyan-400 mb-3">→ vamos conversar</p>
                            <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight leading-[0.95] mb-3">
                                Pronto pro próximo<br />evento da empresa?
                            </h2>
                            <p className="font-body text-base md:text-lg text-muted-foreground max-w-lg">
                                {anos} anos de estrutura corporativa. Consultor dedicado, resposta em horário comercial, sem compromisso.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 md:items-end">
                            <WhatsAppCta surface="empresas" location="empresas_cta_final" label="Falar com o comercial" className="w-full md:w-auto" />
                            <Button asChild size="lg" variant="outline" className="w-full md:w-auto">
                                <a href={MAILTO}>Mandar e-mail pro comercial</a>
                            </Button>
                            <PhoneSupportLine surface="empresas" location="empresas_cta_final" className="md:text-right" />
                        </div>
                    </div>
                </div>
            </section>

            <JsonLd
                data={serviceSchema({
                    name: "Aluguel de games para eventos corporativos",
                    serviceType: "Locação de equipamentos de entretenimento para eventos corporativos",
                    description:
                        "Aluguel de fliperamas, videokês, realidade virtual, simuladores e máquinas de dança para SIPAT, confraternização, lançamento e team building em São Paulo e Grande SP. Contrato e fatura de locação.",
                    url: "/empresas",
                })}
            />
            <JsonLd
                data={breadcrumbSchema([
                    { name: "Início", url: "/" },
                    { name: "Empresas", url: "/empresas" },
                ])}
            />
        </main>
    );
}
