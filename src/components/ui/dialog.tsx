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
            "rfs:fixed rfs:inset-0 rfs:z-50 rfs:bg-black/80 rfs:data-[state=open]:animate-in rfs:data-[state=closed]:animate-out rfs:data-[state=closed]:fade-out-0 rfs:data-[state=open]:fade-in-0",
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
        <div className="rfs:contents rfs-root">
            <DialogOverlay />
            <DialogPrimitive.Content
                ref={ref}
                className={cn(
                    "rfs:fixed rfs:left-[50%] rfs:top-[50%] rfs:z-50 rfs:grid rfs:w-full rfs:max-w-lg rfs:translate-x-[-50%] rfs:translate-y-[-50%] rfs:gap-4 rfs:border rfs:border-border rfs:bg-background rfs:p-6 rfs:shadow-lg rfs:duration-200 rfs:data-[state=open]:animate-in rfs:data-[state=closed]:animate-out rfs:data-[state=closed]:fade-out-0 rfs:data-[state=open]:fade-in-0 rfs:data-[state=closed]:zoom-out-95 rfs:data-[state=open]:zoom-in-95 rfs:sm:rounded-lg",
                    className
                )}
                {...props}
            >
                {children}
                {!props.hideCloseButton && (
                    <DialogPrimitive.Close className="rfs:absolute rfs:right-4 rfs:top-4 rfs:rounded-sm rfs:opacity-70 rfs:ring-offset-background rfs:transition-opacity rfs:hover:opacity-100 rfs:focus:outline-none rfs:focus:ring-2 rfs:focus:ring-ring rfs:focus:ring-offset-2 rfs:disabled:pointer-events-none rfs:data-[state=open]:bg-accent rfs:data-[state=open]:text-muted-foreground">
                        <X className="rfs:h-4 rfs:w-4" />
                        <span className="rfs:sr-only">Close</span>
                    </DialogPrimitive.Close>
                )}
            </DialogPrimitive.Content>
        </div>
    </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("rfs:flex rfs:flex-col rfs:space-y-1.5 rfs:text-center rfs:sm:text-left", className)} {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("rfs:flex rfs:flex-col-reverse rfs:sm:flex-row rfs:sm:justify-end rfs:sm:space-x-2", className)} {...props} />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Title>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(
    ({ className, ...props }, ref) => (
        <DialogPrimitive.Title ref={ref} className={cn("rfs:text-lg rfs:font-semibold rfs:leading-none rfs:tracking-tight", className)} {...props} />
    )
)
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description ref={ref} className={cn("rfs:text-sm rfs:text-muted-foreground", className)} {...props} />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export { Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription }
