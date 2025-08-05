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

// Create route matchers to identify which token type each route should require
const isOAuthAccessible = createRouteMatcher(["/oauth(.*)"])
const isAdminApiAccessible = createRouteMatcher(["/api/admin(.*)"])
const isMachineTokenAccessible = createRouteMatcher(["/m2m(.*)"])
const isUserAccessible = createRouteMatcher(["/user(.*)"])
const isAdminPageAccessible = createRouteMatcher(["/admin(.*)"])
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
const isProtectedRoute = createRouteMatcher([
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
 * Protection Strategy:
 * 1. Middleware ensures basic authentication for protected routes
 * 2. Individual admin routes call requireOrgAdmin() for granular admin checking
 * 3. Admin UI pages redirect if user lacks proper access
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
	} else if (isProtectedRoute(req)) {
		// Protected routes require session tokens
		await auth.protect()
	}
	// Public routes (like landing page) don't require protection
})

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
