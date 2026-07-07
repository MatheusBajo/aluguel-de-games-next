// src/components/catalogo/ProductInfo.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FiShare2 } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { WhatsAppCta, PhoneSupportLine } from "@/components/cta/WhatsAppCta";

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

            {/* Features */}
            <div className="rounded-2xl border bg-muted/20 p-6">
                <h3 className="mb-3 font-semibold">O que está incluso</h3>
                <ul className="space-y-2 text-sm text-zinc-300">
                    <li>✓ Entrega e montagem incluídas</li>
                    <li>✓ Equipamento testado antes do evento</li>
                    <li>✓ Suporte técnico durante a locação</li>
                    <li>✓ Contrato e nota fiscal</li>
                </ul>
            </div>

            {/* Preço honesto — estado SEM preço (gate 1.6): 1 linha simples */}
            <p className="text-sm text-zinc-300">
                O valor fechado depende da data e do bairro — manda os dois no
                WhatsApp que a gente responde com o orçamento.
            </p>

            {/* CTA */}
            <div className="flex flex-col gap-3">
                <WhatsAppCta
                    surface="product"
                    product={titulo}
                    location="product_page"
                    label="Pedir orçamento deste item"
                    className="w-full"
                />

                <WhatsAppCta
                    surface="product"
                    product={titulo}
                    location="product_page_pergunta"
                    variant="outline"
                    label="Tirar uma dúvida no WhatsApp"
                    className="w-full"
                />

                <PhoneSupportLine surface="product" location="product_page" />
            </div>
        </motion.div>
    );
}
