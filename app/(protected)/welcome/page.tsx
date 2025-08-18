"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
// Subscription store disabled in this build
// CSS module migrated to Tailwind classes

export default function WelcomePage() {
	const _router = useRouter()

	const _isLoading = false
	const _tiers = [
		{ name: "FreeSlice", price: 0, description: "Free tier", features: ["Basic features"] },
		{ name: "Casual Listener", price: 5, description: "Tier 2", features: ["Weekly combo"] },
		{ name: "Curate & Control", price: 12, description: "Tier 3", features: ["All features"], popular: true },
	]

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

	const _handleUpgrade = async (_planCode: string | undefined) => { }

	return (
		<div className="container">
			{/* Short Intro */}
			<section className="text-left  w-full pt-8 md:pt-0 pb-4 mb-0">
				<div className="w-full mx-auto">
					<Typography className="text-custom-display  font-bold text-left">Welcome!</Typography>
					{/* <Image src={"/logo.png"} alt="PODSLICE Logo" width={200} height={200} className="scale-[0.5] mx-auto mb-8" /> */}
					<p className="text-custom-h4 leading-6 font-normal tracking-wide mb-12 max-w-[600px] w-full">
						Your personal AI-powered podcast curator that creates weekly episodes tailored to your interests. Choose from hand-picked content or create your own custom Personalized Feed.
					</p>
					<div className="flex justify-end items-center space-x-4 text-foreground/70 mt-8">
						<Link href="/terms" className="hover:text-foreground transition-colors text-custom-xs underline">
							Terms of Service
						</Link>
						<span>•</span>
						<Link href="/privacy" className="hover:text-foreground transition-colors text-custom-xs underline">
							Privacy Policy
						</Link>
					</div>
				</div>
			</section>
			{/* How It Works */}
			<section className="flex flex-col justify-center w-full mb-16 p-8  mt-4 bg-background rounded-4xl">
				<div className="text-left mb-12">
					<h2 className="text-custom-h1 leading-9 font-semibold tracking-tight mb-4">How It Works!</h2>
					<p className="text-custom-h5 leading-6 font-normal tracking-wide max-w-[600px]">
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
		</div>
	)
}
