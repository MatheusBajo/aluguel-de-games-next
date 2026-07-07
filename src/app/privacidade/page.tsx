// src/app/privacidade/page.tsx
//
// Política de privacidade (LGPD) — gate 1.5 do brief: transparência no
// footer (CNPJ/NAP/LGPD) = quality score no Ads + pré-requisito de GBP e
// homologação B2B. Conteúdo honesto: descreve só o que o site FAZ de
// verdade (GTM/GA4, formulário Web3Forms, redirecionamento pro WhatsApp).
import type { Metadata } from "next";
import Link from "next/link";
import { BUSINESS } from "@/config/business.config";
import { SITE_URL } from "@/lib/site.config";

export const metadata: Metadata = {
    title: "Política de Privacidade (LGPD)",
    description:
        "Como a Aluguel de Games trata seus dados pessoais: quais dados coletamos, pra que usamos, com quem compartilhamos e seus direitos pela LGPD.",
    alternates: { canonical: `${SITE_URL}/privacidade` },
    robots: { index: true, follow: true },
};

export default function PrivacidadePage() {
    const atualizadoEm = new Date().toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
    });

    return (
        <main className="relative mx-auto max-w-3xl px-4 py-16 md:py-24">
            <p className="label-arcade text-cyan-400 mb-4">Transparência</p>
            <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight mb-3">
                Política de privacidade
            </h1>
            <p className="font-body text-sm text-muted-foreground mb-10">
                Última atualização: {atualizadoEm}
            </p>

            <div className="prose prose-invert prose-p:font-body prose-p:text-base prose-headings:font-display max-w-none space-y-8">
                <section>
                    <h2 className="font-display text-2xl font-bold mb-3">Quem somos</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        A {BUSINESS.legalName ?? "Aluguel de Games"}
                        {BUSINESS.cnpj ? ` (CNPJ ${BUSINESS.cnpj})` : ""} aluga equipamentos
                        de entretenimento (fliperamas, videokês, realidade virtual, consoles
                        e jogos de mesa) para festas e eventos em Osasco e Grande São Paulo,
                        desde 1993. Este site ({SITE_URL.replace("https://", "")}) é o nosso
                        canal de apresentação do catálogo e de contato.
                    </p>
                </section>

                <section>
                    <h2 className="font-display text-2xl font-bold mb-3">Quais dados coletamos</h2>
                    <ul className="text-muted-foreground leading-relaxed list-disc pl-5 space-y-2">
                        <li>
                            <strong className="text-foreground">Formulário de contato:</strong>{" "}
                            nome, telefone, e-mail (opcional) e a mensagem que você escreve.
                            Esses dados são enviados por e-mail pra nossa equipe através do
                            serviço Web3Forms e usados só pra responder o seu pedido de
                            orçamento.
                        </li>
                        <li>
                            <strong className="text-foreground">Navegação (analytics):</strong>{" "}
                            usamos Google Tag Manager e Google Analytics 4, que utilizam
                            cookies pra medir visitas, páginas vistas e cliques nos botões de
                            WhatsApp e telefone. São dados estatísticos, usados pra melhorar o
                            site e medir campanhas.
                        </li>
                        <li>
                            <strong className="text-foreground">WhatsApp e telefone:</strong>{" "}
                            os botões do site abrem uma conversa no seu aplicativo de WhatsApp
                            ou a discagem no seu telefone. A conversa acontece fora do site,
                            direto com a nossa equipe, e é regida pela política de privacidade
                            do WhatsApp.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-display text-2xl font-bold mb-3">O que NÃO fazemos</h2>
                    <ul className="text-muted-foreground leading-relaxed list-disc pl-5 space-y-2">
                        <li>Não vendemos nem alugamos seus dados pra terceiros.</li>
                        <li>Não exigimos cadastro ou conta pra navegar no site.</li>
                        <li>Não armazenamos dados de pagamento no site.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-display text-2xl font-bold mb-3">Com quem compartilhamos</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Apenas com os serviços necessários pro site funcionar: Google
                        (Analytics/Tag Manager, estatísticas de navegação) e Web3Forms
                        (entrega do formulário de contato por e-mail). Cada um trata os dados
                        conforme a própria política de privacidade.
                    </p>
                </section>

                <section>
                    <h2 className="font-display text-2xl font-bold mb-3">Seus direitos (LGPD)</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Pela Lei Geral de Proteção de Dados (Lei 13.709/2018), você pode
                        pedir a qualquer momento: confirmação de tratamento, acesso,
                        correção, anonimização ou exclusão dos seus dados pessoais, além de
                        revogar consentimentos. É só escrever pra{" "}
                        <a
                            href={`mailto:${BUSINESS.email}`}
                            className="text-cyan-400 hover:underline"
                        >
                            {BUSINESS.email}
                        </a>{" "}
                        com o assunto &quot;LGPD&quot; que a gente responde.
                    </p>
                </section>

                <section>
                    <h2 className="font-display text-2xl font-bold mb-3">Cookies</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Os cookies usados aqui são os do Google Analytics/Tag Manager
                        (estatística e medição de campanhas). Você pode bloquear cookies nas
                        configurações do seu navegador — o site continua funcionando
                        normalmente.
                    </p>
                </section>

                <section>
                    <h2 className="font-display text-2xl font-bold mb-3">Contato</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Dúvidas sobre esta política: {BUSINESS.email} ou WhatsApp{" "}
                        {BUSINESS.phoneDisplay}.{" "}
                        <Link href="/contato" className="text-cyan-400 hover:underline">
                            Página de contato →
                        </Link>
                    </p>
                </section>
            </div>
        </main>
    );
}
