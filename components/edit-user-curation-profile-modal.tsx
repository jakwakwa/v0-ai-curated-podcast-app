"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Bundle, Episode, Podcast, UserCurationProfile } from "@/lib/types"

// Type for UserCurationProfile with relations
type UserCurationProfileWithRelations = UserCurationProfile & {
	selectedBundle?: (Bundle & { podcasts: Podcast[]; episodes: Episode[] }) | null
	episode: Episode[]
}

interface EditUserCurationProfileModalProps {
	isOpen: boolean
	onClose: () => void
	collection: UserCurationProfileWithRelations
	onSave: (updatedData: Partial<UserCurationProfileWithRelations>) => Promise<void>
}

export function EditUserCurationProfileModal({ isOpen, onClose }: Readonly<EditUserCurationProfileModalProps>) {
	// Temporarily disabled during schema migration
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Personalized Feed</DialogTitle>
					<DialogDescription>This feature is temporarily disabled during database schema migration.</DialogDescription>
				</DialogHeader>
				<div className="py-4">
					<p className="text-muted-foreground">Please check back later when the migration is complete.</p>
				</div>
			</DialogContent>
		</Dialog>
	)
}
