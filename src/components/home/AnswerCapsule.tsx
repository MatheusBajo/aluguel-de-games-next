// src/components/home/AnswerCapsule.tsx
//
// Answer capsule da home (SPEC-FINAL-V2 §3.3 · copy §9.1).
// Primeiro texto corrido da página, 40-80 palavras, em HTML CRU (server
// component, zero JS) — é o trecho que IA e Google extraem como resposta.
// Aceite: `curl / | grep "desde 1993"` e telefone precisam bater (audit:raw).
import { BUSINESS } from '@/config/business.config';

export default function AnswerCapsule() {
    return (
        <section aria-label="Resumo" className="w-full">
            <div className="mx-auto max-w-3xl px-4">
                <p className="font-body text-[0.9375rem] md:text-lg leading-relaxed text-zinc-300">
                    A <strong className="text-foreground font-semibold">Aluguel de Games</strong> loca
                    fliperamas, videokês, PS5, realidade virtual, máquina de dança e jogos de mesa para
                    festas e eventos em <strong className="text-foreground font-semibold">Osasco e toda a
                    Grande São Paulo</strong>. Você escolhe, a gente entrega montado e testado, com
                    contrato e nota fiscal. Orçamento pelo WhatsApp{' '}
                    <a
                        href={`tel:${BUSINESS.phoneE164}`}
                        className="font-semibold text-foreground hover:text-green-400 transition-colors tabular-nums"
                    >
                        {BUSINESS.phoneDisplay}
                    </a>
                    . Desde 1993.
                </p>
            </div>
        </section>
    );
}
