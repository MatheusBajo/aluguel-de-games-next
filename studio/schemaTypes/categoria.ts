import { defineType, defineField } from "sanity";
import { TagIcon } from "@sanity/icons";

export const categoria = defineType({
    name: "categoria",
    title: "Categoria",
    type: "document",
    icon: TagIcon,
    fields: [
        defineField({
            name: "nome",
            title: "Nome da categoria",
            description: "Ex: Fliperamas, Videokês, Realidade Virtual",
            type: "string",
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "slug",
            title: "URL (slug)",
            description: "Gerado automaticamente a partir do nome. Ex: fliperamas",
            type: "slug",
            options: { source: "nome", maxLength: 96 },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "emoji",
            title: "Emoji",
            description: "Um emoji que representa a categoria (🕹️, 🎤, 🥽, 🎮, etc.)",
            type: "string",
        }),
        defineField({
            name: "descricao",
            title: "Descrição SEO",
            description: "Parágrafo que aparece na página da categoria. Use keywords relevantes.",
            type: "text",
            rows: 4,
        }),
        defineField({
            name: "tituloSeo",
            title: "Título SEO (H1)",
            description: "Ex: Aluguel de Fliperama para Festas e Eventos em São Paulo",
            type: "string",
        }),
        defineField({
            name: "ordem",
            title: "Ordem de exibição",
            description: "Menor número aparece primeiro",
            type: "number",
            initialValue: 100,
        }),
        defineField({
            name: "parent",
            title: "Categoria pai (opcional)",
            description: "Se for subcategoria, aponte pra categoria pai.",
            type: "reference",
            to: [{ type: "categoria" }],
        }),
    ],
    preview: {
        select: { title: "nome", subtitle: "slug.current", emoji: "emoji" },
        prepare({ title, subtitle, emoji }) {
            return {
                title: emoji ? `${emoji}  ${title}` : title,
                subtitle: subtitle ? `/${subtitle}` : "sem slug",
            };
        },
    },
    orderings: [
        { title: "Ordem manual", name: "ordemAsc", by: [{ field: "ordem", direction: "asc" }] },
        { title: "Nome A-Z", name: "nomeAsc", by: [{ field: "nome", direction: "asc" }] },
    ],
});
