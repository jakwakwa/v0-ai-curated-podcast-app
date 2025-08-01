import { Music } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Episode } from "@/lib/types"
import styles from "./episode-list.module.css"

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
					<ul className={styles.episodeList}>
						{episodes.map(episode => (
							<li key={episode.episode_id} className={styles.episodeListItem}>
								<div className={styles.episodeImageContainer}>
									{episode.image_url ? (
										<Image src={episode.image_url} alt={episode.title} className={styles.episodeImage} width={48} height={48} />
									) : (
										<div className={styles.episodePlaceholder}>
											<Music className={styles.episodePlaceholderIcon} />
										</div>
									)}
								</div>
								<div className={styles.episodeDetails}>
									<Link href={`/episodes/${episode.episode_id}`} className={styles.episodeTitle}>
										{episode.title}
									</Link>
									<p className={styles.episodeDescription}>{episode.description || "No description available."}</p>
									<p className={styles.episodeDate}>Published: {episode.published_at ? formatDate(episode.published_at) : "No date"}</p>
								</div>
							</li>
						))}
					</ul>
				) : null}
			</CardContent>
		</Card>
	)
}
