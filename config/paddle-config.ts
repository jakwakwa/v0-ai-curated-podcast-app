import { createPaddlePriceId, type IPaddleProductPlan } from "@/lib/types"

const PADDLE_PRODUCT_PLAN: IPaddleProductPlan[] = [
	{
		priceId: createPaddlePriceId("pri_01k2h65r0a16fqr84tjmpvsxr"),
		pricePlan: "FREE_SLICE",
		productPlan: "free_slice",
		price: "2",
	},
	{
		priceId: createPaddlePriceId("pri_01k1dzhm5ccevk59y626z80mmf"),
		pricePlan: "CASUAL_LISTENER",
		productName: "casual_listener",
		price: "4.95",
	},
	{
		priceId: createPaddlePriceId("pri_01k23mdwkrr8g9cp7bdbp8xqm8"),
		pricePlan: "CURATE_CONTROL",
		productName: "curate_control",
		price: "9.95",
	},
]

export { PADDLE_PRODUCT_PLAN }
