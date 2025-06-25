"use client";

import Link from "next/link";
import {FaWhatsapp} from "react-icons/fa";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {ModeToggle} from "@/components/mode-toggle";
import {DynamicGradient} from "@/components/hooks/DynamicGradient";
import {ListItem} from "@/components/ui/ListItem";
import {Button} from "@/components/ui/button";

export default function Header() {
    return (
        <header
            /* mesmas borda, z-index e largura de antes */
            className="sticky top-0 z-50 w-full isolate border-b border-dashed border-border bg-transparent"
        >
            {/* camada de blur */}
            <span
                className="pointer-events-none absolute inset-0 -z-10
               backdrop-blur-[20px] dark:backdrop-blur-[10px]"/>
            <span
                className="pointer-events-none absolute inset-0 -z-20
           hidden supports-[backdrop-filter]:block
           bg-gradient-to-b
           from-background/80 via-background/60 to-background/50
           dark:from-background/100 dark:via-background/80 dark:to-background/60"/>


            <nav className="flex items-center justify-center gap-2 px-5 mx-auto h-14 w-full max-w-screen-3xl z-[1000]">

                {/* LOGO / Título */}
                <div className="grow flex h-full items-center w-full justify-start text-nowrap">
                    <Link
                        href="/"
                        className="flex w-full h-full items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                        <img
                            className="h-5 dark:invert"
                            src="/carro-logo-aluguel-de-games.png"
                            alt="Logo Aluguel de Games"
                        />
                        <span className="text-lg font-bold uppercase block lg:block md:hidden sm:block select-none">
    Aluguel de Games
  </span>
                    </Link>

                </div>

                {/* NAVIGATION MENU */}
                <div className="grow h-full items-center w-full justify-center hidden md:flex">
                    <NavigationMenu>
                        <NavigationMenuList>
                            {/* 1) Dropdown "Sobre Nós" */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Sobre Nós</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] gap-4">
                                        {/* Cartão grande do lado esquerdo */}
                                        <li className="row-span-3">
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href="/"
                                                    className="relative z-0 text-white flex h-full w-full select-none flex-col justify-end rounded-md bg-cover bg-center p-6 no-underline outline-none focus:shadow-md transition-all duration-300 ease-out transform-gpu hover:scale-105 hover:rotate-1 hover:shadow-2xl overflow-hidden"
                                                >
                                                    {/* Container pai para as camadas de fundo */}
                                                    <div className="absolute inset-0 z-[-2]">
                                                        {/* Gradiente dinâmico com z-index menor */}
                                                        <DynamicGradient
                                                            imageUrl="/maquinadeboxing.jpg"
                                                            // z-0 já basta
                                                            style={{ zIndex: 2 }}
                                                        />

                                                        <picture
                                                            className="absolute inset-0 h-full w-full rounded-md z-[-1]">
                                                            <source
                                                                media="(min-width: 1024px)"
                                                                srcSet="/maquinadeboxing.jpg"
                                                            />
                                                            <img
                                                                src="/equipamentos/fliperamas/Fliperamas.jpg"
                                                                alt="Máquina de Boxing"
                                                                className="absolute inset-0 h-full w-full object-cover rounded-md z-[-1]"
                                                            />
                                                        </picture>
                                                    </div>

                                                    {/* Overlay escuro (pseudo-elemento) */}
                                                    <div
                                                        className="after:absolute after:inset-0 after:rounded-md after:bg-gradient-to-t after:from-black/80 after:to-transparent after:z-0"/>

                                                    <div className="mb-2 mt-4 text-lg font-medium relative">
                                                        Aluguel de Games
                                                    </div>
                                                    <p className="text-sm leading-tight text-white/70 relative">
                                                        Brinquedos e jogos para festas e eventos.
                                                    </p>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                        {/* Links em Lista */}
                                        <ListItem
                                            href="/sobre/historia"
                                            title="Nossa História"
                                        >
                                            Um breve resumo sobre nossa jornada.
                                        </ListItem>
                                        <ListItem
                                            href="/sobre/equipe"
                                            title="Equipe"
                                        >
                                            Veja quem faz tudo acontecer.
                                        </ListItem>
                                        <ListItem
                                            href="/sobre/parceiros"
                                            title="Parceiros e Clientes"
                                        >
                                            Alguns de nossos principais parceiros.
                                        </ListItem>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            {/* 2) Dropdown "Jogos e Brinquedos" */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Jogos & Equipamentos</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                        <ListItem
                                            href="/jogos/fliperamas"
                                            title="Fliperamas"
                                        >
                                            Clássicos, retrô e multijogos para o seu evento.
                                        </ListItem>
                                        <ListItem
                                            href="/jogos/sinuca"
                                            title="Mesas de Sinuca"
                                        >
                                            Bilhar, sinuca e outros jogos de mesa.
                                        </ListItem>
                                        <ListItem
                                            href="/jogos/videokes"
                                            title="Videokês"
                                        >
                                            Karaokê completo para animar a festa.
                                        </ListItem>
                                        <ListItem
                                            href="/jogos/simuladores"
                                            title="Simuladores"
                                        >
                                            Corrida, Realidade Virtual e muito mais.
                                        </ListItem>
                                        <ListItem
                                            href="/jogos/brinquedos"
                                            title="Brinquedos Diversos"
                                        >
                                            Air Game, Basquete, Martelo de Força, etc.
                                        </ListItem>
                                        <ListItem
                                            href="/jogos/arcades"
                                            title="Outros Arcades"
                                        >
                                            Pinball, Guitar Hero, Boxing Machine...
                                        </ListItem>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            {/* 3) Botão/Link "Fazer Orçamento" (fixo) */}
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link
                                        href="/orcamento"
                                        className={`${navigationMenuTriggerStyle()} flex items-center gap-1 group`}
                                    >
                                        Fazer um Orçamento
                                        <span
                                            className="
          inline-block
          transition-transform
          duration-500
          ease-in-out
          group-hover:rotate-[360deg]
        "
                                        >
        👈
      </span>
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>


                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Ações à direita (WhatsApp, Modo Dark/Light) */}
                <div className="grow flex h-full items-center w-full justify-end">
                    <ul className="flex items-center gap-0.5">
                        <li>
                            <a
                                href="https://wa.me/+551142377766"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button variant="ghost" size="icon" className="transition-none rounded-full">
                                    <FaWhatsapp/>
                                </Button>
                            </a>
                        </li>
                        <li>
                            <ModeToggle/>
                        </li>
                    </ul>
                </div>

            </nav>
        </header>
    )
        ;
}
