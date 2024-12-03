import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isAuth = !!req.nextauth.token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/(auth)');
    const isApiRoute = req.nextUrl.pathname.startsWith('/api');

    // Allow API routes to pass through
    if (isApiRoute) return NextResponse.next();

    // Redirect authenticated users away from auth pages to dashboard
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Allow access to auth pages
    if (isAuthPage) {
      return NextResponse.next();
    }

    // Protect dashboard and booking routes
    if (!isAuth && (req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname.includes('/book'))) {
      const signInUrl = new URL('/(auth)/signin', req.url);
      signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/((?!_next/static|favicon.ico).*)',
  ],
}; 