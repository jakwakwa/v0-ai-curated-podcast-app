import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Only these routes are public - everything else requires authentication
const isPublicRoute = createRouteMatcher([
  "/",           // Landing page
  "/login(.*)",  // Login routes
  "/sign-in(.*)", // Clerk sign-in routes
  "/sign-up(.*)", // Clerk sign-up routes
]);

// Explicitly protect these routes
const isProtectedRoute = createRouteMatcher([
  "/(protected)(.*)", // All protected routes
  "/api/(.*)", // All API routes
  "/dashboard(.*)", // Dashboard routes
  "/curated-bundles(.*)", // Curated bundles routes
  "/notifications(.*)", // Notifications routes
  "/subscription(.*)", // Subscription routes
  "/collections(.*)", // Collections routes
  "/episodes(.*)", // Episodes routes
  "/about(.*)", // About routes
  "/curation-profile-management(.*)", // Curation profile management routes
]);

export default clerkMiddleware((auth, req) => {
  const { pathname } = req.nextUrl;

  // Log the request for debugging
  console.log(`[Middleware] Request to: ${pathname}`);
  console.log(`[Middleware] Clerk Secret Key exists: ${!!process.env.CLERK_SECRET_KEY}`);
  console.log(`[Middleware] Clerk Publishable Key exists: ${!!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}`);

  // Check if it's a protected route
  if (isProtectedRoute(req)) {
    console.log(`[Middleware] Explicitly protecting route: ${pathname}`);
    auth.protect();
    return;
  }

  // Protect all routes except explicitly public ones
  if (!isPublicRoute(req)) {
    console.log(`[Middleware] Protecting route: ${pathname}`);
    auth.protect();
  } else {
    console.log(`[Middleware] Public route: ${pathname}`);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
