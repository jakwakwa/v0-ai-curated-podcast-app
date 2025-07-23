"use client"

import { Database, RefreshCw, Settings } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getDummyDataStatus, logDummyDataStatus } from "@/lib/dummy-data-toggle"

export function DummyDataTogglePanel() {
	const [status, setStatus] = useState(getDummyDataStatus())
	const [isVisible, setIsVisible] = useState(false)

	// Only show in development
	if (process.env.NODE_ENV !== "development") {
		return null
	}

	const handleRefresh = () => {
		setStatus(getDummyDataStatus())
		logDummyDataStatus()
	}

	const toggleVisibility = () => {
		setIsVisible(!isVisible)
	}

	return (
		<div className="fixed bottom-4 right-4 z-50">
			{/* Toggle Button */}
			<Button onClick={toggleVisibility} size="sm" variant="outline" className="mb-2">
				<Settings size={16} />
				Dev Tools
			</Button>

			{/* Panel */}
			{isVisible && (
				<Card className="w-80 shadow-lg">
					<CardHeader className="pb-3">
						<CardTitle className="text-lg flex items-center gap-2">
							<Database size={20} />
							Dummy Data Control
						</CardTitle>
						<CardDescription>Toggle between dummy data and real API calls</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Status Display */}
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">Status:</span>
								<Badge variant={status.isEnabled ? "default" : "secondary"}>{status.status}</Badge>
							</div>

							<div className="text-xs text-muted-foreground">
								<p className="font-medium mb-1">Affected Functions:</p>
								<ul className="list-disc list-inside space-y-1">
									{status.affectedFunctions.map((func, index) => (
										<li key={index}>{func}</li>
									))}
								</ul>
							</div>
						</div>

						{/* Instructions */}
						<div className="p-3 bg-muted rounded-md">
							<p className="text-xs text-muted-foreground">
								<strong>To toggle:</strong> Change <code>USE_DUMMY_DATA</code> in <code>lib/config.ts</code> and refresh the page.
							</p>
						</div>

						{/* Actions */}
						<div className="flex gap-2">
							<Button onClick={handleRefresh} size="sm" variant="outline" className="flex-1">
								<RefreshCw size={14} />
								Refresh Status
							</Button>
							<Button onClick={toggleVisibility} size="sm" variant="outline">
								Close
							</Button>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	)
}
