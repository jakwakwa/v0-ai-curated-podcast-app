import type * as React from "react"
import { badgeVariants } from "@/lib/component-variants"
import { cn } from "@/lib/utils"

function Badge({
	className,
	variant = "default",
	size = "md",
	...props
}: { className?: string; variant: "default" | "secondary" | "destructive" | "outline" | "card" | "primarycard"; size: "sm" | "md" | "lg" | "xl" } & React.HTMLAttributes<HTMLDivElement>) {
	/**
	 * --------------------------------
	 * JSDOC
	 * --------------------------------
	 * Component: Badge Primitive
	 * Description: A badge component for displaying small labels or tags.
	 * Props:
	 *  - className: Additional CSS classes to apply to the badge.
	 *  - variant: The visual style of the badge.
	 *  - size: The size of the badge.
	 *  - props: Additional props to pass to the div element.
	 * Example: <Badge variant="default" size="sm">Default</Badge>
	 *
	 */

	if (size === "sm") {
		return <div className={`text-custom-xs ${cn(badgeVariants({ variant, size }), className)}`} {...props} />
	}

	if (size === "md") {
		return <div className={`text-custom-sm ${cn(badgeVariants({ variant, size }), className)}`} {...props} />
	}

	if (size === "lg") {
		return <div className={`text-custom-md ${cn(badgeVariants({ variant, size }), className)}`} {...props} />
	}

	if (size === "xl") {
		return <div className={`text-custom-lg ${cn(badgeVariants({ variant, size }), className)}`} {...props} />
	}

	return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
}

export { Badge }
