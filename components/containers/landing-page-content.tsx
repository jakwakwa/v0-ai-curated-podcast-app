"use client"

import { UilCheckCircle, UilClock, UilFile, UilPlay, UilSetting, UilStar } from "@iconscout/react-unicons"
import { motion, useScroll, useTransform } from "framer-motion"
import { CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import LandingAudioPlayer from "@/components/demo/landing-audio-player"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import styles from "@/styles/landing-page-content.module.css"
import { LandingPageHeader } from "../layout/LandingPageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Typography } from "../ui/typography"
import { HomePageBackground } from "./home-page-background"

// Hardcoded subscription tiers for landing page
const SUBSCRIPTION_TIERS = [
	{
		id: "freeslice",
		name: "FreeSlice",
		price: 0,
		description: "Perfect for podcast discovery and light listening",
		features: ["Always free", "Free member", "Free Bundle"],
		popular: false,
	},
	{
		id: "casual_listener",
		name: "Casual Listener",
		price: 5,
		description: "Enhanced experience with premium features and priority access",
		features: ["Only billed monthly", "Free member", "Free Bundle"],
		popular: false,
	},
	{
		id: "curate_control",
		name: "Curate & Control",
		price: 10,
		description: "Ultimate control with unlimited custom curation profiles",
		features: ["Only billed monthly", "custom-curation-profiles", "Free member", "Free Bundle"],
		popular: true,
	},
]

export default function LandingPageContent() {
	const features = [
		{
			icon: <UilStar className="w-6 h-6" />,
			title: "Instantly grasp key takeaways in minutes, not hours",
			description:
				"Transform your overwhelm into clarity. No more struggling through lengthy episodes hoping to catch that one crucial insight. Our AI cuts straight to what matters, saving you 3-5 hours per week while ensuring you never miss the breakthrough moments that could change your perspective",
		},
		{
			icon: <UilPlay className="w-6 h-6" />,
			title: "Experience insights delivered in a remarkably human voice",
			description:
				"Forget robotic, artificial-sounding AI. Our advanced voice technology delivers summaries that feel like having a conversation with a knowledgeable friend—natural, engaging, and trustworthy. You'll actually want to listen, making every insight stick.",
		},
		{
			icon: <UilFile className="w-6 h-6" />,
			title: "Effortlessly search and review every word spoken",
			description:
				"Stop frantically taking notes or rewinding endlessly. Every key point is instantly searchable and reviewable. Find that specific quote, concept, or data point in seconds instead of scrubbing through audio files for minutes.",
		},
		{
			icon: <UilCheckCircle className="w-6 h-6" />,
			title: "Pinpoint the most critical information in seconds",
			description:
				"Cut through the noise to find what truly matters. Our intelligent extraction identifies the 3-5 most impactful insights from each episode, so you can immediately apply what you've learned instead of wondering what to do with scattered information.",
		},
		{
			icon: <UilSetting className="w-6 h-6" />,
			title: "Transform chaotic audio into crystal-clear knowledge",
			description:
				"Convert information overload into competitive advantage. Turn hours of scattered podcast listening into focused, purposeful learning that directly impacts your goals and decisions.",
		},
		{
			icon: <UilClock className="w-6 h-6" />,
			title: "Weekly Efficiency Delivered",
			description:
				"Fresh, focused episodes delivered every Friday - no more hunting through hours of content for the good parts. Get your personalized intelligence briefing and reclaim your weekend.",
		},
	]

	const howItWorks = [
		{
			step: 1,
			title: "Choose Your Focus",
			description: "Select from expertly Podslice.ai Bundles or pick your favorite shows. Define what matters to you in under 2 minutes.",
			action: "Start your profile",
		},
		{
			step: 2,
			title: "Let AI Work",
			description: "Our intelligent system processes your selections and extracts only the most valuable insights from each episode.",
			action: "AI processes content",
		},
		{
			step: 3,
			title: "Receive Weekly Insights",
			description: "Get your personalized, human-quality audio summary delivered every Friday—no hunting, no fluff, just pure value.",
			action: "Get your briefing",
		},
	]

	return (
		<div className={styles.container}>
			<HomePageBackground />
			<LandingPageHeader />
			{/* Hero Section */}
			<section className={styles.heroSection}>
				<motion.div
					className={styles.heroBackground}
					style={{
						translateY: useTransform(useScroll().scrollY, [0, 500], [0, -150]),
					}}
				/>
				<div className={styles.heroContainer}>
					<div className={styles.heroContent}>
						<motion.div className={styles.badge} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
							<svg className={styles.badgeIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" fill="currentColor" />
							</svg>
							Coming Soon - Revolutionary AI Audio Processing
						</motion.div>
						<motion.h1 className={styles.heroHeading} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
							Cut the chatter.
							<br />
							<span className={styles.heroHeadingHighlight}>Keep the insight.</span>
						</motion.h1>
						<motion.p className={styles.heroDescription} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}>
							Tired of sifting through hours of podcasts for that one golden nugget? Podslice.ai transforms chaotic audio into crystal-clear, actionable knowledge with remarkably human AI voices.
						</motion.p>
					</div>
					<motion.div
						className="flex flex-col sm:flex-row gap-4 justify-center items-center"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
					>
						<Link href="/sign-up">
							<div>
								<div className={styles.heroBtn}>Start Free Trial</div>
							</div>
						</Link>
					</motion.div>
					{/* Demo Audio Player */}
					<div className="mt-4 w-full max-w-3xl mx-auto px-4">
						<LandingAudioPlayer title="Podslice Sample" subtitle="Listen here for a short sample of what you can expect" />
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className={styles.featuresSection}>
				<div className={styles.featuresContainer}>
					<motion.div className={styles.featuresHeader} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
						<Typography as="h1" className="text-accent-selection">
							Why Choose Podslice.ai?
						</Typography>
						<Typography className="max-w-full text-left md:max-w-2xl mx-auto px-4 md:text-center pb-8 mt-4 text-custom-md">
							We combine human curation with intelligent filtering to deliver focused content that respects your time and delivers maximum value.
						</Typography>
					</motion.div>
					<div className={styles.featuresGrid}>
						{features.map((feature, index) => (
							<motion.div
								key={index}
								className="episode-card rounded-xl flex flex-col p-8"
								initial={{ opacity: 0, y: 30, scale: 0.95 }}
								whileInView={{ opacity: 1, y: 0, scale: 1 }}
								viewport={{ once: true, margin: "-100px" }}
								transition={{
									duration: 0.5,
									ease: "easeOut",
									delay: index * 0.1,
								}}
								whileHover={{
									y: -5,
									transition: { duration: 0.2 },
								}}
							>
								<motion.div
									className="rounded-full text-accent bg-[#000]/50 mb-3 inline-flex justify-center items-center w-10 h-10"
									whileHover={{
										scale: 1.1,
										rotate: 5,
										transition: { duration: 0.2 },
									}}
								>
									{feature.icon}
								</motion.div>
								<Typography as="h3" className="text-secondary-foreground/80 mb-2">
									{feature.title}
								</Typography>
								<Typography as="p" className="text-primary text-custom-body">
									{feature.description}
								</Typography>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section className={`${styles.howItWorksSection} text-left md:text-center p-4 md:p-16`}>
				<div className={styles.howItWorksContainer}>
					<motion.div className={styles.howItWorksHeader} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
						<Typography as="h1">How Podslice.ai Works</Typography>
						<Typography className="max-w-full text-left md:max-w-2xl mx-auto px-4 md:text-center pb-8 mt-4 text-custom-md">
							Getting started with Podslice.ai is straightforward. Follow these four simple steps to create your focused content experience.
						</Typography>
					</motion.div>
					<div className={styles.howItWorksGrid}>
						{howItWorks.map((step, index) => (
							<motion.div
								key={step.step}
								className="bg-background/50 p-8 rounded-2xl border-2 border-dark shadow-lg"
								initial={{ opacity: 0, y: 30, scale: 0.95 }}
								whileInView={{ opacity: 1, y: 0, scale: 1 }}
								viewport={{ once: true, margin: "-100px" }}
								transition={{
									duration: 0.5,
									ease: "easeOut",
									delay: index * 0.15,
								}}
								whileHover={{
									y: -5,
									scale: 1.02,
									transition: { duration: 0.2 },
								}}
							>
								<div className="rounded-full text-accent bg-[#000]/50 mb-3 inline-flex justify-center items-center w-10 h-10">{step.step}</div>
								<h3 className={styles.stepTitle}>{step.title}</h3>
								<p className="text-custom-body">{step.description}</p>
								{/* <motion.div className={styles.stepAction} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
									<span className="text-sm bg-secondary px-2 py-1 rounded-md">{step.action}</span>
								</motion.div> */}
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Pricing Section */}
			<section className={styles.pricingSection}>
				<div className={styles.pricingContainer}>
					<div className={styles.pricingHeader}>
						<Typography as="h1">Choose Your Plan</Typography>
						<Typography className="max-w-full text-left md:max-w-2xl mx-auto px-4 md:text-center pb-8 mt-4 text-custom-md">
							From free discovery to pro-level curation control. Each plan builds on the last to give you exactly what you need.
						</Typography>
					</div>
					<div className={styles.pricingGrid}>
						{SUBSCRIPTION_TIERS.map(tier => (
							<Card
								key={tier.name}
								className={`bg-card transition-all border-muted-foreground/10 duration-200 ease-in-out relative h-full flex  "border-2 border-primary/10 flex-col hover:-translate-y-1 hover:shadow-lg ${tier.popular ? "border-2 border-accent" : ""}`}
							>
								{tier.popular && (
									<Badge
										variant="outline"
										size="sm"
										className="absolute -top-3 left-1/2 -translate-x-1/2 bg-radial-gradient-secondary text-primary-foreground px-3 py-2 font-semibold border-primary/10 rounded-2xl"
									>
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
									<Link href="/sign-up">
										<Button
											className={`w-full flex items-center justify-center gap-2 mt-auto ${tier.popular ? "bg-radial-gradient-secondary text-primary-foreground hover:bg-radial-gradient-secondary/80 transition-all duration-200 ease-in-out" : ""}`}
											variant={tier.popular ? "default" : "outline"}
											size="lg"
										>
											{tier.name === "FreeSlice" ? "Start Free" : "Start Free Trial"}
										</Button>
									</Link>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Waitlist Form (hero inline style) */}
			<section>
				<form className={styles.waitlistForm}>
					<div className={styles.waitlistInput}>
						<input className={styles.waitlistInputField} type="email" placeholder="Enter your email for early access" />
					</div>
					<button className={styles.waitlistButton} type="button">
						Join Waitlist
						<svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M13 5l7 7-7 7M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</button>
				</form>
			</section>

			{/* Footer */}
			<footer className="py-8 md:py-12 px-2 md:px-4 bg-radial-gradient mt-24">
				<motion.div className="max-w-screen md:max-w-7xl mx-auto text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
					<div className="flex justify-center items-center mb-4">
						<Image src="/logo.png" width={90} height={40} alt="PODSLICE Logo" />
					</div>
					<div className="flex justify-center items-center space-x-6 text-sm text-foreground/70">
						<Link href="/sign-up" className="hover:text-foreground transition-colors">
							Sign Up
						</Link>
						<Link href="/login" className="hover:text-foreground transition-colors">
							Login
						</Link>
						<Link href="/terms" className="hover:text-foreground transition-colors">
							Terms
						</Link>
						<Link href="/privacy" className="hover:text-foreground transition-colors">
							Privacy
						</Link>
					</div>
				</motion.div>
			</footer>
		</div>
	)
}
