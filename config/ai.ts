// Payment provider configuration
export const PAYMENT_CONFIG = {
	// Payment provider selection
	ACTIVE_PROVIDER: process.env.NEXT_PUBLIC_PAYMENT_PROVIDER || "paystack", // 'paystack' | 'paddle'

	// Feature flags
	ENABLE_PADDLE: process.env.NEXT_PUBLIC_ENABLE_PADDLE === "true",
	ENABLE_PAYSTACK: process.env.NEXT_PUBLIC_ENABLE_PAYSTACK === "true",

	// Plan IDs
	PADDLE: {
		CASUAL_LISTENER: "pri_01k1dwyqfvnwf8w7rk1gc1y634",
		CURATE_CONTROL: "pri_01k1w1gye963q3nea8ctpbgehz",
	},
	PAYSTACK: {
		CASUAL_LISTENER: "PLN_CASUAL_001",
		CURATE_CONTROL: "PLN_PREMIUM_001",
	},
} as const

export const aiConfig = {
	geminiModel: "gemini-2.5-flash", // Default Gemini model
	maxSources: 1, // Maximum number of sources allowed per collection
	simulateAudioSynthesis: false, // Set to `true` to simulate, `false` to use ElevenLabs API
	// Add other AI-related configurations here if needed]
	/* **HOPE** */
	synthVoice: "uYXf8XasLslADfZ2MB4u",
	/* **VINCE** */
	// synthVoicd: "zZLmKvCp1i04X8E0FJ8B",
	synthModel: "eleven_flash_v2",
}

// "TX3LPaxmHKxFdv7VOQHJ", // Liam
// "FGY2WhTYpPnrIDTdsKH5", // Laura
