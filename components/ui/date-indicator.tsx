import type React from "react"

interface DateIndicatorProps {
	indicator: Date | string
	label: string
	size: "xs" | "sm"
}

function DateIndicator({ indicator, label, size = "sm" }: DateIndicatorProps): React.ReactElement {
	const formatDate = (date: Date | string): string => {
		if (!date) return "Unknown"

		try {
			// If it's already a Date object, use it directly
			if (date instanceof Date) {
				return date.toLocaleDateString()
			}

			// If it's a string, convert it to a Date first
			const dateObject = new Date(date)

			// Check if the date is valid
			if (isNaN(dateObject.getTime())) {
				return "Invalid date"
			}

			return dateObject.toLocaleDateString()
		} catch (error) {
			console.warn("Failed to format date:", error)
			return "Invalid date"
		}
	}

	return (
		<div className={`mt-1 uppercase text-[0.6rem]  text-primary-foreground/60`}>
			{label}: {formatDate(indicator)}
		</div>
	)
}

export default DateIndicator
