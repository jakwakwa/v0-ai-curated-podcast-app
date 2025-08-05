"use client"

import { useEffect, useRef, useState } from "react"
import styles from "@/styles/new-landing-page.module.css"

interface LandingAudioPlayerProps {
	title: string
	subtitle?: string
}

const generateBars = () => {
	// Using a seeded pattern for visual consistency
	return Array.from({ length: 40 }, (_, i) => {
		// Creates a wave-like pattern
		return 10 + Math.sin(i * 0.4) * 15 + Math.random() * 20
	})
}

export default function LandingAudioPlayer({ title, subtitle }: LandingAudioPlayerProps) {
	const [isPlaying, setIsPlaying] = useState(false)
	const audioRef = useRef<HTMLAudioElement>(null)
	const [bars, setBars] = useState<number[]>([])

	useEffect(() => {
		setBars(generateBars())
	}, [])

	useEffect(() => {
		if (isPlaying) {
			audioRef.current?.play()
		} else {
			audioRef.current?.pause()
		}
	}, [isPlaying])

	return (
		<div className={styles.audioPlayerContainer}>
			{/** biome-ignore lint/a11y/useMediaCaption: <keep> */}
			<audio ref={audioRef} src="/podslice-sample.mp3" onEnded={() => setIsPlaying(false)} />
			<div className={styles.audioPlayerHeader}>
				<button className={styles.playPauseButton} onClick={() => setIsPlaying(!isPlaying)} aria-label={isPlaying ? "Pause" : "Play"} type="button">
					{isPlaying ? (
						<svg className={styles.playButtonIcon} viewBox="0 0 24 24" fill="currentColor">
							<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
						</svg>
					) : (
						<svg className={styles.playButtonIcon} viewBox="0 0 24 24" fill="currentColor">
							<path d="M8 5v14l11-7z" />
						</svg>
					)}
				</button>
				<div className={styles.audioPlayerInfo}>
					<h3 className={styles.audioPlayerTitle}>{title}</h3>
					{subtitle && <p className={styles.audioPlayerSubtitle}>{subtitle}</p>}
				</div>
				<svg className={styles.volumeIcon} viewBox="0 0 24 24" fill="currentColor">
					<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
				</svg>
			</div>
			<div className={styles.waveformContainer}>
				{bars.map((height, index) => (
					<div key={index} className={`${styles.waveformBar} ${isPlaying ? styles.wave : ""}`} style={!isPlaying ? { height: `${height}%` } : {}} />
				))}
			</div>
		</div>
	)
}
