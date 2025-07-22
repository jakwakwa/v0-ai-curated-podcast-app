import { auth } from "@clerk/nextjs/server"

/**
 * Check if the current user has a specific organization role
 */

// TODO: use this in /app/(protected)/admin/page.tsx
export async function hasOrgRole(role: string): Promise<boolean> {
	try {
		const { has } = await auth()
		return has({ role })
	} catch (error) {
		console.error("Error checking organization role:", error)
		return false
	}
}

/**
 * Check if the current user has a specific organization permission
 */

// TODO: use this in /app/(protected)/admin/page.tsx
export async function hasOrgPermission(permission: string): Promise<boolean> {
	try {
		const { has } = await auth()
		return has({ permission })
	} catch (error) {
		console.error("Error checking organization permission:", error)
		return false
	}
}

/**
 * Check if the current user has admin role in the organization
 */

// TODO: use this in /app/(protected)/admin/page.tsx
export async function isOrgAdmin(): Promise<boolean> {
	return hasOrgRole("org:admin")
}

/**
 * Check if the current user has moderator role in the organization
 */

// TODO: use this in /app/(protected)/admin/page.tsx
export async function isOrgModerator(): Promise<boolean> {
	return hasOrgRole("org:moderator")
}

/**
 * Check if the current user has member role in the organization
 */

// TODO: use this in /app/(protected)/admin/page.tsx
export async function isOrgMember(): Promise<boolean> {
	return hasOrgRole("org:member")
}

/**
 * Require a specific organization role or throw an error
 */

// TODO: use this in /app/(protected)/admin/page.tsx
export async function requireOrgRole(role: string): Promise<void> {
	const hasRole = await hasOrgRole(role)
	if (!hasRole) {
		throw new Error(`Organization role '${role}' required`)
	}
}

/**
 * Require a specific organization permission or throw an error
 */

// TODO: use this in /app/(protected)/admin/page.tsx
export async function requireOrgPermission(permission: string): Promise<void> {
	const hasPermission = await hasOrgPermission(permission)
	if (!hasPermission) {
		throw new Error(`Organization permission '${permission}' required`)
	}
}
