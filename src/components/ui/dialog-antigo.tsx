"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
//  Radix re‑exports with data‑slot helpers (para funcionar com shadcn/ui)
// ---------------------------------------------------------------------------

const DialogAntigo = (props: React.ComponentProps<typeof DialogPrimitive.Root>) => (
    <DialogPrimitive.Root data-slot="dialog" {...props} />
);

const DialogTrigger = (
    props: React.ComponentProps<typeof DialogPrimitive.Trigger>,
) => <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;

const DialogPortal = (
    props: React.ComponentProps<typeof DialogPrimitive.Portal>,
) => <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;

const DialogClose = (
    props: React.ComponentProps<typeof DialogPrimitive.Close>,
) => <DialogPrimitive.Close data-slot="dialog-close" {...props} />;

// ---------------------------------------------------------------------------
//  Overlay – fundo escurecido (mantido em 80 % p/ compatibilidade visual)
// ---------------------------------------------------------------------------
const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        data-slot="dialog-overlay"
        className={cn(
            "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className,
        )}
        {...props}
    />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

// ---------------------------------------------------------------------------
//  Content – centrado via flex wrapper; sem cor de fundo; limitado a 95 %.
//  (Mantém o visual exato do componente React original.)
// ---------------------------------------------------------------------------
const DialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
}
>(({ className, children, showCloseButton = true, ...props }, ref) => (
    <DialogPortal>
      {/* Overlay vem primeiro para ficar *abaixo* do wrapper flex */}
      <DialogOverlay />

      {/* Wrapper flex para centralizar o conteúdo */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <DialogPrimitive.Content
            ref={ref}
            data-slot="dialog-content"
            className={cn(
                "relative p-0 w-auto h-auto max-w-[95vw] max-h-[95vh] flex items-center justify-center",
                className,
            )}
            {...props}
        >
          {children}

          {showCloseButton && (
              <DialogPrimitive.Close
                  data-slot="dialog-close"
                  className="absolute right-4 top-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ring-offset-background data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </div>
    </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

// ---------------------------------------------------------------------------
//  Head & Foot helpers (sem alterações de estilo)
// ---------------------------------------------------------------------------
const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        data-slot="dialog-header"
        className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
        {...props}
    />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        data-slot="dialog-footer"
        className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
        {...props}
    />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        data-slot="dialog-title"
        className={cn("text-lg font-semibold leading-none tracking-tight", className)}
        {...props}
    />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        data-slot="dialog-description"
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  DialogAntigo,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
