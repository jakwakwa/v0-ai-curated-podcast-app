import { NextResponse } from "next/server"
import { auth } from "./auth"
 
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login).*)",
  ],
}

export default auth((req) => {
  const isAuthenticated = !!req.auth
  const isLoginPage = req.nextUrl.pathname === "/login"

  if (!isAuthenticated && !isLoginPage) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }
 
  return NextResponse.next()
})
