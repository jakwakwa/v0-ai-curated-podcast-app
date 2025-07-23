"use client"

import { AlertCircle, Lock, RefreshCw } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { TransformedCuratedBundle } from "@/lib/types"
import styles from "./page.module.css"

export default function CuratedBundlesPage() {
	const [curatedBundles, setCuratedBundles] = useState<TransformedCuratedBundle[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchCuratedBundles = useCallback(async () => {
		try {
			setIsLoading(true)
			setError(null)

			const response = await fetch("/api/curated-bundles")
			if (!response.ok) {
				throw new Error(`Failed to load curated bundles. Server responded with status ${response.status}.`)
			}

			const data = await response.json()
			setCuratedBundles(data)
		} catch (error) {
			console.error("Error fetching curated bundles:", error)
			setError(error instanceof Error ? error.message : "An unexpected error occurred while loading curated bundles.")
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchCuratedBundles()
	}, [fetchCuratedBundles])

	if (isLoading) {
		return (
			<div className={styles.container}>
				<div className="flex items-center justify-center min-h-[400px]">
					<div className="text-center">
						<RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
						<p className="text-muted-foreground">Loading curated bundles...</p>
					</div>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className={styles.container}>
				<div className="max-w-2xl mx-auto mt-8">
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Unable to Load Curated Bundles</AlertTitle>
						<AlertDescription className="mt-2">{error}</AlertDescription>
					</Alert>
					<div className="mt-6 text-center">
						<Button onClick={fetchCuratedBundles} variant="outline">
							<RefreshCw className="h-4 w-4 mr-2" />
							Try Again
						</Button>
					</div>
				</div>
			</div>
		)
	}

	if (curatedBundles.length === 0) {
		return (
			<div className={styles.container}>
				<div className="max-w-2xl mx-auto mt-8">
					<Alert>
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>No Curated Bundles Available</AlertTitle>
						<AlertDescription className="mt-2">There are no curated bundles available at the moment. Please check back later or contact support if this problem persists.</AlertDescription>
					</Alert>
					<div className="mt-6 text-center">
						<Button onClick={fetchCuratedBundles} variant="outline">
							<RefreshCw className="h-4 w-4 mr-2" />
							Refresh
						</Button>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1>Curated Bundles</h1>
				<p>Choose from our pre-curated podcast bundles. Each bundle contains 5 carefully selected shows and cannot be modified once selected.</p>
			</div>

			<div className={styles.bundleGrid}>
				{curatedBundles.map(bundle => (
					<Card key={bundle.id} className={styles.bundleCard}>
						<CardHeader className={styles.cardHeader}>
							{bundle.imageUrl && <Image src={bundle.imageUrl} alt={bundle.name} className={styles.bundleImage} width={200} height={200} />}
							<div className={styles.bundleInfo}>
								<CardTitle className={styles.bundleTitle}>{bundle.name}</CardTitle>
								<CardDescription className={styles.bundleDescription}>{bundle.description}</CardDescription>
								<div className={styles.bundleMeta}>
									<Badge variant="outline" className={styles.podcastCount}>
										{bundle.podcasts.length} Podcasts
									</Badge>
									<div className={styles.lockedIndicator}>
										<Lock size={12} />
										<span>Fixed Selection</span>
									</div>
								</div>
							</div>
						</CardHeader>

						<CardContent className={styles.cardContent}>
							<h4 className={styles.podcastListTitle}>Included Podcasts:</h4>
							<ul className={styles.podcastList}>
								{bundle.podcasts.map(podcast => (
									<li key={podcast.id} className={styles.podcastItem}>
										<div className={styles.podcastInfo}>
											<span className={styles.podcastName}>{podcast.name}</span>
											<p className={styles.podcastDescription}>{podcast.description}</p>
										</div>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	)
}
