"use client"

import { useEffect, useState } from "react"
import { CurationDashboard } from "@/components/curation-dashboard"
import { getUserCurationProfile } from "@/lib/data"
import type { UserCurationProfileWithRelations } from "@/lib/types"

export default function CurationProfileManagementPage() {
  const [userCurationProfiles, setUserCurationProfiles] = useState<UserCurationProfileWithRelations[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const fetchedProfiles = await getUserCurationProfile()
        setUserCurationProfiles(fetchedProfiles)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4" />
          <p>Loading user curation profiles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <CurationDashboard userCurationProfiles={userCurationProfiles} />
    </div>
  )
}
