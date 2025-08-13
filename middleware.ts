import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isProtectedRoute = createRouteMatcher(["/(protected)(.*)", "/api/(.*)"])
const isInngestRoute = createRouteMatcher(["/api/inngest", "/x/inngest", "/.netlify/functions/inngest", "/.redwood/functions/inngest"])

export default clerkMiddleware(async (auth, req) => {
	// Allow Inngest DevServer and Platform probes without auth
	if (isInngestRoute(req)) {
		return
	}

	if (isProtectedRoute(req)) {
		await auth.protect()
	}
})

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
