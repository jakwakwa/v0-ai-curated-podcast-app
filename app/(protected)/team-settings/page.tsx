import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { isOrgAdmin } from "@/lib/organization-roles"
import styles from "./page.module.css"

// Force this page to be dynamic since it uses auth()
export const dynamic = "force-dynamic"

export default async function TeamSettingsPage() {
	// Method 1: Using the auth() helper directly
	const { has } = await auth()

	// Check if the user is authorized using role
	const canManageByRole = has({ role: "org:admin" })

	// Check if the user is authorized using permission
	const canManageByPermission = has({ permission: "org:team_settings:manage" })

	// If user doesn't have the correct permissions, redirect or show access denied
	if (!(canManageByRole || canManageByPermission)) {
		redirect("/unauthorized")
	}

	// Method 2: Using our utility functions (also works)
	const isAdmin = await isOrgAdmin()

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Team Settings</h1>

			<div className={styles.card}>
				<h2 className={styles.cardTitle}>Access Information</h2>
				<div className={styles.grid}>
					<div className={styles.accessItem}>
						<p className={styles.accessLabel}>Role-based access:</p>
						<p className={styles.accessValue}>{canManageByRole ? "✅ Admin access granted" : "❌ Admin access required"}</p>
					</div>
					<div className={styles.accessItem}>
						<p className={styles.accessLabel}>Permission-based access:</p>
						<p className={styles.accessValue}>{canManageByPermission ? "✅ Team settings permission granted" : "❌ Team settings permission required"}</p>
					</div>
					<div className={styles.accessItem}>
						<p className={styles.accessLabel}>Is Organization Admin:</p>
						<p className={styles.accessValue}>{isAdmin ? "✅ Yes" : "❌ No"}</p>
					</div>
					<div className={styles.accessItem}>
						<p className={styles.accessLabel}>Can Manage Team Settings:</p>
						<p className={styles.accessValue}>{isAdmin ? "✅ Yes" : "❌ No"}</p>
					</div>
				</div>
			</div>

			{/* Only show admin features if user has permission */}
			{(canManageByRole || canManageByPermission) && (
				<div className={styles.managementSection}>
					<h2 className={styles.cardTitle}>Team Management</h2>
					<div className={styles.managementContent}>
						<div className={styles.settingGroup}>
							<h3 className={styles.settingTitle}>Organization Settings</h3>
							<Button>Edit Organization Settings</Button>
						</div>

						<div className={styles.settingGroup}>
							<h3 className={styles.settingTitle}>Member Management</h3>
							<div className={styles.buttonGroup}>
								<Button>Invite Members</Button>
								<Button variant="outline">Manage Roles</Button>
							</div>
						</div>

						<div className={styles.settingGroup}>
							<h3 className={styles.settingTitle}>Advanced Settings</h3>
							<Button variant="destructive">Danger Zone</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
