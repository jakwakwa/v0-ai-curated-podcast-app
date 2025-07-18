import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Only these routes are public - everything else requires authentication
const isPublicRoute = createRouteMatcher([
  "/",           // Landing page
  "/login(.*)",  // Login routes
  "/sign-in(.*)", // Clerk sign-in routes
  "/sign-up(.*)", // Clerk sign-up routes
]); 

export default clerkMiddleware((auth, req) => {
  // Protect all routes except explicitly public ones
  if (!isPublicRoute(req)) {
    auth.protect();
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
