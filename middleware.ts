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
const isApiKeyAccessible = createRouteMatcher(["/api(.*)"])
const isMachineTokenAccessible = createRouteMatcher(["/m2m(.*)"])
const isUserAccessible = createRouteMatcher(["/user(.*)"])
const isAdminAccessible = createRouteMatcher(["/admin(.*)"])

/**
 * Clerk Middleware
 * @constructor
 * @param {string} auth - The auth object.
 * @param {string} req - The request object.
 *
 * @returns {boolean} - Returns true if the route the user is trying to visit matches one of the routes passed to it.
 */

/**
 * Clerk config
 * @constructor
 * @property {string} matcher - The matcher object. Always run for API routes
 *
 */
export default clerkMiddleware(async (auth: ClerkMiddlewareAuth, req: NextRequest) => {
	// Check if the request matches each route and enforce the corresponding token type
	if (isOAuthAccessible(req)) await auth.protect({ token: "oauth_token" })
	if (isApiKeyAccessible(req)) await auth.protect({ token: "api_key" })
	if (isMachineTokenAccessible(req)) await auth.protect({ token: "machine_token" })
	if (isUserAccessible(req)) await auth.protect({ token: "session_token" })
	if (isAdminAccessible(req)) await auth.protect({ token: "session_token" })
})

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)", "/((?!_next/static|_next/image|favicon.ico).*)"],
}
