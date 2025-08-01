"use client"

import { CheckCircle } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSubscriptionStore } from "@/lib/stores/subscription-store"
import styles from "./page.module.css"

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
			<section className={styles.hero}>
				<div className={styles.heroContent}>
					<Image src={"/logo.png"} alt="PODSLICE Logo" width={200} height={200} />

					<p className={styles.heroDescription}>
						Your personal AI-powered podcast curator that creates weekly episodes tailored to your interests. Choose from hand-picked content or create your own custom Personalized Feed.
					</p>
				</div>
			</section>
			{/* How It Works */}
			<section className={styles.section}>
				<div className={styles.sectionHeader}>
					<h2 className={styles.sectionTitle}>How It Works!</h2>
					<p className={styles.sectionDescription}>Getting started with PODSLICE is simple. Follow these three easy steps to create your personalized podcast experience.</p>
				</div>

				<div className={styles.stepsGrid}>
					{howItWorks.map(step => (
						<Card key={step.step} className={styles.stepCard}>
							<CardHeader>
								<div className={styles.stepNumber}>{step.step}</div>
								<CardTitle className={styles.stepTitle}>{step.title}</CardTitle>
							</CardHeader>
							<CardContent>
								<p className={styles.stepDescription}>{step.description}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</section>
			{/* Pricing */}
			<section className={styles.section}>
				<div className={styles.sectionHeader}>
					<h2 className={styles.sectionTitle}>Choose Your Plan</h2>
					<p className={styles.sectionDescription}>From free discovery to pro-level curation control. Each plan builds on the last to give you exactly what you need.</p>
				</div>

				<div className={styles.pricingGrid}>
					{tiers.map(tier => {
						const buttonProps = getButtonProps(tier)
						return (
							<Card key={tier.name} className={`${styles.pricingCard} ${tier.popular ? styles.popularCard : ""}`}>
								{tier.popular && <Badge className={styles.popularBadge}>Most Popular</Badge>}
								<CardHeader>
									<div className="flex flex-col mt-4">
										<CardTitle className={styles.pricingTitle}>{tier.name}</CardTitle>
										<div className={styles.pricingAmount}>
											<span className={styles.price}>${tier.price}</span>
											{tier.price !== 0 && <span className={styles.duration}>/month</span>}
										</div>
										<p className={styles.pricingDescription}>{tier.description}</p>
									</div>
								</CardHeader>
								<CardContent className={styles.pricingCardContent}>
									<ul className={styles.featuresList}>
										{tier.features.map((feature, index) => (
											<li key={index} className={styles.featureItem}>
												<CheckCircle size={16} className={styles.checkIcon} />
												{feature}
											</li>
										))}
									</ul>
									<Button
										className={`${styles.pricingButton} ${tier.popular ? styles.popularButton : ""}`}
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
