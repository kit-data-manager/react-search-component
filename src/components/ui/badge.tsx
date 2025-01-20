import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "rfs-inline-flex rfs-items-center rfs-rounded-full rfs-border rfs-px-2.5 rfs-py-0.5 rfs-text-xs rfs-font-semibold rfs-transition-colors focus:rfs-outline-none focus:rfs-ring-2 focus:rfs-ring-ring focus:rfs-ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "rfs-border-transparent rfs-bg-primary rfs-text-primary-foreground hover:rfs-bg-primary/80",
        secondary:
          "rfs-border-transparent rfs-bg-secondary rfs-text-secondary-foreground hover:rfs-bg-secondary/80",
        destructive:
          "rfs-border-transparent rfs-bg-destructive rfs-text-destructive-foreground hover:rfs-bg-destructive/80",
        outline: "rfs-text-foreground",
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
