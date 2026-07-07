/**
 * Painel Aluguel de Games — Sanity Studio
 * Hosted em: https://alugueldegames.sanity.studio (após deploy)
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";

export default defineConfig({
    name: "default",
    title: "Painel Aluguel de Games",

    projectId: "2fhr4hm5",
    dataset: "production",

    plugins: [
        structureTool({ structure }),
        visionTool({ defaultApiVersion: "2026-04-18" }),
    ],

    schema: { types: schemaTypes },
});
