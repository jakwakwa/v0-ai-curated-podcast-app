"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PlayCircle, Sparkles } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { CuratedCollection } from "@/lib/types"
import Link from "next/link";
import { getCollectionStatus } from "@/app/actions";

export function SavedCollectionCard({ collection }: { collection: CuratedCollection }) {
  const [isLoading, setIsLoading] = useState(false)
  const [currentCollection, setCurrentCollection] = useState(collection);
  const { toast } = useToast()

  useEffect(() => {
    setCurrentCollection(collection);
  }, [collection]);

  const formattedTime = currentCollection.createdAt.toLocaleTimeString('en-ZA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Use 24-hour format
    timeZone: 'Africa/Johannesburg',
  });

  const displayTimestamp = formattedTime;

  const handleGenerate = async () => {
    setIsLoading(true)
    let pollingInterval: NodeJS.Timeout | null = null;

    try {
      const response = await fetch("/api/generate-podcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collectionId: currentCollection.id }),
      })
      if (!response.ok) throw new Error("API call failed")

      toast({
        title: "Podcast Generation Initiated",
        description: `The process for "${currentCollection.name}" has started. We'll update the status shortly.`,
      })

      // Start polling for status update
      pollingInterval = setInterval(async () => {
        const updatedCollection = await getCollectionStatus(currentCollection.id);
        if (updatedCollection && updatedCollection.status === "Generated") {
          setCurrentCollection({
            ...updatedCollection,
            status: updatedCollection.status as CuratedCollection['status'],
          });
          setIsLoading(false);
          if (pollingInterval) clearInterval(pollingInterval);
          toast({
            title: "Podcast Generated!",
            description: `The podcast for "${updatedCollection.name}" is now ready.`, 
            variant: "default"
          });
        } else if (updatedCollection && updatedCollection.status === "Failed") {
          setIsLoading(false);
          if (pollingInterval) clearInterval(pollingInterval);
          toast({
            title: "Podcast Generation Failed",
            description: `The podcast for "${updatedCollection.name}" failed to generate.`, 
            variant: "destructive"
          });
        }
      }, 5000); // Poll every 5 seconds

      // Add a timeout to stop polling after a certain period (e.g., 5 minutes)
      setTimeout(() => {
        if (isLoading && pollingInterval) {
          clearInterval(pollingInterval);
          setIsLoading(false);
          toast({
            title: "Generation Timeout",
            description: "Podcast generation is taking longer than expected. Please check back later.",
            variant: "destructive"
          });
        }
      }, 300000); // 5 minutes timeout

    } catch (error) {
      console.error("Error initiating podcast generation:", error);
      toast({ title: "Error", description: "Failed to initiate podcast generation.", variant: "destructive" })
      setIsLoading(false);
      if (pollingInterval) clearInterval(pollingInterval);
    }
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-4">
        <h4 className="font-semibold">{currentCollection.name}</h4>
        <p className="text-sm text-muted-foreground">Created: {displayTimestamp}</p>
        {currentCollection.status === "Saved" && (
          <Button type="button" onClick={handleGenerate} disabled={isLoading} variant="default">
            {isLoading ? (
              "Generating..."
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Podcast
              </>
            )}
          </Button>
        )}

        {currentCollection.status === "Generated" && (
          <Link href={`/collections/${currentCollection.id}`}>
            <Button variant="default" className="w-full bg-primary text-primary-foreground rounded px-4 py-2 font-semibold hover:bg-primary/90 transition">View Episodes</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
