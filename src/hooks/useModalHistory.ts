"use client";

import { useLayoutEffect, useEffect, useRef } from "react";

export function useModalHistory(isOpen: boolean, setOpen: (o: boolean) => void) {
    /* 💧 1. Limpeza na montagem */
    useEffect(() => {
        if (history.state?.modal === true) {
            // substitui a entrada sem mudar a URL nem o índice
            window.history.replaceState(null, "");
            console.log("[modal] limpou fantasma órfã na montagem");
        }
    }, []);
    const entryAdded   = useRef(false);
    const listenerRef  = useRef<((e: PopStateEvent) => void) | undefined>(undefined);

    /* ------------------------------------------------------------------
     * Só roda quando o modal está ABERTO
     * ------------------------------------------------------------------ */
    useLayoutEffect(() => {
        if (!isOpen) return;

        if (!entryAdded.current && history.state?.modal !== true) {
            window.history.pushState({ modal: true }, "");
            entryAdded.current = true;
        }


        /* 2 — Instala (ou reinstala) o listener */
        const onPop = () => {
            console.log("[modal] >>> popstate EVENT");   // dispara?
            entryAdded.current = false;
            setOpen(false);                              // fecha modal
        };
        window.addEventListener("popstate", onPop);
        listenerRef.current = onPop;
        console.log("[modal] listener ON");

        /* 3 — Cleanup quando FECHAR ou desmontar */
        return () => {
            if (listenerRef.current) {
                window.removeEventListener("popstate", listenerRef.current);
                listenerRef.current = undefined;
            }
        };
    }, [isOpen, setOpen]);

    /* ------------------------------------------------------------------
     * Se fechar pelo ✕ / overlay, remove a entrada fantasma
     * ------------------------------------------------------------------ */
    useEffect(() => {
        if (isOpen || !entryAdded.current) return;

        window.history.back();                         // descarta entrada
        entryAdded.current = false;
    }, [isOpen]);
}
