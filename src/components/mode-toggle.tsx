"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";   // ícones leves e tree-shakable
import { Button } from "@/components/ui/button";

export function ModeToggle() {
    const { theme, resolvedTheme, setTheme } = useTheme();

    // evita mismatch entre SSR e client
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    const isDark =
        theme === "dark" ||
        (theme === "system" && resolvedTheme === "dark");

    return (
        <Button
            variant="ghost"
            size="icon"
            aria-label="Alternar tema"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative overflow-hidden rounded-full"
        >
            {/* Solta o Sol quando claro */}
            <Sun
                className={`h-4 w-4 transition-transform duration-300 ${
                    isDark ? "-rotate-90 scale-0" : "rotate-0 scale-100"
                }`}
            />
            {/* Luna vem por cima quando escuro */}
            <Moon
                className={`absolute h-4 w-4 transition-transform duration-300 ${
                    isDark ? "rotate-0 scale-100" : "rotate-90 scale-0"
                }`}
            />
        </Button>
    );
}
