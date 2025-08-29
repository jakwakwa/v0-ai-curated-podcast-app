import type { Metadata } from "next"
import { Suspense } from "react"
import { EpisodeList } from "./_components/episode-list"

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
    return { title: "My Episodes", description: "All your completed, generated episodes." }
}

export default async function MyEpisodesPage() {
    return (
        <div className="container mx-auto p-4 space-y-8">
            <Suspense fallback={<div>Loading episodes...</div>}>
                <EpisodeList completedOnly />
            </Suspense>
        </div>
    )
}
