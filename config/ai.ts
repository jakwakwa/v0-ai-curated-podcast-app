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
		CASUAL_LISTENER: "pri_01k1dzhm5ccevk59y626z80mmf",
		CURATE_CONTROL: "pri_01k23mdwkrr8g9cp7bdbp8xqm8",
		FREE_SLICE: "pri_01k2q2kvxscyyn0w5wsg32pf3w",
	},
} as const;

export const aiConfig = {
	useShortEpisodes: false,
};
