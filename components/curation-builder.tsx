import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { AddSourceForm } from "./add-source-form"
import { SourceList } from "./source-list"
import { Button } from "./ui/button"
import { saveCuration, createDraftCollection } from "@/app/actions"
import type { CuratedCollection } from "@/lib/types"
import Link from "next/link"

function SaveCurationForm({ collectionId, disabled }: { collectionId: string; disabled: boolean }) {
  return (
    <form action={saveCuration} className="w-full">
      <input type="hidden" name="collectionId" value={collectionId} />
      <Button type="submit" className="w-full" disabled={disabled}>
        Save Curation & Return to Dashboard
      </Button>
    </form>
  )
}

export function CurationBuilder({ collection }: { collection?: CuratedCollection }) {
  if (!collection) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Draft Found</CardTitle>
          <CardDescription>It looks like there's no draft collection to work on.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createDraftCollection}>
            <Button type="submit">Create New Collection</Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  const sources = collection.sources ?? []
  const sourceCount = sources.length
  const canAddMore = sourceCount < 5
  const canSave = sourceCount === 5

  return (
    <Card>
      <CardHeader>
        <CardTitle>Build Your Weekly Curation</CardTitle>
        <CardDescription>
          Add 5 Spotify shows to create a new collection. This collection will be used to generate your next podcast
          episode.
        </CardDescription>

      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="text-center font-semibold text-lg">Sources Added: {sourceCount} / 5</div>
        <AddSourceForm disabled={!canAddMore} />
        <SourceList sources={sources} />
      </CardContent>
      <CardFooter>
        <SaveCurationForm collectionId={collection.id} disabled={!canSave} />
      </CardFooter>
      <CardContent>
 
            <Link href={"/"}>Back to Dashboard</Link>
    
        </CardContent>
    </Card>
    
  )
}
