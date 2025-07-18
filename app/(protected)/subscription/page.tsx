"use client"

import { useEffect } from "react"
import { useSubscriptionStore } from "@/lib/stores/subscription-store"

export default function SubscriptionPage() {
  // Dummy subscription data
  const dummySubscription = {
    id: "sub_123",
    userId: "user_123",
    linkCustomerId: "link_cust_456",
    linkSubscriptionId: "link_sub_789",
    linkPriceId: "link_price_001",
    status: "active",
    currentPeriodStart: new Date("2024-07-01T00:00:00Z"),
    currentPeriodEnd: new Date("2024-08-01T00:00:00Z"),
    trialStart: new Date("2024-06-24T00:00:00Z"),
    trialEnd: new Date("2024-07-01T00:00:00Z"),
    canceledAt: null,
    createdAt: new Date("2024-06-24T00:00:00Z"),
    updatedAt: new Date("2024-07-10T00:00:00Z"),
  }

  return (
    <div>
      <h1>Subscription Management</h1>
      <p>This page will allow users to manage their subscriptions.</p>
      <div style={{ marginTop: 24, padding: 16, border: '1px solid #eee', borderRadius: 8, maxWidth: 400 }}>
        <h2>Current Subscription</h2>
        <p><strong>Status:</strong> {dummySubscription.status}</p>
        <p><strong>Trial:</strong> {dummySubscription.trialStart.toLocaleDateString()} - {dummySubscription.trialEnd.toLocaleDateString()}</p>
        <p><strong>Current Period:</strong> {dummySubscription.currentPeriodStart.toLocaleDateString()} - {dummySubscription.currentPeriodEnd.toLocaleDateString()}</p>
        <p><strong>Created:</strong> {dummySubscription.createdAt.toLocaleDateString()}</p>
        <p><strong>Last Updated:</strong> {dummySubscription.updatedAt.toLocaleDateString()}</p>
        <p><strong>Link Customer ID:</strong> {dummySubscription.linkCustomerId}</p>
        <p><strong>Link Subscription ID:</strong> {dummySubscription.linkSubscriptionId}</p>
        <p><strong>Link Price ID:</strong> {dummySubscription.linkPriceId}</p>
      </div>
    </div>
  )
}
