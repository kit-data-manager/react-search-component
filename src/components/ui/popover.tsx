"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
    React.ElementRef<typeof PopoverPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
    <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
            ref={ref}
            align={align}
            sideOffset={sideOffset}
            className={cn(
                "rfs-root rfs:z-50 rfs:w-72 rfs:rounded-md rfs:border rfs:bg-popover rfs:p-4 rfs:text-popover-foreground rfs:shadow-md rfs:outline-hidden rfs:data-[state=open]:animate-in rfs:data-[state=closed]:animate-out rfs:data-[state=closed]:fade-out-0 rfs:data-[state=open]:fade-in-0 rfs:data-[state=closed]:zoom-out-95 rfs:data-[state=open]:zoom-in-95 rfs:data-[side=bottom]:slide-in-from-top-2 rfs:data-[side=left]:slide-in-from-right-2 rfs:data-[side=right]:slide-in-from-left-2 rfs:data-[side=top]:slide-in-from-bottom-2",
                className
            )}
            {...props}
        />
    </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
