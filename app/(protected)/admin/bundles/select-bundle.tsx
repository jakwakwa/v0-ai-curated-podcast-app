import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Typography } from "@/components/ui/typography"
import type { Bundle, Podcast } from "@/lib/types"

interface IAdminSelector {
	isType: "bundle" | "podcast" | "episode"
	// 		bundles?: Bundle[]
	// selectedBundle?: Bundle
	// setSelectedBundleId?: (id: string) => void
	// selectedBundleId?: string
	description: string
	// availablePodcasts?: Podcast[]
	// selectedPodcast?: Podcast
	// setSelectedUploadPodcastId?: (id: string) => void
	// selectedUploadPodcastId?: string

	data: Bundle[] | Podcast[]
	selectedData?: Bundle | Podcast
	selectedDataId?: string
	setSelectedData?: (data: Bundle | Podcast) => void
	setSelectedDataId?: (id: string) => void
	placeholder: string
	availableData?: Bundle[] | Podcast[]
}

const AdminSelector = ({ isType, description, data, selectedData, setSelectedData, setSelectedDataId, selectedDataId, placeholder, availableData }: IAdminSelector) => {
	const _isBundle = isType === "bundle"
	const _isPodcast = isType === "podcast"

	return (
		<Card>
			<CardHeader>
				<Typography className="flex items-center gap-2">
					<span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-custom-md font-bold">1</span>
					Select {isType}
				</Typography>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent className="p-4">
				<Select value={selectedDataId} onValueChange={setSelectedDataId}>
					<SelectTrigger>
						<SelectValue placeholder={`Select a ${isType ? "bundle" : "podcast"} ...`} />
					</SelectTrigger>
					<SelectContent>
						{data &&
							availableData?.map((data: Bundle | Podcast) => {
								return (
									<SelectItem key={data.bundle_id} value={data.bundle_id} disabled={(data as any).canInteract === false}>
										{data.name} ({data.podcasts.length} shows){(data as any).canInteract === false ? " – Locked" : ""}
									</SelectItem>
								)
							})}
					</SelectContent>
				</Select>

				{selectedData && (
					<div className="mt-4 p-4 bg-muted rounded-lg">
						<h4 className="font-semibold mb-2">{selectedData.name}</h4>
						<p className="text-sm text-muted-foreground mb-3">{selectedData.description}</p>
						<div className="flex flex-wrap gap-2">
							{selectedData.map((data: unknown) => {
								if (_isBundle) {
									return (
										<Badge size="sm" key={data.id} variant="outline">
											{data.name}
										</Badge>
									)
								}
								if (_isPodcast) {
									return (
										<Badge size="sm" key={data.id} variant="outline">
											{data.name}
										</Badge>
									)
								}
								return (
									<Badge size="sm" key={data.id} variant="outline">
										{data.name}
									</Badge>
								)
							})}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	)
}

export default AdminSelector
