import type { ClerkMiddlewareAuth } from "@clerk/nextjs/server"
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import type { NextRequest } from "next/server"

/**
 * Clerk's system permissions consist of the following:
 *
 * Manage organization (org:sys_profile:manage)
 * Delete organization (org:sys_profile:delete)
 * Read members (org:sys_memberships:read)
 * Manage members (org:sys_memberships:manage)
 * Read domains (org:sys_domains:read)
 * Manage domains (org:sys_domains:manage)
 * Read billing (org:sys_billing:read)
 * Manage billing (org:sys_billing:manage)
 */

// Route matchers for different authorization levels
const isOAuthAccessible = createRouteMatcher(["/oauth(.*)"])
const isMachineTokenAccessible = createRouteMatcher(["/m2m(.*)"])

// Super admin routes (requires admin verification in individual routes)
const isAdminApiAccessible = createRouteMatcher(["/api/admin(.*)"])
const isAdminPageAccessible = createRouteMatcher(["/admin(.*)"])

// Legacy user routes (to be migrated)
const isUserAccessible = createRouteMatcher(["/user(.*)"])
// Authenticated user routes (free/tier1/tier2 users - tier checks in individual routes)
const isUserApiAccessible = createRouteMatcher([
	"/api/account(.*)",
	"/api/curated-bundles(.*)",
	"/api/curated-podcasts(.*)",
	"/api/episodes(.*)",
	"/api/notifications(.*)",
	"/api/paystack(.*)",
	"/api/subscription(.*)",
	"/api/sync-user(.*)",
	"/api/test-auth(.*)",
	"/api/user-curation-profiles(.*)",
])

const isProtectedPageRoute = createRouteMatcher([
	"/(protected)(.*)",
	"/dashboard(.*)",
	"/account(.*)",
	"/collections(.*)",
	"/curated-bundles(.*)",
	"/curation-profile-management(.*)",
	"/episodes(.*)",
	"/notifications(.*)",
	"/subscription(.*)",
])

/**
 * Clerk Middleware
 *
 * Authorization Layers:
 * 1. Public routes - No authentication required (landing, marketing)
 * 2. Free users - Basic auth + can select ONE bundle at a time from free-tagged bundles only
 * 3. Tier 1 users - Basic auth + can select multiple bundles from free-tagged bundles only
 * 4. Tier 2 users - All access + can select multiple bundles from all bundles (free + premium)
 * 5. Super admin - Full system access
 *
 * Protection Strategy:
 * - Middleware ensures Clerk auth context for routes that call auth()
 * - Individual routes check subscription tiers and admin status
 * - Bundle selection limits enforced in bundle selection API/UI logic
 */
export default clerkMiddleware(async (auth: ClerkMiddlewareAuth, req: NextRequest) => {
	// Check if the request matches each route and enforce the corresponding token type
	// Order matters! More specific routes should be checked first

	if (isOAuthAccessible(req)) {
		await auth.protect({ token: "oauth_token" })
	} else if (isAdminApiAccessible(req)) {
		// Admin API routes require session tokens + individual routes check admin status
		await auth.protect()
	} else if (isUserApiAccessible(req)) {
		await auth.protect()
	} else if (isMachineTokenAccessible(req)) {
		await auth.protect({ token: "machine_token" })
	} else if (isUserAccessible(req)) {
		await auth.protect()
	} else if (isAdminPageAccessible(req)) {
		// Admin pages require session tokens + page-level admin checking
		await auth.protect()
	} else if (isProtectedPageRoute(req)) {
		// Protected routes require session tokens
		await auth.protect()
	}
	// Public routes (like landing page) don't require protection
})

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
