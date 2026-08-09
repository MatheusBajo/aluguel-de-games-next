'use client'

import dynamic from 'next/dynamic'

const StartCarousel = dynamic(() => import('@/components/StartCarousel'), {
    ssr: false,
})
const Main = dynamic(() => import('@/components/Main'), { ssr: false })

interface HomeShellProps {
    totalEquipamentos: number
    totalCategorias: number
}

export default function HomeShell({ totalEquipamentos, totalCategorias }: HomeShellProps) {

    return (
        <>
            <StartCarousel />
            <Main
                totalEquipamentos={totalEquipamentos}
                totalCategorias={totalCategorias}
            />
        </>
    )
}
