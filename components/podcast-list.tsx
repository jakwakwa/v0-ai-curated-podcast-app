import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Episode } from "@/lib/types"
import styles from "./podcast-list.module.css"

interface PodcastListProps {
	episodes: Episode[]
}

export function PodcastList({ episodes }: PodcastListProps) {
	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Latest Episodes</CardTitle>
				<CardDescription>Manage and listen to your AI-generated podcast episodes.</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-1 sm:grid-cols-1 lg:grid-cols-2">
					{episodes
						.filter(episode => episode.profile_id)
						.map(episode => (
							<div key={episode.episode_id} className={styles["podcast-card"]}>
								<div className={styles["title-container"]}>
									<div className="font-semibold truncate text-sm mb-1">{episode.title}</div>
									{episode.profile_id && <div className="text-xs text-primary">Profile ID: {episode.profile_id}</div>}
									{/* <div className="text-xs text-muted-foreground">
									{episode.published_at ? new Date(episode.published_at).toLocaleDateString() : ""}
								</div> */}
								</div>

								{episode.description && (
									<div
										className={styles["description-text"]}
										style={
											{
												// These styles are now handled by the CSS module, but keeping them here for context if needed
											}
										}
									>
										{episode.description}
									</div>
								)}
								<div className={styles["image-container"]}>
									{episode.image_url && <Image src={episode.image_url} alt="Episode" className={styles["episode-image"]} width={100} height={100} />}
									<span className={styles["source-text"]}>Podcast ID: {episode.podcast_id}</span>
								</div>
							</div>
						))}
				</div>
			</CardContent>
		</Card>
	)
}
