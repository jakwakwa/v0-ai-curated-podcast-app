import type { PlanTier } from "@/lib/types"

const PRICING_TIER: PlanTier[] = [
	{
		priceId: "pri_01k2h65r0a16fqfr84tjmpvsxr",
		planId: "FREE_SLICE",
		productTitle: "Free Slice",
		icon: "/assets/icons/price-tiers/free-icon.svg",
		description: "Ideal to test out podslice",
		features: ["Basic Weekly Recommendations"],
		featured: false,
	},
	{
		priceId: "pri_01k23mdwkrr8g9cp7bdbp8xqm8",
		productTitle: "Casual Listener",
		planId: "CASUAL_LISTENER",
		icon: "/assets/icons/price-tiers/free-icon.svg",
		features: ["Access to more Podcasts Bundles", "Basic Weekly Recommendations"],
		description: "Ideal for individuals who wants more variaty but don't have time to manage their own feeds",
		featured: true,
	},
	{
		priceId: "pri_01k1dzhm5ccevk59y626z80mmf",
		productTitle: "Curate Control",
		planId: "CURATE_CONTROL",
		icon: "/assets/icons/price-tiers/free-icon.svg",
		features: ["Advanced Profile Features", "Generate 30 Ai Podcasts per month", "Access to more Podcasts Bundles", "Basic Weekly Recommendations"],
		description: "Ideal for the power user.",
		featured: false,
	},
]

export { PRICING_TIER }
