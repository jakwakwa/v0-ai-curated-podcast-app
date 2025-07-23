import { AlertCircle, Check, Lock, RefreshCw } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AppSpinner } from "@/components/ui/app-spinner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { TransformedCuratedBundle } from "@/lib/types"
import styles from "./collection-creation-wizard.module.css"

interface CuratedBundleListProps {
	onSelectBundle: (bundleId: string) => void
	selectedBundleId?: string
}

export function CuratedBundleList({ onSelectBundle, selectedBundleId }: CuratedBundleListProps) {
	const [curatedBundles, setCuratedBundles] = useState<TransformedCuratedBundle[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchCuratedBundles = useCallback(async () => {
		try {
			setIsLoading(true)
			setError(null)

			const response = await fetch("/api/curated-bundles")
			if (!response.ok) {
				throw new Error(`Failed to load PodSlice Bundles. Server responded with status ${response.status}.`)
			}

			const data = await response.json()
			setCuratedBundles(data)
		} catch (error) {
			console.error("Error fetching PodSlice Bundles:", error)
			setError(error instanceof Error ? error.message : "An unexpected error occurred while loading PodSlice Bundles.")
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchCuratedBundles()
	}, [fetchCuratedBundles])

	if (isLoading) {
		return (
			<div className={styles.bundleSelection}>
				<div className="flex items-center justify-center min-h-[200px]">
					<AppSpinner size="lg" label="Loading PodSlice Bundles..." />
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className={styles.bundleSelection}>
				<div className="max-w-2xl mx-auto">
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Unable to Load PodSlice Bundles</AlertTitle>
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
			<div className={styles.bundleSelection}>
				<div className="max-w-2xl mx-auto">
					<Alert>
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>No PodSlice Bundles Available</AlertTitle>
						<AlertDescription className="mt-2">There are no PodSlice Bundles available at the moment. Please check back later or contact support if this problem persists.</AlertDescription>
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
		<div className={styles.bundleSelection}>
			<div className={styles.bundleGrid}>
				{curatedBundles.map(bundle => (
					<Card key={bundle.id} className={`${styles.bundleCard} ${selectedBundleId === bundle.id ? styles.selected : ""}`} onClick={() => onSelectBundle(bundle.id)}>
						{bundle.imageUrl && <Image src={bundle.imageUrl} alt={bundle.name} className={styles.bundleImage} width={200} height={200} />}
						<div className={styles.bundleContent}>
							<h3>{bundle.name}</h3>
							<p>{bundle.description}</p>
							<div className={styles.bundlePreview}>
								<h5>Included Podcasts:</h5>
								<ul>
									{bundle.podcasts?.slice(0, 3).map(podcast => (
										<li key={podcast.id}>{podcast.name}</li>
									))}
									{bundle.podcasts && bundle.podcasts.length > 3 && <li>+{bundle.podcasts.length - 3} more</li>}
								</ul>
							</div>
							{selectedBundleId === bundle.id && (
								<div className={styles.selectedIndicator}>
									<Check size={16} />
								</div>
							)}
							<div className={styles.lockedIndicator}>
								<Lock size={12} className={styles.lockIcon} />
								Fixed Selection
							</div>
						</div>
					</Card>
				))}
			</div>
		</div>
	)
}
