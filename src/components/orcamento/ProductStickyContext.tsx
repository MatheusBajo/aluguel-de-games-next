// src/components/orcamento/ProductStickyContext.tsx
//
// Ponte pra a StickyBar GLOBAL (layout) carregar o CONTEXTO DO PRODUTO
// (spec §3 / §4.10: "na página de produto o prefill nomeia o produto").
// A StickyBar é global e não sabe o nome do produto pela URL (slug != título).
// A página de produto (server) renderiza <SetStickyProduct product={titulo} />,
// que preenche este contexto no cliente; a StickyBar lê e troca o prefill pra
// surface="product" nomeando o item. Progressive: o HTML servido já traz o
// prefill de categoria; a hidratação faz o upgrade pro produto.
"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface StickyProductState {
    product: string | null;
    setProduct: (name: string | null) => void;
}

const StickyProductContext = createContext<StickyProductState>({
    product: null,
    setProduct: () => {},
});

export function StickyProductProvider({ children }: { children: ReactNode }) {
    const [product, setProduct] = useState<string | null>(null);
    return (
        <StickyProductContext.Provider value={{ product, setProduct }}>
            {children}
        </StickyProductContext.Provider>
    );
}

export function useStickyProduct(): StickyProductState {
    return useContext(StickyProductContext);
}

/** Registra o produto atual na StickyBar; limpa ao sair da página. */
export function SetStickyProduct({ product }: { product: string }) {
    const { setProduct } = useStickyProduct();
    useEffect(() => {
        setProduct(product);
        return () => setProduct(null);
    }, [product, setProduct]);
    return null;
}

export default StickyProductProvider;
