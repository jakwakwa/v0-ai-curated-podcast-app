import { Header } from "@/components/header"
import { PodcastList } from "@/components/podcast-list"
import { CurationDashboard } from "@/components/curation-dashboard"
import { getPodcasts, getCuratedCollections } from "@/lib/data"
import { auth } from "@/auth"
import { AudioPlayer } from "@/components/audio-player"

export default async function DashboardPage() {
  const [podcasts, collections] = await Promise.all([getPodcasts(), getCuratedCollections()])
  const session = await auth()

  const savedCollections = collections.filter((c) => c.status === "Saved")

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header user={session?.user} />
      <main className="flex flex-1 flex-col gap-8 p-4 md:p-8 pb-24">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PodcastList podcasts={podcasts} />
          </div>
          <CurationDashboard savedCollections={savedCollections} />
        </div>
      </main>
      <AudioPlayer />
    </div>
  )
}
