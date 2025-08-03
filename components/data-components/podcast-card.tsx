import { Calendar, Clock, PlayCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Episode } from "@/lib/types"
import styles from "./podcast-card.module.css"

interface PodcastCardProps {
	episode: Episode
	onPlayEpisode: (episode: Episode) => void
}

/* JS DOC */
/**
 * @description This component is used to display a podcast card.
 * @param {Object} props - The component props
 * @param {Episode} props.episode - The episode data
 * @param {Function} props.onPlayEpisode - The function to play the episode
 * @returns {JSX.Element} The PodcastCard component (Card)
 */
export function PodcastCard({ episode, onPlayEpisode }: PodcastCardProps) {
	return (
		<Card className={styles["podcast-card-flex-col"]}>
			<CardHeader>
				<CardTitle className={styles["card-title-lg"]}>{episode.title}</CardTitle>
				<CardDescription className={styles["card-description-flex"]}>
					<Calendar className={styles["icon-small"]} />
					<span>{episode.published_at ? new Date(episode.published_at).toLocaleDateString() : "N/A"}</span>
				</CardDescription>
			</CardHeader>
			<CardContent className={styles["card-content-flex"]}>
				<div className={styles["items-center-justify-between"]}>
					<div className={styles["text-muted-foreground-sm"]}>
						<Clock className={styles["icon-small"]} />
						<span>{episode.audio_url ? "Available" : "N/A"}</span>
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<Button className={styles["button-full-width"]} disabled={!episode.audio_url} onClick={() => onPlayEpisode(episode)} variant="default">
					<PlayCircle className={styles["button-icon-margin-right"]} />
					Play Episode
				</Button>
			</CardFooter>
		</Card>
	)
}
