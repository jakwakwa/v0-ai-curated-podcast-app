import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

console.log("Middleware loaded!")

const isProtectedRoute = createRouteMatcher(["/(protected)(.*)", "/api/(.*)"])
const isInngestRoute = createRouteMatcher(["/api/inngest", "/x/inngest", "/.netlify/functions/inngest", "/.redwood/functions/inngest"])

export default clerkMiddleware(async (auth, req) => {
	console.log("Middleware running for:", req.url)

	// Allow Inngest DevServer and Platform probes without auth
	if (isInngestRoute(req)) {
		return
	}

	if (isProtectedRoute(req)) {
		console.log("Protecting route:", req.url)
		await auth.protect()
	}
})

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
