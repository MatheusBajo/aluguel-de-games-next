import Link from "next/link";
import type { Metadata } from "next";
import PrintButton from "@/components/empresas/PrintButton";
import { WhatsAppCta } from "@/components/cta/WhatsAppCta";
import { BUSINESS } from "@/config/business.config";
import { SITE_URL } from "@/lib/site.config";

// Página imprimível — não é LP de busca; fora do sitemap e noindex.
export const metadata: Metadata = {
    title: "Kit de aprovação interna — Eventos corporativos | Aluguel de Games",
    description:
        "Kit de aprovação interna para eventos corporativos: quem somos, o que está incluso, documentação (contrato + fatura de locação) e modelo de cronograma. Imprima ou salve em PDF.",
    alternates: { canonical: `${SITE_URL}/empresas/kit-aprovacao` },
    robots: { index: false, follow: true },
};

const INCLUSO = [
    "Entrega, montagem e teste dos equipamentos no local",
    "Suporte por telefone durante o evento",
    "Retirada depois do evento",
    "Contrato de locação + documento fiscal (fatura/nota de locação)",
    "Consultor dedicado do briefing à execução",
];

const CRONOGRAMA = [
    { fase: "Antes do evento", desc: "Alinhamento de mix, data, local e documentação; assinatura do contrato." },
    { fase: "Dia · montagem", desc: "Equipe chega com antecedência, monta e testa cada equipamento antes do início." },
    { fase: "Durante o evento", desc: "Equipamentos em uso livre pelos participantes; suporte alcançável por telefone." },
    { fase: "Após o evento", desc: "Retirada dos equipamentos e, se solicitado, registro/fotos da ativação." },
];

export default function KitAprovacaoPage() {
    const anos = new Date().getFullYear() - BUSINESS.foundingYear;
    const cidades = BUSINESS.areaServed.join(", ");
    const temDadosLegais = Boolean(BUSINESS.cnpj || BUSINESS.legalName);

    return (
        <main className="kit-doc relative mx-auto max-w-3xl px-4 py-10 md:py-14">
            <style>{`
                @media print {
                    header, footer, .no-print { display: none !important; }
                    .kit-doc { max-width: 100% !important; padding: 0 !important; color: #000 !important; }
                    .kit-page { break-after: page; }
                    .kit-card { border-color: #ccc !important; background: #fff !important; }
                    body { background: #fff !important; }
                    .kit-doc, .kit-doc * { color: #111 !important; }
                    .kit-muted { color: #555 !important; }
                    a { color: #111 !important; text-decoration: none !important; }
                }
            `}</style>

            {/* Barra de ações (some na impressão) */}
            <div className="no-print mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link href="/empresas" className="font-body text-sm text-muted-foreground hover:text-foreground">
                    ← Voltar pra Empresas
                </Link>
                <PrintButton />
            </div>

            {/* ===================== PÁGINA 1 ===================== */}
            <section className="kit-page">
                <header className="mb-8 border-b border-border/60 pb-6">
                    <p className="label-arcade text-cyan-400 mb-2">Kit de aprovação interna</p>
                    <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight">
                        Aluguel de Games para eventos corporativos
                    </h1>
                    <p className="kit-muted mt-2 font-body text-sm text-muted-foreground">
                        Documento para aprovação interna e homologação de fornecedor · Aluguel de Games · desde 1993 ({anos} anos)
                    </p>
                </header>

                <div className="space-y-8">
                    <div>
                        <h2 className="font-display text-lg font-bold mb-2">Quem somos</h2>
                        <p className="font-body text-sm leading-relaxed text-zinc-300">
                            A Aluguel de Games loca fliperamas, videokês, realidade virtual, simuladores, máquinas de dança e jogos
                            de mesa para festas e eventos em Osasco e toda a Grande São Paulo desde 1993. Já atendeu eventos de
                            Bradesco e Arnold Classic, entre outros. Estrutura própria de entrega, montagem e suporte.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-display text-lg font-bold mb-2">O que está incluso na locação</h2>
                        <ul className="space-y-1.5">
                            {INCLUSO.map((i) => (
                                <li key={i} className="flex items-start gap-2 font-body text-sm text-zinc-300">
                                    <span aria-hidden className="mt-0.5 text-green-500">✓</span> {i}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="font-display text-lg font-bold mb-2">Documentação (financeiro e compras)</h2>
                        <p className="font-body text-sm leading-relaxed text-zinc-300">
                            Locação de equipamento é locação de bem móvel: o documento é a <strong className="text-foreground">fatura/nota
                            de locação</strong> acompanhada do <strong className="text-foreground">contrato</strong> — locação de bem
                            móvel não é serviço tributado por ISS, então não gera NFS-e comum. Fornecemos os documentos de cadastro e
                            homologação que o seu setor de compras exigir. Condições de faturamento e prazo de pagamento são ajustadas
                            ao processo do seu financeiro e formalizadas no contrato.
                        </p>
                    </div>

                    <div className="kit-card rounded-2xl border border-border/60 bg-card/30 p-5">
                        <h2 className="font-display text-lg font-bold mb-3">Contato e área de atendimento</h2>
                        <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2 font-body text-sm">
                            <div>
                                <dt className="kit-muted text-muted-foreground">WhatsApp / Telefone</dt>
                                <dd className="font-semibold tabular-nums">{BUSINESS.phoneDisplay}</dd>
                            </div>
                            <div>
                                <dt className="kit-muted text-muted-foreground">E-mail</dt>
                                <dd className="font-semibold break-words">{BUSINESS.email}</dd>
                            </div>
                            <div>
                                <dt className="kit-muted text-muted-foreground">Site</dt>
                                <dd className="font-semibold">alugueldegames.com.br</dd>
                            </div>
                            <div>
                                <dt className="kit-muted text-muted-foreground">Atende</dt>
                                <dd className="font-semibold">{BUSINESS.address.locality} e Grande SP</dd>
                            </div>
                            <div className="sm:col-span-2">
                                <dt className="kit-muted text-muted-foreground">Regiões</dt>
                                <dd>{cidades} e cidades vizinhas</dd>
                            </div>
                        </dl>
                        {temDadosLegais ? (
                            <dl className="mt-3 border-t border-border/50 pt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2 font-body text-sm">
                                {BUSINESS.legalName && (
                                    <div><dt className="kit-muted text-muted-foreground">Razão social</dt><dd className="font-semibold">{BUSINESS.legalName}</dd></div>
                                )}
                                {BUSINESS.cnpj && (
                                    <div><dt className="kit-muted text-muted-foreground">CNPJ</dt><dd className="font-semibold tabular-nums">{BUSINESS.cnpj}</dd></div>
                                )}
                                {BUSINESS.address.street && (
                                    <div className="sm:col-span-2"><dt className="kit-muted text-muted-foreground">Endereço</dt><dd className="font-semibold">{BUSINESS.address.street}</dd></div>
                                )}
                            </dl>
                        ) : (
                            <p className="kit-muted mt-3 border-t border-border/50 pt-3 font-body text-xs text-muted-foreground">
                                Razão social, CNPJ e endereço completo são enviados junto com a proposta e a documentação de
                                homologação de fornecedor.
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* ===================== PÁGINA 2 ===================== */}
            <section className="kit-page pt-10">
                <div className="space-y-8">
                    <div>
                        <h2 className="font-display text-lg font-bold mb-3">Modelo de cronograma</h2>
                        <div className="overflow-hidden rounded-2xl border border-border/60">
                            <table className="w-full border-collapse text-left font-body text-sm">
                                <tbody>
                                    {CRONOGRAMA.map((c) => (
                                        <tr key={c.fase} className="border-b border-border/50 last:border-0 align-top">
                                            <th scope="row" className="w-[38%] px-4 py-3 font-semibold text-foreground">{c.fase}</th>
                                            <td className="px-4 py-3 text-zinc-300">{c.desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="kit-muted mt-2 font-body text-xs text-muted-foreground">
                            Horários exatos de montagem e retirada (inclusive fora do horário comercial, madrugada ou fim de semana)
                            são definidos conforme o seu evento e as regras do local.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-display text-lg font-bold mb-2">Investimento</h2>
                        <p className="font-body text-sm leading-relaxed text-zinc-300">
                            O investimento é dimensionado por evento e depende do mix de equipamentos, do número de participantes, da
                            data e do local. Alugando um conjunto de atrações, o combo sai melhor do que contratar item a item.
                            Entrega, montagem, suporte e retirada já entram no valor. Peça a proposta com o porte e a data do seu
                            evento que a gente devolve o investimento fechado.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-display text-lg font-bold mb-2">Como aprovar / próximos passos</h2>
                        <ol className="space-y-1.5 font-body text-sm text-zinc-300">
                            <li>1. Envie porte, data, local e objetivo do evento pelos canais abaixo.</li>
                            <li>2. Receba a proposta com mix de equipamentos e investimento.</li>
                            <li>3. Aprovada a proposta, fechamos contrato e a documentação do seu financeiro.</li>
                        </ol>
                    </div>

                    <div className="kit-card rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-5">
                        <p className="font-display text-base font-bold mb-2">Fale com o comercial</p>
                        <p className="font-body text-sm text-zinc-300">
                            WhatsApp/Telefone <strong className="text-foreground tabular-nums">{BUSINESS.phoneDisplay}</strong> ·
                            E-mail <strong className="text-foreground break-words">{BUSINESS.email}</strong>
                        </p>
                        <div className="no-print mt-4">
                            <WhatsAppCta surface="empresas" location="kit_page_cta" label="Falar com o comercial" />
                        </div>
                    </div>

                    <p className="kit-muted font-body text-xs text-muted-foreground border-t border-border/50 pt-4">
                        Aluguel de Games · desde 1993 · Osasco e Grande São Paulo · {SITE_URL.replace("https://", "")}
                    </p>
                </div>
            </section>
        </main>
    );
}
