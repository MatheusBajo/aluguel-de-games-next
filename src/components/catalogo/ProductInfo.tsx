// src/components/catalogo/ProductInfo.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FiShare2 } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { WhatsAppCta } from "@/components/cta/WhatsAppCta";

interface ProductInfoProps {
    titulo: string;
    descricao: string;
    categoria: string;
}

export function ProductInfo({ titulo, descricao, categoria }: ProductInfoProps) {
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: titulo,
                    text: `Confira este produto: ${titulo}`,
                    url: window.location.href,
                });
            } catch {
                console.log("Erro ao compartilhar");
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-6"
        >
            {/* Header */}
            <div>
                <Badge variant="secondary" className="mb-4">
                    {categoria}
                </Badge>
                <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
                    {titulo}
                </h1>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={handleShare} aria-label="Compartilhar">
                        <FiShare2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Description */}
            <div className="prose prose-lg dark:prose-invert">
                <ReactMarkdown>{descricao}</ReactMarkdown>
            </div>

            {/* Fatos verificáveis (substituto honesto do contador/percentual) */}
            <div className="rounded-2xl border bg-muted/20 p-6">
                <h3 className="mb-3 font-semibold">O que está incluso</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>✓ Entrega e montagem incluídas</li>
                    <li>✓ Equipamento testado antes do evento</li>
                    <li>✓ Contrato e NF</li>
                    <li>✓ Suporte técnico durante a locação</li>
                </ul>
            </div>

            {/* Preço honesto (sem faixa confirmada pelo dono, sem número) */}
            <p className="text-sm text-muted-foreground">
                O valor fechado depende de data e bairro — manda os dois no WhatsApp.
            </p>

            {/* CTA */}
            <div className="flex flex-col gap-3">
                <WhatsAppCta
                    surface="product"
                    product={titulo}
                    variant="primary"
                    withMeta
                    metaAlign="left"
                    className="w-full h-12"
                    wrapperClassName="w-full"
                >
                    Pedir orçamento deste item
                </WhatsAppCta>

                <WhatsAppCta
                    surface="product"
                    product={titulo}
                    message={`Oi! Tenho uma pergunta sobre o *${titulo}*.`}
                    variant="outline"
                    className="w-full"
                >
                    Fazer uma pergunta
                </WhatsAppCta>
            </div>
        </motion.div>
    );
}
