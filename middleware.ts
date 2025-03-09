import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define which paths require authentication
const protectedPaths = ["/chat", "/dashboard", "/profile"]

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Check if the path is protected
  if (protectedPaths.some((prefix) => path.startsWith(prefix))) {
    // Get the auth cookie
    const isAuthenticated = request.cookies.get("isAuthenticated")?.value === "true"

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      const url = new URL("/login", request.url)
      url.searchParams.set("from", path)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/chat/:path*", "/dashboard/:path*", "/profile/:path*"],
}

