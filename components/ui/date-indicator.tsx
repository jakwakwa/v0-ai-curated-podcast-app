import styles from "./date-indicator.module.css"

interface DateIndicatorProps {
	indicator: Date
	label: string
}

function DateIndicator({ indicator, label }: DateIndicatorProps): React.ReactElement {
	return (
		<div className={styles.lastUpdatedText}>
			{label}: {indicator.toLocaleDateString()}
		</div>
	)
}

export default DateIndicator
