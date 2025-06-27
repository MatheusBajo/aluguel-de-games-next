import CatalogPreview from '@/components/catalogo/CatalogPreview'
import HomeShell from '@/components/HomeShell'
import CatalogList from './catalogo/CatalogList.server'

export default function Home() {
    return (
        <>
            <HomeShell/> {/* parte interativa no cliente */}
            <CatalogList order={['Máquinas','Fliperamas', 'Air Games']} limitPerCat={6} />
            <a
                href="https://wa.me/+551142377766"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-4 right-4 z-50 drop-shadow-primary lg:m-6 m-0 p-0 select-none"
            >
                <img
                    src="/WhatsApp-logo-42377766.png"
                    alt="WhatsApp"
                    className="lg:size-25 size-16 object-contain"
                />
            </a>
        </>
    )
}
