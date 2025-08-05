"use client"

import { CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSubscriptionStore } from "@/lib/stores/subscription-store"
// CSS module migrated to Tailwind classes

export default function AboutPage() {
	const router = useRouter()
	const { subscription, tiers, initializeTransaction, isLoading } = useSubscriptionStore()

	const howItWorks = [
		{
			step: 1,
			title: "Create Your Profile",
			description: "Start by building a custom Personalized Feed or choose from our pre-PODSLICE Bundles.",
		},
		{
			step: 2,
			title: "Select Your Content",
			description: "Choose up to 5 individual podcasts or pick one of our 3 PODSLICE Bundles.",
		},
		{
			step: 3,
			title: "Get & Enjoy Your Podcast",
			description: "Our AI processes your selections and generates a personalized episode every Friday, then listen through our built-in audio player.",
		},
	]

	const handleUpgrade = async (planCode: string | undefined) => {
		if (!planCode) {
			console.error("No plan code provided for upgrade.")
			return
		}
		const result = await initializeTransaction(planCode)
		if ("checkoutUrl" in result && result.checkoutUrl) {
			router.push(result.checkoutUrl)
		} else if ("error" in result) {
			console.error("Failed to initialize transaction:", result.error)
		}
	}

	// Determine current plan and button states
	const getCurrentPlanName = () => {
		if (!subscription) return "FreeSlice"
		const currentPlan = tiers.find(tier => tier.paystackPlanCode === subscription.paystackPlanCode)
		return currentPlan?.name || "FreeSlice"
	}

	const getButtonProps = (tier: (typeof tiers)[0]) => {
		const currentPlanName = getCurrentPlanName()
		if (currentPlanName === tier.name) {
			return {
				children: "Active",
				disabled: true,
				variant: "secondary" as const,
				onClick: () => {},
			}
		}

		return {
			children: tier.name === "FreeSlice" ? "Downgrade" : `Upgrade to ${tier.name}`,
			disabled: isLoading,
			variant: tier.popular ? ("default" as const) : ("outline" as const),
			onClick: () => handleUpgrade(tier.paystackPlanCode),
		}
	}

	return (
		<div className="container">
			{/* Short Intro */}
			<section className="text-center pt-16 pb-4 mb-0">
				<div className="max-w-[800px] mx-auto">
					<Image src={"/logo.png"} alt="PODSLICE Logo" width={200} height={200} className="scale-[2] mx-auto mb-8" />

					<p className="text-base leading-6 font-normal tracking-wide mb-8 max-w-[600px] mx-auto">
						Your personal AI-powered podcast curator that creates weekly episodes tailored to your interests. Choose from hand-picked content or create your own custom Personalized Feed.
					</p>
					<div className="flex justify-center items-center space-x-4 text-sm text-muted-foreground mb-8">
						<Link href="/terms" className="hover:text-foreground transition-colors">
							Terms of Service
						</Link>
						<span>•</span>
						<Link href="/privacy" className="hover:text-foreground transition-colors">
							Privacy Policy
						</Link>
					</div>
				</div>
			</section>
			{/* How It Works */}
			<section className="mb-16 p-16">
				<div className="text-center mb-12">
					<h2 className="text-3xl leading-9 font-semibold tracking-tight mb-4">How It Works!</h2>
					<p className="text-base leading-6 font-normal tracking-wide max-w-[600px] mx-auto">
						Getting started with PODSLICE is simple. Follow these three easy steps to create your personalized podcast experience.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{howItWorks.map(step => (
						<Card key={step.step} className="transition-all duration-200 ease-in-out h-full relative hover:-translate-y-1 hover:shadow-lg">
							<CardHeader>
								<div className="flex items-center justify-center w-10 h-10 rounded-full bg-radial-gradient-secondary text-primary-foreground font-semibold text-lg mb-4">{step.step}</div>
								<CardTitle className="text-xl leading-7 font-semibold tracking-tight mb-2">{step.title}</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground leading-relaxed mb-4">{step.description}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</section>
			{/* Pricing */}
			<section className="mb-16 p-16">
				<div className="text-center mb-12">
					<h2 className="text-3xl leading-9 font-semibold tracking-tight mb-4">Choose Your Plan</h2>
					<p className="text-base leading-6 font-normal tracking-wide max-w-[600px] mx-auto">
						From free discovery to pro-level curation control. Each plan builds on the last to give you exactly what you need.
					</p>
				</div>

				<div className="grid grid-cols-1 gap-8 max-w-[1200px] mx-auto lg:grid-cols-3 lg:max-w-[1400px]">
					{tiers.map(tier => {
						const buttonProps = getButtonProps(tier)
						return (
							<Card
								key={tier.name}
								className={`transition-all duration-200 ease-in-out relative h-full flex flex-col hover:-translate-y-1 hover:shadow-lg ${tier.popular ? "border-2 border-primary scale-105" : ""}`}
							>
								{tier.popular && (
									<Badge variant="secondary" size="sm" className="absolute -top-3 left-1/2 -translate-x-1/2 bg-radial-gradient-secondary text-primary-foreground font-semibold">
										Most Popular
									</Badge>
								)}
								<CardHeader>
									<div className="flex flex-col mt-4">
										<CardTitle className="text-xl leading-7 font-semibold tracking-tight mb-2">{tier.name}</CardTitle>
										<div className="flex items-baseline gap-1 mb-4">
											<span className="text-3xl leading-9 font-bold tracking-tight">${tier.price}</span>
											{tier.price !== 0 && <span className="text-sm text-muted-foreground">/month</span>}
										</div>
										<p className="text-sm text-muted-foreground mt-2 leading-relaxed">{tier.description}</p>
									</div>
								</CardHeader>
								<CardContent className="flex flex-col flex-1 justify-between">
									<ul className="list-none p-0 m-0 mb-8">
										{tier.features.map((feature, index) => (
											<li key={index} className="flex items-center gap-3 py-2 text-muted-foreground">
												<CheckCircle size={16} className="text-primary flex-shrink-0" />
												{feature}
											</li>
										))}
									</ul>
									<Button
										className={`w-full flex items-center justify-center gap-2 mt-auto ${tier.popular ? "bg-primary text-primary-foreground" : ""}`}
										variant={buttonProps.variant}
										size="lg"
										disabled={buttonProps.disabled}
										onClick={buttonProps.onClick}
									>
										{buttonProps.children}
									</Button>
								</CardContent>
							</Card>
						)
					})}
				</div>
			</section>
		</div>
	)
}
