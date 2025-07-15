import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Episode } from "@/lib/types"

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
						<div
							key={episode.id}
							className="flex bg-[linear-gradient(180deg, #242424, #121212 65.62%)] amber-950 flex-col border rounded-lg p-4 min-h-[300px] max-h-[400px] md:max-h-[300px]"
						>
							<div className="mb-0">
								<div className="font-semibold truncate text-sm mb-1">{episode.title}</div>
								{episode.collection && (
									<div className="text-xs text-primary">Collection: {episode.collection.name}</div>
								)}
								{/* <div className="text-xs text-muted-foreground">
									{episode.publishedAt ? new Date(episode.publishedAt).toLocaleDateString() : ""}
								</div> */}
							</div>

							{episode.description && (
								<div
									className="text-xs text-muted-foreground mb-0 max-h-4 "
									style={{
										maxHeight: "2rem",
										display: "-ms-flexbox",
										boxDecorationBreak: "slice",
										lineClamp: "1",
										textOverflow: "ellipsis",
										overflow: "hidden",
										margin: " 1rem 0rem 1rem 0rem",
									}}
								>
									{episode.description}
								</div>
							)}
							<div className="flex flex-col h-4 gap-1 items-start">
								{episode.imageUrl && <img src={episode.imageUrl} alt="Episode" className="w-64 h-40 rounded" />}
								{episode.source && (
									<span className="text-xs text-muted-foreground truncate max-w-[250px]">
										Source: {episode.source.name}
									</span>
								)}
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
