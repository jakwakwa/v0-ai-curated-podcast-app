"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Zap } from "lucide-react"
import Link from "next/link"

interface AccessControlProps {
	feature: string
	fallback?: React.ReactNode
	children: React.ReactNode
}

interface SubscriptionData {
	subscription: any
	plan: any
	hasActiveSubscription: boolean
}

export function AccessControl({ feature, fallback, children }: AccessControlProps) {
	const { user, isLoaded } = useUser()
	const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null)
	const [loading, setLoading] = useState(true)
	const [hasAccess, setHasAccess] = useState(false)

	useEffect(() => {
		if (isLoaded && user) {
			fetchSubscriptionData()
		} else if (isLoaded) {
			setLoading(false)
		}
	}, [isLoaded, user])

	const fetchSubscriptionData = async () => {
		try {
			const response = await fetch("/api/subscription")
			if (response.ok) {
				const data = await response.json()
				setSubscriptionData(data)
				
				// Check if user has access to the feature
				const userHasAccess = data.plan?.features?.includes(feature) || false
				setHasAccess(userHasAccess)
			}
		} catch (error) {
			console.error("Error fetching subscription data:", error)
			setHasAccess(false)
		} finally {
			setLoading(false)
		}
	}

	if (!isLoaded || loading) {
		return (
			<div className="animate-pulse">
				<div className="h-32 bg-muted rounded"></div>
			</div>
		)
	}

	if (!user) {
		return (
			<Card className="border-orange-200 bg-orange-50">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-orange-800">
						<Lock className="h-5 w-5" />
						Sign In Required
					</CardTitle>
					<CardDescription className="text-orange-700">
						Please sign in to access this feature.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Button asChild>
						<Link href="/sign-in">Sign In</Link>
					</Button>
				</CardContent>
			</Card>
		)
	}

	if (hasAccess) {
		return <>{children}</>
	}

	if (fallback) {
		return <>{fallback}</>
	}

	return (
		<Card className="border-amber-200 bg-amber-50">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-amber-800">
					<Lock className="h-5 w-5" />
					Premium Feature
				</CardTitle>
				<CardDescription className="text-amber-700">
					This feature requires a {subscriptionData?.plan?.name || "premium"} subscription or higher.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className="text-sm text-amber-700">
					Upgrade your plan to unlock access to "{feature}" and many more premium features.
				</p>
				<div className="flex gap-2">
					<Button asChild>
						<Link href="/pricing">
							<Zap className="mr-2 h-4 w-4" />
							Upgrade Plan
						</Link>
					</Button>
					<Button variant="outline" asChild>
						<Link href="/subscription">
							View Current Plan
						</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}

// Higher-order component for protecting entire pages
export function withAccessControl(
	WrappedComponent: React.ComponentType,
	feature: string,
	fallback?: React.ReactNode
) {
	return function AccessControlledComponent(props: any) {
		return (
			<AccessControl feature={feature} fallback={fallback}>
				<WrappedComponent {...props} />
			</AccessControl>
		)
	}
}

// Hook for checking access programmatically
export function useFeatureAccess(feature: string) {
	const { user, isLoaded } = useUser()
	const [hasAccess, setHasAccess] = useState(false)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (isLoaded && user) {
			checkAccess()
		} else if (isLoaded) {
			setLoading(false)
			setHasAccess(false)
		}
	}, [isLoaded, user, feature])

	const checkAccess = async () => {
		try {
			const response = await fetch("/api/subscription")
			if (response.ok) {
				const data = await response.json()
				const userHasAccess = data.plan?.features?.includes(feature) || false
				setHasAccess(userHasAccess)
			}
		} catch (error) {
			console.error("Error checking feature access:", error)
			setHasAccess(false)
		} finally {
			setLoading(false)
		}
	}

	return { hasAccess, loading, isLoaded }
}
