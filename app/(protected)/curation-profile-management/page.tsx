"use client"

import { useUserCurationProfileStore } from "@/lib/stores/user-curation-profile-store"
import { useEffect } from "react"

export default function CurationProfileManagementPage() {
	const userCurationProfileStore = useUserCurationProfileStore()

	useEffect(() => {
		// biome-ignore lint/suspicious/noConsoleLog: <explanation>
		// biome-ignore lint/suspicious/noConsole: <explanation>
		console.log(
			"CurationProfileManagementPage: UserCurationProfile Store Data:",
			userCurationProfileStore.userCurationProfile
		)
	}, [userCurationProfileStore.userCurationProfile])

	return (
		<div>
			<h1>User Curation Profile Management</h1>
			<p>This page will allow users to manage their curation profiles.</p>
			{/* Your UI will go here */}
		</div>
	)
}
