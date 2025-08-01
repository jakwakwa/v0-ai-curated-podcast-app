import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import styles from "./app-spinner.module.css"

export type SpinnerSize = "sm" | "md" | "lg"
export type SpinnerColor = "default" | "primary" | "secondary" | "success" | "warning" | "danger"
export type SpinnerVariant = "default" | "simple" | "gradient" | "wave" | "dots" | "spinner"
export type SpinnerLabelColor = "default" | "primary" | "secondary" | "success" | "warning" | "danger"

export interface AppSpinnerProps {
	/** Optional label text to display below the spinner */
	label?: string
	/** Size of the spinner */
	size?: SpinnerSize
	/** Color theme of the spinner */
	color?: SpinnerColor
	/** Visual variant of the spinner */
	variant?: SpinnerVariant
	/** Color theme of the label text */
	labelColor?: SpinnerLabelColor
	/** Custom class names for different parts */
	classNames?: Partial<Record<"base" | "wrapper" | "circle2" | "dots" | "spinnerBars" | "label", string>>
	/** Additional className for the base wrapper */
	className?: string
}

export function AppSpinner({ label, size = "md", color = "primary", variant = "default", labelColor = "default", classNames, className }: AppSpinnerProps) {
	const renderSpinner = () => {
		const spinnerClasses = cn(styles.spinner, styles[size], styles[color], styles[variant], classNames?.circle2)

		switch (variant) {
			case "simple":
				return (
					<div className={cn(styles.simple, spinnerClasses)}>
						<div className={styles.simpleCircle} />
					</div>
				)

			case "gradient":
				return (
					<div className={cn(styles.gradient, spinnerClasses)}>
						<div className={styles.gradientCircle} />
					</div>
				)

			case "wave":
				return (
					<div className={cn(styles.wave, spinnerClasses)}>
						{[...Array(5)].map((_, i) => (
							<div key={i} className={styles.waveDot} />
						))}
					</div>
				)

			case "dots":
				return (
					<div className={cn(styles.dots, spinnerClasses, classNames?.dots)}>
						{[...Array(3)].map((_, i) => (
							<div key={i} className={styles.dot} />
						))}
					</div>
				)

			case "spinner":
				return (
					<div className={cn(styles.spinnerBars, spinnerClasses, classNames?.spinnerBars)}>
						{[...Array(12)].map((_, i) => (
							<div key={i} className={styles.bar} />
						))}
					</div>
				)

			default:
				return <RefreshCw className={cn(styles.defaultIcon, spinnerClasses)} />
		}
	}

	return (
		<div className={cn(styles.base, classNames?.base, className)}>
			<div className={cn(styles.container, classNames?.container)}>{renderSpinner()}</div>
			{label && <span className={cn(styles.label, styles[`label${labelColor.charAt(0).toUpperCase() + labelColor.slice(1)}` as keyof typeof styles], classNames?.label)}>{label}</span>}
		</div>
	)
}
