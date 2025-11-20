import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Trigger
        ref={ref}
        className={cn(
            "rfs:flex rfs:h-10 rfs:w-full rfs:items-center rfs:justify-between rfs:rounded-md rfs:border rfs:border-input rfs:bg-background rfs:px-3 rfs:py-2 rfs:text-sm rfs:ring-offset-background rfs:data-[placeholder]:text-muted-foreground rfs:focus:outline-none rfs:focus:ring-2 rfs:focus:ring-ring rfs:focus:ring-offset-2 rfs:disabled:cursor-not-allowed rfs:disabled:opacity-50 rfs:[&>span]:line-clamp-1",
            className
        )}
        {...props}
    >
        {children}
        <SelectPrimitive.Icon asChild>
            <ChevronDown className="rfs:h-4 rfs:w-4 rfs:opacity-50" />
        </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollUpButton
        ref={ref}
        className={cn("rfs:flex rfs:cursor-default rfs:items-center rfs:justify-center rfs:py-1", className)}
        {...props}
    >
        <ChevronUp className="rfs:h-4 rfs:w-4" />
    </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollDownButton
        ref={ref}
        className={cn("rfs:flex rfs:cursor-default rfs:items-center rfs:justify-center rfs:py-1", className)}
        {...props}
    >
        <ChevronDown className="rfs:h-4 rfs:w-4" />
    </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
    <SelectPrimitive.Portal>
        <SelectPrimitive.Content
            ref={ref}
            className={cn(
                "rfs:relative rfs:z-50 rfs:max-h-[--radix-select-content-available-height] rfs:min-w-[8rem] rfs:overflow-y-auto rfs:overflow-x-hidden rfs:rounded-md rfs:border rfs:border-input rfs:bg-popover rfs:text-popover-foreground rfs:shadow-md rfs:data-[state=open]:animate-in rfs:data-[state=closed]:animate-out rfs:data-[state=closed]:fade-out-0 rfs:data-[state=open]:fade-in-0 rfs:data-[state=closed]:zoom-out-95 rfs:data-[state=open]:zoom-in-95 rfs:data-[side=bottom]:slide-in-from-top-2 rfs:data-[side=left]:slide-in-from-right-2 rfs:data-[side=right]:slide-in-from-left-2 rfs:data-[side=top]:slide-in-from-bottom-2 rfs:origin-[--radix-select-content-transform-origin]",
                position === "popper" &&
                    "rfs:data-[side=bottom]:translate-y-1 rfs:data-[side=left]:-translate-x-1 rfs:data-[side=right]:translate-x-1 rfs:data-[side=top]:-translate-y-1",
                className
            )}
            position={position}
            {...props}
        >
            <SelectScrollUpButton />
            <SelectPrimitive.Viewport
                className={cn(
                    "rfs:p-1",
                    position === "popper" && "rfs:h-[var(--radix-select-trigger-height)] rfs:w-full rfs:min-w-[var(--radix-select-trigger-width)]"
                )}
            >
                {children}
            </SelectPrimitive.Viewport>
            <SelectScrollDownButton />
        </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Label>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>>(
    ({ className, ...props }, ref) => (
        <SelectPrimitive.Label ref={ref} className={cn("rfs:py-1.5 rfs:pl-8 rfs:pr-2 rfs:text-sm rfs:font-semibold", className)} {...props} />
    )
)
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Item>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>>(
    ({ className, children, ...props }, ref) => (
        <SelectPrimitive.Item
            ref={ref}
            className={cn(
                "rfs:relative rfs:flex rfs:w-full rfs:cursor-default rfs:select-none rfs:items-center rfs:rounded-sm rfs:py-1.5 rfs:pl-8 rfs:pr-2 rfs:text-sm rfs:outline-none rfs:focus:bg-accent rfs:focus:text-accent-foreground rfs:data-[disabled]:pointer-events-none rfs:data-[disabled]:opacity-50",
                className
            )}
            {...props}
        >
            <span className="rfs:absolute rfs:left-2 rfs:flex rfs:h-3.5 rfs:w-3.5 rfs:items-center rfs:justify-center">
                <SelectPrimitive.ItemIndicator>
                    <Check className="rfs:h-4 rfs:w-4" />
                </SelectPrimitive.ItemIndicator>
            </span>

            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        </SelectPrimitive.Item>
    )
)
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.Separator ref={ref} className={cn("rfs:-mx-1 rfs:my-1 rfs:h-px rfs:bg-muted", className)} {...props} />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
    Select,
    SelectGroup,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectLabel,
    SelectItem,
    SelectSeparator,
    SelectScrollUpButton,
    SelectScrollDownButton
}
