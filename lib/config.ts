// Configuration for data sources
export const CONFIG = {
	// Set to true to use dummy data, false to use real API calls
	USE_DUMMY_DATA: true,

	// Logging configuration
	LOG_DUMMY_DATA_USAGE: true,

	// Development mode settings
	DEVELOPMENT_MODE: process.env.NODE_ENV === "development",
} as const

// Helper function to check if we should use dummy data
export function shouldUseDummyData(): boolean {
	return CONFIG.USE_DUMMY_DATA
}

// Helper function to log dummy data usage
export function logDummyDataUsage(context: string): void {
	if (CONFIG.LOG_DUMMY_DATA_USAGE && CONFIG.DEVELOPMENT_MODE) {
		console.log(`🔧 Using DUMMY_DATA for: ${context}`)
	}
}
