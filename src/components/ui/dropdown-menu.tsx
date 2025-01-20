import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "rfs-flex rfs-cursor-default rfs-gap-2 rfs-select-none rfs-items-center rfs-rounded-sm rfs-px-2 rfs-py-1.5 rfs-text-sm rfs-outline-none focus:rfs-bg-accent data-[state=open]:rfs-bg-accent [&_svg]:rfs-pointer-events-none [&_svg]:rfs-size-4 [&_svg]:rfs-shrink-0",
      inset && "rfs-pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="rfs-ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "rfs-z-50 rfs-min-w-[8rem] rfs-overflow-hidden rfs-rounded-md rfs-border rfs-bg-popover rfs-p-1 rfs-text-popover-foreground rfs-shadow-lg data-[state=open]:rfs-animate-in data-[state=closed]:rfs-animate-out data-[state=closed]:rfs-fade-out-0 data-[state=open]:rfs-fade-in-0 data-[state=closed]:rfs-zoom-out-95 data-[state=open]:rfs-zoom-in-95 data-[side=bottom]:rfs-slide-in-from-top-2 data-[side=left]:rfs-slide-in-from-right-2 data-[side=right]:rfs-slide-in-from-left-2 data-[side=top]:rfs-slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "rfs-z-50 rfs-min-w-[8rem] rfs-overflow-hidden rfs-rounded-md rfs-border rfs-bg-popover rfs-p-1 rfs-text-popover-foreground rfs-shadow-md data-[state=open]:rfs-animate-in data-[state=closed]:rfs-animate-out data-[state=closed]:rfs-fade-out-0 data-[state=open]:rfs-fade-in-0 data-[state=closed]:rfs-zoom-out-95 data-[state=open]:rfs-zoom-in-95 data-[side=bottom]:rfs-slide-in-from-top-2 data-[side=left]:rfs-slide-in-from-right-2 data-[side=right]:rfs-slide-in-from-left-2 data-[side=top]:rfs-slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "rfs-relative rfs-flex rfs-cursor-default rfs-select-none rfs-items-center rfs-gap-2 rfs-rounded-sm rfs-px-2 rfs-py-1.5 rfs-text-sm rfs-outline-none rfs-transition-colors focus:rfs-bg-accent focus:rfs-text-accent-foreground data-[disabled]:rfs-pointer-events-none data-[disabled]:rfs-opacity-50 [&_svg]:rfs-pointer-events-none [&_svg]:rfs-size-4 [&_svg]:rfs-shrink-0",
      inset && "rfs-pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "rfs-relative rfs-flex rfs-cursor-default rfs-select-none rfs-items-center rfs-rounded-sm rfs-py-1.5 rfs-pl-8 rfs-pr-2 rfs-text-sm rfs-outline-none rfs-transition-colors focus:rfs-bg-accent focus:rfs-text-accent-foreground data-[disabled]:rfs-pointer-events-none data-[disabled]:rfs-opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="rfs-absolute rfs-left-2 rfs-flex rfs-h-3.5 rfs-w-3.5 rfs-items-center rfs-justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="rfs-h-4 rfs-w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "rfs-relative rfs-flex rfs-cursor-default rfs-select-none rfs-items-center rfs-rounded-sm rfs-py-1.5 rfs-pl-8 rfs-pr-2 rfs-text-sm rfs-outline-none rfs-transition-colors focus:rfs-bg-accent focus:rfs-text-accent-foreground data-[disabled]:rfs-pointer-events-none data-[disabled]:rfs-opacity-50",
      className
    )}
    {...props}
  >
    <span className="rfs-absolute rfs-left-2 rfs-flex rfs-h-3.5 rfs-w-3.5 rfs-items-center rfs-justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="rfs-h-2 rfs-w-2 rfs-fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "rfs-px-2 rfs-py-1.5 rfs-text-sm rfs-font-semibold",
      inset && "rfs-pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("rfs--mx-1 rfs-my-1 rfs-h-px rfs-bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("rfs-ml-auto rfs-text-xs rfs-tracking-widest rfs-opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
