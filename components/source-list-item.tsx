"use client"

import { removePodcastSource } from "@/app/actions"
import type { Source } from "@/lib/types"
// import { X } from "lucide-react"
import Image from "next/image"
import styles from "./source-list-item.module.css"
import { Card } from "./ui/card"

export function SourceListItem({ source }: { source: Source }) {
	return (
		<Card className={styles["card-container"]}>
			<div className={styles["image-wrapper"]}>
				<Image
					src={source.imageUrl || "/placeholder.svg"}
					alt={`${source.name} cover art`}
					width={80}
					height={80}
					className={styles["image-styles"]}
				/>
			</div>
			<div className={styles["text-content-wrapper"]}>
				<p className={styles["text-xs"]}>{source.name}</p>
				<p className={`${styles["text-xs"]} ${styles["text-muted-foreground"]}`}>{source.url}</p>
			</div>
			<form action={removePodcastSource}>
				<input type="hidden" name="id" value={source.id} />
			</form>
		</Card>
	)
}
