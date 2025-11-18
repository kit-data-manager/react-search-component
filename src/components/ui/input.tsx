import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "rfs:flex rfs:h-10 rfs:w-full rfs:rounded-md rfs:border rfs:border-input rfs:bg-background rfs:px-3 rfs:py-2 rfs:text-base rfs:ring-offset-background rfs:file:border-0 rfs:file:bg-transparent rfs:file:text-sm rfs:file:font-medium rfs:file:text-foreground rfs:placeholder:text-muted-foreground rfs:focus-visible:outline-hidden rfs:focus-visible:ring-2 rfs:focus-visible:ring-ring rfs:focus-visible:ring-offset-2 rfs:disabled:cursor-not-allowed rfs:disabled:opacity-50 rfs:md:text-sm",
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
