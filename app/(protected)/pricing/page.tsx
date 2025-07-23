"use client"

import { PricingTable } from "@clerk/nextjs"

export default function PricingPage() {
	return (
		<div className="container mx-auto px-4 py-12">
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold tracking-tight mb-4">Choose Your Plan</h1>
				<p className="text-xl text-muted-foreground max-w-3xl mx-auto">Unlock the full potential of AI-powered podcast curation with our flexible subscription plans.</p>
			</div>

			{/* Clerk's built-in PricingTable component */}
			<div className="max-w-7xl mx-auto">
				<PricingTable />
			</div>

			<div className="mt-16 text-center">
				<h2 className="text-2xl font-bold mb-6">Plan Features</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
					<div className="text-left p-6 border rounded-lg">
						<h3 className="font-bold text-lg mb-4">FreeSlice</h3>
						<ul className="space-y-2 text-sm">
							<li className="flex items-center gap-2">
								<div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
								Free Bundle Access
							</li>
							<li className="flex items-center gap-2">
								<div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
								Weekly Combo Episodes
							</li>
						</ul>
					</div>

					<div className="text-left p-6 border rounded-lg">
						<h3 className="font-bold text-lg mb-4">Casual Listener</h3>
						<ul className="space-y-2 text-sm">
							<li className="flex items-center gap-2">
								<div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
								Free Bundle Access
							</li>
							<li className="flex items-center gap-2">
								<div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
								Weekly Combo Episodes
							</li>
							<li className="flex items-center gap-2">
								<div className="h-1.5 w-1.5 bg-blue-500 rounded-full"></div>
								Premium Features
							</li>
						</ul>
					</div>

					<div className="text-left p-6 border rounded-lg">
						<h3 className="font-bold text-lg mb-4">Curate & Control</h3>
						<ul className="space-y-2 text-sm">
							<li className="flex items-center gap-2">
								<div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
								Free Bundle Access
							</li>
							<li className="flex items-center gap-2">
								<div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
								Weekly Combo Episodes
							</li>
							<li className="flex items-center gap-2">
								<div className="h-1.5 w-1.5 bg-blue-500 rounded-full"></div>
								Premium Features
							</li>
							<li className="flex items-center gap-2">
								<div className="h-1.5 w-1.5 bg-purple-500 rounded-full"></div>
								Custom Curation Profiles
							</li>
						</ul>
					</div>
				</div>
			</div>

			<div className="mt-16 text-center">
				<h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
					<div className="text-left">
						<h3 className="font-semibold mb-2">Can I change my plan anytime?</h3>
						<p className="text-sm text-muted-foreground">Yes, you can upgrade or downgrade your plan at any time through your account settings.</p>
					</div>
					<div className="text-left">
						<h3 className="font-semibold mb-2">Is there a free trial?</h3>
						<p className="text-sm text-muted-foreground">Yes, you can start with our FreeSlice plan and upgrade when you're ready.</p>
					</div>
					<div className="text-left">
						<h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
						<p className="text-sm text-muted-foreground">We accept all major credit cards through our secure payment system.</p>
					</div>
					<div className="text-left">
						<h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
						<p className="text-sm text-muted-foreground">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing cycle.</p>
					</div>
				</div>
			</div>
		</div>
	)
}
