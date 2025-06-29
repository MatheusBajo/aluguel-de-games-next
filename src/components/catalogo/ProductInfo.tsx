// src/components/catalogo/ProductInfo.tsx
"use client";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {FiHeart, FiMessageCircle, FiShare2} from "react-icons/fi";
import {FaWhatsapp} from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import {motion} from "framer-motion";

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
                    text: descricao.slice(0, 100),
                    url: window.location.href,
                });
            } catch (err) {
                console.log("Erro ao compartilhar");
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
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

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={handleShare}>
                        <FiShare2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <FiHeart className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Description */}
            <div className="prose prose-lg dark:prose-invert">
                <ReactMarkdown
                    components={{
                        ul: ({ children }) => (
                            <ul className="my-4 ml-6 list-disc space-y-2">{children}</ul>
                        ),
                        li: ({ children }) => (
                            <li className="text-muted-foreground">{children}</li>
                        ),
                        strong: ({ children }) => (
                            <strong className="font-semibold text-foreground">{children}</strong>
                        ),
                    }}
                >
                    {descricao}
                </ReactMarkdown>
            </div>

            {/* Features */}
            <div className="rounded-2xl border bg-muted/20 p-6">
                <h3 className="mb-3 font-semibold">Características</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>✓ Entrega e instalação incluídas</li>
                    <li>✓ Suporte técnico durante o evento</li>
                    <li>✓ Equipamento higienizado e revisado</li>
                    <li>✓ Garantia de funcionamento</li>
                </ul>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3">
                <Button
                    size="lg"
                    className="transition-all h-12 duration-300 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white border-0 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 flex items-center gap-2"
                    onClick={() => window.open("https://wa.me/+551142377766", "_blank")}
                >
                    <FaWhatsapp className="text-xl" />
                    <span>Fazer Orçamento</span>
                </Button>

                <Button variant="outline" size="lg" className="w-full gap-3" onClick={() => window.open("https://wa.me/+551142377766", "_blank")}>
                    <FiMessageCircle className="h-5 w-5" />
                    Fazer uma Pergunta
                </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-around border-t pt-6 text-center">
                <div>
                    <p className="text-2xl font-bold text-primary">500+</p>
                    <p className="text-xs text-muted-foreground">Eventos realizados</p>
                </div>
                <div>
                    <p className="text-2xl font-bold text-primary">24h</p>
                    <p className="text-xs text-muted-foreground">Resposta rápida</p>
                </div>
                <div>
                    <p className="text-2xl font-bold text-primary">100%</p>
                    <p className="text-xs text-muted-foreground">Satisfação</p>
                </div>
            </div>
        </motion.div>
    );
}