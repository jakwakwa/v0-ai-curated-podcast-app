import type { Podcast } from "@/lib/types"

interface CuratedPodcastListProps {
onSelectPodcast: (podcast: Podcast) => void
selectedPodcasts: Podcast[]
}

export function CuratedPodcastList({ onSelectPodcast: _onSelectPodcast, selectedPodcasts: _selectedPodcasts }: CuratedPodcastListProps) {
return <div>Curated Podcast List - Temporarily disabled during migration</div>
}
