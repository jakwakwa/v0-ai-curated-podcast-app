"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const EPISODE_LIMIT = 10 // Assuming a limit of 10 for now

export function UsageDisplay() {
    const [usage, setUsage] = useState({ count: 0, limit: EPISODE_LIMIT })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchUsage = async () => {
            try {
                const res = await fetch("/api/account/subscription")
                if (res.ok) {
                    const subscription = await res.json()
                    if (subscription) {
                        setUsage({
                            count: subscription.episode_creation_count,
                            limit: EPISODE_LIMIT, // TODO: This should come from plan data
                        })
                    }
                }
            } catch (error) {
                console.error("Failed to fetch subscription data:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchUsage()
    }, [])

    if (isLoading) {
        return <Skeleton className="h-24 w-full" />
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Episode Usage</CardTitle>
            </CardHeader>
            <CardContent>
                <p>
                    You have used {usage.count} of your {usage.limit} monthly episodes.
                </p>
                {/* TODO: Add a progress bar */}
            </CardContent>
        </Card>
    )
}
