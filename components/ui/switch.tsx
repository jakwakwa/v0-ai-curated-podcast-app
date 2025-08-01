"use client"

import * as React from "react"
import styles from "./switch.module.css"

interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	checked?: boolean
	onCheckedChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(({ className, checked = false, onCheckedChange, disabled, ...props }, ref) => {
	const handleClick = () => {
		if (!disabled && onCheckedChange) {
			onCheckedChange(!checked)
		}
	}

	return (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			disabled={disabled}
			onClick={handleClick}
			className={`${styles.switchRoot} ${checked ? styles.switchRootChecked : styles.switchRootUnchecked} ${className}`}
			ref={ref}
			{...props}
		>
			<span className={`${styles.switchThumb} ${checked ? styles.switchThumbChecked : styles.switchThumbUnchecked}`} />
		</button>
	)
})
Switch.displayName = "Switch"

export { Switch }
