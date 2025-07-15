import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
            "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
            "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
            "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
            "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
            "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent",
        transparent:
            "hover:text-accent-foreground",
        link:
            "text-primary underline-offset-4 hover:underline",
        catalog: "shimmer transition duration-400 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/25 hover:shadow-xl hover:scale-[1.05] animate-gradient-x",        cta:
            "shimmer transition duration-400 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-green-500 hover:to-green-600 text-white shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-green-500/50 hover:scale-[1.05]",
        ctaZap:
            "shimmer group relative overflow-hidden transition-all duration-400 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white shadow-lg shadow-green-600/30 hover:shadow-xl hover:shadow-green-600/50 hover:scale-[1.05] border-0",

        ctaSecondary:
            "shimmer-green group relative overflow-hidden transition-all duration-400 border-2 border-green-600/50 bg-gradient-to-r from-green-600/10 to-green-700/10 hover:from-green-600/20 hover:to-green-700/20 text-green-600 dark:text-green-400 shadow-lg shadow-green-600/10 hover:shadow-xl hover:shadow-green-600/20 hover:scale-[1.05] hover:border-green-500",

        ctaOutline:
          "shimmer group relative overflow-hidden transition-all duration-400 border-2 border-blue-600 bg-transparent hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-purple-600/10 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-600/10 hover:shadow-xl hover:shadow-purple-600/20 hover:scale-[1.05] hover:border-purple-600",
        },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
