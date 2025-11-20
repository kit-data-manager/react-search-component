import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
    React.ElementRef<typeof TooltipPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
    <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
            "rfs-root rfs:z-50 rfs:overflow-hidden rfs:rounded-md rfs:border rfs:bg-popover rfs:px-3 rfs:py-1.5 rfs:text-sm rfs:text-popover-foreground rfs:shadow-md rfs:animate-in rfs:fade-in-0 rfs:zoom-in-95 rfs:data-[state=closed]:animate-out rfs:data-[state=closed]:fade-out-0 rfs:data-[state=closed]:zoom-out-95 rfs:data-[side=bottom]:slide-in-from-top-2 rfs:data-[side=left]:slide-in-from-right-2 rfs:data-[side=right]:slide-in-from-left-2 rfs:data-[side=top]:slide-in-from-bottom-2",
            className
        )}
        {...props}
    />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
