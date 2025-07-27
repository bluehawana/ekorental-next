import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    console.log("Middleware Check:", {
      path: req.nextUrl.pathname,
      hasToken: !!token,
      email: token?.email
    });
    
    if (!token) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token;
      },
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",  // Protect all dashboard routes
    "/api/protected/:path*",  // Protect API routes
  ],
} 