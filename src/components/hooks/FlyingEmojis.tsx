/* src/components/hooks/FlyingEmojis.tsx */
"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface FlyingEmojisProps {
    className?: string
    maxDistancePercent?: number
    offsetX?: number | string   // aceita “20”, “2rem”, etc.
    offsetY?: number | string
}


const EMOJIS = ["❤️", "🔥", "🤩", "🎉", "👏"]

export default function FlyingEmojis({
                                         className = "",
                                         maxDistancePercent = 0.8,
                                         offsetX = 0,
                                         offsetY = 0,
                                     }: FlyingEmojisProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleRemoveFlyingEmoji = useCallback((node: Node) => {
        if (!overlayRef.current) return;
        overlayRef.current.removeChild(node);
    }, []);

    const handleDisplayFlyingEmoji = useCallback(() => {
        if (!overlayRef.current) return;

        const randomEmojiIndex = Math.floor(Math.random() * EMOJIS.length);
        const emoji = EMOJIS[randomEmojiIndex];
        const containerHeight = overlayRef.current.getBoundingClientRect().height;
        const minDistance = 50;
        const maxDistance = containerHeight * maxDistancePercent; // usa a prop aqui
        const randomDistance =
            Math.floor(Math.random() * (maxDistance - minDistance)) + minDistance;

        const node = document.createElement('div');
        node.appendChild(document.createTextNode(emoji));
        node.className = 'emoji';
        node.style.setProperty('--fly-distance', `-${randomDistance}px`);

        overlayRef.current.appendChild(node);

        node.addEventListener('animationend', (e) => {
            handleRemoveFlyingEmoji(e.target as Node);
        });
    }, [maxDistancePercent, handleRemoveFlyingEmoji]);

    const startEmojiTrigger = useCallback(() => {
        const triggerEmoji = () => {
            if (document.visibilityState === 'visible') {
                handleDisplayFlyingEmoji();
            }
            const maxDelay = 1400;
            const minDelay = 400;
            const nextDelay = Math.floor(Math.random() * (maxDelay - minDelay)) + minDelay;
            timeoutIdRef.current = setTimeout(triggerEmoji, nextDelay);
        };
        triggerEmoji();
    }, [handleDisplayFlyingEmoji]);

    const stopEmojiTrigger = useCallback(() => {
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
            timeoutIdRef.current = null;
        }
    }, []);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                startEmojiTrigger();
            } else {
                stopEmojiTrigger();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        if (document.visibilityState === 'visible') {
            startEmojiTrigger();
        }

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            stopEmojiTrigger();
        };
    }, [startEmojiTrigger, stopEmojiTrigger]);

    useEffect(() => {
        return () => {
            if (overlayRef.current) {
                overlayRef.current.childNodes.forEach((n) => {
                    n.removeEventListener('animationend', handleRemoveFlyingEmoji);
                });
            }
        };
    }, [handleRemoveFlyingEmoji]);

    return (
        <div
            ref={overlayRef}
            className={cn("flying-emojis", className)}
            style={
                {
                    "--off-x": typeof offsetX === "number" ? `${offsetX}px` : offsetX,
                    "--off-y": typeof offsetY === "number" ? `${offsetY}px` : offsetY,
                } as React.CSSProperties
            }
        >
            <style>{`
        .flying-emojis {
          position: absolute;
          inset: 0;
          pointer-events: none;
          user-select: none;
          z-index: 99;
        }
        .flying-emojis .emoji {
          position: absolute;
          right:  var(--off-x, 0);
          bottom: var(--off-y, 0);
          line-height: 1;
          animation: flyUp 3s forwards;
        }
        @keyframes flyUp {
          from { transform: translateY(0);   opacity: 1; }
          to   { transform: translateY(var(--fly-distance)); opacity: 0; }
        }
      `}</style>
        </div>
    );
};