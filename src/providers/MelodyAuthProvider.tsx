'use client'

import { AuthProvider } from '@melody-auth/react'

interface MelodyAuthProviderProps {
  children: React.ReactNode
}

export default function MelodyAuthProvider({ children }: MelodyAuthProviderProps) {
  return (
    <AuthProvider
      clientId={process.env.NEXT_PUBLIC_MELODY_CLIENT_ID ?? 'default-client-id'}
      redirectUri={process.env.NEXT_PUBLIC_MELODY_REDIRECT_URI ?? 'http://localhost:3000/auth/callback'}
      serverUri={process.env.NEXT_PUBLIC_MELODY_SERVER_URI ?? 'http://localhost:8787'}
      scopes={['openid', 'profile', 'email']}
      storage="localStorage"
      onLoginSuccess={({ locale, state }) => {
        console.log('Login successful:', { locale, state })
      }}
    >
      {children}
    </AuthProvider>
  )
}