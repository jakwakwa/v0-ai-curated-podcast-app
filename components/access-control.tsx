"use client"

import { Protect, useAuth } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Zap } from "lucide-react"
import Link from "next/link"

interface AccessControlProps {
	feature: string
	fallback?: React.ReactNode
	children: React.ReactNode
}

export function AccessControl({ feature, fallback, children }: AccessControlProps) {
	const defaultFallback = (
		<Card className="border-amber-200 bg-amber-50">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-amber-800">
					<Lock className="h-5 w-5" />
					Premium Feature
				</CardTitle>
				<CardDescription className="text-amber-700">
					This feature requires a subscription to access.
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
				</div>
			</CardContent>
		</Card>
	)

	return (
		<Protect
			feature={feature}
			fallback={fallback || defaultFallback}
		>
			{children}
		</Protect>
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

// Hook for checking access programmatically using Clerk's has() method
export function useFeatureAccess(feature: string) {
	const { has, isLoaded } = useAuth()
	
	const hasAccess = has && has({ feature }) || false

	return { hasAccess, loading: !isLoaded, isLoaded }
}
