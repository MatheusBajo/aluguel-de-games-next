import CatalogPreview from '@/components/catalogo/CatalogPreview'
import HomeShell from '@/components/HomeShell'
import CatalogList from './catalogo/CatalogList.server'

export default function Home() {
    return (
        <div className="flex flex-col items-center gap-10">
            <HomeShell/> {/* parte interativa no cliente */}
            <h1 className="text-4xl font-bold">Nosso Catálogo</h1>
            <CatalogList order={['VR', 'Videokês',  'Máquinas', 'Fliperamas', 'Air Games']} limitPerCat={6}/>
        </div>
    )
}
