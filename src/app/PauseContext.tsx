// PauseContext.tsx
import { createContext, useContext } from "react"

type PauseCtx = { modalOpen: boolean; setModalOpen: (v: boolean) => void }
export const PauseContext = createContext<PauseCtx | null>(null)
export const usePause = () => {
    const ctx = useContext(PauseContext)
    if (!ctx) throw new Error("usePause sem provider")
    return ctx
}
