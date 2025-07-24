import Image from "next/image"
import { notFound } from "next/navigation"
import AudioPlayer from "@/components/ui/audio-player" // Import as default
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface EpisodePageProps {
	params: Promise<{ id: string }>
}

const EpisodeDetailPage = async ({ params }: EpisodePageProps) => {
	const { id } = await params

	// Fetch episodes from API
	const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/episodes`, {
		cache: "no-store",
	})

	if (!response.ok) {
		notFound()
	}

	const episodes = await response.json()
	const episode = episodes.find((ep: { episode_id: string }) => ep.episode_id === id)

	if (!episode) {
		notFound()
	}

	return (
		<div className="container mx-auto py-8">
			<Card>
				<CardHeader>
					<CardTitle>{episode.title}</CardTitle>
					{episode.published_at && <CardDescription>Published: {new Date(episode.published_at).toLocaleDateString()}</CardDescription>}
				</CardHeader>
				<CardContent>
					{episode.image_url && (
						<div className="mb-4">
							<Image src={episode.image_url} alt={episode.title} width={800} height={400} className="w-full h-auto object-cover rounded-md mb-4" />
						</div>
					)}
					<p className="text-muted-foreground mb-4">{episode.description}</p>
					{episode.audio_url ? (
						<AudioPlayer episode={episode} /> // Pass the entire episode object
					) : (
						<p className="text-red-500">Audio not available for this episode.</p>
					)}
				</CardContent>
			</Card>
		</div>
	)
}

export default EpisodeDetailPage
