import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>>(
    ({ className, ...props }, ref) => (
        <SliderPrimitive.Root
            ref={ref}
            className={cn("rfs-relative rfs-flex rfs-w-full rfs-touch-none rfs-select-none rfs-items-center", className)}
            {...props}
        >
            <SliderPrimitive.Track className="rfs-relative rfs-h-2 rfs-w-full rfs-grow rfs-overflow-hidden rfs-rounded-full rfs-bg-secondary">
                <SliderPrimitive.Range className="rfs-absolute rfs-h-full rfs-bg-primary" />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb className="rfs-block rfs-h-5 rfs-w-5 rfs-rounded-full rfs-border-2 rfs-border-primary rfs-bg-background rfs-ring-offset-background rfs-transition-colors focus-visible:rfs-outline-none focus-visible:rfs-ring-2 focus-visible:rfs-ring-ring focus-visible:rfs-ring-offset-2 disabled:rfs-pointer-events-none disabled:rfs-opacity-50">
                <span className=" rfs-pointer-events-none rfs-text-muted-foreground rfs-text-sm -rfs-top-5 -rfs-translate-x-1/2 rfs-left-1/2 rfs-absolute">
                    {props.value?.[0]}
                </span>
            </SliderPrimitive.Thumb>
            <SliderPrimitive.Thumb className="rfs-block rfs-h-5 rfs-w-5 rfs-rounded-full rfs-border-2 rfs-border-primary rfs-bg-background rfs-ring-offset-background rfs-transition-colors focus-visible:rfs-outline-none focus-visible:rfs-ring-2 focus-visible:rfs-ring-ring focus-visible:rfs-ring-offset-2 disabled:rfs-pointer-events-none disabled:rfs-opacity-50">
                <span className="rfs-pointer-events-none rfs-text-muted-foreground rfs-text-sm -rfs-bottom-5 -rfs-translate-x-1/2 rfs-left-1/2 rfs-absolute">
                    {props.value?.[1]}
                </span>
            </SliderPrimitive.Thumb>
        </SliderPrimitive.Root>
    )
)
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
