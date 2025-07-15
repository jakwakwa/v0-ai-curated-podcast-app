import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatLogTimestamp(logString: string): string {
	// Extract the first line which contains the full date and time string
	const datePart = logString.split("\n")[0].trim()

	// Create a Date object from the extracted string
	const logDate = new Date(datePart)

	// Get the current date and set both 'now' and 'logDate' to their respective midnights
	// for accurate day comparison, ignoring time components initially.
	const now = new Date()
	const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate())
	const logDateMidnight = new Date(logDate.getFullYear(), logDate.getMonth(), logDate.getDate())

	let datePrefix: string
	const ONE_DAY_MS = 1000 * 60 * 60 * 24 // Milliseconds in one day

	// Calculate the difference in milliseconds between the log date's midnight and today's midnight
	const timeDifference = todayMidnight.getTime() - logDateMidnight.getTime()

	// Determine the date prefix (today, yesterday, or full date)
	if (timeDifference === 0) {
		// If the difference is 0ms, it's today
		datePrefix = "today"
	} else if (timeDifference === ONE_DAY_MS) {
		// If the difference is exactly one day, it's yesterday
		datePrefix = "yesterday"
	} else {
		// For any other day, format the full date
		const dateFormatter = new Intl.DateTimeFormat("en-GB", {
			month: "short", // e.g., "Jul"
			day: "numeric", // e.g., "14"
			year: "numeric", // e.g., "2025"
			timeZone: "Africa/Johannesburg", // Explicitly set timezone for date part if it matters (less common for date only)
		})
		datePrefix = dateFormatter.format(logDate)
	}

	// Format the time part into 12-hour format with AM/PM
	const timeFormatter = new Intl.DateTimeFormat("en-GB", {
		hour: "numeric", // e.g., "8" or "11"
		minute: "numeric", // e.g., "05" or "35"
		hour12: true, // Use 12-hour clock (e.g., "PM" or "AM")
		timeZone: "Africa/Johannesburg", // <--- CRITICAL: Explicitly set the timezone here
	})

	// Format and convert to lowercase (e.g., "8:35 PM" -> "8:35pm")
	const formattedTime = timeFormatter.format(logDate).toLowerCase().replace(/\s/g, "")

	// Combine the date prefix and formatted time
	return `${datePrefix} ${formattedTime}`
}
