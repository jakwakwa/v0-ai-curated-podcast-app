import Image from "next/image"
import Link from "next/link"
import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Episode } from "@/lib/types"

interface EpisodeListProps {
	episodes: Episode[]
}

const formatDate = (date: Date | null | undefined) => {
	if (!date) return "N/A"
	return new Date(date).toLocaleString()
}

export const EpisodeList: React.FC<EpisodeListProps> = ({ episodes }) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>All Episodes</CardTitle>
			</CardHeader>
			<CardContent>
				{episodes.length > 0 ? (
					<ul className="space-y-4">
						{episodes.map(episode => (
							<li key={episode.id} className="flex items-center space-x-4">
								<div className="flex-shrink-0">
									{episode.imageUrl ? (
										<Image src={episode.imageUrl} alt={episode.title} className="h-12 w-12 rounded-md object-cover" width={48} height={48} />
									) : (
										<div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center text-muted-foreground text-xs">No Image</div>
									)}
								</div>
								<div className="flex-1 min-w-0">
									<Link href={`/episodes/${episode.id}`} className="font-medium text-lg hover:underline">
										{episode.title}
									</Link>
									<p className="text-sm text-muted-foreground">{episode.description || "No description available."}</p>
									<p className="text-xs text-muted-foreground">Published: {formatDate(episode.publishedAt)}</p>
								</div>
							</li>
						))}
					</ul>
				) : null}
			</CardContent>
		</Card>
	)
}
