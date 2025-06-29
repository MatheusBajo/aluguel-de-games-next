// src/app/catalogo/page.tsx
// ✅ Roda no servidor - Ótimo para SEO
import {getCategorias} from '@/services/produtos'

export default async function CatalogoPage() {
    const categorias = await getCategorias() // Pode fazer fetch direto!

    return (
        <div>
            {/* HTML já vem pronto do servidor */}
        </div>
    )
}