import type * as React from "react"
import { badgeVariants } from "@/lib/component-variants"
import { cn } from "@/lib/utils"

function Badge({
	className,
	variant = "default",
	size = "sm",
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

	if (size === "sm" && variant === "outline") {
		return <div className={`text-[0.6rem] bg-[000]  border-1 px-3 py-0 leading-normal border-[#FFFFFF7A] ${cn(badgeVariants({ variant, size }), className)}`} {...props} />
	}

	if (size === "md") {
		return <div className={`text-custom-xxs ${cn(badgeVariants({ variant, size }), className)}`} {...props} />
	}

	if (size === "lg") {
		return <div className={`tbg-[000] text-custom-body ${cn(badgeVariants({ variant, size }), className)}`} {...props} />
	}

	if (size === "xl") {
		return <div className={`text-custom-xs ${cn(badgeVariants({ variant, size }), className)}`} {...props} />
	}

	return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
}

export { Badge }
