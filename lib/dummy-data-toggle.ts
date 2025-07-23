import { CONFIG } from "./config"

/**
 * Utility to easily toggle dummy data on/off
 *
 * Usage:
 * - To enable dummy data: set USE_DUMMY_DATA to true in lib/config.ts
 * - To disable dummy data: set USE_DUMMY_DATA to false in lib/config.ts
 *
 * This will affect:
 * - getUserCurationProfile() in lib/data.ts
 * - getEpisodes() in lib/data.ts
 * - CuratedPodcastList component
 * - CuratedBundleList component
 */

export function getDummyDataStatus(): {
	isEnabled: boolean
	status: string
	affectedFunctions: string[]
} {
	return {
		isEnabled: CONFIG.USE_DUMMY_DATA,
		status: CONFIG.USE_DUMMY_DATA ? "🟢 ENABLED" : "🔴 DISABLED",
		affectedFunctions: ["getUserCurationProfile()", "getEpisodes()", "CuratedPodcastList", "CuratedBundleList"],
	}
}

export function logDummyDataStatus(): void {
	const status = getDummyDataStatus()
	console.log("🔧 DUMMY DATA STATUS:", status.status)
	console.log("📋 Affected functions:", status.affectedFunctions.join(", "))
	console.log("💡 To toggle: Change USE_DUMMY_DATA in lib/config.ts")
}

// Auto-log status in development
if (CONFIG.DEVELOPMENT_MODE) {
	logDummyDataStatus()
}
