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
				<CardTitle className="text-lg">{episode.title}</CardTitle>
				<CardDescription className="flex items-start gap-2 text-sm">
					<Calendar className="h-4 w-4" />
					<span>{episode.publishedAt ? new Date(episode.publishedAt).toLocaleDateString() : ""}</span>
				</CardDescription>
			</CardHeader>
			<CardContent className="flex">
				<div className="flex items-center justify-between">
					<Badge variant={getStatusBadgeVariant(episode.collection?.status || "Draft")}>
						{episode.collection?.status || "Draft"}
					</Badge>
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Clock className="h-4 w-4" />
						<span>{episode.audioUrl ? "Available" : "N/A"}</span>
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<Button className="w-full" disabled={!episode.audioUrl} onClick={() => onPlayEpisode(episode)}>
					<PlayCircle className="mr-2 h-4 w-4" />
					Play Episode
				</Button>
			</CardFooter>
		</Card>
	)
}
