"use client"

import Image from "next/image"
import type React from "react"
import { Badge } from "./badge"
import DateIndicator from "./date-indicator"
import DurationIndicator from "./duration-indicator"
import { Body } from "./typography"

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
		<Root className="flex flex-row items-center hover:bg-card content/10 active:bg-card justify-between px-8 py-2 w-full gap-8 episode-card w-full ">
			{imageUrl ? (
				<div className="  w-full items-center max-w-[50px]  ">
					<Image src={imageUrl} alt={title} className="h-20 w-full max-w-[70px] md:h-14 md:w-full border-1 m-2   shadow-md border-[#201326F3] rounded-2xl object-fill" width={100} height={60} />
				</div>
			) : null}
			<div className="flex w-[100%] max-width-[300px] w-full flex-col justify-around py-2  px-0 md:px-0 gap-1">
				<div className="episode-card-title leading-normal font-bold truncate m-0 w-full max-w-[100px] block text-[#fff]/90">{title}</div>
				<Body className=" text-custom-xs text-card-foreground episode-card-description mb-0 w-full">{description || "No description available."}</Body>
				<Badge size="sm" variant="default" className="w-fit text-card-foreground">
					<DateIndicator size="sm" indicator={date} label={null} />
				</Badge>
				<DurationIndicator size="sm" seconds={durationSeconds ?? null} />
				<div className="absolute bottom-3 right-3 flex-self-end flex justify-end ">{actions}</div>
			</div>

		</Root>
	)
}

export default EpisodeCard
