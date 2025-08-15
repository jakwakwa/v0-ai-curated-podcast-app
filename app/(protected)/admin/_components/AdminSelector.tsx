"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Bundle, Podcast } from "@/lib/types"
import Stepper from "./stepper"

type BundleWithMeta = (Bundle & { podcasts: Podcast[] }) & { canInteract?: boolean; lockReason?: string | null; min_plan?: string }

type BaseProps = {
	description: string
	placeholder?: string
	step: number
	selectedId?: string
	onChange: (id: string) => void
}

type BundleSelectorProps = BaseProps & {
	type: "bundle"
	items: BundleWithMeta[]
}

type PodcastSelectorProps = BaseProps & {
	type: "podcast"
	items: Podcast[]
}

type AdminSelectorProps = BundleSelectorProps | PodcastSelectorProps

export default function AdminSelector(props: AdminSelectorProps) {
	const { description, placeholder, step, selectedId, onChange } = props
	const isBundle = props.type === "bundle"

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Stepper step={step} />
					Select {props.type}
				</CardTitle>
				<CardDescription>{description}-*</CardDescription>
			</CardHeader>
			<CardContent className="p-4 bg-cardglass border-noe border-dar rounded-lg">
				<Select value={selectedId} onValueChange={onChange}>
					<SelectTrigger className="w-full max-w-[400px]">
						<SelectValue placeholder={placeholder ?? `Select a ${props.type}...`} />
					</SelectTrigger>
					<SelectContent className="bg-glass h-full min-h-[180px] max-h-[600px] bg-dark text-bord-light border-1 border-dark outline-none overflow-y-auto">
						{isBundle
							? (props.items as BundleWithMeta[]).map(bundle => (
									<SelectItem key={bundle.bundle_id} value={bundle.bundle_id} disabled={bundle.canInteract === false}>
										{bundle.name} ({bundle.podcasts.length} shows){bundle.canInteract === false ? " – Locked" : ""}
									</SelectItem>
								))
							: (props.items as Podcast[]).map(podcast => (
									<SelectItem key={podcast.podcast_id} value={podcast.podcast_id} disabled={podcast.is_active === false}>
										{podcast.name}
									</SelectItem>
								))}
					</SelectContent>
				</Select>

				{selectedId && (
					<div className="border-light focus-visible:border-2  mt-4 p-4 bg-muted-transparent/50 rounded-xl outline-2 outline-secondary shadow-lg outline-1 outline-[#97D6A6]">
						{isBundle
							? (() => {
									const bundle = (props.items as BundleWithMeta[]).find(b => b.bundle_id === selectedId)
									if (!bundle) return null
									return (
										<div>
											<h4 className="font-semibold mb-4">{bundle.name}</h4>
											<div className="flex flex-wrap gap-2">
												{bundle.podcasts.map(p => (
													<Badge size="sm" key={p.podcast_id} variant="outline">
														{p.name}
													</Badge>
												))}
											</div>
										</div>
									)
								})()
							: (() => {
									const podcast = (props.items as Podcast[]).find(p => p.podcast_id === selectedId)
									if (!podcast) return null
									return (
										<div>
											<p className="font-semibold py-6">{podcast.name}</p>
											{podcast.category && (
												<Badge size="sm" variant="secondary" className="text-xs">
													{podcast.category}
												</Badge>
											)}
										</div>
									)
								})()}
					</div>
				)}
			</CardContent>
		</Card>
	)
}
