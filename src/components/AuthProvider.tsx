'use client'

import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster position="top-center" />
    </SessionProvider>
  )
}