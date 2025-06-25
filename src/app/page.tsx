"use client";

import dynamic from "next/dynamic";

const StartCarousel = dynamic(() => import("@/components/StartCarousel"), {
    ssr: false,
});
const Main = dynamic(() => import("@/components/Main"), { ssr: false });

export default function Home() {

    return (
        <>
            <StartCarousel />
            <Main />
        </>
    );
}
