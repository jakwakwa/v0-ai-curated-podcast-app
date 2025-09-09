// Payment
// provider
// configuration
export const PAYMENT_CONFIG = {
	// Payment provider selection
	ACTIVE_PROVIDER: process.env.NEXT_PUBLIC_PAYMENT_PROVIDER || "paddle", // 'paddle'

	// Feature flags
	ENABLE_PADDLE: process.env.NEXT_PUBLIC_ENABLE_PADDLE === "true",

	// Plan IDs
	PADDLE: {
		CASUAL_LISTENER: "pri_01k1dwyqfvnwf8w7rk1gc1y634",
		CURATE_CONTROL: "pri_01k1w1gye963q3nea8ctpbgehz",
	},
} as const

export const aiConfig = {
	geminiModel: "gemini-2.5-flash", // Default Gemini model
	geminiTTSModel: "gemini-2.5-pro-preview-tts",
	maxSources: 2, // Maximum number of sources allowed per collection
	simulateAudioSynthesis: false, // Set to `true` to simulate, `false` to use ElevenLabs API

	// Episode generation settings
	useShortEpisodes: true,
}

// "TX3LPaxmHKxFdv7VOQHJ", // Liam
// "FGY2WhTYpPnrIDTdsKH5", // Laura
