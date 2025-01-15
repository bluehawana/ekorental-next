'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'

export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <Link href="/" className="navbar-brand">
            EkoRental
          </Link>
          <div className="flex items-center space-x-8">
            <Link href="/cars" className="navbar-link">
              Browse Cars
            </Link>
            {session ? (
              <Link href="/profile" className="navbar-link">
                Profile
              </Link>
            ) : (
              <Link href="/signin" className="navbar-link">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;
