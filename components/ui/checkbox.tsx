"use client"

import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import * as React from "react"

import styles from "./checkbox.module.css"

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>>(({ className, ...props }, ref) => (
	<CheckboxPrimitive.Root ref={ref} className={`${styles.checkboxRoot} ${className}`} {...props}>
		<CheckboxPrimitive.Indicator className={styles.checkboxIndicator}>
			<Check className={styles.checkboxIcon} />
		</CheckboxPrimitive.Indicator>
	</CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
