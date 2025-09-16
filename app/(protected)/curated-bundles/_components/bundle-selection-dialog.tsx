"use client"

import { Loader2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Typography } from "@/components/ui/typography"
import type { Bundle, Podcast } from "@/lib/types"

// Simple function to sanitize text for safe display
function sanitizeText(text: string | null | undefined): string {
	if (!text) return ""
	// Remove any potential HTML/script tags and escape special characters
	return text.replace(/[<>&"']/g, (char) => {
		switch (char) {
			case '<': return '&lt;'
			case '>': return '&gt;'
			case '&': return '&amp;'
			case '"': return '&quot;'
			case "'": return '&#x27;'
			default: return char
		}
	})
}

interface BundleSelectionDialogProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: (bundleId: string) => Promise<void>
	selectedBundle: (Bundle & { podcasts: Podcast[] }) | null
	currentBundleName?: string | null
	currentBundleId?: string | null
	isLoading?: boolean
}

export function BundleSelectionDialog({
	isOpen,
	onClose,
	onConfirm,
	selectedBundle,
	currentBundleName,
	currentBundleId,
	isLoading = false
}: BundleSelectionDialogProps) {
	const [isConfirming, setIsConfirming] = useState(false)

	const handleConfirm = async () => {
		if (!selectedBundle) return

		setIsConfirming(true)
		try {
			await onConfirm(selectedBundle.bundle_id)
			onClose()
		} catch (error) {
			console.error("Failed to select bundle:", error)
		} finally {
			setIsConfirming(false)
		}
	}

	if (!selectedBundle) return null

	// Check if user already has this bundle selected
	const isAlreadySelected = currentBundleId === selectedBundle.bundle_id

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>
						{isAlreadySelected ? "Just a reminder!" : "Switching Bundle Selection..."}
					</DialogTitle>
					<DialogDescription className="mt-4">
						{isAlreadySelected
							? `You already have "${sanitizeText(selectedBundle.name)}" selected`
							: currentBundleName
								? `You're about to change from '${sanitizeText(currentBundleName)} Bundle' to '${sanitizeText(selectedBundle.name)} Bundle'`
								: `You're about to select '${sanitizeText(selectedBundle.name)}' as your curated podcast bundle. This will update your podcast feed.`}
					</DialogDescription>
				</DialogHeader>

				{!isAlreadySelected && (
					<div className="space-y-4">
						{/* Warning Message */}
						<div className="px-2 bg-amber-50 dark:bg-amber-600/10 outline outline-amber-700/50 dark:border-amber-800 rounded-lg inline-block">
							<Typography variant="body" className="text-amber-400 dark:text-amber-400/70 text-xs">
								{`You won't have access to ${sanitizeText(currentBundleName)}'s episodes after changing`}
							</Typography>
						</div>
					</div>
				)}

				{isAlreadySelected && (
					<div className="space-y-4">
						{/* Reminder Message */}
						<div className="px-2 bg-blue-50 dark:bg-teal-400/10 border border-blue-200 dark:border-teal-800 rounded-lg w-fit">
							<Typography variant="body" className="text-teal-100 dark:text-teal-200 text-xs">
								This bundle is already active in your profile.
							</Typography>
						</div>
					</div>
				)}

				<DialogFooter className="gap-2 mt-4">
					{isAlreadySelected ? (
						<Button type="button" variant="default" onClick={onClose} className="w-1/3">
							Close
						</Button>
					) : (
						<>
							<Button type="button" variant="outline" onClick={onClose} disabled={isConfirming}>
								Cancel
							</Button>
							<Button type="button" variant="default" onClick={handleConfirm} disabled={isConfirming || isLoading} className="min-w-[120px]">
								{isConfirming ? (
									<div className="flex items-center">
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Updating...
									</div>
								) : (
									"Confirm Selection"
								)}
							</Button>
						</>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog >
	)
}
