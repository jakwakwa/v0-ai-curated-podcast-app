"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlayCircle, Sparkles } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { CuratedCollection } from "@/lib/types"

export function SavedCollectionCard({ collection }: { collection: CuratedCollection }) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const formattedTime = collection.createdAt.toLocaleTimeString('en-ZA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Use 24-hour format
    timeZone: 'Africa/Johannesburg',
  });

  const displayTimestamp = formattedTime;

  const handleGenerate = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/generate-podcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collectionId: collection.id }),
      })
      if (!response.ok) throw new Error("API call failed")
      toast({
        title: "Podcast Generation Initiated",
        description: `The process for "${collection.name}" has started.`,
      })
    } catch {
      toast({ title: "Error", description: "Failed to initiate podcast generation.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-4">
        <h4 className="font-semibold">{collection.name}</h4>
        <p className="text-sm text-muted-foreground">Created: {displayTimestamp}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {collection.sources.map((source) => (
            <Image
              key={source.id}
              src={source.imageUrl || "/placeholder.svg"}
              alt={source.name}
              width={24}
              height={24}
              className="rounded-full"
              title={source.name}
            />
          ))}
        </div>
      </div>
      {collection.status === "Generated" && collection.audioUrl ? (
        <div className="flex flex-col gap-2">
          <audio controls src={collection.audioUrl} className="w-full" />
          <Button className="w-full" asChild>
            <a href={collection.audioUrl} target="_blank" rel="noopener noreferrer" download>
              <PlayCircle className="mr-2 h-4 w-4" />
              Download Podcast
            </a>
          </Button>
        </div>
      ) : (
        <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
          <Sparkles className="mr-2 h-4 w-4" />
          {isLoading ? "Generating..." : "Generate Podcast"}
        </Button>
      )}
    </div>
  )
}
