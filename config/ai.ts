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
} as const;

export const aiConfig = {
	useShortEpisodes: true,
};
