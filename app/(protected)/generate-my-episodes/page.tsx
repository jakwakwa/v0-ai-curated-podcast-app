import type { Metadata } from "next"
import { EpisodeCreator } from "../my-episodes/_components/episode-creator"
import { UsageDisplay } from "../my-episodes/_components/usage-display"

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
    return { title: "Generate My Episodes", description: "Create new episodes from YouTube links." }
}

export default async function GenerateMyEpisodesPage() {
    return (
        <div className="container mx-auto p-4 space-y-8">
            <UsageDisplay />
            <EpisodeCreator />
        </div>
    )
}


