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
				<div className={styles.audioPlayerInfo}>
					<h5 className={styles.audioPlayerTitle}>{title}</h5>
					{subtitle && <p className={styles.audioPlayerSubtitle}>{subtitle}</p>}
				</div>

				<button className={styles.playPauseButton} onClick={() => setIsPlaying(!isPlaying)} aria-label={isPlaying ? "Pause" : "Play"} type="button">
					{isPlaying ? (
						<svg className={styles.playButtonIcon} viewBox="0 0 32 32" fill="currentColor">
							<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
						</svg>
					) : (
						<svg className={styles.playButtonIcon} viewBox="0 0 32 32" fill="currentColor">
							<path d="M8 5v14l11-7z" />
						</svg>
					)}
				</button>
			</div>
			<div className={styles.waveformContainer}>
				{bars.map((height, index) => (
					<div key={index} className={`${styles.waveformBar} ${isPlaying ? styles.wave : ""}`} style={!isPlaying ? { height: `${height}%` } : {}} />
				))}
			</div>
		</div>
	)
}
