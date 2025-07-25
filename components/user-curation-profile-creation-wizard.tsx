"use client"

import type { Podcast, UserCurationProfile } from "@prisma/client"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { AppSpinner } from "@/components/ui/app-spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useSubscriptionStore, useUserCurationProfileStore } from "@/lib/stores"

import styles from "./collection-creation-wizard.module.css"
import { CuratedBundleList } from "./curated-bundle-list"
import { CuratedPodcastList } from "./curated-podcast-list"

export function UserCurationProfileCreationWizard() {
	const [step, setStep] = useState(1)
	const [userCurationProfileName, setUserCurationProfileName] = useState("")
	const [isBundleSelection, setIsBundleSelection] = useState(false)
	const [selectedBundleId, setSelectedBundleId] = useState<string | undefined>(undefined)
	const [selectedPodcasts, setSelectedPodcasts] = useState<Podcast[]>([])
	const [existingProfile, setExistingProfile] = useState<UserCurationProfile | null>(null)
	const [isCheckingProfile, setIsCheckingProfile] = useState(true)

	const { createUserCurationProfile, isLoading, error } = useUserCurationProfileStore()
	const { canCreateUserCurationProfile, isTrialing, getRemainingTrialDays } = useSubscriptionStore()

	// Check if user already has an active profile
	useEffect(() => {
		const checkExistingProfile = async () => {
			try {
				const response = await fetch("/api/user-curation-profiles")
				if (response.ok) {
					const profile = await response.json()
					setExistingProfile(profile)
				}
			} catch {
				// Silently handle profile check errors
			} finally {
				setIsCheckingProfile(false)
			}
		}

		checkExistingProfile()
	}, [])

	const handleCreateUserCurationProfile = async () => {
		if (!canCreateUserCurationProfile()) {
			const message = isTrialing
				? `You can only create one Personalized Feed during your trial period. Remaining trial days: ${getRemainingTrialDays()}.`
				: "You need an active subscription to create a Personalized Feed."
			toast.error(message)
			return
		}

		let data: { name: string; isBundleSelection: boolean; selectedBundleId?: string; selectedPodcasts?: string[] }

		if (isBundleSelection) {
			if (!selectedBundleId) {
				toast.error("Please select a bundle.")
				return
			}
			data = {
				name: userCurationProfileName,
				isBundleSelection: true,
				selectedBundleId: selectedBundleId,
			}
		} else {
			if (selectedPodcasts.length === 0) {
				toast.error("Please select at least one podcast for your custom Personalized Feed.")
				return
			}
			data = {
				name: userCurationProfileName,
				isBundleSelection: false,
				selectedPodcasts: selectedPodcasts.map(p => p.podcast_id),
			}
		}

		await createUserCurationProfile(data)
		if (!error) {
			toast.success("Personalized Feed created successfully!")
			setStep(1)
			setUserCurationProfileName("")
			setIsBundleSelection(false)
			setSelectedBundleId(undefined)
			setSelectedPodcasts([])
		}
	}

	// Show loading state while checking for existing profile
	if (isCheckingProfile) {
		return (
			<div className={styles.wizardContainer}>
				<div className="text-center py-12">
					<AppSpinner size="lg" label="Checking your profile status..." />
				</div>
			</div>
		)
	}

	// Show message if user already has an active profile
	if (existingProfile) {
		return (
			<div className={styles.wizardContainer}>
				<Card className="w-full mx-auto">
					<CardHeader className="text-center">
						<div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
							<CheckCircle className="w-8 h-8 text-green-600" />
						</div>
						<CardTitle className="text-2xl">You Already Have a Profile</CardTitle>
						<CardDescription className="text-lg">
							You already have an active Personalized Feed: <strong>{existingProfile.name}</strong>
						</CardDescription>
					</CardHeader>
					<CardContent className="text-center space-y-4">
						<p className="text-muted-foreground max-w-md mx-auto">You can only have one active Personalized Feed at a time. You can edit your existing profile or deactivate it to create a new one.</p>
						<div className="flex flex-col sm:flex-row gap-3 justify-center">
							<Link href="/dashboard">
								<Button className="w-full sm:w-auto">
									<ArrowLeft className="w-4 h-4 mr-2" />
									Go to Dashboard
								</Button>
							</Link>
							<Link href="/curation-profile-management">
								<Button variant="outline" className="w-full sm:w-auto">
									Manage Profile
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className={styles.wizardContainer}>
			{/* Step 1: Choose User Curation Profile Type */}
			{step === 1 && (
				<div>
					<h2 className={styles.stepTitle}>Select a Feed:</h2>
					<div className={styles.buttonGroup}>
						<Button
							onClick={() => {
								setIsBundleSelection(true)
								setStep(2)
							}}
							variant="outline"
						>
							<h3>PODSLICE Bundles</h3>
							<p>Choose from pre-selected bundles (uneditable).</p>
						</Button>
						{/* TODO: THIS SHOULD BE PROTECTED */}
						<Button
							onClick={() => {
								setIsBundleSelection(false)
								setStep(2)
							}}
							disabled
							variant="outline"
						>
							<h3>Custom Personalized Feed</h3>
							<p>Select up to 5 individual podcasts.</p>
						</Button>
					</div>
				</div>
			)}

			{/* Step 2: Select Content */}
			{step === 2 && (
				<div>
					<h2 className={styles.stepTitle}>{isBundleSelection ? "Select a Bundle" : "Select Podcasts for Your Custom Personalized Feed"}</h2>
					{isBundleSelection ? (
						<CuratedBundleList onBundleSelect={(bundle) => setSelectedBundleId(bundle.bundle_id)} />
					) : (
						<CuratedPodcastList
							onSelectPodcast={podcast => {
								const isAlreadySelected = selectedPodcasts.some(p => p.podcast_id === podcast.podcast_id)
								if (isAlreadySelected) {
									setSelectedPodcasts(selectedPodcasts.filter(p => p.podcast_id !== podcast.podcast_id))
								} else {
									if (selectedPodcasts.length < 5) {
										setSelectedPodcasts([...selectedPodcasts, podcast])
									} else {
										toast.info("You can select a maximum of 5 podcasts.")
									}
								}
							}}
							selectedPodcasts={selectedPodcasts}
						/>
					)}
					<div className={styles.navigationButtons}>
						<Button onClick={() => setStep(1)}>Back</Button>
						<Button onClick={() => setStep(3)} disabled={isBundleSelection ? !selectedBundleId : selectedPodcasts.length === 0}>
							Next
						</Button>
					</div>
				</div>
			)}

			{/* Step 3: Review and Create */}
			{step === 3 && (
				<div>
					<h2 className={styles.stepTitle}>Review Your Personalized Feed</h2>
					<h3>Personalized Feed Details</h3>
					<div className={styles.formGroup}>
						<label htmlFor="userCurationProfileName">Personalized Feed Name</label>
						<Input
							id="userCurationProfileName"
							type="text"
							value={userCurationProfileName}
							onChange={e => setUserCurationProfileName(e.target.value)}
							placeholder="Enter your profile name (e.g., My Daily Tech News)"
						/>
					</div>
					<div className={styles.reviewSummary}>
						<h4>Selected Content:</h4>
						{isBundleSelection && selectedBundleId ? (
							<p>Bundle ID: {selectedBundleId}</p>
						) : (
							<ul>
								{selectedPodcasts.map(p => (
									<li key={p.podcast_id}>{p.name}</li>
								))}
							</ul>
						)}
					</div>
					<div className={styles.navigationButtons}>
						<Button onClick={() => setStep(2)}>Back</Button>
						<Button onClick={handleCreateUserCurationProfile} disabled={isLoading || userCurationProfileName.trim() === ""}>
							{isLoading ? "Creating..." : "Create Personalized Feed"}
						</Button>
					</div>
				</div>
			)}
		</div>
	)
}
