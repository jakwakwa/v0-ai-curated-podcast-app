import type { VariantProps } from "class-variance-authority"
import type * as React from "react"
import { badgeVariants } from "@/lib/component-variants"
import { cn } from "@/lib/utils"

interface BadgeComponentProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeComponentProps) {
	return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, type BadgeComponentProps }
