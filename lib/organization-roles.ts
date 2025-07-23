import { auth } from "@clerk/nextjs/server"

/**
 * Check if the current user has a specific role in their organization
 */
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
 * Check if the current user has a specific permission in their organization
 */
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
 * Enhanced admin check that handles multiple admin role naming conventions
 */
export async function isOrgAdmin(): Promise<boolean> {
	try {
		const { has, orgId, userId } = await auth()

		if (!userId) {
			return false
		}

		if (!orgId) {
			if (process.env.NODE_ENV === "development") {
				const { isAdmin } = await import("@/lib/admin")
				return await isAdmin()
			}
			return false
		}

		const adminRoleVariations = ["org:admin", "Admin", "admin", "org:Admin"]

		for (const roleVariation of adminRoleVariations) {
			if (has({ role: roleVariation })) {
				return true
			}
		}

		return false
	} catch (error) {
		console.error("Error in isOrgAdmin:", error)

		if (process.env.NODE_ENV === "development") {
			try {
				const { isAdmin } = await import("@/lib/admin")
				return await isAdmin()
			} catch (fallbackError) {
				console.error("Fallback admin check also failed:", fallbackError)
			}
		}

		return false
	}
}

/**
 * Require that the current user has a specific role, throw error if not
 */
export async function requireOrgRole(role: string): Promise<void> {
	const hasRole = await hasOrgRole(role)
	if (!hasRole) {
		throw new Error(`Organization role required: ${role}`)
	}
}

/**
 * Require that the current user has a specific permission, throw error if not
 */
export async function requireOrgPermission(permission: string): Promise<void> {
	const hasPermission = await hasOrgPermission(permission)
	if (!hasPermission) {
		throw new Error(`Organization permission required: ${permission}`)
	}
}

/**
 * Require admin role with enhanced error handling and multiple role support
 */
export async function requireOrgAdmin(): Promise<void> {
	const isAdmin = await isOrgAdmin()
	if (!isAdmin) {
		const { orgId } = await auth()
		if (!orgId) {
			throw new Error("Organization admin role required: User must be in an organization context")
		}
		throw new Error("Organization admin role required: Admin access needed")
	}
}
