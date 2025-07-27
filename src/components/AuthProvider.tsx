'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

// Define protected paths that require authentication
const PROTECTED_PATHS = ['/dashboard', '/bookings', '/profile']

// Define auth paths
const AUTH_PATHS = ['/signin', '/signup']

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'loading') return

    const isProtectedPath = PROTECTED_PATHS.some(path => pathname.startsWith(path))
    const isAuthPath = AUTH_PATHS.includes(pathname)

    if (session) {
      // If user is signed in and on an auth page, redirect to dashboard
      if (isAuthPath) {
        router.replace('/dashboard')
      }
    } else if (isProtectedPath) {
      // If user is not signed in and tries to access protected route
      router.replace(`/signin?callbackUrl=${encodeURIComponent(pathname)}`)
    }
  }, [session, status, pathname, router])

  // Only show loading spinner for protected routes
  if (status === 'loading' && PROTECTED_PATHS.some(path => pathname.startsWith(path))) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  return <>{children}</>
}