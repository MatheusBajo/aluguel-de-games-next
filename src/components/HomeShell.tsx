'use client'

import dynamic from 'next/dynamic'

const StartCarousel = dynamic(() => import('@/components/StartCarouselClaude'), {
    ssr: false,
})
const Main = dynamic(() => import('@/components/Main'), { ssr: false })

export default function HomeShell() {
    return (
        <>
            <StartCarousel />
            <Main />
        </>
    )
}
