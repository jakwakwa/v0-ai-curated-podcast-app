import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { PlayIcon } from "lucide-react"
import type * as React from "react"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
	"bg-none inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium leading-5 tracking-wide transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
	{
		variants: {
			variant: {
				default: "bg-btn-default  border-bord-light hover:bg-secondary-dark",
				destructive:
					"btn-destructive hover:text-destructive-background hover:border-destructive",
				outline:
					"btn-ghost-outline",
				secondary: "btn-secondary px-2 md:px-4 py-2 shadow-xs hover:bg-[var(--color-button-secondary-bg-hover)] hover:border-[var(--color-button-secondary-bg-hover)] focus:bg-accent",
				ghost: "bg-none border-none outline-none text-foreground hover:color-[var(--color-secondary)] hover:text-accent-foreground",
				link: "bg-none outline-none text-[var(--color-button-default-bg)] underline-offset-4 hover:underline p-0 h-auto w-auto inline-block align-middle leading-none text-base",

				play: "flex flex-row items-center justify-center gap-2 bg-none outline-none text-[#2CE083E4] p-0 h-auto w-auto inline-block align-middle leading-none px-0 py-0 m-0 underline-offset-0  hover:underline-offset-0 text-[0.1rem] leading-none my-0 btn-play shadow-none",
			},
			size: {
				default: "h-12 px-2 md:px-4 py-2",
				bundles: "h-auto px-2 md:px-4 py-8",
				sm: "h-8 px-2 md:px-3 text-xs rounded-lg md:rounded-xl",
				xs: "h-8 px-2 md:px-3 text-[0.6rem] rounded-lg md:rounded-xl",
				lg: "h-10 px-2 md:px-6 rounded-lg md:rounded-xl",
				icon: "size-9 p-0",
				play: " w-auto inline-block align-middle leading-none text-xs px-0 py-0 my-0 leading-none flex flex-row items-center justify-center gap-1",
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

	children,
	...props
}: React.ComponentProps<"button"> & {
	variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "play"
	size?: "default" | "bundles" | "sm" | "xs" | "lg" | "icon" | "play"
	asChild?: boolean
}) {
	const Comp = asChild ? Slot : "button"

	return (
		<Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props}>
			{children}
			{variant === "play" && <PlayIcon color="#068B84A7" className="w-5 h-5" />}

		</Comp>
	)
}

export { Button, buttonVariants }
