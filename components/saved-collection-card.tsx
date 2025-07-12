"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { CuratedCollection } from "@/lib/types"

export function SavedCollectionCard({ collection }: { collection: CuratedCollection }) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

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
        title: "Podcast Generation Started",
        description: `Generating podcast for "${collection.name}".`,
      })
    } catch (error) {
      toast({ title: "Error", description: "Could not start generation.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-4">
        <h4 className="font-semibold">{collection.name}</h4>
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
      <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
        <Sparkles className="mr-2 h-4 w-4" />
        {isLoading ? "Generating..." : "Generate Podcast"}
      </Button>
    </div>
  )
}
