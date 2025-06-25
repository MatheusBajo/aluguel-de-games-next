/* src/components/theme-provider.tsx */
"use client";

import { ReactNode } from "react";
import {
    ThemeProvider as NextThemesProvider,
    useTheme as useNextTheme,
    ThemeProviderProps,
} from "next-themes";

/** Envolve a aplicação inteira */
export function ThemeProvider({
                                  children,
                                  ...props
                              }: ThemeProviderProps & { children: ReactNode }) {
    /* props: { defaultTheme?: "light" | "dark" | "system", storageKey?: string } */
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

/** Reexporta o hook para ser usado em qualquer lugar */
export const useTheme = useNextTheme;
