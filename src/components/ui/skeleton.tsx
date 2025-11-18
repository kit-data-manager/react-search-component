import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rfs:animate-pulse rfs:rounded-md rfs:bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
