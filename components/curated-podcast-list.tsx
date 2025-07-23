import type { CuratedPodcast } from "@/lib/types"

interface CuratedPodcastListProps {
	onSelectPodcast: (podcast: CuratedPodcast) => void
	selectedPodcasts: CuratedPodcast[]
}

export function CuratedPodcastList({ onSelectPodcast: _onSelectPodcast, selectedPodcasts: _selectedPodcasts }: CuratedPodcastListProps) {
	// TODO: Fix this component after the database schema migration is complete
	return <div>Curated Podcast List - Temporarily disabled during migration</div>
}
