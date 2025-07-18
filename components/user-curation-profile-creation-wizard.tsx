"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSubscriptionStore, useUserCurationProfileStore } from "@/lib/stores"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import styles from "./collection-creation-wizard.module.css"
import { CuratedBundleList } from "./curated-bundle-list" // Assuming this component exists or will be created
import { CuratedPodcastList } from "./curated-podcast-list" // Assuming this component exists or will be created
import { getUserCurationProfile } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export function UserCurationProfileCreationWizard() {
	const [step, setStep] = useState(1)
	const [userCurationProfileName, setUserCurationProfileName] = useState("")
	const [isBundleSelection, setIsBundleSelection] = useState(false)
	const [selectedBundleId, setSelectedBundleId] = useState<string | undefined>(undefined)
	const [selectedPodcasts, setSelectedPodcasts] = useState<
		Array<{
			id: string
			name: string
			imageUrl: string | null
			createdAt: Date
			isActive: boolean
			url: string
			description: string | null
			category: string
		}>
	>([])
	const [existingProfile, setExistingProfile] = useState<any>(null)
	const [isCheckingProfile, setIsCheckingProfile] = useState(true)

	const { createUserCurationProfile, isLoading, error } = useUserCurationProfileStore()
	const { canCreateUserCurationProfile, isTrialing, getRemainingTrialDays } = useSubscriptionStore()

	// Check if user already has an active profile
	useEffect(() => {
		const checkExistingProfile = async () => {
			try {
				const profile = await getUserCurationProfile()
				setExistingProfile(profile)
			} catch (error) {
				console.error("Error checking existing profile:", error)
			} finally {
				setIsCheckingProfile(false)
			}
		}

		checkExistingProfile()
	}, [])

	const handleCreateUserCurationProfile = async () => {
		if (!canCreateUserCurationProfile()) {
			// This check should ideally be done before showing the creation wizard or handled by a higher-level component.
			// For now, it provides a fallback toast.
			const message = isTrialing
				? `You can only create one user curation profile during your trial period. Remaining trial days: ${getRemainingTrialDays()}.`
				: "You need an active subscription to create a user curation profile."
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
				toast.error("Please select at least one podcast for your custom user curation profile.")
				return
			}
			data = {
				name: userCurationProfileName,
				isBundleSelection: false,
				selectedPodcasts: selectedPodcasts.map(p => p.id),
			}
		}

		await createUserCurationProfile(data)
		if (!error) {
			toast.success("User Curation Profile created successfully!")
			setStep(1) // Reset to first step
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
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4" />
					<p>Checking your profile status...</p>
				</div>
			</div>
		)
	}

	// Show message if user already has an active profile
	if (existingProfile) {
		return (
			<div className={styles.wizardContainer}>
				<Card className="w-full max-w-2xl mx-auto">
					<CardHeader className="text-center">
						<div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
							<CheckCircle className="w-8 h-8 text-green-600" />
						</div>
						<CardTitle className="text-2xl">You Already Have a Profile</CardTitle>
						<CardDescription className="text-lg">
							You already have an active curation profile: <strong>{existingProfile.name}</strong>
						</CardDescription>
					</CardHeader>
					<CardContent className="text-center space-y-4">
						<p className="text-muted-foreground max-w-md mx-auto">
							Users can only have one active curation profile at a time. You can edit your existing profile or deactivate it to create a new one.
						</p>
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
			<h1 className={styles.title}>Create Your Podcast User Curation Profile</h1>

			{/* Step 1: Choose User Curation Profile Type */}
			{step === 1 && (
				<div>
					<h2 className={styles.stepTitle}>Choose Your User Curation Profile Type</h2>
					<div className={styles.buttonGroup}>
						<Button
							onClick={() => {
								setIsBundleSelection(false)
								setStep(2)
							}}
							variant="outline"
						>
							<h3>Custom User Curation Profile</h3>
							<p>Select up to 5 individual podcasts.</p>
						</Button>
						<Button
							onClick={() => {
								setIsBundleSelection(true)
								setStep(2)
							}}
							variant="outline"
						>
							<h3>Bundle Selection</h3>
							<p>Choose from pre-selected bundles (uneditable).</p>
						</Button>
					</div>
				</div>
			)}

			{/* Step 2: Select Content */}
			{step === 2 && (
				<div>
					<h2 className={styles.stepTitle}>
						{isBundleSelection ? "Select a Bundle" : "Select Podcasts for Your Custom User Curation Profile"}
					</h2>
					{isBundleSelection ? (
						<CuratedBundleList onSelectBundle={setSelectedBundleId} />
					) : (
						<CuratedPodcastList
							onSelectPodcast={podcast => {
								const isAlreadySelected = selectedPodcasts.some(p => p.id === podcast.id)
								if (isAlreadySelected) {
									setSelectedPodcasts(selectedPodcasts.filter(p => p.id !== podcast.id))
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
						<Button
							onClick={() => setStep(3)}
							disabled={isBundleSelection ? !selectedBundleId : selectedPodcasts.length === 0}
						>
							Next
						</Button>
					</div>
				</div>
			)}

			{/* Step 3: Review and Create */}
			{step === 3 && (
				<div>
					<h2 className={styles.stepTitle}>Review Your User Curation Profile</h2>
					<h3>User Curation Profile Details</h3>
					<div className={styles.formGroup}>
						<label htmlFor="userCurationProfileName">User Curation Profile Name</label>
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
							<p>Bundle ID: {selectedBundleId}</p> // You might want to display bundle name here
						) : (
							<ul>
								{selectedPodcasts.map(p => (
									<li key={p.id}>{p.name}</li>
								))}
							</ul>
						)}
					</div>
					<div className={styles.navigationButtons}>
						<Button onClick={() => setStep(2)}>Back</Button>
						<Button
							onClick={handleCreateUserCurationProfile}
							disabled={isLoading || userCurationProfileName.trim() === ""}
						>
							{isLoading ? "Creating..." : "Create User Curation Profile"}
						</Button>
					</div>
				</div>
			)}
		</div>
	)
}
