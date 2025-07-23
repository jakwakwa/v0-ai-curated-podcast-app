"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserCurationProfileWithRelations } from "@/lib/types"
import { ArrowRight, Plus, Sparkles } from "lucide-react"
import Link from "next/link"
import { SavedCollectionCard } from "./saved-collection-card"

interface CurationDashboardProps {
	userCurationProfiles: UserCurationProfileWithRelations[]
}

export function CurationDashboard({ userCurationProfiles }: CurationDashboardProps) {
	// Filter for active profiles only
	const activeProfiles = userCurationProfiles.filter(profile => profile.isActive)

	if (activeProfiles.length === 0) {
		return (
			<Card className="w-full">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
						<Sparkles className="w-8 h-8 text-primary" />
					</div>
					<CardTitle className="text-2xl">Welcome to AI Curator!</CardTitle>
					<CardDescription className="text-lg">Create your first curation profile to start generating personalized podcasts</CardDescription>
				</CardHeader>
				<CardContent className="text-center space-y-4">
					<p className="text-muted-foreground max-w-md mx-auto">
						Choose from our curated bundles or create a custom profile with your favorite podcasts. Our AI will generate weekly episodes based on your selections.
					</p>
					<div className="flex flex-col sm:flex-row gap-3 justify-center">
						<Link href="/build">
							<Button className="w-full sm:w-auto">
								<Plus className="w-4 h-4 mr-2" />
								Create Your First Profile
								<ArrowRight className="w-4 h-4 ml-2" />
							</Button>
						</Link>
						<Link href="/curated-bundles">
							<Button variant="outline" className="w-full sm:w-auto">
								Browse Curated Bundles
							</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		)
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold">Your Curation Profile</h2>
				{/* Only show "Create New Profile" if user doesn't have an active profile */}
				{activeProfiles.length === 0 && (
					<Link href="/build">
						<Button size="sm">
							<Plus className="w-4 h-4 mr-2" />
							Create New Profile
						</Button>
					</Link>
				)}
			</div>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{activeProfiles.map(profile => (
					<SavedCollectionCard key={profile.id} userCurationProfile={profile} />
				))}
			</div>
		</div>
	)
}
