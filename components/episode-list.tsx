import { Music, Play } from "lucide-react"
import Image from "next/image"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Episode } from "@/lib/types"
import DateIndicator from "./ui/date-indicator"
import { Typography } from "./ui/typography"

interface EpisodeListProps {
	episodes: Episode[]
	onPlayEpisode?: (episodeId: string) => void
	playingEpisodeId?: string | null
	_href?: string // TODO: remove this
}

const _formatDate = (date: Date | null | undefined) => {
	if (!date) return "N/A"
	return new Date(date).toLocaleString()
}

export const EpisodeList: React.FC<EpisodeListProps> = ({ episodes, onPlayEpisode, playingEpisodeId }) => {
	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>All Episodes</CardTitle>
			</CardHeader>
			<CardContent>
				{episodes.length > 0 ? (
					<ul className="flex flex-col justify-start gap-2 w-full">
						{episodes.map(episode => (
							<li key={episode.episode_id} className="flex items-center bg-card/50 hover:bg-card/10 active:bg-card/20 justify-start px-12 py-4 w-full px-0 gap-6 episode-card w-full ">
								<div className="flex-shrink-0 pl-4">
									{episode.image_url ? (
										<Image src={episode.image_url} alt={episode.title} className="h-24 w-24 rounded-md object-cover" width={96} height={96} />
									) : (
										<div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
											<Music className="h-6 w-6 text-muted-foreground" />
										</div>
									)}
								</div>
								<div className="flex  w-full flex-col justify-around py-2  px-3 gap-1">
									{/* TypeError: Failed to parse URL from v0-ai-curated-podcast-app.vercel.app/api/episodes */}

									<Typography className="text-custom-h5 font-medium">{episode.title}</Typography>

									<p className="text-custom-sm text-muted-foreground episode-card-description truncate max-w-full md:max-w-xs">{episode.description || "No description available."}</p>
									<DateIndicator size="sm" indicator={episode.published_at || new Date()} label="Published" />
									{/* Play button - delegates to parent component */}
									{episode.audio_url && onPlayEpisode && (
										<div className="mt-2 ml-0 pl-0 flex-self-start w-full flex justify-start">
											<Button onClick={() => onPlayEpisode(episode.episode_id)} variant="default" size="sm" className={playingEpisodeId === episode.episode_id ? "m-0 p-0" : ""}>
												<Play className="w-4 h-4 text-custom-xxs max-w-3 max-h-3 pl-0 text-left" />
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
