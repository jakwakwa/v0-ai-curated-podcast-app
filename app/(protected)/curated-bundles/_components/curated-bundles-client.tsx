"use client"

import { AlertCircle, Lock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { H3, Typography } from "@/components/ui/typography"
import type { Bundle, Podcast } from "@/lib/types"
import { BundleSelectionDialog } from "./bundle-selection-dialog"

interface CuratedBundlesClientProps {
	bundles: (Bundle & { podcasts: Podcast[] })[]
	error: string | null
}

interface UserCurationProfile {
	profile_id: string
	name: string
	selected_bundle_id?: string
	selectedBundle?: {
		name: string
	}
}

export function CuratedBundlesClient({ bundles, error }: CuratedBundlesClientProps) {
	const router = useRouter()
	const [selectedBundle, setSelectedBundle] = useState<(Bundle & { podcasts: Podcast[] }) | null>(null)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [userProfile, setUserProfile] = useState<UserCurationProfile | null>(null)

	// Fetch current user profile on mount
	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				const response = await fetch("/api/user-curation-profiles")
				if (response.ok) {
					const profile = await response.json()
					setUserProfile(profile)
				}
			} catch (error) {
				console.error("Failed to fetch user profile:", error)
			}
		}

		fetchUserProfile()
	}, [])

	const handleBundleClick = (bundle: Bundle & { podcasts: Podcast[] }) => {
		setSelectedBundle(bundle)
		setIsDialogOpen(true)
	}

	const handleConfirmSelection = async (bundleId: string) => {
		if (!userProfile) {
			toast.error("Unable to update bundle selection. Please try again.")
			return
		}

		setIsLoading(true)
		try {
			const response = await fetch(`/api/user-curation-profiles/${userProfile.profile_id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					selected_bundle_id: bundleId,
				}),
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.error || "Failed to update bundle selection")
			}

			// Update local state
			setUserProfile(prev =>
				prev
					? {
						...prev,
						selected_bundle_id: bundleId,
						selectedBundle: {
							name: selectedBundle?.name || "",
						},
					}
					: null
			)

			toast.success("Bundle selection updated successfully!")

			// Redirect to dashboard after successful update
			router.push("/dashboard")
		} catch (error) {
			console.error("Failed to update bundle selection:", error)
			toast.error(error instanceof Error ? error.message : "Failed to update bundle selection")
		} finally {
			setIsLoading(false)
		}
	}

	const handleCloseDialog = () => {
		setIsDialogOpen(false)
		setSelectedBundle(null)
	}

	if (error) {
		return (
			<div className="max-w-2xl mx-auto mt-8 ">
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Unable to Load PODSLICE Bundles</AlertTitle>
					<AlertDescription className="mt-2">{error}</AlertDescription>
				</Alert>
				<div className="mt-6 text-center">
					<Button asChild variant="outline">
						<Link href="/curated-bundles">Try Again</Link>
					</Button>
				</div>
			</div>
		)
	}

	if (bundles.length === 0) {
		return (
			<div className="max-w-2xl mx-auto mt-8 ">
				<Alert>
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>No PODSLICE Bundles Available</AlertTitle>
					<AlertDescription className="mt-2">There are no PODSLICE Bundles available at the moment. Please check back later or contact support if this problem persists.</AlertDescription>
				</Alert>
			</div>
		)
	}

	return (
		<>
			<div className="relative transition-all duration-200 text-card-foreground p-0 px-2 w-full overflow-y-scroll z-1 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4 h-fit bg-primary-card">
				{bundles.map(bundle => (
					<Card
						key={bundle.bundle_id}
						className="h-auto flex flex-col px-8 rounded-2xl shadow-lg bg-[#181D23] h-[220px] border-2 border-[#40545ACE] w-full cursor-pointer hover:bg-[#000] transition-shadow duration-200 gap-4 bundle-card-hover"
						onClick={() => handleBundleClick(bundle)}>
						<CardHeader className="w-full py-4 px-2">
							<div className="w-full flex flex-row gap-6">
								<div className="flex items-start gap-3 text-sm font-normal tracking-wide flex-col w-full max-w-[240px]">
									<H3 className="text-[1rem] text-secondary-foreground font-black font-sans mt-2 mb-3 leading-9 text-shadow-sm tracking-tight uppercase leading-tight mb-0 truncate">{bundle.name}</H3>

									<Badge variant="outline" size="sm" className="font-normal tracking-wide">
										<Lock size={8} className="mr-2" />
										<Typography className="text-xxs">Fixed Podcast Shows</Typography>
									</Badge>

									<CardContent className="bg-[#2D383D] mx-auto shadow-sm rounded-md w-full p-2 m-0 pb-3 mt-2 outline-1 outline-[#63758AB7]">
										<ul className="list-none p-0 m-0 flex flex-col gap-2">
											{bundle.podcasts?.map((podcast: Podcast) => (
												<li key={podcast.podcast_id} className="flex w-full justify-end gap-0">
													<div className="w-full flex flex-col gap-0">
														<Typography as="p" className="text-md font-bold leading-normal tracking-tight my-0 px-1 mx-0 opacity-80">
															{podcast.name}
														</Typography>
													</div>
												</li>
											))}
										</ul>
									</CardContent>
								</div>

								<div className="flex items-start gap-2 text-sm font-normal tracking-wide w-full">
									<div className="relative my-2 rounded-lg outline-4 overflow-hidden w-full min-w-[150px] h-26">
										{bundle.image_url && <Image className="w-full object-cover" src={bundle.image_url} alt={bundle.name} width={190} height={110} />}
									</div>
								</div>
							</div>
						</CardHeader>
					</Card>
				))}
			</div>

			<BundleSelectionDialog
				isOpen={isDialogOpen}
				onClose={handleCloseDialog}
				onConfirm={handleConfirmSelection}
				selectedBundle={selectedBundle}
				currentBundleName={userProfile?.selectedBundle?.name}
				currentBundleId={userProfile?.selected_bundle_id}
				isLoading={isLoading}
			/>
		</>
	)
}
