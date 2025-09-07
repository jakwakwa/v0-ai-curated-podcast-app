"use client"

import Image from "next/image"
import type React from "react"
import { Badge } from "./badge"
import DateIndicator from "./date-indicator"

type EpisodeCardProps = {
	as?: "li" | "div"
	imageUrl?: string | null
	title: string
	description?: string | null
	publishedAt?: Date | string | null
	actions?: React.ReactNode
}

export function EpisodeCard({ as = "div", imageUrl, title, description, publishedAt, actions }: EpisodeCardProps) {
	// biome-ignore lint/suspicious/noExplicitAny: <temp>
	const Root: any = as
	const date: Date = publishedAt ? new Date(publishedAt) : new Date()

	return (
		<Root className="flex flex-row items-center hover:bg-card content/10 active:bg-card justify-between px-8 py-2 w-full gap-8 episode-card w-full ">
			{imageUrl ? (
				<div className="  w-full items-center max-w-[50px]  ">
					<Image src={imageUrl} alt={title} className="h-13 w-full max-w-[70px] md:h-14 md:w-full border-1 m-2   shadow-md border-[#201326F3] rounded-2xl object-fill" width={100} height={60} />
				</div>
			) : null}
			<div className="relative flex w-full max-width-[900px] flex-col justify-around py-2  px-0 md:px-0 gap-1">
				<div className="relative episode-card-title leading-normal font-bold truncate m-0 w-full max-w-[100px] block text-[#fff]/90">{title}</div>
				<p className="text-card-foreground episode-card-description mb-0 w-full m-0 p-0">{description || "No description available."}</p>
				<Badge size="sm" variant="default" className="w-fit text-card-foreground">
					<DateIndicator size="sm" indicator={date} label={null} />
				</Badge>
				<div className=" flex-self-end flex justify-end ">{actions}</div>
			</div>
		</Root>
	)
}

export default EpisodeCard
