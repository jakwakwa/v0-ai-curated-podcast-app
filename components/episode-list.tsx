import { Music, Play } from "lucide-react"
import Image from "next/image"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Episode } from "@/lib/types"
import DateIndicator from "./ui/date-indicator"
import { Body, Typography } from "./ui/typography"

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
		<Card className="w-full min-h-none md:min-h-[300px]">
			<CardHeader>
				<CardTitle>All Episodes</CardTitle>
			</CardHeader>
			<CardContent>
				{episodes.length > 0 ? (
					<ul className="inline-block gap-1 w-full inline-flex flex-col gap-3">
						{episodes.map(episode => (
							<li key={episode.episode_id} className="flex flex-row items-center  hover:bg-card/10 active:bg-card/20 justify-start px-4 md:px-8 py-4 w-full gap-6 episode-card w-full ">
								<div className="pl-1 w-full max-w-[90px]">
									{episode.image_url ? (
										<Image src={episode.image_url} alt={episode.title} className="h-34 w-full max-w-[80px] md:h-24 md:w-full rounded-md object-cover" width={200} height={120} />
									) : (
										<div className="h-8 w-8 md:h-24 md:w-24 rounded-md bg-muted flex items-center justify-center">
											<Music className="h-6 w-6 text-muted-foreground" />
										</div>
									)}
								</div>
								<div className="flex w-[100%] min-width-[100%] flex-col justify-around py-2  px-0 md:px-0 gap-1">
									{/* TypeError: Failed to parse URL from v0-ai-curated-podcast-app.vercel.app/api/episodes */}

									<Typography as="h5" className="font-heading font-bold truncate mb-0 w-full block">
										{episode.title}
									</Typography>

									<Body className=" text-custom-sm text-muted-foreground episode-card-description mb-0 w-full">{episode.description || "No description available."}</Body>
									<DateIndicator size="sm" indicator={episode.published_at || new Date()} label="Published" />
									{/* Play button - delegates to parent component */}
									{episode.audio_url && onPlayEpisode && (
										<div className="mt-1 ml-0 pl-0 flex-self-start w-full flex justify-start">
											<Button
												onClick={() => onPlayEpisode(episode.episode_id)}
												variant="default"
												size="sm"
												className={playingEpisodeId === episode.episode_id ? "bg-[black]/90 m-0 p-0 w-4 h-4" : "bg-[black]"}
											>
												<Play className="w-auto h-auto text-custom-xxs md:text-custom-sm md:w-6 md:h-auto md:max-w-3 md:max-h-6 pl-0 py-[1px] text-left" width={"18x"} height={"18px"} />
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
