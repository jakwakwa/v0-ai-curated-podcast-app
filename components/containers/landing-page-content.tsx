"use client"

import { UilArrowRight, UilCheckCircle, UilClock, UilFile, UilPlay, UilSetting, UilStar } from "@iconscout/react-unicons"
import { motion, useScroll, useTransform } from "framer-motion"
import { CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useSubscriptionStore } from "@/lib/stores/subscription-store"
import styles from "@/styles/landing-page-content.module.css"
import { LandingPageHeader } from "../layout/LandingPageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export default function LandingPageContent() {
	const router = useRouter()
	const { subscription, tiers, initializeTransaction, isLoading } = useSubscriptionStore()

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
			description: "Select from expertly PODSLICE Bundles or pick your favorite shows. Define what matters to you in under 2 minutes.",
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
		{
			step: 4,
			title: "Apply Immediately",
			description: "Listen, learn, and implement. Each summary is designed for immediate action, not just consumption.",
			action: "Take action",
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

	const _testimonials = [
		{
			name: "Sarah Chen",
			role: "Product Manager",
			content:
				"PODSLICE saved me 6 hours last week alone. I was drowning in my podcast backlog, but now I get all the key insights in just 20 minutes. The AI voice is so natural, it's like listening to a human expert who actually knows how to get to the point.",
			rating: 5,
		},
		{
			name: "Marcus Rodriguez",
			role: "PhD Candidate",
			content:
				"I used to struggle through 4-hour podcast episodes for my research. Now I can scan dozens of sources in the same time. The AI voice quality is incredible—it doesn't feel artificial at all. I've reclaimed 8 hours per week for actual work instead of endless listening.",
			rating: 5,
		},
		{
			name: "Jennifer Park",
			role: "CEO",
			content:
				"Game changer for staying informed without the time sink. The AI voice is remarkably human—my team actually thought I was sharing insights from a real industry expert. I'm saving 5+ hours weekly while staying more informed than ever.",
			rating: 5,
		},
	]

	return (
		<div className={styles.container}>
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
						<motion.h1 className={styles.heroTitle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
							<Image className="mx-auto" src={"/logo.png"} width={400} height={200} alt="logo" />
						</motion.h1>
						<motion.p className={styles.heroSubtitle} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}>
							Cut the chatter. Keep the insight.
						</motion.p>
						<motion.p className={styles.heroDescription} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}>
							Tired of sifting through hours of podcasts for that one golden nugget? Stop drowning in endless chatter and information overload. PODSLICE transforms chaotic audio into crystal-clear,
							actionable knowledge with remarkably human AI voices. Reclaim hours each week by getting instant access to key takeaways—no more hunting through rambling conversations for the insights
							that actually matter.
						</motion.p>
					</div>
					<motion.div
						className="flex flex-col sm:flex-row gap-4 justify-center items-center"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
					>
						<Link href="/sign-up">
							<motion.div
								whileHover={{
									scale: 1.02,
									boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
								}}
								whileTap={{ scale: 0.98 }}
							>
								<Button
									size="lg"
									variant="default"
									className="text-lg px-8 py-6 bg-radial-gradient-secondary items-center hover:bg-radial-gradient-secondary/80 hover:scale-105 transition-all duration-200 ease-in-out"
								>
									Start Free Trial
									<UilArrowRight className={styles.arrowIcon} />
								</Button>
							</motion.div>
						</Link>
					</motion.div>
				</div>
			</section>

			{/* Features Section */}
			<section className={styles.featuresSection}>
				<div className={styles.featuresContainer}>
					<motion.div className={styles.featuresHeader} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
						<h2 className={styles.featuresTitle}>Why Choose PODSLICE?</h2>
						<p className={styles.featuresDescription}>We combine human curation with intelligent filtering to deliver focused content that respects your time and delivers maximum value.</p>
					</motion.div>
					<div className={styles.featuresGrid}>
						{features.map((feature, index) => (
							<motion.div
								key={index}
								className={styles.featureCard}
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
									className={styles.featureIcon}
									whileHover={{
										scale: 1.1,
										rotate: 5,
										transition: { duration: 0.2 },
									}}
								>
									{feature.icon}
								</motion.div>
								<h3 className={styles.featureTitle}>{feature.title}</h3>
								<p className={styles.featureDescription}>{feature.description}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section className={styles.howItWorksSection}>
				<div className={styles.howItWorksContainer}>
					<motion.div className={styles.howItWorksHeader} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
						<h2 className={styles.howItWorksTitle}>How PODSLICE Works</h2>
						<p className={styles.howItWorksDescription}>Getting started with PODSLICE is straightforward. Follow these four simple steps to create your focused content experience.</p>
					</motion.div>
					<div className={styles.howItWorksGrid}>
						{howItWorks.map((step, index) => (
							<motion.div
								key={step.step}
								className={styles.stepCard}
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
								<motion.div
									className={styles.stepNumber}
									whileHover={{
										scale: 1.2,
										boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
										transition: { duration: 0.2 },
									}}
								>
									{step.step}
								</motion.div>
								<h3 className={styles.stepTitle}>{step.title}</h3>
								<p className={styles.stepDescription}>{step.description}</p>
								<motion.div className={styles.stepAction} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
									<span>{step.action}</span>
									<UilArrowRight className={styles.arrowIcon} />
								</motion.div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Testimonials Section */}
			{/* <section className={styles.testimonialsSection}>
				<div className={styles.testimonialsContainer}>
					<motion.div
						className={styles.testimonialsHeader}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={{ duration: 0.6 }}
					>
						<h2 className={styles.testimonialsTitle}>What Our Users Say</h2>
						<p className={styles.testimonialsDescription}>Join thousands of satisfied users who are already saving time and getting more value from their content consumption.</p>
					</motion.div>
					<div className={styles.testimonialsGrid}>
						{testimonials.map((testimonial, index) => (
							<motion.div
								key={index}
								className={styles.testimonialCard}
								initial={{ opacity: 0, y: 30, scale: 0.95 }}
								whileInView={{ opacity: 1, y: 0, scale: 1 }}
								viewport={{ once: true, margin: "-100px" }}
								transition={{
									duration: 0.5,
									ease: "easeOut",
									delay: index * 0.1,
								}}
								whileHover={{
									y: -3,
									boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
									transition: { duration: 0.2 },
								}}
							>
								<div className={styles.testimonialRating}>
									{Array.from({ length: testimonial.rating }).map((_, i) => (
										<motion.div key={i} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.1 }}>
											<UilStar className={styles.starIcon} />
										</motion.div>
									))}
								</div>
								<p className={styles.testimonialContent}>"{testimonial.content}"</p>
								<div>
									<p className={styles.testimonialAuthor}>{testimonial.name}</p>
									<p className={styles.testimonialRole}>{testimonial.role}</p>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section> */}

			{/* Pricing Section */}
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
								className={`transition-all border-muted-foreground/10 duration-200 ease-in-out relative h-full flex  "border-2 border-primary/10 flex-col hover:-translate-y-1 hover:shadow-lg ${tier.popular ? "border-2 border-accent scale-105" : ""}`}
							>
								{tier.popular && (
									<Badge variant="outline" size="sm" className="absolute -top-3 left-1/2 -translate-x-1/2 bg-radial-gradient-secondary text-primary-foreground font-semibold border-primary/10">
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
										className={`w-full flex items-center justify-center gap-2 mt-auto ${tier.popular ? "bg-radial-gradient-secondary text-primary-foreground hover:bg-radial-gradient-secondary/80 hover:scale-105 transition-all duration-200 ease-in-out" : ""}`}
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
			{/* CTA Section */}
			<section className={styles.ctaSection}>
				<motion.div className={styles.ctaContainer} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
					<div className={styles.ctaContent}>
						<h2 className={styles.ctaTitle}>Ready to Cut Through the Noise?</h2>
						<p className={styles.ctaDescription}>
							Join thousands of users who are already saving time and getting more value from their content. Start your free trial today and discover focused content that respects your time.
						</p>
						<motion.div className="flex flex-col sm:flex-row gap-4 justify-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
							<Link href="/sign-up">
								<motion.div
									whileHover={{
										scale: 1.05,
										boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
									}}
									whileTap={{ scale: 0.95 }}
								>
									<Button
										size="lg"
										variant="default"
										className="text-lg px-8 py-6 bg-radial-gradient-secondary items-center hover:bg-radial-gradient-secondary/80 hover:scale-105 transition-all duration-200 ease-in-out"
									>
										<motion.span className="flex items-center" initial={{ x: 0 }} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
											Start Free Trial
											<UilArrowRight className={styles.arrowIcon} />
										</motion.span>
									</Button>
								</motion.div>
							</Link>
						</motion.div>
					</div>
				</motion.div>
			</section>

			{/* Footer */}
			<footer className="py-12 px-4 border-t">
				<motion.div className="max-w-7xl mx-auto text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
					<div className="flex justify-center items-center mb-4">
						<motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
							<UilStar className="w-8 h-8 text-primary mr-2" />
						</motion.div>
						<span className="text-2xl font-bold">PODSLICE</span>
					</div>
					<p className="text-muted-foreground mb-4">Cut the chatter. Keep the insight.</p>
					<div className="flex justify-center items-center space-x-6 text-sm text-muted-foreground">
						<Link href="/about" className="hover:text-foreground transition-colors">
							About
						</Link>
						<Link href="/sign-up" className="hover:text-foreground transition-colors">
							Sign Up
						</Link>
						<Link href="/login" className="hover:text-foreground transition-colors">
							Login
						</Link>
					</div>
				</motion.div>
			</footer>
		</div>
	)
}
