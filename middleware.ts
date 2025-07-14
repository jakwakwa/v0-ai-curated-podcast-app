// middleware.ts
import { auth } from "./auth" // Assuming auth.ts is your NextAuth configuration file
import { NextResponse } from "next/server"

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"], // Example matcher
}

export default auth((req) => {
  const isAuthenticated = !!req.auth // `req.auth` contains the session if authenticated
  const isLoginPage = req.nextUrl.pathname === "/login"

  if (!isAuthenticated && !isLoginPage) {
    // Redirect unauthenticated users to the login page
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // Allow authenticated users or access to the login page
  return NextResponse.next()
})
