import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import type * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
	"bg-none inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium leading-5 tracking-wide transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
	{
		variants: {
			variant: {
				default: "bg-btn-default  border-bord-light bg-secondary hover:bg-secondary-dark",
				destructive:
					"bg-destructive text-[var(--color-button-destructive-foreground)] border border-[var(--color-button-destructive-bg)] rounded-lg md:rounded-xl px-2 md:px-4 py-2 shadow-xs hover:bg-[var(--color-button-destructive-bg-hover)] hover:border-[var(--color-button-destructive-bg-hover)] focus-visible:outline-none",
				outline:
					"bg-none btn-outline shadow-none border-[rgb(33 203 138)]/50 border-2 rounded-lg md:rounded-xl px-2 md:px-4 py-2 hover:bg-[var(--color-button-default-bg-hover)] hover:border-[var(--color-button-border-hover)]",
				secondary: "btn-secondary px-2 md:px-4 py-2 shadow-xs hover:bg-[var(--color-button-secondary-bg-hover)] hover:border-[var(--color-button-secondary-bg-hover)] focus:bg-accent",
				ghost: "bg-none border-none outline-none text-foreground hover:color-[var(--color-secondary)] hover:text-accent-foreground",
				link: "bg-none outline-none text-[var(--color-button-default-bg)] underline-offset-4 hover:underline p-0 h-auto w-auto inline-block align-middle leading-none text-base",
			},
			size: {
				default: "h-12 px-2 md:px-4 py-2",
				bundles: "h-auto px-2 md:px-4 py-8",
				sm: "h-8 px-2 md:px-3 text-xs rounded-lg md:rounded-xl",
				xs: "h-8 px-2 md:px-3 text-[0.6rem] rounded-lg md:rounded-xl",
				lg: "h-10 px-2 md:px-6 rounded-lg md:rounded-xl",
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
	size?: "default" | "bundles" | "sm" | "xs" | "lg" | "icon"
	asChild?: boolean
}) {
	const Comp = asChild ? Slot : "button"

	return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
