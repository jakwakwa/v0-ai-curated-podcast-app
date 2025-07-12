"use client"

import Image from "next/image"
import { useFormStatus } from "react-dom"
import { removePodcastSource } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { PodcastSource } from "@/lib/types"

function RemoveButton() {
  const { pending } = useFormStatus()
  return (
    <Button size="icon" variant="ghost" type="submit" disabled={pending}>
      <X className="h-4 w-4" />
      <span className="sr-only">Remove</span>
    </Button>
  )
}

export function SourceListItem({ source }: { source: PodcastSource }) {
  return (
    <div className="flex items-center gap-4">
      <Image
        src={source.imageUrl || "/placeholder.svg"}
        alt={`${source.name} cover art`}
        width={40}
        height={40}
        className="rounded-md"
      />
      <div className="flex-grow">
        <p className="font-medium">{source.name}</p>
        <p className="text-sm text-muted-foreground truncate">{source.url}</p>
      </div>
      <form action={removePodcastSource}>
        <input type="hidden" name="id" value={source.id} />
        <RemoveButton />
      </form>
    </div>
  )
}
