"use client"

import { useEffect, useState } from "react"
import { CurationDashboard } from "@/components/curation-dashboard"
import { getUserCurationProfile } from "@/lib/data"
import type { UserCurationProfileWithRelations } from "@/lib/types"

export default function CurationProfileManagementPage() {
  const [userCurationProfile, setUserCurationProfile] = useState<UserCurationProfileWithRelations | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const fetchedProfile = await getUserCurationProfile()
        setUserCurationProfile(fetchedProfile)
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
					<p>Loading user curation profile...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-6 p-4">
			<div className="flex items-center justify-between mb-4">
				<h1 className="text-2xl font-bold">Curation Profile Management</h1>
			</div>
			{userCurationProfile ? (
				<CurationDashboard userCurationProfiles={[userCurationProfile]} />
			) : (
				<div className="text-center py-12">
					<h3 className="text-lg font-semibold mb-2">No User Curation Profile Found</h3>
					<p className="text-muted-foreground">
						You haven't created a user curation profile yet. Create one to start managing your podcast curation.
					</p>
				</div>
			)}
		</div>
	)
}
