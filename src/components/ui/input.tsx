import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "rfs-flex rfs-h-10 rfs-w-full rfs-rounded-md rfs-border rfs-border-input rfs-bg-background rfs-px-3 rfs-py-2 rfs-text-base rfs-ring-offset-background file:rfs-border-0 file:rfs-bg-transparent file:rfs-text-sm file:rfs-font-medium file:rfs-text-foreground placeholder:rfs-text-muted-foreground focus-visible:rfs-outline-none focus-visible:rfs-ring-2 focus-visible:rfs-ring-ring focus-visible:rfs-ring-offset-2 disabled:rfs-cursor-not-allowed disabled:rfs-opacity-50 md:rfs-text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
