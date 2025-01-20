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
      "rfs-flex rfs-h-10 rfs-w-full rfs-items-center rfs-justify-between rfs-rounded-md rfs-border rfs-border-input rfs-bg-background rfs-px-3 rfs-py-2 rfs-text-sm rfs-ring-offset-background placeholder:rfs-text-muted-foreground focus:rfs-outline-none focus:rfs-ring-2 focus:rfs-ring-ring focus:rfs-ring-offset-2 disabled:rfs-cursor-not-allowed disabled:rfs-opacity-50 [&>span]:rfs-line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="rfs-h-4 rfs-w-4 rfs-opacity-50" />
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
    className={cn(
      "rfs-flex rfs-cursor-default rfs-items-center rfs-justify-center rfs-py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="rfs-h-4 rfs-w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "rfs-flex rfs-cursor-default rfs-items-center rfs-justify-center rfs-py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="rfs-h-4 rfs-w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "rfs-relative rfs-z-50 rfs-max-h-96 rfs-min-w-[8rem] rfs-overflow-hidden rfs-rounded-md rfs-border rfs-bg-popover rfs-text-popover-foreground rfs-shadow-md data-[state=open]:rfs-animate-in data-[state=closed]:rfs-animate-out data-[state=closed]:rfs-fade-out-0 data-[state=open]:rfs-fade-in-0 data-[state=closed]:rfs-zoom-out-95 data-[state=open]:rfs-zoom-in-95 data-[side=bottom]:rfs-slide-in-from-top-2 data-[side=left]:rfs-slide-in-from-right-2 data-[side=right]:rfs-slide-in-from-left-2 data-[side=top]:rfs-slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:rfs-translate-y-1 data-[side=left]:rfs--translate-x-1 data-[side=right]:rfs-translate-x-1 data-[side=top]:rfs--translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "rfs-p-1",
          position === "popper" &&
            "rfs-h-[var(--radix-select-trigger-height)] rfs-w-full rfs-min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("rfs-py-1.5 rfs-pl-8 rfs-pr-2 rfs-text-sm rfs-font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "rfs-relative rfs-flex rfs-w-full rfs-cursor-default rfs-select-none rfs-items-center rfs-rounded-sm rfs-py-1.5 rfs-pl-8 rfs-pr-2 rfs-text-sm rfs-outline-none focus:rfs-bg-accent focus:rfs-text-accent-foreground data-[disabled]:rfs-pointer-events-none data-[disabled]:rfs-opacity-50",
      className
    )}
    {...props}
  >
    <span className="rfs-absolute rfs-left-2 rfs-flex rfs-h-3.5 rfs-w-3.5 rfs-items-center rfs-justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="rfs-h-4 rfs-w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("rfs--mx-1 rfs-my-1 rfs-h-px rfs-bg-muted", className)}
    {...props}
  />
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
  SelectScrollDownButton,
}
