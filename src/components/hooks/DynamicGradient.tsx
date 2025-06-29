/* src/components/hooks/DynamicGradient.tsx */
"use client"

import { useEffect, useState } from "react"


type GradType = "radial" | "linear" | "conic"

interface Props {
    imageUrl: string
    opacity?: number
    blur?: string
    typeOfGradient?: GradType
    className?: string
    spinOnHover?: boolean
    invertColors?: boolean   // novo
}

export function DynamicGradient({
                                    imageUrl,
                                    opacity = 1,
                                    blur = "10px",
                                    typeOfGradient = "radial",
                                    className = "",
                                    spinOnHover = false,
                                    invertColors = false,
                                }: Props) {

    const [colors, setColors] = useState<string[] | null>(null)

    useEffect(() => {
        let cancel = false

        ;(async () => {
            try {
                const ColorThiefClass = (await import("colorthief")).default
                const colorThief = new ColorThiefClass()

                const img = new Image()
                img.crossOrigin = "anonymous"
                img.src = imageUrl.startsWith("http")
                    ? imageUrl
                    : `${window.location.origin}${imageUrl}`

                img.onload = () => {
                    if (cancel) return
                    try {
                        const palette = colorThief.getPalette(img, 5)
                        const toHex = (n: number) => n.toString(16).padStart(2, "0")
                        setColors(
                            palette.map(([r, g, b]) => `#${toHex(r)}${toHex(g)}${toHex(b)}`)
                        )
                    } catch {
                        setColors(null)
                    }
                }

                img.onerror = () => setColors(null)
            } catch {
                setColors(null)
            }
        })()

        return () => {
            cancel = true
        }
    }, [imageUrl])

    const stops =
        colors && colors.length
            ? colors
                .map((c, i) => `${c} ${(i / (colors.length - 1)) * 100}%`)
                .join(", ")
            : "rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.9) 100%"

    const gradient =
        typeOfGradient === "conic"
            ? `conic-gradient(from var(--g-angle) at 50% 50%, ${stops})`
            : typeOfGradient === "radial"
                ? `radial-gradient(circle at 50% 100%, ${stops})`
                : `linear-gradient(135deg, ${stops})`;

    return (
        <div
            className={className}
            style={{
                position: "absolute",
                inset: 0,
                zIndex: -3,
                pointerEvents: "none",
            }}
        >
    <span
        className="group-hover:[animation:gradient-spin_6s_linear_infinite]"
        style={{
            position: "absolute",
            inset: 0,
            opacity,
            filter: `blur(${blur})`,
            background: gradient,
            /* garante ponto inicial */
            ["--g-angle" as any]: "0deg",
        }}
    />
        </div>
    );
}