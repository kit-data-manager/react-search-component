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
        "rfs-z-50 rfs-w-72 rfs-rounded-md rfs-border rfs-bg-popover rfs-p-4 rfs-text-popover-foreground rfs-shadow-md rfs-outline-none data-[state=open]:rfs-animate-in data-[state=closed]:rfs-animate-out data-[state=closed]:rfs-fade-out-0 data-[state=open]:rfs-fade-in-0 data-[state=closed]:rfs-zoom-out-95 data-[state=open]:rfs-zoom-in-95 data-[side=bottom]:rfs-slide-in-from-top-2 data-[side=left]:rfs-slide-in-from-right-2 data-[side=right]:rfs-slide-in-from-left-2 data-[side=top]:rfs-slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
