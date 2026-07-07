// src/components/sticky/StickyProduct.tsx
//
// Contexto do produto pra StickyBar global (SPEC-FINAL-V2 §4.11): na rota de
// produto, a UMA barra global assume o prefill DO produto (nomeia o item no
// WhatsApp). Provider mora no layout; a página de produto injeta o nome via
// <SetStickyProduct/>. Fora da rota de produto o valor é undefined (a barra
// cai no prefill da superfície pelo pathname).
"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

interface Ctx {
    product?: string;
    setProduct: (name?: string) => void;
}

const StickyProductContext = createContext<Ctx>({ setProduct: () => {} });

export function StickyProductProvider({ children }: { children: ReactNode }) {
    const [product, setProductState] = useState<string | undefined>(undefined);
    const setProduct = useCallback((name?: string) => setProductState(name), []);
    return (
        <StickyProductContext.Provider value={{ product, setProduct }}>
            {children}
        </StickyProductContext.Provider>
    );
}

export function useStickyProduct(): Ctx {
    return useContext(StickyProductContext);
}

/** Renderizado pela página de produto: registra o nome e limpa ao sair. */
export function SetStickyProduct({ name }: { name: string }) {
    const { setProduct } = useStickyProduct();
    useEffect(() => {
        setProduct(name);
        return () => setProduct(undefined);
    }, [name, setProduct]);
    return null;
}
