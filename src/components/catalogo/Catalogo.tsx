// src/components/catalogo/Catalogo.tsx
import CatalogList from "@/app/catalogo/CatalogList.server";
import { motion } from "framer-motion";

export default async function Catalogo() {
    return (
        <main className="relative mx-auto max-w-screen-2xl px-4 py-12">
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -left-4 top-20 h-72 w-72 rounded-full bg-primary-blue/10 blur-3xl" />
                <div className="absolute -right-4 top-96 h-72 w-72 rounded-full bg-primary-purple/10 blur-3xl" />
            </div>

            {/* Header */}
            <div className="mb-12 text-center">
                <h1 className="mb-4 text-5xl font-bold tracking-tight">
                    Nosso Catálogo
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                    Explore nossa coleção completa de jogos e equipamentos para tornar seu evento inesquecível
                </p>
            </div>

            {/* Catalog */}
            <CatalogList />
        </main>
    );
}