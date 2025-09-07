import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { PlayIcon } from "lucide-react"
import type * as React from "react"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap leading-5 tracking-wide transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
	{
		variants: {
			variant: {
				default: "bg-btn-default border-bord-light hover:bg-secondary-dark px-4 py-2",
				destructive: "btn-destructive hover:text-destructive-background hover:border-destructive",
				outline: "scale-[1] mx-1 btn-ghost-outline",
				icon: "flex items-center justify-center gap-2",
				secondary: "btn-secondary px-2 md:px-4 py-2 shadow-xs hover:bg-[var(--color-button-secondary-bg-hover)] hover:border-[var(--color-button-secondary-bg-hover)] focus:bg-accent",
				ghost: " mx-0  btn-ghost-sm",
				link: "bg-none outline-none text-[var(--color-button-default-bg)] underline-offset-4 hover:underline p-0 h-auto w-auto inline-block align-middle leading-none text-base",
				play: " flex flex-row items-center justify-center gap-2 outline-none text-[#C5E8D6E4] p-0 h-auto w-auto inline-block align-middle leading-none px-0 py-0 m-0 underline-offset-0  hover:underline-offset-0 text-[0.1rem] leading-none my-0 btn-play shadow-none",
			},
			size: {
				default: "h-12 px-2 md:px-4 py-2",
				bundles: "h-auto px-2 md:px-4 py-8",
				sm: "h-8 px-2 md:px-3 rounded-lg md:rounded-xl btn-ghost-outline-sm ",
				xs: "h-2 px-0 md:px-0 rounded-sm  btn-ghost-sm",
				md: "h-auto px-4",
				lg: "h-auto px-2 md:px-6 rounded-lg md:rounded-xl",
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
	icon,
	...props
}: React.ComponentProps<"button"> & {
	variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "play" | "icon"
	size?: "default" | "bundles" | "sm" | "xs" | "md" | "lg" | "play"
	asChild?: boolean
	icon?: React.ReactNode
}) {
	const Comp = asChild ? Slot : "button"

	return (
		<Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props}>
			{children}
			{variant === "play" && <PlayIcon color="#04413EF7" className="w-6 h-9" />}
		</Comp>
	)
}

export { Button, buttonVariants }
