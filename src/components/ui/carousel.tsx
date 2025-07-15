"use client"

import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

const Carousel = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
    (
        {
          orientation = "horizontal",
          opts,
          setApi,
          plugins,
          className,
          children,
          ...props
        },
        ref
    ) => {
      const [carouselRef, api] = useEmblaCarousel(
          {
            ...opts,
            axis: orientation === "horizontal" ? "x" : "y",
          },
          plugins
      )
      const [canScrollPrev, setCanScrollPrev] = React.useState(false)
      const [canScrollNext, setCanScrollNext] = React.useState(false)

      const onSelect = React.useCallback((api: CarouselApi) => {
        if (!api) {
          return
        }

        setCanScrollPrev(api.canScrollPrev())
        setCanScrollNext(api.canScrollNext())
      }, [])

      const scrollPrev = React.useCallback(() => {
        api?.scrollPrev()
      }, [api])

      const scrollNext = React.useCallback(() => {
        api?.scrollNext()
      }, [api])

      const handleKeyDown = React.useCallback(
          (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault()
              scrollPrev()
            } else if (event.key === "ArrowRight") {
              event.preventDefault()
              scrollNext()
            }
          },
          [scrollPrev, scrollNext]
      )

      React.useEffect(() => {
        if (!api || !setApi) {
          return
        }

        setApi(api)
      }, [api, setApi])

      React.useEffect(() => {
        if (!api) {
          return
        }

        onSelect(api)
        api.on("reInit", onSelect)
        api.on("select", onSelect)

        return () => {
          api?.off("select", onSelect)
        }
      }, [api, onSelect])

      return (
          <CarouselContext.Provider
              value={{
                carouselRef,
                api: api,
                opts,
                orientation:
                    orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
                scrollPrev,
                scrollNext,
                canScrollPrev,
                canScrollNext,
              }}
          >
            <div
                ref={ref}
                onKeyDownCapture={handleKeyDown}
                className={cn("relative", className)}
                role="region"
                aria-roledescription="carousel"
                {...props}
            >
              {children}
            </div>
          </CarouselContext.Provider>
      )
    }
)
Carousel.displayName = "Carousel"

// carousel.tsx
const CarouselContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef } = useCarousel();
  return (
      <div ref={carouselRef} className="overflow-hidden h-full w-full">
        <div
            ref={ref}
            className={cn("flex h-full w-full gap-x-10", className)}
            {...props}
        />
      </div>
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        className={cn("shrink-0 grow-0 basis-full", className)}
        {...props}
    />
));
CarouselItem.displayName = "CarouselItem";


const CarouselPrevious = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<typeof Button>
>(({ className, variant = "transparent", size = "icon", ...props }, ref) => {
  const { scrollPrev, canScrollPrev } = useCarousel()

  return (
      <Button
          ref={ref}
          variant={variant}
          size={size}
          // As classes abaixo fazem com que o botão ocupe 100% da altura do container,
          // fique posicionado na borda esquerda e ocupe 20% da largura (1/5)
          className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 z-10 w-1/5 h-2/3 flex items-center justify-center p-0 m-0 cursor-pointer",
              className
          )}
          disabled={!canScrollPrev}
          onClick={scrollPrev}
          {...props}
      >
        <ArrowLeft className="pointer-events-none text-white drop-shadow-primary xl:!size-8 !size-5" />
        <span className="sr-only">Previous slide</span>
      </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<typeof Button>
>(({ className, variant = "transparent", size = "icon", ...props }, ref) => {
  const { scrollNext, canScrollNext } = useCarousel()

  return (
      <Button
          ref={ref}
          variant={variant}
          size={size}
          // Mesma lógica para o botão à direita: ocupa 100% da altura, fica na borda direita e usa 20% da largura
          className={cn(
              "absolute top-1/2 -translate-y-1/2 right-0 z-10 w-1/5 h-2/3 my-auto flex items-center justify-center p-0 m-0 cursor-pointer",
              className
          )}
          disabled={!canScrollNext}
          onClick={scrollNext}
          {...props}
      >
        <ArrowRight className="pointer-events-none text-white drop-shadow-primary xl:!size-8 !size-5" />
        <span className="sr-only">Next slide</span>
      </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
