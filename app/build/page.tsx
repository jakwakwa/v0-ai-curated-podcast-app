import { Header } from "@/components/header"
import { CurationBuilder } from "@/components/curation-builder"
import { getCuratedCollections } from "@/lib/data"

export default async function BuildCurationPage() {
  const collections = await getCuratedCollections()
  const draftCollection = collections.find((c) => c.status === "Draft")

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <CurationBuilder collection={draftCollection} />
        </div>
      </main>
    </div>
  )
}
