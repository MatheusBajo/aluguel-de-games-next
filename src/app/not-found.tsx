import Link from 'next/link';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { WHATSAPP_CONFIG } from '@/config/whatsapp.config';

export const metadata: Metadata = {
    title: 'Página não encontrada',
    robots: { index: false, follow: true },
};

const shortcuts = [
    { href: '/catalogo/jogos-eletronicos/fliperamas/', label: 'Fliperamas', emoji: '🕹️' },
    { href: '/catalogo/videokes/', label: 'Videokês', emoji: '🎤' },
    { href: '/catalogo/realidade-virtual/', label: 'Realidade Virtual', emoji: '🥽' },
    { href: '/catalogo/jogos-eletronicos/consoles/', label: 'Consoles', emoji: '🎮' },
    { href: '/catalogo/jogos-eletronicos/pinballs/', label: 'Pinballs', emoji: '⚡' },
    { href: '/catalogo/', label: 'Ver tudo', emoji: '📦' },
];

export default function NotFound() {
    return (
        <>
            <style>{`
                /* ---------- keyframes ---------- */
                @keyframes nf-fade-up {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes nf-float {
                    0%, 100% { transform: translateY(0); }
                    50%      { transform: translateY(-8px); }
                }
                @keyframes nf-flicker {
                    0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
                    20%, 24%, 55% { opacity: 0.4; }
                }
                @keyframes nf-blink {
                    0%, 100% { opacity: 1; }
                    50%      { opacity: 0.3; }
                }
                @keyframes nf-glitch-1 {
                    0%, 100% { transform: translate(0); }
                    20%      { transform: translate(-2px, 2px); }
                    40%      { transform: translate(-2px, -2px); }
                    60%      { transform: translate(2px, 2px); }
                    80%      { transform: translate(2px, -2px); }
                }
                @keyframes nf-glitch-2 {
                    0%, 100% { clip-path: inset(0 0 0 0); }
                    25%      { clip-path: inset(10% 0 85% 0); }
                    50%      { clip-path: inset(85% 0 5% 0); }
                    75%      { clip-path: inset(45% 0 45% 0); }
                }
                @keyframes nf-stamp {
                    0%   { opacity: 0; transform: translate(-50%, -50%) rotate(-8deg) scale(3); }
                    60%  { opacity: 0.08; transform: translate(-50%, -50%) rotate(-12deg) scale(0.95); }
                    100% { opacity: 0.08; transform: translate(-50%, -50%) rotate(-12deg) scale(1); }
                }
                @keyframes nf-scanlines {
                    0%   { background-position: 0 0; }
                    100% { background-position: 0 100%; }
                }
                @keyframes nf-blob {
                    0%, 100% { transform: translate(-50%, 0) scale(1); }
                    33%      { transform: translate(-50%, 20px) scale(1.1); }
                    66%      { transform: translate(-50%, -20px) scale(0.95); }
                }
                @keyframes nf-blob-2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50%      { transform: translate(30px, -20px) scale(1.15); }
                }
                /* HP bar: começa cheia e vai caindo em 3 hits */
                @keyframes nf-hp-drain {
                    0%, 18%   { width: 100%; }
                    22%, 43%  { width: 66%; }
                    47%, 68%  { width: 33%; }
                    72%, 100% { width: 0%; }
                }
                @keyframes nf-hp-shake {
                    0%, 19%, 23%, 44%, 48%, 69%, 73%, 100% { transform: translateX(0); }
                    20%, 45%, 70% { transform: translateX(-4px); }
                    21%, 46%, 71% { transform: translateX(4px); }
                }
                @keyframes nf-hp-flash {
                    0%, 19%, 23%, 44%, 48%, 69%, 73%, 100% {
                        box-shadow: none;
                        border-color: rgba(239, 68, 68, 0.5);
                    }
                    20%, 21%, 45%, 46%, 70%, 71% {
                        box-shadow: 0 0 20px rgba(239, 68, 68, 0.9), inset 0 0 10px rgba(239, 68, 68, 0.5);
                        border-color: rgba(239, 68, 68, 1);
                    }
                }
                @keyframes nf-hp-pulse-empty {
                    0%, 100% { opacity: 1; }
                    50%      { opacity: 0.4; }
                }

                /* ---------- classes ---------- */
                .nf-fade-up { opacity: 0; animation: nf-fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .nf-float   { animation: nf-float 4s ease-in-out infinite; }
                .nf-flicker { animation: nf-flicker 6s infinite; }
                .nf-blink   { animation: nf-blink 1.2s ease-in-out infinite; }
                .nf-blob    { animation: nf-blob 12s ease-in-out infinite; }
                .nf-blob-2  { animation: nf-blob-2 14s ease-in-out infinite; }
                .nf-hp-fill { width: 100%; animation: nf-hp-drain 3.5s cubic-bezier(0.4, 0, 0.2, 1) 1400ms forwards; }
                .nf-hp-bar  { animation: nf-hp-shake 3.5s ease-in-out 1400ms forwards, nf-hp-flash 3.5s ease-in-out 1400ms forwards; }
                .nf-hp-empty { animation: nf-hp-pulse-empty 1.2s ease-in-out 5s infinite; }

                /* 404 em pixel-arcade com glitch */
                .nf-404-wrap {
                    position: relative;
                    display: inline-block;
                }
                .nf-404 {
                    display: block;
                    font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
                    font-weight: 900;
                    letter-spacing: -0.04em;
                    color: #ffffff;
                    text-shadow:
                        0 0 20px rgba(168, 85, 247, 0.8),
                        0 0 40px rgba(236, 72, 153, 0.5),
                        4px 4px 0 #a855f7,
                        8px 8px 0 #ec4899;
                }
                .nf-404-glitch {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    display: block;
                    font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
                    font-weight: 900;
                    letter-spacing: -0.04em;
                    pointer-events: none;
                    opacity: 0.7;
                }
                .nf-404-glitch-1 {
                    color: #22d3ee;
                    mix-blend-mode: screen;
                    animation: nf-glitch-1 3s infinite, nf-glitch-2 3s infinite;
                }
                .nf-404-glitch-2 {
                    color: #ec4899;
                    mix-blend-mode: screen;
                    animation: nf-glitch-1 2.5s infinite reverse, nf-glitch-2 2.5s infinite reverse;
                }

                /* Carimbo/watermark "GAME OVER" estilo arcade */
                .nf-stamp {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    pointer-events: none;
                    font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
                    font-weight: 900;
                    font-size: clamp(6rem, 18vw, 14rem);
                    letter-spacing: -0.03em;
                    white-space: nowrap;
                    color: transparent;
                    -webkit-text-stroke: 3px rgba(239, 68, 68, 0.9);
                    animation: nf-stamp 1.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards;
                    opacity: 0;
                }

                /* Scanlines estilo CRT */
                .nf-crt {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    background: repeating-linear-gradient(
                        to bottom,
                        transparent 0,
                        transparent 3px,
                        rgba(0, 0, 0, 0.25) 3px,
                        rgba(0, 0, 0, 0.25) 4px
                    );
                    mix-blend-mode: multiply;
                    animation: nf-scanlines 8s linear infinite;
                }

                /* Grid de perspectiva estilo Tron */
                .nf-grid {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    background-image:
                        linear-gradient(rgba(168, 85, 247, 0.15) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(168, 85, 247, 0.15) 1px, transparent 1px);
                    background-size: 40px 40px;
                    mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
                    -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
                }

                @media (prefers-reduced-motion: reduce) {
                    .nf-fade-up, .nf-float, .nf-flicker, .nf-blink, .nf-blob, .nf-blob-2,
                    .nf-stamp, .nf-crt, .nf-404-glitch, .nf-hp-fill, .nf-hp-bar, .nf-hp-empty {
                        animation: none !important;
                        opacity: 1 !important;
                    }
                    .nf-stamp { opacity: 0.08 !important; transform: translate(-50%, -50%) rotate(-12deg); }
                    .nf-hp-fill { width: 0% !important; }
                }
            `}</style>

            <main className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4 py-16">
                {/* Grid perspectivo Tron */}
                <div className="nf-grid" />

                {/* Glows animados */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="nf-blob absolute -top-40 left-1/2 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
                    <div className="nf-blob-2 absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
                </div>

                {/* Carimbo gigante "GAME OVER" */}
                <div className="nf-stamp" aria-hidden="true">
                    GAME OVER
                </div>

                {/* Scanlines CRT */}
                <div className="nf-crt" />

                <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
                    {/* Badge topo */}
                    <div
                        className="nf-fade-up mb-6 inline-flex items-center gap-2 rounded-sm border-2 border-red-500/60 bg-red-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.3em] text-red-400"
                        style={{ animationDelay: '0ms' }}
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                        </span>
                        <span className="nf-flicker">System Error</span>
                    </div>

                    {/* 404 arcade — wrappers separados pra não conflitar animações */}
                    <div
                        className="nf-fade-up"
                        style={{ animationDelay: '200ms' }}
                    >
                        <div className="nf-float">
                            <h1
                                aria-label="Erro 404 - Página não encontrada"
                                className="nf-404-wrap select-none text-[7rem] leading-none sm:text-[11rem]"
                            >
                                <span className="nf-404">404</span>
                                <span aria-hidden="true" className="nf-404-glitch nf-404-glitch-1 text-[7rem] leading-none sm:text-[11rem]">404</span>
                                <span aria-hidden="true" className="nf-404-glitch nf-404-glitch-2 text-[7rem] leading-none sm:text-[11rem]">404</span>
                            </h1>
                        </div>
                    </div>

                    {/* HP bar retrô — começa cheia e vai caindo em 3 hits */}
                    <div
                        className="nf-fade-up mx-auto mt-6 flex max-w-sm items-center justify-center gap-3 font-mono text-xs uppercase tracking-widest text-muted-foreground"
                        style={{ animationDelay: '350ms' }}
                    >
                        <span className="text-red-400">HP</span>
                        <div className="flex-1">
                            <div className="nf-hp-bar nf-hp-empty h-3 overflow-hidden rounded-sm border bg-black/60 p-[2px]">
                                <div className="nf-hp-fill h-full rounded-sm bg-gradient-to-r from-red-600 to-red-400" />
                            </div>
                        </div>
                        <span className="tabular-nums text-red-400">0/3</span>
                    </div>

                    {/* Mensagem principal */}
                    <div
                        className="nf-fade-up mt-8 space-y-3"
                        style={{ animationDelay: '500ms' }}
                    >
                        <h2 className="text-2xl font-black uppercase tracking-wide sm:text-3xl">
                            Esse level não existe 🕹️
                        </h2>
                        <p className="mx-auto max-w-lg text-base text-muted-foreground sm:text-lg">
                            O fliperama onde ficava essa página está <strong>desligado</strong>.
                            Que tal inserir outra ficha e continuar a diversão?
                        </p>
                    </div>

                    {/* Press start */}
                    <p
                        className="nf-fade-up nf-blink mt-8 font-mono text-xs font-bold uppercase tracking-[0.4em] text-primary"
                        style={{ animationDelay: '700ms' }}
                    >
                        ▸ Select your game ◂
                    </p>

                    {/* Atalhos — cartuchos */}
                    <div className="mt-4">
                        <div className="mx-auto grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
                            {shortcuts.map((s, i) => (
                                <Link
                                    key={s.href}
                                    href={s.href}
                                    className="nf-fade-up group relative flex items-center gap-2 overflow-hidden rounded-sm border-2 border-border/60 bg-card/60 px-4 py-3 text-sm font-bold uppercase tracking-wide backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-card hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                                    style={{ animationDelay: `${800 + i * 80}ms` }}
                                >
                                    {/* Brilho que passa no hover */}
                                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                                    <span className="relative text-lg transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6">
                                        {s.emoji}
                                    </span>
                                    <span className="relative flex-1 text-left">{s.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* CTAs */}
                    <div
                        className="nf-fade-up mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
                        style={{ animationDelay: '1350ms' }}
                    >
                        <Button
                            asChild
                            size="lg"
                            className="w-full border-2 border-green-400 bg-gradient-to-r from-green-600 to-green-700 font-black uppercase tracking-widest text-white transition-all hover:scale-105 hover:from-green-700 hover:to-green-800 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] sm:w-auto"
                        >
                            <Link href={WHATSAPP_CONFIG.link} target="_blank" rel="noopener noreferrer">
                                <FaWhatsapp className="mr-2 h-5 w-5" />
                                Insert Coin · WhatsApp
                            </Link>
                        </Button>

                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="w-full border-2 font-black uppercase tracking-widest transition-all hover:scale-105 sm:w-auto"
                        >
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" />
                                Restart
                            </Link>
                        </Button>
                    </div>

                    {/* Rodapé */}
                    <div
                        className="nf-fade-up mt-10 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground/70"
                        style={{ animationDelay: '1500ms' }}
                    >
                        © Aluguel de Games · Player 1 · Since 1993
                    </div>
                </div>
            </main>
        </>
    );
}
