"use client"

import { UilArrowRight, UilCheckCircle, UilClock, UilFile, UilPlay, UilSetting, UilStar } from "@iconscout/react-unicons"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"

export default function LandingPageContent() {
	const features = [
		{
			icon: <UilStar className="w-6 h-6" />,
			title: "Instantly grasp key takeaways in minutes, not hours",
			description: "Transform your overwhelm into clarity. No more struggling through lengthy episodes hoping to catch that one crucial insight. Our AI cuts straight to what matters, saving you 3-5 hours per week while ensuring you never miss the breakthrough moments that could change your perspective.",
		},
		{
			icon: <UilPlay className="w-6 h-6" />,
			title: "Experience insights delivered in a remarkably human voice",
			description: "Forget robotic, artificial-sounding AI. Our advanced voice technology delivers summaries that feel like having a conversation with a knowledgeable friend—natural, engaging, and trustworthy. You'll actually want to listen, making every insight stick.",
		},
		{
			icon: <UilFile className="w-6 h-6" />,
			title: "Effortlessly search and review every word spoken",
			description: "Stop frantically taking notes or rewinding endlessly. Every key point is instantly searchable and reviewable. Find that specific quote, concept, or data point in seconds instead of scrubbing through audio files for minutes.",
		},
		{
			icon: <UilCheckCircle className="w-6 h-6" />,
			title: "Pinpoint the most critical information in seconds",
			description: "Cut through the noise to find what truly matters. Our intelligent extraction identifies the 3-5 most impactful insights from each episode, so you can immediately apply what you've learned instead of wondering what to do with scattered information.",
		},
		{
			icon: <UilSetting className="w-6 h-6" />,
			title: "Transform chaotic audio into crystal-clear knowledge",
			description: "Convert information overload into competitive advantage. Turn hours of scattered podcast listening into focused, purposeful learning that directly impacts your goals and decisions.",
		},
		{
			icon: <UilClock className="w-6 h-6" />,
			title: "Weekly Efficiency Delivered",
			description: "Fresh, focused episodes delivered every Friday - no more hunting through hours of content for the good parts. Get your personalized intelligence briefing and reclaim your weekend.",
		},
	]

	const howItWorks = [
		{
			step: 1,
			title: "Choose Your Focus",
			description: "Select from expertly curated bundles or pick your favorite shows. Define what matters to you in under 2 minutes.",
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
			name: "Free Trial",
			price: "R0",
			duration: "1 week",
			features: ["1 content profile", "Weekly filtering", "Access to curated content", "Basic support"],
			popular: false,
		},
		{
			name: "Premium",
			price: "R99",
			duration: "per month",
			features: ["Unlimited content profiles", "Weekly filtering", "Priority support", "Detailed analytics", "Early access to new features"],
			popular: true,
		},
	]

	const testimonials = [
		{
			name: "Sarah Chen",
			role: "Product Manager",
			content: "PodSlice saved me 6 hours last week alone. I was drowning in my podcast backlog, but now I get all the key insights in just 20 minutes. The AI voice is so natural, it's like listening to a human expert who actually knows how to get to the point.",
			rating: 5,
		},
		{
			name: "Marcus Rodriguez", 
			role: "PhD Candidate",
			content: "I used to struggle through 4-hour podcast episodes for my research. Now I can scan dozens of sources in the same time. The AI voice quality is incredible—it doesn't feel artificial at all. I've reclaimed 8 hours per week for actual work instead of endless listening.",
			rating: 5,
		},
		{
			name: "Jennifer Park",
			role: "CEO",
			content: "Game changer for staying informed without the time sink. The AI voice is remarkably human—my team actually thought I was sharing insights from a real industry expert. I'm saving 5+ hours weekly while staying more informed than ever.",
			rating: 5,
		},
	]

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<section className="relative overflow-hidden py-20 px-4">
				<motion.div 
					className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"
					style={{
						translateY: useTransform(useScroll().scrollY, [0, 500], [0, -150])
					}}
				/>
				<div className="max-w-7xl mx-auto text-center relative z-10">
					<div className="mb-8">
						<motion.h1 
							className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, ease: "easeOut" }}
						>
							PodSlice
						</motion.h1>
						<motion.p 
							className="text-xl md:text-2xl text-muted-foreground mb-4 font-semibold"
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
						>
							Cut the chatter. Keep the insight.
						</motion.p>
						<motion.p 
							className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
						>
							Tired of sifting through hours of podcasts for that one golden nugget? Stop drowning in endless chatter and information overload. PodSlice transforms chaotic audio into crystal-clear, actionable knowledge with remarkably human AI voices. Reclaim hours each week by getting instant access to key takeaways—no more hunting through rambling conversations for the insights that actually matter.
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
									boxShadow: "0 8px 30px rgba(0,0,0,0.12)"
								}}
								whileTap={{ scale: 0.98 }}
							>
								<Button size="lg" className="text-lg px-8 py-6">
									<motion.span
										className="flex items-center"
										initial={{ x: 0 }}
										whileHover={{ x: 3 }}
										transition={{ type: "spring", stiffness: 400 }}
									>
										Start Free Trial
										<UilArrowRight className="ml-2 h-5 w-5" />
									</motion.span>
								</Button>
							</motion.div>
						</Link>
						<Link href="/about">
							<motion.div
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<Button variant="outline" size="lg" className="text-lg px-8 py-6">
									See How It Works
								</Button>
							</motion.div>
						</Link>
					</motion.div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20 px-4 bg-card">
				<div className="max-w-7xl mx-auto">
					<motion.div 
						className="text-center mb-16"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={{ duration: 0.6 }}
					>
						<h2 className="text-4xl font-bold mb-4">Why Choose PodSlice?</h2>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
							We combine human curation with intelligent filtering to deliver focused content that respects your time and delivers maximum value.
						</p>
					</motion.div>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{features.map((feature, index) => (
							<motion.div 
								key={index} 
								className="p-6 rounded-lg border bg-background hover:shadow-lg transition-all"
								initial={{ opacity: 0, y: 30, scale: 0.95 }}
								whileInView={{ opacity: 1, y: 0, scale: 1 }}
								viewport={{ once: true, margin: "-100px" }}
								transition={{ 
									duration: 0.5, 
									ease: "easeOut",
									delay: index * 0.1
								}}
								whileHover={{ 
									y: -5, 
									transition: { duration: 0.2 } 
								}}
							>
								<motion.div 
									className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground mb-4"
									whileHover={{ 
										scale: 1.1,
										rotate: 5,
										transition: { duration: 0.2 }
									}}
								>
									{feature.icon}
								</motion.div>
								<h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
								<p className="text-muted-foreground">{feature.description}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section className="py-20 px-4">
				<div className="max-w-7xl mx-auto">
					<motion.div 
						className="text-center mb-16"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={{ duration: 0.6 }}
					>
						<h2 className="text-4xl font-bold mb-4">How PodSlice Works</h2>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
							Getting started with PodSlice is straightforward. Follow these four simple steps to create your focused content experience.
						</p>
					</motion.div>
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{howItWorks.map((step, index) => (
							<motion.div 
								key={step.step} 
								className="text-center p-6 rounded-lg border bg-card hover:shadow-lg transition-all"
								initial={{ opacity: 0, y: 30, scale: 0.95 }}
								whileInView={{ opacity: 1, y: 0, scale: 1 }}
								viewport={{ once: true, margin: "-100px" }}
								transition={{ 
									duration: 0.5, 
									ease: "easeOut",
									delay: index * 0.15
								}}
								whileHover={{ 
									y: -5, 
									scale: 1.02,
									transition: { duration: 0.2 } 
								}}
							>
								<motion.div 
									className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-4"
									whileHover={{ 
										scale: 1.2,
										boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
										transition: { duration: 0.2 }
									}}
								>
									{step.step}
								</motion.div>
								<h3 className="text-xl font-semibold mb-2">{step.title}</h3>
								<p className="text-muted-foreground mb-4">{step.description}</p>
								<motion.div 
									className="flex items-center justify-center text-primary text-sm font-medium"
									whileHover={{ x: 5 }}
									transition={{ type: "spring", stiffness: 400 }}
								>
									<span>{step.action}</span>
									<UilArrowRight className="ml-1 h-4 w-4" />
								</motion.div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Testimonials Section */}
			<section className="py-20 px-4 bg-card">
				<div className="max-w-7xl mx-auto">
					<motion.div 
						className="text-center mb-16"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={{ duration: 0.6 }}
					>
						<h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">Join thousands of satisfied users who are already saving time and getting more value from their content consumption.</p>
					</motion.div>
					<div className="grid md:grid-cols-3 gap-8">
						{testimonials.map((testimonial, index) => (
							<motion.div 
								key={index} 
								className="p-6 rounded-lg border bg-background"
								initial={{ opacity: 0, y: 30, scale: 0.95 }}
								whileInView={{ opacity: 1, y: 0, scale: 1 }}
								viewport={{ once: true, margin: "-100px" }}
								transition={{ 
									duration: 0.5, 
									ease: "easeOut",
									delay: index * 0.1
								}}
								whileHover={{ 
									y: -3, 
									boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
									transition: { duration: 0.2 } 
								}}
							>
								<div className="flex items-center mb-4">
									{Array.from({ length: testimonial.rating }).map((_, i) => (
										<motion.div
											key={i}
											initial={{ opacity: 0, scale: 0 }}
											whileInView={{ opacity: 1, scale: 1 }}
											transition={{ delay: 0.5 + i * 0.1 }}
										>
											<UilStar className="w-5 h-5 text-yellow-400 fill-current" />
										</motion.div>
									))}
								</div>
								<p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
								<div>
									<p className="font-semibold">{testimonial.name}</p>
									<p className="text-sm text-muted-foreground">{testimonial.role}</p>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Pricing Section */}
			<section className="py-20 px-4">
				<div className="max-w-7xl mx-auto">
					<motion.div 
						className="text-center mb-16"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={{ duration: 0.6 }}
					>
						<h2 className="text-4xl font-bold mb-4">Simple Pricing</h2>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">Start with a free trial and upgrade when you're ready for unlimited focused content.</p>
					</motion.div>
					<div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
						{pricingTiers.map((tier, index) => (
							<motion.div 
								key={tier.name} 
								className={`p-8 rounded-lg border relative ${tier.popular ? "border-primary shadow-lg scale-105" : "bg-card"}`}
								initial={{ opacity: 0, y: 30, scale: 0.9 }}
								whileInView={{ opacity: 1, y: 0, scale: tier.popular ? 1.05 : 1 }}
								viewport={{ once: true, margin: "-100px" }}
								transition={{ 
									duration: 0.6, 
									ease: "easeOut",
									delay: index * 0.1
								}}
								whileHover={{ 
									scale: tier.popular ? 1.08 : 1.03,
									transition: { duration: 0.2 } 
								}}
							>
								{tier.popular && (
									<motion.div 
										className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold"
										initial={{ opacity: 0, y: -10 }}
										whileInView={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.5 }}
									>
										Most Popular
									</motion.div>
								)}
								<h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
								<div className="mb-6">
									<span className="text-4xl font-bold">{tier.price}</span>
									<span className="text-muted-foreground">/{tier.duration}</span>
								</div>
								<ul className="space-y-3 mb-8">
									{tier.features.map((feature, featureIndex) => (
										<motion.li 
											key={featureIndex} 
											className="flex items-center"
											initial={{ opacity: 0, x: -10 }}
											whileInView={{ opacity: 1, x: 0 }}
											transition={{ delay: 0.3 + featureIndex * 0.1 }}
										>
											<UilCheckCircle className="w-5 h-5 text-primary mr-3" />
											{feature}
										</motion.li>
									))}
								</ul>
								<Link href="/sign-up">
									<motion.div
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										<Button className="w-full" variant={tier.popular ? "default" : "outline"} size="lg">
											{tier.name === "Free Trial" ? "Start Trial" : "Upgrade Now"}
										</Button>
									</motion.div>
								</Link>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 px-4 bg-card">
				<motion.div 
					className="max-w-4xl mx-auto text-center"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={{ duration: 0.6 }}
				>
					<h2 className="text-4xl font-bold mb-4">Ready to Cut Through the Noise?</h2>
					<p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
						Join thousands of users who are already saving time and getting more value from their content. Start your free trial today and discover focused content that respects your time.
					</p>
					<motion.div 
						className="flex flex-col sm:flex-row gap-4 justify-center"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.6 }}
					>
						<Link href="/sign-up">
							<motion.div
								whileHover={{ 
									scale: 1.05,
									boxShadow: "0 10px 40px rgba(0,0,0,0.15)"
								}}
								whileTap={{ scale: 0.95 }}
							>
								<Button size="lg" className="text-lg px-8 py-6">
									<motion.span
										className="flex items-center"
										initial={{ x: 0 }}
										whileHover={{ x: 5 }}
										transition={{ type: "spring", stiffness: 400 }}
									>
										Start Free Trial
										<UilArrowRight className="ml-2 h-5 w-5" />
									</motion.span>
								</Button>
							</motion.div>
						</Link>
						<Link href="/about">
							<motion.div
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<Button variant="outline" size="lg" className="text-lg px-8 py-6">
									Learn More
								</Button>
							</motion.div>
						</Link>
					</motion.div>
				</motion.div>
			</section>

			{/* Footer */}
			<footer className="py-12 px-4 border-t">
				<motion.div 
					className="max-w-7xl mx-auto text-center"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<div className="flex justify-center items-center mb-4">
						<motion.div
							whileHover={{ rotate: 360 }}
							transition={{ duration: 0.6 }}
						>
							<UilStar className="w-8 h-8 text-primary mr-2" />
						</motion.div>
						<span className="text-2xl font-bold">PodSlice</span>
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
