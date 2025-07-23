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
					{episodes.map(episode => (
						<div key={episode.id} className={styles["podcast-card"]}>
							<div className={styles["title-container"]}>
								<div className="font-semibold truncate text-sm mb-1">{episode.title}</div>
								{episode.userProfileId && <div className="text-xs text-primary">Profile ID: {episode.userProfileId}</div>}
								{/* <div className="text-xs text-muted-foreground">
									{episode.publishedAt ? new Date(episode.publishedAt).toLocaleDateString() : ""}
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
								{episode.imageUrl && <Image src={episode.imageUrl} alt="Episode" className={styles["episode-image"]} width={100} height={100} />}
								<span className={styles["source-text"]}>Podcast ID: {episode.podcastId}</span>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
