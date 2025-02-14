"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
            "rfs-fixed rfs-inset-0 rfs-z-50 rfs-bg-black/80 rfs- data-[state=open]:rfs-animate-in data-[state=closed]:rfs-animate-out data-[state=closed]:rfs-fade-out-0 data-[state=open]:rfs-fade-in-0",
            className
        )}
        {...props}
    />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { hideCloseButton?: boolean }
>(({ className, children, ...props }, ref) => (
    <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
            ref={ref}
            className={cn(
                "rfs-fixed rfs-left-[50%] rfs-top-[50%] rfs-z-50 rfs-grid rfs-w-full rfs-max-w-lg rfs-translate-x-[-50%] rfs-translate-y-[-50%] rfs-gap-4 rfs-border rfs-bg-background rfs-p-6 rfs-shadow-lg rfs-duration-200 data-[state=open]:rfs-animate-in data-[state=closed]:rfs-animate-out data-[state=closed]:rfs-fade-out-0 data-[state=open]:rfs-fade-in-0 data-[state=closed]:rfs-zoom-out-95 data-[state=open]:rfs-zoom-in-95 data-[state=closed]:rfs-slide-out-to-left-1/2 data-[state=closed]:rfs-slide-out-to-top-[48%] data-[state=open]:rfs-slide-in-from-left-1/2 data-[state=open]:rfs-slide-in-from-top-[48%] sm:rfs-rounded-lg",
                className
            )}
            {...props}
        >
            {children}
            {!props.hideCloseButton && (
                <DialogPrimitive.Close className="rfs-absolute rfs-right-4 rfs-top-4 rfs-rounded-sm rfs-opacity-70 rfs-ring-offset-background rfs-transition-opacity hover:rfs-opacity-100 focus:rfs-outline-none focus:rfs-ring-2 focus:rfs-ring-ring focus:rfs-ring-offset-2 disabled:rfs-pointer-events-none data-[state=open]:rfs-bg-accent data-[state=open]:rfs-text-muted-foreground">
                    <X className="rfs-h-4 rfs-w-4" />
                    <span className="rfs-sr-only">Close</span>
                </DialogPrimitive.Close>
            )}
        </DialogPrimitive.Content>
    </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("rfs-flex rfs-flex-col rfs-space-y-1.5 rfs-text-center sm:rfs-text-left", className)} {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("rfs-flex rfs-flex-col-reverse sm:rfs-flex-row sm:rfs-justify-end sm:rfs-space-x-2", className)} {...props} />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Title>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(
    ({ className, ...props }, ref) => (
        <DialogPrimitive.Title ref={ref} className={cn("rfs-text-lg rfs-font-semibold rfs-leading-none rfs-tracking-tight", className)} {...props} />
    )
)
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description ref={ref} className={cn("rfs-text-sm rfs-text-muted-foreground", className)} {...props} />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export { Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription }
