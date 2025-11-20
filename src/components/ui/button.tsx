import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "rfs:inline-flex rfs:items-center rfs:justify-center rfs:gap-2 rfs:whitespace-nowrap rfs:rounded-md rfs:text-sm rfs:font-medium rfs:ring-offset-background rfs:transition-colors rfs:focus-visible:outline-hidden rfs:focus-visible:ring-2 rfs:focus-visible:ring-ring rfs:focus-visible:ring-offset-2 rfs:disabled:pointer-events-none rfs:disabled:opacity-50 rfs:[&_svg]:pointer-events-none rfs:[&_svg]:size-4 rfs:[&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "rfs:bg-primary rfs:text-primary-foreground rfs:hover:bg-primary/90",
        destructive:
          "rfs:bg-destructive rfs:text-destructive-foreground rfs:hover:bg-destructive/90",
        outline:
          "rfs:border rfs:border-input rfs:bg-background rfs:hover:bg-accent rfs:hover:text-accent-foreground",
        secondary:
          "rfs:bg-secondary rfs:text-secondary-foreground rfs:hover:bg-secondary/80",
        ghost: "rfs:hover:bg-accent rfs:hover:text-accent-foreground",
        link: "rfs:text-primary rfs:underline-offset-4 rfs:hover:underline",
      },
      size: {
        default: "rfs:h-10 rfs:px-4 rfs:py-2",
        sm: "rfs:h-9 rfs:rounded-md rfs:px-3",
        lg: "rfs:h-11 rfs:rounded-md rfs:px-8",
        icon: "rfs:h-10 rfs:w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
