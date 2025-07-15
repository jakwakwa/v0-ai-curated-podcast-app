import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Episode } from "@/lib/types"
import { Calendar, Clock, PlayCircle } from "lucide-react"
import styles from "./podcast-card.module.css"

interface PodcastCardProps {
	episode: Episode
	onPlayEpisode: (episode: Episode) => void
}

export function PodcastCard({ episode, onPlayEpisode }: PodcastCardProps) {
	// TODO: After revamp
	//@ts-ignore
	const getStatusBadgeVariant = (status: Episode["status"]) => {
		switch (status) {
			case "Completed":
				return "outline"
			case "Processing":
				return "default"
			case "Failed":
				return "destructive"
			default:
				return "secondary"
		}
	}

	return (
		<Card className={styles["podcast-card-flex-col"]}>
			<CardHeader>
				<CardTitle className={styles["card-title-lg"]}>{episode.title}</CardTitle>
				<CardDescription className={styles["card-description-flex"]}>
					<Calendar className={styles["icon-small"]} />
					<span>{episode.publishedAt ? new Date(episode.publishedAt).toLocaleDateString() : ""}</span>
				</CardDescription>
			</CardHeader>
			<CardContent className={styles["card-content-flex"]}>
				<div className={styles["items-center-justify-between"]}>
					<Badge variant={getStatusBadgeVariant(episode.collection?.status || "Draft")}>
						{episode.collection?.status || "Draft"}
					</Badge>
					<div className={styles["text-muted-foreground-sm"]}>
						<Clock className={styles["icon-small"]} />
						<span>{episode.audioUrl ? "Available" : "N/A"}</span>
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<Button className={styles["button-full-width"]} disabled={!episode.audioUrl} onClick={() => onPlayEpisode(episode)}>
					<PlayCircle className={styles["button-icon-margin-right"]} />
					Play Episode
				</Button>
			</CardFooter>
		</Card>
	)
}
