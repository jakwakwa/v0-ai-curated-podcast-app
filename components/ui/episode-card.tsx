"use client"

import Image from "next/image"
import type React from "react"
import { Badge } from "./badge"
import DateIndicator from "./date-indicator"
import DurationIndicator from "./duration-indicator"

type EpisodeCardProps = {
	as?: "li" | "div"
	imageUrl?: string | null
	title: string
	description?: string | null
	publishedAt?: Date | string | null
	durationSeconds?: number | null
	actions?: React.ReactNode
}

export function EpisodeCard({ as = "div", imageUrl, title, description, publishedAt, durationSeconds, actions }: EpisodeCardProps) {
	// biome-ignore lint/suspicious/noExplicitAny: <temp>
	const Root: any = as
	const date: Date = publishedAt ? new Date(publishedAt) : new Date()

	return (
		<Root className="flex flex-row items-center hover:bg-card content/10 active:bg-card justify-between px-8 pt-2 pb-0 w-full gap-8 episode-card w-full relative">
			{imageUrl ? (
				<div className="w-full items-center max-w-[50px]  ">
					<Image src={imageUrl} alt={title} className="absolute top-4 left-2 h-14 w-14 md:h-14 md:w-full border-2 m-2  shadow-md border-[#98CAD35C] rounded-xl object-fill" width={100} height={60} />
				</div>
			) : null}
			<div className=" flex w-full max-width-[900px] flex-col justify-around pb-4  px-0 md:px-0 gap-1">
				<div className=" episode-card-title leading-normal font-bold truncate m-0 w-full max-w-[100px] block text-[#fff]/90">{title}</div>
				<p className="text-card-foreground episode-card-description mb-0 w-full m-0 p-0">{description || "No description available."}</p>
				<Badge size="sm" variant="default" className="w-fit text-card-foreground">
					<DateIndicator size="sm" indicator={date} label={null} />
				</Badge>
				<DurationIndicator size="sm" seconds={durationSeconds ?? null} />
				<div className="absolute top-2 right-8 flex-self-end flex justify-end z-3 hover:z-3 hover:absolute hover:top-0 ">{actions}</div>
			</div>
		</Root>
	)
}

export default EpisodeCard
