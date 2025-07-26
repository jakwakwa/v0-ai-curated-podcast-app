"use client"

import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { useFeatureAccess } from "@/components/access-control"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import styles from "./page.module.css"
import Image from "next/image"

export default function AboutPage() {
	// Check current subscription level
	const { hasAccess: hasCustomProfiles } = useFeatureAccess("custom_curation_profiles")
	const { hasAccess: hasWeeklyCombo } = useFeatureAccess("weekly_combo")
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

	const pricingTiers = [
		{
			name: "FreeSlice",
			price: "Free",
			duration: "forever",
			description: "Perfect for podcast discovery and light listening",
			features: [
				"Access to 3 pre-selected PODSLICE Bundles (Tech, Business, Culture)",
				"1 weekly combo episode (20-30 minutes)",
				"Standard audio quality",
				"Basic podcast player with essential controls",
				"Community forums access",
			],
			popular: false,
			cta: "Get Started Free",
		},
		{
			name: "Casual Listener",
			price: "$5",
			duration: "per month",
			description: "Enhanced experience with premium features and priority access",
			features: [
				"Access to ALL available PODSLICE Bundles (10+ categories)",
				"Up to 3 weekly episodes (30-45 minutes each)",
				"Premium audio quality with enhanced voice synthesis",
				"Priority processing - episodes ready by Friday morning",
				"Advanced player with speed controls, bookmarks, and offline download",
				"Email notifications when episodes are ready",
			],
			popular: false,
			cta: "Upgrade to Casual",
		},
		{
			name: "Curate & Control",
			price: "$10",
			duration: "per month",
			description: "Ultimate control with unlimited custom curation profiles",
			features: [
				"Everything in Casual Listener, plus:",
				"Create unlimited custom Personalized Feeds from 25+ hand-picked podcasts",
				"Advanced AI curation that learns your preferences and adapts over time",
				"Custom episode themes and topics - guide the AI to focus on specific subjects",
			],
			popular: true,
			cta: "Go Pro",
		},
	]

	// Determine current plan and button states
	const getCurrentPlan = () => {
		if (hasCustomProfiles) return "Curate & Control"
		if (hasWeeklyCombo) return "Casual Listener"
		return "FreeSlice"
	}

	const getButtonProps = (tierName: string) => {
		const currentPlan = getCurrentPlan()
		if (currentPlan === tierName) {
			return {
				children: "Active",
				disabled: true,
				variant: "secondary" as const,
			}
		}

		const tier = pricingTiers.find(t => t.name === tierName)
		return {
			children: tierName === "FreeSlice" ? "Downgrade" : tier?.cta,
			disabled: false,
			variant: tier?.popular ? ("default" as const) : ("outline" as const),
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
					<h2 className={styles.sectionTitle}>How It Works</h2>
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
					{pricingTiers.map(tier => (
						<Card key={tier.name} className={`${styles.pricingCard} ${tier.popular ? styles.popularCard : ""}`}>
							{tier.popular && <Badge className={styles.popularBadge}>Most Popular</Badge>}
							<CardHeader>
								<div className="flex flex-col mt-4">
									<CardTitle className={styles.pricingTitle}>{tier.name}</CardTitle>
									<div className={styles.pricingAmount}>
										<span className={styles.price}>{tier.price}</span>
										{tier.price !== "Free" && <span className={styles.duration}>/{tier.duration}</span>}
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
								{(() => {
									const buttonProps = getButtonProps(tier.name)
									return buttonProps.disabled ? (
										<Button className={`${styles.pricingButton}`} variant={buttonProps.variant} size="lg" disabled>
											{buttonProps.children}
										</Button>
									) : (
										<Link href="/subscription">
											<Button className={`${styles.pricingButton} ${tier.popular ? styles.popularButton : ""}`} variant={buttonProps.variant} size="lg">
												{buttonProps.children}
											</Button>
										</Link>
									)
								})()}
							</CardContent>
						</Card>
					))}
				</div>
			</section>
		</div>
	)
}
