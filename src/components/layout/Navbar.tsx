'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import Button from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleSignIn = () => {
    router.push('/(auth)/signin')
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              Car Rental
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent">
                Home
              </Link>
              {session && (
                <Link href="/dashboard" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent">
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {session ? (
              <>
                <span className="text-gray-900 mr-4">{session.user?.name || 'User'}</span>
                <Button onClick={() => signOut({ callbackUrl: '/' })}>Sign out</Button>
              </>
            ) : (
              <Button onClick={handleSignIn}>Sign in</Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;
