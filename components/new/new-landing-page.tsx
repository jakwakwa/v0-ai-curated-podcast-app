//@ts-nocheck
/** biome-ignore-all assist/source/organizeImports: <sorted> */
"use client"

import Image from "next/image"
// biome-ignore lint/correctness/noUnusedImports: <suppressing unused imports>
import { type ChangeEvent, type FormEvent, useState, useEffect, useRef } from "react"
// import Link from "next/link"
import { Button } from "@/components/new/button-new"
// import { Input } from "@/components/new/input-new"
import {
	// ArrowRight,

	Brain,
	// CheckCircle,
	Clock,
	Headphones,
	// Mail,
	Pause,
	Play,
	// Star,
	Volume2,
	Zap,
} from "lucide-react"
import { motion } from "framer-motion"
import styles from "./new-landing-page.module.css"

function LandingPage() {
	// const [email, setEmail] = useState("")
	// const [_isSubmitted, setIsSubmitted] = useState(false)
	const [isPlaying, setIsPlaying] = useState(false)
	const [waveformHeights, setWaveformHeights] = useState<number[]>([])
	const audioRef = useRef<HTMLAudioElement>(null)

	// Generate waveform heights on client side only
	useEffect(() => {
		const heights = Array.from({ length: 40 }, () => Math.random() * 100 + 20)
		setWaveformHeights(heights)
	}, [])

	// const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
	// 	e.preventDefault()
	// 	if (email) {
	// 		setIsSubmitted(true)
	// 		setEmail("")
	// 	}
	// }

	const togglePlay = () => {
		if (!audioRef.current) return
		if (isPlaying) {
			audioRef.current.pause()
		} else {
			audioRef.current.play()
		}
	}

	useEffect(() => {
		const audio = audioRef.current
		if (!audio) return

		const onPlay = () => setIsPlaying(true)
		const onPause = () => setIsPlaying(false)

		audio.addEventListener("play", onPlay)
		audio.addEventListener("pause", onPause)
		audio.addEventListener("ended", onPause)

		return () => {
			audio.removeEventListener("play", onPlay)
			audio.removeEventListener("pause", onPause)
			audio.removeEventListener("ended", onPause)
		}
	}, [])

	return (
		<div className={styles.container}>
			{/* Header */}
			<motion.header
				initial={{ y: -100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.5 }}
				className={styles.header}
			>
				<div className={styles.headerContainer}>

					{/* <Button variant="outline">Get Early Access</Button> */}
				</div>
			</motion.header>

			{/* Hero Section */}
			<section className={styles.heroSection}>
				<div className={styles.heroContainer}>

					<motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className={styles.heroBadge}>
						<Zap className={styles.heroBadgeIcon} />
						Coming Soon!

					</motion.div>
					<div className={styles.logoContainer}>

<Image src="/logo.png" alt="logo" width={600} height={100} />
{/* <span className={styles.logoText}>PODSLICE.ai</span> */}
</div>
					<motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className={styles.heroTitle}>
						Cut the chatter.
						<br />
						<span className={styles.heroTitleGradient}>Keep the insight.</span>
					</motion.h1>

					<motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className={styles.heroSubtitle}>
						Tired of sifting through hours of podcasts for that one golden nugget? Stop drowning in endless chatter and information overload. PODSLICE.ai transforms chaotic audio into crystal-clear,
						actionable knowledge with remarkably human AI voices.
					</motion.p>

					{/* Audio Player Demo */}
					<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} className={styles.audioPlayerDemo}>
						<audio ref={audioRef} src="/podslice-sample.mp3" preload="metadata">
							<track kind="captions" />
						</audio>
						<div className={styles.audioPlayerHeader}>
							<div className={styles.audioPlayerInfo}>
								<Button onClick={togglePlay} size="icon">
									{isPlaying ? <Pause className={styles.playButtonIcon} /> : <Play className={styles.playButtonIcon} />}
								</Button>
								<div>
									<p className={styles.audioPlayerTitle}>Sample Insight Extract</p>
									<p className={styles.audioPlayerSubtitle}>From "The Stuff You Should Know Podcast" - 3 min summary</p>
								</div>
							</div>
							<Volume2 className={styles.volumeIcon} />
						</div>

						{/* Waveform Visualization */}
						<div className={styles.waveformContainer}>
							{waveformHeights.length > 0 &&
								waveformHeights.map((height, i) => (
									<div
										key={i}
										className={`${styles.waveformBar} ${isPlaying ? styles.pulse : ""}`}
										style={{
											height: `${height}%`,
											animationDelay: `${i * 50}ms`,
										}}
									/>
								))}
						</div>
					</motion.div>

					{/* <form onSubmit={handleSubmit} className={styles.waitlistForm}>
						<div className={styles.waitlistInputContainer}>
							<Input type="email" value={email} onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} placeholder="Enter your email for early access" required />
						</div>
						<Button type="submit">
							<span>Join Waitlist</span>
							<ArrowRight className={styles.waitlistButtonIcon} />
						</Button>
					</form>

					{isSubmitted && (
						<div className={styles.submittedMessage}>
							<CheckCircle className={styles.submittedMessageIcon} />
							Thanks! We'll notify you when PODSLICE.ai launches.
						</div>
					)} */}
				</div>
			</section>

			{/* Features Section */}
			<section className={styles.featuresSection}>
				<div className={styles.featuresContainer}>
					<motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className={styles.featuresTitle}>
						Reclaim hours each week
					</motion.h2>

					<div className={styles.featuresGrid}>
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.5 }}
							className={styles.featureCard}
						>
							<div className={styles.featureIconContainer}>
								<Brain className={styles.featureIcon} />
							</div>
							<h3 className={styles.featureCardTitle}>AI-Powered Extraction</h3>
							<p className={styles.featureCardDescription}>
								Our advanced AI identifies and extracts the most valuable insights from hours of podcast content, eliminating the noise and focusing on what matters.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.5, delay: 0.2 }}
							className={styles.featureCard}
						>
							<div className={styles.featureIconContainer} style={{ backgroundImage: "linear-gradient(to right, hsl(var(--primary-gradient-end)), #f97316)" }}>
								<Volume2 className={styles.featureIcon} />
							</div>
							<h3 className={styles.featureCardTitle}>Human-Like Voices</h3>
							<p className={styles.featureCardDescription}>
								Experience remarkably natural AI voices that deliver insights with the clarity and nuance of human speech, making complex ideas easy to understand.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.5, delay: 0.4 }}
							className={styles.featureCard}
						>
							<div className={styles.featureIconContainer} style={{ backgroundImage: "linear-gradient(to right, #f97316, hsl(var(--primary)))" }}>
								<Clock className={styles.featureIcon} />
							</div>
							<h3 className={styles.featureCardTitle}>Instant Access</h3>
							<p className={styles.featureCardDescription}>Get immediate access to key takeaways without hunting through rambling conversations. Transform 3-hour podcasts into 5-minute insights.</p>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Social Proof */}
			{/* <section className={styles.socialProofSection}>
				<div className={styles.socialProofContainer}>
					<h2 className={styles.socialProofTitle}>Trusted by knowledge seekers worldwide</h2>

					<div className={styles.testimonialGrid}>
						<div className={styles.testimonialCard}>
							<div className={styles.testimonialStars}>
								{[...Array(5)].map((_, i) => (
									<Star key={i} className={styles.testimonialStarIcon} />
								))}
							</div>
							<p className={styles.testimonialText}>"Finally, a way to stay on top of the podcast explosion without sacrificing my entire weekend. PODSLICE.ai is exactly what I've been waiting for."</p>
							<div className={styles.testimonialAuthor}>
								<div className={styles.authorAvatar} style={{ backgroundImage: "var(--primary-gradient)" }}></div>
								<div>
									<p className={styles.authorName}>Sarah Chen</p>
									<p className={styles.authorTitle}>Product Manager, TechCorp</p>
								</div>
							</div>
						</div>

						<div className={styles.testimonialCard}>
							<div className={styles.testimonialStars}>
								{[...Array(5)].map((_, i) => (
									<Star key={i} className={styles.testimonialStarIcon} />
								))}
							</div>
							<p className={styles.testimonialText}>"The AI voices are incredibly natural. It feels like having a personal assistant who's listened to every important podcast and can brief me instantly."</p>
							<div className={styles.testimonialAuthor}>
								<div className={styles.authorAvatar} style={{ backgroundImage: "linear-gradient(to right, hsl(var(--primary-gradient-end)), #f97316)" }}></div>
								<div>
									<p className={styles.authorName}>Marcus Rodriguez</p>
									<p className={styles.authorTitle}>Entrepreneur & Investor</p>
								</div>
							</div>
						</div>
					</div>

					<div className={styles.waitlistSocialProof}>
						<p className={styles.waitlistText}>Join 2,500+ people on the waitlist</p>
						<div className={styles.waitlistAvatars}>
							{[...Array(12)].map((_, i) => (
								<div key={i} className={styles.waitlistAvatar} style={{ backgroundImage: "var(--primary-gradient)", marginLeft: i > 0 ? "-8px" : "0" }} />
							))}
						</div>
					</div>
				</div>
			</section> */}

			{/* CTA Section */}
			{/* <section className={styles.ctaSection}>
				<div className={styles.ctaContainer}>
					<h2 className={styles.ctaTitle}>Ready to cut through the noise?</h2>
					<p className={styles.ctaSubtitle}>Be among the first to experience the future of podcast consumption.</p>

					<div className={styles.ctaForm}>
						<Input type="email" placeholder="Your email address" onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
						<Button variant="secondary">
							<Mail className={styles.ctaButtonIcon} />
							<span>Get Notified</span>
						</Button>
					</div>

					<p className={styles.ctaSpamInfo}>No spam, just updates on launch and early access opportunities.</p>
				</div>
			</section> */}

			{/* Footer */}
			<motion.footer initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }} className={styles.footer}>
				<div className={styles.footerContainer}>
					<div className={styles.footerLogoContainer}>
						<div className={styles.footerLogoIconContainer}>
							<Headphones className={styles.footerLogoIcon} />
						</div>
						<span className={styles.footerLogoText}>PODSLICE.ai</span>
					</div>

					{/* <div className={styles.footerLinks}>
						<Link href="#" className={styles.footerLink}>
							Privacy
						</Link>
						<Link href="#" className={styles.footerLink}>
							Terms
						</Link>
						<Link href="#" className={styles.footerLink}>
							Contact
						</Link>
					</div> */}
				</div>

				<div className={styles.footerCopyrightContainer}>
					<p className={styles.footerCopyright}>© 2025 PODSLICE.ai. All rights reserved. Transform your podcast experience.</p>
				</div>
			</motion.footer>
		</div>
	)
}

export default LandingPage
