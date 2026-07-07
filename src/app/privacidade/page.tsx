// src/app/privacidade/page.tsx
//
// Política de privacidade (LGPD) — gate 1.5 do brief. Página estática,
// honesta sobre o que o site realmente coleta (GTM/GA4 + formulário Web3Forms
// + redirecionamento pro WhatsApp). Razão social/CNPJ aguardam o dono.
import type { Metadata } from "next";
import Link from "next/link";
import { WHATSAPP_CONFIG } from "@/config/whatsapp.config";
import { CNPJ } from "@/lib/schema";

export const metadata: Metadata = {
    title: "Política de Privacidade",
    description:
        "Como o site da Aluguel de Games trata seus dados: cookies de análise, formulário de contato e conversas via WhatsApp. Seus direitos segundo a LGPD.",
    alternates: { canonical: "https://www.alugueldegames.com.br/privacidade" },
    robots: { index: true, follow: true },
};

export default function PrivacidadePage() {
    const atualizadoEm = new Date().toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
    });

    return (
        <main className="relative mx-auto max-w-3xl px-4 py-16 md:py-24">
            <p className="label-arcade text-purple-400 mb-4">→ LGPD</p>
            <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight mb-4">
                Política de privacidade
            </h1>
            <p className="font-body text-sm text-muted-foreground mb-10">
                Última atualização: {atualizadoEm}
            </p>

            <div className="prose prose-invert prose-sm md:prose-base max-w-none font-body space-y-8">
                <section>
                    <h2 className="font-display font-bold text-2xl mb-3">Quem somos</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Aluguel de Games — locação de equipamentos de entretenimento para
                        festas e eventos, atuando desde 1993 em Osasco e Grande São Paulo.
                        CNPJ: {CNPJ ?? "[CONFIRMAR COM DONO: CNPJ]"}. Contato:{" "}
                        {WHATSAPP_CONFIG.displayNumber} · contato@alugueldegames.com.br.
                    </p>
                </section>

                <section>
                    <h2 className="font-display font-bold text-2xl mb-3">Quais dados coletamos</h2>
                    <ul className="text-muted-foreground leading-relaxed list-disc pl-5 space-y-2">
                        <li>
                            <strong className="text-foreground">Formulário de contato:</strong>{" "}
                            nome, telefone, e-mail (opcional) e detalhes do evento que você
                            preencher. Esses dados são enviados por e-mail pra nossa equipe
                            através do serviço Web3Forms e usados só pra responder seu pedido
                            de orçamento.
                        </li>
                        <li>
                            <strong className="text-foreground">Análise de navegação:</strong>{" "}
                            usamos Google Tag Manager / Google Analytics pra entender como o
                            site é usado (páginas visitadas, cliques em botões de WhatsApp e
                            telefone). Esses dados são agregados e não identificam você.
                        </li>
                        <li>
                            <strong className="text-foreground">WhatsApp:</strong> ao clicar num
                            botão de WhatsApp, você é levado pro aplicativo com uma mensagem
                            pré-preenchida. A conversa acontece no WhatsApp e segue a{" "}
                            política de privacidade do próprio WhatsApp.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-display font-bold text-2xl mb-3">O que NÃO fazemos</h2>
                    <ul className="text-muted-foreground leading-relaxed list-disc pl-5 space-y-2">
                        <li>Não vendemos nem compartilhamos seus dados com terceiros pra marketing.</li>
                        <li>Não exigimos cadastro nem senha pra usar o site.</li>
                        <li>Não armazenamos dados de pagamento no site.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-display font-bold text-2xl mb-3">Cookies</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        O site usa cookies do Google Analytics/Tag Manager pra medição de
                        audiência e conversão (ex.: saber que um clique no WhatsApp veio de
                        um anúncio). Você pode bloquear cookies nas configurações do seu
                        navegador sem perder acesso a nenhum conteúdo do site.
                    </p>
                </section>

                <section>
                    <h2 className="font-display font-bold text-2xl mb-3">Seus direitos (LGPD)</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Nos termos da Lei Geral de Proteção de Dados (Lei 13.709/2018), você
                        pode pedir acesso, correção ou exclusão dos dados que enviou pra
                        gente (por exemplo, pelo formulário de contato). É só chamar no
                        WhatsApp {WHATSAPP_CONFIG.displayNumber} ou escrever pra
                        contato@alugueldegames.com.br que a gente atende.
                    </p>
                </section>

                <section>
                    <h2 className="font-display font-bold text-2xl mb-3">Dúvidas</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Qualquer dúvida sobre esta política, fale com a gente pela{" "}
                        <Link href="/contato" className="text-cyan-400 hover:underline">
                            página de contato
                        </Link>
                        .
                    </p>
                </section>
            </div>
        </main>
    );
}
