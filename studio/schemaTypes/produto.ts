import { defineType, defineField, defineArrayMember } from "sanity";
import { BoltIcon } from "@sanity/icons";

export const produto = defineType({
    name: "produto",
    title: "Produto",
    type: "document",
    icon: BoltIcon,
    fields: [
        defineField({
            name: "titulo",
            title: "Nome do produto",
            description: "Ex: Fliperama 11.000, Videokê Matrix 30.000",
            type: "string",
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "slug",
            title: "URL (slug)",
            description: "Gerado automaticamente. Ex: fliperama-11000",
            type: "slug",
            options: { source: "titulo", maxLength: 96 },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "categoria",
            title: "Categoria",
            type: "reference",
            to: [{ type: "categoria" }],
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "descricao",
            title: "Descrição",
            description: "Suporta markdown (**negrito**, listas, etc).",
            type: "text",
            rows: 6,
        }),
        defineField({
            name: "imagens",
            title: "Fotos do produto",
            description: "Arraste para reordenar. A primeira foto é a capa.",
            type: "array",
            of: [
                defineArrayMember({
                    type: "image",
                    options: { hotspot: true },
                    fields: [
                        defineField({
                            name: "alt",
                            title: "Texto alternativo",
                            description: "Descrição da imagem (SEO + acessibilidade)",
                            type: "string",
                        }),
                    ],
                }),
            ],
            options: { layout: "grid" },
        }),
        defineField({
            name: "ordem",
            title: "Ordem dentro da categoria",
            type: "number",
            initialValue: 100,
        }),
        defineField({
            name: "locacoes",
            title: "Número de locações",
            description: 'Aparece no card como "150+ locações".',
            type: "number",
            validation: (rule) => rule.min(0),
        }),
        defineField({
            name: "destaque",
            title: "Produto em destaque?",
            description: "Se marcado, aparece na lista 'Top 10 mais alugados' da home",
            type: "boolean",
            initialValue: false,
        }),
        defineField({
            name: "rankTop10",
            title: "Posição no Top 10 (1-10)",
            description: "Se estiver em destaque, qual posição? 1 = mais alugado",
            type: "number",
            validation: (rule) => rule.min(1).max(10),
            hidden: ({ parent }) => !parent?.destaque,
        }),
    ],
    preview: {
        select: { title: "titulo", subtitle: "categoria.nome", media: "imagens.0" },
    },
    orderings: [
        { title: "Ordem manual", name: "ordemAsc", by: [{ field: "ordem", direction: "asc" }] },
        { title: "Mais locações", name: "locacoesDesc", by: [{ field: "locacoes", direction: "desc" }] },
        { title: "Nome A-Z", name: "tituloAsc", by: [{ field: "titulo", direction: "asc" }] },
    ],
});
