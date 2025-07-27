'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@melody-auth/react'

export default function AuthCallback() {
  const router = useRouter()
  const { isAuthenticated, isAuthenticating } = useAuth()

  useEffect(() => {
    if (!isAuthenticating && isAuthenticated) {
      // Redirect to dashboard after successful authentication
      router.push('/dashboard')
    } else if (!isAuthenticating && !isAuthenticated) {
      // Redirect to signin if authentication failed
      router.push('/signin?error=authentication_failed')
    }
  }, [isAuthenticated, isAuthenticating, router])

  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-[#0A0A1B] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Completing authentication...</p>
        </div>
      </div>
    )
  }

  return null
}