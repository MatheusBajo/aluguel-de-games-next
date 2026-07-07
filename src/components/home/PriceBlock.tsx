// src/components/home/PriceBlock.tsx
//
// D3 — "Quanto custa alugar?" (spec §3). A dobra que nenhum concorrente tem.
// ABERTA (nunca em accordion), HTML cru. Versão B (sem faixas assinadas pelo
// dono): os 4 fatores que influenciam o preço + "combos saem melhor" + CTA.
// ZERO número inventado — âncora "a partir de R$" só entra com compromisso
// escrito do dono (ver /quanto-custa + DONO-CHECKLIST).
import { WhatsAppCta } from "@/components/cta/WhatsAppCta";

const FATORES = [
    {
        titulo: "O equipamento",
        texto: "Um fliperama, um videokê e um simulador de VR não custam a mesma coisa.",
    },
    {
        titulo: "A data",
        texto: "Fim de semana e dezembro lotam antes — reservar cedo ajuda no valor.",
    },
    {
        titulo: "O bairro da entrega",
        texto: "Distância e acesso (escada, andar) entram na conta da logística.",
    },
    {
        titulo: "Quantos itens",
        texto: "Alugando mais de um junto, o combo sai melhor que item avulso.",
    },
] as const;

export function PriceBlock() {
    return (
        <div className="rounded-2xl border border-yellow-400/25 bg-card/40 p-6 md:p-8">
            <p className="font-body text-base leading-relaxed text-foreground md:text-lg">
                Não tem tabela mágica: o valor fechado depende de quatro coisas. A gente
                calcula na hora e manda sem taxa escondida — entrega, montagem, retirada e
                suporte já entram no preço.
            </p>

            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {FATORES.map((f, i) => (
                    <li key={f.titulo} className="flex gap-3">
                        <span className="font-mono text-sm font-bold text-yellow-400 tabular-nums">
                            {String(i + 1).padStart(2, "0")}
                        </span>
                        <div>
                            <h3 className="font-display text-base font-bold text-foreground">
                                {f.titulo}
                            </h3>
                            <p className="font-body text-sm leading-relaxed text-muted-foreground">
                                {f.texto}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <WhatsAppCta surface="orcamento" variant="primary">
                    Pedir o valor da minha festa
                </WhatsAppCta>
                <a
                    href="/quanto-custa"
                    className="inline-flex items-center gap-1.5 font-semibold text-cyan-400 underline-offset-4 hover:text-cyan-300 hover:underline"
                >
                    Entenda o orçamento completo
                    <span aria-hidden>→</span>
                </a>
            </div>
        </div>
    );
}

export default PriceBlock;
