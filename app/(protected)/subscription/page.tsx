"use client"

import { useEffect } from "react"
import { useSubscriptionStore } from "@/lib/stores/subscription-store"

export default function SubscriptionPage() {
  const subscriptionStore = useSubscriptionStore()

  useEffect(() => {
    console.log("SubscriptionPage: Subscription Store Data:", subscriptionStore.subscription)
  }, [subscriptionStore.subscription])

  return (
    <div>
      <h1>Subscription Management</h1>
      <p>This page will allow users to manage their subscriptions.</p>
      {/* Your UI will go here */}
    </div>
  )
} 