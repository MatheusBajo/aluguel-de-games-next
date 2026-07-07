import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
    api: {
        projectId: "2fhr4hm5",
        dataset: "production",
    },
    /**
     * Host desejado pro Studio na nuvem do Sanity.
     * Resultado: https://alugueldegames.sanity.studio
     */
    studioHost: "alugueldegames",
    autoUpdates: true,
});
