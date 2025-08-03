import type * as React from "react"
import { badgeVariants } from "@/lib/component-variants"
import { cn } from "@/lib/utils"

function Badge({
	className,
	variant = "default",
	size = "md",
	...props
}: { className?: string; variant: "default" | "secondary" | "destructive" | "outline" | "card"; size: "sm" | "md" | "lg" | "xl" } & React.HTMLAttributes<HTMLDivElement>) {
	return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
}

export { Badge }
