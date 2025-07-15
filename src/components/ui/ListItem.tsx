import Link from "next/link";
import {cn} from "@/lib/utils";

interface ListItemProps {
    title: string;
    href: string;
    children?: React.ReactNode;
}

export function ListItem({ title, href, children }: ListItemProps) {
    return (
        <li className="relative">
            <Link
                href={href}
                className={cn(
                    "relative isolate block rounded-xl h-full p-4 space-y-1.5 select-none",
                    "transition-all duration-300 ease-out",

                    // Glassmorphism sem backdrop-blur
                    "bg-gradient-to-br from-white/10 via-white/5 to-transparent",
                    "dark:from-white/5 dark:via-white/[0.02] dark:to-transparent",

                    // Bordas brilhantes
                    "border border-white/20 dark:border-white/10",
                    "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]",

                    // Sombras suaves
                    "shadow-sm shadow-black/5 dark:shadow-black/20",

                    // Estados de hover
                    "hover:bg-gradient-to-br hover:from-primary/20 hover:via-primary/10 hover:to-transparent",
                    "dark:hover:from-primary/15 dark:hover:via-primary/5 dark:hover:to-transparent",
                    "hover:border-primary/30 dark:hover:border-primary/20",
                    "hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary/5",

                    // Animação de sobreposição
                    "hover:scale-105 hover:-translate-y-1",
                    "hover:z-10",

                    // Transições suaves
                    "transform-gpu will-change-transform",

                    // Pseudo-elemento para brilho
                    "before:absolute before:inset-0 before:rounded-xl",
                    "before:bg-gradient-to-t before:from-transparent before:via-white/5 before:to-white/10",
                    "before:opacity-0 before:transition-opacity before:duration-300",
                    "hover:before:opacity-100",

                    // Efeito de luz no hover
                    "after:absolute after:inset-0 after:rounded-xl",
                    "after:bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_50%)]",
                    "after:opacity-0 after:transition-opacity after:duration-300",
                    "hover:after:opacity-100"
                )}
            >
                {/* Conteúdo com z-index para ficar acima dos pseudo-elementos */}
                <div className="relative z-10">
                    <div className="text-sm font-medium leading-none text-foreground/90 hover:text-foreground transition-colors">
                        {title}
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-foreground/60 mt-1.5">
                        {children}
                    </p>
                </div>

                {/* Reflexo sutil no canto */}
                <div className="absolute top-0 right-0 w-20 h-20 opacity-20">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl blur-xl" />
                </div>
            </Link>
        </li>
    );
}