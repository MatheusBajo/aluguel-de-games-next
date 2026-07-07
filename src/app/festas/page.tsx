import Link from "next/link";
import type { Metadata } from "next";
import { WhatsAppCta, PhoneSupportLine } from "@/components/cta/WhatsAppCta";
import OccasionCard from "@/components/home/OccasionCard";
import FaqNative, { type FaqEntry } from "@/components/seo/FaqNative";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { getCatalog } from "@/lib/catalog.server";
import { itemsForOccasion } from "@/lib/occasions";
import { BUSINESS } from "@/config/business.config";
import { SITE_URL } from "@/lib/site.config";

export const metadata: Metadata = {
    title: {
        absolute: "Aluguel de Games para Festas e Aniversários em SP | Desde 1993",
    },
    description:
        "Aluguel de fliperama, videokê, VR e brinquedos para festa infantil, aniversário adulto, bodas e festa de família em Osasco e Grande SP. Entrega, montagem e suporte inclusos. Orçamento no WhatsApp.",
    alternates: { canonical: `${SITE_URL}/festas` },
    openGraph: {
        title: "Aluguel de Games para Festas e Aniversários",
        description:
            "Da festa infantil ao aniversário retrô e à comemoração de família: monte o mix ideal de atrações. Entrega e montagem inclusas na Grande SP.",
        url: `${SITE_URL}/festas`,
        siteName: "Aluguel de Games",
        locale: "pt_BR",
        type: "website",
    },
};

const FAQ: FaqEntry[] = [
    {
        question: "Dá pra misturar atração de criança e de adulto na mesma festa?",
        answer:
            "Dá, e é o mais comum. Cama elástica e piscina de bolinhas pras crianças, fliperama, videokê e air game pros adultos — " +
            "tudo montado no mesmo evento. A gente ajuda a escolher o mix pela idade da galera e pelo espaço que você tem.",
    },
    {
        question: "Os equipamentos cabem em apartamento? Passam no elevador?",
        answer:
            "Boa parte cabe. Vários itens passam em porta comum e elevador; outros (simulador, alguns fliperamas) precisam de mais espaço. " +
            "Manda o tipo do local (casa, salão, apartamento) que a gente indica o que encaixa e como fica a montagem.",
        link: { href: "/como-funciona", label: "Ver como funciona a entrega e montagem" },
    },
    {
        question: "E se a festa for ao ar livre e chover?",
        answer:
            "Equipamento eletrônico precisa ficar coberto. Se a sua festa é ao ar livre, a gente combina antes um ponto coberto pra montagem, " +
            "e conversa sobre remarcação em caso de chuva. Alinha isso no orçamento pra não ter susto no dia.",
    },
    {
        question: "Vocês entregam e montam, ou eu preciso buscar?",
        answer:
            "A gente entrega, monta, testa cada equipamento antes da festa e busca depois. Você não precisa transportar nem montar nada — " +
            "entrega, montagem e suporte estão inclusos em toda a Grande São Paulo.",
    },
    {
        question: "Com quanto tempo de antecedência preciso reservar?",
        answer:
            "Quanto antes melhor, principalmente pra fim de semana, feriado e dezembro, que lotam a agenda primeiro. Reservando com " +
            "alguns dias de antecedência você garante a data e os equipamentos que quer. Na correria? Manda mensagem que a gente vê o que dá.",
    },
    {
        question: "Quanto custa alugar para a minha festa?",
        answer:
            "O valor depende dos equipamentos, da data e do bairro da entrega. Alugando mais de um item junto, o combo sai melhor. " +
            "Manda a data e o bairro no WhatsApp que a gente responde com o orçamento fechado.",
        link: { href: "/quanto-custa", label: "Entenda o orçamento" },
    },
];

function MixRow({ items }: { items: ReturnType<typeof itemsForOccasion> }) {
    if (!items.length) return null;
    return (
        <div className="occasion-scroller scrollbar-hide">
            {items.map((item) => (
                <OccasionCard key={item.key} item={item} />
            ))}
        </div>
    );
}

export default async function FestasPage() {
    const anos = new Date().getFullYear() - BUSINESS.foundingYear;
    const catalog = await getCatalog();
    const infantil = itemsForOccasion(catalog, "infantil").slice(0, 12);
    const adulta = itemsForOccasion(catalog, "adulta").slice(0, 12);

    return (
        <main className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 grid-tron opacity-30" aria-hidden />
            <div className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-pink-500/10 blur-3xl" aria-hidden />

            {/* ============= HERO ============= */}
            <section className="relative mx-auto max-w-6xl px-4 pt-16 pb-10 md:pt-24 md:pb-14">
                <nav aria-label="Você está em" className="mb-6 font-body text-xs text-muted-foreground/70">
                    <Link href="/" className="hover:text-foreground">Início</Link>
                    <span className="mx-1.5" aria-hidden>/</span>
                    <span className="text-foreground">Festas e aniversários</span>
                </nav>

                <p className="rise-in label-arcade text-pink-400 mb-5 inline-flex items-center gap-2">
                    <span className="badge-live text-pink-400">★</span>
                    <span>Desde 1993 · Osasco e Grande SP</span>
                </p>

                <h1 className="rise-in font-display font-extrabold leading-[0.95] tracking-tight text-4xl sm:text-5xl md:text-6xl" style={{ animationDelay: "120ms" }}>
                    Aluguel de games<br />
                    <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent italic">
                        pra sua festa.
                    </span>
                </h1>

                <div className="rise-in mt-8 max-w-3xl" style={{ animationDelay: "240ms" }}>
                    <p className="font-body text-base md:text-lg leading-relaxed text-zinc-300">
                        Da <strong className="text-foreground font-semibold">festa infantil</strong> ao{" "}
                        <strong className="text-foreground font-semibold">aniversário retrô</strong>, das{" "}
                        <strong className="text-foreground font-semibold">bodas</strong> à comemoração de família: a{" "}
                        <strong className="text-foreground font-semibold">Aluguel de Games</strong> monta o mix de fliperama,
                        videokê, realidade virtual, cama elástica e jogos de mesa que combina com a sua festa em Osasco e toda a
                        Grande São Paulo. A gente entrega montado e testado, com contrato e nota. Orçamento pelo WhatsApp{" "}
                        <a href={`tel:${BUSINESS.phoneE164}`} className="font-semibold text-foreground hover:text-green-400 transition-colors tabular-nums">
                            {BUSINESS.phoneDisplay}
                        </a>
                        . Desde 1993.
                    </p>
                </div>

                <div className="rise-in mt-8 flex flex-col items-start gap-3" style={{ animationDelay: "360ms" }}>
                    <div className="flex flex-wrap gap-3">
                        <WhatsAppCta surface="festas" location="festas_hero" label="Montar minha festa no WhatsApp" />
                        <Link
                            href="#infantil"
                            className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-border/70 px-6 h-12 text-base font-semibold text-foreground transition-colors hover:border-pink-500/60"
                        >
                            Ver por ocasião ↓
                        </Link>
                    </div>
                    <PhoneSupportLine surface="festas" location="festas_hero" />
                </div>
            </section>

            <div className="mx-auto max-w-6xl px-4">
                <div className="divider-neon" />
            </div>

            {/* ============= FESTA INFANTIL ============= */}
            <section id="infantil" className="relative mx-auto max-w-6xl px-4 py-16 md:py-20 scroll-mt-24">
                <div className="mb-6 max-w-3xl">
                    <p className="label-arcade text-pink-400 mb-3">🎈 pra criançada</p>
                    <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight leading-[0.95]">
                        Festa infantil.
                    </h2>
                    <p className="mt-4 font-body text-base md:text-lg leading-relaxed text-zinc-300">
                        Cama elástica, piscina de bolinhas, air game e máquina de pegar bichinho: a criançada não para um minuto,
                        e você fica tranquilo porque a gente monta, testa e dá suporte durante a festa. Some um console com Just
                        Dance que os maiores também entram na brincadeira.
                    </p>
                </div>

                {infantil.length > 0 ? (
                    <MixRow items={infantil} />
                ) : (
                    <p className="font-body text-sm text-muted-foreground">Fala com a gente que a gente monta o mix infantil.</p>
                )}

                <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                    <WhatsAppCta surface="festas" location="festas_infantil" label="Montar festa infantil" />
                    <Link href="/catalogo/piscinas-inflaveis-cama-elastica-infantil/" className="inline-flex items-center gap-1 font-body text-sm font-semibold text-foreground underline underline-offset-4 hover:text-pink-400">
                        Ver tudo pra festa infantil <span aria-hidden>→</span>
                    </Link>
                </div>
            </section>

            <div className="mx-auto max-w-6xl px-4">
                <div className="divider-neon" />
            </div>

            {/* ============= FESTA ADULTA / RETRÔ / FAMÍLIA ============= */}
            <section id="adulto" className="relative mx-auto max-w-6xl px-4 py-16 md:py-20 scroll-mt-24">
                <div className="mb-6 max-w-3xl">
                    <p className="label-arcade text-cyan-400 mb-3">🕹️ pra galera adulta</p>
                    <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight leading-[0.95]">
                        Aniversário, retrô<br />
                        <span className="italic font-normal text-muted-foreground/80">e festa de família.</span>
                    </h2>
                    <p className="mt-4 font-body text-base md:text-lg leading-relaxed text-zinc-300">
                        Aniversário de adulto, bodas, comemoração de família, reencontro de amigos: fliperama, videokê, pebolim,
                        sinuca e air game trazem de volta a esquina dos anos 90 e ninguém fica parado. Ótimos pra misturar
                        gerações — do avô ao sobrinho, todo mundo joga.
                    </p>
                </div>

                {adulta.length > 0 ? (
                    <MixRow items={adulta} />
                ) : (
                    <p className="font-body text-sm text-muted-foreground">Fala com a gente que a gente monta o mix da sua festa.</p>
                )}

                <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                    <WhatsAppCta surface="festas" location="festas_adulto" label="Montar minha festa" />
                    <Link href="/catalogo" className="inline-flex items-center gap-1 font-body text-sm font-semibold text-foreground underline underline-offset-4 hover:text-cyan-400">
                        Ver o catálogo completo <span aria-hidden>→</span>
                    </Link>
                </div>
            </section>

            {/* ============= É EVENTO DE EMPRESA? ============= */}
            <section className="relative mx-auto max-w-6xl px-4 py-12">
                <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 px-6 py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-body text-sm md:text-base text-zinc-200">
                        <strong className="text-foreground">É confraternização, SIPAT ou ativação de marca?</strong>{" "}
                        A gente tem uma estrutura própria pra empresa, com NF/fatura de locação e kit de aprovação interna.
                    </p>
                    <Link
                        href="/empresas"
                        className="shrink-0 inline-flex items-center gap-1 rounded-full border border-purple-500/50 px-5 py-2 text-sm font-semibold text-purple-200 transition-colors hover:bg-purple-500/10"
                    >
                        Ver soluções pra empresas <span aria-hidden>→</span>
                    </Link>
                </div>
            </section>

            {/* ============= FAQ ============= */}
            <section className="relative mx-auto max-w-6xl px-4 py-16 md:py-20">
                <p className="label-arcade text-purple-400 mb-3 text-center">? antes de fechar</p>
                <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight leading-[0.95] mb-10 text-center">
                    Perguntas de quem vai dar festa.
                </h2>
                <FaqNative items={FAQ} withSchema />
            </section>

            {/* ============= CTA FINAL ============= */}
            <section className="relative mx-auto max-w-6xl px-4 pb-24 md:pb-32">
                <div className="relative overflow-hidden rounded-3xl border-2 border-green-500/40 bg-gradient-to-br from-green-950/40 via-emerald-950/30 to-background p-8 md:p-12 text-center">
                    <div className="pointer-events-none absolute -top-20 -left-20 w-60 h-60 rounded-full bg-green-500/20 blur-3xl" />
                    <p className="label-arcade text-green-400 mb-3">▸ bora marcar</p>
                    <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight leading-[0.95] mb-4">
                        Conta como vai ser<br />
                        <span className="italic font-normal text-muted-foreground/80">que a gente monta o resto.</span>
                    </h2>
                    <p className="font-body text-muted-foreground max-w-xl mx-auto mb-8">
                        {anos} anos animando festa na Grande SP. Manda a data, o bairro e quantos convidados — o resto é com a gente.
                    </p>
                    <WhatsAppCta surface="festas" location="festas_cta_final" label="Montar minha festa no WhatsApp" withPhone />
                </div>
            </section>

            <JsonLd
                data={breadcrumbSchema([
                    { name: "Início", url: "/" },
                    { name: "Festas e aniversários", url: "/festas" },
                ])}
            />
        </main>
    );
}
