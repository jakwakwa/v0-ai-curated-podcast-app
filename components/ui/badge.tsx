import { cva, type VariantProps } from "class-variance-authority"
import type * as React from "react"

import styles from "./badge.module.css"

const badgeVariants = cva(styles.badge, {
	variants: {
		variant: {
			default: styles.badgeDefault,
			secondary: styles.badgeSecondary,
			destructive: styles.badgeDestructive,
			outline: styles.badgeOutline,
		},
	},
	defaultVariants: {
		variant: "default",
	},
})

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
	return <div className={`${badgeVariants({ variant })} ${className}`} {...props} />
}

export { Badge, badgeVariants }
