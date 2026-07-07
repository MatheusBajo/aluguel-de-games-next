import { defineType, defineField } from "sanity";
import { CogIcon } from "@sanity/icons";

export const siteConfig = defineType({
    name: "siteConfig",
    title: "Configurações do site",
    type: "document",
    icon: CogIcon,
    fields: [
        defineField({
            name: "titulo",
            title: "Configuração",
            type: "string",
            initialValue: "Configurações gerais",
            readOnly: true,
        }),
        defineField({ name: "whatsapp", title: "WhatsApp", description: "Ex: 11965261000", type: "string" }),
        defineField({ name: "whatsappDisplay", title: "WhatsApp formatado", description: "Ex: (11) 96526-1000", type: "string" }),
        defineField({ name: "email", title: "E-mail de contato", type: "string" }),
        defineField({ name: "heroTitulo", title: "Título da home", type: "string" }),
        defineField({ name: "heroSubtitulo", title: "Subtítulo da home", type: "text", rows: 3 }),
    ],
    preview: { select: { title: "titulo" } },
});
