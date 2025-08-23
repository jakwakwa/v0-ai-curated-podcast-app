"use client"

import { Music } from "lucide-react"
import Image from "next/image"
import type React from "react"
import DateIndicator from "./date-indicator"
import { Body, Typography } from "./typography"

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
        <Root className="flex bg-card content flex-row items-center  hover:bg-card content/10 active:bg-card content/20 justify-start px-4 md:px-8 py-4 w-full gap-6 episode-card w-full ">
            <div className="pl-1 w-full max-w-[90px]">
                {imageUrl ? (
                    <Image src={imageUrl} alt={title} className="h-34 w-full max-w-[80px] md:h-24 md:w-full rounded-md object-cover" width={200} height={120} />
                ) : (
                    <div className="h-8 w-8 md:h-24 md:w-24 rounded-md bg-muted flex items-center justify-center">
                        <Music className="h-6 w-6 text-muted-foreground" />
                    </div>
                )}
            </div>
            <div className="flex w-[100%] min-width-[100%] flex-col justify-around py-2  px-0 md:px-0 gap-1">
                <Typography as="h5" className="font-heading font-bold truncate mb-0 w-full block">
                    {title}
                </Typography>
                <Body className=" text-custom-sm text-muted-foreground episode-card-description mb-0 w-full">{description || "No description available."}</Body>
                <DateIndicator size="sm" indicator={date} label="Published" />

                <div className="mt-1 ml-0 pl-0 flex-self-start w-full flex justify-start gap-2">{actions}</div>
            </div>
        </Root>
    )
}

export default EpisodeCard
