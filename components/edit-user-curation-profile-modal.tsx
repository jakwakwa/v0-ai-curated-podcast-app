'use client';

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type {  Source, UserCurationProfileWithSources } from '@/lib/types'
import { Loader2, Plus, X } from 'lucide-react'
import { toast } from 'sonner'

interface EditUserCurationProfileModalProps {
	isOpen: boolean
	onClose: () => void
	collection: UserCurationProfileWithSources // Renamed to collection for now to avoid cascading changes everywhere
	onSave: (updatedData: Partial<UserCurationProfileWithSources>) => Promise<void>
}

export function EditUserCurationProfileModal({
	isOpen,
	onClose,
	collection,
	onSave,
}: Readonly<EditUserCurationProfileModalProps>) {
	const [name, setName] = useState(collection.name)
	const [isBundleSelection, setIsBundleSelection] = useState(collection.isBundleSelection)
	const [selectedBundleId, setSelectedBundleId] = useState<string | undefined>(
		collection.selectedBundleId ?? undefined
	)
	const [sources, setSources] = useState<Source[]>(collection.sources || [])
	const [newSourceUrl, setNewSourceUrl] = useState('')
	const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
		setName(collection.name)
		setIsBundleSelection(collection.isBundleSelection)
		setSelectedBundleId(collection.selectedBundleId ?? undefined)
		setSources(collection.sources || [])
	}, [collection])

	const handleSave = async () => {
		setIsLoading(true)
		await onSave({ id: collection.id, name, isBundleSelection, selectedBundleId, sources })
		setIsLoading(false)
	}

	const handleAddSource = async () => {
		if (!newSourceUrl.trim()) {
			toast.error('Source URL cannot be empty.')
			return
		}

		// Basic validation for YouTube URL
		const youtubeUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/
		if (!youtubeUrlRegex.test(newSourceUrl)) {
			toast.error('Please enter a valid YouTube video URL.')
			return
		}

		setIsLoading(true)
		try {
			// Fetch video details (similar to addPodcastSource action)
			const videoIdMatch = newSourceUrl.match(
				/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/
			)
			const videoId = videoIdMatch ? videoIdMatch[1] : null

			if (!videoId) {
				throw new Error('Could not extract video ID from URL')
			}

			const response = await fetch(
				`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
			)
			if (!response.ok) {
				throw new Error(`Failed to fetch video details: ${response.status}`)
			}
			const data = await response.json()

			const newSource: Source = {
				id: Date.now().toString(), // Temp ID, will be replaced by DB ID
				name: data.title,
				url: newSourceUrl,
				imageUrl: data.thumbnail_url,
				createdAt: new Date(), // Set to a new Date object
				userCurationProfileId: collection.id // Set to collection.id
			}
			setSources(prev => [...prev, newSource])
			setNewSourceUrl('')
			toast.success('Source added to list. Click Save to apply changes.')
		} catch (error: unknown) {
			toast.error(`Failed to add source: ${(error as Error).message}`)
    } finally {
			setIsLoading(false)
		}
    }

	const handleRemoveSource = (urlToRemove: string) => {
		setSources(prev => prev.filter(source => source.url !== urlToRemove))
		toast.info('Source removed from list. Click Save to apply changes.')
	}

  return (
		<AlertDialog open={isOpen} onOpenChange={onClose}>
			<AlertDialogContent className="sm:max-w-[600px]">
				<AlertDialogHeader>
					<AlertDialogTitle>Edit User Curation Profile</AlertDialogTitle>
					<AlertDialogDescription>
						Make changes to your user curation profile here. Click save when you're done.
					</AlertDialogDescription>
				</AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
							value={name}
							onChange={e => setName(e.target.value)}
              className="col-span-3"
            />
          </div>

					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="bundleSelection" className="text-right">
							Bundle Selection
						</Label>
						<Switch
							id="bundleSelection"
							checked={isBundleSelection}
							onCheckedChange={setIsBundleSelection}
							className="col-span-3"
						/>
					</div>

					{!isBundleSelection && (
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="sources" className="text-right">
								Sources
							</Label>
							<div className="col-span-3 flex flex-col gap-2">
								{sources.map(source => (
									<div key={source.id} className="flex items-center justify-between rounded-md border p-2">
										<span>{source.name}</span>
										<Button variant="ghost" size="icon" onClick={() => handleRemoveSource(source.url)}>
											<X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
								<div className="flex w-full items-center space-x-2">
									<Input
										type="url"
										placeholder="Add new YouTube source URL"
										value={newSourceUrl}
										onChange={e => setNewSourceUrl(e.target.value)}
									/>
									<Button type="button" onClick={handleAddSource} disabled={isLoading}>
										<Plus className="h-4 w-4" />
              </Button>
								</div>
							</div>
            </div>
          )}

					{isBundleSelection && (
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="selectedBundle" className="text-right">
								Selected Bundle ID
							</Label>
							<Input
								id="selectedBundle"
								value={selectedBundleId ?? 'No bundle selected'}
								onChange={e => setSelectedBundleId(e.target.value)}
								disabled // Bundles are fixed, not directly editable via ID
								className="col-span-3"
							/>
						</div>
          )}
        </div>
				<AlertDialogFooter>
					<Button variant="outline" onClick={onClose} disabled={isLoading}>
						Cancel
					</Button>
					<Button type="submit" onClick={handleSave} disabled={isLoading}>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Save changes
          </Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
} 