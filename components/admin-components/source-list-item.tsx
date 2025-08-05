"use client"

// import { X } from "lucide-react"
import Image from "next/image"
import { removePodcastSource } from "@/app/actions"
import type { Source } from "@/lib/types"
import { Card } from "../ui/card"
// CSS module migrated to Tailwind classes

export function SourceListItem({ source }: { source: Source }) {
	return (
		<Card className="flex flex-col items-center gap-4 p-4">
			<div className="w-full max-w-[200px] md:max-w-[100px] lg:max-w-[150px] p-0">
				<Image src={source.image_url || "/placeholder.svg"} alt={`${source.name} cover art`} width={80} height={80} className="rounded-sm border p-0" />
			</div>
			<div className="w-full flex flex-col justify-start">
				<p className="text-xs">{source.name}</p>
				<p className="text-xs text-muted-foreground truncate">{source.url}</p>
			</div>
			<form action={removePodcastSource}>
				<input type="hidden" name="id" value={source.id} />
			</form>
		</Card>
	)
}
