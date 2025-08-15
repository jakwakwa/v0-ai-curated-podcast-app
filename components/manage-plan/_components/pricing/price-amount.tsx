import { Skeleton } from "@/components/ui/skeleton"
import type { PlanTier } from "@/lib/types"
import { cn } from "@/lib/utils"

interface Props {
	loading: boolean
	tier: PlanTier
	value: string
	priceSuffix: string
}

export function PriceAmount({ loading, priceSuffix, tier }: Props) {
	return (
		<div className="mt-6 flex flex-col px-8">
			{loading ? (
				<Skeleton className="h-[96px] w-full bg-border" />
			) : (
				<>
					<div className={cn("text-[80px] leading-[96px] tracking-[-1.6px] font-medium")}>{tier.priceId.replace(/\.00$/, "")}</div>
					<div className={cn("font-medium leading-[12px] text-[12px]")}>{priceSuffix}</div>
				</>
			)}
		</div>
	)
}
