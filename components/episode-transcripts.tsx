"use client"

import { useState } from "react"
import styles from "./episode-transcripts.module.css"
import { Button } from "./ui/button"

export function EpisodeTranscript({ transcript }: { transcript: string }) {
	const [show, setShow] = useState(false)
	return (
		<div className={styles.transcriptContainer}>
			{!show ? (
				<Button className={styles.showTranscriptButton} onClick={() => setShow(true)} variant="default">
					Show transcript
				</Button>
			) : (
				<div className={styles.transcriptContent}>{transcript}</div>
			)}
		</div>
	)
}
