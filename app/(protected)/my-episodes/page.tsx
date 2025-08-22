import type { Metadata } from "next"
import { Suspense } from "react"
import { EpisodeCreator } from "./_components/episode-creator"
import { EpisodeList } from "./_components/episode-list"
import { UsageDisplay } from "./_components/usage-display"

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
    return { title: "My Episodes", description: "Create and manage your custom episodes." }
}

export default async function MyEpisodesPage() {
    return (
        <div className="container mx-auto p-4 space-y-8">
            <UsageDisplay />
            <EpisodeCreator />
            <Suspense fallback={<div>Loading episodes...</div>}>
                <EpisodeList />
            </Suspense>
        </div>
    )
}
