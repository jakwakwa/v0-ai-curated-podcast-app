"use client"

import { Tooltip, TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip"
import { InfoIcon, Podcast, ShoppingBasket } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import React from "react"
import { type HeaderProps, headerVariants } from "@/lib/component-variants"
import { useSubscriptionStore } from "@/lib/stores/subscription-store-paddlejs"
import { cn } from "@/lib/utils"
import { hasCurateControlAccess } from "@/utils/paddle/plan-utils"
import { Button } from "./button"
import { H1, H2, H3, Typography } from "./typography"

interface PageHeaderProps extends React.HTMLAttributes<HTMLElement>, HeaderProps {
	title: string
	description?: string
	level?: 1 | 2 | 3
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(({ className, spacing, title, description, level = 1, ...props }, ref) => {
	const _HeadingComponent = level === 1 ? H1 : level === 2 ? H2 : H3
	const router = useRouter()
	const pathname = usePathname()
	const subscription = useSubscriptionStore(state => state.subscription)
	const isLoading = useSubscriptionStore(state => state.isLoading)

	// Check if user has Curate Control access
	const hasAccess = hasCurateControlAccess(subscription?.plan_type)

	// Define allowed paths internally - only show button on dashboard
	const allowedPaths = ["/dashboard"]
	const isPathAllowed = allowedPaths.includes(pathname)

	return (
		<div className="flex flex-col justify-between">
			<div className={cn(headerVariants({ spacing, className }))} ref={ref} {...props}>
				<h2 className="flex text-custom-h2 font-medium px-2 md:px-0 pt-0 pb-0 md:py-0	 text-primary leading-[1.5] max-w-screen md:max-w-4xl">{title}</h2>
				{description && (
					<Typography as="p" variant="body" className="text-base px-2  md:px-0  md:py-1.5 text-primary/60 leading-[1.5] max-w-screen md:max-w-xl">
						{description}
					</Typography>
				)}

				{isPathAllowed && (
					<div className="flex flex-row justify-end w-full gap-2">
						{!hasAccess &&
							(
								<Tooltip>
									<TooltipTrigger asChild>
										<Button variant="default" size="xs" className="p-2">
											<InfoIcon className="h-4 w-4" />
										</Button>
									</TooltipTrigger>
									<TooltipContent className="bg-card max-w-sm ">
										<div className="flex items-center gap-2 text-xs">


											<Button onClick={() => router.push("/manage-membership")} variant="outline" size="sm" className="ml-2">
												<ShoppingBasket color="#1DE1BA" className="h-4 w-4" />
												Upgrade Plan
											</Button>
										</div>
									</TooltipContent>
								</Tooltip>
							)}
						<Button
							onClick={() => router.push("/generate-my-episodes")}
							variant="default"
							disabled={isLoading || !hasAccess}
						>
							<span>
								<Podcast className="scale-[1.4] w-[30px] h-[30px] mr-2" size={40} />
							</span>
							{isLoading ? "Loading..." : "Generate Custom Episodes"}
						</Button>
					</div>
				)}
			</div>
		</div >
	)
})
PageHeader.displayName = "PageHeader"

export { PageHeader }
