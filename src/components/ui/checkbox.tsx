import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "rfs-peer rfs-h-4 rfs-w-4 rfs-shrink-0 rfs-rounded-sm rfs-border rfs-border-primary rfs-ring-offset-background focus-visible:rfs-outline-none focus-visible:rfs-ring-2 focus-visible:rfs-ring-ring focus-visible:rfs-ring-offset-2 disabled:rfs-cursor-not-allowed disabled:rfs-opacity-50 data-[state=checked]:rfs-bg-primary data-[state=checked]:rfs-text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("rfs-flex rfs-items-center rfs-justify-center rfs-text-current")}
    >
      <Check className="rfs-h-4 rfs-w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
