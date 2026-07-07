import type { StructureResolver } from "sanity/structure";
import { TagIcon, BoltIcon, CogIcon } from "@sanity/icons";

/**
 * Menu lateral do Studio — em português, organizado como um painel comum.
 */
export const structure: StructureResolver = (S) =>
    S.list()
        .title("Painel Aluguel de Games")
        .items([
            S.listItem()
                .title("Produtos")
                .icon(BoltIcon)
                .child(
                    S.documentTypeList("produto")
                        .title("Todos os produtos")
                        .defaultOrdering([{ field: "ordem", direction: "asc" }])
                ),
            S.listItem()
                .title("Categorias")
                .icon(TagIcon)
                .child(
                    S.documentTypeList("categoria")
                        .title("Categorias")
                        .defaultOrdering([{ field: "ordem", direction: "asc" }])
                ),
            S.divider(),
            S.listItem()
                .title("Configurações do site")
                .icon(CogIcon)
                .child(
                    S.document()
                        .schemaType("siteConfig")
                        .documentId("siteConfig")
                        .title("Configurações gerais")
                ),
        ]);
