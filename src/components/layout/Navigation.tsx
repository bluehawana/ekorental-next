'use client';

import Link from 'next/link';
import { ShoppingCart, User, Car } from 'lucide-react';
import { useAuth } from '@melody-auth/react';

export function Navigation() {
  const { isAuthenticated, userInfo, logoutRedirect } = useAuth();

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Car className="w-8 h-8 text-white" />
              <span className="text-xl font-semibold text-white">EkoRental</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative p-2 hover:bg-gray-800 rounded-full transition-colors">
              <ShoppingCart className="w-6 h-6 text-gray-300" />
              <span className="absolute top-0 right-0 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                0
              </span>
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                  {userInfo?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <button 
                  onClick={() => logoutRedirect({ postLogoutRedirectUri: 'http://localhost:3000/' })}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/signin">
                <User className="w-6 h-6 text-gray-300 hover:text-white transition-colors" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 