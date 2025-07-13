import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Episode } from "@/lib/types"

interface PodcastListProps {
  episodes: Episode[]
}

export function PodcastList({ episodes }: PodcastListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Episodes</CardTitle>
        <CardDescription>Manage and listen to your AI-generated podcast episodes.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {episodes.map((episode) => (
            <div key={episode.id} className="flex flex-col border rounded-lg p-4 bg-card max-h-[50px] md:max-h-[100px]">
              <div className="mb-2">
                <div className="font-semibold text-lg">{episode.title}</div>
                {episode.collection && (
                  <div className="text-xs text-muted-foreground">Collection: {episode.collection.name}</div>
                )}
                <div className="text-xs text-muted-foreground">
                  {episode.publishedAt ? new Date(episode.publishedAt).toLocaleDateString() : ""}
                </div>
              </div>
              <div >
              <audio style={{  height: "30px", maxHeight: "4rem",
                  overflow: "hidden", 
                  margin:" 1rem 0rem 1rem 0rem"}} controls src={episode.audioUrl} className="w-full my-2" /></div>
                  {episode.description && (
                <div className="text-sm text-muted-foreground mb-2 max-h-12 " style={{   maxHeight: "4rem",
                  overflow: "hidden", 
                  margin:" 1rem 0rem 1rem 0rem"}}>{episode.description}</div>
              )}
              <div className="flex gap-2 items-center">
                {episode.imageUrl && (
                  <img src={episode.imageUrl} alt="Episode" className="w-8 h-8 rounded" />
                )}
                {/* {episode.source && (
                  <span className="text-xs text-muted-foreground">Source: {episode.source.name}</span>
                )} */}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
