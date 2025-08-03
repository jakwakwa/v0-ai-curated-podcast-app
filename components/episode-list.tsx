import { Music, Play } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Episode } from "@/lib/types"

interface EpisodeListProps {
	episodes: Episode[]
	onPlayEpisode?: (episodeId: string) => void
	playingEpisodeId?: string | null
}

const formatDate = (date: Date | null | undefined) => {
	if (!date) return "N/A"
	return new Date(date).toLocaleString()
}

export const EpisodeList: React.FC<EpisodeListProps> = ({ episodes, onPlayEpisode, playingEpisodeId }) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>All Episodes</CardTitle>
			</CardHeader>
			<CardContent>
				{episodes.length > 0 ? (
					<ul className="flex flex-col gap-4">
						{episodes.map(episode => (
							<li key={episode.episode_id} className="flex items-center gap-4">
								<div className="flex-shrink-0">
									{episode.image_url ? (
										<Image src={episode.image_url} alt={episode.title} className="h-12 w-12 rounded-md object-cover" width={48} height={48} />
									) : (
										<div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
											<Music className="h-6 w-6 text-muted-foreground" />
										</div>
									)}
								</div>
								<div className="flex-1 min-w-0">
									<Link href={`/episodes/${episode.episode_id}`} className="font-medium text-lg leading-7 hover:underline">
										{episode.title}
									</Link>
									<p className="text-sm leading-5 text-muted-foreground">{episode.description || "No description available."}</p>
									<p className="text-xs leading-4 text-muted-foreground">Published: {episode.published_at ? formatDate(episode.published_at) : "No date"}</p>
									{/* Play button - delegates to parent component */}
									{episode.audio_url && onPlayEpisode && (
										<div className="mt-2">
											<Button
												onClick={() => onPlayEpisode(episode.episode_id)}
												variant="outline"
												size="sm"
												className={playingEpisodeId === episode.episode_id ? "bg-primary text-primary-foreground" : ""}
											>
												<Play className="w-4 h-4 mr-1" />
												{playingEpisodeId === episode.episode_id ? "Playing..." : "Play Episode"}
											</Button>
										</div>
									)}
								</div>
							</li>
						))}
					</ul>
				) : (
					<div className="text-center py-8 text-muted-foreground">
						<Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
						<p>No episodes available</p>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
