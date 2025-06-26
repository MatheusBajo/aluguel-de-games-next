import dynamic from "next/dynamic";
import CatalogPreview from "@/components/catalogo/CatalogPreview";

const StartCarousel = dynamic(() => import("@/components/StartCarousel"), {
    ssr: false,
});
const Main = dynamic(() => import("@/components/Main"), { ssr: false });

export default function Home() {

    return (
        <>
            <StartCarousel />
            <CatalogPreview limit={6} />
            <Main />
        </>
    );
}
