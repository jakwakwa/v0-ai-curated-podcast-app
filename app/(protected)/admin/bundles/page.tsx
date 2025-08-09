import { Suspense } from "react"
import BundlesPanel from "../_components/BundlesPanel.server"

export const dynamic = "force-dynamic"

export default function BundlesPage() {
  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-6">
      <h1 className="text-2xl font-semibold">Bundle Management</h1>
      <Suspense fallback={<div>Loading bundles…</div>}>
        {/* @ts-expect-error Async Server Component */}
        <BundlesPanel />
      </Suspense>
    </div>
  )
}


