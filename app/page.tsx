import { auth } from "@clerk/nextjs/server"
import { ArrowRight, Calendar, CheckCircle, Clock, Filter, Play, Podcast, Scissors, Settings, Sparkles, Star, Target, Users, Zap } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"

// Force this page to be dynamic since it uses auth()
export const dynamic = "force-dynamic"

export default async function LandingPage() {
	const { userId } = await auth()

	// If user is authenticated, redirect to dashboard
	if (userId) {
		redirect("/dashboard")
	}

	const features = [
		{
			icon: <Scissors className="w-6 h-6" />,
			title: "Cut Through the Noise",
			description: "Skip the fluff and get straight to the insights. Our intelligent filtering extracts only the valuable content from your favorite podcasts.",
		},
		{
			icon: <Target className="w-6 h-6" />,
			title: "Precision Curation",
			description: "Choose from 25 hand-picked shows or select from 3 expertly curated bundles designed to deliver maximum insight.",
		},
		{
			icon: <Filter className="w-6 h-6" />,
			title: "Smart Content Filtering",
			description: "Create custom profiles that match your interests and automatically filter out irrelevant content.",
		},
		{
			icon: <Clock className="w-6 h-6" />,
			title: "Weekly Efficiency",
			description: "Fresh, focused episodes delivered every Friday - no more hunting through hours of content for the good parts.",
		},
		{
			icon: <Play className="w-6 h-6" />,
			title: "Crystal Clear Audio",
			description: "Enjoy professionally produced episodes with clear narration and seamless transitions that respect your time.",
		},
		{
			icon: <Settings className="w-6 h-6" />,
			title: "Simple Control",
			description: "Manage your content preferences, track your listening history, and control your subscription with ease.",
		},
	]

	const howItWorks = [
		{
			step: 1,
			title: "Define Your Focus",
			description: "Build a custom profile or choose from our pre-curated bundles that match your interests.",
			action: "Start your profile",
		},
		{
			step: 2,
			title: "Select Your Sources",
			description: "Pick up to 5 individual shows or choose one of our 3 curated bundles for instant quality.",
			action: "Browse content",
		},
		{
			step: 3,
			title: "Let Us Filter",
			description: "Our system processes your selections and creates a focused episode every Friday, cutting out the noise.",
			action: "View episodes",
		},
		{
			step: 4,
			title: "Consume the Insights",
			description: "Listen to your distilled episode through our built-in player and get straight to the valuable content.",
			action: "Start listening",
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
			name: "Sarah Johnson",
			role: "Tech Enthusiast",
			content: "PodSlice saves me hours every week. I get the insights I need without wading through endless chatter.",
			rating: 5,
		},
		{
			name: "Michael Chen",
			role: "Business Owner",
			content: "Finally, a tool that respects my time. The curated bundles deliver exactly what I need to stay informed.",
			rating: 5,
		},
		{
			name: "Emma Rodriguez",
			role: "Science Lover",
			content: "The science bundle cuts through the complexity and gives me the key insights in digestible format.",
			rating: 5,
		},
	]

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<section className="relative overflow-hidden py-20 px-4">
				<div className="max-w-7xl mx-auto text-center">
					<div className="mb-8">
						<h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">PodSlice</h1>
						<p className="text-xl md:text-2xl text-muted-foreground mb-4 font-semibold">Cut the chatter. Keep the insight.</p>
						<p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
							Stop wasting time on irrelevant podcast content. Get straight to the valuable insights with intelligent filtering that respects your time and delivers only what matters.
						</p>
					</div>
					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
						<Link href="/sign-up">
							<Button size="lg" className="text-lg px-8 py-6">
								Start Filtering Free
								<ArrowRight className="ml-2 h-5 w-5" />
							</Button>
						</Link>
						<Link href="/about">
							<Button variant="outline" size="lg" className="text-lg px-8 py-6">
								See How It Works
							</Button>
						</Link>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20 px-4 bg-card">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold mb-4">Why Choose PodSlice?</h2>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
							We combine human curation with intelligent filtering to deliver focused content that respects your time and delivers maximum value.
						</p>
					</div>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{features.map((feature, index) => (
							<div key={index} className="p-6 rounded-lg border bg-background hover:shadow-lg transition-all">
								<div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground mb-4">{feature.icon}</div>
								<h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
								<p className="text-muted-foreground">{feature.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section className="py-20 px-4">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold mb-4">How PodSlice Works</h2>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
							Getting started with PodSlice is straightforward. Follow these four simple steps to create your focused content experience.
						</p>
					</div>
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{howItWorks.map(step => (
							<div key={step.step} className="text-center p-6 rounded-lg border bg-card hover:shadow-lg transition-all">
								<div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-4">{step.step}</div>
								<h3 className="text-xl font-semibold mb-2">{step.title}</h3>
								<p className="text-muted-foreground mb-4">{step.description}</p>
								<div className="flex items-center justify-center text-primary text-sm font-medium">
									<span>{step.action}</span>
									<ArrowRight className="ml-1 h-4 w-4" />
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Testimonials Section */}
			<section className="py-20 px-4 bg-card">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">Join thousands of satisfied users who are already saving time and getting more value from their content consumption.</p>
					</div>
					<div className="grid md:grid-cols-3 gap-8">
						{testimonials.map((testimonial, index) => (
							<div key={index} className="p-6 rounded-lg border bg-background">
								<div className="flex items-center mb-4">
									{Array.from({ length: testimonial.rating }).map((_, i) => (
										<Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
									))}
								</div>
								<p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
								<div>
									<p className="font-semibold">{testimonial.name}</p>
									<p className="text-sm text-muted-foreground">{testimonial.role}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Pricing Section */}
			<section className="py-20 px-4">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold mb-4">Simple Pricing</h2>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">Start with a free trial and upgrade when you're ready for unlimited focused content.</p>
					</div>
					<div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
						{pricingTiers.map(tier => (
							<div key={tier.name} className={`p-8 rounded-lg border relative ${tier.popular ? "border-primary shadow-lg scale-105" : "bg-card"}`}>
								{tier.popular && (
									<div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">Most Popular</div>
								)}
								<h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
								<div className="mb-6">
									<span className="text-4xl font-bold">{tier.price}</span>
									<span className="text-muted-foreground">/{tier.duration}</span>
								</div>
								<ul className="space-y-3 mb-8">
									{tier.features.map((feature, index) => (
										<li key={index} className="flex items-center">
											<CheckCircle className="w-5 h-5 text-primary mr-3" />
											{feature}
										</li>
									))}
								</ul>
								<Link href="/sign-up">
									<Button className="w-full" variant={tier.popular ? "default" : "outline"} size="lg">
										{tier.name === "Free Trial" ? "Start Trial" : "Upgrade Now"}
									</Button>
								</Link>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 px-4 bg-card">
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-4xl font-bold mb-4">Ready to Cut Through the Noise?</h2>
					<p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
						Join thousands of users who are already saving time and getting more value from their content. Start your free trial today and discover focused content that respects your time.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link href="/sign-up">
							<Button size="lg" className="text-lg px-8 py-6">
								Start Free Trial
								<ArrowRight className="ml-2 h-5 w-5" />
							</Button>
						</Link>
						<Link href="/about">
							<Button variant="outline" size="lg" className="text-lg px-8 py-6">
								Learn More
							</Button>
						</Link>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="py-12 px-4 border-t">
				<div className="max-w-7xl mx-auto text-center">
					<div className="flex justify-center items-center mb-4">
						<Zap className="w-8 h-8 text-primary mr-2" />
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
				</div>
			</footer>
		</div>
	)
}
