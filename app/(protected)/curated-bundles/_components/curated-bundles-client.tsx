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
			<div className="relative transition-all duration-200 text-card-foreground p-0 px-2 md:px-8 w-full overflow-y-scroll z-1 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-4 h-fit episode-card-wrapper">
				{bundles.map(bundle => (
					<Card
						key={bundle.bundle_id}
						className="flex flex-col sm:flex-col px-5 rounded-2xl shadow-lg bg-[#0f0d1c20]  border-2 border-[#232e37ce] w-full cursor-pointer hover:bg-[#c1bdef17]/50 transition-shadow duration-200 gap-3 bundle-card-hover xl:max-w-[500px] ease-in-out text-shadow-sm transition-all"
						onClick={() => handleBundleClick(bundle)}>
						<CardHeader className="w-full py-4 px-2">
							<div className="w-full flex flex-col-reverse xl:flex-col-reverse gap-6">
								<div className="flex items-start gap-3 text-sm font-normal tracking-wide flex-col w-full md:max-w-[240px]">
									<H3 className="text-[0.8rem] text-[#a7dbe7]/70 font-black font-sans mt-2 text-shadow-sm tracking-tight uppercase leading-tight mb-0 truncate">{bundle.name}</H3>

									<Badge variant="outline" className="font-normal tracking-wide">
										<Lock size={8} className="mr-2" />
										<Typography className="text-xxs">Fixed Podcast Shows</Typography>
									</Badge>

									<CardContent className="bg-[#06080a45] mx-auto shadow-sm rounded-md w-full p-1 m-0 pb-1 mt-0 outline-1 outline-[#2d3845b7]">
										<ul className="list-none p-0 m-0 flex flex-col gap-1">
											{bundle.podcasts?.map((podcast: Podcast) => (
												<li key={podcast.podcast_id} className="flex w-full justify-end gap-0 pt-1">
													<div className="w-full flex flex-col gap-0 justify-center items-center">
														<p className="text-[0.6rem] font-semibold leading-normal my-0 px-1 mx-0 text-center text-[#f1e9e9b3] tracking-wide line-clamp-2">
															{podcast.name}
														</p>
													</div>
												</li>
											))}
										</ul>
									</CardContent>
								</div>

								<div className="flex items-start gap-2 text-sm font-normal tracking-wide w-full">
									<div className="relative my-2 rounded-lg outline-4 overflow-hidden w-full min-w-[200px] h-fit lg:h-fit xl:h-fit xl:max-w-[300px] xl:justify-end">
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
