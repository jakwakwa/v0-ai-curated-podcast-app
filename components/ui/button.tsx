import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import type * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium leading-5 tracking-wide transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
	{
		variants: {
			variant: {
				default:
					"bg-[var(--color-button-default-bg)] text-foreground border border-[var(--color-button-outline)] rounded-lg px-4 py-2 shadow-xs hover:bg-[var(--color-button-default-bg-hover)] hover:border-[var(--color-button-outline-hover)]",
				destructive:
					"bg-[var(--color-button-destructive-bg)] text-[var(--color-button-destructive-foreground)] border border-[var(--color-button-destructive-bg)] rounded-lg px-4 py-2 shadow-xs hover:bg-[var(--color-button-destructive-bg-hover)] hover:border-[var(--color-button-destructive-bg-hover)] focus-visible:outline-[var(--color-button-destructive-bg)]/50",
				outline:
					"bg-transparent text-foreground border border-[var(--color-button-outline)] rounded-lg px-4 py-2 shadow-xs hover:bg-[var(--color-button-default-bg-hover)] hover:border-[var(--color-button-outline-hover)]",
				secondary:
					"bg-[var(--color-button-secondary-bg)] text-[var(--color-button-secondary-foreground)] border border-[var(--color-button-secondary-bg)] rounded-lg px-4 py-2 shadow-xs hover:bg-[var(--color-button-secondary-bg-hover)] hover:border-[var(--color-button-secondary-bg-hover)]",
				ghost: "bg-transparent text-foreground hover:bg-[var(--color-button-ghost-hover)] hover:text-accent-foreground",
				link: "text-[var(--color-button-default-bg)] underline-offset-4 hover:underline p-0 h-auto w-auto inline-block align-middle leading-none text-base",
			},
			size: {
				default: "h-9 px-4 py-2",
				bundles: "h-auto px-4 py-2",
				sm: "h-8 px-3 text-xs rounded-md",
				lg: "h-10 px-6 rounded-md",
				icon: "size-9 p-0",
			},
		},
		defaultVariants: {
			size: "default",
		},
	}
)

function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<"button"> & {
	variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
	size?: "default" | "bundles" | "sm" | "lg" | "icon"
	asChild?: boolean
}) {
	const Comp = asChild ? Slot : "button"

	return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
