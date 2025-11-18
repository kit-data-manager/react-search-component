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
      "rfs:peer rfs:h-4 rfs:w-4 rfs:shrink-0 rfs:rounded-sm rfs:border rfs:border-primary rfs:ring-offset-background rfs:focus-visible:outline-hidden rfs:focus-visible:ring-2 rfs:focus-visible:ring-ring rfs:focus-visible:ring-offset-2 rfs:disabled:cursor-not-allowed rfs:disabled:opacity-50 rfs:data-[state=checked]:bg-primary rfs:data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("rfs:flex rfs:items-center rfs:justify-center rfs:text-current")}
    >
      <Check className="rfs:h-4 rfs:w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
