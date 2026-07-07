// src/components/catalogo/ProductDescription.tsx
// Descrição do produto (markdown do metadata do dono) — server-rendered.
import ReactMarkdown from "react-markdown";

const squash = (s: string) => s.replace(/[*_#•\s]/g, "").toLowerCase();

export function ProductDescription({ descricao, titulo }: { descricao?: string; titulo?: string }) {
    const text = descricao?.trim();
    if (!text) return null;
    // Se a descrição é só o próprio título (dado ainda não preenchido), omite a seção.
    if (titulo && squash(text) === squash(titulo)) return null;

    return (
        <section>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight mb-4">
                Sobre o equipamento
            </h2>
            <div className="prose prose-invert max-w-none prose-p:my-2 prose-li:my-0.5 prose-headings:font-display">
                <ReactMarkdown>{text}</ReactMarkdown>
            </div>
        </section>
    );
}

export default ProductDescription;
