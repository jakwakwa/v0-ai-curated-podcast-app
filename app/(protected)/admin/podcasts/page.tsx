import { Suspense } from "react"
import PodcastsPanel from "../_components/PodcastsPanel.server"

export const dynamic = "force-dynamic"

export default function PodcastsPage() {
  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-6">
      <h1 className="text-2xl font-semibold">Podcast Management</h1>
      <Suspense fallback={<div>Loading podcasts…</div>}>
        {/* @ts-expect-error Async Server Component */}
        <PodcastsPanel />
      </Suspense>
    </div>
  )
}


