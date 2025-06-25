import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function NavigationMenu({
                          className,
                          children,
                          viewport = true,
                          ...props
                        }: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean
}) {
  return (
      <NavigationMenuPrimitive.Root
          data-slot="navigation-menu"
          data-viewport={viewport}
          className={cn(
              "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
              className
          )}
          {...props}
      >
        {children}
        {viewport && <NavigationMenuViewport />}
      </NavigationMenuPrimitive.Root>
  )
}

function NavigationMenuList({
                              className,
                              ...props
                            }: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
      <NavigationMenuPrimitive.List
          data-slot="navigation-menu-list"
          className={cn(
              "group flex flex-1 list-none items-center justify-center gap-4",
              className
          )}
          {...props}
      />
  )
}

function NavigationMenuItem({
                              className,
                              ...props
                            }: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
      <NavigationMenuPrimitive.Item
          data-slot="navigation-menu-item"
          className={cn("relative", className)}
          {...props}
      />
  )
}

/** Glass button style */
const navigationMenuTriggerStyle = cva(
    "group inline-flex h-10 w-max items-center justify-center rounded-full px-6 py-2 text-sm font-medium transition-all duration-300 focus:outline-none disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
    {
      variants: {
        variant: {
          default:
          // translucido base
              " bg-primary/10 dark:bg-primary/5 border border-primary/20 dark:border-primary/20 shadow-lg shadow-black/10 hover:bg-primary hover:border-primary/40 dark:hover:bg-primary/10 text-foreground/90 hover:text-foreground data-[state=open]:bg-primary/15 data-[state=open]:border-primary/50 transition-all duration-300 ease-out transform-gpu hover:scale-105 hover:rotate-1 hover:shadow-2xl",
          ghost:
              "hover:backdrop-blur-md hover:bg-primary/5 hover:border-primary/20 border border-transparent text-foreground/75 hover:text-foreground",
          outline:
              "backdrop-blur-md bg-transparent border-2 border-primary/30 dark:border-primary/15 hover:bg-primary/5 hover:border-primary/45 text-foreground focus:bg-primary/10 focus:border-primary/50"
        }
      },
      defaultVariants: {
        variant: "default"
      }
    }
)

function NavigationMenuTrigger({
                                 className,
                                 children,
                                 ...props
                               }: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
      <NavigationMenuPrimitive.Trigger
          data-slot="navigation-menu-trigger"
          className={cn(navigationMenuTriggerStyle(), "group", className)}
          {...props}
      >
        {children}
        <ChevronDownIcon
            className="relative top-px ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
            aria-hidden="true"
        />
      </NavigationMenuPrimitive.Trigger>
  )
}

function NavigationMenuContent({
                                 className,
                                 ...props
                               }: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
      <NavigationMenuPrimitive.Content
          data-slot="navigation-menu-content"
          className={cn(
              // animações
              "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 top-0 left-0 w-full p-2 pr-2.5 md:absolute md:w-auto",

              " shadow-lg shadow-black/10 rounded-xl",
              // remove default outline nos links internos
              "**:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",
              className
          )}
          {...props}
      />
  )
}

function NavigationMenuViewport({
                                  className,
                                  ...props
                                }: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
      <div className="absolute top-full left-0 isolate z-50 flex justify-center">
        <NavigationMenuPrimitive.Viewport
            data-slot="navigation-menu-viewport"
            className={cn(
                "origin-top-center shadow-lg shadow-black/10 relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-xl md:w-[var(--radix-navigation-menu-viewport-width)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90",
                "backdrop-blur-lg bg-popover/60 border border-primary/20 transition-all",
                className
            )}
            {...props}

        />
      </div>
  )
}

function NavigationMenuLink({
                              className,
                              ...props
                            }: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
      <NavigationMenuPrimitive.Link
          data-slot="navigation-menu-link"
          className={cn("focus:outline-none focus:ring-0", className)}
          {...props}
      />
  )
}

function NavigationMenuIndicator({
                                   className,
                                   ...props
                                 }: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
      <NavigationMenuPrimitive.Indicator
          data-slot="navigation-menu-indicator"
          className={cn(
              "data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
              className
          )}
          {...props}
      >
        {/* diamond indicator glass */}
        <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm primary/10 dark:primary/5 backdrop-blur-lg border border-white/25 shadow-md shadow-black/10" />
      </NavigationMenuPrimitive.Indicator>
  )
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle
}
// Compare this snippet from src/components/ui/carousel.tsx: