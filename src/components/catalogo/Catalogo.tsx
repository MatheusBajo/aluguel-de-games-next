/* Server Component: gera HTML durante o build */
import CatalogList from '@/app/catalogo/CatalogList.server'

export default async function Catalogo() {
    return (
        <main className="mx-auto max-w-screen-xl px-4 py-8">
            <h1 className="mb-6 text-3xl font-bold">Catálogo</h1>
            <CatalogList />
        </main>
    );
}
