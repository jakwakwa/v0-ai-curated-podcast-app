"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Bundle, Podcast } from "@/lib/types"
import Stepper from "./function Stepper({ step }: { step: numbe"

type BundleWithMeta = (Bundle & { podcasts: Podcast[] }) & { canInteract?: boolean; lockReason?: string | null; min_plan?: string }

type BaseProps = {
	description: string
	placeholder?: string
	step?: number | string
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
					<Stepper step={step as string} />
					Select {props.type}
				</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent className="p-4">
				<Select value={selectedId} onValueChange={onChange}>
					<SelectTrigger className="w-full max-w-[400px]">
						<SelectValue placeholder={placeholder ?? `Select a ${props.type}...`} />
					</SelectTrigger>
					<SelectContent className="h-full min-h-[180px] max-h-[600px] bg-muted-dark text-bord-light border-bord-light overflow-y-auto">
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
					<div className="mt-4 p-4 bg-muted-transparent rounded-lg border-1 border-b-accent">
						{isBundle
							? (() => {
									const bundle = (props.items as BundleWithMeta[]).find(b => b.bundle_id === selectedId)
									if (!bundle) return null
									return (
										<div>
											<h4 className="font-semibold mb-2">{bundle.name}</h4>
											<p className="text-sm truncate pt-1 py-4 text-muted-foreground mb-3">{bundle.description}</p>
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
											<h4 className="font-semibold mb-2">{podcast.name}</h4>
											<p className="text-sm truncate pt-1 py-4 text-muted-foreground mb-3">{podcast.description}</p>
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
