import { AlertCircle, Check, Lock, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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

	const fetchCuratedBundles = async () => {
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
	}

	useEffect(() => {
		fetchCuratedBundles()
	}, [])

	if (isLoading) {
		return (
			<div className={styles.bundleSelection}>
				<div className="flex items-center justify-center min-h-[200px]">
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
			<div className={styles.bundleSelection}>
				<div className="max-w-2xl mx-auto">
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
			<div className={styles.bundleSelection}>
				<div className="max-w-2xl mx-auto">
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
		<div className={styles.bundleSelection}>
			<div className={styles.bundleGrid}>
				{curatedBundles.map(bundle => (
					<Card key={bundle.id} className={`${styles.bundleCard} ${selectedBundleId === bundle.id ? styles.selected : ""}`} onClick={() => onSelectBundle(bundle.id)}>
						{bundle.imageUrl && <img src={bundle.imageUrl} alt={bundle.name} className={styles.bundleImage} />}
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
