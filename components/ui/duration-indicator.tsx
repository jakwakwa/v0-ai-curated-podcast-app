import type React from "react"

interface DurationIndicatorProps {
	seconds?: number | null
	label?: string | null
	size?: "xs" | "sm"
}

function formatDuration(totalSeconds?: number | null): string {
	if (totalSeconds === null || totalSeconds === undefined) return "Unknown"
	if (typeof totalSeconds !== "number" || Number.isNaN(totalSeconds)) return "Unknown"
	if (totalSeconds <= 0) return "Unknown"

	const hours = Math.floor(totalSeconds / 3600)
	const minutes = Math.floor((totalSeconds % 3600) / 60)
	const seconds = Math.floor(totalSeconds % 60)

	const parts: string[] = []
	if (hours > 0) {
		parts.push(String(hours))
		parts.push(String(minutes).padStart(2, "0"))
		parts.push(String(seconds).padStart(2, "0"))
		return parts.join(":")
	}

	// mm:ss for durations under 1 hour
	return `${minutes}:${String(seconds).padStart(2, "0")}`
}

function DurationIndicator({ seconds, label = "Duration", size = "sm" }: DurationIndicatorProps): React.ReactElement {
	const sizeClasses = {
		xs: "text-[0.5rem]",
		sm: "text-[0.6rem]",
	}

	return (
		<div className={`mt-1 uppercase ${sizeClasses[size]} text-primary-foreground/60`}>
			{label ? `${label}: ` : null}
			{formatDuration(seconds)}
		</div>
	)
}

export default DurationIndicator

