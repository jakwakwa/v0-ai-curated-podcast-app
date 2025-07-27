"use client"

import { UilArrowRight, UilCheckCircle, UilClock, UilFile, UilPlay, UilSetting, UilStar } from "@iconscout/react-unicons"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useFeatureAccess } from "@/components/access-control"
// import styles from "./landing-page-content.module.css"
import styles from "@/components/new/new-landing-page.module.css"
import { Button } from "@/components/ui/button"

export default function LandingPageContent() {
	// Check current subscription level
	const { hasAccess: hasCustomProfiles } = useFeatureAccess("custom_curation_profiles")
	const { hasAccess: hasWeeklyCombo } = useFeatureAccess("weekly_combo")
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

	const testimonials = [
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
								<Button size="lg" className={styles.heroButton}>
									<motion.span className="flex items-center" initial={{ x: 0 }} whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 400 }}>
										Start Free Trial
										<UilArrowRight className={styles.arrowIcon} />
									</motion.span>
								</Button>
							</motion.div>
						</Link>
						<Link href="/about">
							<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
								<Button variant="outline" size="lg" className="text-lg px-8 py-6">
									See How It Works
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
			<section className={styles.testimonialsSection}>
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
			</section>

			{/* Pricing Section */}
			<section className={styles.pricingSection}>
				<div className={styles.pricingContainer}>
					<motion.div className={styles.pricingHeader} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
						<h2 className={styles.pricingTitle}>Choose Your Plan</h2>
						<p className={styles.pricingDescription}>From free discovery to pro-level curation control. Each plan builds on the last to give you exactly what you need.</p>
					</motion.div>
					<div className={styles.pricingGrid}>
						{pricingTiers.map((tier, index) => (
							<motion.div
								key={tier.name}
								className={`${styles.pricingCard} ${tier.popular ? styles.popular : ""}`}
								initial={{ opacity: 0, y: 30, scale: 0.9 }}
								whileInView={{ opacity: 1, y: 0, scale: tier.popular ? 1.05 : 1 }}
								viewport={{ once: true, margin: "-100px" }}
								transition={{
									duration: 0.6,
									ease: "easeOut",
									delay: index * 0.1,
								}}
								whileHover={{
									scale: tier.popular ? 1.08 : 1.03,
									transition: { duration: 0.2 },
								}}
							>
								{tier.popular && (
									<motion.div className={styles.popularBadge} initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
										Most Popular
									</motion.div>
								)}
								<div className={styles.pricingCardContent}>
									<h3 className={styles.pricingCardTitle}>{tier.name}</h3>
									<div className={styles.pricingCardPrice}>
										<span className={styles.price}>{tier.price}</span>
										{tier.price !== "Free" && <span className={styles.duration}>/{tier.duration}</span>}
									</div>
									<p className={styles.pricingCardDescription}>{tier.description}</p>
									<ul className={styles.pricingFeatures}>
										{tier.features.map((feature, featureIndex) => (
											<motion.li
												key={featureIndex}
												className={styles.pricingFeature}
												initial={{ opacity: 0, x: -10 }}
												whileInView={{ opacity: 1, x: 0 }}
												transition={{ delay: 0.3 + featureIndex * 0.1 }}
											>
												<UilCheckCircle className={styles.pricingFeatureIcon} />
												<span className={styles.pricingFeatureText}>{feature}</span>
											</motion.li>
										))}
									</ul>
								</div>
								{(() => {
									const buttonProps = getButtonProps(tier.name)
									return buttonProps.disabled ? (
										<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
											<Button className={styles.pricingButton} variant={buttonProps.variant} size="lg" disabled>
												{buttonProps.children}
											</Button>
										</motion.div>
									) : (
										<Link href="/sign-up">
											<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
												<Button className={styles.pricingButton} variant={buttonProps.variant} size="lg">
													{buttonProps.children}
												</Button>
											</motion.div>
										</Link>
									)
								})()}
							</motion.div>
						))}
					</div>
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
									<Button size="lg" className={styles.ctaButton}>
										<motion.span className="flex items-center" initial={{ x: 0 }} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
											Start Free Trial
											<UilArrowRight className={styles.arrowIcon} />
										</motion.span>
									</Button>
								</motion.div>
							</Link>
							<Link href="/about">
								<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
									<Button variant="outline" size="lg" className={styles.ctaButton}>
										Learn More
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
