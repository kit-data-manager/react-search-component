import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "rfs:inline-flex rfs:items-center rfs:rounded-full rfs:border rfs:px-2.5 rfs:py-0.5 rfs:text-xs rfs:font-semibold rfs:transition-colors rfs:focus:outline-hidden rfs:focus:ring-2 rfs:focus:ring-ring rfs:focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "rfs:border-transparent rfs:bg-primary rfs:text-primary-foreground rfs:hover:bg-primary/80",
        secondary:
          "rfs:border-transparent rfs:bg-secondary rfs:text-secondary-foreground rfs:hover:bg-secondary/80",
        destructive:
          "rfs:border-transparent rfs:bg-destructive rfs:text-destructive-foreground rfs:hover:bg-destructive/80",
        outline: "rfs:text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
