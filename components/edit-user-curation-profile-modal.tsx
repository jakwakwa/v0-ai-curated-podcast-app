"use client"

import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { Switch } from "@/components/ui/switch"
import type { CuratedPodcast, UserCurationProfileWithSources } from "@/lib/types"
import { CuratedBundleList } from "./curated-bundle-list"
import { CuratedPodcastList } from "./curated-podcast-list"

interface EditUserCurationProfileModalProps {
	isOpen: boolean
	onClose: () => void
	collection: UserCurationProfileWithSources
	onSave: (updatedData: Partial<UserCurationProfileWithSources>) => Promise<void>
}

export function EditUserCurationProfileModal({ isOpen, onClose, collection, onSave }: Readonly<EditUserCurationProfileModalProps>) {
	const [step, setStep] = useState(1)
	const [name, setName] = useState(collection.name)
	const [isBundleSelection, setIsBundleSelection] = useState(collection.isBundleSelection)
	const [selectedBundleId, setSelectedBundleId] = useState<string | undefined>(collection.selectedBundleId ?? undefined)
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
	const [isLoading, setIsLoading] = useState(false)

	// Initialize selected podcasts from existing sources
	useEffect(() => {
		if (collection.sources && collection.sources.length > 0) {
			const podcastsFromSources = collection.sources.map(source => ({
				id: source.id,
				name: source.name,
				imageUrl: source.imageUrl,
				createdAt: source.createdAt,
				isActive: true,
				url: source.url,
				description: null,
				category: "Technology", // Default category
			}))
			setSelectedPodcasts(podcastsFromSources)
		}
	}, [collection])

	// Reset form when modal opens/closes
	useEffect(() => {
		if (isOpen) {
			setName(collection.name)
			setIsBundleSelection(collection.isBundleSelection)
			setSelectedBundleId(collection.selectedBundleId ?? undefined)
			setStep(1)
		}
	}, [isOpen, collection])

	const handleSave = async () => {
		setIsLoading(true)
		try {
			const data: Partial<UserCurationProfileWithSources> = {
				id: collection.id,
				name,
				isBundleSelection,
			}

			if (isBundleSelection) {
				if (!selectedBundleId) {
					toast.error("Please select a bundle.")
					return
				}
				data.selectedBundleId = selectedBundleId
				data.sources = [] // Clear sources when switching to bundle
			} else {
				if (selectedPodcasts.length === 0) {
					toast.error("Please select at least one podcast for your custom user curation profile.")
					return
				}
				// Convert selected podcasts to sources format
				data.sources = selectedPodcasts.map(podcast => ({
					id: podcast.id,
					name: podcast.name,
					url: podcast.url,
					imageUrl: podcast.imageUrl,
					createdAt: podcast.createdAt,
					userCurationProfileId: collection.id,
				}))
				data.selectedBundleId = null // Clear bundle when switching to custom
			}

			await onSave(data)
			toast.success("User Curation Profile updated successfully!")
			onClose()
		} catch (_error) {
			toast.error("Failed to update user curation profile")
		} finally {
			setIsLoading(false)
		}
	}

	const handlePodcastSelection = (podcast: CuratedPodcast) => {
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
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Edit User Curation Profile</DialogTitle>
					<DialogDescription>Update your user curation profile settings and content selection.</DialogDescription>
				</DialogHeader>

				<div className="py-4">
					{/* Step 1: Choose Profile Type */}
					{step === 1 && (
						<div className="space-y-4">
							<h3 className="text-lg font-semibold">Choose Your User Curation Profile Type</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<Button
									variant={!isBundleSelection ? "default" : "outline"}
									className="h-auto p-4 flex flex-col items-start"
									disabled
									onClick={() => {
										setIsBundleSelection(false)
										setStep(2)
									}}
								>
									<h4 className="font-semibold">Custom User Curation Profile </h4>
									{/* <p className="text-sm opacity-80">Select up to 5 individual podcasts.</p> */}
									<p className="text-sm opacity-80">Coming soon!</p>
								</Button>
								<Button
									variant={isBundleSelection ? "default" : "outline"}
									className="h-auto p-4 flex flex-col items-start"
									onClick={() => {
										setIsBundleSelection(true)
										setStep(2)
									}}
								>
									<h4 className="font-semibold">Bundle Selection</h4>
									<p className="text-sm opacity-80">Choose from pre-selected bundles (uneditable).</p>
								</Button>
							</div>
						</div>
					)}

					{/* Step 2: Select Content */}
					{step === 2 && (
						<div className="space-y-4">
							<div className="flex items-center gap-2 mb-4">
								<Button variant="ghost" size="sm" onClick={() => setStep(1)}>
									<ArrowLeft size={16} />
									Back
								</Button>
								<h3 className="text-lg font-semibold">{isBundleSelection ? "Select a Bundle" : "Select Podcasts for Your Custom User Curation Profile"}</h3>
							</div>

							{isBundleSelection ? (
								<CuratedBundleList onSelectBundle={setSelectedBundleId} selectedBundleId={selectedBundleId} />
							) : (
								<CuratedPodcastList onSelectPodcast={handlePodcastSelection} selectedPodcasts={selectedPodcasts} />
							)}

							<div className="flex justify-between pt-4">
								<Button variant="outline" onClick={() => setStep(1)}>
									Back
								</Button>
								<Button onClick={() => setStep(3)} disabled={isBundleSelection ? !selectedBundleId : selectedPodcasts.length === 0}>
									Next
									<ArrowRight size={16} />
								</Button>
							</div>
						</div>
					)}

					{/* Step 3: Review and Save */}
					{step === 3 && (
						<div className="space-y-4">
							<div className="flex items-center gap-2 mb-4">
								<Button variant="ghost" size="sm" onClick={() => setStep(2)}>
									<ArrowLeft size={16} />
									Back
								</Button>
								<h3 className="text-lg font-semibold">Review Your Changes</h3>
							</div>

							<div className="space-y-4">
								<div>
									<Label htmlFor="name">User Curation Profile Name</Label>
									<Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your profile name" className="mt-1" />
								</div>

								<div>
									<h4 className="font-medium mb-2">Selected Content:</h4>
									{isBundleSelection && selectedBundleId ? (
										<div className="p-3 border rounded-md">
											<p className="font-medium">Bundle ID: {selectedBundleId}</p>
											<p className="text-sm text-muted-foreground">Bundle details will be displayed here</p>
										</div>
									) : (
										<div className="space-y-2">
											{selectedPodcasts.map(podcast => (
												<div key={podcast.id} className="p-3 border rounded-md">
													<p className="font-medium">{podcast.name}</p>
													{podcast.description && <p className="text-sm text-muted-foreground">{podcast.description}</p>}
												</div>
											))}
										</div>
									)}
								</div>
							</div>

							<div className="flex justify-between pt-4">
								<Button variant="outline" onClick={() => setStep(2)}>
									Back
								</Button>
								<Button onClick={handleSave} disabled={isLoading || name.trim() === ""}>
									{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
									Save Changes
								</Button>
							</div>
						</div>
					)}
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={onClose} disabled={isLoading}>
						Cancel
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
