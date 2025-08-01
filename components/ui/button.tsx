import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import styles from "./button.module.css"

const buttonVariants = cva(styles.button, {
	variants: {
		variant: {
			default: styles.variantDefault,
			destructive: styles.variantDestructive,
			outline: styles.variantDefault,
			secondary: styles.variantSecondary,
			ghost: styles.variantGhost,
			link: styles.variantLink,
		},
		size: {
			default: styles.sizeDefault,
			sm: styles.sizeSm,
			lg: styles.sizeLg,
			icon: styles.sizeIcon,
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
})

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
	asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
	const Comp = asChild ? Slot : "button"
	const variantClasses = buttonVariants({ variant, size })
	return <Comp className={`${variantClasses} ${className || ""}`} ref={ref} {...props} />
})
Button.displayName = "Button"

export { Button, buttonVariants }
